// Frequently asked questions for the Help page.
// All visitor-facing text lives here (not in the component) so other languages can be
// added through the shared visitor translation dictionary later.
// Contact values come from MINT_CONTACT in mintContact.ts - do not retype them here.
import { paths } from '../../routes/paths';
import { MINT_CONTACT } from './mintContact';

export interface FaqLink {
  label: string;
  /** Internal route (react-router). */
  to: string;
}

export interface FaqItem {
  id: string;
  question: string;
  /** Short, plain answer. Give the key point first. */
  answer: string;
  link?: FaqLink;
}

export interface FaqGroup {
  id: string;
  title: string;
  items: FaqItem[];
}

export interface FaqStrings {
  heading: string;
  intro: string;
  expandAll: string;
  collapseAll: string;
  groups: FaqGroup[];
}

export const faqStrings: FaqStrings = {
  heading: 'Frequently asked questions',
  intro: 'Tap a question to see the answer.',
  expandAll: 'Expand all',
  collapseAll: 'Collapse all',
  groups: [
    {
      id: 'planning',
      title: 'Planning your visit',
      items: [
        {
          id: 'open',
          question: 'When is the museum open?',
          answer:
            'The museum is open from Tuesday to Sunday, 9:30 am to 6:30 pm. The last admission is at 5:30 pm. It is closed on Mondays.',
        },
        {
          id: 'where',
          question: 'Where is the museum?',
          answer:
            'It is at 26 Seah Street, Singapore 188382, near Raffles Hotel. The nearest MRT stations are Bugis Station (Exit A) and Esplanade Station (Exit F), each about a 5 minute walk. City Hall Station (Exit A) is about 7 minutes and Bras Basah Station (Exit A) is about 10 minutes.',
        },
        {
          id: 'ticket',
          question: 'How much is a ticket?',
          answer:
            'Adult general admission starts from S$30. Children aged 6 and under enter free. Please check ticketing.emint.com for the current prices of child and senior tickets.',
        },
        {
          id: 'how-long',
          question: 'How long should I stay?',
          answer:
            'Most visitors spend one to two hours. Allow more time if you join a guided tour or use the augmented reality experience.',
        },
        {
          id: 'tour',
          question: 'Can I join a guided tour?',
          answer:
            'Yes. The Around the World in 60 Minutes tour starts from S$33 and must be booked before your visit at ticketing.emint.com. Some tickets also include a short 15 minute tour, which depends on availability.',
        },
      ],
    },
    {
      id: 'inside',
      title: 'Inside the museum',
      items: [
        {
          id: 'start-floor',
          question: 'Which floor should I start on?',
          answer:
            'You can start on any level. The levels are Level 2 Collectables, Level 3 Childhood Favourites, Level 4 Characters and Level 5 Outerspace. The Rooftop has the vintage enamel sign gallery. Take the stairs to see small exhibitions on the stairwell landings.',
        },
        {
          id: 'photos',
          question: 'Can I take photos?',
          answer:
            'Photos are reported to be allowed in most areas. Please do not use flash or tripods, because they can harm the exhibits.',
        },
        {
          id: 'wheelchair',
          question: 'Is the museum wheelchair accessible?',
          answer:
            'Ticketing partners describe the museum as wheelchair accessible. If you need special arrangements, please contact the museum before you visit.',
        },
        {
          id: 'toilets',
          question: 'Are there toilets and seats?',
          answer:
            'Visitors report toilets and seating on the floors. The museum has not confirmed this, so please ask staff if you need help.',
        },
      ],
    },
    {
      id: 'guide',
      title: 'Using this guide',
      items: [
        {
          id: 'chatbot',
          question: 'What can the chatbot help me with?',
          answer:
            'The chatbot can answer questions about MINT, such as opening hours, tickets and what is on each level. It may not know everything. For other help, ask a member of staff.',
          link: { label: 'Open the chatbot', to: paths.chatbot },
        },
        {
          id: 'ask-staff',
          question: 'How do I ask staff for help?',
          answer:
            'Use the help request form at the top of this page. Choose the area you are in, describe what you need, and send it. Your request and area are shared with museum staff. We do not ask for your name.',
        },
        {
          id: 'contact',
          question: 'Who can I contact outside the museum?',
          // Contact values come from MINT_CONTACT so they are maintained in one place.
          answer: `Message or call ${MINT_CONTACT.phoneDisplay}, or email ${MINT_CONTACT.email}.`,
        },
      ],
    },
  ],
};
