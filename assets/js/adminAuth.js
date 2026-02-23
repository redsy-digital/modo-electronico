document.addEventListener("DOMContentLoaded", async () => {
  
  const path = window.location.pathname;
  const isAdminArea = path.includes("/admin/");
  const isLoginPage = path.includes("login.html");
  
  if (!isAdminArea) return;
  
  const { data: { session }, error } = await supabaseClient.auth.getSession();
  
  if (!session && !isLoginPage) {
    window.location.href = "login.html";
  }
  
  if (session && isLoginPage) {
    window.location.href = "dashboard.html";
  }
  
});