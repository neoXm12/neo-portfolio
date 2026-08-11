import { useEffect } from "react";

/**
 * Fades in every `.reveal` element once it scrolls into view.
 *
 * Re-runs whenever `key` changes (we pass the route pathname) so sections
 * mounted by a different route get observed too. A MutationObserver picks up
 * `.reveal` elements added later — the dashboard renders its charts only after
 * its data resolves, and those would otherwise never be observed and so stay
 * permanently invisible. Anything still hidden at teardown is revealed, so a
 * route change can never leave content stuck at zero opacity.
 */
const useRevealOnScroll = (key) => {
  useEffect(() => {
    const observed = new Set();

    const prefersReducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    const intersectionObserver = prefersReducedMotion
      ? null
      : new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                entry.target.classList.add("visible");
                intersectionObserver.unobserve(entry.target);
                observed.delete(entry.target);
              }
            });
          },
          { threshold: 0.18 }
        );

    const register = () => {
      document.querySelectorAll(".reveal:not(.visible)").forEach((target) => {
        if (observed.has(target)) return;
        if (!intersectionObserver) {
          target.classList.add("visible");
          return;
        }
        observed.add(target);
        intersectionObserver.observe(target);
      });
    };

    register();

    const mutationObserver = new MutationObserver(register);
    mutationObserver.observe(document.body, { childList: true, subtree: true });

    return () => {
      mutationObserver.disconnect();
      intersectionObserver?.disconnect();
      observed.forEach((target) => target.classList.add("visible"));
    };
  }, [key]);
};

export default useRevealOnScroll;
