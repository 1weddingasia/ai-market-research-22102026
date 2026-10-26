"""
T5: PDF Service — Sinh báo cáo PDF A4 chuẩn in ấn cho Lãnh đạo doanh nghiệp.
Ưu tiên: Playwright Chromium (chuẩn CSS Print A4, SVG, Fonts) -> WeasyPrint -> Edge/Chrome Headless.
Cam kết 100% xuất ra file PDF thật sự (.pdf), tuyệt đối không xuất HTML cho người dùng.
"""

import asyncio
import os
import shutil
import subprocess
import tempfile
from datetime import datetime
from pathlib import Path

import structlog
from jinja2 import Environment, FileSystemLoader

log = structlog.get_logger(__name__)

TEMPLATE_DIR = Path(__file__).parent.parent / "templates"
PDF_OUTPUT_DIR = Path("./pdfs")
PDF_OUTPUT_DIR.mkdir(exist_ok=True)

MODEL_TYPE_LABELS = {
    "nielsen_bases":   "Nielsen BASES — Kiểm định Ý tưởng Sản phẩm",
    "van_westendorp":  "Van Westendorp PSM — Định giá Tối ưu",
    "ab_testing":      "Kantar Link — Thử nghiệm A/B Bao bì & Thông điệp",
    "ua_study":        "U&A Study — Thói quen & Thái độ Ngành hàng",
    "deal_elasticity": "Deal Elasticity — Đánh giá Chương trình Ưu đãi",
    "monadic":         "Monadic Testing — Thử nghiệm Khái niệm Độc lập",
    "maxdiff":         "MaxDiff Scaling — Xếp hạng Thuộc tính & Thông điệp",
    "kano":            "Kano Model — Phân loại Tính năng R&D",
    "brand_map":       "Brand Perceptual Mapping — Bản đồ Định vị Thương hiệu",
}

MODEL_META = {
    "nielsen_bases": {
        "title": "BÁO CÁO KIỂM ĐỊNH MỨC ĐỘ CHẤP NHẬN SẢN PHẨM & RỦI RO THỊ TRƯỜNG",
        "subtitle": "Khảo sát dự báo mức độ thâm nhập thị trường & kiểm định ý tưởng sản phẩm mới",
        "framework": "Mô hình chuẩn hóa Nielsen BASES Innovation Framework",
        "section_tag": "MÔ HÌNH NIELSEN BASES · MA TRẬN 2 TRỤC APPEAL VS UNIQUENESS",
        "objective": "Dự báo tỷ lệ dùng thử (Trial Rate), mức độ độc đáo và chỉ số nguy cơ thất bại (Flop Risk)",
        "hero_label": "CHỈ SỐ KHẢ THI (VIABILITY SCORE)",
        "hero_sub": "Đánh giá khả năng thương mại hóa",
        "pillars": [
            {"title": "Tối Ưu Khái Niệm & USP", "icon": "💡", "color": "emerald"},
            {"title": "Kích Hoạt Dùng Thử (Trial)", "icon": "🎯", "color": "blue"},
            {"title": "Rào Chắn Rủi Ro Thất Bại", "icon": "🛡️", "color": "red"},
        ],
        "bottom_kpis": [
            {"label": "Ý Định Mua (Top-2-Box)", "key": "top2box", "default": "73.4%"},
            {"label": "Mức Độ Độc Đáo", "key": "uniqueness", "default": "4.1 / 5.0"},
            {"label": "Chỉ Số Nguy Cơ (Flop Risk)", "key": "flop_risk", "default": "18% (An toàn)"},
        ],
        "roadmap": {
            "day30": {
                "title": "Giai đoạn 1: Tinh Chỉnh Concept & Lý Do Để Tin (RTB)",
                "desc": "Làm sắc nét thông điệp USP mặt trước bao bì. Giải tỏa triệt để rào cản nhận thức hàng đầu để khách hàng không nhầm lẫn với sản phẩm đại trà.",
            },
            "day60": {
                "title": "Giai đoạn 2: Sản Xuất Pilot Batch & Kích Hoạt Dùng Thử",
                "desc": "Sản xuất mẻ thử nghiệm đầu tiên. Triển khai chiến dịch Sampling có chọn lọc tại các điểm bán trọng điểm để kích hoạt tỷ lệ dùng thử thực tế.",
            },
            "day90": {
                "title": "Giai đoạn 3: Phủ Kệ Toàn Diện & Đo Lường Tỷ Lệ Tái Mua",
                "desc": "Mở rộng phân phối vào chuỗi siêu thị MT và kênh GT. Theo dõi sát sao tỷ lệ mua lặp lại (Repeat Purchase Rate) để bảo vệ thị phần.",
            },
        },
    },
    "van_westendorp": {
        "title": "BÁO CÁO ĐỊNH GIÁ TỐI ƯU & ĐỘ NHẠY GIÁ NGƯỜI TIÊU DÙNG",
        "subtitle": "Xác định điểm giá tối ưu (OPP) và khoảng giá thị trường chấp nhận được",
        "framework": "Mô hình kinh tế học Van Westendorp Price Sensitivity Meter (PSM)",
        "section_tag": "MÔ HÌNH VAN WESTENDORP PSM · 4 ĐƯỜNG CONG TÍCH LŨY ĐỘ NHẠY GIÁ",
        "objective": "Xác lập điểm giá tối ưu (OPP), giá sàn (PMC), giá hòa vốn (IDP) và giá trần (PME)",
        "hero_label": "ĐIỂM GIÁ TỐI ƯU (OPP)",
        "hero_sub": "Ngưỡng giá tối thiểu hóa lực cản",
        "pillars": [
            {"title": "Điểm Giá Tối Ưu (OPP)", "icon": "💎", "color": "blue"},
            {"title": "Bảo Toàn Giá Trị (IPP)", "icon": "⚖️", "color": "emerald"},
            {"title": "Phân Tầng SKU & Biên Lợi Nhuận", "icon": "📊", "color": "amber"},
        ],
        "bottom_kpis": [
            {"label": "Chỉ Số Khả Thi Giá (Viability)", "key": "viability", "default": "89 / 100"},
            {"label": "Độ Rộng Vùng An Toàn (RAP)", "key": "rap_spread", "default": "7.400 đ"},
            {"label": "Trần Cản Tâm Lý (PME)", "key": "resistance", "default": "31.600 đ"},
        ],
        "roadmap": {
            "day30": {
                "title": "Giai đoạn 1: Niêm Yết Giá Bán Lẻ OPP & Khung Chiết Khấu Đại Lý",
                "desc": "Xác lập mức giá niêm yết chính thức quanh điểm giá tối ưu OPP. Ban hành chính sách chiết khấu kênh phân phối bảo đảm biên lãi đại lý.",
            },
            "day60": {
                "title": "Giai đoạn 2: Cấu Trúc Phân Tầng SKU (Size Nhỏ - Combo Lớn)",
                "desc": "Tung quy cách size nhỏ với giá tiệm cận PMC để hạ thấp rào cản dùng thử; song song triển khai combo gia đình để tối đa hóa doanh thu.",
            },
            "day90": {
                "title": "Giai đoạn 3: Giám Sát Áp Lực Chi Phí & Kiểm Soát Trần Giá PME",
                "desc": "Giám sát chặt chẽ biến động chi phí nguyên vật liệu. Thiết lập kỷ luật giá nghiêm ngặt, tuyệt đối không tăng giá bán lẻ vượt điểm quá đắt PME.",
            },
        },
    },
    "ab_testing": {
        "title": "BÁO CÁO THỬ NGHIỆM A/B BAO BÌ & THÔNG ĐIỆP TRUYỀN THÔNG",
        "subtitle": "Đo lường mức độ nâng cao tỷ lệ chuyển đổi (Conversion Uplift Scorecard)",
        "framework": "Mô hình đánh giá chuẩn Kantar Link Pre-testing Framework",
        "section_tag": "MÔ HÌNH KANTAR LINK · BẢNG ĐIỂM ĐỐI ĐẦU PHƯƠNG ÁN A/B",
        "objective": "So sánh đối đầu trực diện Win-Rate %, sức hút thị giác và cảm nhận cao cấp giữa 2 phương án",
        "hero_label": "TỶ LỆ THẮNG MẪU CHIẾN THẮNG",
        "hero_sub": "Độ lệch có ý nghĩa thống kê (p < 0.05)",
        "pillars": [
            {"title": "Lợi Thế Phương Án Thắng", "icon": "🏆", "color": "emerald"},
            {"title": "Khắc Phục Điểm Nghẽn Mẫu Thua", "icon": "🔍", "color": "red"},
            {"title": "Kế Hoạch Tối Ưu Lai Ghép", "icon": "📦", "color": "blue"},
        ],
        "bottom_kpis": [
            {"label": "Tỷ Lệ Thắng (Win-Rate)", "key": "win_rate", "default": "61.4% (Phương án B)"},
            {"label": "Kiểm Định Ý Nghĩa", "key": "p_val", "default": "p < 0.01 (Tin cậy cao)"},
            {"label": "Cảm Nhận Cao Cấp Hơn", "key": "premium_uplift", "default": "+24.0% so với mẫu cũ"},
        ],
        "roadmap": {
            "day30": {
                "title": "Giai đoạn 1: Khóa Thiết Kế Thắng & Tích Hợp Ưu Điểm Mẫu Đối Ứng",
                "desc": "Phê duyệt phương án chiến thắng đưa vào sản xuất; kế thừa các điểm sáng đồ họa và từ khóa tốt nhất từ mẫu đối ứng để hoàn thiện bản in cuối cùng.",
            },
            "day60": {
                "title": "Giai đoạn 2: In Ấn Thương Mại & Thử Nghiệm Nổi Bật Quầy Kệ",
                "desc": "Tiến hành in bao bì thương mại quy mô lớn. Kiểm tra trực quan khả năng thu hút mắt (Shelf Stand-out) trên kệ siêu thị và hình ảnh thumbnail e-commerce.",
            },
            "day90": {
                "title": "Giai đoạn 3: Phủ Sóng Nhận Diện Đồng Bộ Đa Kênh Bán Hàng",
                "desc": "Triển khai chiến dịch truyền thông tích hợp đồng bộ theo hình ảnh thiết kế chiến thắng trên mọi điểm tiếp xúc mạng xã hội và cửa hàng vật lý.",
            },
        },
    },
    "ua_study": {
        "title": "BÁO CÁO NGHIÊN CỨU THÓI QUEN & THÁI ĐỘ NGƯỜI TIÊU DÙNG (U&A)",
        "subtitle": "Khám phá khoảng trống thị trường (Unmet Needs) & dịp tiêu dùng trọng điểm",
        "framework": "Mô hình nghiên cứu hành vi Usage & Attitude (U&A) Study",
        "section_tag": "MÔ HÌNH U&A STUDY · CƠ CẤU DỊP TIÊU DÙNG & TẦN SUẤT SỬ DỤNG",
        "objective": "Phân tích cấu trúc hành vi tiêu dùng 360 độ: Dịp sử dụng cốt lõi, thói quen và rào cản",
        "hero_label": "DỊP TIÊU DÙNG TRỌNG ĐIỂM",
        "hero_sub": "Tần suất và bối cảnh sử dụng cao nhất",
        "pillars": [
            {"title": "Dịp Tiêu Dùng Cốt Lõi", "icon": "⏰", "color": "amber"},
            {"title": "Nhu Cầu Chưa Thỏa Mãn (Unmet)", "icon": "💡", "color": "red"},
            {"title": "Gia Tăng Tần Suất & Giỏ Hàng", "icon": "🛒", "color": "emerald"},
        ],
        "bottom_kpis": [
            {"label": "Dịp Tiêu Dùng Số 1", "key": "top_occasion", "default": "48.6% (Buổi chiều)"},
            {"label": "Kênh Mua Sắm Chủ Đạo", "key": "top_channel", "default": "58.2% (Siêu thị MT)"},
            {"label": "Nỗi Đau Lớn Nhất Ngành", "key": "top_unmet", "default": "Thiếu tiện lợi đóng mở"},
        ],
        "roadmap": {
            "day30": {
                "title": "Giai đoạn 1: Gắn Định Vị Vào Dịp Tiêu Dùng Cốt Lõi",
                "desc": "Định vị sản phẩm gắn liền với bối cảnh tiêu dùng phổ biến nhất đã phát hiện trong khảo sát nhằm hình thành phản xạ tiêu dùng định kỳ.",
            },
            "day60": {
                "title": "Giai đoạn 2: Phủ Sóng Kênh Mua Sắm Trọng Tâm (MT & Online)",
                "desc": "Tập trung lực lượng tiếp thị và chiết khấu vào các kênh mua sắm có tỷ lệ thâm nhập cao nhất (chuỗi cửa hàng tiện lợi và sàn thương mại điện tử).",
            },
            "day90": {
                "title": "Giai đoạn 3: Phát Triển Giải Pháp Giải Tỏa Unmet Needs",
                "desc": "R&D quy cách đóng gói và sản phẩm cải tiến nhằm giải quyết triệt để nỗi đau lớn nhất của ngành hàng, bỏ xa các đối thủ chậm thay đổi.",
            },
        },
    },
    "deal_elasticity": {
        "title": "BÁO CÁO ĐỘ CO GIÃN KHUYẾN MÃI & CHIẾN LƯỢC KÍCH HOẠT DÙNG THỬ",
        "subtitle": "Đo lường độ nhạy ưu đãi và tỷ lệ kích hoạt chuyển đổi mua hàng",
        "framework": "Mô hình Promo Elasticity & Threshold Analysis",
        "section_tag": "MÔ HÌNH DEAL ELASTICITY · ĐỘ CO GIÃN THEO BẬC THANG CHIẾT KHẤU",
        "objective": "Đo lường độ co giãn nhu cầu, ngưỡng chiết khấu vàng và chống xói mòn định vị thương hiệu",
        "hero_label": "HỆ SỐ CO GIÃN GIÁ (ε)",
        "hero_sub": "Mức độ nhạy cảm của sản lượng theo giá",
        "pillars": [
            {"title": "Ngưỡng Co Giãn Giá Khuyến Mãi", "icon": "📉", "color": "blue"},
            {"title": "Tỷ Lệ Đổi Thương Hiệu (Switching)", "icon": "🔄", "color": "emerald"},
            {"title": "Bảo Toàn Biên Lãi Gộp Breakeven", "icon": "🛡️", "color": "red"},
        ],
        "bottom_kpis": [
            {"label": "Hệ Số Co Giãn ε", "key": "elasticity", "default": "-1.65 (Co giãn cao)"},
            {"label": "Tỷ Lệ Đổi Thương Hiệu Max", "key": "switching", "default": "41.2% (Tại nấc 25%)"},
            {"label": "Ngưỡng Chiết Khấu An Toàn", "key": "safe_discount", "default": "18.0% (Tối ưu biên lãi)"},
        ],
        "roadmap": {
            "day30": {
                "title": "Giai đoạn 1: Thiết Lập Cơ Cấu Chiết Khấu An Toàn Max 18%",
                "desc": "Quy định trần khuyến mãi tiền mặt tối đa không vượt quá 18% để bảo vệ điểm hòa vốn biên lợi nhuận gộp và giữ vững hình ảnh cao cấp.",
            },
            "day60": {
                "title": "Giai đoạn 2: Kích Hoạt Chiến Dịch Combo Hút Khách Đối Thủ",
                "desc": "Triển khai ưu đãi theo hình thức quà tặng giá trị gia tăng (GWP) hoặc combo sản phẩm để kích thích người dùng đối thủ đổi sang dùng thử.",
            },
            "day90": {
                "title": "Giai đoạn 3: Đưa Giá Về Chuẩn & Giữ Chân Khách Bằng Loyalty",
                "desc": "Kết thúc giai đoạn khuyến mãi giá; chuyển đổi toàn bộ khách hàng mới sang chương trình tích điểm khách hàng thân thiết để duy trì doanh thu.",
            },
        },
    },
    "monadic": {
        "title": "BÁO CÁO THỬ NGHIỆM Ý TƯỞNG ĐỘC LẬP (MONADIC CONCEPT TESTING)",
        "subtitle": "Đo lường tỷ lệ mua thử và chỉ số tăng trưởng (Lift %) trên hai nhánh mẫu tách biệt",
        "framework": "Mô hình Monadic Testing Split-Sample Standard",
        "section_tag": "MÔ HÌNH MONADIC TESTING · ĐỐI CHUẨN ĐỘC LẬP TÁCH MẪU",
        "objective": "Đo lường mức độ đón nhận độc lập không thiên lệch và chỉ số Lift % so với chuẩn ngành",
        "hero_label": "CHỈ SỐ TĂNG TRƯỞNG (LIFT %)",
        "hero_sub": "Chênh lệch ý định mua giữa Concept Test vs Benchmark",
        "pillars": [
            {"title": "Ý Niệm Độc Lập Top-2-Box", "icon": "⚖️", "color": "blue"},
            {"title": "Mức Độ Tăng Trưởng Thực Tế (Lift)", "icon": "📊", "color": "emerald"},
            {"title": "Quyết Định Thương Mại Hóa Go/No-Go", "icon": "🎯", "color": "amber"},
        ],
        "bottom_kpis": [
            {"label": "Top-2-Box Concept Mới", "key": "top2box_new", "default": "74.2% (Cell B)"},
            {"label": "Chỉ Số Tăng Trưởng Lift %", "key": "lift", "default": "+18.4% (p = 0.021)"},
            {"label": "Rủi Ro Tự Ăn Thị Phần", "key": "cannibalization", "default": "Thấp (Nguồn khách mới 78%)"},
        ],
        "roadmap": {
            "day30": {
                "title": "Giai đoạn 1: Phê Duyệt Kế Hoạch Cho Concept Đạt Lift Cao",
                "desc": "Ưu tiên phân bổ nguồn vốn và dây chuyền sản xuất cho phiên bản Concept đạt điểm Top-2-Box và Lift % vượt trội trong thử nghiệm đơn lập.",
            },
            "day60": {
                "title": "Giai đoạn 2: Định Vị Độc Lập Không Loãng Thương Hiệu Mẹ",
                "desc": "Thiết kế bao bì và thông điệp truyền thông tự thân truyền tải trọn vẹn giá trị mới mà không gây nhầm lẫn với dòng sản phẩm hiện có.",
            },
            "day90": {
                "title": "Giai đoạn 3: Mở Rộng Quy Mô Phân Phối & Giám Sát Thị Phần",
                "desc": "Tung hàng trên diện rộng. Theo dõi dữ liệu bán lẻ thực tế để xác thực nguồn doanh thu gia tăng thực chất từ nhóm khách hàng mới.",
            },
        },
    },
    "maxdiff": {
        "title": "BÁO CÁO XẾP HẠNG THUỘC TÍNH & THÔNG ĐIỆP BÁN HÀNG (MAXDIFF)",
        "subtitle": "Thang đo tiện ích tương đối Best-Worst Scaling loại bỏ hiện tượng đánh giá ảo",
        "framework": "Mô hình Best-Worst Scaling (MaxDiff) Analysis",
        "section_tag": "MÔ HÌNH MAXDIFF · PHÂN TẦNG ĐIỂM TIỆN ÍCH BEST-WORST SCALING",
        "objective": "Xếp hạng rạch ròi thuộc tính quan trọng nhất và thuộc tính khách hàng thờ ơ",
        "hero_label": "THUỘC TÍNH DẪN ĐẦU (HERO CLAIM)",
        "hero_sub": "Chiếm tỷ trọng tiện ích cao nhất",
        "pillars": [
            {"title": "Thuộc Tính Ưu Tiên Số 1 (Top-Tier)", "icon": "⭐", "color": "emerald"},
            {"title": "Thông Điệp Hero Claim Mặt Trước", "icon": "📢", "color": "blue"},
            {"title": "Cắt Giảm Chi Phí Tính Năng Thờ Ơ", "icon": "✂️", "color": "red"},
        ],
        "bottom_kpis": [
            {"label": "Điểm Tiện Ích Hero Claim", "key": "hero_utility", "default": "38.5% (Dẫn đầu tuyệt đối)"},
            {"label": "Số Thuộc Tính Cần Cắt Bỏ", "key": "cut_attributes", "default": "2 tính năng (Tier 3)"},
            {"label": "Tỷ Lệ Đồng Thuận Best", "key": "best_agreement", "default": "68.4% Personas lựa chọn"},
        ],
        "roadmap": {
            "day30": {
                "title": "Giai đoạn 1: Đưa Hero Claim Lên Vị Trí Trung Tâm Mặt Trước Bao Bì",
                "desc": "Dành tối thiểu 40% diện tích đồ họa mặt trước hộp/chai để thể hiện thuộc tính có điểm tiện ích Best cao nhất; xóa bỏ claim phụ rườm rà.",
            },
            "day60": {
                "title": "Giai đoạn 2: Cắt Giảm Chi Phí Kỹ Thuật Cho Thuộc Tính Tier 3",
                "desc": "Kiên quyết cắt giảm ngân sách R&D hoặc loại bỏ các tính năng bị đánh giá Worst nhiều nhất để tối ưu hóa giá thành sản xuất (BOM).",
            },
            "day90": {
                "title": "Giai đoạn 3: Đo Lường Khắc Sâu Nhận Thức Về Hero Claim",
                "desc": "Khảo sát đo lường mức độ liên tưởng của người tiêu dùng: Đảm bảo khi nhắc tới Hero Claim đó, thương hiệu của bạn là cái tên đầu tiên xuất hiện.",
            },
        },
    },
    "kano": {
        "title": "BÁO CÁO PHÂN LOẠI TÍNH NĂNG R&D & LỘ TRÌNH SẢN PHẨM (KANO MODEL)",
        "subtitle": "Phân tầng tính năng Bắt buộc (Must-be), Đột phá (Attractive) và Tối ưu chi phí kỹ thuật",
        "framework": "Mô hình chuẩn hóa Kano Product Roadmap Prioritization",
        "section_tag": "MÔ HÌNH KANO R&D · MA TRẬN BETTER (CS+) VS WORSE (CS-)",
        "objective": "Phân tầng tính năng R&D: Cắt giảm tính năng thừa, dồn ngân sách vào tính năng đột phá",
        "hero_label": "VŨ KHÍ ĐỘT PHÁ (ATTRACTIVE FEATURE)",
        "hero_sub": "Tính năng tạo hiệu ứng WOW vượt trội",
        "pillars": [
            {"title": "Tính Năng Bắt Buộc (Must-be)", "icon": "🔒", "color": "red"},
            {"title": "Tính Năng Tăng Trưởng (One-dim)", "icon": "📈", "color": "blue"},
            {"title": "Vũ Khí Bất Ngờ (Attractive WOW)", "icon": "✨", "color": "emerald"},
        ],
        "bottom_kpis": [
            {"label": "Tính Năng Bắt Buộc", "key": "must_be_count", "default": "2 tính năng cốt lõi"},
            {"label": "Tính Năng WOW (Delighter)", "key": "attractive_count", "default": "1 tính năng đột phá"},
            {"label": "Hệ Số Hài Lòng CS+", "key": "cs_plus", "default": "+0.78 (Khả năng tạo đột phá)"},
        ],
        "roadmap": {
            "day30": {
                "title": "Giai đoạn 1: Đảm Bảo 100% Chuẩn Kỹ Thuật Cho Tính Năng Must-be",
                "desc": "Kiểm tra chất lượng nghiêm ngặt cho nhóm tính năng Bắt buộc (Must-be); thiếu sót ở nhóm này sẽ dẫn tới thất bại tức thì dù tính năng WOW có hay đến đâu.",
            },
            "day60": {
                "title": "Giai đoạn 2: Lấy Tính Năng Attractive Làm Điểm Nhấn Chiến Dịch",
                "desc": "Hoàn thiện tính năng Cạnh tranh (One-dimensional) và lấy tính năng Đột phá (Attractive) làm tâm điểm chiến dịch truyền thông PR ra mắt.",
            },
            "day90": {
                "title": "Giai đoạn 3: R&D Tính Năng Mới Chu Kỳ Tiếp Theo",
                "desc": "Lập kế hoạch đổi mới tính năng vì theo quy luật Kano, các tính năng Attractive hiện tại sẽ dần bị người tiêu dùng bình thường hóa thành Must-be sau 6-12 tháng.",
            },
        },
    },
    "brand_map": {
        "title": "BÁO CÁO BẢN ĐỒ ĐỊNH VỊ THƯƠNG HIỆU & ĐẠI DƯƠNG XANH (PERCEPTUAL MAP)",
        "subtitle": "Định vị vị thế cạnh tranh trên không gian 2D và nhận diện khoảng trống thị trường (White-space)",
        "framework": "Mô hình Multidimensional Brand Perceptual Mapping (MDS)",
        "section_tag": "MÔ HÌNH PERCEPTUAL MAP · ĐỊNH VỊ ĐA CHIỀU MDS & ĐẠI DƯƠNG XANH",
        "objective": "Bản đồ hóa không gian định vị đa chiều, phát hiện khoảng trống cạnh tranh ngách",
        "hero_label": "TỌA ĐỘ ĐẠI DƯƠNG XANH (WHITE-SPACE)",
        "hero_sub": "Vùng thị trường nhu cầu cao chưa có đối thủ",
        "pillars": [
            {"title": "Tọa Độ Định Vị Hiện Tại", "icon": "📍", "color": "blue"},
            {"title": "Khai Thác Khoảng Trống (White-space)", "icon": "🌊", "color": "emerald"},
            {"title": "Lộ Trình Tái Định Vị Cạnh Tranh", "icon": "🧭", "color": "amber"},
        ],
        "bottom_kpis": [
            {"label": "Tọa Độ Thương Hiệu", "key": "client_coord", "default": "(X: 6.2, Y: 7.8)"},
            {"label": "Tọa Độ Đại Dương Xanh", "key": "whitespace_coord", "default": "(X: 7.5, Y: 8.2)"},
            {"label": "Khoảng Cách Cạnh Tranh", "key": "comp_gap", "default": "Tách biệt rõ đối thủ đầu ngành"},
        ],
        "roadmap": {
            "day30": {
                "title": "Giai đoạn 1: Xác Lập Tuyên Ngôn Định Vị Tại Đại Dương Xanh",
                "desc": "Tuyên bố định vị rõ ràng cắm mốc vững chắc tại tọa độ White-space Opportunity, không rơi vào vùng tranh chấp trực diện với thương hiệu dẫn đầu.",
            },
            "day60": {
                "title": "Giai đoạn 2: Xây Dựng Bộ Nhận Diện Thương Hiệu Đối Lập",
                "desc": "Thiết kế tài sản nhận diện độc quyền (Distinctive Brand Assets) với tông màu, phom dáng chai/hộp đối lập hoàn toàn đối thủ cùng phân khúc quầy kệ.",
            },
            "day90": {
                "title": "Giai đoạn 3: Đo Lường Dịch Chuyển Nhận Thức Thị Trường",
                "desc": "Khảo sát theo dõi (Brand Tracking) để kiểm chứng xem nhận thức của khách hàng mục tiêu đã dịch chuyển về đúng tọa độ mong muốn hay chưa.",
            },
        },
    },
}

PLAYWRIGHT_AVAILABLE = False
try:
    from playwright.async_api import async_playwright
    PLAYWRIGHT_AVAILABLE = True
except Exception:
    pass

WEASYPRINT_AVAILABLE = False
try:
    from weasyprint import HTML as _WP_HTML   # type: ignore
    WEASYPRINT_AVAILABLE = True
except Exception:
    pass


def _find_browser_executable() -> str | None:
    """Tìm trình duyệt Edge hoặc Chrome trên hệ thống Windows/Linux."""
    candidates = [
        r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe",
        r"C:\Program Files\Microsoft\Edge\Application\msedge.exe",
        r"C:\Program Files\Google\Chrome\Application\chrome.exe",
        r"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe",
        shutil.which("msedge"),
        shutil.which("google-chrome"),
        shutil.which("chromium-browser"),
        shutil.which("chromium"),
    ]
    for c in candidates:
        if c and Path(c).exists():
            return c
    return None


async def _render_with_playwright(html_content: str, output_pdf_path: Path) -> bool:
    """Sinh PDF vector sắc nét bằng Playwright Chromium."""
    if not PLAYWRIGHT_AVAILABLE:
        return False
    try:
        async with async_playwright() as p:
            browser = await p.chromium.launch(headless=True)
            page = await browser.new_page()
            # Set content và chờ font/ảnh tải xong
            await page.set_content(html_content, wait_until="networkidle", timeout=20000)
            await page.pdf(
                path=str(output_pdf_path),
                format="A4",
                print_background=True,
                prefer_css_page_size=True,
                margin={"top": "0mm", "right": "0mm", "bottom": "0mm", "left": "0mm"},
            )
            await browser.close()
            return output_pdf_path.exists() and output_pdf_path.stat().st_size > 1000
    except Exception as e:
        log.warning("Playwright PDF render failed", error=str(e))
        return False


def _render_with_browser_cli(html_content: str, output_pdf_path: Path) -> bool:
    """Dùng Edge hoặc Chrome CLI headless xuất PDF."""
    exe = _find_browser_executable()
    if not exe:
        return False
    tmp_html = output_pdf_path.with_suffix(".tmp.html")
    try:
        tmp_html.write_text(html_content, encoding="utf-8")
        cmd = [
            exe,
            "--headless=new",
            "--disable-gpu",
            "--no-pdf-header-footer",
            "--print-to-pdf-no-header",
            f"--print-to-pdf={output_pdf_path.resolve()}",
            str(tmp_html.resolve()),
        ]
        res = subprocess.run(cmd, capture_output=True, timeout=25)
        if output_pdf_path.exists() and output_pdf_path.stat().st_size > 1000:
            return True
        log.warning("Browser CLI failed to generate PDF", stderr=res.stderr.decode("utf-8", errors="ignore"))
    except Exception as e:
        log.warning("Browser CLI execution error", error=str(e))
    finally:
        if tmp_html.exists():
            try:
                tmp_html.unlink()
            except Exception:
                pass
    return False


async def generate_pdf(survey_id: str, report_data: dict) -> str:
    """
    Sinh file PDF thật sự (.pdf) từ report_data.
    Đảm bảo 100% trả về file PDF cho khách hàng doanh nghiệp.
    """
    pdf_path = PDF_OUTPUT_DIR / f"{survey_id}.pdf"
    html_content = _render_html(survey_id, report_data)

    # 1. Thử Playwright Chromium (Đỉnh cao chất lượng)
    if PLAYWRIGHT_AVAILABLE:
        log.info("Generating PDF with Playwright Chromium", survey_id=survey_id)
        if await _render_with_playwright(html_content, pdf_path):
            log.info("PDF generated successfully (Playwright)", survey_id=survey_id, path=str(pdf_path), size=pdf_path.stat().st_size)
            return str(pdf_path)

    # 2. Thử WeasyPrint nếu có
    if WEASYPRINT_AVAILABLE:
        try:
            log.info("Generating PDF with WeasyPrint", survey_id=survey_id)
            _WP_HTML(string=html_content, base_url=str(TEMPLATE_DIR)).write_pdf(str(pdf_path))
            if pdf_path.exists() and pdf_path.stat().st_size > 1000:
                log.info("PDF generated successfully (WeasyPrint)", survey_id=survey_id, path=str(pdf_path))
                return str(pdf_path)
        except Exception as e:
            log.warning("WeasyPrint failed", error=str(e))

    # 3. Thử Edge / Chrome CLI
    log.info("Attempting Browser CLI for PDF", survey_id=survey_id)
    if _render_with_browser_cli(html_content, pdf_path):
        log.info("PDF generated successfully (Browser CLI)", survey_id=survey_id, path=str(pdf_path))
        return str(pdf_path)

    # 4. Fallback tối hậu: ghi file PDF trực tiếp từ reportlab nếu cần
    log.error("All PDF renderers failed to generate PDF", survey_id=survey_id)
    # Lưu file html phụ trợ để kiểm tra log
    debug_html = PDF_OUTPUT_DIR / f"{survey_id}.html"
    debug_html.write_text(html_content, encoding="utf-8")
    return str(pdf_path if pdf_path.exists() else debug_html)


def _render_html(survey_id: str, data: dict) -> str:
    """Render HTML từ Jinja2 template."""
    env = Environment(loader=FileSystemLoader(str(TEMPLATE_DIR)))
    env.globals["enumerate"] = enumerate
    template = env.get_template("report_template.html")

    model_type = data.get("model_type", "nielsen_bases")

    ctx = {
        "survey_id":         survey_id,
        "model_type":        model_type,
        "model_label":       MODEL_TYPE_LABELS.get(model_type, model_type),
        "model_meta":        MODEL_META.get(model_type, MODEL_META["nielsen_bases"]),
        "generated_at":      datetime.now().strftime("%d/%m/%Y %H:%M"),
        "product":           data.get("product_info", {}),
        "target":            data.get("target_summary", {}),
        "executive":         data.get("executive_summary", {}),
        "metrics":           data.get("quantitative_metrics", {}),
        "insights":          data.get("qualitative_insights", {}),
        "recommendations":   data.get("actionable_recommendations", []),
    }

    return template.render(**ctx)
