import { useState, useEffect, useRef } from 'react';

// Debounce a value (e.g. for search inputs)
export function useDebounce(value, delay = 400) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}

// Intersection Observer — fire callback when element enters viewport
export function useIntersection(callback, options = {}) {
  const ref = useRef(null);
  useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) callback();
    }, { threshold: 0.8, ...options });
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [callback]);
  return ref;
}

// Track previous value
export function usePrevious(value) {
  const ref = useRef();
  useEffect(() => { ref.current = value; });
  return ref.current;
}

// Toggle boolean state
export function useToggle(initial = false) {
  const [state, setState] = useState(initial);
  const toggle = () => setState(s => !s);
  return [state, toggle, setState];
}
