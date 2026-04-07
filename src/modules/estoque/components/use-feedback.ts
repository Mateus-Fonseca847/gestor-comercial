"use client";

import { useEffect, useState } from "react";
import type { EstoqueFeedbackState, EstoqueFeedbackTone } from "@/modules/estoque/components/feedback-banner";

type ShowFeedbackInput = {
  tone: EstoqueFeedbackTone;
  title: string;
  description?: string;
};

export function useFeedback(timeoutMs = 3000) {
  const [feedback, setFeedback] = useState<EstoqueFeedbackState>(null);

  useEffect(() => {
    if (!feedback) {
      return;
    }

    const timeout = window.setTimeout(() => setFeedback(null), timeoutMs);
    return () => window.clearTimeout(timeout);
  }, [feedback, timeoutMs]);

  function showFeedback(input: ShowFeedbackInput) {
    setFeedback(input);
  }

  function clearFeedback() {
    setFeedback(null);
  }

  return {
    feedback,
    showFeedback,
    clearFeedback,
  };
}
