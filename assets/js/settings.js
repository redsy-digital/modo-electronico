document.addEventListener("DOMContentLoaded", function() {
  
  // ===============================
  // ACCORDION
  // ===============================
  const headers = document.querySelectorAll(".accordion-header");
  
  headers.forEach(header => {
    header.addEventListener("click", function() {
      
      const content = this.nextElementSibling;
      const arrow = this.querySelector(".arrow");
      
      const isOpen = content.style.maxHeight;
      
      // Fecha todos
      document.querySelectorAll(".accordion-content").forEach(c => {
        c.style.maxHeight = null;
      });
      
      document.querySelectorAll(".arrow").forEach(a => {
        a.style.transform = "rotate(0deg)";
      });
      
      // Abre o clicado
      if (!isOpen) {
        content.style.maxHeight = content.scrollHeight + "px";
        arrow.style.transform = "rotate(90deg)";
      }
    });
  });
  
  // ===============================
  // REDES SOCIAIS
  // ===============================
  const addBtn = document.getElementById("addSocialBtn");
  const socialForm = document.getElementById("socialForm");
  const saveBtn = document.getElementById("saveSocialBtn");
  const socialList = document.getElementById("socialList");
  
  // Mostrar / esconder formulário
  if (addBtn && socialForm) {
    addBtn.addEventListener("click", function() {
      socialForm.classList.toggle("hidden");
      
      // Atualiza altura do accordion para que o formulário apareça
      const parentContent = addBtn.closest(".accordion-content");
      if (parentContent) {
        parentContent.style.maxHeight = parentContent.scrollHeight + "px";
      }
    });
  }
  
  // Salvar rede social
  if (saveBtn && socialList) {
    saveBtn.addEventListener("click", function() {
      
      const nameInput = document.getElementById("socialName");
      const linkInput = document.getElementById("socialLink");
      
      const name = nameInput.value.trim();
      const link = linkInput.value.trim();
      
      if (!name || !link) {
        alert("Preencha todos os campos.");
        return;
      }
      
      const li = document.createElement("li");
      li.classList.add("social-item");
      li.innerHTML = `
        <span><strong>${name}</strong></span>
        <button class="btn btn-outline btn-small">Eliminar</button>
      `;
      
      // Botão eliminar
      li.querySelector("button").addEventListener("click", function() {
        li.remove();
        
        // Atualiza altura do accordion após remover
        const parentContent = socialList.closest(".accordion-content");
        if (parentContent) {
          parentContent.style.maxHeight = parentContent.scrollHeight + "px";
        }
      });
      
      socialList.appendChild(li);
      
      // Limpa inputs
      nameInput.value = "";
      linkInput.value = "";
      socialForm.classList.add("hidden");
      
      // Atualiza altura do accordion
      const parentContent = socialList.closest(".accordion-content");
      if (parentContent) {
        parentContent.style.maxHeight = parentContent.scrollHeight + "px";
      }
      
    });
  }
  
});