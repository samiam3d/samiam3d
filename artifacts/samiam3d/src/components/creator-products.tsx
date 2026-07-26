import { TrendInkEye } from "@/components/trendink-eye";

const responsiveSource = (name: string, width: 480 | 1200) =>
  `/assets/responsive/creations/${name}-${width}.webp`;

const productStories = [
  {
    id: "clauseink",
    name: "ClauseInk",
    href: "https://www.clauseink.com/",
    logo: "clauseink-logo",
    logoAlt: "ClauseInk",
    line: "Legal work, with the evidence attached.",
    description: "AI-assisted legal drafting with review, redlines, and export in one focused workspace.",
    image: "clauseink-editor-live",
    imageAlt: "ClauseInk contract editor with document and clause review tools",
    width: 2674,
    height: 2014,
  },
  {
    id: "hotclips",
    name: "HotClips",
    href: "https://www.hotclips.pro/",
    logo: "hotclips-mark-blue",
    logoAlt: "HotClips",
    line: "One episode. The moments worth publishing.",
    description: "A podcaster-first clip studio that finds the moments worth watching and keeps the final cut in your hands.",
    image: "hotclips-podcast-studio",
    imageAlt: "HotClips podcast editing studio with episode clips and transcript",
    width: 1672,
    height: 941,
  },
  {
    id: "trendink",
    name: "TrendInk",
    href: "https://www.trendink.app/",
    logo: "trendink-aperture",
    logoAlt: "TrendInk aperture mark",
    line: "See the signal. Make the right thing.",
    description: "A source-backed production studio that carries a live signal from evidence to approved creative and export.",
    image: "trendink-hero-studio",
    imageAlt: "TrendInk aperture artwork representing a focused creative signal",
    width: 1920,
    height: 1280,
  },
] as const;

export function CreatorProducts() {
  return (
    <section
      id="creator-products"
      className="creator-studio"
      aria-labelledby="creator-products-title"
    >
      <div className="creator-studio__intro">
        <div>
          <p className="creator-studio__label">Independent work</p>
          <h2 id="creator-products-title">
            The studio behind the worlds.
          </h2>
        </div>
        <p className="creator-studio__lede">
          I build products that turn messy creative work into a clear,
          human-led path from first spark to finished work. MindInk is the
          story studio; ClauseInk, HotClips, and TrendInk carry the same eye
          into legal drafting, podcast clips, and trend-led production.
        </p>
      </div>

      <article className="creator-feature">
        <div className="creator-feature__copy">
          <p className="creator-feature__index">01 / 04</p>
          <a
            className="creator-brand-lockup creator-brand-lockup--mindink"
            href="https://mindink.ai/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src={responsiveSource("mindink-icon", 480)}
              srcSet={`${responsiveSource("mindink-icon", 480)} 480w, ${responsiveSource("mindink-icon", 1200)} 1200w`}
              width="700"
              height="700"
              loading="lazy"
              decoding="async"
              alt="MindInk"
            />
            <span>MindInk</span>
          </a>
          <p className="creator-feature__line">
            Ideas into worlds. Worlds into scenes.
          </p>
          <p>
            A creator-first story and movie studio for shaping characters,
            branching paths, scenes, sound, and final edits in one production
            flow.
          </p>
        </div>

        <div className="creator-collage" aria-label="MindInk product gallery">
          <figure className="creator-collage__studio">
            <img
              src={responsiveSource("mindink-cosmic-hero", 480)}
              srcSet={`${responsiveSource("mindink-cosmic-hero", 480)} 480w, ${responsiveSource("mindink-cosmic-hero", 1200)} 1200w`}
              sizes="(max-width: 640px) 55vw, 48vw"
              width="1536"
              height="1024"
              loading="lazy"
              decoding="async"
              alt="MindInk story world beneath a trail of stars"
            />
          </figure>
          <figure className="creator-collage__canvas">
            <img
              src={responsiveSource("mindink-galactic-banner", 480)}
              srcSet={`${responsiveSource("mindink-galactic-banner", 480)} 480w, ${responsiveSource("mindink-galactic-banner", 1200)} 1200w`}
              sizes="(max-width: 640px) 55vw, 48vw"
              width="1006"
              height="512"
              loading="lazy"
              decoding="async"
              alt="Galactic Whiskerz story world created in MindInk"
            />
          </figure>
          <figure className="creator-collage__cover">
            <img
              src={responsiveSource("mindink-cover-electric-veins", 480)}
              srcSet={`${responsiveSource("mindink-cover-electric-veins", 480)} 480w, ${responsiveSource("mindink-cover-electric-veins", 1200)} 1200w`}
              sizes="(max-width: 640px) 35vw, 20vw"
              width="512"
              height="713"
              loading="lazy"
              decoding="async"
              alt="Electric Veins story cover created in MindInk"
            />
            <img
              className="creator-collage__cover-secondary"
              src={responsiveSource("mindink-cover-night-match", 480)}
              srcSet={`${responsiveSource("mindink-cover-night-match", 480)} 480w, ${responsiveSource("mindink-cover-night-match", 1200)} 1200w`}
              sizes="(max-width: 640px) 28vw, 14vw"
              width="512"
              height="696"
              loading="lazy"
              decoding="async"
              alt="Night Match story cover created in MindInk"
            />
          </figure>
        </div>
      </article>

      <div className="creator-products-grid">
        {productStories.map((product, index) => (
          <article
            key={product.id}
            className={`creator-product creator-product--${product.id}`}
          >
            <figure className="creator-product__media">
              <img
                src={responsiveSource(product.image, 480)}
                srcSet={`${responsiveSource(product.image, 480)} 480w, ${responsiveSource(product.image, 1200)} 1200w`}
                sizes="(max-width: 640px) 42vw, 26vw"
                width={product.width}
                height={product.height}
                loading="lazy"
                decoding="async"
                alt={product.imageAlt}
              />
              {product.id === "trendink" && (
                <span className="creator-product__robot">
                  <TrendInkEye compact />
                </span>
              )}
            </figure>
            <p className="creator-feature__index">
              {String(index + 2).padStart(2, "0")} / 04
            </p>
            <a
              className="creator-brand-lockup"
              href={product.href}
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src={responsiveSource(product.logo, 480)}
                srcSet={`${responsiveSource(product.logo, 480)} 480w, ${responsiveSource(product.logo, 1200)} 1200w`}
                width="640"
                height="240"
                loading="lazy"
                decoding="async"
                alt={product.logoAlt}
              />
              <span>{product.name}</span>
            </a>
            <p className="creator-product__line">{product.line}</p>
            <p className="creator-product__description">
              {product.description}
            </p>
          </article>
        ))}
      </div>

      <p className="creator-studio__closing">
        Different products, same rule: the person doing the work keeps the
        final call.
      </p>
    </section>
  );
}
