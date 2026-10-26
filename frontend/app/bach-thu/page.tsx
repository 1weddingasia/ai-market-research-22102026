'use client';

import Link from 'next/link';
import Image from 'next/image';
import Logo from '@/components/Logo';
import Footer from '@/components/Footer';

export default function BachThuPage() {
  return (
    <div className="min-h-screen bg-[#FDFBF7] text-slate-900 selection:bg-amber-100 selection:text-amber-950 font-sans">
      {/* ── Top Reading Bar (Sticky Header) ── */}
      <header className="sticky top-0 z-50 bg-[#0A192F]/95 backdrop-blur-md border-b border-amber-500/20 text-white px-4 sm:px-8 py-3 shadow-xl">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="flex items-center gap-2 group text-xs text-slate-300 hover:text-white transition-colors"
            >
              <span className="w-6 h-6 rounded bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-xs group-hover:bg-amber-500 group-hover:text-slate-950 transition-colors">
                ←
              </span>
              <span className="font-semibold hidden sm:inline">Trang chủ</span>
            </Link>
            <span className="text-slate-600 hidden sm:inline">|</span>
            <div className="text-xs font-mono">
              <span className="text-amber-400 font-bold uppercase tracking-wider">BẠCH THƯ PHƯƠNG PHÁP LUẬN</span>
              <span className="text-slate-400 ml-2 hidden md:inline">· MONOGRAPH FOR C-LEVEL & R&D</span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/chuan-phuong-phap"
              className="hidden sm:inline-flex items-center gap-1.5 text-xs font-medium text-amber-300 hover:text-white px-3 py-1.5 rounded-lg border border-amber-500/40 hover:bg-amber-500/10 transition-all"
            >
              <span>📐 Chuẩn 9 Phương pháp</span>
            </Link>
            <Link
              href="/thu-vien"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500/20 via-amber-500/10 to-amber-500/20 text-amber-300 hover:text-white font-bold border border-amber-400/50 hover:border-amber-400 shadow-2xs transition-all text-xs shrink-0"
              title="Kho Báo Cáo Nghiên Cứu Thị Trường Chính Thức 2026 (N=2.000 Personas)"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
              <span className="font-bold tracking-tight">Báo Cáo Ngành 2026</span>
              <span className="text-[10px] font-mono uppercase bg-amber-500 text-slate-950 px-1.5 py-0.5 rounded font-black tracking-tight shrink-0">
                Xem & Tải PDF
              </span>
            </Link>
            <Link
              href="/wizard"
              className="inline-flex items-center gap-1.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs py-1.5 px-3.5 rounded-lg shadow-sm transition-all"
            >
              <span>Khởi tạo khảo sát</span>
              <span>→</span>
            </Link>
          </div>
        </div>
      </header>

      {/* ── Hero Section (Lookbook Magazine Cover Feature) ── */}
      <section className="relative bg-[#070E18] text-white overflow-hidden border-b border-amber-600/30">
        {/* Background Image with Cinematic Overlays */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/whitepaper-hero.jpg"
            alt="Boardroom AI Market Research"
            fill
            priority
            className="object-cover object-center opacity-30 mix-blend-luminosity scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#070E18] via-[#070E18]/80 to-transparent" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-amber-600/15 via-transparent to-transparent" />
        </div>

        {/* Framing Hairline Borders */}
        <div className="absolute top-6 left-6 w-8 h-8 border-t-2 border-l-2 border-amber-500/40 pointer-events-none hidden sm:block" />
        <div className="absolute top-6 right-6 w-8 h-8 border-t-2 border-r-2 border-amber-500/40 pointer-events-none hidden sm:block" />

        <div className="relative z-10 max-w-5xl mx-auto px-5 sm:px-8 pt-16 sm:pt-24 pb-20 sm:pb-28">
          {/* Magazine Masthead Metadata */}
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/40 text-amber-300 font-mono text-[11px] font-bold tracking-widest uppercase">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              TÀI LIỆU CHIẾN LƯỢC C-LEVEL · NĂM 2026
            </span>
            <span className="text-slate-500 text-xs font-mono hidden sm:inline">|</span>
            <span className="text-slate-400 text-xs font-mono tracking-wider">
              XUẤT BẢN ĐỘC QUYỀN: INSIGHT.1BOOKING.ASIA
            </span>
          </div>

          {/* Grand Magazine Headline */}
          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.15] mb-6">
            BẠCH THƯ PHƯƠNG PHÁP LUẬN:{' '}
            <span className="block mt-2 bg-gradient-to-r from-amber-200 via-amber-400 to-amber-500 bg-clip-text text-transparent">
              NỀN TẢNG NGHIÊN CỨU THỊ TRƯỜNG BẰNG TÁC TỬ AI MÔ PHỎNG
            </span>
          </h1>

          <p className="text-slate-300 text-base sm:text-xl font-light leading-relaxed max-w-4xl mb-8">
            Tài liệu khoa học và cẩm nang kinh tế lượng chính thức dành cho{' '}
            <strong className="text-amber-300 font-semibold">Hội đồng Quản trị, Ban Giám đốc (C-Level), Giám đốc Marketing (CMO)</strong> và{' '}
            <strong className="text-amber-300 font-semibold">Bộ phận Nghiên cứu & Phát triển Sản phẩm (R&D)</strong>.
          </p>

          {/* Key Executive Metrics Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 pt-6 border-t border-slate-800">
            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
              <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Quy mô cơ sở dữ liệu</div>
              <div className="text-xl sm:text-2xl font-serif font-bold text-amber-400 mt-1">1.000.000</div>
              <div className="text-[11px] text-slate-400">Khung đối chuẩn Niên giám GSO</div>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
              <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Độ tin cậy toán học</div>
              <div className="text-xl sm:text-2xl font-serif font-bold text-emerald-400 mt-1">95.0%</div>
              <div className="text-[11px] text-slate-400">Sai số ±3.1% (Cochran)</div>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
              <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Tương quan thực nghiệm</div>
              <div className="text-xl sm:text-2xl font-serif font-bold text-amber-300 mt-1">75% – 85%</div>
              <div className="text-[11px] text-slate-400">Chuẩn Stanford & Harvard</div>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
              <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Tốc độ trích xuất</div>
              <div className="text-xl sm:text-2xl font-serif font-bold text-sky-400 mt-1">60 Giây</div>
              <div className="text-[11px] text-slate-400">Báo cáo chiến lược A4 chuyên sâu</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Table of Contents & Monograph Roadmap ── */}
      <section className="bg-[#F4EFE6] border-b border-amber-900/10 py-10 px-5 sm:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-4 border-b border-amber-900/10">
            <div>
              <span className="text-amber-800 font-mono text-xs font-bold uppercase tracking-widest block">
                MỤC LỤC TỔNG QUAN
              </span>
              <h2 className="font-serif text-2xl font-bold text-slate-900 mt-1">
                7 Trụ Cột Phương Pháp Luận
              </h2>
            </div>
            <div className="flex items-center gap-4 text-xs font-mono text-slate-600">
              <span>Thời gian nghiên cứu: ~8 phút</span>
              <span>·</span>
              <span className="text-amber-800 font-bold">C-Level Monograph</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            {[
              { num: 'I', title: 'Bản Chất Công Nghệ & Tính Pháp Lý Hợp Chuẩn', anchor: '#chuong-1' },
              { num: 'II', title: 'Quy Trình Vận Hành Kỹ Thuật Khép Kín 4 Bước', anchor: '#chuong-2' },
              { num: 'III', title: 'Cơ Sở Toán Học, Sai Số Biên & Độ Tương Quan Thực Tế', anchor: '#chuong-3' },
              { num: 'IV', title: 'Bảng Đối Chiếu: Mô Phỏng AI vs. Khảo Sát Thực Địa', anchor: '#chuong-4' },
              { num: 'V', title: 'Tính Minh Bạch & Các Giới Hạn Công Nghệ Thực Tế', anchor: '#chuong-5' },
              { num: 'VI', title: 'Cẩm Nang Ứng Dụng Chiến Lược Dành Cho Doanh Nghiệp', anchor: '#chuong-6' },
              { num: 'VII', title: 'Tuyên Ngôn Giá Trị: Tấm Khiên Bảo Vệ Dòng Vốn R&D', anchor: '#chuong-7' },
            ].map((c) => (
              <a
                key={c.num}
                href={c.anchor}
                className="flex items-center gap-3 p-3 rounded-lg bg-white/70 hover:bg-white border border-amber-900/5 hover:border-amber-500/30 shadow-2xs hover:shadow-xs transition-all group"
              >
                <span className="w-8 h-8 rounded bg-amber-100 text-amber-900 font-serif font-bold text-xs flex items-center justify-center shrink-0 group-hover:bg-amber-600 group-hover:text-white transition-colors">
                  {c.num}
                </span>
                <span className="font-medium text-slate-800 group-hover:text-amber-900 transition-colors">
                  {c.title}
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ── Main Editorial Body ── */}
      <main className="max-w-4xl mx-auto px-5 sm:px-8 py-16 space-y-20">
        {/* ══════════════════════════════════════════════════════════
            CHƯƠNG I: BẢN CHẤT CÔNG NGHỆ & TÍNH PHÁP LÝ HỢP CHUẨN
           ══════════════════════════════════════════════════════════ */}
        <article id="chuong-1" className="scroll-mt-24 space-y-6">
          <div className="flex items-center gap-2 text-amber-800 font-mono text-xs font-bold uppercase tracking-widest">
            <span>CHƯƠNG I</span>
            <span>·</span>
            <span>CƠ SỞ KHOA HỌC & PHÁP LÝ</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-slate-900 leading-tight">
            Bản Chất Công Nghệ: AI Synthetic Sampling Là Gì?
          </h2>

          <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed space-y-4">
            <p className="first-letter:text-5xl first-letter:font-serif first-letter:font-bold first-letter:float-left first-letter:mr-3 first-letter:text-amber-700 first-letter:leading-none text-justify">
              Trong kỷ nguyên dữ liệu lớn và trí tuệ nhân tạo tạo sinh, nghiên cứu thị trường bằng dữ liệu mô phỏng
              (<strong>AI Synthetic Market Research</strong>) đang trở thành chuẩn mực mới được các tập đoàn công nghệ và
              hàng tiêu dùng nhanh toàn cầu áp dụng nhằm rút ngắn chu kỳ đổi mới sáng tạo từ hàng tháng xuống còn vài phút.
              Để hiểu đúng bản chất khoa học, Ban Giám đốc và đội ngũ R&D cần phân định rõ ba cấp độ tiếp cận:
            </p>

            {/* 3 Level Comparison Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 not-prose my-6">
              <div className="p-4 rounded-xl bg-slate-100/90 border border-slate-200">
                <div className="text-[10px] font-mono text-slate-500 uppercase font-bold">Cấp độ 1</div>
                <h4 className="font-serif font-bold text-slate-900 text-sm mt-1 mb-2">Khảo Sát Thực Địa Cũ</h4>
                <p className="text-xs text-slate-600 leading-normal">
                  Thuê phỏng vấn viên đi phát phiếu giấy hoặc gọi điện thoại ngẫu nhiên. Chi phí 50–300 triệu đồng, thời gian 4–6 tuần, rủi ro sai số lớn từ thao túng con người.
                </p>
              </div>
              <div className="p-4 rounded-xl bg-rose-50/80 border border-rose-200">
                <div className="text-[10px] font-mono text-rose-600 uppercase font-bold">Cấp độ 2</div>
                <h4 className="font-serif font-bold text-rose-950 text-sm mt-1 mb-2">Prompt ChatGPT Đơn Lẻ</h4>
                <p className="text-xs text-rose-900 leading-normal">
                  Gõ một câu hỏi chung chung lên chatbot AI. Kết quả mang tính suy đoán chủ quan của một mô hình đơn lẻ, hoàn toàn thiếu cấu trúc mẫu dân số và dễ bị ảo giác.
                </p>
              </div>
              <div className="p-4 rounded-xl bg-amber-50/90 border-2 border-amber-500/40 shadow-xs">
                <div className="text-[10px] font-mono text-amber-700 uppercase font-bold">Cấp độ 3 (Hệ Thống Chúng Tôi)</div>
                <h4 className="font-serif font-bold text-amber-950 text-sm mt-1 mb-2">Mô Phỏng Đa Tác Tử (Multi-Agent)</h4>
                <p className="text-xs text-amber-900 leading-normal">
                  Mô phỏng độc lập hàng nghìn phản xạ tiêu dùng từ kho dữ liệu phân tầng xã hội học chuẩn mực, lượng hóa bằng công thức kinh tế lượng quốc tế.
                </p>
              </div>
            </div>

            <h3 className="font-serif text-xl font-bold text-slate-900 mt-6 mb-3">
              Hai Trụ Cột Kỹ Thuật Nền Tảng
            </h3>
            <ul className="list-disc pl-5 space-y-2 text-slate-700">
              <li>
                <strong>Kho dữ liệu phân tầng 1.000.000 chân dung tổng hợp (Synthetic Personas Pool):</strong> Vận hành theo 2 tầng khoa học: (1) <em>Tầng khung nhân khẩu học:</em> Được chuẩn hóa và đối chuẩn (benchmark) theo Niên giám Thống kê của Tổng cục Thống kê Việt Nam (GSO), phản ánh chính xác cơ cấu dân số tại 6 vùng kinh tế trọng điểm, giới tính cân bằng (~49.8% Nam / 50.2% Nữ), các bậc tuổi từ 18 đến 65 và ngũ phân vị thu nhập; (2) <em>Tầng hành vi tiêu dùng:</em> Mô phỏng phản xạ mua sắm được tổng hợp từ dữ liệu thói quen thương mại điện tử, mức chi tiêu khả dụng và văn hóa bán lẻ bản địa tại Việt Nam.
              </li>
              <li>
                <strong>Công nghệ đa tác tử độc lập (Multi-Agent Simulation):</strong> Mỗi hồ sơ hoạt động như một cá thể
                tiêu dùng biệt lập mang đầy đủ bối cảnh sống, mức thu nhập gia đình, thói quen sinh hoạt và rào cản tâm lý
                riêng biệt. Khi đánh giá sản phẩm, mỗi tác tử chấm điểm trong môi trường cách ly tuyệt đối, loại bỏ hoàn
                toàn hiện tượng lây nhiễm tâm lý đám đông.
              </li>
            </ul>

            {/* Legal & Data Privacy Seal Box */}
            <div className="not-prose my-6 p-5 rounded-2xl bg-[#F4EFE6] border border-amber-600/30 flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-amber-600 text-white flex items-center justify-center shrink-0 font-serif font-bold text-xl shadow-xs">
                §
              </div>
              <div className="space-y-1">
                <div className="text-xs font-mono font-bold text-amber-900 uppercase tracking-wider">
                  TÍNH BẢO MẬT & HỢP CHUẨN PHÁP LÝ TUYỆT ĐỐI
                </div>
                <p className="text-xs text-slate-800 leading-relaxed">
                  Hệ thống sử dụng tập dữ liệu nhân khẩu học tổng hợp (<strong>Synthetic Demographics</strong>), hoàn toàn
                  không thu thập, sử dụng hay lưu trữ dữ liệu định danh cá nhân thật của bất kỳ công dân nào. Điều này bảo
                  đảm tuân thủ nghiêm ngặt{' '}
                  <strong className="text-slate-950 font-bold">
                    Luật Bảo vệ dữ liệu cá nhân số 91/2025/QH15
                  </strong>{' '}
                  và{' '}
                  <strong className="text-slate-950 font-bold">
                    Nghị định 356/2025/NĐ-CP
                  </strong>{' '}
                  (văn bản quy phạm pháp luật thay thế Nghị định 13/2023/NĐ-CP đã hết hiệu lực; đối chiếu hiệu lực trên
                  vbpl.vn ngày 22/10/2026). Doanh nghiệp hoàn toàn miễn nhiễm với rủi ro pháp lý về rò rỉ dữ liệu người dùng.
                </p>
              </div>
            </div>
          </div>
        </article>

        <div className="h-px bg-amber-900/10 my-12" />

        {/* ══════════════════════════════════════════════════════════
            CHƯƠNG II: QUY TRÌNH VẬN HÀNH KỸ THUẬT 4 BƯỚC
           ══════════════════════════════════════════════════════════ */}
        <article id="chuong-2" className="scroll-mt-24 space-y-6">
          <div className="flex items-center gap-2 text-amber-800 font-mono text-xs font-bold uppercase tracking-widest">
            <span>CHƯƠNG II</span>
            <span>·</span>
            <span>KIẾN TRÚC VẬN HÀNH KHÉP KÍN</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-slate-900 leading-tight">
            Quy Trình Vận Hành Kỹ Thuật 4 Bước
          </h2>
          <p className="text-slate-600 text-sm">
            Khi doanh nghiệp nhập vào bản mô tả ý tưởng sản phẩm (Concept), hệ thống tự động kích hoạt pipeline xử lý 4 giai đoạn khép kín trong 60 giây:
          </p>

          <div className="space-y-4">
            {[
              {
                step: '01',
                title: 'Trích mẫu ngẫu nhiên có phân tầng (Stratified Random Sampling)',
                desc: 'Từ kho 1.000.000 chân dung tổng hợp (Synthetic Personas) đối chuẩn theo khung phân tầng Niên giám GSO, thuật toán trích xuất ngẫu nhiên đúng quy mô mẫu doanh nghiệp lựa chọn (N = 500, 1.000, 2.000 hoặc 3.000 tác tử). Mẫu trích xuất phản ánh chính xác tỷ lệ phân bổ địa lý, lứa tuổi và thu nhập của thị trường mục tiêu, bảo đảm tính đại diện thống kê cao nhất.',
                tech: 'DuckDB In-Memory Parquet Engine + Stratified Quota Sampler',
              },
              {
                step: '02',
                title: 'Kích hoạt phản xạ tiêu dùng độc lập (Parallel Agent Evaluation)',
                desc: 'Từng hồ sơ nhân khẩu học được đưa vào mô hình ngôn ngữ lớn chuyên biệt dưới dạng một tác tử độc lập (Persona Agent). Tác tử được thiết lập bối cảnh sống chi tiết (ví dụ: Nữ, 31 tuổi, kế toán tại Hà Nội, thu nhập 18 triệu/tháng, đã lập gia đình) để tiếp nhận bản mô tả sản phẩm và đưa ra đánh giá khách quan về mức độ yêu thích, rào cản mua sắm và khoảng giá chấp nhận.',
                tech: 'Parallel Multi-Threading Worker Batches · Isolated Memory Sandbox',
              },
              {
                step: '03',
                title: 'Số hóa và lượng hóa dữ liệu phản hồi (Quantification)',
                desc: 'Toàn bộ câu trả lời định tính và định lượng của hàng nghìn tác tử được bóc tách và quy chuẩn hóa thành các chỉ số thống kê chuẩn mực: tỷ lệ Top-2-Box (chắc chắn mua / có thể mua), điểm số thuộc tính sản phẩm, mức độ độc đáo, độ thiết yếu và rào cản cảm nhận.',
                tech: 'Automated Qualitative-to-Quantitative Semantic Extraction Engine',
              },
              {
                step: '04',
                title: 'Mô hình hóa kinh tế lượng & Xuất báo cáo C-Level',
                desc: 'Dữ liệu được đưa vào xử lý qua các khung phân tích kinh điển gồm Nielsen BASES (dự báo tỷ lệ thử nghiệm Trial Rate), Van Westendorp PSM (đồ thị 4 đường giá OPP/IDP), Kantar Link A/B Testing (đối đầu bao bì/thông điệp) và U&A Study (khoảng trống ngành hàng Unmet Needs) để xuất bản bản in chiến lược A4 chuyên sâu đa trang.',
                tech: 'Econometric Modeling Suite · A4 Layout Generator · SHA256 Verification',
              },
            ].map((s) => (
              <div
                key={s.step}
                className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs hover:shadow-xs transition-shadow"
              >
                <div className="flex items-start gap-4">
                  <span className="font-serif text-2xl font-bold text-amber-600/80 shrink-0 mt-0.5">
                    {s.step}
                  </span>
                  <div className="space-y-1.5 flex-1">
                    <h3 className="font-serif font-bold text-slate-900 text-base sm:text-lg">
                      {s.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                      {s.desc}
                    </p>
                    <div className="text-[11px] font-mono text-amber-800 font-semibold pt-1">
                      ⚙️ Module kỹ thuật: {s.tech}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </article>

        <div className="h-px bg-amber-900/10 my-12" />

        {/* ══════════════════════════════════════════════════════════
            CHƯƠNG III: CƠ SỞ TOÁN HỌC & ĐỘ TƯƠNG QUAN THỰC TẾ
           ══════════════════════════════════════════════════════════ */}
        <article id="chuong-3" className="scroll-mt-24 space-y-6">
          <div className="flex items-center gap-2 text-amber-800 font-mono text-xs font-bold uppercase tracking-widest">
            <span>CHƯƠNG III</span>
            <span>·</span>
            <span>ĐỘ TIN CẬY TOÁN HỌC</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-slate-900 leading-tight">
            Cơ Sở Toán Học, Sai Số Biên & Độ Tương Quan Thực Tế
          </h2>

          <p className="text-slate-700 leading-relaxed text-justify">
            Nền tảng được xây dựng dựa trên nguyên lý xác suất thống kê nghiêm ngặt, loại bỏ hoàn toàn các con số cảm tính.
            Các chỉ số sai số biên (<strong>Margin of Error - MoE</strong>) được tính toán chuẩn tắc theo Định lý Giới hạn
            Trung tâm và Công thức chọn mẫu ngẫu nhiên của Cochran ở khoảng tin cậy 95% (với hệ số Z = 1.96):
          </p>

          {/* Mathematical Formula Callout */}
          <div className="p-4 rounded-xl bg-slate-900 text-white font-mono text-xs sm:text-sm flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <span className="text-amber-400 font-bold block mb-1">CÔNG THỨC COCHRAN CHUẨN MỰC:</span>
              <span className="text-slate-300">MoE = Z × √[ (p × (1 - p)) / N ] với Z = 1.96, p = 0.5</span>
            </div>
            <div className="text-right shrink-0 text-slate-400 text-xs">
              Độ tin cậy: <strong className="text-emerald-400">95% (Z = 1.96)</strong>
            </div>
          </div>

          {/* Cochran Sample Size Table */}
          <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-100/90 text-slate-700 font-mono text-[11px] uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Quy mô mẫu (N)</th>
                  <th className="py-3 px-4">Sai số biên toán học</th>
                  <th className="py-3 px-4">Hiển thị báo cáo</th>
                  <th className="py-3 px-4">Mục đích sử dụng thực tiễn</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700 font-mono">
                <tr>
                  <td className="py-3 px-4 font-bold text-slate-900">500 Personas</td>
                  <td className="py-3 px-4">±4.3826%</td>
                  <td className="py-3 px-4 font-bold text-amber-700">±4.3%</td>
                  <td className="py-3 px-4 font-sans text-xs">Thăm dò nhanh ý tưởng, sàng lọc concept thô</td>
                </tr>
                <tr className="bg-amber-50/50">
                  <td className="py-3 px-4 font-bold text-amber-950">1.000 Personas</td>
                  <td className="py-3 px-4">±3.1006%</td>
                  <td className="py-3 px-4 font-bold text-amber-900">±3.1%</td>
                  <td className="py-3 px-4 font-sans text-xs font-semibold text-amber-950">
                    Chuẩn mực vàng quốc tế (ESOMAR/Nielsen) cho quyết định R&D
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-bold text-slate-900">2.000 Personas</td>
                  <td className="py-3 px-4">±2.1914%</td>
                  <td className="py-3 px-4 font-bold text-slate-900">±2.2%</td>
                  <td className="py-3 px-4 font-sans text-xs">Phân tích sâu từng nhóm tuổi, địa phương và kênh phân phối</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-bold text-slate-900">3.000 Personas</td>
                  <td className="py-3 px-4">±1.7892%</td>
                  <td className="py-3 px-4 font-bold text-emerald-700">±1.8%</td>
                  <td className="py-3 px-4 font-sans text-xs">Quy mô toàn quốc bảo vệ ngân sách hàng tỷ đồng trước HĐQT</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3 className="font-serif text-xl font-bold text-slate-900 mt-8 mb-3">
            Mức Độ Tương Quan Thực Tế Theo Công Bố Quốc Tế
          </h3>
          <p className="text-slate-700 leading-relaxed text-justify">
            Dựa trên các nghiên cứu thực nghiệm được công bố bởi các nhà khoa học máy tính tại <strong>Đại học Stanford</strong> và{' '}
            <strong>Harvard Business Review</strong> về việc ứng dụng mô hình ngôn ngữ lớn (LLM) trong giả lập hành vi người tiêu dùng:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 not-prose my-4">
            <div className="p-4 rounded-xl bg-white border border-slate-200">
              <div className="text-2xl font-serif font-bold text-amber-600 mb-1">75% – 85%</div>
              <div className="font-bold text-slate-900 text-xs mb-1">Thử Nghiệm Ý Tưởng (Concept Testing)</div>
              <p className="text-[11px] text-slate-600 leading-normal">
                AI nắm bắt cực kỳ chính xác các mâu thuẫn trong định vị sản phẩm, rào cản chuyển đổi thương hiệu và nỗi đau thực tế của khách hàng.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-white border border-slate-200">
              <div className="text-2xl font-serif font-bold text-amber-600 mb-1">70% – 80%</div>
              <div className="font-bold text-slate-900 text-xs mb-1">Độ Nhạy Cảm Giá (Price Sensitivity)</div>
              <p className="text-[11px] text-slate-600 leading-normal">
                Mô hình nhận thức sâu sắc tương quan giữa mức thu nhập trung bình tại Việt Nam và ngưỡng giá trần mà người dùng sẵn sàng chi trả.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-white border border-slate-200">
              <div className="text-2xl font-serif font-bold text-amber-600 mb-1">70% – 75%</div>
              <div className="font-bold text-slate-900 text-xs mb-1">Thông Điệp & Bao Bì (A/B Testing)</div>
              <p className="text-[11px] text-slate-600 leading-normal">
                Sàng lọc nhạy bén phương án thiết kế bao bì và câu thông điệp (USP) có lực kích hoạt cảm xúc mạnh nhất.
              </p>
            </div>
          </div>
        </article>

        <div className="h-px bg-amber-900/10 my-12" />

        {/* ══════════════════════════════════════════════════════════
            CHƯƠNG IV: BẢNG ĐỐI CHIẾU: AI vs. KHẢO SÁT TRUYỀN THỐNG
           ══════════════════════════════════════════════════════════ */}
        <article id="chuong-4" className="scroll-mt-24 space-y-6">
          <div className="flex items-center gap-2 text-amber-800 font-mono text-xs font-bold uppercase tracking-widest">
            <span>CHƯƠNG IV</span>
            <span>·</span>
            <span>ĐỐI CHIẾU THỰC CHIẾN</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-slate-900 leading-tight">
            Bảng Đối Chiếu: Nghiên Cứu Mô Phỏng AI vs. Khảo Sát Thực Địa Truyền Thống
          </h2>

          <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-2xs">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-[#0A192F] text-white font-mono text-[11px] uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-4 w-1/4">Tiêu chí so sánh</th>
                  <th className="py-3.5 px-4 w-3/8 text-slate-300">Khảo sát thực địa truyền thống</th>
                  <th className="py-3.5 px-4 w-3/8 text-amber-300 bg-slate-900">Mô phỏng tác tử AI (Chúng tôi)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                <tr>
                  <td className="py-3.5 px-4 font-bold text-slate-900 font-mono">Chi phí triển khai</td>
                  <td className="py-3.5 px-4 text-rose-900">50.000.000đ – 300.000.000đ cho một mẫu nhỏ</td>
                  <td className="py-3.5 px-4 font-bold text-emerald-800 bg-amber-50/30">
                    200.000đ – 700.000đ (Tiết kiệm &gt;99% ngân sách)
                  </td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 font-bold text-slate-900 font-mono">Thời gian hoàn thành</td>
                  <td className="py-3.5 px-4">3 đến 6 tuần (tổ chức hiện trường, giám sát, làm sạch dữ liệu)</td>
                  <td className="py-3.5 px-4 font-bold text-sky-800 bg-amber-50/30">
                    60 giây (xử lý song song đa luồng và xuất báo cáo tự động)
                  </td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 font-bold text-slate-900 font-mono">Kiểm soát sai số &amp; gian lận</td>
                  <td className="py-3.5 px-4 text-rose-900">
                    Rủi ro cao từ con người (phỏng vấn viên điền khống phiếu, gợi ý câu trả lời, nhập sai dữ liệu)
                  </td>
                  <td className="py-3.5 px-4 font-bold text-slate-900 bg-amber-50/30">
                    Đồng nhất 100%, triệt tiêu hoàn toàn thiên kiến chủ quan của người phỏng vấn
                  </td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 font-bold text-slate-900 font-mono">Khả năng lặp lại (Iteration)</td>
                  <td className="py-3.5 px-4">
                    Mỗi lần sửa ý tưởng phải làm lại từ đầu với chi phí và thời gian tương đương
                  </td>
                  <td className="py-3.5 px-4 font-bold text-amber-900 bg-amber-50/30">
                    Cho phép thử nghiệm, chỉnh sửa thông điệp và đo lường lại liên tục không giới hạn
                  </td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 font-bold text-slate-900 font-mono">Độ bao phủ địa lý</td>
                  <td className="py-3.5 px-4">Thường bị giới hạn ở 2 đô thị lớn (Hà Nội, TP.HCM) do chi phí đi lại</td>
                  <td className="py-3.5 px-4 font-bold text-slate-900 bg-amber-50/30">
                    Bao phủ toàn diện 6 vùng kinh tế trọng điểm cả nước đối chuẩn theo tỷ lệ Niên giám Thống kê GSO
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </article>

        <div className="h-px bg-amber-900/10 my-12" />

        {/* ══════════════════════════════════════════════════════════
            CHƯƠNG V: TÍNH MINH BẠCH & CÁC GIỚI HẠN THỰC TẾ
           ══════════════════════════════════════════════════════════ */}
        <article id="chuong-5" className="scroll-mt-24 space-y-6">
          <div className="flex items-center gap-2 text-amber-800 font-mono text-xs font-bold uppercase tracking-widest">
            <span>CHƯƠNG V</span>
            <span>·</span>
            <span>TÍNH MINH BẠCH KHOA HỌC</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-slate-900 leading-tight">
            Tính Minh Bạch & Các Giới Hạn Thực Tế Cần Lưu Ý
          </h2>

          <p className="text-slate-700 leading-relaxed text-justify">
            Chúng tôi cam kết <strong>minh bạch tuyệt đối 100%</strong> về năng lực thực tế của công nghệ để đồng hành bền vững
            và đáng tin cậy cùng doanh nghiệp. Mô hình AI không phải là "chiếc đũa thần" toàn năng, do đó Ban Giám đốc cần
            nắm rõ 3 giới hạn vật lý không thể thay thế:
          </p>

          <div className="space-y-4">
            <div className="p-4 sm:p-5 rounded-xl bg-amber-50/80 border border-amber-300">
              <div className="flex items-start gap-3">
                <span className="text-xl">⚠️</span>
                <div className="space-y-1">
                  <h4 className="font-serif font-bold text-amber-950 text-base">
                    1. Không thay thế thử nghiệm cảm quan vật lý (Sensory Test)
                  </h4>
                  <p className="text-xs sm:text-sm text-amber-900 leading-relaxed">
                    AI chỉ đánh giá trên bản mô tả khái niệm (Concept), bao bì và thuộc tính truyền thông; hoàn toàn{' '}
                    <strong>không thể nếm vị chua ngọt của thực phẩm, ngửi hương thơm nước hoa hay chạm vào độ mềm mịn của chất vải</strong>.
                    Đối với ngành F&amp;B và mỹ phẩm, bước thử mù trực tiếp trên cơ thể người thật (Blind Taste Test) vẫn là bắt buộc ở giai đoạn hoàn thiện công thức.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 sm:p-5 rounded-xl bg-slate-100 border border-slate-300">
              <div className="flex items-start gap-3">
                <span className="text-xl">📊</span>
                <div className="space-y-1">
                  <h4 className="font-serif font-bold text-slate-900 text-base">
                    2. Độ lệch giữa Nói và Làm (Say vs. Do Gap)
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                    Khảo sát mô phỏng phản ánh <strong>ý định tiêu dùng trên nhận thức (Purchase Intent)</strong>, không phải
                    hành vi rút ví thực tế tại điểm bán lẻ nếu doanh nghiệp thiếu hụt hệ thống phân phối, trưng bày hoặc năng lực bán hàng.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 sm:p-5 rounded-xl bg-slate-100 border border-slate-300">
              <div className="flex items-start gap-3">
                <span className="text-xl">💡</span>
                <div className="space-y-1">
                  <h4 className="font-serif font-bold text-slate-900 text-base">
                    3. Thiên kiến phản hồi lịch sự (Acquiescence Bias)
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                    Mô hình AI có xu hướng phản hồi cởi mở và thiện chí hơn người thật ngoài đời khoảng <strong>10% – 15%</strong>.
                    Do đó, khuyến nghị Ban Giám đốc nên tập trung vào{' '}
                    <strong>mức độ chênh lệch tương đối giữa các phương án thử nghiệm</strong> hơn là nhìn vào con số điểm số tuyệt đối.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </article>

        <div className="h-px bg-amber-900/10 my-12" />

        {/* ══════════════════════════════════════════════════════════
            CHƯƠNG VI: CẨM NANG ỨNG DỤNG CHIẾN LƯỢC
           ══════════════════════════════════════════════════════════ */}
        <article id="chuong-6" className="scroll-mt-24 space-y-6">
          <div className="flex items-center gap-2 text-amber-800 font-mono text-xs font-bold uppercase tracking-widest">
            <span>CHƯƠNG VI</span>
            <span>·</span>
            <span>CẨM NANG THỰC THI</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-slate-900 leading-tight">
            Khung Ứng Dụng Thực Tiễn Dành Cho Doanh Nghiệp
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Khi nào NÊN dùng */}
            <div className="p-5 rounded-2xl bg-emerald-50/60 border border-emerald-300 space-y-4">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
                  ✓
                </span>
                <h3 className="font-serif font-bold text-emerald-950 text-base sm:text-lg">
                  5 Trường Hợp Vàng Nên Dùng Ngay
                </h3>
              </div>
              <ul className="space-y-3 text-xs sm:text-sm text-emerald-950">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-700 font-bold shrink-0 mt-0.5">1.</span>
                  <span>
                    <strong>Kiểm định Concept sản phẩm mới (Pre-testing):</strong> Đo lường phản ứng thị trường theo khung Nielsen BASES trước khi đổ tiền tỷ làm khuôn mẫu hoặc ký hợp đồng gia công.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-700 font-bold shrink-0 mt-0.5">2.</span>
                  <span>
                    <strong>Định giá tối ưu (Van Westendorp PSM):</strong> Xác định chính xác 4 ngưỡng giá: Quá rẻ, Món hời, Bắt đầu đắt và Ngưỡng giá tối ưu (OPP).
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-700 font-bold shrink-0 mt-0.5">3.</span>
                  <span>
                    <strong>Đấu đầu bao bì &amp; Slogan (A/B Test):</strong> Cho 1.000 personas chấm điểm đối kháng giữa 2 phương án thiết kế để chọn mẫu có tỷ lệ win-rate cao nhất.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-700 font-bold shrink-0 mt-0.5">4.</span>
                  <span>
                    <strong>Thăm dò ngành hàng mới (U&amp;A Study):</strong> Khám phá nhanh thói quen tiêu dùng, động lực thúc đẩy và rào cản chuyển đổi thương hiệu trong phân khúc lạ.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-700 font-bold shrink-0 mt-0.5">5.</span>
                  <span>
                    <strong>Bảo vệ kế hoạch kinh doanh trước HĐQT:</strong> Dùng bộ chỉ số thống kê minh bạch, khách quan để thuyết trình bảo vệ ngân sách nội bộ hoặc gọi vốn.
                  </span>
                </li>
              </ul>
            </div>

            {/* Khi nào KHÔNG NÊN dùng */}
            <div className="p-5 rounded-2xl bg-rose-50/60 border border-rose-300 space-y-4">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-rose-600 text-white flex items-center justify-center font-bold text-xs">
                  ✕
                </span>
                <h3 className="font-serif font-bold text-rose-950 text-base sm:text-lg">
                  2 Trường Hợp Tuyệt Đối Không Nên Dùng
                </h3>
              </div>
              <ul className="space-y-4 text-xs sm:text-sm text-rose-950">
                <li className="flex items-start gap-2">
                  <span className="text-rose-700 font-bold shrink-0 mt-0.5">1.</span>
                  <span>
                    <strong>Thử nghiệm cảm quan vị giác hoặc kích ứng da:</strong> Yêu cầu bắt buộc phải tổ chức Blind Taste Test trực tiếp trên cơ thể người thật đối với đồ ăn, thức uống hoặc mỹ phẩm tiếp xúc da.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-700 font-bold shrink-0 mt-0.5">2.</span>
                  <span>
                    <strong>Nghiệm thu hồ sơ pháp lý nhà nước:</strong> Các thủ tục công quyền đòi hỏi danh tính công dân thật kèm chữ ký xác nhận thực địa ngoài đời.
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </article>

        <div className="h-px bg-amber-900/10 my-12" />

        {/* ══════════════════════════════════════════════════════════
            CHƯƠNG VII: TUYÊN NGÔN GIÁ TRỊ: TẤM KHIÊN BẢO VỆ DÒNG VỐN
           ══════════════════════════════════════════════════════════ */}
        <article id="chuong-7" className="scroll-mt-24 space-y-6">
          <div className="flex items-center gap-2 text-amber-800 font-mono text-xs font-bold uppercase tracking-widest">
            <span>CHƯƠNG VII</span>
            <span>·</span>
            <span>TUYÊN NGÔN CHIẾN LƯỢC</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-slate-900 leading-tight">
            Tuyên Ngôn Giá Trị: Tấm Khiên Bảo Vệ Dòng Vốn Doanh Nghiệp
          </h2>

          <div className="relative p-6 sm:p-8 rounded-3xl bg-[#0A192F] text-white border border-amber-500/40 shadow-xl overflow-hidden">
            <div className="relative z-10 space-y-4">
              <span className="inline-block text-amber-400 font-mono text-xs uppercase tracking-widest font-bold">
                PRE-TESTING SHIELD · TẤM KHIÊN TIỀN KHẢ THI
              </span>
              <p className="font-serif text-lg sm:text-2xl text-amber-100 font-normal leading-relaxed italic">
                &ldquo;Nền tảng AI Synthetic Market Research không sinh ra để triệt tiêu các cuộc khảo sát thực địa chuyên sâu, mà đóng vai trò là{' '}
                <strong className="text-amber-300 font-semibold underline decoration-amber-400">Tấm khiên bảo vệ dòng vốn</strong>{' '}
                trong giai đoạn R&amp;D.&rdquo;
              </p>
              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                Trước khi mạo hiểm đầu tư hàng trăm triệu đồng cho một chiến dịch tiếp thị hay hàng tỷ đồng sản xuất đại trà,
                doanh nghiệp chỉ cần <strong>60 giây và vài trăm nghìn đồng</strong> để loại bỏ 80% rủi ro thất bại ngay từ phòng họp chiến lược.
              </p>

              <div className="pt-4 flex flex-wrap items-center gap-3">
                <Link
                  href="/wizard"
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs sm:text-sm py-3 px-6 rounded-xl shadow-lg transition-all"
                >
                  <span>Khởi tạo khảo sát thử nghiệm ngay</span>
                  <span>→</span>
                </Link>
                <Link
                  href="/results/DEMO-NIELSEN-BASES"
                  className="inline-flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs sm:text-sm py-3 px-5 rounded-xl border border-slate-700 transition-all"
                >
                  <span>📄 Xem Báo Cáo Mẫu Thực Tế</span>
                </Link>
              </div>
            </div>
          </div>
        </article>
      </main>

      {/* ── Document Footer ── */}
      <Footer />
    </div>
  );
}
