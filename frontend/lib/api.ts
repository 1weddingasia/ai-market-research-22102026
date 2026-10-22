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
  qr_data: QrData;
  status: string;
  created_at: string;
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
  model_type: string;
  product_info?: Record<string, any>;
  target_summary: {
    sample_size: number;
    margin_of_error: string;
    location: string;
    demographics: string;
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

  getSurveyResults: async (surveyId: string): Promise<ReportPayload> => {
    if (surveyId.toUpperCase().includes('DEMO')) {
      const { DEMO_REPORT } = await import('./demo-report');
      return DEMO_REPORT;
    }
    return fetchJSON<ReportPayload>(`/survey/${surveyId}/results`);
  },

  getPdfUrl: (surveyId: string) => `${API_URL}/survey/${surveyId}/pdf`,

  uploadImage: async (file: File, option: 'A' | 'B') => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('option', option);
    const res = await fetch(`${API_URL}/payment/upload-image?option=${option}`, {
      method: 'POST',
      body: formData,
    });
    if (!res.ok) throw new Error('Upload ảnh thất bại');
    return res.json() as Promise<{ image_url: string; option: string }>;
  },
};

export const PRICING: Record<number, number> = {
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
