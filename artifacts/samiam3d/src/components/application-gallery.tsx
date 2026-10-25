import { useState } from "react";
import {
  applicationViews,
  applicationViewSource,
  type ApplicationVisualId,
} from "@/lib/application-visuals";

export function ApplicationGallery({
  projectId,
  name,
}: {
  projectId: ApplicationVisualId;
  name: string;
}) {
  const [activeId, setActiveId] = useState<"hero" | "detail">("hero");
  const views = applicationViews[projectId];
  const view = views.find((item) => item.id === activeId)!;
  const panelId = `${projectId}-product-view`;

  return (
    <div className="application-gallery">
      <div className="application-gallery__toolbar">
        <p>Inside {name}</p>
        <div
          className="application-gallery__switcher"
          role="group"
          aria-label={`${name} views`}
        >
          {views.map((item) => (
            <button
              type="button"
              key={item.id}
              aria-pressed={activeId === item.id}
              aria-controls={panelId}
              onClick={() => setActiveId(item.id)}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
      <figure id={panelId} aria-label={`${name}: ${view.label}`}>
        <div className="application-gallery__screen">
          <img
            key={view.id}
            src={applicationViewSource(projectId, view.id)}
            alt={view.alt}
            width="1672"
            height="941"
            loading="lazy"
            decoding="async"
          />
        </div>
        <figcaption className="application-gallery__caption">
          <div>
            <h4>{view.headline}</h4>
            <p>{view.description}</p>
          </div>
          <span>Product visualization</span>
        </figcaption>
      </figure>
    </div>
  );
}
