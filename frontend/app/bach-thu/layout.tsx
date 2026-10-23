import type { Metadata } from 'next';

export const metadata: Metadata = {
  metadataBase: new URL('https://insight.1booking.asia'),
  title: 'Bạch Thư Phương Pháp Luận — INSIGHT AI | insight.1booking.asia',
  description:
    'Tài liệu khoa học chính thức giải thích bản chất công nghệ tác tử AI mô phỏng, cơ sở toán học Cochran, độ tin cậy 95% và cẩm nang ứng dụng bảo vệ dòng vốn dành cho Hội đồng Quản trị và Ban Giám đốc.',
  keywords:
    'bạch thư nghiên cứu thị trường, INSIGHT AI, synthetic data, multi-agent simulation, phương pháp luận AI, Cochran, Nielsen BASES, Van Westendorp, bảo vệ dòng vốn',
  openGraph: {
    title: 'Bạch Thư Phương Pháp Luận — INSIGHT AI',
    description:
      'Tài liệu khoa học chính thức giải thích bản chất công nghệ tác tử AI mô phỏng, cơ sở toán học Cochran và cẩm nang bảo vệ dòng vốn C-Level.',
    url: 'https://insight.1booking.asia/bach-thu',
    siteName: 'INSIGHT AI',
    images: [
      {
        url: '/whitepaper-hero.jpg',
        width: 1200,
        height: 630,
        alt: 'Bạch Thư Phương Pháp Luận INSIGHT AI',
      },
    ],
    locale: 'vi_VN',
    type: 'article',
  },
};

export default function BachThuLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
