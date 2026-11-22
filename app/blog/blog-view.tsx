'use client';

import { useId, useState } from 'react';
import type { BlogIndex } from './blog-index';
import { blogFilters, type BlogFilter } from './blog-topics';

const POSTS_STEP = 12;
const filters = Object.keys(blogFilters) as BlogFilter[];

export default function BlogView({ posts, source, standalone = false }: BlogIndex & { standalone?: boolean }) {
  const [visible, setVisible] = useState(POSTS_STEP);
  const [filter, setFilter] = useState<BlogFilter>('all');
  const resultsId = useId();
  const Heading = standalone ? 'h1' : 'h2';
  const results = filter === 'all' ? posts : posts.filter(post => post.topics.includes(filter));

  function chooseFilter(value: BlogFilter) {
    if (filter === value) return;
    setFilter(value);
    setVisible(POSTS_STEP);
  }

  return (
    <>
      <section className="panel view-heading blog-heading">
        <Heading>Блог</Heading>
        <p>Статьи о дизайне интерфейсов и продуктов.</p>
        <div className="blog-filters" role="group" aria-label="Темы блога">
          {filters.map(value => (
            <button className="pill neutral" key={value} type="button" aria-pressed={filter === value}
              aria-controls={resultsId} onClick={() => chooseFilter(value)}>
              {blogFilters[value]}
            </button>
          ))}
        </div>
      </section>
      <section className="panel work-panel" id={resultsId} aria-label="Статьи">
        {results.length > 0 ? (
          <div className="project-list blog-grid">
            {results.slice(0, visible).map((post, index) => {
              const featured = index === 0;

              return (
                <article className={featured ? 'project blog-post-featured' : 'project'} key={post.url}>
                  <a className="project-trigger" href={post.url}
                    target={post.external ? '_blank' : undefined}
                    rel={post.external ? 'noopener noreferrer' : undefined}
                    aria-label={post.external ? `Читать на Teletype: ${post.title}` : undefined}>
                    {post.cover ? (
                      <img src={post.cover} alt="" width="1200" height="900"
                        loading={featured ? 'eager' : 'lazy'} referrerPolicy="no-referrer" />
                    ) : <span className="post-no-cover" />}
                    <div className="project-copy">
                      <time className="micro post-date" dateTime={post.date}>{post.dateLabel}</time>
                      <div className="project-title"><h3>{post.title}</h3></div>
                      {featured && post.lead && <p>{post.lead}</p>}
                    </div>
                  </a>
                </article>
              );
            })}
          </div>
        ) : (
          <p className="blog-empty" role="status">
            {filter === 'all' ? 'Статьи пока не загрузились.' : 'По этой теме пока нет статей.'}
          </p>
        )}
      </section>
      <div className="panel external-panel">
        {results.length > visible && (
          <button type="button" className="pill neutral" onClick={() => setVisible(count => count + POSTS_STEP)}>
            Показать ещё
          </button>
        )}
        <a className="pill outline" href={source} target="_blank" rel="noopener noreferrer">
          Блог на Teletype
        </a>
      </div>
    </>
  );
}
