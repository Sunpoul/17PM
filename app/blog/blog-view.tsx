'use client';

import { useState } from 'react';
import type { BlogIndex } from './blog-index';

const POSTS_STEP = 12;

export default function BlogView({ posts, source, standalone = false }: BlogIndex & { standalone?: boolean }) {
  const [visible, setVisible] = useState(POSTS_STEP);
  const Heading = standalone ? 'h1' : 'h2';

  return (
    <>
      <section className="panel view-heading blog-heading">
        <Heading>Блог</Heading>
        <p>Статьи о дизайне интерфейсов и продуктов.</p>
      </section>
      {posts.length > 0 ? (
        <section className="panel work-panel" aria-label="Статьи">
          <div className="project-list">
            {posts.slice(0, visible).map(post => (
              <article className="project" key={post.url}>
                <a className="project-trigger" href={post.url}
                  target={post.external ? '_blank' : undefined}
                  rel={post.external ? 'noopener noreferrer' : undefined}
                  aria-label={post.external ? `Читать на Teletype: ${post.title}` : undefined}>
                  {post.cover ? (
                    <img src={post.cover} alt="" width="1200" height="900"
                      loading="lazy" referrerPolicy="no-referrer" />
                  ) : <span className="post-no-cover" />}
                  <div className="project-copy">
                    <time className="micro post-date" dateTime={post.date}>{post.dateLabel}</time>
                    <div className="project-title"><h3>{post.title}</h3></div>
                  </div>
                </a>
              </article>
            ))}
          </div>
        </section>
      ) : <section className="panel view-heading"><p>Статьи пока не загрузились.</p></section>}
      <div className="panel external-panel">
        {posts.length > visible && (
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
