"use client";

import { AlertCircle, CheckCircle2, Info, X } from "lucide-react";

export type EstoqueFeedbackTone = "success" | "error" | "info" | "warning";

export type EstoqueFeedbackState = {
  tone: EstoqueFeedbackTone;
  title: string;
  description?: string;
} | null;

type FeedbackBannerProps = {
  feedback: EstoqueFeedbackState;
  onDismiss?: () => void;
};

const toneStyles: Record<
  EstoqueFeedbackTone,
  {
    container: string;
    icon: string;
  }
> = {
  success: {
    container: "border-emerald-200 bg-emerald-50 text-emerald-900",
    icon: "text-emerald-600",
  },
  error: {
    container: "border-red-200 bg-red-50 text-red-900",
    icon: "text-red-600",
  },
  warning: {
    container: "border-amber-200 bg-amber-50 text-amber-900",
    icon: "text-amber-600",
  },
  info: {
    container: "border-sky-200 bg-sky-50 text-sky-900",
    icon: "text-sky-600",
  },
};

export function FeedbackBanner({ feedback, onDismiss }: FeedbackBannerProps) {
  if (!feedback) {
    return null;
  }

  const style = toneStyles[feedback.tone];
  const Icon =
    feedback.tone === "success"
      ? CheckCircle2
      : feedback.tone === "error"
        ? AlertCircle
        : Info;

  return (
    <section
      className={`flex items-start justify-between gap-4 rounded-2xl border px-4 py-3 ${style.container}`}
    >
      <div className="flex items-start gap-3">
        <Icon className={`mt-0.5 h-5 w-5 ${style.icon}`} />
        <div className="space-y-1">
          <p className="text-sm font-semibold">{feedback.title}</p>
          {feedback.description ? (
            <p className="text-sm opacity-90">{feedback.description}</p>
          ) : null}
        </div>
      </div>

      {onDismiss ? (
        <button
          type="button"
          onClick={onDismiss}
          className="rounded-lg p-1 opacity-70 transition hover:bg-white/50 hover:opacity-100"
          aria-label="Fechar mensagem"
        >
          <X className="h-4 w-4" />
        </button>
      ) : null}
    </section>
  );
}
