import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "whitespace-nowrap inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2" +
  " hover-elevate " ,
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground shadow-xs",
        secondary: "border-transparent bg-[#B4ED50] text-[#0A1F17]",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground shadow-xs",
        outline: " border [border-color:var(--badge-outline)] shadow-xs",
        pending: "border-transparent bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-400",
        processing: "border-transparent bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400",
        completed: "border-transparent bg-[#00C48C]/15 text-[#00C48C] dark:bg-[#00C48C]/25 dark:text-[#00E57A] font-semibold",
        cancelled: "border-transparent bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400",
        paid: "border-transparent bg-[#00C48C]/10 text-[#00855F] dark:bg-[#00C48C]/20 dark:text-[#00E57A]",
        documentsReady: "border-transparent bg-[#B4ED50]/20 text-[#4A7A00] dark:bg-[#B4ED50]/15 dark:text-[#B4ED50]",
        active: "border-transparent bg-[#00C48C]/10 text-[#00855F] dark:bg-[#00C48C]/20 dark:text-[#00E57A]",
        inactive: "border-transparent bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400",
        draft: "border-transparent bg-gray-100 text-gray-600 dark:bg-gray-800/50 dark:text-gray-400",
        submitted: "border-transparent bg-[#00C48C]/10 text-[#00855F] dark:bg-[#00C48C]/20 dark:text-[#00E57A]",
        filed: "border-transparent bg-[#B4ED50]/20 text-[#4A7A00] dark:bg-[#B4ED50]/15 dark:text-[#B4ED50]",
        vip: "border-transparent badge-vip",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants }
