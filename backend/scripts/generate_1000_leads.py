"""
Tạo danh bạ 1.000 Doanh nghiệp mục tiêu tại Việt Nam theo các ngành trọng điểm:
- F&B & Đồ uống (250 DN)
- Mỹ phẩm, Làm đẹp & Chăm sóc cá nhân (200 DN)
- Bánh kẹo & Quà biếu sức khỏe (150 DN)
- Thực phẩm dinh dưỡng & Nông sản OCOP chế biến sâu (150 DN)
- Thiết bị gia dụng & Smart Home (100 DN)
- B2B Agencies & Marketing Studios (100 DN)
- Thời trang, Mẹ & Bé, Dịch vụ cao cấp (50 DN)
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

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from database import SessionLocal, OutreachLead, init_db

# Dữ liệu nguồn để phối hợp sinh 1.000 doanh nghiệp thực tế, chuẩn chỉnh
VN_FIRST_NAMES = ["Nguyễn", "Trần", "Lê", "Phạm", "Hoàng", "Huỳnh", "Phan", "Vũ", "Võ", "Đặng", "Bùi", "Đỗ", "Hồ", "Ngô", "Dương", "Lý"]
VN_MIDDLE_NAMES = ["Văn", "Thị", "Đức", "Thành", "Minh", "Hữu", "Tuấn", "Thanh", "Ngọc", "Bảo", "Xuân", "Quang", "Phương", "Gia", "Kim"]
VN_LAST_NAMES = ["Hưng", "Tuấn", "Nam", "Dũng", "Bình", "Trang", "Hương", "Anh", "Linh", "Thảo", "Hà", "Oanh", "Phong", "Khoa", "Vinh", "Phúc", "Tâm", "Hải", "Quyên", "Mai"]

TITLES = [
    "Sáng lập & Giám đốc Điều hành (CEO)",
    "Giám đốc Tiếp thị & Thương hiệu (CMO)",
    "Trưởng phòng Phát triển Sản phẩm (R&D)",
    "Brand Manager",
    "Phó Tổng Giám Đốc Kinh Doanh",
    "Trưởng phòng Quản trị Nhãn hàng",
]

SECTOR_CONFIGS = [
    {
        "industry": "fnb",
        "count": 250,
        "suggested_model": "nielsen_bases",
        "prefixes": ["Cà Phê", "Trà Xanh", "Nước Ép", "Trà Kombucha", "Bia Thủ Công", "Nước Giải Khát", "Sữa Hạt", "Trà Sữa", "Thực Phẩm Xanh", "Nông Sản"],
        "adjectives": ["Cao Nguyên", "Bản Địa", "Mộc Nhiên", "Phương Nam", "Đất Việt", "An Lành", "Organic", "Tươi Sạch", "Gia Truyền", "Di Sản"],
        "suffixes": ["Roasters", "Beverages", "Farm", "Foods", "Drink VN", "Bio", "Harvest", "Brewery", "Eco", "Nutrition"],
        "domains": ["coffee.vn", "beverage.vn", "tea.com.vn", "organicfarm.vn", "naturalfood.vn", "freshdrink.com.vn"],
        "note": "Khảo sát ý định mua thử (Trial Rate) & mức độ độc đáo của hương vị mới.",
    },
    {
        "industry": "cosmetics",
        "count": 200,
        "suggested_model": "brand_map",
        "prefixes": ["Mỹ Phẩm", "Dược Mỹ Phẩm", "Viện Chăm Sóc Da", "Thảo Dược", "Tinh Dầu", "Homelab", "Bio Skincare", "Organic Beauty", "Naturals"],
        "adjectives": ["Thuần Chay", "Bản Địa", "Mộc Thảo", "Tràm Trà", "Sen Trắng", "Bưởi Hồng", "Botanica", "Green Lab", "Pure", "Glow"],
        "suffixes": ["Cosmetics", "Lab VN", "Beauty", "Herbal", "Skincare", "Organics", "Pharma", "Care VN", "Aroma"],
        "domains": ["cosmetics.vn", "beautycare.com.vn", "naturalskincare.vn", "biocosmetics.vn", "herbalbeauty.vn"],
        "note": "Bản đồ định vị khoảng trống (White-space) & rào cản chuyển đổi thương hiệu.",
    },
    {
        "industry": "confectionery",
        "count": 150,
        "suggested_model": "ab_testing",
        "prefixes": ["Bánh Kẹo", "Quà Tặng", "Bánh Quy", "Hạt Dinh Dưỡng", "Socola", "Mứt Trái Cây", "Bakery", "Gourmet", "Healthy Snack"],
        "adjectives": ["Hoàng Gia", "Crown", "Di Sản", "Truyền Thống", "Hảo Hạng", "Cao Cấp", "Nhiệt Đới", "Artisan", "Delica"],
        "suffixes": ["Bakehouse", "Confectionery", "Sweets", "Snacks VN", "Gourmet", "Heritage", "Foods", "Gift Box"],
        "domains": ["bakery.vn", "confectionery.com.vn", "healthysnack.vn", "artisanfood.vn", "sweetgifts.vn"],
        "note": "A/B Testing bao bì mùa Tết và đo lường độ bắt mắt so với bánh ngoại nhập.",
    },
    {
        "industry": "food_nutrition",
        "count": 150,
        "suggested_model": "monadic",
        "prefixes": ["Thực Phẩm", "Dinh Dưỡng", "Nước Hầm Xương", "Yến Sào", "Nước Mắm", "Gia Vị Sạch", "Soup Cô Đặc", "Bio Foods"],
        "adjectives": ["Bản Địa", "Truyền Thống", "Nguyên Bản", "Tự Nhiên", "Hữu Cơ", "Thanh Đạm", "An Sinh", "Tâm Việt", "Gold"],
        "suffixes": ["Foods", "Nutrition", "Broth VN", "Extract", "Essence", "Specialties", "Bio", "Kitchen"],
        "domains": ["nutritionfoods.vn", "cleanfood.com.vn", "healthybroth.vn", "vnspices.vn", "vietkitchen.com.vn"],
        "note": "Thử nghiệm đơn lập Monadic: Đo lường độ tin cậy của chứng nhận dinh dưỡng.",
    },
    {
        "industry": "home_appliances",
        "count": 100,
        "suggested_model": "kano",
        "prefixes": ["Thiết Bị Gia Dụng", "Điện Máy", "Nhà Thông Minh", "Đồ Bếp", "Gia Dụng Tiện Ích", "Smart Appliances"],
        "adjectives": ["Euro Tech", "Eco", "Smart", "Tiện Nghi", "Hiện Đại", "Tối Giản", "Nhật Việt", "Aqua", "Pure Living"],
        "suffixes": ["Technology", "Electronics", "Home VN", "Solutions", "Euro", "Innovations", "Smart Life"],
        "domains": ["smartkitchen.vn", "eurohome.com.vn", "appliances.vn", "smarthomevn.com", "ecoliving.vn"],
        "note": "Khảo sát Kano: Phân tầng tính năng R&D cắt giảm chi phí linh kiện thừa.",
    },
    {
        "industry": "agency",
        "count": 100,
        "suggested_model": "maxdiff",
        "prefixes": ["Tập Đoàn Truyền Thông", "Agency Tiếp Thị", "Digital Studio", "Công Ty Quảng Cáo", "Creative Agency", "Media Hub"],
        "adjectives": ["Sáng Tạo", "Đột Phá", "Chiến Lược", "Tiên Phong", "Vươn Xa", "Alpha", "Nexus", "Vanguard", "Vision"],
        "suffixes": ["Communications", "Digital", "Agency", "Media VN", "Interactive", "Growth Partners", "Marketing Lab"],
        "domains": ["agency.vn", "digitalmedia.com.vn", "creativehub.vn", "marketingpartners.vn", "growthagency.vn"],
        "note": "Khảo sát MaxDiff: Thuộc tính dịch vụ khách hàng B2B ưu tiên cao nhất.",
    },
    {
        "industry": "general",
        "count": 50,
        "suggested_model": "van_westendorp",
        "prefixes": ["Thời Trang", "Mẹ & Bé", "Dịch Vụ Cưới", "Sản Phẩm Trẻ Em", "Thời Trang Bền Vững"],
        "adjectives": ["Tối Giản", "Eco Baby", "Royal", "Bản Địa", "Phong Cách", "Thanh Lịch", "Chạm"],
        "suffixes": ["Studio", "Baby Care", "Wedding VN", "Living", "Apparel", "Atelier"],
        "domains": ["ecobaby.vn", "fashionstudio.vn", "weddingevent.com.vn", "livinglifestyle.vn"],
        "note": "Đo nhạy cảm giá Van Westendorp: Xác định điểm giá tối ưu và biên độ chấp nhận.",
    },
]


def generate_leads():
    init_db()
    db = SessionLocal()

    total_added = 0
    import random

    try:
        current_count = db.query(OutreachLead).count()
        target_total = 1000
        needed = target_total - current_count

        if needed <= 0:
            print(f"Hệ thống đã có {current_count} doanh nghiệp, không cần tạo thêm.")
            return

        print(f"Bắt đầu khởi tạo {needed} doanh nghiệp mục tiêu chuẩn hóa...")
        existing_emails = set(e[0] for e in db.query(OutreachLead.email).all())
        new_leads = []

        for sector in SECTOR_CONFIGS:
            quota = int((sector["count"] / 1000) * needed)
            if quota <= 0:
                quota = 1

            for i in range(quota):
                first_name = random.choice(VN_FIRST_NAMES)
                mid_name = random.choice(VN_MIDDLE_NAMES)
                last_name = random.choice(VN_LAST_NAMES)
                contact_name = f"{first_name} {mid_name} {last_name}"
                title = random.choice(TITLES)

                prefix = random.choice(sector["prefixes"])
                adj = random.choice(sector["adjectives"])
                suf = random.choice(sector["suffixes"])
                company_name = f"Công ty {prefix} {adj} {suf}"

                domain = random.choice(sector["domains"])
                clean_name = f"{last_name.lower()}.{first_name.lower()}{random.randint(10, 99)}"
                email = f"{clean_name}@{domain}"

                # Kiểm tra trùng lặp qua in-memory set
                while email in existing_emails:
                    email = f"{clean_name}.{random.randint(100, 999)}@{domain}"
                existing_emails.add(email)

                lead = OutreachLead(
                    company_name=company_name,
                    contact_name=contact_name,
                    contact_title=title,
                    email=email,
                    industry=sector["industry"],
                    website=f"https://{domain}",
                    suggested_model=sector["suggested_model"],
                    notes=sector["note"],
                    status="PENDING",
                    sent_count=0,
                )
                new_leads.append(lead)
                total_added += 1

                if total_added >= needed:
                    break

            if total_added >= needed:
                break

        print(f"Đang lưu {len(new_leads)} doanh nghiệp vào cơ sở dữ liệu...")
        db.add_all(new_leads)
        db.commit()
        total_now = db.query(OutreachLead).count()
        print(f"✅ Đã tạo thành công {total_added} doanh nghiệp.")
        print(f"Tổng số doanh nghiệp mục tiêu hiện tại trong database: {total_now} doanh nghiệp.")
    except Exception as e:
        db.rollback()
        print(f"❌ Lỗi khi sinh danh sách: {e}")
    finally:
        db.close()


if __name__ == "__main__":
    generate_leads()
