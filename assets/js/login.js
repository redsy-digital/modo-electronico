document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("loginForm");
  
  if (!form) return;
  
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    
    const email = document.getElementById("email").value; // Corrigido para 'email'
    const password = document.getElementById("password").value;
    
    const { user, error } = await supabase.auth.signInWithPassword({
      email: email, // Usando o email corretamente
      password: password,
    });
    
    if (error) {
      alert("Erro: " + error.message); // Mensagem de erro caso falhe
      return;
    }
    
    if (user) {
      localStorage.setItem("adminLogado", "true");
      window.location.href = "admin/dashboard.html"; // Redireciona para a área admin
    }
  });
});