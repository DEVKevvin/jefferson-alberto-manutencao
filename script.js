document.addEventListener('DOMContentLoaded', () => {
  const WHATSAPP = '5511986388824';

  // Ano automático no rodapé
  const ano = document.getElementById('ano');
  if (ano) ano.textContent = new Date().getFullYear();

  // Menu no celular
  const burger = document.querySelector('.burger');
  const menu = document.getElementById('menu');
  if (burger && menu) {
    const fechar = () => { menu.classList.remove('open'); burger.setAttribute('aria-expanded', 'false'); };
    burger.addEventListener('click', () => {
      const aberto = menu.classList.toggle('open');
      burger.setAttribute('aria-expanded', String(aberto));
    });
    menu.querySelectorAll('a').forEach(a => a.addEventListener('click', fechar));
  }

  // Destaca no menu a seção que está na tela
  const links = [...document.querySelectorAll('#menu a[href^="#"]')];
  const porId = new Map(links.map(a => [a.getAttribute('href').slice(1), a]));
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(entradas => {
      entradas.forEach(e => {
        if (!e.isIntersecting) return;
        links.forEach(l => { l.classList.remove('ativo'); l.removeAttribute('aria-current'); });
        const l = porId.get(e.target.id);
        if (l && !l.classList.contains('cta')) { l.classList.add('ativo'); l.setAttribute('aria-current', 'true'); }
      });
    }, { rootMargin: '-40% 0px -55% 0px' });
    porId.forEach((_, id) => { const s = document.getElementById(id); if (s) io.observe(s); });

    // Aparece suavemente ao rolar
    const rv = new IntersectionObserver(es => es.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('in'); rv.unobserve(e.target); }
    }), { threshold: 0.12 });
    document.querySelectorAll('.rv').forEach(el => rv.observe(el));
  } else {
    document.querySelectorAll('.rv').forEach(el => el.classList.add('in'));
  }

  // Pedido de orçamento: monta a mensagem e abre o WhatsApp
  const form = document.getElementById('orcamento');
  if (form) {
    const aviso = form.querySelector('.form-msg');
    form.addEventListener('submit', e => {
      e.preventDefault();
      const nome = form.elements.nome.value.trim();
      const servico = form.elements.servico.value;
      const detalhes = form.elements.mensagem.value.trim();
      if (!nome) {
        aviso.textContent = 'Informe seu nome para continuar.';
        form.elements.nome.focus();
        return;
      }
      let texto = `Olá! Meu nome é ${nome}. Gostaria de um orçamento: ${servico}.`;
      if (detalhes) texto += ` ${detalhes}`;
      const url = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(texto)}`;
      aviso.textContent = 'Abrindo o WhatsApp...';
      const aba = window.open(url, '_blank', 'noopener');
      if (!aba) window.location.href = url;
    });
  }

  // Ampliar fotos ao clicar
  const caixa = document.getElementById('lightbox');
  if (caixa && typeof caixa.showModal === 'function') {
    const grande = caixa.querySelector('img');
    const abrir = img => { grande.src = img.currentSrc || img.src; grande.alt = img.alt; caixa.showModal(); };
    document.querySelectorAll('[data-zoom]').forEach(img => {
      img.tabIndex = 0;
      img.addEventListener('click', () => abrir(img));
      img.addEventListener('keydown', e => { if (e.key === 'Enter') abrir(img); });
    });
    caixa.addEventListener('click', e => {
      if (e.target === caixa || e.target.tagName === 'BUTTON') caixa.close();
    });
  }
});
