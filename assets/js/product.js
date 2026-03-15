document.addEventListener("DOMContentLoaded", async function () {
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get('id');

  if (!productId) {
    console.error("ID do produto não fornecido.");
    return;
  }

  const mainImage = document.getElementById("mainImage");
  const productName = document.getElementById("productName");
  const productPrice = document.querySelector(".price");
  const productDescription = document.querySelector(".description");
  const thumbsContainer = document.querySelector(".thumbs");

  try {
    const { data, error } = await supabaseClient
      .from("products")
      .select(`
        *,
        categories (nome),
        product_images (*)
      `)
      .eq("id", productId)
      .single();

    if (error) throw error;

    // Preencher informações básicas
    productName.textContent = data.nome;
    productPrice.textContent = Number(data.preco).toLocaleString() + " Kz";
    productDescription.textContent = data.descricao_longa || data.descricao_curta || "Sem descrição disponível.";

    // Lidar com imagens
    const images = data.product_images || [];
    const principalImage = images.find(img => img.is_principal) || images[0];

    if (principalImage) {
      mainImage.src = principalImage.url;
    }

    // Gerar miniaturas
    if (images.length > 0) {
      thumbsContainer.innerHTML = "";
      images.sort((a, b) => a.ordem - b.ordem).forEach((img, index) => {
        const thumb = document.createElement("img");
        thumb.src = img.url;
        thumb.classList.add("thumb");
        if (img.is_principal) thumb.classList.add("active");
        
        thumb.addEventListener("click", function () {
          document.querySelectorAll(".thumb").forEach(t => t.classList.remove("active"));
          this.classList.add("active");
          mainImage.src = this.src;
        });
        
        thumbsContainer.appendChild(thumb);
      });
    }

  } catch (err) {
    console.error("Erro ao carregar detalhes do produto:", err);
  }
});
