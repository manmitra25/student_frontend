🎓 ManMitra – Student Web Portal
📖 Overview

ManMitra is a student-centric mental health web portal, developed under the Smart India Hackathon 2025 (Problem Statement ID: 25092, Higher Education Dept. J&K). It provides a stigma-free, digital-first mental health companion for college students aged 18–25, helping them navigate challenges such as:

Anxiety, depression, and exam stress

Burnout and academic pressure

Social isolation and adjustment issues

The portal is designed to be lightweight, offline-resilient, and multilingual, ensuring accessibility for students in rural and semi-urban areas of Jammu & Kashmir.

🚀 Key Features
💬 Bestie Chatbot

AI-powered mental health companion

Provides first-aid support, confidential and stigma-free

📖 Journaling & Self-Reflection

Track moods, emotions, and daily reflections

Helps build self-awareness and coping strategies

🧑‍🤝‍🧑 Peer Support

Connect with trained student volunteers

Moderated peer-to-peer support for safe sharing

🧑‍⚕️ Counselor Access

Book sessions with professional counselors

Guided help for students in need

📝 Well-being Tasks

Daily check-ins and mindfulness activities

Progress tracking and motivation nudges

🌐 Multilingual Support

English, Hindi, Urdu, Hinglish, Roman Urdu

📶 Offline Resilience

PWA-ready; works offline and syncs when internet is available

🔔 Reminders & Notifications

Nudges for journaling, tasks, and counseling sessions

🏗️ Tech Stack

Frontend: React + Vite + TypeScript + TailwindCSS

Backend APIs:

backend_manmitra/ – Node.js + MongoDB Atlas

fast_api2/ – FastAPI AI microservice for chatbot & analytics

Authentication: JWT-based (student role)

Other: Socket.io (real-time updates), Supabase (auth experiments), Service Workers (offline caching)

📂 Folder Structure
student_frontend/
│── src/
│   ├── api/            # API services (Axios, REST calls)
│   ├── components/     # UI components
│   │   ├── pages/      # Page-level views (Home, Journal, Chat, etc.)
│   │   ├── shared/     # Shared UI elements
│   │   ├── ui/         # Buttons, forms, modals
│   ├── providers/      # Context providers (auth, theme)
│   ├── guidelines/     # Mental health content & flows
│   ├── styles/         # Tailwind + custom CSS
│   ├── App.tsx         # Root component
│   ├── main.tsx        # Entry point
│── public/             # Static assets
│── package.json
│── vite.config.ts
│── README.md

⚙️ Setup Instructions
Prerequisites

Node.js v18+

npm or yarn

Backend services (backend_manmitra/ + fast_api2/) running

Installation
cd student_frontend
npm install
npm run dev

Environment Variables (.env)
VITE_API_URL=http://localhost:4000        # Node backend
VITE_AI_URL=http://localhost:8000         # FastAPI backend
VITE_AUTH_SECRET=your-secret

Build for Production
npm run build
npm run preview

🔒 Privacy & Safety

Anonymous by default – Students are not forced to reveal identity

No diagnosis – Bestie chatbot provides first-aid support only

Crisis escalation – Nudges students to contact counselor/admin if severe distress is detected

GDPR/HIPAA-inspired compliance – No personal data stored without explicit consent

📈 Roadmap

Offline journaling with auto-sync

Gamified well-being tasks (points/rewards)

Expand peer-support community with moderation tools

Integration with college ERP for opt-in counselor booking

✅ ManMitra empowers students with digital mental health support – anywhere, anytime.
