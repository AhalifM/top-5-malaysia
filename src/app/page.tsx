import { FirebaseContentError, readContent } from '@/lib/content-server';
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

export default async function Home() {
  let content;

  try {
    content = await readContent();
  } catch (error) {
    if (error instanceof FirebaseContentError) {
      return (
        <main className="min-h-screen bg-background px-6 py-16 text-foreground">
          <section className="mx-auto max-w-2xl rounded-lg border border-border bg-card p-6">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gold">
              Firebase setup needed
            </p>
            <h1 className="text-2xl font-bold">Content is not readable from Firestore yet.</h1>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              Firebase returned status {error.status} for <code>siteContent/main</code>. Deploy the
              Firestore rules, create an Email/Password admin user, then seed the content document.
            </p>
            <pre className="mt-5 overflow-x-auto rounded-lg border border-border bg-background p-4 text-xs text-muted-foreground">
{`npx firebase-tools deploy --only firestore:rules --project fidz-media-service
FIREBASE_ADMIN_EMAIL="your-admin@email.com" FIREBASE_ADMIN_PASSWORD="your-password" npm run firebase:seed-content`}
            </pre>
          </section>
        </main>
      );
    }

    throw error;
  }

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
