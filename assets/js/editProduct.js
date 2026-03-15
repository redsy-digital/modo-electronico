// IMPORTANTE: Este ficheiro requer o cliente Supabase configurado no ficheiro supabase.js
// Certifique-se de que o script supabase.js e a biblioteca do Supabase estão incluídos no HTML antes deste script.

document.addEventListener("DOMContentLoaded", async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get('id');

  if (!productId) {
    alert("Produto não encontrado.");
    window.location.href = "products.html";
    return;
  }

  const form = document.getElementById("editProductForm");
  const previewPrincipal = document.getElementById("previewPrincipal");
  const previewGaleria = document.getElementById("previewGaleria");
  const imagemPrincipalInput = document.getElementById("imagemPrincipal");
  const imagensGaleriaInput = document.getElementById("imagensGaleria");
  const deleteBtn = document.getElementById("deleteProduct");
  const categoriaSelect = document.getElementById("categoria");

  let currentProduct = null;
  let currentImages = [];
  let newPrincipalFile = null;
  let newGaleriaFiles = [];

  // 1. Carregar Categorias (Se o campo for um select)
  async function loadCategories() {
    try {
      const { data, error } = await supabaseClient
        .from("categories")
        .select("*")
        .order("nome", { ascending: true });

      if (error) throw error;
      
      // Se o elemento for um select, preenchemos
      if (categoriaSelect && categoriaSelect.tagName === "SELECT") {
        categoriaSelect.innerHTML = `<option value="">Selecionar categoria</option>`;
        data.forEach(cat => {
          const option = document.createElement("option");
          option.value = cat.id;
          option.textContent = cat.nome;
          categoriaSelect.appendChild(option);
        });
      }
    } catch (err) {
      console.error("Erro ao carregar categorias:", err);
    }
  }

  // 2. Carregar Dados do Produto
  async function loadProductData() {
    try {
      const { data, error } = await supabaseClient
        .from("products")
        .select(`
          *,
          product_images (*)
        `)
        .eq("id", productId)
        .single();

      if (error) throw error;
      currentProduct = data;
      currentImages = data.product_images || [];

      // Preencher campos
      document.getElementById("nome").value = data.nome;
      document.getElementById("preco").value = data.preco;
      document.getElementById("precoPromocional").value = data.preco_promocional || "";
      
      // Lidar com categoria (seja input text ou select)
      if (categoriaSelect) {
        categoriaSelect.value = data.categoria_id || "";
      }
      
      document.getElementById("descricaoCurta").value = data.descricao_curta || "";
      document.getElementById("descricaoLonga").value = data.descricao_longa || "";
      document.getElementById("stock").value = data.stock || 0;
      document.getElementById("destaque").checked = data.destaque || false;
      document.getElementById("ativo").checked = data.ativo || false;

      // Preencher imagens
      const principalImage = currentImages.find(img => img.is_principal);
      if (principalImage) {
        previewPrincipal.innerHTML = `<img src="${principalImage.url}" alt="Principal">`;
      }

      const galeriaImages = currentImages.filter(img => !img.is_principal);
      previewGaleria.innerHTML = "";
      galeriaImages.forEach((img) => {
        const imageElement = document.createElement("img");
        imageElement.src = img.url;
        previewGaleria.appendChild(imageElement);
      });
    } catch (err) {
      console.error("Erro ao carregar produto:", err);
      alert("Erro ao carregar dados do produto.");
    }
  }

  await loadCategories();
  await loadProductData();

  // 3. Previews de novas imagens
  imagemPrincipalInput.addEventListener("change", () => {
    const file = imagemPrincipalInput.files[0];
    if (file) {
      newPrincipalFile = file;
      const reader = new FileReader();
      reader.onload = (e) => {
        previewPrincipal.innerHTML = `<img src="${e.target.result}" alt="Nova Principal">`;
      };
      reader.readAsDataURL(file);
    }
  });

  imagensGaleriaInput.addEventListener("change", () => {
    const files = Array.from(imagensGaleriaInput.files);
    newGaleriaFiles = files;
    previewGaleria.innerHTML = "";
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = document.createElement("img");
        img.src = e.target.result;
        previewGaleria.appendChild(img);
      };
      reader.readAsDataURL(file);
    });
  });

  // 4. Upload de Imagem
  async function uploadImage(file, folder) {
    const fileName = Date.now() + "_" + file.name.replace(/\s/g, "");
    const path = `${folder}/${fileName}`;
    const { error } = await supabaseClient.storage.from("product-images").upload(path, file);
    if (error) throw error;
    const { data } = supabaseClient.storage.from("product-images").getPublicUrl(path);
    return data.publicUrl;
  }

  // 5. Submit Edição
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = "A atualizar...";

    try {
      // Atualizar dados básicos do produto
      const { error: updateError } = await supabaseClient
        .from("products")
        .update({
          nome: document.getElementById("nome").value,
          preco: Number(document.getElementById("preco").value),
          preco_promocional: document.getElementById("precoPromocional").value ? Number(document.getElementById("precoPromocional").value) : null,
          categoria_id: document.getElementById("categoria").value,
          descricao_curta: document.getElementById("descricaoCurta").value,
          descricao_longa: document.getElementById("descricaoLonga").value,
          stock: Number(document.getElementById("stock").value),
          destaque: document.getElementById("destaque").checked,
          ativo: document.getElementById("ativo").checked,
          atualizado_em: new Date().toISOString()
        })
        .eq("id", productId);

      if (updateError) throw updateError;

      // Se houver nova imagem principal
      if (newPrincipalFile) {
        const principalUrl = await uploadImage(newPrincipalFile, "principal");
        
        // Remover a principal antiga
        await supabaseClient.from("product_images").delete().eq("product_id", productId).eq("is_principal", true);
        
        // Inserir a nova principal
        await supabaseClient.from("product_images").insert({
          product_id: productId,
          url: principalUrl,
          is_principal: true,
          ordem: 0
        });
      }

      // Se houver novas imagens de galeria (substitui todas as secundárias atuais)
      if (newGaleriaFiles.length > 0) {
        // Remover secundárias antigas
        await supabaseClient.from("product_images").delete().eq("product_id", productId).eq("is_principal", false);
        
        // Inserir novas secundárias
        for (let i = 0; i < newGaleriaFiles.length; i++) {
          const url = await uploadImage(newGaleriaFiles[i], "galeria");
          await supabaseClient.from("product_images").insert({
            product_id: productId,
            url: url,
            is_principal: false,
            ordem: i + 1
          });
        }
      }

      alert("Produto atualizado com sucesso!");
      window.location.href = "products.html";
    } catch (err) {
      console.error("Erro ao atualizar:", err);
      alert("Erro ao atualizar produto: " + err.message);
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = "💾 Atualizar Produto";
    }
  });

  // 6. Eliminar Produto
  deleteBtn.addEventListener("click", async () => {
    if (!confirm("Tem a certeza que deseja eliminar este produto?")) return;
    try {
      // Eliminar imagens primeiro
      await supabaseClient.from("product_images").delete().eq("product_id", productId);
      // Eliminar produto
      const { error } = await supabaseClient.from("products").delete().eq("id", productId);
      if (error) throw error;
      
      alert("Produto eliminado.");
      window.location.href = "products.html";
    } catch (err) {
      alert("Erro ao eliminar: " + err.message);
    }
  });
});
