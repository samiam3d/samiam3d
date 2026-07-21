const paragraphCopy: Record<number, string | null> = {
  1: "I shape Mattel's digital games from first concept through prototype, setting the creative bar, reviewing art, and building faster production workflows across its brands.",
  3: "At Tales, I led the art direction for a platform that turns stories into interactive games, comics, books, and audio experiences.",
  4: "I directed a distributed team across multiple time zones, giving every artist a clear visual target and a fast path to feedback.",
  5: "I helped bring AI into the Tales Creator workflow, cutting publishing from months to days and growing the reusable art library fourfold.",
  6: "I designed key parts of the avatar system and the creator UI, making complex story tools feel direct and approachable.",
  7: "I built and directed a global artist network producing characters, environments, covers, and in-game art at scale.",
  8: "A small team shipped at studio scale by pairing strong direction with lean production systems.",
  9: "The goal was simple: give independent storytellers the tools and production power of a full studio.",
  10: null,
  11: null,
  12: "For Battlefield Hardline, I directed external art production across characters, weapons, props, and environments while protecting quality, performance, and schedule.",
  13: "I aligned internal leads and partner studios on scope, references, reviews, and delivery standards before production started.",
  14: "Every asset had to read clearly, run efficiently, and arrive ready for integration.",
  15: null,
  16: null,
  17: "For Universal Monsters Online, I led a team of more than 12 artists across concept, character, environment, UI, and VFX.",
  18: "We turned classic movie monsters into distinct playable classes and built a dark, readable world around fast team combat.",
  19: null,
  20: "<strong>Direction:</strong><br>I defined the visual language, production standards, and review process that kept every discipline moving toward one game.",
  21: null,
  22: "<strong>Character pipeline:</strong><br>Clear silhouettes, class identity, and repeatable asset rules made a large monster roster feel cohesive.",
  23: null,
  24: "<strong>Environments:</strong><br>I directed levels around atmosphere, navigation, and combat readability, not decoration alone.",
  25: "Lighting and VFX focused attention, reinforced mood, and made each battle easier to read.",
  26: null,
  27: "For Ruined Online, I led environment, character, VFX, and UI artists while contributing hands-on across the full visual pipeline.",
  28: "Ruined was a free-to-play browser arena shooter set across post-apocalyptic American landmarks, built in Unity with a graphic-novel edge.",
  29: null,
  30: "I worked with engineering to control draw calls and download size, and with marketing to make the game's strongest visual hooks immediately clear.",
  31: null,
  32: null,
  33: "At 2K Sports, I built and led stadium environments for MLB, NBA, and NHL titles, balancing real-world accuracy with console performance.",
  34: "I lit arenas to match broadcast drama and the rhythm of live sport.",
  35: "I also led cut-scenes, turning key plays and celebrations into concise cinematic moments.",
  36: "Close work with technical artists and graphics programmers pushed visual fidelity without losing frame rate.",
  37: null,
  38: "Toy Truck prototype: I created the art style, environments, and vehicles for a canceled side-scrolling mobile game.",
};

const altCopy: Record<string, string> = {
  "71": "Universal Monsters Online art-direction presentation",
  "65": "Universal Monsters Online art-bible samples",
  "281": "Universal Monsters Online character-development pipeline",
  "62": "Universal Monsters Online gameplay overview",
  "61": "Universal Monsters Online environment screenshot one",
  "60": "Universal Monsters Online environment screenshot two",
  "59": "Universal Monsters Online environment screenshot three",
  "70": "Universal Monsters Online Bavaria arena screenshot one",
  "69": "Universal Monsters Online Bavaria arena screenshot two",
  "68": "Universal Monsters Online Bavaria arena screenshot three",
  "67": "Universal Monsters Online Bavaria arena screenshot four",
  "49": "Ruined Online Golden Gate gameplay screenshot one",
  "48": "Ruined Online Golden Gate gameplay screenshot two",
  "31": "Ruined Online Golden Gate Bridge battle key art",
  "29": "Ruined Online combat gameplay",
  "30": "Ruined Online Alcatraz environment",
  "46": "Ruined Online environment screenshot",
  "47": "Ruined Online 2D environment concept",
  "38": "Ruined Online weapon concept sheet",
  "303": "Ruined Online Liberty Island key art",
  "297": "Toy Truck jungle environment",
  "296": "Toy Truck environment work in progress",
};

export function preparePortfolioHtml(html: string) {
  const document = new DOMParser().parseFromString(html, "text/html");

  document.querySelectorAll("h1.wp-block-heading").forEach((heading) => {
    const replacement = document.createElement("h2");
    Array.from(heading.attributes).forEach(({ name, value }) =>
      replacement.setAttribute(name, value),
    );
    replacement.innerHTML = heading.innerHTML;
    heading.replaceWith(replacement);
  });

  Array.from(document.querySelectorAll<HTMLParagraphElement>("p.wp-block-paragraph")).forEach(
    (paragraph, index) => {
      const copy = paragraphCopy[index + 1];
      if (copy === null) paragraph.remove();
      else if (copy) paragraph.innerHTML = copy;
    },
  );

  document.querySelectorAll(".wp-block-gallery-5, .wp-block-gallery-10").forEach((gallery) =>
    gallery.classList.add("poster-rolodex"),
  );
  document.querySelector(".wp-block-gallery-3")?.classList.add("tales-tools-gallery");
  document.querySelector(".wp-block-gallery-11")?.classList.add("featured-artwork");

  ["71", "65", "281", "62"].forEach((id) => {
    document.querySelector(`.wp-image-${id}`)?.closest(".wp-block-image")?.classList.add("monsters-feature");
  });
  ["61", "60", "59", "70", "69", "67"].forEach((id, index) => {
    const block = document.querySelector(`.wp-image-${id}`)?.closest(".wp-block-image");
    block?.classList.add("monsters-gameplay");
    if (index % 2 === 0) block?.classList.add("monsters-gameplay--row-start");
  });

  document.querySelectorAll<HTMLImageElement>("img").forEach((image) => {
    const id = image.dataset.id ?? image.className.match(/wp-image-(\d+)/)?.[1];
    if (id && altCopy[id]) image.alt = altCopy[id];
    image.setAttribute("sizes", "(max-width: 640px) 100vw, 34vw");
  });

  return document.body.innerHTML;
}
