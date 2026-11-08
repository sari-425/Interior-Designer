import { CtaBand } from "@/components/marketing/CtaBand";
import { Hero } from "@/components/marketing/Hero";
import { HowItWorks } from "@/components/marketing/HowItWorks";
import { PricingTeaser } from "@/components/marketing/PricingTeaser";
import { Principles } from "@/components/marketing/Principles";
import { StyleShowcase } from "@/components/marketing/StyleShowcase";

export default function HomePage() {
  return (
    <>
      <Hero />
      <HowItWorks />
      <StyleShowcase />
      <Principles />
      <PricingTeaser />
      <CtaBand />
    </>
  );
}
