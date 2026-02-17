// Diccionario editable para términos que llegan desde APIs.
// Formato mental: [termino-api] -> traducción

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

export function translateApiTerm(value) {
  if (value === null || value === undefined) return "";

  const key = String(value).trim().toLowerCase();
  return API_DICTIONARY[key] || String(value);
}
