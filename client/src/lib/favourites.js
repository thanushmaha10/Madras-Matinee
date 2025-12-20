const FAV_KEY = "favourites";

export const getFavourites = () => {
  try {
    return JSON.parse(localStorage.getItem(FAV_KEY)) || [];
  } catch {
    return [];
  }
};

export const isFavourite = (id) => {
  const favourites = getFavourites();
  return favourites.includes(String(id));
};

export const addFavourite = (id) => {
  const favourites = getFavourites();
  const stringId = String(id);

  if (!favourites.includes(stringId)) {
    localStorage.setItem(FAV_KEY, JSON.stringify([...favourites, stringId]));
  }
};

export const removeFavourite = (id) => {
  const favourites = getFavourites();
  const stringId = String(id);

  const updated = favourites.filter((favId) => favId !== stringId);
  localStorage.setItem(FAV_KEY, JSON.stringify(updated));
};

export const toggleFavourite = (id) => {
  isFavourite(id) ? removeFavourite(id) : addFavourite(id);
};
