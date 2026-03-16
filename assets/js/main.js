document.addEventListener("DOMContentLoaded", () => {
    setupMenu();
    loadFeaturedProducts();
});

function setupMenu() {
    const toggle = document.getElementById("menuToggle");
    const sidebar = document.getElementById("sidebar");
    
    if (toggle && sidebar) {
        toggle.addEventListener("click", (e) => {
            e.stopPropagation();
            sidebar.classList.toggle("active");
        });

        // Fechar sidebar ao clicar fora
        document.addEventListener("click", (e) => {
            if (sidebar.classList.contains("active") && !sidebar.contains(e.target) && e.target !== toggle) {
                sidebar.classList.remove("active");
            }
        });
    }
}

async function loadFeaturedProducts() {
    const container = document.getElementById("featuredProductsHome");
    if (!container) return;

    // Mostrar skeleton
    container.innerHTML = "";
    for (let i = 0; i < 3; i++) {
        const div = document.createElement("div");
        div.className = "product-card skeleton-card";
        div.style.minHeight = "350px";
        container.appendChild(div);
    }

    try {
        const { data, error } = await supabaseClient
            .from("products")
            .select(`
                id,
                nome,
                preco,
                preco_promocional,
                descricao_curta,
                destaque,
                product_images(url,is_principal)
            `)
            .eq("ativo", true)
            .eq("destaque", true);

        if (error) throw error;

        container.innerHTML = "";

        if (data.length === 0) {
            container.innerHTML = "<p>Nenhum produto em destaque no momento.</p>";
            return;
        }

        data.forEach(p => {
            const img = p.product_images?.find(i => i.is_principal);
            const imgUrl = img ? img.url : "https://via.placeholder.com/400";
            
            const card = document.createElement("div");
            card.className = "product-card";
            
            card.innerHTML = `
                <img src="${imgUrl}" alt="${p.nome}">
                <div class="product-info">
                    <div class="product-title">${p.nome}</div>
                    <div class="product-desc">${p.descricao_curta || ""}</div>
                    <div class="product-price-container">
                        ${p.preco_promocional ? `
                            <span class="old-price">${Number(p.preco).toLocaleString()} Kz</span>
                            <span class="product-price promo-price">${Number(p.preco_promocional).toLocaleString()} Kz</span>
                        ` : `
                            <span class="product-price">${Number(p.preco).toLocaleString()} Kz</span>
                        `}
                    </div>
                </div>
                <div class="product-actions">
                    <button class="btn-whatsapp" onclick="whatsappProduct('${p.nome}')">
                        WhatsApp
                    </button>
                    <button class="btn-details" onclick="productDetails('${p.id}')">
                        Detalhes
                    </button>
                </div>
            `;
            container.appendChild(card);
        });
    } catch (err) {
        console.error("Erro ao carregar produtos:", err);
        container.innerHTML = "<p>Erro ao carregar produtos.</p>";
    }
}

function whatsappProduct(name) {
    const msg = `Olá, tenho interesse no produto: ${name}`;
    window.open(`https://wa.me/244939593362?text=${encodeURIComponent(msg)}`);
}

function productDetails(id) {
    window.location.href = `product.html?id=${id}`;
}
