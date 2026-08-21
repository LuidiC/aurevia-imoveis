import { Container } from "@/components/ui/container";
import { SITE_CONFIG } from "@/config/site";

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-surface py-8 text-small text-muted-foreground">
      <Container className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <p>© {new Date().getFullYear()} {SITE_CONFIG.name}.</p>
        <p>{SITE_CONFIG.serviceArea}</p>
      </Container>
    </footer>
  );
}
