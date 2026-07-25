function topLevelBlock(element: Element, body: HTMLElement) {
  let block = element;
  while (block.parentElement && block.parentElement !== body) {
    block = block.parentElement;
  }
  return block;
}

function splitNestedImage(document: Document, imageId: string) {
  const body = document.body;
  const image = document.querySelector(`.wp-image-${imageId}`);
  const anchor = image?.closest("a");
  if (!image || !anchor) return;

  const sourceBlock = topLevelBlock(image, body);
  const figure = document.createElement("figure");
  figure.className = "wp-block-image";
  figure.append(anchor);
  sourceBlock.after(figure);
  sourceBlock.querySelector("figcaption:empty")?.remove();
}

function removeImage(document: Document, imageId: string) {
  const image = document.querySelector(`.wp-image-${imageId}`);
  if (!image) return;

  topLevelBlock(image, document.body).remove();
}

function removeImageLink(document: Document, imageId: string) {
  const image = document.querySelector(`.wp-image-${imageId}`);
  const anchor = image?.parentElement;
  if (!image || !anchor?.matches("a")) return;

  anchor.replaceWith(image);
}

function removeDuplicateImages(document: Document, imageId: string) {
  document
    .querySelectorAll(`.wp-image-${imageId}`)
    .forEach((image, index) => {
      if (index > 0) topLevelBlock(image, document.body).remove();
    });
}

function paragraphContaining(document: Document, text: string) {
  return Array.from(document.querySelectorAll("p")).find((paragraph) =>
    paragraph.textContent?.includes(text),
  );
}

const descriptiveAltByFilename: Record<string, string> = {
  "GDC_poster.jpg": "GDC poster art directed for BigPoint",
  "monsters_character_pipeline.jpg":
    "Monsters character development and production pipeline",
  "art_bible_samples_02.jpg": "Art bible samples created for BigPoint",
  "s_01.jpg": "Ruined Online environment and gameplay view one",
  "s_02.jpg": "Ruined Online in-game environment screenshot",
  "s_03.jpg": "Ruined Online environment and gameplay view three",
  "s_04.jpg": "Ruined Online environment and gameplay view four",
  "bavaria_01.jpg": "Bavaria game environment, first view",
  "bavaria_02.jpg": "Bavaria game environment, second view",
  "bavaria_03.jpg": "Bavaria game environment, third view",
  "bavaria_04.jpg": "Bavaria game environment, fourth view",
  "5059622670_67757f02cb_b.jpg": "Ruined Online character concept artwork",
  "5059626000_60d50006c2_b.jpg": "Ruined Online character concept sheet",
  "5059622920_014458a322_b.jpg": "Ruined Online environment concept artwork",
  "GG_screen_01.jpg": "Ruined Online Golden Gate Bridge gameplay view one",
  "GG_screen_02.jpg": "Ruined Online Golden Gate Bridge gameplay view two",
  "RuiNED_GGB.jpg": "Ruined Online Golden Gate Bridge arena artwork",
  "ruined_Alcatraz.jpg": "Ruined Online Alcatraz arena artwork",
  "Ruined-Online_2D_Screen1.jpg": "Ruined Online interface and 2D screen design",
  "liberty_island.jpg": "Liberty Island environment concept for Ruined Online",
  "4_Boston_Facade2.jpg": "Fenway Park facade created for MLB 2K",
  "3_NY_Yankees_Facade1.jpg": "Yankee Stadium facade created for MLB 2K",
  "2_Reds_Facade.jpg": "Great American Ball Park facade created for MLB 2K",
  "ClassicPoloGrounds_Stadium1.jpg": "Polo Grounds stadium created for MLB 2K",
  "2k_tigers_stadium.jpg": "Detroit Tigers stadium environment created for MLB 2K",
  "2k_twins_stadium.jpg": "Minnesota Twins stadium environment created for MLB 2K",
  "2k_yankee_stadium.jpg": "New York Yankees stadium environment created for MLB 2K",
  "2k_giants_stadium.jpg": "New York Giants stadium environment created for MLB 2K",
  "2k_giants_stadium_02.jpg": "New York Giants stadium, second MLB 2K view",
  "2k_rays_stadium.jpg": "Tampa Bay Rays stadium environment created for MLB 2K",
  "jungle_01_colorCorrections.jpg":
    "Toy Truck prototype jungle environment with final color direction",
  "Work_in_progress.jpg": "Toy Truck prototype environment development",
  "cropped-header_samiam3d21.jpg": "SamIam3D portfolio artwork banner",
};

const intrinsicDimensionsByPath: Record<string, readonly [number, number]> = {
  "/assets/images/2013/01/art_bible_samples_02.jpg": [3280, 1846],
  "/assets/images/2025/02/ApexPredators_cover_tall-1.jpg": [5200, 7066],
  "/assets/images/2025/02/EverythingYouEverWanted_cover_tall.jpg": [
    5202, 7069,
  ],
  "/assets/images/external/oyster.ignimgs.com/mediawiki/apis.ign.com/battlefield-5/0/07/Hardline.jpg": [
    1440, 540,
  ],
};

function responsiveImagePath(src: string, width: 480 | 1200) {
  if (!src.startsWith("/assets/images/")) return null;
  const sourcePath = src.slice("/assets/images/".length);
  const extensionIndex = sourcePath.lastIndexOf(".");
  if (extensionIndex < 0) return null;
  return `/assets/responsive/${sourcePath.slice(0, extensionIndex)}-${width}.webp`;
}

function responsiveSizesFor(image: HTMLImageElement) {
  if (
    image.closest(
      ".wp-block-gallery-5, .wp-block-gallery-10, .wp-block-gallery-1, .wp-block-gallery-2, .wp-block-gallery-4, .wp-block-gallery-7, .wp-block-gallery-8, .wp-block-gallery-9",
    )
  ) {
    return "(max-width: 640px) calc((100vw - 3.25rem) / 2), (max-width: 900px) 30vw, 18vw";
  }

  if (image.closest(".wp-block-gallery, .portfolio-media-grid, .wp-block-group")) {
    return "(max-width: 640px) calc((100vw - 3.25rem) / 2), (max-width: 900px) 45vw, 30vw";
  }

  return "(max-width: 640px) 82vw, (max-width: 900px) 86vw, 68vw";
}

function optimizePortfolioImages(document: Document) {
  document.querySelectorAll<HTMLImageElement>("img").forEach((image) => {
    const source = image.getAttribute("src");
    if (!source) return;

    const filename = source.split("/").pop();
    if (filename && descriptiveAltByFilename[filename]) {
      image.alt = descriptiveAltByFilename[filename];
    }

    const dimensions = intrinsicDimensionsByPath[source];
    if (dimensions) {
      image.width = dimensions[0];
      image.height = dimensions[1];
    }

    const smallSource = responsiveImagePath(source, 480);
    const largeSource = responsiveImagePath(source, 1200);
    if (!smallSource || !largeSource) return;

    image.dataset.fullSrc = source;
    image.src = smallSource;
    image.srcset = `${smallSource} 480w, ${largeSource} 1200w`;
    image.sizes = responsiveSizesFor(image);
    image.loading = "lazy";
    image.decoding = "async";
  });
}

function replaceYoutubeEmbeds(document: Document) {
  document
    .querySelectorAll<HTMLIFrameElement>('iframe[src*="youtube.com/embed/"]')
    .forEach((iframe) => {
      const source = iframe.getAttribute("src") ?? "";
      const match = source.match(/youtube\.com\/embed\/([^?&]+)/);
      const wrapper = iframe.closest(".wp-block-embed__wrapper");
      if (!match || !wrapper) return;

      const videoId = match[1];
      const title = iframe.title || "Portfolio video";
      const button = document.createElement("button");
      button.type = "button";
      button.className = "video-preview";
      button.dataset.videoId = videoId;
      button.setAttribute("aria-label", `Play ${title}`);

      const preview = document.createElement("img");
      preview.src = `/assets/video-previews/${videoId}.jpg`;
      preview.alt = "";
      preview.width = 480;
      preview.height = 360;
      preview.loading = "lazy";
      preview.decoding = "async";

      const icon = document.createElement("span");
      icon.className = "video-preview__icon";
      icon.setAttribute("aria-hidden", "true");
      icon.textContent = "▶";

      const label = document.createElement("span");
      label.className = "video-preview__label";
      label.textContent = title;

      button.append(preview, icon, label);
      wrapper.replaceChildren(button);
    });
}

function replaceTopLevelHeadingTags(document: Document) {
  document.body.querySelectorAll(":scope > h1").forEach((heading) => {
    const replacement = document.createElement("h2");
    Array.from(heading.attributes).forEach((attribute) => {
      replacement.setAttribute(attribute.name, attribute.value);
    });
    replacement.innerHTML = heading.innerHTML;
    heading.replaceWith(replacement);
  });
}

function prepareLightboxTriggers(document: Document) {
  Array.from(document.body.children).forEach((block, index) => {
    if (block.querySelector("img")) {
      block.setAttribute("data-lightbox-group", `portfolio-${index}`);
    }
  });

  document.querySelectorAll<HTMLImageElement>("img").forEach((image) => {
    const fullSource = image.dataset.fullSrc;
    if (!fullSource) return;

    const anchor = image.closest<HTMLAnchorElement>("a");
    const href = anchor?.getAttribute("href") ?? "";
    if (anchor && href.startsWith("/assets/images/")) {
      anchor.dataset.lightboxImage = "true";
      anchor.dataset.fullSrc = href;
      anchor.setAttribute(
        "aria-label",
        `Open ${image.alt || "portfolio image"} in image viewer`,
      );
      return;
    }

    if (anchor) return;

    const button = document.createElement("button");
    button.type = "button";
    button.className = "portfolio-image-button";
    button.dataset.lightboxImage = "true";
    button.dataset.fullSrc = fullSource;
    button.setAttribute(
      "aria-label",
      `Open ${image.alt || "portfolio image"} in image viewer`,
    );
    image.replaceWith(button);
    button.append(image);
  });
}

function groupImages(
  document: Document,
  imageIds: string[],
  className: string,
  insertAfter?: Element,
) {
  const body = document.body;
  const blocks = imageIds
    .map((id) => document.querySelector(`.wp-image-${id}`))
    .filter((image): image is Element => Boolean(image))
    .map((image) => topLevelBlock(image, body))
    .filter((block, index, items) => items.indexOf(block) === index);

  if (blocks.length < 2) return;

  const grid = document.createElement("div");
  grid.className = `portfolio-media-grid ${className}`;
  if (insertAfter) {
    insertAfter.after(grid);
  } else {
    blocks[0].before(grid);
  }
  blocks.forEach((block) => grid.append(block));
}

function mergeTalesMobileGallery(document: Document) {
  const source = document.querySelector(
    ".wp-block-gallery.wp-block-gallery-6",
  );
  const target = document.querySelector(
    ".wp-block-gallery.wp-block-gallery-7",
  );
  if (!source || !target) return;

  const targetFirstImage = target.querySelector(
    ":scope > figure.wp-block-image",
  );
  source
    .querySelectorAll(":scope > figure.wp-block-image")
    .forEach((figure) => target.insertBefore(figure, targetFirstImage));

  source.remove();
  target.classList.remove("wp-block-gallery-7");
  target.classList.add("wp-block-gallery-5");
}

export function preparePortfolioLayout(html: string) {
  const document = new DOMParser().parseFromString(html, "text/html");

  document
    .querySelectorAll('iframe[src*="/embed/vCYMSLbMqOQ"]')
    .forEach((frame) => frame.closest("figure.wp-block-embed")?.remove());

  splitNestedImage(document, "68");
  removeImage(document, "70");
  removeImage(document, "266");
  removeDuplicateImages(document, "367");
  removeImageLink(document, "367");
  mergeTalesMobileGallery(document);

  const ruinedOverview = paragraphContaining(
    document,
    "presented itself as a 3rd person shooter battle arena game",
  );
  const ruinedMarketing = paragraphContaining(
    document,
    "My partnership with the marketing team was equally integral",
  );

  groupImages(document, ["281", "62"], "portfolio-media-grid--pair");
  groupImages(
    document,
    ["61", "60", "59", "69", "68", "67"],
    "portfolio-media-grid--monsters",
  );
  groupImages(
    document,
    ["49", "48", "31"],
    "portfolio-media-grid--ruined",
    ruinedOverview,
  );
  groupImages(
    document,
    ["29", "30", "46", "47"],
    "portfolio-media-grid--ruined",
    ruinedMarketing,
  );
  groupImages(document, ["293", "292"], "portfolio-media-grid--pair");
  groupImages(document, ["297", "296"], "portfolio-media-grid--pair");
  groupImages(
    document,
    ["183", "184", "185", "186", "187", "188"],
    "portfolio-media-grid--sports",
  );

  replaceTopLevelHeadingTags(document);
  replaceYoutubeEmbeds(document);
  optimizePortfolioImages(document);
  prepareLightboxTriggers(document);

  return document.body.innerHTML;
}
