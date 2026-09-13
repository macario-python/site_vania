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

  carregarPublicacoes();
});

// =====================================================
// PUBLICAÇÕES (busca direto do Supabase — a Dra Vânia publica pelo CATFlow)
// =====================================================
var SUPABASE_URL = 'https://szkknvtqptdeffknnllx.supabase.co';
var SUPABASE_ANON_KEY = 'sb_publishable_nw_LqaqXO9gcF8ybA3vrVg_qtYfATdE';
var SUPABASE_ANON_JWT = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN6a2tudnRxcHRkZWZma25ubGx4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgzMDIwMTMsImV4cCI6MjEwMzg3ODAxM30.FU0QyNl6Jf_AI3xMRY94rzgEjS5sr5U91UWYfOvNmjQ'; // JWT necessário no header Authorization (a chave sb_publishable_... não é JWT)
var TENANT_ID = 'dc511d4f-bae3-4539-a6e3-d47c7822c7bf';

function urlImagemPublicacao(caminho) {
  return SUPABASE_URL + '/storage/v1/object/public/publicacoes/' + caminho;
}

var IMAGEM_PADRAO_PUBLICACAO = 'img/balanca.jpg'; // usada quando a publicação não tem foto própria

async function carregarPublicacoes() {
  var listaDiv = document.getElementById('publicacoes-lista');
  if (!listaDiv) return;
  try {
    var resp = await fetch(
      SUPABASE_URL + '/rest/v1/publicacoes?tenant_id=eq.' + TENANT_ID + '&publicado=eq.true&order=criado_em.desc&limit=9',
      { headers: { apikey: SUPABASE_ANON_KEY, Authorization: 'Bearer ' + SUPABASE_ANON_JWT } }
    );
    var dados = await resp.json();
    if (!resp.ok) throw new Error(dados.message || 'Erro ao buscar publicações');

    if (!dados || !dados.length) {
      listaDiv.innerHTML = '<p class="publicacoes-vazio">Nenhuma publicação no momento. Volte em breve!</p>';
      return;
    }

    listaDiv.innerHTML = dados.map(function (p, i) {
      var urlImg = p.imagem_path ? urlImagemPublicacao(p.imagem_path) : IMAGEM_PADRAO_PUBLICACAO;
      var imgHtml = '<div class="publicacao-card-img" style="background-image:url(\'' + urlImg + '\')"></div>';
      return '<div class="publicacao-card" data-indice="' + i + '">'
        + imgHtml
        + '<div class="publicacao-card-corpo">'
          + '<span class="publicacao-badge">' + escaparHtmlPub(p.badge) + '</span>'
          + '<h3>' + escaparHtmlPub(p.titulo) + '</h3>'
          + '<span class="publicacao-saiba-mais">→ Saiba mais</span>'
        + '</div>'
      + '</div>';
    }).join('');

    listaDiv.querySelectorAll('.publicacao-card').forEach(function (card) {
      card.addEventListener('click', function () {
        abrirModalPublicacao(dados[parseInt(card.dataset.indice, 10)]);
      });
    });
  } catch (err) {
    listaDiv.innerHTML = '<p class="publicacoes-vazio">Não foi possível carregar as publicações agora.</p>';
  }
}

function escaparHtmlPub(texto) {
  var div = document.createElement('div');
  div.textContent = texto || '';
  return div.innerHTML;
}

function abrirModalPublicacao(p) {
  var modal = document.getElementById('modalPublicacao');
  document.getElementById('modalPublicacaoBadge').textContent = p.badge;
  document.getElementById('modalPublicacaoTitulo').textContent = p.titulo;
  document.getElementById('modalPublicacaoTexto').textContent = p.conteudo;
  var imgWrap = document.getElementById('modalPublicacaoImagemWrap');
  var urlImgModal = p.imagem_path ? urlImagemPublicacao(p.imagem_path) : IMAGEM_PADRAO_PUBLICACAO;
  imgWrap.innerHTML = '<img src="' + urlImgModal + '" alt="">';
  modal.classList.add('aberto');
  document.body.style.overflow = 'hidden';
}

function fecharModalPublicacao() {
  document.getElementById('modalPublicacao').classList.remove('aberto');
  document.body.style.overflow = '';
}

document.getElementById('modalPublicacaoFechar')?.addEventListener('click', fecharModalPublicacao);
document.getElementById('modalPublicacaoFundo')?.addEventListener('click', fecharModalPublicacao);
document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape') fecharModalPublicacao();
});
