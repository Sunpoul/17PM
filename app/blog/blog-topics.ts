export const blogFilters = {
  all: 'Все',
  'ux-ui': 'UX/UI',
  ai: 'AI',
  ecom: 'Ecom',
} as const;

export type BlogFilter = keyof typeof blogFilters;
export type BlogTopic = Exclude<BlogFilter, 'all'>;

export function isBlogTopic(value: string): value is BlogTopic {
  return value === 'ux-ui' || value === 'ai' || value === 'ecom';
}
