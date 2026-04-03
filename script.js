    /* ═══════════════════════════════════════════════════════
   script.js — ASARAX Landing Page
   Chamado pelo index.html via: <script src="script.js"></script>
   (tag no final do <body>, antes de </body>)

   ╔══════════════════════════════════════════════════════╗
   ║  CONFIGURAÇÕES — EDITE AQUI                         ║
   ╚══════════════════════════════════════════════════════╝
════════════════════════════════════════════════════════ */

const CONFIG = {
  /* Número com DDI + DDD + número, SEM espaços ou símbolos */
  whatsappNumero: '5514991081875',

  /*
   * URL do Google Apps Script para salvar leads na planilha.
   * Passo a passo de como criar está no arquivo GOOGLE_SHEETS_SETUP.md
   * Após criar seu script, cole a URL aqui:
   */
  googleScriptURL: 'https://script.google.com/macros/s/AKfycbwU5Gkn-rtmxd7KAa5jpv_5RlVdBK9kKPqRKnYhx5D3vJAN9yYSdZuGT28C55BkbFKBig/exec',

  /* Salvar no Google Sheets? true = sim, false = só abre o WhatsApp */
  salvarNoPlanilha: true,
};


/* ══════════════════════════════════════════════════════
   1. WHATSAPP — Abre em mobile e desktop
══════════════════════════════════════════════════════ */
function abrirWhatsApp(texto) {
  var numero = CONFIG.whatsappNumero;
  var msg    = encodeURIComponent(texto);
  var url    = 'https://wa.me/' + numero + '?text=' + msg;
  var a      = document.createElement('a');
  a.href     = url;
  a.target   = '_blank';
  a.rel      = 'noopener noreferrer';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}


/* ══════════════════════════════════════════════════════
   2. HEADER — Fundo ao rolar
══════════════════════════════════════════════════════ */
const hdr = document.getElementById('hdr');
window.addEventListener('scroll', function () {
  hdr.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });


/* ══════════════════════════════════════════════════════
   3. REVEAL ON SCROLL — Elementos aparecem ao rolar
══════════════════════════════════════════════════════ */
const revealObs = new IntersectionObserver(function (entries) {
  entries.forEach(function (e) {
    if (e.isIntersecting) {
      e.target.classList.add('on');
      revealObs.unobserve(e.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });

document.querySelectorAll('.reveal').forEach(function (el) {
  revealObs.observe(el);
});


/* ══════════════════════════════════════════════════════
   4. CONTADOR ANIMADO — Números na stats bar
══════════════════════════════════════════════════════ */
function animarContador(el, target, suffix, duracao) {
  var inicio = performance.now();
  function tick(agora) {
    var progresso = Math.min((agora - inicio) / duracao, 1);
    var ease      = 1 - Math.pow(1 - progresso, 3); /* easeOutCubic */
    el.textContent = Math.round(ease * target) + suffix;
    if (progresso < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

var statsObs = new IntersectionObserver(function (entries) {
  entries.forEach(function (e) {
    if (e.isIntersecting) {
      e.target.querySelectorAll('[data-target]').forEach(function (el) {
        animarContador(el, +el.dataset.target, el.dataset.suffix, 1800);
      });
      statsObs.unobserve(e.target);
    }
  });
}, { threshold: 0.5 });

var statsBar = document.querySelector('.stats-bar');
if (statsBar) statsObs.observe(statsBar);


/* ══════════════════════════════════════════════════════
   5. SMOOTH SCROLL — Links âncora
══════════════════════════════════════════════════════ */
document.querySelectorAll('a[href^="#"]').forEach(function (a) {
  a.addEventListener('click', function (e) {
    var href = a.getAttribute('href');
    if (href === '#') return; /* evita scroll para o topo em links genéricos */
    var target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});


/* ══════════════════════════════════════════════════════
   6. MÁSCARA DE TELEFONE — (14) 99999-9999
══════════════════════════════════════════════════════ */
var inputTel = document.getElementById('inputTel');
if (inputTel) {
  inputTel.addEventListener('input', function () {
    var v = this.value.replace(/\D/g, '').slice(0, 11);
    if      (v.length > 10) v = v.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3');
    else if (v.length > 6)  v = v.replace(/^(\d{2})(\d{4})(\d{0,4})$/, '($1) $2-$3');
    else if (v.length > 2)  v = v.replace(/^(\d{2})(\d{0,5})$/, '($1) $2');
    else if (v.length > 0)  v = v.replace(/^(\d*)$/, '($1');
    this.value = v;
  });
}


/* ══════════════════════════════════════════════════════
   7. FAQ — Accordion
══════════════════════════════════════════════════════ */
document.querySelectorAll('.faq-q').forEach(function (btn) {
  btn.addEventListener('click', function () {
    var isOpen   = btn.getAttribute('aria-expanded') === 'true';
    var resposta = btn.nextElementSibling; /* .faq-a */

    /* Fecha todos os outros */
    document.querySelectorAll('.faq-q').forEach(function (outro) {
      outro.setAttribute('aria-expanded', 'false');
      outro.nextElementSibling.classList.remove('open');
    });

    /* Abre o clicado (se não estava aberto) */
    if (!isOpen) {
      btn.setAttribute('aria-expanded', 'true');
      resposta.classList.add('open');
    }
  });
});


/* ══════════════════════════════════════════════════════
   8. VALIDAÇÃO DO FORMULÁRIO
══════════════════════════════════════════════════════ */
function definirErro(fieldId, temErro) {
  var field = document.getElementById(fieldId);
  if (!field) return;
  if (temErro) field.classList.add('has-error');
  else          field.classList.remove('has-error');
}

function validarEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

function validarTelefone(tel) {
  return tel.replace(/\D/g, '').length >= 10;
}


/* ══════════════════════════════════════════════════════
   9. SALVAR LEAD NO GOOGLE SHEETS
   → Veja GOOGLE_SHEETS_SETUP.md para configurar
══════════════════════════════════════════════════════ */
function salvarNoPlanilha(nome, email, tel) {
  if (!CONFIG.salvarNoPlanilha) return Promise.resolve({ ok: true });
  if (CONFIG.googleScriptURL === 'COLE_AQUI_A_URL_DO_SEU_GOOGLE_APPS_SCRIPT') {
    console.warn('⚠️ Configure a URL do Google Apps Script em script.js → CONFIG.googleScriptURL');
    return Promise.resolve({ ok: false, msg: 'URL não configurada' });
  }

  var dados = {
    nome:      nome,
    email:     email,
    telefone:  tel,
    pagina:    window.location.href,
    data:      new Date().toLocaleString('pt-BR'),
  };

  return fetch(CONFIG.googleScriptURL, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify(dados),
  })
  .then(function (res) { return res.json(); })
  .catch(function (err) {
    console.error('Erro ao salvar lead:', err);
    return { ok: false };
  });
}


/* ══════════════════════════════════════════════════════
   10. SUBMIT DO FORMULÁRIO — Validação + Planilha + WhatsApp
══════════════════════════════════════════════════════ */
function handleSubmit() {
  var nome  = document.getElementById('inputNome').value.trim();
  var email = document.getElementById('inputEmail').value.trim();
  var tel   = document.getElementById('inputTel').value.trim();

  /* Validação */
  var valido = true;
  if (!nome)               { definirErro('fieldNome',  true); valido = false; } else definirErro('fieldNome',  false);
  if (!validarEmail(email)){ definirErro('fieldEmail', true); valido = false; } else definirErro('fieldEmail', false);
  if (!validarTelefone(tel)){ definirErro('fieldTel', true); valido = false; } else definirErro('fieldTel',  false);

  if (!valido) return;

  /* Loading */
  var btn = document.getElementById('submitBtn');
  btn.classList.add('loading');
  btn.disabled = true;

  /* Mensagem personalizada para o WhatsApp */
  var msgWpp = [
    'Olá! Me chamo ' + nome + ' e vim pelo site da ASARAX. 🚀',
    '',
    'Tenho interesse nos serviços de vocês e gostaria de saber mais sobre como posso escalar meu negócio.',
    '',
    'Meu e-mail: ' + email,
    'Meu WhatsApp: ' + tel,
    '',
    'Aguardo o contato!'
  ].join('\n');

  var wppURL = 'https://wa.me/' + CONFIG.whatsappNumero + '?text=' + encodeURIComponent(msgWpp);

  /* ── Dispara evento Lead no Meta Pixel (se ativo) ── */
  if (typeof fbq === 'function') {
    fbq('track', 'Lead', { content_name: 'diagnostico_gratuito' });
  }

  /* ── Salva no Google Sheets e depois abre WhatsApp ── */
  salvarNoPlanilha(nome, email, tel).finally(function () {

    btn.classList.remove('loading');
    btn.disabled = false;

    /* Exibe estado de sucesso */
    document.querySelector('.form-tag').style.display    = 'none';
    document.querySelector('.form-title').style.display  = 'none';
    document.querySelector('.form-desc').style.display   = 'none';
    document.querySelector('.field-group').style.display = 'none';
    btn.style.display                                    = 'none';
    document.querySelector('.form-note').style.display   = 'none';

    var successEl = document.getElementById('formSuccess');
    document.getElementById('successWppLink').href = wppURL;
    successEl.style.display = 'flex';

    /* Abre o WhatsApp automaticamente */
    abrirWhatsApp(msgWpp);
  });
}


/* ── Enter nos campos dispara o submit ── */
document.querySelectorAll('#formWrap input').forEach(function (inp) {
  inp.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') handleSubmit();
  });
});
