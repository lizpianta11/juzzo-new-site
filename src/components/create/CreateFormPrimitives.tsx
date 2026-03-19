"use client";

import type { InputHTMLAttributes, ReactNode, TextareaHTMLAttributes } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils/cn";

interface CreateModalShellProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  publishLabel?: string;
  canPublish: boolean;
  isPublishing: boolean;
  onPublish: () => void;
  accentClassName: string;
  children: ReactNode;
}

export function CreateModalShell({
  isOpen,
  onClose,
  title,
  publishLabel = "Publish",
  canPublish,
  isPublishing,
  onPublish,
  accentClassName,
  children,
}: CreateModalShellProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[90] bg-black/70 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 10 }}
            transition={{ type: "spring", damping: 28, stiffness: 350 }}
            className="fixed inset-x-4 top-[6%] z-[91] mx-auto flex max-h-[88vh] max-w-lg flex-col"
          >
            <div className="flex max-h-full flex-col overflow-hidden rounded-3xl border border-white/[0.08] bg-[#0c0c1a]/95 shadow-2xl backdrop-blur-2xl">
              <div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-4">
                <button onClick={onClose} className="text-sm font-medium text-white/50 transition-colors hover:text-white/80">
                  Cancel
                </button>
                <h3 className="text-sm font-bold text-white">{title}</h3>
                <button
                  onClick={onPublish}
                  disabled={!canPublish || isPublishing}
                  className={cn(
                    "rounded-full px-4 py-1.5 text-sm font-semibold transition-all",
                    canPublish ? accentClassName : "cursor-not-allowed bg-white/[0.06] text-white/25"
                  )}
                >
                  {isPublishing ? <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" /> : publishLabel}
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-5 space-y-5">{children}</div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export function FormSection({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-white/40">{label}</label>
      {children}
    </div>
  );
}

export function TextField(props: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={cn(
        "w-full rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-3 text-sm text-white outline-none transition-colors placeholder:text-white/25",
        props.className
      )}
    />
  );
}

export function TextAreaField(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={cn(
        "w-full rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-3 text-sm text-white outline-none transition-colors placeholder:text-white/25 resize-none",
        props.className
      )}
    />
  );
}

export function UploadSurface({
  onClick,
  active,
  idleTitle,
  idleSubtitle,
  children,
  accent,
  aspectClassName = "aspect-video",
}: {
  onClick: () => void;
  active: boolean;
  idleTitle: string;
  idleSubtitle: string;
  children?: ReactNode;
  accent: string;
  aspectClassName?: string;
}) {
  return active ? (
    <div className={cn("relative overflow-hidden rounded-2xl border border-white/[0.08] bg-gradient-to-br", accent, aspectClassName)}>
      {children}
    </div>
  ) : (
    <button
      onClick={onClick}
      className={cn(
        "w-full rounded-2xl border-2 border-dashed border-white/[0.1] flex flex-col items-center justify-center gap-3 transition-all",
        "hover:bg-white/[0.03]",
        aspectClassName
      )}
    >
      <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center text-2xl">+</div>
      <div className="text-center">
        <p className="text-sm font-medium text-white/55">{idleTitle}</p>
        <p className="mt-1 text-[11px] text-white/25">{idleSubtitle}</p>
      </div>
    </button>
  );
}

export function SettingsRow({
  label,
  value,
  icon,
  onClick,
}: {
  label: string;
  value: string;
  icon: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex w-full items-center justify-between rounded-xl border border-white/[0.04] bg-white/[0.03] px-4 py-3 transition-colors hover:bg-white/[0.06]"
    >
      <span className="flex items-center gap-2 text-sm text-white/60">
        <span>{icon}</span>
        {label}
      </span>
      <span className="flex items-center gap-1 text-xs text-white/30">
        {value}
        <svg className="w-3.5 h-3.5 text-white/20" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
        </svg>
      </span>
    </button>
  );
}
