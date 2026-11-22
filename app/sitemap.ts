import type { MetadataRoute } from 'next';
import { articles, articlePath } from './blog/articles';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: 'https://17pm.ru', changeFrequency: 'monthly', priority: 1 },
    { url: 'https://17pm.ru/blog/' },
    ...articles.map(article => ({
      url: 'https://17pm.ru' + articlePath(article.slug), lastModified: article.date,
    })),
  ];
}
