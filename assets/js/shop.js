document.addEventListener("DOMContentLoaded", () => {
        
        loadProducts()
        setupMenu()
        setupSearch()
        
})

let allProducts = []

async function loadProducts() {
        
        showSkeleton()
        showSkeletonFeatured()
        
        const { data, error } = await supabaseClient
                .from("products")
                .select(`
id,
nome,
preco,
descricao_curta,
descricao_longa,
categoria_id,
destaque,
product_images(url,is_principal)
`)
                .eq("ativo", true)
        
        if (error) {
                console.error(error)
                return
        }
        
        allProducts = data
        
        renderCategories()
        renderProducts(data)
        renderFeatured(data)
        
}

function renderCategories() {
        
        const container = document.getElementById("categoryFilters")
        
        if (!container) return
        
        const categories = [...new Set(allProducts.map(p => p.categoria_id))]
        
        container.innerHTML = `<button class="active" data-cat="all">Todos</button>`
        
        categories.forEach(cat => {
                
                container.innerHTML += `
<button data-cat="${cat}">
Categoria ${cat}
</button>
`
                
        })
        
        container.querySelectorAll("button").forEach(btn => {
                
                btn.addEventListener("click", () => {
                        
                        container.querySelectorAll("button").forEach(b => b.classList.remove("active"))
                        
                        btn.classList.add("active")
                        
                        const cat = btn.dataset.cat
                        
                        if (cat === "all") {
                                renderProducts(allProducts)
                                return
                        }
                        
                        const filtered = allProducts.filter(p => p.categoria_id == cat)
                        
                        renderProducts(filtered)
                        
                })
                
        })
        
}

function renderProducts(products) {
        
        const grid = document.getElementById("productsGrid")
        
        grid.innerHTML = ""
        
        products.forEach(p => {
                
                const img = p.product_images?.find(i => i.is_principal)
                
                const imgUrl = img ? img.url : "https://via.placeholder.com/400"
                
                const card = document.createElement("div")
                
                card.className = "product-card"
                
                card.innerHTML = `

<img src="${imgUrl}">

<div class="product-info">

<div class="product-title">${p.nome}</div>

<div class="product-desc">${p.descricao_curta||""}</div>

<div class="product-price">${Number(p.preco).toLocaleString()} Kz</div>

</div>

<div class="product-actions">

<button class="btn-whatsapp"
onclick="whatsappProduct('${p.nome}')">
WhatsApp
</button>

<button class="btn-details"
onclick="productDetails('${p.id}')">
Detalhes
</button>

</div>
`
                
                grid.appendChild(card)
                
        })
        
}

function renderFeatured(products) {
        
        const container = document.getElementById("featuredProducts")
        
        container.innerHTML = ""
        
        const featured = products.filter(p => p.destaque)
        
        featured.forEach(p => {
                
                const img = p.product_images?.find(i => i.is_principal)
                
                const imgUrl = img ? img.url : "https://via.placeholder.com/400"
                
                const card = document.createElement("div")
                
                card.className = "product-card"
                
                card.style.minWidth = "260px"
                card.style.cursor = "pointer"
                
                card.onclick = () => {
                        productDetails(p.id)
                }
                
                card.innerHTML = `

<img src="${imgUrl}">

<div class="product-info">

<div class="product-title">${p.nome}</div>

<div class="product-desc">${p.descricao_curta||""}</div>

<div class="product-price">${Number(p.preco).toLocaleString()} Kz</div>

</div>
`
                
                container.appendChild(card)
                
        })
        
}

function setupMenu() {
        
        const toggle = document.getElementById("menuToggle")
        const menu = document.getElementById("mobileMenu")
        
        toggle.addEventListener("click", () => {
                menu.classList.toggle("active")
        })
        
}

function setupSearch() {
        
        const inputDesktop = document.getElementById("searchInput")
        const inputMobile = document.getElementById("searchInputMobile")
        
        function performSearch() {
                
                const text = (
                        inputDesktop?.value ||
                        inputMobile?.value ||
                        ""
                ).toLowerCase()
                
                const filtered = allProducts.filter(p =>
                        
                        (p.nome || "").toLowerCase().includes(text) ||
                        
                        (p.descricao_curta || "").toLowerCase().includes(text) ||
                        
                        (p.descricao_longa || "").toLowerCase().includes(text) ||
                        
                        String(p.preco).includes(text)
                        
                )
                
                renderProducts(filtered)
                
                const featuredSection = document.querySelector(".featured-section")
                
                if (text.length > 0) {
                        
                        featuredSection.style.display = "none"
                        
                } else {
                        
                        featuredSection.style.display = "block"
                        
                }
                
        }
        
        if (inputDesktop) {
                inputDesktop.addEventListener("input", performSearch)
        }
        
        if (inputMobile) {
                inputMobile.addEventListener("input", performSearch)
        }
        
}

function whatsappProduct(name) {
        
        const msg = `Olá, tenho interesse no produto: ${name}`
        
        window.open(`https://wa.me/244000000000?text=${encodeURIComponent(msg)}`)
        
}

function productDetails(id) {
        
        window.location.href = `product.html?id=${id}`
        
}

function showSkeleton() {
        
        const grid = document.getElementById("productsGrid")
        
        grid.innerHTML = ""
        
        for (let i = 0; i < 6; i++) {
                
                const div = document.createElement("div")
                
                div.className = "product-card skeleton-card"
                
                div.style.height = "300px"
                
                grid.appendChild(div)
                
        }
        
}

function showSkeletonFeatured() {
        
        const container = document.getElementById("featuredProducts")
        
        container.innerHTML = ""
        
        for (let i = 0; i < 3; i++) {
                
                const div = document.createElement("div")
                
                div.className = "product-card skeleton-card"
                
                div.style.minWidth = "260px"
                div.style.height = "260px"
                
                container.appendChild(div)
                
        }
        
}