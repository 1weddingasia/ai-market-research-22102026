"""
Demo Report Data for DEMO-NIELSEN-BASES.
Đảm bảo đồng bộ 100% giữa frontend và backend, hỗ trợ preview và xuất PDF/HTML thực thụ.
"""

from datetime import datetime

def get_demo_report_payload(survey_id: str = "DEMO-NIELSEN-BASES") -> dict:
    return {
        "project_id": survey_id,
        "survey_id": survey_id,
        "model_type": "nielsen_bases",
        "product_info": {
            "company_name": "Tập đoàn Tiêu dùng & Thực phẩm Sạch Á Châu (Asia Food Corp)",
            "product_name": "Trà Kombucha Lên Men Men Xoài Cát Chu Tự Nhiên (330ml)",
            "category": "Thực phẩm & Đồ uống (FMCG / Nước giải khát)",
            "expected_price": "28.000đ / lon (160.000đ / lốc 6 lon)",
            "description": "Thức uống lên men tự nhiên từ trà đen hữu cơ và xoài Cát Chu Đồng Tháp, bổ sung 1 tỷ lợi khuẩn Bacillus Clausii, giảm 50% đường, hỗ trợ tiêu hóa và tăng cường miễn dịch cho giới văn phòng trẻ và gia đình hiện đại.",
        },
        "target_summary": {
            "sample_size": 1000,
            "margin_of_error": "±3.10%",
            "location": "Toàn quốc (Bắc: 35%, Trung: 20%, Nam: 45%)",
            "demographics": "Độ tuổi 22 - 45, thu nhập cá nhân từ 9 - 35 triệu đồng/tháng, quan tâm tới sức khỏe và thức uống hữu cơ.",
        },
        "executive_summary": {
            "viability_score": 78,
            "verdict": "STRONG GO (ĐỦ ĐIỀU KIỆN RA MẮT TOÀN QUỐC)",
            "top_findings": [
                "Chỉ số ý định mua hàng Top-2-Box đạt 73.4%, vượt mức trung bình ngành nước giải khát tốt cho sức khỏe (benchmark 62%).",
                "Độ độc đáo (Uniqueness Score) đạt 8.2/10 nhờ định vị nguyên liệu bản địa 'Xoài Cát Chu Đồng Tháp' kết hợp công nghệ men vi sinh.",
                "Rào cản lớn nhất nằm ở mức giá 28.000đ/lon đang tiệm cận trần chấp nhận; 41% người tiêu dùng phân vân giữa lon đơn và lốc 6 lon.",
                "Khu vực miền Nam và nhóm nhân viên văn phòng 25-34 tuổi có tỷ lệ ủng hộ tuyệt đối cao nhất (81.2%).",
            ],
        },
        "quantitative_metrics": {
            "appeal_score": 8.4,
            "uniqueness_score": 8.2,
            "purchase_intent_top2box": "73.4%",
            "demographic_breakdown": {
                "by_age": {
                    "18-24": 68,
                    "25-34": 81,
                    "35-44": 76,
                    "45-54": 59,
                },
                "by_gender": {
                    "Nữ": 77,
                    "Nam": 69,
                },
            },
            "model_specific": {
                "bases_matrix": [
                    {"dimension": "Độ hấp dẫn ý tưởng (Relevance)", "score": 82, "benchmark": 65},
                    {"dimension": "Tính mới lạ độc đáo (Uniqueness)", "score": 84, "benchmark": 60},
                    {"dimension": "Mức độ tin cậy bao bì (Believability)", "score": 76, "benchmark": 70},
                    {"dimension": "Độ tương xứng giá/giá trị (Value for Money)", "score": 68, "benchmark": 66},
                    {"dimension": "Khả năng mua lại (Repeat Purchase Intent)", "score": 79, "benchmark": 58},
                ],
                "net_promoter_score": 54,
                "deepseek_audit": {
                    "auditor_model": "DeepSeek Reasoner (Dual-AI Strategic Auditor)",
                    "auditor_seal": "DeepSeek-V3 · Strategic Economic Council Certified",
                    "data_consistency_audit": "Kiểm định 1.000 personas đối chiếu ma trận phân tầng GSO 2024: Phân phối chuẩn p < 0.05, không phát hiện dị biệt thống kê. Tương quan Spearman giữa mức độ Độc đáo và Ý định mua đạt r = 0.76 (rất mạnh).",
                    "executive_verdict": "Dự án 'Trà Kombucha Xoài Cát Chu' đạt điểm khả thi 78/100 (Strong Go). Đạt ngưỡng an toàn vượt trội ở chỉ số thử nghiệm (Trial Rate), nhưng cần giải tỏa rào cản nhạy cảm giá 28.000đ bằng chiến lược combo ban đầu.",
                    "strategic_pillars": [
                        {
                            "pillar_name": "Tối ưu hóa Khái niệm & USP",
                            "icon": "💡",
                            "recommendation": "Khai thác tối đa bảo chứng xuất xứ 'Xoài Cát Chu Đồng Tháp' và '1 tỷ lợi khuẩn Bacillus Clausii' làm Hero Claims trên mặt chính bao bì.",
                        },
                        {
                            "pillar_name": "Kích hoạt Dùng thử (Trial Rate)",
                            "icon": "🎯",
                            "recommendation": "Triển khai ưu đãi ra mắt lốc 6 lon với mức giá dùng thử 149.000đ tại các chuỗi cửa hàng tiện lợi TP.HCM và Hà Nội để phá vỡ rào cản mua lần đầu.",
                        },
                        {
                            "pillar_name": "Rào chắn Giảm Rủi ro Thất bại",
                            "icon": "🛡️",
                            "recommendation": "Đính chính rõ thông điệp 'Đồ uống không cồn (< 0.5%)' để giải tỏa triệt để băn khoăn của 34% phụ nữ mang thai và người tiêu dùng gia đình.",
                        },
                    ],
                    "strategic_recommendations": [
                        "Tối ưu hóa Khái niệm & USP: Khai thác tối đa bảo chứng xuất xứ 'Xoài Cát Chu Đồng Tháp' và '1 tỷ lợi khuẩn Bacillus Clausii' làm Hero Claims trên mặt chính bao bì.",
                        "Kích hoạt Dùng thử (Trial Rate): Triển khai ưu đãi ra mắt lốc 6 lon với mức giá dùng thử 149.000đ tại các chuỗi cửa hàng tiện lợi TP.HCM và Hà Nội để phá vỡ rào cản mua lần đầu.",
                        "Rào chắn Giảm Rủi ro Thất bại: Đính chính rõ thông điệp 'Đồ uống không cồn (< 0.5%)' để giải tỏa triệt để băn khoăn của 34% phụ nữ mang thai và người tiêu dùng gia đình.",
                    ],
                    "critical_risks": [
                        "Rủi ro định vị nhầm lẫn: 28% người tiêu dùng lớn tuổi có thể ngộ nhận Kombucha là bia hoặc thức uống có men say nếu nhãn mác không ghi rõ không cồn.",
                        "Rủi ro cạnh tranh trên kệ lạnh: Cạnh tranh gay gắt từ các thương hiệu trà hữu cơ đóng chai có ngân sách khuyến mãi và thị phần ổn định.",
                    ],
                },
            },
        },
        "qualitative_insights": {
            "top_drivers": [
                "Nguyên liệu xoài Cát Chu tạo cảm giác tươi ngon nhiệt đới thân quen, dễ uống hơn vị chua gắt của Kombucha truyền thống.",
                "Lợi khuẩn cho hệ vi sinh đường ruột và giảm 50% đường đánh trúng tâm lý phòng ngừa tiểu đường và giữ dáng.",
                "Quy cách lon nhôm 330ml tiện lợi, thiết kế phong cách hiện đại thích hợp đặt trên bàn làm việc.",
            ],
            "top_barriers": [
                "Mức giá 28.000đ cao hơn nước ngọt có ga và trà đóng chai phổ thông (10.000đ - 15.000đ).",
                "Một bộ phận người tiêu dùng lớn tuổi chưa hiểu rõ khái niệm 'Kombucha' và e ngại men sống lên men có cồn nhẹ.",
                "Mong muốn có thêm chính sách dùng thử hoặc combo tặng kèm tại các chuỗi cửa hàng tiện lợi.",
            ],
            "verbatim_quotes": [
                {
                    "name": "Nguyễn Thảo My",
                    "age": 27,
                    "job": "Chuyên viên Truyền thông & PR (TP.HCM)",
                    "income": "18 - 25 triệu/tháng",
                    "quote": "Mình rất thích xoài Cát Chu vì ngọt thanh thơm đặc trưng. Kombucha ngoài thị trường thường bị chua quá khó uống, nếu vị xoài này giữ được độ chua ngọt cân bằng thì mình sẵn sàng mua uống hàng ngày tại công ty.",
                    "sentiment": "positive",
                },
                {
                    "name": "Trần Hoàng Long",
                    "age": 24,
                    "job": "Nhân viên Kinh doanh BĐS (Đà Nẵng)",
                    "income": "9 - 14 triệu/tháng",
                    "quote": "Sản phẩm tốt, nhưng giá 28k một lon thì hơi cao so với thu nhập hàng ngày của sinh viên và nhân viên mới đi làm. Nếu bán lốc 6 lon với giá ưu đãi tầm 140k hoặc có chương trình mua 2 tặng 1 tuần đầu thì sẽ dễ chốt đơn hơn.",
                    "sentiment": "negative",
                },
                {
                    "name": "Phạm Minh Đức",
                    "age": 38,
                    "job": "Kỹ sư Phần mềm Senior (Hà Nội)",
                    "income": "25 - 35 triệu/tháng",
                    "quote": "Gia đình tôi hiện tại chuyển hẳn sang đồ uống ít đường và men vi sinh. Điểm mấu chốt là nhãn hàng phải công bố rõ hàm lượng đường thực tế và chứng chỉ vệ sinh an toàn thực phẩm trên bao bì.",
                    "sentiment": "neutral",
                },
                {
                    "name": "Lê Hải Yến",
                    "age": 31,
                    "job": "Quản lý Nhân sự (Cần Thơ)",
                    "income": "15 - 20 triệu/tháng",
                    "quote": "Lon thiết kế đẹp, nhìn cao cấp giống mấy dòng nước ép nhập khẩu. Mua làm quà biếu đồng nghiệp hoặc mời khách đến nhà cũng thấy sang.",
                    "sentiment": "positive",
                },
            ],
        },
        "actionable_recommendations": [
            "Chiến lược Giá & Kích hoạt: Duy trì mức giá niêm yết 28.000đ nhưng áp dụng ưu đãi ra mắt 'Combo Trải Nghiệm Lốc 6 Lon 149.000đ' để vượt qua rào cản giá ban đầu.",
            "Thông điệp Truyền thông: Tập trung truyền thông 2 trụ cột: 'Vị ngon ngọt thanh xoài Cát Chu chín cây' và '1 tỷ lợi khuẩn sống bảo vệ tiêu hóa', tránh dùng từ ngữ y khoa khó hiểu.",
            "Kênh Phân phối Ưu tiên: Tập trung phủ sóng tại các chuỗi cửa hàng tiện lợi (GS25, Circle K, 7-Eleven) và siêu thị cao cấp (Annam Gourmet, WinMart+) tại TP.HCM và Hà Nội trước khi mở rộng tỉnh thành.",
            "Truyền thông Giáo dục thị trường: Cung cấp thông tin rõ ràng về nồng độ cồn < 0.5% (được công nhận là đồ uống không cồn) để gỡ bỏ băn khoăn của nhóm khách hàng gia đình.",
        ],
        "generated_at": datetime.utcnow().isoformat(),
    }
