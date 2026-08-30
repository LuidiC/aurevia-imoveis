"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { SiteNavigation } from "@/components/layout/site-navigation";
import { Container } from "@/components/ui/container";
import { SITE_NAVIGATION } from "@/config/navigation";
import { SITE_CONFIG } from "@/config/site";
import { buildWhatsAppUrl } from "@/lib/whatsapp/build-whatsapp-url";

export function SiteHeader() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);

  const isHomePage = pathname === "/";

  const whatsappHref = buildWhatsAppUrl(
    SITE_CONFIG.contacts.whatsapp.defaultMessage,
  );

  useEffect(() => {
    function handleScroll() {
      setIsScrolled(window.scrollY > 40);
    }

    handleScroll();

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const isTransparent = isHomePage && !isScrolled;

  return (
   <header

  className={`z-40 transition-all duration-300 ${

    isHomePage

      ? "fixed inset-x-0 top-0"

      : "sticky top-0"

  } ${

    isTransparent

      ? "border-b border-transparent bg-transparent"

      : "border-b border-border bg-white/95 shadow-sm backdrop-blur-md"

  }`}

>
      <Container className="relative flex min-h-20 items-center justify-between gap-4 lg:min-h-24 lg:gap-8">
        <Link
          aria-label="Marli Corretora — página inicial"
          className="shrink-0"
          href="/"
        >
          <div className="relative h-16 w-36 lg:h-20 lg:w-[11.25rem]">
            <img
              src="/brand/marli-corretora-logo-transparent-white.png"
              alt="Marli Corretora"
              className={`absolute inset-0 h-full w-full object-contain transition-opacity duration-300 ${
                isTransparent ? "opacity-100" : "opacity-0"
              }`}
            />

            <img
              src="/brand/marli-corretora-logo-transparent.png"
              alt="Marli Corretora"
              className={`absolute inset-0 h-full w-full object-contain transition-opacity duration-300 ${
                isTransparent ? "opacity-0" : "opacity-100"
              }`}
            />
          </div>
        </Link>

        <SiteNavigation
          isTransparent={isTransparent}
          items={SITE_NAVIGATION}
          whatsappHref={whatsappHref}
        />
      </Container>
    </header>
  );
}