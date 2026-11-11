/** Informa apenas os dados e comportamentos confirmados no site e na publicação atual. */
export type PolicyBlock =
  | { type: 'paragraph'; text: string }
  | { type: 'list'; items: readonly string[] };

export interface PolicySection {
  id: string;
  title: string;
  blocks: readonly PolicyBlock[];
}

export const privacyPolicyContent = {
  eyebrow: 'Privacidade',
  title: 'Política de Privacidade',
  intro:
    'Esta página descreve os dados solicitados pelo site e o funcionamento conhecido do formulário de contato.',
  draftNotice:
    'Esta versão se limita às informações disponíveis no site e no projeto. A identificação jurídica da empresa, os registros da hospedagem e os prazos de retenção não foram informados.',
  tocLabel: 'Nesta página',
  sections: [
    {
      id: 'responsavel',
      title: 'Identificação',
      blocks: [
        {
          type: 'paragraph',
          text: 'O site se identifica como Crédito e Fomento. A razão social e o endereço da empresa não estão informados nesta página.',
        },
      ],
    },
    {
      id: 'dados-coletados',
      title: 'Dados solicitados pelo formulário',
      blocks: [
        { type: 'paragraph', text: 'O formulário solicita:' },
        {
          type: 'list',
          items: [
            'nome da empresa (obrigatório);',
            'CNPJ (obrigatório);',
            'WhatsApp (obrigatório);',
            'e-mail corporativo (opcional).',
          ],
        },
        {
          type: 'paragraph',
          text: 'O formulário não solicita documentos, extratos bancários ou outras informações. Não os envie por esse canal.',
        },
      ],
    },
    {
      id: 'finalidade',
      title: 'Finalidade',
      blocks: [
        {
          type: 'paragraph',
          text: 'As informações são solicitadas para iniciar o atendimento comercial da empresa.',
        },
      ],
    },
    {
      id: 'envio',
      title: 'Envio das informações',
      blocks: [
        {
          type: 'paragraph',
          text: 'Ao enviar, o formulário faz uma requisição ao endpoint de contato do site. A publicação atual é estática no GitHub Pages e não inclui esse endpoint. Por isso, o site informa que o envio está indisponível e não confirma o recebimento das informações pela equipe.',
        },
        {
          type: 'paragraph',
          text: 'As informações disponíveis sobre os registros técnicos da hospedagem e o tempo de retenção desses registros não foram fornecidas.',
        },
      ],
    },
    {
      id: 'navegacao',
      title: 'Navegação no site',
      blocks: [
        {
          type: 'paragraph',
          text: 'O código do site não implementa cookies, ferramentas de análise de navegação ou armazenamento local no navegador. Esta informação se refere ao site; não descreve os dados técnicos que podem ser tratados pelo serviço de hospedagem.',
        },
      ],
    },
    {
      id: 'direitos',
      title: 'Solicitações sobre dados pessoais',
      blocks: [
        {
          type: 'paragraph',
          text: 'A legislação prevê direitos relacionados aos dados pessoais, como solicitar confirmação de tratamento, acesso e correção. O canal de contato publicado no site é o WhatsApp comercial, disponível na página de contato.',
        },
      ],
    },
    {
      id: 'alteracoes',
      title: 'Alterações desta página',
      blocks: [
        {
          type: 'paragraph',
          text: 'Esta página será atualizada quando houver informações confirmadas sobre mudanças no site ou no tratamento dos dados.',
        },
      ],
    },
  ],
} as const;
