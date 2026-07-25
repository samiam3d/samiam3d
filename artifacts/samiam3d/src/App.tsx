import { SiteHeader } from "@/components/site-header";
import { Hero } from "@/components/hero";
import { PortfolioContent } from "@/components/portfolio-content";
import { SiteFooter } from "@/components/site-footer";
import { CursorEmitter } from "@/components/cursor-emitter";
import { CreatorProducts } from "@/components/creator-products";

type HeroSectionConfig = {
  kind: "hero";
  id: "hero";
  title: string;
};

type WorkSectionConfig = {
  kind: "work";
  id: "work";
};

type CreatorSectionConfig = {
  kind: "creator";
  id: "creator-products";
};

type PageSection = HeroSectionConfig | CreatorSectionConfig | WorkSectionConfig;

const sections: PageSection[] = [
  { kind: "hero", id: "hero", title: "samiam3D" },
  { kind: "creator", id: "creator-products" },
  { kind: "work", id: "work" },
];

function App() {
  return (
    <>
      <CursorEmitter />
      <a className="skip-link" href="#creator-products">
        Skip to independent products
      </a>
      <a className="skip-link skip-link--second" href="#work">
        Skip to portfolio
      </a>
      <SiteHeader />
      <main>
        {sections.map((section) => {
          if (section.kind === "hero") {
            return <Hero key={section.id} title={section.title} />;
          }

          if (section.kind === "creator") {
            return <CreatorProducts key={section.id} />;
          }

          return (
            <section
              id={section.id}
              className="work-section"
              aria-label="Portfolio work"
              key={section.id}
            >
              <PortfolioContent />
            </section>
          );
        })}
      </main>
      <SiteFooter />
    </>
  );
}

export default App;
