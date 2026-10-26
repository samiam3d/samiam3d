import { useRef, useState } from "react";
import { ArrowUpRight, Play } from "lucide-react";
import { ImageLightbox } from "@/components/portfolio-content";
import {
  leadershipCases,
  leadershipImageSource,
  type LeadershipArtwork,
  type LeadershipCase,
} from "@/lib/leadership-work";

type ArtworkProps = {
  artwork: LeadershipArtwork;
  onOpen: (trigger: HTMLButtonElement) => void;
  archive?: boolean;
};

function Artwork({ artwork, onOpen, archive = false }: ArtworkProps) {
  return (
    <figure className="leadership-artwork">
      <button
        className="leadership-artwork__open"
        type="button"
        onClick={(event) => onOpen(event.currentTarget)}
        aria-label={`Open ${artwork.caption} in image viewer`}
      >
        <img
          src={leadershipImageSource(artwork.src, 480)}
          srcSet={`${leadershipImageSource(artwork.src, 480)} 480w, ${leadershipImageSource(artwork.src, 1200)} 1200w`}
          sizes={archive ? "(max-width: 600px) 44vw, (max-width: 900px) 42vw, 28vw" : "(max-width: 600px) 92vw, (max-width: 900px) 90vw, 80vw"}
          alt={artwork.caption}
          width={artwork.width}
          height={artwork.height}
          loading="lazy"
          decoding="async"
        />
        <span className="leadership-artwork__expand" aria-hidden="true">
          <ArrowUpRight size={18} strokeWidth={1.6} />
        </span>
      </button>
      <figcaption>
        {artwork.caption}
        {artwork.credit && <span className="leadership-artwork__credit">{artwork.credit}</span>}
      </figcaption>
    </figure>
  );
}

function WorkVideo({ video }: { video: NonNullable<LeadershipCase["video"]> }) {
  const [playing, setPlaying] = useState(false);

  return (
    <figure className="leadership-video">
      {playing ? (
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${video.id}?autoplay=1`}
          title={video.title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
        />
      ) : (
        <button type="button" onClick={() => setPlaying(true)} aria-label={`Play ${video.title}`}>
          <img src={`/assets/video-previews/${video.id}.jpg`} alt="" width={480} height={360} loading="lazy" decoding="async" />
          <span className="leadership-video__play"><Play size={24} fill="currentColor" aria-hidden="true" />Play trailer</span>
        </button>
      )}
      <figcaption>{video.title}</figcaption>
    </figure>
  );
}

function WorkCase({ project }: { project: LeadershipCase }) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [archiveOpen, setArchiveOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const images = [...project.featured, ...project.archive];

  const openImage = (index: number, trigger: HTMLButtonElement) => {
    triggerRef.current = trigger;
    setActiveIndex(index);
  };

  return (
    <section id={project.id} className={`leadership-case leadership-case--${project.layout}`} aria-labelledby={`${project.id}-title`}>
      <header className="leadership-case__header">
        <div className="leadership-case__heading">
          <p className="leadership-case__studio">{project.studio}</p>
          <h3 id={`${project.id}-title`}>{project.title}</h3>
        </div>
        <div className="leadership-case__intro">
          <p className="leadership-case__role">{project.role}</p>
          <p>{project.description}</p>
        </div>
      </header>

      <div className={`leadership-case__stage leadership-case__stage--${project.layout}`}>
        {project.featured.map((artwork, index) => (
          <Artwork key={artwork.src} artwork={artwork} onOpen={(trigger) => openImage(index, trigger)} />
        ))}
      </div>

      <p className="leadership-case__credit">{project.credit}</p>

      <details
        className={`leadership-archive leadership-archive--${project.layout}`}
        onToggle={(event) => setArchiveOpen(event.currentTarget.open)}
      >
        <summary>{project.archiveLabel}</summary>
        {archiveOpen && <div className="leadership-archive__content">
          <div className="leadership-archive__grid">
            {project.archive.map((artwork, index) => (
              <Artwork key={artwork.src} artwork={artwork} archive onOpen={(trigger) => openImage(project.featured.length + index, trigger)} />
            ))}
          </div>
          {project.video && <WorkVideo video={project.video} />}
        </div>}
      </details>

      {activeIndex !== null && (
        <ImageLightbox
          images={images.map((artwork) => ({ src: artwork.src, alt: `${artwork.caption}. ${artwork.credit ?? project.credit}` }))}
          activeIndex={activeIndex}
          onChange={setActiveIndex}
          onClose={() => setActiveIndex(null)}
          returnFocusTo={triggerRef.current}
        />
      )}
    </section>
  );
}

export function LeadershipWork() {
  return (
    <div className="leadership-work">
      {leadershipCases.map((project) => (
        <div key={project.id} id={project.id === "ea-visceral" ? "past-projects" : undefined} className="leadership-work__entry">
          <WorkCase project={project} />
        </div>
      ))}
    </div>
  );
}
