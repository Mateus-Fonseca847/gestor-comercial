"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export type ModuleMenuLink = {
  title: string;
  description?: string;
  href: string;
  badge?: string;
};

export type ModuleMenuSection = {
  title: string;
  items: ModuleMenuLink[];
};

export type ModuleMenuData = {
  sections: ModuleMenuSection[];
};

type ModuleMegaMenuProps = {
  triggerLabel: string;
  active: boolean;
  data: ModuleMenuData;
};

export function ModuleMegaMenu({
  triggerLabel,
  active,
  data,
}: ModuleMegaMenuProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  return (
    <div ref={containerRef} className="relative flex shrink-0">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-expanded={open}
        aria-haspopup="dialog"
        className={[
          "group relative flex items-center gap-1 whitespace-nowrap px-1 py-2 text-sm font-medium transition-colors",
          active || open
            ? "text-[var(--color-primary)]"
            : "text-[var(--color-text-soft)] hover:text-[var(--color-primary)]",
        ].join(" ")}
      >
        <span>{triggerLabel}</span>
        <ChevronDownIcon
          className={[
            "h-4 w-4 text-[var(--color-accent)] transition-all duration-200 group-hover:text-[var(--color-primary)]",
            open ? "rotate-180" : "",
          ].join(" ")}
        />
        <span
          className={[
            "absolute bottom-0 left-1/2 h-[3px] w-[calc(100%-0.5rem)] -translate-x-1/2 rounded-full bg-[linear-gradient(90deg,rgba(128,175,237,0)_0%,#1653a4_50%,rgba(128,175,237,0)_100%)] transition-opacity duration-200",
            active || open ? "opacity-100" : "opacity-0 group-hover:opacity-100",
          ].join(" ")}
        />
      </button>

      <div
        className={[
          "absolute left-1/2 top-[calc(100%+0.7rem)] z-[70] w-[min(560px,calc(100vw-1.5rem))] -translate-x-1/2 transition-all duration-150",
          open
            ? "pointer-events-auto translate-y-0 opacity-100"
            : "pointer-events-none -translate-y-1 opacity-0",
        ].join(" ")}
      >
        <div className="overflow-hidden rounded-[24px] border border-[var(--color-border)] bg-[var(--color-surface)] shadow-[0_18px_48px_rgba(0,74,173,0.12)]">
          <div className="p-3">
            <div className="grid gap-1.5 md:grid-cols-2">
              {data.sections.map((section) =>
                section.items.map((item) => {
                  const isCurrent = pathname === item.href;

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={[
                        "group block rounded-[16px] px-3 py-3 transition-colors",
                        isCurrent
                          ? "bg-[var(--color-surface-alt)] text-[var(--color-primary)]"
                          : "text-[var(--color-text)] hover:bg-[var(--color-surface-alt)] hover:text-[var(--color-primary)]",
                      ].join(" ")}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium">
                            {item.title}
                          </p>
                          {item.badge ? (
                            <span className="rounded-full bg-[#edf4ff] px-2 py-1 text-[11px] font-semibold text-[var(--color-primary)]">
                              {item.badge}
                            </span>
                          ) : null}
                        </div>
                        <span className="text-[var(--color-text-soft)] transition-colors group-hover:text-[var(--color-primary)]">
                          <ArrowRightIcon className="h-3.5 w-3.5" />
                        </span>
                      </div>
                    </Link>
                  );
                }),
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

type IconProps = {
  className?: string;
};

function ChevronDownIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className={className} aria-hidden="true">
      <path
        d="M5 7.5 10 12.5 15 7.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ArrowRightIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className={className} aria-hidden="true">
      <path
        d="M7.5 5.5 12 10l-4.5 4.5"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
