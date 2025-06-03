# 🖥️ Contributing Guidelines — T-Shirt Designer Web App

Welcome! 👋  
This document outlines the design principles, coding standards, and contribution rules for this project. Please read through carefully before adding features, fixing bugs, or submitting pull requests.

---

## 🎨 Design Guidelines

To maintain a consistent, professional, and clean design, please follow these rules when styling the application:

### 📖 Color Palette  
Use these specific colors across the application:

| Purpose         | Color     | HEX Code |
|:----------------|:------------|:-----------|
| **Primary**       | Deep Blue   | `#0B3954`  |
| **Secondary**     | Light Blue  | `#BFD7EA`  |
| **Accent**        | Dusty Pink  | `#C98986`  |
| **Text**          | Warm Brown  | `#8B575C`  |
| **Background**    | Soft White  | `#FEFFFE`  |

Use Tailwind CSS utility classes to apply these colors consistently.

### 📏 Layout and Spacing
- Maintain a clean, minimal, and modern UI.
- Use generous padding (`p-4`, `p-6`, `p-8`) and spacing (`gap-4`, `gap-6`) to avoid clutter.
- Ensure buttons, inputs, and canvases are visually balanced and accessible.

---

## 💾 Code Guidelines

To ensure code quality, maintainability, and scalability:

### 📚 Libraries and Dependencies
- **Always prefer well-maintained, open-source libraries (MIT or Apache 2.0 licensed)** over custom code.
- Use:
  - **Tailwind CSS** for styling.
  - **Konva.js** for canvas manipulation.
  - **React Hooks** and **functional components** — no class components.

### 🏗️ Project Structure

Follow this file and folder structure:

src/
components/ # Reusable React components
pages/ # Next.js pages (routes)
styles/ # Global and custom CSS
lib/ # Utility functions
public/ # Static assets (images, icons, fonts)

yaml
Copy
Edit

### 📐 Coding Conventions
- Use functional React components exclusively.
- Style components with Tailwind utility classes — no inline styles or custom CSS unless absolutely necessary.
- Organize all visual elements into clean, reusable components.
- Use clear, minimal, and well-commented code.
- Separate concerns: keep business logic out of UI components when possible.

---

## 🚀 Deployment

Deploy the application via **Railway** or **Vercel**. Each feature should include clear run and deploy instructions in pull request descriptions if deployment behavior changes.

---

## 📑 Commit Messages

Use clear and descriptive commit messages:
- `feat: add image upload component`
- `fix: resolve Konva drag bug`
- `style: update button colors to match palette`
- `chore: update dependencies`

---

## 📦 Future Plans

This guideline will evolve as the project scales. Keep contributions modular and scalable to support future features like:
- Meme libraries
- Dropshipping API integration
- Payment processing

---

Thanks for contributing! 🚀  
Let’s build something awesome.  