"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Wordmark } from "@/components/brand/Wordmark";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { MAIN_NAV } from "./navigation";

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  // Mit Escape schließen
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className="sticky top-0 z-40 border-b border-line/70 bg-cream/90 backdrop-blur-md">
      <Container className="flex h-16 items-center justify-between gap-6">
        <Wordmark />

        <nav aria-label="Hauptnavigation" className="hidden items-center gap-8 md:flex">
          {MAIN_NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-[0.95rem] text-charcoal/80 transition-colors hover:text-charcoal"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:block">
          <ButtonLink href="/gestalten">Jetzt Raum gestalten</ButtonLink>
        </div>

        <button
          type="button"
          className="-mr-2 inline-flex h-11 w-11 items-center justify-center rounded-full md:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "Menü schließen" : "Menü öffnen"}
          onClick={() => setOpen((v) => !v)}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
            {open ? (
              <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
            ) : (
              <path d="M4 8h16M4 16h16" strokeLinecap="round" />
            )}
          </svg>
        </button>
      </Container>

      {open && (
        <div id="mobile-menu" className="border-t border-line bg-cream md:hidden">
          <Container className="flex flex-col gap-1 py-4">
            <nav aria-label="Mobile Navigation" className="flex flex-col">
              {MAIN_NAV.map((item) => (
                <Link key={item.href} href={item.href} onClick={close} className="rounded-lg py-3 text-lg text-charcoal">
                  {item.label}
                </Link>
              ))}
            </nav>
            <ButtonLink href="/gestalten" size="lg" className="mt-3 w-full" onClick={close}>
              Jetzt Raum gestalten
            </ButtonLink>
          </Container>
        </div>
      )}
    </header>
  );
}
