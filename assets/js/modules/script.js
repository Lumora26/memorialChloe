document.addEventListener("DOMContentLoaded", function () {
  const btnUnlock = document.getElementById("btnUnlock");

  // Ação ao clicar no botão de Acessar Memorial
  if (btnUnlock) {
    btnUnlock.addEventListener("click", function (e) {
      // Efeito de clique simples
      this.style.transform = "scale(0.95)";
      setTimeout(() => {
        this.style.transform = "scale(1)";
      }, 150);
    });
  }
});