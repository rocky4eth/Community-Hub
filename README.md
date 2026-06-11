# Euroape Connect

This project was generated using Lovable. It is a modern web application built with Vite, React, TypeScript, and Tailwind CSS.

## Prerequisites

Before you begin, ensure you have the following installed on your local machine:
* **Node.js**: Version 26.3.0 is required.
* **npm**: Node package manager.

## Getting Started

Follow these steps to run the project in your local development environment:

### 1. Install dependencies
Run the following command in the root of your project to install all required packages:
```bash
npm install
```

### 2. Environment Variables
If your Lovable project uses an external backend like Supabase, you will need to set up your environment variables:
1. Create a `.env.local` file in the project root.
2. Add your environment variables (e.g., Supabase credentials).

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```
*Note: `.env.local` is in `.gitignore` by default and should never be committed.*

### 3. Run the development server
Start the local development server with hot module replacement:
```sh
npm run dev
```
The terminal will output a local URL (typically `http://localhost:8080` or `http://localhost:5173`). Open this URL in your browser to see the app running locally.

## Building for Production

To create a production-ready build, run:
```bash
npm run build
```
This will generate a `dist/` directory containing the compiled JavaScript and CSS assets ready for deployment.

## Working with Lovable and GitHub

If this repository is connected to Lovable:
* **Automatic Sync**: Any commits pushed to the `main` branch will automatically sync into the Lovable browser editor within seconds.
* **Avoiding Conflicts**: Always run `git pull` before starting a local editing session. If both you and the Lovable AI edit the same file without pulling first, you may encounter merge conflicts.