
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, Play, Image, BookOpen, ChevronLeft, ChevronRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  thumbnail_url: string;
  tags: string[];
  published: boolean;
  created_at: string;
  updated_at: string;
  content_type?: 'text' | 'video' | 'photo' | 'mixed';
  video_url?: string;
  photo_urls?: string[];
  media_description?: string;
}

// Media display component moved outside to prevent recreation
const MediaDisplay = ({ className, post }: { className?: string, post: BlogPost }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  
  // Get all media items (exclude videos from slideshow)
  const mediaItems = [];
  if (post.photo_urls && post.photo_urls.length > 0) {
    post.photo_urls.forEach(url => mediaItems.push({ type: 'image', url }));
  }
  if (post.thumbnail_url && !post.photo_urls?.includes(post.thumbnail_url)) {
    mediaItems.push({ type: 'image', url: post.thumbnail_url });
  }

  useEffect(() => {
    if (mediaItems.length > 0 && !isPaused) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % mediaItems.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [mediaItems.length, isPaused]);

  const handleManualNavigation = (direction: 'next' | 'prev') => {
    setIsPaused(true);
    if (direction === 'next') {
      setCurrentIndex((prev) => (prev + 1) % mediaItems.length);
    } else {
      setCurrentIndex((prev) => (prev - 1 + mediaItems.length) % mediaItems.length);
    }
    
    // Resume auto-slide after 6 seconds
    setTimeout(() => {
      setIsPaused(false);
    }, 6000);
  };

  // If no media content, return null
  if (!post.video_url && mediaItems.length === 0) {
    return null;
  }

  return (
    <div className={className}>
      {/* Show video if it exists */}
      {post.video_url && (
        <div className="aspect-video mb-8 rounded-lg overflow-hidden shadow-lg">
          <video
            src={post.video_url}
            className="w-full h-full object-cover"
            controls
            preload="metadata"
          />
        </div>
      )}

      {/* Show photo slideshow if photos exist */}
      {mediaItems.length > 0 && (
        <div className="relative aspect-video mb-8 rounded-lg overflow-hidden group shadow-lg">
          <img
            src={mediaItems[currentIndex].url}
            alt={post.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          
          {/* Media counter - always show */}
          <div className="absolute bottom-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs">
            {currentIndex + 1} / {mediaItems.length}
          </div>
          
          {/* Navigation arrows - always show for better UX */}
          <button
            onClick={() => handleManualNavigation('prev')}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-1 rounded-full hover:bg-opacity-75 transition-all opacity-0 group-hover:opacity-100"
            aria-label="Previous media"
            title="Previous media"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={() => handleManualNavigation('next')}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-1 rounded-full hover:bg-opacity-75 transition-all opacity-0 group-hover:opacity-100"
            aria-label="Next media"
            title="Next media"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
          
          {/* Slide indicators for multiple images */}
          {mediaItems.length > 1 && (
            <div className="absolute bottom-2 left-2 flex gap-1">
              {mediaItems.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentIndex 
                      ? 'bg-white' 
                      : 'bg-white bg-opacity-50'
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const BlogPost = () => {
  const { slug } = useParams();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (slug) {
      fetchBlogPost(slug);
    }
  }, [slug]);

  const fetchBlogPost = async (postSlug: string) => {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('slug', postSlug)
        .eq('published', true)
        .single();

      if (error) throw error;
      setPost(data);
    } catch (error) {
      console.error('Error fetching blog post:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <Navbar />
        <div className="container mx-auto px-4 py-16">
          <p className="text-center">Loading...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <Navbar />
        <div className="container mx-auto px-4 py-16">
          <Card className="text-center">
            <CardContent className="py-12">
              <h1 className="text-2xl font-bold mb-4">Blog Post Not Found</h1>
              <p className="text-gray-600 mb-6">The blog post you're looking for doesn't exist.</p>
              <Button asChild>
                <Link to="/blog">Back to Blog</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-16">
        <Button variant="ghost" asChild className="mb-6">
          <Link to="/blog">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Blog
          </Link>
        </Button>

        <article className="max-w-4xl mx-auto">
          <MediaDisplay post={post} />
          <Card>
            <CardHeader>
              <div className="space-y-4">
                <CardTitle className="text-3xl md:text-4xl font-bold leading-tight">
                  {post.title}
                </CardTitle>
                
                <div className="flex flex-wrap items-center gap-4 text-slate-600">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>{formatDate(post.created_at)}</span>
                  </div>
                  {post.content_type && post.content_type !== 'text' && (
                    <Badge variant="secondary" className="flex items-center gap-1">
                      {post.content_type === 'video' && <Play className="h-3 w-3" />}
                      {post.content_type === 'photo' && <Image className="h-3 w-3" />}
                      {post.content_type === 'mixed' && <BookOpen className="h-3 w-3" />}
                      {post.content_type}
                    </Badge>
                  )}
                </div>

                {post.tags && post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag, index) => (
                      <Badge key={index} variant="outline">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}

                {post.excerpt && (
                  <p className="text-lg text-slate-600 leading-relaxed">
                    {post.excerpt}
                  </p>
                )}
              </div>
            </CardHeader>
            <CardContent>              

              {/* Text Content */}
              <div className="prose prose-slate max-w-none">
                {post.content?.split('\n').map((paragraph, index) => (
                  <p key={index} className="mb-4 leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>
            </CardContent>
          </Card>
        </article>
      </div>
      
      <Footer />
    </div>
  );
};

export default BlogPost;
