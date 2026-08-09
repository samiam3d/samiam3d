import { useRef } from "react";
import { ArrowUpRight } from "lucide-react";
import {
  responsiveCreatorAsset,
  type CreatorProjectId,
} from "@/lib/creator-projects";

// ─── Static content ──────────────────────────────────────────────────────────

const storyPosters = [
  {
    asset: "mindink-cover-night-match",
    alt: "MindInk story cover — a cinematic world created in MindInk",
    width: 800,
    height: 1200,
  },
  {
    asset: "mindink-world-cover",
    alt: "MindInk world cover — a published story world",
    width: 1024,
    height: 1536,
  },
  {
    asset: "mindink-cover-electric-veins",
    alt: "MindInk story cover — another cinematic world created in MindInk",
    width: 800,
    height: 1200,
  },
] as const;

const proofItems = [
  {
    asset: "mindink-story-canvas",
    alt: "MindInk Branch Canvas — visual story architecture with connected narrative beats",
    width: 1400,
    height: 900,
    index: "01",
    label: "Branch Canvas",
    description:
      "Architect branching narratives visually. Connect beats, paths, and choices into living story structures.",
  },
  {
    asset: "mindink-studio",
    alt: "MindInk Scene Editor — cinematic creation studio for movies and sound",
    width: 1280,
    height: 720,
    index: "02",
    label: "Scene Editor",
    description:
      "Direct cinematic scenes with tools for dialogue, action, sound, and visual direction.",
  },
  {
    asset: "mindink-galactic-banner",
    alt: "MindInk Story Worlds — publish your creations to a reading audience",
    width: 1600,
    height: 900,
    index: "03",
    label: "Story Worlds",
    description:
      "Publish complete worlds — posters, trailers, branching stories — directly to readers.",
  },
] as const;

// ─── Orb ─────────────────────────────────────────────────────────────────────

function MindInkOrb() {
  return (
    <div className="mindink-orb" aria-hidden="true">
      <div className="mindink-orb__halo mindink-orb__halo--outer" />
      <div className="mindink-orb__halo mindink-orb__halo--mid" />
      <div className="mindink-orb__halo" />
      <img
        className="mindink-orb__image"
        src={responsiveCreatorAsset("mindink-icon", 480)}
        srcSet={`${responsiveCreatorAsset("mindink-icon", 480)} 480w, ${responsiveCreatorAsset("mindink-icon", 1200)} 1200w`}
        sizes="clamp(9rem, 15vw, 14rem)"
        width={700}
        height={700}
        alt=""
        decoding="async"
        loading="eager"
      />
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function MindInkFlagship({
  onOpen,
}: {
  onOpen: (id: CreatorProjectId, trigger: HTMLButtonElement) => void;
}) {
  const ctaRef = useRef<HTMLButtonElement>(null);

  return (
    <div className="mindink-flagship">
      {/* ── Hero: orb + title ── */}
      <div className="mindink-flagship__inner">
        <div className="mindink-flagship__hero">
          <div className="mindink-flagship__orb-area">
            <MindInkOrb />
          </div>

          <div className="mindink-flagship__title-area">
            <p className="mindink-flagship__eyebrow">Flagship Venture</p>
            <h2 className="mindink-flagship__title">MindInk</h2>
            <p className="mindink-flagship__tagline">
              A complete creative studio for stories, worlds, movies, and
              publishing.
            </p>
            <button
              ref={ctaRef}
              className="mindink-flagship__cta"
              type="button"
              aria-haspopup="dialog"
              aria-label="View MindInk project details"
              onClick={() => {
                if (ctaRef.current) onOpen("mindink", ctaRef.current);
              }}
            >
              <span>Enter MindInk</span>
              <ArrowUpRight aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* ── Story worlds label ── */}
        <div className="mindink-flagship__section-head" aria-hidden="true">
          <span>Story worlds</span>
        </div>

        {/* ── Story poster reel ── */}
        <div
          className="mindink-story-reel"
          role="group"
          aria-label="MindInk story world covers"
        >
          {storyPosters.map((poster, i) => (
            <figure
              key={poster.asset}
              className={`mindink-story-reel__poster mindink-story-reel__poster--${i + 1}`}
            >
              <img
                src={responsiveCreatorAsset(poster.asset, 480)}
                srcSet={`${responsiveCreatorAsset(poster.asset, 480)} 480w, ${responsiveCreatorAsset(poster.asset, 1200)} 1200w`}
                sizes="(max-width: 640px) 42vw, (max-width: 900px) 28vw, 22vw"
                width={poster.width}
                height={poster.height}
                alt={poster.alt}
                loading="lazy"
                decoding="async"
              />
            </figure>
          ))}
        </div>
      </div>

      {/* ── Full-bleed cinematic worlds collage ── */}
      <div
        className="mindink-worlds"
        role="img"
        aria-label="MindInk characters and story worlds — a cinematic collage"
      >
        <img
          src={responsiveCreatorAsset("mindink-cosmic-hero", 480)}
          srcSet={`${responsiveCreatorAsset("mindink-cosmic-hero", 480)} 480w, ${responsiveCreatorAsset("mindink-cosmic-hero", 1200)} 1200w`}
          sizes="100vw"
          width={1920}
          height={1080}
          alt=""
          loading="lazy"
          decoding="async"
        />
      </div>

      {/* ── Product proof ── */}
      <div className="mindink-flagship__inner">
        <div className="mindink-flagship__section-head" aria-hidden="true">
          <span>The creation system</span>
        </div>

        <div className="mindink-proof" aria-label="MindInk creation tools">
          {proofItems.map((item) => (
            <div key={item.asset} className="mindink-proof__item">
              <figure className="mindink-proof__frame">
                <img
                  src={responsiveCreatorAsset(item.asset, 480)}
                  srcSet={`${responsiveCreatorAsset(item.asset, 480)} 480w, ${responsiveCreatorAsset(item.asset, 1200)} 1200w`}
                  sizes="(max-width: 640px) 90vw, (max-width: 900px) 45vw, 28vw"
                  width={item.width}
                  height={item.height}
                  alt={item.alt}
                  loading="lazy"
                  decoding="async"
                />
              </figure>
              <p className="mindink-proof__index">{item.index}</p>
              <p className="mindink-proof__label">{item.label}</p>
              <p className="mindink-proof__desc">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
