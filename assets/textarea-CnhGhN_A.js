import { r as reactExports, j as jsxRuntimeExports } from './react-vendor-BpXfDOw7.js';
import { h as cn } from './index-BxmTkSue.js';

const Textarea = reactExports.forwardRef(
  ({ className, ...props }, ref) => {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      "textarea",
      {
        className: cn(
          "flex min-h-[100px] sm:min-h-[80px] w-full rounded-md border border-input bg-background px-3 sm:px-4 py-3 sm:py-2 text-base sm:text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-colors",
          className
        ),
        ref,
        ...props
      }
    );
  }
);
Textarea.displayName = "Textarea";

export { Textarea as T };
