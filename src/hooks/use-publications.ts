import { useState, useEffect } from 'react';
import { supabase } from '../integrations/supabase/client';
import type { Tables } from '../integrations/supabase/types';

type Publication = Tables<'publications'>;

interface UsePublicationsReturn {
  publications: Publication[];
  publicationsCount: number;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const usePublications = (): UsePublicationsReturn => {
  const [publications, setPublications] = useState<Publication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPublications = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('publications')
        .select('*')
        .order('publication_date', { ascending: false });

      if (fetchError) {
        throw fetchError;
      }

      setPublications(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch publications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPublications();
  }, []);

  const refetch = async () => {
    await fetchPublications();
  };

  return {
    publications,
    publicationsCount: publications.length,
    loading,
    error,
    refetch,
  };
}; 