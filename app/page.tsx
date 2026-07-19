import { Hero } from "@/components/hero";
import { PortfolioContent } from "@/components/portfolio-content";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main>
        <Hero />
        <section id="work" className="work-section" aria-labelledby="work-title">
          <div className="work-intro">
            <h2 id="work-title">Selected work</h2>
            <p>
              Art direction, world building, production design, and interactive
              storytelling across original work and globally recognized games.
            </p>
          </div>
          <PortfolioContent />
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
