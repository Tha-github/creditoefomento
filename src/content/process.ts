import {
  Building2,
  Compass,
  Handshake,
  type LucideIcon,
  MapPinned,
  MessagesSquare,
  ScanSearch,
} from 'lucide-react';

export const processContent = {
  eyebrow: 'Como funciona',
  title: 'Uma jornada financeira alinhada às necessidades da sua empresa.',
  steps: [
    {
      title: 'Primeiro contato',
      description:
        'A empresa apresenta sua necessidade e informa qual solução financeira deseja conhecer.',
    },
    {
      title: 'Entendimento da operação',
      description:
        'Nossa equipe busca compreender o cenário, os recebíveis ou as características da necessidade apresentada.',
    },
    {
      title: 'Análise e estruturação',
      description:
        'As informações são avaliadas para identificar alternativas compatíveis com as características da operação.',
    },
    {
      title: 'Apresentação da solução',
      description:
        'As possibilidades identificadas são apresentadas para avaliação e continuidade do atendimento.',
    },
  ],
  note: 'As etapas descrevem o atendimento e não representam garantia de aprovação, liberação de recursos ou contratação.',
} as const;

interface ApproachItem {
  title: string;
  description: string;
  icon: LucideIcon;
}

export const approachContent: {
  eyebrow: string;
  title: string;
  items: readonly ApproachItem[];
} = {
  eyebrow: 'Como atuamos',
  title: 'O que orienta cada atendimento.',
  items: [
    {
      title: 'Atendimento consultivo',
      description: 'Diálogo voltado a compreender o momento e as prioridades de cada empresa.',
      icon: MessagesSquare,
    },
    {
      title: 'Visão estratégica',
      description: 'Avaliação das alternativas considerando o contexto e os objetivos do negócio.',
      icon: Compass,
    },
    {
      title: 'Soluções empresariais',
      description: 'Modalidades financeiras voltadas às necessidades do ambiente corporativo.',
      icon: Building2,
    },
    {
      title: 'Análise individualizada',
      description: 'Cada operação é avaliada de acordo com as suas próprias características.',
      icon: ScanSearch,
    },
    {
      title: 'Relacionamento profissional',
      description: 'Comunicação clara e condução cuidadosa ao longo do atendimento.',
      icon: Handshake,
    },
    {
      title: 'Atuação nacional',
      description: 'Empresas de diferentes regiões do Brasil podem buscar o nosso atendimento.',
      icon: MapPinned,
    },
  ],
};
