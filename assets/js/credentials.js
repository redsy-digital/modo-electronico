document.addEventListener("DOMContentLoaded", () => {
  
  const optionsContainer = document.getElementById("optionsContainer");
  const formContainer = document.getElementById("formContainer");
  const form = document.getElementById("credentialsForm");
  const backBtn = document.getElementById("backBtn");
  const changePassBtn = document.getElementById("changePassBtn");
  const changeEmailBtn = document.getElementById("changeEmailBtn");
  
  let currentMode = null;

  // ==============================
  // FORM PASSWORD
  // ==============================

  function showPasswordForm() {
    currentMode = "password";

    optionsContainer.classList.add("hidden");
    formContainer.classList.remove("hidden");

    form.innerHTML = `
      <input type="password" id="newPass" placeholder="Nova Palavra-passe" required>
      <input type="password" id="confirmPass" placeholder="Confirmar Nova Palavra-passe" required>
      <button type="submit" class="btn btn-primary">
        Atualizar Palavra-passe
      </button>
    `;
  }

  // ==============================
  // FORM EMAIL
  // ==============================

  function showEmailForm() {
    currentMode = "email";

    optionsContainer.classList.add("hidden");
    formContainer.classList.remove("hidden");

    form.innerHTML = `
      <input type="email" id="oldEmail" placeholder="E-mail atual" required>
      <input type="email" id="newEmail" placeholder="Novo e-mail" required>
      <button type="submit" class="btn btn-primary">
        Atualizar E-mail
      </button>
      <div id="emailSuccessCard" class="success-card hidden">
        Foi enviado um link de confirmação para o novo e-mail.
        Verifique sua caixa de entrada.
      </div>
    `;
  }

  // ==============================

  changePassBtn.addEventListener("click", showPasswordForm);
  changeEmailBtn.addEventListener("click", showEmailForm);

  backBtn.addEventListener("click", () => {
    currentMode = null;
    formContainer.classList.add("hidden");
    optionsContainer.classList.remove("hidden");
    form.innerHTML = "";
  });

  // ==============================
  // SUBMIT HANDLER
  // ==============================

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // ===== PASSWORD =====
    if (currentMode === "password") {

      const newPass = document.getElementById("newPass").value;
      const confirmPass = document.getElementById("confirmPass").value;

      if (newPass !== confirmPass) {
        alert("As palavras-passe não coincidem.");
        return;
      }

      if (newPass.length < 6) {
        alert("A palavra-passe deve ter pelo menos 6 caracteres.");
        return;
      }

      const { error } = await supabaseClient.auth.updateUser({
        password: newPass
      });

      if (error) {
        alert("Erro ao atualizar palavra-passe.");
        return;
      }

      alert("Palavra-passe atualizada com sucesso!");
      form.reset();
    }

    // ===== EMAIL =====
    if (currentMode === "email") {

      const oldEmail = document.getElementById("oldEmail").value.trim();
      const newEmail = document.getElementById("newEmail").value.trim();

      const { data: { user } } = await supabaseClient.auth.getUser();

      if (!user) {
        window.location.href = "/login.html";
        return;
      }

      if (oldEmail !== user.email) {
        alert("O e-mail atual não corresponde ao da conta.");
        return;
      }

      const { error } = await supabaseClient.auth.updateUser(
        { email: newEmail },
        {
          emailRedirectTo: window.location.origin + "/admin/dashboard.html"
        }
      );

      if (error) {
        alert("Erro ao atualizar e-mail.");
        return;
      }

      document.getElementById("emailSuccessCard").classList.remove("hidden");
      form.reset();
    }

  });

});