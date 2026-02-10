const BASE_URL = "https://fakestoreapi.com";

export async function getProducts() {
    const res = await fetch(`${BASE_URL}/products`);
    if (!res.ok) throw new Error("Error al cargar productos");
    return res.json();
}

export async function getProductById(id) {
    const res = await fetch(`${BASE_URL}/products/${id}`);
    if (!res.ok) throw new Error("Error al cargar producto");
    return res.json();
}

export async function login(username, password) {
    const res = await fetch(`${BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
    });

    if (!res.ok) {
        throw new Error("Credenciales incorrectas");
    }

    return res.json(); 
}
