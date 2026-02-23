document.addEventListener("DOMContentLoaded", function () {

  const addBtn = document.getElementById("addCategoryBtn");
  const form = document.getElementById("categoryForm");
  const saveBtn = document.getElementById("saveCategoryBtn");
  const categoryList = document.getElementById("categoryList");
  const countEl = document.getElementById("activeProductsCount");

  // ===============================
  // PRODUTOS ATIVOS (mock)
  // ===============================
  const products = JSON.parse(localStorage.getItem("products")) || [];
  countEl.textContent = products.length;

  // ===============================
  // CARREGAR CATEGORIAS
  // ===============================
  let categories = JSON.parse(localStorage.getItem("categories")) || [];

  function renderCategories() {
    categoryList.innerHTML = "";

    categories.forEach((cat, index) => {

      const li = document.createElement("li");
      li.innerHTML = `
        <span>${cat}</span>
        <button data-index="${index}" class="btn btn-outline btn-small">Eliminar</button>
      `;

      li.querySelector("button").addEventListener("click", function () {
        categories.splice(index, 1);
        localStorage.setItem("categories", JSON.stringify(categories));
        renderCategories();
      });

      categoryList.appendChild(li);
    });

  }

  renderCategories();

  // ===============================
  // MOSTRAR FORM
  // ===============================
  addBtn.addEventListener("click", function () {
    form.classList.toggle("hidden");
  });

  // ===============================
  // GUARDAR CATEGORIA
  // ===============================
  saveBtn.addEventListener("click", function () {

    const input = document.getElementById("categoryName");
    const name = input.value.trim();

    if (!name) return;

    categories.push(name);
    localStorage.setItem("categories", JSON.stringify(categories));

    input.value = "";
    form.classList.add("hidden");

    renderCategories();
  });

});