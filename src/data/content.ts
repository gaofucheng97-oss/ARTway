import chartingChange from "@/assets/artwork-charting-change.jpg";
import hollow from "@/assets/artwork-hollow.jpg";
import palmTemple from "@/assets/artwork-palm-temple.jpg";
import mirrorMaze from "@/assets/artwork-mirror-maze.jpg";
import bristolLight from "@/assets/artwork-bristol-light.jpg";
import communityWall from "@/assets/artwork-community-wall.jpg";

export type Area = "campus" | "temple" | "city";

export interface Story {
  id: string;
  title: string;
  emoji: string;
  text: string;
  hasAudio?: boolean;
}

export interface Artwork {
  id: string;
  title: string;
  location: string;
  area: Area;
  image: string;
  artist: string;
  artistBio: string;
  artistConnection: string;
  year: string;
  description: string;
  hook: string;
  tags: string[];
  hasAudio: boolean;
  hasAR: boolean;
  audio: { title: string; duration: string; caption: string };
  stamp: { id: string; name: string };
  stories: Story[];
  reflections: string[];
  walkingTime: string;
  nearestBuilding: string;
  accessibility: string;
  /** map position in % of the map surface */
  pin: { x: number; y: number };
}

export const artworks: Artwork[] = [
  {
    id: "charting-change",
    title: "Charting Change",
    location: "Temple Quarter Enterprise Campus",
    area: "temple",
    image: chartingChange,
    artist: "Ellie Shipman",
    artistBio:
      "Artist working with public art, participation, community memory, and place-based storytelling.",
    artistConnection:
      "Ellie worked with hundreds of Bristol residents to gather memories that shaped the patterns and colours in Charting Change.",
    year: "2023",
    description:
      "A participatory public artwork exploring Bristol's changing identity, industrial histories, community memory, and future campus life.",
    hook: "Made from hundreds of Bristol memories.",
    tags: ["Public art", "Campus", "Audio guide", "AR", "Community story"],
    hasAudio: true,
    hasAR: true,
    audio: {
      title: "Behind Charting Change: stories of place, making, and memory",
      duration: "4:12",
      caption: "Listen to a short story behind this artwork",
    },
    stamp: { id: "charting-change", name: "Charting Change" },
    stories: [
      { id: "before", title: "What was here before?", emoji: "🏭", text: "Long before the new campus, this land hummed with railways, goods sheds, and the everyday work of a growing port city. The artwork keeps traces of those layers alive.", hasAudio: true },
      { id: "people", title: "The people behind the artwork", emoji: "🧵", text: "Community groups, students, and residents contributed patterns, words, and colours — each shape holds a memory someone chose to share." },
      { id: "connects", title: "How this connects to Bristol", emoji: "🌉", text: "From textiles to shipping, the motifs echo the trades that built Bristol, gently asking who the city grows for next." },
      { id: "matters", title: "Why this artwork matters today", emoji: "✨", text: "As the campus grows, Charting Change is a reminder that new places are built on shared histories — and that students are part of the next chapter.", hasAudio: true },
    ],
    reflections: [
      "I never realised this place had such a layered history.",
      "This made me think differently about walking through campus.",
      "The story behind the artwork helped me feel more connected to Bristol.",
    ],
    walkingTime: "6 min walk",
    nearestBuilding: "Temple Quarter Enterprise Campus, main entrance",
    accessibility: "Step-free access. Wide, level path from Temple Meads.",
    pin: { x: 72, y: 68 },
  },
  {
    id: "hollow",
    title: "Hollow",
    location: "Royal Fort Gardens",
    area: "campus",
    image: hollow,
    artist: "Katie Paterson",
    artistBio:
      "Artist exploring deep time, nature, and our place in the world through collaborative, research-led public works.",
    artistConnection:
      "Hollow gathers samples of trees from across the planet, turning a quiet campus garden into a tiny model of the world's forests.",
    year: "2016",
    description:
      "A miniature forest of the world — a contemplative timber structure holding samples of tree species from every corner of the planet.",
    hook: "A whole world of trees inside one small room.",
    tags: ["Public art", "Campus", "Audio guide", "Hidden story"],
    hasAudio: true,
    hasAR: false,
    audio: {
      title: "Inside Hollow: a forest of deep time",
      duration: "3:05",
      caption: "Listen to a short story behind this artwork",
    },
    stamp: { id: "hollow", name: "Royal Fort Gardens" },
    stories: [
      { id: "before", title: "What was here before?", emoji: "🌳", text: "Royal Fort Gardens has been a green pause in the city for centuries — a place students still cross between lectures.", hasAudio: true },
      { id: "people", title: "The people behind the artwork", emoji: "🔬", text: "Scientists and foresters worldwide donated wood samples, making Hollow a global collaboration held in one small space." },
      { id: "connects", title: "How this connects to Bristol", emoji: "🍃", text: "It links Bristol's leafy campus to forests everywhere, asking us to think in centuries, not semesters." },
      { id: "matters", title: "Why this artwork matters today", emoji: "⏳", text: "In a fast student life, Hollow invites a slow moment to consider deep time and our shared planet." },
    ],
    reflections: [
      "I pass this every week but never stopped before.",
      "It felt like standing inside the whole world at once.",
      "A calm spot between deadlines — I'll come back.",
    ],
    walkingTime: "3 min walk",
    nearestBuilding: "Royal Fort House, University precinct",
    accessibility: "Grass approach; nearby paved path available.",
    pin: { x: 40, y: 34 },
  },
  {
    id: "palm-temple",
    title: "Palm Temple",
    location: "Chemistry Precinct",
    area: "campus",
    image: palmTemple,
    artist: "Luke Jerram",
    artistBio:
      "Bristol-based artist known for large-scale public installations that bring people together in shared, playful ways.",
    artistConnection:
      "Luke designed Palm Temple as a gathering place — a shaded pavilion where students meet, rest, and talk.",
    year: "2021",
    description:
      "A geometric pavilion shaped like a palm canopy, offering shade and a shared space to pause between the science buildings.",
    hook: "A pavilion built for meeting, resting, and talking.",
    tags: ["Public art", "Campus", "Student favourite", "AR"],
    hasAudio: false,
    hasAR: true,
    audio: {
      title: "Palm Temple: a place to gather",
      duration: "2:40",
      caption: "Listen to a short story behind this artwork",
    },
    stamp: { id: "palm-temple", name: "Palm Temple" },
    stories: [
      { id: "before", title: "What was here before?", emoji: "⚗️", text: "The precinct has long been the heart of science teaching — busy, focused, and often lacking a place to simply sit." },
      { id: "people", title: "The people behind the artwork", emoji: "🤝", text: "Students asked for somewhere to gather outdoors; Palm Temple was the playful answer." },
      { id: "connects", title: "How this connects to Bristol", emoji: "☀️", text: "Its warm terracotta tones nod to Bristol's characterful architecture and love of colour." },
      { id: "matters", title: "Why this artwork matters today", emoji: "💬", text: "It shows public art can be useful — a shelter, a landmark, and a meeting point all at once." },
    ],
    reflections: [
      "We always meet friends here before lab.",
      "Didn't expect a favourite spot in the chemistry precinct.",
      "The shade in summer is unbeatable.",
    ],
    walkingTime: "5 min walk",
    nearestBuilding: "School of Chemistry",
    accessibility: "Step-free, level paving throughout.",
    pin: { x: 30, y: 52 },
  },
  {
    id: "mirror-maze",
    title: "Mirror Maze",
    location: "Campus public space",
    area: "campus",
    image: mirrorMaze,
    artist: "Jeppe Hein",
    artistBio:
      "Artist creating interactive, mirrored works that turn viewers into part of the piece.",
    artistConnection:
      "Jeppe's mirrored panels reflect the campus and everyone in it, making the artwork different every second.",
    year: "2020",
    description:
      "A cluster of mirrored panels that reflect sky, buildings, and passers-by — turning the everyday campus into a shifting artwork.",
    hook: "You become part of the artwork when you walk in.",
    tags: ["Public art", "Campus", "Student favourite", "AR", "Hidden story"],
    hasAudio: true,
    hasAR: true,
    audio: {
      title: "Mirror Maze: seeing yourself in the city",
      duration: "2:55",
      caption: "Listen to a short story behind this artwork",
    },
    stamp: { id: "mirror-maze", name: "Mirror Maze" },
    stories: [
      { id: "before", title: "What was here before?", emoji: "🏛️", text: "An ordinary crossing point most students walked straight through without a glance." },
      { id: "people", title: "The people behind the artwork", emoji: "🪞", text: "The work only completes when people arrive — every reflection adds a new author." },
      { id: "connects", title: "How this connects to Bristol", emoji: "🌆", text: "It mirrors Bristol's changing skyline back at you, folding the city into the frame." },
      { id: "matters", title: "Why this artwork matters today", emoji: "👀", text: "It gently asks how we see ourselves within the places we pass through daily." },
    ],
    reflections: [
      "I liked seeing how other students interpreted it differently.",
      "Great for photos, but also strangely calming.",
      "Made me actually look up on my walk to class.",
    ],
    walkingTime: "4 min walk",
    nearestBuilding: "Senate House",
    accessibility: "Step-free, open paved plaza.",
    pin: { x: 52, y: 44 },
  },
  {
    id: "bristol-light",
    title: "Bristol Light",
    location: "City centre",
    area: "city",
    image: bristolLight,
    artist: "Squidsoup",
    artistBio:
      "A collective creating immersive light and sound works that respond to people and place.",
    artistConnection:
      "Squidsoup tuned Bristol Light to the rhythm of the city centre at dusk, when the plaza comes alive.",
    year: "2022",
    description:
      "A sweeping installation of coloured light beams that transforms a city-centre plaza into an atmospheric evening landmark.",
    hook: "The city centre glows differently after dark.",
    tags: ["Public art", "Audio guide", "AR", "Student favourite"],
    hasAudio: true,
    hasAR: true,
    audio: {
      title: "Bristol Light: colour after dark",
      duration: "3:30",
      caption: "Listen to a short story behind this artwork",
    },
    stamp: { id: "bristol-light", name: "Bristol Light" },
    stories: [
      { id: "before", title: "What was here before?", emoji: "🌃", text: "A busy but overlooked plaza that emptied out once the shops closed." },
      { id: "people", title: "The people behind the artwork", emoji: "💡", text: "Lighting designers and sound artists collaborated to give the space a new evening life." },
      { id: "connects", title: "How this connects to Bristol", emoji: "🎉", text: "It draws on Bristol's love of festivals, music, and colour spilling into public space." },
      { id: "matters", title: "Why this artwork matters today", emoji: "🌈", text: "It shows how light can make a place feel safer, warmer, and worth lingering in." },
    ],
    reflections: [
      "The audio made the artwork feel more alive.",
      "Perfect meeting point for a night out.",
      "Felt less alone in the city standing here.",
    ],
    walkingTime: "12 min walk",
    nearestBuilding: "City centre, Broadmead",
    accessibility: "Step-free plaza; benches nearby.",
    pin: { x: 58, y: 78 },
  },
  {
    id: "community-wall",
    title: "Community Wall",
    location: "East Bristol",
    area: "city",
    image: communityWall,
    artist: "Bristol residents & local artists",
    artistBio:
      "A collaborative mural made with East Bristol residents, students, and local street artists.",
    artistConnection:
      "Neighbours and students painted portraits and patterns together over a series of community weekends.",
    year: "2019",
    description:
      "A vibrant hand-painted mural celebrating the many cultures, faces, and stories of East Bristol's neighbourhoods.",
    hook: "Painted by the neighbourhood, for the neighbourhood.",
    tags: ["Public art", "Community story", "Student favourite", "Hidden story"],
    hasAudio: true,
    hasAR: false,
    audio: {
      title: "Community Wall: many hands, one wall",
      duration: "3:18",
      caption: "Listen to a short story behind this artwork",
    },
    stamp: { id: "community-wall", name: "Community Contributor" },
    stories: [
      { id: "before", title: "What was here before?", emoji: "🧱", text: "A blank, weathered wall that residents wanted to reclaim as their own." },
      { id: "people", title: "The people behind the artwork", emoji: "🎨", text: "Dozens of neighbours and students painted side by side, each adding a face or flower." },
      { id: "connects", title: "How this connects to Bristol", emoji: "🌍", text: "It reflects Bristol's proud, diverse communities and its world-famous street-art scene." },
      { id: "matters", title: "Why this artwork matters today", emoji: "❤️", text: "It's a living reminder that public space belongs to everyone who shares it." },
    ],
    reflections: [
      "Felt welcomed as someone new to Bristol.",
      "So many stories in one wall.",
      "Reminded me of home while being totally Bristol.",
    ],
    walkingTime: "18 min walk",
    nearestBuilding: "East Bristol high street",
    accessibility: "Pavement viewing; level access.",
    pin: { x: 84, y: 40 },
  },
];

export function getArtwork(id: string) {
  return artworks.find((a) => a.id === id);
}

export type RouteType = "quick" | "recommend" | "deep";

export interface CuratedRoute {
  id: string;
  name: string;
  type: RouteType;
  duration: string;
  artworkCount: number;
  distance: string;
  accessibility: string;
  theme: string;
  artworkIds: string[];
}

export const curatedRoutes: CuratedRoute[] = [
  {
    id: "temple-quarter-stories",
    name: "Temple Quarter Stories",
    type: "deep",
    duration: "25 min",
    artworkCount: 4,
    distance: "1.4 km",
    accessibility: "Step-free throughout",
    theme: "History & regeneration",
    artworkIds: ["charting-change", "bristol-light", "mirror-maze", "palm-temple"],
  },
  {
    id: "hidden-makers-trail",
    name: "Hidden Makers Trail",
    type: "deep",
    duration: "35 min",
    artworkCount: 5,
    distance: "2.1 km",
    accessibility: "Mostly step-free, one grass path",
    theme: "The people behind the art",
    artworkIds: ["community-wall", "charting-change", "hollow", "mirror-maze", "palm-temple"],
  },
  {
    id: "campus-quick-walk",
    name: "Campus Public Art Quick Walk",
    type: "quick",
    duration: "15 min",
    artworkCount: 3,
    distance: "0.9 km",
    accessibility: "Step-free throughout",
    theme: "A quick intro between classes",
    artworkIds: ["hollow", "mirror-maze", "palm-temple"],
  },
  {
    id: "bristol-city-discovery",
    name: "Bristol City Discovery Route",
    type: "deep",
    duration: "45 min",
    artworkCount: 6,
    distance: "3.2 km",
    accessibility: "Step-free, longer distance",
    theme: "Campus to city centre",
    artworkIds: ["hollow", "mirror-maze", "palm-temple", "charting-change", "bristol-light", "community-wall"],
  },
];

export function getRoute(id: string) {
  return curatedRoutes.find((r) => r.id === id);
}

export interface Stamp {
  id: string;
  name: string;
  emoji: string;
  description: string;
  unlock: string;
}

export const allStamps: Stamp[] = [
  { id: "first-visit", name: "First Artwork Visited", emoji: "🚩", description: "Your very first stop on the Bristol public art map.", unlock: "Visit 1 artwork to unlock" },
  { id: "charting-change", name: "Charting Change", emoji: "🧵", description: "The featured Temple Quarter commission about Bristol's making trades.", unlock: "Visit Charting Change" },
  { id: "hollow", name: "Royal Fort Gardens", emoji: "🌳", description: "A forest of tree samples hidden in the university gardens.", unlock: "Visit Hollow in Royal Fort Gardens" },
  { id: "palm-temple", name: "Palm Temple", emoji: "🌴", description: "A quiet pavilion of cast palms tucked behind the harbour.", unlock: "Visit Palm Temple" },
  { id: "mirror-maze", name: "Mirror Maze", emoji: "🪞", description: "A reflective maze that puts the city back in front of you.", unlock: "Visit Mirror Maze" },
  { id: "temple-explorer", name: "Temple Quarter Explorer", emoji: "🚂", description: "For walkers who finish a full curated route end to end.", unlock: "Complete 1 curated route" },
  { id: "hidden-story", name: "Hidden Story Found", emoji: "🔍", description: "Awarded for uncovering a story most people walk straight past.", unlock: "Open a hidden story on any artwork" },
  { id: "audio-listener", name: "Audio Listener", emoji: "🎧", description: "You listened to an artwork's audio guide all the way through.", unlock: "Play 1 audio guide" },
  { id: "community-contributor", name: "Community Contributor", emoji: "✍️", description: "Your words are now part of the community journal.", unlock: "Contribute to the community journal" },
];


export interface Contribution {
  id: string;
  artworkId: string;
  artworkTitle: string;
  type: "text" | "voice" | "image" | "sketch";
  contributor: string;
  privacy: "private" | "anonymous" | "public";
  preview: string;
}

export const featuredContributions: Contribution[] = [
  { id: "c1", artworkId: "charting-change", artworkTitle: "Charting Change", type: "sketch", contributor: "Anonymous", privacy: "public", preview: "A sketch from the Temple Quarter route" },
  { id: "c2", artworkId: "community-wall", artworkTitle: "Community Wall", type: "voice", contributor: "Anonymous", privacy: "anonymous", preview: "A voice note about feeling new to Bristol" },
  { id: "c3", artworkId: "hollow", artworkTitle: "Hollow", type: "image", contributor: "Maya", privacy: "public", preview: "A photo reflection from Royal Fort Gardens" },
  { id: "c4", artworkId: "mirror-maze", artworkTitle: "Mirror Maze", type: "text", contributor: "Anonymous", privacy: "public", preview: "\"I finally looked up on my walk to class.\"" },
  { id: "c5", artworkId: "bristol-light", artworkTitle: "Bristol Light", type: "image", contributor: "Sam", privacy: "public", preview: "A dusk photo of the light beams" },
];

export const discussionPrompts = [
  "What did this artwork make you notice?",
  "How did the story change your view of the place?",
  "What would you ask the artist?",
  "What does this artwork remind you of?",
];

export const reflectionPrompts = [
  "What detail did you notice that you might have missed before?",
  "What does this artwork make you think about Bristol?",
  "What story would you add to this place?",
  "What word would you leave for this artwork?",
];
