import { WORKS_CITED } from "@content/gameContent";

export function WorksCited() {
  return (
    <ul className="space-y-2 break-all text-sm text-white/85">
      {WORKS_CITED.map((line, i) =>
        /^https?:\/\//.test(line) ? (
          <li key={i} className="pl-4">
            <a href={line} target="_blank" rel="noreferrer" className="text-regime-gold underline hover:text-white">
              {line}
            </a>
          </li>
        ) : (
          <li key={i} className="font-semibold">
            {line}
          </li>
        ),
      )}
    </ul>
  );
}
