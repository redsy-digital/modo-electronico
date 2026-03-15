// ==========================================
// ELEMENTOS
// ==========================================

const form = document.getElementById("addProductForm");
const categoriaSelect = document.getElementById("categoria");

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

// ==========================================
// UTILITÁRIOS
// ==========================================

function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')           // Substitui espaços por -
    .replace(/[^\w\-]+/g, '')       // Remove caracteres não alfanuméricos
    .replace(/\-\-+/g, '-')         // Substitui múltiplos - por um único -
    .replace(/^-+/, '')             // Remove - do início
    .replace(/-+$/, '');            // Remove - do fim
}

// ==========================================
// CARREGAR CATEGORIAS
// ==========================================

async function loadCategories() {
  try {
    const { data, error } = await supabaseClient
      .from("categories")
      .select("*")
      .order("nome", { ascending: true });

    if (error) {
      console.error("Erro ao carregar categorias:", error);
      return;
    }

    categoriaSelect.innerHTML = `<option value="">Selecionar categoria</option>`;

    data.forEach(cat => {
      const option = document.createElement("option");
      option.value = cat.id;
      option.textContent = cat.nome;
      categoriaSelect.appendChild(option);
    });
  } catch (err) {
    console.error("Erro inesperado ao carregar categorias:", err);
  }
}

// Chamar ao carregar a página
document.addEventListener("DOMContentLoaded", loadCategories);

// ==========================================
// PREVIEW DE IMAGENS
// ==========================================

imagemPrincipalInput.addEventListener("change", () => {
  const file = imagemPrincipalInput.files[0];
  if (!file) return;

  imagemPrincipalFile = file;

  const reader = new FileReader();
  reader.onload = () => {
    previewPrincipal.innerHTML = `<img src="${reader.result}" data-type="principal">`;
  };
  reader.readAsDataURL(file);
});

imagensGaleriaInput.addEventListener("change", () => {
  const novos = Array.from(imagensGaleriaInput.files);

  if (galeriaFiles.length + novos.length > 4) {
    alert("Máximo 4 imagens secundárias.");
    imagensGaleriaInput.value = "";
    return;
  }

  novos.forEach(file => {
    const reader = new FileReader();
    reader.onload = () => {
      const index = galeriaFiles.length;
      galeriaFiles.push(file);
      
      const img = document.createElement("img");
      img.src = reader.result;
      img.dataset.index = index;
      previewGaleria.appendChild(img);
    };
    reader.readAsDataURL(file);
  });

  imagensGaleriaInput.value = "";
});

// REMOVER IMAGEM DO PREVIEW
document.addEventListener("click", (e) => {
  if (e.target.tagName === "IMG" && e.target.closest(".image-preview")) {
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
    const index = parseInt(imagemParaRemover.dataset.index);
    galeriaFiles.splice(index, 1);
    imagemParaRemover.remove();
    
    // Re-indexar imagens restantes na galeria
    const galeriaImgs = previewGaleria.querySelectorAll("img");
    galeriaImgs.forEach((img, i) => {
      img.dataset.index = i;
    });
  }

  modal.classList.add("hidden");
  imagemParaRemover = null;
});

cancelRemove.addEventListener("click", () => {
  modal.classList.add("hidden");
  imagemParaRemover = null;
});

// ==========================================
// UPLOAD DE IMAGEM PARA SUPABASE STORAGE
// ==========================================

async function uploadImage(file, folder) {
  // Limpar nome do ficheiro para evitar problemas com caracteres especiais
  const fileExt = file.name.split('.').pop();
  const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
  const path = `${folder}/${fileName}`;

  console.log(`A tentar upload de: ${path}, Tipo: ${file.type}, Tamanho: ${file.size} bytes`);

  const { data: uploadData, error } = await supabaseClient
    .storage
    .from("product-images")
    .upload(path, file, {
      cacheControl: '3600',
      upsert: true,
      contentType: file.type || 'image/jpeg' // Forçar o tipo MIME
    });

  if (error) {
    console.error("Erro detalhado do Supabase Storage:", error);
    // Mostrar alerta detalhado para o utilizador ajudar no diagnóstico
    let msg = "Erro no upload da imagem.";
    if (error.status === 400) msg += "\n(Erro 400: Verifique se o ficheiro é uma imagem válida e não é demasiado grande)";
    if (error.message) msg += "\nDetalhe: " + error.message;
    alert(msg);
    throw error;
  }

  const { data } = supabaseClient
    .storage
    .from("product-images")
    .getPublicUrl(path);

  console.log("Upload concluído com sucesso. URL:", data.publicUrl);
  return data.publicUrl;
}

// ==========================================
// SUBMIT DO FORMULÁRIO
// ==========================================

form.addEventListener("submit", async function(e) {
  e.preventDefault();

  const submitBtn = form.querySelector('button[type="submit"]');
  const originalBtnText = submitBtn.textContent;
  
  try {
    if (!imagemPrincipalFile) {
      alert("Selecione a imagem principal");
      return;
    }

    if (!categoriaSelect.value) {
      alert("Selecione uma categoria");
      return;
    }

    // Desativar botão para evitar cliques duplos
    submitBtn.disabled = true;
    submitBtn.textContent = "A guardar...";

    // 1. Upload Imagem Principal
    const imagemPrincipalUrl = await uploadImage(imagemPrincipalFile, "principal");

    // 2. Upload Galeria
    const galeriaUrls = [];
    for (const file of galeriaFiles) {
      const url = await uploadImage(file, "galeria");
      galeriaUrls.push(url);
    }

    // 3. Recolher Dados
    const nome = document.getElementById("nome").value;
    const preco = Number(document.getElementById("preco").value);
    const precoPromocional = document.getElementById("precoPromocional").value ? Number(document.getElementById("precoPromocional").value) : null;
    const categoriaId = categoriaSelect.value;
    const descricaoCurta = document.getElementById("descricaoCurta").value;
    const descricaoLonga = document.getElementById("descricaoLonga").value;
    const stock = Number(document.getElementById("stock").value);
    const destaque = document.getElementById("destaque").checked;
    const ativo = document.getElementById("ativo").checked;
    const slug = slugify(nome) + "-" + Date.now().toString().slice(-4);

    // 4. Inserir Produto na tabela 'products'
    const { data: productData, error: productError } = await supabaseClient
      .from("products")
      .insert({
        nome: nome,
        slug: slug,
        preco: preco,
        preco_promocional: precoPromocional,
        categoria_id: categoriaId,
        descricao_curta: descricaoCurta,
        descricao_longa: descricaoLonga,
        stock: stock,
        destaque: destaque,
        ativo: ativo
      })
      .select()
      .single();

    if (productError) {
      console.error("Erro ao criar produto na base de dados:", productError);
      alert("Erro ao criar produto: " + productError.message);
      return;
    }

    const productId = productData.id;

    // 5. Inserir Imagens na tabela 'product_images'
    const imagesToInsert = [
      {
        product_id: productId,
        url: imagemPrincipalUrl,
        is_principal: true,
        ordem: 0
      }
    ];

    galeriaUrls.forEach((url, index) => {
      imagesToInsert.push({
        product_id: productId,
        url: url,
        is_principal: false,
        ordem: index + 1
      });
    });

    const { error: imagesError } = await supabaseClient
      .from("product_images")
      .insert(imagesToInsert);

    if (imagesError) {
      console.error("Erro ao guardar imagens na base de dados:", imagesError);
      alert("Produto criado, mas houve um erro ao guardar as referências das imagens.");
    }

    alert("Produto criado com sucesso!");
    form.reset();
    window.location.href = "products.html";

  } catch (err) {
    console.error("Erro inesperado durante o processo:", err);
    // O erro já foi alertado na função de upload se foi lá que ocorreu
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = originalBtnText;
  }
});
