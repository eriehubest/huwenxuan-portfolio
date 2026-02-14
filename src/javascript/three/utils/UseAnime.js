import { useLayoutEffect, useRef } from "react";
import anime from "animejs";

export function useAnime(effect, deps = []) {
  const scopeRef = useRef(null);

  useLayoutEffect(() => {
    const scope = scopeRef.current;
    if (!scope) return;

    const ctx = {
      anime,
      scope,
      q: (sel) => scope.querySelector(sel),
      qa: (sel) => Array.from(scope.querySelectorAll(sel)),
    };

    const cleanup = effect(ctx);

    return () => {
      // stop any running animations inside this scope
      anime.remove(scope.querySelectorAll("*"));
      if (typeof cleanup === "function") cleanup();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return scopeRef;
}
