import { createContext, useContext, useState } from "react";
import { Place } from "../types/Place";

interface MarkerContextType {
  selectedMarker: Place | null;
  setSelectedMarker: (place: Place | null) => void;
}

const MapMarkerContext = createContext<MarkerContextType | undefined>(
  undefined
);

export default function MapMarkerProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [selectedMarker, setSelectedMarker] = useState<Place | null>(null);

  return (
    <MapMarkerContext.Provider value={{ selectedMarker, setSelectedMarker }}>
      {children}
    </MapMarkerContext.Provider>
  );
}

export const useMapMarker = () => {
  const context = useContext(MapMarkerContext);
  if (!context) {
    throw new Error("useMapMarker must be used within a MapMarkerProvider");
  }
  return context;
};
