document.addEventListener("DOMContentLoaded", function () {

  const mainImage = document.getElementById("mainImage");
  const thumbs = document.querySelectorAll(".thumb");

  thumbs.forEach(thumb => {
    thumb.addEventListener("click", function () {

      document.querySelectorAll(".thumb").forEach(t => {
        t.classList.remove("active");
      });

      this.classList.add("active");
      mainImage.src = this.src;
    });
  });

});