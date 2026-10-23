/**
 * Danh mục ngành nghề và phân khúc thị trường chuẩn hóa tại Việt Nam (VSIC & Consumer Sectors).
 * Giúp doanh nghiệp chọn nhanh ngành hàng mục tiêu để AI thiết lập bối cảnh phân tích chuẩn xác.
 */

export interface VietnamIndustry {
  id: string;
  name: string;
  sectorGroup: string;
  examples: string;
  icon: string;
}

export const VIETNAM_STANDARD_INDUSTRIES: VietnamIndustry[] = [
  {
    id: 'fnb_food_beverage',
    name: 'Thực phẩm & Đồ uống (F&B / FMCG Thực phẩm)',
    sectorGroup: 'Hàng tiêu dùng nhanh',
    examples: 'Nước giải khát, Cà phê, Trà, Sữa, Bia rượu, Bánh kẹo, Gia vị, Thực phẩm chế biến sẵn...',
    icon: '☕',
  },
  {
    id: 'cosmetics_personal_care',
    name: 'Mỹ phẩm, Làm đẹp & Chăm sóc cá nhân',
    sectorGroup: 'Chăm sóc cá nhân',
    examples: 'Dưỡng da (Skincare), Trang điểm, Chăm sóc tóc, Sữa tắm, Nước hoa, Chăm sóc răng miệng...',
    icon: '💄',
  },
  {
    id: 'pharma_healthcare',
    name: 'Dược phẩm, Thực phẩm chức năng & Chăm sóc sức khỏe',
    sectorGroup: 'Y tế & Sức khỏe',
    examples: 'Thuốc không kê đơn, Vitamin bổ sung, Collagen, Thảo dược trị liệu, Thiết bị y tế gia đình...',
    icon: '💊',
  },
  {
    id: 'retail_ecommerce',
    name: 'Bán lẻ, Siêu thị & Thương mại điện tử',
    sectorGroup: 'Phân phối & Bán lẻ',
    examples: 'Sàn TMĐT (Shopee, TikTok Shop), Chuỗi siêu thị tiện lợi, Cửa hàng bán lẻ chuyên doanh...',
    icon: '🛒',
  },
  {
    id: 'tech_software_saas',
    name: 'Công nghệ thông tin, Phần mềm & AI / SaaS',
    sectorGroup: 'Công nghệ số',
    examples: 'Phần mềm quản trị B2B, Ứng dụng di động (Mobile App), Công cụ AI, Nền tảng số, Dịch vụ Cloud...',
    icon: '💻',
  },
  {
    id: 'fashion_apparel',
    name: 'Thời trang, May mặc, Giày dép & Phụ kiện',
    sectorGroup: 'Thời trang & Phong cách sống',
    examples: 'Quần áo công sở, Thời trang dạo phố, Giày dép, Túi xách, Đồng hồ, Trang sức phụ kiện...',
    icon: '👗',
  },
  {
    id: 'mom_baby',
    name: 'Mẹ, Bé & Đồ chơi trẻ em',
    sectorGroup: 'Gia đình & Trẻ em',
    examples: 'Sữa công thức, Tã bỉm trẻ em, Đồ ăn dặm, Quần áo sơ sinh, Đồ chơi thông minh, Xe đẩy...',
    icon: '🍼',
  },
  {
    id: 'home_appliances',
    name: 'Điện máy, Thiết bị gia dụng & Nhà thông minh (Smart Home)',
    sectorGroup: 'Thiết bị & Gia dụng',
    examples: 'Nồi chiên, Máy lọc không khí, Robot hút bụi, Thiết bị bếp, Máy lọc nước, Thiết bị Smart Home...',
    icon: '🔌',
  },
  {
    id: 'education_edtech',
    name: 'Giáo dục, Đào tạo & Công nghệ giáo dục (EdTech)',
    sectorGroup: 'Giáo dục',
    examples: 'Trung tâm ngoại ngữ, Khóa học trực tuyến, Trường quốc tế, Du học, Đào tạo kỹ năng nghề...',
    icon: '🎓',
  },
  {
    id: 'restaurant_cafe_service',
    name: 'Dịch vụ Ăn uống: Nhà hàng, Quán Cafe & Trà sữa (Food Service)',
    sectorGroup: 'Dịch vụ Ẩm thực',
    examples: 'Chuỗi cafe, Quán trà sữa, Nhà hàng lẩu nướng, Fast-food, Quán ăn gia đình, Bakery...',
    icon: '🍽️',
  },
  {
    id: 'real_estate_interior',
    name: 'Bất động sản, Nhà ở & Nội thất kiến trúc',
    sectorGroup: 'Bất động sản & Xây dựng',
    examples: 'Căn hộ chung cư, Nhà phố, Bất động sản nghỉ dưỡng, Thiết kế nội thất, Vật liệu xây dựng...',
    icon: '🏢',
  },
  {
    id: 'travel_logistics_hospitality',
    name: 'Du lịch, Khách sạn, Vận tải & Logistics',
    sectorGroup: 'Vận tải & Du lịch',
    examples: 'Tour du lịch, Khách sạn & Resort, Đặt vé máy bay, Ứng dụng đặt xe, Giao nhận chuyển phát nhanh...',
    icon: '✈️',
  },
  {
    id: 'fintech_banking_insurance',
    name: 'Tài chính, Ngân hàng số, Bảo hiểm & Fintech',
    sectorGroup: 'Tài chính & Đầu tư',
    examples: 'Ngân hàng số, Ví điện tử, Bảo hiểm nhân thọ/phi nhân thọ, Ứng dụng đầu tư chứng khoán, Thẻ tín dụng...',
    icon: '💳',
  },
  {
    id: 'automotive_ev',
    name: 'Ô tô, Xe máy, Xe điện & Phụ tùng xe',
    sectorGroup: 'Phương tiện & Giao thông',
    examples: 'Xe máy điện, Ô tô điện, Xe máy xăng, Xe hơi gia đình, Phụ tùng & Phụ kiện ô tô xe máy...',
    icon: '🚗',
  },
  {
    id: 'clean_agriculture',
    name: 'Nông nghiệp công nghệ cao & Nông sản hữu cơ',
    sectorGroup: 'Nông nghiệp & Chế biến',
    examples: 'Rau củ quả hữu cơ, Nông sản sấy, Gạo sạch ST25, Thủy hải sản xuất khẩu, Phân bón vi sinh...',
    icon: '🌱',
  },
  {
    id: 'b2b_media_services',
    name: 'Dịch vụ Doanh nghiệp B2B, Truyền thông & Quảng cáo',
    sectorGroup: 'Dịch vụ Doanh nghiệp',
    examples: 'Marketing Agency, Tư vấn luật & thuế, Sản xuất bao bì, In ấn, Tổ chức sự kiện, Dịch vụ văn phòng...',
    icon: '📈',
  },
];
