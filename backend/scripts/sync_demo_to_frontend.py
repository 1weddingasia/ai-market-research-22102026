import json
import os
import sys

# Ensure backend root is in sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from models.demo_data import (
    _get_bases_demo,
    _get_van_westendorp_demo,
    _get_ab_testing_demo,
    _get_monadic_demo,
    _get_maxdiff_demo,
    _get_kano_demo,
    _get_brand_map_demo,
    _get_ua_study_demo,
    _get_deal_elasticity_demo,
)

frontend_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "frontend", "lib", "demo-report.ts"))

models = {
    "DEMO_NIELSEN_BASES": _get_bases_demo("DEMO-NIELSEN-BASES"),
    "DEMO_VAN_WESTENDORP": _get_van_westendorp_demo("DEMO-VAN-WESTENDORP"),
    "DEMO_AB_TESTING": _get_ab_testing_demo("DEMO-AB-TESTING"),
    "DEMO_MONADIC": _get_monadic_demo("DEMO-MONADIC"),
    "DEMO_MAXDIFF": _get_maxdiff_demo("DEMO-MAXDIFF"),
    "DEMO_KANO": _get_kano_demo("DEMO-KANO"),
    "DEMO_BRAND_MAP": _get_brand_map_demo("DEMO-BRAND-MAP"),
    "DEMO_UA_STUDY": _get_ua_study_demo("DEMO-UA-STUDY"),
    "DEMO_DEAL_ELASTICITY": _get_deal_elasticity_demo("DEMO-DEAL-ELASTICITY"),
}

header = """/**
 * Hệ thống 9 báo cáo mẫu thực nghiệm (Full 9 Demo Reports) cho 9 phương pháp nghiên cứu thị trường.
 * Đồng bộ 100% với backend/models/demo_data.py.
 * Đảm bảo số liệu và giao diện giữa Dashboard 4 Tab và Trang In A4 6 Trang hoàn toàn đồng nhất.
 */

import type { ReportPayload } from './api';

"""

body = []
for name, data in models.items():
    json_str = json.dumps(data, ensure_ascii=False, indent=2)
    body.append(f"export const {name}: ReportPayload = {json_str};\n")

footer = """export const DEMO_REPORT: ReportPayload = DEMO_NIELSEN_BASES;

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
"""

with open(frontend_path, "w", encoding="utf-8") as f:
    f.write(header + "\n".join(body) + "\n" + footer)

print("Generated frontend/lib/demo-report.ts successfully!")
