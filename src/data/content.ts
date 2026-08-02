import castaway from "@/assets/artwork-castaway.jpg";
import atlas from "@/assets/artwork-atlas.jpg";
import followMe from "@/assets/artwork-follow-me.png";
import palmTemple from "@/assets/artwork-palm-temple.jpg";
import uncertainWorld from "@/assets/artwork-uncertain-world.jpg";
import hollow from "@/assets/artwork-hollow.jpg";
import edithAndHans from "@/assets/artwork-edith-and-hans.jpg";
import voronoiScreen from "@/assets/artwork-voronoi-screen.jpg";
import henriettaLacks from "@/assets/artwork-henrietta-lacks.jpg";

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
  imageCredit: string;
  sourceUrl: string;
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

const sourceBase = "https://public-art.bristol.ac.uk/permanent-artworks";

const officialDetails = {
  audio: {
    title: "No audio guide listed on the official artwork page",
    duration: "—",
    caption: "Check the official artwork page for visit information",
  },
  reflections: [
    "What detail did you notice first?",
    "How did the artwork change the way you see this place?",
    "What would you ask the artist?",
  ],
};

export const artworks: Artwork[] = [
  {
    id: "castaway",
    title: "Castaway",
    location: "Goldney Gardens, Lower Clifton Hill, Bristol, BS8 1BH",
    area: "campus",
    image: castaway,
    imageCredit: "Image: University of Bristol Public Art",
    sourceUrl: `${sourceBase}/frank-benson-castaway/`,
    artist: "Frank Benson",
    artistBio: "Frank Benson is an American artist whose sculptural and photographic work explores arrested movement and digital tools.",
    artistConnection: "The work combines digital photography, 3D scanning, sculpting, and printing technologies to create a life-sized bronze figure.",
    year: "2018",
    description: "A life-sized bronze portrait of a crouching modern figure. The work evokes a solitary person making do with the detritus of modern life, including a crab-shell helmet and a discarded detergent bottle.",
    hook: "A contemporary castaway made from the remains of modern life.",
    tags: ["Permanent artwork", "Bronze", "Goldney Gardens"],
    hasAudio: false,
    hasAR: false,
    audio: officialDetails.audio,
    stamp: { id: "castaway", name: "Castaway" },
    stories: [
      { id: "form", title: "A figure in an unusual pose", emoji: "🧍", text: "The crouched pose is familiar and human, but unusual in the sculptural tradition; it holds the viewer's gaze." },
      { id: "process", title: "A digital-to-bronze process", emoji: "🛠️", text: "The statue was created using digital photography, 3D scanning, sculpting, and printing technologies." },
      { id: "visit", title: "Location and access", emoji: "📍", text: "Castaway is on a bank near the canal and can be viewed from the accessible gravel Serpentine Walkway. Goldney Garden is currently open by appointment as part of a Historic Garden Tour." },
    ],
    reflections: officialDetails.reflections,
    walkingTime: "See official location details",
    nearestBuilding: "Goldney House",
    accessibility: "Viewable from the accessible gravel Serpentine Walkway; garden visits are by appointment.",
    pin: { x: 18, y: 26 },
  },
  {
    id: "atlas",
    title: "Atlas",
    location: "Queen's Building, University Walk, Bristol, BS8 1TR",
    area: "campus",
    image: atlas,
    imageCredit: "Image: University of Bristol Public Art",
    sourceUrl: `${sourceBase}/annie-cattrell-atlas/`,
    artist: "Annie Cattrell",
    artistBio: "Annie Cattrell is a conceptual artist whose work explores where art, science, and the poetic meet.",
    artistConnection: "Cattrell developed Atlas through engagement with engineering academics, staff, students, societies, technicians, and project leaders.",
    year: "2017",
    description: "Two spheres enlarge and reduce the landmasses and seas of planet Earth. Rods hold together the split land masses and water, presenting the globe as a reflection of engineering.",
    hook: "Two deconstructed globes turn engineering into a three-dimensional world map.",
    tags: ["Permanent artwork", "Engineering", "Queen's Building"],
    hasAudio: false,
    hasAR: false,
    audio: officialDetails.audio,
    stamp: { id: "atlas", name: "Atlas" },
    stories: [
      { id: "concept", title: "The globe as engineering", emoji: "🌍", text: "Atlas presents the globe as a feat of engineering: a way of measuring, apportioning, and understanding the world." },
      { id: "water", title: "Water without borders", emoji: "💧", text: "The artwork draws attention to the immensity of water and how it interconnects around the world." },
      { id: "visit", title: "Location and access", emoji: "📍", text: "Atlas is in the glass atrium of the Queen's Building. It is visible from outside; entry to the atrium is generally limited to University UCard holders except during public events." },
    ],
    reflections: officialDetails.reflections,
    walkingTime: "See official location details",
    nearestBuilding: "Queen's Building, Faculty of Engineering",
    accessibility: "Visible through the glass atrium from Woodland Road; atrium access may require a University UCard.",
    pin: { x: 31, y: 20 },
  },
  {
    id: "follow-me",
    title: "Follow Me",
    location: "Royal Fort Gardens, Tyndall Avenue, BS8 1TH",
    area: "campus",
    image: followMe,
    imageCredit: "Photo: Jamie Woodley, via University of Bristol Public Art",
    sourceUrl: `${sourceBase}/follow-me/`,
    artist: "Jeppe Hein",
    artistBio: "Jeppe Hein is a Danish artist known for interactive, site-specific works that focus on perception and the viewer's experience.",
    artistConnection: "Commissioned for Royal Fort Gardens to mark the centenary of the University of Bristol receiving its charter in 1909.",
    year: "2009",
    description: "A square formation of 76 high-polished stainless-steel plates arranged as a 6 × 6 metre labyrinth. The mirrored surfaces reflect visitors, the landscape, and one another to create a disorienting space.",
    hook: "A mirrored labyrinth where the landscape and its visitors become part of the work.",
    tags: ["Permanent artwork", "Interactive", "Royal Fort Gardens"],
    hasAudio: false,
    hasAR: false,
    audio: officialDetails.audio,
    stamp: { id: "follow-me", name: "Follow Me" },
    stories: [
      { id: "labyrinth", title: "A 6 × 6 metre labyrinth", emoji: "🪞", text: "Follow Me is made from 76 vertical polished stainless-steel plates arranged in a square formation." },
      { id: "reflection", title: "An artwork that changes", emoji: "✨", text: "The multiplied reflections produce a dizzying sense of space and envelop visitors in an unfamiliar environment." },
      { id: "visit", title: "Location and access", emoji: "📍", text: "Visitors are invited inside, but the paths within the sculpture are narrow, so wheelchair access is restricted to the outside." },
    ],
    reflections: officialDetails.reflections,
    walkingTime: "See official location details",
    nearestBuilding: "Royal Fort House",
    accessibility: "Accessible path around the garden; narrow internal paths restrict wheelchair access inside the labyrinth.",
    pin: { x: 45, y: 27 },
  },
  {
    id: "palm-temple",
    title: "Palm Temple",
    location: "Chemistry precinct, Cantock's Close, Bristol BS8 1TS",
    area: "campus",
    image: palmTemple,
    imageCredit: "Photo: Bob Pitchford, via University of Bristol Public Art",
    sourceUrl: `${sourceBase}/luke-jerram-palm-temple-2020/`,
    artist: "Luke Jerram",
    artistBio: "Luke Jerram is a Bristol-based artist whose multidisciplinary practice includes sculptures, installations, and live arts projects.",
    artistConnection: "The work was donated to the University after being commissioned by Sky Arts for a programme celebrating Brunelleschi's dome of Florence Cathedral.",
    year: "2020",
    description: "A pavilion made from a cedar-wood lamella dome split into two parallel halves. Colourful dichroic panels reference cathedral stained glass, while a mirrored floor reflects the panels, sky, and changing weather.",
    hook: "A cathedral-inspired pavilion with an Extinction Bell at its heart.",
    tags: ["Permanent artwork", "Dichroic panels", "Chemistry precinct"],
    hasAudio: false,
    hasAR: false,
    audio: officialDetails.audio,
    stamp: { id: "palm-temple", name: "Palm Temple" },
    stories: [
      { id: "structure", title: "Two palms coming together", emoji: "🌴", text: "The dome was cut in half and placed back together in parallel, like two palms coming together." },
      { id: "bell", title: "The Extinction Bell", emoji: "🔔", text: "The bell tolls once, 150–200 times a day at random intervals, indicating the estimated number of species lost worldwide every 24 hours." },
      { id: "visit", title: "Location and access", emoji: "📍", text: "Palm Temple is free to visit in the cobbled courtyard at the entrance to the School of Chemistry. Openings at both ends allow wheelchair access." },
    ],
    reflections: officialDetails.reflections,
    walkingTime: "See official location details",
    nearestBuilding: "School of Chemistry",
    accessibility: "Openings at both ends of the sculpture allow wheelchair access.",
    pin: { x: 29, y: 49 },
  },
  {
    id: "uncertain-world",
    title: "Uncertain World",
    location: "29 Park Row, Bristol, BS8 1US",
    area: "city",
    image: uncertainWorld,
    imageCredit: "Image: University of Bristol Public Art",
    sourceUrl: `${sourceBase}/alex-lucas-uncertain-world/`,
    artist: "Alex Lucas (Lucas Antics)",
    artistBio: "Alex Lucas is a Bristol-based illustrator, street artist, and muralist known for dark, quirky, and humorous designs.",
    artistConnection: "Commissioned by the University of Bristol's Cabot Institute for the Environment in 2015 as part of its Uncertain World research.",
    year: "2015",
    description: "A mural on the side of 29 Park Row that imagines a possible future with high carbon dioxide concentrations and higher sea levels, colliding with the deep past of the Jurassic.",
    hook: "A Bristol street scene where a possible future meets the Jurassic past.",
    tags: ["Permanent artwork", "Mural", "Cabot Institute"],
    hasAudio: false,
    hasAR: false,
    audio: officialDetails.audio,
    stamp: { id: "uncertain-world", name: "Uncertain World" },
    stories: [
      { id: "brief", title: "A world of uncertainty", emoji: "🌎", text: "The commission asks viewers to reflect on how life could change with high carbon dioxide concentrations and higher sea levels." },
      { id: "composition", title: "Built in layers", emoji: "🦖", text: "Each prehistoric mammal and piece of Bristol scenery was drawn individually, then composed together using Photoshop." },
      { id: "visit", title: "Location", emoji: "📍", text: "The mural is visible from the street at the corner of Woodland Road and Park Row." },
    ],
    reflections: officialDetails.reflections,
    walkingTime: "See official location details",
    nearestBuilding: "29 Park Row",
    accessibility: "Visible from the street at the corner of Woodland Road and Park Row.",
    pin: { x: 66, y: 74 },
  },
  {
    id: "hollow",
    title: "Hollow",
    location: "Royal Fort Gardens, Tyndall Avenue, Bristol, BS8 1UH",
    area: "campus",
    image: hollow,
    imageCredit: "Photo: Max McClure, via University of Bristol Public Art",
    sourceUrl: `${sourceBase}/hollow/`,
    artist: "Katie Paterson with Zeller & Moye",
    artistBio: "Katie Paterson works with deep time, nature, and the fragility of life; Zeller & Moye are the architects associated with Hollow.",
    artistConnection: "Commissioned to mark the opening of the Life Sciences building and produced by Bristol-based public art producers Situations.",
    year: "2016",
    description: "An immersive artwork made from 10,000 individual tree samples from across the globe. Its Douglas Fir exterior is inspired by a forest canopy; inside, untreated wooden pieces form a contemplative forest-like space.",
    hook: "A compendium of the world's forests inside Royal Fort Gardens.",
    tags: ["Permanent artwork", "10,000 tree samples", "Royal Fort Gardens"],
    hasAudio: false,
    hasAR: false,
    audio: officialDetails.audio,
    stamp: { id: "hollow", name: "Hollow" },
    stories: [
      { id: "forest", title: "A world of trees", emoji: "🌳", text: "Hollow is made up of 10,000 tree samples from across the globe and is designed to inspire wonder at the evolution of trees through time." },
      { id: "inside", title: "Inside the structure", emoji: "🪵", text: "The interior is formed from thousands of untreated wooden pieces, while the outside structure is made from Douglas Fir." },
      { id: "visit", title: "Location and access", emoji: "📍", text: "Hollow is in the south-eastern corner of Royal Fort Gardens. The gardens and surrounding area have level access, but the entrance has a low step and the fossil-fragment floor is uneven." },
    ],
    reflections: officialDetails.reflections,
    walkingTime: "See official location details",
    nearestBuilding: "Royal Fort Gardens",
    accessibility: "Level access to the gardens and around the sculpture; narrow entrance with low step and uneven fossil-fragment floor.",
    pin: { x: 43, y: 35 },
  },
  {
    id: "edith-and-hans",
    title: "Edith and Hans",
    location: "Wills Hall, Parrys Lane, Stoke Bishop, Bristol BS9 1AE",
    area: "campus",
    image: edithAndHans,
    imageCredit: "Photo: Max McClure, via University of Bristol Public Art",
    sourceUrl: `${sourceBase}/sarah-staton-edith-and-hans/`,
    artist: "Sarah Staton",
    artistBio: "Sarah Staton is a London-based visual artist whose practice combines sculpture with design, landscape, and architecture.",
    artistConnection: "The social sculpture was commissioned for the University's Stoke Bishop residential site and named after the artist's grandmother Edith and great uncle Hans.",
    year: "2016",
    description: "An outdoor room made from two L-shaped walls, one inside the other, with benches along their corners. Local reclaimed bricks, pennant stone, and artist-designed tiles reference Bristol's brick-making history and the University's global community.",
    hook: "A social sculpture designed for student lingering, conversation, and looking out across the landscape.",
    tags: ["Permanent artwork", "Social sculpture", "Stoke Bishop"],
    hasAudio: false,
    hasAR: false,
    audio: officialDetails.audio,
    stamp: { id: "edith-and-hans", name: "Edith and Hans" },
    stories: [
      { id: "room", title: "An outdoor room", emoji: "🧱", text: "Two L-shaped walls create a corridor with benches, allowing visitors to face one another or sit looking in opposite directions." },
      { id: "tiles", title: "Currency symbols in the tiles", emoji: "💷", text: "The bespoke tile design uses symbols for major global currencies, celebrating the University's diverse global community." },
      { id: "visit", title: "Location and access", emoji: "📍", text: "The work is in a meadow between Wills Hall and Hiatt Baker Hall in the Stoke Bishop campus. Access may be limited during maintenance or other activities." },
    ],
    reflections: officialDetails.reflections,
    walkingTime: "See official location details",
    nearestBuilding: "Wills Hall and Hiatt Baker Hall",
    accessibility: "Open to all; access may occasionally be limited for maintenance or other University activities.",
    pin: { x: 74, y: 23 },
  },
  {
    id: "voronoi-screen",
    title: "Voronoi Screen",
    location: "Fry Building, School of Mathematics, Woodland Road, Bristol, BS8 1UG",
    area: "campus",
    image: voronoiScreen,
    imageCredit: "Photo: Fotohaus, via University of Bristol Public Art",
    sourceUrl: `${sourceBase}/professor-green-wilkinson-eyre-voronoi-screen/`,
    artist: "WilkinsonEyre and Professor Peter Green",
    artistBio: "WilkinsonEyre is an international architecture practice; Professor Peter Green developed an efficient algorithm for computing Voronoi diagrams.",
    artistConnection: "Designed in consultation with Professor Peter Green and the School of Mathematics user team as part of the Fry Building transformation.",
    year: "2017",
    description: "A fibreglass brise-soleil enclosing the Fry Building atrium. Its cellular design is a three-dimensional interpretation of a Voronoi diagram, dividing space into tessellating polygonal cells.",
    hook: "A mathematical diagram becomes architecture, sun shade, and teaching resource.",
    tags: ["Permanent artwork", "Mathematics", "Fry Building"],
    hasAudio: false,
    hasAR: false,
    audio: officialDetails.audio,
    stamp: { id: "voronoi-screen", name: "Voronoi Screen" },
    stories: [
      { id: "pattern", title: "What is a Voronoi diagram?", emoji: "🔷", text: "Random points divide a plane into tessellating polygons, with each cell containing the region nearest to its point." },
      { id: "building", title: "Art and architecture", emoji: "🏛️", text: "The screen acts as a sun shade around the glazed atrium and large glass staircase, as well as a stimulus for further inquiry." },
      { id: "visit", title: "Location and access", emoji: "📍", text: "The enclosed garden is accessed through the Fry Building on Woodland Road. The garden has level access and is open Monday to Friday, 9.00am–5.00pm, subject to variation." },
    ],
    reflections: officialDetails.reflections,
    walkingTime: "See official location details",
    nearestBuilding: "Fry Building, School of Mathematics",
    accessibility: "Level access into the garden and around the screen; access hours are generally Monday–Friday, 9.00am–5.00pm.",
    pin: { x: 57, y: 18 },
  },
  {
    id: "henrietta-lacks",
    title: "Henrietta Lacks",
    location: "Royal Fort Gardens, Tyndall Avenue, Bristol, BS8 1TH",
    area: "campus",
    image: henriettaLacks,
    imageCredit: "Image: University of Bristol Public Art",
    sourceUrl: `${sourceBase}/helen-wilson-roe/`,
    artist: "Helen Wilson-Roe",
    artistBio: "Helen Wilson-Roe is a Bristol-based artist whose work addresses social and cultural issues affecting disenfranchised and culturally diverse communities.",
    artistConnection: "The artist worked with a life model, archive images of Henrietta Lacks, and members of the Lacks family; the figure was sculpted in clay and cast in bronze.",
    year: "2021",
    description: "A life-size bronze statue of Henrietta Lacks, whose cells were the first living human cells to survive and multiply outside the body. The statue honours her legacy and the importance of health equity and social justice.",
    hook: "A campus statue honouring Henrietta Lacks and the legacy of HeLa cells.",
    tags: ["Permanent artwork", "Bronze", "Health equity"],
    hasAudio: false,
    hasAR: false,
    audio: officialDetails.audio,
    stamp: { id: "henrietta-lacks", name: "Henrietta Lacks" },
    stories: [
      { id: "legacy", title: "The legacy of HeLa cells", emoji: "🔬", text: "HeLa cells enabled major medical advances including the polio vaccine, chemotherapy, gene mapping, IVF, and cloning." },
      { id: "consent", title: "A story about ethics", emoji: "⚖️", text: "Henrietta Lacks' cells were taken without her or her family's knowledge or consent, making her story a reminder of past injustices in health and science." },
      { id: "visit", title: "Location and access", emoji: "📍", text: "The statue is outside Stuart House at the end of a short gravel pathway in Royal Fort Courtyard gardens. The surrounding area has level access." },
    ],
    reflections: officialDetails.reflections,
    walkingTime: "See official location details",
    nearestBuilding: "Stuart House",
    accessibility: "Level access into Royal Fort Gardens and the area around the statue.",
    pin: { x: 53, y: 42 },
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
    id: "royal-fort-gardens",
    name: "Royal Fort Gardens",
    type: "quick",
    duration: "Explore at your own pace",
    artworkCount: 4,
    distance: "See map",
    accessibility: "Check each artwork's access note",
    theme: "Reflection, nature, and place",
    artworkIds: ["follow-me", "hollow", "henrietta-lacks", "voronoi-screen"],
  },
  {
    id: "clifton-campus-art",
    name: "Clifton Campus Art",
    type: "recommend",
    duration: "Explore at your own pace",
    artworkCount: 4,
    distance: "See map",
    accessibility: "Check each artwork's access note",
    theme: "Art, science, and architecture",
    artworkIds: ["atlas", "voronoi-screen", "palm-temple", "uncertain-world"],
  },
  {
    id: "permanent-artwork-collection",
    name: "Permanent Artwork Collection",
    type: "deep",
    duration: "Explore at your own pace",
    artworkCount: artworks.length,
    distance: "See map",
    accessibility: "Check each artwork's access note",
    theme: "The University's permanent public art",
    artworkIds: artworks.map((artwork) => artwork.id),
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
  { id: "first-visit", name: "First Artwork Visited", emoji: "🎟️", description: "Your first stop on the University's permanent public art map.", unlock: "Visit 1 artwork to unlock" },
  ...artworks.slice(0, 4).map((artwork) => ({ id: artwork.id, name: artwork.title, emoji: "🎨", description: artwork.hook, unlock: `Visit ${artwork.title}` })),
  { id: "collection-explorer", name: "Collection Explorer", emoji: "🗺️", description: "For exploring the University's permanent artwork collection.", unlock: "Complete the permanent artwork collection route" },
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
  { id: "c1", artworkId: "atlas", artworkTitle: "Atlas", type: "sketch", contributor: "Anonymous", privacy: "public", preview: "A sketch from the Queen's Building" },
  { id: "c2", artworkId: "edith-and-hans", artworkTitle: "Edith and Hans", type: "voice", contributor: "Anonymous", privacy: "anonymous", preview: "A reflection on a social sculpture" },
  { id: "c3", artworkId: "hollow", artworkTitle: "Hollow", type: "image", contributor: "Maya", privacy: "public", preview: "A photo reflection from Royal Fort Gardens" },
  { id: "c4", artworkId: "follow-me", artworkTitle: "Follow Me", type: "text", contributor: "Anonymous", privacy: "public", preview: "A reflection on mirrors and movement" },
  { id: "c5", artworkId: "henrietta-lacks", artworkTitle: "Henrietta Lacks", type: "image", contributor: "Sam", privacy: "public", preview: "A reflection from Royal Fort Courtyard" },
];

export const discussionPrompts = [
  "What did this artwork make you notice?",
  "How did the artwork change your view of the place?",
  "What would you ask the artist?",
  "What does this artwork remind you of?",
];

export const reflectionPrompts = [
  "What detail did you notice first?",
  "What does this artwork make you think about Bristol?",
  "What story would you add to this place?",
  "What word would you leave for this artwork?",
];
