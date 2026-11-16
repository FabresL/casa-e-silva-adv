(() => {
  'use strict';
  const cfg = window.CONFIG || {};
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const ENDERECO = 'Avenida Assis Brasil, 4500, sala 510, Porto Alegre - RS, Brasil';

  /* Menu mobile */
  const botaoMenu = $('#botao-menu'), menu = $('#menu-principal');
  const alternarMenu = (abrir) => {
    botaoMenu.setAttribute('aria-expanded', abrir);
    botaoMenu.setAttribute('aria-label', abrir ? 'Fechar menu' : 'Abrir menu');
    menu.classList.toggle('menu--aberto', abrir);
  };
  botaoMenu.addEventListener('click', () => alternarMenu(botaoMenu.getAttribute('aria-expanded') !== 'true'));
  $$('a', menu).forEach((a) => a.addEventListener('click', () => alternarMenu(false)));

  /* WhatsApp com mensagem inicial */
  const msg = encodeURIComponent('Olá! Gostaria de falar com um advogado da Casa & Silva Advocacia.');
  $$('[data-whatsapp]').forEach((a) => (a.href = `https://wa.me/555192249570?text=${msg}`));

  /* Dúvidas (accordion) */
  const perguntas = [
    ['Quando devo procurar um advogado?', 'Sempre que houver dúvida sobre direitos ou obrigações, ou antes de assinar contratos e tomar decisões com efeitos jurídicos. Buscar orientação cedo costuma ajudar a conhecer as alternativas disponíveis.'],
    ['Como funciona uma consulta jurídica?', 'Você apresenta sua situação, o advogado ouve e analisa as informações e, a partir disso, orienta sobre os possíveis caminhos e próximos passos.'],
    ['Quais documentos devo apresentar para uma avaliação?', 'Em geral, documento de identificação e os papéis relacionados ao caso, como contratos, comunicações, comprovantes e eventuais documentos de processos em andamento. A lista exata depende de cada situação.'],
    ['Como funciona um processo trabalhista?', 'É uma ação na Justiça do Trabalho, em que se discutem direitos decorrentes da relação de trabalho. O andamento e o prazo variam conforme as particularidades de cada caso.'],
    ['Em quais situações posso procurar um advogado de família?', 'Em questões como divórcio, guarda, convivência, pensão alimentícia, partilha de bens, inventário e outras demandas que envolvam relações familiares.'],
    ['Como posso obter orientação sobre uma questão civil?', 'Entre em contato descrevendo brevemente sua necessidade. Contratos, obrigações e responsabilidades civis são analisados caso a caso, com base nos documentos e fatos envolvidos.'],
  ];
  const acordeao = $('#acordeao');
  perguntas.forEach(([p, r], i) => {
    const item = document.createElement('div');
    item.className = 'acordeao__item';
    item.innerHTML = `<h3><button type="button" id="pergunta-${i}" aria-expanded="false" aria-controls="resposta-${i}">${p}<span class="acordeao__sinal" aria-hidden="true"></span></button></h3>
      <div id="resposta-${i}" role="region" aria-labelledby="pergunta-${i}" class="acordeao__painel"><p>${r}</p></div>`;
    acordeao.appendChild(item);
  });
  acordeao.addEventListener('click', (e) => {
    const b = e.target.closest('button');
    if (!b) return;
    const abrir = b.getAttribute('aria-expanded') !== 'true';
    $$('.acordeao__item', acordeao).forEach((it) => {
      it.classList.remove('acordeao__item--aberto');
      $('button', it).setAttribute('aria-expanded', 'false');
    });
    if (abrir) { b.setAttribute('aria-expanded', 'true'); b.closest('.acordeao__item').classList.add('acordeao__item--aberto'); }
  });

  /* Modal de privacidade */
  const modal = $('#modal'); let origemFoco = null;
  const abrirModal = () => { origemFoco = document.activeElement; modal.hidden = false; document.body.style.overflow = 'hidden'; $('#fechar-modal').focus(); };
  const fecharModal = () => { modal.hidden = true; document.body.style.overflow = ''; origemFoco && origemFoco.focus(); };
  $$('[data-privacidade]').forEach((b) => b.addEventListener('click', abrirModal));
  $('#fechar-modal').addEventListener('click', fecharModal);
  modal.addEventListener('mousedown', (e) => e.target === modal && fecharModal());
  document.addEventListener('keydown', (e) => e.key === 'Escape' && (!modal.hidden ? fecharModal() : alternarMenu(false)));

  /* Formulário */
  const form = $('#formulario'), retorno = $('#retorno'), botaoEnviar = $('#botao-enviar');
  const abertoEm = Date.now(); let enviando = false;
  const mascara = (v) => {
    const d = v.replace(/\D/g, '').slice(0, 11);
    if (d.length <= 2) return d;
    if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
    if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
    return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
  };
  $('#campo-telefone').addEventListener('input', (e) => (e.target.value = mascara(e.target.value)));

  const validar = (v) => {
    const e = {};
    if (!/\S+\s+\S+/.test(v.nome.trim()) || v.nome.trim().length < 3) e.nome = 'Informe seu nome completo.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.email.trim())) e.email = 'Informe um e-mail válido, como nome@exemplo.com.';
    const d = v.telefone.replace(/\D/g, '');
    const n = d.startsWith('55') && d.length > 11 ? d.slice(2) : d;
    if (n.length < 10 || n.length > 11) e.telefone = 'Informe o telefone com DDD, por exemplo (51) 99999-9999.';
    if (v.pedido.trim().length < 10) e.pedido = 'Descreva brevemente sua necessidade (mínimo de 10 caracteres).';
    if (!v.aceite) e.aceite = 'É necessário confirmar a ciência sobre o tratamento dos dados.';
    return e;
  };
  const mostrarErros = (e) => {
    ['nome', 'email', 'telefone', 'pedido', 'aceite'].forEach((c) => {
      const p = $(`#erro-${c}`), campo = $(`#campo-${c}`);
      p.hidden = !e[c]; p.textContent = e[c] || '';
      campo.setAttribute('aria-invalid', !!e[c]);
      e[c] ? campo.setAttribute('aria-describedby', `erro-${c}`) : campo.removeAttribute('aria-describedby');
    });
  };
  const aviso = (tipo, html) => (retorno.innerHTML = `<p class="mensagem mensagem--${tipo}">${html}</p>`);
  const alternativas = 'Se preferir, fale conosco pelo <a data-wa href="https://wa.me/555192249570" target="_blank" rel="noopener noreferrer">WhatsApp</a> ou por leocasaadv@gmail.com.';

  form.addEventListener('submit', async (ev) => {
    ev.preventDefault();
    if (enviando) return; // evita duplicidade
    const v = { nome: $('#campo-nome').value, email: $('#campo-email').value, telefone: $('#campo-telefone').value, pedido: $('#campo-pedido').value, aceite: $('#campo-aceite').checked };
    const erros = validar(v); mostrarErros(erros); retorno.innerHTML = '';
    const primeiro = Object.keys(erros)[0];
    if (primeiro) return $(`#campo-${primeiro}`).focus();

    const ultimo = Number(sessionStorage.getItem('ultimoEnvio') || 0);
    if ($('#campo-site').value || Date.now() - abertoEm < 3000 || Date.now() - ultimo < 60000)
      return aviso('erro', `Não foi possível enviar agora. Aguarde um minuto e tente novamente. ${alternativas}`);

    const em = cfg.emailjs || {};
    if (!em.servico || !em.modelo || !em.chavePublica || !window.emailjs)
      return aviso('erro', `O envio por este formulário não está disponível no momento. ${alternativas}`);

    enviando = true; botaoEnviar.disabled = true; botaoEnviar.textContent = 'Enviando…';
    const dataHora = new Date().toLocaleString('pt-BR', { dateStyle: 'full', timeStyle: 'medium', timeZone: 'America/Sao_Paulo' });
    const corpo = ['NOVO CONTATO RECEBIDO PELO SITE', '', `Nome: ${v.nome}`, `E-mail: ${v.email}`, `Telefone: ${v.telefone}`, '',
      'ASSUNTO / DESCRIÇÃO DO PEDIDO:', '', v.pedido, '', `Data e horário do envio: ${dataHora} (horário de Brasília)`].join('\n');
    try {
      const r = await emailjs.send(em.servico, em.modelo,
        { assunto: 'Novo contato pelo site — Casa & Silva Advocacia', corpo_email: corpo, email_visitante: v.email, nome: v.nome, telefone: v.telefone, pedido: v.pedido, data_hora: dataHora },
        { publicKey: em.chavePublica });
      if (r.status !== 200) throw new Error('falha');
      sessionStorage.setItem('ultimoEnvio', String(Date.now()));
      form.reset(); aviso('sucesso', 'Mensagem enviada. Retornaremos o contato em breve.');
    } catch {
      aviso('erro', `Não foi possível enviar sua mensagem. ${alternativas}`);
    } finally {
      enviando = false; botaoEnviar.disabled = false; botaoEnviar.textContent = 'Enviar mensagem';
    }
  });

  /* Mapa */
  const alvo = $('#mapa'), q = encodeURIComponent(ENDERECO);
  const usarIframe = () => (alvo.innerHTML = `<iframe title="Mapa com a localização da Casa & Silva Advocacia" src="https://www.google.com/maps?q=${q}&output=embed" loading="lazy" referrerpolicy="no-referrer-when-downgrade" allowfullscreen></iframe>`);
  if (!cfg.googleMapsKey) usarIframe();
  else {
    window.__iniciarMapa = () => {
      new google.maps.Geocoder().geocode({ address: ENDERECO }).then(({ results }) => {
        if (!results[0]) throw new Error('sem resultado');
        const pos = results[0].geometry.location;
        alvo.innerHTML = '<div class="mapa__api" role="img" aria-label="Mapa com a localização da Casa & Silva Advocacia"></div>';
        const mapa = new google.maps.Map(alvo.firstChild, { center: pos, zoom: 16, mapTypeControl: false, streetViewControl: false });
        new google.maps.Marker({ map: mapa, position: pos, title: 'Casa & Silva Advocacia' });
      }).catch(usarIframe);
    };
    const s = document.createElement('script');
    s.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(cfg.googleMapsKey)}&callback=__iniciarMapa`;
    s.async = true; s.onerror = usarIframe; document.head.appendChild(s);
  }
})();
