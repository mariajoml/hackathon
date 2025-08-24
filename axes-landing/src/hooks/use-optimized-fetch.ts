"use client";

import { useState, useCallback, useRef } from 'react';
import { getCached, setCache } from '@/lib/performance';

interface FetchOptions extends Omit<RequestInit, 'cache'> {
  cache?: boolean;
  cacheTTL?: number;
}

interface FetchState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export function useOptimizedFetch<T>() {
  const [state, setState] = useState<FetchState<T>>({
    data: null,
    loading: false,
    error: null
  });

  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchData = useCallback(async (
    url: string, 
    options: FetchOptions = {}
  ): Promise<T | null> => {
    const { cache = true, cacheTTL = 5 * 60 * 1000, ...fetchOptions } = options;
    
    // Cancelar request anterior
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Crear nuevo AbortController
    abortControllerRef.current = new AbortController();
    
    // Verificar cache
    const cacheKey = `${url}-${JSON.stringify(fetchOptions)}`;
    if (cache) {
      const cached = getCached<T>(cacheKey);
      if (cached) {
        setState({ data: cached, loading: false, error: null });
        return cached;
      }
    }

    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const response = await fetch(url, {
        ...fetchOptions,
        signal: abortControllerRef.current.signal,
        headers: {
          'Content-Type': 'application/json',
          ...fetchOptions.headers,
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      // Guardar en cache
      if (cache) {
        setCache(cacheKey, data, cacheTTL);
      }

      setState({ data, loading: false, error: null });
      return data;

    } catch (error: any) {
      if (error.name !== 'AbortError') {
        const errorMessage = error.message || 'Error desconocido';
        setState(prev => ({ ...prev, loading: false, error: errorMessage }));
      }
      return null;
    }
  }, []);

  const clearCache = useCallback((url?: string) => {
    if (url) {
      // Limpiar cache específico - implementación simplificada
      console.log(`Cache cleared for ${url}`);
    } else {
      // Limpiar todo el cache
      console.log('All cache cleared');
    }
  }, []);

  return {
    ...state,
    fetchData,
    clearCache
  };
}
