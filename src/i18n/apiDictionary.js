// Diccionario editable para términos que llegan desde APIs.
// Formato mental: [termino-api] -> traducción
// Ejemplo: "men's clothing" -> "Ropa de hombre"

export const API_DICTIONARY = {
  // FakeStore categorías
  "men's clothing": "Ropa de hombre",
  "women's clothing": "Ropa de mujer",
  jewelery: "Joyería",
  electronics: "Electrónica",

  // Filtros internos
  all: "Todas",

  // API local de roles
  guest: "Invitado",
  user: "Usuario",
  admin: "Administrador",
};

function normalizeApiKey(value) {
  return String(value)
    .trim()
    .toLowerCase()
    .replace(/[’`´]/g, "'")
    .replace(/\s+/g, " ");
}

export function translateApiTerm(value) {
  if (value === null || value === undefined) return "";

  const key = normalizeApiKey(value);
  return API_DICTIONARY[key] || String(value);
}

export function isApiTermTranslated(value) {
  if (value === null || value === undefined) return true;
  return translateApiTerm(value) !== String(value);
}
