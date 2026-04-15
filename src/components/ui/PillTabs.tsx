import React from "react";

type Tab = { label: string; value: string; className?: string };

type PillTabsProps = {
  tabs: Tab[];
  active: string;
  onChange?: (value: string) => void;
  containerClassName?: string;
  buttonBaseClassName?: string;
};

const PillTabs: React.FC<PillTabsProps> = ({
  tabs,
  active,
  onChange,
  containerClassName = "theme-surface-soft grid w-full grid-cols-3 gap-1 rounded-xl p-1",
  buttonBaseClassName = "cursor-pointer rounded-lg px-3 py-2 text-sm font-medium",
}) => {
  return (
    <div className={containerClassName}>
      {tabs.map((t) => {
        const isActive = t.value === active;
        return (
          <button
            key={t.value}
            type="button"
            onClick={() => onChange?.(t.value)}
            className={`${buttonBaseClassName} ${t.className ?? ""} ${
              isActive
                ? "theme-chip-active"
                : "theme-nav-link"
            }`}>
            {t.label}
          </button>
        );
      })}
    </div>
  );
};

export default PillTabs;
