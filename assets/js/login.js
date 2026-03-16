document.addEventListener("DOMContentLoaded", () => {
  
  const form = document.getElementById("loginForm");
  
  if (!form) return;
  
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    
    try {
      
      const { data, error } = await supabaseClient.auth.signInWithPassword({
        email: email,
        password: password
      });
      
      if (error) {
        alert("Erro no login: " + error.message);
        return;
      }
      
      window.location.href = "dashboard.html";
      
    } catch (err) {
      console.error(err);
      alert("Erro inesperado no login.");
    }
    
  });
  
});

// Recuperar senha

const forgotLink = document.getElementById("forgotPasswordLink");

if (forgotLink) {
  
  forgotLink.addEventListener("click", async (e) => {
    
    e.preventDefault();
    
    const email = document.getElementById("email").value;
    
    if (!email) {
      alert("Digite seu email primeiro.");
      return;
    }
    
    const { error } = await supabaseClient.auth.resetPasswordForEmail(email, {
      
      redirectTo: window.location.origin + "/admin/update-password.html"
      
    });
    
    if (error) {
      alert("Erro ao enviar email: " + error.message);
      return;
    }
    
    alert("Email de recuperação enviado.");
    
  });
  
}