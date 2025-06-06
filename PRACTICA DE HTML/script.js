alert("Bienvenido a El Rincón del Pensamiento");

document.addEventListener("DOMContentLoaded", () => {
  const titulo = document.getElementById("titulo");
  const formulario = document.getElementById("formulario");
  const modoBtn = document.getElementById("modo-btn");
  const fraseEl = document.getElementById("frase");
  const fraseBtn = document.getElementById("frase-btn");
  const imagen = document.getElementById("imagen-filosofa");

  const frases = [
    "“Solo sé que no sé nada.” — Sócrates",
    "“El conocimiento es poder.” — Francis Bacon",
    "“Pienso, luego existo.” — René Descartes",
    "“La vida no examinada no vale la pena ser vivida.” — Sócrates",
    "“Dios ha muerto.” — Friedrich Nietzsche",
    "“El hombre es la medida de todas las cosas.” — Protágoras",
    "“La felicidad depende de nosotros mismos.” — Aristóteles"
  ];

  const imagenes = [
     
  ];

  // 🌓 Restaurar modo oscuro si está guardado
  if (localStorage.getItem("modo") === "oscuro") {
    document.body.classList.add("dark-mode");
  }

  // Cambiar título al hacer clic
  titulo.addEventListener("click", () => {
    titulo.style.color = "var(--accent)";
    titulo.textContent = "¡Has hecho clic en el título del pensamiento!";
  });

  // Validar formulario
  formulario.addEventListener("submit", (e) => {
    e.preventDefault();
    alert("¡Gracias por enviar tus datos, sabio pensador!");
  });

  // Cambiar modo claro/oscuro con guardado
  modoBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    const modoActual = document.body.classList.contains("dark-mode") ? "oscuro" : "claro";
    localStorage.setItem("modo", modoActual);
  });

  // Mostrar frase e imagen aleatoria con animación
  fraseBtn.addEventListener("click", () => {
    // Animar salida
    fraseEl.classList.add("fade-out");
    imagen.classList.add("fade-out");

    setTimeout(() => {
      const i = Math.floor(Math.random() * frases.length);
      fraseEl.textContent = frases[i];

      const imgIndex = Math.floor(Math.random() * imagenes.length);
      imagen.src = imagenes[imgIndex];

      // Animar entrada
      fraseEl.classList.remove("fade-out");
      imagen.classList.remove("fade-out");
    }, 400);
  });
});
