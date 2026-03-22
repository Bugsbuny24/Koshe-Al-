import { Navbar } from '@/components/layout/Navbar';
import { HeroSection } from '@/components/landing/HeroSection';
import { ValueCardsSection } from '@/components/landing/ValueCardsSection';
import { HowItWorksSection } from '@/components/landing/HowItWorksSection';
import { ModulesSection } from '@/components/landing/ModulesSection';
import { UseCasesSection } from '@/components/landing/UseCasesSection';
import { WhyKoscheiSection } from '@/components/landing/WhyKoscheiSection';
import { AudienceSection } from '@/components/landing/AudienceSection';
import { FlowExampleSection } from '@/components/landing/FlowExampleSection';
import { TrustStructureSection } from '@/components/landing/TrustStructureSection';
import { PrimaryCtaSection } from '@/components/landing/PrimaryCtaSection';
import { PricingTeaserSection } from '@/components/landing/PricingTeaserSection';
import { FinalCtaSection } from '@/components/landing/FinalCtaSection';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-bg-void">
      <Navbar />
      <main>
        <HeroSection />
        <ValueCardsSection />
        <HowItWorksSection />
        <ModulesSection />
        <UseCasesSection />
        <WhyKoscheiSection />
        <AudienceSection />
        <FlowExampleSection />
        <TrustStructureSection />
        <PrimaryCtaSection />
        <PricingTeaserSection />
        <FinalCtaSection />
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 py-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-accent-blue flex items-center justify-center text-white font-bold text-xs">K</div>
            <span className="font-bold text-white">Koschei</span>
            <span className="text-slate-600 text-sm ml-2">© 2024</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-slate-500">
            <a href="#" className="hover:text-white transition-colors">Gizlilik</a>
            <a href="#" className="hover:text-white transition-colors">Kullanım Şartları</a>
            <a href="#" className="hover:text-white transition-colors">İletişim</a>
          </div>
          <div className="text-xs text-slate-600">
            Powered by Gemini AI
          </div>
        </div>
      </footer>
    </div>
  );
}
