# Thoufeeq Academic Profile

A dynamic academic profile and portfolio website built with Next.js, featuring a blog system, publication management, and admin dashboard.

## 🚀 Features

- **Dynamic Content Management**: Blog posts, publications, and resume management
- **Admin Dashboard**: Secure admin interface for content management
- **Responsive Design**: Mobile-first design with modern UI components
- **Real-time Updates**: Supabase integration for dynamic content
- **Media Support**: Image and video slideshows for blog posts
- **Resume Management**: PDF upload and experience tracking
- **Contact Integration**: Dynamic resume download and contact form

## 🛠️ Tech Stack

- **Framework**: Next.js 14
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn/ui
- **Database**: Supabase
- **Deployment**: Vercel

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd thoufeeq-academic-profile
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
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   ```

4. **Set up Supabase**
   - Create a new Supabase project
   - Run the migrations in `supabase/migrations/`
   - Configure storage buckets for media uploads

5. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   bun dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🏗️ Project Structure

```
thoufeeq-academic-profile/
├── src/
│   ├── app/                    # Next.js app directory
│   ├── components/             # React components
│   │   ├── admin/             # Admin dashboard components
│   │   ├── ui/                # Shadcn/ui components
│   │   └── ...                # Other components
│   ├── hooks/                 # Custom React hooks
│   ├── integrations/          # External service integrations
│   │   └── supabase/          # Supabase client and types
│   ├── lib/                   # Utility functions
│   └── pages/                 # Page components
├── supabase/                  # Supabase configuration
│   ├── config.toml           # Supabase config
│   └── migrations/           # Database migrations
├── public/                    # Static assets
└── ...                       # Configuration files
```

## 📋 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

## 🔧 Configuration

### Supabase Setup

1. Create a new Supabase project
2. Run the database migrations:
   ```bash
   supabase db push
   ```
3. Configure storage buckets for media uploads
4. Set up Row Level Security (RLS) policies

### Environment Variables

Required environment variables:

- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anonymous key
- `SUPABASE_SERVICE_ROLE_KEY`: Your Supabase service role key (for admin functions)

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
   npm run start
   ```

## 📱 Features

### Public Pages
- **Home**: Landing page with hero section and featured content
- **About**: Academic background, experience, and resume
- **Publications**: Research publications and academic work
- **Blog**: Dynamic blog posts with media support
- **Awards**: Academic achievements and recognitions
- **Contact**: Contact form and resume download

### Admin Dashboard
- **Blog Management**: Create, edit, and delete blog posts
- **Publication Management**: Manage research publications
- **Resume Management**: Upload PDF resume and manage experience entries
- **Media Upload**: Support for images and videos

## 🔒 Security

- Admin authentication required for dashboard access
- Row Level Security (RLS) policies in Supabase
- Secure file uploads with type validation
- Environment variable protection

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Author

Thoufeeq Rahman - Academic Profile Website

---

For support or questions, please contact through the website's contact form.
