export interface Project {
  id: string;
  title: string;
  tags: string[];
  year: string;
  description: string;
  gradient: string;
  span: '2x2' | '2x1' | '1x1';
  status: 'live' | 'coming-soon';
}

export const projects: Project[] = [
  {
    id: 'vv-boutique',
    title: 'V&V Boutique',
    tags: ['UX Design', 'Branding', 'Research'],
    year: '2025',
    description:
      'Bridging editorial warmth with transactional clarity for a London-based premium fashion boutique.',
    gradient: 'linear-gradient(135deg, #120810 0%, #241220 40%, #3d1a2a 100%)',
    span: '2x2',
    status: 'live',
  },
  {
    id: 'beextrart',
    title: 'Beextrart',
    tags: ['Branding', 'Logo Design', 'Identity'],
    year: '2025',
    description:
      'A refined visual identity for a premium eyelash artistry brand — where beauty meets bold simplicity.',
    gradient: 'linear-gradient(135deg, #0d0b06 0%, #1a1508 40%, #261e0a 100%)',
    span: '2x1',
    status: 'coming-soon',
  },
  {
    id: 'nexgen',
    title: 'NexGen',
    tags: ['Web Design', 'UI/UX'],
    year: '2025',
    description:
      'A forward-thinking digital presence for a next-generation tech company.',
    gradient: 'linear-gradient(135deg, #020b18 0%, #051428 40%, #082040 100%)',
    span: '1x1',
    status: 'coming-soon',
  },
  {
    id: 'car-service',
    title: 'Car Service',
    tags: ['Web Design', 'UI Design'],
    year: '2024',
    description:
      'Clean, trustworthy interface design for a modern automotive service business.',
    gradient: 'linear-gradient(135deg, #0c0d0f 0%, #161820 40%, #1e2030 100%)',
    span: '1x1',
    status: 'coming-soon',
  },
];
