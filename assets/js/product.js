document.addEventListener("DOMContentLoaded", async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');

    if (!productId) {
        window.location.href = '/shop.html';
        return;
    }

    await loadProductDetails(productId);
});

async function loadProductDetails(id) {
    try {
        const { data: p, error } = await supabaseClient
            .from("products")
            .select(`
                *,
                categories(nome),
                product_images(*)
            `)
            .eq("id", id)
            .single();

        if (error) throw error;

        // 1. Preencher Textos
        document.title = `${p.nome} | Modo Electrónico`;
        
        const nameEl = document.getElementById("productName");
        const catTagEl = document.getElementById("categoryTag");
        const shortDescEl = document.getElementById("shortDesc");
        const longDescEl = document.getElementById("longDesc");

        if(nameEl) nameEl.textContent = p.nome;
        if(catTagEl) catTagEl.textContent = p.categories?.nome || "Geral";
        if(shortDescEl) shortDescEl.textContent = p.descricao_curta || "";
        if(longDescEl) longDescEl.textContent = p.descricao_longa || "Sem descrição detalhada disponível.";
        
        // 2. Preencher Preços
        const currentPriceEl = document.getElementById("currentPrice");
        const oldPriceEl = document.getElementById("oldPrice");

        if (p.preco_promocional) {
            if(oldPriceEl) {
                oldPriceEl.style.display = "block";
                oldPriceEl.textContent = `${Number(p.preco).toLocaleString()} Kz`;
            }
            if(currentPriceEl) {
                currentPriceEl.textContent = `${Number(p.preco_promocional).toLocaleString()} Kz`;
                currentPriceEl.classList.add("promo-price");
            }
        } else {
            if(oldPriceEl) oldPriceEl.style.display = "none";
            if(currentPriceEl) currentPriceEl.textContent = `${Number(p.preco).toLocaleString()} Kz`;
        }

        // 3. Stock Status
        const stockStatus = document.getElementById("stockStatus");
        const dot = document.querySelector(".dot");
        if (stockStatus) {
            if (p.stock > 0) {
                stockStatus.textContent = `Em Stock (${p.stock} unidades)`;
                if(dot) {
                    dot.style.background = "#4ade80";
                    dot.style.boxShadow = "0 0 10px #4ade80";
                }
            } else {
                stockStatus.textContent = "Esgotado";
                if(dot) {
                    dot.style.background = "#ff4d4d";
                    dot.style.boxShadow = "0 0 10px #ff4d4d";
                }
            }
        }

        // 4. WhatsApp Link
        const whatsappBtn = document.getElementById("whatsappBtn");
        if(whatsappBtn) {
            const msg = encodeURIComponent(`Olá! Tenho interesse no produto: ${p.nome} (ID: ${p.id})`);
            whatsappBtn.href = `https://wa.me/244939593362?text=${msg}`;
        }

        // 5. Galeria de Imagens
        setupGallery(p.product_images);

    } catch (err) {
        console.error("Erro ao carregar produto:", err);
        // Não alertar se for apenas erro de carregamento inicial
    }
}

function setupGallery(images) {
    const mainImg = document.getElementById("mainImage");
    const thumbsGrid = document.getElementById("thumbnailsGrid");
    
    if (!mainImg || !thumbsGrid) return;
    
    if (!images || images.length === 0) {
        mainImg.src = "https://via.placeholder.com/600";
        thumbsGrid.innerHTML = "";
        return;
    }

    // Ordenar imagens (principal primeiro)
    images.sort((a, b) => (b.is_principal - a.is_principal) || (a.ordem - b.ordem));

    // Definir imagem principal inicial
    mainImg.src = images[0].url;

    // Gerar Miniaturas
    thumbsGrid.innerHTML = "";
    images.forEach((img, index) => {
        const thumbDiv = document.createElement("div");
        thumbDiv.className = `thumb-item ${index === 0 ? 'active' : ''}`;
        thumbDiv.innerHTML = `<img src="${img.url}" alt="Thumbnail">`;
        
        thumbDiv.addEventListener("click", () => {
            // Mudar imagem principal com efeito
            mainImg.style.opacity = "0.5";
            setTimeout(() => {
                mainImg.src = img.url;
                mainImg.style.opacity = "1";
            }, 150);

            // Atualizar classe active
            document.querySelectorAll(".thumb-item").forEach(t => t.classList.remove("active"));
            thumbDiv.classList.add("active");
        });

        thumbsGrid.appendChild(thumbDiv);
    });

    // Efeito de Zoom Simples (Hover)
    const zoomContainer = document.getElementById("zoomContainer");
    if(zoomContainer) {
        zoomContainer.addEventListener("mousemove", (e) => {
            const { left, top, width, height } = zoomContainer.getBoundingClientRect();
            const x = ((e.clientX - left) / width) * 100;
            const y = ((e.clientY - top) / height) * 100;
            mainImg.style.transformOrigin = `${x}% ${y}%`;
        });

        zoomContainer.addEventListener("mouseenter", () => {
            mainImg.style.transform = "scale(1.5)";
        });

        zoomContainer.addEventListener("mouseleave", () => {
            mainImg.style.transform = "scale(1)";
        });
    }
}
