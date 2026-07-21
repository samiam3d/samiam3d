import { SiteHeader } from "@/components/site-header";
import { Hero } from "@/components/hero";
import { PortfolioContent } from "@/components/portfolio-content";
import { SiteFooter } from "@/components/site-footer";
import { CursorEmitter } from "@/components/cursor-emitter";

type HeroSectionConfig = {
  kind: "hero";
  id: "hero";
  title: string;
};

type WorkSectionConfig = {
  kind: "work";
  id: "work";
};

type PageSection = HeroSectionConfig | WorkSectionConfig;

const sections: PageSection[] = [
  { kind: "hero", id: "hero", title: "samiam3D" },
  { kind: "work", id: "work" },
];

function App() {
  return (
    <>
      <CursorEmitter />
      <SiteHeader />
      <main>
        {sections.map((section) => {
          if (section.kind === "hero") {
            return <Hero key={section.id} title={section.title} />;
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
