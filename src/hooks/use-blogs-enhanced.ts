import { useState, useEffect } from 'react';
import { supabase } from '../integrations/supabase/client';
import type { Tables } from '../integrations/supabase/types';

type BlogPost = Tables<'blog_posts'> & {
  content_type?: 'text' | 'video' | 'photo' | 'mixed';
  video_url?: string;
  photo_urls?: string[];
  media_description?: string;
};

interface UseBlogsEnhancedReturn {
  blogs: BlogPost[];
  blogsCount: number;
  textBlogs: BlogPost[];
  videoBlogs: BlogPost[];
  photoBlogs: BlogPost[];
  mixedBlogs: BlogPost[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  getBlogsByType: (type: 'text' | 'video' | 'photo' | 'mixed') => BlogPost[];
  getBlogsCountByType: (type: 'text' | 'video' | 'photo' | 'mixed') => number;
}

export const useBlogsEnhanced = (): UseBlogsEnhancedReturn => {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('published', true)
        .order('created_at', { ascending: false });

      if (fetchError) {
        throw fetchError;
      }

      setBlogs(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch blogs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const refetch = async () => {
    await fetchBlogs();
  };

  // Filter blogs by content type
  const textBlogs = blogs.filter(blog => blog.content_type === 'text' || !blog.content_type);
  const videoBlogs = blogs.filter(blog => blog.content_type === 'video');
  const photoBlogs = blogs.filter(blog => blog.content_type === 'photo');
  const mixedBlogs = blogs.filter(blog => blog.content_type === 'mixed');

  const getBlogsByType = (type: 'text' | 'video' | 'photo' | 'mixed'): BlogPost[] => {
    switch (type) {
      case 'text':
        return textBlogs;
      case 'video':
        return videoBlogs;
      case 'photo':
        return photoBlogs;
      case 'mixed':
        return mixedBlogs;
      default:
        return [];
    }
  };

  const getBlogsCountByType = (type: 'text' | 'video' | 'photo' | 'mixed'): number => {
    return getBlogsByType(type).length;
  };

  return {
    blogs,
    blogsCount: blogs.length,
    textBlogs,
    videoBlogs,
    photoBlogs,
    mixedBlogs,
    loading,
    error,
    refetch,
    getBlogsByType,
    getBlogsCountByType,
  };
}; 