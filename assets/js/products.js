document.addEventListener("DOMContentLoaded", () => {
  showSkeleton()
  loadProducts()
  setupSearch()
})

let allProducts = []
let currentPage = 1
const perPage = 8

async function loadProducts(){

const { data, error } = await supabaseClient
.from("products")
.select(`
  id,
  nome,
  preco,
  ativo,
  destaque,
  categories ( nome ),
  product_images ( url, is_principal )
`)
.order("criado_em",{ascending:false})

if(error){
console.error(error)
return
}

allProducts = data
renderPage()

}

function renderPage(){

const start = (currentPage - 1) * perPage
const end = start + perPage

const products = allProducts.slice(start,end)

renderProducts(products)
renderPagination()

}

function renderProducts(products){

const container =
document.getElementById("productsTable")

container.innerHTML=""

if(products.length === 0){
container.innerHTML="<p>Nenhum produto encontrado</p>"
return
}

products.forEach(product=>{

const principal =
product.product_images?.find(img=>img.is_principal)

const second =
product.product_images?.find(img=>!img.is_principal)

const img1 =
principal ? principal.url :
"https://via.placeholder.com/400"

const img2 =
second ? second.url : img1

const categoria =
product.categories?.nome || "-"

const statusClass =
product.ativo ? "active":"inactive"

const statusText =
product.ativo ? "Ativo":"Inativo"

const destaque =
product.destaque ? `<span class="badge destaque">⭐ Destaque</span>` : ""

const card =
document.createElement("div")

card.className="product-card"

card.innerHTML=`

<div class="product-img-wrap">

<img src="${img1}" class="img-main">
<img src="${img2}" class="img-hover">

${destaque}

</div>

<div class="product-info">

<div class="product-price">
${Number(product.preco).toLocaleString()} Kz
</div>

<div class="badge categoria">
${categoria}
</div>

<div class="status ${statusClass}">
${statusText}
</div>

</div>

<div class="product-actions">

<button class="btn-edit"
onclick="editProduct('${product.id}')">

<i class="fa-solid fa-pen"></i>

</button>

<button class="btn-delete"
onclick="deleteProduct('${product.id}')">

<i class="fa-solid fa-trash"></i>

</button>

</div>
`

container.appendChild(card)

})

}

function renderPagination() {
  
  const oldPagination =
    document.querySelector(".pagination")
  
  if (oldPagination) {
    oldPagination.remove()
  }
  
  const container =
    document.getElementById("productsTable")
  
  const pages =
    Math.ceil(allProducts.length / perPage)
  
  if (pages <= 1) return
  
  const pag =
    document.createElement("div")
  
  pag.className = "pagination"
  
  for (let i = 1; i <= pages; i++) {
    
    const btn =
      document.createElement("button")
    
    btn.textContent = i
    
    if (i === currentPage) {
      btn.classList.add("active")
    }
    
    btn.onclick = () => {
      currentPage = i
      renderPage()
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
    
    pag.appendChild(btn)
    
  }
  
  container.after(pag)
  
}

function setupSearch(){

const input =
document.getElementById("searchProduct")

input.addEventListener("input",function(){

const search =
this.value.toLowerCase()

const filtered =
allProducts.filter(p=>
p.nome.toLowerCase().includes(search)
)

renderProducts(filtered)

})

}

function showSkeleton(){

const container =
document.getElementById("productsTable")

container.innerHTML=""

for(let i=0;i<6;i++){

const sk =
document.createElement("div")

sk.className="product-skeleton"

container.appendChild(sk)

}

}

function editProduct(id){
window.location.href=`edit-product.html?id=${id}`
}

async function deleteProduct(id){

if(!confirm("Eliminar este produto?")) return

await supabaseClient
.from("product_images")
.delete()
.eq("product_id",id)

const { error } = await supabaseClient
.from("products")
.delete()
.eq("id",id)

if(error){
alert("Erro ao eliminar")
return
}

loadProducts()

}

window.editProduct=editProduct
window.deleteProduct=deleteProduct