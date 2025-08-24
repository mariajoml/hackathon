// Optimizaciones de performance para AXES

// Precargar recursos críticos
export function preloadCriticalResources() {
  if (typeof window !== 'undefined') {
    // Precargar API endpoints críticos
    const criticalEndpoints = [
      'https://techrea.app.n8n.cloud/webhook/signin',
      'https://techrea.app.n8n.cloud/webhook/login'
    ];

    criticalEndpoints.forEach(url => {
      const link = document.createElement('link');
      link.rel = 'preconnect';
      link.href = url;
      document.head.appendChild(link);
    });
  }
}

// Lazy loading de imágenes con IntersectionObserver
export function createImageObserver() {
  if (typeof window !== 'undefined' && 'IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement;
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.classList.remove('blur-sm');
            img.classList.add('transition-all', 'duration-300');
            observer.unobserve(img);
          }
        }
      });
    });

    return imageObserver;
  }
  return null;
}

// Debounce para optimizar eventos
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

// Throttle para optimizar scroll events
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// Optimización de localStorage
export const optimizedStorage = {
  get: (key: string) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch {
      return null;
    }
  },
  
  set: (key: string, value: any) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch {
      return false;
    }
  },
  
  remove: (key: string) => {
    try {
      localStorage.removeItem(key);
      return true;
    } catch {
      return false;
    }
  }
};

// Cache en memoria para requests frecuentes
const cache = new Map<string, { data: any; timestamp: number; ttl: number }>();

export function getCached<T>(key: string): T | null {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < cached.ttl) {
    return cached.data;
  }
  cache.delete(key);
  return null;
}

export function setCache<T>(key: string, data: T, ttl: number = 5 * 60 * 1000): void {
  cache.set(key, {
    data,
    timestamp: Date.now(),
    ttl
  });
}

// Limpiar cache expirado
export function cleanExpiredCache(): void {
  const now = Date.now();
  for (const [key, value] of cache.entries()) {
    if (now - value.timestamp >= value.ttl) {
      cache.delete(key);
    }
  }
}
