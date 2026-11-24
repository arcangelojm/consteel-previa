/* Consteel Construção · main.js
   Só o que precisa de JavaScript: menu mobile, mega menu no toque/teclado, campos UTM do formulário.
   Todo o conteúdo é visível sem JavaScript. */
(function () {
  'use strict';

  // Menu mobile
  var toggle = document.querySelector('.menu-toggle');
  var nav = document.getElementById('nav-principal');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var aberto = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', aberto ? 'true' : 'false');
    });
  }

  // Mega menu: botão abre/fecha (toque e teclado); Esc fecha
  var botoes = document.querySelectorAll('.mega-toggle');
  function fecharTodos(excecao) {
    botoes.forEach(function (b) {
      if (b === excecao) return;
      b.setAttribute('aria-expanded', 'false');
      b.parentElement.classList.remove('open');
    });
  }
  botoes.forEach(function (b) {
    b.addEventListener('click', function () {
      var li = b.parentElement;
      var aberto = !li.classList.contains('open');
      fecharTodos(b);
      li.classList.toggle('open', aberto);
      b.setAttribute('aria-expanded', aberto ? 'true' : 'false');
    });
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      fecharTodos(null);
      if (nav && nav.classList.contains('open')) {
        nav.classList.remove('open');
        if (toggle) { toggle.setAttribute('aria-expanded', 'false'); toggle.focus(); }
      }
    }
  });

  // Formulários: origem e UTMs nos campos ocultos (nunca dados pessoais na URL)
  var params = new URLSearchParams(window.location.search);
  document.querySelectorAll('form.form').forEach(function (form) {
    ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'].forEach(function (k) {
      var campo = form.querySelector('input[name="' + k + '"]');
      if (campo && params.get(k)) campo.value = params.get(k);
    });
    var inicio = form.querySelector('input[name="t0"]');
    if (inicio) inicio.value = String(Date.now());
    form.addEventListener('submit', function () {
      var nome = form.querySelector('input[name="nome"]');
      var servico = form.querySelector('input[name="servico"]');
      try {
        sessionStorage.setItem('lead_nome', nome ? nome.value.split(' ')[0] : '');
        sessionStorage.setItem('lead_servico', servico ? servico.value : '');
      } catch (err) { /* sessionStorage indisponível */ }
      var botao = form.querySelector('button[type="submit"]');
      if (botao) { botao.disabled = true; botao.dataset.texto = botao.textContent; botao.textContent = 'Enviando seus dados…'; }
    });
  });

  // Página de obrigado: personalização com sessionStorage
  var alvo = document.querySelector('[data-obrigado-nome]');
  if (alvo) {
    try {
      var n = sessionStorage.getItem('lead_nome');
      if (n) alvo.textContent = n;
    } catch (err) { /* nada */ }
  }
})();
