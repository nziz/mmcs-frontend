 MMCSS — Mobile Money Credit Scoring System (Frontend)

A React-based frontend for a fintech credit scoring platform built to improve financial inclusion in Rwanda. This application connects to a Django REST API backend to deliver individual scoring, batch processing, applicant portals, and admin dashboards for mobile money lenders.

Tech Stack

- React — UI framework
- React Router DOM— Client-side routing
- Axios** — HTTP client with JWT refresh logic
- Recharts — Data visualization (score trends, tier distribution)
- Inline Styles — Component-level styling (no CSS-in-JS library)
- jsPDF / html2canvas — PDF report generation
- docx / file-saver — Word document export

 Project Structure
src/
├── App.js              # Main router: Dashboard, Admin, Scoring, Portal, Auth
├── api/
│   ├── apiConfig.js    # Axios instance with JWT interceptors & refresh
│   └── api.js          # API calls: auth, applicants, scoring, institutions
├── pages/
│   ├── Dashboard.js          # Admin overview with stats & charts
│   ├── AdminPanel.js         # User & rule management
│   ├── ScoreIndividual.js    # Single applicant scoring + PDF/Word export
│   ├── ScoreBatch.js         # Bulk scoring from CSV/upload
│   ├── ScoreHistory.js       # Historical score records with detail view
│   ├── ApplicantPortal.js    # Self-service portal for applicants
│   ├── ApplicantHistory.js   # Applicant's own score history
│   ├── ApplicantRegister.js  # New applicant registration with OTP
│   └── Login.js              # JWT authentication
├── components/         # (Add if you have reusable components)
└── theme.js            # Dark/light mode theming


 Key Features

| Feature | Description |
|---------|-------------|
| **JWT Authentication** | Secure login with token refresh & automatic logout |
| **OTP Verification** | SMS/Email OTP for applicant registration |
| **Individual Scoring** | Real-time credit score with 5-tier risk classification |
| **Batch Scoring** | Upload CSV/process multiple applicants at once |
| **Score History** | Filterable, sortable records with Recharts visualization |
| **PDF/Word Export** | Generate downloadable reports for lenders |
| **Applicant Portal** | Self-service profile & document upload for borrowers |
| **Admin Dashboard** | Institution stats, scoring rules, user management |
| **Theme Toggle** | Dark/light mode with persistent preference |

 Backend

This frontend connects to a Django REST API:

- **Backend Repo:"" https://github.com/nziz/mmcss-backend""
- **API Base URL: `http://127.0.0.1:8000` (local development)

Backend features:
- Django REST Framework
- PostgreSQL database
- Custom credit scoring engine (`CreditScoringEngine`)
- MoMo statement parsing & metric calculation
- Admin panels for all models

 Quick Start

```bash
# Clone the repo
git clone https://github.com/nziz/mmcs-frontend.git
cd mmcs-frontend

# Install dependencies
npm install

# Start development server
npm start

The app runs on http://localhost:3000 and expects the backend at http://127.0.0.1:8000.

What I Learned

Building complex multi-role UIs (admin vs. applicant vs. loan officer)
Handling JWT token refresh without page reloads
Generating client-side PDFs and Word documents from React
Designing inline style systems for maintainable theming
Integrating chart libraries for financial data visualization
Future Improvements
[ ] Add unit tests for API layer
[ ] Migrate to TypeScript
[ ] Implement real-time notifications (WebSockets)
[ ] Add PWA support for offline access
[ ] Internationalization (English / French / Kinyarwanda)

 License
MIT

 Author
Aime Octave Nziza
BSc Business Information & Technology, University of Kigali
Kigali, Rwanda
LinkedIn | nziza1999@gmail.com
