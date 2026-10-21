import type { Metadata } from 'next';
import { Playfair_Display, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import { WizardProvider } from '@/lib/wizard-context';

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  weight: ['400', '500', '600', '700', '800'],
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-serif',
  weight: ['400', '600', '700', '900'],
});

export const metadata: Metadata = {
  title: 'AI Market Research — Nghiên cứu thị trường bằng AI',
  description:
    'Nền tảng nghiên cứu thị trường AI — giả lập 1.000 người tiêu dùng Việt Nam trong 60 giây. Chuẩn Nielsen BASES, Van Westendorp, McKinsey.',
  keywords: 'nghiên cứu thị trường, AI, consumer research, Nielsen, Kantar, Vietnam, khảo sát',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" className={`${jakarta.variable} ${playfair.variable}`}>
      <body>
        <WizardProvider>{children}</WizardProvider>
      </body>
    </html>
  );
}
