'use client';

import { useState } from 'react';
import { api, formatVND, PRICING } from '@/lib/api';
import { useWizard } from '@/lib/wizard-context';
import { VIETNAM_STANDARD_INDUSTRIES } from '@/lib/vietnam-industries';

interface FieldConfig {
  id: string;
  label: string;
  placeholder: string;
  type?: string;
  required?: boolean;
  hint?: string;
}

const MODEL_GUIDANCE: Record<string, { purpose: string; badge: string; icon: string }> = {
  nielsen_bases: {
    icon: '💡',
    badge: 'NIELSEN BASES INNOVATION FRAMEWORK',
    purpose: 'Mục đích cốt lõi: Trả lời câu hỏi "Khách hàng có muốn mua sản phẩm mới này không? Ý tưởng này có khả năng sống sót ngoài thị trường không?"',
  },
  van_westendorp: {
    icon: '💰',
    badge: 'VAN WESTENDORP PRICE SENSITIVITY METER (PSM)',
    purpose: 'Mục đích cốt lõi: Trả lời câu hỏi "Bán giá bao nhiêu là chuẩn nhất? Khách hàng bắt đầu chê đắt ở mức nào và nghi ngờ chất lượng ở mức nào?"',
  },
  ab_testing: {
    icon: '🎨',
    badge: 'KANTAR LINK PRE-TESTING FRAMEWORK',
    purpose: 'Mục đích cốt lõi: Trả lời câu hỏi "Giữa 2 mẫu bao bì, 2 câu slogan hoặc 2 concept sản phẩm thì phương án nào có tỷ lệ chuyển đổi cao hơn?"',
  },
  ua_study: {
    icon: '🔍',
    badge: 'USAGE & ATTITUDE (U&A) STUDY',
    purpose: 'Mục đích cốt lõi: Trả lời câu hỏi "Khách hàng đang dùng những sản phẩm gì trong ngành hàng này? Họ mua ở đâu, dùng khi nào và đang bức xúc điều gì chưa được giải quyết?"',
  },
  deal_elasticity: {
    icon: '🎁',
    badge: 'PROMO ELASTICITY & THRESHOLD ANALYSIS',
    purpose: 'Mục đích cốt lõi: Trả lời câu hỏi "Nên tung chương trình khuyến mãi nào để bùng nổ doanh số mà không bị lỗ và không làm mất giá trị thương hiệu?"',
  },
  monadic: {
    icon: '🧪',
    badge: 'MONADIC TESTING SPLIT-SAMPLE FRAMEWORK',
    purpose: 'Mục đích cốt lõi: Trả lời câu hỏi "Khi người tiêu dùng chỉ nhìn thấy 1 phương án duy nhất trong điều kiện độc lập, phương án nào thực sự kích hoạt ý định mua thử cao hơn?"',
  },
  maxdiff: {
    icon: '⚡',
    badge: 'MAXDIFF BEST-WORST SCALING MODEL',
    purpose: 'Mục đích cốt lõi: Trả lời câu hỏi "Trong danh sách 6-10 tính năng/thông điệp, yếu tố nào là động lực mua hàng bắt buộc phải có và yếu tố nào khách hàng hoàn toàn thờ ơ?"',
  },
  kano: {
    icon: '🎯',
    badge: 'KANO MODEL PRODUCT ROADMAP PRIORITIZATION',
    purpose: 'Mục đích cốt lõi: Trả lời câu hỏi "Đội ngũ R&D nên ưu tiên đầu tư vào tính năng nào để vừa chống mất khách vừa tạo sự đột phá hài lòng cao nhất?"',
  },
  brand_map: {
    icon: '🗺️',
    badge: 'BRAND PERCEPTUAL MAPPING & WHITE-SPACE DISCOVERY',
    purpose: 'Mục đích cốt lõi: Trả lời câu hỏi "Thương hiệu của bạn đang đứng ở đâu so với đối thủ trong tâm trí khách hàng và đâu là khoảng trống thị trường (đại dương xanh) chưa ai chiếm giữ?"',
  },
};

const FIELDS_MAP: Record<string, FieldConfig[]> = {
  nielsen_bases: [
    {
      id: 'company_name',
      label: 'Tên Doanh nghiệp / Khách hàng yêu cầu khảo sát',
      placeholder: 'VD: Tập đoàn Tiêu dùng & Thực phẩm Sạch Á Châu (Asia Food Corp)',
      required: true,
      hint: 'Thông tin này sẽ được in trang trọng lên tiêu đề và trang bìa báo cáo chiến lược Executive Summary.',
    },
    {
      id: 'product_name',
      label: 'Tên sản phẩm / Ý tưởng kiểm định',
      placeholder: 'VD: Trà Kombucha Lên Men Xoài Cát Chu Tự Nhiên (330ml)',
      required: true,
    },
    {
      id: 'category',
      label: 'Danh mục ngành hàng (Tiêu chuẩn Việt Nam)',
      placeholder: 'Chọn ngành nghề từ danh mục chuẩn hóa',
      required: true,
    },
    {
      id: 'description',
      label: 'Bản mô tả chi tiết ý tưởng (Concept)',
      placeholder: 'Mô tả điểm khác biệt độc nhất (USP), thành phần/công nghệ, lợi ích mang lại và nhóm đối tượng...',
      required: true,
      type: 'textarea',
      hint: 'Mô tả càng chi tiết và trung thực, hệ thống AI Persona phản hồi càng chính xác và giá trị.',
    },
    {
      id: 'expected_price',
      label: 'Mức giá dự kiến đưa ra thị trường',
      placeholder: 'VD: 32.000đ / lon hoặc 180.000đ / lốc 6 lon',
      required: true,
    },
    {
      id: 'concept_image_note',
      label: 'Ghi chú bao bì / Link ảnh concept (Tùy chọn)',
      placeholder: 'VD: https://... hoặc Mô tả lon nhôm tối giản, phong cách healthy sang trọng',
      required: false,
    },
  ],
  van_westendorp: [
    {
      id: 'company_name',
      label: 'Tên Doanh nghiệp / Đơn vị yêu cầu khảo sát',
      placeholder: 'VD: Trung tâm Anh ngữ Quốc tế Elite Academy',
      required: true,
      hint: 'Thông tin này sẽ được in trang trọng lên tiêu đề và trang bìa báo cáo chiến lược Executive Summary.',
    },
    {
      id: 'product_name',
      label: 'Tên sản phẩm / Gói dịch vụ cần định giá',
      placeholder: 'VD: Khóa học Tiếng Anh Giao Tiếp 1-kèm-1 qua AI (3 tháng)',
      required: true,
    },
    {
      id: 'category',
      label: 'Danh mục sản phẩm / Dịch vụ',
      placeholder: 'Chọn ngành nghề từ danh mục chuẩn hóa',
      required: true,
    },
    {
      id: 'description',
      label: 'Bản mô tả sản phẩm và giá trị mang lại',
      placeholder: 'Liệt kê các tính năng, quyền lợi cốt lõi, giá trị giải quyết cho khách hàng...',
      required: true,
      type: 'textarea',
      hint: '🔴 NGUYÊN TẮC KINH TẾ HỌC: Tuyệt đối KHÔNG đưa trước giá bán vào đây để tránh mỏ neo tâm lý (Anchoring Effect).',
    },
    {
      id: 'price_range_min',
      label: 'Khoảng giá sàn tham chiếu (VND)',
      placeholder: 'VD: 500000',
      type: 'number',
      required: true,
      hint: 'Hệ thống dùng giá sàn để định vị phổ phân khúc thị trường.',
    },
    {
      id: 'price_range_max',
      label: 'Khoảng giá trần tham chiếu (VND)',
      placeholder: 'VD: 2500000',
      type: 'number',
      required: true,
      hint: 'Hệ thống dùng giá trần để vẽ đồ thị 4 đường cong Van Westendorp.',
    },
  ],
  ab_testing: [
    {
      id: 'company_name',
      label: 'Tên Doanh nghiệp / Thương hiệu yêu cầu khảo sát',
      placeholder: 'VD: Công ty Cổ phần Sữa Việt Nam (Vinamilk)',
      required: true,
      hint: 'Thông tin này sẽ được in trang trọng lên tiêu đề và trang bìa báo cáo chiến lược Executive Summary.',
    },
    {
      id: 'category',
      label: 'Danh mục ngành hàng',
      placeholder: 'Chọn ngành nghề từ danh mục chuẩn hóa',
      required: true,
    },
    {
      id: 'brand_name',
      label: 'Dòng sản phẩm / Thương hiệu thử nghiệm',
      placeholder: 'VD: Sữa Chua Uống Men Sống Probi',
      required: true,
    },
    {
      id: 'test_objective',
      label: 'Bối cảnh so sánh & Kênh bán mục tiêu',
      placeholder: 'VD: So sánh 2 concept bao bì Tết tại quầy kệ siêu thị: nhắm tới nhóm khách hàng gia đình thành thị',
      required: true,
      hint: 'Giúp thiết lập bối cảnh kích thích hành vi chọn mua của Personas.',
    },
    {
      id: 'option_a_description',
      label: 'Bản mô tả Phương án A (Hình ảnh / Bao bì / Slogan A)',
      placeholder: 'Mô tả chi tiết Concept A: Tông màu chủ đạo, hình ảnh nhận diện, thông điệp truyền thông USP...',
      required: true,
      type: 'textarea',
    },
    {
      id: 'option_b_description',
      label: 'Bản mô tả Phương án B (Hình ảnh / Bao bì / Slogan B)',
      placeholder: 'Mô tả chi tiết Concept B: Tông màu chủ đạo, hình ảnh nhận diện, thông điệp truyền thông USP...',
      required: true,
      type: 'textarea',
    },
  ],
  ua_study: [
    {
      id: 'company_name',
      label: 'Tên Doanh nghiệp / Đơn vị yêu cầu khảo sát',
      placeholder: 'VD: Be Group / Grab Vietnam / VinFast',
      required: true,
      hint: 'Thông tin này sẽ được in trang trọng lên tiêu đề và trang bìa báo cáo chiến lược Executive Summary.',
    },
    {
      id: 'industry',
      label: 'Ngành hàng cần nghiên cứu (Category)',
      placeholder: 'Chọn ngành nghề từ danh mục chuẩn hóa',
      required: true,
    },
    {
      id: 'target_audience',
      label: 'Đối tượng khách hàng mục tiêu muốn thấu hiểu',
      placeholder: 'VD: Giới trẻ công sở 22 - 35 tuổi tại Hà Nội và TP.HCM, thu nhập 10-25 triệu/tháng',
      required: true,
    },
    {
      id: 'key_competitors',
      label: 'Các đối thủ cạnh tranh chính trên thị trường',
      placeholder: 'VD: Nhãn hiệu đóng chai A, Chuỗi đồ uống B, Thương hiệu di sản C...',
      required: true,
    },
    {
      id: 'research_focus',
      label: 'Nỗi đau hoặc câu hỏi trọng tâm muốn khai phá',
      placeholder: 'VD: Tần suất dùng, dịp sử dụng (buổi sáng/chiều), kênh mua (tiện lợi/sàn TMĐT), nỗi đau chưa được giải quyết...',
      required: true,
      type: 'textarea',
    },
  ],
  deal_elasticity: [
    {
      id: 'company_name',
      label: 'Tên Doanh nghiệp / Thương hiệu yêu cầu khảo sát',
      placeholder: 'VD: Tập đoàn Thực phẩm & Bánh kẹo Crown Đô (CrownDo Group)',
      required: true,
      hint: 'Thông tin này sẽ được in trang trọng lên tiêu đề và trang bìa báo cáo chiến lược Executive Summary.',
    },
    {
      id: 'category',
      label: 'Danh mục ngành hàng',
      placeholder: 'Chọn ngành nghề từ danh mục chuẩn hóa',
      required: true,
    },
    {
      id: 'deal_name',
      label: 'Tên sản phẩm / Gói ưu đãi',
      placeholder: 'VD: Hộp Bánh Tết Đoàn Viên Thượng Hạng',
      required: true,
    },
    {
      id: 'original_price',
      label: 'Mức giá gốc niêm yết ban đầu (VND)',
      placeholder: 'VD: 450000',
      type: 'number',
      required: true,
      hint: 'Mức giá chuẩn để tính toán độ co giãn và tỷ lệ Volume Lift.',
    },
    {
      id: 'discounted_price',
      label: 'Mức giá bán dự kiến sau ưu đãi (VND)',
      placeholder: 'VD: 360000',
      type: 'number',
      required: true,
      hint: 'Mức giá sau chiết khấu hoặc sau áp dụng quà tặng.',
    },
    {
      id: 'deal_description',
      label: 'Các kịch bản khuyến mãi muốn đo lường',
      placeholder: 'VD: Kịch bản 1: Giảm thẳng 15%; Kịch bản 2: Mua 2 tặng 1; Kịch bản 3: Tặng bình trà cao cấp...',
      required: true,
      type: 'textarea',
      hint: 'Liệt kê 2-3 kịch bản ưu đãi để cụm AI đo lường độ co giãn và so sánh sức bật chuyển đổi.',
    },
  ],
  monadic: [
    {
      id: 'company_name',
      label: 'Tên Doanh nghiệp / Đơn vị yêu cầu khảo sát',
      placeholder: 'VD: Tập đoàn Đồ uống & Thực phẩm Sạch Á Châu',
      required: true,
      hint: 'Thông tin này sẽ được in trang trọng lên tiêu đề và trang bìa báo cáo chiến lược Executive Summary.',
    },
    {
      id: 'category',
      label: 'Danh mục ngành hàng',
      placeholder: 'Chọn ngành nghề từ danh mục chuẩn hóa',
      required: true,
    },
    {
      id: 'concept_a_title',
      label: 'Tên Phương án A (Concept A)',
      placeholder: 'VD: Trà Kombucha Tự Nhiên (Bao bì Truyền thống)',
      required: true,
    },
    {
      id: 'concept_a_price',
      label: 'Mức giá dự kiến Concept A',
      placeholder: 'VD: 35.000đ / chai',
      required: true,
    },
    {
      id: 'concept_a_description',
      label: 'Mô tả chi tiết Concept A',
      placeholder: 'Mô tả giá trị cốt lõi, thành phần và thông điệp của Concept A...',
      required: true,
      type: 'textarea',
      hint: 'Nhánh tác tử AI phân vai nhóm A sẽ chỉ nhìn thấy duy nhất Concept A này.',
    },
    {
      id: 'concept_b_title',
      label: 'Tên Phương án B (Concept B)',
      placeholder: 'VD: Trà Kombucha Năng Lượng Đột Phá (Bao bì Lon Nhôm Thể Thao)',
      required: true,
    },
    {
      id: 'concept_b_price',
      label: 'Mức giá dự kiến Concept B',
      placeholder: 'VD: 39.000đ / lon',
      required: true,
    },
    {
      id: 'concept_b_description',
      label: 'Mô tả chi tiết Concept B',
      placeholder: 'Mô tả giá trị cốt lõi, thành phần và thông điệp của Concept B...',
      required: true,
      type: 'textarea',
      hint: 'Nhánh tác tử AI phân vai nhóm B sẽ chỉ nhìn thấy duy nhất Concept B này (không biết Concept A).',
    },
  ],
  maxdiff: [
    {
      id: 'company_name',
      label: 'Tên Doanh nghiệp / Thương hiệu yêu cầu khảo sát',
      placeholder: 'VD: Công ty Công nghệ Tiêu dùng TechLife',
      required: true,
      hint: 'Thông tin này sẽ được in trang trọng lên tiêu đề và trang bìa báo cáo chiến lược Executive Summary.',
    },
    {
      id: 'product_name',
      label: 'Tên sản phẩm / Chiến dịch thông điệp',
      placeholder: 'VD: Bộ giải pháp Chăm sóc Sức khỏe Cá nhân AI Health',
      required: true,
    },
    {
      id: 'category',
      label: 'Danh mục sản phẩm / Ngành hàng',
      placeholder: 'Chọn ngành nghề từ danh mục chuẩn hóa',
      required: true,
    },
    {
      id: 'attributes',
      label: 'Danh sách 6 đến 10 tính năng hoặc thông điệp bán hàng (Claims)',
      placeholder: `Nhập mỗi thuộc tính trên một dòng mới:
VD:
100% Nguyên liệu hữu cơ đạt chuẩn USDA
Hiệu quả rõ rệt ngay sau 7 ngày sử dụng
Mức giá hợp lý, tiết kiệm 30% chi phí hàng tháng
Bao bì sinh học tự phân hủy thân thiện môi trường
Dịch vụ chăm sóc và bảo hành 1-đổi-1 trong 12 tháng
Thiết kế tối giản, sang trọng phong cách Bắc Âu`,
      required: true,
      type: 'textarea',
      hint: 'Hệ thống sẽ tự động tạo các nhóm 4 thuộc tính ngẫu nhiên xoay vòng để personas chọn Best và Worst.',
    },
  ],
  kano: [
    {
      id: 'company_name',
      label: 'Tên Doanh nghiệp / Đơn vị phát triển R&D',
      placeholder: 'VD: Công ty Phần mềm & Nền tảng SaaS Việt Nam',
      required: true,
      hint: 'Thông tin này sẽ được in trang trọng lên tiêu đề và trang bìa báo cáo chiến lược Executive Summary.',
    },
    {
      id: 'product_name',
      label: 'Tên sản phẩm / Dự án R&D',
      placeholder: 'VD: Nền tảng Quản trị Bán hàng Đa kênh OmniHub 3.0',
      required: true,
    },
    {
      id: 'category',
      label: 'Ngành hàng / Lĩnh vực',
      placeholder: 'Chọn ngành nghề từ danh mục chuẩn hóa',
      required: true,
    },
    {
      id: 'features',
      label: 'Danh sách 3 đến 5 tính năng dự kiến phát triển',
      placeholder: `Nhập mỗi tính năng trên một dòng mới:
VD:
Tự động đồng bộ tồn kho thời gian thực với Shopee & TikTok
Trợ lý AI tự động trả lời tin nhắn và chốt đơn khách hàng
Báo cáo phân tích dòng tiền và dự báo doanh thu tự động
Tùy biến giao diện hóa đơn và thương hiệu riêng`,
      required: true,
      type: 'textarea',
      hint: 'Với mỗi tính năng, hệ thống sẽ hỏi persona 2 câu hỏi đối lập: khi CÓ và khi KHÔNG CÓ tính năng.',
    },
  ],
  brand_map: [
    {
      id: 'company_name',
      label: 'Tên Doanh nghiệp / Tổ chức yêu cầu khảo sát',
      placeholder: 'VD: Tập đoàn Thời trang & Bán lẻ Việt Nam',
      required: true,
      hint: 'Thông tin này sẽ được in trang trọng lên tiêu đề và trang bìa báo cáo chiến lược Executive Summary.',
    },
    {
      id: 'category',
      label: 'Ngành hàng / Lĩnh vực hoạt động',
      placeholder: 'Chọn ngành nghề từ danh mục chuẩn hóa',
      required: true,
    },
    {
      id: 'brand_name',
      label: 'Tên thương hiệu của bạn',
      placeholder: 'VD: Thương hiệu Thời trang EcoSmart',
      required: true,
    },
    {
      id: 'brands',
      label: 'Danh sách các thương hiệu đối thủ cùng ngành cần so chuẩn',
      placeholder: `Nhập mỗi đối thủ trên một dòng mới:
VD:
Thương hiệu đối thủ A (Truyền thống dẫn đầu)
Thương hiệu đối thủ B (Ngoại nhập cao cấp)
Thương hiệu đối thủ C (Chuỗi giá rẻ bình dân)`,
      required: true,
      type: 'textarea',
      hint: 'Nhập từ 2 đến 4 đối thủ trực tiếp để hệ thống chấm điểm và định vị trên bản đồ 2D.',
    },
    {
      id: 'axis_x_label',
      label: 'Tên tiêu chí Trục X (Mặc định: Phân khúc Giá)',
      placeholder: 'VD: Mức giá (1: Siêu bình dân ↔ 10: Siêu cao cấp)',
      required: false,
    },
    {
      id: 'axis_y_label',
      label: 'Tên tiêu chí Trục Y (Mặc định: Đổi mới sáng tạo)',
      placeholder: 'VD: Độ đột phá công nghệ (1: Truyền thống ↔ 10: Đột phá)',
      required: false,
    },
  ],
};

/* ── Component: Vietnam Standard Industry Dropdown ── */
function IndustrySelect({
  value,
  onChange,
  required,
}: {
  value: string;
  onChange: (val: string) => void;
  required?: boolean;
}) {
  const isCustom = Boolean(value && !VIETNAM_STANDARD_INDUSTRIES.some((ind) => ind.name === value));
  const [showCustomInput, setShowCustomInput] = useState(isCustom);
  const [customText, setCustomText] = useState(isCustom ? value : '');

  const selectedIndustry = VIETNAM_STANDARD_INDUSTRIES.find((ind) => ind.name === value);

  return (
    <div className="space-y-2">
      <div className="relative">
        <select
          value={showCustomInput ? '__custom__' : value || ''}
          onChange={(e) => {
            const v = e.target.value;
            if (v === '__custom__') {
              setShowCustomInput(true);
              onChange(customText || '');
            } else {
              setShowCustomInput(false);
              onChange(v);
            }
          }}
          className="w-full bg-white border border-slate-300 rounded-lg py-2.5 px-3.5 text-slate-900 text-sm focus:ring-2 focus:ring-slate-900 focus:border-slate-900 transition-all cursor-pointer font-medium"
        >
          <option value="">-- Chọn ngành hàng theo tiêu chuẩn Việt Nam --</option>
          {VIETNAM_STANDARD_INDUSTRIES.map((ind) => (
            <option key={ind.id} value={ind.name}>
              {ind.icon} {ind.name}
            </option>
          ))}
          <option value="__custom__">✏️ Ngành hàng khác (Tự nhập tên ngành cụ thể)...</option>
        </select>
      </div>

      {showCustomInput && (
        <div className="animate-in fade-in duration-150">
          <input
            type="text"
            required={required}
            value={customText}
            onChange={(e) => {
              setCustomText(e.target.value);
              onChange(e.target.value);
            }}
            placeholder="Nhập cụ thể tên ngành hàng / lĩnh vực của bạn..."
            className="w-full bg-white border border-amber-300 rounded-lg py-2.5 px-3.5 text-slate-900 text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all placeholder:text-slate-400"
          />
        </div>
      )}

      {selectedIndustry && !showCustomInput && (
        <div className="p-2.5 rounded-lg bg-amber-50/70 border border-amber-200/80 text-[11px] text-amber-900 flex items-center gap-2">
          <span className="font-bold shrink-0">Nhóm: {selectedIndustry.sectorGroup}</span>
          <span className="text-slate-400">·</span>
          <span className="text-slate-600 truncate">{selectedIndustry.examples}</span>
        </div>
      )}
    </div>
  );
}

/* ── Component: Image Upload Dropzone ── */
function ImageUploader({
  label,
  hint,
  currentUrl,
  slot,
  onUploadSuccess,
  onRemove,
}: {
  label: string;
  hint?: string;
  currentUrl?: string;
  slot: string;
  onUploadSuccess: (url: string) => void;
  onRemove: () => void;
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Vui lòng chọn đúng định dạng file hình ảnh (JPG, PNG, WebP).');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError('Kích thước ảnh tối đa là 10MB.');
      return;
    }

    setError('');
    setUploading(true);
    try {
      const res = await api.uploadImage(file, slot);
      onUploadSuccess(res.image_url);
    } catch (err: any) {
      setError(err.message || 'Lỗi khi tải ảnh lên máy chủ. Vui lòng thử lại.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-2 p-4 rounded-xl border border-slate-200 bg-slate-50/60">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
          <span>🖼️</span>
          <span>{label}</span>
        </label>
        {hint && <span className="text-[11px] text-slate-500 font-medium">{hint}</span>}
      </div>

      {currentUrl ? (
        <div className="flex items-center gap-3 bg-white p-3 rounded-lg border border-slate-200 shadow-2xs">
          <img
            src={currentUrl}
            alt={label}
            className="w-16 h-16 object-cover rounded-lg border border-slate-200 shrink-0 bg-slate-100"
          />
          <div className="flex-1 min-w-0">
            <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1">
              <span>✓</span>
              <span>Đã tải ảnh lên máy chủ thành công</span>
            </span>
            <p className="text-[11px] text-slate-400 truncate mt-0.5 font-mono">
              {currentUrl}
            </p>
          </div>
          <button
            type="button"
            onClick={onRemove}
            className="text-xs text-red-600 hover:text-red-800 font-semibold px-2.5 py-1.5 rounded-md hover:bg-red-50 border border-transparent hover:border-red-200 transition-colors shrink-0"
          >
            Xóa ảnh
          </button>
        </div>
      ) : (
        <div>
          <label className="flex flex-col items-center justify-center p-5 border-2 border-dashed border-slate-300 hover:border-amber-500 rounded-xl bg-white hover:bg-amber-50/20 transition-all cursor-pointer text-center group">
            {uploading ? (
              <div className="flex flex-col items-center gap-2 py-2">
                <div className="w-6 h-6 border-2 border-amber-600 border-t-transparent rounded-full animate-spin" />
                <span className="text-xs font-semibold text-slate-700">
                  Đang tải ảnh lên đám mây bảo mật...
                </span>
              </div>
            ) : (
              <>
                <div className="w-9 h-9 rounded-full bg-slate-100 group-hover:bg-amber-100 text-slate-600 group-hover:text-amber-800 flex items-center justify-center mb-2 transition-colors">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <span className="text-xs font-bold text-slate-800 group-hover:text-amber-800">
                  Nhấn để tải ảnh hoặc kéo thả file vào đây
                </span>
                <span className="text-[11px] text-slate-400 mt-0.5">
                  Định dạng PNG, JPG, WebP · Dung lượng tối đa 10MB
                </span>
              </>
            )}
            <input
              type="file"
              accept="image/*"
              disabled={uploading}
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
          {error && <p className="text-xs text-red-600 mt-1.5 font-medium">⚠️ {error}</p>}
        </div>
      )}
    </div>
  );
}

/* ── Component: Historical Survey Dataset Uploader (CSV / Excel) ── */
function DatasetUploader({
  dataset,
  onUploadSuccess,
  onRemove,
}: {
  dataset: any;
  onUploadSuccess: (data: any) => void;
  onRemove: () => void;
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const ext = file.name.split('.').pop()?.toLowerCase();
    if (!['csv', 'xlsx', 'xls'].includes(ext || '')) {
      setError('Vui lòng chọn file dữ liệu định dạng .CSV hoặc .XLSX / .XLS.');
      return;
    }
    if (file.size > 15 * 1024 * 1024) {
      setError('Dung lượng file tối đa là 15MB.');
      return;
    }

    setError('');
    setUploading(true);
    try {
      const res = await api.uploadHistoricalDataset(file);
      onUploadSuccess(res);
    } catch (err: any) {
      setError(err.message || 'Lỗi khi phân tích file khảo sát cũ. Vui lòng kiểm tra lại định dạng.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-3 p-4 sm:p-5 rounded-xl border border-amber-300/80 bg-gradient-to-r from-amber-50/70 via-white to-amber-50/50 shadow-2xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
          <span>🧠</span>
          <span>Huấn Luyện Nâng Cao Theo Khảo Sát Quá Khứ (Tùy chọn)</span>
          <span className="text-[10px] font-mono font-bold bg-amber-500 text-slate-950 px-1.5 py-0.2 rounded">Tăng 3x độ sát thực</span>
        </label>
        <span className="text-[11px] text-amber-800 font-medium">Hỗ trợ file .CSV, .XLSX, .XLS (Tối đa 15MB)</span>
      </div>

      <p className="text-xs text-slate-600 leading-relaxed">
        Tải lên file khảo sát cũ hoặc kết quả phỏng vấn trước đây trong ngành hàng của bạn. AI sẽ phân tích dữ liệu thực tế, học các rào cản và trích xuất phong cách phản hồi để 1.000 tác tử AI trả lời chuẩn sát với thực chiến ngành hàng nhất.
      </p>

      {dataset ? (
        <div className="bg-white p-4 rounded-xl border border-emerald-300 shadow-2xs space-y-2.5 animate-in fade-in duration-200">
          <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-2">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center text-sm font-bold">
                ✓
              </span>
              <div>
                <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <span>{dataset.filename}</span>
                  <span className="text-[10px] font-mono bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded font-semibold">
                    ĐÃ NẠP THÀNH CÔNG
                  </span>
                </span>
                <p className="text-[11px] text-slate-500 font-mono mt-0.5">
                  Phát hiện {dataset.total_rows?.toLocaleString('vi-VN')} dòng phản hồi thực tế · {dataset.columns?.length || 0} cột dữ liệu
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onRemove}
              className="text-xs text-red-600 hover:text-red-800 font-semibold px-2.5 py-1 rounded-md hover:bg-red-50 border border-transparent hover:border-red-200 transition-colors"
            >
              Hủy bỏ file này
            </button>
          </div>

          {dataset.extracted_snippets && dataset.extracted_snippets.length > 0 && (
            <div className="pt-1">
              <span className="text-[11px] font-semibold text-slate-700 block mb-1">
                💬 Một số mẫu phản hồi tiêu biểu AI đã trích xuất để học phong cách ngành:
              </span>
              <div className="space-y-1">
                {dataset.extracted_snippets.slice(0, 2).map((snip: string, i: number) => (
                  <div key={i} className="text-[11px] text-slate-600 italic bg-slate-50 p-2 rounded border border-slate-200">
                    "{snip}"
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div>
          <label className="flex flex-col items-center justify-center p-5 border-2 border-dashed border-amber-300 hover:border-amber-600 rounded-xl bg-white hover:bg-amber-50/30 transition-all cursor-pointer text-center group">
            {uploading ? (
              <div className="flex flex-col items-center gap-2 py-2">
                <div className="w-6 h-6 border-2 border-amber-600 border-t-transparent rounded-full animate-spin" />
                <span className="text-xs font-bold text-slate-800">
                  Đang phân tích cấu trúc cột và học phong cách phản hồi từ file...
                </span>
                <span className="text-[11px] text-slate-500">Vui lòng đợi vài giây</span>
              </div>
            ) : (
              <>
                <div className="w-10 h-10 rounded-full bg-amber-100 group-hover:bg-amber-200 text-amber-800 flex items-center justify-center mb-2 transition-colors">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <span className="text-xs font-bold text-slate-800 group-hover:text-amber-900">
                  Nhấn để tải lên file khảo sát cũ (.CSV, .XLSX, .XLS)
                </span>
                <span className="text-[11px] text-slate-400 mt-0.5">
                  Tối đa 15MB · Tự động đọc và học phong cách ngành hàng
                </span>
              </>
            )}
            <input
              type="file"
              accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
              disabled={uploading}
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
          {error && <p className="text-xs text-red-600 mt-1.5 font-medium">⚠️ {error}</p>}
        </div>
      )}
    </div>
  );
}

export default function Step3ProductInfo() {
  const { state, updateProductInfo, updatePayment, setStep } = useWizard();
  const [formData, setFormData] = useState<Record<string, string>>(state.productInfo);
  const [historicalDataset, setHistoricalDataset] = useState<any>(
    (state.productInfo as any)?.historical_dataset || null
  );
  const [email, setEmail] = useState(state.customerEmail || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const currentModelKey = state.selectedModel || 'nielsen_bases';
  const fields = FIELDS_MAP[currentModelKey] || FIELDS_MAP.nielsen_bases;
  const currentPrice = PRICING[state.sampleSize] || 300_000;

  const handleChange = (id: string, val: string) => {
    setFormData((prev) => ({ ...prev, [id]: val }));
  };

  const handleImageUpload = (slot: string, url: string) => {
    if (slot === 'A') {
      setFormData((prev) => ({ ...prev, option_a_image_url: url }));
    } else if (slot === 'B') {
      setFormData((prev) => ({ ...prev, option_b_image_url: url }));
    } else {
      setFormData((prev) => ({ ...prev, concept_image_url: url }));
    }
  };

  const handleRemoveImage = (slot: string) => {
    if (slot === 'A') {
      setFormData((prev) => {
        const next = { ...prev };
        delete next.option_a_image_url;
        return next;
      });
    } else if (slot === 'B') {
      setFormData((prev) => {
        const next = { ...prev };
        delete next.option_b_image_url;
        return next;
      });
    } else {
      setFormData((prev) => {
        const next = { ...prev };
        delete next.concept_image_url;
        return next;
      });
    }
  };

  const handleSubmit = async () => {
    setError('');

    // Validation
    const missing = fields.filter((f) => f.required && !formData[f.id]?.trim());
    if (missing.length > 0) {
      setError(`Vui lòng nhập đầy đủ: ${missing.map((f) => f.label).join(', ')}`);
      return;
    }

    if (!email.trim() || !email.includes('@')) {
      setError('Vui lòng nhập địa chỉ email hợp lệ để nhận bản báo cáo chiến lược PDF A4.');
      return;
    }

    setLoading(true);
    try {
      const finalProductInfo = {
        ...formData,
        ...(historicalDataset ? { historical_dataset: historicalDataset } : {}),
      };

      updateProductInfo(finalProductInfo, email);

      const result = await api.createSurvey({
        model_type: state.selectedModel || 'nielsen_bases',
        region: state.region,
        zone: state.zone,
        min_age: state.minAge,
        max_age: state.maxAge,
        target_gender: state.targetGender || 'all',
        target_income: state.targetIncome || 'all',
        target_marital_status: state.targetMaritalStatus || 'all',
        target_occupation: state.targetOccupation || 'all',
        target_zone: state.targetZone || 'all',
        sample_size: state.sampleSize,
        product_info: finalProductInfo,
        customer_email: email.trim(),
      });

      updatePayment(result.survey_id, result.price_amount, result.qr_data, {
        originalPrice: result.original_price ?? result.price_amount,
        discountCode: result.discount_code,
        discountAmount: result.discount_amount,
        isFree: result.is_free,
      });
      setStep(4);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Có lỗi xảy ra khi tạo khảo sát. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold mb-3">
          <span>✦ BƯỚC 03 / 04</span>
        </div>
        <h2 className="font-serif text-3xl font-bold text-slate-900 tracking-tight">
          Thông tin sản phẩm & Khảo sát
        </h2>
        <p className="text-slate-600 text-sm mt-2 max-w-xl mx-auto">
          Cung cấp dữ kiện sản phẩm để cụm tác tử AI nạp bối cảnh và phân vai mô phỏng phản ứng thị trường.
        </p>
      </div>

      {/* Summary Tag */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mb-6 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <span className="font-bold text-slate-900">Phương pháp:</span>
          <span className="bg-white px-2.5 py-1 rounded-md border border-slate-200 text-slate-800 font-medium">
            {state.modelName || 'Kiểm định Ý tưởng Sản phẩm (BASES)'}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-bold text-slate-900">Mẫu:</span>
          <span className="bg-white px-2.5 py-1 rounded-md border border-slate-200 text-slate-800 font-medium">
            N = {state.sampleSize.toLocaleString('vi-VN')} ({state.region})
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-bold text-slate-900">Kinh phí:</span>
          <span className="bg-amber-100 text-amber-900 px-2.5 py-1 rounded-md font-bold">
            {formatVND(currentPrice)}
          </span>
        </div>
      </div>

      {/* Model-Specific Methodology Guidance Card */}
      {MODEL_GUIDANCE[currentModelKey] && (
        <div className="mb-6 p-4 rounded-xl bg-gradient-to-r from-slate-900 to-[#0A192F] text-white border border-amber-500/30 shadow-md">
          <div className="flex items-start gap-3">
            <span className="text-2xl shrink-0 mt-0.5">{MODEL_GUIDANCE[currentModelKey].icon}</span>
            <div className="space-y-1">
              <span className="inline-block text-[10px] font-mono font-bold text-amber-300 uppercase tracking-widest">
                {MODEL_GUIDANCE[currentModelKey].badge}
              </span>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
                {MODEL_GUIDANCE[currentModelKey].purpose}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Error Alert */}
      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2">
          <svg className="w-4 h-4 text-red-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{error}</span>
        </div>
      )}

      {/* Form Fields Container */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 shadow-sm space-y-6 mb-8">
        {fields.map((field) => {
          const isIndustry = field.id === 'category' || field.id === 'industry';

          return (
            <div key={field.id} className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  {field.label}
                  {field.required && <span className="text-red-500 ml-1">*</span>}
                </label>
                {field.hint && (
                  <span className="text-[11px] text-amber-700 font-medium italic">
                    {field.hint}
                  </span>
                )}
              </div>

              {isIndustry ? (
                <IndustrySelect
                  value={formData[field.id] || ''}
                  onChange={(val) => handleChange(field.id, val)}
                  required={field.required}
                />
              ) : field.type === 'textarea' ? (
                <textarea
                  rows={4}
                  value={formData[field.id] || ''}
                  onChange={(e) => handleChange(field.id, e.target.value)}
                  placeholder={field.placeholder}
                  className="w-full bg-white border border-slate-300 rounded-lg p-3.5 text-slate-900 text-sm focus:ring-2 focus:ring-slate-900 focus:border-slate-900 transition-all placeholder:text-slate-400"
                />
              ) : (
                <input
                  type={field.type || 'text'}
                  value={formData[field.id] || ''}
                  onChange={(e) => handleChange(field.id, e.target.value)}
                  placeholder={field.placeholder}
                  className="w-full bg-white border border-slate-300 rounded-lg py-2.5 px-3.5 text-slate-900 text-sm focus:ring-2 focus:ring-slate-900 focus:border-slate-900 transition-all placeholder:text-slate-400"
                />
              )}
            </div>
          );
        })}

        {/* ── IMAGE UPLOAD CAPABILITY (CRITICAL FOR VISUAL & PACKAGING APPRAISAL) ── */}
        <div className="pt-2 border-t border-slate-100 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-800">
              📸 Tải Lên Hình Ảnh Để Thẩm Định Trực Quan
            </span>
            <span className="text-[11px] text-slate-500 font-medium">
              Personas & Hội đồng AI sẽ đánh giá thiết kế bao bì và hình ảnh
            </span>
          </div>

          {currentModelKey === 'ab_testing' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ImageUploader
                label="Bao Bì / Thiết Kế Phương Án A"
                hint="Dành cho mẫu đối đầu A"
                currentUrl={formData.option_a_image_url}
                slot="A"
                onUploadSuccess={(url) => handleImageUpload('A', url)}
                onRemove={() => handleRemoveImage('A')}
              />
              <ImageUploader
                label="Bao Bì / Thiết Kế Phương Án B"
                hint="Dành cho mẫu đối đầu B"
                currentUrl={formData.option_b_image_url}
                slot="B"
                onUploadSuccess={(url) => handleImageUpload('B', url)}
                onRemove={() => handleRemoveImage('B')}
              />
            </div>
          ) : (
            <ImageUploader
              label="Hình ảnh Sản Phẩm / Thiết Kế Bao Bì / Mockup (Tùy chọn)"
              hint="Hỗ trợ tối đa 10MB (PNG, JPG, WebP)"
              currentUrl={formData.concept_image_url}
              slot="concept"
              onUploadSuccess={(url) => handleImageUpload('concept', url)}
              onRemove={() => handleRemoveImage('concept')}
            />
          )}
        </div>

        {/* Historical Survey Dataset Upload (CSV/Excel) for Few-Shot Domain Tuning */}
        <DatasetUploader
          dataset={historicalDataset}
          onUploadSuccess={(ds) => setHistoricalDataset(ds)}
          onRemove={() => setHistoricalDataset(null)}
        />

        {/* Email for PDF Delivery */}
        <div className="pt-4 border-t border-slate-100 space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
            Email nhận Báo cáo Chiến lược PDF A4 <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="giamdoc.marketing@congty.com"
            className="w-full bg-white border border-slate-300 rounded-lg py-2.5 px-3.5 text-slate-900 text-sm focus:ring-2 focus:ring-slate-900 focus:border-slate-900 transition-all placeholder:text-slate-400"
          />
          <p className="text-[11px] text-slate-500">
            Hệ thống sẽ tự động gửi trọn bộ file báo cáo PDF đóng dấu bảo mật ngay sau khi hoàn tất tính toán.
          </p>
        </div>
      </div>

      {/* Action Footer */}
      <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-0 pt-4 border-t border-slate-200">
        <button
          type="button"
          onClick={() => setStep(2)}
          disabled={loading}
          className="btn-outline text-xs sm:text-sm py-2.5 px-5 disabled:opacity-50"
        >
          ← Quay lại
        </button>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={loading}
          className="btn-gold text-sm sm:text-base py-3.5 px-8 shadow-md disabled:opacity-60"
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Đang khởi tạo hồ sơ...</span>
            </>
          ) : (
            <>
              <span>Xác nhận & Thanh toán</span>
              <svg className="w-4 h-4 text-amber-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
