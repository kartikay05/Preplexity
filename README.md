# 🤖 Perplexity

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Visit%20Site-blue?style=flat)](https://preplexity.onrender.com/)
[![Node.js](https://img.shields.io/badge/Node.js-v18+-green?style=flat-square&logo=node.js)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-19.1-blue?style=flat-square&logo=react)](https://react.dev/)
[![MongoDB](https://img.shields.io/badge/MongoDB-9.3-green?style=flat-square&logo=mongodb)](https://www.mongodb.com/)
[![License](https://img.shields.io/badge/License-ISC-blue?style=flat-square)](LICENSE)

> A full-stack MERN AI Chatbot application with **AI integrations**, **web scraping**, **real-time messaging**, and **email notifications**.

---

## ✨ Features

- 🔐 **User Authentication** — Secure JWT-based auth with bcryptjs
- 💬 **Real-time Chat** — Socket.io for instant messaging
- 🧠 **AI-Powered Responses** — LangChain with multiple AI providers
- 🌐 **Web Scraping & Search** — Content extraction and web search integration
- 📧 **Email Notifications** — SendinBlue integration
- 🎨 **Modern UI** — Responsive design with Tailwind CSS

---

## 🛠 Tech Stack

| **Layer** | **Technology** |
|-----------|---|
| **Frontend** | React 19, Vite, Tailwind CSS, Redux Toolkit |
| **Backend** | Node.js, Express, Socket.io, MongoDB/Mongoose |
| **AI & Services** | LangChain, Cheerio, Axios |

---

## 📂 Project Structure

```
Perplexity/
├── Backend/
│   ├── src/
│   │   ├── config/       # Database & configuration
│   │   ├── controller/   # Route handlers
│   │   ├── models/       # MongoDB schemas
│   │   ├── routes/       # API endpoints
│   │   ├── services/     # Business logic & AI
│   │   ├── middlewares/  # Auth & validation
│   │   └── sockets/      # Real-time events
│   └── server.js
└── Frontend/
    └── src/
        ├── app/         # Store, router, theme
        ├── features/    # Auth, chat modules
        └── pages/       # Views
```

---

## 🚀 Quick Start

**Prerequisites:** Node.js v18+ and npm

### Backend Setup

```bash
cd Backend
npm install
npm run dev      # Runs on http://localhost:5000
```

### Frontend Setup

```bash
cd Frontend
npm install
npm run dev      # Runs on http://localhost:5173
```

### Build for Production

```bash
cd Frontend
npm run build     # Creates optimized build
npm run preview   # Preview production build
```

---

## 🔧 Environment Variables

Create a `.env` file in the `Backend/` directory:

```env
# Database
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/perplexity

# Auth
JWT_SECRET=your_super_secret_key

# Server
PORT=5000

# AI Services
OPENAI_API_KEY=sk-...
MISTRAL_API_KEY=...

# Email
SIB_API_KEY=your_sendinblue_key
```

---

## 📋 Available Scripts

### Backend
- `npm run dev` — Start development server with nodemon

### Frontend
- `npm run dev` — Start Vite dev server
- `npm run build` — Build for production
- `npm run lint` — Run ESLint
- `npm run preview` — Preview production build

---

## 🌍 Deployment

**Live at:** [Click](https://preplexity.onrender.com/)

Deployed on Render with MongoDB Atlas.

---

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Fork the repository
- Create a feature branch (`git checkout -b feature/amazing-feature`)
- Commit changes (`git commit -m 'Add amazing feature'`)
- Push to branch (`git push origin feature/amazing-feature`)
- Open a Pull Request

---

## 📝 License

This project is licensed under the ISC License — see the [LICENSE](LICENSE) file for details.

---

## 💡 Support

For any questions or support, feel free to reach out via email:  
📧 [bhardwajkartikay489@gmail.com](mailto:bhardwajkartikay489@gmail.com)
