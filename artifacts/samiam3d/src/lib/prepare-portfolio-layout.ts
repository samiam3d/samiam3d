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

function groupImages(document: Document, imageIds: string[], className: string) {
  const body = document.body;
  const blocks = imageIds
    .map((id) => document.querySelector(`.wp-image-${id}`))
    .filter((image): image is Element => Boolean(image))
    .map((image) => topLevelBlock(image, body))
    .filter((block, index, items) => items.indexOf(block) === index);

  if (blocks.length < 2) return;

  const grid = document.createElement("div");
  grid.className = `portfolio-media-grid ${className}`;
  blocks[0].before(grid);
  blocks.forEach((block) => grid.append(block));
}

export function preparePortfolioLayout(html: string) {
  const document = new DOMParser().parseFromString(html, "text/html");

  splitNestedImage(document, "68");

  groupImages(document, ["281", "62"], "portfolio-media-grid--pair");
  groupImages(
    document,
    ["61", "60", "59", "70", "69", "68", "67"],
    "portfolio-media-grid--monsters",
  );
  groupImages(
    document,
    ["49", "48", "31", "29", "30", "46", "47"],
    "portfolio-media-grid--ruined",
  );
  groupImages(document, ["293", "292"], "portfolio-media-grid--pair");
  groupImages(
    document,
    ["183", "184", "185", "186", "187", "188"],
    "portfolio-media-grid--sports",
  );

  return document.body.innerHTML;
}
