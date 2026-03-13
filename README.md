# ReWearth 🌿

**Swap Fashion. Save Money. Reduce Waste.**

A full-stack sustainable clothing swap platform with coin-based economy, structured negotiation, OTP confirmation, and Google OAuth.

---

## Project Structure

```
rewearth/
├── frontend/          # Next.js 14 + TypeScript + TailwindCSS
└── backend/           # Python FastAPI + SQLAlchemy
```

---

## Quick Start

### 1. Supabase Setup

1. Create a project at [supabase.com](https://supabase.com)
2. Enable **Google OAuth** under Authentication → Providers
3. Create a storage bucket called `clothing-images` (set to public)
4. Run this SQL in the Supabase SQL editor:

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  supabase_auth_id TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  username TEXT UNIQUE NOT NULL,
  avatar_url TEXT,
  bio TEXT,
  coins INTEGER NOT NULL DEFAULT 120,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Wardrobe items table
CREATE TABLE wardrobe_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(100) NOT NULL,
  size VARCHAR(50) NOT NULL,
  condition VARCHAR(100) NOT NULL,
  image_url TEXT,
  is_available BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Swaps table
CREATE TABLE swaps (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  item_id UUID REFERENCES wardrobe_items(id),
  requester_id UUID REFERENCES users(id),
  owner_id UUID REFERENCES users(id),
  status TEXT NOT NULL DEFAULT 'negotiating',
  coins_deducted BOOLEAN NOT NULL DEFAULT FALSE,
  otp_code VARCHAR(4),
  confirmed_requester BOOLEAN NOT NULL DEFAULT FALSE,
  confirmed_owner BOOLEAN NOT NULL DEFAULT FALSE,
  proposed_time TEXT,
  proposed_location TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Chat messages table
CREATE TABLE chat_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  swap_id UUID REFERENCES swaps(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES users(id),
  message_type TEXT NOT NULL,
  payload TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

### 2. Backend Setup

```bash
cd rewearth/backend

# Create virtualenv
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env with your Supabase credentials

# Run the API
uvicorn main:app --reload --port 8000
```

API docs available at: http://localhost:8000/docs

---

### 3. Frontend Setup

```bash
cd rewearth/frontend

# Install dependencies
npm install

# Configure environment
cp .env.local.example .env.local
# Edit .env.local with your Supabase credentials

# Run the dev server
npm run dev
```

Open: http://localhost:3000

---

## Environment Variables

### Backend `.env`
```
DATABASE_URL=postgresql://postgres:[PASSWORD]@db.[PROJECT_REF].supabase.co:5432/postgres
SUPABASE_URL=https://[PROJECT_REF].supabase.co
SUPABASE_KEY=[ANON_KEY]
SUPABASE_SERVICE_KEY=[SERVICE_ROLE_KEY]
```

### Frontend `.env.local`
```
NEXT_PUBLIC_SUPABASE_URL=https://[PROJECT_REF].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[ANON_KEY]
NEXT_PUBLIC_API_URL=http://localhost:8000
```

---

## Features

| Feature | Description |
|---|---|
| 🔐 Google Sign-In | Supabase OAuth with automatic user profile creation |
| 👗 Digital Wardrobe | Instagram-style 3-column grid profile |
| 🛍️ Marketplace | Browse all available items with filters |
| 💬 Structured Chat | 10 predefined message types, no free text |
| 🪙 Coin System | 120 starting coins, 20 per swap, validated before deduction |
| 📅 Swap Scheduling | Propose time & location via structured messages |
| 🔐 OTP Confirmation | 4-digit OTP for physical swap confirmation |
| 🌿 Green Alternatives | Curated sustainable fashion brands |

## Swap State Machine

```
negotiating → agreed → scheduled → pending_confirmation → completed
                                                       ↘ cancelled
```

---

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/users/` | Create or get user |
| GET | `/users/me/{auth_id}` | Get current user |
| GET | `/users/{username}` | Get public profile |
| GET | `/users/{username}/wardrobe` | Get user's items |
| GET | `/items/` | List marketplace items |
| GET | `/items/{id}` | Get item details |
| POST | `/items/` | Create item |
| POST | `/items/upload-image` | Upload image to Supabase Storage |
| POST | `/swaps/` | Create swap request |
| GET | `/swaps/{id}` | Get swap details |
| POST | `/swaps/{id}/message` | Send structured message |
| POST | `/swaps/{id}/verify-otp` | Verify OTP to complete swap |
