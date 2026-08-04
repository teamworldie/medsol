"use client";

import { useFormState, useFormStatus } from "react-dom";
import Link from "next/link";
import { useState } from "react";
import { addPropertyType, addPropertyFeature } from "@/app/actions/propertyOptions";

const PROPERTY_STATUSES = ["AVAILABLE", "RESERVED", "SOLD"];

type FormActionState = { error?: string } | undefined;

async function uploadFile(file: File, kind: "image" | "pdf" = "image"): Promise<{ url?: string; error?: string }> {
  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("kind", kind);
    const res = await fetch("/api/media/upload", { method: "POST", body: formData });
    const data = await res.json();
    if (!res.ok) return { error: data.error ?? "Upload failed." };
    return { url: data.url };
  } catch {
    return { error: "Upload failed." };
  }
}

function FeaturedImageField({ initialUrl }: { initialUrl?: string | null }) {
  const [url, setUrl] = useState(initialUrl ?? "");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFile = async (file: File) => {
    setUploading(true);
    setError(null);
    const result = await uploadFile(file);
    if (result.error) setError(result.error);
    else if (result.url) setUrl(result.url);
    setUploading(false);
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">Featured Image</label>
      <p className="mt-1 text-xs text-gray-400">The main hero image shown on the listing.</p>
      <input type="hidden" name="featuredImage" value={url} />
      <div className="mt-2 flex items-start gap-4">
        {url && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={url} alt="Featured" className="h-20 w-20 rounded-md object-cover border border-gray-200" />
        )}
        <div>
          <label
            className={`inline-flex items-center gap-2 rounded-md border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 ${
              uploading ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-50 cursor-pointer"
            }`}
          >
            {uploading ? "Uploading..." : url ? "Replace Image" : "Upload Image"}
            <input
              type="file"
              accept="image/*"
              disabled={uploading}
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFile(file);
              }}
            />
          </label>
          {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
        </div>
      </div>
    </div>
  );
}

function FloorplanImageField({ initialUrl }: { initialUrl?: string | null }) {
  const [url, setUrl] = useState(initialUrl ?? "");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFile = async (file: File) => {
    setUploading(true);
    setError(null);
    const result = await uploadFile(file);
    if (result.error) setError(result.error);
    else if (result.url) setUrl(result.url);
    setUploading(false);
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">Floorplan Image</label>
      <p className="mt-1 text-xs text-gray-400">Shown alongside the surface-area table on the property page.</p>
      <input type="hidden" name="floorplanImage" value={url} />
      <div className="mt-2 flex items-start gap-4">
        {url && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={url} alt="Floorplan" className="h-20 w-20 rounded-md object-cover border border-gray-200" />
        )}
        <div>
          <label
            className={`inline-flex items-center gap-2 rounded-md border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 ${
              uploading ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-50 cursor-pointer"
            }`}
          >
            {uploading ? "Uploading..." : url ? "Replace Floorplan" : "Upload Floorplan"}
            <input
              type="file"
              accept="image/*"
              disabled={uploading}
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFile(file);
              }}
            />
          </label>
          {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
        </div>
      </div>
    </div>
  );
}

function PdfField({ initialUrl }: { initialUrl?: string | null }) {
  const [url, setUrl] = useState(initialUrl ?? "");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFile = async (file: File) => {
    setUploading(true);
    setError(null);
    const result = await uploadFile(file, "pdf");
    if (result.error) setError(result.error);
    else if (result.url) setUrl(result.url);
    setUploading(false);
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">Specs / Brochure PDF</label>
      <p className="mt-1 text-xs text-gray-400">Offered as a download from the property page.</p>
      <input type="hidden" name="pdfUrl" value={url} />
      <div className="mt-2 flex items-center gap-4">
        {url && (
          <a href={url} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline">
            View current PDF
          </a>
        )}
        <div>
          <label
            className={`inline-flex items-center gap-2 rounded-md border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 ${
              uploading ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-50 cursor-pointer"
            }`}
          >
            {uploading ? "Uploading..." : url ? "Replace PDF" : "Upload PDF"}
            <input
              type="file"
              accept=".pdf,application/pdf"
              disabled={uploading}
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFile(file);
              }}
            />
          </label>
          {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
        </div>
      </div>
    </div>
  );
}

type AreaRow = { label: string; value: string; type: "" | "header" | "total" };

function parseAreaRows(raw: string | null | undefined): AreaRow[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.map((row) => ({
      label: typeof row?.label === "string" ? row.label : "",
      value: typeof row?.value === "string" ? row.value : "",
      type: row?.type === "header" || row?.type === "total" ? row.type : "",
    }));
  } catch {
    return [];
  }
}

function AreaDataField({ initialAreaData }: { initialAreaData?: string | null }) {
  const [rows, setRows] = useState<AreaRow[]>(() => parseAreaRows(initialAreaData));

  const updateRow = (index: number, patch: Partial<AreaRow>) => {
    setRows((prev) => prev.map((row, i) => (i === index ? { ...row, ...patch } : row)));
  };

  const addRow = () => setRows((prev) => [...prev, { label: "", value: "", type: "" }]);
  const removeRow = (index: number) => setRows((prev) => prev.filter((_, i) => i !== index));

  const serialized = JSON.stringify(
    rows
      .filter((row) => row.label.trim() || row.value.trim())
      .map((row) => (row.type ? row : { label: row.label, value: row.value }))
  );

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">Surface Area Table</label>
      <p className="mt-1 text-xs text-gray-400">
        Room-by-room breakdown shown next to the floorplan. Mark section headers and the final total row with a type.
      </p>
      <input type="hidden" name="areaData" value={serialized} />

      <div className="mt-3 space-y-2">
        {rows.map((row, i) => (
          <div key={i} className="flex items-center gap-2">
            <input
              value={row.label}
              onChange={(e) => updateRow(i, { label: e.target.value })}
              placeholder="Label, e.g. Bedroom 1"
              className="block w-full rounded-md border border-gray-300 pl-3 pr-2 py-1.5 text-sm text-gray-900 shadow-sm focus:border-gray-900 focus:outline-none"
            />
            <input
              value={row.value}
              onChange={(e) => updateRow(i, { value: e.target.value })}
              placeholder="Value, e.g. 14,20m"
              className="block w-40 shrink-0 rounded-md border border-gray-300 pl-3 pr-2 py-1.5 text-sm text-gray-900 shadow-sm focus:border-gray-900 focus:outline-none"
            />
            <select
              value={row.type}
              onChange={(e) => updateRow(i, { type: e.target.value as AreaRow["type"] })}
              className="block w-32 shrink-0 rounded-md border border-gray-300 pl-2 pr-1 py-1.5 text-sm text-gray-900 shadow-sm focus:border-gray-900 focus:outline-none"
            >
              <option value="">Normal row</option>
              <option value="header">Section header</option>
              <option value="total">Total row</option>
            </select>
            <button
              type="button"
              onClick={() => removeRow(i)}
              className="shrink-0 h-8 w-8 rounded-md border border-gray-300 text-gray-500 hover:bg-gray-50"
              aria-label="Remove row"
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={addRow}
        className="mt-3 rounded-md border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
      >
        Add Row
      </button>
    </div>
  );
}

function parseJsonStringArray(raw: string | null | undefined): string[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function GalleryField({ initialImages }: { initialImages?: string | null }) {
  const [urls, setUrls] = useState<string[]>(() => parseJsonStringArray(initialImages));
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFiles = async (files: FileList) => {
    setUploading(true);
    setError(null);
    const uploaded: string[] = [];
    for (const file of Array.from(files)) {
      const result = await uploadFile(file);
      if (result.error) setError(result.error);
      else if (result.url) uploaded.push(result.url);
    }
    if (uploaded.length > 0) setUrls((prev) => [...prev, ...uploaded]);
    setUploading(false);
  };

  const removeAt = (index: number) => {
    setUrls((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">Gallery</label>
      <p className="mt-1 text-xs text-gray-400">Additional photos shown in the property gallery.</p>
      <input type="hidden" name="images" value={urls.join(",")} />

      {urls.length > 0 && (
        <div className="mt-3 grid grid-cols-4 sm:grid-cols-6 gap-3">
          {urls.map((url, i) => (
            <div key={url + i} className="relative group">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={url} alt="" className="aspect-square w-full rounded-md object-cover border border-gray-200" />
              <button
                type="button"
                onClick={() => removeAt(i)}
                className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-gray-900 text-white text-xs leading-5 opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label="Remove image"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      <label
        className={`mt-3 inline-flex items-center gap-2 rounded-md border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 ${
          uploading ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-50 cursor-pointer"
        }`}
      >
        {uploading ? "Uploading..." : "Add Photos"}
        <input
          type="file"
          accept="image/*"
          multiple
          disabled={uploading}
          className="hidden"
          onChange={(e) => {
            const files = e.target.files;
            if (files && files.length > 0) handleFiles(files);
            e.target.value = "";
          }}
        />
      </label>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}

function OptionChecklist({
  name,
  options,
  initialSelected,
  addOption,
  addPlaceholder,
}: {
  name: string;
  options: string[];
  initialSelected: string[];
  addOption: (name: string) => Promise<{ success: boolean; error?: string }>;
  addPlaceholder: string;
}) {
  const [allOptions, setAllOptions] = useState(options);
  const [selected, setSelected] = useState<Set<string>>(new Set(initialSelected));
  const [newValue, setNewValue] = useState("");
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const query = search.trim().toLowerCase();
  const visibleOptions = query ? allOptions.filter((opt) => opt.toLowerCase().includes(query)) : allOptions;
  // Selected options hidden by the search filter still need to submit with the form,
  // so keep them as hidden inputs even while they're not shown in the checklist grid.
  const hiddenSelected = query ? [...selected].filter((opt) => !visibleOptions.includes(opt)) : [];

  const toggle = (opt: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(opt)) next.delete(opt);
      else next.add(opt);
      return next;
    });
  };

  const handleAdd = async () => {
    const trimmed = newValue.trim();
    if (!trimmed) return;
    setAdding(true);
    setError(null);
    const result = await addOption(trimmed);
    if (!result.success) {
      setError(result.error ?? "Failed to add.");
    } else {
      setAllOptions((prev) => (prev.includes(trimmed) ? prev : [...prev, trimmed]));
      setSelected((prev) => new Set(prev).add(trimmed));
      setNewValue("");
    }
    setAdding(false);
  };

  return (
    <div>
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search..."
        className="mb-2 block w-full rounded-md border border-gray-300 pl-3 pr-8 py-1.5 text-sm text-gray-900 shadow-sm focus:border-gray-900 focus:outline-none"
      />

      {hiddenSelected.map((opt) => (
        <input key={opt} type="hidden" name={name} value={opt} />
      ))}

      <div className="max-h-56 overflow-y-auto rounded-md border border-gray-200 p-3 grid grid-cols-2 sm:grid-cols-3 gap-x-3 gap-y-2">
        {visibleOptions.length === 0 ? (
          <p className="col-span-full text-sm text-gray-400 py-2">No matches.</p>
        ) : (
          visibleOptions.map((opt) => (
            <label key={opt} className="flex items-center gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                name={name}
                value={opt}
                checked={selected.has(opt)}
                onChange={() => toggle(opt)}
                className="h-4 w-4 shrink-0"
              />
              <span className="truncate">{opt}</span>
            </label>
          ))
        )}
      </div>

      <div className="mt-3 flex items-center gap-2">
        <input
          value={newValue}
          onChange={(e) => setNewValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleAdd();
            }
          }}
          placeholder={addPlaceholder}
          disabled={adding}
          className="block w-full rounded-md border border-gray-300 pl-3 pr-8 py-2 text-sm text-gray-900 shadow-sm focus:border-gray-900 focus:outline-none"
        />
        <button
          type="button"
          onClick={handleAdd}
          disabled={adding || !newValue.trim()}
          className="shrink-0 rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
        >
          {adding ? "Adding..." : "Add"}
        </button>
      </div>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}

function AiWandButton() {
  return (
    <button
      type="button"
      disabled
      title="AI-powered rewrite — coming soon"
      className="inline-flex items-center justify-center h-8 w-8 rounded-md border border-gray-200 text-gray-300 cursor-not-allowed shrink-0"
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="m15 4 1.5 1.5M15 4l-1.5 1.5M15 4l1.5-1.5M15 4l-1.5-1.5M4 20l11-11 3 3L7 23l-3-3Z" />
      </svg>
    </button>
  );
}

function SaveButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-50 transition-colors"
    >
      {pending ? "Saving..." : label}
    </button>
  );
}

function parseCommaList(raw: string | null | undefined): string[] {
  if (!raw) return [];
  return raw
    .split(",")
    .map((v) => v.trim())
    .filter(Boolean);
}

export default function PropertyForm({
  action,
  submitLabel,
  availableTypes,
  availableFeatures,
  initial,
}: {
  action: (prevState: FormActionState, formData: FormData) => Promise<FormActionState>;
  submitLabel: string;
  availableTypes: string[];
  availableFeatures: string[];
  initial?: {
    title?: string;
    price?: string;
    secondPrice?: string | null;
    pricePrefix?: string | null;
    status?: string;
    bedrooms?: string | null;
    bathrooms?: string | null;
    area?: string | null;
    landArea?: string | null;
    type?: string | null;
    community?: string | null;
    description?: string | null;
    featuredImage?: string | null;
    images?: string | null;
    videos?: string | null;
    features?: string | null;
    floorplanImage?: string | null;
    pdfUrl?: string | null;
    areaData?: string | null;
    isFeatured?: boolean;
    seoTitle?: string | null;
    seoDescription?: string | null;
  };
}) {
  const [state, formAction] = useFormState(action, undefined);
  const initialVideo = parseJsonStringArray(initial?.videos)[0] ?? "";

  return (
    <form action={formAction} className="space-y-6 max-w-2xl">
      <div>
        <label className="block text-sm font-medium text-gray-700">Title</label>
        <input
          name="title"
          required
          defaultValue={initial?.title}
          className="mt-1 block w-full rounded-md border border-gray-300 pl-3 pr-8 py-2 text-sm text-gray-900 shadow-sm focus:border-gray-900 focus:outline-none"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-gray-700">Sale or Rent Price</label>
          <input
            name="price"
            required
            placeholder="890,000"
            defaultValue={initial?.price}
            className="mt-1 block w-full rounded-md border border-gray-300 pl-3 pr-8 py-2 text-sm text-gray-900 shadow-sm focus:border-gray-900 focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Second Price (Optional)</label>
          <input
            name="secondPrice"
            placeholder="Enter the second price"
            defaultValue={initial?.secondPrice ?? ""}
            className="mt-1 block w-full rounded-md border border-gray-300 pl-3 pr-8 py-2 text-sm text-gray-900 shadow-sm focus:border-gray-900 focus:outline-none"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Price Prefix</label>
        <input
          name="pricePrefix"
          placeholder="Start from"
          defaultValue={initial?.pricePrefix ?? ""}
          className="mt-1 block w-full rounded-md border border-gray-300 pl-3 pr-8 py-2 text-sm text-gray-900 shadow-sm focus:border-gray-900 focus:outline-none"
        />
        <p className="mt-1 text-xs text-gray-400">For example: Start from</p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-gray-700">Area Size</label>
          <input
            type="text"
            inputMode="numeric"
            name="area"
            placeholder="Enter property area size"
            defaultValue={initial?.area ?? ""}
            className="mt-1 block w-full rounded-md border border-gray-300 pl-3 pr-8 py-2 text-sm text-gray-900 shadow-sm focus:border-gray-900 focus:outline-none"
          />
          <p className="mt-1 text-xs text-gray-400">Only digits</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Land Area</label>
          <input
            type="text"
            inputMode="numeric"
            name="landArea"
            placeholder="Enter property Land Area"
            defaultValue={initial?.landArea ?? ""}
            className="mt-1 block w-full rounded-md border border-gray-300 pl-3 pr-8 py-2 text-sm text-gray-900 shadow-sm focus:border-gray-900 focus:outline-none"
          />
          <p className="mt-1 text-xs text-gray-400">Only digits</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        <div>
          <label className="block text-sm font-medium text-gray-700">Status</label>
          <select
            name="status"
            defaultValue={initial?.status || "AVAILABLE"}
            className="mt-1 block w-full rounded-md border border-gray-300 pl-3 pr-8 py-2 text-sm text-gray-900 shadow-sm focus:border-gray-900 focus:outline-none"
          >
            {PROPERTY_STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Bedrooms</label>
          <input
            type="text"
            name="bedrooms"
            placeholder="4 or 2 - 4"
            defaultValue={initial?.bedrooms ?? ""}
            className="mt-1 block w-full rounded-md border border-gray-300 pl-3 pr-8 py-2 text-sm text-gray-900 shadow-sm focus:border-gray-900 focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Bathrooms</label>
          <input
            type="text"
            name="bathrooms"
            placeholder="4 or 2 - 4"
            defaultValue={initial?.bathrooms ?? ""}
            className="mt-1 block w-full rounded-md border border-gray-300 pl-3 pr-8 py-2 text-sm text-gray-900 shadow-sm focus:border-gray-900 focus:outline-none"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Location</label>
        <input
          name="community"
          placeholder="e.g. Downtown, City"
          defaultValue={initial?.community ?? ""}
          className="mt-1 block w-full rounded-md border border-gray-300 pl-3 pr-8 py-2 text-sm text-gray-900 shadow-sm focus:border-gray-900 focus:outline-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Description</label>
        <textarea
          name="description"
          rows={4}
          defaultValue={initial?.description ?? ""}
          className="mt-1 block w-full rounded-md border border-gray-300 pl-3 pr-8 py-2 text-sm text-gray-900 shadow-sm focus:border-gray-900 focus:outline-none"
        />
      </div>

      <FeaturedImageField initialUrl={initial?.featuredImage} />

      <GalleryField initialImages={initial?.images} />

      <FloorplanImageField initialUrl={initial?.floorplanImage} />

      <PdfField initialUrl={initial?.pdfUrl} />

      <AreaDataField initialAreaData={initial?.areaData} />

      <div>
        <label className="block text-sm font-medium text-gray-700">Video Link (optional)</label>
        <input
          name="videos"
          defaultValue={initialVideo}
          placeholder="https://www.youtube.com/embed/..."
          className="mt-1 block w-full rounded-md border border-gray-300 pl-3 pr-8 py-2 text-sm text-gray-900 shadow-sm focus:border-gray-900 focus:outline-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
        <OptionChecklist
          name="types"
          options={availableTypes}
          initialSelected={parseCommaList(initial?.type)}
          addOption={addPropertyType}
          addPlaceholder="Add a new type"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Features</label>
        <OptionChecklist
          name="features"
          options={availableFeatures}
          initialSelected={parseJsonStringArray(initial?.features)}
          addOption={addPropertyFeature}
          addPlaceholder="Add a new feature"
        />
      </div>

      <div>
        <p className="block text-sm font-medium text-gray-700">Do you want to mark this property as featured?</p>
        <div className="mt-2 flex items-center gap-6">
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input
              type="radio"
              name="isFeatured"
              value="yes"
              defaultChecked={initial?.isFeatured === true}
              className="h-4 w-4"
            />
            Yes
          </label>
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input
              type="radio"
              name="isFeatured"
              value="no"
              defaultChecked={!initial || initial?.isFeatured !== true}
              className="h-4 w-4"
            />
            No
          </label>
        </div>
      </div>

      <div className="border-t border-gray-200 pt-6 space-y-4">
        <div>
          <h3 className="text-sm font-semibold text-gray-900">SEO Metadata</h3>
          <p className="mt-1 text-xs text-gray-400">
            Auto-generated from the details above when left blank. Edit anytime.
          </p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">SEO Title</label>
          <div className="mt-1 flex items-center gap-2">
            <input
              name="seoTitle"
              defaultValue={initial?.seoTitle ?? ""}
              placeholder="Auto-generated from title & location"
              className="block w-full rounded-md border border-gray-300 pl-3 pr-8 py-2 text-sm text-gray-900 shadow-sm focus:border-gray-900 focus:outline-none"
            />
            <AiWandButton />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">SEO Description</label>
          <div className="mt-1 flex items-start gap-2">
            <textarea
              name="seoDescription"
              rows={2}
              defaultValue={initial?.seoDescription ?? ""}
              placeholder="Auto-generated from the property description"
              className="block w-full rounded-md border border-gray-300 pl-3 pr-8 py-2 text-sm text-gray-900 shadow-sm focus:border-gray-900 focus:outline-none"
            />
            <AiWandButton />
          </div>
        </div>
      </div>

      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}

      <div className="flex items-center gap-3">
        <SaveButton label={submitLabel} />
        <Link href="/admin/properties" className="text-sm text-gray-500 hover:text-gray-900">
          Cancel
        </Link>
      </div>
    </form>
  );
}
