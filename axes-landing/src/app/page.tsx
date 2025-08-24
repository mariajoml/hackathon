import { Navbar } from "@/components/navbar";
import { Hero } from "@/components/hero";
import { ValueProposition } from "@/components/value-proposition";
import { HowItWorks } from "@/components/how-it-works";
import { RealConnections } from "@/components/real-connections";
import { DemoSection } from "@/components/demo-section";
import { UserTypeSelector } from "@/components/user-type-selector";
import { FAQSection } from "@/components/faq-section";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <main className="relative">
      <Navbar />
      <Hero />
      <ValueProposition />
      <HowItWorks />
      <RealConnections />
      <DemoSection />
      <UserTypeSelector />
      <FAQSection />
      <Footer />
    </main>
  );
}