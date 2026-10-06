// Método 5A e os três jeitos de aplicá-lo (programas). Textos tirados das
// LPs já publicadas da Imersão, Mentoria e Diagnóstico Estratégico 5A.

export const fases = [
  { nome: 'Análise', icone: 'magnifying-glass', frase: 'Descubra onde o dinheiro está sendo perdido.', entregas: ['Raio-X econômico da empresa', 'Mapa do funil atual', 'Mapa de gargalos'] },
  { nome: 'Alinhamento', icone: 'arrows-left-right', frase: 'Faça oferta, público e mensagem falarem a mesma língua.', entregas: ['Oferta estruturada', 'ICP e matriz de comunicação'] },
  { nome: 'Aquisição', icone: 'funnel', frase: 'Construa uma estrutura capaz de gerar demanda.', entregas: ['Checklist de estrutura digital', 'Plano de canais e aquisição', 'Funil de aquisição e conversão'] },
  { nome: 'Acompanhamento', icone: 'chart-bar', frase: 'Transforme dados em decisões comerciais.', entregas: ['Processo de atendimento e vendas', 'Estrutura de rastreamento', 'Dashboard e metas'] },
  { nome: 'Aceleração', icone: 'trend-up', frase: 'Cresça somente quando o sistema estiver pronto.', entregas: ['Plano de crescimento de 90 dias'] },
];

export const programas = [
  {
    slug: 'imersao',
    nome: 'Imersão Estrutura 5A',
    formato: 'Online e ao vivo · 4 horas',
    frase: 'Aprenda a enxergar o sistema e a identificar onde a sua empresa perde vendas, antes de investir mais em tráfego.',
    pontos: ['As 10 etapas do diagnóstico, do negócio até a margem', 'Como ler seus números sem se enganar com CPL', 'Identificação do verdadeiro gargalo da operação'],
    link: '/imersao5a/',
    cta: 'Conhecer a Imersão',
  },
  {
    slug: 'mentoria',
    nome: 'Mentoria 5A',
    formato: 'Em grupo · 12 semanas',
    frase: 'Construa, com a 2!H e outros empresários, o sistema de aquisição e conversão da sua empresa. Não é teoria, é implementação.',
    pontos: ['Encontros ao vivo de 2 horas', '12 entregáveis aplicados na sua empresa', 'Entrega obrigatória toda semana'],
    link: '/mentoria5a/',
    cta: 'Conhecer a Mentoria',
  },
  {
    slug: 'diagnostico',
    nome: 'Diagnóstico Estratégico 5A',
    formato: 'Individual · 1x1',
    frase: 'O Método 5A aplicado direto na sua empresa, com atenção total ao seu caso, sem dividir tempo com uma turma.',
    pontos: ['Raio-X econômico da sua empresa', 'Mapa dos gargalos entre marketing, atendimento e comercial', 'Plano de prioridades: o que corrigir primeiro'],
    link: '/diagnostico5a/',
    cta: 'Conhecer o Diagnóstico 5A',
  },
];

// As 10 etapas da esteira que a Imersão ensina a enxergar.
export const esteira = [
  { nome: 'Negócio', d: 'Modelo, posicionamento e capacidade de entrega.' },
  { nome: 'Oferta', d: 'O que é vendido, a quem e por que vale o preço.' },
  { nome: 'Público', d: 'Quem realmente compra e quem só consome atenção.' },
  { nome: 'Comunicação', d: 'Mensagem, criativo e promessa alinhados à oferta.' },
  { nome: 'Aquisição', d: 'Tráfego, canais e custo de cada lead que entra.' },
  { nome: 'Atendimento', d: 'Velocidade, qualidade e continuidade da resposta.' },
  { nome: 'Comercial', d: 'Qualificação, follow-up e condução até a proposta.' },
  { nome: 'Venda', d: 'Fechamento real: quantos leads viram cliente.' },
  { nome: 'Receita', d: 'Ticket, recorrência e o que entra de fato no caixa.' },
  { nome: 'Margem', d: 'O que sobra depois de pagar tudo, inclusive o tráfego.' },
];
