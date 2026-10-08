/* eslint-disable react-refresh/only-export-components */
import { ComponentProps } from "react"
import { Toaster as Sonner, toast } from "sonner"

type ToasterProps = ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <>
      <style>{`
        [data-sonner-toast]{
          border-radius: 1.25rem !important;
          border: 2px solid hsl(var(--primary) / 0.10) !important;
          background: hsl(var(--card) / 0.98) !important;
          backdrop-filter: blur(16px) !important;
          box-shadow: var(--shadow-elegant) !important;
          overflow: hidden !important;
          padding: 0 !important;
        }
        [data-sonner-toast]::before{
          content:"";
          position:absolute;
          left:0; top:0; bottom:0;
          width: 4px;
          background: linear-gradient(to bottom, hsl(var(--primary)), hsl(var(--lilac-primary)));
          opacity: 0.9;
        }
        [data-sonner-toast][data-type="success"]::before{ background: linear-gradient(to bottom, hsl(var(--success)), hsl(var(--primary))); }
        [data-sonner-toast][data-type="error"]::before{ background: linear-gradient(to bottom, hsl(var(--destructive)), hsl(0 84% 65%)); }
        [data-sonner-toast][data-type="info"]::before{ background: linear-gradient(to bottom, hsl(var(--info)), hsl(var(--lilac-primary))); }
        [data-sonner-toast] [data-icon]{
          background: linear-gradient(135deg, hsl(var(--primary)), hsl(var(--lilac-primary)));
          color: hsl(var(--primary-foreground));
          border-radius: 0.75rem;
          width: 36px; height: 36px;
          display:flex; align-items:center; justify-content:center;
          flex-shrink:0;
          box-shadow: 0 4px 12px hsl(var(--primary) / 0.25);
        }
        [data-sonner-toast] [data-icon] svg{ width:18px; height:18px; }
        [data-sonner-toast] [data-content]{ padding: 14px 16px 14px 4px; }
        [data-sonner-toast] [data-title]{ font-weight: 800; letter-spacing: -0.02em; font-size: 13px; }
        [data-sonner-toast] [data-description]{ font-size: 12px; opacity: 0.75; }
      `}</style>
      <Sonner
        theme="light"
        className="toaster group"
        toastOptions={{
          classNames: {
            toast:
              "group toast group-[.toaster]:bg-card group-[.toaster]:text-foreground group-[.toaster]:border-primary/10 group-[.toaster]:shadow-elegant",
            description: "group-[.toast]:text-muted-foreground",
            actionButton:
              "group-[.toast]:bg-gradient-to-br group-[.toast]:from-primary group-[.toast]:to-lilac-primary group-[.toast]:text-primary-foreground group-[.toast]:rounded-xl group-[.toast]:font-black",
            cancelButton:
              "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground group-[.toast]:rounded-xl",
          },
        }}
        {...props}
      />
    </>
  )
}

export { Toaster, toast }
