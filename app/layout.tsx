import type { Metadata, Viewport } from 'next';
import './globals.css';
export const metadata: Metadata = {
  title: 'Павел Маркелов — независимый арт-директор',
  description: 'Внешний арт-дирекшн, дизайн-лидерство и авторский дизайн для студий и продуктовых команд. Помогаю находить сильные визуальные решения и развивать дизайн-компетенции.',
  metadataBase: new URL('https://17pm.ru'),
  openGraph: { title: 'Сильный дизайн начинается с сильного направления', description: 'Павел Маркелов — независимый арт-директор. Арт-дирекшн, дизайн-лидерство, авторский дизайн.', locale: 'ru_RU', type: 'website', images: [{url:'/pavel-markelov.jpg', width:1125, height:1115, alt:'Павел Маркелов — независимый арт-директор'}] },
  twitter: { card:'summary_large_image' },
  robots: { index: true, follow: true },
};
export const viewport: Viewport = { themeColor: '#000000', width: 'device-width', initialScale: 1 };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="ru"><body>{children}</body></html>;
}
