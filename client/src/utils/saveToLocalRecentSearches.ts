import { RecentSearchedPlace } from "../hooks/useRecentSearches";
import { Place } from "../types/Place";

export const saveToLocalRecentSearches = (place: any) => {
  const guest = localStorage.getItem("guestSearches");
  const parsed = guest ? (JSON.parse(guest) as RecentSearchedPlace[]) : [];

  const convertedPlace: Place = {
    id: place.id,
    title: place.title,
    address: place.address,
    position: {
      lat: place.position.Ma ?? place.position.lat,
      lng: place.position.La ?? place.position.lng,
    },
  };

  const filtered = parsed.filter(
    (item) => item.place && item.place.id !== convertedPlace.id
  );

  filtered.unshift({
    place: convertedPlace,
    searchedAt: new Date(),
  });

  if (filtered.length > 10) filtered.pop();

  localStorage.setItem("guestSearches", JSON.stringify(filtered));
};
