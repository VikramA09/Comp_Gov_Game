import { WORKS_CITED } from "@content/gameContent";

const URL_RE = /(https?:\/\/[^\s]+)/g;

function hrefFromUrl(raw: string): string {
  return raw.replace(/[.,;)\]]+$/, "");
}

function CitationEntry({ text }: { text: string }) {
  const parts = text.split(URL_RE);
  return (
    <li className="leading-relaxed">
      {parts.map((part, i) =>
        /^https?:\/\//.test(part) ? (
          <a
            key={i}
            href={hrefFromUrl(part)}
            target="_blank"
            rel="noreferrer"
            className="text-regime-gold underline hover:text-white"
          >
            {part}
          </a>
        ) : (
          <span key={i}>{part}</span>
        ),
      )}
    </li>
  );
}

export function WorksCited() {
  return (
    <ol className="list-decimal space-y-4 pl-5 text-sm text-white/85 marker:text-regime-gold">
      {WORKS_CITED.map((entry, i) => (
        <CitationEntry key={i} text={entry} />
      ))}
    </ol>
  );
}
