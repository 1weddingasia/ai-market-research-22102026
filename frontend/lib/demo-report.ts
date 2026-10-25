/**
 * Hệ thống 9 báo cáo mẫu thực nghiệm (Full 9 Demo Reports) cho 9 phương pháp nghiên cứu thị trường.
 * Đồng bộ 100% với backend/models/demo_data.py.
 * Đảm bảo số liệu và giao diện giữa Dashboard 4 Tab và Trang In A4 6 Trang hoàn toàn đồng nhất.
 */

import type { ReportPayload } from './api';

export const DEMO_NIELSEN_BASES: ReportPayload = {
  "project_id": "DEMO-NIELSEN-BASES",
  "survey_id": "DEMO-NIELSEN-BASES",
  "model_type": "nielsen_bases",
  "product_info": {
    "company_name": "Tập đoàn Tiêu dùng & Thực phẩm Sạch Á Châu (Asia Food Corp)",
    "product_name": "Trà Kombucha Lên Men Men Xoài Cát Chu Tự Nhiên (330ml)",
    "category": "Thực phẩm & Đồ uống (FMCG / Nước giải khát)",
    "expected_price": "28.000đ / lon (160.000đ / lốc 6 lon)",
    "description": "Thức uống lên men tự nhiên từ trà đen hữu cơ và xoài Cát Chu Đồng Tháp, bổ sung 1 tỷ lợi khuẩn Bacillus Clausii, giảm 50% đường, hỗ trợ tiêu hóa và tăng cường miễn dịch cho giới văn phòng trẻ và gia đình hiện đại."
  },
  "target_summary": {
    "sample_size": 1000,
    "margin_of_error": "±3.10%",
    "location": "Toàn quốc (Bắc: 35%, Trung: 20%, Nam: 45%)",
    "demographics": "1.000 Tác tử AI Đô thị | Tuổi 22-45 | Phân khúc thu nhập A-B (>15 triệu/tháng) | Giới văn phòng & Gia đình trẻ",
    "targeting_summary": "1.000 Tác tử AI Đô thị | Tuổi 22-45 | Phân khúc thu nhập A-B (>15 triệu/tháng) | Giới văn phòng & Gia đình trẻ",
    "target_gender": "all",
    "target_income": "AB",
    "target_marital_status": "all",
    "target_occupation": "office",
    "target_zone": "urban"
  },
  "executive_summary": {
    "viability_score": 78,
    "verdict": "STRONG GO (ĐỦ ĐIỀU KIỆN RA MẮT TOÀN QUỐC)",
    "top_findings": [
      "Chỉ số ý định mua hàng Top-2-Box đạt 73.4%, vượt mức trung bình ngành nước giải khát tốt cho sức khỏe (benchmark 62%).",
      "Độ độc đáo (Uniqueness Score) đạt 8.2/10 nhờ định vị nguyên liệu bản địa 'Xoài Cát Chu Đồng Tháp' kết hợp công nghệ men vi sinh.",
      "Rào cản lớn nhất nằm ở mức giá 28.000đ/lon đang tiệm cận trần chấp nhận; 41% người tiêu dùng phân vân giữa lon đơn và lốc 6 lon."
    ]
  },
  "quantitative_metrics": {
    "appeal_score": 4.2,
    "uniqueness_score": 4.1,
    "purchase_intent_top2box": "73.4%",
    "demographic_breakdown": {
      "by_age": {
        "18-24": 28.0,
        "25-34": 44.0,
        "35-44": 22.0,
        "45+": 6.0
      },
      "by_gender": {
        "male": 48.5,
        "female": 51.5
      }
    },
    "model_specific": {
      "bases_viability_score": 78,
      "trial_rate": 73.4,
      "matrix_position": "Ngôi sao đột phá (Breakthrough Star)",
      "matrix_quadrant": "star",
      "flop_risk_index": 12,
      "bases_matrix": [
        {
          "dimension": "Độ hấp dẫn ý tưởng (Relevance)",
          "score": 82,
          "benchmark": 65
        },
        {
          "dimension": "Tính mới lạ độc đáo (Uniqueness)",
          "score": 84,
          "benchmark": 60
        },
        {
          "dimension": "Mức độ tin cậy bao bì (Believability)",
          "score": 76,
          "benchmark": 70
        },
        {
          "dimension": "Độ tương xứng giá/giá trị (Value for Money)",
          "score": 68,
          "benchmark": 66
        },
        {
          "dimension": "Khả năng mua lại (Repeat Purchase Intent)",
          "score": 79,
          "benchmark": 58
        }
      ],
      "net_promoter_score": 54,
      "deepseek_audit": {
        "auditor_model": "Chuyên Gia Phân Tích Chiến Lược Độc Lập",
        "auditor_seal": "Chứng Nhận Đánh Giá Độc Lập Dành Cho Ban Giám Đốc",
        "data_consistency_audit": "Kiểm định 1.000 tác tử AI đại diện đối chiếu khung đối chuẩn phân tầng Niên giám GSO: Phân phối chuẩn p < 0.05. Tương quan giữa tính Độc đáo và Ý định mua đạt r = 0.76 (rất mạnh).",
        "executive_verdict": "Dự án 'Trà Kombucha Xoài Cát Chu' đạt điểm khả thi 78/100 (Strong Go). Đạt ngưỡng an toàn vượt trội ở chỉ số thử nghiệm (Trial Rate), nhưng cần giải tỏa rào cản nhạy cảm giá 28.000đ bằng chiến lược combo ban đầu.",
        "strategic_pillars": [
          {
            "pillar_name": "Tối ưu hóa Khái niệm & USP",
            "icon": "💡",
            "recommendation": "Khai thác tối đa bảo chứng xuất xứ 'Xoài Cát Chu Đồng Tháp' và '1 tỷ lợi khuẩn Bacillus Clausii' làm Hero Claims trên mặt chính bao bì."
          },
          {
            "pillar_name": "Kích hoạt Dùng thử (Trial Rate)",
            "icon": "🎯",
            "recommendation": "Triển khai ưu đãi ra mắt lốc 6 lon với mức giá dùng thử 149.000đ tại các chuỗi cửa hàng tiện lợi TP.HCM và Hà Nội để phá vỡ rào cản mua lần đầu."
          },
          {
            "pillar_name": "Rào chắn Giảm Rủi ro Thất bại",
            "icon": "🛡️",
            "recommendation": "Đính chính rõ thông điệp 'Đồ uống không cồn (< 0.5%)' để giải tỏa triệt để băn khoăn của phụ nữ mang thai và người tiêu dùng gia đình."
          }
        ],
        "critical_risks": [
          "Rủi ro định vị nhầm lẫn: 28% người tiêu dùng lớn tuổi có thể ngộ nhận Kombucha là bia hoặc thức uống có men say nếu nhãn mác không ghi rõ không cồn.",
          "Rủi ro cạnh tranh trên kệ lạnh: Cạnh tranh gay gắt từ các thương hiệu trà hữu cơ đóng chai có ngân sách khuyến mãi và thị phần ổn định."
        ]
      }
    }
  },
  "qualitative_insights": {
    "top_drivers": [
      "Nguyên liệu xoài Cát Chu tạo cảm giác tươi ngon nhiệt đới thân quen, dễ uống hơn vị chua gắt của Kombucha truyền thống.",
      "Lợi khuẩn cho hệ vi sinh đường ruột và giảm 50% đường đánh trúng tâm lý phòng ngừa tiểu đường và giữ dáng.",
      "Quy cách lon nhôm 330ml tiện lợi, thiết kế phong cách hiện đại thích hợp đặt trên bàn làm việc."
    ],
    "top_barriers": [
      "Mức giá 28.000đ cao hơn nước ngọt có ga và trà đóng chai phổ thông (10.000đ - 15.000đ).",
      "Một bộ phận người tiêu dùng lớn tuổi chưa hiểu rõ khái niệm 'Kombucha' và e ngại men sống lên men có cồn nhẹ.",
      "Mong muốn có thêm chính sách dùng thử hoặc combo tặng kèm tại các chuỗi cửa hàng tiện lợi."
    ],
    "verbatim_quotes": [
      {
        "name": "Nguyễn Thảo My",
        "age": 27,
        "job": "Chuyên viên Truyền thông & PR (TP.HCM)",
        "income": "18 - 25 triệu/tháng",
        "quote": "Mình rất thích xoài Cát Chu vì ngọt thanh thơm đặc trưng. Kombucha ngoài thị trường thường bị chua gắt, nếu vị xoài này giữ được độ chua ngọt cân bằng thì mình sẵn sàng mua uống hàng ngày tại công ty.",
        "sentiment": "positive"
      },
      {
        "name": "Trần Hoàng Long",
        "age": 24,
        "job": "Nhân viên Kinh doanh BĐS (Đà Nẵng)",
        "income": "9 - 14 triệu/tháng",
        "quote": "Sản phẩm tốt, nhưng giá 28k một lon thì hơi cao so với thu nhập hàng ngày của sinh viên và nhân viên mới đi làm. Nếu bán lốc 6 lon với giá ưu đãi tầm 140k tuần đầu thì sẽ dễ chốt đơn hơn.",
        "sentiment": "negative"
      },
      {
        "name": "Phạm Minh Đức",
        "age": 38,
        "job": "Kỹ sư Phần mềm Senior (Hà Nội)",
        "income": "25 - 35 triệu/tháng",
        "quote": "Gia đình tôi hiện tại chuyển hẳn sang đồ uống ít đường và men vi sinh. Điểm mấu chốt là nhãn hàng phải công bố rõ hàm lượng đường thực tế và chứng chỉ vệ sinh an toàn thực phẩm trên bao bì.",
        "sentiment": "neutral"
      },
      {
        "name": "Lê Hải Yến",
        "age": 31,
        "job": "Quản lý Nhân sự (Cần Thơ)",
        "income": "15 - 20 triệu/tháng",
        "quote": "Lon thiết kế đẹp, nhìn cao cấp giống mấy dòng nước ép nhập khẩu. Mua làm quà biếu đồng nghiệp hoặc mời khách đến nhà cũng thấy sang.",
        "sentiment": "positive"
      }
    ]
  },
  "actionable_recommendations": [
    "Chiến lược Giá & Kích hoạt: Duy trì mức giá niêm yết 28.000đ nhưng áp dụng ưu đãi ra mắt 'Combo Trải Nghiệm Lốc 6 Lon 149.000đ' để vượt qua rào cản giá ban đầu.",
    "Thông điệp Truyền thông: Tập trung truyền thông 2 trụ cột: 'Vị ngon ngọt thanh xoài Cát Chu chín cây' và '1 tỷ lợi khuẩn sống bảo vệ tiêu hóa', tránh dùng từ ngữ y khoa khó hiểu.",
    "Kênh Phân phối Ưu tiên: Tập trung phủ sóng tại các chuỗi cửa hàng tiện lợi (GS25, Circle K, 7-Eleven) và siêu thị cao cấp (Annam Gourmet, WinMart+) tại TP.HCM và Hà Nội trước khi mở rộng tỉnh thành.",
    "Truyền thông Giáo dục thị trường: Cung cấp thông tin rõ ràng về nồng độ cồn < 0.5% (được công nhận là đồ uống không cồn) để gỡ bỏ băn khoăn của nhóm khách hàng gia đình."
  ],
  "generated_at": "2026-10-23T16:19:16.639838"
};

export const DEMO_VAN_WESTENDORP: ReportPayload = {
  "project_id": "DEMO-VAN-WESTENDORP",
  "survey_id": "DEMO-VAN-WESTENDORP",
  "model_type": "van_westendorp",
  "product_info": {
    "company_name": "Công ty Cổ phần Cà phê & Nông sản Cao nguyên LangBiang (LangBiang Coffee Roasters)",
    "product_name": "Cà Phê Cold Brew Hữu Cơ Đóng Lon 250ml - Arabica Cầu Đất",
    "category": "Cà phê & Đồ uống đóng chai sẵn (RTD Coffee)",
    "expected_price": "35.000đ / lon",
    "description": "Cà phê ủ lạnh 24 giờ từ 100% hạt Arabica Cầu Đất (Đà Lạt) đạt chứng nhận hữu cơ USDA, vị êm dịu ít chua, không đường hóa học, đóng lon nhôm tiện lợi mang đi làm."
  },
  "target_summary": {
    "sample_size": 1000,
    "margin_of_error": "±3.10%",
    "location": "TP. Hồ Chí Minh & Hà Nội (Khu vực Đô Thị)",
    "demographics": "1.000 Tác tử AI Đô thị | Tuổi 22-40 | Thu nhập A-B (>15 triệu/tháng) | Giới văn phòng & Trí thức",
    "targeting_summary": "1.000 Tác tử AI Đô thị | Tuổi 22-40 | Thu nhập A-B (>15 triệu/tháng) | Giới văn phòng & Trí thức",
    "target_gender": "all",
    "target_income": "AB",
    "target_marital_status": "all",
    "target_occupation": "office",
    "target_zone": "urban"
  },
  "executive_summary": {
    "viability_score": 82,
    "verdict": "VƯỢT TRỘI (ĐIỂM GIÁ TỐI ƯU OPP: 32.000đ - KHOẢNG GIÁ AN TOÀN: 25.000đ - 42.000đ)",
    "top_findings": [
      "Điểm giá tối ưu doanh thu (OPP) xác lập ở mức 32.000đ/lon — mức giá tối thiểu hóa kháng cự tâm lý của khách hàng văn phòng.",
      "Khoảng giá thị trường chấp nhận được (Acceptable Price Range) dao động từ 25.000đ (giá sàn PMC) đến 42.000đ (giá trần PME).",
      "Mức giá kỳ vọng 35.000đ của doanh nghiệp nằm hoàn hảo trong vùng hòa nhập thị trường (IDP 35.000đ), có thể định vị phân khúc cao cấp."
    ]
  },
  "quantitative_metrics": {
    "appeal_score": 4.3,
    "uniqueness_score": 4.0,
    "purchase_intent_top2box": "76.5%",
    "demographic_breakdown": {
      "by_age": {
        "18-24": 22.0,
        "25-34": 52.0,
        "35-44": 20.0,
        "45+": 6.0
      },
      "by_gender": {
        "male": 52.0,
        "female": 48.0
      }
    },
    "model_specific": {
      "opp": 32000,
      "optimal_price": 32000,
      "pmc": 25000,
      "pme": 42000,
      "idp": 35000,
      "ipp": 35000,
      "indifference_price": 35000,
      "acceptable_range": [
        25000,
        42000
      ],
      "price_range_min": 25000,
      "price_range_max": 42000,
      "price_curves": [
        {
          "price": 20000,
          "too_cheap": 78,
          "cheap": 85,
          "expensive": 4,
          "too_expensive": 1
        },
        {
          "price": 25000,
          "too_cheap": 42,
          "cheap": 68,
          "expensive": 15,
          "too_expensive": 3
        },
        {
          "price": 30000,
          "too_cheap": 18,
          "cheap": 54,
          "expensive": 28,
          "too_expensive": 7
        },
        {
          "price": 32000,
          "too_cheap": 11,
          "cheap": 45,
          "expensive": 45,
          "too_expensive": 12
        },
        {
          "price": 35000,
          "too_cheap": 6,
          "cheap": 34,
          "expensive": 58,
          "too_expensive": 25
        },
        {
          "price": 38000,
          "too_cheap": 3,
          "cheap": 22,
          "expensive": 68,
          "too_expensive": 38
        },
        {
          "price": 42000,
          "too_cheap": 1,
          "cheap": 12,
          "expensive": 79,
          "too_expensive": 52
        },
        {
          "price": 45000,
          "too_cheap": 0,
          "cheap": 5,
          "expensive": 88,
          "too_expensive": 68
        },
        {
          "price": 50000,
          "too_cheap": 0,
          "cheap": 1,
          "expensive": 95,
          "too_expensive": 92
        }
      ],
      "curves": {
        "too_cheap": [
          {
            "price": 20000,
            "pct": 78
          },
          {
            "price": 25000,
            "pct": 42
          },
          {
            "price": 30000,
            "pct": 18
          },
          {
            "price": 35000,
            "pct": 6
          },
          {
            "price": 45000,
            "pct": 1
          }
        ],
        "cheap": [
          {
            "price": 20000,
            "pct": 85
          },
          {
            "price": 25000,
            "pct": 68
          },
          {
            "price": 32000,
            "pct": 45
          },
          {
            "price": 38000,
            "pct": 22
          },
          {
            "price": 45000,
            "pct": 5
          }
        ],
        "expensive": [
          {
            "price": 20000,
            "pct": 4
          },
          {
            "price": 25000,
            "pct": 15
          },
          {
            "price": 32000,
            "pct": 45
          },
          {
            "price": 38000,
            "pct": 68
          },
          {
            "price": 45000,
            "pct": 88
          }
        ],
        "too_expensive": [
          {
            "price": 20000,
            "pct": 1
          },
          {
            "price": 28000,
            "pct": 8
          },
          {
            "price": 35000,
            "pct": 25
          },
          {
            "price": 42000,
            "pct": 52
          },
          {
            "price": 50000,
            "pct": 92
          }
        ]
      },
      "deepseek_audit": {
        "auditor_model": "Chuyên Gia Định Giá Kinh Tế Học Vi Mô",
        "auditor_seal": "Chứng Nhận Thẩm Định Giá Van Westendorp Chuẩn Quốc Tế",
        "data_consistency_audit": "Dữ liệu đo lường độ nhạy cảm giá từ 1.000 tác tử AI văn phòng TP.HCM và Hà Nội. 4 đường cong tích lũy giao cắt rõ nét tại OPP = 32.000đ và IDP = 35.000đ.",
        "executive_verdict": "Mức giá đề xuất 35.000đ hoàn toàn khả thi nếu đi kèm chứng nhận Hữu cơ Arabica Cầu Đất. Không nên bán dưới 25.000đ vì sẽ gây nghi ngờ chất lượng cà phê pha hương liệu.",
        "strategic_pillars": [
          {
            "pillar_name": "Điểm Giá Tối Ưu (OPP)",
            "icon": "💎",
            "recommendation": "Định giá niêm yết 35.000đ và áp dụng giá ưu đãi dùng thử 32.000đ trong 60 ngày đầu ra mắt."
          },
          {
            "pillar_name": "Bảo Toàn Giá Trị Thương Hiệu (IPP)",
            "icon": "⚖️",
            "recommendation": "Nhấn mạnh công nghệ ủ lạnh Cold Brew 24h và chứng nhận hữu cơ để định vị ngang hàng Starbucks RTD nhưng giá cạnh tranh hơn."
          },
          {
            "pillar_name": "Biên Độ Chấp Nhận & Phân Tầng Giá",
            "icon": "📊",
            "recommendation": "Thiết kế combo tuần 5 lon giá 150.000đ (tương đương 30.000đ/lon) để tối đa hóa lượng tiêu thụ định kỳ."
          }
        ],
        "critical_risks": [
          "Rủi ro bán giá dưới 25.000đ sẽ khiến 42% khách hàng nghi ngờ cà phê trộn bắp hoặc dùng hương liệu tổng hợp.",
          "Rủi ro bán giá trên 42.000đ sẽ mất ngay 52% khách hàng sang các quán cà phê take-away tươi."
        ]
      }
    }
  },
  "qualitative_insights": {
    "top_drivers": [
      "Arabica Cầu Đất ủ lạnh êm dịu, không gây ợ chua hay bồn chồn tim như cà phê phin thông thường.",
      "Lon nhôm cao cấp, giữ lạnh tốt, tiện bỏ vào balo mang đi làm buổi sáng.",
      "Xu hướng tiêu dùng đồ uống sạch, hữu cơ không đường đang thịnh hành ở các cao ốc văn phòng."
    ],
    "top_barriers": [
      "Thói quen mua cà phê tươi ở quán ven đường với giá 20.000đ - 25.000đ vẫn rất phổ biến.",
      "Cần chứng minh cà phê đóng lon vẫn giữ trọn hương vị như pha tại quán Specialty.",
      "Thiếu các lựa chọn hương vị bổ sung như Cold Brew Cam Sả hoặc Sữa Yến Mạch."
    ],
    "verbatim_quotes": [
      {
        "name": "Trịnh Quốc Huy",
        "age": 29,
        "job": "Trưởng nhóm Thiết kế UI/UX (Hà Nội)",
        "income": "22 - 30 triệu/tháng",
        "quote": "Mình uống Cold Brew mỗi sáng. Giá 35k lon 250ml Arabica Cầu Đất là cực kỳ hợp lý, ở các chuỗi thương hiệu cà phê lớn một ly Cold Brew đã 55k-65k rồi.",
        "sentiment": "positive"
      },
      {
        "name": "Hoàng Minh Tuấn",
        "age": 34,
        "job": "Giám đốc Kinh doanh Vận tải (TP.HCM)",
        "income": "30 - 45 triệu/tháng",
        "quote": "Nếu đúng chuẩn hạt Cầu Đất nguyên chất ủ lạnh thì giá 35k-40k tôi mua uống hàng ngày. Nhưng phải đóng lon nhôm xịn và có nắp giật chắc chắn.",
        "sentiment": "positive"
      },
      {
        "name": "Ngô Thị Mai Anh",
        "age": 25,
        "job": "Nhân viên Ngân hàng (Hải Phòng)",
        "income": "12 - 16 triệu/tháng",
        "quote": "Giá 35k hơi cao so với cà phê sữa lon thông thường 15k. Nếu có chương trình đăng ký gói tháng giảm còn 28k/lon thì mình sẽ đặt uống đều đặn.",
        "sentiment": "negative"
      }
    ]
  },
  "actionable_recommendations": [
    "Định giá niêm yết: Đặt giá niêm yết chính thức 35.000đ/lon và giá khuyến mãi giai đoạn thâm nhập 32.000đ/lon.",
    "Gói đăng ký tuần/tháng: Triển khai Subscription Box 20 lon/tháng giá 580.000đ (29.000đ/lon) giao tận bàn làm việc.",
    "Kênh bán hàng trọng điểm: Tập trung máy bán hàng tự động tại các tòa nhà văn phòng hạng A/B và app giao hàng nhanh GrabMart, ShopeeFood.",
    "Cam kết chất lượng: In mã QR truy xuất nguồn gốc nông trại Cầu Đất và ngày ủ lạnh trực tiếp trên đáy lon."
  ],
  "generated_at": "2026-10-23T16:19:16.639891"
};

export const DEMO_AB_TESTING: ReportPayload = {
  "project_id": "DEMO-AB-TESTING",
  "survey_id": "DEMO-AB-TESTING",
  "model_type": "ab_testing",
  "product_info": {
    "company_name": "Công ty Bánh kẹo & Quà tặng Hoàng Gia Delica Crown (Delica Bakery VN)",
    "product_name": "Hộp Quà Bánh Quy Bơ Thảo Mộc Hoàng Gia Delica (Bộ Sưu Tập Lễ Hội)",
    "category": "Bánh kẹo & Quà tặng cao cấp (Premium Confectionery)",
    "option_a_description": "Concept A (Hiện Đại Tối Giản): Tone màu xanh navy trầm ánh kim, họa tiết dập nổi tối giản phong cách Bắc Âu Scandinavian, hướng tới giới trẻ và doanh nghiệp hiện đại.",
    "option_b_description": "Concept B (Truyền Thống Hoàng Gia): Tone màu đỏ bordeaux phối viền vàng gold cổ điển, họa tiết vương miện phong cách hoàng gia truyền thống.",
    "brand_name": "Delica Crown Heritage"
  },
  "target_summary": {
    "sample_size": 1000,
    "margin_of_error": "±3.10%",
    "location": "Toàn quốc (Đô thị 65%, Nông thôn 35%)",
    "demographics": "1.000 Tác tử AI Đa Nhân Khẩu | Tuổi 20-55 | Người mua sắm quà tặng gia đình & doanh nghiệp",
    "targeting_summary": "1.000 Tác tử AI Đa Nhân Khẩu | Tuổi 20-55 | Người mua sắm quà tặng gia đình & doanh nghiệp",
    "target_gender": "all",
    "target_income": "all",
    "target_marital_status": "all",
    "target_occupation": "all",
    "target_zone": "all"
  },
  "executive_summary": {
    "viability_score": 85,
    "verdict": "PHƯƠNG ÁN A CHIẾN THẮNG ÁP ĐẢO (WIN RATE 63.8% VS 36.2% CỦA PHƯƠNG ÁN B)",
    "top_findings": [
      "Phương án A (Tối Giản Bắc Âu) giành chiến thắng áp đảo với 63.8% thị phần ưu tiên so với 36.2% của Phương án B.",
      "Chỉ số thu hút thị giác (Stopping Power) của Phương án A vượt trội +22% nhờ màu xanh navy ánh kim tạo cảm giác sang trọng mới lạ.",
      "Nhóm khách hàng trẻ và văn phòng (22-38 tuổi) ủng hộ Phương án A lên tới 71.4%, trong khi Phương án B chỉ có ưu thế ở nhóm tuổi trên 45."
    ]
  },
  "quantitative_metrics": {
    "appeal_score": 4.4,
    "uniqueness_score": 4.2,
    "purchase_intent_top2box": "78.2%",
    "demographic_breakdown": {
      "by_age": {
        "18-24": 26.0,
        "25-34": 42.0,
        "35-44": 22.0,
        "45+": 10.0
      },
      "by_gender": {
        "male": 46.0,
        "female": 54.0
      }
    },
    "model_specific": {
      "winner": "A",
      "win_rate_a": 63.8,
      "win_rate_b": 36.2,
      "dimensions": [
        {
          "criteria": "Sức hút thị giác trên kệ hàng (Stopping Power)",
          "score_a": 84,
          "score_b": 62,
          "diff": "+22%",
          "winner": "A"
        },
        {
          "criteria": "Cảm giác cao cấp & Tinh tế (Premium Feel)",
          "score_a": 86,
          "score_b": 67,
          "diff": "+19%",
          "winner": "A"
        },
        {
          "criteria": "Kích thích quyết định mua làm quà biếu (Gift Persuasion)",
          "score_a": 81,
          "score_b": 69,
          "diff": "+12%",
          "winner": "A"
        },
        {
          "criteria": "Độ quen thuộc & Cảm giác truyền thống (Familiarity)",
          "score_a": 58,
          "score_b": 82,
          "diff": "+24% (B)",
          "winner": "B"
        }
      ],
      "scorecard": [
        {
          "attribute": "Sức hút thị giác trên kệ hàng (Stopping Power)",
          "score_a": 84,
          "score_b": 62,
          "delta": "+22%",
          "winner": "A"
        },
        {
          "attribute": "Cảm giác cao cấp & Tinh tế (Premium Feel)",
          "score_a": 86,
          "score_b": 67,
          "delta": "+19%",
          "winner": "A"
        },
        {
          "attribute": "Kích thích quyết định mua làm quà biếu (Gift Persuasion)",
          "score_a": 81,
          "score_b": 69,
          "delta": "+12%",
          "winner": "A"
        },
        {
          "attribute": "Độ quen thuộc & Cảm giác truyền thống (Familiarity)",
          "score_a": 58,
          "score_b": 82,
          "delta": "-24%",
          "winner": "B"
        }
      ],
      "deepseek_audit": {
        "auditor_model": "Chuyên Gia Thẩm Định Bao Bì & Thị Giác Kantar Link",
        "auditor_seal": "Chứng Nhận Thẩm Định Đối Đầu A/B Chuẩn Quốc Tế",
        "data_consistency_audit": "Thử nghiệm đối đầu trên 1.000 tác tử AI. Phương án A thể hiện tính vượt trội có ý nghĩa thống kê cao (p < 0.01) ở mọi tiêu chí thẩm mỹ hiện đại.",
        "executive_verdict": "Khuyến nghị Hội đồng Quản trị chọn Phương án A làm bao bì chủ lực cho mùa lễ hội. Phương án B chỉ nên phát hành phiên bản giới hạn cho tệp khách hàng truyền thống.",
        "strategic_pillars": [
          {
            "pillar_name": "Phương Án Chiến Thắng & Lợi Thế Cốt Lõi",
            "icon": "🏆",
            "recommendation": "Đưa Concept A vào sản xuất hàng loạt ngay để kịp mùa cao điểm quà tặng cuối năm."
          },
          {
            "pillar_name": "Khắc Phục Điểm Nghẽn Mẫu Thua",
            "icon": "🔍",
            "recommendation": "Concept B bị đánh giá là 'lối mòn, giống các hộp bánh thiếc cũ', cần trẻ hóa nếu muốn duy trì."
          },
          {
            "pillar_name": "Kế Hoạch Triển Khai Hoàn Thiện",
            "icon": "📦",
            "recommendation": "Gia công bề mặt dập nổi kim loại và kèm túi giấy đồng bộ tone màu navy sang trọng."
          }
        ],
        "critical_risks": [
          "Rủi ro nhận diện: Nhóm khách hàng lớn tuổi (> 50 tuổi) có thể mất vài giây để nhận ra thương hiệu quen thuộc do màu sắc đổi từ đỏ sang xanh."
        ]
      }
    }
  },
  "qualitative_insights": {
    "top_drivers": [
      "Màu xanh navy ánh kim tạo cảm giác tinh tế, thanh lịch, thích hợp tặng sếp, đối tác công ty và bạn bè.",
      "Họa tiết hình học dập nổi nhìn hiện đại và không bị sến như các mẫu bao bì Tết truyền thống.",
      "Túi xách đi kèm quai lụa làm tăng giá trị món quà khi mang đi biếu."
    ],
    "top_barriers": [
      "Một số người lớn tuổi vẫn chuộng màu đỏ - vàng vì quan niệm phong thủy may mắn đầu năm.",
      "Cần in chữ tiếng Việt rõ ràng ở mặt sau về hạn sử dụng và thành phần dinh dưỡng."
    ],
    "verbatim_quotes": [
      {
        "name": "Trần Thu Hà",
        "age": 31,
        "job": "Trưởng phòng Mua hàng Doanh nghiệp (TP.HCM)",
        "income": "28 - 35 triệu/tháng",
        "quote": "Mẫu A nhìn sang trọng và tinh tế hơn hẳn. Công ty tôi đặt quà tặng đối tác nước ngoài và nhân viên văn phòng trẻ thì mẫu A chắc chắn được chấm 10/10.",
        "sentiment": "positive"
      },
      {
        "name": "Vũ Đình Trọng",
        "age": 49,
        "job": "Chủ Doanh nghiệp Cơ khí (Bình Dương)",
        "income": "40 - 60 triệu/tháng",
        "quote": "Mẫu A nhìn đẹp nhưng cá nhân tôi tặng họ hàng ở quê thì vẫn thích màu đỏ của mẫu B hơn, có không khí Tết ấm cúng.",
        "sentiment": "neutral"
      },
      {
        "name": "Đặng Thị Phương Linh",
        "age": 26,
        "job": "Chuyên viên Marketing (Hà Nội)",
        "income": "16 - 22 triệu/tháng",
        "quote": "Mẫu B nhìn hơi giống các hộp bánh đại trà ngoài chợ. Mẫu A phong cách Bắc Âu nhìn đẳng cấp, chụp ảnh đăng mạng xã hội cũng đẹp.",
        "sentiment": "positive"
      }
    ]
  },
  "actionable_recommendations": [
    "Kế hoạch Sản xuất: Phân bổ 80% sản lượng cho Phương án A (Navy Bắc Âu) và 20% cho Phương án B phục vụ tệp khách hàng hoài niệm.",
    "Tối ưu Chi tiết In ấn: Dập chìm logo thương hiệu kết hợp ép kim foil vàng trên nền nhám mờ để chống bám vân tay.",
    "Truyền thông Hình ảnh: Chụp lookbook sản phẩm trong không gian tiệc trà hiện đại và không gian văn phòng doanh nghiệp."
  ],
  "generated_at": "2026-10-23T16:19:16.639927"
};

export const DEMO_MONADIC: ReportPayload = {
  "project_id": "DEMO-MONADIC",
  "survey_id": "DEMO-MONADIC",
  "model_type": "monadic",
  "product_info": {
    "company_name": "Công ty Cổ phần Thực phẩm Dinh dưỡng Bản địa VinaBroth Foods (VinaBroth Nutrition)",
    "product_name": "Nước Cốt Hầm Xương & Thảo Dược Tinh Hoa Tiện Lợi (Gói 150g)",
    "concept_a_title": "Concept A: Súp Xương Hầm Bổ Sung Collagen & Đông Trùng",
    "concept_a_description": "Nước cốt xương hầm 12h kết hợp chiết xuất đông trùng hạ thảo và collagen peptid, định vị trẻ hóa làn da và bồi bổ sức khỏe cho phụ nữ văn phòng bận rộn.",
    "concept_b_title": "Concept B: Súp Xương Hầm Bổ Sung Nấm Linh Chi & Yến Mạch",
    "concept_b_description": "Nước cốt xương hầm kết hợp nấm linh chi đỏ và yến mạch hữu cơ, định vị kiểm soát đường huyết và tăng sức đề kháng cho cả gia đình."
  },
  "target_summary": {
    "sample_size": 1000,
    "margin_of_error": "±3.10%",
    "location": "TP. Hồ Chí Minh & Đông Nam Bộ (Khu vực Đô Thị)",
    "demographics": "1.000 Tác tử AI Đô thị | Tuổi 24-48 | Phụ nữ gia đình & Người chăm sóc sức khỏe gia đình",
    "targeting_summary": "1.000 Tác tử AI Đô thị | Tuổi 24-48 | Phụ nữ gia đình & Người chăm sóc sức khỏe gia đình",
    "target_gender": "female",
    "target_income": "AB",
    "target_marital_status": "married",
    "target_occupation": "all",
    "target_zone": "urban"
  },
  "executive_summary": {
    "viability_score": 80,
    "verdict": "CONCEPT A VƯỢT TRỘI VỀ Ý ĐỊNH MUA (+20.6% LIFT TOP-2-BOX)",
    "top_findings": [
      "Concept A (Collagen & Đông Trùng) đạt ý định mua Top-2-Box 74.2%, vượt trội +20.6% so với Concept B (61.5%).",
      "Chỉ số cảm nhận giá trị (Value for Money) của Concept A đạt 78% nhờ sự cộng hưởng của thành phần Collagen dưỡng da.",
      "Nhóm phụ nữ 25-38 tuổi sẵn sàng chi trả mức giá 45.000đ/gói cho Concept A cao hơn hẳn Concept B."
    ]
  },
  "quantitative_metrics": {
    "appeal_score": 4.2,
    "uniqueness_score": 4.1,
    "purchase_intent_top2box": "74.2%",
    "demographic_breakdown": {
      "by_age": {
        "18-24": 15.0,
        "25-34": 48.0,
        "35-44": 30.0,
        "45+": 7.0
      },
      "by_gender": {
        "male": 0.0,
        "female": 100.0
      }
    },
    "model_specific": {
      "winner": "A",
      "winning_title": "Concept A (Collagen & Đông Trùng)",
      "lift_percentage": 20.6,
      "concept_a": {
        "title": "Concept A (Collagen & Đông Trùng)",
        "sample_size": 500,
        "top2box": 74.2,
        "uniqueness": 4.3,
        "relevance": 4.2,
        "value_ratio": 78.0,
        "price": "45.000đ"
      },
      "concept_b": {
        "title": "Concept B (Linh Chi & Yến Mạch)",
        "sample_size": 500,
        "top2box": 61.5,
        "uniqueness": 3.7,
        "relevance": 3.8,
        "value_ratio": 64.0,
        "price": "45.000đ"
      },
      "comparisons": [
        {
          "metric": "Ý định mua thử (Top-2-Box)",
          "score_a": "74.2%",
          "score_b": "61.5%",
          "diff": "+20.6%",
          "winner": "A"
        },
        {
          "metric": "Mức độ độc đáo (Uniqueness)",
          "score_a": "4.3 / 5",
          "score_b": "3.7 / 5",
          "diff": "+16.2%",
          "winner": "A"
        },
        {
          "metric": "Mức độ phù hợp nhu cầu (Relevance)",
          "score_a": "4.2 / 5",
          "score_b": "3.8 / 5",
          "diff": "+10.5%",
          "winner": "A"
        },
        {
          "metric": "Tương xứng giá trị (Value for Money)",
          "score_a": "78.0%",
          "score_b": "64.0%",
          "diff": "+21.9%",
          "winner": "A"
        }
      ],
      "deepseek_audit": {
        "auditor_model": "Chuyên Gia Thử Nghiệm Ý Niệm Độc Lập Monadic",
        "auditor_seal": "Chứng Nhận Thẩm Định Split-Sample Quốc Tế",
        "data_consistency_audit": "Hai nhánh mẫu độc lập 500 tác tử AI được phân bổ tương đương về tuổi, thu nhập và thói quen nấu ăn. Không có hiện tượng thiên lệch mẫu giữa hai nhánh.",
        "executive_verdict": "Concept A sở hữu sức hút thương mại rõ ràng hơn hẳn nhờ đánh trúng tâm lý vừa muốn nấu ăn nhanh vừa muốn làm đẹp da của phụ nữ hiện đại.",
        "strategic_pillars": [
          {
            "pillar_name": "Hiệu Suất Ý Niệm Độc Lập",
            "icon": "⚖️",
            "recommendation": "Tập trung 100% ngân sách R&D vào Concept A để chuẩn bị thương mại hóa quý tới."
          },
          {
            "pillar_name": "Mức Độ Chênh Lệch (Lift %)",
            "icon": "📊",
            "recommendation": "Mức tăng trưởng +20.6% bảo đảm khả năng hoàn vốn và tỷ lệ quay lại mua cao."
          },
          {
            "pillar_name": "Quyết Định Lựa Chọn Khái Niệm Tối Ưu",
            "icon": "🎯",
            "recommendation": "Đăng ký bảo hộ nhãn hiệu và quy trình trích ly collagen trong nước hầm xương."
          }
        ],
        "critical_risks": [
          "Rủi ro hiểu nhầm: Cần nhấn mạnh là nước hầm từ xương thật không dùng chất tạo ngọt công nghiệp bột ngọt."
        ]
      }
    }
  },
  "qualitative_insights": {
    "top_drivers": [
      "Tiết kiệm 3-4 tiếng hầm xương canh mỗi ngày mà vẫn có nồi canh ngọt thanh dinh dưỡng.",
      "Sự kết hợp giữa collagen và đông trùng tạo cảm giác như món canh tiềm bồi bổ tại các nhà hàng lớn.",
      "Quy cách gói 150g vừa vặn cho 1 bữa ăn gia đình 3-4 người, tiện bảo quản ngăn mát."
    ],
    "top_barriers": [
      "Lo ngại mùi thuốc bắc khó ăn đối với trẻ nhỏ trong gia đình.",
      "Cần hướng dẫn cụ thể công thức nấu các món ăn nhanh (canh rau, lẩu mini, súp hầm)."
    ],
    "verbatim_quotes": [
      {
        "name": "Đỗ Ngọc Bích",
        "age": 33,
        "job": "Chuyên viên Tài chính & Mẹ 2 con (TP.HCM)",
        "income": "22 - 30 triệu/tháng",
        "quote": "Sau giờ làm về đón con rất vội, nếu có gói súp hầm xương collagen này chỉ cần thả rau củ vào là xong nồi canh ngon, vừa đẹp da vừa bổ dưỡng cho cả nhà.",
        "sentiment": "positive"
      },
      {
        "name": "Bùi Mai Hương",
        "age": 28,
        "job": "Biên tập viên Tạp chí (Bình Dương)",
        "income": "15 - 20 triệu/tháng",
        "quote": "Concept B có nấm linh chi nghe hơi đắng và mùi già dặn. Concept A nghe hấp dẫn hơn nhiều, các bạn trẻ độc thân nấu mì hay lẩu một người cũng tiện.",
        "sentiment": "positive"
      },
      {
        "name": "Vũ Thu Trang",
        "age": 41,
        "job": "Chủ Chuỗi Cửa Hàng Thời Trang (Đồng Nai)",
        "income": "35 - 50 triệu/tháng",
        "quote": "Giá 45k gói này tôi thấy hợp lý nếu thực sự hầm từ xương ống tươi và có collagen chuẩn, không pha phẩm màu hay bột ngọt nhân tạo.",
        "sentiment": "neutral"
      }
    ]
  },
  "actionable_recommendations": [
    "Quyết định R&D: Chính thức chọn Concept A làm sản phẩm thương mại hóa chủ đạo.",
    "Bao bì & Nhãn: Nhấn mạnh dòng chữ 'Hầm từ 100% xương ống tươi nguyên chất trong 12 giờ'.",
    "Tiếp thị Kỹ thuật số: Sản xuất chuỗi video ngắn TikTok/Reels 'Mẹ bận rộn nấu canh hầm xương chuẩn vị trong 5 phút'."
  ],
  "generated_at": "2026-10-23T16:19:16.639949"
};

export const DEMO_MAXDIFF: ReportPayload = {
  "project_id": "DEMO-MAXDIFF",
  "survey_id": "DEMO-MAXDIFF",
  "model_type": "maxdiff",
  "product_info": {
    "company_name": "Công ty Cổ phần Công nghệ Tài chính Việt Nam (FinTech VN)",
    "product_name": "Ứng Dụng Ngân Hàng Số & Quản Lý Tài Chính Cá Nhân NextGen",
    "category": "Công nghệ Tài chính & Ngân hàng Số (FinTech / Digital Banking)",
    "description": "Nền tảng ngân hàng số thế hệ mới tích hợp AI quản lý chi tiêu tự động, cảnh báo lừa đảo thời gian thực và miễn phí trọn đời mọi giao dịch."
  },
  "target_summary": {
    "sample_size": 1000,
    "margin_of_error": "±3.10%",
    "location": "Toàn quốc (Hà Nội, TP.HCM, Đà Nẵng, Cần Thơ...)",
    "demographics": "1.000 Tác tử AI Toàn Quốc | Tuổi 18-45 | Người dùng ứng dụng thanh toán & ngân hàng số",
    "targeting_summary": "1.000 Tác tử AI Toàn Quốc | Tuổi 18-45 | Người dùng ứng dụng thanh toán & ngân hàng số",
    "target_gender": "all",
    "target_income": "all",
    "target_marital_status": "all",
    "target_occupation": "all",
    "target_zone": "urban"
  },
  "executive_summary": {
    "viability_score": 88,
    "verdict": "TIỆN ÍCH MIỄN PHÍ TRỌN ĐỜI & BẢO MẬT AI CHIẾM ƯU TIÊN TUYỆT ĐỐI",
    "top_findings": [
      "Thuộc tính 'Miễn phí trọn đời mọi giao dịch & phí duy trì' đứng đầu bảng xếp hạng tiện ích với Utility Score +68.4.",
      "Thuộc tính 'Bảo mật sinh trắc học FaceID & AI cảnh báo tài khoản lừa đảo' xếp thứ 2 (+54.2), vượt trội hơn các chương trình hoàn tiền.",
      "Thuộc tính 'Tùy biến giao diện theme theo sở thích' và 'Tích hợp bói tử vi tài lộc' nằm ở đáy bảng xếp hạng, không tạo động lực mở tài khoản."
    ]
  },
  "quantitative_metrics": {
    "appeal_score": 4.5,
    "uniqueness_score": 4.3,
    "purchase_intent_top2box": "81.4%",
    "demographic_breakdown": {
      "by_age": {
        "18-24": 32.0,
        "25-34": 46.0,
        "35-44": 18.0,
        "45+": 4.0
      },
      "by_gender": {
        "male": 51.0,
        "female": 49.0
      }
    },
    "model_specific": {
      "top_attribute": "Miễn phí trọn đời mọi giao dịch & phí duy trì tài khoản",
      "top_score": 68.4,
      "bottom_attribute": "Tùy biến giao diện theme & avatar theo con giáp",
      "bottom_score": -42.5,
      "utility_spread": 110.9,
      "total_attributes_tested": 7,
      "rankings": [
        {
          "rank": 1,
          "attribute": "Miễn phí trọn đời mọi giao dịch & chuyển tiền tức thì",
          "score": 68.4,
          "best_count": 482,
          "worst_count": 12,
          "appearances": 600,
          "tier": "Trụ cột cốt lõi (Core Driver)"
        },
        {
          "rank": 2,
          "attribute": "Bảo mật sinh trắc học FaceID & AI chặn chuyển nhầm vào tài khoản lừa đảo",
          "score": 54.2,
          "best_count": 395,
          "worst_count": 24,
          "appearances": 600,
          "tier": "Trụ cột cốt lõi (Core Driver)"
        },
        {
          "rank": 3,
          "attribute": "Hoàn tiền không giới hạn 1.5% cho mọi chi tiêu hóa đơn hàng ngày",
          "score": 38.6,
          "best_count": 284,
          "worst_count": 52,
          "appearances": 600,
          "tier": "Tạo sự khác biệt (Differentiator)"
        },
        {
          "rank": 4,
          "attribute": "Tự động phân loại chi tiêu & lập ngân sách thông minh cuối tháng",
          "score": 18.2,
          "best_count": 165,
          "worst_count": 88,
          "appearances": 600,
          "tier": "Tính năng gia tăng (Value-add)"
        },
        {
          "rank": 5,
          "attribute": "Mở sổ tiết kiệm online lãi suất cao hơn tại quầy 0.5%/năm",
          "score": 12.5,
          "best_count": 134,
          "worst_count": 96,
          "appearances": 600,
          "tier": "Tính năng gia tăng (Value-add)"
        },
        {
          "rank": 6,
          "attribute": "Tích điểm đổi vé xem phim và voucher ẩm thực độc quyền",
          "score": -8.4,
          "best_count": 72,
          "worst_count": 185,
          "appearances": 600,
          "tier": "Thấp dần (Low Priority)"
        },
        {
          "rank": 7,
          "attribute": "Tùy biến giao diện theme & avatar theo con giáp",
          "score": -42.5,
          "best_count": 18,
          "worst_count": 410,
          "appearances": 600,
          "tier": "Loại bỏ / Thờ ơ (Indifferent)"
        }
      ],
      "deepseek_audit": {
        "auditor_model": "Chuyên Gia Phân Cấp Tiện Ích MaxDiff Scaling",
        "auditor_seal": "Chứng Nhận Thẩm Định Tiện Ích Best-Worst Scaling",
        "data_consistency_audit": "1.000 tác tử AI thực hiện đánh giá qua các tập con lựa chọn Best/Worst. Loại bỏ hoàn toàn hiệu ứng lạm phát điểm ảo 5 sao thường gặp ở khảo sát thang điểm Likert.",
        "executive_verdict": "Thông điệp truyền thông bán hàng (USP) bắt buộc phải tập trung 2 yếu tố: 'Hoàn toàn không phí' và 'Bảo vệ an toàn tiền gửi bằng AI'. Cắt giảm ngân sách phát triển các tính năng trang trí rườm rà.",
        "strategic_pillars": [
          {
            "pillar_name": "Thuộc Tính Ưu Tiên Cao Nhất (Top-Tier)",
            "icon": "⭐",
            "recommendation": "Cam kết mạnh mẽ '0đ phí duy trì - 0đ phí chuyển khoản - 0đ phụ phí trọn đời' trên mọi banner."
          },
          {
            "pillar_name": "Thông Điệp Truyền Thông Bán Hàng (USP)",
            "icon": "📢",
            "recommendation": "Lấy tính năng 'AI cảnh báo lừa đảo thời gian thực' làm chiến dịch truyền thông tạo niềm tin."
          },
          {
            "pillar_name": "Cắt Giảm Chi Phí Thuộc Tính Thờ Ơ",
            "icon": "✂️",
            "recommendation": "Dừng các dự án tùy biến giao diện và bói toán tốn kém tài nguyên server."
          }
        ],
        "critical_risks": [
          "Rủi ro nếu phát sinh phụ phí ẩn (phí SMS, phí thường niên thẻ) sẽ gây làn sóng rời bỏ ứng dụng ngay lập tức."
        ]
      }
    }
  },
  "qualitative_insights": {
    "top_drivers": [
      "Ám ảnh về các khoản phí ẩn lắt nhắt của các ngân hàng truyền thống khiến người dùng khao khát ứng dụng miễn phí thực sự.",
      "Nỗi sợ bị lừa đảo chuyển khoản qua mạng đang ở mức cao kỷ lục, người dùng rất cần hệ thống cảnh báo thông minh.",
      "Giao diện chuyển tiền nhanh 1 chạm bằng QR code hoặc số điện thoại."
    ],
    "top_barriers": [
      "E ngại ngân hàng số không có chi nhánh vật lý khi cần giải quyết khiếu nại số tiền lớn.",
      "Thủ tục eKYC xác thực khuôn mặt đôi khi bị lỗi trên điện thoại đời cũ."
    ],
    "verbatim_quotes": [
      {
        "name": "Đặng Hoài Nam",
        "age": 28,
        "job": "Kỹ sư Cầu đường (Đà Nẵng)",
        "income": "18 - 25 triệu/tháng",
        "quote": "Điều tôi quan tâm nhất khi dùng app ngân hàng là không mất đồng phí nào và chuyển tiền không bao giờ bị nghẽn lệnh. Mấy cái đổi hình nền con giáp tôi chẳng bao giờ bấm vào.",
        "sentiment": "positive"
      },
      {
        "name": "Lương Mỹ Duyên",
        "age": 24,
        "job": "Nhân viên Bán hàng Online (TP.HCM)",
        "income": "15 - 22 triệu/tháng",
        "quote": "Tính năng cảnh báo số tài khoản nằm trong danh sách đen lừa đảo cực kỳ hữu ích. Bán hàng ngày nhận hàng chục lệnh chuyển tiền rất sợ dính tài khoản bẩn.",
        "sentiment": "positive"
      },
      {
        "name": "Vũ Văn Thắng",
        "age": 42,
        "job": "Chủ Nhà Hàng (Hà Nội)",
        "income": "35 - 50 triệu/tháng",
        "quote": "Tôi ưu tiên bảo mật và lãi suất tiền gửi không kỳ hạn sinh lời mỗi ngày. App chạy mượt, giao dịch bảo mật là tôi chuyển dòng tiền kinh doanh về.",
        "sentiment": "positive"
      }
    ]
  },
  "actionable_recommendations": [
    "Định vị Sản phẩm: Xây dựng khẩu hiệu chủ đạo: 'Ngân hàng số 0đ Phí — An toàn tuyệt đối với AI Bảo Vệ'.",
    "Tập trung R&D: Tối ưu hóa thuật toán nhận diện gian lận giao dịch và giảm độ trễ chuyển mạch NAPAS xuống dưới 1 giây.",
    "Cắt giảm lãng phí: Dừng phát triển tính năng đổi theme màu mè để dồn ngân sách vào chương trình hoàn tiền 1.5%."
  ],
  "generated_at": "2026-10-23T16:19:16.639982"
};

export const DEMO_KANO: ReportPayload = {
  "project_id": "DEMO-KANO",
  "survey_id": "DEMO-KANO",
  "model_type": "kano",
  "product_info": {
    "company_name": "Tập đoàn Thiết bị Gia dụng Cao cấp ElmaTech Euro (ElmaTech Vietnam)",
    "product_name": "Nồi Chiên Không Dầu Hơi Nước Thông Minh ElmaTech SteamAir (7 Lít)",
    "category": "Thiết bị Gia dụng Nhà bếp Cao cấp (Smart Kitchen Appliances)",
    "description": "Nồi chiên không dầu tích hợp công nghệ hấp hơi nước đối lưu nhiệt độ cao, khay nướng gốm Ceramic chống dính y tế, màn hình cảm ứng OLED và camera AI nhận diện độ chín món ăn."
  },
  "target_summary": {
    "sample_size": 1000,
    "margin_of_error": "±3.10%",
    "location": "Đô thị lớn TP.HCM, Hà Nội, Hải Phòng, Đà Nẵng",
    "demographics": "1.000 Tác tử AI Đô thị | Tuổi 25-50 | Nữ giới 68%, Nam giới 32% | Người nội trợ & gia đình hiện đại",
    "targeting_summary": "1.000 Tác tử AI Đô thị | Tuổi 25-50 | Nữ giới 68%, Nam giới 32% | Người nội trợ & gia đình hiện đại",
    "target_gender": "all",
    "target_income": "AB",
    "target_marital_status": "married",
    "target_occupation": "all",
    "target_zone": "urban"
  },
  "executive_summary": {
    "viability_score": 79,
    "verdict": "PHÂN TẦNG R&D RÕ NÉT: CHỐNG DÍNH GỐM LÀ BẮT BUỘC, HẤP HƠI NƯỚC LÀ ĐÒN BẨY DOANH THU",
    "top_findings": [
      "Khay chống dính gốm Ceramic an toàn sức khỏe được xếp vào nhóm Bắt buộc (Must-be) với hệ số bất mãn CS- lên tới -0.88 nếu bị bong tróc.",
      "Công nghệ phun sương đối lưu hơi nước giữ ẩm thực phẩm là tính năng Một chiều (One-dimensional) mang lại độ hài lòng cao nhất (CS+ 0.72).",
      "Tính năng Camera AI nhận diện độ chín qua điện thoại thuộc nhóm Đột phá thu hút (Attractive) giúp nâng giá bán sản phẩm lên phân khúc 4-5 triệu đồng."
    ]
  },
  "quantitative_metrics": {
    "appeal_score": 4.3,
    "uniqueness_score": 4.2,
    "purchase_intent_top2box": "77.5%",
    "demographic_breakdown": {
      "by_age": {
        "18-24": 10.0,
        "25-34": 45.0,
        "35-44": 35.0,
        "45+": 10.0
      },
      "by_gender": {
        "male": 32.0,
        "female": 68.0
      }
    },
    "model_specific": {
      "must_be_count": 1,
      "one_dimensional_count": 2,
      "attractive_count": 2,
      "indifferent_count": 1,
      "total_features": 6,
      "features_summary": [
        {
          "feature": "Khay nướng tráng men gốm Ceramic chuẩn y tế không bong tróc",
          "category_code": "M",
          "category_name": "Bắt buộc (Must-be)",
          "better_cs_plus": 0.25,
          "worse_cs_minus": -0.88,
          "priority": 1
        },
        {
          "feature": "Công nghệ hấp hơi nước đối lưu giữ thịt mềm mọng không khô",
          "category_code": "O",
          "category_name": "Một chiều tăng trưởng (One-dimensional)",
          "better_cs_plus": 0.72,
          "worse_cs_minus": -0.58,
          "priority": 2
        },
        {
          "feature": "Bảng điều khiển cảm ứng tiếng Việt lớn với 16 chế độ nấu cài sẵn",
          "category_code": "O",
          "category_name": "Một chiều tăng trưởng (One-dimensional)",
          "better_cs_plus": 0.58,
          "worse_cs_minus": -0.45,
          "priority": 3
        },
        {
          "feature": "Camera AI soi thực phẩm qua app điện thoại không cần mở nồi",
          "category_code": "A",
          "category_name": "Đột phá thu hút (Attractive)",
          "better_cs_plus": 0.68,
          "worse_cs_minus": -0.15,
          "priority": 4
        },
        {
          "feature": "Tự động sấy khô và khử khuẩn khoang nồi bằng nhiệt độ 100°C",
          "category_code": "A",
          "category_name": "Đột phá thu hút (Attractive)",
          "better_cs_plus": 0.62,
          "worse_cs_minus": -0.12,
          "priority": 5
        },
        {
          "feature": "Tùy biến đổi màu dải đèn LED hiển thị tay cầm",
          "category_code": "I",
          "category_name": "Vô thưởng vô phạt (Indifferent)",
          "better_cs_plus": 0.08,
          "worse_cs_minus": -0.05,
          "priority": 6
        }
      ],
      "deepseek_audit": {
        "auditor_model": "Chuyên Gia Mô Hình R&D Sản Phẩm Kano",
        "auditor_seal": "Chứng Nhận Thẩm Định Danh Mục Tính Năng Chuẩn Kano",
        "data_consistency_audit": "1.000 tác tử AI trả lời theo cặp câu hỏi Tiện nghi (Functional) và Bất tiện (Dysfunctional). Phân loại chính xác các tính năng vào 4 góc phần tư.",
        "executive_verdict": "Tuyệt đối không được thỏa hiệp về chất lượng lớp chống dính khay nướng. Ưu tiên hàng đầu cho công nghệ hơi nước để giải quyết triệt để nỗi đau 'thịt bị khô cứng' của nồi chiên truyền thống.",
        "strategic_pillars": [
          {
            "pillar_name": "Tính Năng Bắt Buộc (Must-be)",
            "icon": "🔒",
            "recommendation": "Đầu tư kiểm định khắt khe lớp men Ceramic chống bong tróc bảo hành 2 năm."
          },
          {
            "pillar_name": "Tính Năng Tăng Trưởng (One-dimensional)",
            "icon": "📈",
            "recommendation": "Tối ưu dung tích khay nước và độ mịn của hơi sương đối lưu."
          },
          {
            "pillar_name": "Vũ Khí Bất Ngờ (Attractive)",
            "icon": "✨",
            "recommendation": "Quảng bá tính năng Camera AI xem thức ăn vàng giòn thời gian thực trên mạng xã hội."
          }
        ],
        "critical_risks": [
          "Nếu lớp chống dính bị bong tróc sau 3-6 tháng, điểm bất mãn sẽ tăng vọt khiến khách hàng trả hàng hàng loạt."
        ]
      }
    }
  },
  "qualitative_insights": {
    "top_drivers": [
      "Nồi chiên thông thường nướng thịt gà vịt hay bị khô quắt queo, tính năng hấp hơi nước giữ mọng nước là cải tiến cực kỳ đắt giá.",
      "Nỗi sợ các lớp chống dính Teflon độc hại khiến người tiêu dùng sẵn sàng trả thêm tiền cho lớp phủ gốm Ceramic tự nhiên.",
      "Khoang nồi dung tích 7 lít nướng vừa nguyên con gà 2.5kg cho cả nhà."
    ],
    "top_barriers": [
      "Lo ngại đường ống dẫn nước hấp lâu ngày bị đóng cặn canxi khó vệ sinh.",
      "Mức giá dự kiến trên 4 triệu đồng tương đối cao so với các thương hiệu Trung Quốc giá rẻ."
    ],
    "verbatim_quotes": [
      {
        "name": "Trương Kiều Oanh",
        "age": 36,
        "job": "Bác sĩ Nhi khoa (Hà Nội)",
        "income": "30 - 45 triệu/tháng",
        "quote": "Gia đình tôi rất kỹ tính trong nấu ăn. Điểm mấu chốt là lớp phủ lòng nồi phải an toàn tuyệt đối không sinh độc tố ở nhiệt độ cao. Tính năng hấp giữ ẩm quá tuyệt vời.",
        "sentiment": "positive"
      },
      {
        "name": "Nguyễn Hoàng Nam",
        "age": 32,
        "job": "Kỹ sư Xây dựng (TP.HCM)",
        "income": "20 - 28 triệu/tháng",
        "quote": "Thích nhất tính năng Camera AI soi đồ ăn trong nồi gửi về điện thoại, ngồi phòng khách xem bóng đá vẫn biết khi nào cánh gà chín vàng giòn.",
        "sentiment": "positive"
      },
      {
        "name": "Phan Thị Thu Thảo",
        "age": 29,
        "job": "Kế toán Tổng hợp (Đà Nẵng)",
        "income": "14 - 18 triệu/tháng",
        "quote": "Nồi nhiều tính năng hiện đại, nhưng quan trọng là các bộ phận khay chứa nước có tháo rời rửa dễ dàng không, sợ đóng cặn mốc bên trong.",
        "sentiment": "neutral"
      }
    ]
  },
  "actionable_recommendations": [
    "Lộ trình R&D V1 (MVP): Tập trung hoàn thiện 100% Khay nướng Ceramic + Công nghệ phun sương đối lưu hơi nước.",
    "Lộ trình R&D V2 (Premium): Bổ sung Camera AI và kết nối app WiFi cho phiên bản Pro cao cấp.",
    "Cắt giảm chi phí: Bỏ dải đèn LED đổi màu tay cầm để tiết kiệm 120.000đ/sản phẩm chi phí bo mạch."
  ],
  "generated_at": "2026-10-23T16:19:16.640010"
};

export const DEMO_BRAND_MAP: ReportPayload = {
  "project_id": "DEMO-BRAND-MAP",
  "survey_id": "DEMO-BRAND-MAP",
  "model_type": "brand_map",
  "product_info": {
    "company_name": "Công ty Mỹ phẩm Thuần chay Bản địa Cocona Botanica (Cocona Natural Cosmetics)",
    "product_name": "Khảo Sát Bản Đồ Định Vị Thị Trường Mỹ Phẩm Thiên Nhiên Việt Nam",
    "category": "Mỹ phẩm & Chăm sóc cá nhân (Beauty & Personal Care)",
    "description": "Nghiên cứu vị thế cạnh tranh đa chiều của các thương hiệu mỹ phẩm thuần chay/thiên nhiên nội địa và quốc tế tại thị trường Việt Nam."
  },
  "target_summary": {
    "sample_size": 1000,
    "margin_of_error": "±3.10%",
    "location": "Toàn quốc (Đô thị chiếm 70%)",
    "demographics": "1.000 Tác tử AI Phụ Nữ Đô Thị | Tuổi 18-42 | Người dùng mỹ phẩm & skincare thường xuyên",
    "targeting_summary": "1.000 Tác tử AI Phụ Nữ Đô Thị | Tuổi 18-42 | Người dùng mỹ phẩm & skincare thường xuyên",
    "target_gender": "female",
    "target_income": "all",
    "target_marital_status": "all",
    "target_occupation": "all",
    "target_zone": "urban"
  },
  "executive_summary": {
    "viability_score": 83,
    "verdict": "PHÁT HIỆN ĐẠI DƯƠNG XANH: PHÂN KHÚC MỸ PHẨM HỮU CƠ LÂM SÀNG CẬN CAO CẤP",
    "top_findings": [
      "Cocona dẫn đầu thị trường về nhận thức 'Thuần chay & Bản địa Việt Nam' nhưng đang bị giới hạn ở phân khúc giá bình dân (150k - 300k).",
      "Phát hiện khoảng trống thị trường (White-space) rộng lớn ở tọa độ: 'Thành phần hữu cơ được chứng nhận quốc tế + Hiệu quả lâm sàng chuyên sâu + Mức giá cận cao cấp (400k - 700k)'.",
      "Các thương hiệu quốc tế (InniGreen, The Herbal Shop) đang bị giảm sút sức hút do giá cao nhưng thiếu câu chuyện nguyên liệu bản địa gần gũi."
    ]
  },
  "quantitative_metrics": {
    "appeal_score": 4.4,
    "uniqueness_score": 4.3,
    "purchase_intent_top2box": "80.5%",
    "demographic_breakdown": {
      "by_age": {
        "18-24": 38.0,
        "25-34": 44.0,
        "35-44": 15.0,
        "45+": 3.0
      },
      "by_gender": {
        "male": 0.0,
        "female": 100.0
      }
    },
    "model_specific": {
      "axis_x_label": "Nguồn gốc Nguyên liệu (1: Hóa mỹ phẩm ↔ 10: Thuần chay Thiên nhiên)",
      "axis_y_label": "Định vị Phân khúc Giá & Đẳng cấp (1: Bình dân ↔ 10: Cao cấp Sang trọng)",
      "whitespace_quadrant": "Q2",
      "whitespace_name": "Dược mỹ phẩm Hữu cơ Lâm sàng Cận cao cấp",
      "white_space_opportunity": "Phân khúc Dược mỹ phẩm thuần chay có chứng nhận lâm sàng (Clinical Vegan Skincare) mức giá 450.000đ - 700.000đ đang hoàn toàn bỏ trống.",
      "brands_data": [
        {
          "brand": "Cocona",
          "x": 8.2,
          "y": 4.1,
          "quadrant": "Q4",
          "quadrant_name": "Thuần chay & Giá bình dân",
          "awareness": 88,
          "color": "#059669",
          "is_client": false
        },
        {
          "brand": "Mộc Thảo Homelab",
          "x": 7.8,
          "y": 4.5,
          "quadrant": "Q4",
          "quadrant_name": "Lành tính mộc mạc",
          "awareness": 72,
          "color": "#10b981",
          "is_client": false
        },
        {
          "brand": "InniGreen VN",
          "x": 6.2,
          "y": 6.0,
          "quadrant": "Q1",
          "quadrant_name": "Thương hiệu quen thuộc",
          "awareness": 85,
          "color": "#3b82f6",
          "is_client": false
        },
        {
          "brand": "The Herbal Shop",
          "x": 6.8,
          "y": 7.4,
          "quadrant": "Q1",
          "quadrant_name": "Cao cấp quốc tế",
          "awareness": 79,
          "color": "#6366f1",
          "is_client": false
        },
        {
          "brand": "Thương hiệu Dự án (Next-Gen)",
          "x": 8.8,
          "y": 7.2,
          "quadrant": "Q2",
          "quadrant_name": "Hữu cơ lâm sàng cao cấp",
          "awareness": 45,
          "color": "#f59e0b",
          "is_client": true
        }
      ],
      "brands": [
        {
          "brand": "Cocona",
          "x": 8.2,
          "y": 4.1,
          "quadrant": "Q4",
          "quadrant_name": "Thuần chay & Giá bình dân",
          "awareness": 88,
          "color": "#059669",
          "is_client": false,
          "sentiment": "Rất yêu thích sự tự hào nông sản Việt, giá vừa túi tiền"
        },
        {
          "brand": "Mộc Thảo Homelab",
          "x": 7.8,
          "y": 4.5,
          "quadrant": "Q4",
          "quadrant_name": "Lành tính mộc mạc",
          "awareness": 72,
          "color": "#10b981",
          "is_client": false,
          "sentiment": "Lành tính cho mẹ và bé, cảm giác mộc mạc"
        },
        {
          "brand": "InniGreen VN",
          "x": 6.2,
          "y": 6.0,
          "quadrant": "Q1",
          "quadrant_name": "Thương hiệu quen thuộc",
          "awareness": 85,
          "color": "#3b82f6",
          "is_client": false,
          "sentiment": "Thương hiệu quen thuộc nhưng hiệu quả ở mức trung bình"
        },
        {
          "brand": "The Herbal Shop",
          "x": 6.8,
          "y": 7.4,
          "quadrant": "Q1",
          "quadrant_name": "Cao cấp quốc tế",
          "awareness": 79,
          "color": "#6366f1",
          "is_client": false,
          "sentiment": "Chất lượng tốt nhưng giá khá cao, bao bì chưa đổi mới"
        },
        {
          "brand": "Thương hiệu Dự án (Next-Gen)",
          "x": 8.8,
          "y": 7.2,
          "quadrant": "Q2",
          "quadrant_name": "Hữu cơ lâm sàng cao cấp",
          "awareness": 45,
          "color": "#f59e0b",
          "is_client": true,
          "sentiment": "Khoảng trống đại dương xanh: Hữu cơ lâm sàng cao cấp"
        }
      ],
      "deepseek_audit": {
        "auditor_model": "Chuyên Gia Bản Đồ Định Vị Perceptual Mapping (MDS)",
        "auditor_seal": "Chứng Nhận Phân Tích Không Gian Định Vị Đa Chiều",
        "data_consistency_audit": "Dữ liệu khảo sát từ 1.000 tác tử AI nữ giới theo thang đo nhận thức 7 điểm. Tọa độ ma trận tương đồng MDS có độ hội tụ stress < 0.08 (rất tin cậy).",
        "executive_verdict": "Cơ hội vàng để doanh nghiệp tung ra dòng sản phẩm cao cấp (Sub-brand Premium) với giá bán 450.000đ - 650.000đ, khai thác triệt để khoảng trống giữa Cocona và các hãng ngoại.",
        "strategic_pillars": [
          {
            "pillar_name": "Tọa Độ Định Vị Hiện Tại",
            "icon": "📍",
            "recommendation": "Duy trì vị thế số 1 về câu chuyện nông sản bản địa thân thiện."
          },
          {
            "pillar_name": "Khai Thác Khoảng Trống (White-space)",
            "icon": "🌊",
            "recommendation": "Ra mắt dòng sản phẩm Clinical Organic có kiểm nghiệm da liễu độc lập."
          },
          {
            "pillar_name": "Lộ Trình Tái Định Vị Cạnh Tranh",
            "icon": "🧭",
            "recommendation": "Nâng cấp bao bì thủy tinh tái chế sẫm màu phong cách apothecary sang trọng."
          }
        ],
        "critical_risks": [
          "Rủi ro nếu tăng giá bán trên dòng sản phẩm cũ sẽ bị phản ứng dữ dội; bắt buộc phải tạo dòng sản phẩm mới riêng biệt."
        ]
      }
    }
  },
  "qualitative_insights": {
    "top_drivers": [
      "Lòng tự hào ủng hộ nông sản Việt (cà phê Đắk Lắk, bơ Đắk Nông, nghệ Hưng Yên, bưởi Năm Roi).",
      "Cam kết nhân đạo: Thuần chay 100%, không thử nghiệm trên động vật đạt chứng nhận Leaping Bunny.",
      "Mùi hương tự nhiên thư giãn từ tinh dầu thực vật thay vì hương liệu nhân tạo nồng gắt."
    ],
    "top_barriers": [
      "Nhiều người tiêu dùng vẫn nghĩ mỹ phẩm nội địa chỉ dưỡng ẩm nhẹ, chưa đủ mạnh để điều trị nám sạm lão hóa.",
      "Bao bì nhựa tái chế đôi khi tạo cảm giác chưa thực sự sang trọng khi đặt trên bàn trang điểm."
    ],
    "verbatim_quotes": [
      {
        "name": "Trần Khánh Linh",
        "age": 27,
        "job": "Chuyên viên Đối ngoại (TP.HCM)",
        "income": "24 - 32 triệu/tháng",
        "quote": "Mình dùng tẩy tế bào chết cà phê của Cocona rất thích. Nhưng với serum dưỡng trắng và chống lão hóa mình vẫn phải mua đồ châu Âu vì cần hiệu quả lâm sàng cao. Nếu có dòng hữu cơ cao cấp kiểm nghiệm rõ ràng mình sẽ mua ngay.",
        "sentiment": "positive"
      },
      {
        "name": "Nguyễn Hoàng Yến",
        "age": 34,
        "job": "Bác sĩ Da liễu (Hà Nội)",
        "income": "35 - 50 triệu/tháng",
        "quote": "Xu hướng bệnh nhân của tôi hiện nay rất chuộng sản phẩm sạch an toàn. Khoảng trống mỹ phẩm thuần chay nhưng có hoạt chất khoa học (Niacinamide, Retinol hữu cơ) ở mức giá 500k đang rất tiềm năng.",
        "sentiment": "positive"
      },
      {
        "name": "Lê Vũ Quỳnh Nga",
        "age": 22,
        "job": "Sinh viên Đại học Ngoại thương (Hà Nội)",
        "income": "6 - 9 triệu/tháng",
        "quote": "Cocona giá 150k-250k thì sinh viên chúng mình dễ mua. Nếu ra dòng cao cấp 500k-600k thì phải có minisize hoặc quà tặng hấp dẫn mới dám thử.",
        "sentiment": "neutral"
      }
    ]
  },
  "actionable_recommendations": [
    "Chiến lược Danh mục: Giữ nguyên dòng phổ thông và ra mắt dòng cao cấp 'Signature Derma-Botanical'.",
    "Chứng nhận Khoa học: Hợp tác với Viện Da liễu để công bố báo cáo kiểm nghiệm hiệu quả sau 28 ngày sử dụng.",
    "Nâng cấp Bao bì: Sử dụng chai thủy tinh cao cấp và hộp giấy ép kim thân thiện môi trường đạt chuẩn FSC."
  ],
  "generated_at": "2026-10-23T16:19:16.640044"
};

export const DEMO_UA_STUDY: ReportPayload = {
  "project_id": "DEMO-UA-STUDY",
  "survey_id": "DEMO-UA-STUDY",
  "model_type": "ua_study",
  "product_info": {
    "company_name": "Tập đoàn Cà phê & Đồ uống Di sản VinaKofe Heritage (VinaKofe Group)",
    "product_name": "Nghiên Cứu Thói Quen & Thái Độ Tiêu Dùng Cà Phê Hòa Tan & Trà Túi Lọc Tại Nhà",
    "industry": "Cà phê hòa tan & Trà túi lọc pha tại gia đình (At-home Beverage)",
    "key_competitors": "KofeKing, G7-Legend, Lipton Leaf, Phúc Trà House",
    "description": "Nghiên cứu quy mô lớn về sự thay đổi thói quen uống cà phê/trà của người tiêu dùng sau giai đoạn làm việc linh hoạt (Hybrid Work)."
  },
  "target_summary": {
    "sample_size": 1000,
    "margin_of_error": "±3.10%",
    "location": "Toàn quốc (Bắc: 33%, Trung: 22%, Nam: 45%)",
    "demographics": "1.000 Tác tử AI Đa Tầng | Tuổi 20-58 | Người có thói quen uống cà phê/trà tối thiểu 3 lần/tuần",
    "targeting_summary": "1.000 Tác tử AI Đa Tầng | Tuổi 20-58 | Người có thói quen uống cà phê/trà tối thiểu 3 lần/tuần",
    "target_gender": "all",
    "target_income": "all",
    "target_marital_status": "all",
    "target_occupation": "all",
    "target_zone": "all"
  },
  "executive_summary": {
    "viability_score": 76,
    "verdict": "THỊ TRƯỜNG DỊCH CHUYỂN MẠNH SANG CÀ PHÊ ÍT ĐƯỜNG & KHÔNG GÂY BỒN CHỒN",
    "top_findings": [
      "68.5% người tiêu dùng uống cà phê hàng ngày vào buổi sáng, nhưng 54% phàn nàn về cảm giác say cà phê hoặc cồn cào ruột khi uống lúc đói.",
      "Xu hướng cà phê hòa tan sấy lạnh (Freeze-dried) chất lượng cao tăng trưởng +38% ở nhóm tuổi 25-38 tuổi so với cà phê 3-in-1 truyền thống.",
      "Dịp sử dụng buổi xế chiều (14h - 15h30) đang bị bỏ trống: Người dùng cần thức uống nhẹ để tập trung nhưng không làm mất ngủ buổi tối."
    ]
  },
  "quantitative_metrics": {
    "appeal_score": 4.1,
    "uniqueness_score": 3.9,
    "purchase_intent_top2box": "72.8%",
    "demographic_breakdown": {
      "by_age": {
        "18-24": 20.0,
        "25-34": 44.0,
        "35-44": 24.0,
        "45+": 12.0
      },
      "by_gender": {
        "male": 53.0,
        "female": 47.0
      }
    },
    "model_specific": {
      "category_summary": "Ngành hàng cà phê hòa tan & trà túi lọc tại nhà đang chứng kiến sự dịch chuyển mạnh từ 3-in-1 phổ thông sang phân khúc sấy lạnh chất lượng cao và an toàn cho dạ dày.",
      "pain_points": [
        {
          "name": "Tỉnh táo nhanh không say cafein hay bồn chồn",
          "importance": 9.2,
          "satisfaction": 4.5,
          "opportunity_score": 9.5
        },
        {
          "name": "Hương thơm đậm đà nguyên bản như pha phin",
          "importance": 8.8,
          "satisfaction": 5.2,
          "opportunity_score": 8.9
        },
        {
          "name": "Hòa tan nhanh với cả nước lạnh và sữa đá",
          "importance": 8.5,
          "satisfaction": 5.6,
          "opportunity_score": 8.1
        },
        {
          "name": "Hàm lượng đường thấp tốt cho tiêu hóa",
          "importance": 8.2,
          "satisfaction": 4.8,
          "opportunity_score": 8.5
        },
        {
          "name": "Bao bì thanh dài dễ xé tiện mang đi làm",
          "importance": 7.4,
          "satisfaction": 6.8,
          "opportunity_score": 6.9
        }
      ],
      "usage_frequency": {
        "Mỗi ngày 1-2 lần": 68.5,
        "3-5 lần / tuần": 22.0,
        "1-2 lần / tuần": 7.5,
        "Thỉnh thoảng": 2.0
      },
      "top_occasions": [
        {
          "occasion": "Sáng sớm bắt đầu ngày làm việc (Wake-up booster)",
          "pct": 74.5
        },
        {
          "occasion": "Sau bữa ăn trưa giải ngấy & chống buồn ngủ (Post-lunch pick-me-up)",
          "pct": 48.0
        },
        {
          "occasion": "Làm việc ban đêm hoặc chạy deadline (Night work / Exam)",
          "pct": 28.5
        },
        {
          "occasion": "Tiếp khách hoặc gặp gỡ bạn bè tại nhà",
          "pct": 18.0
        }
      ],
      "unmet_needs": [
        {
          "need": "Muốn tỉnh táo nhanh nhưng không bị say cafein, run tay hay cồn cào bụng",
          "importance": 86,
          "satisfaction": 42
        },
        {
          "need": "Vị cà phê đậm đà thơm như pha phin nhưng phải hòa tan nhanh cả nước lạnh",
          "importance": 82,
          "satisfaction": 48
        },
        {
          "need": "Bao bì dễ xé, định lượng chuẩn 1 gói vừa đủ cho ly đá lớn",
          "importance": 75,
          "satisfaction": 55
        }
      ],
      "deepseek_audit": {
        "auditor_model": "Chuyên Gia Nghiên Cứu Thói Quen & Thái Độ Ipsos U&A",
        "auditor_seal": "Chứng Nhận Khảo Sát Hành Vi & Thái Độ Chuẩn Quốc Tế",
        "data_consistency_audit": "Dữ liệu đo lường hành vi tiêu dùng từ 1.000 tác tử AI toàn quốc. Tần suất và dịp sử dụng khớp chính xác với thói quen sinh hoạt và nhịp sinh học của người Việt.",
        "executive_verdict": "Cà phê 3-in-1 truyền thống đang bão hòa. Cơ hội tăng trưởng nằm ở dòng cà phê hòa tan cao cấp 'Êm dịu cho dạ dày' (Gentle Energy) và cà phê hòa tan nước lạnh (Cold Brew Stick).",
        "strategic_pillars": [
          {
            "pillar_name": "Dịp Sử Dụng Cốt Lõi (Occasions)",
            "icon": "⏰",
            "recommendation": "Tạo ra thói quen 'Ly cà phê sáng lành mạnh không cồn cào' cho dân văn phòng."
          },
          {
            "pillar_name": "Nhu Cầu Chưa Thỏa Mãn (Unmet Needs)",
            "icon": "💡",
            "recommendation": "Bổ sung L-Theanine hoặc chiết xuất trà xanh để triệt tiêu cảm giác bồn chồn run tay."
          },
          {
            "pillar_name": "Gia Tăng Tần Suất & Quy Mô Giỏ Hàng",
            "icon": "🛒",
            "recommendation": "Thiết kế hộp 30 gói dạng ngăn kéo tiện lợi đặt tại pantry văn phòng."
          }
        ],
        "critical_risks": [
          "Rủi ro nếu định vị quá giống cà phê 3-in-1 cũ sẽ bị cuốn vào cuộc chiến giảm giá khốc liệt của các ông lớn."
        ]
      }
    }
  },
  "qualitative_insights": {
    "top_drivers": [
      "Cà phê hòa tan giúp tiết kiệm 15-20 phút mỗi sáng so với việc đứng chờ mua cà phê mang đi.",
      "Chi phí 1 gói hòa tan cao cấp (5.000đ - 8.000đ) rẻ hơn nhiều so với 30.000đ - 45.000đ mua tại quán.",
      "Dễ dàng điều chỉnh độ ngọt và lượng đá theo khẩu vị cá nhân."
    ],
    "top_barriers": [
      "Định kiến cà phê hòa tan chứa nhiều đường và bột kem béo thực vật không tốt cho tim mạch.",
      "Hương thơm cà phê hòa tan thường bị bay mùi nhanh, không đậm hương thơm ngào ngạt như cà phê hạt rang xay."
    ],
    "verbatim_quotes": [
      {
        "name": "Đỗ Minh Quân",
        "age": 35,
        "job": "Kỹ sư Công nghệ Thông tin (TP.HCM)",
        "income": "28 - 38 triệu/tháng",
        "quote": "Mình nghiện cà phê nhưng dạ dày yếu, uống cà phê đen đậm là bị cồn cào run tay cả buổi sáng. Rất cần một loại cà phê giúp tỉnh táo êm êm và giảm axit cho bao tử.",
        "sentiment": "positive"
      },
      {
        "name": "Nguyễn Bích Ngọc",
        "age": 29,
        "job": "Chuyên viên Nhân sự (Hà Nội)",
        "income": "18 - 24 triệu/tháng",
        "quote": "Mình thích cà phê hòa tan sấy lạnh pha được trực tiếp với sữa tươi không đường lạnh. Uống vừa béo vừa thơm mà không bị ngọt gắt như cà phê gói 3-in-1 ngày xưa.",
        "sentiment": "positive"
      },
      {
        "name": "Bùi Văn Nam",
        "age": 48,
        "job": "Cán bộ Nhà nước (Đà Nẵng)",
        "income": "15 - 20 triệu/tháng",
        "quote": "Tôi uống cà phê phin quen rồi, cà phê gói chỉ uống khi đi công tác. Nếu có loại nào pha ra có lớp crema bọt dày như pha máy thì tôi sẽ ủng hộ.",
        "sentiment": "neutral"
      }
    ]
  },
  "actionable_recommendations": [
    "Đổi mới Công nghệ: Đầu tư dây chuyền sấy lạnh chân không (Freeze-drying) để giữ nguyên 95% hương thơm nguyên bản của hạt cà phê.",
    "Tung sản phẩm mới: Ra mắt dòng 'VinaKofe Gentle Wake-up' với công thức giảm axit và bổ sung khoáng chất magiê.",
    "Bao bì Đột phá: Đổi sang quy cách hộp thiếc vuông 20 gói sang trọng thích hợp làm quà tặng và trang trí bàn làm việc."
  ],
  "generated_at": "2026-10-23T16:19:16.640073"
};

export const DEMO_DEAL_ELASTICITY: ReportPayload = {
  "project_id": "DEMO-DEAL-ELASTICITY",
  "survey_id": "DEMO-DEAL-ELASTICITY",
  "model_type": "deal_elasticity",
  "product_info": {
    "company_name": "Tập đoàn Bánh kẹo & Quà tặng Hoàng Gia Crown Đô (CrownDo Group)",
    "product_name": "Combo Hộp Quà Tết Phú Quý Cát Tường Crown Đô (Gồm 4 Hộp Bánh Quy & Kẹo Cao Cấp)",
    "original_price": 450000,
    "discounted_price": 369000,
    "gift_items": "Tặng kèm 1 Bộ 6 Bao Lì Xì Mạ Vàng Dập Nổi 3D & 1 Hộp Trà Ô Long Thượng Hạng",
    "deal_description": "Chương trình ưu đãi đặt trước sớm (Early Bird) dành cho khách hàng doanh nghiệp và gia đình mua từ 2 combo trở lên."
  },
  "target_summary": {
    "sample_size": 1000,
    "margin_of_error": "±3.10%",
    "location": "Toàn quốc (TP.HCM, Hà Nội, Đà Nẵng, Cần Thơ, Hải Phòng...)",
    "demographics": "1.000 Tác tử AI Đối Chuẩn Phân Tầng GSO | Tuổi 24-55 | Người quyết định ngân sách mua sắm quà Tết gia đình & công ty",
    "targeting_summary": "1.000 Tác tử AI Đối Chuẩn Phân Tầng GSO | Tuổi 24-55 | Người quyết định ngân sách mua sắm quà Tết gia đình & công ty",
    "target_gender": "all",
    "target_income": "all",
    "target_marital_status": "married",
    "target_occupation": "all",
    "target_zone": "all"
  },
  "executive_summary": {
    "viability_score": 84,
    "verdict": "MỨC GIẢM GIÁ TỐI ƯU 18% GIÚP TĂNG +34.5% DOANH THU & BẢO TOÀN BIÊN LỢI NHUẬN",
    "top_findings": [
      "Mức giảm giá tối ưu là 18% (từ 450.000đ xuống 369.000đ) kết hợp quà tặng trà Ô Long tạo ra tỷ lệ chốt đơn (Conversion Rate) cao nhất đạt 76.8%.",
      "Nếu giảm giá sâu quá 25% (xuống dưới 330.000đ), doanh số lượng chỉ tăng thêm 6% nhưng biên lợi nhuận gộp bị bào mòn tới 28%.",
      "Nguy cơ tự ăn thịt sản phẩm (Cannibalization) chỉ ở mức 12% khi áp dụng điều kiện 'Mua từ 2 combo trở lên'."
    ]
  },
  "quantitative_metrics": {
    "appeal_score": 4.5,
    "uniqueness_score": 4.0,
    "purchase_intent_top2box": "76.8%",
    "demographic_breakdown": {
      "by_age": {
        "18-24": 15.0,
        "25-34": 46.0,
        "35-44": 28.0,
        "45+": 11.0
      },
      "by_gender": {
        "male": 44.0,
        "female": 56.0
      }
    },
    "model_specific": {
      "switching_intent": 76.8,
      "perceived_value": 8.6,
      "redemption_friction": 2.4,
      "cannibalization_risk": 12.0,
      "optimal_discount_pct": 18,
      "revenue_lift": 34.5,
      "tiers": [
        {
          "discount_level": "Giảm 10%",
          "conversion_rate": 48.5,
          "revenue_impact": "+5% Lợi nhuận"
        },
        {
          "discount_level": "Giảm 18% (Tối ưu)",
          "conversion_rate": 76.8,
          "revenue_impact": "+34.5% Doanh thu (Điểm bùng nổ)"
        },
        {
          "discount_level": "Giảm 25%",
          "conversion_rate": 82.4,
          "revenue_impact": "+22% (Bắt đầu ăn mòn biên)"
        },
        {
          "discount_level": "Giảm 35%",
          "conversion_rate": 88.0,
          "revenue_impact": "+8% (Rủi ro suy giảm lợi nhuận ròng)"
        }
      ],
      "deal_scenarios": [
        {
          "discount_pct": 10,
          "price": 405000,
          "conversion_rate": 48.5,
          "revenue_index": 105,
          "profit_margin": 32.5
        },
        {
          "discount_pct": 18,
          "price": 369000,
          "conversion_rate": 76.8,
          "revenue_index": 134.5,
          "profit_margin": 28.0
        },
        {
          "discount_pct": 25,
          "price": 337500,
          "conversion_rate": 82.4,
          "revenue_index": 122.0,
          "profit_margin": 19.5
        },
        {
          "discount_pct": 35,
          "price": 292500,
          "conversion_rate": 88.0,
          "revenue_index": 108.0,
          "profit_margin": 9.2
        }
      ],
      "deepseek_audit": {
        "auditor_model": "Chuyên Gia Kinh Tế Học Co Giãn Khuyến Mãi Deal Elasticity",
        "auditor_seal": "Chứng Nhận Ma Trận Co Giãn Khuyến Mãi Chuẩn Doanh Nghiệp",
        "data_consistency_audit": "1.000 tác tử AI mô phỏng phản xạ trước 4 nấc chiết khấu và quà tặng kèm. Hệ số co giãn cầu theo giá đạt ε = -1.92 ở ngưỡng 18%.",
        "executive_verdict": "Mức giảm 18% (369.000đ) kèm hộp trà Ô Long là điểm cân bằng hoàn hảo giữa sức hút khách hàng và hiệu quả tài chính của mùa vụ Tết.",
        "strategic_pillars": [
          {
            "pillar_name": "Ngưỡng Co Giãn Giá Khuyến Mãi",
            "icon": "📉",
            "recommendation": "Khóa chặt mức chiết khấu 18% cho chương trình Early Bird trước ngày 15 tháng Chạp."
          },
          {
            "pillar_name": "Tỷ Lệ Lôi Kéo Người Dùng (Switching)",
            "icon": "🔄",
            "recommendation": "Quà tặng 'Hộp trà Ô Long cao cấp' là đòn bẩy kéo 38% khách hàng từ đối thủ sang."
          },
          {
            "pillar_name": "Cấu Trúc Chiết Khấu Tối Ưu Lợi Nhuận",
            "icon": "💰",
            "recommendation": "Áp dụng chính sách bậc thang: Mua 5 combo tặng thêm 1 hộp bánh cá nhân."
          }
        ],
        "critical_risks": [
          "Rủi ro nếu các đối thủ cạnh tranh đồng loạt giảm giá 30% có thể tạo áp lực tâm lý trong 2 tuần sát Tết."
        ]
      }
    }
  },
  "qualitative_insights": {
    "top_drivers": [
      "Mức giá 369.000đ rất dễ duyệt ngân sách công đoàn cho phần quà Tết nhân viên và quà biếu gia đình.",
      "Bộ quà tặng kèm bao lì xì mạ vàng và hộp trà Ô Long làm tăng cảm giác chu đáo, trọn vẹn 'Bánh ngọt - Trà thơm'.",
      "Bao bì hộp thiếc dập nổi màu đỏ - vàng sang trọng, mang lại cảm giác sung túc may mắn đầu xuân."
    ],
    "top_barriers": [
      "Nhiều đơn vị doanh nghiệp cần xuất hóa đơn VAT điện tử nhanh chóng và giao hàng tận nơi nhiều điểm.",
      "E ngại hạn sử dụng của bánh nếu mua quá sớm từ đầu tháng Chạp."
    ],
    "verbatim_quotes": [
      {
        "name": "Vũ Thu Thảo",
        "age": 34,
        "job": "Trưởng phòng Hành chính Tổng hợp (Hà Nội)",
        "income": "22 - 30 triệu/tháng",
        "quote": "Công ty tôi có 120 nhân viên, ngân sách quà Tết khoảng 400k/người. Combo 369k này có đủ bánh kẹo và trà Ô Long nhìn rất lịch sự, tôi sẽ đề xuất ban giám đốc duyệt mua gói này.",
        "sentiment": "positive"
      },
      {
        "name": "Nguyễn Thành Chung",
        "age": 40,
        "job": "Kế toán Trưởng Doanh nghiệp Dệt may (TP.HCM)",
        "income": "32 - 42 triệu/tháng",
        "quote": "Mức giá 369k hợp lý hơn hẳn giá gốc 450k. Miễn là công ty cam kết bánh date mới sản xuất trong tháng 11 hoặc 12 thì tôi đặt trước 50 suất cho gia đình và đối tác.",
        "sentiment": "positive"
      },
      {
        "name": "Đặng Thị Hồng",
        "age": 29,
        "job": "Kinh doanh Tự do (Cần Thơ)",
        "income": "18 - 25 triệu/tháng",
        "quote": "Tôi mua biếu bố mẹ hai bên. Thích nhất là có sẵn hộp trà Ô Long đi kèm, Tết chỉ cần xách giỏ này về quê là vừa đẹp, không phải lích kích đi mua thêm trà.",
        "sentiment": "positive"
      }
    ]
  },
  "actionable_recommendations": [
    "Chính sách Đặt Sớm (Early Bird): Áp dụng mức giá 369.000đ độc quyền cho các đơn hàng hoàn tất thanh toán trước ngày 20/12 Âm lịch.",
    "Dịch vụ Doanh nghiệp: Miễn phí in logo doanh nghiệp lên thiệp chúc Tết cho các đơn hàng từ 30 combo trở lên.",
    "Hậu cần Giao nhận: Cam kết giao hàng đúng hẹn kèm chính sách 1 đổi 1 ngay lập tức nếu hộp quà bị móp méo trong quá trình vận chuyển."
  ],
  "generated_at": "2026-10-23T16:19:16.640099"
};

export const DEMO_REPORT: ReportPayload = DEMO_NIELSEN_BASES;

export const DEMO_REPORTS: Record<string, ReportPayload> = {
  'DEMO-NIELSEN-BASES': DEMO_NIELSEN_BASES,
  'DEMO-VAN-WESTENDORP': DEMO_VAN_WESTENDORP,
  'DEMO-AB-TESTING': DEMO_AB_TESTING,
  'DEMO-MONADIC': DEMO_MONADIC,
  'DEMO-MAXDIFF': DEMO_MAXDIFF,
  'DEMO-KANO': DEMO_KANO,
  'DEMO-BRAND-MAP': DEMO_BRAND_MAP,
  'DEMO-UA-STUDY': DEMO_UA_STUDY,
  'DEMO-DEAL-ELASTICITY': DEMO_DEAL_ELASTICITY,
};

export function getDemoReport(surveyId: string = 'DEMO-NIELSEN-BASES'): ReportPayload {
  const sid = (surveyId || '').toUpperCase();

  if (sid.includes('VAN') || sid.includes('WESTENDORP') || sid.includes('PSM')) {
    return { ...DEMO_VAN_WESTENDORP, project_id: surveyId };
  }
  if (sid.includes('AB') || sid.includes('SPLIT')) {
    return { ...DEMO_AB_TESTING, project_id: surveyId };
  }
  if (sid.includes('MONADIC')) {
    return { ...DEMO_MONADIC, project_id: surveyId };
  }
  if (sid.includes('MAXDIFF')) {
    return { ...DEMO_MAXDIFF, project_id: surveyId };
  }
  if (sid.includes('KANO')) {
    return { ...DEMO_KANO, project_id: surveyId };
  }
  if (sid.includes('BRAND') || sid.includes('MAP')) {
    return { ...DEMO_BRAND_MAP, project_id: surveyId };
  }
  if (sid.includes('UA') || sid.includes('STUDY') || sid.includes('USAGE')) {
    return { ...DEMO_UA_STUDY, project_id: surveyId };
  }
  if (sid.includes('DEAL') || sid.includes('ELASTICITY')) {
    return { ...DEMO_DEAL_ELASTICITY, project_id: surveyId };
  }

  return { ...DEMO_NIELSEN_BASES, project_id: surveyId };
}
