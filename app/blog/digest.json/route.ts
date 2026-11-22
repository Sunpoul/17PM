import { articles, articlePath } from '../articles';

const site = 'https://17pm.ru';
export const dynamic = 'force-static';

export function GET() {
  return Response.json(articles.slice(0, 50).map(article => ({
    url: site + articlePath(article.slug),
    title: article.title,
    summary: article.telegram.summary,
    test: article.telegram.test,
    photo_url: site + article.cover,
    source: 'Читать на 17pm.ru',
  })));
}
