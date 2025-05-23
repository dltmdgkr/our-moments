import { createContext, useContext, useState } from "react";
import { Post } from "../types/Post";
export interface MomentMarkerContextType {
  selectedMomentMarker: Post | null;
  setSelectedMomentMarker: (post: Post | null) => void;
}

const MomentMarkerContext = createContext<MomentMarkerContextType | undefined>(
  undefined
);

export default function MomentMarkerProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [selectedMomentMarker, setSelectedMomentMarker] = useState<Post | null>(
    null
  );

  return (
    <MomentMarkerContext.Provider
      value={{ selectedMomentMarker, setSelectedMomentMarker }}
    >
      {children}
    </MomentMarkerContext.Provider>
  );
}

export const useMomentMarker = () => {
  const context = useContext(MomentMarkerContext);
  if (!context) {
    throw new Error(
      "useMomentMarker must be used within a MomentMarkerProvider"
    );
  }
  return context;
};
