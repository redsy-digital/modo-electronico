// assets/js/credentials.js

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("credentialsForm");
  const backBtn = document.getElementById("backBtn");

  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const user = form.dataset.type;

    if (user === "password") {
      const newPass = document.getElementById("newPass").value;
      const confirmPass = document.getElementById("confirmPass").value;

      if (newPass !== confirmPass) {
        alert("As senhas não coincidem!");
        return;
      }

      const { error } = await supabase.auth.updateUser({
        password: newPass,
      });

      if (error) {
        alert("Erro: " + error.message);
        return;
      }

      alert("Senha atualizada com sucesso!");
      window.location.href = "admin/credentials.html"; // Redireciona após sucesso
    }

    if (user === "email") {
      const newEmail = document.getElementById("newEmail").value;
      const { error } = await supabase.auth.updateUser({
        email: newEmail,
      });

      if (error) {
        alert("Erro: " + error.message);
        return;
      }

      alert("E-mail atualizado com sucesso! Verifique seu e-mail para confirmar.");
      window.location.href = "admin/credentials.html"; // Redireciona após sucesso
    }
  });

  backBtn.addEventListener("click", () => {
    window.location.href = "admin/credentials.html"; // Volta para a página anterior
  });
});