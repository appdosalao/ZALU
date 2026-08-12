import { HTMLAttributes } from "react";
import * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog";
declare const AlertDialog: import("react").FC<AlertDialogPrimitive.AlertDialogProps>;
declare const AlertDialogTrigger: import("react").ForwardRefExoticComponent<AlertDialogPrimitive.AlertDialogTriggerProps & import("react").RefAttributes<HTMLButtonElement>>;
declare const AlertDialogPortal: import("react").FC<AlertDialogPrimitive.AlertDialogPortalProps>;
declare const AlertDialogOverlay: import("react").ForwardRefExoticComponent<Omit<AlertDialogPrimitive.AlertDialogOverlayProps & import("react").RefAttributes<HTMLDivElement>, "ref"> & import("react").RefAttributes<HTMLDivElement>>;
declare const AlertDialogContent: import("react").ForwardRefExoticComponent<Omit<AlertDialogPrimitive.AlertDialogContentProps & import("react").RefAttributes<HTMLDivElement>, "ref"> & import("react").RefAttributes<HTMLDivElement>>;
declare const AlertDialogHeader: {
    ({ className, ...props }: HTMLAttributes<HTMLDivElement>): import("react/jsx-runtime").JSX.Element;
    displayName: string;
};
declare const AlertDialogFooter: {
    ({ className, ...props }: HTMLAttributes<HTMLDivElement>): import("react/jsx-runtime").JSX.Element;
    displayName: string;
};
declare const AlertDialogTitle: import("react").ForwardRefExoticComponent<Omit<AlertDialogPrimitive.AlertDialogTitleProps & import("react").RefAttributes<HTMLHeadingElement>, "ref"> & import("react").RefAttributes<HTMLHeadingElement>>;
declare const AlertDialogDescription: import("react").ForwardRefExoticComponent<Omit<AlertDialogPrimitive.AlertDialogDescriptionProps & import("react").RefAttributes<HTMLParagraphElement>, "ref"> & import("react").RefAttributes<HTMLParagraphElement>>;
declare const AlertDialogAction: import("react").ForwardRefExoticComponent<Omit<AlertDialogPrimitive.AlertDialogActionProps & import("react").RefAttributes<HTMLButtonElement>, "ref"> & import("react").RefAttributes<HTMLButtonElement>>;
declare const AlertDialogCancel: import("react").ForwardRefExoticComponent<Omit<AlertDialogPrimitive.AlertDialogCancelProps & import("react").RefAttributes<HTMLButtonElement>, "ref"> & import("react").RefAttributes<HTMLButtonElement>>;
export { AlertDialog, AlertDialogPortal, AlertDialogOverlay, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogFooter, AlertDialogTitle, AlertDialogDescription, AlertDialogAction, AlertDialogCancel, };
//# sourceMappingURL=alert-dialog.d.ts.map