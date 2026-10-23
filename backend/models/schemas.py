"""
T1.3: Pydantic Schemas — Request/Response models cho FastAPI.
"""

from datetime import datetime
from typing import Any, Optional
from pydantic import BaseModel, EmailStr, Field


# ─── Survey Creation ───────────────────────────────────────────────────────────

class ProductInfoBase(BaseModel):
    """Base: mọi gói đều có tên sản phẩm."""
    product_name: str = Field(..., min_length=2, max_length=200)
    description: str  = Field(..., min_length=10, max_length=2000)


class NielsenBasesInput(ProductInfoBase):
    """Gói 1: Kiểm định ý tưởng sản phẩm."""
    expected_price: Optional[str] = None     # VD: "350.000đ"
    category: Optional[str] = None            # Ngành hàng


class VanWestendorpInput(ProductInfoBase):
    """Gói 2: Đo độ nhạy cảm về giá."""
    price_range_min: Optional[int] = None     # Giá sàn gợi ý (VND)
    price_range_max: Optional[int] = None     # Giá trần gợi ý (VND)


class ABTestInput(BaseModel):
    """Gói 3: A/B Testing bao bì & thông điệp."""
    option_a_description: str = Field(..., min_length=10)
    option_b_description: str = Field(..., min_length=10)
    option_a_image_url: Optional[str] = None  # URL ảnh đã upload lên R2
    option_b_image_url: Optional[str] = None
    brand_name: Optional[str] = None


class UAStudyInput(BaseModel):
    """Gói 4: Khảo sát thói quen & thái độ."""
    industry: str = Field(..., min_length=2, max_length=200,
                          description="Ngành hàng cần nghiên cứu. VD: 'Trà sữa', 'Dịch vụ Spa'")
    key_competitors: Optional[str] = None     # Các đối thủ cần đề cập


class DealElasticityInput(BaseModel):
    """Gói 5: Khảo sát combo ưu đãi & lễ Tết."""
    deal_description: str = Field(..., min_length=10, max_length=2000,
                                   description="Mô tả chi tiết combo/ưu đãi")
    original_price: Optional[int] = None     # Giá gốc (VND)
    discounted_price: Optional[int] = None   # Giá ưu đãi (VND)
    gift_items: Optional[str] = None          # Quà tặng kèm nếu có


class MonadicConceptInput(BaseModel):
    """Gói 6: Monadic Concept Testing (Thử nghiệm ý tưởng độc lập)."""
    concept_a_title: str = Field(..., min_length=2, max_length=200)
    concept_a_description: str = Field(..., min_length=10, max_length=2000)
    concept_a_price: Optional[str] = None
    concept_b_title: str = Field(..., min_length=2, max_length=200)
    concept_b_description: str = Field(..., min_length=10, max_length=2000)
    concept_b_price: Optional[str] = None


class MaxDiffInput(ProductInfoBase):
    """Gói 7: MaxDiff Best-Worst Scaling."""
    attributes: list[str] = Field(..., min_length=4, max_length=15,
                                  description="Danh sách 6-10 tính năng hoặc thông điệp bán hàng")


class KanoInput(ProductInfoBase):
    """Gói 8: Kano Feature Prioritization."""
    features: list[str] = Field(..., min_length=2, max_length=10,
                                description="Danh sách 3-5 tính năng dự kiến phát triển")


class BrandMapInput(ProductInfoBase):
    """Gói 9: Brand Perceptual Mapping."""
    brands: list[str] = Field(..., min_length=2, max_length=8,
                              description="Danh sách 3-5 thương hiệu cần định vị")
    axis_x_label: Optional[str] = "Giá cả (Bình dân ↔ Cao cấp)"
    axis_y_label: Optional[str] = "Mức độ Đổi mới Sáng tạo (Truyền thống ↔ Đột phá)"


class SurveyCreateRequest(BaseModel):
    """Request tạo survey mới."""
    model_type: str = Field(
        ...,
        pattern="^(nielsen_bases|van_westendorp|ab_testing|ua_study|deal_elasticity|monadic|maxdiff|kano|brand_map)$"
    )
    # Phạm vi mẫu
    region: Optional[str] = None       # None = toàn quốc
    zone: Optional[str] = None         # Tỉnh/thành cụ thể
    min_age: int = Field(default=18, ge=15, le=80)
    max_age: int = Field(default=65, ge=15, le=80)
    sample_size: int = Field(default=1000, ge=100, le=3000)

    # Thông tin sản phẩm (dạng dict, parse theo model_type)
    product_info: dict[str, Any] = Field(...)

    # Email nhận kết quả
    customer_email: Optional[str] = None


class SurveyCreateResponse(BaseModel):
    """Response sau khi tạo survey."""
    survey_id: str          # e.g. "PANEL892"
    price_amount: int       # VND
    qr_data: dict           # Data để generate VietQR
    status: str             # "PENDING_PAYMENT"
    created_at: datetime


# ─── Survey Status ─────────────────────────────────────────────────────────────

class SurveyStatusResponse(BaseModel):
    survey_id: str
    status: str
    model_type: str
    sample_size: int
    created_at: datetime
    completed_at: Optional[datetime] = None
    error_msg: Optional[str] = None


# ─── Results ───────────────────────────────────────────────────────────────────

class TargetSummary(BaseModel):
    sample_size: int
    margin_of_error: str
    location: str
    demographics: str


class ExecutiveSummary(BaseModel):
    viability_score: int          # 0-100
    verdict: str                  # 1-2 câu kết luận
    top_findings: list[str]       # 3 điểm nổi bật


class DemographicBreakdown(BaseModel):
    by_age: dict[str, float]      # {"18-24": 72.0, ...}
    by_gender: dict[str, float]   # {"male": 75.0, "female": 80.0}


class QuantitativeMetrics(BaseModel):
    appeal_score: Optional[float] = None        # Thang 1-5
    uniqueness_score: Optional[float] = None
    purchase_intent_top2box: Optional[str] = None  # e.g. "68.5%"
    demographic_breakdown: Optional[DemographicBreakdown] = None
    model_specific: dict[str, Any] = {}         # Dữ liệu riêng từng model


class VerbatimQuote(BaseModel):
    name: str
    age: int
    job: str
    income: Optional[str] = None
    quote: str
    sentiment: str   # "positive" | "negative" | "neutral"


class QualitativeInsights(BaseModel):
    top_drivers: list[str]
    top_barriers: list[str]
    verbatim_quotes: list[VerbatimQuote]


class ReportPayload(BaseModel):
    """Schema đầy đủ của báo cáo — khớp với JSON stored trong DB."""
    project_id: str
    model_type: str
    target_summary: TargetSummary
    executive_summary: ExecutiveSummary
    quantitative_metrics: QuantitativeMetrics
    qualitative_insights: QualitativeInsights
    actionable_recommendations: list[str]
    generated_at: datetime


# ─── Payment ───────────────────────────────────────────────────────────────────

class SepayWebhookPayload(BaseModel):
    """Payload từ SePay webhook — thiết kế phòng thủ tương thích mọi phiên bản SePay."""
    model_config = {"extra": "ignore"}

    id: Any
    gateway: Optional[str] = None
    transactionDate: Optional[str] = None
    accountNumber: Optional[str] = None
    subAccount: Optional[str] = None
    code: Optional[str] = None
    content: Optional[str] = ""           # Nội dung chuyển khoản (chứa survey_id)
    transferType: Optional[str] = "in"    # "in" | "out"
    transferAmount: float = 0.0           # Số tiền
    accumulated: Optional[float] = None
    referenceCode: Optional[str] = None
    description: Optional[str] = None


# ─── Image Upload ──────────────────────────────────────────────────────────────

class ImageUploadResponse(BaseModel):
    image_url: str
    option: str   # "A" | "B"
