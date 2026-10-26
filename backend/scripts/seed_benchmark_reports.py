"""
Script Seed: Nạp 14 Báo Cáo Đối Sánh Ngành Chuẩn Mực vào Bảng benchmark_reports trên Supabase PostgreSQL.
Hỗ trợ quản trị viên quản lý, bật/tắt và cập nhật báo cáo trực tiếp từ Database.
"""

import os
import sys
import json
from datetime import datetime

# Fix Windows console encoding for Unicode/emoji
if sys.platform == "win32":
    os.environ.setdefault("PYTHONUTF8", "1")
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    if hasattr(sys.stderr, "reconfigure"):
        sys.stderr.reconfigure(encoding="utf-8", errors="replace")

# Add backend directory to sys.path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from database import init_db, SessionLocal, BenchmarkReport
from models.demo_data import get_demo_report_payload

BENCHMARK_SEEDS = [
    {
        "id": "DEMO-NIELSEN-BASES",
        "slug": "tra-kombucha-bases-2026",
        "title": "Báo Cáo Khảo Sát Tiềm Năng Ra Mắt: Dòng Trà Kombucha Men Vi Sinh Bản Địa (330ml)",
        "industry": "fnb",
        "industry_label": "F&B · Đồ Uống Chức Năng",
        "period_type": "quarterly",
        "period_label": "Quý 1/2026",
        "model_type": "nielsen_bases",
        "model_label": "Nielsen BASES",
        "score_or_verdict": "78/100 · STRONG GO",
        "score_number": 78,
        "score_color": "text-emerald-700 bg-emerald-50 border-emerald-300",
        "summary": "Kiểm chứng chỉ số thử nghiệm (Trial Rate), độ độc đáo của nguyên liệu bản địa và rào cản giá 28.000đ trước khi đưa vào kệ siêu thị & chuỗi tiện lợi.",
        "findings": [
            "Ý định mua Top-2-Box đạt 73.4%, vượt mức trung bình ngành nước giải khát tốt cho sức khỏe (62%).",
            "Độ độc đáo đạt 8.2/10 nhờ định vị Xoài Cát Chu Đồng Tháp kết hợp 1 tỷ lợi khuẩn Bacillus Clausii.",
            "Rào cản lớn nhất ở mức giá 28.000đ/lon; combo lốc 6 lon giảm giá dùng thử phá vỡ tâm lý do dự.",
        ],
        "tags": ["Kombucha", "Đồ uống hữu cơ", "Trial Rate", "USP"],
    },
    {
        "id": "DEMO-VAN-WESTENDORP",
        "slug": "ca-phe-cold-brew-psm-2026",
        "title": "Báo Cáo Chuẩn Định Giá & Đo Lường Độ Co Giãn: Cà Phê Cold Brew Hữu Cơ Đóng Lon (250ml)",
        "industry": "fnb",
        "industry_label": "F&B · Cà Phê Đặc Sản",
        "period_type": "quarterly",
        "period_label": "Quý 1/2026",
        "model_type": "van_westendorp",
        "model_label": "Van Westendorp PSM",
        "score_or_verdict": "ĐIỂM GIÁ TỐI ƯU: 32.000đ",
        "score_number": 82,
        "score_color": "text-sky-800 bg-sky-50 border-sky-300",
        "summary": "Xác định điểm giá tối ưu (OPP: 32.000đ) và biên độ chấp nhận giá (25.000đ - 42.000đ), bảo toàn giá trị định vị cao cấp tránh rơi vào bẫy cạnh tranh giá rẻ.",
        "findings": [
            "Điểm giá tối ưu (OPP) hội tụ tại 32.000đ/lon 250ml — tối thiểu hóa lực kháng cự tâm lý của khách hàng văn phòng.",
            "Khoảng giá chấp nhận được (PME) dao động từ 25.000đ (Quá rẻ) đến 42.000đ (Quá đắt).",
            "Định giá dưới 25.000đ làm giảm 38% niềm tin về chất lượng hạt Arabica Cầu Đất nguyên chất ủ lạnh 24 giờ.",
        ],
        "tags": ["Cold Brew", "Cà phê đặc sản", "Định giá tối ưu PSM", "Cao cấp"],
    },
    {
        "id": "DEMO-AB-TESTING",
        "slug": "banh-quy-delica-ab-2026",
        "title": "Báo Cáo Thử Nghiệm Thị Giác Bao Bì Hộp Thiếc: Ngành Quà Biếu Bánh Kẹo Mùa Lễ Tết",
        "industry": "confectionery",
        "industry_label": "Bánh Kẹo · Quà Biếu Mùa Vụ",
        "period_type": "quarterly",
        "period_label": "Quý 1/2026",
        "model_type": "ab_testing",
        "model_label": "A/B Testing Bao Bì",
        "score_or_verdict": "CONCEPT B THẮNG (61.4%)",
        "score_number": 61,
        "score_color": "text-amber-800 bg-amber-50 border-amber-300",
        "summary": "Thử nghiệm đối đầu trực diện giữa 2 mẫu thiết kế bao bì thiếc (Cổ điển vs Hiện đại) trước khi quyết định in ấn sản xuất số lượng lớn.",
        "findings": [
            "Phương án B (Tông màu xanh hoàng gia phối viền kim loại dập nổi) thắng áp đảo với 61.4% lựa chọn.",
            "Phương án B tạo cảm nhận sang trọng vượt trội +24% và sẵn sàng chi trả cao hơn 35.000đ/hộp.",
            "Điểm nghẽn ở mẫu A: Màu đỏ truyền thống bị đánh giá là đại trà, khó phân biệt với các thương hiệu cũ.",
        ],
        "tags": ["A/B Testing", "Bao bì hộp thiếc", "Quà biếu Tết", "Eye-tracking"],
    },
    {
        "id": "DEMO-MONADIC",
        "slug": "nuoc-cot-ham-xuong-monadic-2026",
        "title": "Báo Cáo Thẩm Định Ý Niệm Đơn Lập (Monadic): Ngành Nước Hầm Dinh Dưỡng Đóng Gói",
        "industry": "nutrition",
        "industry_label": "Thực Phẩm Dinh Dưỡng Tiện Lợi",
        "period_type": "quarterly",
        "period_label": "Quý 1/2026",
        "model_type": "monadic",
        "model_label": "Monadic Concept Test",
        "score_or_verdict": "LIFT +18.4% ĐỘ HẤP DẪN",
        "score_number": 74,
        "score_color": "text-emerald-700 bg-emerald-50 border-emerald-300",
        "summary": "Thẩm định ý niệm độc lập tách biệt để đo lường mức độ sẵn sàng thay thế thói quen ninh xương truyền thống bằng nước hầm cô đặc tiệt trùng.",
        "findings": [
            "Ý niệm dinh dưỡng tự nhiên không bột ngọt đạt điểm chấp nhận Lift +18.4% so với hạt nêm.",
            "84% đánh giá cao tính năng tiết kiệm 4 tiếng ninh nấu cho gia đình hiện đại.",
            "Rào cản niềm tin: Cần minh bạch cam kết 0% chất bảo quản và truy xuất nguồn thịt sạch.",
        ],
        "tags": ["Nước hầm xương", "Monadic Test", "Dinh dưỡng sạch", "Gia đình"],
    },
    {
        "id": "DEMO-KANO",
        "slug": "noi-chien-hoi-nuoc-kano-2026",
        "title": "Báo Cáo Phân Tầng Tính Năng R&D: Thiết Bị Nồi Chiên Hơi Nước Gia Đình Đô Thị",
        "industry": "appliances",
        "industry_label": "Gia Dụng · Smart Kitchen",
        "period_type": "quarterly",
        "period_label": "Quý 1/2026",
        "model_type": "kano",
        "model_label": "Kano Model R&D",
        "score_or_verdict": "TỐI ƯU BOM SẢN XUẤT",
        "score_number": 85,
        "score_color": "text-purple-800 bg-purple-50 border-purple-300",
        "summary": "Phân tầng tính năng R&D theo mô hình Kano Nhật Bản: Cắt giảm tính năng thừa vô bổ, dồn ngân sách vào tính năng tạo sự thỏa mãn vượt trội.",
        "findings": [
            "Công nghệ tự động vệ sinh khử khuẩn bằng hơi nước là vũ khí đột phá (Attractive feature).",
            "Lòng nồi chống dính ceramic và điều khiển cảm ứng tiếng Việt là tính năng bắt buộc (Must-be).",
            "Kết nối ứng dụng Wi-Fi bị 58% người dùng xem là không cần thiết, có thể cắt giảm để hạ giá thành.",
        ],
        "tags": ["Kano Model", "Đồ gia dụng", "R&D Roadmap", "Cắt giảm chi phí"],
    },
    {
        "id": "DEMO-BRAND-MAP",
        "slug": "my-pham-thuan-chay-brandmap-2026",
        "title": "Báo Cáo Bản Đồ Định Vị Đa Chiều (MDS): Phân Khúc Dược Mỹ Phẩm Thuần Chay Bản Địa",
        "industry": "cosmetics",
        "industry_label": "Mỹ Phẩm · Skincare Đô Thị",
        "period_type": "quarterly",
        "period_label": "Quý 1/2026",
        "model_type": "brand_map",
        "model_label": "Brand Perceptual Map",
        "score_or_verdict": "KHAI THÁC WHITE-SPACE",
        "score_number": 79,
        "score_color": "text-teal-800 bg-teal-50 border-teal-300",
        "summary": "Bản đồ hóa không gian định vị đa chiều, phát hiện khoảng trống cạnh tranh ngách Dược mỹ phẩm thuần chay kết hợp hoạt chất sinh học bản địa.",
        "findings": [
            "Thị trường tồn tại khoảng trống lớn giữa nhóm Mỹ phẩm organic dịu nhẹ và Dược mỹ phẩm điều trị nặng đô.",
            "Sự kết hợp giữa Tràm trà Huế và Niacinamide 5% giải quyết trúng nhu cầu da mụn khí hậu nhiệt đới.",
            "71% người dùng Gen Z sẵn sàng chuyển đổi thương hiệu nếu có chứng nhận lâm sàng độc lập.",
        ],
        "tags": ["Brand Map", "Mỹ phẩm thuần chay", "Khoảng trống thị trường", "Gen Z"],
    },
    {
        "id": "DEMO-UA-STUDY",
        "slug": "ca-phe-hoa-tan-ua-2026",
        "title": "Báo Cáo Thói Quen & Động Cơ Tiêu Dùng (U&A): Ngành Hàng Cà Phê Hòa Tan Đóng Gói",
        "industry": "fnb",
        "industry_label": "FMCG · Thói Quen Tiêu Dùng",
        "period_type": "quarterly",
        "period_label": "Quý 1/2026",
        "model_type": "ua_study",
        "model_label": "Usage & Attitude (U&A)",
        "score_or_verdict": "THẤU HIỂU HÀNH VI 360°",
        "score_number": 88,
        "score_color": "text-indigo-800 bg-indigo-50 border-indigo-300",
        "summary": "Nghiên cứu cấu trúc hành vi tiêu dùng 360°: Dịp sử dụng cốt lõi, thói quen pha chế, động cơ mua hàng và rào cản từ các chuỗi đồ uống mang đi.",
        "findings": [
            "68.2% uống vào khung giờ 07:00 - 08:30 sáng ngay tại bàn làm việc hoặc trước khi rời nhà.",
            "Lý do chính chọn cà phê hòa tan thay vì mua mang đi: Tiết kiệm thời gian (54%) và kiểm soát độ ngọt (42%).",
            "Nhu cầu chưa được đáp ứng: Khát khao vị đắng đậm mộc tự nhiên của Robusta Tây Nguyên.",
        ],
        "tags": ["U&A Study", "Thói quen tiêu dùng", "FMCG", "Cà phê hòa tan"],
    },
    {
        "id": "DEMO-DEAL-ELASTICITY",
        "slug": "hop-qua-tet-elasticity-2026",
        "title": "Báo Cáo Độ Co Giãn Chiết Khấu B2B & Mùa Vụ: Phân Khúc Hộp Quà Trung Thu & Lễ Tết",
        "industry": "confectionery",
        "industry_label": "Quà Tặng Mùa Vụ B2B",
        "period_type": "quarterly",
        "period_label": "Quý 1/2026",
        "model_type": "deal_elasticity",
        "model_label": "Deal Elasticity Matrix",
        "score_or_verdict": "CHIẾT KHẤU TỐI ƯU: 15% - 20%",
        "score_number": 84,
        "score_color": "text-rose-800 bg-rose-50 border-rose-300",
        "summary": "Đo lường độ co giãn nhu cầu theo các mức khuyến mãi và chiết khấu bậc thang, tối ưu hóa tổng doanh thu và biên lợi nhuận ròng cho mùa Tết.",
        "findings": [
            "Khuyến mãi dưới 10% không tạo ra sự dịch chuyển nhu cầu đáng kể (tỷ lệ chuyển đổi chỉ tăng +4%).",
            "Mức chiết khấu vàng đạt 15% cho đơn từ 20 hộp và 20% cho đơn từ 50 hộp kích hoạt tỷ lệ chốt đơn B2B tăng +42%.",
            "Chiết khấu sâu quá 30% làm dấy lên nghi ngờ về bánh cận date hoặc chất lượng nhân bánh sụt giảm.",
        ],
        "tags": ["Deal Elasticity", "Co giãn giá", "Chiết khấu B2B", "Mùa vụ"],
    },
    {
        "id": "DEMO-EVENTS-MAXDIFF",
        "slug": "tiec-cuoi-ngoai-troi-maxdiff-2026",
        "title": "Báo Cáo Phân Cấp Giá Trị Thuộc Tính MaxDiff: Dịch Vụ Cưới & Sự Kiện Ngoài Trời",
        "industry": "lifestyle",
        "industry_label": "Dịch Vụ Cưới & Sự Kiện Cao Cấp",
        "period_type": "quarterly",
        "period_label": "Quý 1/2026",
        "model_type": "maxdiff",
        "model_label": "MaxDiff Scaling",
        "score_or_verdict": "PHÂN CẤP TIỆN ÍCH TỐI ĐA",
        "score_number": 86,
        "score_color": "text-amber-800 bg-amber-50 border-amber-300",
        "summary": "Áp dụng phương pháp MaxDiff (Best-Worst Scaling) để phân loại rạch ròi thuộc tính quan trọng nhất và thuộc tính khách hàng thờ ơ khi đặt tiệc cưới.",
        "findings": [
            "Hai yếu tố được đánh giá quan trọng nhất: Độ riêng tư của khuôn viên tiệc và Chất lượng ẩm thực tiệc nóng.",
            "Khách hàng sẵn sàng cắt giảm: Màn trình diễn pháo hoa rườm rà và cổng hoa giả để đầu tư vào bàn tiệc.",
            "Gói ẩm thực hữu cơ cá nhân hóa theo chế độ ăn là thuộc tính tạo động lực chốt hợp đồng mạnh mẽ nhất.",
        ],
        "tags": ["MaxDiff", "Tiệc cưới", "Phân cấp thuộc tính", "Dịch vụ cao cấp"],
    },
    {
        "id": "DEMO-MILK-SEN-BASES",
        "slug": "sua-hat-sen-bases-2026",
        "title": "Báo Cáo Tiềm Năng Thương Mại Hóa: Sữa Hạt Sen OCOP & Dinh Dưỡng Thực Vật",
        "industry": "nutrition",
        "industry_label": "Nông Sản OCOP Chế Biến Sâu",
        "period_type": "quarterly",
        "period_label": "Quý 1/2026",
        "model_type": "nielsen_bases",
        "model_label": "Nielsen BASES",
        "score_or_verdict": "76/100 · STRONG GO",
        "score_number": 76,
        "score_color": "text-emerald-700 bg-emerald-50 border-emerald-300",
        "summary": "Kiểm chứng tiềm năng thương mại hóa dòng sữa hạt bản địa OCOP 4 sao thay thế sữa bò truyền thống cho người tiêu dùng đô thị dị ứng lactose.",
        "findings": [
            "Điểm số thỏa mãn nhu cầu sức khỏe đạt 86%, đặc biệt ở phân khúc người tiêu dùng trên 35 tuổi.",
            "Thông điệp 'Hạt sen Tháp Mười kết hợp gạo lứt huyết rồng' tạo dựng niềm tin nguồn gốc vượt trội.",
            "Cần thiết kế phiên bản ít đường (dưới 3g/100ml) để đáp ứng trọn vẹn thị hiếu của người ăn kiêng.",
        ],
        "tags": ["Sữa hạt sen", "OCOP chế biến sâu", "Dinh dưỡng thực vật", "Bản địa"],
    },
    {
        "id": "DEMO-DIAPER-WESTENDORP",
        "slug": "ta-bim-soi-tre-westendorp-2026",
        "title": "Báo Cáo Ngưỡng Tâm Lý Giá Van Westendorp: Dòng Tã Bỉm Hữu Cơ Sợi Tre Tự Nhiên",
        "industry": "lifestyle",
        "industry_label": "Mẹ & Bé · Đồ Dùng Trẻ Em",
        "period_type": "quarterly",
        "period_label": "Quý 1/2026",
        "model_type": "van_westendorp",
        "model_label": "Van Westendorp PSM",
        "score_or_verdict": "ĐIỂM GIÁ: 320.000đ/BỊCH",
        "score_number": 80,
        "score_color": "text-sky-800 bg-sky-50 border-sky-300",
        "summary": "Định giá chính xác cho dòng bỉm organic cao cấp, cân bằng giữa tâm lý 'chọn điều tốt nhất cho con' và ngân sách chi tiêu hàng tháng của gia đình trẻ.",
        "findings": [
            "Điểm giá tối ưu hội tụ tại 320.000đ cho bịch 50 miếng (tương đương 6.400đ/miếng).",
            "Ngưỡng giá quá đắt bắt đầu từ 390.000đ - vượt quá ngưỡng này tỷ lệ chuyển đổi sụt giảm 78%.",
            "Định giá dưới 250.000đ khiến 46% bà mẹ hoài nghi về tỷ lệ sợi tre hữu cơ thật.",
        ],
        "tags": ["Mẹ & Bé", "Tã bỉm sợi tre", "Tâm lý giá", "Organic"],
    },
    {
        "id": "DEMO-AIR-PURIFIER-KANO",
        "slug": "may-loc-khong-khi-kano-2026",
        "title": "Báo Cáo Cấu Hình Cốt Lõi Kano Model: Máy Lọc Không Khí & Khử Mùi Căn Hộ Đô Thị",
        "industry": "appliances",
        "industry_label": "Gia Dụng Thông Minh · Smart Home",
        "period_type": "quarterly",
        "period_label": "Quý 1/2026",
        "model_type": "kano",
        "model_label": "Kano Model R&D",
        "score_or_verdict": "PHÂN ĐỊNH TÍNH NĂNG R&D",
        "score_number": 87,
        "score_color": "text-purple-800 bg-purple-50 border-purple-300",
        "summary": "Khảo sát nhu cầu lọc bụi mịn PM2.5 cho căn hộ 45-75m2, xác định cấu hình tiêu chuẩn giúp máy đạt mức giá cạnh tranh nhất mà vẫn bán chạy.",
        "findings": [
            "Màng lọc HEPA H13 và độ ồn dưới 28dB ở chế độ ngủ là 2 tính năng sống còn (Must-be).",
            "Cảm biến laser hiển thị chỉ số bụi mịn theo thời gian thực tạo cảm giác an tâm cao nhất (Performance).",
            "Tính năng ion âm và điều khiển giọng nói ít được sử dụng, có thể loại bỏ để giảm giá bán lẻ 15%.",
        ],
        "tags": ["Máy lọc không khí", "Kano Model", "Chung cư", "PM2.5"],
    },
    {
        "id": "DEMO-FISH-SAUCE-MONADIC",
        "slug": "nuoc-mam-phu-quoc-monadic-2026",
        "title": "Báo Cáo Đo Lường Niềm Tin Ý Niệm: Nước Mắm Truyền Thống Đậm Đạm Tự Nhiên (45°N)",
        "industry": "nutrition",
        "industry_label": "Gia Vị Truyền Thống Di Sản",
        "period_type": "quarterly",
        "period_label": "Quý 1/2026",
        "model_type": "monadic",
        "model_label": "Monadic Concept Test",
        "score_or_verdict": "NIỀM TIN THƯƠNG HIỆU: 88.5%",
        "score_number": 88,
        "score_color": "text-emerald-700 bg-emerald-50 border-emerald-300",
        "summary": "Đo lường mức độ tin cậy và sẵn sàng trả giá cao hơn cho nước mắm ủ chượp thùng gỗ tự nhiên cam kết 0% hương liệu nhân tạo.",
        "findings": [
            "Cam kết 'Chỉ cá cơm than và muối biển ủ ròng 18 tháng' nâng chỉ số tin cậy đạt 88.5%.",
            "Rào cản duy nhất: Mùi vị quá mặn so với nước mắm công nghiệp; giải pháp là chai xịt định lượng.",
            "Ý định chuyển đổi từ nước mắm công nghiệp sang nước mắm truyền thống tăng vọt khi có minh bạch hàm lượng đạm.",
        ],
        "tags": ["Nước mắm truyền thống", "Monadic Test", "Ủ chượp tự nhiên", "Thực phẩm sạch"],
    },
    {
        "id": "DEMO-EDTECH-MAXDIFF",
        "slug": "khoa-hoc-ai-edtech-maxdiff-2026",
        "title": "Báo Cáo Phân Cấp Nhu Cầu Đào Tạo MaxDiff: Khóa Học Kỹ Năng Số & Ứng Dụng AI Thực Chiến",
        "industry": "lifestyle",
        "industry_label": "Giáo Dục · EdTech & Kỹ Năng Số",
        "period_type": "quarterly",
        "period_label": "Quý 1/2026",
        "model_type": "maxdiff",
        "model_label": "MaxDiff Scaling",
        "score_or_verdict": "ƯU TIÊN GIÁ TRỊ THỰC CHIẾN",
        "score_number": 83,
        "score_color": "text-amber-800 bg-amber-50 border-amber-300",
        "summary": "Phân tích thứ tự ưu tiên của người đi làm khi chọn khóa học trực tuyến: Chứng chỉ, Học phí, Giảng viên hay Hướng dẫn dự án thực chiến.",
        "findings": [
            "Yếu tố xếp vị trí số 1 tuyệt đối: 'Thực hành trên bài toán kinh doanh thật và có template dùng được ngay'.",
            "Chứng chỉ hoàn thành khóa học bị xếp ở nhóm ưu tiên thấp nhất (chỉ 12% coi là quan trọng).",
            "Hỗ trợ hỏi đáp 1-1 qua Zalo/Discord trong 30 ngày sau khóa học là thuộc tính thúc đẩy đăng ký mạnh mẽ nhất.",
        ],
        "tags": ["EdTech", "MaxDiff", "Kỹ năng số", "Thực chiến"],
    },
]


def seed_benchmark_reports():
    print("Khởi tạo kết nối Supabase PostgreSQL...")
    init_db()
    db = SessionLocal()

    total_seeded = 0
    total_updated = 0

    try:
        for item in BENCHMARK_SEEDS:
            rep_id = item["id"]
            # Lấy payload báo cáo hoàn chỉnh từ demo_data.py
            full_payload = get_demo_report_payload(rep_id)
            pinfo = full_payload.get("product_info", {})
            company_name = pinfo.get("company_name") or pinfo.get("brand_name") or "Doanh Nghiệp Giả Định"
            product_name = pinfo.get("product_name") or pinfo.get("concept_name") or item["title"]

            existing = db.query(BenchmarkReport).filter(BenchmarkReport.id == rep_id).first()
            if existing:
                existing.title = item["title"]
                existing.slug = item["slug"]
                existing.industry = item["industry"]
                existing.industry_label = item["industry_label"]
                existing.period_type = item["period_type"]
                existing.period_label = item["period_label"]
                existing.model_type = item["model_type"]
                existing.model_label = item["model_label"]
                existing.company_name = company_name
                existing.product_name = product_name
                existing.score_or_verdict = item["score_or_verdict"]
                existing.score_number = item["score_number"]
                existing.score_color = item["score_color"]
                existing.summary = item["summary"]
                existing.findings_json = json.dumps(item["findings"], ensure_ascii=False)
                existing.tags_json = json.dumps(item["tags"], ensure_ascii=False)
                existing.full_report_json = json.dumps(full_payload, ensure_ascii=False)
                existing.is_published = True
                existing.updated_at = datetime.utcnow()
                total_updated += 1
            else:
                new_row = BenchmarkReport(
                    id=rep_id,
                    title=item["title"],
                    slug=item["slug"],
                    industry=item["industry"],
                    industry_label=item["industry_label"],
                    period_type=item["period_type"],
                    period_label=item["period_label"],
                    model_type=item["model_type"],
                    model_label=item["model_label"],
                    company_name=company_name,
                    product_name=product_name,
                    sample_size=1000,
                    score_or_verdict=item["score_or_verdict"],
                    score_number=item["score_number"],
                    score_color=item["score_color"],
                    summary=item["summary"],
                    findings_json=json.dumps(item["findings"], ensure_ascii=False),
                    tags_json=json.dumps(item["tags"], ensure_ascii=False),
                    full_report_json=json.dumps(full_payload, ensure_ascii=False),
                    is_published=True,
                    created_at=datetime.utcnow(),
                    updated_at=datetime.utcnow(),
                )
                db.add(new_row)
                total_seeded += 1

        db.commit()
        print(f"ĐÃ HOÀN TẤT SEED: Đã thêm mới {total_seeded} và cập nhật {total_updated} báo cáo đối sánh ngành vào Supabase!")

        # Kiểm tra tổng số record trong bảng
        total_in_db = db.query(BenchmarkReport).count()
        print(f"Tổng số báo cáo trong bảng benchmark_reports hiện tại: {total_in_db}")

    except Exception as e:
        db.rollback()
        print(f"Lỗi khi seed dữ liệu: {e}")
        raise e
    finally:
        db.close()


if __name__ == "__main__":
    seed_benchmark_reports()
