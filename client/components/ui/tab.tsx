
import React, { useState, KeyboardEvent } from "react";

export type TabItem = {
  id: string;
  label: string;
  icon?: React.ReactNode;
  content: React.ReactNode;
};

export interface TabsProps {
  tabs: TabItem[];
  defaultTabId?: string;
  allowToggle?: boolean;
}

export const Tab: React.FC<TabsProps> = ({
  tabs,
  defaultTabId,
  allowToggle = false,
}) => {
  const [activeTab, setActiveTab] = useState<string>(
    defaultTabId ?? tabs[0]?.id ?? "",
  );

  const switchTo = (id: string) =>
    setActiveTab((prev) => (allowToggle && prev === id ? "" : id));

  const handleKey = (e: KeyboardEvent<HTMLButtonElement>, idx: number) => {
    const { key } = e;
    if (key !== "ArrowLeft" && key !== "ArrowRight") return;

    e.preventDefault();
    const nextIdx =
      key === "ArrowRight"
        ? (idx + 1) % tabs.length
        : (idx - 1 + tabs.length) % tabs.length;

    switchTo(tabs[nextIdx].id);
  };

  return (
    <div>

      <div
        role="tablist"
        aria-label="Tabs"
        className="flex justify-around border-b border-neutral-200"
      >
        {tabs.map((t, i) => {
          const selected = t.id === activeTab;
          return (
            <button
              key={t.id}
              role="tab"
              aria-selected={selected}
              aria-controls={`${t.id}-panel`}
              tabIndex={selected ? 0 : -1}
              onClick={() => switchTo(t.id)}
              onKeyDown={(e) => handleKey(e, i)}
              className={`flex items-center gap-2 py-3 px-4 text-sm font-semibold transition-colors
                ${
                  selected
                    ? "border-b-2 border-primary-dark-blue text-primary-dark-blue"
                    : "text-neutral-500 hover:text-neutral-800"
                }`}
            >
              {t.icon}
              {t.label}
            </button>
          );
        })}
      </div>
      {tabs.map((t) =>
        t.id === activeTab ? (
          <div
            key={t.id}
            role="tabpanel"
            id={`${t.id}-panel`}
            aria-labelledby={`${t.id}-tab`}
            className="p-4"
          >
            {t.content}
          </div>
        ) : null,
      )}
    </div>
  );
};

export default Tab;
