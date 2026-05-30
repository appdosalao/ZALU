import { r as reactExports } from './react-vendor-BpXfDOw7.js';

// packages/react/use-previous/src/usePrevious.tsx
function usePrevious(value) {
  const ref = reactExports.useRef({ value, previous: value });
  return reactExports.useMemo(() => {
    if (ref.current.value !== value) {
      ref.current.previous = ref.current.value;
      ref.current.value = value;
    }
    return ref.current.previous;
  }, [value]);
}

export { usePrevious as u };
