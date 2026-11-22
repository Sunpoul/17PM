'use client';

import { useState } from 'react';

export default function ArticleActions({ title, url }: { title: string; url: string }) {
  const [status, setStatus] = useState<'copied' | 'copy-unavailable' | null>(null);

  async function shareArticle() {
    setStatus(null);

    if (typeof navigator.share === 'function') {
      try {
        await navigator.share({ title, url });
        return;
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') return;
      }
    }

    try {
      await navigator.clipboard.writeText(url);
      setStatus('copied');
    } catch {
      setStatus('copy-unavailable');
    }
  }

  return (
    <>
      <div className="blog-article-actions">
        <button className="pill outline" type="button" onClick={shareArticle}>
          Поделиться статьёй
        </button>
        <a className="pill primary" href="https://t.me/uxxata" target="_blank" rel="noopener noreferrer">
          Подписаться в Telegram
        </a>
      </div>
      <p className="blog-article-share-status" role="status">
        {status === 'copied' && 'Ссылка скопирована.'}
        {status === 'copy-unavailable' && <>Ссылка на статью <a href={url}>{url}</a></>}
      </p>
    </>
  );
}
