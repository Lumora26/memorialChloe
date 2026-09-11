/**
 * ==========================================================================
 * LÓGICA DO MURAL DE RECADOS (assets/js/modules/mural.js)
 * ==========================================================================
 */

// Importa a conexão com o banco a partir de ../firebase/config.js
import { db } from '../firebase/config.js';
import { 
  collection, 
  addDoc, 
  query, 
  orderBy, 
  onSnapshot, 
  serverTimestamp 
} from "https://www.gstatic.com/firebasejs/12.14.0/firebase-firestore.js";

const form = document.getElementById('mural-firestore-form');
const txtMensagem = document.getElementById('input-mensagem');
const charCount = document.getElementById('char-count');
const fileInput = document.getElementById('input-foto');
const photoLabel = document.getElementById('photo-label');
const feedContainer = document.getElementById('mural-feed');

// 1. Contador de Caracteres (Até 120)
if (txtMensagem && charCount) {
  txtMensagem.addEventListener('input', () => {
    charCount.textContent = txtMensagem.value.length;
  });
}

// 2. Legenda ao selecionar foto
if (fileInput && photoLabel) {
  fileInput.addEventListener('change', (e) => {
    if (e.target.files && e.target.files[0]) {
      photoLabel.textContent = "Foto Anexada ✓";
    }
  });
}

// 3. Converte a foto em Base64
function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

// 4. Salva o Recado no Firestore
if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const btnEnviar = form.querySelector('.btn-enviar-msg');
    if (btnEnviar) {
      btnEnviar.disabled = true;
      btnEnviar.textContent = "ENVIANDO...";
    }

    const nome = document.getElementById('input-nome').value.trim();
    const vinculo = document.getElementById('input-vinculo').value;
    const mensagem = txtMensagem.value.trim();
    let imagemBase64 = "";

    if (fileInput && fileInput.files[0]) {
      const file = fileInput.files[0];
      if (file.size > 800 * 1024) { // Trava de segurança para arquivos > 800KB
        alert("A foto é muito grande! Por favor, escolha uma imagem menor.");
        if (btnEnviar) {
          btnEnviar.disabled = false;
          btnEnviar.textContent = "ENVIAR MENSAGEM →";
        }
        return;
      }
      imagemBase64 = await fileToBase64(file);
    }

    try {
      await addDoc(collection(db, "recados_chloe"), {
        nome: nome,
        vinculo: vinculo,
        mensagem: mensagem,
        imagem: imagemBase64,
        criadoEm: serverTimestamp()
      });

      alert("Sua mensagem foi publicada no Mural da Chloe! 💙");
      form.reset();
      if (charCount) charCount.textContent = "0";
      if (photoLabel) photoLabel.textContent = "Adicionar foto";
    } catch (error) {
      console.error("Erro ao salvar mensagem no Firestore:", error);
      alert("Erro ao enviar: " + error.message);
    } finally {
      if (btnEnviar) {
        btnEnviar.disabled = false;
        btnEnviar.textContent = "ENVIAR MENSAGEM →";
      }
    }
  });
}

// 5. Array de cores para os cards do feed
const cardColors = ['card-blue', 'card-yellow', 'card-purple'];

// 6. Escuta o banco em Tempo Real
if (feedContainer) {
  const q = query(collection(db, "recados_chloe"), orderBy("criadoEm", "desc"));

  onSnapshot(q, (snapshot) => {
    feedContainer.innerHTML = "";

    if (snapshot.empty) {
      feedContainer.innerHTML = `<div class="loading-state">Seja o primeiro a deixar uma mensagem carinhosa para a Chloe! 💙</div>`;
      return;
    }

    let index = 0;
    snapshot.forEach((doc) => {
      const data = doc.data();
      const inicial = data.nome ? data.nome.charAt(0).toUpperCase() : "♡";
      const colorClass = cardColors[index % cardColors.length];
      index++;

      const itemHtml = `
        <article class="recado-card ${colorClass}">
          <div class="recado-header">
            <div class="user-avatar-circle">${inicial}</div>
            <div class="recado-user-details">
              <h3>${data.nome} <span class="badge-vinculo">${data.vinculo || 'Carinho'}</span></h3>
            </div>
            <span class="recado-time">Recente</span>
          </div>
          <p class="recado-text">${data.mensagem}</p>
          ${data.imagem ? `<div class="recado-media"><img src="${data.imagem}" alt="Foto de ${data.nome}" onclick="openLightbox('${data.imagem}')" /></div>` : ''}
        </article>
      `;

      feedContainer.insertAdjacentHTML('beforeend', itemHtml);
    });
  }, (error) => {
    console.error("Erro na leitura do Firestore:", error);
    feedContainer.innerHTML = `<div class="loading-state">Aguardando mensagens... (Certifique-se de configurar as regras de gravação do Firestore)</div>`;
  });
}

// Suporte ao Lightbox
window.openLightbox = function(src) {
  const modal = document.getElementById('lightbox-modal');
  const modalImg = document.getElementById('lightbox-img');
  if (modal && modalImg) {
    modalImg.src = src;
    modal.classList.add('active');
  }
};