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