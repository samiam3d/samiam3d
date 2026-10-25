import type { CreatorProjectId } from "@/lib/creator-projects";

export type ApplicationVisualId = Exclude<CreatorProjectId, "mindink">;

type ApplicationView = {
  id: "hero" | "detail";
  label: string;
  headline: string;
  description: string;
  alt: string;
};

/** Art-directed demo views grounded in each application's real interface. */
export const applicationViews: Record<
  ApplicationVisualId,
  readonly ApplicationView[]
> = {
  vibemind: [
    {
      id: "hero",
      label: "Build & preview",
      headline: "Watch the idea become an app.",
      description:
        "Keep the conversation, the plan, and a working preview together as the product takes shape.",
      alt: "VibeMind Build and preview product visualization with a project conversation and working application preview",
    },
    {
      id: "detail",
      label: "Review & recover",
      headline: "Stay close to every change.",
      description:
        "Review the work, inspect the changes, and return to a checkpoint when you need to.",
      alt: "VibeMind Review and recover product visualization showing code changes and project checkpoints",
    },
  ],
  "flower-musica": [
    {
      id: "hero",
      label: "Sound Lab",
      headline: "Find the sound in your head.",
      description:
        "Shape a sound with texture, duration, and energy. Listen, refine, and save the take.",
      alt: "Flower Musica Sound Lab product visualization with sound direction controls and an audio waveform",
    },
    {
      id: "detail",
      label: "Music Sketch",
      headline: "Give the idea a rhythm.",
      description:
        "Explore a musical direction through mood, genre, tempo, and structure.",
      alt: "Flower Musica Music Sketch product visualization with musical direction, tempo and audio playback",
    },
  ],
  hotclips: [
    {
      id: "hero",
      label: "Producer Room",
      headline: "Hear the moment worth keeping.",
      description:
        "Review the conversation, follow the transcript, and choose the highlights that tell the story.",
      alt: "HotClips Producer Room product visualization with podcast highlights, transcript and portrait video preview",
    },
    {
      id: "detail",
      label: "Make the cut",
      headline: "Make every second count.",
      description:
        "Refine the timing, check the captions, and get the selected clip ready to publish.",
      alt: "HotClips Make the cut product visualization with a clip timeline, captions and video editing controls",
    },
  ],
  trendink: [
    {
      id: "hero",
      label: "Story Studio",
      headline: "Turn the research into a story.",
      description:
        "Connect source material to a creative direction, then shape the scenes that carry it.",
      alt: "TrendInk Story Studio product visualization connecting research sources, story direction and cinematic scenes",
    },
    {
      id: "detail",
      label: "Edit Studio",
      headline: "Find the rhythm of the film.",
      description:
        "Bring shots, captions, and audio together in the final cut.",
      alt: "TrendInk Edit Studio product visualization with a cinematic preview, shot timeline, captions and audio",
    },
  ],
  clauseink: [
    {
      id: "hero",
      label: "Draft & review",
      headline: "Keep the conversation beside the clause.",
      description:
        "Draft the document, review the language, and resolve comments in the same workspace.",
      alt: "ClauseInk Draft and review product visualization with a sample agreement, highlighted clauses and contextual comments",
    },
    {
      id: "detail",
      label: "Version comparison",
      headline: "See exactly what changed.",
      description:
        "Compare versions, follow tracked changes, and work through each review decision.",
      alt: "ClauseInk Version comparison product visualization with two sample document versions and tracked changes",
    },
  ],
};

export const applicationViewSource = (
  project: ApplicationVisualId,
  view: ApplicationView["id"],
) => `/assets/showcase/apps-v3/${project}/${view}.webp`;
