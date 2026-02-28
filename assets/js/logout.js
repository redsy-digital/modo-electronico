document.addEventListener("DOMContentLoaded", () => {

  const logoutBtn = document.getElementById("logoutBtn");
  if (!logoutBtn) return;

  logoutBtn.addEventListener("click", async () => {

    const { error } = await supabaseClient.auth.signOut();

    if (error) {
      alert("Erro ao sair: " + error.message);
      return;
    }

    window.location.href = "login.html";
  });

});