import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookOpen, Calendar, ArrowRight, Mail, Library, Play, Image, ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useContent } from "@/hooks/use-content";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  thumbnail_url: string;
  tags: string[];
  created_at: string;
  content_type?: 'text' | 'video' | 'photo' | 'mixed';
  video_url?: string;
  photo_urls?: string[];
  media_description?: string;
}

// Media display component moved outside to prevent recreation
const MediaDisplay = ({ post }: { post: BlogPost }) => {
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

  // Auto-advance every 4 seconds
  useEffect(() => {
    if (mediaItems.length > 0 && !isPaused) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % mediaItems.length);
      }, 4000);
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

  // Show video separately if it exists
  if (post.video_url) {
    return (
      <div className="aspect-video rounded-lg overflow-hidden">
        <video
          src={post.video_url}
          className="w-full h-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
        />
      </div>
    );
  }

  if (mediaItems.length === 0) {
    return (
      <div className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center">
        <Image className="h-12 w-12 text-gray-400" />
      </div>
    );
  }

  const currentMedia = mediaItems[currentIndex];

  return (
    <div className="relative aspect-video rounded-lg overflow-hidden group">
      <img
        src={currentMedia.url}
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
  );
};

const Blog = () => {
  const { blogs, loading } = useContent();
  const blogPosts = blogs as BlogPost[];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const getUniqueCategories = () => {
    const categories = new Set<string>();
    blogPosts.forEach(post => {
      if (post.tags) {
        post.tags.forEach(tag => categories.add(tag));
      }
    });
    return Array.from(categories);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-800 mb-4">Academic <span className="underline">Blog</span></h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Insights, research findings, and reflections on Arabic Literature and contemporary literary studies
          </p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-slate-600">Loading blog posts...</p>
          </div>
        ) : blogPosts.length > 0 ? (
          <>
            {/* Featured Post */}
            {blogPosts.length > 0 && (
              <Card className="mb-12 hover:shadow-xl transition-all duration-300">
                <div className="grid md:grid-cols-2 gap-6">
                  <MediaDisplay post={blogPosts[0]} />
                  <div className="p-6 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className="bg-blue-100 text-blue-800 border-blue-300">Featured</Badge>
                        {blogPosts[0].content_type && blogPosts[0].content_type !== 'text' && (
                          <Badge variant="secondary" className="flex items-center gap-1">
                            {blogPosts[0].content_type === 'video' && <Play className="h-3 w-3" />}
                            {blogPosts[0].content_type === 'photo' && <Image className="h-3 w-3" />}
                            {blogPosts[0].content_type === 'mixed' && <BookOpen className="h-3 w-3" />}
                            {blogPosts[0].content_type}
                          </Badge>
                        )}
                        {blogPosts[0].tags && blogPosts[0].tags.length > 0 && (
                          <Badge variant="outline">{blogPosts[0].tags[0]}</Badge>
                        )}
                      </div>
                      <CardTitle className="text-2xl text-slate-800 leading-tight mb-3">
                        {blogPosts[0].title}
                      </CardTitle>
                      {blogPosts[0].excerpt && (
                        <CardDescription className="text-base mb-4">
                          {blogPosts[0].excerpt}
                        </CardDescription>
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 text-slate-600 text-sm">
                        <Calendar className="h-4 w-4" />
                        <span>{formatDate(blogPosts[0].created_at)}</span>
                      </div>
                      <Button asChild>
                        <Link to={`/blog/${blogPosts[0].slug}`}>
                          Read Article
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            )}

            {/* Blog Posts Grid */}
            {blogPosts.length > 1 && (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                {blogPosts.slice(1).map((post) => (
                  <Card key={post.id} className="hover:shadow-lg transition-all duration-300 group">
                    <MediaDisplay post={post} />
                    <CardHeader className="pb-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {post.content_type && post.content_type !== 'text' && (
                            <Badge variant="secondary" className="flex items-center gap-1 text-xs">
                              {post.content_type === 'video' && <Play className="h-3 w-3" />}
                              {post.content_type === 'photo' && <Image className="h-3 w-3" />}
                              {post.content_type === 'mixed' && <BookOpen className="h-3 w-3" />}
                              {post.content_type}
                            </Badge>
                          )}
                          {post.tags && post.tags.length > 0 && (
                            <Badge variant="outline">{post.tags[0]}</Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-1 text-slate-600 text-xs">
                          <Calendar className="h-3 w-3" />
                          <span>{formatDate(post.created_at)}</span>
                        </div>
                      </div>
                      <CardTitle className="text-lg text-slate-800 leading-tight group-hover:text-blue-600 transition-colors">
                        {post.title}
                      </CardTitle>
                      {post.excerpt && (
                        <CardDescription className="text-sm mt-2">
                          {post.excerpt}
                        </CardDescription>
                      )}
                    </CardHeader>
                    <CardContent>
                      <Button variant="ghost" size="sm" asChild className="p-0 h-auto">
                        <Link to={`/blog/${post.slug}`}>
                          Read More
                          <ArrowRight className="ml-1 h-3 w-3" />
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Categories */}
            {getUniqueCategories().length > 0 && (
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Library className="h-7 w-7 text-blue-600" />
                    Blog Categories
                  </CardTitle>
                  <CardDescription>
                    Explore articles by topic area
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {getUniqueCategories().slice(0, 4).map((category) => (
                      <Card key={category} className="text-center p-4 hover:bg-slate-50 transition-colors cursor-pointer">
                        <h4 className="font-medium text-slate-800 mb-1">{category}</h4>
                        <p className="text-sm text-slate-600">
                          {blogPosts.filter(post => post.tags?.includes(category)).length} articles
                        </p>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-slate-600">No blog posts available</p>
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  );
};

export default Blog;
