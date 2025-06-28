# 🩺 DoctorSewa – Role-Based Medical Appointment Booking Platform

DoctorSewa is a full-stack medical appointment platform that enables patients to seamlessly book appointments, doctors to manage their availability and approvals, and admins to onboard new doctors and control system-wide availability. It follows a **role-based architecture** (User, Doctor, Admin) and offers a production-grade UI designed via **Figma**, prioritizing **mobile-first accessibility** and real-time workflows.

---

## 🚀 Live Demo

🔗 [User Panel](https://doctorsewa.vercel.app/)
🔗 [Admin Panel](https://admin-doctorsewa.vercel.app/)

---

## 🎨 UI Design & Prototype

- [📐 Figma Design](https://www.figma.com/design/pkVlIljjezVgGI9xEeB7kn/DoctorSewa---UI-Design?node-id=0-1&t=iST0Gy5onu1Imj88-1)
- [🔁 Figma Prototype](https://www.figma.com/proto/pkVlIljjezVgGI9xEeB7kn/DoctorSewa---UI-Design?node-id=0-1&t=iST0Gy5onu1Imj88-1)

---

## 🧠 Tech Stack

| Layer            | Technologies Used                   |
| ---------------- | ----------------------------------- |
| **Frontend**     | React.js, Tailwind CSS              |
| **Backend**      | Node.js, Express.js                 |
| **Database**     | MongoDB, Mongoose                   |
| **Auth**         | Clerk (OAuth + JWT), bcrypt         |
| **Payments**     | Stripe, Razorpay                    |
| **Media Upload** | Cloudinary                          |
| **Design Tools** | Figma (UI & Prototyping)            |
| **Deployment**   | Vercel (Frontend), Render (Backend) |

---

## 🌟 Key Features

### 🔐 Clerk Authentication (OAuth + JWT)

- Seamless user sign-in via **Clerk**, including Google OAuth support
- Backend protected with Clerk middleware for session-based access control

### 🧑‍⚕️ Role-Based Dashboards

- **User Role:** Book appointments, browse doctors by specialty, make secure payments
- **Doctor Role:** Approve/decline appointments, manage availability slots
- **Admin Role:** Onboard new doctors, toggle availability, monitor appointments

### 💳 Integrated Payments

- Secure online transactions via **Stripe** and **Razorpay**
- Dynamic amount calculation, confirmation status, and real-time transaction feedback

### ☁️ Media Storage with Cloudinary

- Doctor profile pictures uploaded securely and optimized using Cloudinary API

### 🧠 Smart APIs & Filtering

- RESTful APIs built with **Express.js** supporting:
  - Specialty-based doctor search
  - Role-based resource access
  - Real-time status updates for appointments

### 📱 Mobile-First UX

- Pixel-perfect UI designed in **Figma**, developed using **Tailwind CSS**
- Fully responsive layout ensuring optimal experience across all devices

---

## 📦 Getting Started

### ✅ Prerequisites

- Node.js ≥ 18.x
- MongoDB Atlas account
- Clerk Project (Frontend + Backend API Keys)
- Stripe + Razorpay Developer Keys
- Cloudinary Account

---

### 🔐 Default Admin Credentials

You can use the following admin credentials to test the **Admin Panel**:

- Email: admin@doctorsewa.com
- Password: qwerty123

## ⚙️ Installation Instructions

> 💡 Use **three separate terminals** to run `frontend`, `backend`, and `admin panel`.

### 📁 Clone the Repo

```bash
git clone https://github.com/arbin-mahato/CAPSTONE-DoctorSewa.git
cd DoctorSewa
```

---

### 1️⃣ Start the Frontend (User App)

```bash
cd frontend
npm install
npm run dev
```

> 🌐 App runs on `http://localhost:5173`

---

### 2️⃣ Start the Backend (Open a new terminal)

```bash
cd DoctorSewa
cd backend
npm install
npm run dev
```

> 🚀 API runs on `http://localhost:5000`

---

### 3️⃣ Start the Admin Panel (Open another terminal)

```bash
cd DoctorSewa
cd admin
npm install
npm run dev
```

> 🧑‍⚕️ Admin Panel runs on `http://localhost:5174`

---

## ✅ Environment Variables

Create a `.env` file in both `backend` and `frontend/admin` as needed.

### Backend `.env` sample

```env
PORT=5000
MONGO_URI=your_mongodb_url
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_secret
STRIPE_SECRET_KEY=your_stripe_key
RAZORPAY_KEY_ID=your_razorpay_id
RAZORPAY_SECRET=your_razorpay_secret
CLERK_SECRET_KEY=your_clerk_secret_key
```

---

## 🤝 Contributing

We welcome contributions from developers, designers, and product thinkers!

1. Fork the repo
2. Create a new branch (`git checkout -b feature/YourFeature`)
3. Commit your changes
4. Push and create a PR

---

## 👨‍💻 Author

**Arbin Mahato**
🔗 [LinkedIn](https://www.linkedin.com/in/arbin-mahato/) | [GitHub](https://github.com/arbin-mahato)

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

## ✨ Credits

Designed in [Figma](https://www.figma.com/design/pkVlIljjezVgGI9xEeB7kn/DoctorSewa---UI-Design) with ❤️  
Developed by [Arbin Mahato](https://github.com/arbin07)  
Part of the **Kalvium** Academic Project
