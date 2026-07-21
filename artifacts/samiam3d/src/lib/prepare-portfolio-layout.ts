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

function paragraphContaining(document: Document, text: string) {
  return Array.from(document.querySelectorAll("p")).find((paragraph) =>
    paragraph.textContent?.includes(text),
  );
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
    .querySelector('iframe[src*="/embed/vCYMSLbMqOQ"]')
    ?.closest("figure.wp-block-embed")
    ?.remove();

  document
    .querySelector('a[href*="talescreator.app.link"]')
    ?.closest("p")
    ?.remove();

  splitNestedImage(document, "68");
  removeImage(document, "70");
  removeImage(document, "266");
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

  return document.body.innerHTML;
}
