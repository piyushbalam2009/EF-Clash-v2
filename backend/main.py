from fastapi import FastAPI, File, UploadFile, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import os
from dotenv import load_dotenv
import google.generativeai as genai
from PIL import Image
import io
import base64
from typing import Optional
from pydantic import BaseModel

# Load environment variables
load_dotenv()

app = FastAPI(title="EF Clash Backend", version="1.0.0")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure Gemini AI
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)
    model = genai.GenerativeModel('gemini-pro-vision')
else:
    model = None
    print("Warning: GEMINI_API_KEY not found. AI verification will be disabled.")

class VerificationResult(BaseModel):
    verified: bool
    winner: Optional[str] = None
    score: Optional[str] = None
    player1_score: Optional[int] = None
    player2_score: Optional[int] = None
    confidence: Optional[float] = None
    reason: Optional[str] = None

@app.get("/")
async def root():
    return {"message": "EF Clash Backend API", "status": "running"}

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "gemini_configured": model is not None,
        "version": "1.0.0"
    }

@app.post("/verifyScreenshot", response_model=VerificationResult)
async def verify_screenshot(
    screenshot: UploadFile = File(...),
    matchId: str = Form(...)
):
    """
    Verify eFootball match screenshot using Gemini AI
    """
    try:
        # Validate file type
        if not screenshot.content_type.startswith('image/'):
            raise HTTPException(status_code=400, detail="File must be an image")
        
        # Read and process image
        image_data = await screenshot.read()
        image = Image.open(io.BytesIO(image_data))
        
        # Convert to RGB if necessary
        if image.mode != 'RGB':
            image = image.convert('RGB')
        
        # If Gemini is not configured, return mock verification
        if not model:
            return VerificationResult(
                verified=True,
                winner="Player1",
                score="2-1",
                player1_score=2,
                player2_score=1,
                confidence=0.95,
                reason="Mock verification (Gemini API not configured)"
            )
        
        # Prepare prompt for Gemini
        prompt = """
        Analyze this eFootball (FIFA/PES) match result screenshot and extract the following information:
        
        1. Is this a valid match result screen? (yes/no)
        2. What are the final scores for both teams/players?
        3. Who is the winner?
        4. Are the team/player names visible?
        
        Please respond in this exact format:
        VALID: [yes/no]
        SCORE: [team1_score]-[team2_score]
        WINNER: [winning_team_name or "Team 1"/"Team 2"]
        PLAYER1: [player1_name or "Unknown"]
        PLAYER2: [player2_name or "Unknown"]
        CONFIDENCE: [0.0-1.0]
        
        If the image is not a valid match result screen, explain why in the REASON field.
        """
        
        try:
            # Generate response using Gemini
            response = model.generate_content([prompt, image])
            ai_response = response.text
            
            # Parse AI response
            lines = ai_response.strip().split('\n')
            parsed_data = {}
            
            for line in lines:
                if ':' in line:
                    key, value = line.split(':', 1)
                    parsed_data[key.strip().upper()] = value.strip()
            
            # Extract verification results
            is_valid = parsed_data.get('VALID', '').lower() == 'yes'
            score_text = parsed_data.get('SCORE', '')
            winner = parsed_data.get('WINNER', '')
            confidence = float(parsed_data.get('CONFIDENCE', '0.5'))
            
            if is_valid and score_text:
                # Parse score
                try:
                    scores = score_text.split('-')
                    if len(scores) == 2:
                        player1_score = int(scores[0])
                        player2_score = int(scores[1])
                        
                        # Determine winner
                        if player1_score > player2_score:
                            winner = parsed_data.get('PLAYER1', 'Player 1')
                        elif player2_score > player1_score:
                            winner = parsed_data.get('PLAYER2', 'Player 2')
                        else:
                            winner = 'Draw'
                        
                        return VerificationResult(
                            verified=True,
                            winner=winner,
                            score=score_text,
                            player1_score=player1_score,
                            player2_score=player2_score,
                            confidence=confidence,
                            reason="Successfully verified match result"
                        )
                except ValueError:
                    pass
            
            return VerificationResult(
                verified=False,
                confidence=confidence,
                reason=parsed_data.get('REASON', 'Could not parse valid match result from screenshot')
            )
            
        except Exception as ai_error:
            print(f"Gemini AI Error: {ai_error}")
            return VerificationResult(
                verified=False,
                reason=f"AI analysis failed: {str(ai_error)}"
            )
    
    except Exception as e:
        print(f"Screenshot verification error: {e}")
        raise HTTPException(status_code=500, detail=f"Verification failed: {str(e)}")

@app.post("/uploadScreenshot")
async def upload_screenshot(
    file: UploadFile = File(...),
    matchId: str = Form(...),
    playerId: str = Form(...)
):
    """
    Upload screenshot for manual review (fallback option)
    """
    try:
        # In a real implementation, you would save this to cloud storage
        # For now, we'll just return a success response
        
        return {
            "success": True,
            "message": "Screenshot uploaded successfully",
            "fileId": f"screenshot_{matchId}_{playerId}",
            "status": "pending_review"
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Upload failed: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
