// Dados da empresa. Tudo que estiver null simplesmente não aparece no site
// (nada de "[preencher]" no ar). Quando o time mandar o dado, é só trocar aqui.

export const empresa = {
  nome: 'Grupo 2!H',
  nomeCurto: '2!H',
  descricao:
    'A 2!H organiza a estrutura que faz o marketing da sua empresa parar de ser tentativa e começar a virar crescimento previsível: oferta, público, comunicação, aquisição, atendimento, comercial, rastreamento e dados, tudo conectado.',
  slogan: 'Estrutura, planejamento e ação.',

  email: 'contato@grupo2h.com.br',
  whatsapp: '5515997509239',
  whatsappExibicao: '(15) 99750-9239',
  whatsappMensagem: 'Olá! Vim pelo site do Grupo 2!H e quero entender como vocês podem ajudar a minha empresa.',

  // A preencher pelo time (ver LISTA-PARA-O-TIME.md):
  cnpj: null,            // ex.: '00.000.000/0001-00'
  razaoSocial: null,
  endereco: null,        // { rua, cidade, uf, cep } se for divulgar
  fundacao: null,        // ano, ex.: 2021
  instagram: null,       // ex.: 'https://www.instagram.com/grupo2h'
  linkedin: null,
  youtube: null,

  // Fundador e time. Só aparece na página Sobre quando tiver nome + papel.
  // foto: caminho dentro de site/static/img/time/ (ex.: 'time/jhonathan.webp')
  // Nomes e cargos puxados do Slack da 2!H (05/10/2026). Frases propostas:
  // cada pessoa precisa aprovar a sua antes de o site ir para produção.
  time: [
    { nome: 'Jhonathan Marcos', papel: 'CEO', foto: 'time/jhonathan.webp', frase: 'Empresa que cresce sem estrutura só aumenta o tamanho do problema. Primeiro o mapa, depois a estrada.' },
    { nome: 'Douglas Kashima', papel: 'CTO / COO', foto: 'time/douglas.webp', frase: 'Processo bem feito é o que transforma esforço em resultado que se repete.' },
    { nome: 'Stephany Silva', papel: 'Head de Tráfego Pago', foto: 'time/stephany.webp', frase: 'Anúncio bom é o que vira venda, não o que vira print de relatório.' },
    { nome: 'Devikison Aguiar', papel: 'Product Designer e Full Stack Engineer', foto: 'time/devikison.webp', frase: 'Design que não converte é decoração. Cada pixel precisa trabalhar pela venda.' },
    { nome: 'Matheus Nogueira', papel: 'Gestor Financeiro', foto: 'time/matheus.webp', frase: 'Crescer é bom. Crescer com margem é o que mantém a empresa de pé.' },
    { nome: 'Bárbara Rodrigues', papel: 'Social Media', foto: 'time/barbara.webp', frase: 'Consistência todos os dias vale mais do que intensidade de vez em quando.' },
    { nome: 'Bruno de Palma', papel: 'Editor e Creator', foto: 'time/bruno.webp', frase: 'Conteúdo que prende atenção é o primeiro passo de toda venda.' },
    { nome: 'Melissa', papel: 'Relacionamento com Clientes', foto: 'time/melissa.webp', frase: 'Cliente bem cuidado não precisa ser convencido de novo. Ele volta e indica.' },
  ],

  // Cases reais. A seção de prova só aparece quando houver pelo menos 1 case.
  // { cliente, segmento, desafio, oQueFizemos, resultado, depoimento, autorDepoimento, cargo }
  cases: [],

  // Logos de clientes (com autorização). Arquivos em site/static/img/clientes/.
  clientes: [],
};

export const whatsappLink = (msg = empresa.whatsappMensagem) =>
  `https://api.whatsapp.com/send?phone=${empresa.whatsapp}&text=${encodeURIComponent(msg)}`;
