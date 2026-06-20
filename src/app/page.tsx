import CreativeNav from "@/components/CreativeNav";
import StarField from "@/components/StarField";
import HeroSection from "@/components/HeroSection";
import FeaturesSection from "@/components/FeaturesSection";
import ModesSection from "@/components/ModesSection";
import UsageSection from "@/components/UsageSection";
import InstallSection from "@/components/InstallSection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="relative min-h-screen">
      {/* Global animations */}
      <StarField />

      {/* Navigation */}
      <CreativeNav />

      <HeroSection />

      <div className="relative h-px max-w-3xl mx-auto">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[var(--border-bright)] to-transparent" />
      </div>

      <FeaturesSection />

      <div className="relative h-px max-w-3xl mx-auto">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[var(--border-bright)] to-transparent" />
      </div>

      <ModesSection />

      <div className="relative h-px max-w-3xl mx-auto">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[var(--border-bright)] to-transparent" />
      </div>

      <UsageSection />

      <div className="relative h-px max-w-3xl mx-auto">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[var(--border-bright)] to-transparent" />
      </div>

      <InstallSection />

      <Footer />
    </main>
  );
}
