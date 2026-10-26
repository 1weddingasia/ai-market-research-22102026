'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Logo from '@/components/Logo';
import Footer from '@/components/Footer';

interface MethodologyDetail {
  id: string;
  name: string;
  shortName: string;
  framework: string;
  founder: string;
  icon: string;
  tagColor: string;
  borderColor: string;
  bgSoft: string;
  demoId: string;
  executiveQuestion: string;
  coreBusinessValue: string;
  questionnaire: Array<{
    code: string;
    label: string;
    type: string;
    text: string;
  }>;
  mathEngine: {
    formulaName: string;
    description: string;
    steps: string[];
  };
  visualizerSpec: {
    chartType: string;
    axes: string;
    keyElements: string[];
  };
  heroKPI: {
    label: string;
    exampleValue: string;
    interpretation: string;
  };
  actionRoadmap: {
    day30: string;
    day60: string;
    day90: string;
  };
}

const METHODOLOGIES: MethodologyDetail[] = [
  {
    id: 'nielsen_bases',
    name: 'Kiểm Định Ý Tưởng Sản Phẩm Mới (Concept Testing)',
    shortName: 'Nielsen BASES',
    framework: 'Nielsen BASES Innovation Framework',
    founder: 'Arthur C. Nielsen / BASES Standard (Hoa Kỳ)',
    icon: '💡',
    tagColor: 'text-emerald-700 bg-emerald-50 border-emerald-300',
    borderColor: 'border-emerald-200',
    bgSoft: 'bg-emerald-50/40',
    demoId: 'DEMO-NIELSEN-BASES',
    executiveQuestion: 'Khách hàng có thực sự muốn mua sản phẩm mới này không? Ý tưởng có đủ sức sống sót trên quầy kệ siêu thị?',
    coreBusinessValue: 'Dự báo tỷ lệ thâm nhập thị trường (Trial Rate) và cảnh báo nguy cơ thất bại (Flop Risk) trước khi doanh nghiệp chi hàng tỷ đồng đầu tư dây chuyền sản xuất hay bao bì.',
    questionnaire: [
      { code: 'Q1', label: 'Ý định mua (Purchase Intent)', type: 'Thang đo Likert 5 điểm', text: 'Mức độ sẵn sàng mua sản phẩm của bạn? (1: Chắc chắn không mua → 5: Chắc chắn mua)' },
      { code: 'Q2', label: 'Độ độc đáo (Uniqueness)', type: 'Thang đo Likert 5 điểm', text: 'Sản phẩm mới lạ và khác biệt thế nào so với các lựa chọn bạn đang dùng hàng ngày?' },
      { code: 'Q3', label: 'Độ liên quan (Relevance)', type: 'Thang đo Likert 5 điểm', text: 'Sản phẩm có giải quyết đúng vấn đề cấp thiết trong đời sống của bạn không?' },
      { code: 'Q4', label: 'Độ đáng giá (Value for Money)', type: 'Lựa chọn 3 mức', text: 'Với mức giá dự kiến này, sản phẩm là Đắt, Hợp lý hay Rẻ?' },
      { code: 'Q5', label: 'Rào cản định tính (Barriers)', type: 'Câu hỏi mở', text: 'Điểm thích nhất là gì và rào cản lớn nhất ngăn cản bạn xuống tiền là gì?' },
    ],
    mathEngine: {
      formulaName: 'Mô hình Tính Toán Khả Thi BASES & Dự Báo Dùng Thử',
      description: 'Chỉ số Top-2-Box kết hợp trọng số tin cậy: T2B = % Điểm 5 + (% Điểm 4 × 0.75).',
      steps: [
        'Tính toán T2B Purchase Intent trên tập mẫu N=1.000 tác tử AI đối chuẩn GSO.',
        'Hiệu chỉnh hệ số dùng thử: Trial Rate = (0.75 × % Chắc chắn mua) + (0.25 × % Có thể mua) × Hệ số phân phối ACV.',
        'Đối chiếu ma trận BASES 4 phân vùng: Strong Go (Điểm > 75), Caution (50-74), High Risk (< 50).',
        'Tính toán Flop Risk Index dựa trên tỷ lệ kháng cự giá và rào cản nhận thức.',
      ],
    },
    visualizerSpec: {
      chartType: 'BasesMatrix (Ma trận Khả Thi & Sống Sót 4 Phân Vùng)',
      axes: 'Trục hoành: Độ độc đáo (Uniqueness) ↔ Trục tung: Ý định mua (Purchase Intent).',
      keyElements: [
        'Vùng xanh lá (Strong Go): Đủ điều kiện tung hàng toàn quốc.',
        'Vùng vàng (Caution): Cần tối ưu lại định vị hoặc bao bì.',
        'Vùng đỏ (High Risk): Nguy cơ tự hủy diệt doanh thu.',
        'Thẻ phân rã nhân khẩu học theo giới tính, độ tuổi và thu nhập.',
      ],
    },
    heroKPI: {
      label: 'CHỈ SỐ KHẢ THI (VIABILITY SCORE)',
      exampleValue: '78 / 100 · STRONG GO',
      interpretation: 'Vượt ngưỡng trung bình ngành (+16 điểm). Đủ điều kiện thương mại hóa và đàm phán hợp đồng ký gửi phân phối.',
    },
    actionRoadmap: {
      day30: 'Tinh chỉnh thông điệp RTB (Reason to Believe) mặt trước bao bì nhằm giải tỏa rào cản nhận thức hàng đầu.',
      day60: 'Sản xuất mẻ Pilot Batch nhỏ; kích hoạt chiến dịch phát mẫu thử Sampling có chọn lọc tại các điểm bán trọng điểm.',
      day90: 'Phủ kệ chuỗi siêu thị MT và kênh GT; theo dõi sát sao tỷ lệ mua lặp lại (Repeat Purchase Rate) sau 30 ngày.',
    },
  },
  {
    id: 'van_westendorp',
    name: 'Đo Lường Độ Nhạy Cảm Giá (Price Sensitivity Meter)',
    shortName: 'Van Westendorp PSM',
    framework: 'Van Westendorp Economic Pricing Model',
    founder: 'Peter van Westendorp (1976 - Hà Lan)',
    icon: '💰',
    tagColor: 'text-sky-800 bg-sky-50 border-sky-300',
    borderColor: 'border-sky-200',
    bgSoft: 'bg-sky-50/40',
    demoId: 'DEMO-VAN-WESTENDORP',
    executiveQuestion: 'Bán giá bao nhiêu là tối ưu nhất? Mức giá nào khách chê đắt và mức nào khách nghi ngờ chất lượng kém?',
    coreBusinessValue: 'Xác định chính xác Điểm giá Tối ưu (OPP), Điểm cân bằng (IPP) và Biên độ giá thị trường chấp nhận (RAP), triệt tiêu hoàn toàn rủi ro bán hớ hoặc bán quá đắt làm mất khách.',
    questionnaire: [
      { code: 'Q1', label: 'Quá rẻ (Too Cheap)', type: 'Số tiền thực tế (VNĐ)', text: 'Mức giá nào bạn cảm thấy rẻ đến mức nghi ngờ về chất lượng và không dám mua?' },
      { code: 'Q2', label: 'Món hời (Bargain / Cheap)', type: 'Số tiền thực tế (VNĐ)', text: 'Mức giá nào bạn cảm thấy là một món hời, bỏ tiền mua ngay mà không cần đắn đo?' },
      { code: 'Q3', label: 'Bắt đầu đắt (Expensive)', type: 'Số tiền thực tế (VNĐ)', text: 'Mức giá nào bắt đầu đắt, bạn vẫn có thể mua nhưng phải suy nghĩ đắn đo?' },
      { code: 'Q4', label: 'Quá đắt (Too Expensive)', type: 'Số tiền thực tế (VNĐ)', text: 'Mức giá nào vượt quá khả năng chi trả của bạn, đắt đến mức bạn bỏ đi không mua?' },
    ],
    mathEngine: {
      formulaName: 'Hệ Thống 4 Đường Tích Lũy Phần Trăm & Giao Điểm Vi Mô',
      description: 'Lập hàm phân phối xác suất tích lũy lũy kế (Cumulative Distribution Functions) cho 4 đường cong giá.',
      steps: [
        'Vẽ đường Quá Rẻ (giảm dần) và đường Rẻ (giảm dần).',
        'Vẽ đường Đắt (tăng dần) và đường Quá Đắt (tăng dần).',
        'Giao điểm Quá Rẻ ∩ Quá Đắt = OPP (Optimal Price Point - Điểm giá tối ưu giảm thiểu tối đa lực kháng cự).',
        'Giao điểm Rẻ ∩ Đắt = IPP (Indifference Price Point - Điểm giá cân bằng tâm lý).',
        'Giao điểm Quá Rẻ ∩ Đắt = PMC (Ngưỡng rẻ biên) | Giao điểm Rẻ ∩ Quá Đắt = PME (Ngưỡng đắt biên).',
      ],
    },
    visualizerSpec: {
      chartType: 'VanWestendorpChart (Đồ Thị 4 Đường Cong Độ Nhạy Giá PSM)',
      axes: 'Trục hoành: Mức giá (VNĐ) ↔ Trục tung: Tỷ lệ % người tiêu dùng đánh giá (0% - 100%).',
      keyElements: [
        'Vùng highlight vàng: Khoảng giá chấp nhận được (Range of Acceptable Prices - RAP).',
        'Đường gióng dọc nét đứt xanh lá: Điểm giá tối ưu OPP.',
        'Đường gióng dọc nét đứt xanh dương: Điểm giá cân bằng IPP.',
        'Bảng khuyến nghị cơ cấu SKU giá rẻ dùng thử vs SKU combo tối đa hóa doanh thu.',
      ],
    },
    heroKPI: {
      label: 'ĐIỂM GIÁ TỐI ƯU (OPTIMAL PRICE POINT)',
      exampleValue: '32.000 đ / lon (25.000 đ — 42.000 đ)',
      interpretation: 'Mức giá tối đa hóa doanh thu và số lượng đơn hàng mà không gây tổn hại đến định vị chất lượng sản phẩm.',
    },
    actionRoadmap: {
      day30: 'Ban hành bảng giá niêm yết chính thức quanh điểm OPP; thiết lập khung chiết khấu kênh phân phối đại lý.',
      day60: 'Cấu trúc SKU size nhỏ tiệm cận ngưỡng PMC để kích hoạt dùng thử; SKU combo lớn để nâng giá trị giỏ hàng.',
      day90: 'Kiểm soát kỷ luật giá; tuyệt đối không điều chỉnh tăng giá bán lẻ vượt trần PME dù chi phí biến động.',
    },
  },
  {
    id: 'ab_testing',
    name: 'So Sánh Đối Đầu 2 Phương Án (A/B Pack & Creative Testing)',
    shortName: 'Kantar A/B Testing',
    framework: 'Kantar Link Pre-Testing Methodology',
    founder: 'Kantar Millward Brown (Anh Quốc)',
    icon: '🎨',
    tagColor: 'text-amber-800 bg-amber-50 border-amber-300',
    borderColor: 'border-amber-200',
    bgSoft: 'bg-amber-50/40',
    demoId: 'DEMO-AB-TESTING',
    executiveQuestion: 'Giữa 2 mẫu bao bì hoặc 2 câu slogan thì phương án nào có tỷ lệ chuyển đổi mua hàng cao hơn?',
    coreBusinessValue: 'Loại bỏ hoàn toàn cảm tính cá nhân của ban lãnh đạo bằng cách để 1.000 người tiêu dùng mục tiêu bỏ phiếu trực tiếp, đo lường sức hút thị giác trên quầy kệ.',
    questionnaire: [
      { code: 'Q1', label: 'Lựa chọn trực diện', type: 'Choice A / B', text: 'Giữa Phương án A và B, bạn sẽ chọn mua sản phẩm nào khi đứng trước quầy kệ?' },
      { code: 'Q2', label: 'Sức hút thị giác (Stopping Power)', type: 'Choice A / B', text: 'Phương án nào bắt mắt, thu hút ánh nhìn đầu tiên khi đặt cạnh các đối thủ?' },
      { code: 'Q3', label: 'Cảm nhận cao cấp & Uy tín', type: 'Choice A / B', text: 'Phương án nào mang lại cảm giác chỉn chu, sang trọng và đáng tin cậy hơn?' },
      { code: 'Q4', label: 'Động lực cốt lõi', type: 'Câu hỏi mở định tính', text: 'Yếu tố quyết định nào khiến bạn chọn phương án này thay vì phương án kia?' },
    ],
    mathEngine: {
      formulaName: 'Kiểm Định Tỷ Lệ Chiến Thắng & Thống Kê Chi-Square',
      description: 'Xác định tính có ý nghĩa thống kê của chênh lệch: p-value < 0.05 đảm bảo kết quả không phải do ngẫu nhiên.',
      steps: [
        'Tính tỷ lệ Win Rate: Win% = (Số lượt chọn Phương án Thắng / Tổng số phiếu N) × 100%.',
        'Chạy phép thử Chi-Square Goodness-of-Fit: Chi² = Σ [(O - E)² / E].',
        'Phân rã tỷ lệ thắng theo nhóm tuổi, giới tính và thu nhập để tìm phân khúc ủng hộ mạnh mẽ nhất.',
      ],
    },
    visualizerSpec: {
      chartType: 'ABScorecard (Bảng Điểm So Sánh Đối Đầu Head-to-Head)',
      axes: 'Cột phương án A ↔ Cột phương án B trên từng tiêu chí định lượng.',
      keyElements: [
        'Huy hiệu Mẫu Chiến Thắng (Winner Badge) kèm Win-rate % nổi bật.',
        'Chỉ số kiểm định ý nghĩa thống kê (p < 0.01 / Độ tin cậy 99%).',
        'Bảng điểm chi tiết: Độ sang trọng, Sức hút quầy kệ, Mức độ dễ đọc thông tin.',
      ],
    },
    heroKPI: {
      label: 'TỶ LỆ CHIẾN THẮNG (WIN-RATE)',
      exampleValue: 'Phương án B Thắng (61.4% vs 38.6%)',
      interpretation: 'Chênh lệch đạt mức ý nghĩa thống kê cao (p < 0.01). Phương án B tạo cảm nhận sang trọng vượt trội +24%.',
    },
    actionRoadmap: {
      day30: 'Khóa phương án thiết kế chiến thắng; tích hợp một số điểm sáng từ mẫu đối ứng để hoàn thiện bản in cuối.',
      day60: 'In ấn bao bì thương mại hàng loạt; kiểm tra thực tế khả năng nổi bật Shelf Stand-out trên quầy kệ.',
      day90: 'Triển khai chiến dịch truyền thông đồng bộ nhận diện thương hiệu trên mọi kênh online và offline.',
    },
  },
  {
    id: 'ua_study',
    name: 'Nghiên Cứu Thói Quen & Thái Độ Tiêu Dùng (Usage & Attitude)',
    shortName: 'U&A Study',
    framework: 'Usage & Attitudes (U&A) Behavioral Framework',
    founder: 'Phương pháp luận Kinh điển ngành FMCG Toàn Cầu',
    icon: '🔍',
    tagColor: 'text-amber-800 bg-amber-50 border-amber-300',
    borderColor: 'border-amber-200',
    bgSoft: 'bg-amber-50/40',
    demoId: 'DEMO-UA-STUDY',
    executiveQuestion: 'Khách hàng đang dùng những gì trong ngành này? Họ mua ở đâu, dùng khi nào và đang bức xúc điều gì chưa được giải quyết?',
    coreBusinessValue: 'Bóc tách bức tranh toàn cảnh hành vi tiêu dùng, lập bản đồ phễu chuyển đổi và phát hiện khoảng trống thị trường (Unmet Needs) để chiếm lĩnh.',
    questionnaire: [
      { code: 'Q1', label: 'Tần suất sử dụng', type: 'Thang đo tần suất', text: 'Bạn sử dụng sản phẩm trong ngành này bao lâu một lần? (Hàng ngày, 2-3 lần/tuần, hàng tháng...)' },
      { code: 'Q2', label: 'Dịp tiêu dùng (Occasions)', type: 'Câu hỏi phân loại', text: 'Bạn thường sử dụng vào thời điểm hoặc hoàn cảnh nào trong ngày/tuần?' },
      { code: 'Q3', label: 'Kênh mua sắm (Channels)', type: 'Câu hỏi phân loại', text: 'Bạn chủ yếu mua sản phẩm này ở đâu? (Siêu thị MT, tiệm tạp hóa GT, sàn TMĐT...)' },
      { code: 'Q4', label: 'Tiêu chí chọn mua', type: 'Xếp hạng tiêu chí', text: '3 yếu tố quan trọng nhất khi bạn chọn một thương hiệu trong ngành này là gì?' },
      { code: 'Q5', label: 'Nỗi đau chưa thỏa mãn', type: 'Câu hỏi mở', text: 'Điều gì ở các sản phẩm hiện có trên thị trường khiến bạn khó chịu hoặc thất vọng nhất?' },
    ],
    mathEngine: {
      formulaName: 'Ma Trận Cơ Hội & Phễu Hành Vi (Opportunity Matrix)',
      description: 'Đo lường khoảng cách giữa Mức độ quan trọng (Importance) và Mức độ hài lòng (Satisfaction).',
      steps: [
        'Xây dựng phễu: Nhận biết → Dùng thử → Sử dụng thường xuyên → Trung thành.',
        'Tính toán Điểm cơ hội: Opportunity Score = Importance + Max(Importance - Satisfaction, 0).',
        'Xác định các Unmet Needs có điểm cơ hội cao nhất trong ngành hàng.',
      ],
    },
    visualizerSpec: {
      chartType: 'OpportunityMatrix (Ma Trận Cơ Hội & Bản Đồ Dịp Tiêu Dùng)',
      axes: 'Trục hoành: Mức độ thỏa mãn hiện tại ↔ Trục tung: Mức độ quan trọng đối với người dùng.',
      keyElements: [
        'Vùng Góc phần tư Cơ hội vàng (High Importance, Low Satisfaction) = Đại dương xanh.',
        'Biểu đồ tỷ lệ Dịp tiêu dùng (Buổi sáng, Buổi chiều, Dịp tụ tập, Gia đình).',
        'Cơ cấu thị phần các kênh phân phối mua sắm chính.',
      ],
    },
    heroKPI: {
      label: 'DỊP TIÊU DÙNG SỐ 1 & UNMET NEED',
      exampleValue: '48.6% (Buổi chiều văn phòng) · Thiếu tiện lợi',
      interpretation: 'Phát hiện cơ hội vàng cho dòng sản phẩm đóng gói tiện dụng giải tỏa mệt mỏi vào khung giờ 15h - 17h.',
    },
    actionRoadmap: {
      day30: 'Gắn thông điệp truyền thông của sản phẩm vào dịp tiêu dùng cốt lõi đã phát hiện.',
      day60: 'Đẩy mạnh phân phối và khuyến mãi tại kênh mua sắm chi phối nhiều nhất (MT & Kênh tiện lợi).',
      day90: 'R&D giải pháp kỹ thuật giải quyết dứt điểm nỗi đau lớn nhất của ngành để vượt lên trên đối thủ.',
    },
  },
  {
    id: 'deal_elasticity',
    name: 'Đo Lường Độ Co Giãn Khuyến Mãi (Deal Elasticity)',
    shortName: 'Deal Elasticity',
    framework: 'Promotional Elasticity & Brand Equity Model',
    founder: 'Mô hình Kinh tế học Hành vi Khuyến Mãi Bán Lẻ',
    icon: '🎁',
    tagColor: 'text-blue-800 bg-blue-50 border-blue-300',
    borderColor: 'border-blue-200',
    bgSoft: 'bg-blue-50/40',
    demoId: 'DEMO-DEAL-ELASTICITY',
    executiveQuestion: 'Khuyến mãi bao nhiêu % thì bùng nổ doanh số mà không bị lỗ và không làm rẻ rúng giá trị thương hiệu?',
    coreBusinessValue: 'Xác định điểm bùng nổ khuyến mãi (Sweet Spot Promotion) và kiểm soát rủi ro làm mất uy tín thương hiệu do lạm dụng giảm giá sâu.',
    questionnaire: [
      { code: 'Q1', label: 'Ý định mua ở giá gốc', type: 'Thang Likert 5 điểm', text: 'Với mức giá niêm yết ban đầu, bạn có sẵn sàng mua không?' },
      { code: 'Q2', label: 'Độ kích thích của từng deal', type: 'Thang đo kích thích', text: 'Với từng mức ưu đãi (10%, 20%, 30%), mức độ thôi thúc bạn chốt đơn ngay thay đổi thế nào?' },
      { code: 'Q3', label: 'Rủi ro uy tín thương hiệu', type: 'Thang đo cảm nhận', text: 'Giảm giá sâu có khiến bạn nghi ngờ sản phẩm sắp hết hạn hoặc kém chất lượng không?' },
      { code: 'Q4', label: 'Đổi thương hiệu (Switching)', type: 'Thang Likert 5 điểm', text: 'Mức ưu đãi này có đủ lớn để bạn sẵn sàng bỏ thương hiệu quen thuộc sang dùng thử không?' },
    ],
    mathEngine: {
      formulaName: 'Đường Cong Co Giãn Sản Lượng Theo Khuyến Mãi',
      description: 'Hệ số co giãn ε = (% Thay đổi sản lượng cầu) / (% Thay đổi mức giảm giá).',
      steps: [
        'Mô hình hóa đường tăng trưởng sản lượng Volume Lift qua từng nấc chiết khấu.',
        'Mô hình hóa đường gia tăng rủi ro nhận thức thương hiệu (Brand Equity Erosion).',
        'Giao điểm tối ưu biên lãi gộp = Điểm Sweet Spot Promotion (thường tại 15% - 20%).',
      ],
    },
    visualizerSpec: {
      chartType: 'DealElasticityChart (Đồ Thị Co Giãn Khuyến Mãi & Ngưỡng An Toàn)',
      axes: 'Trục hoành: % Giảm giá khuyến mãi ↔ Trục tung: Tỷ lệ kích hoạt chốt đơn & Rủi ro thương hiệu.',
      keyElements: [
        'Vạch chỉ số chiết khấu tối ưu Sweet Spot.',
        'Đường cảnh báo rủi ro thương hiệu khi giảm giá vượt ngưỡng 25%.',
        'Tỷ lệ người dùng sẵn sàng đổi từ thương hiệu đối thủ (Brand Switching Rate).',
      ],
    },
    heroKPI: {
      label: 'HỆ SỐ CO GIÃN (ε) & DEAL SWEET SPOT',
      exampleValue: 'ε = -1.65 · Chiết khấu tối ưu 18%',
      interpretation: 'Mức giảm giá 18% đem lại tỷ lệ đổi thương hiệu cao nhất (+41.2%) mà không làm tổn hại biên lãi gộp.',
    },
    actionRoadmap: {
      day30: 'Thiết lập cơ cấu khuyến mãi tối đa 18% giá trị; cấm xả hàng giảm giá sốc làm mất giá trị thương hiệu.',
      day60: 'Kích hoạt chương trình quà tặng kèm (GWP) hoặc combo để hút khách đối thủ mà không giảm trực tiếp giá niêm yết.',
      day90: 'Đưa giá về mức chuẩn; chuyển hóa khách hàng dùng thử sang chương trình tích điểm khách hàng thân thiết.',
    },
  },
  {
    id: 'monadic',
    name: 'Thử Nghiệm Ý Tưởng Độc Lập (Monadic Split-Sample)',
    shortName: 'Monadic Testing',
    framework: 'Monadic Blind Split-Sample Testing Protocol',
    founder: 'Hiệp hội Nghiên cứu Thị trường Châu Âu (ESOMAR Standard)',
    icon: '🧪',
    tagColor: 'text-indigo-800 bg-indigo-50 border-indigo-300',
    borderColor: 'border-indigo-200',
    bgSoft: 'bg-indigo-50/40',
    demoId: 'DEMO-MONADIC',
    executiveQuestion: 'Nếu khách hàng chỉ nhìn thấy duy nhất sản phẩm của bạn trên thị trường, họ có thực sự bỏ tiền mua?',
    coreBusinessValue: 'Thử nghiệm độc lập không cho khách hàng biết sự tồn tại của sản phẩm so sánh, phản ánh chân thực nhất sức hút tự thân và đo lường chỉ số gia tăng (Lift %).',
    questionnaire: [
      { code: 'Q1', label: 'Ý định mua thử độc lập', type: 'Thang Likert 5 điểm', text: 'Khi tiếp cận duy nhất ý niệm này, bạn có sẵn sàng mua không? (1: Chắc chắn không → 5: Chắc chắn mua)' },
      { code: 'Q2', label: 'Độ độc đáo tự thân', type: 'Thang Likert 5 điểm', text: 'Bạn đánh giá ý niệm này mới lạ ở mức độ nào?' },
      { code: 'Q3', label: 'Mức độ giải quyết vấn đề', type: 'Thang Likert 5 điểm', text: 'Ý niệm này có giải quyết đúng vấn đề bạn đang gặp phải không?' },
      { code: 'Q4', label: 'Độ tương xứng giá trị', type: 'Lựa chọn 3 mức', text: 'So với giá trị mang lại, mức giá dự kiến là Đắt, Hợp lý hay Rẻ?' },
      { code: 'Q5', label: 'Nhận xét định tính', type: 'Câu hỏi mở', text: 'Cảm xúc và suy nghĩ chân thực nhất của bạn khi xem xét ý niệm này?' },
    ],
    mathEngine: {
      formulaName: 'Kiểm Định Độc Lập Hai Nhánh Mẫu (Two-Sample t-Test)',
      description: 'Chỉ số gia tăng Lift % = [(T2B Nhánh Mới - T2B Nhánh Chuẩn) / T2B Nhánh Chuẩn] × 100%.',
      steps: [
        'Chia ngẫu nhiên tập mẫu N=1.000 thành 2 nhánh: 500 người Nhánh A và 500 người Nhánh B.',
        'Tính toán Top-2-Box độc lập cho từng nhánh riêng biệt.',
        'Chạy phép thử t-test mẫu độc lập để kiểm định mức độ chênh lệch có ý nghĩa thống kê.',
      ],
    },
    visualizerSpec: {
      chartType: 'MonadicScorecard (Bảng Đánh Giá Độc Lập & Chênh Lệch Lift %)',
      axes: 'Cột Nhánh A (Benchmark) ↔ Cột Nhánh B (Concept Mới) đặt cạnh nhau.',
      keyElements: [
        'Chỉ số chênh lệch Lift % lớn và nổi bật.',
        'Huy hiệu kiểm định t-test (p = 0.021 / Ý nghĩa thống kê 98%).',
        'Tỷ lệ nguồn khách mới gia tăng vs rủi ro tự ăn thị phần (Cannibalization Risk).',
      ],
    },
    heroKPI: {
      label: 'CHỈ SỐ TĂNG TRƯỞNG GIA TĂNG (LIFT %)',
      exampleValue: '+18.4% LIFT · Top-2-Box 74.2%',
      interpretation: 'Sản phẩm có lực hút tự thân mạnh mẽ. 78% khách hàng tiềm năng là người mới gia nhập ngành hàng.',
    },
    actionRoadmap: {
      day30: 'Phê duyệt phân bổ ngân sách dây chuyền cho phiên bản Concept đạt điểm Lift % vượt trội.',
      day60: 'Định vị độc lập trên các kênh truyền thông, tránh làm loãng hình ảnh các dòng sản phẩm hiện có.',
      day90: 'Mở rộng quy mô phân phối; đo lường dữ liệu bán lẻ để xác thực nguồn doanh thu tăng thêm.',
    },
  },
  {
    id: 'maxdiff',
    name: 'Xếp Hạng Thuộc Tính & Thông Điệp Bán Hàng (MaxDiff)',
    shortName: 'MaxDiff Scaling',
    framework: 'Best-Worst Scaling (BWS / MaxDiff)',
    founder: 'Giáo sư Jordan Louviere (1987) / Chuẩn Sawtooth Software',
    icon: '⚡',
    tagColor: 'text-purple-800 bg-purple-50 border-purple-300',
    borderColor: 'border-purple-200',
    bgSoft: 'bg-purple-50/40',
    demoId: 'DEMO-EVENTS-MAXDIFF',
    executiveQuestion: 'Trong 8 tính năng hoặc câu slogan, đâu là vũ khí bán hàng số 1 và đâu là thứ khách hàng hoàn toàn thờ ơ?',
    coreBusinessValue: 'Triệt tiêu hoàn toàn hiện tượng người tiêu dùng đánh giá cái gì cũng cho 5 sao. Ép buộc phân cấp rõ ràng thứ tự ưu tiên tuyệt đối để tập trung ngân sách.',
    questionnaire: [
      { code: 'Q1', label: 'Thuộc tính Thích Nhất (Best)', type: 'Lựa chọn 1 trong 4', text: 'Trong 4 yếu tố hiển thị ngẫu nhiên, yếu tố nào bạn THÍCH NHẤT hoặc quan trọng nhất với bạn?' },
      { code: 'Q2', label: 'Thuộc tính Ít Quan Tâm Nhất (Worst)', type: 'Lựa chọn 1 trong 4', text: 'Trong 4 yếu tố hiển thị ngẫu nhiên, yếu tố nào bạn ÍT QUAN TÂM NHẤT hoặc kém hấp dẫn nhất?' },
      { code: 'Q3', label: 'Động lực chi tiền', type: 'Thang Likert 5 điểm', text: 'Sự hiện diện của yếu tố thích nhất có đủ khiến bạn quyết định chi tiền mua ngay không?' },
      { code: 'Q4', label: 'Lý do lựa chọn', type: 'Câu hỏi mở', text: 'Tại sao yếu tố bạn chọn lại là quan trọng nhất và yếu tố nào hoàn toàn dư thừa đối với bạn?' },
    ],
    mathEngine: {
      formulaName: 'Thuật Toán Điểm Tiện Ích Tương Đối (Best-Minus-Worst Utility)',
      description: 'Score = (Tổng số lần chọn Best - Tổng số lần chọn Worst) / Tổng số lần xuất hiện.',
      steps: [
        'Thuật toán xoay vòng các tổ hợp 4 thuộc tính cân bằng (Balanced Incomplete Block Design).',
        'Tính điểm Raw Score B-W cho từng thuộc tính.',
        'Chuẩn hóa về thang điểm tỷ trọng tương đối (Standardized Preference Share %) có tổng bằng 100%.',
        'Phân tầng thành 4 nhóm: Hero Must-Have, Differentiator, Nice-to-Have, và Waste (Thờ ơ).',
      ],
    },
    visualizerSpec: {
      chartType: 'MaxDiffChart (Biểu Đồ Thanh Ngang Phân Tầng Tiện Ích MaxDiff)',
      axes: 'Trục tung: Danh sách thuộc tính ↔ Trục hoành: Điểm tiện ích tương đối (Utility Score %).',
      keyElements: [
        'Màu sắc phân tầng theo 4 Tier (Xanh lá, Xanh dương, Vàng, Xám).',
        'Chỉ số khoảng cách tiện ích Utility Spread giữa vị trí số 1 và số cuối.',
        'Khuyến nghị cắt giảm chi phí cho các tính năng thuộc nhóm Khách hàng thờ ơ.',
      ],
    },
    heroKPI: {
      label: 'THUỘC TÍNH HERO CLAIM SỐ 1',
      exampleValue: '48.5% Điểm Tiện Ích · Dẫn đầu tuyệt đối',
      interpretation: 'Thuộc tính số 1 áp đảo hoàn toàn các đối thủ. Cần đưa ngay lên chiếm vị trí trung tâm mặt trước bao bì.',
    },
    actionRoadmap: {
      day30: 'Dành tối thiểu 40% diện tích mặt trước bao bì để truyền tải thông điệp Hero Claim số 1.',
      day60: 'Cắt giảm ngân sách R&D hoặc loại bỏ hẳn các tính năng Tier 4 bị đánh giá Worst nhiều nhất để hạ giá thành.',
      day90: 'Khảo sát đo lường liên tưởng thương hiệu: Đảm bảo khi nhắc tới Hero Claim đó, thương hiệu bạn là số 1.',
    },
  },
  {
    id: 'kano',
    name: 'Phân Loại Tính Năng & Lộ Trình Kỹ Thuật R&D (Kano Model)',
    shortName: 'Kano Model',
    framework: 'Kano Product Quality & Customer Delight Model',
    founder: 'Giáo sư Noriaki Kano (1984 - Đại học Khoa học Tokyo)',
    icon: '🎯',
    tagColor: 'text-purple-800 bg-purple-50 border-purple-300',
    borderColor: 'border-purple-200',
    bgSoft: 'bg-purple-50/40',
    demoId: 'DEMO-KANO',
    executiveQuestion: 'Tính năng nào bắt buộc phải có, tính năng nào tạo sự ngạc nhiên thú vị và tính năng nào gây lãng phí chi phí phát triển?',
    coreBusinessValue: 'Giúp ban giám đốc và đội ngũ R&D định hướng chính xác lộ trình sản phẩm (Product Roadmap), tránh đốt tiền vào các tính năng không ai cần.',
    questionnaire: [
      { code: 'Q1', label: 'Câu hỏi chức năng (Functional)', type: 'Thang đo 5 mức cảm xúc', text: 'Nếu sản phẩm CÓ tính năng này, bạn cảm thấy thế nào? (1: Thích, 2: Mặc nhiên phải có, 3: Bình thường, 4: Chấp nhận, 5: Không thích)' },
      { code: 'Q2', label: 'Câu hỏi phi chức năng (Dysfunctional)', type: 'Thang đo 5 mức cảm xúc', text: 'Nếu sản phẩm KHÔNG CÓ tính năng này, bạn cảm thấy thế nào? (1: Thích, 2: Mặc nhiên phải có, 3: Bình thường, 4: Chấp nhận, 5: Không thích)' },
      { code: 'Q3', label: 'Mức độ ảnh hưởng quyết định mua', type: 'Thang Likert 5 điểm', text: 'Tính năng này đóng vai trò quan trọng ở mức nào khi bạn cân nhắc mua hàng?' },
      { code: 'Q4', label: 'Kỳ vọng hoàn thiện', type: 'Câu hỏi mở', text: 'Bạn mong muốn tính năng này được thiết kế hoặc cải tiến thế nào để trải nghiệm tốt nhất?' },
    ],
    mathEngine: {
      formulaName: 'Ma Trận Phân Loại 5x5 & Hệ Số Hài Lòng / Bất Mãn',
      description: 'Phân loại thành: Must-be (M), One-dimensional (O), Attractive (A), Indifferent (I), Reverse (R).',
      steps: [
        'Ánh xạ cặp câu trả lời (Functional × Dysfunctional) vào bảng đánh giá tiêu chuẩn Kano.',
        'Tính Hệ số Hài lòng: CS+ (Better) = (A + O) / (A + O + M + I).',
        'Tính Hệ số Bất mãn: CS- (Worse) = - (O + M) / (A + O + M + I).',
        'Lập thứ tự ưu tiên R&D: M (ưu tiên 1) → O (ưu tiên 2) → A (ưu tiên 3) → Loại bỏ I.',
      ],
    },
    visualizerSpec: {
      chartType: 'KanoGrid (Tọa Độ Không Gian 2D Kano Matrix)',
      axes: 'Trục hoành: Hệ số bất mãn CS- (Worse: -1 đến 0) ↔ Trục tung: Hệ số hài lòng CS+ (Better: 0 đến 1).',
      keyElements: [
        'Vùng Bắt buộc (Must-be): Bắt buộc đạt chuẩn 100%.',
        'Vùng Cạnh tranh (One-dimensional): Càng nhiều càng tốt.',
        'Vùng Đột phá (Attractive): Tạo hiệu ứng WOW bán hàng.',
        'Vùng Thờ ơ (Indifferent): Vô thưởng vô phạt, cần cắt giảm.',
      ],
    },
    heroKPI: {
      label: 'VŨ KHÍ ĐỘT PHÁ (ATTRACTIVE WOW) & MUST-BE',
      exampleValue: '1 Đột Phá WOW · 2 Tính Năng Bắt Buộc',
      interpretation: 'Tìm ra tính năng tạo hiệu ứng ngạc nhiên giúp chiến dịch ra mắt bùng nổ đơn hàng truyền miệng.',
    },
    actionRoadmap: {
      day30: 'Đảm bảo 100% tiêu chuẩn kỹ thuật cho các tính năng Must-be; thiếu sót ở nhóm này sẽ dẫn tới thất bại tức thì.',
      day60: 'Lấy tính năng Đột phá (Attractive) làm tâm điểm chiến dịch truyền thông quảng bá ra mắt.',
      day90: 'Nghiên cứu tính năng mới cho chu kỳ tiếp theo vì theo quy luật Kano, tính năng Attractive sẽ dần thành Must-be sau 1 năm.',
    },
  },
  {
    id: 'brand_map',
    name: 'Bản Đồ Định Vị Thương Hiệu & Đại Dương Xanh (Brand Perceptual Map)',
    shortName: 'Perceptual Mapping',
    framework: 'Multidimensional Scaling (MDS) Perceptual Framework',
    founder: 'Phương pháp luận Định Vị Cạnh Tranh Chiến Lược (Philip Kotler & Al Ries)',
    icon: '🗺️',
    tagColor: 'text-indigo-800 bg-indigo-50 border-indigo-300',
    borderColor: 'border-indigo-200',
    bgSoft: 'bg-indigo-50/40',
    demoId: 'DEMO-BRAND-MAP',
    executiveQuestion: 'Thương hiệu của bạn đang đứng ở đâu trong tâm trí khách hàng so với đối thủ? Khoảng trống thị trường ở đâu?',
    coreBusinessValue: 'Đo lường tọa độ nhận thức thực tế của người tiêu dùng trên hệ trục 2 chiều (ví dụ: Giá cả vs Đổi mới sáng tạo), phát hiện khoảng trống cạnh tranh chưa có ai chiếm lĩnh.',
    questionnaire: [
      { code: 'Q1', label: 'Điểm nhận thức Trục X (Phân khúc giá)', type: 'Thang đo 1 - 10', text: 'Chấm điểm cho thương hiệu về mức giá (1: Siêu bình dân/Rẻ ↔ 10: Siêu cao cấp/Sang trọng).' },
      { code: 'Q2', label: 'Điểm nhận thức Trục Y (Đổi mới sáng tạo)', type: 'Thang đo 1 - 10', text: 'Chấm điểm cho thương hiệu về độ sáng tạo (1: Truyền thống/Cũ kỹ ↔ 10: Đột phá/Hiện đại).' },
      { code: 'Q3', label: 'Tính cách thương hiệu', type: 'Thuộc tính liên tưởng', text: 'Khi nghĩ tới thương hiệu này, 3 tính từ đầu tiên xuất hiện trong đầu bạn là gì?' },
      { code: 'Q4', label: 'Khoảng trống kỳ vọng', type: 'Câu hỏi mở', text: 'Bạn đang tìm kiếm một thương hiệu thế nào trong ngành này mà thị trường hiện chưa có?' },
    ],
    mathEngine: {
      formulaName: 'Phân Tích Tọa Độ Không Gian Đa Chiều (MDS Centroid Analysis)',
      description: 'Tính toán trọng tâm nhận thức (Centroid coordinates) và khoảng cách Euclidean giữa các thương hiệu.',
      steps: [
        'Tính toán tọa độ trung bình (x_mean, y_mean) của từng thương hiệu từ 1.000 phản hồi.',
        'Thiết lập tâm tọa độ chuẩn ngành tại điểm trung hòa (5.0, 5.0).',
        'Xác định 4 góc phần tư: Q1 (Cao cấp & Đột phá), Q2 (Bình dân & Hiện đại), Q3 (Bình dân & Truyền thống), Q4 (Cao cấp & Di sản).',
        'Nhận diện góc phần tư có mật độ đối thủ thấp nhất nhưng nhu cầu cao nhất = Đại dương xanh (White-space).',
      ],
    },
    visualizerSpec: {
      chartType: 'BrandPerceptualMap (Bản Đồ Phân Tán Nhận Thức 2D Cạnh Tranh)',
      axes: 'Trục hoành: Phân khúc giá (Bình dân ↔ Cao cấp) | Trục tung: Độ đổi mới (Truyền thống ↔ Đột phá).',
      keyElements: [
        'Điểm tròn đại diện cho vị thế của từng đối thủ cạnh tranh chính.',
        'Vòng tròn màu nổi bật đánh dấu vị thế thương hiệu của bạn.',
        'Vùng highlight đánh dấu Khoảng trống thị trường (White-space Opportunity).',
      ],
    },
    heroKPI: {
      label: 'TỌA ĐỘ ĐẠI DƯƠNG XANH (WHITE-SPACE)',
      exampleValue: 'Góc phần tư Q2 · Smart Value Disruptor',
      interpretation: 'Phát hiện khoảng trống lớn ở phân khúc Giá hợp lý nhưng Đổi mới hiện đại mà các ông lớn ngoại nhập bỏ qua.',
    },
    actionRoadmap: {
      day30: 'Định vị lại toàn bộ thông điệp truyền thông xoay quanh tọa độ Đại dương xanh đã phát hiện.',
      day60: 'Nâng cấp bao bì và trải nghiệm dịch vụ nhằm tách biệt hoàn toàn khỏi nhóm đối thủ đang sa lầy ở vùng cạnh tranh cũ.',
      day90: 'Tổ chức sự kiện ra mắt định vị mới; theo dõi mức độ dịch chuyển nhận thức của khách hàng sau 3 tháng.',
    },
  },
];

export default function ChuanPhuongPhapPage() {
  const [activeModelId, setActiveModelId] = useState<string>('nielsen_bases');

  const activeModel = METHODOLOGIES.find((m) => m.id === activeModelId) || METHODOLOGIES[0];

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-slate-900 font-sans pb-24 selection:bg-amber-100 selection:text-amber-950">
      
      {/* ── Top Bar / Header ── */}
      <header className="bg-white/95 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Logo href="/" />

          <nav className="hidden sm:flex items-center gap-6 text-xs font-semibold text-slate-600">
            <Link href="/chuan-phuong-phap" className="text-amber-700 font-bold">
              Chuẩn 9 Phương Pháp
            </Link>
            <Link
              href="/thu-vien"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500/15 via-amber-500/10 to-amber-50 text-amber-950 font-bold border border-amber-300 shadow-2xs hover:shadow-xs hover:border-amber-400 hover:bg-amber-100/60 transition-all shrink-0"
              title="Xem & Tải Báo Cáo Nghiên Cứu Thị Trường Chính Thức 2026 (N=2.000 Personas)"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
              <span className="text-slate-950 font-bold text-xs tracking-tight">Báo Cáo Ngành 2026</span>
              <span className="text-[10px] font-mono uppercase bg-amber-500 text-slate-950 px-1.5 py-0.5 rounded font-black tracking-tight shrink-0">
                Xem & Tải PDF
              </span>
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/wizard"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold shadow-sm transition-all"
            >
              <span>Khởi tạo khảo sát</span>
              <span>&rarr;</span>
            </Link>
          </div>
        </div>
      </header>

      {/* ── Hero Banner ── */}
      <section className="bg-gradient-to-b from-[#0A192F] via-[#0D1D38] to-[#0A192F] text-white py-14 sm:py-20 px-4 sm:px-6 border-b border-amber-500/30">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/15 border border-amber-400/40 text-amber-300 text-xs font-mono font-bold tracking-wider uppercase">
            <span>🏛️ CHUẨN MỰC HỌC THUẬT & PHƯƠNG PHÁP LUẬN TOÀN CẦU</span>
          </div>

          <h1 className="font-serif text-2xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
            9 Mô Hình Khảo Sát Thị Trường Chuẩn Quốc Tế <br className="hidden sm:inline" />
            & 9 Cấu Trúc Báo Cáo Chuyên Biệt
          </h1>

          <p className="text-slate-300 text-xs sm:text-base max-w-2xl mx-auto leading-relaxed pt-2">
            Insight AI loại bỏ hoàn toàn các dạng báo cáo chung chung thiếu căn cứ. Mỗi bài toán kinh doanh được vận hành bằng 
            <strong> đúng thuật toán, bộ câu hỏi chuẩn mực và đồ thị chuyên sâu</strong> của các tổ chức nghiên cứu thị trường hàng đầu thế giới.
          </p>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-4 text-xs font-mono text-amber-300">
            <span className="px-3 py-1 rounded-md bg-white/5 border border-white/10">✓ Cỡ mẫu N=1.000 tác tử AI chuẩn GSO</span>
            <span className="px-3 py-1 rounded-md bg-white/5 border border-white/10">✓ Độ tin cậy thống kê 95% (Sai số ±3.1%)</span>
            <span className="px-3 py-1 rounded-md bg-white/5 border border-white/10">✓ Không khống chế số trang A4</span>
          </div>
        </div>
      </section>

      {/* ── Main Interactive Section ── */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-10">
        
        {/* Navigation Selector for 9 Models */}
        <div className="mb-10">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 text-center sm:text-left">
            Bấm chọn mô hình để kiểm tra chi tiết cấu trúc phương pháp luận:
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
            {METHODOLOGIES.map((m) => {
              const isActive = m.id === activeModelId;
              return (
                <button
                  key={m.id}
                  onClick={() => setActiveModelId(m.id)}
                  className={`text-left p-3 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                    isActive
                      ? 'bg-amber-500 text-slate-950 border-amber-500 shadow-md ring-2 ring-amber-300/50 font-bold'
                      : 'bg-white text-slate-700 border-slate-200 hover:border-amber-300 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-base">{m.icon}</span>
                    <span className="text-xs font-bold line-clamp-1">{m.shortName}</span>
                  </div>
                  <span className={`text-[10px] line-clamp-1 ${isActive ? 'text-slate-900' : 'text-slate-500'}`}>
                    {m.framework}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Detailed Model Card */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-lg space-y-8 animate-in fade-in duration-200">
          
          {/* Header of Active Model */}
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 pb-6 border-b border-slate-200">
            <div className="space-y-2 max-w-2xl">
              <div className="flex items-center gap-2.5 flex-wrap">
                <span className={`text-xs font-bold px-3 py-1 rounded-full border ${activeModel.tagColor}`}>
                  {activeModel.framework}
                </span>
                <span className="text-xs font-mono text-slate-500">
                  Nền tảng sáng lập: <strong>{activeModel.founder}</strong>
                </span>
              </div>

              <h2 className="font-serif text-xl sm:text-3xl font-black text-slate-900 flex items-center gap-3">
                <span>{activeModel.icon}</span>
                <span>{activeModel.name}</span>
              </h2>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed pt-1">
                {activeModel.coreBusinessValue}
              </p>
            </div>

            {/* Quick Demo Report Links */}
            <div className="flex flex-col sm:flex-row md:flex-col gap-2.5 shrink-0 min-w-[240px]">
              <Link
                href={`/results/${activeModel.demoId}`}
                target="_blank"
                className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold text-center transition-all flex items-center justify-center gap-2 shadow-sm"
              >
                <span>👁️ Xem Trên Màn Hình</span>
                <span>&rarr;</span>
              </Link>
              <a
                href={`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/survey/${activeModel.demoId}/pdf?download=true`}
                download={`Bao-Cao-Nghien-Cuu-Thi-Truong-${activeModel.demoId.replace('DEMO-', '')}.pdf`}
                className="w-full py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold text-center transition-all flex items-center justify-center gap-2 shadow-sm"
              >
                <span>📥 Tải Về File PDF</span>
                <span>&rarr;</span>
              </a>
            </div>
          </div>

          {/* Core Business Question & Hero Metric */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
            <div className="md:col-span-7 p-5 rounded-2xl bg-amber-50/60 border border-amber-200/80 space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 font-mono">
                ❓ BÀI TOÁN KINH DOANH SỐNG CÒN GIẢI QUYẾT:
              </span>
              <p className="text-xs sm:text-sm font-serif font-bold text-slate-900 leading-relaxed italic">
                "{activeModel.executiveQuestion}"
              </p>
            </div>

            <div className="md:col-span-5 p-5 rounded-2xl bg-slate-900 text-white border border-slate-800 space-y-1 flex flex-col justify-center">
              <span className="text-[10px] font-mono text-amber-400 uppercase tracking-wider font-bold">
                🎯 {activeModel.heroKPI.label}
              </span>
              <div className="text-lg sm:text-xl font-bold font-serif text-white">
                {activeModel.heroKPI.exampleValue}
              </div>
              <p className="text-[11px] text-slate-300 leading-tight">
                {activeModel.heroKPI.interpretation}
              </p>
            </div>
          </div>

          {/* 3 Pillar Deep-Dives: Questionnaire, Math Engine, Visualizer */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-2">
            
            {/* Box 1: Questionnaire */}
            <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                <span className="w-5 h-5 rounded-md bg-amber-500 text-slate-950 flex items-center justify-center text-[11px]">1</span>
                <span>Bộ Câu Hỏi & Thang Đo Chuẩn</span>
              </div>
              <div className="space-y-2 text-xs">
                {activeModel.questionnaire.map((q) => (
                  <div key={q.code} className="p-2.5 rounded-xl bg-white border border-slate-200 space-y-1">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-bold text-amber-800 font-mono">{q.code} · {q.label}</span>
                      <span className="text-[10px] text-slate-400 font-medium">{q.type}</span>
                    </div>
                    <p className="text-[11px] text-slate-600 leading-relaxed">
                      {q.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Box 2: Math Engine */}
            <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                <span className="w-5 h-5 rounded-md bg-amber-500 text-slate-950 flex items-center justify-center text-[11px]">2</span>
                <span>Thuật Toán Thống Kê Phân Tích</span>
              </div>
              <div className="p-3 rounded-xl bg-white border border-slate-200 space-y-2 text-xs">
                <span className="font-bold text-slate-900 block font-serif">
                  {activeModel.mathEngine.formulaName}
                </span>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  {activeModel.mathEngine.description}
                </p>
                <div className="pt-2 border-t border-slate-100 space-y-1.5">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block font-mono">
                    Các bước tính toán toán học:
                  </span>
                  <ul className="space-y-1.5 text-[11px] text-slate-700">
                    {activeModel.mathEngine.steps.map((st, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-amber-600 font-bold font-mono">›</span>
                        <span>{st}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Box 3: Visualizer Spec */}
            <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                <span className="w-5 h-5 rounded-md bg-amber-500 text-slate-950 flex items-center justify-center text-[11px]">3</span>
                <span>Đồ Thị & Thành Phần Hiển Thị</span>
              </div>
              <div className="p-3 rounded-xl bg-white border border-slate-200 space-y-2 text-xs">
                <span className="font-bold text-slate-900 block font-serif">
                  {activeModel.visualizerSpec.chartType}
                </span>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  <strong>Trục tọa độ:</strong> {activeModel.visualizerSpec.axes}
                </p>
                <div className="pt-2 border-t border-slate-100 space-y-1.5">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block font-mono">
                    Điểm nhấn thị giác trên báo cáo:
                  </span>
                  <ul className="space-y-1.5 text-[11px] text-slate-700">
                    {activeModel.visualizerSpec.keyElements.map((el, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-emerald-600 font-bold">✓</span>
                        <span>{el}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

          </div>

          {/* Strategic 30 - 60 - 90 Days Roadmap */}
          <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white space-y-4">
            <div className="flex items-center justify-between gap-4">
              <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider">
                🗓️ LỘ TRÌNH HÀNH ĐỘNG 30 - 60 - 90 NGÀY CHO BAN ĐIỀU HÀNH
              </span>
              <span className="text-[10px] font-mono text-slate-400">
                Đặc thù theo mô hình {activeModel.shortName}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-1.5">
                <span className="text-amber-400 font-bold block font-mono">GIAI ĐOẠN 30 NGÀY</span>
                <p className="text-slate-300 leading-relaxed text-[11px]">
                  {activeModel.actionRoadmap.day30}
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-1.5">
                <span className="text-amber-400 font-bold block font-mono">GIAI ĐOẠN 60 NGÀY</span>
                <p className="text-slate-300 leading-relaxed text-[11px]">
                  {activeModel.actionRoadmap.day60}
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-1.5">
                <span className="text-amber-400 font-bold block font-mono">GIAI ĐOẠN 90 NGÀY</span>
                <p className="text-slate-300 leading-relaxed text-[11px]">
                  {activeModel.actionRoadmap.day90}
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* ── Bottom Call To Action ── */}
        <section className="mt-14 text-center p-10 rounded-3xl bg-slate-900 text-white space-y-6">
          <div className="max-w-2xl mx-auto space-y-3">
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white">
              Sẵn Sàng Khảo Sát Riêng Cho Doanh Nghiệp Của Bạn?
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Áp dụng 1 trong 9 mô hình chuẩn quốc tế trên tập mẫu 1.000 tác tử AI đại diện dân số Việt Nam. 
              Nhận kết quả và bản báo cáo chiến lược hoàn chỉnh chỉ sau 60 giây.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/wizard"
              className="py-3 px-6 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md transition-all flex items-center gap-2"
            >
              <span>Khởi Tạo Khảo Sát Ngay</span>
              <span>&rarr;</span>
            </Link>
            <Link
              href="/thu-vien"
              className="py-3 px-6 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs border border-white/20 transition-all flex items-center gap-2"
            >
              <span>📑 Kho Báo Cáo Ngành 2026 (Xem & Tải PDF)</span>
            </Link>
          </div>
        </section>

      </main>

      {/* ── Footer ── */}
      <Footer />
    </div>
  );
}
