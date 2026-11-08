// Pulls the Teletype blog feed into app/blog-posts.json (run before every build).
// If Teletype is unreachable the previous snapshot is kept, so the build never breaks.
import { readFile, writeFile } from 'node:fs/promises';

const FEED = 'https://teletype.in/rss/uxata';
const OUT = new URL('../app/blog-posts.json', import.meta.url);
const MONTHS = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];

const decode = s => s.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&');
const cdata = s => s.replace(/^\s*<!\[CDATA\[/, '').replace(/\]\]>\s*$/, '');

function parse(xml) {
  return [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)].map(([, item]) => {
    const tag = name => (item.match(new RegExp(`<${name}[^>]*>([\\s\\S]*?)</${name}>`)) || [])[1] || '';
    const description = cdata(tag('description'));
    const date = new Date(tag('pubDate'));
    const cover = (item.match(/<media:content[^>]*url="([^"]+)"/) || [])[1] || (description.match(/<img[^>]*src="([^"]+)"/) || [])[1] || '';
    return {
      title: decode(cdata(tag('title'))).trim(),
      url: decode(tag('link')).split('?')[0],
      date: date.toISOString().slice(0, 10),
      dateLabel: `${date.getUTCDate()} ${MONTHS[date.getUTCMonth()]} ${date.getUTCFullYear()}`,
      lead: decode(description.replace(/<img[^>]*>(<\/img>)?/g, '').replace(/<[^>]+>/g, '')).trim(),
      cover: decode(cover),
    };
  });
}

async function load() {
  const posts = [];
  for (let offset = 0; offset < 200; offset += 10) {
    const response = await fetch(`${FEED}?offset=${offset}`, { headers: { 'user-agent': 'Mozilla/5.0 (portfolio build)' }, signal: AbortSignal.timeout(20000) });
    if (!response.ok) throw new Error(`Teletype responded ${response.status}`);
    const page = parse(await response.text());
    if (!page.length) break;
    posts.push(...page);
  }
  if (!posts.length) throw new Error('feed is empty');
  return posts;
}

try {
  const posts = await load();
  await writeFile(OUT, JSON.stringify({ source: 'https://teletype.in/@uxata', posts }, null, 1) + '\n');
  console.log(`blog: ${posts.length} posts saved`);
} catch (error) {
  console.warn(`blog: keeping the existing snapshot (${error.message})`);
  try { await readFile(OUT); } catch { await writeFile(OUT, JSON.stringify({ source: 'https://teletype.in/@uxata', posts: [] }) + '\n'); }
}
