import { useBlogs } from './use-blogs';
import { usePublications } from './use-publications';

interface UseCountsReturn {
  blogsCount: number;
  publicationsCount: number;
  totalCount: number;
  loading: boolean;
  error: string | null;
}

export const useCounts = (): UseCountsReturn => {
  const { blogsCount, loading: blogsLoading, error: blogsError } = useBlogs();
  const { publicationsCount, loading: publicationsLoading, error: publicationsError } = usePublications();

  return {
    blogsCount,
    publicationsCount,
    totalCount: blogsCount + publicationsCount,
    loading: blogsLoading || publicationsLoading,
    error: blogsError || publicationsError,
  };
}; 