export type CreatorProjectId =
  "mindink" | "clauseink" | "hotclips" | "trendink";

export type CreatorProjectMedia = {
  asset: string;
  alt: string;
  width: number;
  height: number;
  crop?: "left" | "right" | "center";
};

export type CreatorProject = {
  id: CreatorProjectId;
  name: string;
  category: string;
  cardHeadline: string;
  cardDescription: string;
  modalHeadline: string;
  story: string;
  whatIBuilt: string;
  role: string;
  ctaLabel: string;
  href: string;
  logo: CreatorProjectMedia;
  media: readonly CreatorProjectMedia[];
};

export const responsiveCreatorAsset = (asset: string, width: 480 | 1200) =>
  `/assets/responsive/creations/${asset}-${width}.webp`;

export const creatorProjects = [
  {
    id: "mindink",
    name: "MindInk",
    category: "STORYTELLING · CREATIVE SYSTEMS",
    cardHeadline: "Direct stories like a studio.",
    cardDescription:
      "A connected story studio for building characters, branching narratives, cinematic scenes, and entire worlds.",
    modalHeadline: "A studio pipeline for independent storytellers.",
    story:
      "Storytellers usually have to stitch together documents, writing tools, image generators, world notes, and production software. MindInk brings those pieces into one creator-led system—moving from source material and narrative structure to real branching stories, cinematic layers, publishing, and audience learning.",
    whatIBuilt:
      "Product vision, brand, UX/UI, story architecture, AI Ally workflows, creator onboarding, interactive narrative systems, publishing experience, and product implementation.",
    role: "Founder · Product · Design · Build",
    ctaLabel: "Enter MindInk",
    href: "https://mindink.ai/",
    logo: {
      asset: "mindink-icon",
      alt: "MindInk mark",
      width: 700,
      height: 700,
    },
    media: [
      {
        asset: "mindink-studio",
        alt: "MindInk story studio with cinematic creation tools",
        width: 1280,
        height: 720,
      },
      {
        asset: "mindink-story-canvas",
        alt: "MindInk branching story canvas with connected narrative beats",
        width: 1400,
        height: 900,
      },
      {
        asset: "mindink-world-cover",
        alt: "A story world cover created in MindInk",
        width: 1024,
        height: 1536,
      },
    ],
  },
  {
    id: "clauseink",
    name: "ClauseInk",
    category: "LEGAL WORKFLOW · DOCUMENT SYSTEMS",
    cardHeadline: "Draft contracts without fighting the document.",
    cardDescription:
      "A legal workspace for drafting, reviewing, redlining, collaborating, and exporting polished agreements.",
    modalHeadline: "Legal drafting designed around the work—not around Word.",
    story:
      "ClauseInk combines guided clause drafting, contextual review, reusable clause libraries, redlining, collaboration, professional page layout, and client-ready Word and PDF export in one focused legal workflow.",
    whatIBuilt:
      "Product strategy, brand, UX/UI, document-editor workflows, AI review experience, clause-library systems, redlining, authentication, billing, export architecture, and launch.",
    role: "Founder · Product · Design · Build",
    ctaLabel: "Try ClauseInk",
    href: "https://www.clauseink.com/",
    logo: {
      asset: "clauseink-logo",
      alt: "ClauseInk wordmark",
      width: 1681,
      height: 570,
    },
    media: [
      {
        asset: "clauseink-editor-live",
        alt: "ClauseInk contract editor with document review tools",
        width: 2674,
        height: 2014,
      },
      {
        asset: "clauseink-editor",
        alt: "ClauseInk document editor with clause guidance",
        width: 1265,
        height: 780,
      },
    ],
  },
  {
    id: "hotclips",
    name: "HotClips",
    category: "CREATOR MEDIA · PODCAST WORKFLOW",
    cardHeadline: "Find the moments worth publishing.",
    cardDescription:
      "A creator-directed workflow that turns full podcast episodes into reviewed, trimmed, ready-to-post clips.",
    modalHeadline: "The system finds the moments. The creator makes the cut.",
    story:
      "HotClips starts with the entire episode, follows the creator’s direction on topic, audience, angle, and pace, then surfaces candidate moments for human review. The creator checks the transcript, trims the timing, keeps the strongest clips, and exports only what is ready to publish.",
    whatIBuilt:
      "Product concept, brand, UX/UI, episode-ingestion flow, creative-direction controls, clip discovery and ranking, transcript review, trimming experience, approval workflow, and export system.",
    role: "Founder · Product · Design · Build",
    ctaLabel: "Find My Clips",
    href: "https://www.hotclips.pro/",
    logo: {
      asset: "hotclips-mark-blue",
      alt: "HotClips mark",
      width: 1234,
      height: 1096,
    },
    media: [
      {
        asset: "hotclips-podcast-studio",
        alt: "HotClips episode workspace with candidates and transcript review",
        width: 1672,
        height: 941,
        crop: "left",
      },
      {
        asset: "hotclips-podcast-studio",
        alt: "HotClips clip shortlist and timing controls from the creator workflow",
        width: 1672,
        height: 941,
        crop: "right",
      },
    ],
  },
  {
    id: "trendink",
    name: "TrendInk",
    category: "TREND INTELLIGENCE · CREATIVE PRODUCTION",
    cardHeadline: "Find the signal. Build the story.",
    cardDescription:
      "A creator-led system that carries live trends and their source evidence from discovery through production.",
    modalHeadline:
      "Trend discovery without losing the source—or the creative thread.",
    story:
      "TrendInk connects live trend discovery to the work that follows. It preserves the original source evidence, gives creators control over what gets approved, and carries selected ideas through story, scenes, editing, and export.",
    whatIBuilt:
      "Product vision, research workflow, source-evidence system, approval flow, creative direction, story and scene planning, production UX, brand, and implementation.",
    role: "Founder · Product · Design · Build",
    ctaLabel: "Explore TrendInk",
    href: "https://www.trendink.app/",
    logo: {
      asset: "trendink-aperture",
      alt: "TrendInk aperture mark",
      width: 2400,
      height: 2400,
    },
    media: [
      {
        asset: "trendink-hero-studio",
        alt: "TrendInk product artwork for source-led creative production",
        width: 1920,
        height: 1280,
      },
      {
        asset: "trendink-og",
        alt: "TrendInk studio artwork showing a creative signal in motion",
        width: 1200,
        height: 630,
      },
      {
        asset: "trendink-aperture",
        alt: "TrendInk aperture mark used in the product identity",
        width: 2400,
        height: 2400,
      },
    ],
  },
] as const satisfies readonly CreatorProject[];

export const isCreatorProjectId = (
  value: string | null,
): value is CreatorProjectId =>
  creatorProjects.some((project) => project.id === value);

export const getCreatorProject = (id: CreatorProjectId | null) =>
  creatorProjects.find((project) => project.id === id) ?? null;
