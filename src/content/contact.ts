export const contactContent = {
  eyebrow: 'Contato',
  title: 'Conte-nos sobre a necessidade da sua empresa.',
  description:
    'Envie as informações iniciais pelo formulário ou, se preferir, fale diretamente com nossa equipe pelo WhatsApp.',
  whatsappLabel: 'WhatsApp comercial',
  sensitiveDataNote:
    'Não envie documentos financeiros, extratos bancários ou dados sensíveis por este formulário.',
  fields: {
    company: { label: 'Nome da empresa', autoComplete: 'organization' },
    cnpj: { label: 'CNPJ', placeholder: '00.000.000/0000-00' },
    email: { label: 'E-mail corporativo', placeholder: 'nome@empresa.com.br', autoComplete: 'email' },
    phone: { label: 'WhatsApp', placeholder: '(00) 00000-0000', autoComplete: 'tel-national' },
  },
  privacy: {
    summary: 'Política de Privacidade e tratamento de dados',
    items: [
      {
        term: 'Dados coletados',
        text: 'Nome da empresa, CNPJ e WhatsApp, além do e-mail corporativo caso seja informado.',
      },
      {
        term: 'Finalidade',
        text: 'Responder à sua solicitação e realizar o primeiro atendimento comercial.',
      },
      {
        term: 'Como são utilizados',
        text: 'O formulário faz uma requisição ao endpoint de contato. Na publicação atual no GitHub Pages, esse endpoint não está disponível e o site informa que o envio falhou.',
      },
      {
        term: 'Seus direitos',
        text: 'Você pode solicitar informações, correção ou exclusão dos seus dados e exercer os demais direitos previstos na LGPD.',
      },
      {
        term: 'Como falar com a empresa',
        text: 'Pelo canal indicado na Política de Privacidade.',
      },
    ],
    fullPolicy: 'Ler a Política de Privacidade completa',
    accept: 'Li e aceito a Política de Privacidade.',
  },
  submit: 'Enviar solicitação',
  submitting: 'Enviando solicitação',
  success: {
    title: 'Solicitação enviada.',
    text: 'Recebemos suas informações. Nossa equipe entrará em contato pelos dados informados para dar continuidade ao atendimento.',
    note: 'O envio dá início ao atendimento e não representa aprovação, liberação de recursos ou contratação.',
    again: 'Enviar outra solicitação',
  },
  errors: {
    validation: 'Revise os campos indicados para continuar.',
    too_fast: 'Aguarde alguns segundos e envie novamente. Suas informações foram mantidas.',
    rate_limited:
      'Recebemos muitas tentativas em pouco tempo. Tente novamente em alguns minutos ou fale pelo WhatsApp.',
    unavailable:
      'O envio pelo formulário está indisponível no momento. Sua solicitação não foi enviada. Fale com nossa equipe pelo WhatsApp.',
    failed:
      'Não foi possível enviar sua solicitação. Suas informações foram mantidas: tente novamente ou fale pelo WhatsApp.',
    whatsapp: 'Falar pelo WhatsApp',
  },
} as const;
