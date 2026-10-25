'use client';

import { useState } from 'react';
import Link from 'next/link';
import Logo from '@/components/Logo';

interface CaseStudy {
  id: string;
  demoId: string;
  category: string;
  categoryLabel: string;
  modelType: string;
  modelLabel: string;
  productName: string;
  companyName: string;
  sampleSize: string;
  scoreOrVerdict: string;
  scoreNumber?: number;
  scoreColor: string;
  summary: string;
  findings: string[];
  tags: string[];
}

const CASE_STUDIES: CaseStudy[] = [
  {
    id: 'kombucha-bases',
    demoId: 'DEMO-NIELSEN-BASES',
    category: 'fnb',
    categoryLabel: 'F&B · Đồ Uống Chức Năng',
    modelType: 'nielsen_bases',
    modelLabel: 'Nielsen BASES',
    productName: 'Báo Cáo Khảo Sát Tiềm Năng Ra Mắt: Dòng Trà Kombucha Men Vi Sinh Bản Địa (330ml)',
    companyName: 'Khảo Sát Chuẩn Ngành F&B · Ban Đồ Uống Lên Men Tự Nhiên 2026',
    sampleSize: 'N = 1.000 Personas · Đô thị Toàn quốc',
    scoreOrVerdict: '78/100 · STRONG GO',
    scoreNumber: 78,
    scoreColor: 'text-emerald-700 bg-emerald-50 border-emerald-300',
    summary: 'Kiểm chứng chỉ số thử nghiệm (Trial Rate), độ độc đáo của nguyên liệu bản địa và rào cản giá 28.000đ trước khi đưa vào kệ siêu thị & chuỗi tiện lợi.',
    findings: [
      'Ý định mua Top-2-Box đạt 73.4%, vượt mức trung bình ngành nước giải khát tốt cho sức khỏe (62%).',
      'Độ độc đáo đạt 8.2/10 nhờ định vị Xoài Cát Chu Đồng Tháp kết hợp 1 tỷ lợi khuẩn Bacillus Clausii.',
      'Rào cản lớn nhất ở mức giá 28.000đ/lon; combo lốc 6 lon giảm giá dùng thử phá vỡ tâm lý do dự.',
    ],
    tags: ['Kombucha', 'Đồ uống hữu cơ', 'Trial Rate', 'USP'],
  },
  {
    id: 'coffee-psm',
    demoId: 'DEMO-VAN-WESTENDORP',
    category: 'fnb',
    categoryLabel: 'F&B · Cà Phê Đặc Sản',
    modelType: 'van_westendorp',
    modelLabel: 'Van Westendorp PSM',
    productName: 'Báo Cáo Chuẩn Định Giá & Đo Lường Độ Co Giãn: Ngành Cà Phê Phin Giấy Đặc Sản',
    companyName: 'Khảo Sát Chuẩn Ngành F&B · Hội Đồng Cà Phê Đặc Sản Việt Nam 2026',
    sampleSize: 'N = 1.000 Personas · Phân khúc Thu nhập B-A',
    scoreOrVerdict: 'ĐIỂM GIÁ TỐI ƯU: 185.000đ',
    scoreColor: 'text-sky-800 bg-sky-50 border-sky-300',
    summary: 'Xác định điểm giá tối ưu (OPP) và biên độ chấp nhận giá, bảo toàn giá trị định vị cao cấp tránh rơi vào bẫy cạnh tranh giá rẻ.',
    findings: [
      'Điểm giá tối ưu (OPP) hội tụ tại 185.000đ/hộp 10 gói phin giấy chất lượng cao.',
      'Khoảng giá chấp nhận được (PME) dao động từ 150.000đ (Quá rẻ) đến 220.000đ (Quá đắt).',
      'Định giá dưới 140.000đ làm giảm 34% niềm tin về chất lượng hạt Arabica Cầu Đất nguyên chất.',
    ],
    tags: ['Cà phê đặc sản', 'Định giá tối ưu', 'Độ co giãn', 'Cao cấp'],
  },
  {
    id: 'confectionery-ab',
    demoId: 'DEMO-AB-TESTING',
    category: 'confectionery',
    categoryLabel: 'Bánh Kẹo · Quà Biếu Mùa Vụ',
    modelType: 'ab_testing',
    modelLabel: 'A/B Testing Bao Bì',
    productName: 'Báo Cáo Thử Nghiệm Thị Giác Bao Bì Hộp Thiếc: Ngành Quà Biếu Bánh Kẹo Mùa Lễ Tết',
    companyName: 'Khảo Sát Chuẩn Ngành Bánh Kẹo · Ban Đo Lường Thị Giác Bao Bì Quà Tặng 2026',
    sampleSize: 'N = 1.000 Personas · Người mua quà biếu Tết',
    scoreOrVerdict: 'CONCEPT B THẮNG (61.4%)',
    scoreColor: 'text-amber-800 bg-amber-50 border-amber-300',
    summary: 'Thử nghiệm đối đầu trực diện giữa 2 mẫu thiết kế bao bì thiếc (Cổ điển vs Hiện đại) trước khi quyết định in ấn sản xuất số lượng lớn.',
    findings: [
      'Phương án B (Tông màu xanh hoàng gia phối viền kim loại dập nổi) thắng áp đảo với 61.4% lựa chọn.',
      'Phương án B tạo cảm nhận sang trọng vượt trội +24% và sẵn sàng chi trả cao hơn 35.000đ/hộp.',
      'Điểm nghẽn ở mẫu A: Màu đỏ truyền thống bị đánh giá là đại trà, khó phân biệt với các thương hiệu cũ.',
    ],
    tags: ['A/B Testing', 'Bao bì hộp thiếc', 'Quà biếu Tết', 'Eye-tracking'],
  },
  {
    id: 'nutrition-monadic',
    demoId: 'DEMO-MONADIC',
    category: 'nutrition',
    categoryLabel: 'Thực Phẩm Dinh Dưỡng Tiện Lợi',
    modelType: 'monadic',
    modelLabel: 'Monadic Concept Test',
    productName: 'Báo Cáo Thẩm Định Ý Niệm Đơn Lập (Monadic): Ngành Nước Hầm Dinh Dưỡng Đóng Gói',
    companyName: 'Khảo Sát Chuẩn Ngành Dinh Dưỡng · Ban Thực Phẩm Bản Địa Đô Thị 2026',
    sampleSize: 'N = 1.000 Personas · Phụ nữ nội trợ & Gia đình',
    scoreOrVerdict: 'LIFT +18.4% ĐỘ HẤP DẪN',
    scoreColor: 'text-emerald-700 bg-emerald-50 border-emerald-300',
    summary: 'Thẩm định ý niệm độc lập tách biệt để đo lường mức độ sẵn sàng thay thế thói quen ninh xương truyền thống bằng nước hầm cô đặc tiệt trùng.',
    findings: [
      'Ý niệm dinh dưỡng tự nhiên không bột ngọt đạt điểm chấp nhận Lift +18.4% so với hạt nêm.',
      '84% đánh giá cao tính năng tiết kiệm 4 tiếng ninh nấu cho gia đình hiện đại.',
      'Rào cản niềm tin: Cần minh bạch cam kết 0% chất bảo quản và truy xuất nguồn thịt sạch.',
    ],
    tags: ['Nước hầm xương', 'Monadic Test', 'Dinh dưỡng sạch', 'Gia đình'],
  },
  {
    id: 'kitchen-kano',
    demoId: 'DEMO-KANO',
    category: 'appliances',
    categoryLabel: 'Gia Dụng · Smart Kitchen',
    modelType: 'kano',
    modelLabel: 'Kano Model R&D',
    productName: 'Báo Cáo Phân Tầng Tính Năng R&D: Thiết Bị Nồi Chiên Hơi Nước Gia Đình Đô Thị',
    companyName: 'Khảo Sát Chuẩn Ngành Gia Dụng · Ban R&D Thiết Bị Nhà Bếp Thông Minh 2026',
    sampleSize: 'N = 1.000 Personas · Chủ hộ căn hộ hiện đại',
    scoreOrVerdict: 'TỐI ƯU BOM SẢN XUẤT',
    scoreColor: 'text-purple-800 bg-purple-50 border-purple-300',
    summary: 'Phân tầng tính năng R&D theo mô hình Kano Nhật Bản: Cắt giảm tính năng thừa vô bổ, dồn ngân sách vào tính năng tạo sự thỏa mãn vượt trội.',
    findings: [
      'Công nghệ tự động vệ sinh khử khuẩn bằng hơi nước là vũ khí đột phá (Attractive feature).',
      'Lòng nồi chống dính ceramic và điều khiển cảm ứng tiếng Việt là tính năng bắt buộc (Must-be).',
      'Kết nối ứng dụng Wi-Fi bị 58% người dùng xem là không cần thiết, có thể cắt giảm để hạ giá thành.',
    ],
    tags: ['Kano Model', 'Đồ gia dụng', 'R&D Roadmap', 'Cắt giảm chi phí'],
  },
  {
    id: 'cosmetics-brandmap',
    demoId: 'DEMO-BRAND-MAP',
    category: 'cosmetics',
    categoryLabel: 'Mỹ Phẩm · Skincare Đô Thị',
    modelType: 'brand_map',
    modelLabel: 'Brand Perceptual Map',
    productName: 'Báo Cáo Bản Đồ Định Vị Đa Chiều (MDS): Phân Khúc Dược Mỹ Phẩm Thuần Chay Bản Địa',
    companyName: 'Khảo Sát Chuẩn Ngành Mỹ Phẩm · Ban Đánh Giá Xu Hướng Skincare Đô Thị 2026',
    sampleSize: 'N = 1.000 Personas · Nữ giới 18-35 tuổi',
    scoreOrVerdict: 'KHAI THÁC WHITE-SPACE',
    scoreColor: 'text-teal-800 bg-teal-50 border-teal-300',
    summary: 'Bản đồ hóa không gian định vị đa chiều, phát hiện khoảng trống cạnh tranh ngách Dược mỹ phẩm thuần chay kết hợp hoạt chất sinh học bản địa.',
    findings: [
      'Thị trường tồn tại khoảng trống lớn giữa nhóm Mỹ phẩm organic dịu nhẹ và Dược mỹ phẩm điều trị nặng đô.',
      'Sự kết hợp giữa Tràm trà Huế và Niacinamide 5% giải quyết trúng nhu cầu da mụn khí hậu nhiệt đới.',
      '71% người dùng Gen Z sẵn sàng chuyển đổi thương hiệu nếu có chứng nhận lâm sàng độc lập.',
    ],
    tags: ['Brand Map', 'Mỹ phẩm thuần chay', 'Khoảng trống thị trường', 'Gen Z'],
  },
  {
    id: 'fmcg-ua',
    demoId: 'DEMO-UA-STUDY',
    category: 'fnb',
    categoryLabel: 'FMCG · Thói Quen Tiêu Dùng',
    modelType: 'ua_study',
    modelLabel: 'Usage & Attitude (U&A)',
    productName: 'Báo Cáo Thói Quen & Động Cơ Tiêu Dùng (U&A): Ngành Hàng Cà Phê Hòa Tan Đóng Gói',
    companyName: 'Khảo Sát Chuẩn Ngành FMCG · Ban Nghiên Cứu Hành Vi Đồ Uống Tiện Lợi 2026',
    sampleSize: 'N = 1.000 Personas · Người dùng cà phê hàng ngày',
    scoreOrVerdict: 'THẤU HIỂU HÀNH VI 360°',
    scoreColor: 'text-indigo-800 bg-indigo-50 border-indigo-300',
    summary: 'Nghiên cứu cấu trúc hành vi tiêu dùng 360°: Dịp sử dụng cốt lõi, thói quen pha chế, động cơ mua hàng và rào cản từ các chuỗi đồ uống mang đi.',
    findings: [
      '68.2% uống vào khung giờ 07:00 - 08:30 sáng ngay tại bàn làm việc hoặc trước khi rời nhà.',
      'Lý do chính chọn cà phê hòa tan thay vì mua mang đi: Tiết kiệm thời gian (54%) và kiểm soát độ ngọt (42%).',
      'Nhu cầu chưa được đáp ứng: Khát khao vị đắng đậm mộc tự nhiên của Robusta Tây Nguyên.',
    ],
    tags: ['U&A Study', 'Thói quen tiêu dùng', 'FMCG', 'Cà phê hòa tan'],
  },
  {
    id: 'gifts-elasticity',
    demoId: 'DEMO-DEAL-ELASTICITY',
    category: 'confectionery',
    categoryLabel: 'Quà Tặng Mùa Vụ B2B',
    modelType: 'deal_elasticity',
    modelLabel: 'Deal Elasticity Matrix',
    productName: 'Báo Cáo Độ Co Giãn Chiết Khấu B2B & Mùa Vụ: Phân Khúc Hộp Quà Trung Thu & Lễ Tết',
    companyName: 'Khảo Sát Chuẩn Ngành Quà Tặng · Ban Đo Lường Hiệu Quả Khuyến Mãi 2026',
    sampleSize: 'N = 1.000 Personas · Người mua quà B2B & Gia đình',
    scoreOrVerdict: 'CHIẾT KHẤU TỐI ƯU: 15% - 20%',
    scoreColor: 'text-rose-800 bg-rose-50 border-rose-300',
    summary: 'Đo lường độ co giãn nhu cầu theo các mức khuyến mãi và chiết khấu bậc thang, tối ưu hóa tổng doanh thu và biên lợi nhuận ròng cho mùa Tết.',
    findings: [
      'Khuyến mãi dưới 10% không tạo ra sự dịch chuyển nhu cầu đáng kể (tỷ lệ chuyển đổi chỉ tăng +4%).',
      'Mức chiết khấu vàng đạt 15% cho đơn từ 20 hộp và 20% cho đơn từ 50 hộp kích hoạt tỷ lệ chốt đơn B2B tăng +42%.',
      'Chiết khấu sâu quá 30% làm dấy lên nghi ngờ về bánh cận date hoặc chất lượng nhân bánh sụt giảm.',
    ],
    tags: ['Deal Elasticity', 'Co giãn giá', 'Chiết khấu B2B', 'Mùa vụ'],
  },
  {
    id: 'events-maxdiff',
    demoId: 'DEMO-MAXDIFF',
    category: 'lifestyle',
    categoryLabel: 'Dịch Vụ Cưới & Sự Kiện Cao Cấp',
    modelType: 'maxdiff',
    modelLabel: 'MaxDiff Scaling',
    productName: 'Báo Cáo Phân Cấp Giá Trị Thuộc Tính MaxDiff: Dịch Vụ Cưới & Sự Kiện Ngoài Trời',
    companyName: 'Khảo Sát Chuẩn Ngành Dịch Vụ · Ban Đánh Giá Trải Nghiệm Khách Hàng Cao Cấp 2026',
    sampleSize: 'N = 1.000 Personas · Cặp đôi chuẩn bị kết hôn',
    scoreOrVerdict: 'PHÂN CẤP TIỆN ÍCH TỐI ĐA',
    scoreColor: 'text-amber-800 bg-amber-50 border-amber-300',
    summary: 'Áp dụng phương pháp MaxDiff (Best-Worst Scaling) để phân loại rạch ròi thuộc tính quan trọng nhất và thuộc tính khách hàng thờ ơ khi đặt tiệc cưới.',
    findings: [
      'Hai yếu tố được đánh giá quan trọng nhất: Độ riêng tư của khuôn viên tiệc và Chất lượng ẩm thực tiệc nóng.',
      'Khách hàng sẵn sàng cắt giảm: Màn trình diễn pháo hoa rườm rà và cổng hoa giả để đầu tư vào bàn tiệc.',
      'Gói ẩm thực hữu cơ cá nhân hóa theo chế độ ăn là thuộc tính tạo động lực chốt hợp đồng mạnh mẽ nhất.',
    ],
    tags: ['MaxDiff', 'Tiệc cưới', 'Phân cấp thuộc tính', 'Dịch vụ cao cấp'],
  },
  {
    id: 'milk-sen-bases',
    demoId: 'DEMO-NIELSEN-BASES',
    category: 'nutrition',
    categoryLabel: 'Nông Sản OCOP Chế Biến Sâu',
    modelType: 'nielsen_bases',
    modelLabel: 'Nielsen BASES',
    productName: 'Báo Cáo Tiềm Năng Thương Mại Hóa: Sữa Hạt Sen OCOP & Dinh Dưỡng Thực Vật',
    companyName: 'Khảo Sát Chuẩn Ngành Dinh Dưỡng · Ban Nông Sản Chế Biến Sâu Bản Địa 2026',
    sampleSize: 'N = 1.000 Personas · Gia đình có con nhỏ & Người lớn tuổi',
    scoreOrVerdict: '76/100 · STRONG GO',
    scoreNumber: 76,
    scoreColor: 'text-emerald-700 bg-emerald-50 border-emerald-300',
    summary: 'Kiểm chứng tiềm năng thương mại hóa dòng sữa hạt bản địa OCOP 4 sao thay thế sữa bò truyền thống cho người tiêu dùng đô thị dị ứng lactose.',
    findings: [
      'Điểm số thỏa mãn nhu cầu sức khỏe đạt 86%, đặc biệt ở phân khúc người tiêu dùng trên 35 tuổi.',
      'Thông điệp "Hạt sen Tháp Mười kết hợp gạo lứt huyết rồng" tạo dựng niềm tin nguồn gốc vượt trội.',
      'Cần thiết kế phiên bản ít đường (dưới 3g/100ml) để đáp ứng trọn vẹn thị hiếu của người ăn kiêng.',
    ],
    tags: ['Sữa hạt sen', 'OCOP chế biến sâu', 'Dinh dưỡng thực vật', 'Bản địa'],
  },
  {
    id: 'diaper-westendorp',
    demoId: 'DEMO-VAN-WESTENDORP',
    category: 'lifestyle',
    categoryLabel: 'Mẹ & Bé · Đồ Dùng Trẻ Em',
    modelType: 'van_westendorp',
    modelLabel: 'Van Westendorp PSM',
    productName: 'Báo Cáo Ngưỡng Tâm Lý Giá Van Westendorp: Dòng Tã Bỉm Hữu Cơ Sợi Tre Tự Nhiên',
    companyName: 'Khảo Sát Chuẩn Ngành Mẹ & Bé · Ban Khảo Sát Chi Tiêu Gia Đình Trẻ 2026',
    sampleSize: 'N = 1.000 Personas · Mẹ bỉm sữa đô thị (Con 0-2 tuổi)',
    scoreOrVerdict: 'ĐIỂM GIÁ: 320.000đ/BỊCH',
    scoreColor: 'text-sky-800 bg-sky-50 border-sky-300',
    summary: 'Định giá chính xác cho dòng bỉm organic cao cấp, cân bằng giữa tâm lý "chọn điều tốt nhất cho con" và ngân sách chi tiêu hàng tháng của gia đình trẻ.',
    findings: [
      'Điểm giá tối ưu hội tụ tại 320.000đ cho bịch 50 miếng (tương đương 6.400đ/miếng).',
      'Ngưỡng giá quá đắt bắt đầu từ 390.000đ - vượt quá ngưỡng này tỷ lệ chuyển đổi sụt giảm 78%.',
      'Định giá dưới 250.000đ khiến 46% bà mẹ hoài nghi về tỷ lệ sợi tre hữu cơ thật.',
    ],
    tags: ['Mẹ & Bé', 'Tã bỉm sợi tre', 'Tâm lý giá', 'Organic'],
  },
  {
    id: 'air-purifier-kano',
    demoId: 'DEMO-KANO',
    category: 'appliances',
    categoryLabel: 'Gia Dụng Thông Minh · Smart Home',
    modelType: 'kano',
    modelLabel: 'Kano Model',
    productName: 'Báo Cáo Cấu Hình Cốt Lõi Kano Model: Máy Lọc Không Khí & Khử Mùi Căn Hộ Đô Thị',
    companyName: 'Khảo Sát Chuẩn Ngành Smart Home · Ban Đánh Giá Thiết Bị Không Gian Sống 2026',
    sampleSize: 'N = 1.000 Personas · Cư dân chung cư Hà Nội & TP.HCM',
    scoreOrVerdict: 'PHÂN ĐỊNH TÍNH NĂNG R&D',
    scoreColor: 'text-purple-800 bg-purple-50 border-purple-300',
    summary: 'Khảo sát nhu cầu lọc bụi mịn PM2.5 cho căn hộ 45-75m2, xác định cấu hình tiêu chuẩn giúp máy đạt mức giá cạnh tranh nhất mà vẫn bán chạy.',
    findings: [
      'Màng lọc HEPA H13 và độ ồn dưới 28dB ở chế độ ngủ là 2 tính năng sống còn (Must-be).',
      'Cảm biến laser hiển thị chỉ số bụi mịn theo thời gian thực tạo cảm giác an tâm cao nhất (Performance).',
      'Tính năng ion âm và điều khiển giọng nói ít được sử dụng, có thể loại bỏ để giảm giá bán lẻ 15%.',
    ],
    tags: ['Máy lọc không khí', 'Kano Model', 'Chung cư', 'PM2.5'],
  },
  {
    id: 'fish-sauce-monadic',
    demoId: 'DEMO-MONADIC',
    category: 'nutrition',
    categoryLabel: 'Gia Vị Truyền Thống Di Sản',
    modelType: 'monadic',
    modelLabel: 'Monadic Test',
    productName: 'Báo Cáo Đo Lường Niềm Tin Ý Niệm: Nước Mắm Truyền Thống Đậm Đạm Tự Nhiên (45°N)',
    companyName: 'Khảo Sát Chuẩn Ngành Gia Vị · Ban Bảo Tồn & Phát Triển Nông Sản Di Sản 2026',
    sampleSize: 'N = 1.000 Personas · Người nấu ăn chính trong gia đình',
    scoreOrVerdict: 'NIỀM TIN THƯƠNG HIỆU: 88.5%',
    scoreColor: 'text-emerald-700 bg-emerald-50 border-emerald-300',
    summary: 'Đo lường mức độ tin cậy và sẵn sàng trả giá cao hơn cho nước mắm ủ chượp thùng gỗ tự nhiên cam kết 0% hương liệu nhân tạo.',
    findings: [
      'Cam kết "Chỉ cá cơm than và muối biển ủ ròng 18 tháng" nâng chỉ số tin cậy đạt 88.5%.',
      'Rào cản duy nhất: Mùi vị quá mặn so với nước mắm công nghiệp; giải pháp là chai xịt định lượng.',
      'Ý định chuyển đổi từ nước mắm công nghiệp sang nước mắm truyền thống tăng vọt khi có minh bạch hàm lượng đạm.',
    ],
    tags: ['Nước mắm truyền thống', 'Monadic Test', 'Ủ chượp tự nhiên', 'Thực phẩm sạch'],
  },
  {
    id: 'edtech-maxdiff',
    demoId: 'DEMO-MAXDIFF',
    category: 'lifestyle',
    categoryLabel: 'Giáo Dục · EdTech & Kỹ Năng Số',
    modelType: 'maxdiff',
    modelLabel: 'MaxDiff Scaling',
    productName: 'Báo Cáo Phân Cấp Nhu Cầu Đào Tạo MaxDiff: Khóa Học Kỹ Năng Số & Ứng Dụng AI Thực Chiến',
    companyName: 'Khảo Sát Chuẩn Ngành EdTech · Ban Đào Tạo & Phát Triển Nguồn Nhân Lực Số 2026',
    sampleSize: 'N = 1.000 Personas · Nhân viên văn phòng 24-38 tuổi',
    scoreOrVerdict: 'ƯU TIÊN GIÁ TRỊ THỰC CHIẾN',
    scoreColor: 'text-amber-800 bg-amber-50 border-amber-300',
    summary: 'Phân tích thứ tự ưu tiên của người đi làm khi chọn khóa học trực tuyến: Chứng chỉ, Học phí, Giảng viên hay Hướng dẫn dự án thực chiến.',
    findings: [
      'Yếu tố xếp vị trí số 1 tuyệt đối: "Thực hành trên bài toán kinh doanh thật và có template dùng được ngay".',
      'Chứng chỉ hoàn thành khóa học bị xếp ở nhóm ưu tiên thấp nhất (chỉ 12% coi là quan trọng).',
      'Hỗ trợ hỏi đáp 1-1 qua Zalo/Discord trong 30 ngày sau khóa học là thuộc tính thúc đẩy đăng ký mạnh mẽ nhất.',
    ],
    tags: ['EdTech', 'MaxDiff', 'Kỹ năng số', 'Thực chiến'],
  },
];

const CATEGORIES = [
  { id: 'all', label: 'Tất Cả (14)' },
  { id: 'fnb', label: 'F&B & Đồ Uống (3)' },
  { id: 'cosmetics', label: 'Mỹ Phẩm & Làm Đẹp (1)' },
  { id: 'confectionery', label: 'Bánh Kẹo & Quà Biếu (2)' },
  { id: 'nutrition', label: 'Dinh Dưỡng & Nông Sản (3)' },
  { id: 'appliances', label: 'Gia Dụng & Smart Home (2)' },
  { id: 'lifestyle', label: 'Dịch Vụ & Đời Sống (3)' },
];

export default function ThuVienPage() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCases = CASE_STUDIES.filter((c) => {
    const matchCat = activeCategory === 'all' || c.category === activeCategory;
    const matchSearch =
      searchTerm.trim() === '' ||
      c.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.modelLabel.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.tags.some((t) => t.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchCat && matchSearch;
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans pb-20">
      
      {/* ── Top Bar / Header ── */}
      <header className="bg-white/95 backdrop-blur-md border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Logo href="/" />

          <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-slate-600">
            <Link href="/" className="hover:text-slate-900 transition-colors">
              Trang Chủ
            </Link>
            <Link href="/thu-vien" className="text-amber-700 font-bold">
              Thư Viện Báo Cáo
            </Link>
            <Link href="/minh-bach-khoa-hoc" className="hover:text-slate-900 transition-colors">
              Minh Bạch Khoa Học
            </Link>
            <Link href="/bach-thu" className="hover:text-slate-900 transition-colors">
              Bạch Thư
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/tra-cuu"
              className="text-xs font-semibold text-slate-700 hover:text-slate-900 py-2 px-3 rounded-xl border border-slate-300 hover:bg-slate-100 transition-all"
            >
              Tra Cứu Báo Cáo
            </Link>
            <Link
              href="/wizard"
              className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold py-2 sm:py-2.5 px-3.5 sm:px-4.5 rounded-xl shadow-xs transition-all"
            >
              Khởi Tạo Khảo Sát &rarr;
            </Link>
          </div>
        </div>
      </header>

      {/* ── Hero Banner ── */}
      <section className="bg-[#0A192F] text-white pt-14 pb-16 px-4 sm:px-6 relative overflow-hidden border-b border-amber-500/20">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#D4AF37_1px,transparent_1px)] [background-size:16px_16px]" />
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider mb-4">
            🏛️ Executive Market Intelligence · Industry Benchmark 2026
          </div>
          
          <h1 className="font-serif text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight mb-4">
            Thư Viện Báo Cáo Chuẩn Đo Lường Ngành Hàng 2026
          </h1>
          
          <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed mb-4 font-light">
            Tổng hợp 14 bộ dữ liệu nghiên cứu thị trường thực nghiệm quy mô <strong>N = 1.000 Personas</strong> phân tầng chuẩn Niên giám Tổng cục Thống kê GSO, áp dụng nghiêm ngặt 9 mô hình khoa học quốc tế (Nielsen BASES, Van Westendorp, Kano, MaxDiff, Monadic...).
          </p>

          {/* Legal & Ethical Notice Banner */}
          <div className="p-3.5 bg-slate-900/90 border border-amber-500/30 rounded-xl text-left max-w-2xl mx-auto mb-6 flex items-start gap-3 shadow-lg">
            <span className="text-base shrink-0 mt-0.5">⚖️</span>
            <div className="text-[11.5px] text-slate-300 leading-relaxed">
              <strong className="text-amber-400 font-bold block mb-0.5">Chuẩn Đối Sánh Ngành & Cam Kết Đạo Đức Nghiên Cứu (ESOMAR / AAPOR):</strong>
              Tất cả các nghiên cứu trong thư viện là <strong>Báo Cáo Đối Sánh Vĩ Mô Ngành Hàng (Industry Benchmarks)</strong> được thực hiện khách quan phục vụ doanh nghiệp đo lường, đối chuẩn vị thế và hoạch định chiến lược kinh doanh. Nghiên cứu độc lập, tuyệt đối không xâm phạm hay tiết lộ dữ liệu bảo mật của bất kỳ doanh nghiệp thương mại cá biệt nào.
            </div>
          </div>

          {/* Quick Search */}
          <div className="max-w-xl mx-auto relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm kiếm theo ngành hàng hoặc mô hình (VD: Đồ uống, Cà phê, Định giá PSM, Bao bì A/B, Kano...)"
              className="w-full bg-white text-slate-900 placeholder:text-slate-400 text-xs sm:text-sm px-4 py-3.5 pl-10 rounded-xl shadow-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm">
              🔍
            </span>
          </div>
        </div>
      </section>

      {/* ── Category Tabs ── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 -mt-6 relative z-20">
        <div className="bg-white rounded-2xl p-2 shadow-md border border-slate-200 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                activeCategory === cat.id
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </section>

      {/* ── Case Studies Grid ── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-10">
        <div className="flex items-center justify-between mb-6">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Hiển thị {filteredCases.length} báo cáo chuẩn đối sánh ngành hàng
          </p>
          <span className="text-xs text-slate-400">
            Tuân thủ chuẩn nghiên cứu quốc tế ESOMAR & AAPOR
          </span>
        </div>

        {filteredCases.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
            <div className="text-4xl mb-3">🔍</div>
            <h3 className="font-serif text-lg font-bold text-slate-900">Không tìm thấy báo cáo phù hợp</h3>
            <p className="text-xs text-slate-500 mt-1">
              Thử tìm kiếm với từ khóa khác hoặc chọn xem "Tất Cả".
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredCases.map((c) => (
              <div
                key={c.id}
                className="bg-white border border-slate-200 hover:border-slate-300 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Top Badges */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                        {c.categoryLabel}
                      </span>
                      <span className="text-[9.5px] font-bold px-2 py-0.5 rounded-full bg-sky-50 text-sky-800 border border-sky-200">
                        Chuẩn Ngành 2026
                      </span>
                    </div>
                    <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded uppercase bg-amber-50 text-amber-800 border border-amber-200">
                      {c.modelLabel}
                    </span>
                  </div>

                  {/* Product Title & Company */}
                  <h3 className="font-serif font-bold text-lg text-slate-900 leading-snug mb-1">
                    {c.productName}
                  </h3>
                  <p className="text-xs text-slate-500 mb-4">
                    Hội đồng nghiên cứu đối sánh: <span className="font-semibold text-slate-700">{c.companyName}</span>
                  </p>

                  {/* Score / Verdict Badge */}
                  <div className="mb-4">
                    <div className={`inline-block px-3 py-1 rounded-lg border text-xs font-extrabold uppercase tracking-wide ${c.scoreColor}`}>
                      {c.scoreOrVerdict}
                    </div>
                    <span className="text-[11px] text-slate-400 block mt-1">
                      {c.sampleSize} · Cochran 95% (±3.10%)
                    </span>
                  </div>

                  {/* Summary */}
                  <p className="text-xs text-slate-600 leading-relaxed mb-4">
                    {c.summary}
                  </p>

                  {/* Key Findings List */}
                  <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-100 mb-4">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600 block mb-2">
                      ✦ Top 3 Phát Hiện Thị Trường
                    </span>
                    <ul className="space-y-1.5 text-xs text-slate-700">
                      {c.findings.map((f, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-amber-600 font-bold shrink-0 mt-0.5">•</span>
                          <span className="leading-relaxed">{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 mb-5">
                    {c.tags.map((t, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-medium"
                      >
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Card Actions */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                  <Link
                    href={`/results/${c.demoId}`}
                    className="flex-1 text-center bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold py-2.5 px-3 rounded-xl transition-all shadow-xs"
                  >
                    Xem Dashboard Tương Tác &rarr;
                  </Link>
                  <Link
                    href={`/results/${c.demoId}/print`}
                    target="_blank"
                    className="text-center bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold py-2.5 px-3 rounded-xl transition-all border border-slate-200"
                    title="Mở bản in A4 tiêu chuẩn 6 trang"
                  >
                    📄 Bản In A4
                  </Link>
                  <Link
                    href={`/wizard?model=${c.modelType}`}
                    className="text-center bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-bold py-2.5 px-3 rounded-xl transition-all border border-amber-200"
                    title="Khởi tạo khảo sát cho sản phẩm của bạn"
                  >
                    Khảo Sát Ngay
                  </Link>
                </div>

              </div>
            ))}
          </div>
        )}

      </section>

      {/* ── Bottom Call To Action ── */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 mt-16 text-center">
        <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 text-white rounded-3xl p-8 sm:p-12 shadow-xl border border-slate-700 relative overflow-hidden">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 text-xs font-bold uppercase tracking-wider mb-4 border border-amber-500/30">
            🎁 Tặng 100% Suất Khảo Sát Thẩm Định Đầu Tiên
          </div>
          
          <h2 className="font-serif text-2xl sm:text-3xl font-extrabold mb-3">
            Kiểm Chứng Thị Trường Cho Sản Phẩm Của Riêng Bạn
          </h2>
          
          <p className="text-slate-300 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed mb-6 font-light">
            Không cần chờ 4 tuần và chi hàng chục triệu đồng. Nhập mô tả sản phẩm của bạn để 1.000 tác tử AI phản hồi trung thực trong 60 giây. Áp dụng mã <strong>OFF100</strong> khi tạo khảo sát để trải nghiệm miễn phí.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/wizard"
              className="w-full sm:w-auto bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs sm:text-sm font-bold py-3 px-8 rounded-xl shadow-md transition-all"
            >
              Tạo Khảo Sát Miễn Phí (Mã: OFF100) &rarr;
            </Link>
            <Link
              href="/minh-bach-khoa-hoc"
              className="w-full sm:w-auto bg-slate-800 hover:bg-slate-700 text-white text-xs sm:text-sm font-semibold py-3 px-6 rounded-xl border border-slate-600 transition-all"
            >
              Tìm Hiểu Phương Pháp Luận
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
