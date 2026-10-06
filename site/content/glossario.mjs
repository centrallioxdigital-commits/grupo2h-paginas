// Glossário de growth. Definições curtas e corretas, com fórmula quando
// existe. Vira DefinedTermSet no JSON-LD: é o tipo de conteúdo que buscador
// e IA citam como fonte.

export const glossario = [
  { termo: 'API de Conversões', sigla: 'CAPI', def: 'Integração que envia os eventos de conversão (lead, compra, cadastro) direto do servidor da empresa para a plataforma de anúncio, sem depender só do navegador. Complementa o pixel e reduz a perda de dados causada por bloqueadores e restrições de privacidade.' },
  { termo: 'CAC', sigla: 'Custo de Aquisição de Cliente', def: 'Quanto a empresa gasta, em média, para conquistar um cliente novo. Soma marketing e vendas no período e divide pelo número de clientes novos.', formula: 'CAC = (investimento em marketing + custo comercial) ÷ clientes novos' },
  { termo: 'CPA', sigla: 'Custo por Aquisição', def: 'Quanto custa cada conversão definida como objetivo: uma venda, um agendamento, um cadastro. Diferente do CAC, olha só para o custo de mídia de uma ação específica.', formula: 'CPA = investimento em mídia ÷ número de conversões' },
  { termo: 'CPA máximo', def: 'O maior custo por aquisição que a empresa aguenta pagar sem perder dinheiro na venda. É calculado a partir do ticket e da margem, antes de investir em mídia.', formula: 'CPA máximo = ticket médio × margem de contribuição' },
  { termo: 'CPL', sigla: 'Custo por Lead', def: 'Quanto custa, em média, cada contato gerado por uma campanha. É uma métrica de entrada: um CPL baixo não garante venda nem lucro se os leads não qualificam ou não compram.', formula: 'CPL = investimento em mídia ÷ número de leads' },
  { termo: 'CRM', sigla: 'Customer Relationship Management', def: 'Sistema que organiza o relacionamento com leads e clientes: etapas do funil, histórico de contato, responsável e próximo passo. Bem configurado, mostra onde as oportunidades travam.' },
  { termo: 'Dashboard', def: 'Painel que reúne os indicadores da operação num lugar só, atualizado a partir das fontes de dado (mídia, CRM, vendas). Serve para decidir, não para enfeitar relatório.' },
  { termo: 'Follow-up', def: 'O acompanhamento ativo de um lead ou cliente depois do primeiro contato, com prazo e responsável definidos. Grande parte das vendas perdidas morre por falta de follow-up, não por falta de lead.' },
  { termo: 'Funil de vendas', def: 'A representação das etapas que uma pessoa percorre do primeiro contato até a compra, com a quantidade e a taxa de conversão de cada etapa. Mostra onde o caminho aperta.' },
  { termo: 'Gargalo', def: 'A etapa da operação que limita o resultado de todas as outras. Enquanto ele não é resolvido, investir mais nas etapas anteriores, como tráfego, só aumenta o desperdício.' },
  { termo: 'ICP', sigla: 'Ideal Customer Profile', def: 'O perfil de cliente ideal: o tipo de empresa ou pessoa que mais se beneficia da oferta, compra com mais facilidade e gera mais margem. Orienta público, mensagem e qualificação.' },
  { termo: 'KPI', sigla: 'Key Performance Indicator', def: 'Indicador-chave de desempenho: um número escolhido para acompanhar se uma meta está sendo alcançada. Bons KPIs têm dono, meta e frequência de leitura.' },
  { termo: 'Lead', def: 'Um contato que demonstrou interesse e deixou um meio de ser chamado, como WhatsApp, telefone ou e-mail. Lead não é cliente: ainda precisa ser atendido, qualificado e conduzido até a venda.' },
  { termo: 'Lead qualificado', def: 'Lead que atende aos critérios mínimos para virar cliente: tem a necessidade, o perfil e a condição de comprar. Definir esse critério junto entre marketing e comercial acaba com a discussão sobre a qualidade do lead.' },
  { termo: 'LTV', sigla: 'Lifetime Value', def: 'O valor total que um cliente gera para a empresa durante todo o relacionamento. Comparado ao CAC, mostra se a aquisição se paga no longo prazo.', formula: 'LTV = ticket médio × compras por período × tempo de relacionamento' },
  { termo: 'Margem de contribuição', def: 'O que sobra de cada venda depois dos custos variáveis (produto, impostos, comissões, taxas). É dela que sai o dinheiro para pagar a aquisição de clientes.' },
  { termo: 'Oferta de entrada', def: 'Um produto ou serviço de menor barreira, pensado para iniciar o relacionamento com o cliente e abrir caminho para as ofertas principais.' },
  { termo: 'Pixel', def: 'Código instalado no site que registra as ações dos visitantes (visita, cadastro, compra) e envia esses eventos para a plataforma de anúncio, que usa os dados para medir e otimizar campanhas.' },
  { termo: 'Rastreamento', def: 'O conjunto de pixel, API de conversões, UTMs e integrações que registra de onde veio cada lead e cada venda. Sem rastreamento validado, qualquer leitura de resultado é chute.' },
  { termo: 'Reativação de base', def: 'Rotina para voltar a gerar receita com contatos e clientes que a empresa já tem, mas que estão parados. Costuma custar bem menos do que adquirir um cliente novo.' },
  { termo: 'Remarketing', def: 'Anúncios direcionados a pessoas que já tiveram contato com a empresa, como visitar o site ou interagir no Instagram, para retomar a conversa com quem já conhece a marca.' },
  { termo: 'ROAS', sigla: 'Return on Ad Spend', def: 'Retorno sobre o investimento em anúncios: quanto de receita cada real investido em mídia gerou. ROAS não é lucro, porque ignora custos e margem.', formula: 'ROAS = receita atribuída à mídia ÷ investimento em mídia' },
  { termo: 'ROAS de equilíbrio', def: 'O ROAS mínimo para a campanha não dar prejuízo, considerando a margem da venda. Abaixo dele, cada venda feita pelo anúncio custa mais do que deixa.', formula: 'ROAS de equilíbrio = 1 ÷ margem de contribuição (em %)' },
  { termo: 'ROI', sigla: 'Return on Investment', def: 'Retorno sobre o investimento total, já descontados os custos. Diferente do ROAS, mostra se a operação de fato deu lucro.', formula: 'ROI = (ganho − investimento) ÷ investimento' },
  { termo: 'SLA de atendimento', sigla: 'Service Level Agreement', def: 'O prazo combinado para responder um lead ou cliente, por exemplo, em até 5 minutos no horário comercial. Quanto mais rápido o primeiro contato, maior a chance de conversão.' },
  { termo: 'Taxa de conversão', def: 'A porcentagem de pessoas que avançam de uma etapa do funil para a seguinte, por exemplo, de lead para venda.', formula: 'Taxa de conversão = conversões ÷ total da etapa anterior × 100' },
  { termo: 'Ticket médio', def: 'O valor médio de cada venda num período.', formula: 'Ticket médio = faturamento ÷ número de vendas' },
  { termo: 'UTM', def: 'Parâmetros adicionados ao fim de um link (utm_source, utm_medium, utm_campaign) que identificam de qual canal, campanha ou anúncio veio cada visita.' },
];
