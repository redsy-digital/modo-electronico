document.addEventListener("DOMContentLoaded", () => {

  const form = document.getElementById("addProductForm");
  if (!form) return;

  const categoriaSelect = document.getElementById("categoria");

  // ==============================
  // CARREGAR CATEGORIAS DO DASHBOARD
  // ==============================

  const categorias = JSON.parse(localStorage.getItem("categories")) || [];

  if (categorias.length === 0) {
    alert("Nenhuma categoria encontrada. Crie categorias no Dashboard primeiro.");
  } else {
    categorias.forEach(cat => {
      const option = document.createElement("option");
      option.value = cat;
      option.textContent = cat;
      categoriaSelect.appendChild(option);
    });
  }

  // ==============================
  // ELEMENTOS
  // ==============================

  const previewPrincipal = document.getElementById("previewPrincipal");
  const previewGaleria = document.getElementById("previewGaleria");
  const imagemPrincipalInput = document.getElementById("imagemPrincipal");
  const imagensGaleriaInput = document.getElementById("imagensGaleria");

  const modal = document.getElementById("imageModal");
  const confirmRemove = document.getElementById("confirmRemove");
  const cancelRemove = document.getElementById("cancelRemove");

  let imagemPrincipalFile = null;
  let galeriaFiles = [];
  let imagemParaRemover = null;

  function gerarID() {
    return "prod_" + Date.now();
  }

  function converterParaBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  }

  // ==============================
  // PREVIEW PRINCIPAL
  // ==============================

  imagemPrincipalInput.addEventListener("change", () => {
    const file = imagemPrincipalInput.files[0];
    if (!file) return;

    imagemPrincipalFile = file;

    const reader = new FileReader();
    reader.onload = () => {
      previewPrincipal.innerHTML =
        `<img src="${reader.result}" data-type="principal">`;
    };
    reader.readAsDataURL(file);
  });

  // ==============================
  // PREVIEW GALERIA
  // ==============================

  imagensGaleriaInput.addEventListener("change", () => {

    const novos = Array.from(imagensGaleriaInput.files);

    if (galeriaFiles.length + novos.length > 4) {
      alert("Máximo 4 imagens secundárias.");
      imagensGaleriaInput.value = "";
      return;
    }

    novos.forEach(file => {

      galeriaFiles.push(file);

      const reader = new FileReader();
      reader.onload = () => {
        const img = document.createElement("img");
        img.src = reader.result;
        img.dataset.index = galeriaFiles.length - 1;
        previewGaleria.appendChild(img);
      };
      reader.readAsDataURL(file);
    });

    imagensGaleriaInput.value = "";
  });

  // ==============================
  // REMOVER IMAGEM
  // ==============================

  document.addEventListener("click", (e) => {
    if (e.target.tagName === "IMG" &&
        e.target.closest(".image-preview")) {
      imagemParaRemover = e.target;
      modal.classList.remove("hidden");
    }
  });

  confirmRemove.addEventListener("click", () => {

    if (!imagemParaRemover) return;

    if (imagemParaRemover.dataset.type === "principal") {
      imagemPrincipalInput.value = "";
      previewPrincipal.innerHTML = "";
      imagemPrincipalFile = null;
    } else {
      const index = imagemParaRemover.dataset.index;
      galeriaFiles.splice(index, 1);
      imagemParaRemover.remove();
    }

    modal.classList.add("hidden");
    imagemParaRemover = null;
  });

  cancelRemove.addEventListener("click", () => {
    modal.classList.add("hidden");
    imagemParaRemover = null;
  });

  // ==============================
  // SUBMIT
  // ==============================

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (!imagemPrincipalFile) {
      alert("Imagem principal é obrigatória.");
      return;
    }

    if (!categoriaSelect.value) {
      alert("Selecione uma categoria.");
      return;
    }

    const novoProduto = {
      id: gerarID(),
      nome: document.getElementById("nome").value,
      preco: Number(document.getElementById("preco").value),
      precoPromocional:
        document.getElementById("precoPromocional").value || null,
      categoria: categoriaSelect.value,
      descricaoCurta:
        document.getElementById("descricaoCurta").value,
      descricaoLonga:
        document.getElementById("descricaoLonga").value,
      stock: Number(document.getElementById("stock").value),
      destaque:
        document.getElementById("destaque").checked,
      ativo:
        document.getElementById("ativo").checked,
      imagens: {
        principal: await converterParaBase64(imagemPrincipalFile),
        galeria: await Promise.all(
          galeriaFiles.map(f => converterParaBase64(f))
        )
      },
      criadoEm: new Date().toISOString()
    };

    const products =
      JSON.parse(localStorage.getItem("products")) || [];

    products.push(novoProduto);

    localStorage.setItem("products",
      JSON.stringify(products));

    alert("Produto criado com sucesso!");

    window.location.href = "products.html";
  });

});