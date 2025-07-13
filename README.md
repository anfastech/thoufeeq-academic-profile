# Academic Profile ( Arabic Lecture )
  
  A dynamic academic profile and portfolio website built with Vite + React, featuring a blog system, publication management, and admin dashboard.

  ## 🚀 Features

  - **Dynamic Blog System**: Create, edit, and manage blog posts with rich media support
  - **Publication Management**: Track academic publications with detailed metadata
  - **Resume Management**: Upload and manage resume PDF with experience tracking
  - **Admin Dashboard**: Secure admin interface for content management
  - **Responsive Design**: Mobile-first design with modern UI components
  - **Media Slideshows**: Interactive image galleries with navigation controls
  - **Contact Form**: Integrated contact system with form validation

  ## 🛠️ Tech Stack

  - **Frontend**: Vite + React, TypeScript, Tailwind CSS
  - **UI Components**: Shadcn/ui
  - **Backend**: Supabase (PostgreSQL, Auth, Storage)
  - **Deployment**: Vercel

  ## 📦 Installation

  1. **Clone the repository**:
     ```bash
     git clone <repository-url>
     cd thoufeeq-academic-profile
     ```

  2. **Install dependencies**:
     ```bash
     npm install
     ```

  3. **Set up environment variables**:
     Create a `.env.local` file in the root directory:
     ```env
     VITE_SUPABASE_URL=your_supabase_url
     VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
     ```

  4. **Run the development server**:
     ```bash
     npm run dev
     ```

  ## 📁 Project Structure

  ```
  thoufeeq-academic-profile/
  ├── src/
  │   ├── components/          # React components
  │   │   ├── admin/          # Admin dashboard components
  │   │   ├── ui/             # Shadcn/ui components
  │   │   ├── Navbar.tsx      # Navigation component
  │   │   └── Footer.tsx      # Footer component
  │   ├── pages/              # Page components
  │   │   ├── Index.tsx       # Home page
  │   │   ├── About.tsx       # About page
  │   │   ├── Blog.tsx        # Blog listing
  │   │   ├── BlogPost.tsx    # Individual blog post
  │   │   ├── Publications.tsx # Publications page
  │   │   ├── Awards.tsx      # Awards page
  │   │   ├── Contact.tsx     # Contact page
  │   │   ├── AdminDashboard.tsx # Admin dashboard
  │   │   └── AdminLogin.tsx  # Admin login
  │   ├── integrations/       # External integrations
  │   │   └── supabase/       # Supabase configuration
  │   ├── hooks/              # Custom React hooks
  │   └── lib/                # Utility functions
  ├── supabase/               # Supabase configuration
  │   ├── config.toml         # Supabase CLI config
  │   └── migrations/         # Database migrations
  ├── public/                 # Static assets
  └── ...                     # Configuration files
  ```

  ## 🔧 Configuration

  Required environment variables:

  Create a `.env.local` file in the root directory:
  ```env
  VITE_SUPABASE_URL=your_supabase_url
  VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
  ```

  ## 🚀 Deployment

  ### Vercel (Recommended)

  1. Push your code to GitHub
  2. Connect your repository to Vercel
  3. Add environment variables in Vercel dashboard
  4. Deploy automatically on push to main branch

  ### Manual Deployment

  1. Build the project:
     ```bash
     npm run build
     ```
  2. Start the production server:
     ```bash
     npm run preview
     ```

  ## 🔒 Security Features

  - Row Level Security (RLS) policies
  - Admin authentication
  - Environment variable protection

  ---
