const responsiveSource = (name: string, width: 480 | 1200) =>
  `/assets/responsive/creations/${name}-${width}.webp`;

const productStories = [
  {
    id: "clauseink",
    name: "ClauseInk",
    line: "Legal work, with the evidence attached.",
    description:
      "A matter-aware workspace for reviewing documents, drafting exact redlines, and approving every change with its history intact.",
    image: "clauseink-editor",
    imageAlt: "ClauseInk contract editor with document and clause review tools",
    width: 1265,
    height: 780,
  },
  {
    id: "hotclips",
    name: "HotClips",
    line: "One episode. The moments worth publishing.",
    description:
      "A podcaster-first producer that finds coherent short-form moments, explains why they work, and keeps the creator in charge of every cut.",
    image: "hotclips-studio",
    imageAlt: "HotClips podcast editing studio with episode clips and transcript",
    width: 1672,
    height: 941,
  },
  {
    id: "trendink",
    name: "TrendInk",
    line: "See the signal. Make the right thing.",
    description:
      "An evidence-led creative studio that turns source-backed trends into approved direction, campaign plans, and finished media.",
    image: "trendink-aperture",
    imageAlt: "TrendInk aperture artwork representing a focused creative signal",
    width: 2400,
    height: 2400,
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
          <p className="creator-studio__label">Founder and product creator</p>
          <h2 id="creator-products-title">
            I don&apos;t just build worlds. I build the tools behind them.
          </h2>
        </div>
        <p className="creator-studio__lede">
          After years directing game art and interactive experiences, I started
          building a creative stack of my own. MindInk is the center: a
          creator-first story and movie studio built to take an idea from first
          spark to final scene. ClauseInk, HotClips, and TrendInk apply the same
          approach to legal work, short-form video, and trend-led creation.
        </p>
      </div>

      <article className="creator-feature">
        <div className="creator-feature__copy">
          <p className="creator-feature__index">01 / 04</p>
          <h3>MindInk</h3>
          <p className="creator-feature__line">
            Ideas into worlds. Worlds into scenes.
          </p>
          <p>
            A creator-first story and movie studio for shaping narrative,
            characters, branching paths, shots, sound, and final edits in one
            production flow.
          </p>
        </div>

        <div className="creator-collage" aria-label="MindInk product gallery">
          <figure className="creator-collage__studio">
            <img
              src={responsiveSource("mindink-studio", 480)}
              srcSet={`${responsiveSource("mindink-studio", 480)} 480w, ${responsiveSource("mindink-studio", 1200)} 1200w`}
              sizes="(max-width: 640px) 55vw, 48vw"
              width="1280"
              height="720"
              loading="lazy"
              decoding="async"
              alt="MindInk story studio with writing and production controls"
            />
          </figure>
          <figure className="creator-collage__canvas">
            <img
              src={responsiveSource("mindink-story-canvas", 480)}
              srcSet={`${responsiveSource("mindink-story-canvas", 480)} 480w, ${responsiveSource("mindink-story-canvas", 1200)} 1200w`}
              sizes="(max-width: 640px) 55vw, 48vw"
              width="1400"
              height="900"
              loading="lazy"
              decoding="async"
              alt="MindInk branching story canvas connecting narrative scenes"
            />
          </figure>
          <figure className="creator-collage__cover">
            <img
              src={responsiveSource("mindink-world-cover", 480)}
              srcSet={`${responsiveSource("mindink-world-cover", 480)} 480w, ${responsiveSource("mindink-world-cover", 1200)} 1200w`}
              sizes="(max-width: 640px) 35vw, 20vw"
              width="1024"
              height="1536"
              loading="lazy"
              decoding="async"
              alt="Galactic Whiskerz cinematic world cover created in MindInk"
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
            </figure>
            <p className="creator-feature__index">
              {String(index + 2).padStart(2, "0")} / 04
            </p>
            <h3>{product.name}</h3>
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
