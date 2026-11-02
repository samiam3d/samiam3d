import { ArrowDown, ArrowUpRight } from "lucide-react";
import { leadershipImageSource } from "@/lib/leadership-work";

const careerScenes = [
  {
    id: "mattel",
    title: "Hot Wheels",
    detail: "Early game concept",
    src: "/assets/images/2025/04/Hotwheels-Gravity-Race-scaled.png",
    width: 1024,
    height: 539,
  },
  {
    id: "tales",
    title: "Tales",
    detail: "Art direction & co-founder",
    src: "/assets/images/2025/02/ScareStreet_cover.jpg",
    width: 753,
    height: 1024,
  },
  {
    id: "ea-visceral",
    title: "Battlefield Hardline",
    detail: "Art production & leadership",
    src: "/assets/images/2025/02/2555467-battlefield-hardline-4-wm-1.jpg",
    width: 1024,
    height: 577,
  },
] as const;

export function CareerIntro() {
  return (
    <section
      id="leadership"
      className="career-prelude"
      aria-labelledby="career-intro-title"
    >
      <nav className="career-prelude__visual" aria-label="Featured professional work">
        <div className="career-prelude__scenes">
          {careerScenes.map((scene) => (
            <a
              className={`career-prelude__scene career-prelude__scene--${scene.id}`}
              href={`#${scene.id}`}
              key={scene.id}
            >
              <img
                src={leadershipImageSource(scene.src, 480)}
                srcSet={`${leadershipImageSource(scene.src, 480)} 480w, ${leadershipImageSource(scene.src, 1200)} 1200w`}
                sizes="(max-width: 700px) 45vw, 50vw"
                width={scene.width}
                height={scene.height}
                alt=""
                loading="lazy"
                decoding="async"
              />
              <span className="career-prelude__scene-label">
                <span>{scene.title}<small>{scene.detail}</small></span>
                <ArrowUpRight size={20} aria-hidden="true" />
              </span>
            </a>
          ))}
        </div>
      </nav>
      <div className="career-prelude__content">
        <header className="career-prelude__heading">
          <p className="career-prelude__label">Professional work</p>
          <h2 id="career-intro-title">
            <span>Art direction.</span>
            <span>Creative leadership.</span>
          </h2>
          <a className="career-prelude__explore" href="#work">
            Explore my career <ArrowDown size={20} aria-hidden="true" />
          </a>
        </header>
        <div className="career-prelude__copy">
          <p>
            I’m an art director and creative leader. I set the visual direction,
            lead multidisciplinary teams, and guide games and interactive stories
            from concept through production. As co-founder and Art Director at
            Tales, I led a distributed art team and helped shape the product.
          </p>
          <p>
            That same creative leadership shapes the applications I build today.
          </p>
        </div>
      </div>
    </section>
  );
}
