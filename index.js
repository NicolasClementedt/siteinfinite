// ─── CONFIGURAÇÃO ───
const WHATSAPP_NUMBER = '5511959423403'; // Substituir pelo número real (com DDI+DDD, sem espaços ou símbolos)


// ─── SCROLL REVEAL ───
const revealEls = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, i * 80);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

revealEls.forEach(el => revealObserver.observe(el));


// ─── NAV SHRINK ON SCROLL ───
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
  if (window.scrollY > 60) {
    navbar.style.padding = '0.9rem 4rem';
  } else {
    navbar.style.padding = '1.4rem 4rem';
  }
});


// ─── FORM SUBMIT → WHATSAPP ───
function handleSubmit(e) {
  e.preventDefault();

  const nome        = document.getElementById('nome').value.trim();
  const telefone    = document.getElementById('telefone').value.trim();
  const email       = document.getElementById('email').value.trim();
  const procedimento = document.getElementById('procedimento').value;
  const preferencia = document.getElementById('preferencia').value.trim();

  // Monta mensagem formatada
  const linhas = [
    '👋 Olá! Gostaria de solicitar um agendamento:',
    '',
    `👤 *Nome:* ${nome}`,
    `📱 *Telefone:* ${telefone}`,
    email ? `📧 *E-mail:* ${email}` : null,
    `🦷 *Procedimento:* ${procedimento}`,
    preferencia ? `📅 *Preferência / Observações:* ${preferencia}` : null,
    '',
    '_Mensagem enviada pelo site._',
  ].filter(l => l !== null);

  const mensagem = linhas.join('\n');
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(mensagem)}`;

  // Exibe tela de confirmação
  mostrarConfirmacao({ nome, telefone, email, procedimento, preferencia });

  // Abre WhatsApp em nova aba após pequeno delay (deixa a tela aparecer primeiro)
  setTimeout(() => window.open(url, '_blank'), 600);
}


// ─── TELA DE CONFIRMAÇÃO ───
function mostrarConfirmacao(dados) {
  // Remove confirmação anterior se houver
  const anterior = document.getElementById('confirmacao-overlay');
  if (anterior) anterior.remove();

  const overlay = document.createElement('div');
  overlay.id = 'confirmacao-overlay';
  overlay.innerHTML = `
    <div class="confirmacao-card" id="confirmacao-card">

      <div class="confirmacao-icon">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
          <polyline points="22 4 12 14.01 9 11.01"/>
        </svg>
      </div>

      <p class="confirmacao-eyebrow">Solicitação enviada</p>
      <h2 class="confirmacao-titulo">Quase lá, ${dados.nome.split(' ')[0]}!</h2>
      <p class="confirmacao-subtitulo">
        O WhatsApp foi aberto com sua mensagem pronta.<br>
        Basta enviar para confirmar seu agendamento.
      </p>

      <div class="confirmacao-resumo">
        <div class="resumo-linha">
          <span class="resumo-label">Procedimento</span>
          <span class="resumo-valor">${dados.procedimento}</span>
        </div>
        <div class="resumo-linha">
          <span class="resumo-label">Contato</span>
          <span class="resumo-valor">${dados.telefone}</span>
        </div>
        ${dados.preferencia ? `
        <div class="resumo-linha">
          <span class="resumo-label">Observações</span>
          <span class="resumo-valor">${dados.preferencia}</span>
        </div>` : ''}
      </div>

      <div class="confirmacao-aviso">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
        </svg>
        Entraremos em contato em breve para confirmar o horário disponível.
      </div>

      <div class="confirmacao-acoes">
        <button class="confirmacao-btn-wpp" onclick="reabrirWhatsApp()">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
            <path d="M12 0C5.373 0 0 5.373 0 12c0 2.125.553 4.12 1.524 5.856L0 24l6.335-1.498A11.955 11.955 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 0 1-5.004-1.371l-.36-.214-3.762.889.948-3.667-.233-.374A9.818 9.818 0 1 1 12 21.818z"/>
          </svg>
          Abrir WhatsApp novamente
        </button>
        <button class="confirmacao-btn-voltar" onclick="fecharConfirmacao()">
          Voltar ao site
        </button>
      </div>

    </div>
  `;

  document.body.appendChild(overlay);

  // Anima entrada
  requestAnimationFrame(() => {
    overlay.classList.add('confirmacao-visivel');
  });
}

function reabrirWhatsApp() {
  const nome        = document.getElementById('nome').value.trim();
  const telefone    = document.getElementById('telefone').value.trim();
  const email       = document.getElementById('email').value.trim();
  const procedimento = document.getElementById('procedimento').value;
  const preferencia = document.getElementById('preferencia').value.trim();

  const linhas = [
    '👋 Olá! Gostaria de solicitar um agendamento:',
    '',
    `👤 *Nome:* ${nome}`,
    `📱 *Telefone:* ${telefone}`,
    email ? `📧 *E-mail:* ${email}` : null,
    `🦷 *Procedimento:* ${procedimento}`,
    preferencia ? `📅 *Preferência / Observações:* ${preferencia}` : null,
    '',
    '_Mensagem enviada pelo site._',
  ].filter(l => l !== null);

  const mensagem = linhas.join('\n');
  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(mensagem)}`, '_blank');
}

function fecharConfirmacao() {
  const overlay = document.getElementById('confirmacao-overlay');
  if (!overlay) return;
  overlay.classList.remove('confirmacao-visivel');
  setTimeout(() => overlay.remove(), 400);
}


// ─── ACTIVE NAV LINK HIGHLIGHT ───
const sections = document.querySelectorAll('section[id]');

window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;

  sections.forEach(section => {
    const sectionTop    = section.offsetTop - 120;
    const sectionHeight = section.offsetHeight;
    const id   = section.getAttribute('id');
    const link = document.querySelector(`.nav-links a[href="#${id}"]`);

    if (link) {
      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        document.querySelectorAll('.nav-links a').forEach(a => a.style.color = '');
        link.style.color = 'var(--gold-light)';
      }
    }
  });
});