import { readContent } from '@/lib/content-server';
import Navbar from '@/components/site/Navbar';
import HeroSection from '@/components/site/HeroSection';
import BenefitsSection from '@/components/site/BenefitsSection';
import CompanySection from '@/components/site/CompanySection';
import PricingSection from '@/components/site/PricingSection';
import PortfolioSection from '@/components/site/PortfolioSection';
import FAQSection from '@/components/site/FAQSection';
import Footer from '@/components/site/Footer';
import { themeToCssVariables } from '@/lib/content';

export const dynamic = 'force-dynamic';

export default function Home() {
  const content = readContent();

  return (
    <main
      className="relative overflow-hidden bg-background text-foreground"
      style={themeToCssVariables(content.theme)}
    >
      <Navbar brand={content.brand} ctaLink={content.hero.ctaLink} ctaText={content.hero.ctaText} />
      <HeroSection content={content.hero} />
      <BenefitsSection content={content.benefits} />
      <CompanySection content={content.company} />
      <PricingSection content={content.pricing} />
      <PortfolioSection content={content.portfolio} />
      <FAQSection content={content.faq} />
      <Footer
        brand={content.brand}
        content={content.footer}
        ctaLink={content.hero.ctaLink}
        ctaText={content.hero.ctaText}
      />
    </main>
  );
}
