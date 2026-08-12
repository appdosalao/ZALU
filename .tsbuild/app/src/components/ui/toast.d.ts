import type { ComponentPropsWithoutRef, ReactElement } from "react";
import * as ToastPrimitives from "@radix-ui/react-toast";
import { type VariantProps } from "class-variance-authority";
declare const ToastProvider: import("react").FC<ToastPrimitives.ToastProviderProps>;
declare const ToastViewport: import("react").ForwardRefExoticComponent<Omit<ToastPrimitives.ToastViewportProps & import("react").RefAttributes<HTMLOListElement>, "ref"> & import("react").RefAttributes<HTMLOListElement>>;
declare const Toast: import("react").ForwardRefExoticComponent<Omit<ToastPrimitives.ToastProps & import("react").RefAttributes<HTMLLIElement>, "ref"> & VariantProps<(props?: {
    variant?: "default" | "destructive";
} & import("class-variance-authority/types").ClassProp) => string> & import("react").RefAttributes<HTMLLIElement>>;
declare const ToastAction: import("react").ForwardRefExoticComponent<Omit<ToastPrimitives.ToastActionProps & import("react").RefAttributes<HTMLButtonElement>, "ref"> & import("react").RefAttributes<HTMLButtonElement>>;
declare const ToastClose: import("react").ForwardRefExoticComponent<Omit<ToastPrimitives.ToastCloseProps & import("react").RefAttributes<HTMLButtonElement>, "ref"> & import("react").RefAttributes<HTMLButtonElement>>;
declare const ToastTitle: import("react").ForwardRefExoticComponent<Omit<ToastPrimitives.ToastTitleProps & import("react").RefAttributes<HTMLDivElement>, "ref"> & import("react").RefAttributes<HTMLDivElement>>;
declare const ToastDescription: import("react").ForwardRefExoticComponent<Omit<ToastPrimitives.ToastDescriptionProps & import("react").RefAttributes<HTMLDivElement>, "ref"> & import("react").RefAttributes<HTMLDivElement>>;
type ToastProps = ComponentPropsWithoutRef<typeof Toast>;
type ToastActionElement = ReactElement<typeof ToastAction>;
export { type ToastProps, type ToastActionElement, ToastProvider, ToastViewport, Toast, ToastTitle, ToastDescription, ToastClose, ToastAction, };
//# sourceMappingURL=toast.d.ts.map