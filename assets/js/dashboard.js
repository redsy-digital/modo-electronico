document.addEventListener("DOMContentLoaded", () => {
  loadStats();
  setupLogout();
  setupMobileMenu();
});

async function loadStats() {
  // Verificar se os elementos de estatísticas existem (apenas no dashboard)
  if (!document.getElementById("totalProducts")) {
    return; // Sair silenciosamente se não for a página do dashboard
  }
  
  try {
    const [
      totalProducts,
      activeProducts,
      featuredProducts,
      totalCategories
    ] = await Promise.all([
      countProducts(),
      countActiveProducts(),
      countFeaturedProducts(),
      countCategories()
    ]);
    
    document.getElementById("totalProducts").textContent = totalProducts || 0;
    document.getElementById("activeProducts").textContent = activeProducts || 0;
    document.getElementById("featuredProducts").textContent = featuredProducts || 0;
    document.getElementById("totalCategories").textContent = totalCategories || 0;
    
  } catch (error) {
    console.error("Erro ao carregar estatísticas:", error);
  }
}

async function countProducts() {
  const { count, error } = await supabaseClient
    .from("products")
    .select("*", { count: "exact", head: true });
  if (error) throw error;
  return count;
}

async function countActiveProducts() {
  const { count, error } = await supabaseClient
    .from("products")
    .select("*", { count: "exact", head: true })
    .eq("ativo", true);
  if (error) throw error;
  return count;
}

async function countFeaturedProducts() {
  const { count, error } = await supabaseClient
    .from("products")
    .select("*", { count: "exact", head: true })
    .eq("destaque", true);
  if (error) throw error;
  return count;
}

async function countCategories() {
  const { count, error } = await supabaseClient
    .from("categories")
    .select("*", { count: "exact", head: true });
  if (error) throw error;
  return count;
}

function setupLogout(){
  const logoutBtn = document.getElementById("logoutBtn");
  const modal = document.getElementById("logoutModal");
  const cancelBtn = document.getElementById("cancelLogout");
  const confirmBtn = document.getElementById("confirmLogout");
  
  if(!logoutBtn || !modal || !cancelBtn || !confirmBtn) return;
  
  logoutBtn.addEventListener("click", () => {
    modal.classList.remove("hidden");
  });
  
  cancelBtn.addEventListener("click", () => {
    modal.classList.add("hidden");
  });
  
  confirmBtn.addEventListener("click", async () => {
    const { error } = await supabaseClient.auth.signOut();
    if(error){
      console.error(error);
      return;
    }
    window.location.href = "login.html";
  });
}

function setupMobileMenu(){
  const toggle = document.getElementById("menuToggle");
  const sidebar = document.getElementById("adminSidebar");
  const overlay = document.getElementById("overlay");
  
  if(!toggle || !sidebar || !overlay) return;
  
  toggle.addEventListener("click", () => {
    sidebar.classList.toggle("active");
    overlay.classList.toggle("active");
  });
  
  overlay.addEventListener("click", () => {
    sidebar.classList.remove("active");
    overlay.classList.remove("active");
  });
}
