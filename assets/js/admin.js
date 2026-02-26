// assets/js/admin.js

document.addEventListener("DOMContentLoaded", () => {
  const logged = localStorage.getItem("adminLogado");

  if (!logged) {
    window.location.href = "login.html"; // Se não estiver logado, redireciona para login
  }
});