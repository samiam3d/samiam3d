export type CreatorProjectId =
  | "mindink"
  | "vibemind"
  | "flower-musica"
  | "hotclips"
  | "trendink"
  | "clauseink";

export type CreatorProjectVisual =
  | "mindink"
  | "vibemind"
  | "flower"
  | "media";

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
  status: string;
  category: string;
  cardHeadline: string;
  cardDescription: string;
  modalHeadline: string;
  story: string;
  whatIBuilt: string;
  role: string;
  ctaLabel: string;
  href: string;
  visual: CreatorProjectVisual;
  logo?: CreatorProjectMedia;
  textMark?: string;
  media: readonly CreatorProjectMedia[];
};

export const responsiveCreatorAsset = (asset: string, width: 480 | 1200) =>
  `/assets/responsive/creations/${asset}-${width}.webp`;

export const creatorProjects = [
  {
    id: "mindink",
    name: "MindInk",
    status: "FLAGSHIP VENTURE",
    category: "STORYTELLING · CREATIVE SYSTEMS",
    cardHeadline: "Build stories like a studio.",
    cardDescription:
      "A creator-led studio for story architecture, characters, real branching narratives, cinematic scenes, posters, sound, video, and publishing.",
    modalHeadline:
      "A complete creative studio for stories, worlds, movies, and publishing.",
    story:
      "MindInk turns raw notes and ideas into structured narratives, characters, real branching paths, cinematic scenes, posters, sound, video, and published experiences. The system keeps the creator in control while connecting work that normally lives across disconnected writing, image, video, audio, planning, and publishing tools.",
    whatIBuilt:
      "Product vision, brand, UX/UI, story architecture, visual branching, AI Ally workflows, creator onboarding, character and world systems, Movie Studio, Sound Studio, cinematic publishing, and product implementation.",
    role: "Founder · Creative Director · Product Design · Build",
    ctaLabel: "Enter MindInk",
    href: "https://mindink.ai/",
    visual: "mindink",
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
    id: "vibemind",
    name: "VibeMind",
    status: "PRIVATE ALPHA",
    category: "APP BUILDING · CREATIVE EXECUTION",
    cardHeadline: "Turn an idea into a visible, working product.",
    cardDescription:
      "A private application workspace where a product brief becomes an approved plan, recoverable code changes, a healthy preview, and owned software.",
    modalHeadline: "Creative intent in. Owned software out.",
    story:
      "VibeMind gives founders and creative teams a visible path from product intent to execution. The workspace translates a brief into a reviewable plan, runs work inside controlled environments, exposes progress and changes, verifies the preview, and preserves checkpoints so the owner never loses control of the product or its code.",
    whatIBuilt:
      "Product vision, experience architecture, approval workflow, execution model, run-event system, checkpoint and recovery UX, preview health experience, brand direction, and the Project Foundry infrastructure beneath it.",
    role: "Founder · Product Vision · UX/UI · Systems Design",
    ctaLabel: "Enter VibeMind",
    href: "https://vibe.mindink.ai/",
    visual: "vibemind",
    textMark: "VM",
    media: [],
  },
  {
    id: "flower-musica",
    name: "Flower Musica",
    status: "CREATIVE COLLABORATION",
    category: "MUSIC BRAND · MEDIA · CREATOR TOOLS",
    cardHeadline: "A music brand designed to move.",
    cardDescription:
      "A producer-led world combining music, podcasting, culture, studio life, community, and useful creator tools inside one expressive identity.",
    modalHeadline: "Music, stories, and the process behind the sound.",
    story:
      "Flower Musica is being shaped as a music-first brand rather than a technology demo. The public experience brings together a producer portfolio, podcast, tutorials, culture, community, and a restrained studio utility layer while allowing the flower identity, motion language, and artist personality to lead every interaction.",
    whatIBuilt:
      "Creative direction, product and content strategy, identity system, animated flower choreography, UX/UI, motion direction, public site architecture, community journey, and creator-tool experience.",
    role: "Creative Direction · Brand · Product Design · Motion",
    ctaLabel: "Visit Flower Musica",
    href: "https://flowermusic.com/",
    visual: "flower",
    textMark: "FM",
    media: [],
  },
  {
    id: "hotclips",
    name: "HotClips",
    status: "FOUNDER-BUILT PRODUCT",
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
    visual: "media",
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
    status: "FOUNDER-BUILT PRODUCT",
    category: "TREND INTELLIGENCE · CREATIVE PRODUCTION",
    cardHeadline: "Find the signal. Build the story.",
    cardDescription:
      "A creator-led system that carries live trends and their source evidence from discovery through production.",
    modalHeadline:
      "Trend discovery without losing the source—or the creative thread.",
    story:
      "TrendInk connects live trend discovery to the work that follows. It preserves the original source evidence, gives creators control over what gets approved, and carries selected ideas through creative direction, story, scenes, editing, and export.",
    whatIBuilt:
      "Product vision, research workflow, source-evidence system, approval flow, creative direction, story and scene planning, production UX, brand, and implementation.",
    role: "Founder · Product · Design · Build",
    ctaLabel: "Explore TrendInk",
    href: "https://www.trendink.app/",
    visual: "media",
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
  {
    id: "clauseink",
    name: "ClauseInk",
    status: "ADDITIONAL SYSTEM",
    category: "LEGAL WORKFLOW · DOCUMENT SYSTEMS",
    cardHeadline: "Draft contracts without fighting the document.",
    cardDescription:
      "A focused workspace for drafting, reviewing, redlining, collaborating, and exporting polished agreements.",
    modalHeadline: "Legal drafting designed around the work—not around Word.",
    story:
      "ClauseInk combines guided clause drafting, contextual review, reusable clause libraries, redlining, collaboration, professional page layout, and client-ready Word and PDF export in one focused legal workflow.",
    whatIBuilt:
      "Product strategy, brand, UX/UI, document-editor workflows, AI review experience, clause-library systems, redlining, authentication, billing, export architecture, and launch.",
    role: "Founder · Product · Design · Build",
    ctaLabel: "Try ClauseInk",
    href: "https://www.clauseink.com/",
    visual: "media",
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
] as const satisfies readonly CreatorProject[];

export const isCreatorProjectId = (
  value: string | null,
): value is CreatorProjectId =>
  creatorProjects.some((project) => project.id === value);

export const getCreatorProject = (id: CreatorProjectId | null) =>
  creatorProjects.find((project) => project.id === id) ?? null;
