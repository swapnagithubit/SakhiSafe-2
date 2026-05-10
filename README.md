# 🛡️ SakhiSafe-2

SakhiSafe is a women's safety web application that provides emergency SOS alerts, crime zone awareness, and emergency contact management to help keep women safe.

---

## 🚀 Features

- 🆘 **SOS Alert** — Instantly send emergency SMS alerts via Twilio
- 🗺️ **Crime Zones** — View and report high-risk areas
- 👥 **Emergency Contacts** — Add and manage trusted contacts
- 📊 **Dashboard** — Overview of safety status and activity
- 🔐 **Authentication** — Secure user login and signup
- 🌙 **Theme Support** — Dark/Light mode toggle

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js, TypeScript, Tailwind CSS, shadcn/ui |
| Backend | Node.js, Express.js |
| Database | MongoDB |
| SMS Alerts | Twilio |

---

## 📁 Project Structure

```
SakhiSafe-2/
│
├── backend/                        # Node.js + Express Backend
│   ├── config/
│   │   └── db.js                   # Database connection
│   ├── controllers/
│   │   ├── authController.js       # Login / Signup logic
│   │   ├── contactController.js    # Emergency contacts logic
│   │   ├── crimeController.js      # Crime zone logic
│   │   └── sosController.js        # SOS alert logic
│   ├── middleware/                  # Auth middleware
│   ├── models/
│   │   ├── User.js                 # User model
│   │   ├── Contact.js              # Contact model
│   │   └── SOSLog.js               # SOS log model
│   ├── routes/
│   │   ├── authRoutes.js           # Auth routes
│   │   ├── alertRoutes.js          # Alert routes
│   │   ├── contactRoutes.js        # Contact routes
│   │   ├── crimeRoutes.js          # Crime zone routes
│   │   └── sosRoutes.js            # SOS routes
│   ├── utils/                      # Utility functions
│   ├── server.js                   # Entry point
│   └── .env                        # Environment variables (not pushed)
│
└── sakhifrontend/                  # Next.js Frontend
    ├── app/
    │   ├── dashboard/              # Dashboard page
    │   ├── login/                  # Login page
    │   ├── signup/                 # Signup page
    │   ├── contacts/               # Emergency contacts page
    │   ├── crime-zones/            # Crime zones page
    │   └── page.tsx                # Home page
    ├── components/
    │   ├── ui/                     # shadcn/ui components
    │   ├── hero.tsx
    │   ├── navbar.tsx
    │   ├── footer.tsx
    │   ├── features.tsx
    │   └── sos-button.tsx          # SOS button component
    ├── lib/
    │   ├── auth-context.tsx        # Auth context
    │   └── theme-context.tsx       # Theme context
    ├── hooks/                      # Custom hooks
    └── styles/                     # Global styles
```

---

## ⚙️ Getting Started

### Prerequisites

Make sure you have installed:
- [Node.js](https://nodejs.org/) v18 or above
- [npm](https://www.npmjs.com/) or [pnpm](https://pnpm.io/)
- [MongoDB](https://www.mongodb.com/) (local or Atlas)
- A [Twilio account](https://www.twilio.com/) for SMS alerts

---

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/swapnagithubit/SakhiSafe-2.git
cd SakhiSafe-2
```

---

### 2️⃣ Setup Backend

```bash
cd backend
npm install
```

Create a `.env` file inside the `backend/` folder:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=your_twilio_phone_number
JWT_SECRET=your_jwt_secret_key
```

Start the backend server:

```bash
node server.js
```

✅ Backend runs on **http://localhost:5000**

---

### 3️⃣ Setup Frontend

Open a **new terminal**:

```bash
cd sakhifrontend
npm install
# or
pnpm install
```

Start the frontend:

```bash
npm run dev
# or
pnpm dev
```

✅ Frontend runs on **http://localhost:3000**

---

## 🔗 API Routes

| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/contacts` | Get emergency contacts |
| POST | `/api/contacts` | Add emergency contact |
| DELETE | `/api/contacts/:id` | Delete contact |
| POST | `/api/sos` | Trigger SOS alert |
| GET | `/api/crime` | Get crime zones |
| POST | `/api/crime` | Report crime zone |
| POST | `/api/alert` | Send SMS alert via Twilio |

---

## 🔑 Environment Variables

| Variable | Description |
|----------|-------------|
| `PORT` | Backend server port (default: 5000) |
| `MONGO_URI` | MongoDB connection string |
| `TWILIO_ACCOUNT_SID` | Twilio Account SID |
| `TWILIO_AUTH_TOKEN` | Twilio Auth Token |
| `TWILIO_PHONE_NUMBER` | Twilio Phone Number |
| `JWT_SECRET` | Secret key for JWT authentication |

> ⚠️ Never push your `.env` file to GitHub!

---

## 📸 Screenshots

> *(Add screenshots of your app here)*

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 👩‍💻 Author

**Swapna** — [@swapnagithubit](https://github.com/swapnagithubit)

---

## 📄 License

This project is for educational purposes.

---

> Made with ❤️ for women's safety
