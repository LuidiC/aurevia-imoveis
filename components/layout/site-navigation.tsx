"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { MobileNavigation } from "@/components/layout/mobile-navigation";
import { buttonStyles } from "@/components/ui/button";
import type { SiteNavigationItem } from "@/config/navigation";
import {
  getActiveNavigationHref,
  type HomeSection,
} from "@/lib/navigation/active-navigation";

type SiteNavigationProps = Readonly<{
  items: readonly SiteNavigationItem[];
  whatsappHref: string;
  isTransparent?: boolean;
}>;

const OBSERVED_HOME_SECTIONS = ["sobre", "contato"] as const;

export function SiteNavigation({
  items,
  whatsappHref,
  isTransparent = false,
}: SiteNavigationProps) {
  const pathname = usePathname();
  const [hash, setHash] = useState("");
  const [visibleHomeSection, setVisibleHomeSection] =
    useState<HomeSection | null>(null);

  useEffect(() => {
    function syncHash() {
      setHash(window.location.hash);
      setVisibleHomeSection(null);
    }

    syncHash();

    window.addEventListener("hashchange", syncHash);

    return () => {
      window.removeEventListener("hashchange", syncHash);
    };
  }, [pathname]);

  useEffect(() => {
    if (pathname !== "/") {
      return;
    }

    const sections = OBSERVED_HOME_SECTIONS.map((id) =>
      document.getElementById(id),
    ).filter((section): section is HTMLElement => section !== null);

    if (sections.length === 0) {
      return;
    }

    const visibility = new Map<string, number>();

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          visibility.set(
            entry.target.id,
            entry.isIntersecting ? entry.intersectionRatio : 0,
          );
        }

        const visibleSection = OBSERVED_HOME_SECTIONS.reduce<{
          id: HomeSection;
          ratio: number;
        }>(
          (current, id) => {
            const ratio = visibility.get(id) ?? 0;

            return ratio > current.ratio
              ? {
                  id,
                  ratio,
                }
              : current;
          },
          {
            id: "inicio",
            ratio: 0,
          },
        );

        setVisibleHomeSection(visibleSection.id);
      },
      {
        rootMargin: "-15% 0px -55% 0px",
        threshold: [0, 0.1, 0.25, 0.5, 0.75],
      },
    );

    for (const section of sections) {
      observer.observe(section);
    }

    return () => {
      observer.disconnect();
    };
  }, [pathname]);

  const activeHref = useMemo(
    () => getActiveNavigationHref(pathname, hash, visibleHomeSection),
    [hash, pathname, visibleHomeSection],
  );

  function handleNavigationSelection(href: SiteNavigationItem["href"]) {
    if (href === "/") {
      setVisibleHomeSection("inicio");
      setHash("");
    } else if (href === "/#sobre") {
      setVisibleHomeSection("sobre");
      setHash("#sobre");
    } else if (href === "/#contato") {
      setVisibleHomeSection("contato");
      setHash("#contato");
    }
  }

  return (
    <>
      <div className="hidden items-center gap-6 lg:flex xl:gap-8">
        <nav aria-label="Navegação principal">
          <ul
            className={`flex items-center gap-2 text-sm transition-colors duration-300 xl:gap-3 ${
              isTransparent ? "text-white" : "text-muted-foreground"
            }`}
          >
            {items.map((item) => {
              const isActive = activeHref === item.href;

              return (
                <li key={item.href}>
                  <Link
                    aria-current={
                      isActive
                        ? item.href.startsWith("/#")
                          ? "location"
                          : "page"
                        : undefined
                    }
                    className={`inline-flex min-h-11 items-center rounded-md px-3 font-semibold transition-all duration-200 ${
                      isTransparent
                        ? isActive
                          ? "bg-white/15 text-white backdrop-blur-sm"
                          : "text-white hover:bg-white/10 hover:text-white"
                        : isActive
                          ? "bg-primary text-primary-foreground"
                          : "hover:bg-accent hover:text-accent-foreground"
                    }`}
                    href={item.href}
                    onClick={() => handleNavigationSelection(item.href)}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <a
          aria-label="Falar com a Marli Corretora no WhatsApp; abre em uma nova aba"
          className={buttonStyles({
            className: `
              whitespace-nowrap
              transition-all
              duration-300
              hover:-translate-y-0.5
              hover:shadow-lg
              ${
                isTransparent
                  ? "border border-white/20 bg-primary/90 backdrop-blur-sm"
                  : ""
              }
            `,
          })}
          href={whatsappHref}
          rel="noopener noreferrer"
          target="_blank"
        >
          Falar no WhatsApp
        </a>
      </div>

      <MobileNavigation
        activeHref={activeHref}
        isTransparent={isTransparent}
        items={items}
        onNavigate={handleNavigationSelection}
        whatsappHref={whatsappHref}
      />
    </>
  );
}