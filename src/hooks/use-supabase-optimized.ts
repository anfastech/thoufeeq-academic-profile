import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { PostgrestError } from '@supabase/supabase-js';

interface UseSupabaseOptions<T> {
  table: string;
  select?: string;
  filters?: Record<string, any>;
  orderBy?: { column: string; ascending?: boolean };
  limit?: number;
  cacheTime?: number; // in milliseconds
  enabled?: boolean;
}

interface UseSupabaseResult<T> {
  data: T[] | null;
  loading: boolean;
  error: PostgrestError | null;
  refetch: () => Promise<void>;
  mutate: (newData: T[]) => void;
}

export function useSupabaseOptimized<T = any>(
  options: UseSupabaseOptions<T>
): UseSupabaseResult<T> {
  const {
    table,
    select = '*',
    filters = {},
    orderBy,
    limit,
    cacheTime = 5 * 60 * 1000, // 5 minutes default
    enabled = true,
  } = options;

  const [data, setData] = useState<T[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<PostgrestError | null>(null);
  
  const cacheRef = useRef<{
    data: T[] | null;
    timestamp: number;
    queryKey: string;
  } | null>(null);

  // Create a unique query key for caching
  const queryKey = JSON.stringify({ table, select, filters, orderBy, limit });

  const fetchData = useCallback(async () => {
    if (!enabled) return;

    // Check cache first
    if (cacheRef.current && 
        cacheRef.current.queryKey === queryKey &&
        Date.now() - cacheRef.current.timestamp < cacheTime) {
      setData(cacheRef.current.data);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      let query = supabase.from(table).select(select);

      // Apply filters
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          query = query.eq(key, value);
        }
      });

      // Apply ordering
      if (orderBy) {
        query = query.order(orderBy.column, {
          ascending: orderBy.ascending ?? true,
        });
      }

      // Apply limit
      if (limit) {
        query = query.limit(limit);
      }

      const { data: result, error: queryError } = await query;

      if (queryError) {
        setError(queryError);
        return;
      }

      // Update cache
      cacheRef.current = {
        data: result,
        timestamp: Date.now(),
        queryKey,
      };

      setData(result);
    } catch (err) {
      console.error('Supabase query error:', err);
      setError(err as PostgrestError);
    } finally {
      setLoading(false);
    }
  }, [table, select, queryKey, enabled, cacheTime]);

  const refetch = useCallback(async () => {
    // Clear cache to force fresh data
    cacheRef.current = null;
    await fetchData();
  }, [fetchData]);

  const mutate = useCallback((newData: T[]) => {
    setData(newData);
    // Update cache with new data
    if (cacheRef.current) {
      cacheRef.current.data = newData;
      cacheRef.current.timestamp = Date.now();
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    refetch,
    mutate,
  };
}

// Optimized single record hook
export function useSupabaseSingle<T = any>(
  options: Omit<UseSupabaseOptions<T>, 'limit'> & { id: string | number }
): UseSupabaseResult<T> {
  const { id, ...rest } = options;
  
  return useSupabaseOptimized<T>({
    ...rest,
    filters: { ...rest.filters, id },
    limit: 1,
  });
}

// Optimized count hook
export function useSupabaseCount(
  options: Omit<UseSupabaseOptions<any>, 'select' | 'orderBy' | 'limit'>
): UseSupabaseResult<{ count: number }> {
  const { table, filters, cacheTime, enabled } = options;
  
  return useSupabaseOptimized<{ count: number }>({
    table,
    select: 'count',
    filters,
    cacheTime,
    enabled,
  });
} 