"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

/* -------------------- Options (MUST match Shopify metafield values) -------------------- */
type Option = { label: string; value: string };

const COLORS: Option[] = [
  { label: "Blue", value: "Blue" },
  { label: "Light Blue", value: "Light Blue" },
  { label: "Dark Blue", value: "Dark Blue" },
  { label: "Navy", value: "Navy" },
  { label: "Orange", value: "Orange" },
  { label: "White", value: "White" },
  { label: "Red", value: "Red" },
  { label: "Green", value: "Green" },
  { label: "Purple", value: "Purple" },
  { label: "Tan", value: "Tan" },
];

const EMBLEM_SHAPES: Option[] = [
  { label: "Sun", value: "Sun" },
  { label: "Hexagon", value: "Hexagon" },
  { label: "Flat-Top Hexagon", value: "Flat-Top Hexagon" },
  { label: "Circle", value: "Circle" },
  { label: "Square", value: "Square" },
  { label: "Rectangle", value: "Rectangle" },
  { label: "Oval", value: "Oval" },
];

const EMBLEM_COLORS: Option[] = [
  { label: "Tan", value: "Tan" },
  { label: "Brown", value: "Brown" },
  { label: "Light Brown", value: "Light Brown" },
  { label: "Charcoal", value: "Charcoal" },
];

const STYLES: Option[] = [
  { label: "Camo", value: "Camo" },
  { label: "Solid Color", value: "Solid Color" },
  { label: "Two-Tone", value: "Two-Tone" },
  { label: "Multi-Color", value: "Multi-Color" },
  {label: "Hunting", value: "Hunting"}
];

const GROUPS = [
  { title: "Color", key: "color", options: COLORS },
  { title: "Emblem Shape", key: "emblem_shape", options: EMBLEM_SHAPES },
  { title: "Emblem Color", key: "emblem_color", options: EMBLEM_COLORS },
  { title: "Style", key: "style", options: STYLES },
] as const;

/* -------------------- Helpers -------------------- */
type SelectedState = {
  color: string[];
  emblem_shape: string[];
  emblem_color: string[];
  style: string[];
};

function parseSelected(sp: URLSearchParams): SelectedState {
  const getList = (k: keyof SelectedState) => {
    const raw = sp.get(k);
    if (!raw) return [];
    return raw.split(",").map((s) => s.trim()).filter(Boolean);
  };
  return {
    color: getList("color"),
    emblem_shape: getList("emblem_shape"),
    emblem_color: getList("emblem_color"),
    style: getList("style"),
  };
}

function setList(sp: URLSearchParams, key: keyof SelectedState, list: string[]) {
  if (list.length) sp.set(key, list.join(","));
  else sp.delete(key);
}

/* -------------------- Component -------------------- */
export function Filters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Local, *pending* selection (not applied until user clicks Apply)
  const [selected, setSelected] = useState<SelectedState>(() => parseSelected(new URLSearchParams(searchParams)));
  const [isOpen, setIsOpen] = useState(false); // mobile modal
  const [dirty, setDirty] = useState(false); // pending changes not yet applied

  // Keep local state in sync with URL when not dirty (e.g., when search box changes)
  useEffect(() => {
    if (!dirty) setSelected(parseSelected(new URLSearchParams(searchParams)));
  }, [searchParams, dirty]);

  const activeCount = useMemo(
    () => selected.color.length + selected.emblem_shape.length + selected.emblem_color.length + selected.style.length,
    [selected]
  );

  const toggle = (key: keyof SelectedState, value: string) => {
    setSelected((prev) => {
      const exists = prev[key].includes(value);
      const next = exists ? prev[key].filter((v) => v !== value) : [...prev[key], value];
      return { ...prev, [key]: next };
    });
    setDirty(true);
  };

  const clearAllLocal = () => {
    setSelected({ color: [], emblem_shape: [], emblem_color: [], style: [] });
    setDirty(true);
  };

  const resetLocal = () => {
    setSelected(parseSelected(new URLSearchParams(searchParams)));
    setDirty(false);
  };

  const apply = () => {
    const next = new URLSearchParams(searchParams.toString());
    (["color", "emblem_shape", "emblem_color", "style"] as (keyof SelectedState)[]).forEach((k) =>
      setList(next, k, selected[k])
    );
    next.delete("after"); // reset paging
    router.replace(`${pathname}?${next.toString()}`);
    setDirty(false);
    setIsOpen(false);
  };

  /* ------- UI blocks reused for sidebar & modal ------- */
  const Group = ({
    title,
    keyName,
    options,
  }: {
    title: string;
    keyName: keyof SelectedState;
    options: Option[];
  }) => (
    <fieldset className="rounded-xl border p-3">
      <legend className="text-sm font-semibold">{title}</legend>
      <div className="mt-2 space-y-2">
        {options.map((opt) => {
          const id = `${keyName}-${opt.value}`;
          const checked = selected[keyName].includes(opt.value);
          return (
            <label key={opt.value} htmlFor={id} className="flex items-center gap-2 text-sm">
              <input
                id={id}
                type="checkbox"
                className="h-4 w-4 rounded border"
                checked={checked}
                onChange={() => toggle(keyName, opt.value)}
              />
              <span>{opt.label}</span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );

  const Panel = (
    <div className="space-y-4">
      <Group title="Color" keyName="color" options={COLORS} />
      <Group title="Emblem Shape" keyName="emblem_shape" options={EMBLEM_SHAPES} />
      <Group title="Emblem Color" keyName="emblem_color" options={EMBLEM_COLORS} />
      <Group title="Style" keyName="style" options={STYLES} />

      {/* Actions */}
      <div className="flex items-center gap-2 pt-2">
        <button
          type="button"
          onClick={clearAllLocal}
          className="rounded-lg border px-3 py-2 text-sm"
        >
          Clear all
        </button>
        <div className="ml-auto flex items-center gap-2">
          <button
            type="button"
            onClick={resetLocal}
            className="rounded-lg border px-3 py-2 text-sm"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={apply}
            className="rounded-lg bg-foreground px-3 py-2 text-sm text-background"
            disabled={!dirty}
            aria-disabled={!dirty}
          >
            Apply filters
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile bar */}
      <div className="flex items-center justify-between md:hidden">
        <div className="text-sm text-muted-foreground">
          {activeCount > 0 ? `${activeCount} filter${activeCount > 1 ? "s" : ""} applied` : "No filters applied"}
        </div>
        <button
          type="button"
          onClick={() => {
            resetLocal(); // start from URL each time modal opens
            setIsOpen(true);
          }}
          className="rounded-lg border px-3 py-2 text-sm"
        >
          Filters
        </button>
      </div>

      {/* Sidebar (md+) */}
      <div className="hidden md:block">
        <div className="sticky top-4 rounded-xl border p-4">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-semibold">Filters</h3>
            <span className="text-xs text-muted-foreground">
              {activeCount > 0 ? `${activeCount} applied` : "None"}
            </span>
          </div>
          {Panel}
        </div>
      </div>

      {/* Mobile modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 md:hidden" role="dialog" aria-modal="true">
          <div className="absolute inset-0 bg-black/40" onClick={resetLocal} />
          <div className="absolute inset-x-0 bottom-0 max-h-[85vh] rounded-t-2xl bg-background p-4 shadow-lg">
            <div className="mb-2 flex items-center justify-between">
              <h3 className="text-base font-semibold">Filters</h3>
              <button
                type="button"
                className="rounded-lg border px-2 py-1 text-sm"
                onClick={() => {
                  resetLocal();
                  setIsOpen(false);
                }}
              >
                Close
              </button>
            </div>
            <div className="overflow-y-auto pb-16">{Panel}</div>
          </div>
        </div>
      )}
    </>
  );
}
