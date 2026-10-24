import type { Metadata } from 'next';
import { Playfair_Display, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import { WizardProvider } from '@/lib/wizard-context';
import BackToTop from '@/components/BackToTop';

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-serif',
  weight: ['400', '600', '700', '900'],
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://insight.1booking.asia'),
  title: 'INSIGHT AI — Nền Tảng Nghiên Cứu Thị Trường Bằng Tác Tử AI Mô Phỏng',
  description:
    'Nền tảng nghiên cứu thị trường bằng Tác tử AI Đa Nhân Khẩu (Synthetic Personas) đối chuẩn theo khung phân tầng Niên giám Thống kê GSO. Bảo chứng học thuật Cochran 95% (±3.10%), 9 mô hình chuyên sâu chuẩn ESOMAR & AAPOR.',
  keywords:
    'INSIGHT AI, nghiên cứu thị trường, AI Market Research, tác tử AI, synthetic personas, consumer simulation, Nielsen BASES, Van Westendorp, Kantar, Vietnam synthetic panel',
  authors: [{ name: 'INSIGHT AI Platform' }],
  creator: 'INSIGHT AI Platform',
  publisher: '1booking Insight Engine',
  icons: {
    icon: [
      { url: '/icon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon.png', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  openGraph: {
    title: 'INSIGHT AI — Nền Tảng Nghiên Cứu Thị Trường Bằng Tác Tử AI Mô Phỏng',
    description:
      'Mô phỏng phản ứng thị trường qua 1.000 tác tử AI phân vai theo ma trận nhân khẩu học Việt Nam trong 60 giây. Chuẩn Cochran 95% (±3.10%), 9 mô hình kinh tế học quốc tế, xuất bản báo cáo điều hành A4.',
    url: 'https://insight.1booking.asia',
    siteName: 'INSIGHT AI',
    images: [
      {
        url: '/og-banner.jpg',
        width: 1200,
        height: 630,
        alt: 'INSIGHT AI — Nền tảng Nghiên cứu Thị trường bằng Tác tử AI Mô phỏng Nhân khẩu học',
      },
    ],
    locale: 'vi_VN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'INSIGHT AI — Nền Tảng Nghiên Cứu Thị Trường Bằng Tác Tử AI Mô Phỏng',
    description:
      'Mô phỏng phản ứng thị trường qua 1.000 tác tử AI phân vai theo ma trận nhân khẩu học Việt Nam trong 60 giây. Bảo chứng học thuật Cochran 95%.',
    images: ['/og-banner.jpg'],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" className={`${jakarta.variable} ${playfair.variable}`}>
      <body className="antialiased selection:bg-amber-500 selection:text-slate-950">
        <WizardProvider>
          {children}
          <BackToTop />
        </WizardProvider>
      </body>
    </html>
  );
}
