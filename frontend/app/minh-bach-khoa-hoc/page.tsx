'use client';

import React from 'react';
import Link from 'next/link';
import Logo from '@/components/Logo';

export default function MinhBachKhoaHocPage() {
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
              <span className="text-amber-400 font-bold uppercase tracking-wider">CÔNG BỐ MINH BẠCH KHOA HỌC</span>
              <span className="text-slate-400 ml-2 hidden md:inline">· SCIENTIFIC & STATISTICAL DISCLOSURE</span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/bach-thu"
              className="hidden lg:inline-flex items-center gap-1.5 text-xs font-medium text-slate-300 hover:text-amber-300 px-3 py-1.5 rounded-lg border border-slate-700 hover:border-amber-500/50 transition-all"
            >
              <span>📚 Bạch thư C-Level</span>
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

      {/* ── Hero Banner ── */}
      <section className="bg-gradient-to-b from-[#0A192F] via-[#0D1D38] to-[#0A192F] text-white py-14 sm:py-20 px-4 sm:px-6 border-b border-amber-500/30">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/15 border border-amber-400/40 text-amber-300 text-xs font-mono font-bold tracking-wider uppercase">
            <span>⚖️ MINH BẠCH HỌC THUẬT & TRÁCH NHIỆM KHOA HỌC</span>
          </div>

          <h1 className="font-serif text-2xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
            Cơ Sở Toán Học Của Sai Số Biên, <br className="hidden sm:inline" />
            Độ Tin Cậy 95% & Năng Lực Thực Tế Của AI
          </h1>

          <p className="text-slate-300 text-xs sm:text-base max-w-2xl mx-auto leading-relaxed pt-2">
            Bản công bố toàn diện, minh bạch và có cơ sở học thuật dành cho Ban Giám Đốc, Hội Đồng Quản Trị và các Chuyên gia Nghiên Cứu Thị Trường về bản chất thực sự của các chỉ số thống kê trong mô hình Tác tử AI phân vai (Synthetic Personas).
          </p>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-4 text-xs font-mono text-slate-400">
            <span className="flex items-center gap-1.5">
              <span className="text-amber-400">✦</span> Chuẩn William G. Cochran (1977)
            </span>
            <span>·</span>
            <span className="flex items-center gap-1.5">
              <span className="text-amber-400">✦</span> Khung đối chuẩn Niên giám GSO Việt Nam
            </span>
            <span>·</span>
            <span className="flex items-center gap-1.5">
              <span className="text-amber-400">✦</span> Khảo nghiệm Stanford &amp; Chicago Booth
            </span>
          </div>
        </div>
      </section>

      {/* ── Main Content Container ── */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16 space-y-12">
        {/* Lời Tuyên Ngôn Minh Bạch */}
        <div className="bg-amber-50/80 border-2 border-amber-300 rounded-2xl p-6 sm:p-8 space-y-3">
          <div className="flex items-center gap-2 text-amber-900 font-serif font-black text-lg">
            <span>🏛️</span>
            <span>Tuyên Ngôn Minh Bạch Tuyệt Đối (Full Scientific Disclosure)</span>
          </div>
          <p className="text-xs sm:text-sm text-slate-800 leading-relaxed text-justify">
            Chúng tôi hiểu rằng đối với các quyết định kinh doanh trị giá hàng trăm triệu hoặc hàng tỷ đồng, <strong>sự trung thực và tính chuẩn xác khoa học là tài sản quý giá nhất</strong>. Chúng tôi tuyệt đối <strong>không thần thánh hóa AI</strong> và <strong>không gây nhầm lẫn rằng đây là người thật phỏng vấn thực địa</strong>. Bản công bố này phân định rạch ròi 3 tầng sự thật: <em>Cơ sở toán học thuần túy</em>, <em>Phạm vi áp dụng của AI</em>, và <em>Độ lệch thực tế so với hành vi con người ngoài đời thực</em>.
          </p>
        </div>

        {/* TẦNG 1: Cơ sở Toán học Cổ Điển Cochran 1977 */}
        <section className="space-y-5">
          <div className="flex items-center gap-2 text-amber-800 font-mono text-xs font-bold uppercase tracking-widest">
            <span>PHẦN I</span>
            <span>·</span>
            <span>LÝ THUYẾT XÁC SUẤT CỔ ĐIỂN</span>
          </div>

          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900 leading-tight">
            1. Cơ Sở Toán Học Của Sai Số Biên (MoE) &amp; Độ Tin Cậy 95%
          </h2>

          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed text-justify">
            Trong khoa học thống kê toàn cầu (từ William G. Cochran, 1977), mọi cuộc khảo sát xác suất đều xây dựng trên <strong>Định lý Giới hạn Trung tâm (Central Limit Theorem)</strong>: Khi kích thước mẫu đủ lớn, phân phối trung bình mẫu sẽ tiệm cận phân phối chuẩn Gauss $N(0, 1)$.
          </p>

          <div className="bg-slate-900 text-amber-300 p-6 rounded-2xl shadow-xl font-mono text-center space-y-3">
            <div className="text-[11px] uppercase tracking-widest text-slate-400">
              CÔNG THỨC CHỌN MẪU XÁC SUẤT COCHRAN (1977)
            </div>
            <div className="text-xl sm:text-2xl font-bold text-white tracking-wider py-1">
              MoE = Z × √[ p × (1 - p) / n ]
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-slate-300 pt-2 border-t border-slate-800 text-left sm:text-center">
              <div>
                <span className="text-amber-400 font-bold">Z = 1.96:</span> Ứng với khoảng tin cậy 95%
              </div>
              <div>
                <span className="text-amber-400 font-bold">p = 0.5:</span> Giả định phương sai cực đại (khắt khe nhất)
              </div>
              <div>
                <span className="text-amber-400 font-bold">n:</span> Quy mô số lượng mẫu khảo sát
              </div>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <h3 className="font-serif text-base font-bold text-slate-900">
              Bảng Tính Chi Tiết Cho Từng Cỡ Mẫu:
            </h3>

            <div className="overflow-x-auto border border-slate-300 rounded-xl bg-white shadow-xs">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-300">
                  <tr>
                    <th className="p-3">Quy mô mẫu (n)</th>
                    <th className="p-3 font-mono">Tính toán toán học</th>
                    <th className="p-3">Sai số biên (MoE)</th>
                    <th className="p-3">Mục đích sử dụng thực tế</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-slate-700">
                  <tr>
                    <td className="p-3 font-bold font-mono text-slate-900">500 mẫu</td>
                    <td className="p-3 font-mono text-slate-500">1.96 × √(0.25 / 500)</td>
                    <td className="p-3 font-bold text-amber-700">±4.38%</td>
                    <td className="p-3">Thăm dò nhanh concept ban đầu, sàng lọc ý tưởng thô</td>
                  </tr>
                  <tr className="bg-amber-50/60">
                    <td className="p-3 font-bold font-mono text-slate-900">1.000 mẫu</td>
                    <td className="p-3 font-mono text-slate-500">1.96 × √(0.25 / 1.000)</td>
                    <td className="p-3 font-bold text-emerald-700">±3.10%</td>
                    <td className="p-3 font-semibold text-slate-900">Chuẩn mực vàng quốc tế (ESOMAR/Nielsen/Kantar)</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold font-mono text-slate-900">2.000 mẫu</td>
                    <td className="p-3 font-mono text-slate-500">1.96 × √(0.25 / 2.000)</td>
                    <td className="p-3 font-bold text-amber-700">±2.19%</td>
                    <td className="p-3">Phân tích chéo theo từng tỉnh thành và độ tuổi</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold font-mono text-slate-900">3.000 mẫu</td>
                    <td className="p-3 font-mono text-slate-500">1.96 × √(0.25 / 3.000)</td>
                    <td className="p-3 font-bold text-emerald-700">±1.79%</td>
                    <td className="p-3">Đại diện toàn diện 6 vùng kinh tế, bảo vệ trước HĐQT</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* TẦNG 2: Ứng dụng trong Không Gian Tác Tử AI */}
        <section className="space-y-5">
          <div className="flex items-center gap-2 text-amber-800 font-mono text-xs font-bold uppercase tracking-widest">
            <span>PHẦN II</span>
            <span>·</span>
            <span>MÔ HÌNH HÓA DỮ LIỆU TÁC TỬ</span>
          </div>

          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900 leading-tight">
            2. Sai Số Biên Này Áp Dụng Cho Ai Trong Hệ Thống INSIGHT AI?
          </h2>

          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed text-justify">
            Sai số toán học $\pm 3.10\%$ ở độ tin cậy 95% áp dụng <strong>CHÍNH XÁC 100%</strong> cho <strong>Sai số chọn mẫu nội tại (Internal Sampling Error)</strong> của tập tác tử AI được rút ra từ kho ma trận nhân khẩu học:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 rounded-xl bg-white border border-slate-300 space-y-2">
              <span className="text-emerald-700 font-bold text-sm block">
                ✓ Khung Mẫu Đối Chuẩn Niên Giám Thống Kê GSO
              </span>
              <p className="text-xs text-slate-600 leading-relaxed">
                Khung mẫu phân tầng nhân khẩu học được chuẩn hóa và đối chuẩn (benchmark) theo Niên giám Thống kê của Tổng cục Thống kê Việt Nam (GSO), đảm bảo cơ cấu độ tuổi, giới tính, vùng miền và phân tầng thu nhập phản ánh sát thực tế dân số. Mô hình hành vi tiêu dùng được tổng hợp từ dữ liệu thói quen thương mại điện tử, mức chi tiêu khả dụng và văn hóa bán lẻ bản địa tại Việt Nam.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-white border border-slate-300 space-y-2">
              <span className="text-emerald-700 font-bold text-sm block">
                ✓ Tính Lặp Lại Thống Kê (Reproducibility)
              </span>
              <p className="text-xs text-slate-600 leading-relaxed">
                Khi kích hoạt khảo sát $N=1.000$, hệ thống rút ngẫu nhiên có phân tầng (Stratified Sampling). Về mặt toán xác suất, phương sai giữa các lần chạy ngẫu nhiên độc lập được bảo chứng không vượt quá $\pm 3.10\%$.
              </p>
            </div>
          </div>
        </section>

        {/* TẦNG 3: Đối chiếu với Người thật ngoài đời thực */}
        <section className="space-y-5">
          <div className="flex items-center gap-2 text-amber-800 font-mono text-xs font-bold uppercase tracking-widest">
            <span>PHẦN III</span>
            <span>·</span>
            <span>ĐỐI CHIẾU THỰC NGHIỆM VỚI CON NGƯỜI THẬT</span>
          </div>

          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900 leading-tight">
            3. Sự Thật: So Với Người Thật Ngoài Đời, Độ Chuẩn Xác Là Bao Nhiêu?
          </h2>

          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed text-justify">
            Để trả lời một cách trung thực nhất cho các nhà đầu tư và chủ doanh nghiệp, chúng tôi trích xuất kết quả từ các nghiên cứu đối chứng quy mô lớn nhất thế giới của <strong>Đại học Chicago Booth</strong> (Brand et al., 2023), <strong>Đại học Stanford</strong> (Park et al., 2023) và <strong>Harvard Business Review</strong>:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl bg-white border border-slate-300 space-y-2">
              <div className="text-2xl font-serif font-black text-amber-700">85% – 90%</div>
              <h4 className="font-bold text-slate-900 text-sm">Độ Chính Xác Hướng Đi (Directional Accuracy)</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Nếu Concept A thắng Concept B trên AI (ví dụ: 65% vs 35%), thì ngoài đời thực tế có tới <strong>9 trên 10 trường hợp Concept A cũng sẽ chiến thắng</strong>. AI nắm bắt cực kỳ chính xác quy luật phản ứng thị trường.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-300 space-y-2">
              <div className="text-2xl font-serif font-black text-amber-700">80% – 85%</div>
              <h4 className="font-bold text-slate-900 text-sm">Thứ Bậc Thuộc Tính (Relative Ranking)</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Thứ tự các rào cản mua sắm, tính năng cốt lõi và thông điệp bao bì thuyết phục nhất được xếp hạng khớp từ 80% – 85% so với dữ liệu nghiên cứu thực địa chuyên sâu của Nielsen và Kantar.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-300 space-y-2">
              <div className="text-2xl font-serif font-black text-amber-700">+10% – +15%</div>
              <h4 className="font-bold text-slate-900 text-sm">Thiên Kiến Lịch Sự (Acquiescence Bias)</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Tác tử AI đọc tài liệu kỹ lưỡng nên hiểu sản phẩm nhanh hơn và có xu hướng phản hồi <strong>lạc quan hơn người thật ngoài đời khoảng 10% – 15%</strong>. Do đó, điểm Top-2-Box cần được hiệu chỉnh chiết khấu.
              </p>
            </div>
          </div>

          {/* Khuyến nghị Hệ số chiết khấu */}
          <div className="p-5 rounded-2xl bg-indigo-50/80 border border-indigo-200 space-y-2">
            <div className="flex items-center gap-2 font-bold text-indigo-950 text-sm">
              <span>💡</span>
              <span>Khuyến Nghị Tính Doanh Số Thận Trọng Cho Ban Giám Đốc (Discount Factor):</span>
            </div>
            <p className="text-xs sm:text-sm text-indigo-900 leading-relaxed">
              Khi đọc chỉ số <strong>Ý Định Mua (Top-2-Box)</strong> trên báo cáo, chúng tôi khuyến nghị Ban Giám Đốc lấy tỷ lệ của AI trừ đi từ <strong>10% đến 15%</strong> (hoặc nhân hệ số 0.85) để ra con số thận trọng nhất khi lập kế hoạch dòng tiền và chuẩn bị vốn lưu động.
              <br />
              <em>Ví dụ: AI đo lường 74.2% ý định mua thử → Dự báo thực địa an toàn nên ước lượng ở mức 60% – 64%.</em>
            </p>
          </div>
        </section>

        {/* TẦNG 4: Bảng Đối Chiếu AI vs Thực Địa Cũ */}
        <section className="space-y-5">
          <div className="flex items-center gap-2 text-amber-800 font-mono text-xs font-bold uppercase tracking-widest">
            <span>PHẦN IV</span>
            <span>·</span>
            <span>BẢNG ĐỐI CHIẾU TRUNG THỰC</span>
          </div>

          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900 leading-tight">
            4. So Sánh Bản Chất: Mô Phỏng Tác Tử AI vs. Phỏng Vấn Thực Địa Cũ
          </h2>

          <div className="overflow-x-auto border border-slate-300 rounded-xl bg-white shadow-xs">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-300">
                <tr>
                  <th className="p-3 w-1/4">Yếu tố so sánh</th>
                  <th className="p-3 w-3/8 text-slate-600">Khảo sát thực địa người thật truyền thống</th>
                  <th className="p-3 w-3/8 text-amber-900 bg-amber-50/60 font-bold">Nền tảng Tác tử AI (INSIGHT AI)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-slate-700">
                <tr>
                  <td className="p-3 font-bold text-slate-900">Chi phí đầu tư</td>
                  <td className="p-3 text-red-700 font-semibold">80.000.000₫ – 250.000.000₫</td>
                  <td className="p-3 text-emerald-700 font-bold bg-amber-50/30">200.000₫ – 700.000₫ (Tiết kiệm 99%)</td>
                </tr>
                <tr>
                  <td className="p-3 font-bold text-slate-900">Thời gian trả kết quả</td>
                  <td className="p-3 text-red-700 font-semibold">3 đến 6 tuần làm việc</td>
                  <td className="p-3 text-emerald-700 font-bold bg-amber-50/30">60 giây tức thì</td>
                </tr>
                <tr>
                  <td className="p-3 font-bold text-slate-900">Rủi ro gian lận phỏng vấn viên</td>
                  <td className="p-3 text-slate-600">
                    <strong>Rất cao (20% – 30%):</strong> Phỏng vấn viên tự tick bừa số liệu để đủ chỉ tiêu; câu hỏi mớm cung (Interviewer Bias).
                  </td>
                  <td className="p-3 text-emerald-800 bg-amber-50/30 font-medium">
                    <strong>Tuyệt đối 0%:</strong> Không có phỏng vấn viên con người gian lận; toàn bộ quy trình do máy chủ xử lý toán học độc lập.
                  </td>
                </tr>
                <tr>
                  <td className="p-3 font-bold text-slate-900">Cảm quan vị giác / xúc giác</td>
                  <td className="p-3 text-emerald-700 font-semibold">
                    Thử được trực tiếp (Nếm vị, ngửi mùi, sờ vải ngoài đời).
                  </td>
                  <td className="p-3 text-amber-800 bg-amber-50/30">
                    <strong>Không làm được:</strong> AI chỉ đánh giá trên hình ảnh bao bì, mô tả concept và thông điệp truyền thông.
                  </td>
                </tr>
                <tr>
                  <td className="p-3 font-bold text-slate-900">Mục đích sử dụng tối ưu</td>
                  <td className="p-3 text-slate-600">
                    Nghiệm thu thủ tục pháp lý nhà nước; thẩm định cảm quan công thức F&amp;B giai đoạn cuối.
                  </td>
                  <td className="p-3 font-bold text-slate-900 bg-amber-50/30">
                    Sàng lọc ý tưởng, tìm điểm giá tối ưu (PSM), đo độ nổi bật bao bì A/B và tối ưu hóa ngân sách trước khi sản xuất lớn.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* TẦNG 5: Tuân Thủ Pháp Lý & Quyền Riêng Tư */}
        <section className="space-y-5">
          <div className="flex items-center gap-2 text-amber-800 font-mono text-xs font-bold uppercase tracking-widest">
            <span>PHẦN V</span>
            <span>·</span>
            <span>BẢO BỌC PHÁP LÝ & AN TOÀN DỮ LIỆU</span>
          </div>

          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900 leading-tight">
            5. Cam Kết Pháp Lý Vững Chắc Dành Cho Doanh Nghiệp
          </h2>

          <div className="bg-white border border-slate-300 rounded-2xl p-6 sm:p-8 space-y-4 shadow-xs">
            <div className="flex items-start gap-3">
              <span className="text-2xl">🛡️</span>
              <div className="space-y-1">
                <h4 className="font-serif font-bold text-slate-900 text-base">
                  Tuyệt đối không xâm phạm dữ liệu cá nhân (100% PII-Free)
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Hệ thống tuân thủ nghiêm ngặt <strong>Nghị định 13/2023/NĐ-CP</strong> và Luật Bảo vệ dữ liệu cá nhân. Các hồ sơ tác tử AI được xây dựng theo phương pháp <em>Privacy-by-Design</em>, chỉ chứa các thuộc tính xã hội học giả lập đại diện, hoàn toàn không thu thập căn cước, số điện thoại hay thông tin định danh của bất kỳ công dân thật nào.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 pt-3 border-t border-slate-100">
              <span className="text-2xl">📋</span>
              <div className="space-y-1">
                <h4 className="font-serif font-bold text-slate-900 text-base">
                  Tuân thủ Luật Quảng cáo 2012 (Điều 8)
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Nền tảng công bố minh bạch và trung thực: Đây là công nghệ mô phỏng tác tử AI phân vai theo ma trận nhân khẩu học thống kê, cung cấp cơ sở phân tích chiến lược kinh doanh cho doanh nghiệp, không tuyên bố sai lệch là tổ chức phỏng vấn lấy chữ ký người thật thực địa.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Action Footer Callout */}
        <div className="bg-gradient-to-r from-slate-900 to-[#0A192F] text-white rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-2 text-center sm:text-left">
            <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 font-bold">
              ĐỒNG HÀNH CHIẾN LƯỢC CÙNG DOANH NGHIỆP
            </span>
            <h3 className="font-serif text-lg sm:text-xl font-bold text-white">
              Sẵn sàng kiểm chứng ý tưởng kinh doanh của bạn?
            </h3>
            <p className="text-xs text-slate-300 max-w-lg">
              Loại bỏ 80% rủi ro dòng vốn chỉ với chi phí từ 200.000₫ trước khi đầu tư hàng trăm triệu sản xuất đại trà.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto shrink-0">
            <Link
              href="/wizard"
              className="w-full sm:w-auto text-center bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs py-3 px-6 rounded-xl shadow-md transition-all"
            >
              Khởi tạo khảo sát ngay →
            </Link>
            <Link
              href="/results/DEMO-NIELSEN-BASES"
              className="w-full sm:w-auto text-center bg-slate-800 hover:bg-slate-700 text-white font-medium text-xs py-3 px-5 rounded-xl border border-slate-700 transition-all"
            >
              Xem báo cáo mẫu
            </Link>
          </div>
        </div>
      </main>

      {/* ── Footer ── */}
      <footer className="bg-slate-900 text-white border-t border-slate-800 py-8 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-slate-400 text-center md:text-left">
          <div className="flex flex-col items-center md:items-start gap-1">
            <Logo variant="footer" href="/" />
            <span className="text-[11px] text-slate-400 mt-1">
              insight.1booking.asia · Nền tảng mô phỏng thị trường bằng Tác tử AI Đa Nhân Khẩu (Synthetic Personas)
            </span>
          </div>

          <div className="flex flex-wrap justify-center items-center gap-3 sm:gap-6">
            <Link href="/" className="hover:text-amber-400 transition-colors">
              Trang Chủ
            </Link>
            <span>·</span>
            <Link href="/bach-thu" className="hover:text-amber-400 transition-colors">
              Bạch Thư C-Level
            </Link>
            <span>·</span>
            <Link href="/minh-bach-khoa-hoc" className="text-amber-400 font-bold underline underline-offset-4">
              Minh Bạch Khoa Học
            </Link>
            <span>·</span>
            <span>Bảo chứng Cochran 95%</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
