document.addEventListener('DOMContentLoaded', function () {
  var toggle = document.getElementById('navToggle');
  var nav = document.getElementById('mainNav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      nav.classList.toggle('open');
    });
    nav.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () { nav.classList.remove('open'); });
    });
  }

  var form = document.getElementById('contactForm');
  var sucesso = document.getElementById('formSuccess');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var nome = document.getElementById('nome').value.trim();
      var telefone = document.getElementById('telefone').value.trim();
      var email = document.getElementById('email').value.trim();
      var areaSelect = document.getElementById('area');
      var area = areaSelect.options[areaSelect.selectedIndex].text;
      var mensagem = document.getElementById('mensagem').value.trim();

      var texto = 'Olá! Meu nome é ' + nome +
        '.\nÁrea de interesse: ' + area +
        (telefone ? '\nTelefone: ' + telefone : '') +
        '\nE-mail: ' + email +
        '\nMensagem: ' + mensagem;

      var numeroWhatsapp = '5511925462929';
      var link = 'https://wa.me/' + numeroWhatsapp + '?text=' + encodeURIComponent(texto);

      if (sucesso) sucesso.classList.add('show');
      setTimeout(function () { window.open(link, '_blank'); }, 600);
    });
  }
});
