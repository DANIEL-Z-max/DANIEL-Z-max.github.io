// Esperar a que el DOM esté completamente cargado
document.addEventListener("DOMContentLoaded", function () {
  const boton = document.getElementById("boton");
  const mensaje = document.getElementById("mensaje");
  const modoOscuroBtn = document.getElementById("modoOscuro");

  // Cambiar texto al hacer clic
  boton.addEventListener("click", function () {
    mensaje.textContent = "¡Gracias por hacer clic! 😄";
  });

  // Cambiar modo oscuro
  modoOscuroBtn.addEventListener("click", function () {
    document.body.classList.toggle("dark-mode");
  });
});
