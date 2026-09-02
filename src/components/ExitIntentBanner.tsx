import { X, ArrowRight, Clock } from "lucide-react";

interface ExitIntentBannerProps {
  onSchedule: () => void;
  onDismiss: () => void;
}

export function ExitIntentBanner({ onSchedule, onDismiss }: ExitIntentBannerProps) {
  return (
    /* Overlay */
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-wine-deep/40 backdrop-blur-[2px] sm:items-center sm:p-8"
      onClick={(e) => { if (e.target === e.currentTarget) onDismiss(); }}
    >
      {/* Banner */}
      <div
        className="animate-fade-up relative w-full max-w-lg bg-background"
        style={{
          boxShadow: "0 -8px 60px -10px oklch(0.309 0.062 22 / 0.45)",
        }}
      >
        {/* Acento vinho no topo */}
        <div className="h-[3px] w-full bg-wine" />

        {/* Fechar */}
        <button
          onClick={onDismiss}
          aria-label="Fechar"
          className="absolute right-4 top-4 text-foreground/30 transition-colors hover:text-foreground/60"
        >
          <X size={16} strokeWidth={1.8} />
        </button>

        <div className="px-7 py-8 sm:px-10">
          {/* Ícone */}
          <div className="mb-5 flex h-11 w-11 items-center justify-center border border-wine/25 bg-cream/70">
            <Clock size={20} strokeWidth={1.5} className="text-wine" />
          </div>

          {/* Headline */}
          <p className="eyebrow text-wine">Antes de ir...</p>
          <h2 className="mt-2 font-display text-xl font-bold leading-snug text-wine-deep sm:text-2xl">
            Vai deixar sua saúde<br />
            para depois?
          </h2>

          {/* Subtexto */}
          <p className="mt-3 max-w-sm text-[13px] leading-relaxed text-foreground/60">
            Cuidar da sua saúde nunca deve esperar.
            Agendar sua primeira consulta leva menos de <strong className="font-semibold text-foreground/80">2 minutos</strong>.
          </p>

          {/* Separador */}
          <div className="my-6 h-px w-full bg-sand/60" />

          {/* CTAs */}
          <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center">
            <button
              onClick={onSchedule}
              className="group flex flex-1 items-center justify-center gap-2 bg-wine px-6 py-4 font-display text-[11px] font-bold tracking-[0.15em] text-primary-foreground transition-all duration-200 hover:bg-wine-deep"
            >
              AGENDAR AGORA
              <ArrowRight
                size={13}
                strokeWidth={2.5}
                className="transition-transform duration-200 group-hover:translate-x-0.5"
              />
            </button>

            <button
              onClick={onDismiss}
              className="px-4 py-4 text-[11px] font-medium tracking-wide text-foreground/40 transition-colors hover:text-foreground/60 sm:py-0"
            >
              Deixar para depois
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
