import blog from '../blog-posts.json';
import { articles, articleDate, articlePath } from './articles';
import { isBlogTopic, type BlogTopic } from './blog-topics';

type BlogPost = {
  title: string;
  url: string;
  date: string;
  dateLabel: string;
  cover: string;
  lead: string;
  topics: BlogTopic[];
  external: boolean;
};

export type BlogIndex = {
  source: string;
  posts: BlogPost[];
};

function inferTopics(title: string, lead: string): BlogTopic[] {
  const text = `${title} ${lead}`;
  const topics: BlogTopic[] = ['ux-ui'];
  if (/(?:^|[^a-zа-яё0-9])(?:ai|ии)(?:$|[^a-zа-яё0-9])|искусственн[а-яё]+ интеллект|chat\s?gpt/iu.test(text)) {
    topics.push('ai');
  }
  if (/e[\s-]?commerce|интернет[\s-]?магазин|электронн[а-яё]+ коммерц|оформлени[ея] заказ|чекаут/iu.test(text)) {
    topics.push('ecom');
  }
  return topics;
}

function preview(lead: string) {
  const text = lead.replace(/\s+/g, ' ').trim();
  if (text.length <= 250) return text;
  return text.slice(0, 250).replace(/\s\S*$/, '') + '…';
}

export const blogIndex: BlogIndex = {
  source: blog.source,
  posts: [
    ...articles.map(article => ({
      title: article.title, url: articlePath(article.slug), date: article.date,
      dateLabel: articleDate(article.date), cover: article.cover, lead: preview(article.lead),
      topics: article.topics?.filter(isBlogTopic) || inferTopics(article.title, article.lead),
      external: false,
    })),
    ...blog.posts.map(({ title, url, date, dateLabel, cover, lead }) => ({
      title, url, date, dateLabel, cover, lead: preview(lead),
      topics: inferTopics(title, lead), external: true,
    })),
  ].sort((a, b) => b.date.localeCompare(a.date)),
};
