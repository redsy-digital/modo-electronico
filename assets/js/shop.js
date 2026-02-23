document.addEventListener("DOMContentLoaded", async () => {
  
  const productsGrid = document.getElementById("productsGrid");
  const categoriesScroll = document.getElementById("categoriesScroll");
  const searchInput = document.getElementById("searchInput");
  const productsLoader = document.getElementById("productsLoader");
  
  let allProducts = [];
  let activeCategory = null;
  
  // ===============================
  // CARREGAR CATEGORIAS
  // ===============================
  async function loadCategories() {
    const { data, error } = await supabaseClient
      .from("categorias")
      .select("*")
      .order("nome", { ascending: true });
    
    if (error) {
      console.error("Erro ao buscar categorias:", error);
      return;
    }
    
    categoriesScroll.innerHTML = "";
    
    const allBtn = document.createElement("button");
    allBtn.textContent = "Todas";
    allBtn.classList.add("category-btn", "active");
    allBtn.onclick = () => {
      activeCategory = null;
      updateCategoryButtons();
      renderProducts();
    };
    categoriesScroll.appendChild(allBtn);
    
    data.forEach(cat => {
      const btn = document.createElement("button");
      btn.textContent = cat.nome;
      btn.classList.add("category-btn");
      btn.onclick = () => {
        activeCategory = cat.id;
        updateCategoryButtons();
        renderProducts();
      };
      categoriesScroll.appendChild(btn);
    });
  }
  
  function updateCategoryButtons() {
    const buttons = document.querySelectorAll(".category-btn");
    buttons.forEach(btn => btn.classList.remove("active"));
    
    if (activeCategory === null) {
      buttons[0]?.classList.add("active");
    } else {
      buttons.forEach((btn, index) => {
        if (index !== 0 && allProducts.length > 0) {
          if (btn.textContent === getCategoryName(activeCategory)) {
            btn.classList.add("active");
          }
        }
      });
    }
  }
  
  function getCategoryName(id) {
    const product = allProducts.find(p => p.categoria_id === id);
    return product ? product.categoria_nome : null;
  }
  
  // ===============================
  // CARREGAR PRODUTOS
  // ===============================
  async function loadProducts() {
    
    if (productsLoader) {
      productsLoader.style.display = "flex";
    }
    
    const { data, error } = await supabaseClient
      .from("produtos")
      .select("*")
      .order("created_at", { ascending: false });
    
    if (error) {
      console.error("Erro ao buscar produtos:", error);
      return;
    }
    
    allProducts = data || [];
    
    renderProducts();
    
    if (productsLoader) {
      productsLoader.style.display = "none";
    }
  }
  
  // ===============================
  // RENDERIZAR PRODUTOS
  // ===============================
  function renderProducts() {
    productsGrid.innerHTML = "";
    
    let filtered = [...allProducts];
    
    if (activeCategory) {
      filtered = filtered.filter(
        product => product.categoria_id === activeCategory
      );
    }
    
    const searchTerm = searchInput.value.toLowerCase();
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.nome.toLowerCase().includes(searchTerm)
      );
    }
    
    if (filtered.length === 0) {
  productsGrid.innerHTML = `
    <div class="empty-state">
      <h3>Sem produtos disponíveis</h3>
      <p>Estamos a preparar novidades incríveis para você.</p>
    </div>
  `;
  return;
}
    
    filtered.forEach(product => {
      const card = document.createElement("div");
      card.classList.add("product-card");
      
      card.innerHTML = `
        <img src="${product.imagem_url}" alt="${product.nome}">
        <h3>${product.nome}</h3>
        <p class="price">${Number(product.preco).toLocaleString()} Kz</p>
        <button class="buy-btn">Comprar</button>
      `;
      
      productsGrid.appendChild(card);
    });
  }
  
  searchInput.addEventListener("input", renderProducts);
  
  await loadCategories();
  await loadProducts();
  
});