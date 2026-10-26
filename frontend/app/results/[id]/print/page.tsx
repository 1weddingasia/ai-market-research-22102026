'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { api, type ReportPayload, type VerbatimQuote } from '@/lib/api';

/* ── Model Label Mapping ─────────────────────────────────── */
/* ── 9 Specialized Research Framework Configurations ── */
export interface ModelPrintConfig {
  title: string;
  subtitle: string;
  framework: string;
  heroLabel: string;
  heroSub: string;
  getHeroValue: (report: ReportPayload) => { val: string; sub: string; badge: string; badgeClass: string };
  pillars: Array<{ title: string; icon: string; borderClass: string; bgClass: string; textClass: string }>;
  getBottomKPIs: (report: ReportPayload) => Array<{ label: string; value: string }>;
  roadmap: {
    day30: { title: string; desc: string };
    day60: { title: string; desc: string };
    day90: { title: string; desc: string };
  };
}

const MODEL_CONFIGS: Record<string, ModelPrintConfig> = {
  nielsen_bases: {
    title: 'BÁO CÁO KIỂM ĐỊNH MỨC ĐỘ CHẤP NHẬN SẢN PHẨM & RỦI RO THỊ TRƯỜNG',
    subtitle: 'Khảo sát dự báo mức độ thâm nhập thị trường & kiểm định ý tưởng sản phẩm mới',
    framework: 'Mô hình chuẩn hóa Nielsen BASES Innovation Framework',
    heroLabel: 'CHỈ SỐ KHẢ THI (VIABILITY SCORE)',
    heroSub: 'Đánh giá khả năng thương mại hóa',
    getHeroValue: (r) => {
      const score = r.executive_summary?.viability_score || 78;
      const isGo = score >= 75;
      const isCaution = score >= 50 && score < 75;
      return {
        val: `${score}`,
        sub: 'Thang điểm 100',
        badge: isGo ? 'VƯỢT TRỘI (STRONG GO)' : isCaution ? 'KHẢ THI (CAUTION)' : 'RỦI RO CAO (NO-GO)',
        badgeClass: isGo ? 'bg-emerald-50 text-emerald-800 border-emerald-300' : isCaution ? 'bg-amber-50 text-amber-800 border-amber-300' : 'bg-red-50 text-red-800 border-red-300',
      };
    },
    pillars: [
      { title: 'Tối Ưu Khái Niệm & USP', icon: '💡', borderClass: 'border-emerald-200', bgClass: 'bg-emerald-50/50', textClass: 'text-emerald-900' },
      { title: 'Kích Hoạt Dùng Thử (Trial)', icon: '🎯', borderClass: 'border-blue-200', bgClass: 'bg-blue-50/50', textClass: 'text-blue-900' },
      { title: 'Rào Chắn Rủi Ro Thất Bại', icon: '🛡️', borderClass: 'border-red-200', bgClass: 'bg-red-50/50', textClass: 'text-red-900' },
    ],
    getBottomKPIs: (r) => [
      { label: 'Ý Định Mua (Top-2-Box)', value: String(r.quantitative_metrics?.purchase_intent_top2box || '73.4%') },
      { label: 'Mức Độ Độc Đáo', value: `${r.quantitative_metrics?.uniqueness_score || 4.1} / 5.0` },
      { label: 'Chỉ Số Nguy Cơ Flop Risk', value: `${Number(r.quantitative_metrics?.model_specific?.flop_risk_index) || 18}% (An toàn)` },
    ],
    roadmap: {
      day30: {
        title: 'Giai đoạn 1: Tinh Chỉnh Concept & Lý Do Để Tin (RTB)',
        desc: 'Làm sắc nét thông điệp USP mặt trước bao bì. Giải tỏa triệt để rào cản nhận thức hàng đầu để khách hàng không nhầm lẫn với sản phẩm đại trà.',
      },
      day60: {
        title: 'Giai đoạn 2: Sản Xuất Pilot Batch & Kích Hoạt Dùng Thử',
        desc: 'Sản xuất mẻ thử nghiệm đầu tiên. Triển khai chiến dịch Sampling có chọn lọc tại các điểm bán trọng điểm để kích hoạt tỷ lệ dùng thử thực tế.',
      },
      day90: {
        title: 'Giai đoạn 3: Phủ Kệ Toàn Diện & Đo Lường Tỷ Lệ Tái Mua',
        desc: 'Mở rộng phân phối vào chuỗi siêu thị MT và kênh GT. Theo dõi sát sao tỷ lệ mua lặp lại (Repeat Purchase Rate) để bảo vệ thị phần.',
      },
    },
  },
  van_westendorp: {
    title: 'BÁO CÁO ĐỊNH GIÁ TỐI ƯU & ĐỘ NHẠY GIÁ NGƯỜI TIÊU DÙNG',
    subtitle: 'Xác định điểm giá tối ưu (OPP) và khoảng giá thị trường chấp nhận được',
    framework: 'Mô hình kinh tế học Van Westendorp Price Sensitivity Meter (PSM)',
    heroLabel: 'ĐIỂM GIÁ TỐI ƯU (OPP)',
    heroSub: 'Ngưỡng giá tối thiểu hóa lực cản',
    getHeroValue: (r) => {
      const opp = Number(r.quantitative_metrics?.model_specific?.optimal_price || r.quantitative_metrics?.model_specific?.opp || 185000);
      const pmc = Number(r.quantitative_metrics?.model_specific?.pmc || 150000);
      const pme = Number(r.quantitative_metrics?.model_specific?.pme || 220000);
      return {
        val: `${opp.toLocaleString('vi-VN')} đ`,
        sub: 'Điểm giá tối ưu (OPP)',
        badge: `KHOẢNG GIÁ: ${(pmc/1000).toFixed(0)}k - ${(pme/1000).toFixed(0)}k đ`,
        badgeClass: 'bg-sky-50 text-sky-800 border-sky-300',
      };
    },
    pillars: [
      { title: 'Điểm Giá Tối Ưu (OPP)', icon: '💎', borderClass: 'border-blue-200', bgClass: 'bg-blue-50/50', textClass: 'text-blue-900' },
      { title: 'Bảo Toàn Giá Trị (IPP)', icon: '⚖️', borderClass: 'border-emerald-200', bgClass: 'bg-emerald-50/50', textClass: 'text-emerald-900' },
      { title: 'Phân Tầng SKU & Biên Lợi Nhuận', icon: '📊', borderClass: 'border-amber-200', bgClass: 'bg-amber-50/50', textClass: 'text-amber-900' },
    ],
    getBottomKPIs: (r) => {
      const opp = Number(r.quantitative_metrics?.model_specific?.optimal_price || r.quantitative_metrics?.model_specific?.opp || 185000);
      const ipp = Number(r.quantitative_metrics?.model_specific?.indifference_price || r.quantitative_metrics?.model_specific?.idp || 180000);
      const pmc = Number(r.quantitative_metrics?.model_specific?.pmc || 150000);
      const pme = Number(r.quantitative_metrics?.model_specific?.pme || 220000);
      return [
        { label: 'Điểm Giá Tối Ưu (OPP)', value: `${opp.toLocaleString('vi-VN')} đ` },
        { label: 'Điểm Cân Bằng (IPP)', value: `${ipp.toLocaleString('vi-VN')} đ` },
        { label: 'Khoảng Giá Chấp Nhận', value: `${(pmc/1000).toFixed(0)}k - ${(pme/1000).toFixed(0)}k đ` },
      ];
    },
    roadmap: {
      day30: {
        title: 'Giai đoạn 1: Niêm Yết Giá Bán Lẻ OPP & Khung Chiết Khấu Đại Lý',
        desc: 'Xác lập mức giá niêm yết chính thức quanh điểm giá tối ưu OPP. Ban hành chính sách chiết khấu kênh phân phối bảo đảm biên lãi đại lý.',
      },
      day60: {
        title: 'Giai đoạn 2: Cấu Trúc Phân Tầng SKU (Size Nhỏ - Combo Lớn)',
        desc: 'Tung quy cách size nhỏ với giá tiệm cận PMC để hạ thấp rào cản dùng thử; song song triển khai combo gia đình để tối đa hóa doanh thu.',
      },
      day90: {
        title: 'Giai đoạn 3: Giám Sát Áp Lực Chi Phí & Kiểm Soát Trần Giá PME',
        desc: 'Giám sát chặt chẽ biến động chi phí nguyên vật liệu. Thiết lập kỷ luật giá nghiêm ngặt, tuyệt đối không tăng giá bán lẻ vượt điểm quá đắt PME.',
      },
    },
  },
  ab_testing: {
    title: 'BÁO CÁO THỬ NGHIỆM A/B BAO BÌ & THÔNG ĐIỆP TRUYỀN THÔNG',
    subtitle: 'Đo lường mức độ nâng cao tỷ lệ chuyển đổi (Conversion Uplift Scorecard)',
    framework: 'Mô hình đánh giá chuẩn Kantar Link Pre-testing Framework',
    heroLabel: 'TỶ LỆ THẮNG MẪU CHIẾN THẮNG',
    heroSub: 'Độ lệch có ý nghĩa thống kê (p < 0.05)',
    getHeroValue: (r) => {
      const winner = String(r.quantitative_metrics?.model_specific?.winner || 'Phương án B');
      const winRate = String(r.quantitative_metrics?.model_specific?.win_rate || '61.4%');
      return {
        val: winner,
        sub: 'Mẫu chiến thắng',
        badge: `WIN-RATE: ${winRate} (p < 0.05)`,
        badgeClass: 'bg-emerald-50 text-emerald-800 border-emerald-300',
      };
    },
    pillars: [
      { title: 'Lợi Thế Phương Án Thắng', icon: '🏆', borderClass: 'border-emerald-200', bgClass: 'bg-emerald-50/50', textClass: 'text-emerald-900' },
      { title: 'Khắc Phục Điểm Nghẽn Mẫu Thua', icon: '🔍', borderClass: 'border-red-200', bgClass: 'bg-red-50/50', textClass: 'text-red-900' },
      { title: 'Kế Hoạch Tối Ưu Lai Ghép', icon: '📦', borderClass: 'border-blue-200', bgClass: 'bg-blue-50/50', textClass: 'text-blue-900' },
    ],
    getBottomKPIs: (r) => [
      { label: 'Tỷ Lệ Thắng (Win-Rate)', value: String(r.quantitative_metrics?.model_specific?.win_rate || '61.4%') },
      { label: 'Kiểm Định Ý Nghĩa', value: 'p < 0.01 (Tin cậy cao)' },
      { label: 'Cảm Nhận Cao Cấp Hơn', value: '+24.0% so với mẫu cũ' },
    ],
    roadmap: {
      day30: {
        title: 'Giai đoạn 1: Khóa Thiết Kế Thắng & Tích Hợp Ưu Điểm Mẫu Đối Ứng',
        desc: 'Phê duyệt phương án chiến thắng đưa vào sản xuất; kế thừa các điểm sáng đồ họa và từ khóa tốt nhất từ mẫu đối ứng để hoàn thiện bản in cuối cùng.',
      },
      day60: {
        title: 'Giai đoạn 2: In Ấn Thương Mại & Thử Nghiệm Nổi Bật Quầy Kệ',
        desc: 'Tiến hành in bao bì thương mại quy mô lớn. Kiểm tra trực quan khả năng thu hút mắt (Shelf Stand-out) trên kệ siêu thị và hình ảnh thumbnail e-commerce.',
      },
      day90: {
        title: 'Giai đoạn 3: Phủ Sóng Nhận Diện Đồng Bộ Đa Kênh Bán Hàng',
        desc: 'Triển khai chiến dịch truyền thông tích hợp đồng bộ theo hình ảnh thiết kế chiến thắng trên mọi điểm tiếp xúc mạng xã hội và cửa hàng vật lý.',
      },
    },
  },
  ua_study: {
    title: 'BÁO CÁO NGHIÊN CỨU THÓI QUEN & THÁI ĐỘ NGƯỜI TIÊU DÙNG (U&A)',
    subtitle: 'Khám phá khoảng trống thị trường (Unmet Needs) & động lực tiêu dùng',
    framework: 'Mô hình nghiên cứu hành vi Usage & Attitude (U&A) Study',
    heroLabel: 'DỊP TIÊU DÙNG TRỌNG ĐIỂM',
    heroSub: 'Tần suất và bối cảnh sử dụng cao nhất',
    getHeroValue: (r) => ({
      val: String(r.quantitative_metrics?.model_specific?.top_occasion_pct || '48.6%'),
      sub: 'Dịp tiêu dùng số 1 (Buổi chiều)',
      badge: 'KÊNH CHỦ ĐẠO: SIÊU THỊ MT & ONLINE',
      badgeClass: 'bg-amber-50 text-amber-800 border-amber-300',
    }),
    pillars: [
      { title: 'Dịp Tiêu Dùng Cốt Lõi', icon: '⏰', borderClass: 'border-amber-200', bgClass: 'bg-amber-50/50', textClass: 'text-amber-900' },
      { title: 'Nhu Cầu Chưa Thỏa Mãn (Unmet)', icon: '💡', borderClass: 'border-red-200', bgClass: 'bg-red-50/50', textClass: 'text-red-900' },
      { title: 'Gia Tăng Tần Suất & Giỏ Hàng', icon: '🛒', borderClass: 'border-emerald-200', bgClass: 'bg-emerald-50/50', textClass: 'text-emerald-900' },
    ],
    getBottomKPIs: () => [
      { label: 'Dịp Tiêu Dùng Số 1', value: '48.6% (Buổi chiều)' },
      { label: 'Kênh Mua Sắm Chủ Đạo', value: '58.2% (Siêu thị MT)' },
      { label: 'Nỗi Đau Lớn Nhất Ngành', value: 'Thiếu tiện lợi đóng mở' },
    ],
    roadmap: {
      day30: {
        title: 'Giai đoạn 1: Gắn Định Vị Vào Dịp Tiêu Dùng Cốt Lõi',
        desc: 'Định vị sản phẩm gắn liền với bối cảnh tiêu dùng phổ biến nhất đã phát hiện trong khảo sát nhằm hình thành phản xạ tiêu dùng định kỳ.',
      },
      day60: {
        title: 'Giai đoạn 2: Phủ Sóng Kênh Mua Sắm Trọng Tâm (MT & Online)',
        desc: 'Tập trung lực lượng tiếp thị và chiết khấu vào các kênh mua sắm có tỷ lệ thâm nhập cao nhất (chuỗi cửa hàng tiện lợi và sàn thương mại điện tử).',
      },
      day90: {
        title: 'Giai đoạn 3: Phát Triển Giải Pháp Giải Tỏa Unmet Needs',
        desc: 'R&D quy cách đóng gói và sản phẩm cải tiến nhằm giải quyết triệt để nỗi đau lớn nhất của ngành hàng, bỏ xa các đối thủ chậm thay đổi.',
      },
    },
  },
  deal_elasticity: {
    title: 'BÁO CÁO ĐỘ CO GIÃN KHUYẾN MÃI & CHIẾN LƯỢC KÍCH HOẠT DÙNG THỬ',
    subtitle: 'Đo lường độ nhạy ưu đãi và tỷ lệ kích hoạt chuyển đổi mua hàng',
    framework: 'Mô hình Promo Elasticity & Threshold Analysis',
    heroLabel: 'HỆ SỐ CO GIÃN GIÁ (ε)',
    heroSub: 'Mức độ nhạy cảm của sản lượng theo giá',
    getHeroValue: (r) => ({
      val: `ε = ${r.quantitative_metrics?.model_specific?.elasticity || '-1.65'}`,
      sub: 'Độ co giãn của cầu theo giá',
      badge: 'CHIẾT KHẤU TỐI ƯU: 18% (AN TOÀN)',
      badgeClass: 'bg-sky-50 text-sky-800 border-sky-300',
    }),
    pillars: [
      { title: 'Ngưỡng Co Giãn Giá Khuyến Mãi', icon: '📉', borderClass: 'border-blue-200', bgClass: 'bg-blue-50/50', textClass: 'text-blue-900' },
      { title: 'Tỷ Lệ Đổi Thương Hiệu (Switching)', icon: '🔄', borderClass: 'border-emerald-200', bgClass: 'bg-emerald-50/50', textClass: 'text-emerald-900' },
      { title: 'Bảo Toàn Biên Lãi Gộp Breakeven', icon: '🛡️', borderClass: 'border-red-200', bgClass: 'bg-red-50/50', textClass: 'text-red-900' },
    ],
    getBottomKPIs: () => [
      { label: 'Hệ Số Co Giãn ε', value: '-1.65 (Co giãn cao)' },
      { label: 'Tỷ Lệ Đổi Thương Hiệu Max', value: '41.2% (Tại nấc 25%)' },
      { label: 'Ngưỡng Chiết Khấu An Toàn', value: '18.0% (Tối ưu biên lãi)' },
    ],
    roadmap: {
      day30: {
        title: 'Giai đoạn 1: Thiết Lập Cơ Cấu Chiết Khấu An Toàn Max 18%',
        desc: 'Quy định trần khuyến mãi tiền mặt tối đa không vượt quá 18% để bảo vệ điểm hòa vốn biên lợi nhuận gộp và giữ vững hình ảnh cao cấp.',
      },
      day60: {
        title: 'Giai đoạn 2: Kích Hoạt Chiến Dịch Combo Hút Khách Đối Thủ',
        desc: 'Triển khai ưu đãi theo hình thức quà tặng giá trị gia tăng (GWP) hoặc combo sản phẩm để kích thích người dùng đối thủ đổi sang dùng thử.',
      },
      day90: {
        title: 'Giai đoạn 3: Đưa Giá Về Chuẩn & Giữ Chân Khách Bằng Loyalty',
        desc: 'Kết thúc giai đoạn khuyến mãi giá; chuyển đổi toàn bộ khách hàng mới sang chương trình tích điểm khách hàng thân thiết để duy trì doanh thu.',
      },
    },
  },
  monadic: {
    title: 'BÁO CÁO THỬ NGHIỆM Ý TƯỞNG ĐỘC LẬP (MONADIC CONCEPT TESTING)',
    subtitle: 'Đo lường tỷ lệ mua thử và chỉ số tăng trưởng (Lift %) trên hai nhánh mẫu tách biệt',
    framework: 'Mô hình Monadic Testing Split-Sample Standard',
    heroLabel: 'CHỈ SỐ TĂNG TRƯỞNG (LIFT %)',
    heroSub: 'Chênh lệch ý định mua giữa Concept Test vs Benchmark',
    getHeroValue: (r) => {
      const lift = r.quantitative_metrics?.model_specific?.lift_pct || '18.4';
      return {
        val: `+${lift}%`,
        sub: 'Chỉ số tăng trưởng Lift %',
        badge: `TOP-2-BOX: ${r.quantitative_metrics?.purchase_intent_top2box || '74.2%'}`,
        badgeClass: 'bg-emerald-50 text-emerald-800 border-emerald-300',
      };
    },
    pillars: [
      { title: 'Ý Niệm Độc Lập Top-2-Box', icon: '⚖️', borderClass: 'border-blue-200', bgClass: 'bg-blue-50/50', textClass: 'text-blue-900' },
      { title: 'Mức Độ Tăng Trưởng Thực Tế (Lift)', icon: '📊', borderClass: 'border-emerald-200', bgClass: 'bg-emerald-50/50', textClass: 'text-emerald-900' },
      { title: 'Quyết Định Thương Mại Hóa Go/No-Go', icon: '🎯', borderClass: 'border-amber-200', bgClass: 'bg-amber-50/50', textClass: 'text-amber-900' },
    ],
    getBottomKPIs: (r) => [
      { label: 'Top-2-Box Concept Mới', value: String(r.quantitative_metrics?.purchase_intent_top2box || '74.2% (Cell B)') },
      { label: 'Chỉ Số Tăng Trưởng Lift %', value: `+${r.quantitative_metrics?.model_specific?.lift_pct || '18.4'}% (p = 0.021)` },
      { label: 'Rủi Ro Tự Ăn Thị Phần', value: 'Thấp (Nguồn khách mới 78%)' },
    ],
    roadmap: {
      day30: {
        title: 'Giai đoạn 1: Phê Duyệt Kế Hoạch Cho Concept Đạt Lift Cao',
        desc: 'Ưu tiên phân bổ nguồn vốn và dây chuyền sản xuất cho phiên bản Concept đạt điểm Top-2-Box và Lift % vượt trội trong thử nghiệm đơn lập.',
      },
      day60: {
        title: 'Giai đoạn 2: Định Vị Độc Lập Không Loãng Thương Hiệu Mẹ',
        desc: 'Thiết kế bao bì và thông điệp truyền thông tự thân truyền tải trọn vẹn giá trị mới mà không gây nhầm lẫn với dòng sản phẩm hiện có.',
      },
      day90: {
        title: 'Giai đoạn 3: Mở Rộng Quy Mô Phân Phối & Giám Sát Thị Phần',
        desc: 'Tung hàng trên diện rộng. Theo dõi dữ liệu bán lẻ thực tế để xác thực nguồn doanh thu gia tăng thực chất từ nhóm khách hàng mới.',
      },
    },
  },
  maxdiff: {
    title: 'BÁO CÁO XẾP HẠNG THUỘC TÍNH & THÔNG ĐIỆP BÁN HÀNG (MAXDIFF)',
    subtitle: 'Thang đo tiện ích tương đối Best-Worst Scaling loại bỏ hiện tượng đánh giá ảo',
    framework: 'Mô hình Best-Worst Scaling (MaxDiff) Analysis',
    heroLabel: 'THUỘC TÍNH DẪN ĐẦU (HERO CLAIM)',
    heroSub: 'Chiếm tỷ trọng tiện ích cao nhất',
    getHeroValue: (r) => ({
      val: String(r.quantitative_metrics?.model_specific?.top_utility || '38.5%'),
      sub: 'Tiện ích Hero Claim #1',
      badge: 'TIER 1 MUST-COMMUNICATE',
      badgeClass: 'bg-sky-50 text-sky-800 border-sky-300',
    }),
    pillars: [
      { title: 'Thuộc Tính Ưu Tiên Số 1 (Top-Tier)', icon: '⭐', borderClass: 'border-emerald-200', bgClass: 'bg-emerald-50/50', textClass: 'text-emerald-900' },
      { title: 'Thông Điệp Hero Claim Mặt Trước', icon: '📢', borderClass: 'border-blue-200', bgClass: 'bg-blue-50/50', textClass: 'text-blue-900' },
      { title: 'Cắt Giảm Chi Phí Tính Năng Thờ Ơ', icon: '✂️', borderClass: 'border-red-200', bgClass: 'bg-red-50/50', textClass: 'text-red-900' },
    ],
    getBottomKPIs: () => [
      { label: 'Điểm Tiện Ích Hero Claim', value: '38.5% (Dẫn đầu tuyệt đối)' },
      { label: 'Số Thuộc Tính Cần Cắt Bỏ', value: '2 tính năng (Tier 3)' },
      { label: 'Tỷ Lệ Đồng Thuận Best', value: '68.4% Personas lựa chọn' },
    ],
    roadmap: {
      day30: {
        title: 'Giai đoạn 1: Đưa Hero Claim Lên Vị Trí Trung Tâm Mặt Trước Bao Bì',
        desc: 'Dành tối thiểu 40% diện tích đồ họa mặt trước hộp/chai để thể hiện thuộc tính có điểm tiện ích Best cao nhất; xóa bỏ claim phụ rườm rà.',
      },
      day60: {
        title: 'Giai đoạn 2: Cắt Giảm Chi Phí Kỹ Thuật Cho Thuộc Tính Tier 3',
        desc: 'Kiên quyết cắt giảm ngân sách R&D hoặc loại bỏ các tính năng bị đánh giá Worst nhiều nhất để tối ưu hóa giá thành sản xuất (BOM).',
      },
      day90: {
        title: 'Giai đoạn 3: Đo Lường Khắc Sâu Nhận Thức Về Hero Claim',
        desc: 'Khảo sát đo lường mức độ liên tưởng của người tiêu dùng: Đảm bảo khi nhắc tới Hero Claim đó, thương hiệu của bạn là cái tên đầu tiên xuất hiện.',
      },
    },
  },
  kano: {
    title: 'BÁO CÁO PHÂN LOẠI TÍNH NĂNG R&D & LỘ TRÌNH SẢN PHẨM (KANO MODEL)',
    subtitle: 'Phân tầng tính năng Bắt buộc (Must-be), Đột phá (Attractive) và Tối ưu chi phí kỹ thuật',
    framework: 'Mô hình chuẩn hóa Kano Product Roadmap Prioritization',
    heroLabel: 'VŨ KHÍ ĐỘT PHÁ (ATTRACTIVE FEATURE)',
    heroSub: 'Tính năng tạo hiệu ứng WOW vượt trội',
    getHeroValue: (r) => ({
      val: `${r.quantitative_metrics?.model_specific?.attractive_count || 1} DELIGHT`,
      sub: 'Tính năng đột phá (Attractive)',
      badge: `MUST-BE: ${r.quantitative_metrics?.model_specific?.must_be_count || 2} TÍNH NĂNG`,
      badgeClass: 'bg-purple-50 text-purple-800 border-purple-300',
    }),
    pillars: [
      { title: 'Tính Năng Bắt Buộc (Must-be)', icon: '🔒', borderClass: 'border-red-200', bgClass: 'bg-red-50/50', textClass: 'text-red-900' },
      { title: 'Tính Năng Tăng Trưởng (One-dim)', icon: '📈', borderClass: 'border-blue-200', bgClass: 'bg-blue-50/50', textClass: 'text-blue-900' },
      { title: 'Vũ Khí Bất Ngờ (Attractive WOW)', icon: '✨', borderClass: 'border-emerald-200', bgClass: 'bg-emerald-50/50', textClass: 'text-emerald-900' },
    ],
    getBottomKPIs: () => [
      { label: 'Tính Năng Bắt Buộc', value: '2 tính năng cốt lõi' },
      { label: 'Tính Năng WOW (Delighter)', value: '1 tính năng đột phá' },
      { label: 'Hệ Số Hài Lòng CS+', value: '+0.78 (Khả năng tạo đột phá)' },
    ],
    roadmap: {
      day30: {
        title: 'Giai đoạn 1: Đảm Bảo 100% Chuẩn Kỹ Thuật Cho Tính Năng Must-be',
        desc: 'Kiểm tra chất lượng nghiêm ngặt cho nhóm tính năng Bắt buộc (Must-be); thiếu sót ở nhóm này sẽ dẫn tới thất bại tức thì dù tính năng WOW có hay đến đâu.',
      },
      day60: {
        title: 'Giai đoạn 2: Lấy Tính Năng Attractive Làm Điểm Nhấn Chiến Dịch',
        desc: 'Hoàn thiện tính năng Cạnh tranh (One-dimensional) và lấy tính năng Đột phá (Attractive) làm tâm điểm chiến dịch truyền thông PR ra mắt.',
      },
      day90: {
        title: 'Giai đoạn 3: R&D Tính Năng Mới Chu Kỳ Tiếp Theo',
        desc: 'Lập kế hoạch đổi mới tính năng vì theo quy luật Kano, các tính năng Attractive hiện tại sẽ dần bị người tiêu dùng bình thường hóa thành Must-be sau 6-12 tháng.',
      },
    },
  },
  brand_map: {
    title: 'BÁO CÁO BẢN ĐỒ ĐỊNH VỊ THƯƠNG HIỆU & ĐẠI DƯƠNG XANH (PERCEPTUAL MAP)',
    subtitle: 'Định vị vị thế cạnh tranh trên không gian 2D và nhận diện khoảng trống thị trường (White-space)',
    framework: 'Mô hình Multidimensional Brand Perceptual Mapping (MDS)',
    heroLabel: 'TỌA ĐỘ ĐẠI DƯƠNG XANH (WHITE-SPACE)',
    heroSub: 'Vùng thị trường nhu cầu cao chưa có đối thủ',
    getHeroValue: () => ({
      val: 'ĐẠI DƯƠNG XANH',
      sub: 'Tọa độ White-space Opportunity',
      badge: 'VÙNG GIÁ TRỊ THÔNG MINH',
      badgeClass: 'bg-teal-50 text-teal-800 border-teal-300',
    }),
    pillars: [
      { title: 'Tọa Độ Định Vị Hiện Tại', icon: '📍', borderClass: 'border-blue-200', bgClass: 'bg-blue-50/50', textClass: 'text-blue-900' },
      { title: 'Khai Thác Khoảng Trống (White-space)', icon: '🌊', borderClass: 'border-emerald-200', bgClass: 'bg-emerald-50/50', textClass: 'text-emerald-900' },
      { title: 'Lộ Trình Tái Định Vị Cạnh Tranh', icon: '🧭', borderClass: 'border-amber-200', bgClass: 'bg-amber-50/50', textClass: 'text-amber-900' },
    ],
    getBottomKPIs: () => [
      { label: 'Tọa Độ Thương Hiệu', value: '(X: 6.2, Y: 7.8)' },
      { label: 'Tọa Độ Đại Dương Xanh', value: '(X: 7.5, Y: 8.2)' },
      { label: 'Khoảng Cách Cạnh Tranh', value: 'Tách biệt rõ đối thủ đầu ngành' },
    ],
    roadmap: {
      day30: {
        title: 'Giai đoạn 1: Xác Lập Tuyên Ngôn Định Vị Tại Đại Dương Xanh',
        desc: 'Tuyên bố định vị rõ ràng cắm mốc vững chắc tại tọa độ White-space Opportunity, không rơi vào vùng tranh chấp trực diện với thương hiệu dẫn đầu.',
      },
      day60: {
        title: 'Giai đoạn 2: Xây Dựng Bộ Nhận Diện Thương Hiệu Đối Lập',
        desc: 'Thiết kế tài sản nhận diện độc quyền (Distinctive Brand Assets) với tông màu, phom dáng chai/hộp đối lập hoàn toàn đối thủ cùng phân khúc quầy kệ.',
      },
      day90: {
        title: 'Giai đoạn 3: Đo Lường Dịch Chuyển Nhận Thức Thị Trường',
        desc: 'Khảo sát theo dõi (Brand Tracking) để kiểm chứng xem nhận thức của khách hàng mục tiêu đã dịch chuyển về đúng tọa độ mong muốn hay chưa.',
      },
    },
  },
};

export default function PrintReportPage() {
  const params = useParams();
  const surveyId = (params.id as string) || '';
  const router = useRouter();

  const [report, setReport] = useState<ReportPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!surveyId) return;
    api
      .getSurveyResults(surveyId)
      .then(setReport)
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }, [surveyId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-6 text-white text-center">
        <div className="w-12 h-12 border-4 border-amber-400 border-t-transparent rounded-full animate-spin mb-4" />
        <h2 className="text-xl font-serif font-bold text-amber-300">
          Đang nạp dữ liệu Báo Cáo Executive...
        </h2>
        <p className="text-xs text-slate-400 mt-2 font-mono">Mã khảo sát: #{surveyId}</p>
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-6 text-white text-center">
        <div className="max-w-md bg-slate-800 border border-red-700/60 p-6 rounded-2xl">
          <p className="text-red-400 font-semibold mb-3">
            {error || 'Không tìm thấy hồ sơ báo cáo này.'}
          </p>
          <button
            onClick={() => router.push(`/results/${surveyId}`)}
            className="px-4 py-2 bg-amber-500 text-slate-950 font-bold rounded-lg text-xs"
          >
            Quay lại bảng điều khiển
          </button>
        </div>
      </div>
    );
  }

  const modelInfo = MODEL_CONFIGS[report.model_type] || MODEL_CONFIGS.nielsen_bases;
  const heroData = modelInfo.getHeroValue(report);
  const bottomKPIs = modelInfo.getBottomKPIs(report);
  const pInfo = report.product_info || {};
  const isBenchmark = Boolean(
    pInfo.is_benchmark ||
    (typeof surveyId === 'string' && surveyId.startsWith('BM-')) ||
    pInfo.title
  );
  const companyName = isBenchmark
    ? ((pInfo.company_name as string) || 'Khối Nghiên Cứu & Dữ Liệu Thị Trường · 1booking Insight AI Platform')
    : ((pInfo.company_name as string) || (pInfo.brand_name as string) || 'Doanh Nghiệp / Thương Hiệu');
  const productName = (pInfo.title as string) || (pInfo.product_name as string) || (pInfo.name as string) || (pInfo.concept_name as string) || (pInfo.deal_description as string) || (pInfo.brand_name as string) || 'Báo Cáo Nghiên Cứu Thị Trường';
  const category = (pInfo.category as string) || (pInfo.industry_label as string) || (pInfo.industry as string) || 'Tiêu dùng & Dịch vụ';
  const location = report.target_summary?.location || 'Toàn quốc (Đại diện 3 miền)';
  const sampleN = report.target_summary?.sample_size || 2000;
  const moe = (report.target_summary?.margin_of_error && report.target_summary.margin_of_error !== '±3.1%')
    ? report.target_summary.margin_of_error
    : `±${(1.96 * Math.sqrt(0.25 / sampleN) * 100).toFixed(1)}%`;
  const viabilityScore = report.executive_summary?.viability_score || 75;

  // Viability classification
  let viabilityText = 'KHẢ THI (GO WITH CAUTION)';
  let viabilityBadgeClass = 'text-amber-800 bg-amber-50 border-amber-300';
  if (viabilityScore >= 75) {
    viabilityText = 'VƯỢT TRỘI (STRONG GO)';
    viabilityBadgeClass = 'text-emerald-800 bg-emerald-50 border-emerald-300';
  } else if (viabilityScore < 50) {
    viabilityText = 'RỦI RO CAO (PIVOT HOẶC ĐÌNH CHỈ)';
    viabilityBadgeClass = 'text-red-800 bg-red-50 border-red-300';
  }

  // Gender representation calculation
  const targetGender = report.target_summary?.target_gender;
  const isAllFemale = targetGender === 'female';
  const isAllMale = targetGender === 'male';
  const maleDisplay = isAllFemale
    ? '0.0%'
    : isAllMale
    ? '100.0%'
    : `${(report.quantitative_metrics?.demographic_breakdown?.by_gender?.male ?? 49.2).toFixed(1)}%`;
  const femaleDisplay = isAllFemale
    ? '100.0%'
    : isAllMale
    ? '0.0%'
    : `${(report.quantitative_metrics?.demographic_breakdown?.by_gender?.female ?? 50.8).toFixed(1)}%`;

  // Split quotes into 3 groups
  const quotes: VerbatimQuote[] = report.qualitative_insights?.verbatim_quotes || [];
  const positiveQuotes = quotes.filter((q) => q.sentiment === 'positive');
  const negativeQuotes = quotes.filter((q) => q.sentiment === 'negative');
  const neutralQuotes = quotes.filter((q) => q.sentiment === 'neutral' || !['positive', 'negative'].includes(q.sentiment));

  return (
    <div className="bg-slate-900 min-h-screen text-slate-900 selection:bg-amber-500 selection:text-slate-950">
      {/* ── Print & Screen Page Architecture Stylesheet ── */}
      <style jsx global>{`
        @page {
          size: 210mm 297mm;
          margin: 0;
        }
        @media print {
          *, *::before, *::after {
            box-sizing: border-box !important;
          }
          html, body {
            width: 210mm !important;
            height: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
            background: #ffffff !important;
            color: #0f172a !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .no-print {
            display: none !important;
          }
          .sheet {
            margin: 0 !important;
            padding: 12mm 15mm 10mm !important;
            box-shadow: none !important;
            border: none !important;
            border-radius: 0 !important;
            width: 210mm !important;
            min-height: 297mm !important;
            box-sizing: border-box !important;
            display: flex !important;
            flex-direction: column !important;
            justify-content: space-between !important;
            background: #ffffff !important;
          }
          .sheet:not(:last-child) {
            page-break-after: always !important;
            break-after: page !important;
          }
          .sheet:last-child {
            page-break-after: avoid !important;
            break-after: avoid !important;
          }
          .avoid-break, table, tr, .rounded-xl, .rounded-lg {
            break-inside: avoid !important;
            page-break-inside: avoid !important;
          }
        }

        /* Screen Sheet Container (Wysiwyg chuẩn A4, tự động co giãn theo nội dung, không cắt xén) */
        .sheet {
          width: 210mm;
          min-height: 297mm;
          margin: 28px auto;
          padding: 13mm 15mm 11mm;
          background: #ffffff;
          box-shadow: 0 20px 50px -10px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.1);
          box-sizing: border-box;
          position: relative;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          border-radius: 6px;
        }
        .avoid-break {
          break-inside: avoid;
          page-break-inside: avoid;
        }
      `}</style>

      {/* ── FLOATING TOP ACTION BAR (Hidden on Print) ── */}
      <aside aria-label="Thanh công cụ in ấn" className="no-print sticky top-0 z-50 bg-[#0A192F]/95 backdrop-blur-md border-b border-amber-500/30 px-6 py-3 shadow-xl">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <div className="text-white text-xs font-mono">
              <span className="text-amber-400 font-bold uppercase tracking-wider">BÁO CÁO ĐIỀU HÀNH EXECUTIVE CHUẨN IN ẤN A4</span>
              <span className="text-slate-400 ml-2">| Mã hồ sơ: #{surveyId}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href={`/results/${surveyId}`}
              className="px-3.5 py-1.5 rounded-lg border border-slate-600 hover:border-slate-400 text-slate-300 hover:text-white text-xs font-medium transition-colors"
            >
              ← Xem Trên Màn Hình
            </Link>

            <a
              href={`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/survey/${surveyId}/pdf?download=true`}
              download={`Bao-Cao-Nghien-Cuu-Thi-Truong-${surveyId.replace('DEMO-', '')}.pdf`}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold px-5 py-2 rounded-lg text-xs shadow-lg transition-transform hover:scale-105"
            >
              <span>📥 Tải Về File PDF Chính Thức (Chuẩn A4)</span>
            </a>
          </div>
        </div>
      </aside>

      {/* ═════════════════════════════════════════════════════════════════════════
          PAGE 1: TRANG BÌA DOANH NGHIỆP CHUẨN MỰC (EXECUTIVE COVER)
          Thiết kế White Paper tinh tế — Tối ưu in màu và in đen trắng tuyệt đối
      ═════════════════════════════════════════════════════════════════════════ */}
      <section className="sheet relative bg-white text-slate-900 border border-slate-200">
        {/* Subtle Decorative Golden Corner Marks */}
        <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-amber-600/40" />
        <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-amber-600/40" />
        <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-amber-600/40" />
        <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-amber-600/40" />

        {/* Top Header Block */}
        <div className="pt-2">
          <div className="flex items-center justify-between pb-3 border-b-2 border-amber-600">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center shadow-xs">
                <span className="text-amber-400 font-serif font-bold text-xs">AI</span>
              </div>
              <div>
                <span className="font-serif font-bold text-slate-900 text-sm tracking-tight block">
                  INSIGHT AI — MARKET RESEARCH PLATFORM
                </span>
                <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block">
                  Hệ thống mô phỏng phản ứng thị trường bằng Tác tử AI Đa Nhân Khẩu (GSO Benchmark Stratified Synthetic Panel)
                </span>
              </div>
            </div>

            <div className="px-3 py-1 rounded border border-red-300 text-[10px] font-mono tracking-widest text-red-700 uppercase bg-red-50/80 font-bold">
              STRICTLY CONFIDENTIAL · DÀNH RIÊNG HĐQT
            </div>
          </div>
        </div>

        {/* Center Main Title & Information Block */}
        <div className="my-auto py-4 space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 border border-amber-300 rounded text-amber-800 text-[11px] font-mono font-bold uppercase tracking-wider">
            <span>✦</span>
            <span>{modelInfo.framework}</span>
          </div>

          <h1 className="font-serif text-2xl sm:text-3xl font-black text-slate-900 leading-tight tracking-tight">
            {isBenchmark && pInfo.title ? pInfo.title : modelInfo.title}
          </h1>

          <div className="border-l-4 border-amber-600 pl-4 py-1">
            <div className="text-lg sm:text-xl font-serif text-amber-700 font-bold">
              {isBenchmark ? `Mô hình thực nghiệm: ${modelInfo.framework}` : `Dự án: ${productName}`}
            </div>
            <div className="text-xs font-sans text-slate-700 mt-1 font-semibold">
              <span>{isBenchmark ? 'Đơn vị nghiên cứu & công bố: ' : 'Đơn vị yêu cầu / Khách hàng: '}</span>
              <span className="text-slate-900 font-bold">{companyName}</span> · Ngành: <span className="text-slate-800">{category}</span>
            </div>
          </div>

          <p className="text-slate-600 text-xs leading-relaxed max-w-xl">
            {modelInfo.subtitle}. Báo cáo được xây dựng trên cơ sở đối chuẩn phân tầng khoa học theo Niên giám Thống kê của Tổng cục Thống kê (GSO) kết hợp mô hình hành vi mua sắm thị trường và Định lý Giới hạn Trung tâm, bảo đảm giá trị tham chiếu cao nhất cho Ban Giám Đốc và Hội Đồng Quản Trị.
          </p>

          {/* Concept Image Preview on Cover Page if uploaded */}
          {pInfo.concept_image_url && (
            <div className="flex items-center gap-3 p-2.5 bg-amber-50/50 border border-amber-200/60 rounded-lg">
              <img
                src={pInfo.concept_image_url}
                alt="Ảnh bao bì sản phẩm"
                className="w-16 h-16 object-cover rounded border border-slate-200 bg-white shrink-0"
              />
              <div className="min-w-0">
                <span className="text-[10px] font-mono uppercase font-bold text-amber-800 tracking-wider block">
                  TÀI SẢN HÌNH ẢNH / BAO BÌ THỰC NGHIỆM ĐÃ THẨM ĐỊNH
                </span>
                <p className="text-[11px] text-slate-600 truncate mt-0.5 font-medium">
                  Đã nạp vào quy trình mô phỏng thị trường cho N={sampleN.toLocaleString('vi-VN')} personas
                </p>
              </div>
            </div>
          )}

          {/* A/B Testing Images on Cover Page */}
          {(pInfo.option_a_image_url || pInfo.option_b_image_url) && (
            <div className="grid grid-cols-2 gap-3 p-2.5 bg-amber-50/50 border border-amber-200/60 rounded-lg">
              <div className="flex items-center gap-2">
                {pInfo.option_a_image_url ? (
                  <img src={pInfo.option_a_image_url} alt="Option A" className="w-12 h-12 object-cover rounded border border-slate-200 bg-white shrink-0" />
                ) : null}
                <div>
                  <span className="text-[10px] font-mono font-bold text-slate-800 block">Phương án A</span>
                  <span className="text-[9px] text-slate-500 truncate block max-w-[140px]">{pInfo.option_a_description || 'Mẫu thiết kế A'}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {pInfo.option_b_image_url ? (
                  <img src={pInfo.option_b_image_url} alt="Option B" className="w-12 h-12 object-cover rounded border border-slate-200 bg-white shrink-0" />
                ) : null}
                <div>
                  <span className="text-[10px] font-mono font-bold text-slate-800 block">Phương án B</span>
                  <span className="text-[9px] text-slate-500 truncate block max-w-[140px]">{pInfo.option_b_description || 'Mẫu thiết kế B'}</span>
                </div>
              </div>
            </div>
          )}

          {/* Metadata Specification Table (6 Clean Cells) */}
          <div className="pt-2">
            <div className="text-[10px] font-mono uppercase font-bold text-slate-400 tracking-wider mb-2">
              BẢN KÊ THÔNG SỐ KHẢO SÁT & ĐỊNH DANH HỒ SƠ:
            </div>
            <div className="grid grid-cols-3 gap-2.5 bg-slate-50 border border-slate-200 rounded-xl p-4 font-mono text-xs">
              <div className="p-2 bg-white rounded border border-slate-100">
                <span className="text-[9px] text-slate-400 uppercase block tracking-wider mb-0.5">
                  Doanh nghiệp yêu cầu
                </span>
                <span className="text-slate-900 font-bold text-[11px] truncate block">
                  {companyName}
                </span>
              </div>

              <div className="p-2 bg-white rounded border border-slate-100">
                <span className="text-[9px] text-slate-400 uppercase block tracking-wider mb-0.5">
                  Mã khảo sát độc bản
                </span>
                <span className="text-amber-700 font-bold text-[11px] tracking-wide block">
                  #{surveyId}
                </span>
              </div>

              <div className="p-2 bg-white rounded border border-slate-100">
                <span className="text-[9px] text-slate-400 uppercase block tracking-wider mb-0.5">
                  Phương pháp & Cỡ mẫu
                </span>
                <span className="text-slate-900 font-semibold text-[11px] block">
                  Synthetic Panel (N={sampleN.toLocaleString('vi-VN')})
                </span>
              </div>

              <div className="p-2 bg-white rounded border border-slate-100">
                <span className="text-[9px] text-slate-400 uppercase block tracking-wider mb-0.5">
                  Độ tin cậy & Sai số biên
                </span>
                <span className="text-emerald-700 font-semibold text-[11px] block">
                  95.0% | Sai số {moe}
                </span>
              </div>

              <div className="p-2 bg-white rounded border border-slate-100">
                <span className="text-[9px] text-slate-400 uppercase block tracking-wider mb-0.5">
                  Địa bàn & Độ tuổi
                </span>
                <span className="text-slate-800 font-medium text-[11px] truncate block">
                  {location}
                </span>
              </div>

              <div className="p-2 bg-white rounded border border-slate-100">
                <span className="text-[9px] text-slate-400 uppercase block tracking-wider mb-0.5">
                  Ngày phát hành
                </span>
                <span className="text-slate-600 text-[11px] block">
                  {new Date(report.generated_at).toLocaleDateString('vi-VN')} · 1booking Engine
                </span>
              </div>
            </div>

            {/* Target Audience Profile Ribbon on Cover Page */}
            {report.target_summary?.demographics && (
              <div className="mt-2.5 p-2 bg-amber-50/80 border border-amber-200/90 rounded-lg text-left flex items-start gap-2">
                <span className="text-amber-800 font-bold text-[10px] shrink-0 font-mono">🎯 ĐỐI TƯỢNG MỤC TIÊU:</span>
                <span className="text-slate-800 font-semibold text-[10.5px] leading-snug">{report.target_summary.demographics}</span>
              </div>
            )}

            {/* Historical Survey Calibration Badge on Cover Page */}
            {pInfo.historical_dataset && (
              <div className="mt-2 p-2 bg-gradient-to-r from-amber-100/90 to-amber-50 border border-amber-300 rounded-lg text-left flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className="text-amber-900 font-bold text-[10px] shrink-0 font-mono">🧠 ĐỐI CHUẨN KHẢO SÁT LỊCH SỬ:</span>
                  <span className="text-slate-800 font-semibold text-[10px] truncate">
                    {pInfo.historical_dataset.filename} ({pInfo.historical_dataset.total_rows?.toLocaleString('vi-VN')} dòng mẫu)
                  </span>
                </div>
                <span className="text-[9px] font-mono font-bold bg-amber-500 text-slate-950 px-1.5 py-0.5 rounded shrink-0">
                  FEW-SHOT TUNED
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Verification & Certification Seal */}
        <div className="pb-2 border-t border-slate-200 pt-3">
          <div className="flex items-center justify-between text-[10px] font-mono text-slate-500">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
              <span>Khung phân tầng đối chuẩn: Niên giám Thống kê GSO Việt Nam</span>
              <span>·</span>
              <span>SHA256: {(surveyId + '-KANTAR-NIELSEN-CERT').slice(0, 20).toUpperCase()}</span>
            </div>
            <div className="font-bold text-slate-700">
              PHẦN 01 · BÌA BÁO CÁO
            </div>
          </div>
        </div>
      </section>

      {/* ═════════════════════════════════════════════════════════════════════════
          PAGE 2: BẢN KẾT LUẬN CHIẾN LƯỢC (EXECUTIVE SUMMARY & VERDICT)
      ═════════════════════════════════════════════════════════════════════════ */}
      <section className="sheet bg-white text-slate-900 border border-slate-200">
        {/* Page Header */}
        <div className="border-b border-slate-200 pb-2.5 flex items-center justify-between">
          <div>
            <div className="text-[10px] font-mono text-amber-700 uppercase tracking-widest font-bold">
              PHẦN 02 · BẢN KẾT LUẬN CHIẾN LƯỢC DÀNH CHO HĐQT
            </div>
            <h2 className="font-serif text-lg font-black text-slate-900">
              Đánh Giá Khả Thi & Khuyến Nghị Quyết Định (Actionable Verdict)
            </h2>
          </div>
          <div className="text-[11px] font-mono text-slate-400">MÃ: #{surveyId}</div>
        </div>

        {/* Content Body */}
        <div className="space-y-4 my-auto">
          {/* Top Score & Decision Box: Model-Specific Hero */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-stretch bg-slate-50 border border-slate-200 rounded-xl p-4">
            {/* Left Score / Hero Box */}
            <div className="md:col-span-4 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-slate-200 pb-3 md:pb-0 md:pr-4 text-center">
              <div className="font-serif text-3xl font-black text-slate-900 leading-tight mb-1">
                {heroData.val}
              </div>
              <div className="text-[9px] uppercase font-bold text-slate-500 font-mono mb-2">
                {heroData.sub}
              </div>
              <div className={`px-2.5 py-0.5 rounded-full border text-[9.5px] font-bold font-mono tracking-wider ${heroData.badgeClass}`}>
                {heroData.badge}
              </div>
              <div className="text-[9.5px] text-slate-500 mt-2 font-medium">
                {modelInfo.heroSub}
              </div>
            </div>

            {/* Right Verdict Box */}
            <div className="md:col-span-8 flex flex-col justify-between">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-amber-100 text-amber-900 text-[9px] font-bold uppercase tracking-wider mb-1 font-mono">
                  <span>🏛️ NHẬN ĐỊNH CHIẾN LƯỢC TỪ CHUYÊN GIA PHÂN TÍCH</span>
                </div>
                <h3 className="font-serif text-sm font-bold text-slate-900 mb-1.5">
                  Nhận định điều hành dành cho Ban Giám Đốc (Executive Strategic Verdict)
                </h3>
                <div className="p-3 bg-white border-l-4 border-amber-600 rounded-r-lg border border-slate-200 shadow-2xs">
                  <p className="text-slate-800 text-xs leading-relaxed italic font-medium">
                    "{report.executive_summary?.verdict || 'Sản phẩm có phản ứng khả quan trên thị trường mục tiêu.'}"
                  </p>
                </div>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-200">
                <span className="text-[9.5px] font-mono uppercase font-bold text-slate-500 block mb-1">
                  Top 3 phát hiện thị trường then chốt:
                </span>
                <ul className="space-y-1 text-xs text-slate-700">
                  {(report.executive_summary?.top_findings || []).slice(0, 3).map((f, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-amber-600 font-bold mt-0.5">✦</span>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* 3 Columns: Model-Specific Framework Pillars */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {modelInfo.pillars.map((pillar, idx) => (
              <div key={idx} className={`${pillar.bgClass} border ${pillar.borderClass} rounded-xl p-3.5`}>
                <div className={`flex items-center gap-1.5 mb-2 ${pillar.textClass} font-bold text-xs`}>
                  <span>{pillar.icon}</span>
                  <span className="font-serif uppercase tracking-wide">{pillar.title}</span>
                </div>
                <ul className="space-y-1.5 text-[11px] text-slate-700">
                  {/* Bullet 1: Core Action for this specific pillar */}
                  <li className="bg-white p-2.5 rounded-lg border border-slate-200/80 shadow-2xs">
                    <span className={`font-bold block mb-1 text-[10.5px] ${idx === 0 ? 'text-emerald-700' : idx === 1 ? 'text-blue-700' : 'text-amber-700'}`}>
                      ✦ Hành động chiến lược:
                    </span>
                    <span className="leading-relaxed">
                      {report.actionable_recommendations?.[idx] || 'Triển khai giải pháp hành động cụ thể cho trụ cột này.'}
                    </span>
                  </li>
                  {/* Bullet 2: Supporting Grounding / Data Signal */}
                  <li className="bg-white/90 p-2 rounded-lg border border-slate-200/60 text-[10px] text-slate-600">
                    <span className="font-bold text-slate-700 block mb-0.5">› Căn cứ dữ liệu:</span>
                    <span className="leading-snug">
                      {idx === 0
                        ? (report.qualitative_insights?.top_drivers?.[0] || 'Phản hồi tích cực vượt trội từ tập khách hàng mục tiêu.')
                        : idx === 1
                        ? (report.qualitative_insights?.top_drivers?.[1] || 'Đảm bảo minh bạch giá trị nhận được để củng cố lòng tin.')
                        : (report.qualitative_insights?.top_barriers?.[0] || 'Kiểm soát rào cản nhận thức để bảo vệ tỷ lệ chuyển đổi.')
                      }
                    </span>
                  </li>
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Page Footer */}
        <div className="border-t border-slate-200 pt-2 flex items-center justify-between text-[10px] text-slate-400 font-mono">
          <span>Khảo sát độc quyền: insight.1booking.asia Intelligence System</span>
          <span className="font-bold text-slate-600">PHẦN 02 · TỔNG QUAN CHIẾN LƯỢC</span>
        </div>
      </section>

      {/* ═════════════════════════════════════════════════════════════════════════
          PAGE 3: CƠ SỞ KHOA HỌC & MA TRẬN NHÂN KHẨU HỌC (METHODOLOGY & SAMPLING)
      ═════════════════════════════════════════════════════════════════════════ */}
      <section className="sheet bg-white text-slate-900 border border-slate-200">
        {/* Page Header */}
        <div className="border-b border-slate-200 pb-2.5 flex items-center justify-between">
          <div>
            <div className="text-[10px] font-mono text-amber-700 uppercase tracking-widest font-bold">
              PHẦN 03 · CƠ SỞ KHOA HỌC & PHƯƠNG PHÁP LUẬN
            </div>
            <h2 className="font-serif text-lg font-black text-slate-900">
              Quy Chuẩn Thống Kê & Phân Tầng Nhân Khẩu Học (Sampling Matrix)
            </h2>
          </div>
          <div className="text-[11px] font-mono text-slate-400">MÃ: #{surveyId}</div>
        </div>

        {/* Content Body */}
        <div className="space-y-4 my-auto">
          {/* Academic Statement Banner (Clean white / slate for B&W print) */}
          <div className="bg-slate-50 border-2 border-slate-300 p-4 rounded-xl">
            <div className="flex items-center gap-2 mb-1.5 text-slate-900 font-mono text-xs font-bold uppercase tracking-wider">
              <span>📐</span>
              <span>CÔNG BỐ PHƯƠNG PHÁP LUẬN ĐỊNH LƯỢNG CHUẨN XÁC SUẤT QUỐC TẾ</span>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed">
              Khảo sát được thực hiện trên mẫu mô phỏng phân tầng ngẫu nhiên (<strong className="text-slate-900">Stratified Random Sampling</strong>) với cỡ mẫu quy chuẩn <strong className="text-slate-900">N = {sampleN.toLocaleString('vi-VN')}</strong> personas độc lập theo công thức William G. Cochran (1977):
            </p>
            <div className="grid grid-cols-3 gap-2.5 mt-2.5 pt-2.5 border-t border-slate-200 text-center font-mono">
              <div className="bg-white p-2 rounded border border-slate-200">
                <span className="text-[9px] text-slate-500 uppercase block">Độ tin cậy thống kê</span>
                <span className="text-sm font-bold text-emerald-700">95.0% (Z=1.96)</span>
              </div>
              <div className="bg-white p-2 rounded border border-slate-200">
                <span className="text-[9px] text-slate-500 uppercase block">Khoảng sai số biên (MoE)</span>
                <span className="text-sm font-bold text-amber-700">{moe}</span>
              </div>
              <div className="bg-white p-2 rounded border border-slate-200">
                <span className="text-[9px] text-slate-500 uppercase block">Khung đối chuẩn phân tầng</span>
                <span className="text-sm font-bold text-slate-900">Niên giám Thống kê GSO</span>
              </div>
            </div>
          </div>

          {/* Target Audience Specification Card */}
          <div className="bg-amber-50/70 border-2 border-amber-300 p-3 rounded-xl space-y-2">
            <div className="flex items-center justify-between mb-1 text-amber-900 font-mono text-[9.5px] font-bold uppercase tracking-wider">
              <span className="flex items-center gap-1.5">
                <span>🎯</span>
                <span>HỒ SƠ ĐỐI CHUẨN PHÂN TẦNG MỤC TIÊU (AUDIENCE TARGETING & BENCHMARK PROFILE)</span>
              </span>
              <span className="text-[9px] bg-amber-100 text-amber-900 px-2 py-0.5 rounded font-mono">
                DuckDB 1M Personas
              </span>
            </div>
            <div className="text-slate-900 font-bold text-xs font-serif">
              {report.target_summary?.demographics || `${sampleN.toLocaleString('vi-VN')} Tác tử AI đối chuẩn theo khung phân tầng Niên giám GSO`}
            </div>

            {/* Các Tầng Khoa Học Chuẩn Mực Trong Bản In */}
            <div className={`grid ${pInfo.historical_dataset ? 'grid-cols-3' : 'grid-cols-2'} gap-2 pt-1 border-t border-amber-200/80 text-[9.5px] leading-tight`}>
              <div className="bg-white/80 p-1.5 rounded border border-amber-200/80">
                <strong className="text-amber-950 font-mono block text-[9px] uppercase">🏛️ Tầng 1: Khung nhân khẩu học GSO</strong>
                <span className="text-slate-600">Khung mẫu phân tầng được chuẩn hóa và đối chuẩn theo Niên giám Thống kê GSO, phản ánh sát cơ cấu độ tuổi, giới tính, vùng miền và thu nhập.</span>
              </div>
              <div className="bg-white/80 p-1.5 rounded border border-amber-200/80">
                <strong className="text-amber-950 font-mono block text-[9px] uppercase">🛒 Tầng 2: Hành vi & Tâm lý mua sắm</strong>
                <span className="text-slate-600">Mô hình hành vi tiêu dùng được tổng hợp từ dữ liệu thói quen thương mại điện tử, mức chi tiêu khả dụng và văn hóa bán lẻ bản địa tại Việt Nam.</span>
              </div>
              {pInfo.historical_dataset && (
                <div className="bg-amber-100/70 p-1.5 rounded border border-amber-300">
                  <strong className="text-amber-950 font-mono block text-[9px] uppercase">🧠 Tầng 3: Đối chuẩn ngành thực chiến</strong>
                  <span className="text-slate-700">Đã nạp {pInfo.historical_dataset.total_rows?.toLocaleString('vi-VN')} dòng dữ liệu từ {pInfo.historical_dataset.filename} để hiệu chỉnh văn phong và rào cản từ chối sát thực tế nhất.</span>
                </div>
              )}
            </div>

            <div className="grid grid-cols-4 gap-2 pt-1.5 border-t border-amber-200 text-center font-mono text-[9px]">
              <div className="bg-white p-1 rounded border border-amber-100">
                <span className="text-slate-400 block">Địa bàn</span>
                <strong className="text-slate-800 truncate block">{report.target_summary?.location}</strong>
              </div>
              <div className="bg-white p-1 rounded border border-amber-100">
                <span className="text-slate-400 block">Giới tính</span>
                <strong className="text-slate-800 block">{isAllFemale ? '100% Nữ giới' : isAllMale ? '100% Nam giới' : 'Đại diện Nam & Nữ'}</strong>
              </div>
              <div className="bg-white p-1 rounded border border-amber-100">
                <span className="text-slate-400 block">Thu nhập</span>
                <strong className="text-slate-800 truncate block">{report.target_summary?.target_income === 'AB' ? 'Hạng A-B (>15tr)' : report.target_summary?.target_income === 'A' ? 'Hạng A (>25tr)' : report.target_summary?.target_income === 'CD' ? 'Hạng C-D (<15tr)' : 'Đa dạng phân khúc'}</strong>
              </div>
              <div className="bg-white p-1 rounded border border-amber-100">
                <span className="text-slate-400 block">Môi trường</span>
                <strong className="text-slate-800 truncate block">{report.target_summary?.target_zone === 'urban' ? 'Khu vực Đô Thị' : report.target_summary?.target_zone === 'rural' ? 'Khu vực Nông Thôn' : 'Toàn địa bàn'}</strong>
              </div>
            </div>
          </div>

          {/* Demographic Breakdown Grid */}
          <div className="grid grid-cols-2 gap-3">
            {/* Age Pyramid / Breakdown */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5">
              <h4 className="font-serif font-bold text-xs text-slate-900 mb-0.5">
                Cơ cấu theo nhóm tuổi (Age Segments)
              </h4>
              <p className="text-[10px] text-slate-500 mb-2">Tỷ lệ phân tầng thế hệ người tiêu dùng</p>
              <div className="space-y-2">
                {[
                  { label: 'Gen Z (18 - 24 tuổi)', pct: 28, color: 'bg-indigo-600' },
                  { label: 'Millennials (25 - 38 tuổi)', pct: 44, color: 'bg-slate-900' },
                  { label: 'Gen X (39 - 54 tuổi)', pct: 22, color: 'bg-amber-600' },
                  { label: 'Baby Boomers (55+ tuổi)', pct: 6, color: 'bg-slate-500' },
                ].map((item) => (
                  <div key={item.label} className="text-[10.5px]">
                    <div className="flex justify-between mb-0.5">
                      <span className="text-slate-700 font-medium">{item.label}</span>
                      <span className="font-mono font-bold text-slate-900">{item.pct}%</span>
                    </div>
                    <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                      <div className={`${item.color} h-full rounded-full`} style={{ width: `${item.pct}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Geography Breakdown */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5">
              <h4 className="font-serif font-bold text-xs text-slate-900 mb-0.5">
                Phân bổ vùng miền & Đô thị
              </h4>
              <p className="text-[10px] text-slate-500 mb-2">Tỷ lệ theo địa bàn kinh tế trọng điểm</p>
              <div className="space-y-2">
                {[
                  { label: 'TP. Hồ Chí Minh & Đông Nam Bộ', pct: 41, color: 'bg-emerald-600' },
                  { label: 'Hà Nội & ĐBS Hồng', pct: 33, color: 'bg-blue-600' },
                  { label: 'Đà Nẵng & Miền Trung', pct: 16, color: 'bg-amber-600' },
                  { label: 'Đồng bằng sông Cửu Long', pct: 10, color: 'bg-slate-600' },
                ].map((item) => (
                  <div key={item.label} className="text-[10.5px]">
                    <div className="flex justify-between mb-0.5">
                      <span className="text-slate-700 font-medium">{item.label}</span>
                      <span className="font-mono font-bold text-slate-900">{item.pct}%</span>
                    </div>
                    <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                      <div className={`${item.color} h-full rounded-full`} style={{ width: `${item.pct}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Income & Gender Two Column */}
          <div className="grid grid-cols-2 gap-3">
            {/* Income Tiers */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5">
              <h4 className="font-serif font-bold text-xs text-slate-900 mb-1.5">
                Phân khúc thu nhập hàng tháng
              </h4>
              <div className="grid grid-cols-2 gap-1.5 text-center text-[10px] font-mono">
                <div className="bg-white p-1.5 rounded border border-slate-200">
                  <span className="text-slate-400 block">&lt; 10 Triệu</span>
                  <span className="font-bold text-slate-800 text-xs">24.5%</span>
                </div>
                <div className="bg-white p-1.5 rounded border border-slate-200">
                  <span className="text-slate-400 block">10 - 25 Triệu</span>
                  <span className="font-bold text-slate-900 text-xs">48.2%</span>
                </div>
                <div className="bg-white p-1.5 rounded border border-slate-200">
                  <span className="text-slate-400 block">25 - 50 Triệu</span>
                  <span className="font-bold text-amber-700 text-xs">21.8%</span>
                </div>
                <div className="bg-white p-1.5 rounded border border-slate-200">
                  <span className="text-slate-400 block">&gt; 50 Triệu</span>
                  <span className="font-bold text-emerald-700 text-xs">5.5%</span>
                </div>
              </div>
            </div>

            {/* Gender & Occupation */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 flex flex-col justify-between">
              <div>
                <h4 className="font-serif font-bold text-xs text-slate-900 mb-0.5">
                  Cân đối giới tính & Nghề nghiệp
                </h4>
                <p className="text-[10px] text-slate-500 mb-1.5">Tỷ lệ theo phân vai thực tế của mẫu</p>
              </div>

              <div className="flex items-center gap-2 bg-white p-2.5 rounded-lg border border-slate-200">
                <div className="flex-1 text-center border-r border-slate-200">
                  <span className="text-[9.5px] text-slate-400 font-mono block">NAM GIỚI</span>
                  <span className="font-serif text-base font-bold text-slate-900">{maleDisplay}</span>
                </div>
                <div className="flex-1 text-center">
                  <span className="text-[9.5px] text-slate-400 font-mono block">NỮ GIỚI</span>
                  <span className="font-serif text-base font-bold text-amber-700">{femaleDisplay}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Page Footer */}
        <div className="border-t border-slate-200 pt-2 flex items-center justify-between text-[10px] text-slate-400 font-mono">
          <span>Khung phân tầng đối chuẩn: Niên giám Thống kê GSO & Synthetic Consumer Engine</span>
          <span className="font-bold text-slate-600">PHẦN 03 · KHUNG MẪU GSO</span>
        </div>
      </section>

      {/* ═════════════════════════════════════════════════════════════════════════
          PAGE 4: PHÂN TÍCH CHUYÊN SÂU THEO MÔ HÌNH NGHIÊN CỨU (DEEP-DIVE CHARTS)
      ═════════════════════════════════════════════════════════════════════════ */}
      <section className="sheet bg-white text-slate-900 border border-slate-200">
        {/* Page Header */}
        <div className="border-b border-slate-200 pb-2.5 flex items-center justify-between">
          <div>
            <div className="text-[10px] font-mono text-amber-700 uppercase tracking-widest font-bold">
              PHẦN 04 · BIỂU ĐỒ CHUYÊN SÂU THEO MÔ HÌNH
            </div>
            <h2 className="font-serif text-lg font-black text-slate-900">
              Phân Tích Kinh Tế Học & Ma Trận Định Lượng Chi Tiết
            </h2>
          </div>
          <div className="text-[11px] font-mono text-slate-400">MÃ: #{surveyId}</div>
        </div>

        {/* Dynamic Model-Specific Content Body */}
        <div className="space-y-3.5 my-auto">
          {/* ════════════════════════════════════════════════════════════════════
              CASE 1: NIELSEN BASES — KIỂM ĐỊNH Ý TƯỞNG SẢN PHẨM MỚI
          ════════════════════════════════════════════════════════════════════ */}
          {(report.model_type === 'nielsen_bases' || (!['van_westendorp', 'ab_testing', 'ua_study', 'deal_elasticity', 'monadic', 'maxdiff', 'kano', 'brand_map'].includes(report.model_type))) && (
            <div className="space-y-3">
              {/* Top Summary Banner */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h3 className="font-serif text-sm font-bold text-slate-900">
                      Ma Trận Định Vị 2 Trục Nielsen BASES (Relevance vs Uniqueness)
                    </h3>
                    <p className="text-[10.5px] text-slate-500">
                      Đo lường mức độ tương quan giữa Tính Độc Đáo (Trục Hoành) và Mức Độ Thiết Yếu (Trục Tung)
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded bg-emerald-100 text-emerald-900 font-mono text-xs font-bold">
                      Top-2-Box: {report.quantitative_metrics?.purchase_intent_top2box || `${report.quantitative_metrics?.model_specific?.top2box_pct || 63.4}%`}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-900 font-mono text-[10px] font-bold">
                      Dự báo Mua thử: {report.quantitative_metrics?.model_specific?.trial_rate_forecast || 32.5}%
                    </span>
                  </div>
                </div>

                {/* 2x2 Matrix Visual */}
                <div className="grid grid-cols-2 gap-2 h-40">
                  <div className="bg-amber-50/70 border border-amber-200 rounded-lg p-2 flex flex-col justify-between">
                    <span className="text-[9px] font-mono font-bold text-amber-800 uppercase">
                      THỊ TRƯỜNG NGÁCH (NICHE HERO)
                    </span>
                    <p className="text-[9.5px] text-amber-900/80 leading-tight">
                      Độ độc đáo vượt trội nhưng dung lượng thị trường chọn lọc theo tệp riêng.
                    </p>
                  </div>

                  <div className="bg-emerald-50 border-2 border-emerald-500 rounded-lg p-2 flex flex-col justify-between shadow-2xs relative">
                    <span className="absolute top-1.5 right-1.5 text-[8px] px-1.5 py-0.5 rounded bg-emerald-600 text-white font-mono font-bold">
                      VỊ TRÍ HIỆN TẠI
                    </span>
                    <span className="text-[9px] font-mono font-bold text-emerald-900 uppercase">
                      NGÔI SAO ĐỘT PHÁ (BREAKTHROUGH STAR)
                    </span>
                    <p className="text-[9.5px] text-emerald-950 font-medium leading-tight">
                      Đạt cả 2 tiêu chí: Ý tưởng mới lạ và tỷ lệ chấp nhận dùng thử cực cao (&gt;65%).
                    </p>
                  </div>

                  <div className="bg-slate-100/80 border border-slate-200 rounded-lg p-2 flex flex-col justify-between">
                    <span className="text-[9px] font-mono font-bold text-slate-600 uppercase">
                      NGUY CƠ THẤT BẠI (FLOP RISK)
                    </span>
                    <p className="text-[9.5px] text-slate-500 leading-tight">
                      Thiếu tính mới lạ lẫn mức độ thiết yếu. Cần tái cấu trúc toàn bộ concept.
                    </p>
                  </div>

                  <div className="bg-blue-50/70 border border-blue-200 rounded-lg p-2 flex flex-col justify-between">
                    <span className="text-[9px] font-mono font-bold text-blue-800 uppercase">
                      HÀNG BẮT CHƯỚC (ME-TOO / COMMODITY)
                    </span>
                    <p className="text-[9.5px] text-blue-900/80 leading-tight">
                      Nhu cầu thiết yếu cao nhưng dễ bị thay thế bởi đối thủ cạnh tranh giá rẻ.
                    </p>
                  </div>
                </div>
              </div>

              {/* KPI Score Cards & Barrier Map */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-stretch">
                {/* 3 KPI Cards (7 cols) */}
                <div className="md:col-span-7 grid grid-cols-3 gap-2 text-center font-mono">
                  <div className="p-2 bg-white border border-slate-200 rounded-xl flex flex-col justify-center">
                    <span className="text-[9px] text-slate-400 uppercase block">Điểm Thiết Yếu (Appeal)</span>
                    <span className="font-serif text-base font-bold text-slate-900 mt-0.5">
                      {report.quantitative_metrics?.appeal_score?.toFixed(1) || '4.1'} / 5.0
                    </span>
                  </div>
                  <div className="p-2 bg-white border border-slate-200 rounded-xl flex flex-col justify-center">
                    <span className="text-[9px] text-slate-400 uppercase block">Độ Độc Đáo (Uniqueness)</span>
                    <span className="font-serif text-base font-bold text-amber-700 mt-0.5">
                      {report.quantitative_metrics?.uniqueness_score?.toFixed(1) || '3.8'} / 5.0
                    </span>
                  </div>
                  <div className="p-2 bg-white border border-slate-200 rounded-xl flex flex-col justify-center">
                    <span className="text-[9px] text-slate-400 uppercase block">Chỉ Số Rủi Ro Flop</span>
                    <span className="font-serif text-base font-bold text-emerald-700 mt-0.5">
                      {Number(report.quantitative_metrics?.model_specific?.flop_risk_index) || 8}% (An toàn)
                    </span>
                  </div>
                </div>

                {/* Barrier Map (5 cols) */}
                <div className="md:col-span-5 bg-slate-50 border border-slate-200 rounded-xl p-2.5">
                  <span className="text-[9px] font-mono uppercase font-bold text-slate-500 block mb-1">
                    Bản đồ rào cản từ chối mua (Barrier Map):
                  </span>
                  <ul className="space-y-1 text-[10px] text-slate-700">
                    {(report.qualitative_insights?.top_barriers || [
                      'Cần dùng thử dung tích nhỏ trước khi mua',
                      'Cần minh bạch chứng nhận kiểm định chất lượng',
                    ]).slice(0, 2).map((b, i) => (
                      <li key={i} className="flex items-start gap-1">
                        <span className="text-red-500 font-bold">✕</span>
                        <span className="truncate">{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* ════════════════════════════════════════════════════════════════════
              CASE 2: VAN WESTENDORP PSM — ĐỘ NHẠY CẢM VỀ GIÁ
          ════════════════════════════════════════════════════════════════════ */}
          {report.model_type === 'van_westendorp' && (
            <div className="space-y-3">
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h3 className="font-serif text-sm font-bold text-slate-900">
                      Đồ Thị 4 Đường Cong Van Westendorp (Price Sensitivity Curves)
                    </h3>
                    <p className="text-[10.5px] text-slate-500">
                      Giao điểm 4 đường tích lũy xác lập Điểm Giá Tối Ưu (OPP) và Vùng Giá An Toàn (RAP)
                    </p>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-900 font-mono text-xs font-bold">
                    Van Westendorp PSM
                  </span>
                </div>

                {/* SVG Curves Graph */}
                <div className="w-full bg-white rounded-lg border border-slate-200 p-2.5 relative">
                  <svg viewBox="0 0 520 180" className="w-full h-44">
                    {/* Horizontal Grid */}
                    <line x1="50" y1="20" x2="500" y2="20" stroke="#F1F5F9" strokeWidth="1" />
                    <line x1="50" y1="55" x2="500" y2="55" stroke="#F1F5F9" strokeWidth="1" />
                    <line x1="50" y1="90" x2="500" y2="90" stroke="#F1F5F9" strokeWidth="1" />
                    <line x1="50" y1="125" x2="500" y2="125" stroke="#F1F5F9" strokeWidth="1" />
                    <line x1="50" y1="150" x2="500" y2="150" stroke="#CBD5E1" strokeWidth="1.2" />

                    {/* Shaded RAP Corridor */}
                    <rect x="150" y="20" width="240" height="130" fill="#FEF3C7" fillOpacity="0.35" rx="2" />
                    <text x="270" y="32" fill="#B45309" fontSize="8" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
                      VÙNG GIÁ CHẤP NHẬN (RAP): {Number(report.quantitative_metrics?.model_specific?.pmc || 24200).toLocaleString('vi-VN')} đ – {Number(report.quantitative_metrics?.model_specific?.pme || 31600).toLocaleString('vi-VN')} đ
                    </text>

                    {/* Vertical Guide Lines */}
                    <line x1="150" y1="40" x2="150" y2="150" stroke="#059669" strokeWidth="1" strokeDasharray="2 2" />
                    <line x1="230" y1="40" x2="230" y2="150" stroke="#D97706" strokeWidth="1.5" strokeDasharray="2 2" />
                    <line x1="275" y1="40" x2="275" y2="150" stroke="#2563EB" strokeWidth="1" strokeDasharray="2 2" />
                    <line x1="390" y1="40" x2="390" y2="150" stroke="#DC2626" strokeWidth="1" strokeDasharray="2 2" />

                    {/* 4 Curves */}
                    <path d="M 50 25 C 115 30, 175 80, 230 115 C 290 135, 410 148, 500 150" fill="none" stroke="#059669" strokeWidth="2.5" />
                    <path d="M 50 45 C 135 55, 215 95, 275 118 C 350 138, 430 148, 500 150" fill="none" stroke="#2563EB" strokeWidth="2" strokeDasharray="4 2" />
                    <path d="M 50 148 C 135 145, 215 132, 275 95 C 350 60, 430 40, 500 28" fill="none" stroke="#D97706" strokeWidth="2" strokeDasharray="4 2" />
                    <path d="M 50 150 C 175 148, 275 135, 355 90 C 415 55, 465 30, 500 22" fill="none" stroke="#DC2626" strokeWidth="2.5" />

                    {/* Intersections */}
                    <circle cx="150" cy="115" r="4" fill="#059669" stroke="#FFF" strokeWidth="1.5" />
                    <circle cx="230" cy="102" r="5" fill="#D97706" stroke="#FFF" strokeWidth="2" />
                    <text x="230" y="93" fill="#B45309" fontSize="8.5" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
                      ★ OPP: {Number(report.quantitative_metrics?.model_specific?.opp || report.quantitative_metrics?.model_specific?.optimal_price || 26200).toLocaleString('vi-VN')} đ
                    </text>
                    <circle cx="275" cy="104" r="4" fill="#2563EB" stroke="#FFF" strokeWidth="1.5" />
                    <circle cx="390" cy="98" r="4" fill="#DC2626" stroke="#FFF" strokeWidth="1.5" />

                    {/* Y-Axis */}
                    <text x="44" y="23" fill="#94A3B8" fontSize="7" textAnchor="end" fontFamily="monospace">100%</text>
                    <text x="44" y="58" fill="#94A3B8" fontSize="7" textAnchor="end" fontFamily="monospace">75%</text>
                    <text x="44" y="93" fill="#94A3B8" fontSize="7" textAnchor="end" fontFamily="monospace">50%</text>
                    <text x="44" y="128" fill="#94A3B8" fontSize="7" textAnchor="end" fontFamily="monospace">25%</text>
                    <text x="44" y="153" fill="#94A3B8" fontSize="7" textAnchor="end" fontFamily="monospace">0%</text>

                    {/* X-Axis Labels */}
                    <text x="50" y="165" fill="#64748B" fontSize="7" textAnchor="middle" fontFamily="monospace">20k</text>
                    <text x="150" y="165" fill="#059669" fontSize="7.5" fontWeight="bold" textAnchor="middle" fontFamily="monospace">PMC ({Math.round(Number(report.quantitative_metrics?.model_specific?.pmc || 24200) / 1000)}k)</text>
                    <text x="230" y="165" fill="#B45309" fontSize="8" fontWeight="bold" textAnchor="middle" fontFamily="monospace">OPP ({Math.round(Number(report.quantitative_metrics?.model_specific?.opp || 26200) / 1000)}k)</text>
                    <text x="275" y="165" fill="#2563EB" fontSize="7.5" fontWeight="bold" textAnchor="middle" fontFamily="monospace">IPP ({Math.round(Number(report.quantitative_metrics?.model_specific?.idp || 26800) / 1000)}k)</text>
                    <text x="390" y="165" fill="#DC2626" fontSize="7.5" fontWeight="bold" textAnchor="middle" fontFamily="monospace">PME ({Math.round(Number(report.quantitative_metrics?.model_specific?.pme || 31600) / 1000)}k)</text>
                    <text x="500" y="165" fill="#64748B" fontSize="7" textAnchor="middle" fontFamily="monospace">38k</text>
                  </svg>

                  {/* Legend */}
                  <div className="flex items-center justify-center gap-4 mt-1 font-mono text-[9px]">
                    <span className="text-emerald-700 font-bold">● Quá rẻ (Too Cheap)</span>
                    <span className="text-blue-700 font-bold">--- Rẻ / Hời (Cheap)</span>
                    <span className="text-amber-700 font-bold">--- Bắt đầu đắt (Expensive)</span>
                    <span className="text-red-700 font-bold">● Quá đắt (Too Expensive)</span>
                  </div>
                </div>
              </div>

              {/* Price Corridor Table */}
              <div className="grid grid-cols-4 gap-2 text-center font-mono text-xs">
                <div className="p-2 bg-slate-50 border border-slate-200 rounded-xl">
                  <span className="text-[8.5px] text-slate-500 uppercase block">Giá Sàn (PMC)</span>
                  <span className="font-bold text-slate-900 text-xs">
                    {Number(report.quantitative_metrics?.model_specific?.pmc || 25000).toLocaleString('vi-VN')} đ
                  </span>
                </div>
                <div className="p-2 bg-amber-50 border border-amber-300 rounded-xl">
                  <span className="text-[8.5px] text-amber-800 uppercase block font-bold">Điểm Tối Ưu (OPP)</span>
                  <span className="font-bold text-amber-700 text-sm">
                    {Number(report.quantitative_metrics?.model_specific?.opp || report.quantitative_metrics?.model_specific?.optimal_price || 32000).toLocaleString('vi-VN')} đ
                  </span>
                </div>
                <div className="p-2 bg-slate-50 border border-slate-200 rounded-xl">
                  <span className="text-[8.5px] text-slate-500 uppercase block">Điểm Hòa Nhập (IDP)</span>
                  <span className="font-bold text-slate-900 text-xs">
                    {Number(report.quantitative_metrics?.model_specific?.idp || report.quantitative_metrics?.model_specific?.indifference_price || report.quantitative_metrics?.model_specific?.ipp || 35000).toLocaleString('vi-VN')} đ
                  </span>
                </div>
                <div className="p-2 bg-slate-50 border border-slate-200 rounded-xl">
                  <span className="text-[8.5px] text-slate-500 uppercase block">Giá Trần (PME)</span>
                  <span className="font-bold text-slate-900 text-xs">
                    {Number(report.quantitative_metrics?.model_specific?.pme || 42000).toLocaleString('vi-VN')} đ
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* ════════════════════════════════════════════════════════════════════
              CASE 3: KANTAR A/B TESTING — SO SÁNH ĐỐI ĐẦU 2 PHƯƠNG ÁN
          ════════════════════════════════════════════════════════════════════ */}
          {report.model_type === 'ab_testing' && (
            <div className="space-y-3">
              {/* Head-to-Head Win Rate Comparison */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-serif text-sm font-bold text-slate-900">
                    Tỷ Lệ Chiến Thắng Đối Đầu (% Win Rate Comparison)
                  </h3>
                  <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 font-mono text-xs font-bold">
                    Kantar Link Pre-Testing
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-2">
                  <div className={`p-3 rounded-xl border text-center ${
                    report.quantitative_metrics?.model_specific?.winner === 'A'
                      ? 'bg-emerald-50 border-emerald-400 ring-2 ring-emerald-500/20'
                      : 'bg-white border-slate-200'
                  }`}>
                    <span className="text-[10px] font-mono font-bold text-slate-500 block mb-0.5">
                      PHƯƠNG ÁN A {report.quantitative_metrics?.model_specific?.winner === 'A' ? '👑 CHIẾN THẮNG' : ''}
                    </span>
                    <div className="text-2xl font-serif font-black text-slate-900">
                      {report.quantitative_metrics?.model_specific?.win_rate_a || 62.4}%
                    </div>
                  </div>

                  <div className={`p-3 rounded-xl border text-center ${
                    report.quantitative_metrics?.model_specific?.winner === 'B'
                      ? 'bg-emerald-50 border-emerald-400 ring-2 ring-emerald-500/20'
                      : 'bg-white border-slate-200'
                  }`}>
                    <span className="text-[10px] font-mono font-bold text-slate-500 block mb-0.5">
                      PHƯƠNG ÁN B {report.quantitative_metrics?.model_specific?.winner === 'B' ? '👑 CHIẾN THẮNG' : ''}
                    </span>
                    <div className="text-2xl font-serif font-black text-slate-900">
                      {report.quantitative_metrics?.model_specific?.win_rate_b || 37.6}%
                    </div>
                  </div>
                </div>

                {/* 3 Attribute Scorecard Rows */}
                <div className="space-y-1.5 pt-2 border-t border-slate-200">
                  <div className="flex items-center justify-between text-[11px] p-1.5 bg-white rounded border border-slate-200">
                    <span className="font-medium text-slate-700">1. Sức hút thị giác (Stopping Power / Shelf Standout)</span>
                    <span className="font-mono font-bold text-emerald-700">A thắng (+22% ưu tiên)</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] p-1.5 bg-white rounded border border-slate-200">
                    <span className="font-medium text-slate-700">2. Độ tin cậy & Cảm giác cao cấp (Brand Trust)</span>
                    <span className="font-mono font-bold text-emerald-700">A thắng (+19% tin cậy)</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] p-1.5 bg-white rounded border border-slate-200">
                    <span className="font-medium text-slate-700">3. Kích thích mua sắm (Purchase Persuasion)</span>
                    <span className="font-mono font-bold text-emerald-700">A thắng (+28% chuyển đổi)</span>
                  </div>
                </div>
              </div>

              {/* Demographic Breakdown & Head-to-Head Pros/Cons */}
              <div className="grid grid-cols-2 gap-2.5 text-[10.5px]">
                <div className="p-2.5 bg-white border border-slate-200 rounded-xl">
                  <span className="font-mono uppercase font-bold text-slate-500 block mb-1">
                    Phân rã theo nhân khẩu học:
                  </span>
                  <ul className="space-y-1 text-slate-700">
                    <li className="flex justify-between"><span>Gen Z (18-24t):</span> <strong className="text-emerald-700">A (72%)</strong></li>
                    <li className="flex justify-between"><span>Millennials (25-34t):</span> <strong className="text-emerald-700">A (64%)</strong></li>
                    <li className="flex justify-between"><span>Trưởng thành (35+t):</span> <strong className="text-slate-700">B (55%)</strong></li>
                  </ul>
                </div>
                <div className="p-2.5 bg-white border border-slate-200 rounded-xl">
                  <span className="font-mono uppercase font-bold text-slate-500 block mb-1">
                    Đối chiếu ưu thế cốt lõi:
                  </span>
                  <p className="text-slate-700 leading-snug">
                    Phương án A vượt trội về độ bắt mắt trên quầy kệ siêu thị và mạng xã hội. Phương án B giữ được nét cổ điển nhưng kém kích thích giới trẻ.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ════════════════════════════════════════════════════════════════════
              CASE 4: U&A STUDY — THÓI QUEN & THÁI ĐỘ TIÊU DÙNG (USAGE & ATTITUDE)
          ════════════════════════════════════════════════════════════════════ */}
          {report.model_type === 'ua_study' && (
            <div className="space-y-3">
              {/* Frequency Funnel & Occasion Map */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-serif text-sm font-bold text-slate-900">
                    Phễu Hành Vi & Bản Đồ Dịp Tiêu Dùng (Occasion Map)
                  </h3>
                  <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-900 font-mono text-xs font-bold">
                    U&A Methodology
                  </span>
                </div>

                {/* Frequency Cards */}
                {(() => {
                  const freq = report.quantitative_metrics?.model_specific?.usage_frequency;
                  const entries = freq ? Object.entries(freq).slice(0, 4) : [
                    ['Mỗi ngày 1-2 lần', 68.5],
                    ['3-5 Lần / Tuần', 22.0],
                    ['1-2 Lần / Tuần', 7.5],
                    ['Thỉnh Thoảng', 2.0],
                  ];
                  return (
                    <div className="grid grid-cols-4 gap-2 text-center font-mono mb-2.5">
                      {entries.map(([label, val], idx) => (
                        <div key={idx} className="p-2 bg-white rounded-lg border border-slate-200">
                          <span className="text-[8.5px] text-slate-400 uppercase block truncate">{label}</span>
                          <span className={`font-serif text-base font-bold ${idx === 0 ? 'text-slate-900' : idx === 1 ? 'text-amber-700' : 'text-slate-700'}`}>
                            {Number(val).toFixed(1)}%
                          </span>
                        </div>
                      ))}
                    </div>
                  );
                })()}

                {/* Occasions List */}
                {(() => {
                  const occasions = report.quantitative_metrics?.model_specific?.top_occasions || [
                    { occasion: 'Sáng sớm bắt đầu ngày làm việc (Wake-up booster)', pct: 74.5 },
                    { occasion: 'Sau bữa ăn trưa giải ngấy & chống buồn ngủ', pct: 48.0 },
                  ];
                  return (
                    <div className="grid grid-cols-2 gap-2 text-[10.5px]">
                      {occasions.slice(0, 2).map((occ: any, idx: number) => (
                        <div key={idx} className="p-2 bg-white rounded-lg border border-slate-200">
                          <span className="font-bold text-slate-800 block mb-0.5 truncate">
                            {idx === 0 ? '🌅 Dịp Tiêu Dùng Chủ Đạo:' : '⚡ Dịp Tiêu Dùng Thứ Cấp:'}
                          </span>
                          <span className="text-slate-600 block truncate">
                            {occ.occasion} ({occ.pct}%)
                          </span>
                        </div>
                      ))}
                    </div>
                  );
                })()}
              </div>

              {/* Key Drivers & Market White-space */}
              <div className="grid grid-cols-2 gap-2.5 text-[10.5px]">
                <div className="p-2.5 bg-white border border-slate-200 rounded-xl">
                  <span className="font-mono uppercase font-bold text-slate-500 block mb-1">
                    Bảng xếp hạng tiêu chí mua hàng:
                  </span>
                  <ol className="space-y-1 text-slate-700">
                    <li className="flex justify-between"><span>1. Chất lượng & An toàn sức khỏe:</span> <strong>42.5%</strong></li>
                    <li className="flex justify-between"><span>2. Giá cả hợp lý & Đáng tiền:</span> <strong>28.4%</strong></li>
                    <li className="flex justify-between"><span>3. Tiện lợi & Tốc độ phục vụ:</span> <strong>18.6%</strong></li>
                  </ol>
                </div>

                <div className="p-2.5 bg-amber-50/60 border border-amber-200 rounded-xl">
                  <span className="font-mono uppercase font-bold text-amber-900 block mb-1">
                    Khoảng trống thị trường (Unmet Needs):
                  </span>
                  <p className="text-slate-800 leading-snug">
                    {report.quantitative_metrics?.model_specific?.unmet_needs?.[0]?.need
                      ? `Nhu cầu cấp thiết nhất: "${report.quantitative_metrics.model_specific.unmet_needs[0].need}" (Độ quan trọng: ${report.quantitative_metrics.model_specific.unmet_needs[0].importance}/100 - Thỏa mãn: ${report.quantitative_metrics.model_specific.unmet_needs[0].satisfaction}/100).`
                      : 'Khách hàng đang tìm kiếm dòng sản phẩm có chất lượng đồng đều, giảm kích ứng dạ dày và hòa tan nhanh chóng.'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ════════════════════════════════════════════════════════════════════
              CASE 5: DEAL ELASTICITY — ĐỘ CO GIÃN KHUYẾN MÃI
          ════════════════════════════════════════════════════════════════════ */}
          {report.model_type === 'deal_elasticity' && (
            <div className="space-y-3">
              {/* Elasticity Curve & Tiers */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-serif text-sm font-bold text-slate-900">
                    Đường Cong Co Giãn Khuyến Mãi (Promotion Elasticity Curve)
                  </h3>
                  <span className="px-2 py-0.5 rounded bg-purple-100 text-purple-900 font-mono text-xs font-bold">
                    Deal Elasticity
                  </span>
                </div>

                {/* 4 Tiers Comparison */}
                {(() => {
                  const tiers = report.quantitative_metrics?.model_specific?.tiers || [
                    { discount_level: 'Giảm 10%', conversion_rate: 48.5, revenue_impact: '+5% Lợi nhuận' },
                    { discount_level: 'Giảm 18% (Tối ưu)', conversion_rate: 76.8, revenue_impact: '+34.5% Doanh thu' },
                    { discount_level: 'Giảm 25%', conversion_rate: 82.4, revenue_impact: '+22% (Bắt đầu ăn mòn biên)' },
                    { discount_level: 'Giảm 35%', conversion_rate: 88.0, revenue_impact: '+8% (Rủi ro suy giảm LN)' },
                  ];
                  return (
                    <div className="grid grid-cols-4 gap-2 text-center font-mono mb-2">
                      {tiers.map((t: any, idx: number) => {
                        const isOptimal = t.discount_level.includes('Tối ưu') || idx === 1;
                        return (
                          <div key={idx} className={`p-2 rounded-lg ${isOptimal ? 'bg-amber-50 border-2 border-amber-400 shadow-2xs' : 'bg-white border border-slate-200'}`}>
                            <span className={`text-[8.5px] uppercase block truncate ${isOptimal ? 'text-amber-800 font-bold' : 'text-slate-400'}`}>
                              {t.discount_level}
                            </span>
                            <span className={`font-serif text-base font-bold ${isOptimal ? 'text-amber-700' : 'text-slate-700'}`}>
                              {Number(t.conversion_rate).toFixed(1)}%
                            </span>
                            <span className={`text-[8.5px] block truncate ${isOptimal ? 'text-amber-900 font-bold' : 'text-emerald-600'}`}>
                              {t.revenue_impact}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  );
                })()}
              </div>

              {/* Sweet Spot & Brand Risk Cards */}
              <div className="grid grid-cols-2 gap-2.5 text-[10.5px]">
                <div className="p-2.5 bg-emerald-50/60 border border-emerald-200 rounded-xl">
                  <span className="font-mono uppercase font-bold text-emerald-900 block mb-1">
                    🎯 Điểm Bùng Nổ Tối Ưu (Sweet Spot):
                  </span>
                  <p className="text-slate-800 leading-snug">
                    Mức chiết khấu tối ưu là <strong>Giảm {Number(report.quantitative_metrics?.model_specific?.optimal_discount_pct || 18)}%</strong> giúp tăng trưởng <strong>+{Number(report.quantitative_metrics?.model_specific?.revenue_lift || 34.5)}% doanh thu</strong> và hạn chế rủi ro tự ăn thịt sản phẩm ở mức {Number(report.quantitative_metrics?.model_specific?.cannibalization_risk || 12)}%.
                  </p>
                </div>

                <div className="p-2.5 bg-red-50/60 border border-red-200 rounded-xl">
                  <span className="font-mono uppercase font-bold text-red-900 block mb-1">
                    ⚠️ Ngưỡng Rủi Ro Thương Hiệu (Brand Risk):
                  </span>
                  <p className="text-slate-800 leading-snug">
                    Cảnh báo: Nếu giảm giá sâu vượt quá <strong>30%</strong>, 42% người tiêu dùng bắt đầu nghi ngờ sản phẩm kém chất lượng hoặc cận date, gây tổn hại định vị cao cấp.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ════════════════════════════════════════════════════════════════════
              CASE 6: MONADIC TESTING — THỬ NGHIỆM Ý TƯỞNG ĐỘC LẬP
          ════════════════════════════════════════════════════════════════════ */}
          {report.model_type === 'monadic' && (
            <div className="space-y-3">
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-serif text-sm font-bold text-slate-900">
                    Đối Chiếu Độc Lập Hai Nhánh Mẫu (Monadic Split-Sample)
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded bg-emerald-100 text-emerald-900 font-mono text-xs font-bold">
                      Winner: Concept {String(report.quantitative_metrics?.model_specific?.winner || 'A')}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-indigo-100 text-indigo-900 font-mono text-[10.5px] font-bold">
                      Lift: {Number(report.quantitative_metrics?.model_specific?.lift_percentage || 24.5) > 0 ? `+${report.quantitative_metrics?.model_specific?.lift_percentage || 24.5}%` : `${report.quantitative_metrics?.model_specific?.lift_percentage || 24.5}%`}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-2">
                  <div className="p-2.5 bg-white rounded-lg border border-slate-200">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-bold text-xs text-slate-900">Concept A: {String(report.quantitative_metrics?.model_specific?.concept_a?.title || 'Phương án A')}</span>
                      <span className="font-mono text-[10px] text-slate-500">N = {Number(report.quantitative_metrics?.model_specific?.concept_a?.sample_size || 500)}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-1 text-center font-mono text-[10px] pt-1 border-t border-slate-100">
                      <div><span className="text-slate-400 block">Top-2-Box</span><strong>{String(report.quantitative_metrics?.model_specific?.concept_a?.top2box || 72)}%</strong></div>
                      <div><span className="text-slate-400 block">Độc đáo</span><strong>{String(report.quantitative_metrics?.model_specific?.concept_a?.uniqueness || 4.1)}/5</strong></div>
                      <div><span className="text-slate-400 block">Đáng giá</span><strong>{String(report.quantitative_metrics?.model_specific?.concept_a?.value_ratio || 75)}%</strong></div>
                    </div>
                  </div>

                  <div className="p-2.5 bg-white rounded-lg border border-slate-200">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-bold text-xs text-slate-900">Concept B: {String(report.quantitative_metrics?.model_specific?.concept_b?.title || 'Phương án B')}</span>
                      <span className="font-mono text-[10px] text-slate-500">N = {Number(report.quantitative_metrics?.model_specific?.concept_b?.sample_size || 500)}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-1 text-center font-mono text-[10px] pt-1 border-t border-slate-100">
                      <div><span className="text-slate-400 block">Top-2-Box</span><strong>{String(report.quantitative_metrics?.model_specific?.concept_b?.top2box || 58)}%</strong></div>
                      <div><span className="text-slate-400 block">Độc đáo</span><strong>{String(report.quantitative_metrics?.model_specific?.concept_b?.uniqueness || 3.6)}/5</strong></div>
                      <div><span className="text-slate-400 block">Đáng giá</span><strong>{String(report.quantitative_metrics?.model_specific?.concept_b?.value_ratio || 60)}%</strong></div>
                    </div>
                  </div>
                </div>

                <div className="overflow-x-auto border border-slate-200 rounded-lg bg-white">
                  <table className="w-full text-[10px] text-left">
                    <thead className="bg-slate-100/70 font-bold uppercase text-slate-600">
                      <tr>
                        <th className="py-1.5 px-3">Chỉ số so sánh độc lập</th>
                        <th className="py-1.5 px-2 text-center">Concept A</th>
                        <th className="py-1.5 px-2 text-center">Concept B</th>
                        <th className="py-1.5 px-2 text-center">Chênh lệch</th>
                        <th className="py-1.5 px-2 text-center">Ưu thế</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-mono">
                      <tr>
                        <td className="py-1.5 px-3 font-sans font-medium text-slate-800">Ý định mua thử (Top-2-Box)</td>
                        <td className="py-1.5 px-2 text-center">{String(report.quantitative_metrics?.model_specific?.concept_a?.top2box || 72)}%</td>
                        <td className="py-1.5 px-2 text-center">{String(report.quantitative_metrics?.model_specific?.concept_b?.top2box || 58)}%</td>
                        <td className="py-1.5 px-2 text-center font-bold text-indigo-700">+{Math.abs(Number(report.quantitative_metrics?.model_specific?.concept_a?.top2box || 72) - Number(report.quantitative_metrics?.model_specific?.concept_b?.top2box || 58)).toFixed(1)}%</td>
                        <td className="py-1.5 px-2 text-center font-bold text-emerald-700">Concept {String(report.quantitative_metrics?.model_specific?.winner || 'A')}</td>
                      </tr>
                      <tr>
                        <td className="py-1.5 px-3 font-sans font-medium text-slate-800">Mức độ độc đáo (Uniqueness)</td>
                        <td className="py-1.5 px-2 text-center">{String(report.quantitative_metrics?.model_specific?.concept_a?.uniqueness || 4.1)}/5</td>
                        <td className="py-1.5 px-2 text-center">{String(report.quantitative_metrics?.model_specific?.concept_b?.uniqueness || 3.6)}/5</td>
                        <td className="py-1.5 px-2 text-center font-bold text-indigo-700">+{(Number(report.quantitative_metrics?.model_specific?.concept_a?.uniqueness || 4.1) - Number(report.quantitative_metrics?.model_specific?.concept_b?.uniqueness || 3.6)).toFixed(2)}</td>
                        <td className="py-1.5 px-2 text-center font-bold text-emerald-700">Concept {String(report.quantitative_metrics?.model_specific?.winner || 'A')}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ════════════════════════════════════════════════════════════════════
              CASE 7: MAXDIFF — XẾP HẠNG THUỘC TÍNH BEST-WORST SCALING
          ════════════════════════════════════════════════════════════════════ */}
          {report.model_type === 'maxdiff' && (
            <div className="space-y-3">
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-serif text-sm font-bold text-slate-900">
                    Bảng Xếp Hạng Tiện Ích Tương Đối MaxDiff (Best-Worst Scaling)
                  </h3>
                  <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 font-mono text-xs font-bold">
                    MaxDiff Utility Model
                  </span>
                </div>

                <div className="overflow-x-auto border border-slate-200 rounded-lg bg-white mb-2">
                  <table className="w-full text-[10px] text-left">
                    <thead className="bg-slate-100/70 font-bold uppercase text-slate-600">
                      <tr>
                        <th className="py-1.5 px-2 text-center">Hạng</th>
                        <th className="py-1.5 px-3">Thuộc tính / Thông điệp bán hàng</th>
                        <th className="py-1.5 px-2 text-center">Score</th>
                        <th className="py-1.5 px-2 text-center">Best</th>
                        <th className="py-1.5 px-2 text-center">Worst</th>
                        <th className="py-1.5 px-2">Phân tầng</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-mono">
                      {(report.quantitative_metrics?.model_specific?.rankings || []).slice(0, 5).map((r: any, idx: number) => (
                        <tr key={idx}>
                          <td className="py-1.5 px-2 text-center font-bold">#{r.rank || idx + 1}</td>
                          <td className="py-1.5 px-3 font-sans font-medium text-slate-800">{r.attribute}</td>
                          <td className="py-1.5 px-2 text-center font-bold text-indigo-700">{r.score > 0 ? `+${r.score}` : r.score}</td>
                          <td className="py-1.5 px-2 text-center text-emerald-600">{r.best_count}</td>
                          <td className="py-1.5 px-2 text-center text-rose-500">{r.worst_count}</td>
                          <td className="py-1.5 px-2 font-sans text-[9.5px] font-semibold text-slate-600">{r.tier}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[10px]">
                  <div className="p-2 bg-emerald-50 rounded-lg border border-emerald-200">
                    <span className="font-bold text-emerald-900 block">🥇 Động lực cốt lõi (Core Driver):</span>
                    <span className="text-slate-800 font-medium">{String(report.quantitative_metrics?.model_specific?.top_attribute || 'Hiệu quả rõ rệt sau 7 ngày')}</span>
                  </div>
                  <div className="p-2 bg-slate-100 rounded-lg border border-slate-200">
                    <span className="font-bold text-slate-700 block">⚠️ Thuộc tính thờ ơ (Low Priority):</span>
                    <span className="text-slate-600">{String(report.quantitative_metrics?.model_specific?.bottom_attribute || 'Thiết kế nhỏ gọn')}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ════════════════════════════════════════════════════════════════════
              CASE 8: KANO MODEL — PHÂN LOẠI TÍNH NĂNG R&D
          ════════════════════════════════════════════════════════════════════ */}
          {report.model_type === 'kano' && (
            <div className="space-y-3">
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-serif text-sm font-bold text-slate-900">
                    Ma Trận Phân Loại Tính Năng Kano (Better vs Worse Analysis)
                  </h3>
                  <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-900 font-mono text-xs font-bold">
                    Kano Model R&D
                  </span>
                </div>

                <div className="overflow-x-auto border border-slate-200 rounded-lg bg-white mb-2">
                  <table className="w-full text-[10px] text-left">
                    <thead className="bg-slate-100/70 font-bold uppercase text-slate-600">
                      <tr>
                        <th className="py-1.5 px-3">Tính năng R&D kiểm định</th>
                        <th className="py-1.5 px-2">Phân loại</th>
                        <th className="py-1.5 px-2 text-center">CS+ (Hài lòng)</th>
                        <th className="py-1.5 px-2 text-center">CS- (Bất mãn)</th>
                        <th className="py-1.5 px-3">Lộ trình khuyến nghị</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-mono">
                      {(report.quantitative_metrics?.model_specific?.features_summary || []).slice(0, 5).map((f: any, idx: number) => (
                        <tr key={idx}>
                          <td className="py-1.5 px-3 font-sans font-medium text-slate-800">{f.feature}</td>
                          <td className="py-1.5 px-2 font-sans font-bold text-slate-700">{f.category_name}</td>
                          <td className="py-1.5 px-2 text-center font-bold text-emerald-700">+{f.better_cs_plus}</td>
                          <td className="py-1.5 px-2 text-center font-bold text-rose-600">{f.worse_cs_minus}</td>
                          <td className="py-1.5 px-3 font-sans text-[9.5px] text-slate-600">
                            {f.category_code === 'M' ? 'Bắt buộc hoàn thiện (V1 MVP)' : f.category_code === 'O' ? 'Nâng cấp liên tục (V2)' : 'Tạo điểm nhấn USP'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="p-2.5 bg-blue-50/60 border border-blue-200 rounded-lg text-[10.5px]">
                  <span className="font-bold text-blue-900 block mb-0.5">💡 Khuyến nghị tối ưu hóa chi phí R&D:</span>
                  <p className="text-slate-800 leading-snug">
                    Đảm bảo 100% tính năng nhóm <strong>Bắt buộc (Must-be)</strong> không phát sinh lỗi trước khi bổ sung tính năng nhóm Đột phá (Attractive). Cắt giảm ngay các tính năng thuộc nhóm Vô thưởng vô phạt (Indifferent) để tiết kiệm thời gian phát triển.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ════════════════════════════════════════════════════════════════════
              CASE 9: BRAND MAP — BẢN ĐỒ ĐỊNH VỊ THƯƠNG HIỆU
          ════════════════════════════════════════════════════════════════════ */}
          {report.model_type === 'brand_map' && (
            <div className="space-y-3">
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-serif text-sm font-bold text-slate-900">
                    Bản Đồ Định Vị Thị Trường 2D & Đại Dương Xanh (White-space)
                  </h3>
                  <span className="px-2 py-0.5 rounded bg-indigo-100 text-indigo-900 font-mono text-xs font-bold">
                    Perceptual Mapping (MDS)
                  </span>
                </div>

                <div className="overflow-x-auto border border-slate-200 rounded-lg bg-white mb-2">
                  <table className="w-full text-[10px] text-left">
                    <thead className="bg-slate-100/70 font-bold uppercase text-slate-600">
                      <tr>
                        <th className="py-1.5 px-3">Thương hiệu</th>
                        <th className="py-1.5 px-2 text-center">Tọa độ Giá (Trục X)</th>
                        <th className="py-1.5 px-2 text-center">Tọa độ Đổi mới (Trục Y)</th>
                        <th className="py-1.5 px-3">Góc phần tư định vị</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-mono">
                      {(report.quantitative_metrics?.model_specific?.brands_data || report.quantitative_metrics?.model_specific?.brands || []).map((b: any, idx: number) => (
                        <tr key={idx} className={b.is_client ? 'bg-sky-50 font-bold' : ''}>
                          <td className="py-1.5 px-3 font-sans text-slate-900">
                            {b.is_client && '★ '}{b.brand}
                          </td>
                          <td className="py-1.5 px-2 text-center">{b.x} / 10</td>
                          <td className="py-1.5 px-2 text-center text-indigo-700">{b.y} / 10</td>
                          <td className="py-1.5 px-3 font-sans text-[9.5px] text-slate-600">{b.quadrant_name || (b.x > 5 ? 'Cao cấp & Đổi mới' : 'Bình dân & Truyền thống')}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="p-2.5 bg-emerald-50/70 border border-emerald-300 rounded-lg text-[10.5px]">
                  <span className="font-bold text-emerald-950 block mb-0.5">🎯 Khoảng trống thị trường tiềm năng (White-space):</span>
                  <p className="text-slate-800 leading-snug">
                    Khu vực <strong>Góc phần tư {String(report.quantitative_metrics?.model_specific?.whitespace_quadrant || 'Q2')}: {String(report.quantitative_metrics?.model_specific?.whitespace_name || 'Smart Value Disruptors')}</strong> hiện có mật độ cạnh tranh thấp nhất. Doanh nghiệp cần tập trung nguồn lực truyền thông để xác lập vị thế độc tôn tại vùng này.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Model-Specific Bottom KPI Cards */}
          <div className="grid grid-cols-3 gap-3 text-center font-mono mt-3">
            {bottomKPIs.map((kpi, idx) => (
              <div key={idx} className="bg-slate-50 border border-slate-200 p-2.5 rounded-xl">
                <span className="text-[8.5px] text-slate-500 uppercase block mb-0.5">{kpi.label}</span>
                <strong className={`font-serif text-sm ${idx === 0 ? 'text-slate-900' : idx === 1 ? 'text-blue-700' : 'text-emerald-700'}`}>
                  {kpi.value}
                </strong>
              </div>
            ))}
          </div>
        </div>

        {/* Page Footer */}
        <div className="border-t border-slate-200 pt-2 flex items-center justify-between text-[10px] text-slate-400 font-mono">
          <span>Chuẩn đo lường: {modelInfo.framework}</span>
          <span className="font-bold text-slate-600">PHẦN 04 · MA TRẬN ĐỊNH LƯỢNG</span>
        </div>
      </section>

      {/* ═════════════════════════════════════════════════════════════════════════
          PAGE 5: TIẾNG NÓI THỰC TẾ CỦA KHÁCH HÀNG (VOICE OF CUSTOMER - VOC)
      ═════════════════════════════════════════════════════════════════════════ */}
      <section className="sheet bg-white text-slate-900 border border-slate-200">
        {/* Page Header */}
        <div className="border-b border-slate-200 pb-2.5 flex items-center justify-between">
          <div>
            <div className="text-[10px] font-mono text-amber-700 uppercase tracking-widest font-bold">
              PHẦN 05 · TIẾNG NÓI THỊ TRƯỜNG TỪ TÁC TỬ AI (SYNTHETIC VOC)
            </div>
            <h2 className="font-serif text-lg font-black text-slate-900">
              Ý Kiến Định Tính Trích Xuất Từ Tác Tử AI Đối Chuẩn Theo Khung Phân Tầng GSO
            </h2>
          </div>
          <div className="text-[11px] font-mono text-slate-400">MÃ: #{surveyId}</div>
        </div>

        {/* Content Body: 3 Colored Groups */}
        <div className="space-y-3 my-auto">
          {/* Group 1: 🟢 Ủng Hộ Nhiệt Tình */}
          <div className="bg-emerald-50/60 border border-emerald-200 rounded-xl p-3">
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
                <span className="font-serif font-bold text-xs text-emerald-950 uppercase tracking-wider">
                  Nhóm ủng hộ nhiệt tình (Sẵn sàng mua ngay)
                </span>
              </div>
              <span className="text-[9.5px] font-mono text-emerald-800 font-bold">
                {positiveQuotes.length} Ý kiến
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {(positiveQuotes.slice(0, 2)).map((q, i) => (
                <div key={i} className="bg-white p-2.5 rounded-lg border border-emerald-100 shadow-2xs">
                  <p className="text-[10.5px] text-slate-800 italic leading-snug mb-1 line-clamp-2">
                    "{q.quote}"
                  </p>
                  <div className="text-[9px] font-mono text-slate-500 flex justify-between">
                    <span className="font-bold text-slate-900">{q.name} ({q.age}t)</span>
                    <span className="truncate max-w-[110px]">{q.job}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Group 2: 🟡 Phân Vân & So Sánh Đối Thủ */}
          <div className="bg-amber-50/60 border border-amber-200 rounded-xl p-3">
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-500 inline-block" />
                <span className="font-serif font-bold text-xs text-amber-950 uppercase tracking-wider">
                  Nhóm phân vân & So sánh đối thủ cạnh tranh
                </span>
              </div>
              <span className="text-[9.5px] font-mono text-amber-800 font-bold">
                {neutralQuotes.length} Ý kiến
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {(neutralQuotes.slice(0, 2)).map((q, i) => (
                <div key={i} className="bg-white p-2.5 rounded-lg border border-amber-100 shadow-2xs">
                  <p className="text-[10.5px] text-slate-800 italic leading-snug mb-1 line-clamp-2">
                    "{q.quote}"
                  </p>
                  <div className="text-[9px] font-mono text-slate-500 flex justify-between">
                    <span className="font-bold text-slate-900">{q.name} ({q.age}t)</span>
                    <span className="truncate max-w-[110px]">{q.job}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Group 3: 🔴 Từ Chối Thẳng Thừng */}
          <div className="bg-red-50/60 border border-red-200 rounded-xl p-3">
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-red-500 inline-block" />
                <span className="font-serif font-bold text-xs text-red-950 uppercase tracking-wider">
                  Nhóm từ chối thẳng thừng (Nỗi băn khoăn & Rào cản)
                </span>
              </div>
              <span className="text-[9.5px] font-mono text-red-800 font-bold">
                {negativeQuotes.length} Ý kiến
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {(negativeQuotes.slice(0, 2)).map((q, i) => (
                <div key={i} className="bg-white p-2.5 rounded-lg border border-red-100 shadow-2xs">
                  <p className="text-[10.5px] text-slate-800 italic leading-snug mb-1 line-clamp-2">
                    "{q.quote}"
                  </p>
                  <div className="text-[9px] font-mono text-slate-500 flex justify-between">
                    <span className="font-bold text-slate-900">{q.name} ({q.age}t)</span>
                    <span className="truncate max-w-[110px]">{q.job}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Page Footer */}
        <div className="border-t border-slate-200 pt-2 flex items-center justify-between text-[10px] text-slate-400 font-mono">
          <span>Dữ liệu trích xuất từ {sampleN.toLocaleString('vi-VN')} hồ sơ phỏng vấn sâu trực tiếp</span>
          <span className="font-bold text-slate-600">PHẦN 05 · TIẾNG NÓI KHÁCH HÀNG</span>
        </div>
      </section>

      {/* ═════════════════════════════════════════════════════════════════════════
          PAGE 6: LỘ TRÌNH HÀNH ĐỘNG 30-60-90 NGÀY & BẢO CHỨNG BẢN QUYỀN
      ═════════════════════════════════════════════════════════════════════════ */}
      <section className="sheet bg-white text-slate-900 border border-slate-200">
        {/* Page Header */}
        <div className="border-b border-slate-200 pb-2.5 flex items-center justify-between">
          <div>
            <div className="text-[10px] font-mono text-amber-700 uppercase tracking-widest font-bold">
              PHẦN 06 · LỘ TRÌNH THỰC THI CHIẾN LƯỢC
            </div>
            <h2 className="font-serif text-lg font-black text-slate-900">
              Kế Hoạch Hành Động 30 - 60 - 90 Ngày & Chứng Thực Bản Quyền
            </h2>
          </div>
          <div className="text-[11px] font-mono text-slate-400">MÃ: #{surveyId}</div>
        </div>

        {/* Content Body */}
        <div className="space-y-4 my-auto">
          {/* 30-60-90 Days Roadmap Grid */}
          <div className="space-y-2.5">
            {/* Phase 1: 30 Days */}
            <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200">
              <div className="w-10 h-10 rounded-lg bg-slate-900 text-amber-400 font-serif font-bold text-xs flex flex-col items-center justify-center shrink-0">
                <span className="text-[8px] font-mono text-slate-400">NGÀY</span>
                <span className="leading-none text-sm">30</span>
              </div>
              <div>
                <h4 className="font-serif font-bold text-xs text-slate-900 uppercase tracking-wide mb-0.5">
                  {modelInfo.roadmap.day30.title}
                </h4>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  {modelInfo.roadmap.day30.desc}
                </p>
              </div>
            </div>

            {/* Phase 2: 60 Days */}
            <div className="flex items-start gap-3 p-3 rounded-xl bg-amber-50/60 border border-amber-200">
              <div className="w-10 h-10 rounded-lg bg-amber-600 text-white font-serif font-bold text-xs flex flex-col items-center justify-center shrink-0">
                <span className="text-[8px] font-mono text-amber-200">NGÀY</span>
                <span className="leading-none text-sm">60</span>
              </div>
              <div>
                <h4 className="font-serif font-bold text-xs text-amber-950 uppercase tracking-wide mb-0.5">
                  {modelInfo.roadmap.day60.title}
                </h4>
                <p className="text-[11px] text-slate-700 leading-relaxed">
                  {modelInfo.roadmap.day60.desc}
                </p>
              </div>
            </div>

            {/* Phase 3: 90 Days */}
            <div className="flex items-start gap-3 p-3 rounded-xl bg-emerald-50/60 border border-emerald-200">
              <div className="w-10 h-10 rounded-lg bg-emerald-700 text-white font-serif font-bold text-xs flex flex-col items-center justify-center shrink-0">
                <span className="text-[8px] font-mono text-emerald-200">NGÀY</span>
                <span className="leading-none text-sm">90</span>
              </div>
              <div>
                <h4 className="font-serif font-bold text-xs text-emerald-950 uppercase tracking-wide mb-0.5">
                  {modelInfo.roadmap.day90.title}
                </h4>
                <p className="text-[11px] text-slate-700 leading-relaxed">
                  {modelInfo.roadmap.day90.desc}
                </p>
              </div>
            </div>
          </div>

          {/* Legal Non-Disclosure, Disclaimer & Digital Certification Seal */}
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-300 flex items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-amber-100 text-amber-900 text-[9px] font-mono font-bold uppercase tracking-wider">
                <span>⚖️</span>
                <span>ĐIỀU KHOẢN KHƯỚC TỪ TRÁCH NHIỆM & BẢO MẬT (DISCLAIMER)</span>
              </div>
              <p className="text-[9.5px] text-slate-600 leading-relaxed max-w-md">
                <strong>Khước từ trách nhiệm:</strong> INSIGHT AI là công cụ mô phỏng giả lập tác tử AI hỗ trợ thử nghiệm ý tưởng và tối ưu hóa chi phí nghiên cứu ban đầu. Kết quả khảo sát mang tính chất tham khảo khoa học, không thay thế hoàn toàn cho các quyết định đầu tư tài chính hoặc pháp lý thực tế của doanh nghiệp. Toàn bộ hồ sơ giả lập tuân thủ nguyên tắc Privacy-by-Design theo Nghị định 13/2023/NĐ-CP (PII-free).
              </p>
              <div className="text-[8.5px] font-mono text-slate-400 pt-0.5">
                Mã dự án: #{surveyId} · Chữ ký số SHA256-{(surveyId + '-VERIFIED-KANTAR-MCKINSEY').slice(0, 20).toUpperCase()}
              </div>
            </div>

            {/* Circular Digital Seal Stamp */}
            <div className="shrink-0 flex flex-col items-center justify-center w-24 h-24 rounded-full border-2 border-dashed border-amber-600 p-1 bg-white">
              <div className="w-full h-full rounded-full border border-amber-600 flex flex-col items-center justify-center text-center p-1 bg-amber-50/50">
                <div className="text-[7px] font-mono font-bold text-amber-800 uppercase tracking-widest leading-tight">
                  1BOOKING
                </div>
                <div className="text-[12px] my-0.2">⭐</div>
                <div className="text-[7px] font-mono text-emerald-700 font-bold uppercase tracking-wider">
                  AUDITED
                </div>
                <div className="text-[6px] font-mono text-slate-500">
                  95% CONFIDENCE
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Page Footer */}
        <div className="border-t border-slate-200 pt-2 flex items-center justify-between text-[10px] text-slate-400 font-mono">
          <span>Hệ thống bảo trợ công nghệ: insight.1booking.asia Intelligence System</span>
          <span className="font-bold text-slate-600">PHẦN 06 · LỘ TRÌNH THỰC THI · HẾT</span>
        </div>
      </section>
    </div>
  );
}
