"use client"

import * as React from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { X } from "lucide-react"

import { cn } from "@/lib/utils"

const Dialog = DialogPrimitive.Root

const DialogTrigger = DialogPrimitive.Trigger

const DialogPortal = DialogPrimitive.Portal

const DialogClose = DialogPrimitive.Close

const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      "fixed inset-0 z-50 bg-black/80",
      className
    )}
    {...props}
  />
))
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName

const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => {
  return (
    <DialogPortal container={typeof document !== 'undefined' ? document.body : undefined}>
      <DialogPrimitive.Overlay 
        className="fixed inset-0 z-[99998] bg-black/60 backdrop-blur-sm data-[state=closed]:duration-0 flex items-center justify-center"
      />
      <div className="fixed inset-0 z-[99999] flex items-center justify-center pointer-events-none p-4">
        <DialogPrimitive.Content
          ref={ref}
          onOpenAutoFocus={(e) => e.preventDefault()}
          onPointerDownOutside={(e) => {
            const originalEvent = e.detail?.originalEvent;
            if (originalEvent?.type === 'touchend') {
              const target = e.target as HTMLElement;
              if (target?.closest?.('[data-radix-dialog-content]')) {
                e.preventDefault();
              }
            }
          }}
          className={cn(
            "pointer-events-auto",
            "w-full max-w-md",
            "bg-white dark:bg-zinc-900 border border-border",
            "rounded-xl shadow-2xl",
            "max-h-[85vh] overflow-y-auto overscroll-contain",
            "p-4 sm:p-6",
            "touch-pan-y",
            "data-[state=closed]:duration-0",
            className
          )}
          style={{ WebkitOverflowScrolling: 'touch' }}
          {...props}
        >
          {children}
          <DialogPrimitive.Close 
            className="absolute right-3 top-3 w-9 h-9 sm:w-8 sm:h-8 rounded-full bg-muted/80 hover:bg-muted active:bg-muted/60 flex items-center justify-center transition-colors z-10 touch-manipulation"
            data-testid="button-dialog-close"
          >
            <X className="h-4 w-4 text-muted-foreground" />
            <span className="sr-only">Cerrar</span>
          </DialogPrimitive.Close>
        </DialogPrimitive.Content>
      </div>
    </DialogPortal>
  );
})
DialogContent.displayName = DialogPrimitive.Content.displayName

const DialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col space-y-2 mb-4",
      className
    )}
    {...props}
  />
)
DialogHeader.displayName = "DialogHeader"

const DialogFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col-reverse gap-3 mt-6 sm:flex-row sm:justify-end",
      className
    )}
    {...props}
  />
)
DialogFooter.displayName = "DialogFooter"

const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn(
      "text-xl font-black leading-none tracking-tight text-foreground",
      className
    )}
    {...props}
  />
))
DialogTitle.displayName = DialogPrimitive.Title.displayName

const DialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
DialogDescription.displayName = DialogPrimitive.Description.displayName

export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogClose,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
}
