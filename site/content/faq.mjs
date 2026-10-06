// Perguntas frequentes do site. Respostas diretas, sem promessa que a
// operação não sustenta. Viram FAQPage no JSON-LD (Google e IAs leem).

export const faqGrupos = [
  {
    grupo: 'Sobre a 2!H',
    itens: [
      { q: 'A 2!H é uma agência de tráfego?', a: 'Não. A 2!H não vende só anúncio. Organizamos a máquina de vendas digital da empresa: oferta, público, comunicação, aquisição, atendimento, comercial, rastreamento e dados, tudo conectado. Tráfego é uma das peças, não o trabalho inteiro.' },
      { q: 'Para quem a 2!H trabalha?', a: 'Para donos e sócios de empresas já estabelecidas, com faturamento consolidado, que já investiram em marketing antes e querem parar de operar no achismo.' },
      { q: 'O que vocês chamam de conta aberta?', a: 'É a forma como trabalhamos com transparência: você acompanha os números reais da sua operação, com rastreamento validado, em vez de receber um relatório maquiado no fim do mês.' },
      { q: 'O que é o Método 5A?', a: 'É o método da 2!H para estruturar crescimento em cinco fases: Análise, Alinhamento, Aquisição, Acompanhamento e Aceleração. Ele pode ser aprendido na Imersão, construído em grupo na Mentoria 5A ou aplicado individualmente no Diagnóstico Estratégico 5A.' },
    ],
  },
  {
    grupo: 'Como começar',
    itens: [
      { q: 'Por onde eu começo?', a: 'Pelo diagnóstico rápido: algumas perguntas sobre o cenário da sua empresa, que levam menos de 1 minuto. Depois a 2!H te chama no WhatsApp para entender o seu caso e indicar o degrau certo.' },
      { q: 'Como sei qual serviço é o certo para a minha empresa?', a: 'Depende de onde a sua empresa está. Sem base organizada, o começo é o EDB. Com base pronta e tráfego para rodar, o Growth Control. Com o problema entre marketing e comercial, o Growth Marketing. Para decidir com dados, o Growth Intelligence. A conversa de diagnóstico define isso com você.' },
      { q: 'Vocês divulgam os preços?', a: 'Não no site. Cada serviço é montado para o momento da empresa, e o investimento é apresentado depois da conversa de diagnóstico, junto com a proposta.' },
      { q: 'Preciso já ter site, CRM e rastreamento?', a: 'Não. Montar essa base é justamente o trabalho do EDB, a Estruturação Digital de Base. Ele organiza site, rastreamento, funil e presença digital antes de qualquer campanha.' },
    ],
  },
  {
    grupo: 'Serviços e programas',
    itens: [
      { q: 'Qual a diferença entre o EDB e o Growth Control?', a: 'O EDB monta a fundação: site, rastreamento, funil e presença, em 8 semanas. O Growth Control é a gestão de tráfego com controle e dados, para quem já tem essa base e quer rodar campanha com clareza de número.' },
      { q: 'Vocês executam ou ensinam?', a: 'Os dois. Os serviços da escada (EDB, Growth Control, Growth Marketing, Growth Intelligence e Lançamentos) são executados pela 2!H. Os programas do Método 5A (Imersão, Mentoria e Diagnóstico Estratégico) são para você construir o sistema da sua empresa com acompanhamento.' },
      { q: 'Qual a diferença entre a Mentoria 5A e o Diagnóstico Estratégico 5A?', a: 'A Mentoria 5A é em grupo, por 12 semanas, com outros empresários. O Diagnóstico Estratégico 5A é individual: o mesmo Método 5A aplicado na sua empresa, 1x1, com atenção total ao seu caso.' },
      { q: 'Com quais canais vocês trabalham?', a: 'Os canais mais comuns nos nossos diagnósticos e operações são Meta Ads, Google Ads, Instagram e WhatsApp, sempre conectados ao atendimento, ao comercial e ao CRM.' },
    ],
  },
  {
    grupo: 'Resultados e dados',
    itens: [
      { q: 'Em quanto tempo eu vejo resultado?', a: 'Depende de onde a empresa começa. O que a 2!H garante é o processo: primeiro estrutura, depois escala, com número validado em cada etapa. Prometer prazo de faturamento sem conhecer a operação seria exatamente o tipo de promessa vazia que evitamos.' },
      { q: 'Por que CPL baixo não basta?', a: 'Porque o lead pode ser barato e não qualificar, não responder, não comprar e ainda gerar um custo de aquisição de cliente ruim. O que importa é o caminho inteiro, do dinheiro investido até o dinheiro que volta para o caixa.' },
      { q: 'Meus dados ficam seguros?', a: 'Sim. Usamos os dados apenas para o atendimento e o trabalho contratado, seguindo a Lei Geral de Proteção de Dados (LGPD). Os detalhes estão na nossa política de privacidade.' },
    ],
  },
];

export const faqTodos = faqGrupos.flatMap((g) => g.itens);
