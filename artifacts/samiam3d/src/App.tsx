import { SiteHeader } from "@/components/site-header";
import { Hero } from "@/components/hero";
import { PortfolioContent } from "@/components/portfolio-content";
import { SiteFooter } from "@/components/site-footer";

type HeroSectionConfig = {
  kind: "hero";
  id: "hero";
  title: string;
  repeatLines: number;
};

type WorkSectionConfig = {
  kind: "work";
  id: "work";
  title: string;
  summary: string;
};

type PageSection = HeroSectionConfig | WorkSectionConfig;

const sections: PageSection[] = [
  { kind: "hero", id: "hero", title: "samiam3d", repeatLines: 4 },
  {
    kind: "work",
    id: "work",
    title: "Selected work",
    summary:
      "Art direction, world building, production design, and interactive storytelling across original work and globally recognized games.",
  },
];

function App() {
  return (
    <>
      <SiteHeader />
      <main>
        {sections.map((section) => {
          if (section.kind === "hero") {
            return (
              <Hero
                key={section.id}
                title={section.title}
                repeatLines={section.repeatLines}
              />
            );
          }

          return (
            <section
              id={section.id}
              className="work-section"
              aria-labelledby="work-title"
              key={section.id}
            >
              <div className="work-intro">
                <h2 id="work-title">{section.title}</h2>
                <p>{section.summary}</p>
              </div>
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
