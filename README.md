# Insurance Frontend

A modern, production-ready insurance web application built with Next.js, TypeScript, and Tailwind CSS. Features a comprehensive UI component library with shadcn/ui, advanced form handling, real-time data synchronization, and beautiful animations.

## ✨ Features

- **Modern UI/UX**: Built with shadcn/ui components and Tailwind CSS for a polished, responsive interface
- **Type-Safe**: Full TypeScript support for enhanced developer experience and code reliability
- **Form Management**: React Hook Form with Zod validation for robust form handling
- **Data Management**: TanStack Query for efficient data fetching and caching
- **State Management**: Zustand for lightweight, scalable state management
- **Authentication**: Next-Auth for secure user authentication
- **Internationalization**: Multi-language support with next-intl
- **Dark Mode**: Seamless theme switching with next-themes
- **Drag & Drop**: DnD Kit integration for interactive draggable interfaces
- **Charts & Visualization**: Recharts for data visualization
- **Rich Editing**: MDX Editor for content creation
- **Animations**: Framer Motion for smooth, production-ready animations

## 🚀 Tech Stack

### Core Framework
- **Next.js 15** - React framework with App Router for production
- **React 19** - Latest React with improved performance
- **TypeScript 5** - Type-safe JavaScript

### Styling & UI
- **Tailwind CSS 4** - Utility-first CSS framework
- **shadcn/ui** - High-quality, accessible components
- **Lucide React** - Beautiful icon library
- **Framer Motion** - Advanced animations

### Forms & Validation
- **React Hook Form** - Performant form handling
- **Zod** - TypeScript-first schema validation

### Data & State
- **TanStack Query** - Server state management
- **TanStack React Table** - Advanced table component
- **Zustand** - Client state management

### Additional Libraries
- **next-auth** - Authentication & authorization
- **next-intl** - Internationalization
- **recharts** - Data visualization
- **date-fns** - Date utilities
- **sonner** - Toast notifications
- **sharp** - Image optimization

## 📋 Prerequisites

- Node.js 18+ or Bun
- npm, yarn, or bun package manager

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd insurance_frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   bun install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   Update `.env.local` with your configuration.

## 🚀 Getting Started

### Development Server

Start the development server on `http://localhost:3000`:

```bash
npm run dev
```

The application will automatically reload on file changes.

### Build for Production

Create an optimized production build:

```bash
npm run build
```

### Run Production Build

Start the production server:

```bash
npm start
```

### Code Quality

Check code quality with ESLint:

```bash
npm run lint
```

## 📁 Project Structure

```
src/
├── app/                  # Next.js app directory
│   ├── api/             # API routes
│   ├── layout.tsx       # Root layout
│   ├── page.tsx         # Home page
│   └── globals.css      # Global styles
├── components/          # Reusable React components
│   └── ui/             # UI component library
├── hooks/              # Custom React hooks
│   ├── use-mobile.ts
│   └── use-toast.ts
└── lib/                # Utility functions
    ├── db.ts           # Database client
    └── utils.ts        # Helper functions
```

## 🎯 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server on port 3000 |
| `npm run build` | Build for production |
| `npm start` | Run production build |
| `npm run lint` | Run ESLint code quality checks |

## 🔧 Configuration Files

- **`next.config.ts`** - Next.js configuration
- **`tsconfig.json`** - TypeScript configuration
- **`tailwind.config.ts`** - Tailwind CSS customization
- **`eslint.config.mjs`** - ESLint rules
- **`postcss.config.mjs`** - PostCSS configuration
- **`Caddyfile`** - Web server configuration

## 🧩 Component Library

The project includes a comprehensive set of UI components from shadcn/ui:

- Accordion, Alert Dialog, Avatar
- Button, Card, Checkbox
- Dialog, Dropdown Menu, Hover Card
- Input, Label, Menubar
- Select, Separator, Slider
- Tabs, Toast, Toggle
- Tooltip, Drawer, and more

All components are customizable and follow accessibility best practices.

## 🎨 Styling

- **Tailwind CSS** for utility-first styling
- **Global styles** in `src/app/globals.css`
- **Component-specific styles** using Tailwind classes
- **Dark mode support** with next-themes

## 📊 Data Fetching

The project uses **TanStack Query** for data fetching and caching:

```typescript
// Example usage
const { data, isLoading } = useQuery({
  queryKey: ['data'],
  queryFn: async () => {
    const res = await fetch('/api/data');
    return res.json();
  },
});
```

## Made by @JD  
**Happy coding!** 🎉