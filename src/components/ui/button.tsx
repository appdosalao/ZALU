import { forwardRef } from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-responsive-sm font-semibold ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 btn-touch touch-action-manipulation select-none text-white [&_svg]:text-white",
  {
    variants: {
      variant: {
        default:
          "btn-3d",
        destructive:
          "btn-3d",
        outline:
          "btn-3d",
        secondary:
          "btn-3d",
        ghost:
          "btn-3d",
        link:
          "btn-3d",
      },
      size: {
        default: "h-11 md:h-10 px-5 py-2 text-base md:text-sm",
        sm:      "h-9 md:h-8 px-3 py-1 text-xs md:text-sm rounded-md",
        md:      "h-10 md:h-9 rounded-md px-3 text-sm",
        lg:      "h-12 md:h-11 rounded-md px-8 text-base",
        icon:    "h-11 w-11 md:h-10 md:w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
