import { useEffect } from "react";

const DEFAULT_TITLE =
  "Nirmad Mudvari | Senior QA Automation Engineer & Test Architecture Leader";

/** Sets the tab title for a route and restores the site default on unmount. */
const useDocumentTitle = (title) => {
  useEffect(() => {
    document.title = title;
    return () => {
      document.title = DEFAULT_TITLE;
    };
  }, [title]);
};

export default useDocumentTitle;
