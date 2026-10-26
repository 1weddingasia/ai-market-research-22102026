/**
 * API client — typed wrapper cho tất cả backend calls.
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// ─── Types ─────────────────────────────────────────────────────────────────

export interface SurveyConfig {
  id: string;
  name: string;
  short_name: string;
  framework: string;
  icon: string;
  description: string;
  use_case: string;
  questions: {
    id: string;
    label: string;
    text: string;
    type: string;
  }[];
}

export interface SurveyCreateRequest {
  model_type: string;
  region?: string;
  zone?: string;
  min_age?: number;
  max_age?: number;
  target_gender?: string;
  target_income?: string;
  target_marital_status?: string;
  target_occupation?: string;
  target_zone?: string;
  sample_size: number;
  product_info: Record<string, unknown>;
  customer_email?: string;
}

export interface QrData {
  qrCode: string;
  qrDataURL: string;
  bankName: string;
  accountNumber: string;
  accountName: string;
  amount: number;
  addInfo: string;
  fallback?: boolean;
}

export interface SurveyCreateResponse {
  survey_id: string;
  price_amount: number;
  original_price?: number;
  discount_code?: string;
  discount_amount?: number;
  qr_data: QrData;
  status: string;
  is_free?: boolean;
  created_at: string;
}

export interface ApplyDiscountResponse {
  success: boolean;
  survey_id: string;
  discount_code: string;
  discount_percent: number;
  original_price: number;
  discount_amount: number;
  final_amount: number;
  qr_data?: QrData;
  is_free: boolean;
  message: string;
}

export interface SurveyStatus {
  survey_id: string;
  status: 'PENDING_PAYMENT' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
  model_type: string;
  sample_size: number;
  created_at: string;
  completed_at?: string;
  error_msg?: string;
}

export interface VerbatimQuote {
  name: string;
  age: number;
  job: string;
  income?: string;
  quote: string;
  sentiment: 'positive' | 'negative' | 'neutral';
}

export interface ReportPayload {
  project_id: string;
  survey_id?: string;
  model_type: string;
  product_info?: Record<string, any>;
  target_summary: {
    sample_size: number;
    margin_of_error: string;
    location: string;
    demographics: string;
    targeting_summary?: string;
    target_gender?: string;
    target_income?: string;
    target_marital_status?: string;
    target_occupation?: string;
    target_zone?: string;
  };
  executive_summary: {
    viability_score: number;
    verdict: string;
    top_findings: string[];
  };
  quantitative_metrics: {
    appeal_score?: number;
    uniqueness_score?: number;
    purchase_intent_top2box?: string;
    demographic_breakdown?: {
      by_age: Record<string, number>;
      by_gender: Record<string, number>;
    };
    model_specific: Record<string, any>;
  };
  qualitative_insights: {
    top_drivers: string[];
    top_barriers: string[];
    verbatim_quotes: VerbatimQuote[];
  };
  actionable_recommendations: string[];
  generated_at: string;
}

// ─── API Functions ─────────────────────────────────────────────────────────

async function fetchJSON<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error((error as { detail: string }).detail || `API error ${res.status}`);
  }

  return res.json() as Promise<T>;
}

export const api = {
  getSurveyConfigs: async (): Promise<SurveyConfig[]> => {
    try {
      const res = await fetchJSON<{ configs: SurveyConfig[] }>('/survey/configs');
      if (res && res.configs && res.configs.length > 0) return res.configs;
      return (await import('./survey-configs')).DEFAULT_SURVEY_CONFIGS;
    } catch {
      return (await import('./survey-configs')).DEFAULT_SURVEY_CONFIGS;
    }
  },

  createSurvey: (data: SurveyCreateRequest) =>
    fetchJSON<SurveyCreateResponse>('/survey/create', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  getSurveyStatus: (surveyId: string) =>
    fetchJSON<SurveyStatus>(`/survey/${surveyId}/status`),

  applyDiscount: (surveyId: string, code: string) =>
    fetchJSON<ApplyDiscountResponse>(`/survey/${surveyId}/apply-discount`, {
      method: 'POST',
      body: JSON.stringify({ code }),
    }),

  removeDiscount: (surveyId: string) =>
    fetchJSON<ApplyDiscountResponse>(`/survey/${surveyId}/remove-discount`, {
      method: 'POST',
    }),

  activateFreeSurvey: (surveyId: string) =>
    fetchJSON<{ status: string; survey_id: string; message: string }>(`/survey/${surveyId}/activate-free`, {
      method: 'POST',
    }),

  getSurveyResults: async (surveyId: string): Promise<ReportPayload> => {
    if (surveyId.toUpperCase().includes('DEMO')) {
      const { getDemoReport } = await import('./demo-report');
      try {
        const remote = await fetchJSON<ReportPayload>(`/survey/${surveyId}/results`);
        if (remote && remote.model_type) return remote;
      } catch {
        // Fallback to local demo data
      }
      return getDemoReport(surveyId);
    }
    return fetchJSON<ReportPayload>(`/survey/${surveyId}/results`);
  },

  submitDownloadLead: (data: {
    full_name: string;
    phone_zalo: string;
    company_name: string;
    work_email?: string;
    job_title?: string;
    report_id: string;
    report_title?: string;
    industry?: string;
  }) =>
    fetchJSON<{ success: boolean; lead_id: number; lead_score: string; message: string }>('/survey/benchmark/download-lead', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  getBenchmarkReports: (industry?: string) =>
    fetchJSON<{ reports: any[]; total: number }>(`/survey/benchmark/reports${industry && industry !== 'all' ? `?industry=${industry}` : ''}`),

  getPdfUrl: (surveyId: string) => `${API_URL}/survey/${surveyId}/pdf`,

  requestLookupOtp: (email: string) =>
    fetchJSON<{ success: boolean; message: string; email: string; total_surveys: number }>('/survey/lookup/request-otp', {
      method: 'POST',
      body: JSON.stringify({ email }),
    }),

  verifyLookupOtp: (email: string, otp: string) =>
    fetchJSON<{
      success: boolean;
      email: string;
      total: number;
      surveys: Array<{
        survey_id: string;
        product_name: string;
        model_type: string;
        status: string;
        sample_size: number;
        price_amount: number;
        viability_score?: number;
        verdict?: string;
        created_at: string;
        completed_at?: string;
        results_url?: string;
        print_url?: string;
      }>;
    }>('/survey/lookup/verify-otp', {
      method: 'POST',
      body: JSON.stringify({ email, otp }),
    }),

  deleteSurvey: (surveyId: string, email: string) =>
    fetchJSON<{ success: boolean; message: string; survey_id: string }>(`/survey/${surveyId}/delete`, {
      method: 'POST',
      body: JSON.stringify({ email }),
    }),

  uploadImage: async (file: File, option: string = 'concept') => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('option', option);
    const res = await fetch(`${API_URL}/payment/upload-image?option=${encodeURIComponent(option)}`, {
      method: 'POST',
      body: formData,
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: 'Upload ảnh thất bại' }));
      throw new Error(err.detail || 'Upload ảnh thất bại');
    }
    return res.json() as Promise<{ status: string; image_url: string; option: string; filename: string }>;
  },

  uploadHistoricalDataset: async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch(`${API_URL}/survey/upload-historical-dataset`, {
      method: 'POST',
      body: formData,
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: 'Tải file dữ liệu khảo sát thất bại' }));
      throw new Error(err.detail || 'Tải file dữ liệu khảo sát thất bại');
    }
    return res.json() as Promise<{
      status: string;
      filename: string;
      total_rows: number;
      total_raw_rows: number;
      columns: string[];
      text_columns: string[];
      extracted_snippets: string[];
      dataset_context: string;
    }>;
  },

  askAiConsultant: async (message: string, history: Array<{ role: string; content: string }> = []) => {
    const res = await fetch(`${API_URL}/chat/ask`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, history }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: 'Không thể kết nối đến Trợ lý AI' }));
      throw new Error(err.detail || 'Không thể kết nối đến Trợ lý AI');
    }
    return res.json() as Promise<{ reply: string; status: string }>;
  },

  // ── Outreach & Cold Email Automation API ─────────────────────────────
  getOutreachStats: () => fetchJSON<any>('/outreach/stats'),

  toggleOutreachBot: (isActive: boolean) =>
    fetchJSON<{ success: boolean; is_active: boolean; message: string }>('/outreach/toggle', {
      method: 'POST',
      body: JSON.stringify({ is_active: isActive }),
    }),

  updateOutreachSettings: (settings: {
    daily_limit?: number;
    min_interval_seconds?: number;
    max_interval_seconds?: number;
    ignore_business_hours?: boolean;
  }) =>
    fetchJSON<any>('/outreach/settings', {
      method: 'POST',
      body: JSON.stringify(settings),
    }),

  getOutreachLogs: (limit: number = 50, offset: number = 0, status?: string) => {
    let query = `/outreach/logs?limit=${limit}&offset=${offset}`;
    if (status) query += `&status=${encodeURIComponent(status)}`;
    return fetchJSON<{ total: number; items: any[] }>(query);
  },

  getOutreachLogDetail: (logId: number) =>
    fetchJSON<any>(`/outreach/logs/${logId}`),

  getOutreachLeads: (params: {
    limit?: number;
    offset?: number;
    industry?: string;
    status?: string;
    search?: string;
  }) => {
    const q = new URLSearchParams();
    if (params.limit) q.set('limit', String(params.limit));
    if (params.offset) q.set('offset', String(params.offset));
    if (params.industry) q.set('industry', params.industry);
    if (params.status) q.set('status', params.status);
    if (params.search) q.set('search', params.search);
    return fetchJSON<{ total: number; items: any[] }>(`/outreach/leads?${q.toString()}`);
  },

  createOutreachLead: (data: any) =>
    fetchJSON<{ success: boolean; lead_id: number; message: string }>('/outreach/leads', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  sendOutreachTestEmail: (data: {
    to_email: string;
    contact_name?: string;
    company_name?: string;
    industry?: string;
  }) =>
    fetchJSON<{ success: boolean; message: string; resend_id?: string }>('/outreach/send-test', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  sendOutreachLeadNow: (leadId: number) =>
    fetchJSON<{ success: boolean; lead_id: number; message: string }>(`/outreach/leads/${leadId}/send-now`, {
      method: 'POST',
    }),

  resetOutreachLead: (leadId: number) =>
    fetchJSON<{ success: boolean; message: string }>(`/outreach/leads/${leadId}/reset`, {
      method: 'POST',
    }),

  deleteOutreachLead: (leadId: number) =>
    fetchJSON<{ success: boolean; message: string }>(`/outreach/leads/${leadId}`, {
      method: 'DELETE',
    }),
};

export const PRICING: Record<number, number> = {
  50:   10_000,
  500:  200_000,
  1000: 300_000,
  2000: 500_000,
  3000: 700_000,
};

export function formatVND(amount: number): string {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(amount);
}
