# 🚀 AI Website Builder

A powerful **No-Code / Low-Code** platform that allows users to generate, edit, and publish websites using Artificial Intelligence. Built with React, Google Gemini, and Netlify.

<img width="1920" height="977" alt="Screenshot (421)" src="https://github.com/user-attachments/assets/99c14fa8-5866-48e1-b131-d38e4cdfe8fa" />
<img width="1920" height="971" alt="Screenshot (422)" src="https://github.com/user-attachments/assets/baff6236-3b18-4691-94a0-5d1524cdf7f7" />
<img width="1920" height="971" alt="Screenshot (423)" src="https://github.com/user-attachments/assets/5865cbc8-bd20-4a3a-8fe0-800001b4aa49" />
<img width="1920" height="967" alt="Screenshot (424)" src="https://github.com/user-attachments/assets/3028ac73-60f7-462f-ab6f-d1c1cf9e1f47" />


## ✨ Features

### 🤖 1. AI Text-to-Website
* **Natural Language Generation:** Describe your website (e.g., *"Make a portfolio for a photographer"*), and the AI writes the HTML, CSS, and JS instantly.
* **Iterative Refinement:** Chat with the AI to change colors, add sections, or fix bugs.

### 🎨 2. Dual Editing Modes
* **Visual Editor:** A Drag-and-Drop interface to rearrange elements without touching code.
* **Code Editor:** A split-screen Monaco-style editor for developers who want full control.
* **Live Preview:** See changes update instantly as you type or drag.

### 📂 3. Project Management Workspace
* **Multi-Project Support:** Create, save, and switch between multiple different websites.
* **Auto-Save:** Your work is automatically saved to your browser's local storage—never lose progress.

### ☁️ 4. One-Click Deployment
* **Instant Publishing:** Deploy your website to a live URL (e.g., `https://my-site.netlify.app`) in seconds.
* **Smart Updates:** If you deploy to the same name again, it updates the existing site instead of creating a new one.

---

## 🛠️ Tech Stack

* **Frontend:** React.js, Vite
* **UI Library:** Material UI (MUI)
* **AI Model:** Google Gemini API
* **Deployment:** Netlify API
* **Utilities:** JSZip (for bundling), Html-React-Parser (for visual editing)

---

## 🚀 Getting Started

Follow these steps to run the project locally.

### Prerequisites
* Node.js installed (v16 or higher)
* A Google Gemini API Key

### Installation

1.  **Clone the repository**
    ```bash
    git clone [https://github.com/YOUR_USERNAME/ai-website-builder.git](https://github.com/YOUR_USERNAME/ai-website-builder.git)
    cd ai-website-builder
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Setup Environment Variables**
    Create a `.env` file in the root directory and add your API key:
    ```env
    VITE_GEMINI_API_KEY=your_google_gemini_api_key_here
    ```

4.  **Run the App**
    ```bash
    npm run dev
    ```
    Open `http://localhost:5173` in your browser.

---

## 📖 Usage Guide

1.  **Create a Project:** Click "New Project" in the sidebar.
2.  **Generate Code:** Type a prompt like *"Create a landing page for a coffee shop"* in the chat box.
3.  **Edit:** * Click **"Visual"** to drag and drop sections.
    * Click **"Code"** to manually tweak HTML/CSS.
4.  **Deploy:** Click **"Deploy Live"**, enter a site name (e.g., `coffee-shop-demo`) and your Netlify Access Token.

---

## 🤝 Contributing

Contributions are welcome! Feel free to open issues or submit pull requests to improve the Visual Editor or add support for more AI models.
