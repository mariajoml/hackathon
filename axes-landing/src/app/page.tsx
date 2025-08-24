import { Navbar } from "@/components/navbar";
import { Hero } from "@/components/hero";
import { ValueProposition } from "@/components/value-proposition";
import { HowItWorks } from "@/components/how-it-works";
import { RealConnections } from "@/components/real-connections";
import { DemoSection } from "@/components/demo-section";
import { AuthSection } from "@/components/auth-section";
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
      <AuthSection />
      <FAQSection />
      <Footer />
    </main>
  );
}