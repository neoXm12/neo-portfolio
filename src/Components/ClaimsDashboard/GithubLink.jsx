/* eslint-disable react/prop-types */
import { PRIVATE_REPO_NOTE, isPrivateRepo } from "../../data/repoLinks";

const GithubMark = () => (
  <svg viewBox="0 0 16 16" aria-hidden="true" focusable="false" className="gh-mark">
    <path
      fill="currentColor"
      d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z"
    />
  </svg>
);

const LockMark = () => (
  <svg viewBox="0 0 16 16" aria-hidden="true" focusable="false" className="gh-mark">
    <path
      fill="currentColor"
      d="M8 1a3.5 3.5 0 0 0-3.5 3.5V6H4a1.5 1.5 0 0 0-1.5 1.5v6A1.5 1.5 0 0 0 4 15h8a1.5 1.5 0 0 0 1.5-1.5v-6A1.5 1.5 0 0 0 12 6h-.5V4.5A3.5 3.5 0 0 0 8 1Zm2 5H6V4.5a2 2 0 1 1 4 0V6Z"
    />
  </svg>
);

/**
 * Link to source. Public repos link out in a new tab; references to a repo
 * that isn't published render as a greyed, unlinked label instead — a link
 * that 404s reads as broken, where an explicit "private" reads as deliberate.
 */
const GithubLink = ({ href, children, className = "", showMark = true }) => {
  if (isPrivateRepo(href)) {
    return (
      <span className={`gh-link gh-link-locked ${className}`.trim()} data-note={PRIVATE_REPO_NOTE}>
        {showMark && <LockMark />}
        <span>{children}</span>
        <span className="gh-locked-tag">private</span>
        <span className="visually-hidden"> — {PRIVATE_REPO_NOTE}</span>
      </span>
    );
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`gh-link ${className}`.trim()}
    >
      {showMark && <GithubMark />}
      <span>{children}</span>
      <span className="visually-hidden"> (opens in a new tab)</span>
    </a>
  );
};

export default GithubLink;
