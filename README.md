# EF Clash - eFootball Tournament Platform

A modern Progressive Web App (PWA) for managing eFootball tournaments with AI-powered match verification.

## 🚀 Features

- **Modern UI/UX**: Dark theme with neon cyan and purple highlights
- **Authentication**: Supabase Auth with email/password and Google OAuth
- **Tournament Management**: Create and manage competitive tournaments
- **AI Verification**: Gemini AI-powered screenshot verification for match results
- **Real-time Updates**: Live tournament brackets and match tracking
- **PWA Support**: Installable on mobile devices, works offline
- **Responsive Design**: Mobile-first approach with smooth animations

## 🛠 Tech Stack

### Frontend
- **React 18** with Vite bundler
- **Chakra UI** for component library
- **Framer Motion** for animations
- **React Router** for navigation
- **Supabase** for authentication and database

### Backend
- **FastAPI** for REST API
- **Google Gemini AI** for screenshot verification
- **Python 3.8+** with async support

### PWA Features
- Service Worker for offline caching
- Web App Manifest for installability
- Push notifications support
- Responsive design

## 📦 Installation

### Prerequisites
- Node.js 18+ and npm
- Python 3.8+
- Supabase account
- Google AI Studio account (for Gemini API)

### Frontend Setup

1. **Install dependencies:**
```bash
npm install
```

2. **Environment Configuration:**
```bash
cp .env.example .env
```

Edit `.env` with your Supabase credentials:
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_API_URL=http://localhost:8000
```

3. **Start development server:**
```bash
npm run dev
```

### Backend Setup

1. **Navigate to backend directory:**
```bash
cd backend
```

2. **Create virtual environment:**
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. **Install dependencies:**
```bash
pip install -r requirements.txt
```

4. **Environment Configuration:**
```bash
cp .env.example .env
```

Edit `.env` with your API keys:
```env
GEMINI_API_KEY=your_gemini_api_key
HOST=0.0.0.0
PORT=8000
DEBUG=True
```

5. **Start FastAPI server:**
```bash
python main.py
```

## 🗄 Database Setup (Supabase)

### Required Tables

```sql
-- Users table (extends Supabase auth.users)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE,
  username TEXT UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (id)
);

-- Tournaments table
CREATE TABLE tournaments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  creator_id UUID REFERENCES profiles(id),
  max_participants INTEGER DEFAULT 32,
  current_participants INTEGER DEFAULT 0,
  prize_pool DECIMAL(10,2),
  status TEXT DEFAULT 'registering',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  started_at TIMESTAMP WITH TIME ZONE,
  ended_at TIMESTAMP WITH TIME ZONE
);

-- Tournament participants
CREATE TABLE tournament_participants (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tournament_id UUID REFERENCES tournaments(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(tournament_id, user_id)
);

-- Matches table
CREATE TABLE matches (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tournament_id UUID REFERENCES tournaments(id) ON DELETE CASCADE,
  player1_id UUID REFERENCES profiles(id),
  player2_id UUID REFERENCES profiles(id),
  winner_id UUID REFERENCES profiles(id),
  player1_score INTEGER,
  player2_score INTEGER,
  status TEXT DEFAULT 'pending',
  round_number INTEGER,
  match_number INTEGER,
  scheduled_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Match screenshots for verification
CREATE TABLE match_screenshots (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  match_id UUID REFERENCES matches(id) ON DELETE CASCADE,
  uploaded_by UUID REFERENCES profiles(id),
  file_url TEXT NOT NULL,
  verification_status TEXT DEFAULT 'pending',
  ai_confidence DECIMAL(3,2),
  verified_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User statistics
CREATE TABLE user_stats (
  user_id UUID REFERENCES profiles(id) PRIMARY KEY,
  total_matches INTEGER DEFAULT 0,
  wins INTEGER DEFAULT 0,
  losses INTEGER DEFAULT 0,
  draws INTEGER DEFAULT 0,
  goals_scored INTEGER DEFAULT 0,
  goals_conceded INTEGER DEFAULT 0,
  tournaments_won INTEGER DEFAULT 0,
  current_streak INTEGER DEFAULT 0,
  best_streak INTEGER DEFAULT 0,
  total_points INTEGER DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Row Level Security (RLS)

Enable RLS and create policies for secure data access:

```sql
-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE tournaments ENABLE ROW LEVEL SECURITY;
ALTER TABLE tournament_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE match_screenshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_stats ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Public profiles are viewable by everyone" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Tournaments policies
CREATE POLICY "Tournaments are viewable by everyone" ON tournaments FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create tournaments" ON tournaments FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Add more policies as needed...
```

## 🎮 Usage

### Creating a Tournament
1. Sign in to your account
2. Navigate to Tournaments page
3. Click "Create Tournament"
4. Fill in tournament details
5. Wait for players to join

### Joining a Tournament
1. Browse available tournaments
2. Click "Join" on an open tournament
3. Wait for tournament to start

### Reporting Match Results
1. Complete your eFootball match
2. Take a screenshot of the result screen
3. Upload screenshot in the match reporting section
4. AI will verify the result automatically

### Viewing Leaderboards
- Global leaderboard shows top players
- Tournament-specific leaderboards
- Real-time ranking updates

## 📱 PWA Installation

### On Mobile (Android/iOS)
1. Open the app in your mobile browser
2. Look for "Add to Home Screen" prompt
3. Follow the installation steps
4. App will be available as a native-like experience

### On Desktop
1. Open the app in Chrome/Edge
2. Click the install icon in the address bar
3. Follow the installation prompt

## 🚀 Deployment

### Frontend (Netlify/Vercel)
```bash
npm run build
# Deploy the dist/ folder
```

### Backend (Oracle Cloud/DigitalOcean)
```bash
# Using Docker
docker build -t ef-clash-backend .
docker run -p 8000:8000 ef-clash-backend

# Or using systemd service
sudo systemctl enable ef-clash-backend
sudo systemctl start ef-clash-backend
```

### Environment Variables for Production
- Set up proper CORS origins
- Use production Supabase keys
- Configure proper API endpoints
- Set up SSL certificates

## 🔧 API Endpoints

### Screenshot Verification
```
POST /verifyScreenshot
Content-Type: multipart/form-data

Parameters:
- screenshot: Image file
- matchId: String
```

### Health Check
```
GET /health
```

## 🎨 Customization

### Theme Colors
Edit `src/theme/index.js` to customize:
- Brand colors (neon cyan: #00FFFF)
- Purple accents (#8B5CF6)
- Background colors (#0D1117)

### Fonts
- Heading: 'Orbitron' (futuristic)
- Body: 'Exo 2' (modern sans-serif)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For issues and questions:
- Create an issue on GitHub
- Check the documentation
- Join our Discord community

## 🔮 Future Features

- [ ] Live streaming integration
- [ ] Voice chat during matches
- [ ] Advanced analytics dashboard
- [ ] Mobile app (React Native)
- [ ] Blockchain-based rewards
- [ ] VR tournament viewing
