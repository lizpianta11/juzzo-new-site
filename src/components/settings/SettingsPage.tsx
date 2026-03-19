"use client";

import Link from "next/link";
import { useCallback, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SETTINGS_SECTIONS, type SettingsItem, type SettingsSection, type SettingsGroup } from "@/lib/demo-settings";
import { useDemo } from "@/providers/DemoProvider";
import { cn } from "@/lib/utils/cn";

/* ─── Interactive Toggle ─── */
function Toggle({ enabled, onToggle }: { enabled: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      className={cn(
        "relative h-7 w-12 rounded-full border transition-colors cursor-pointer",
        enabled
          ? "border-cyan-400/40 bg-gradient-to-r from-cyan-400 to-blue-500"
          : "border-white/10 bg-white/[0.06]"
      )}
    >
      <div
        className={cn(
          "absolute top-0.5 h-[22px] w-[22px] rounded-full bg-white shadow-[0_4px_16px_rgba(255,255,255,0.2)] transition-transform",
          enabled ? "translate-x-6" : "translate-x-0.5"
        )}
      />
    </button>
  );
}

/* ─── Interactive Select ─── */
function SelectControl({
  value,
  options,
  onChange,
}: {
  value: string;
  options: { label: string; value: string }[];
  onChange: (v: string) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const current = options.find((o) => o.value === value);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="rounded-full border border-white/[0.08] bg-white/[0.05] px-3 py-2 text-xs font-medium text-white/80 hover:bg-white/[0.08] transition flex items-center gap-1.5"
      >
        {current?.label ?? value}
        <svg className={cn("w-3 h-3 text-white/40 transition-transform", isOpen && "rotate-180")} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
          <path strokeLinecap="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
        </svg>
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: -4, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -4, scale: 0.95 }}
              transition={{ duration: 0.12 }}
              className="absolute right-0 top-full mt-1 z-50 min-w-[160px] rounded-xl border border-white/[0.1] bg-[#12122a] shadow-2xl shadow-black/50 overflow-hidden"
            >
              {options.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => {
                    onChange(opt.value);
                    setIsOpen(false);
                  }}
                  className={cn(
                    "w-full text-left px-4 py-2.5 text-xs transition",
                    opt.value === value
                      ? "bg-cyan-500/15 text-cyan-100 font-medium"
                      : "text-white/60 hover:bg-white/[0.06] hover:text-white/80"
                  )}
                >
                  {opt.label}
                </button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─── Tone classes for buttons ─── */
function toneClasses(tone: SettingsItem["tone"]) {
  if (tone === "danger") return "border-red-500/20 bg-red-500/10 text-red-100 hover:bg-red-500/15";
  if (tone === "success") return "border-emerald-500/20 bg-emerald-500/10 text-emerald-100";
  return "border-white/[0.08] bg-white/[0.05] text-white/80 hover:bg-white/[0.08]";
}

function statusClasses(value: string) {
  if (/verified|connected/i.test(value)) return "border-emerald-400/20 bg-emerald-400/10 text-emerald-200";
  if (/not connected/i.test(value)) return "border-white/10 bg-white/[0.06] text-white/60";
  return "border-cyan-400/20 bg-cyan-400/10 text-cyan-100";
}

/* ─── Section Nav (desktop sidebar) ─── */
function SectionNav({
  sections,
  activeSection,
  onSelect,
}: {
  sections: SettingsSection[];
  activeSection: string;
  onSelect: (id: string) => void;
}) {
  return (
    <aside className="hidden xl:block xl:w-80">
      <div className="sticky top-6 rounded-[28px] border border-white/[0.08] bg-white/[0.04] p-4 backdrop-blur-xl">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-200/60">Settings Map</p>
        <div className="mt-4 space-y-2">
          {sections.map((section) => {
            const active = section.id === activeSection;
            return (
              <button
                key={section.id}
                onClick={() => onSelect(section.id)}
                className={cn(
                  "w-full rounded-2xl px-4 py-3 text-left transition",
                  active
                    ? "bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-white"
                    : "bg-transparent text-white/55 hover:bg-white/[0.05] hover:text-white/80"
                )}
              >
                <p className="text-sm font-semibold">{section.title}</p>
                <p className="mt-1 text-xs text-white/45">{section.kicker}</p>
              </button>
            );
          })}
        </div>
      </div>
    </aside>
  );
}

/* ─── Main SettingsPage ─── */
export default function SettingsPage() {
  const { showToast } = useDemo();
  const [activeSection, setActiveSection] = useState(SETTINGS_SECTIONS[0]?.id ?? "account");

  // Deep-clone settings for local state so all controls are interactive
  const [settingsState, setSettingsState] = useState<SettingsSection[]>(() =>
    JSON.parse(JSON.stringify(SETTINGS_SECTIONS))
  );

  const active = useMemo(
    () => settingsState.find((s) => s.id === activeSection) ?? settingsState[0],
    [activeSection, settingsState]
  );

  const totalGroups = settingsState.reduce((sum, s) => sum + s.groups.length, 0);
  const totalControls = settingsState.reduce(
    (sum, s) => sum + s.groups.reduce((gs, g) => gs + g.items.length, 0),
    0
  );

  /* ─── State update helpers ─── */
  const updateItem = useCallback(
    (itemId: string, newValue: string | boolean | string[]) => {
      setSettingsState((prev) =>
        prev.map((section) => ({
          ...section,
          groups: section.groups.map((group) => ({
            ...group,
            items: group.items.map((item) =>
              item.id === itemId ? { ...item, value: newValue } : item
            ),
          })),
        }))
      );
    },
    []
  );

  const handleToggle = useCallback(
    (item: SettingsItem) => {
      const newVal = !item.value;
      updateItem(item.id, newVal);
      showToast(`${item.label} ${newVal ? "enabled" : "disabled"}`);
    },
    [updateItem, showToast]
  );

  const handleSelect = useCallback(
    (item: SettingsItem, newValue: string) => {
      updateItem(item.id, newValue);
      const label = item.options?.find((o) => o.value === newValue)?.label ?? newValue;
      showToast(`${item.label} → ${label}`);
    },
    [updateItem, showToast]
  );

  const handleButton = useCallback(
    (item: SettingsItem) => {
      showToast(`${item.label}: ${item.value as string}`);
    },
    [showToast]
  );

  const handleChipRemove = useCallback(
    (item: SettingsItem, chip: string) => {
      const current = item.value as string[];
      updateItem(item.id, current.filter((c) => c !== chip));
      showToast(`Removed "${chip}" from ${item.label}`);
    },
    [updateItem, showToast]
  );

  /* ─── Render individual control ─── */
  const renderItemControl = (item: SettingsItem) => {
    if (item.type === "toggle") {
      return <Toggle enabled={Boolean(item.value)} onToggle={() => handleToggle(item)} />;
    }

    if (item.type === "select" && item.options) {
      return (
        <SelectControl
          value={item.value as string}
          options={item.options}
          onChange={(v) => handleSelect(item, v)}
        />
      );
    }

    if (item.type === "text" || item.type === "textarea") {
      return (
        <div className="max-w-xs rounded-2xl border border-white/[0.08] bg-white/[0.05] px-3 py-2 text-right text-sm text-white/70">
          {item.value as string}
        </div>
      );
    }

    if (item.type === "chips") {
      return (
        <div className="flex max-w-sm flex-wrap justify-end gap-2">
          {(item.value as string[]).map((chip) => (
            <span
              key={chip}
              className="inline-flex items-center gap-1.5 rounded-full border border-cyan-400/15 bg-cyan-400/10 px-3 py-1 text-xs font-medium text-cyan-100"
            >
              {chip}
              <button
                onClick={() => handleChipRemove(item, chip)}
                className="w-3.5 h-3.5 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition text-[8px] text-white/60"
              >
                ✕
              </button>
            </span>
          ))}
        </div>
      );
    }

    if (item.type === "button") {
      return (
        <button
          onClick={() => handleButton(item)}
          className={`rounded-full border px-3 py-2 text-xs font-semibold transition cursor-pointer active:scale-95 ${toneClasses(item.tone)}`}
        >
          {item.value as string}
        </button>
      );
    }

    if (item.type === "status") {
      return (
        <div className={`rounded-full border px-3 py-2 text-xs font-semibold ${statusClasses(String(item.value))}`}>
          {item.value as string}
        </div>
      );
    }

    return null;
  };

  return (
    <div className="min-h-screen bg-[#050510] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.18),_transparent_28%),radial-gradient(circle_at_top_right,_rgba(59,130,246,0.16),_transparent_30%),linear-gradient(180deg,_rgba(255,255,255,0.02),_transparent_38%)]" />

      <div className="relative mx-auto max-w-[1600px] px-4 pb-32 pt-5 md:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <Link
            href="/me"
            className="inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.05] px-4 py-2 text-sm text-white/75 transition hover:bg-white/[0.08] hover:text-white"
          >
            <span className="text-base">←</span>
            Back to profile
          </Link>
          <div className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-100">
            {settingsState.length} sections · {totalControls} controls
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[320px_minmax(0,1fr)]">
          <SectionNav sections={settingsState} activeSection={activeSection} onSelect={setActiveSection} />

          <main className="space-y-6">
            {/* Section Header Card */}
            <section className="overflow-hidden rounded-[32px] border border-white/[0.08] bg-white/[0.04] backdrop-blur-2xl">
              <div className="border-b border-white/[0.08] p-6 md:p-8">
                <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
                  <div className="max-w-2xl">
                    <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-200/60">{active.kicker}</p>
                    <h1 className="mt-3 text-3xl font-semibold tracking-tight md:text-5xl">{active.title}</h1>
                    <p className="mt-3 text-sm leading-6 text-white/60 md:text-base">{active.description}</p>
                  </div>
                </div>
              </div>

              {/* Section chip nav */}
              <div className="flex gap-2 overflow-x-auto px-6 py-4 no-scrollbar md:px-8">
                {settingsState.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={cn(
                      "whitespace-nowrap rounded-full border px-4 py-2 text-sm transition",
                      section.id === activeSection
                        ? "border-cyan-400/30 bg-cyan-400/15 text-cyan-50"
                        : "border-white/[0.08] bg-white/[0.04] text-white/55 hover:bg-white/[0.07] hover:text-white/80"
                    )}
                  >
                    {section.title}
                  </button>
                ))}
              </div>
            </section>

            {/* Section groups & items */}
            <AnimatePresence mode="wait">
              <motion.section
                key={active.id}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.24 }}
                className="space-y-4"
              >
                {active.groups.map((group) => (
                  <div
                    key={group.title}
                    className="rounded-[28px] border border-white/[0.08] bg-white/[0.04] p-5 backdrop-blur-xl md:p-6"
                  >
                    <div className="mb-5 flex flex-col gap-2 border-b border-white/[0.06] pb-4">
                      <h2 className="text-xl font-semibold">{group.title}</h2>
                      <p className="max-w-2xl text-sm text-white/55">{group.description}</p>
                    </div>

                    <div className="space-y-3">
                      {group.items.map((item) => (
                        <div
                          key={item.id}
                          className="flex flex-col gap-4 rounded-3xl border border-white/[0.06] bg-black/20 px-4 py-4 md:flex-row md:items-center md:justify-between"
                        >
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-white">{item.label}</p>
                            {item.description && (
                              <p className="mt-1 text-xs leading-5 text-white/45">{item.description}</p>
                            )}
                          </div>
                          <div className="md:flex-shrink-0">{renderItemControl(item)}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </motion.section>
            </AnimatePresence>
          </main>
        </div>
      </div>
    </div>
  );
}
