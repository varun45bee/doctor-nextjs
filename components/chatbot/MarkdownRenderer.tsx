"use client";

import React, { useState } from "react";
import { Check, Copy } from "lucide-react";

interface MarkdownRendererProps {
  content: string;
}

function CodeBlock({ code, language }: { code: string; language: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback if clipboard API is restricted
      const el = document.createElement("textarea");
      el.value = code;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="relative my-2.5 rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-700 bg-zinc-900 text-zinc-100 font-mono text-xs shadow-xs">
      <div className="flex items-center justify-between px-3 py-1.5 bg-zinc-800/90 border-b border-zinc-700 text-[11px] text-zinc-400">
        <span className="font-semibold uppercase tracking-wider text-emerald-400">
          {language || "code"}
        </span>
        <button
          type="button"
          onClick={handleCopy}
          className="flex items-center gap-1 text-[11px] hover:text-white transition-colors cursor-pointer py-0.5 px-1.5 rounded hover:bg-zinc-700"
          title="Copy code"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400 font-medium">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
      <pre className="p-3 overflow-x-auto text-xs leading-relaxed text-zinc-200">
        <code>{code}</code>
      </pre>
    </div>
  );
}

/**
 * Parses inline formatting: **bold**, *italic*, `inline code`, and URLs
 */
function renderInlineText(text: string): React.ReactNode[] {
  // Regex splitting on code, bold, italic, and URLs
  const tokens = text.split(/(`[^`]+`|\*\*[^*]+\*\*|\*[^*]+\*|https?:\/\/[^\s]+)/g);

  return tokens.map((token, index) => {
    if (!token) return null;

    // Inline Code
    if (token.startsWith("`") && token.endsWith("`") && token.length > 2) {
      return (
        <code
          key={index}
          className="px-1.5 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/50 text-[#103b2b] dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/60 font-mono text-[11.5px] font-medium"
        >
          {token.slice(1, -1)}
        </code>
      );
    }

    // Bold
    if (token.startsWith("**") && token.endsWith("**") && token.length > 4) {
      return (
        <strong key={index} className="font-semibold text-zinc-900 dark:text-zinc-50">
          {token.slice(2, -2)}
        </strong>
      );
    }

    // Italic
    if (token.startsWith("*") && token.endsWith("*") && token.length > 2) {
      return (
        <em key={index} className="italic text-zinc-800 dark:text-zinc-200">
          {token.slice(1, -1)}
        </em>
      );
    }

    // URL links
    if (/^https?:\/\/[^\s]+$/.test(token)) {
      return (
        <a
          key={index}
          href={token}
          target="_blank"
          rel="noopener noreferrer"
          className="text-emerald-700 dark:text-emerald-400 underline underline-offset-2 hover:text-emerald-900 dark:hover:text-emerald-300 transition-colors"
        >
          {token}
        </a>
      );
    }

    return <React.Fragment key={index}>{token}</React.Fragment>;
  });
}

/**
 * Enterprise Markdown Parser and Renderer
 * Handles Headings, Bold/Italics, Lists (ordered & unordered), Tables, Blockquotes, and Code Blocks.
 */
export default function MarkdownRenderer({ content }: MarkdownRendererProps) {
  if (!content) return null;

  const rawLines = content.split("\n");
  const nodes: React.ReactNode[] = [];
  let i = 0;

  while (i < rawLines.length) {
    const line = rawLines[i];
    const trimmed = line.trim();

    // 1. Code Block (```lang)
    if (trimmed.startsWith("```")) {
      const language = trimmed.slice(3).trim();
      const codeLines: string[] = [];
      i++;
      while (i < rawLines.length && !rawLines[i].trim().startsWith("```")) {
        codeLines.push(rawLines[i]);
        i++;
      }
      i++; // skip closing ```
      nodes.push(
        <CodeBlock
          key={`code-${i}`}
          code={codeLines.join("\n")}
          language={language}
        />
      );
      continue;
    }

    // 2. Table (| Header 1 | Header 2 | ...)
    if (trimmed.startsWith("|") && trimmed.endsWith("|")) {
      const tableLines: string[] = [];
      while (i < rawLines.length && rawLines[i].trim().startsWith("|") && rawLines[i].trim().endsWith("|")) {
        tableLines.push(rawLines[i].trim());
        i++;
      }

      // Check if second line is a separator like |---|---|
      const isTable = tableLines.length >= 2 && /^\|[\s-:]+\|/.test(tableLines[1]);
      if (isTable) {
        const headerRow = tableLines[0]
          .slice(1, -1)
          .split("|")
          .map((c) => c.trim());
        const dataRows = tableLines.slice(2).map((rowStr) =>
          rowStr
            .slice(1, -1)
            .split("|")
            .map((c) => c.trim())
        );

        nodes.push(
          <div key={`table-${i}`} className="my-2.5 overflow-x-auto rounded-xl border border-emerald-200 dark:border-zinc-700 shadow-2xs">
            <table className="min-w-full text-left text-xs divide-y divide-emerald-200 dark:divide-zinc-700">
              <thead className="bg-[#eaf4ee] dark:bg-emerald-950/40 text-[#103b2b] dark:text-emerald-200 font-semibold">
                <tr>
                  {headerRow.map((h, hIdx) => (
                    <th key={hIdx} className="px-3 py-2 text-xs font-semibold">
                      {renderInlineText(h)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-700/60 bg-white dark:bg-zinc-800">
                {dataRows.map((cols, rIdx) => (
                  <tr
                    key={rIdx}
                    className={rIdx % 2 === 0 ? "bg-white dark:bg-zinc-800" : "bg-emerald-50/30 dark:bg-zinc-800/50"}
                  >
                    {cols.map((col, cIdx) => (
                      <td key={cIdx} className="px-3 py-2 text-xs text-zinc-700 dark:text-zinc-200">
                        {renderInlineText(col)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
        continue;
      }
    }

    // 3. Headings (#, ##, ###)
    if (trimmed.startsWith("### ")) {
      nodes.push(
        <h4
          key={`h4-${i}`}
          className="text-xs sm:text-sm font-bold text-[#103b2b] dark:text-emerald-300 mt-2 mb-1 tracking-tight"
        >
          {renderInlineText(trimmed.replace(/^###\s+/, ""))}
        </h4>
      );
      i++;
      continue;
    }
    if (trimmed.startsWith("## ")) {
      nodes.push(
        <h3
          key={`h3-${i}`}
          className="text-sm sm:text-base font-bold text-[#103b2b] dark:text-emerald-200 mt-2.5 mb-1 tracking-tight"
        >
          {renderInlineText(trimmed.replace(/^##\s+/, ""))}
        </h3>
      );
      i++;
      continue;
    }
    if (trimmed.startsWith("# ")) {
      nodes.push(
        <h2
          key={`h2-${i}`}
          className="text-base sm:text-lg font-bold text-[#103b2b] dark:text-emerald-100 mt-3 mb-1.5 tracking-tight"
        >
          {renderInlineText(trimmed.replace(/^#\s+/, ""))}
        </h2>
      );
      i++;
      continue;
    }

    // 4. Blockquotes (> ...)
    if (trimmed.startsWith("> ")) {
      const quoteLines: string[] = [];
      while (i < rawLines.length && rawLines[i].trim().startsWith("> ")) {
        quoteLines.push(rawLines[i].trim().replace(/^>\s*/, ""));
        i++;
      }
      nodes.push(
        <blockquote
          key={`quote-${i}`}
          className="my-1.5 border-l-3 border-emerald-600 dark:border-emerald-500 pl-3 py-0.5 italic text-zinc-600 dark:text-zinc-300 text-xs sm:text-sm bg-emerald-50/30 dark:bg-emerald-950/20 rounded-r-lg"
        >
          {quoteLines.map((ql, qIdx) => (
            <p key={qIdx}>{renderInlineText(ql)}</p>
          ))}
        </blockquote>
      );
      continue;
    }

    // 5. Unordered List (- item or * item)
    if (/^[-*]\s+/.test(trimmed)) {
      const listItems: string[] = [];
      while (i < rawLines.length && /^[-*]\s+/.test(rawLines[i].trim())) {
        listItems.push(rawLines[i].trim().replace(/^[-*]\s+/, ""));
        i++;
      }
      nodes.push(
        <ul key={`ul-${i}`} className="my-1.5 space-y-1 pl-4 list-disc marker:text-emerald-600 dark:marker:text-emerald-400 text-xs sm:text-sm">
          {listItems.map((item, idx) => (
            <li key={idx} className="leading-relaxed text-zinc-800 dark:text-zinc-200">
              {renderInlineText(item)}
            </li>
          ))}
        </ul>
      );
      continue;
    }

    // 6. Ordered List (1. item, 2. item)
    if (/^\d+\.\s+/.test(trimmed)) {
      const listItems: string[] = [];
      while (i < rawLines.length && /^\d+\.\s+/.test(rawLines[i].trim())) {
        listItems.push(rawLines[i].trim().replace(/^\d+\.\s+/, ""));
        i++;
      }
      nodes.push(
        <ol key={`ol-${i}`} className="my-1.5 space-y-1 pl-4 list-decimal marker:text-emerald-700 dark:marker:text-emerald-400 marker:font-semibold text-xs sm:text-sm">
          {listItems.map((item, idx) => (
            <li key={idx} className="leading-relaxed text-zinc-800 dark:text-zinc-200">
              {renderInlineText(item)}
            </li>
          ))}
        </ol>
      );
      continue;
    }

    // 7. Empty line / Paragraph spacing
    if (!trimmed) {
      nodes.push(<div key={`empty-${i}`} className="h-1.5" />);
      i++;
      continue;
    }

    // 8. Regular text paragraph
    nodes.push(
      <p key={`p-${i}`} className="leading-relaxed text-xs sm:text-sm text-zinc-800 dark:text-zinc-100 font-normal">
        {renderInlineText(line)}
      </p>
    );
    i++;
  }

  return <div className="space-y-1">{nodes}</div>;
}

