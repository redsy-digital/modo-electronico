document.addEventListener("DOMContentLoaded", async () => {

  const path = window.location.pathname;
  const isAdminArea = path.includes("/admin/");
  // Melhorar a deteção da página de login para aceitar /admin/login ou /admin/login.html
  const isLoginPage = path.endsWith("/login") || path.endsWith("/login.html");

  if (!isAdminArea) return;

  // Verificar se o supabaseClient existe
  if (typeof supabaseClient === 'undefined') {
    console.error("Supabase client não encontrado!");
    return;
  }

  const { data: { session } } = await supabaseClient.auth.getSession();

  // 🔒 Se não estiver logado e não estiver na página de login
  if (!session) {
    if (!isLoginPage) {
      console.log("Sessão não encontrada, redirecionando para login...");
      window.location.href = "login.html";
    }
    return;
  }

  // 🔒 Se estiver logado, verificar se é admin
  try {
    const { data: profile, error } = await supabaseClient
      .from("users_profile")
      .select("role")
      .eq("id", session.user.id)
      .single();

    if (error || !profile || profile.role !== "admin") {
      console.warn("Acesso negado: Utilizador não é administrador.");
      // Se não for admin, desloga e manda para a home
      await supabaseClient.auth.signOut();
      window.location.href = "/";
      return;
    }

    // 🔁 Se já for admin e estiver no login, manda para o dashboard
    if (isLoginPage) {
      window.location.href = "dashboard.html";
    }
  } catch (err) {
    console.error("Erro ao verificar perfil de administrador:", err);
  }

});
