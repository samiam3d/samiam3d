import { BuilderMethod } from "@/components/builder-method";
import { CreatorProducts } from "@/components/creator-products";
import { CursorEmitter } from "@/components/cursor-emitter";
import { Hero } from "@/components/hero";
import { LeadershipBridge } from "@/components/leadership-bridge";
import { PortfolioContent } from "@/components/portfolio-content";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

function App() {
  return (
    <>
      <CursorEmitter />
      <a className="skip-link" href="#builder-method">
        Skip to introduction
      </a>
      <a className="skip-link skip-link--second" href="#work">
        Skip to leadership work
      </a>
      <SiteHeader />
      <main>
        <Hero title="samiam3D" />
        <BuilderMethod />
        <CreatorProducts />
        <LeadershipBridge />
        <section
          id="work"
          className="work-section"
          aria-labelledby="leadership-work-title"
        >
          <div className="work-section__intro">
            <p>Selected leadership</p>
            <h2 id="leadership-work-title">Leadership at scale.</h2>
            <span>
              Creative direction, world-building, production systems, and team
              leadership across global studios, major IP, and original worlds.
            </span>
          </div>
          <PortfolioContent />
        </section>
      </main>
      <SiteFooter />
    </>
  );
}

export default App;
