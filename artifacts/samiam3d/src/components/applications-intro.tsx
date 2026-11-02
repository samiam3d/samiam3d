import { useState, type CSSProperties } from "react";
import { ArrowDownRight } from "lucide-react";
import { ProjectBrand, ProjectBrandMark } from "@/components/project-brand";
import { creatorProjects, type CreatorProjectId } from "@/lib/creator-projects";
import { applicationViewSource } from "@/lib/application-visuals";
import { mindinkViewSource } from "@/lib/mindink-showcase";
import "./applications-intro.css";

const previews: Record<CreatorProjectId, { purpose: string; accent: string; src: string }> = {
  mindink: { purpose: "Stories, worlds & film", accent: "#859cff", src: mindinkViewSource("movie-creator") },
  vibemind: { purpose: "Ideas into working apps", accent: "#bea3f3", src: applicationViewSource("vibemind", "hero") },
  "flower-musica": { purpose: "Sound & music creation", accent: "#b6e66d", src: applicationViewSource("flower-musica", "hero") },
  hotclips: { purpose: "Podcast to publish", accent: "#72d5e5", src: applicationViewSource("hotclips", "hero") },
  trendink: { purpose: "Research into film", accent: "#d9c4a8", src: applicationViewSource("trendink", "hero") },
  clauseink: { purpose: "Draft, review & refine", accent: "#8bb8fa", src: applicationViewSource("clauseink", "hero") },
};

export function ApplicationsIntro() {
  const [previewId, setPreviewId] = useState<CreatorProjectId>("mindink");
  const project = creatorProjects.find((item) => item.id === previewId)!;
  const preview = previews[previewId];

  return (
    <div className="applications-intro" style={{ "--application-accent": preview.accent } as CSSProperties}>
      <div className="applications-intro__inner">
        <header className="applications-intro__heading">
          <h2 id="creator-products-title"><span>My</span>{" "}<span>applications.</span></h2>
          <p>I make the worlds, the tools, and the brands around them.</p>
        </header>

        <div className="applications-intro__stage">
          <a
            className="applications-intro__preview"
            href={`#project-${project.id}`}
            aria-label={`View ${project.name} application`}
          >
            <div className="applications-intro__preview-heading">
              <ProjectBrand project={project} decorative />
              <span>View application <ArrowDownRight size={20} aria-hidden="true" /></span>
            </div>
            <div className="applications-intro__screen">
              <img
                src={preview.src}
                alt={`${project.name} overview: ${preview.purpose}. Product visualization.`}
                width={1672}
                height={941}
                loading="lazy"
                decoding="async"
              />
            </div>
          </a>
          <p className="applications-intro__caption">
            <span>{preview.purpose}</span>
            <span>Product visualization</span>
          </p>
        </div>

        <nav className="applications-intro__index" aria-label="Explore my projects">
          {creatorProjects.map((item) => (
            <a
              href={`#project-${item.id}`}
              key={item.id}
              aria-label={item.name}
              data-previewing={previewId === item.id}
              style={{ "--item-accent": previews[item.id].accent } as CSSProperties}
              onPointerEnter={(event) => {
                if (event.pointerType !== "touch") setPreviewId(item.id);
              }}
              onFocus={() => setPreviewId(item.id)}
            >
              <span className="applications-intro__identity">
                <ProjectBrandMark project={item} />
                {item.id !== "clauseink" && <span>{item.name}</span>}
              </span>
              <span className="applications-intro__purpose">{previews[item.id].purpose}</span>
              <ArrowDownRight size={18} aria-hidden="true" />
            </a>
          ))}
        </nav>
      </div>
    </div>
  );
}
