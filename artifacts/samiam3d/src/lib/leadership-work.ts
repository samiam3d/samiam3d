export type LeadershipArtwork = {
  src: string;
  caption: string;
  width: number;
  height: number;
  credit?: string;
};

export type LeadershipCase = {
  id: string;
  studio: string;
  title: string;
  role: string;
  description: string;
  credit: string;
  layout: "mattel" | "tales" | "cinematic" | "direction" | "sports" | "prototype";
  featured: LeadershipArtwork[];
  archive: LeadershipArtwork[];
  archiveLabel: string;
  video?: { id: string; title: string };
};

const artwork = (
  path: string,
  caption: string,
  width: number,
  height: number,
  credit?: string,
): LeadershipArtwork => ({ src: `/assets/images/${path}`, caption, width, height, credit });

const cover = (file: string, caption: string) =>
  artwork(`2025/02/${file}.jpg`, caption, 753, 1024);

export const leadershipCases: LeadershipCase[] = [
  {
    id: "mattel",
    studio: "Mattel",
    title: "Hot Wheels & Barbie",
    role: "Art Director, Digital Gaming",
    description:
      "I help shape new games around Mattel’s worlds: developing early concepts, working through prototypes and roadmaps, and reviewing the art with internal studios. These are explorations of how familiar brands can become new play experiences.",
    credit: "Early game concept explorations from my work in Mattel Digital Gaming.",
    layout: "mattel",
    featured: [
      artwork("2025/04/Hotwheels-Gravity-Race-scaled.png", "Hot Wheels Gravity — racing concept", 1024, 539),
      artwork("2025/04/Barbie-Royal-scaled.png", "Barbie Royal — puzzle concept", 539, 1024),
    ],
    archive: [
      artwork("2025/04/Hotwheels-Party-scaled.png", "Hot Wheels Party — game concept", 1024, 539),
      artwork("2025/04/Hotwheels-Gravity-Select-scaled.png", "Hot Wheels Gravity — vehicle selection concept", 1024, 539),
      artwork("2025/04/Barbie-Royal_01-scaled.png", "Barbie Royal — character concept", 539, 1024),
      artwork("2025/04/Barbie-Fashion_04-scaled.png", "Barbie Fashion — game concept", 539, 1024),
    ],
    archiveLabel: "More Mattel concepts",
  },
  {
    id: "tales",
    studio: "Interactive storytelling",
    title: "Tales",
    role: "Art Director & Co-founder",
    description:
      "I led a distributed art team making interactive fiction, then helped design the tools behind it. The work connected story covers and characters with an avatar system, a story editor, and the experience of reading and creating inside Tales.",
    credit: "Selected Tales team artwork and product interfaces, shown in the context of my art direction and product design work.",
    layout: "tales",
    featured: [
      cover("ScareStreet_cover", "Scare Street — story cover"),
      cover("PosterGirl_cover_tall", "Poster Girl — story cover"),
      cover("ApexPredators_cover_tall-1", "Apex Predators — story cover"),
      cover("VampireGames_cover", "Vampire Games — story cover"),
      artwork("2025/03/Story-Editor-Copy.png", "Tales Creator — story editor", 1024, 613),
      artwork("2025/03/Character-Creation-Tool-Copy.png", "Tales Creator — avatar creator", 1024, 613),
    ],
    archive: [
      cover("SorcerySpellcraft_cover-scaled", "Sorcery & Spellcraft — story cover"),
      cover("NerdDetective_cover_tall", "Nerd Detective — story cover"),
      cover("MascaraMurders_cover_tall", "Mascara Murders — story cover"),
      cover("LightsInTheMist_cover_tall", "Lights in the Mist — story cover"),
      cover("EverythingYouEverWanted_cover_tall", "Everything You Ever Wanted — story cover"),
      artwork("2025/03/readers-storytelliing-remixed.png", "Tales — reading and storytelling experience", 400, 700),
      artwork("2025/03/Story-Book-2.png", "Tales — story library", 375, 768),
      artwork("2025/03/IMG_1633-Copy.png", "Tales — mobile reading experience", 473, 1024),
      cover("VampireFiction_cover_tall", "Vampire Fiction — story cover"),
      cover("GoldenThread_cover_tall", "Golden Thread — story cover"),
      cover("DemoniqueAndTheHellHunter_cover_tall-scaled", "Demonique and the Hell Hunter — story cover"),
      cover("SaveTheQueen_cover", "Save the Queen — story cover"),
      cover("Walk_cover_tall", "Walk — story cover"),
      cover("SurviveTheStorm_cover-1", "Survive the Storm — story cover"),
      cover("SomebodyMurderedSnakeyDrake_cover", "Somebody Murdered Snakey Drake — story cover"),
      cover("MirrorMirror_cover_tall", "Mirror Mirror — story cover"),
      cover("MidnightSpirits_cover_tall", "Midnight Spirits — story cover"),
      cover("ShadowsOfGlastonburyManor_cover_tall", "Shadows of Glastonbury Manor — story cover"),
      cover("MurderInSleepyOaks_cover", "Murder in Sleepy Oaks — story cover"),
      cover("NightMatch_cover-1", "Night Match — story cover"),
      cover("Ouija_cover-1", "Ouija — story cover"),
      cover("HeirtotheThrone_cover", "Heir to the Throne — story cover"),
      cover("FreedomTrigger_cover_tall", "Freedom Trigger — story cover"),
      artwork("2025/02/SeriousWeirdness_cover_wide-1.jpg", "Serious Weirdness — story artwork", 1024, 573),
    ],
    archiveLabel: "More Tales artwork & interfaces",
  },
  {
    id: "ea-visceral",
    studio: "EA / Visceral Games",
    title: "Battlefield Hardline",
    role: "Lead Artist",
    description:
      "I managed art asset production with EA Shanghai: setting briefs and technical specifications, reviewing work with art directors and leads, and connecting the outsourcing pipeline to the in-house team.",
    credit: "Battlefield Hardline production imagery. My role focused on art leadership, asset management, and the outsourcing pipeline.",
    layout: "cinematic",
    featured: [
      artwork("2025/02/battlefield-hardline-2000-c37b3ccd10754140ac9addd0f42a958b.jpg", "Battlefield Hardline — gameplay environment", 1024, 576),
    ],
    archive: [
      artwork("2025/02/2555467-battlefield-hardline-4-wm-1.jpg", "Battlefield Hardline — production screenshot", 1024, 577),
      artwork("2025/02/c9a65c69-20f6-4b12-a41e-ae957ac6db1b.jpg", "Battlefield Hardline — action and environment", 1024, 577),
      artwork("2025/02/IcYUMbN.jpg", "Battlefield Hardline — environment detail", 1024, 577),
    ],
    archiveLabel: "More Battlefield imagery & trailer",
    video: { id: "yWVPoUCxAC4", title: "Battlefield Hardline trailer" },
  },
  {
    id: "bigpoint",
    studio: "Bigpoint",
    title: "Universal Monsters Online",
    role: "Lead Artist & Art Director",
    description:
      "I led a team of 12+ artists across characters, environments, animation, VFX, UI, and technical art. I set the visual direction and character pipeline, and stayed hands-on with level design, lighting, and effects.",
    credit: "Art direction and production work for Universal Monsters Online, created with the Bigpoint art team.",
    layout: "direction",
    featured: [
      artwork("2013/01/art_bible_samples_02.jpg", "Art bible — character language, visual rules, and production process", 3280, 1846),
      artwork("2013/01/GDC_poster.jpg", "Universal Monsters Online — GDC poster", 2440, 1373),
      artwork("2015/08/monsters_character_pipeline.jpg", "Character development — sketch, concept, and game model", 3280, 1846, "Final concepts: Christian MacNevin. 3D character models: Eric Maki. Art direction: Sam Gutierrez."),
    ],
    archive: [
      artwork("2013/01/s_02.jpg", "Universal Monsters Online — in-game environment", 1920, 1080),
      artwork("2013/01/s_01.jpg", "Universal Monsters Online — gameplay environment, first view", 1920, 1080),
      artwork("2013/01/s_04.jpg", "Universal Monsters Online — gameplay environment, second view", 1920, 1080),
      artwork("2013/01/s_03.jpg", "Universal Monsters Online — gameplay environment, third view", 1920, 1080),
      artwork("2013/01/bavaria_02.jpg", "Bavaria environment — lighting and world-building", 1539, 921),
      artwork("2013/01/bavaria_01.jpg", "Bavaria environment — level overview", 1539, 921),
      artwork("2013/01/bavaria_04.jpg", "Bavaria environment — architectural detail", 1539, 921),
    ],
    archiveLabel: "Environment work & gameplay trailer",
    video: { id: "EXmU3pSyGvY", title: "Universal Monsters Online trailer" },
  },
  {
    id: "ruined-online",
    studio: "Bigpoint",
    title: "Ruined Online",
    role: "Lead Artist",
    description:
      "A comic-book take on familiar American landmarks, built for a browser-based arena shooter. I led the art team and contributed environments, character concepts, VFX, and UI while working with engineers on draw calls, download size, and minimum-spec performance.",
    credit: "Art leadership and hands-on development with the Ruined Online team.",
    layout: "cinematic",
    featured: [
      artwork("2013/01/RuiNED_GGB.jpg", "Ruined Online — Golden Gate Bridge arena", 1899, 1141),
    ],
    archive: [
      artwork("2013/01/5059622670_67757f02cb_b.jpg", "Ruined Online — character concept artwork", 665, 1024),
      artwork("2013/01/5059626000_60d50006c2_b.jpg", "Ruined Online — character concept sheet", 791, 1024),
      artwork("2013/01/GG_screen_01.jpg", "Golden Gate Bridge — gameplay view", 1896, 1020),
      artwork("2013/01/GG_screen_02.jpg", "Golden Gate Bridge — arena detail", 1896, 1020),
      artwork("2013/01/5059622920_014458a322_b.jpg", "Ruined Online — environment concept", 1024, 549),
      artwork("2013/01/ruined_Alcatraz.jpg", "Ruined Online — Alcatraz arena", 1899, 1141),
      artwork("2013/01/attachment1.jpg", "Ruined Online — in-game environment", 1896, 1020),
      artwork("2013/01/Ruined-Online_2D_Screen1.jpg", "Ruined Online — interface design", 1338, 720),
      artwork("2013/01/ruined_weapons1.jpg", "Ruined Online — weapon concepts", 733, 1024),
      artwork("2015/08/liberty_island.jpg", "Ruined Online — Liberty Island environment concept", 900, 1350),
    ],
    archiveLabel: "More Ruined Online artwork & trailer",
    video: { id: "CmKYeDfhA_s", title: "Ruined Online official trailer" },
  },
  {
    id: "visual-concepts",
    studio: "Visual Concepts / 2K Sports",
    title: "MLB 2K",
    role: "Senior 3D Artist",
    description:
      "At 2K Sports, I built stadiums and arenas, developed lighting, and led the cut-scene group. The work demanded close attention to real places and close collaboration with technical artists and graphics programmers across MLB, NBA, and NHL titles.",
    credit: "Selected MLB 2K environment work from my time at Visual Concepts / 2K Sports.",
    layout: "sports",
    featured: [
      artwork("2015/08/4_Boston_Facade2.jpg", "Fenway Park — Boston Red Sox", 936, 527),
      artwork("2015/08/ClassicPoloGrounds_Stadium1.jpg", "Polo Grounds — historic New York Giants stadium", 1280, 720),
      artwork("2015/08/3_NY_Yankees_Facade1.jpg", "Yankee Stadium — exterior", 864, 515),
    ],
    archive: [
      artwork("2015/08/2_Reds_Facade.jpg", "Great American Ball Park — Cincinnati Reds", 720, 405),
      artwork("2013/01/2k_tigers_stadium.jpg", "MLB 2K — Detroit Tigers stadium", 1911, 1065),
      artwork("2013/01/2k_twins_stadium.jpg", "MLB 2K — Minnesota Twins stadium", 1911, 1065),
      artwork("2013/01/2k_yankee_stadium.jpg", "MLB 2K — New York Yankees stadium", 1920, 1065),
      artwork("2013/01/2k_giants_stadium.jpg", "MLB 2K — San Francisco Giants stadium", 1911, 1065),
      artwork("2013/01/2k_giants_stadium_02.jpg", "MLB 2K — San Francisco Giants stadium, second view", 1911, 1065),
      artwork("2013/01/2k_rays_stadium.jpg", "MLB 2K — Tampa Bay Rays stadium", 1911, 1065),
    ],
    archiveLabel: "More stadiums & MLB 2K trailer",
    video: { id: "XCZHhW3rjts", title: "Major League Baseball 2K10 trailer" },
  },
  {
    id: "other-projects",
    studio: "Mobile game prototype",
    title: "Toy Truck",
    role: "Art style, environments & vehicles",
    description:
      "A small world built for a side-scrolling mobile game. I developed the art style and created the environments and vehicles. The project was canceled during development.",
    credit: "Art and development work for the canceled Toy Truck prototype.",
    layout: "prototype",
    featured: [
      artwork("2015/08/jungle_01_colorCorrections.jpg", "Toy Truck — jungle environment and color direction", 2200, 1184),
    ],
    archive: [
      artwork("2015/08/Work_in_progress.jpg", "Toy Truck — environment in development", 1600, 861),
    ],
    archiveLabel: "View the prototype in development",
  },
];

export function leadershipImageSource(source: string, width: 480 | 1200) {
  return source.replace("/assets/images/", "/assets/responsive/").replace(/\.[^.]+$/, `-${width}.webp`);
}
