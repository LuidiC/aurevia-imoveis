"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { BrandLogo } from "@/components/layout/brand-logo";
import { SiteNavigation } from "@/components/layout/site-navigation";
import { Container } from "@/components/ui/container";
import { SITE_NAVIGATION } from "@/config/navigation";
import { SITE_CONFIG } from "@/config/site";
import { buildWhatsAppUrl } from "@/lib/whatsapp/build-whatsapp-url";

export function SiteHeader() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const isHomePage = pathname === "/";
  const whatsappHref = buildWhatsAppUrl(SITE_CONFIG.contacts.whatsapp.defaultMessage);

  useEffect(() => {
    function handleScroll() {
      setIsScrolled(window.scrollY > 40);
    }
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const position = isHomePage ? "fixed inset-x-0 top-0" : "sticky top-0";
  const surface = isHomePage && !isScrolled
    ? "bg-white/95"
    : "bg-white shadow-soft";

  return (
    <header className={`z-40 border-b border-border transition-[background-color,box-shadow] duration-300 ${position} ${surface}`}>
      <Container className="relative flex min-h-20 items-center justify-between gap-4 lg:min-h-24 lg:gap-8">
        <Link aria-label={SITE_CONFIG.brand.accessibleName} className="shrink-0 rounded-sm" href="/">
          <BrandLogo priority />
        </Link>
        <SiteNavigation items={SITE_NAVIGATION} whatsappHref={whatsappHref} />
      </Container>
    </header>
  );
}
