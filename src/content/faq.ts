import { sectionIds } from '@/config/navigation';

export interface FaqEntry {
  id: string;
  question: string;
  answer: string;
  action?: { label: string; href: string };
}

export const faqContent: {
  eyebrow: string;
  title: string;
  description: string;
  entries: readonly FaqEntry[];
} = {
  eyebrow: 'Perguntas frequentes',
  title: 'Respostas para iniciar a conversa com clareza.',
  description:
    'Condições específicas dependem da análise de cada operação e são tratadas durante o atendimento.',
  entries: [
    {
      id: 'o-que-e',
      question: 'O que é antecipação de recebíveis?',
      answer:
        'É uma operação que permite à empresa acessar, antes do vencimento, valores que tem a receber de vendas e contratos. Pode contribuir para o equilíbrio do fluxo de caixa e para a continuidade das operações.',
    },
    {
      id: 'quais-empresas',
      question: 'Quais empresas podem solicitar antecipação?',
      answer:
        'A solicitação pode ser feita por empresas que possuem recebíveis comerciais. A possibilidade de realizar a operação depende da análise da empresa, dos recebíveis apresentados e das características de cada caso.',
    },
    {
      id: 'tipos-de-recebiveis',
      question: 'Quais tipos de recebíveis podem ser analisados?',
      answer:
        'Podem ser apresentados recebíveis provenientes de vendas e contratos, como duplicatas. A possibilidade de antecipação é avaliada individualmente, de acordo com as características de cada operação.',
    },
    {
      id: 'processo',
      question: 'Como funciona o processo de análise?',
      answer:
        'A empresa apresenta sua necessidade, nossa equipe busca compreender a operação e as informações são avaliadas para identificar alternativas compatíveis. As possibilidades identificadas são então apresentadas para avaliação e continuidade do atendimento.',
    },
    {
      id: 'informacoes',
      question: 'Quais informações são necessárias para iniciar o atendimento?',
      answer:
        'Para o primeiro contato, bastam seu nome, a empresa, e-mail, telefone, a solução de interesse e uma breve descrição da necessidade. CNPJ e valor aproximado são opcionais. Não envie documentos financeiros ou extratos pelo formulário: se outras informações forem necessárias, nossa equipe orientará durante o atendimento.',
    },
    {
      id: 'todo-o-brasil',
      question: 'A Crédito e Fomento atende empresas de todo o Brasil?',
      answer:
        'A atuação da Crédito e Fomento é nacional, e empresas de diferentes regiões do país podem solicitar contato.',
    },
    {
      id: 'demais-solucoes',
      question: 'Como posso conhecer as demais soluções financeiras?',
      answer:
        'Todas as modalidades estão apresentadas na seção de soluções. Para saber mais sobre alguma delas, envie o formulário selecionando o produto de interesse ou fale com nossa equipe pelo WhatsApp.',
      action: { label: 'Ver as soluções financeiras', href: `#${sectionIds.solutions}` },
    },
    {
      id: 'garante-aprovacao',
      question: 'O envio de uma solicitação garante aprovação?',
      answer:
        'Não. O envio apenas dá início ao atendimento e não representa aprovação, liberação de recursos ou contratação. Toda operação depende de análise.',
    },
  ],
};
