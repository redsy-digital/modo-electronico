document.addEventListener("DOMContentLoaded", () => {
  
  const form = document.getElementById("credentialsForm");
  const backBtn = document.getElementById("backBtn");
  const formContainer = document.getElementById("formContainer");
  const optionsContainer = document.getElementById("optionsContainer");
  const changeEmailBtn = document.getElementById("changeEmailBtn");
  const changePassBtn = document.getElementById("changePassBtn");
  
  if (!form) return;
  
  // =========================
  // MOSTRAR FORM EMAIL
  // =========================
  changeEmailBtn.addEventListener("click", () => {
    
    form.dataset.type = "email";
    
    form.innerHTML = `
      <input type="email" id="newEmail" placeholder="Novo e-mail" required>
      <button type="submit" class="btn btn-primary">Atualizar E-mail</button>
    `;
    
    optionsContainer.classList.add("hidden");
    formContainer.classList.remove("hidden");
  });
  
  // =========================
  // MOSTRAR FORM SENHA
  // =========================
  changePassBtn.addEventListener("click", () => {
    
    form.dataset.type = "password";
    
    form.innerHTML = `
      <input type="password" id="newPass" placeholder="Nova senha" required>
      <input type="password" id="confirmPass" placeholder="Confirmar senha" required>
      <button type="submit" class="btn btn-primary">Atualizar Senha</button>
    `;
    
    optionsContainer.classList.add("hidden");
    formContainer.classList.remove("hidden");
  });
  
  // =========================
  // BOTÃO VOLTAR
  // =========================
  backBtn.addEventListener("click", () => {
    formContainer.classList.add("hidden");
    optionsContainer.classList.remove("hidden");
    form.innerHTML = "";
  });
  
  // =========================
  // SUBMIT
  // =========================
  form.addEventListener("submit", async (e) => {
    
    e.preventDefault();
    const type = form.dataset.type;
    
    // ALTERAR SENHA
    if (type === "password") {
      
      const newPass = document.getElementById("newPass").value;
      const confirmPass = document.getElementById("confirmPass").value;
      
      if (newPass !== confirmPass) {
        alert("As senhas não coincidem.");
        return;
      }
      
      const { error } = await supabaseClient.auth.updateUser({
        password: newPass
      });
      
      if (error) {
        alert("Erro: " + error.message);
        return;
      }
      
      alert("Senha atualizada com sucesso.");
      formContainer.classList.add("hidden");
      optionsContainer.classList.remove("hidden");
      form.innerHTML = "";
    }
    
    // ALTERAR EMAIL
    if (type === "email") {
      
      const newEmail = document.getElementById("newEmail").value;
      
      const { error } = await supabaseClient.auth.updateUser({
        email: newEmail
      });
      
      if (error) {
        alert("Erro: " + error.message);
        return;
      }
      
      alert(
        "E-mail atualizado com sucesso.\n\n" +
        "IMPORTANTE:\n" +
        "Verifique o novo e-mail e clique no link de confirmação enviado pelo sistema.\n\n" +
        "O acesso só será válido após a confirmação."
      );
      
      formContainer.classList.add("hidden");
      optionsContainer.classList.remove("hidden");
      form.innerHTML = "";
    }
    
  });
  
});