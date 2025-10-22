# Personal Blog

A personal blogging platform designed for both writers and readers. This system allows authors to easily create, manage, and publish content while giving readers a seamless browsing experience. With features like article categorization, author profiles, and interactive elements such as comments and likes, this platform aims to foster a vibrant community of content creators and consumers.

![Screenshot 2025-10-22 122939](https://github.com/user-attachments/assets/05ee581b-ae40-4b42-be8d-351c7938bb65)

![Screenshot 2025-10-22 143854](https://github.com/user-attachments/assets/f438373c-dd6f-4a53-bd97-e3cd54474754)

## Deployed Website

You can check the project at : https://ponlawat-sangtub-blog.vercel.app/

## Tech Stack

- **React 19** + **Vite**
- **TailwindCSS**
- **React Router**
- **Axios**
- **Express.js**
- **Supabase**
- **Vercel**

## Features

- User authentication (signup, login, reset password)
- User profiles and personalized dashboards
- Create and edit articles with Markdown support
- Category management
- Comments system
- Like/unlike posts
- Admin panel
- Article management dashboard
- Article filtering and pagination
- Responsive design

## Project Structure

```
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Page components (user & admin)
│   │   ├── hooks/          # Custom React hooks
│   │   ├── context/        # React context providers
│   │   ├── services/       # API service layer
│   │   └── utils/          # Utility functions
│   └── dist/               # Production build
│
└── server/                 # Express backend
    ├── controllers/        # Business logic
    ├── routes/             # API routes
    ├── middlewares/        # Validation & auth middleware
    └── utils/              # Helper utilities
```

## Database Schema

<img width="1462" height="730" alt="supabase-schema-njputqqqeyotglgugxbj" src="https://github.com/user-attachments/assets/5827f73d-bca6-457c-a1dd-f81339137a60" />




