document.addEventListener("DOMContentLoaded", async () => {
  const grid = document.getElementById("productsGrid");
  const searchInput = document.getElementById("searchInput");
  const categoryFilter = document.getElementById("categoryFilter");
  
  if (!grid) return;
  
  const supabase = window.supabaseClient;
  
  let produtos = [];
  
  async function carregarProdutos() {
    const { data, error } = await supabase
      .from("products")
      .select(`
        *,
        categories ( nome )
      `)
      .eq("ativo", true);
    
    if (error) {
      console.error("Erro ao carregar produtos:", error);
      grid.innerHTML = "<p>Erro ao carregar produtos.</p>";
      return;
    }
    
    produtos = data;
    renderProdutos(produtos);
    carregarCategorias();
  }
  
  function renderProdutos(lista) {
    if (!lista.length) {
      grid.innerHTML = "<p>Sem produtos disponíveis.</p>";
      return;
    }
    
    grid.innerHTML = lista.map(produto => {
      const imagem = produto.imagens?.[0] || "assets/img/placeholder.png";
      const precoFinal = produto.preco_promocional || produto.preco;
      
      const mensagem = `Olá, tenho interesse no produto ${produto.nome} por ${precoFinal}€`;
      const linkWhatsapp = `https://wa.me/351TEUNUMEROAQUI?text=${encodeURIComponent(mensagem)}`;
      
      return `
        <div class="product-card">
          <img src="${imagem}" alt="${produto.nome}">
          <h3>${produto.nome}</h3>
          <p>${produto.descricao_curta || ""}</p>
          <strong>${precoFinal}€</strong>
          <a href="${linkWhatsapp}" target="_blank" class="btn-whatsapp">
            Comprar via WhatsApp
          </a>
        </div>
      `;
    }).join("");
  }
  
  function carregarCategorias() {
    if (!categoryFilter) return;
    
    const categorias = [...new Set(produtos.map(p => p.categories?.nome).filter(Boolean))];
    
    categoryFilter.innerHTML = `
      <option value="">Todas</option>
      ${categorias.map(c => `<option value="${c}">${c}</option>`).join("")}
    `;
  }
  
  if (searchInput) {
    searchInput.addEventListener("input", () => {
      const termo = searchInput.value.toLowerCase();
      
      const filtrados = produtos.filter(p =>
        p.nome.toLowerCase().includes(termo)
      );
      
      renderProdutos(filtrados);
    });
  }
  
  if (categoryFilter) {
    categoryFilter.addEventListener("change", () => {
      const categoria = categoryFilter.value;
      
      if (!categoria) {
        renderProdutos(produtos);
        return;
      }
      
      const filtrados = produtos.filter(p =>
        p.categories?.nome === categoria
      );
      
      renderProdutos(filtrados);
    });
  }
  
  carregarProdutos();
});