import entries from './articles.json';

export const articles = [...entries].sort((a, b) => b.date.localeCompare(a.date));
export const articlePath = (slug: string) => `/blog/${slug}/`;
export const articleDate = (date: string) =>
  new Intl.DateTimeFormat('ru-RU', {
    day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC',
  }).format(new Date(date));
