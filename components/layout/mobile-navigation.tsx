"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { buttonStyles } from "@/components/ui/button";
import type { SiteNavigationItem } from "@/config/navigation";

type MobileNavigationProps = Readonly<{
  items: readonly SiteNavigationItem[];
  whatsappHref: string;
}>;

export function MobileNavigation({ items, whatsappHref }: MobileNavigationProps) {
  const [isOpen, setIsOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
        toggleRef.current?.focus();
      }
    }

    document.addEventListener("keydown", handleEscape);

    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen]);

  function closeMenu() {
    setIsOpen(false);
  }

  return (
    <div className="lg:hidden">
      <button
        aria-controls="mobile-primary-navigation"
        aria-expanded={isOpen}
        aria-label={isOpen ? "Fechar menu principal" : "Abrir menu principal"}
        className="inline-flex min-h-11 items-center gap-2 rounded-md border border-border-strong bg-surface px-3.5 text-sm font-semibold text-foreground transition-colors hover:border-primary hover:text-primary"
        onClick={() => setIsOpen((current) => !current)}
        ref={toggleRef}
        type="button"
      >
        <span aria-hidden="true" className="relative h-4 w-5">
          <span
            className={`absolute left-0 top-1 h-0.5 w-5 bg-current transition-transform ${isOpen ? "translate-y-1 rotate-45" : ""}`}
          />
          <span
            className={`absolute bottom-1 left-0 h-0.5 w-5 bg-current transition-transform ${isOpen ? "-translate-y-1 -rotate-45" : ""}`}
          />
        </span>
        {isOpen ? "Fechar" : "Menu"}
      </button>

      <div
        className={`${isOpen ? "block" : "hidden"} absolute inset-x-0 top-full border-b border-border bg-surface shadow-soft`}
        id="mobile-primary-navigation"
      >
        <nav
          aria-label="Navegação principal em dispositivos móveis"
          className="site-container py-5"
        >
          <ul className="grid gap-1">
            {items.map((item) => (
              <li key={item.href}>
                <Link
                  className="flex min-h-12 items-center rounded-md px-3 font-semibold text-foreground transition-colors hover:bg-muted hover:text-primary"
                  href={item.href}
                  onClick={closeMenu}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <a
            aria-label="Falar com a Marli Corretora no WhatsApp; abre em uma nova aba"
            className={buttonStyles({ className: "mt-4 w-full" })}
            href={whatsappHref}
            onClick={closeMenu}
            rel="noopener noreferrer"
            target="_blank"
          >
            Falar no WhatsApp
          </a>
        </nav>
      </div>
    </div>
  );
}
