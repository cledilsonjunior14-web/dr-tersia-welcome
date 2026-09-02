import { useEffect, useState } from "react";

const SESSION_KEY = "exit_intent_shown";

export function useExitIntent(disabled = false) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (disabled) return;
    // Só dispara uma vez por sessão
    if (sessionStorage.getItem(SESSION_KEY)) return;

    let timer: ReturnType<typeof setTimeout>;

    // ── Desktop: mouse sai pelo topo da janela ──
    function handleMouseLeave(e: MouseEvent) {
      if (e.clientY < 5 && e.relatedTarget === null) {
        trigger();
      }
    }

    // ── Mobile/tab: aba vai para segundo plano ──
    function handleVisibility() {
      if (document.hidden) trigger();
    }

    // Aguarda 5s antes de ativar (evita disparar em recarregamentos rápidos)
    timer = setTimeout(() => {
      document.addEventListener("mouseleave", handleMouseLeave);
      document.addEventListener("visibilitychange", handleVisibility);
    }, 5000);

    function trigger() {
      sessionStorage.setItem(SESSION_KEY, "1");
      setShow(true);
    }

    return () => {
      clearTimeout(timer);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [disabled]);

  function dismiss() {
    setShow(false);
  }

  return { show, dismiss };
}
