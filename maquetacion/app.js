
  
  const today = thmos[0]; // más adelante puedes rotar por día
  
  document.getElementById("word").textContent = today.palabra;
  document.getElementById("definition").textContent = today.definicion;
  document.getElementById("example").textContent = `Ej: “${today.ejemplo}”`;
  
  // Audio (preparado para el futuro)
  document.getElementById("play-audio").addEventListener("click", () => {
    const audio = new Audio(today.audio); // reemplazar cuando tengas archivos
    audio.play().catch(() => alert("Audio aún no disponible"));
  });
  
  // Favoritos con LocalStorage
  const favBtn = document.getElementById("favorite-btn");
  favBtn.addEventListener("click", () => {
    let favs = JSON.parse(localStorage.getItem("favoritos")) || [];
    if (!favs.includes(today.palabra)) {
      favs.push(today.palabra);
      localStorage.setItem("favoritos", JSON.stringify(favs));
      alert("¡Guardado en favoritos!");
    } else {
      alert("Ya está en tus favoritos.");
    }
  });
  
  // Valoración (muy básica)
  document.getElementById("stars").addEventListener("click", () => {
    alert("¡Gracias por tu valoración!");
  });
  
    let isAuthenticated = false;
    let userEmail = null; // si quieres identificar al usuario

// Inicializar Google Auth
window.onload = () => {
    google.accounts.id.initialize({
        client_id: "TU_CLIENT_ID_GOOGLE",
        callback: (response) => {
          console.log("Usuario logueado:", response);
          userAuthenticated = true;
          // Aquí podrías mostrar info del usuario o usar localStorage para sus favoritos
        }
      });
      

  google.accounts.id.renderButton(
    document.getElementById("google-btn"),
    { theme: "outline", size: "large" }
  );
};

// Función para decodificar el JWT de Google
function decodeJwt(token) {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(atob(base64).split('').map(c =>
    '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
  ).join(''));
  return JSON.parse(jsonPayload);
}

