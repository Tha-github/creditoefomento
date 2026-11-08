import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import { SkipLink } from '@/components/layout/SkipLink';
import { WhatsAppFloat } from '@/components/layout/WhatsAppFloat';
import { sectionIds } from '@/config/navigation';
import { About } from '@/sections/about/About';
import { Approach } from '@/sections/approach/Approach';
import { Contact } from '@/sections/contact/Contact';
import { Differentials } from '@/sections/differentials/Differentials';
import { Faq } from '@/sections/faq/Faq';
import { Hero } from '@/sections/hero/Hero';
import { Process } from '@/sections/process/Process';
import { Solutions } from '@/sections/solutions/Solutions';

export function HomePage() {
  return (
    <>
      <SkipLink />
      <Header />
      <main id={sectionIds.main} tabIndex={-1}>
        <Hero />
        <About />
        <Differentials />
        <Solutions />
        <Process />
        <Approach />
        <Faq />
        <Contact />
      </main>
      <Footer />
      <WhatsAppFloat />
    </>
  );
}
