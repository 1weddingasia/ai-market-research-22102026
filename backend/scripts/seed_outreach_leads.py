"""
Seed script: Khởi tạo dữ liệu mẫu cho hệ thống B2B Cold Outreach & Cài đặt an toàn.
Tạo sẵn danh mục các doanh nghiệp tiềm năng theo ngành tại Việt Nam để anh Lợi kiểm soát & thử nghiệm.
"""

import os
import sys

# Fix Windows console encoding for Unicode/emoji
if sys.platform == "win32":
    os.environ.setdefault("PYTHONUTF8", "1")
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    if hasattr(sys.stderr, "reconfigure"):
        sys.stderr.reconfigure(encoding="utf-8", errors="replace")

# Thêm thư mục backend vào sys.path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from database import init_db, SessionLocal, OutreachLead, OutreachSetting
from services.outreach_service import set_setting

SAMPLE_LEADS = [
    # ── F&B & Đồ uống (Trà, Cà phê, Nước giải khát, Bia thủ công) ──────────
    {
        "company_name": "Công ty CP Cà phê & Nông sản LangBiang Roasters",
        "contact_name": "Anh Hoàng Tuấn",
        "contact_title": "Giám đốc Phát triển Sản phẩm (R&D)",
        "email": "tuan.hoang@langbiangroasters.vn",
        "industry": "coffee",
        "website": "https://langbiangroasters.vn",
        "suggested_model": "van_westendorp",
        "notes": "Quan tâm đến định giá phân khúc cà phê phin giấy và quà tặng du lịch Đà Lạt.",
    },
    {
        "company_name": "Công ty Nước Giải Khát & Trà Lên Men Mộc Nhiên Kombucha",
        "contact_name": "Chị Thanh Trúc",
        "contact_title": "Trưởng phòng Tiếp thị Thương hiệu (Brand Manager)",
        "email": "truc.le@mocnhienkombucha.com",
        "industry": "fnb",
        "website": "https://mocnhienkombucha.com",
        "suggested_model": "nielsen_bases",
        "notes": "Chuẩn bị ra mắt 2 vị trái cây nhiệt đới mới vào mùa hè 2026.",
    },
    {
        "company_name": "Tập đoàn Thực phẩm & Sữa Hạt Dinh Dưỡng VinaNuts",
        "contact_name": "Anh Minh Quân",
        "contact_title": "Phó Tổng Giám Đốc Kinh Doanh",
        "email": "quan.minh@vinanuts.com.vn",
        "industry": "fnb",
        "website": "https://vinanuts.com.vn",
        "suggested_model": "nielsen_bases",
        "notes": "Đang nghiên cứu dòng sữa hạt sen kết hợp yến mạch không đường cho gia đình trẻ.",
    },
    {
        "company_name": "Xưởng Trà Trái Cây Đóng Chai Tươi Sạch Dalat Harvest",
        "contact_name": "Chị Mai Phương",
        "contact_title": "Đồng sáng lập (Co-Founder)",
        "email": "phuong.mai@dalatharvest.vn",
        "industry": "fnb",
        "website": "https://dalatharvest.vn",
        "suggested_model": "nielsen_bases",
        "notes": "Mục tiêu vào chuỗi 7-Eleven và FamilyMart tại TP.HCM.",
    },

    # ── Mỹ phẩm & Chăm sóc cá nhân (Skincare, Dược mỹ phẩm bản địa) ────────
    {
        "company_name": "Công ty Dược Mỹ Phẩm Thuần Chay Cocona Botanica",
        "contact_name": "Chị Thảo Vy",
        "contact_title": "Sáng lập & Giám đốc Điều hành (CEO)",
        "email": "vy.nguyen@coconabotanica.vn",
        "industry": "cosmetics",
        "website": "https://coconabotanica.vn",
        "suggested_model": "brand_map",
        "notes": "Cần đo lường niềm tin người tiêu dùng đối với nguyên liệu tràm trà và dừa Bến Tre.",
    },
    {
        "company_name": "Mộc Thảo Homelab - Mỹ Phẩm Xanh Bản Địa",
        "contact_name": "Anh Đức Thắng",
        "contact_title": "Giám đốc Marketing",
        "email": "thang.duc@mocthaohomelab.vn",
        "industry": "cosmetics",
        "website": "https://mocthaohomelab.vn",
        "suggested_model": "brand_map",
        "notes": "Đang tìm hiểu phân khúc chống lão hóa cho độ tuổi 28 - 40 tại Hà Nội và Đà Nẵng.",
    },
    {
        "company_name": "Viện Chăm Sóc Da & Dược Mỹ Phẩm SkinBio Lab",
        "contact_name": "Bác sĩ Thu Hà",
        "contact_title": "Cố vấn R&D Sản phẩm",
        "email": "ha.pham@skinbiolab.com.vn",
        "industry": "cosmetics",
        "website": "https://skinbiolab.com.vn",
        "suggested_model": "brand_map",
        "notes": "Thử nghiệm phản ứng thị trường với dòng kem chống nắng quang phổ rộng mới.",
    },

    # ── Bánh kẹo & Quà biếu sức khỏe ──────────────────────────────────────
    {
        "company_name": "Công ty Bánh Kẹo & Quà Tặng Delica Crown Heritage",
        "contact_name": "Anh Quốc Hưng",
        "contact_title": "Giám đốc Kinh doanh Kênh Hiện Đại (MT)",
        "email": "hung.quoc@delicacrown.vn",
        "industry": "confectionery",
        "website": "https://delicacrown.vn",
        "suggested_model": "ab_testing",
        "notes": "A/B Testing đối đầu 2 mẫu thiết kế bao bì thiếc cho mùa biếu tặng Tết.",
    },
    {
        "company_name": "Tập đoàn Bánh Mứt Kẹo Hoàng Kim Delica Crown Group",
        "contact_name": "Chị Kim Oanh",
        "contact_title": "Trưởng phòng Quản lý Sản phẩm (Product Lead)",
        "email": "oanh.kim@delicacrown.com.vn",
        "industry": "confectionery",
        "website": "https://delicacrown.com.vn",
        "suggested_model": "deal_elasticity",
        "notes": "Khảo sát độ co giãn giá và chính sách chiết khấu mua combo số lượng lớn cho công ty.",
    },
    {
        "company_name": "Bánh Dinh Dưỡng Hạt Granola Healthy Snack VN",
        "contact_name": "Anh Tuấn Anh",
        "contact_title": "Founder",
        "email": "tuananh@healthysnack.vn",
        "industry": "confectionery",
        "website": "https://healthysnack.vn",
        "suggested_model": "ab_testing",
        "notes": "Khảo sát ý kiến dân văn phòng về thanh bar ngũ cốc ít calo.",
    },

    # ── Thiết bị gia dụng & Đồ bếp thông minh ─────────────────────────────
    {
        "company_name": "Tập đoàn Thiết bị Gia dụng ElmaTech Euro Vietnam",
        "contact_name": "Anh Tiến Dũng",
        "contact_title": "Trưởng phòng R&D Thiết bị Bếp",
        "email": "dung.tien@elmatech.vn",
        "industry": "home_appliances",
        "website": "https://elmatech.vn",
        "suggested_model": "kano",
        "notes": "Khảo sát Kano model để ưu tiên tính năng cho thế hệ nồi chiên không dầu tích hợp hấp.",
    },
    {
        "company_name": "Công ty Nhà Thông Minh SmartLife Solution",
        "contact_name": "Anh Hữu Toàn",
        "contact_title": "Giám đốc Công nghệ & Sản phẩm",
        "email": "toan.huu@smartlifevn.com",
        "industry": "home_appliances",
        "website": "https://smartlifevn.com",
        "suggested_model": "kano",
        "notes": "Nghiên cứu mức độ quan tâm của căn hộ chung cư đối với robot lau nhà có trạm sạc tự giặt giẻ.",
    },

    # ── Thực phẩm dinh dưỡng & Chế biến sẵn ──────────────────────────────
    {
        "company_name": "Công ty CP Thực phẩm Bản Địa VinaBroth Foods",
        "contact_name": "Anh Thành Nam",
        "contact_title": "Giám đốc Vận hành (COO)",
        "email": "nam.thanh@vinabroth.vn",
        "industry": "food_nutrition",
        "website": "https://vinabroth.vn",
        "suggested_model": "monadic",
        "notes": "Kiểm tra mức độ hấp dẫn của ý niệm Nước hầm xương cô đặc không chất bảo quản.",
    },
    {
        "company_name": "Công ty Nông Sản Hữu Cơ Chế Biến Sâu Mekong Organic",
        "contact_name": "Chị Bích Hạnh",
        "contact_title": "Giám đốc Phát triển Bền vững",
        "email": "hanh.bich@mekongorganic.com.vn",
        "industry": "food_nutrition",
        "website": "https://mekongorganic.com.vn",
        "suggested_model": "monadic",
        "notes": "Cần thẩm định thị hiếu người tiêu dùng TP.HCM với trái cây sấy thăng hoa xuất khẩu.",
    },

    # ── Mẹ & Bé, Đồ chơi giáo dục ─────────────────────────────────────────
    {
        "company_name": "Công ty Sản phẩm Trẻ Em EcoBaby Care Vietnam",
        "contact_name": "Chị Ngọc Linh",
        "contact_title": "Sáng lập & Brand Director",
        "email": "linh.ngoc@ecobabycare.vn",
        "industry": "general",
        "website": "https://ecobabycare.vn",
        "suggested_model": "van_westendorp",
        "notes": "Khảo sát độ sẵn sàng chi trả cho dòng tã bỉm sợi tre hữu cơ kháng khuẩn tự nhiên.",
    },

    # ── Dịch vụ Cưới & Sự kiện cao cấp ───────────────────────────────────
    {
        "company_name": "Tổ Hợp Dịch Vụ Cưới & Sự Kiện Royal Wedding & Event",
        "contact_name": "Chị Thanh Hằng",
        "contact_title": "Giám đốc Dịch vụ Khách hàng",
        "email": "hang.thanh@royalwedding.com.vn",
        "industry": "general",
        "website": "https://royalwedding.com.vn",
        "suggested_model": "maxdiff",
        "notes": "Xếp hạng MaxDiff những yếu tố cô dâu chú rể quan tâm nhất khi đặt tiệc cưới ngoài trời.",
    },
]


def seed():
    print("Khởi tạo cấu hình và nạp dữ liệu Outreach...")
    init_db()
    db = SessionLocal()

    try:
        # Cấu hình mặc định an toàn
        set_setting(db, "is_active", "false")           # Mặc định tắt để Founder tự bật
        set_setting(db, "daily_limit", "50")            # Giới hạn 50 email/ngày
        set_setting(db, "min_interval", "180")          # Giãn cách tối thiểu 3 phút
        set_setting(db, "max_interval", "480")          # Giãn cách tối đa 8 phút
        set_setting(db, "ignore_business_hours", "false") # Chỉ gửi trong giờ hành chính

        # Nạp các doanh nghiệp mẫu nếu chưa có
        added_count = 0
        for item in SAMPLE_LEADS:
            existing = db.query(OutreachLead).filter(OutreachLead.email == item["email"]).first()
            if not existing:
                lead = OutreachLead(
                    company_name=item["company_name"],
                    contact_name=item["contact_name"],
                    contact_title=item["contact_title"],
                    email=item["email"],
                    industry=item["industry"],
                    website=item["website"],
                    suggested_model=item.get("suggested_model", "nielsen_bases"),
                    notes=item.get("notes"),
                    status="PENDING",
                    sent_count=0,
                )
                db.add(lead)
                added_count += 1

        db.commit()
        print(f"✅ Đã nạp thành công {added_count} doanh nghiệp mục tiêu.")
        print(f"Tổng số doanh nghiệp trong hàng đợi: {db.query(OutreachLead).count()}")
    except Exception as e:
        db.rollback()
        print(f"❌ Lỗi khi nạp dữ liệu: {e}")
    finally:
        db.close()


if __name__ == "__main__":
    seed()
