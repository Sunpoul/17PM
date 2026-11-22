import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { articles, articleDate, articlePath } from '../articles';
import ArticleActions from '../article-actions';

type Props = { params: Promise<{ slug: string }> };
export const dynamicParams = false;
export const generateStaticParams = () => articles.map(({ slug }) => ({ slug }));

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = articles.find(item => item.slug === slug);
  if (!article) notFound();
  const title = `${article.title} · 17PM`;
  const url = articlePath(slug);

  return {
    title,
    description: article.lead,
    alternates: { canonical: url },
    openGraph: {
      title, description: article.lead, type: 'article', locale: 'ru_RU', url,
      publishedTime: article.date,
      images: [{
        url: article.cover, width: article.coverWidth, height: article.coverHeight, alt: article.coverAlt,
      }],
    },
    twitter: { card: 'summary_large_image', title, description: article.lead, images: [article.cover] },
  };
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = articles.find(item => item.slug === slug);
  if (!article) notFound();

  return (
    <>
      <a className="skip-link" href="#article">Перейти к статье</a>
      <div className="site-shell">
        <header className="topbar">
          <a className="brand" href="/" aria-label="17PM — на главную">17PM</a>
          <a className="pill outline" href="/blog/">Все статьи</a>
        </header>
        <main id="article" tabIndex={-1}>
          <article className="panel blog-article">
            <header className="blog-article-header">
              <h1>{article.title}</h1>
              <p className="blog-article-lead">{article.lead}</p>
              <hr className="blog-article-divider" />
              <time className="micro" dateTime={article.date}>{articleDate(article.date)}</time>
              <p className="blog-article-credit">
                Разбор исследования {article.source.name}. Автор оригинала — {article.source.author}.
                {' '}<a href={article.source.url}>Оригинал на английском</a>
              </p>
              <ArticleActions title={article.title} url={`https://17pm.ru${articlePath(article.slug)}`} />
            </header>
            <figure>
              <img src={article.cover} alt={article.coverAlt}
                width={article.coverWidth} height={article.coverHeight} fetchPriority="high" />
              <figcaption>
                {article.coverCredit}{' '}
                <a href={article.coverSourceUrl || article.source.url}>Оригинал изображения</a>
              </figcaption>
            </figure>
            <div className="blog-article-body">
              {article.sections.map(section => (
                <section key={section.title}>
                  <h2>{section.title}</h2>
                  {section.paragraphs.map(paragraph => <p key={paragraph}>{paragraph}</p>)}
                </section>
              ))}
            </div>
          </article>
        </main>
      </div>
    </>
  );
}
