document.addEventListener("DOMContentLoaded", () => {

  // MENU
  const toggle = document.getElementById("menuToggle");
  const sidebar = document.getElementById("sidebar");

  if (toggle && sidebar) {
    toggle.addEventListener("click", () => {
      sidebar.classList.toggle("active");
    });
  }

  // SISTEMA DE ESTRELAS
  const stars = document.querySelectorAll(".star");
  const form = document.querySelector(".feedback-form");
  let rating = 0;

  stars.forEach((star, index) => {

    // Hover preview
    star.addEventListener("mouseenter", () => {
      stars.forEach((s, i) => {
        s.classList.toggle("active", i <= index);
      });
    });

    star.addEventListener("mouseleave", () => {
      stars.forEach((s, i) => {
        s.classList.toggle("active", i < rating);
      });
    });

    // Click definitivo
    star.addEventListener("click", () => {
      rating = index + 1;
    });

  });

  // SUBMISSÃO
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      if (rating === 0) {
        alert("Por favor selecione uma avaliação ⭐");
        return;
      }

      const name = form.querySelector("input").value;
      const comment = form.querySelector("textarea").value;

      console.log({
        nome: name,
        comentario: comment,
        avaliacao: rating
      });

      alert("Feedback enviado com sucesso! 🚀");

      setTimeout(() => {
        window.location.href = "index.html";
      }, 1200);
    });
  }

});
