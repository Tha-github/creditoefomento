/**
 * Política de Privacidade: versão preliminar, redigida a partir do funcionamento real do site.
 * Itens `pending` são informações que só a empresa pode fornecer ou confirmar. Todos devem ser
 * resolvidos, e o texto validado juridicamente, antes de `site.privacyPolicyValidated` virar `true`.
 */
export type PolicyBlock =
  | { type: 'paragraph'; text: string }
  | { type: 'list'; items: readonly string[] }
  | { type: 'pending'; text: string };

export interface PolicySection {
  id: string;
  title: string;
  blocks: readonly PolicyBlock[];
}

export const privacyPolicyContent: {
  eyebrow: string;
  title: string;
  intro: string;
  draftNotice: string;
  effectiveDate: PolicyBlock;
  tocLabel: string;
  pendingLabel: string;
  sections: readonly PolicySection[];
} = {
  eyebrow: 'Privacidade',
  title: 'Política de Privacidade',
  intro:
    'Esta política explica, em linguagem direta, como a Crédito e Fomento trata os dados pessoais enviados pelo site e quais são os seus direitos.',
  draftNotice:
    'Versão preliminar. Os pontos marcados como pendentes dependem de informações da empresa, e o texto ainda passará por validação antes da publicação.',
  effectiveDate: { type: 'pending', text: 'Data de vigência desta versão.' },
  tocLabel: 'Nesta página',
  pendingLabel: 'Pendente de validação',
  sections: [
    {
      id: 'responsavel',
      title: 'Quem é responsável pelos dados',
      blocks: [
        {
          type: 'paragraph',
          text: 'A Crédito e Fomento é a responsável pelo tratamento dos dados pessoais enviados por este site.',
        },
        { type: 'pending', text: 'Razão social, CNPJ e endereço do controlador dos dados.' },
      ],
    },
    {
      id: 'dados-coletados',
      title: 'Quais dados coletamos',
      blocks: [
        { type: 'paragraph', text: 'Pelo formulário de contato, coletamos:' },
        {
          type: 'list',
          items: [
            'nome da empresa;',
            'CNPJ;',
            'WhatsApp;',
            'e-mail corporativo, se você o informar.',
          ],
        },
        {
          type: 'paragraph',
          text: 'Não solicitamos documentos financeiros, extratos bancários ou dados pessoais sensíveis pelo site. Pedimos que você não os envie pelo formulário.',
        },
        {
          type: 'paragraph',
          text: 'Para limitar envios abusivos, o endereço IP de quem envia o formulário é transformado em um código (hash) e guardado por até 10 minutos, sem relação com os dados preenchidos.',
        },
        {
          type: 'paragraph',
          text: 'Este site não utiliza cookies nem ferramentas de análise de navegação. Caso isso mude, esta política será atualizada.',
        },
        {
          type: 'pending',
          text: 'Registros técnicos de acesso, como IP e navegador, mantidos pelo provedor de hospedagem, e o prazo de guarda desses registros.',
        },
      ],
    },
    {
      id: 'finalidade',
      title: 'Para que usamos os dados',
      blocks: [
        { type: 'paragraph', text: 'Os dados enviados pelo formulário são usados para:' },
        {
          type: 'list',
          items: [
            'responder à sua solicitação;',
            'realizar o primeiro atendimento comercial;',
            'compreender a necessidade da empresa e avaliar uma possível operação.',
          ],
        },
        { type: 'pending', text: 'Base legal do tratamento, conforme a Lei Geral de Proteção de Dados (LGPD).' },
      ],
    },
    {
      id: 'uso',
      title: 'Como as informações são utilizadas',
      blocks: [
        {
          type: 'paragraph',
          text: 'As informações do formulário são enviadas por e-mail à equipe comercial da Crédito e Fomento, por meio de um provedor de envio de e-mails. Elas não ficam armazenadas no site.',
        },
        {
          type: 'paragraph',
          text: 'A equipe pode entrar em contato pelo e-mail ou telefone informados, para dar continuidade ao atendimento.',
        },
        {
          type: 'paragraph',
          text: 'Se você optar por falar conosco pelo WhatsApp, a conversa acontece nesse aplicativo, e as informações trocadas ali também estão sujeitas aos termos e à política de privacidade do WhatsApp.',
        },
      ],
    },
    {
      id: 'compartilhamento',
      title: 'Compartilhamento de dados',
      blocks: [
        { type: 'paragraph', text: 'Não vendemos dados pessoais. Para o site funcionar, os dados podem passar por:' },
        {
          type: 'list',
          items: [
            'o provedor de hospedagem do site;',
            'o provedor de envio de e-mails, que entrega as solicitações à equipe;',
            'o serviço usado para limitar envios abusivos, que recebe apenas o código gerado a partir do IP.',
          ],
        },
        {
          type: 'paragraph',
          text: 'Os dados também podem ser compartilhados para cumprir obrigações legais ou atender a determinações de autoridades competentes.',
        },
        {
          type: 'pending',
          text: 'Nome de cada provedor e se há transferência internacional de dados, com os países envolvidos.',
        },
      ],
    },
    {
      id: 'seguranca',
      title: 'Segurança',
      blocks: [
        {
          type: 'paragraph',
          text: 'O formulário valida as informações no servidor, limita a quantidade de envios e não guarda os dados no site. Os registros técnicos do sistema de envio não incluem os dados preenchidos.',
        },
        {
          type: 'paragraph',
          text: 'Nenhum sistema é totalmente imune a falhas. Se houver um incidente que possa gerar risco relevante aos titulares, ele será tratado conforme a legislação.',
        },
        {
          type: 'pending',
          text: 'Confirmação da conexão segura (HTTPS) no domínio publicado e das medidas internas de proteção da caixa de e-mail que recebe as solicitações.',
        },
      ],
    },
    {
      id: 'retencao',
      title: 'Por quanto tempo os dados são mantidos',
      blocks: [
        {
          type: 'paragraph',
          text: 'O site não armazena os dados do formulário. As solicitações recebidas por e-mail são mantidas pelo tempo necessário ao atendimento e ao cumprimento de obrigações legais.',
        },
        { type: 'pending', text: 'Prazo de retenção das solicitações e forma de descarte.' },
      ],
    },
    {
      id: 'direitos',
      title: 'Seus direitos',
      blocks: [
        { type: 'paragraph', text: 'Pela LGPD, você pode solicitar:' },
        {
          type: 'list',
          items: [
            'a confirmação de que tratamos seus dados;',
            'o acesso aos seus dados;',
            'a correção de dados incompletos, inexatos ou desatualizados;',
            'a anonimização, o bloqueio ou a eliminação de dados desnecessários ou tratados em desconformidade com a lei;',
            'a portabilidade dos dados;',
            'informações sobre com quem os dados foram compartilhados;',
            'informações sobre a possibilidade de não fornecer consentimento e suas consequências;',
            'a revogação do consentimento, quando ele for a base do tratamento.',
          ],
        },
        {
          type: 'paragraph',
          text: 'Você também pode apresentar reclamação à Autoridade Nacional de Proteção de Dados (ANPD).',
        },
      ],
    },
    {
      id: 'contato',
      title: 'Canal para solicitações',
      blocks: [
        {
          type: 'paragraph',
          text: 'Para exercer seus direitos ou tirar dúvidas sobre esta política, utilize o canal indicado abaixo.',
        },
        {
          type: 'pending',
          text: 'Canal de privacidade (por exemplo, um e-mail dedicado) e nome do encarregado pelo tratamento de dados pessoais.',
        },
      ],
    },
    {
      id: 'alteracoes',
      title: 'Alterações desta política',
      blocks: [
        {
          type: 'paragraph',
          text: 'Esta política pode ser atualizada para refletir mudanças no site ou na legislação. A data da versão vigente é indicada no início da página.',
        },
      ],
    },
  ],
};
