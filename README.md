<div align="center">

# 🌐 Social Media App

### A modern, fast, and fully responsive social platform built with **Angular 19**

![Angular](https://img.shields.io/badge/Angular-19-DD0031?style=for-the-badge&logo=angular&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Bootstrap](https://img.shields.io/badge/Bootstrap-5-7952B3?style=for-the-badge&logo=bootstrap&logoColor=white)
![Flowbite](https://img.shields.io/badge/Flowbite-UI-1C64F2?style=for-the-badge)
![Dark Mode](https://img.shields.io/badge/Dark_Mode-Supported-0B0F19?style=for-the-badge)

[Live Demo](#) · [Report a Bug](../../issues) · [Request a Feature](../../issues)

</div>

---

## ✨ Overview

**Social Media App** is a full-featured front-end social platform where users can sign up, share posts, comment, save content, manage their profile, and stay updated with notifications, all wrapped in a clean purple-to-pink brand identity with **light and dark themes**.

The project is built with scalability in mind: standalone components, a clear `core / features / layouts / shared` architecture, and a solid HTTP layer powered by interceptors.

---

## 🚀 Features

| | Feature | Description |
|---|---|---|
| 🔐 | **Authentication** | Register, login, and forgot-password flows with token-based auth |
| 🛡️ | **Route Guards** | `authGuard` protects private pages, `guestGuard` keeps logged-in users out of auth pages |
| 📰 | **Feed** | A three-column feed with a left sidebar, a posts area, and a right sidebar |
| 💬 | **Comments** | Dedicated comments component with its own service and models |
| 📝 | **Post Details** | A focused page for a single post and its discussion |
| 🗂️ | **My Posts** | Manage everything you've published in one place |
| 🔖 | **Saved Posts** | Bookmark posts and come back to them later |
| 👤 | **Profile** | Profile page powered by a dedicated `ProfileService` |
| 🔔 | **Notifications** | Notifications page backed by its own service |
| 🌗 | **Dark / Light Mode** | Theme switching via `ThemeService` and Tailwind's `class` strategy |
| ⏱️ | **Time-Ago Pipe** | Friendly relative timestamps (e.g. "5 minutes ago") |
| 🧭 | **404 Page** | Custom page-not-found experience |
| 🌍 | **RTL Friendly** | Poppins + Cairo fonts for Latin and Arabic text |

---

## 🧠 HTTP Layer (Interceptors)

All network behavior is handled centrally in `core/interceptors`:

- **`header-interceptor`**: attaches the auth token to every request
- **`loading-interceptor`**: toggles global loading state
- **`success-interceptor`**: handles success feedback
- **`error-interceptor`**: handles errors globally, including `401` responses

---

## 🛠️ Tech Stack

- **Framework:** Angular 19 (standalone components)
- **Language:** TypeScript
- **Styling:** Tailwind CSS + Bootstrap
- **UI Components:** Flowbite
- **Fonts:** Poppins & Cairo
- **State of Auth:** Token stored client-side and verified by guards
- **Testing:** Unit test specs for components, services, and guards

---

## 📁 Project Structure

```
src/
├── app/
│   ├── core/
│   │   ├── auth/
│   │   │   ├── guards/          # auth-guard, guest-guard
│   │   │   └── services/        # auth.service, theme.service
│   │   ├── interceptors/        # header, loading, success, error
│   │   ├── models/              # post.interface
│   │   └── services/            # post.service
│   │
│   ├── features/
│   │   ├── details/             # Single post view
│   │   ├── feed/
│   │   │   ├── feed-content/
│   │   │   │   └── components/comments/
│   │   │   ├── left-side/
│   │   │   └── right-side/
│   │   ├── forget-password/
│   │   ├── login/
│   │   ├── my-posts/
│   │   ├── notifications/
│   │   ├── page-not-found/
│   │   ├── profile/
│   │   ├── register/
│   │   └── saved/
│   │
│   ├── layouts/
│   │   ├── auth-layout/         # Login / Register wrapper
│   │   └── main-layout/         # App shell + navbar
│   │
│   ├── shared/
│   │   ├── pipes/               # time-ago pipe
│   │   └── ui/
│   │
│   ├── app.config.ts
│   ├── app.routes.ts
│   └── app.ts
│
├── environment/
├── index.html
├── main.ts
└── styles.css
```

---

## 🎨 Design System

A custom Tailwind theme with a signature brand identity:

| Token | Colors |
|---|---|
| **brand.purple** | `#AFA9EC` · `#7F77DD` · `#534AB7` |
| **brand.pink** | `#F0997B` · `#D4537E` · `#993556` |
| **brand.amber** | `#EF9F27` · `#BA7517` |
| **Gradient** | `135deg` · `#7F77DD → #D4537E` |

Plus custom utilities like `rounded-card`, `rounded-pill`, `shadow-card`, and `bg-brand-gradient`.

---

## ⚡ Getting Started

### Prerequisites

- **Node.js** 18.19+ (or 20+)
- **npm**
- **Angular CLI v19**

```bash
npm install -g @angular/cli@19
```

> 💡 Make sure your global Angular CLI version matches the project version (v19) to avoid file naming and generator inconsistencies.

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/<your-username>/Social-Media-App.git

# 2. Move into the project
cd Social-Media-App

# 3. Install dependencies
npm install

# 4. Start the dev server
ng serve
```

Then open **http://localhost:4200** 🎉

### Environment Setup

Update the API base URL in:

```
src/environment/environment.development.ts
src/environment/environment.ts
```

```ts
export const environment = {
  baseUrl: 'YOUR_API_BASE_URL',
};
```

---

## 📜 Available Scripts

| Command | What it does |
|---|---|
| `ng serve` | Runs the app in development mode |
| `ng build` | Builds the app for production into `dist/` |
| `ng test` | Runs unit tests |
| `ng test --code-coverage` | Runs tests and generates a coverage report |

---

## 🗺️ Roadmap

- [x] Authentication with guards and interceptors
- [x] Feed with comments
- [x] Saved posts and my posts
- [x] Profile and notifications
- [x] Dark mode
- [ ] Real-time notifications
- [ ] Image uploads and previews
- [ ] Infinite scroll
- [ ] Multi-language support (EN / AR)

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

1. Fork the project
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m "feat: add amazing feature"`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

---

## 👨‍💻 Author

**Mohamed**
Full Stack Web Developer · Angular & ASP.NET
Computer Science student at The Egyptian E-Learning University (EELU)

[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://linkedin.com/in/your-profile)
[![GitHub](https://img.shields.io/badge/GitHub-Follow-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/your-username)

---

<div align="center">

⭐ **If you like this project, give it a star, it means a lot!** ⭐

</div>
