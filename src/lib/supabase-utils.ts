import { supabase } from '@/integrations/supabase/client';
import type { PostgrestError } from '@supabase/supabase-js';

// Connection pooling and request batching
class SupabaseOptimizer {
  private static instance: SupabaseOptimizer;
  private batchQueue: Array<() => Promise<any>> = [];
  private batchTimeout: NodeJS.Timeout | null = null;
  private readonly BATCH_DELAY = 50; // ms

  static getInstance(): SupabaseOptimizer {
    if (!SupabaseOptimizer.instance) {
      SupabaseOptimizer.instance = new SupabaseOptimizer();
    }
    return SupabaseOptimizer.instance;
  }

  // Batch multiple operations together
  async batchOperation<T>(operation: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      this.batchQueue.push(async () => {
        try {
          const result = await operation();
          resolve(result);
          return result;
        } catch (error) {
          reject(error);
          throw error;
        }
      });

      if (this.batchTimeout) {
        clearTimeout(this.batchTimeout);
      }

      this.batchTimeout = setTimeout(async () => {
        const operations = [...this.batchQueue];
        this.batchQueue = [];
        
        // Execute all operations in parallel
        await Promise.all(operations.map(op => op()));
      }, this.BATCH_DELAY);
    });
  }
}

// Optimized data fetching with retry logic
export async function fetchWithRetry<T>(
  operation: () => Promise<{ data: T | null; error: PostgrestError | null }>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<{ data: T | null; error: PostgrestError | null }> {
  let lastError: PostgrestError | null = null;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const result = await operation();
      
      if (result.error) {
        lastError = result.error;
        
        // Don't retry on client errors (4xx)
        if (result.error.code && result.error.code.startsWith('4')) {
          break;
        }
        
        // Exponential backoff
        if (attempt < maxRetries) {
          await new Promise(resolve => setTimeout(resolve, delay * attempt));
        }
      } else {
        return result;
      }
    } catch (error) {
      lastError = error as PostgrestError;
      
      if (attempt < maxRetries) {
        await new Promise(resolve => setTimeout(resolve, delay * attempt));
      }
    }
  }

  return { data: null, error: lastError };
}

// Optimized bulk operations
export async function bulkInsert<T>(
  table: string,
  data: T[],
  batchSize: number = 100
): Promise<{ data: any[] | null; error: PostgrestError | null }> {
  const results = [];
  const errors = [];

  for (let i = 0; i < data.length; i += batchSize) {
    const batch = data.slice(i, i + batchSize);
    
    const { data: result, error } = await supabase
      .from(table)
      .insert(batch)
      .select();

    if (error) {
      errors.push(error);
    } else if (result) {
      results.push(...result);
    }
  }

  return {
    data: results.length > 0 ? results : null,
    error: errors.length > 0 ? errors[0] : null,
  };
}

// Optimized bulk update
export async function bulkUpdate<T>(
  table: string,
  data: Array<{ id: string | number } & Partial<T>>,
  batchSize: number = 100
): Promise<{ data: any[] | null; error: PostgrestError | null }> {
  const results = [];
  const errors = [];

  for (let i = 0; i < data.length; i += batchSize) {
    const batch = data.slice(i, i + batchSize);
    
    // Process each item in the batch
    const batchPromises = batch.map(async (item) => {
      const { id, ...updateData } = item;
      const { data: result, error } = await supabase
        .from(table)
        .update(updateData)
        .eq('id', id)
        .select();

      return { result, error };
    });

    const batchResults = await Promise.all(batchPromises);
    
    batchResults.forEach(({ result, error }) => {
      if (error) {
        errors.push(error);
      } else if (result) {
        results.push(...result);
      }
    });
  }

  return {
    data: results.length > 0 ? results : null,
    error: errors.length > 0 ? errors[0] : null,
  };
}

// Optimized bulk delete
export async function bulkDelete(
  table: string,
  ids: (string | number)[],
  batchSize: number = 100
): Promise<{ data: any[] | null; error: PostgrestError | null }> {
  const results = [];
  const errors = [];

  for (let i = 0; i < ids.length; i += batchSize) {
    const batch = ids.slice(i, i + batchSize);
    
    const { data: result, error } = await supabase
      .from(table)
      .delete()
      .in('id', batch)
      .select();

    if (error) {
      errors.push(error);
    } else if (result) {
      results.push(...result);
    }
  }

  return {
    data: results.length > 0 ? results : null,
    error: errors.length > 0 ? errors[0] : null,
  };
}

// Connection pooling utility
export const supabaseOptimizer = SupabaseOptimizer.getInstance();

// Preload common data
export async function preloadData(tables: string[]): Promise<void> {
  const preloadPromises = tables.map(async (table) => {
    try {
      await supabase.from(table).select('*').limit(1);
    } catch (error) {
      console.warn(`Failed to preload ${table}:`, error);
    }
  });

  await Promise.all(preloadPromises);
}

// Optimize queries with hints
export function createOptimizedQuery(table: string) {
  return supabase
    .from(table)
    .select('*', { count: 'exact', head: false });
} 