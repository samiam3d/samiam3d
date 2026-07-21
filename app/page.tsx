import { Hero } from "@/components/hero";
import { PortfolioContent } from "@/components/portfolio-content";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

type HeroSectionConfig = {
  kind: "hero";
  id: string;
  title: string;
  repeatLines: number;
};

type WorkSectionConfig = {
  kind: "work";
  id: string;
  title: string;
  summary: string;
};

type PageSection = HeroSectionConfig | WorkSectionConfig;

const sections: PageSection[] = [
  { kind: "hero", id: "hero", title: "samiam3d", repeatLines: 3 },
  {
    kind: "work",
    id: "work",
    title: "Selected work",
    summary:
      "Art direction, world building, production design, and interactive storytelling across original work and globally recognized games.",
  },
];

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main>
        {sections.map((section) => {
          if (section.kind === "hero") {
            return <Hero key={section.id} title={section.title} repeatLines={section.repeatLines} />;
          }

          return (
            <section key={section.id} id={section.id} className="work-section" aria-labelledby={`${section.id}-title`}>
              <div className="work-intro">
                <h2 id={`${section.id}-title`}>{section.title}</h2>
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
