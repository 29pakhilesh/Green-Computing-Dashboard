import { useEffect, useState } from "react";

interface VoiceNarratorProps {
  text: string;
}

export function VoiceNarrator({ text }: VoiceNarratorProps) {
  const [enabled, setEnabled] = useState(false);
  const [supported, setSupported] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      setSupported(true);
    }
  }, []);

  useEffect(() => {
    if (!enabled || !supported) return;
    if (typeof window === "undefined") return;

    const synth = window.speechSynthesis;
    synth.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.05;
    utterance.pitch = 1;
    synth.speak(utterance);

    return () => synth.cancel();
  }, [enabled, supported, text]);

  if (!supported) {
    return null;
  }

  return (
    <button
      type="button"
      onClick={() => setEnabled((v) => !v)}
      className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] font-medium shadow-sm transition-colors ${
        enabled
          ? "border-emerald-400/80 bg-emerald-500/15 text-emerald-200"
          : "border-slate-700 bg-slate-900/80 text-slate-300 hover:border-emerald-500/70 hover:text-emerald-200"
      }`}
      aria-pressed={enabled}
    >
      <span>{enabled ? "Voice on" : "Voice off"}</span>
    </button>
  );
}

