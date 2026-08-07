"use client";

import { useRef, useState } from "react";
import NextImage from "next/image";
import { Bold, Heading2, Heading3, List, Link2, Table as TableIcon, Quote, Image as ImageIcon, Eye, Pencil, Loader2, Plus, Trash2, X } from "lucide-react";
import { parseBlogContent, parseInlineSpans, type InlineSpan } from "@/lib/blogContent";

function applyToSelection(
  textarea: HTMLTextAreaElement,
  transform: (selected: string) => { text: string; selectStart?: number; selectEnd?: number }
) {
  const { value, selectionStart, selectionEnd } = textarea;
  const selected = value.slice(selectionStart, selectionEnd);
  const { text, selectStart, selectEnd } = transform(selected);

  const newValue = value.slice(0, selectionStart) + text + value.slice(selectionEnd);
  textarea.value = newValue;

  const cursorStart = selectStart ?? selectionStart + text.length;
  const cursorEnd = selectEnd ?? cursorStart;
  textarea.focus();
  textarea.setSelectionRange(cursorStart, cursorEnd);
  // The form/read-time logic listens for the native "input" event - the
  // programmatic .value set above doesn't fire it on its own.
  textarea.dispatchEvent(new Event("input", { bubbles: true }));
}

// Wraps the selection in `before`/`after` markers (bold, link, etc.),
// keeping any leading/trailing whitespace - crucially including newlines -
// outside the markers. Without this, selecting a whole line (which often
// captures its trailing "\n") would place the closing "**" on the next
// line; parseBlogContent then treats that as a separate paragraph, the
// regex never re-matches across blocks, and the raw "**" shows up
// literally on the published page instead of rendering as bold.
function wrapSelection(textarea: HTMLTextAreaElement, before: string, after: string, placeholder: string) {
  applyToSelection(textarea, (selected) => {
    const leadMatch = selected.match(/^\s*/);
    const trailMatch = selected.match(/\s*$/);
    const lead = leadMatch ? leadMatch[0] : "";
    const trail = trailMatch ? trailMatch[0] : "";
    const core = selected.slice(lead.length, selected.length - trail.length) || placeholder;

    const text = `${lead}${before}${core}${after}${trail}`;
    const selectStart = textarea.selectionStart + lead.length + before.length;
    return { text, selectStart, selectEnd: selectStart + core.length };
  });
}

// Prefixes every line touched by the current selection with `prefix`
// (used for headings and list items) - matches how a toolbar button in a
// WordPress-style editor applies formatting to whichever line(s) the
// cursor/selection is on, not just a literal text wrap.
function prefixLines(textarea: HTMLTextAreaElement, prefix: string) {
  const { value, selectionStart, selectionEnd } = textarea;
  const lineStart = value.lastIndexOf("\n", selectionStart - 1) + 1;
  const lineEndIdx = value.indexOf("\n", selectionEnd);
  const lineEnd = lineEndIdx === -1 ? value.length : lineEndIdx;

  const block = value.slice(lineStart, lineEnd);
  const prefixed = block
    .split("\n")
    .map((line) => (line.startsWith(prefix) ? line : `${prefix}${line}`))
    .join("\n");

  const newValue = value.slice(0, lineStart) + prefixed + value.slice(lineEnd);
  textarea.value = newValue;
  textarea.focus();
  textarea.setSelectionRange(lineStart, lineStart + prefixed.length);
  textarea.dispatchEvent(new Event("input", { bubbles: true }));
}

function InlineText({ spans }: { spans: InlineSpan[] }) {
  return (
    <>
      {spans.map((span, i) => {
        if (span.type === "bold") return <strong key={i}>{span.text}</strong>;
        if (span.type === "link")
          return (
            <span key={i} className="text-medsol-blue underline">
              {span.text}
            </span>
          );
        return <span key={i}>{span.text}</span>;
      })}
    </>
  );
}

function ContentPreview({ content }: { content: string }) {
  const blocks = parseBlogContent(content);

  if (blocks.length === 0) {
    return <p className="text-sm text-gray-400 italic">Nothing to preview yet.</p>;
  }

  return (
    <div className="space-y-4">
      {blocks.map((block, idx) => {
        if (block.type === "heading") {
          return block.level === 2 ? (
            <h2 key={idx} className="text-xl font-serif text-gray-900 pt-2">{block.text}</h2>
          ) : (
            <h3 key={idx} className="text-lg font-serif text-gray-900 pt-1">{block.text}</h3>
          );
        }
        if (block.type === "list") {
          return (
            <ul key={idx} className="list-disc list-outside pl-5 space-y-1 text-gray-700 text-sm">
              {block.items.map((item, i) => (
                <li key={i}>
                  <InlineText spans={parseInlineSpans(item)} />
                </li>
              ))}
            </ul>
          );
        }
        if (block.type === "quote") {
          return (
            <blockquote key={idx} className="border-l-2 border-medsol-gold pl-4 italic text-gray-600 text-sm">
              <InlineText spans={parseInlineSpans(block.text)} />
            </blockquote>
          );
        }
        if (block.type === "image") {
          return (
            <div key={idx} className="relative aspect-video overflow-hidden rounded-md border border-gray-200 bg-gray-100">
              {block.url !== "#" && (
                <NextImage src={block.url} alt={block.alt} fill sizes="600px" className="object-cover" />
              )}
            </div>
          );
        }
        if (block.type === "table") {
          return (
            <div key={idx} className="overflow-x-auto border border-gray-200 rounded-md">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-gray-50">
                    {block.headers.map((header, i) => (
                      <th key={i} className="px-3 py-2 font-medium text-gray-700 border-b border-gray-200">
                        <InlineText spans={parseInlineSpans(header)} />
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {block.rows.map((row, r) => (
                    <tr key={r} className="border-b border-gray-100 last:border-0">
                      {row.map((cell, c) => (
                        <td key={c} className="px-3 py-2 text-gray-600">
                          <InlineText spans={parseInlineSpans(cell)} />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        }
        return (
          <p key={idx} className="text-gray-700 text-sm leading-relaxed">
            <InlineText spans={parseInlineSpans(block.text)} />
          </p>
        );
      })}
    </div>
  );
}

// A pipe character would break the table's markdown syntax if typed into a
// cell - swapped for a slash rather than silently dropped, since a
// non-technical user has no way to know why their text disappeared.
function sanitizeCell(value: string): string {
  return value.replace(/\|/g, "/");
}

/**
 * A visual table builder - fills the gap for non-technical admins who have
 * no reason to know GFM pipe-table syntax. `data[0]` is the header row;
 * everything after is data rows. Produces the same "| a | b |" markdown
 * the parser already understands, but the admin never sees or types it.
 */
function TableBuilder({ onInsert, onCancel }: { onInsert: (markdown: string) => void; onCancel: () => void }) {
  const [data, setData] = useState<string[][]>([
    ["Column 1", "Column 2"],
    ["", ""],
  ]);

  const columnCount = data[0].length;

  const setCell = (row: number, col: number, value: string) => {
    setData((prev) => prev.map((r, ri) => (ri === row ? r.map((c, ci) => (ci === col ? value : c)) : r)));
  };

  const addRow = () => setData((prev) => [...prev, Array(columnCount).fill("")]);
  const removeRow = (row: number) => setData((prev) => prev.filter((_, ri) => ri !== row));
  const addColumn = () => setData((prev) => prev.map((r) => [...r, ""]));
  const removeColumn = (col: number) => setData((prev) => prev.map((r) => r.filter((_, ci) => ci !== col)));

  const handleInsert = () => {
    const [headers, ...rows] = data;
    const line = (cells: string[]) => `| ${cells.map((c) => sanitizeCell(c.trim()) || " ").join(" | ")} |`;
    const separator = `|${headers.map(() => "---").join("|")}|`;
    const markdown = ["", line(headers), separator, ...rows.map(line), ""].join("\n");
    onInsert(markdown);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4" onClick={onCancel}>
      <div
        className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[85vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
          <div>
            <h3 className="text-sm font-semibold text-gray-900">Add a table</h3>
            <p className="text-xs text-gray-400 mt-0.5">Fill in the cells below - no code needed.</p>
          </div>
          <button type="button" onClick={onCancel} className="text-gray-400 hover:text-gray-700" aria-label="Close">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-auto p-5">
          <table className="border-collapse">
            <tbody>
              {data.map((row, ri) => (
                <tr key={ri}>
                  {row.map((cell, ci) => (
                    <td key={ci} className="p-1">
                      <input
                        value={cell}
                        onChange={(e) => setCell(ri, ci, e.target.value)}
                        placeholder={ri === 0 ? `Column ${ci + 1}` : "—"}
                        className={`w-36 rounded border px-2 py-1.5 text-sm focus:outline-none focus:border-gray-900 ${
                          ri === 0 ? "border-gray-300 bg-gray-50 font-medium text-gray-900" : "border-gray-200 text-gray-700"
                        }`}
                      />
                    </td>
                  ))}
                  <td className="p-1">
                    {data.length > 2 && (
                      <button
                        type="button"
                        onClick={() => removeRow(ri)}
                        className="p-1.5 text-gray-300 hover:text-red-600"
                        aria-label={`Remove row ${ri + 1}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              <tr>
                {data[0].map((_, ci) => (
                  <td key={ci} className="p-1 text-center">
                    {columnCount > 1 && (
                      <button
                        type="button"
                        onClick={() => removeColumn(ci)}
                        className="p-1.5 text-gray-300 hover:text-red-600"
                        aria-label={`Remove column ${ci + 1}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>

          <div className="flex items-center gap-3 mt-3">
            <button
              type="button"
              onClick={addColumn}
              className="inline-flex items-center gap-1 text-xs font-medium text-gray-600 hover:text-gray-900"
            >
              <Plus className="w-3.5 h-3.5" /> Add column
            </button>
            <button
              type="button"
              onClick={addRow}
              className="inline-flex items-center gap-1 text-xs font-medium text-gray-600 hover:text-gray-900"
            >
              <Plus className="w-3.5 h-3.5" /> Add row
            </button>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 px-5 py-4 border-t border-gray-200">
          <button type="button" onClick={onCancel} className="text-sm text-gray-500 hover:text-gray-900">
            Cancel
          </button>
          <button
            type="button"
            onClick={handleInsert}
            className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
          >
            Insert Table
          </button>
        </div>
      </div>
    </div>
  );
}

function ToolbarButton({ label, onClick, children }: { label: string; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      onMouseDown={(e) => e.preventDefault()} // keep focus/selection in the textarea, not the button
      onClick={onClick}
      className="p-2 rounded hover:bg-gray-200 text-gray-600 hover:text-gray-900 transition-colors"
    >
      {children}
    </button>
  );
}

export default function BlogContentEditor({ initialContent, onChange }: { initialContent?: string; onChange: (value: string) => void }) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const [mode, setMode] = useState<"write" | "preview">("write");
  const [previewContent, setPreviewContent] = useState(initialContent ?? "");
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [tableBuilderOpen, setTableBuilderOpen] = useState(false);

  const withTextarea = (fn: (el: HTMLTextAreaElement) => void) => {
    const el = textareaRef.current;
    if (el) fn(el);
  };

  const insertImage = async (file: File) => {
    const el = textareaRef.current;
    if (!el) return;
    setUploadingImage(true);
    setUploadError(null);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/media/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) {
        setUploadError(data.error ?? "Upload failed.");
        return;
      }
      const alt = window.prompt("Alt text (for accessibility/SEO)", "") ?? "";
      applyToSelection(el, () => ({ text: `\n![${alt}](${data.url})\n` }));
    } catch {
      setUploadError("Upload failed.");
    } finally {
      setUploadingImage(false);
    }
  };

  return (
    <div>
      <div className="mt-1 flex items-center justify-between border border-gray-300 border-b-0 rounded-t-md bg-gray-50 px-2 py-1">
        <div className="flex items-center gap-1">
          <ToolbarButton label="Bold" onClick={() => withTextarea((el) => wrapSelection(el, "**", "**", "bold text"))}>
            <Bold className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton label="Heading" onClick={() => withTextarea((el) => prefixLines(el, "## "))}>
            <Heading2 className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton label="Subheading" onClick={() => withTextarea((el) => prefixLines(el, "### "))}>
            <Heading3 className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton label="Bulleted list" onClick={() => withTextarea((el) => prefixLines(el, "- "))}>
            <List className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton label="Quote" onClick={() => withTextarea((el) => prefixLines(el, "> "))}>
            <Quote className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton
            label="Link"
            onClick={() =>
              withTextarea((el) => {
                const url = window.prompt("Link URL (e.g. /omala-residences or https://...)");
                if (!url) return;
                wrapSelection(el, "[", `](${url})`, "link text");
              })
            }
          >
            <Link2 className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton label="Table" onClick={() => setTableBuilderOpen(true)}>
            <TableIcon className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton label="Insert image" onClick={() => imageInputRef.current?.click()}>
            {uploadingImage ? <Loader2 className="w-4 h-4 animate-spin" /> : <ImageIcon className="w-4 h-4" />}
          </ToolbarButton>
          <input
            ref={imageInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              e.target.value = ""; // allow re-selecting the same file later
              if (file) insertImage(file);
            }}
          />
        </div>

        <div className="flex items-center gap-1 text-xs">
          <button
            type="button"
            onClick={() => setMode("write")}
            className={`inline-flex items-center gap-1 px-2 py-1 rounded ${mode === "write" ? "bg-gray-900 text-white" : "text-gray-500 hover:bg-gray-200"}`}
          >
            <Pencil className="w-3 h-3" /> Write
          </button>
          <button
            type="button"
            onClick={() => {
              setPreviewContent(textareaRef.current?.value ?? "");
              setMode("preview");
            }}
            className={`inline-flex items-center gap-1 px-2 py-1 rounded ${mode === "preview" ? "bg-gray-900 text-white" : "text-gray-500 hover:bg-gray-200"}`}
          >
            <Eye className="w-3 h-3" /> Preview
          </button>
        </div>
      </div>

      {uploadError && <p className="text-xs text-red-600 border border-gray-300 border-t-0 px-3 py-1 bg-red-50">{uploadError}</p>}

      <textarea
        ref={textareaRef}
        name="content"
        required
        rows={16}
        defaultValue={initialContent}
        onChange={(e) => onChange(e.target.value)}
        className={`block w-full rounded-b-md border border-gray-300 px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-gray-900 focus:outline-none font-mono ${mode === "preview" ? "hidden" : ""}`}
      />
      {mode === "preview" && (
        <div className="rounded-b-md border border-gray-300 px-4 py-4 bg-white min-h-[24rem]">
          <ContentPreview content={previewContent} />
        </div>
      )}

      {tableBuilderOpen && (
        <TableBuilder
          onCancel={() => setTableBuilderOpen(false)}
          onInsert={(markdown) => {
            withTextarea((el) => applyToSelection(el, () => ({ text: markdown })));
            setTableBuilderOpen(false);
          }}
        />
      )}
    </div>
  );
}
