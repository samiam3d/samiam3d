/** Art-directed product views based on the real MindInk application. */
export const mindinkViews = [
  {
    id: "branch-canvas",
    label: "Branch Canvas",
    headline: "See every possibility.",
    description:
      "Map scenes, connect choices, and follow every path your story could take.",
    alt: "MindInk Branch Canvas product visualization with connected scenes and branching story paths",
  },
  {
    id: "scene-editor",
    label: "Scene Editor",
    headline: "Give each scene a pulse.",
    description:
      "Shape the dialogue, build the atmosphere, and preview the reader’s experience.",
    alt: "MindInk Scene Editor product visualization with dialogue, narrative blocks and a reader preview",
  },
  {
    id: "stories",
    label: "Stories",
    headline: "A home for every world.",
    description:
      "Keep your stories, characters, and covers together. Pick up where imagination left off.",
    alt: "MindInk Stories product visualization showing a library of illustrated story covers",
  },
  {
    id: "movie-creator",
    label: "Movie Creator",
    headline: "Take the story to the screen.",
    description:
      "Bring scenes into motion with a shot sequence, cinematic imagery, and sound.",
    alt: "MindInk Movie Creator product visualization with a cinematic preview, shot sequence and soundtrack",
  },
] as const;

export const mindinkViewSource = (id: (typeof mindinkViews)[number]["id"]) =>
  `/assets/showcase/mindink-v2/${id}.webp`;
