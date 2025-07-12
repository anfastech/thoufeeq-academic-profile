import { useState, useEffect } from 'react';
import { supabase } from '../integrations/supabase/client';
import type { Tables } from '../integrations/supabase/types';

type BlogPost = Tables<'blog_posts'> & {
  content_type?: 'text' | 'video' | 'photo' | 'mixed';
  video_url?: string;
  photo_urls?: string[];
  media_description?: string;
};

type Publication = Tables<'publications'>;

interface ContentStats {
  totalContent: number;
  textBlogs: number;
  videoBlogs: number;
  photoBlogs: number;
  mixedBlogs: number;
  publications: number;
  totalBlogs: number;
}

interface UseContentReturn {
  // All content
  blogs: BlogPost[];
  publications: Publication[];
  
  // Filtered content
  textBlogs: BlogPost[];
  videoBlogs: BlogPost[];
  photoBlogs: BlogPost[];
  mixedBlogs: BlogPost[];
  
  // Counts
  blogsCount: number;
  publicationsCount: number;
  stats: ContentStats;
  
  // State
  loading: boolean;
  error: string | null;
  
  // Methods
  refetch: () => Promise<void>;
  getBlogsByType: (type: 'text' | 'video' | 'photo' | 'mixed') => BlogPost[];
  getBlogsCountByType: (type: 'text' | 'video' | 'photo' | 'mixed') => number;
  getContentByType: (type: 'blog' | 'publication' | 'video' | 'photo') => (BlogPost | Publication)[];
}

export const useContent = (): UseContentReturn => {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [publications, setPublications] = useState<Publication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAllContent = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch blogs and publications in parallel
      const [blogsResult, publicationsResult] = await Promise.all([
        supabase
          .from('blog_posts')
          .select('*')
          .eq('published', true)
          .order('created_at', { ascending: false }),
        supabase
          .from('publications')
          .select('*')
          .order('publication_date', { ascending: false })
      ]);

      if (blogsResult.error) throw blogsResult.error;
      if (publicationsResult.error) throw publicationsResult.error;

      setBlogs(blogsResult.data || []);
      setPublications(publicationsResult.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch content');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllContent();
  }, []);

  const refetch = async () => {
    await fetchAllContent();
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

  const getContentByType = (type: 'blog' | 'publication' | 'video' | 'photo'): (BlogPost | Publication)[] => {
    switch (type) {
      case 'blog':
        return blogs;
      case 'publication':
        return publications;
      case 'video':
        return videoBlogs;
      case 'photo':
        return photoBlogs;
      default:
        return [];
    }
  };

  const stats: ContentStats = {
    totalContent: blogs.length + publications.length,
    textBlogs: textBlogs.length,
    videoBlogs: videoBlogs.length,
    photoBlogs: photoBlogs.length,
    mixedBlogs: mixedBlogs.length,
    publications: publications.length,
    totalBlogs: blogs.length,
  };

  return {
    blogs,
    publications,
    textBlogs,
    videoBlogs,
    photoBlogs,
    mixedBlogs,
    blogsCount: blogs.length,
    publicationsCount: publications.length,
    stats,
    loading,
    error,
    refetch,
    getBlogsByType,
    getBlogsCountByType,
    getContentByType,
  };
}; 