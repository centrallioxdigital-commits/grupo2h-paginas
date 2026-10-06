// A escada de serviços da 2!H (copy do site principal, tarefa do ClickUp
// "[2H] Criar Copy do site principal da agencia"). Ordem = ordem da escada.
// Preço nunca aparece no site (política de não divulgar valor antecipado).

export const servicos = [
  {
    slug: 'edb',
    nome: 'EDB',
    nomeLongo: 'Estruturação Digital de Base',
    degrau: 'Fundação',
    icone: 'stack',
    frase: 'A fundação: site, rastreamento, funil e presença digital organizados antes de qualquer campanha.',
    resumo:
      'Um projeto fechado de 8 semanas que monta a base de aquisição e conversão da sua empresa antes de o primeiro anúncio rodar. Primeiro a estrutura, depois o anúncio.',
    paraQuem: [
      'Empresa que quer começar a anunciar, mas ainda não tem a base organizada.',
      'Empresa que já anuncia há tempo e nunca teve site, rastreamento e funil estruturados direito.',
      'Quem sente que o dinheiro do tráfego entra numa estrutura furada.',
    ],
    naoE: 'Para quem já tem estrutura pronta e validada e só quer alguém para rodar campanha. Nesse caso o degrau certo é o Growth Control.',
    perguntas: [
      { t: 'Quem', d: 'Público-alvo real, com dor, desejo e linguagem verdadeira, não idealizado.' },
      { t: 'Quanto', d: 'CPA ideal, CPA máximo e ROAS de equilíbrio: a matemática antes da mídia.' },
      { t: 'Como prender atenção', d: 'Criativo, ângulo e nível de consciência do público.' },
      { t: 'Com o quê', d: 'Oferta, página, rastreamento, follow-up e CRM.' },
      { t: 'Como medir', d: 'Métricas por etapa do funil, dashboard e ritual de leitura.' },
      { t: 'E aí', d: 'O que escalar, o que corrigir e o que parar.' },
    ],
    fases: [
      { quando: 'Semanas 1 e 2', nome: 'Posicionamento e estratégia', itens: ['Diagnóstico de marca', 'Definição de público', 'Dossiê de avatar', 'Linha de comunicação', 'Oferta de entrada'] },
      { quando: 'Semanas 2 a 4', nome: 'Estrutura técnica', itens: ['Domínio próprio', 'Páginas', 'Pixel e API de conversões', 'CRM ou funil de atendimento'] },
      { quando: 'Semanas 3 a 5', nome: 'Presença e prova', itens: ['Google Meu Negócio', 'Rotina de avaliações', 'Contato direto na bio', 'Funil de WhatsApp com scripts e SLA'] },
      { quando: 'Semanas 6 a 8', nome: 'Ativação e entrega', itens: ['Teste de ponta a ponta', 'Dashboard', 'Direcional de conteúdo', 'Reunião de entrega com a ponte para a gestão de tráfego'] },
    ],
    formato: [
      { k: 'Duração', v: '8 semanas' },
      { k: 'Formato', v: 'Projeto fechado, em 4 fases' },
      { k: 'Investimento', v: 'Sob consulta, depois da conversa de diagnóstico' },
    ],
    lp: '/edb/',
    faq: [
      { q: 'Por que o preço do EDB não está no site?', a: 'Porque o EDB é montado para o momento de cada empresa. O investimento é apresentado depois de uma conversa de diagnóstico, junto com a proposta.' },
      { q: 'Quanto tempo leva?', a: 'Oito semanas, em quatro fases: posicionamento e estratégia, estrutura técnica, presença e prova, e ativação e entrega.' },
      { q: 'O que acontece no fim das 8 semanas?', a: 'Uma reunião de entrega com a base testada de ponta a ponta, o dashboard e o direcional de conteúdo, e a ponte para a gestão de tráfego.' },
      { q: 'Já tenho estrutura e só quero rodar campanha. O EDB serve?', a: 'Nesse caso o caminho é direto para o Growth Control. O EDB é para quem ainda não tem a base organizada.' },
    ],
  },
  {
    slug: 'growth-control',
    nome: 'Growth Control',
    nomeLongo: 'Gestão de tráfego com controle e dados',
    degrau: 'Controle',
    icone: 'gauge',
    frase: 'Gestão de tráfego com controle e dados, para quem já tem estrutura e quer rodar campanha com clareza de número.',
    resumo:
      'Campanhas em Meta Ads e Google Ads geridas a partir da leitura do funil inteiro, não só do CPL. Você sabe quanto custa cada etapa e onde o dinheiro trava.',
    paraQuem: [
      'Empresa que já tem site, rastreamento e atendimento organizados.',
      'Quem já investe em mídia e quer clareza do retorno por canal e por campanha.',
      'Quem cansou de relatório bonito que não mostra o que virou venda.',
    ],
    naoE: 'Para quem ainda não tem a base montada. Rodar tráfego numa estrutura furada só acelera o desperdício. Nesse caso o primeiro degrau é o EDB.',
    inclui: [
      { t: 'Gestão de Meta Ads e Google Ads', d: 'Campanhas estruturadas por oferta e por objetivo, não por tentativa.' },
      { t: 'Rastreamento validado', d: 'Pixel, API de conversões e UTMs conferidos antes de qualquer leitura de resultado.' },
      { t: 'Leitura do funil inteiro', d: 'CPL, CPA, taxa de conversão e retorno por canal lidos em conjunto, até a venda.' },
      { t: 'Direcionamento de criativos', d: 'O que testar, por quê e como saber se funcionou.' },
      { t: 'Otimização contínua', d: 'Ajuste com base em número, não em sensação.' },
      { t: 'Conta aberta', d: 'Você acompanha os números reais da sua operação, sem relatório maquiado.' },
    ],
    formato: [
      { k: 'Formato', v: 'Gestão contínua' },
      { k: 'Canais', v: 'Meta Ads e Google Ads' },
      { k: 'Investimento', v: 'Sob consulta, depois da conversa de diagnóstico' },
    ],
    faq: [
      { q: 'Qual a diferença entre o Growth Control e uma gestão de tráfego comum?', a: 'A gestão comum costuma parar no CPL e no volume de leads. O Growth Control lê o caminho até a venda: quanto custa cada etapa, onde o lead trava e quanto você pode pagar por cliente sem destruir a margem.' },
      { q: 'Preciso ter feito o EDB antes?', a: 'Não necessariamente. Precisa ter a base funcionando: página, rastreamento e atendimento. Se isso ainda não existe, o EDB vem primeiro.' },
      { q: 'O investimento em mídia está incluso?', a: 'O valor investido nas plataformas de anúncio é separado da gestão e fica na sua conta, com você.' },
    ],
  },
  {
    slug: 'growth-marketing',
    nome: 'Growth Marketing',
    nomeLongo: 'Crescimento integrado',
    degrau: 'Integração',
    icone: 'arrows-in',
    frase: 'Crescimento integrado: marketing e comercial andando juntos, com processo do clique até a venda.',
    resumo:
      'Quando o problema não está só no anúncio, mas no que acontece depois dele. Aquisição, atendimento, comercial e CRM tratados como um sistema só.',
    paraQuem: [
      'Empresa em que o marketing diz que o lead é bom e o comercial diz que é ruim.',
      'Quem gera lead, mas perde oportunidade no atendimento ou no follow-up.',
      'Quem tem uma base de clientes e contatos parada que não volta a gerar receita.',
    ],
    naoE: 'Para quem procura só alguém para subir campanha. Aqui o trabalho atravessa o comercial e exige o time de vendas junto.',
    inclui: [
      { t: 'Planejamento de aquisição', d: 'Canais, ofertas e metas desenhados a partir da capacidade do comercial de atender.' },
      { t: 'Processo de atendimento e vendas', d: 'Qualificação, scripts, SLA de resposta e follow-up com dono e prazo.' },
      { t: 'CRM funcionando', d: 'Funil configurado para dar visibilidade e histórico, não só para guardar contato.' },
      { t: 'Reativação de base', d: 'Rotina para a base que já existe voltar a gerar receita.' },
      { t: 'Rituais de leitura', d: 'Marketing e comercial olhando o mesmo número, na mesma reunião.' },
      { t: 'Gestão de mídia integrada', d: 'Tráfego ajustado com o que o comercial devolve sobre a qualidade do lead.' },
    ],
    formato: [
      { k: 'Formato', v: 'Acompanhamento contínuo' },
      { k: 'Envolve', v: 'Marketing, atendimento e comercial' },
      { k: 'Investimento', v: 'Sob consulta, depois da conversa de diagnóstico' },
    ],
    faq: [
      { q: 'Vocês treinam o meu time comercial?', a: 'O trabalho organiza o processo que o time comercial segue: qualificação, resposta, follow-up e registro no CRM. O time participa dos rituais de leitura junto com o marketing.' },
      { q: 'Preciso trocar de CRM?', a: 'Nem sempre. Primeiro vemos se a ferramenta que você já tem consegue dar visibilidade. Troca só quando ela não sustenta o processo.' },
    ],
  },
  {
    slug: 'growth-intelligence',
    nome: 'Growth Intelligence',
    nomeLongo: 'Inteligência de dados para decidir',
    degrau: 'Inteligência',
    icone: 'chart-line-up',
    frase: 'Inteligência de dados aplicada à decisão de crescimento: onde investir, o que corrigir e quando escalar.',
    resumo:
      'Dashboards, cruzamento de dados de mídia, CRM e vendas e leitura de indicadores para a gestão parar de decidir no escuro.',
    paraQuem: [
      'Empresa que tem dados espalhados em várias ferramentas e nenhuma visão única.',
      'Gestão que decide investimento por sensação porque não confia nos números.',
      'Quem quer saber com segurança quando e onde escalar.',
    ],
    naoE: 'Para quem ainda não tem rastreamento básico funcionando. Sem dado confiável na origem, não existe inteligência no fim.',
    inclui: [
      { t: 'Dashboards personalizados', d: 'Os indicadores que importam para o seu negócio, num lugar só.' },
      { t: 'Análise de funil e conversão', d: 'Onde o lead entra, onde trava e quanto custa cada etapa.' },
      { t: 'Cruzamento de dados', d: 'Mídia, CRM e vendas conectados para ligar investimento a receita.' },
      { t: 'Monitoramento de KPIs', d: 'Metas por etapa e alerta quando algo sai do ritmo.' },
      { t: 'Rastreamento avançado', d: 'Origem de cada venda registrada de forma confiável.' },
      { t: 'Leitura para decisão', d: 'O número traduzido em próximo passo: escalar, corrigir ou parar.' },
    ],
    formato: [
      { k: 'Formato', v: 'Projeto e acompanhamento' },
      { k: 'Entrega', v: 'Dashboards e rotina de leitura' },
      { k: 'Investimento', v: 'Sob consulta, depois da conversa de diagnóstico' },
    ],
    faq: [
      { q: 'Quais ferramentas vocês usam nos dashboards?', a: 'A escolha depende das fontes de dado da sua empresa. O ponto de partida é o que você já usa; a ferramenta vem depois da pergunta que o dashboard precisa responder.' },
      { q: 'Serve para empresa que não anuncia?', a: 'Serve. O cruzamento de dados vale para qualquer canal de aquisição, pago ou não, desde que a origem das vendas possa ser registrada.' },
    ],
  },
  {
    slug: 'lancamentos',
    nome: 'Lançamentos e coprodução',
    nomeLongo: 'Projetos de lançamento pago',
    degrau: 'Projetos',
    icone: 'rocket-launch',
    frase: 'Projetos pontuais de lançamento pago, do zero ao pitch.',
    resumo:
      'Para quem tem um produto ou evento para lançar e quer a estrutura inteira montada e acompanhada: estratégia, páginas, rastreamento, captação e o momento da oferta.',
    paraQuem: [
      'Especialista ou empresa com um produto, curso, mentoria ou evento para lançar.',
      'Quem quer um projeto com começo, meio e fim, e não uma gestão contínua.',
      'Quem já tentou lançar sem estrutura e não conseguiu ler o resultado.',
    ],
    naoE: 'Para quem procura promessa de faturamento. Lançamento é projeto com planejamento, teste e leitura de número.',
    inclui: [
      { t: 'Estratégia do lançamento', d: 'Oferta, público, calendário e meta de cada etapa.' },
      { t: 'Estrutura de páginas', d: 'Páginas de captação e de venda com rastreamento validado.' },
      { t: 'Tráfego de captação', d: 'Campanhas para atrair o público certo para o evento ou a lista.' },
      { t: 'Aquecimento e comunicação', d: 'Sequência de conteúdo e mensagens até o dia da oferta.' },
      { t: 'Do evento ao pitch', d: 'Estrutura do momento da oferta e do carrinho aberto.' },
      { t: 'Leitura do resultado', d: 'O que funcionou, o que travou e o que levar para o próximo.' },
    ],
    formato: [
      { k: 'Formato', v: 'Projeto pontual' },
      { k: 'Modelo', v: 'Lançamento pago ou coprodução' },
      { k: 'Investimento', v: 'Sob consulta, depois da conversa de diagnóstico' },
    ],
    faq: [
      { q: 'Vocês trabalham com coprodução?', a: 'Sim. Dependendo do projeto, o lançamento pode ser feito em coprodução. As condições são conversadas caso a caso.' },
    ],
  },
];

export const servicoPorSlug = Object.fromEntries(servicos.map((s) => [s.slug, s]));
