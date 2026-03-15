document.addEventListener("DOMContentLoaded", loadCategories)

function slugify(text){

return text
.toLowerCase()
.trim()
.replace(/[^\w\s-]/g,"")
.replace(/\s+/g,"-")

}

async function createCategory(){

const name = document.getElementById("categoryName").value

if(!name){
alert("Digite o nome da categoria")
return
}

const slug = slugify(name)

const { error } = await supabaseClient
.from("categories")
.insert({
nome: name,
slug: slug
})

if(error){
alert("Erro ao criar categoria")
console.error(error)
return
}

document.getElementById("categoryName").value = ""

loadCategories()

}

async function loadCategories(){

const { data, error } = await supabaseClient
.from("categories")
.select("*")
.order("criada_em",{ascending:false})

if(error){
console.error(error)
return
}

const table = document.getElementById("categoriesList")

table.innerHTML = ""

data.forEach(category => {

const tr = document.createElement("tr")

tr.innerHTML = `
<td>${category.nome}</td>
<td>${category.slug}</td>
<td>
<span class="action-btn" onclick="deleteCategory('${category.id}')">
<i class="fa-solid fa-trash"></i>
</span>
</td>
`

table.appendChild(tr)

})

}

async function deleteCategory(id){

const confirmDelete = confirm("Eliminar categoria?")

if(!confirmDelete) return

const { error } = await supabaseClient
.from("categories")
.delete()
.eq("id", id)

if(error){
alert("Erro ao eliminar")
console.error(error)
return
}

loadCategories()

}