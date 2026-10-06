// Lead magnet "7 sinais de que sua agência não é transparente com você".
// Texto único usado pela página (grupo2h.com.br/7-sinais/) e pelo PDF.
// Editou aqui? Rode: node site/lead-magnet/gerar.mjs

export const LM = {
  slug: '7-sinais',
  titulo1: '7 sinais de que sua agência',
  titulo2: 'não é transparente com você.',
  sub: 'Um checklist de 3 minutos para descobrir se você está vendo os números reais da sua empresa ou só a parte bonita do relatório.',
  pdf: '7-sinais-agencia-transparente-2H.pdf',
  webhook: 'https://n8n-n8n-start.dnjlb7.easypanel.host/webhook/grupo2h?source=lead-magnet',
  gtm: 'GTM-PDKH7XHJ',
  diagnostico: '/diagnostico-rapido/?origem=lead-magnet-7-sinais',
  whatsapp: '5515997509239',
  whatsappExibicao: '(15) 99750-9239',
  email: 'contato@grupo2h.com.br',
  privacidade: '/novo/privacidade/', // na virada do site para produção, trocar para '/privacidade/'
};

export const SINAIS = [
  {
    icone: 'key',
    titulo: 'Você não é dono das suas contas de anúncio.',
    perceber: 'O Gerenciador de Negócios, a conta do Google Ads ou o pixel estão no nome da agência, e você não tem acesso de administrador.',
    deveria: 'As contas são da sua empresa. A agência entra como parceira, com um acesso que você pode tirar quando quiser.',
    pergunta: 'Eu tenho acesso de administrador a todas as contas de anúncio e ao pixel?',
  },
  {
    icone: 'heart',
    titulo: 'O relatório fala de curtidas, não de vendas.',
    perceber: 'Alcance, impressões, CPM e seguidores aparecem em destaque. Quantos clientes vieram e quanto faturaram, não.',
    deveria: 'O relatório vai até o dinheiro: leads, vendas, faturamento e retorno sobre o que foi investido.',
    pergunta: 'Quantas vendas e quanto de faturamento vieram do investimento do mês passado?',
  },
  {
    icone: 'coins',
    titulo: 'Ninguém sabe quanto custa um cliente.',
    perceber: 'Falam de custo por lead, mas ninguém responde quanto custou cada cliente (CAC) nem quanto ele deixa no caixa.',
    deveria: 'Você sabe o seu custo por cliente e o máximo que pode pagar por um sem perder margem.',
    pergunta: 'Qual é o nosso custo por cliente e qual o máximo que podemos pagar?',
  },
  {
    icone: 'crosshair',
    titulo: 'Os números da plataforma não batem com o caixa.',
    perceber: 'O painel mostra 80 conversões, o comercial fechou 12 e ninguém explica a diferença. O rastreamento nunca foi validado.',
    deveria: 'Pixel, API de conversões e UTMs testados de ponta a ponta. Cada venda tem origem conhecida.',
    pergunta: 'Como vocês validaram o rastreamento e de onde veio cada venda deste mês?',
  },
  {
    icone: 'arrows-clockwise',
    titulo: 'Quando o resultado cai, a culpa é sempre de alguém.',
    perceber: 'Foi o algoritmo, a sazonalidade, o criativo, o seu comercial. Nunca aparece um diagnóstico com dado.',
    deveria: 'Queda vira análise: o que mudou, em qual etapa do funil travou e o que será feito, com data.',
    pergunta: 'Em qual etapa do funil a queda aconteceu e qual é o plano para corrigir?',
  },
  {
    icone: 'receipt',
    titulo: 'Você não sabe para onde vai cada real.',
    perceber: 'Você paga um valor fechado e não vê quanto foi para a mídia, quanto ficou de taxa nem as faturas das plataformas.',
    deveria: 'Investimento em mídia separado da remuneração da agência, com as faturas das plataformas no nome da sua empresa.',
    pergunta: 'Posso ver as faturas das plataformas e quanto foi para mídia neste mês?',
  },
  {
    icone: 'flask',
    titulo: 'Todo mês é “vamos testar”.',
    perceber: 'Campanhas e criativos novos todo mês, mas sem hipótese, sem meta e sem data para decidir o que fica e o que sai.',
    deveria: 'Um plano com metas e hipóteses, e reuniões de leitura de números com as decisões registradas.',
    pergunta: 'Qual é a meta deste mês e o que vamos decidir se ela não for batida?',
  },
];

export const FAIXAS = [
  { ate: 1, cor: 'verde', nome: 'Relação saudável', texto: 'Você está vendo os números que importam. Continue cobrando a leitura até o caixa, todo mês.' },
  { ate: 3, cor: 'amarelo', nome: 'Sinal amarelo', texto: 'Você está vendo só parte da história. Leve as perguntas deste checklist para a próxima reunião com a sua agência.' },
  { ate: 7, cor: 'vermelho', nome: 'Sinal vermelho', texto: 'Você está investindo no escuro. Antes de colocar mais dinheiro em tráfego, vale olhar a operação com dado real.' },
];
