document.addEventListener("DOMContentLoaded", async () => {

  const path = window.location.pathname;
  const isAdminArea = path.includes("/admin/");
  const isLoginPage = path.includes("login.html");

  if (!isAdminArea) return;

  const { data: { session } } = await supabaseClient.auth.getSession();

  // 🔒 Se não estiver logado
  if (!session && !isLoginPage) {
    window.location.href = "login.html";
    return;
  }

  // 🔒 Se estiver logado, verificar se é admin
  if (session) {

    const { data: profile, error } = await supabaseClient
      .from("users_profile")
      .select("role")
      .eq("id", session.user.id)
      .single();

    if (!profile || profile.role !== "admin") {
      window.location.href = "/";
      return;
    }

    // 🔁 Se já for admin e estiver no login
    if (isLoginPage) {
      window.location.href = "dashboard.html";
      return;
    }

  }

});