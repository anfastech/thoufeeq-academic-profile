import { useState, useEffect } from 'react';
import { supabase } from '../integrations/supabase/client';

interface Resume {
  id: string;
  pdf_url: string | null;
  updated_at: string;
}

interface Experience {
  id: string;
  position: string;
  institution: string;
  duration: string;
  description: string | null;
  order_index: number;
}

export const useResume = () => {
  const [resume, setResume] = useState<Resume | null>(null);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchResume();
    fetchExperiences();
  }, []);

  const fetchResume = async () => {
    try {
      const { data, error } = await supabase
        .from('resume')
        .select('*')
        .single();

      if (error) throw error;
      setResume(data);
    } catch (error) {
      console.error('Error fetching resume:', error);
    }
  };

  const fetchExperiences = async () => {
    try {
      const { data, error } = await supabase
        .from('experience')
        .select('*')
        .order('order_index', { ascending: true });

      if (error) throw error;
      setExperiences(data || []);
    } catch (error) {
      console.error('Error fetching experiences:', error);
    } finally {
      setLoading(false);
    }
  };

  return {
    resume,
    experiences,
    loading
  };
}; 