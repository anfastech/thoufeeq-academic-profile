import { useState, useEffect } from 'react';
import { supabase } from '../integrations/supabase/client';
import type { Tables } from '../integrations/supabase/types';

type BlogPost = Tables<'blog_posts'>;

interface UseBlogsReturn {
  blogs: BlogPost[];
  blogsCount: number;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useBlogs = (): UseBlogsReturn => {
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

  return {
    blogs,
    blogsCount: blogs.length,
    loading,
    error,
    refetch,
  };
}; 