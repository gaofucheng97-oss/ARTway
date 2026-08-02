import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { Contribution } from "@/data/content";
import { featuredContributions } from "@/data/content";

interface JourneyState {
  saved: string[];
  visited: string[];
  stamps: string[];
  savedStories: string[]; // `${artworkId}:${storyId}`
  contributions: Contribution[];
  activeRoute: { routeId: string; completed: string[] } | null;
}

interface JourneyContextValue extends JourneyState {
  toggleSaved: (id: string) => void;
  markVisited: (id: string) => void;
  collectStamp: (id: string) => void;
  toggleSavedStory: (key: string) => void;
  addContribution: (c: Omit<Contribution, "id">) => void;
  removeContribution: (id: string) => void;
  startRoute: (routeId: string) => void;
  completeArtworkInRoute: (artworkId: string) => void;
  clearRoute: () => void;
  isSaved: (id: string) => boolean;
  isVisited: (id: string) => boolean;
  hasStamp: (id: string) => boolean;
}

const STORAGE_KEY = "hhg-journey-v2";

const defaultState: JourneyState = {
  saved: ["follow-me"],
  visited: ["hollow"],
  stamps: ["first-visit", "hollow"],
  savedStories: ["hollow:forest"],
  contributions: [
    {
      ...featuredContributions[3],
      id: "mine-1",
      contributor: "You",
      privacy: "private",
      preview: "A reflection on mirrors and movement.",
    },
  ],
  activeRoute: { routeId: "royal-fort-gardens", completed: ["hollow"] },
};

const JourneyContext = createContext<JourneyContextValue | null>(null);

export function JourneyProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<JourneyState>(defaultState);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setState((s) => ({ ...s, ...JSON.parse(raw) }));
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* ignore */
    }
  }, [state, hydrated]);

  const value: JourneyContextValue = {
    ...state,
    isSaved: (id) => state.saved.includes(id),
    isVisited: (id) => state.visited.includes(id),
    hasStamp: (id) => state.stamps.includes(id),
    toggleSaved: (id) =>
      setState((s) => ({
        ...s,
        saved: s.saved.includes(id)
          ? s.saved.filter((x) => x !== id)
          : [...s.saved, id],
      })),
    markVisited: (id) =>
      setState((s) => ({
        ...s,
        visited: s.visited.includes(id) ? s.visited : [...s.visited, id],
      })),
    collectStamp: (id) =>
      setState((s) => ({
        ...s,
        stamps: s.stamps.includes(id) ? s.stamps : [...s.stamps, id],
      })),
    toggleSavedStory: (key) =>
      setState((s) => ({
        ...s,
        savedStories: s.savedStories.includes(key)
          ? s.savedStories.filter((x) => x !== key)
          : [...s.savedStories, key],
      })),
    addContribution: (c) =>
      setState((s) => ({
        ...s,
        contributions: [
          { ...c, id: `mine-${Date.now()}` },
          ...s.contributions,
        ],
      })),
    removeContribution: (id) =>
      setState((s) => ({
        ...s,
        contributions: s.contributions.filter((c) => c.id !== id),
      })),
    startRoute: (routeId) =>
      setState((s) => ({ ...s, activeRoute: { routeId, completed: [] } })),
    completeArtworkInRoute: (artworkId) =>
      setState((s) =>
        s.activeRoute
          ? {
              ...s,
              activeRoute: {
                ...s.activeRoute,
                completed: s.activeRoute.completed.includes(artworkId)
                  ? s.activeRoute.completed
                  : [...s.activeRoute.completed, artworkId],
              },
            }
          : s,
      ),
    clearRoute: () => setState((s) => ({ ...s, activeRoute: null })),
  };

  return (
    <JourneyContext.Provider value={value}>{children}</JourneyContext.Provider>
  );
}

export function useJourney() {
  const ctx = useContext(JourneyContext);
  if (!ctx) throw new Error("useJourney must be used within JourneyProvider");
  return ctx;
}
