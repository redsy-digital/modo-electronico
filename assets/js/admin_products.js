document.addEventListener("DOMContentLoaded", () => {

  const grid = document.getElementById("productsGrid");
  const searchInput = document.getElementById("searchInput");
  const productCount = document.getElementById("productCount");

  let products = JSON.parse(localStorage.getItem("products")) || [];

  // ===============================
  // RENDER PRODUTOS (ADMIN)
  // ===============================

  function renderProducts(lista) {

    grid.innerHTML = "";

    productCount.textContent = `${lista.length} produtos`;

    if (lista.length === 0) {
      grid.innerHTML = "<p>Nenhum produto cadastrado.</p>";
      return;
    }

    lista.forEach(produto => {

      const card = document.createElement("div");
      card.classList.add("admin-product-card");

      card.innerHTML = `
        <div class="admin-product-info">
          <img src="${
  produto.imagens?.principal ||
  produto.imagem ||
  'https://via.placeholder.com/100'
}" alt="${produto.nome}">
          
          <div>
            <h3>${produto.nome}</h3>
            <p><strong>Categoria:</strong> ${produto.categoria}</p>
            <p><strong>Preço:</strong> ${produto.preco} Kz</p>
            <p>
              <strong>Status:</strong> 
              ${produto.ativo ? "🟢 Ativo" : "🔴 Inativo"}
            </p>
          </div>
        </div>

        <div class="admin-product-actions">
          <button class="btn btn-outline edit-btn" data-id="${produto.id}">
            Editar
          </button>

          <button class="btn btn-primary delete-btn" data-id="${produto.id}">
            Eliminar
          </button>
        </div>
      `;

      grid.appendChild(card);
    });

  }

  renderProducts(products);

  // ===============================
  // PESQUISA
  // ===============================

  searchInput.addEventListener("input", () => {

    const termo = searchInput.value.toLowerCase();

    const filtrados = products.filter(p =>
      p.nome.toLowerCase().includes(termo)
    );

    renderProducts(filtrados);
  });

  // ===============================
  // AÇÕES (EDITAR / ELIMINAR)
  // ===============================

  grid.addEventListener("click", (e) => {

    const id = e.target.dataset.id;
    if (!id) return;

    // EDITAR
    if (e.target.classList.contains("edit-btn")) {
      window.location.href = `edit-product.html?id=${id}`;
    }

    // ELIMINAR
    if (e.target.classList.contains("delete-btn")) {

      const confirmacao = confirm(
        "Quer remover este produto?"
      );

      if (!confirmacao) return;

      products = products.filter(p => p.id !== id);

      localStorage.setItem(
        "products",
        JSON.stringify(products)
      );

      renderProducts(products);
    }

  });

});