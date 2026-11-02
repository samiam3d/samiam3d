import { ArrowUpRight } from "lucide-react";
import { leadershipImageSource } from "@/lib/leadership-work";
import { mindinkViewSource } from "@/lib/mindink-showcase";
import "./builder-practice.css";

const characterPipeline = "/assets/images/2015/08/monsters_character_pipeline.jpg";

export function BuilderMethod() {
  return (
    <section id="builder-method" className="builder-practice" aria-labelledby="builder-method-title">
      <div className="builder-practice__inner">
        <header className="builder-practice__intro">
          <h2 id="builder-method-title">
            <span>I lead creative teams.</span>{" "}
            <span>I build creative tools.</span>
          </h2>
          <p>
            I set the visual direction, bring teams together, and carry ideas
            through production. I also design and build the tools that make
            new kinds of creative work possible.
          </p>
        </header>

        <div className="builder-practice__work">
          <article className="builder-practice__example builder-practice__example--direction">
            <div className="builder-practice__example-heading">
              <h3>Art direction</h3>
              <span>Universal Monsters Online</span>
            </div>
            <a className="builder-practice__image" href="#bigpoint" aria-label="Explore the Universal Monsters Online art direction work">
              <img
                src={leadershipImageSource(characterPipeline, 480)}
                srcSet={`${leadershipImageSource(characterPipeline, 480)} 480w, ${leadershipImageSource(characterPipeline, 1200)} 1200w`}
                sizes="(max-width: 900px) 92vw, 48vw"
                width={3280}
                height={1846}
                alt="Universal Monsters Online character pipeline: sketches, final concepts, and game models developed by the team under Sam’s art direction"
                loading="lazy"
                decoding="async"
              />
              <span className="builder-practice__image-action" aria-hidden="true"><ArrowUpRight size={22} /></span>
            </a>
            <div className="builder-practice__detail">
              <p>
                At Bigpoint, I led <strong>12+ artists</strong> and set the visual
                direction and character pipeline for Universal Monsters Online.
              </p>
              <a href="#bigpoint">See the art direction work <ArrowUpRight size={18} aria-hidden="true" /></a>
              <p className="builder-practice__credit">
                Art direction: Sam Gutierrez. Final concepts: Christian MacNevin.
                3D character models: Eric Maki.
              </p>
            </div>
          </article>

          <article className="builder-practice__example builder-practice__example--product">
            <div className="builder-practice__example-heading">
              <h3>Product building</h3>
              <span>MindInk</span>
            </div>
            <a className="builder-practice__image" href="#project-mindink" aria-label="Explore MindInk’s creative tools">
              <img
                src={mindinkViewSource("branch-canvas")}
                width={1672}
                height={941}
                alt="MindInk Branch Canvas product visualization, connecting story scenes and branching choices in one creative workspace"
                loading="lazy"
                decoding="async"
              />
              <span className="builder-practice__image-action" aria-hidden="true"><ArrowUpRight size={22} /></span>
            </a>
            <div className="builder-practice__detail">
              <p>
                I founded <strong>MindInk</strong> and built its story
                architecture, creative workflows, brand, and product experience.
              </p>
              <a href="#project-mindink">Explore the creative tools <ArrowUpRight size={18} aria-hidden="true" /></a>
              <p className="builder-practice__credit">MindInk Branch Canvas. Product visualization.</p>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
