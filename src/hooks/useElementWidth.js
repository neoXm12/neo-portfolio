import { useEffect, useRef, useState } from "react";

/**
 * Tracks an element's content width so charts can render SVG at true pixel size
 * rather than scaling a fixed viewBox (which would distort label typography).
 * Returns `[ref, width]`; width is 0 until the first measurement lands.
 */
const useElementWidth = () => {
  const ref = useRef(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const node = ref.current;
    if (!node) return undefined;

    const measure = () => setWidth(node.clientWidth);
    measure();

    if (typeof ResizeObserver === "undefined") {
      window.addEventListener("resize", measure);
      return () => window.removeEventListener("resize", measure);
    }

    const observer = new ResizeObserver(measure);
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return [ref, width];
};

export default useElementWidth;
