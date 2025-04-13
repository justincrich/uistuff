"use client";

import { Toaster as SonnerToaster } from "sonner";
import { useTheme } from "next-themes";

export function ToastProvider() {
  const { theme } = useTheme();

  return (
    <SonnerToaster
      position="top-right"
      toastOptions={{
        duration: 5000,
        className: "border border-border font-medium",
      }}
      theme={theme as "light" | "dark" | undefined}
      closeButton
      richColors
      expand
      style={
        {
          "--toast-font-weight": "500",
          "--toast-error-bg": "rgba(254, 226, 226, 1)",
          "--toast-error-border": "rgb(220, 38, 38)",
          "--toast-error-text": "rgb(185, 28, 28)",
          "--toast-error-border-width": "2px",
          ...(theme === "dark" && {
            "--toast-error-bg": "rgba(127, 29, 29, 0.2)",
            "--toast-error-text": "rgb(248, 113, 113)",
          }),
        } as React.CSSProperties
      }
    />
  );
}
