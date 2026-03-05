document.addEventListener("DOMContentLoaded", () => {
  
  loadStats();
  setupLogout();
  setupMobileMenu();
  
});

/* ===========================
SUPABASE STATS
=========================== */

async function loadStats() {
  
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
    
    document.getElementById("totalProducts").textContent = totalProducts;
    document.getElementById("activeProducts").textContent = activeProducts;
    document.getElementById("featuredProducts").textContent = featuredProducts;
    document.getElementById("totalCategories").textContent = totalCategories;
    
  } catch (error) {
    
    console.error("Erro ao carregar estatísticas:", error);
    
  }
  
}

/* ===========================
SUPABASE QUERIES
=========================== */

async function countProducts() {
  
  const { count, error } = await supabase
    .from("products")
    .select("*", { count: "exact", head: true });
  
  if (error) throw error;
  
  return count;
  
}

async function countActiveProducts() {
  
  const { count, error } = await supabase
    .from("products")
    .select("*", { count: "exact", head: true })
    .eq("ativo", true);
  
  if (error) throw error;
  
  return count;
  
}

async function countFeaturedProducts() {
  
  const { count, error } = await supabase
    .from("products")
    .select("*", { count: "exact", head: true })
    .eq("destaque", true);
  
  if (error) throw error;
  
  return count;
  
}

async function countCategories() {
  
  const { count, error } = await supabase
    .from("categories")
    .select("*", { count: "exact", head: true });
  
  if (error) throw error;
  
  return count;
  
}

/* ===========================
LOGOUT
=========================== */

function setupLogout() {
  
  const btn = document.getElementById("logoutBtn");
  
  btn.addEventListener("click", async () => {
    
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      console.error(error);
      return;
    }
    
    window.location.href = "/admin/login.html";
    
  });
  
}

/* ===========================
MOBILE MENU
=========================== */

function setupMobileMenu(){

const toggle = document.getElementById("menuToggle");
const sidebar = document.getElementById("adminSidebar");
const overlay = document.getElementById("overlay");

if(!toggle || !sidebar || !overlay) return;

toggle.addEventListener("click", function(){

sidebar.classList.toggle("active");
overlay.classList.toggle("active");

});

overlay.addEventListener("click", function(){

sidebar.classList.remove("active");
overlay.classList.remove("active");

});

}