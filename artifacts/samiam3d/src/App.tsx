import { BuilderMethod } from "@/components/builder-method";
import { CareerIntro } from "@/components/career-intro";
import { CreatorProducts } from "@/components/creator-products";
import { CursorEmitter } from "@/components/cursor-emitter";
import { Hero } from "@/components/hero";
import { LeadershipBridge } from "@/components/leadership-bridge";
import { LeadershipWork } from "@/components/leadership-work";
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
        <CareerIntro />
        <section
          id="work"
          className="career-work"
          aria-labelledby="leadership-work-title"
        >
          <LeadershipBridge />
          <LeadershipWork />
        </section>
      </main>
      <SiteFooter />
    </>
  );
}

export default App;
