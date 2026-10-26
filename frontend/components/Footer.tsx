import React from 'react';
import Link from 'next/link';
import Logo from './Logo';

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-white border-t border-slate-800 pt-12 sm:pt-16 pb-10 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto space-y-10 sm:space-y-12">
        {/* 4-Column Structured Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 text-xs">
          
          {/* Col 1: Brand & Methodology Positioning */}
          <div className="space-y-3.5 lg:pr-4">
            <Logo variant="footer" href="/" />
            <p className="text-slate-400 text-xs leading-relaxed">
              Hệ thống thẩm định &amp; nghiên cứu thị trường bằng công nghệ tác tử AI độc quyền. Khảo sát 1.000 - 2.000 personas giả lập chuẩn phân tầng Niên giám GSO trong 60 giây, tiết kiệm 95% chi phí.
            </p>
            <div className="pt-1 flex flex-wrap gap-2 text-[10px] font-mono">
              <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-amber-400">
                Cochran 95%
              </span>
              <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-emerald-400">
                Privacy-by-Design
              </span>
              <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300">
                VietQR Pro 24/7
              </span>
            </div>
          </div>

          {/* Col 2: Kho Báo Cáo & Mô Hình */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-amber-400">
              Kho Báo Cáo &amp; Nghiên Cứu
            </h4>
            <ul className="space-y-2 text-slate-400">
              <li>
                <Link
                  href="/thu-vien"
                  className="text-amber-400 hover:text-amber-300 font-bold inline-flex items-center gap-1.5 transition-colors"
                >
                  <span>Kho Báo Cáo Ngành 2026 (Tải PDF)</span>
                  <span>→</span>
                </Link>
              </li>
              <li>
                <Link href="/thu-vien" className="hover:text-white transition-colors">
                  F&amp;B · Đồ Uống Ít Đường Thảo Mộc (PSM)
                </Link>
              </li>
              <li>
                <Link href="/thu-vien" className="hover:text-white transition-colors">
                  Trà Kombucha Bản Địa (Nielsen BASES)
                </Link>
              </li>
              <li>
                <Link href="/thu-vien" className="hover:text-white transition-colors">
                  Cà Phê Cold Brew Đóng Lon (Van Westendorp)
                </Link>
              </li>
              <li>
                <Link href="/thu-vien" className="hover:text-white transition-colors">
                  Bánh Kẹo Quà Biếu Mùa Vụ (A/B Testing)
                </Link>
              </li>
              <li>
                <Link href="/tra-cuu" className="text-sky-400 hover:text-sky-300 transition-colors inline-flex items-center gap-1 pt-1">
                  <span>🔍 Tra cứu báo cáo bảo mật</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Academic & Documentation */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-amber-400">
              Cơ Sở Khoa Học
            </h4>
            <ul className="space-y-2 text-slate-400">
              <li>
                <Link href="/chuan-phuong-phap" className="hover:text-white transition-colors font-semibold text-slate-200">
                  Tiêu Chuẩn 9 Phương Pháp Nghiên Cứu
                </Link>
              </li>
              <li>
                <Link href="/minh-bach-khoa-hoc" className="hover:text-white transition-colors">
                  Minh Bạch Khoa Học &amp; Thống Kê
                </Link>
              </li>
              <li>
                <Link href="/bach-thu" className="hover:text-white transition-colors">
                  Bạch Thư Phương Pháp Luận C-Level
                </Link>
              </li>
              <li>
                <Link href="/minh-bach-khoa-hoc" className="hover:text-white transition-colors">
                  Khung Đối Chuẩn Niên Giám GSO
                </Link>
              </li>
              <li>
                <a href="/#phuong-phap" className="hover:text-white transition-colors">
                  Ma Trận Chọn Mô Hình Theo Bài Toán
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Support & Operations */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-amber-400">
              Vận Hành &amp; Hỗ Trợ
            </h4>
            <ul className="space-y-2 text-slate-400">
              <li>
                <Link href="/wizard" className="text-amber-400 hover:text-amber-300 font-bold inline-flex items-center gap-1 transition-colors">
                  <span>Khởi tạo khảo sát mới ngay</span>
                  <span>→</span>
                </Link>
              </li>
              <li>
                <a href="/#bang-gia" className="hover:text-white transition-colors">
                  Bảng giá trọn gói doanh nghiệp
                </a>
              </li>
              <li>
                <span className="text-slate-400">Thanh toán: </span>
                <span className="text-slate-200">VietQR 24/7 (Kích hoạt tự động)</span>
              </li>
              <li>
                <span className="text-slate-400">Hỗ trợ kỹ thuật: </span>
                <a href="mailto:hi@1booking.asia" className="text-amber-400 hover:underline">
                  hi@1booking.asia
                </a>
              </li>
              <li>
                <span className="text-slate-400">Hệ sinh thái: </span>
                <a href="https://1booking.asia" target="_blank" rel="noreferrer" className="text-slate-300 hover:text-white">
                  1booking.asia
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Legal Disclaimer Box */}
        <div className="pt-6 border-t border-slate-900">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 sm:p-6 text-slate-300 text-xs sm:text-sm leading-relaxed space-y-3 shadow-inner">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-xs sm:text-sm uppercase tracking-wider">
              <span>⚖️</span>
              <span>Điều khoản khước từ trách nhiệm &amp; Bảo vệ dữ liệu (Disclaimer)</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
              INSIGHT AI là công cụ mô phỏng giả lập tác tử AI hỗ trợ thử nghiệm ý tưởng và tối ưu hóa chi phí nghiên cứu ban đầu. Kết quả khảo sát mang tính chất tham khảo khoa học, không thay thế hoàn toàn cho các quyết định đầu tư tài chính hoặc pháp lý thực tế của doanh nghiệp.
            </p>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-normal">
              Hệ thống vận hành theo nguyên tắc <em className="text-slate-200">Privacy-by-Design</em>, toàn bộ hồ sơ khách hàng giả lập là dữ liệu tổng hợp (Synthetic Personas), không thu thập hoặc lưu trữ thông tin định danh cá nhân thật (PII-free) của bất kỳ công dân nào, đáp ứng 100% quy định của <em className="text-slate-200">Nghị định 13/2023/NĐ-CP</em> và <em className="text-slate-200">Luật Bảo vệ dữ liệu cá nhân</em>.
            </p>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-normal pt-2.5 border-t border-slate-800">
              <strong className="text-slate-300 not-italic">Tuyên bố độc lập:</strong> Nền tảng INSIGHT AI được nghiên cứu và phát triển hoàn toàn độc lập. Mọi phân tích được thực hiện bằng mô hình tác tử AI độc quyền kết hợp các phương pháp luận học thuật thực chứng, giúp doanh nghiệp tối ưu chi phí và kiểm chứng giả thuyết thị trường trước khi ra quyết định kinh doanh.
            </p>
          </div>
        </div>

        {/* Bottom copyright line */}
        <div className="pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-3 text-slate-400 text-xs">
          <div>
            &copy; {new Date().getFullYear()} INSIGHT AI · Nền tảng Nghiên Cứu Thị Trường Bằng AI Tốc Độ Cao.
          </div>
          <div className="flex items-center gap-4 text-[11px] font-mono text-slate-400">
            <span>Khung đối chuẩn GSO</span>
            <span>·</span>
            <span>Chuẩn ESOMAR / AAPOR</span>
            <span>·</span>
            <span>Bảo mật 100%</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
