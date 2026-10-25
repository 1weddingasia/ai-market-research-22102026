'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Logo from '@/components/Logo';
import { api } from '@/lib/api';

interface OutreachStats {
  is_active: boolean;
  daily_limit: number;
  sent_today: number;
  remaining_today: number;
  min_interval_seconds: number;
  max_interval_seconds: number;
  next_send_time?: string;
  is_business_hours: boolean;
  total_leads: number;
  pending_leads: number;
  sent_leads: number;
  failed_leads: number;
  total_logs: number;
}

interface OutreachLogItem {
  id: number;
  lead_id?: number;
  recipient_email: string;
  recipient_name?: string;
  company_name?: string;
  industry?: string;
  subject: string;
  email_body_preview?: string;
  template_type?: string;
  status: string;
  error_message?: string;
  sent_at?: string;
}

interface OutreachLeadItem {
  id: number;
  company_name: string;
  contact_name?: string;
  contact_title?: string;
  email: string;
  industry: string;
  website?: string;
  status: string;
  sent_count: number;
  last_sent_at?: string;
  notes?: string;
}

export default function OutreachAdminPage() {
  const [stats, setStats] = useState<OutreachStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'logs' | 'leads' | 'settings'>('logs');

  // Logs state
  const [logs, setLogs] = useState<OutreachLogItem[]>([]);
  const [logTotal, setLogTotal] = useState(0);
  const [logStatusFilter, setLogStatusFilter] = useState<string>('');
  const [selectedLog, setSelectedLog] = useState<any | null>(null);
  const [viewLogLoading, setViewLogLoading] = useState(false);

  // Leads state
  const [leads, setLeads] = useState<OutreachLeadItem[]>([]);
  const [leadTotal, setLeadTotal] = useState(0);
  const [leadIndustryFilter, setLeadIndustryFilter] = useState<string>('');
  const [leadStatusFilter, setLeadStatusFilter] = useState<string>('');
  const [leadSearch, setLeadSearch] = useState<string>('');
  const [leadPage, setLeadPage] = useState(0);

  // Modals state
  const [showTestModal, setShowTestModal] = useState(false);
  const [testEmail, setTestEmail] = useState('');
  const [testName, setTestName] = useState('Anh Lợi');
  const [testCompany, setTestCompany] = useState('Công ty CP Thử Nghiệm');
  const [testIndustry, setTestIndustry] = useState('fnb');
  const [testLoading, setTestLoading] = useState(false);
  const [testSuccessMsg, setTestSuccessMsg] = useState('');
  const [testErrorMsg, setTestErrorMsg] = useState('');

  // Add lead modal state
  const [showAddLeadModal, setShowAddLeadModal] = useState(false);
  const [newLead, setNewLead] = useState({
    company_name: '',
    contact_name: '',
    contact_title: '',
    email: '',
    industry: 'fnb',
    website: '',
    notes: '',
  });
  const [addLeadLoading, setAddLeadLoading] = useState(false);

  // Action status message
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const loadStats = async () => {
    try {
      const data = await api.getOutreachStats();
      setStats(data);
    } catch (e: any) {
      console.error('Failed to load outreach stats', e);
    }
  };

  const loadLogs = async () => {
    try {
      const res = await api.getOutreachLogs(50, 0, logStatusFilter || undefined);
      setLogs(res.items || []);
      setLogTotal(res.total || 0);
    } catch (e: any) {
      console.error('Failed to load outreach logs', e);
    }
  };

  const loadLeads = async () => {
    try {
      const res = await api.getOutreachLeads({
        limit: 30,
        offset: leadPage * 30,
        industry: leadIndustryFilter || undefined,
        status: leadStatusFilter || undefined,
        search: leadSearch || undefined,
      });
      setLeads(res.items || []);
      setLeadTotal(res.total || 0);
    } catch (e: any) {
      console.error('Failed to load outreach leads', e);
    }
  };

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await Promise.all([loadStats(), loadLogs(), loadLeads()]);
      setLoading(false);
    };
    init();

    // Tự động làm mới số liệu mỗi 30 giây để theo dõi tiến độ
    const interval = setInterval(() => {
      loadStats();
      if (activeTab === 'logs') loadLogs();
    }, 30000);

    return () => clearInterval(interval);
  }, [activeTab, logStatusFilter, leadIndustryFilter, leadStatusFilter, leadSearch, leadPage]);

  // Toggle Bot ON/OFF
  const handleToggleBot = async () => {
    if (!stats) return;
    try {
      const newStatus = !stats.is_active;
      const res = await api.toggleOutreachBot(newStatus);
      showToast(res.message);
      await loadStats();
    } catch (e: any) {
      alert('Không thể thay đổi trạng thái Bot: ' + e.message);
    }
  };

  // Send Test Email
  const handleSendTest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!testEmail || !testEmail.includes('@')) {
      setTestErrorMsg('Vui lòng nhập địa chỉ email hợp lệ');
      return;
    }
    setTestLoading(true);
    setTestSuccessMsg('');
    setTestErrorMsg('');

    try {
      const res = await api.sendOutreachTestEmail({
        to_email: testEmail.trim(),
        contact_name: testName,
        company_name: testCompany,
        industry: testIndustry,
      });
      setTestSuccessMsg(res.message || 'Đã gửi email thử nghiệm thành công! Vui lòng kiểm tra hộp thư.');
      await loadStats();
      await loadLogs();
    } catch (err: any) {
      setTestErrorMsg(err.message || 'Lỗi gửi email thử nghiệm');
    } finally {
      setTestLoading(false);
    }
  };

  // View Log Detail Modal
  const handleViewLog = async (logId: number) => {
    setViewLogLoading(true);
    try {
      const detail = await api.getOutreachLogDetail(logId);
      setSelectedLog(detail);
    } catch (err: any) {
      alert('Không thể tải chi tiết nhật ký: ' + err.message);
    } finally {
      setViewLogLoading(false);
    }
  };

  // Send Now to specific lead
  const handleSendLeadNow = async (leadId: number) => {
    if (!confirm('Bạn có chắc chắn muốn gửi email tiếp cận ngay cho doanh nghiệp này?')) return;
    try {
      const res = await api.sendOutreachLeadNow(leadId);
      showToast(res.message);
      await loadStats();
      await loadLeads();
      await loadLogs();
    } catch (err: any) {
      alert('Lỗi: ' + err.message);
    }
  };

  // Reset Lead to PENDING
  const handleResetLead = async (leadId: number) => {
    try {
      await api.resetOutreachLead(leadId);
      showToast('Đã đặt lại trạng thái về Chờ Gửi');
      await loadStats();
      await loadLeads();
    } catch (err: any) {
      alert('Lỗi: ' + err.message);
    }
  };

  // Create new lead
  const handleCreateLead = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLead.company_name || !newLead.email) {
      alert('Vui lòng điền đầy đủ Tên công ty và Email');
      return;
    }
    setAddLeadLoading(true);
    try {
      const res = await api.createOutreachLead(newLead);
      showToast(res.message);
      setShowAddLeadModal(false);
      setNewLead({
        company_name: '',
        contact_name: '',
        contact_title: '',
        email: '',
        industry: 'fnb',
        website: '',
        notes: '',
      });
      await loadStats();
      await loadLeads();
    } catch (err: any) {
      alert('Lỗi thêm doanh nghiệp: ' + err.message);
    } finally {
      setAddLeadLoading(false);
    }
  };

  const progressPercent = stats ? Math.min(100, Math.round((stats.sent_today / stats.daily_limit) * 100)) : 0;

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 pb-16 font-sans">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white px-5 py-2.5 rounded-full shadow-lg text-xs font-bold animate-bounce flex items-center gap-2 border border-slate-700">
          <span>🔔</span> {toastMessage}
        </div>
      )}

      {/* ── Top Bar Mobile First ── */}
      <header className="bg-slate-900 text-white px-4 sm:px-8 py-3.5 sticky top-0 z-40 border-b border-slate-800 shadow-md">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Logo href="/" />
            <div className="hidden sm:block h-5 w-px bg-slate-700" />
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-600/40">
              Outreach Command Center
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => setShowTestModal(true)}
              className="text-xs font-bold px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <span>⚡</span>
              <span className="hidden sm:inline">Gửi Thử Nghiệm</span>
              <span className="sm:hidden">Test</span>
            </button>
            <Link
              href="/"
              className="text-xs text-slate-400 hover:text-white px-2.5 py-1.5 rounded border border-slate-700 transition-colors"
            >
              Trang Chủ &rarr;
            </Link>
          </div>
        </div>
      </header>

      {/* ── Main Mobile Container ── */}
      <main className="max-w-6xl mx-auto px-3 sm:px-6 pt-5">
        
        {/* ── Panel Tình Trạng & Nút Bật/Tắt To Rõ (Phone-Friendly) ── */}
        <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-slate-200 mb-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            
            {/* Status indicator */}
            <div className="flex items-center gap-3">
              <div className={`w-4 h-4 rounded-full shrink-0 ${stats?.is_active ? 'bg-emerald-500 animate-ping' : 'bg-slate-300'}`} />
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="font-serif font-black text-lg sm:text-xl text-slate-900">
                    {stats?.is_active ? 'Cỗ Máy Gửi Tự Động: ĐANG CHẠY' : 'Cỗ Máy Gửi Tự Động: ĐANG TẠM DỪNG'}
                  </h2>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${stats?.is_active ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'}`}>
                    {stats?.is_active ? 'Hoạt động' : 'Tạm dừng'}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Giãn cách thông minh 3–8 phút/email · Tự động nghỉ ngoài giờ · Hạn mức 50 email/ngày
                </p>
              </div>
            </div>

            {/* Switch Toggle Button Big for Thumb */}
            <div className="flex items-center gap-3 self-end sm:self-center">
              <button
                onClick={handleToggleBot}
                className={`px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm shadow-md transition-all flex items-center gap-2 cursor-pointer ${
                  stats?.is_active
                    ? 'bg-red-600 hover:bg-red-700 text-white'
                    : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                }`}
              >
                {stats?.is_active ? (
                  <>
                    <span>⏸️</span> TẠM DỪNG BOT
                  </>
                ) : (
                  <>
                    <span>▶️</span> BẬT TỰ ĐỘNG GỬI
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Progress bar today */}
          <div className="mt-5 pt-4 border-t border-slate-100">
            <div className="flex items-center justify-between text-xs font-bold mb-1.5">
              <span className="text-slate-600">
                Tiến độ gửi hôm nay: <span className="text-slate-900 font-black">{stats?.sent_today || 0}</span> / {stats?.daily_limit || 50} email ({progressPercent}%)
              </span>
              <span className="text-slate-500 font-normal text-[11px]">
                {stats?.is_business_hours ? '🟢 Trong giờ hành chính' : '🌙 Ngoài khung giờ làm việc'}
              </span>
            </div>
            <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            {stats?.next_send_time && stats.is_active && (
              <p className="text-[11px] text-amber-700 mt-2 font-medium flex items-center gap-1.5">
                <span>⏱️</span> Dự kiến gửi email tiếp theo lúc: <strong>{stats.next_send_time}</strong> (giờ Việt Nam)
              </p>
            )}
          </div>
        </div>

        {/* ── 4 KPI Stats Cards (Big numbers for quick scan) ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-5">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Tổng Doanh Nghiệp
            </span>
            <div className="text-2xl sm:text-3xl font-serif font-black text-slate-900 mt-1">
              {stats?.total_leads || 0}
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">Trong danh bạ mục tiêu</p>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-600">
              Đang Chờ Gửi
            </span>
            <div className="text-2xl sm:text-3xl font-serif font-black text-amber-600 mt-1">
              {stats?.pending_leads || 0}
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">Sẵn sàng phân bổ hàng ngày</p>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600">
              Đã Gửi Thành Công
            </span>
            <div className="text-2xl sm:text-3xl font-serif font-black text-emerald-600 mt-1">
              {stats?.sent_leads || 0}
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">Kèm mã trải nghiệm OFF100</p>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Giãn Cách Ngẫu Nhiên
            </span>
            <div className="text-xl sm:text-2xl font-serif font-black text-slate-800 mt-1">
              3 - 8 phút
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">Chuẩn chống spam an toàn</p>
          </div>
        </div>

        {/* ── Navigation Tabs (Mobile Tap Friendly) ── */}
        <div className="flex border-b border-slate-300 bg-white rounded-t-xl px-2 pt-2 gap-1 mb-0 shadow-2xs">
          <button
            onClick={() => setActiveTab('logs')}
            className={`px-4 py-2.5 text-xs sm:text-sm font-bold rounded-t-lg transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'logs'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <span>📋</span>
            <span>Nhật Ký Gửi Thư ({stats?.total_logs || 0})</span>
          </button>

          <button
            onClick={() => setActiveTab('leads')}
            className={`px-4 py-2.5 text-xs sm:text-sm font-bold rounded-t-lg transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'leads'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <span>🏢</span>
            <span>1.000 Doanh Nghiệp ({stats?.total_leads || 0})</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`px-4 py-2.5 text-xs sm:text-sm font-bold rounded-t-lg transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'settings'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <span>⚙️</span>
            <span>Cài Đặt & Mẫu Thư</span>
          </button>
        </div>

        {/* ── TAB CONTENT ── */}
        <div className="bg-white rounded-b-xl border-x border-b border-slate-200 p-4 sm:p-6 shadow-sm min-h-[450px]">
          
          {/* ═════════ TAB 1: NHẬT KÝ GỬI THƯ (LOGS) ═════════ */}
          {activeTab === 'logs' && (
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                <div>
                  <h3 className="font-serif font-bold text-base sm:text-lg text-slate-900">
                    Nhật Ký Tiếp Cận Chi Tiết (Audit Trail)
                  </h3>
                  <p className="text-xs text-slate-500">
                    Lưu vết thời gian thực mọi bức thư gửi đi: ai nhận, công ty nào, ngành nghề và kết quả.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={logStatusFilter}
                    onChange={(e) => setLogStatusFilter(e.target.value)}
                    className="text-xs border border-slate-300 rounded-lg px-2.5 py-1.5 bg-slate-50 font-medium"
                  >
                    <option value="">Tất cả trạng thái</option>
                    <option value="SUCCESS">Thành công (SUCCESS)</option>
                    <option value="FAILED">Gặp lỗi (FAILED)</option>
                  </select>

                  <button
                    onClick={() => { loadStats(); loadLogs(); }}
                    className="text-xs px-2.5 py-1.5 rounded-lg border border-slate-300 hover:bg-slate-100 transition-colors"
                    title="Làm mới"
                  >
                    🔄
                  </button>
                </div>
              </div>

              {logs.length === 0 ? (
                <div className="text-center py-12 text-slate-400">
                  <div className="text-3xl mb-2">📭</div>
                  <p className="text-sm font-semibold">Chưa có nhật ký gửi thư nào.</p>
                  <p className="text-xs text-slate-400 mt-1">
                    Bấm nút <strong>"Gửi Thử Nghiệm"</strong> ở góc phải trên để gửi thử một email mẫu và ghi nhật ký đầu tiên!
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {logs.map((item) => (
                    <div
                      key={item.id}
                      className="border border-slate-200 hover:border-slate-300 rounded-xl p-3.5 bg-slate-50/50 hover:bg-white transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                            item.status === 'SUCCESS' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {item.status === 'SUCCESS' ? '✓ Đã Gửi' : '✕ Thất Bại'}
                          </span>
                          <span className="text-xs font-bold text-slate-900 truncate">
                            {item.company_name || 'Doanh nghiệp'}
                          </span>
                          {item.industry && (
                            <span className="text-[10px] bg-slate-200 text-slate-700 px-1.5 py-0.2 rounded font-mono">
                              {item.industry}
                            </span>
                          )}
                        </div>

                        <div className="text-xs text-slate-600 mb-1">
                          Người nhận: <strong>{item.recipient_name || 'Đại diện'}</strong> &lt;{item.recipient_email}&gt;
                        </div>

                        <div className="text-xs text-slate-500 truncate italic">
                          "{item.subject}"
                        </div>
                      </div>

                      <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center shrink-0 border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-200 gap-2">
                        <span className="text-[11px] text-slate-400 font-mono">
                          {item.sent_at ? new Date(item.sent_at).toLocaleString('vi-VN') : ''}
                        </span>
                        <button
                          onClick={() => handleViewLog(item.id)}
                          className="text-xs font-bold text-sky-700 hover:text-sky-900 bg-sky-50 hover:bg-sky-100 px-2.5 py-1 rounded-md border border-sky-200 transition-colors cursor-pointer"
                        >
                          Xem Nội Dung Thư
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ═════════ TAB 2: DANH BẠ 1.000 DOANH NGHIỆP (LEADS) ═════════ */}
          {activeTab === 'leads' && (
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                <div>
                  <h3 className="font-serif font-bold text-base sm:text-lg text-slate-900">
                    Danh Sách 1.000 Doanh Nghiệp Mục Tiêu
                  </h3>
                  <p className="text-xs text-slate-500">
                    Phân loại theo ngành F&B, Mỹ phẩm, Bánh kẹo, Gia dụng, Nông sản & B2B Agency.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowAddLeadModal(true)}
                    className="text-xs font-bold px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white transition-all flex items-center gap-1 cursor-pointer"
                  >
                    <span>+</span> Thêm Doanh Nghiệp
                  </button>
                </div>
              </div>

              {/* Filters toolbar */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mb-4 p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div>
                  <label className="text-[11px] font-bold text-slate-500 block mb-1">Tìm kiếm theo tên / email:</label>
                  <input
                    type="text"
                    value={leadSearch}
                    onChange={(e) => { setLeadSearch(e.target.value); setLeadPage(0); }}
                    placeholder="VD: Cà phê, Cocona, anh.nguyen..."
                    className="w-full text-xs border border-slate-300 rounded-lg px-2.5 py-1.5 bg-white"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-500 block mb-1">Lọc theo ngành nghề:</label>
                  <select
                    value={leadIndustryFilter}
                    onChange={(e) => { setLeadIndustryFilter(e.target.value); setLeadPage(0); }}
                    className="w-full text-xs border border-slate-300 rounded-lg px-2.5 py-1.5 bg-white"
                  >
                    <option value="">Tất cả các ngành</option>
                    <option value="fnb">Thực phẩm & Đồ uống (F&B)</option>
                    <option value="coffee">Cà phê & Đồ uống đặc sản</option>
                    <option value="cosmetics">Mỹ phẩm & Chăm sóc cá nhân</option>
                    <option value="confectionery">Bánh kẹo & Quà tặng</option>
                    <option value="food_nutrition">Thực phẩm dinh dưỡng & Nông sản</option>
                    <option value="home_appliances">Thiết bị gia dụng & Smart Home</option>
                    <option value="agency">B2B Agencies & Marketing</option>
                    <option value="general">Mẹ & Bé, Cưới & Sự kiện</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-500 block mb-1">Trạng thái gửi:</label>
                  <select
                    value={leadStatusFilter}
                    onChange={(e) => { setLeadStatusFilter(e.target.value); setLeadPage(0); }}
                    className="w-full text-xs border border-slate-300 rounded-lg px-2.5 py-1.5 bg-white"
                  >
                    <option value="">Tất cả trạng thái</option>
                    <option value="PENDING">Chờ gửi (PENDING)</option>
                    <option value="SENT">Đã gửi (SENT)</option>
                    <option value="FAILED">Gặp lỗi (FAILED)</option>
                  </select>
                </div>
              </div>

              {/* Leads List */}
              <div className="space-y-2.5">
                {leads.map((lead) => (
                  <div
                    key={lead.id}
                    className="border border-slate-200 rounded-xl p-3 bg-white hover:border-slate-300 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-slate-900 text-sm">
                          {lead.company_name}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded font-mono uppercase bg-slate-100 text-slate-700">
                          {lead.industry}
                        </span>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                          lead.status === 'SENT' ? 'bg-emerald-100 text-emerald-800' :
                          lead.status === 'FAILED' ? 'bg-red-100 text-red-800' :
                          'bg-amber-100 text-amber-800'
                        }`}>
                          {lead.status === 'SENT' ? 'Đã Gửi' : lead.status === 'FAILED' ? 'Lỗi' : 'Chờ Gửi'}
                        </span>
                      </div>

                      <div className="text-slate-600 flex flex-wrap gap-x-4 gap-y-1">
                        <span>👤 {lead.contact_name || 'Chưa rõ'} ({lead.contact_title || 'Đại diện'})</span>
                        <span>✉️ {lead.email}</span>
                        {lead.website && (
                          <a href={lead.website} target="_blank" rel="noreferrer" className="text-sky-600 hover:underline">
                            🌐 Website
                          </a>
                        )}
                      </div>

                      {lead.notes && (
                        <p className="text-[11px] text-slate-400 mt-1 italic">
                          💡 Vấn đề DN quan tâm: {lead.notes}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-2 shrink-0 border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-100">
                      <button
                        onClick={() => handleSendLeadNow(lead.id)}
                        className="px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] shadow-2xs transition-all cursor-pointer"
                        title="Gửi ngay bây giờ"
                      >
                        Gửi Ngay
                      </button>
                      {lead.status !== 'PENDING' && (
                        <button
                          onClick={() => handleResetLead(lead.id)}
                          className="px-2.5 py-1.5 rounded-lg border border-slate-300 hover:bg-slate-100 text-slate-600 text-[11px] font-medium transition-all cursor-pointer"
                          title="Đặt lại chờ gửi"
                        >
                          Đặt Lại
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-between mt-5 pt-3 border-t border-slate-200 text-xs text-slate-500">
                <span>
                  Hiển thị {leads.length} / {leadTotal} doanh nghiệp
                </span>
                <div className="flex items-center gap-2">
                  <button
                    disabled={leadPage === 0}
                    onClick={() => setLeadPage(p => Math.max(0, p - 1))}
                    className="px-3 py-1.5 rounded border border-slate-300 disabled:opacity-40 hover:bg-slate-100"
                  >
                    &larr; Trang trước
                  </button>
                  <span className="font-bold text-slate-700">Trang {leadPage + 1}</span>
                  <button
                    disabled={(leadPage + 1) * 30 >= leadTotal}
                    onClick={() => setLeadPage(p => p + 1)}
                    className="px-3 py-1.5 rounded border border-slate-300 disabled:opacity-40 hover:bg-slate-100"
                  >
                    Trang sau &rarr;
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ═════════ TAB 3: CÀI ĐẶT AN TOÀN & MẪU THƯ ═════════ */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              <div>
                <h3 className="font-serif font-bold text-base sm:text-lg text-slate-900 mb-1">
                  Cơ Chế Kiểm Soát & Bảo Vệ Hộp Thư (Anti-Spam Shield)
                </h3>
                <p className="text-xs text-slate-500">
                  Các nguyên tắc vàng giúp domain và IP gửi thư an toàn tuyệt đối, tỷ lệ vào Inbox &gt; 98%.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
                  <div className="text-lg mb-1">🛡️</div>
                  <h4 className="font-bold text-sm text-slate-900">Giới Hạn Tối Đa 50 Email / Ngày</h4>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    Không gửi ồ ạt dạng spam bulk. 50 email được rải đều trong 8 tiếng hành chính giúp hộp thư trông hoàn toàn tự nhiên như người thật gửi.
                  </p>
                </div>

                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
                  <div className="text-lg mb-1">🎲</div>
                  <h4 className="font-bold text-sm text-slate-900">Giãn Cách Ngẫu Nhiên 3 – 8 Phút</h4>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    Sau mỗi email, bot ngủ ngẫu nhiên từ 180s đến 480s (ví dụ: 3m42s, 6m15s...). Thuật toán của Google & Microsoft không thể gắn cờ bot tự động.
                  </p>
                </div>

                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
                  <div className="text-lg mb-1">🕒</div>
                  <h4 className="font-bold text-sm text-slate-900">Chỉ Gửi Trong Giờ Hành Chính</h4>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    Khung giờ vàng 08:30 - 11:30 và 13:30 - 17:30 (Thứ 2 đến Thứ 6). Tự động dừng vào ban đêm và cuối tuần.
                  </p>
                </div>
              </div>

              {/* Email Templates Preview */}
              <div className="border border-slate-200 rounded-xl p-4 sm:p-5 bg-white">
                <h4 className="font-bold text-sm text-slate-900 mb-2 flex items-center gap-2">
                  <span>📬</span> Chiến Lược Nội Dung: Trao Giá Trị Trước - Tặng Khảo Sát Thật
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed mb-3">
                  Email được cá nhân hóa 100% theo tên người nhận và lĩnh vực doanh nghiệp đang hoạt động:
                </p>
                <ul className="text-xs text-slate-700 space-y-2 list-disc pl-5">
                  <li><strong>Ngành F&B:</strong> Dẫn chứng Báo cáo Trà Kombucha Xoài Cát Chu (Nielsen BASES, N=1.000).</li>
                  <li><strong>Ngành Cà phê:</strong> Dẫn chứng Báo cáo Cà phê phin giấy hòa tan LangBiang Roasters (Van Westendorp - Điểm giá tối ưu OPP).</li>
                  <li><strong>Ngành Bánh kẹo:</strong> Dẫn chứng Báo cáo Hộp quà Hoàng gia Delica Crown (A/B Testing bao bì mùa Tết).</li>
                  <li><strong>Ngành Mỹ phẩm:</strong> Dẫn chứng Báo cáo Serum thảo dược bản địa Cocona Botanica (Brand Perceptual Mapping).</li>
                  <li><strong>Quà tặng trải nghiệm:</strong> Tặng riêng mỗi doanh nghiệp 01 suất khảo sát miễn phí qua mã <code>OFF100</code> để họ tự tay kiểm chứng.</li>
                </ul>
              </div>
            </div>
          )}

        </div>
      </main>

      {/* ── MODAL: GỬI EMAIL THỬ NGHIỆM ── */}
      {showTestModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="font-serif font-bold text-base sm:text-lg text-slate-900 flex items-center gap-2">
                <span>⚡</span> Gửi Email Thử Nghiệm
              </h3>
              <button
                onClick={() => setShowTestModal(false)}
                className="text-slate-400 hover:text-slate-600 text-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-500 mb-4 leading-relaxed">
              Nhập email cá nhân của anh để nhận trực tiếp một bức thư tiếp cận thực tế. Kiểm tra giao diện HTML, tính cá nhân hóa và độ chuẩn xác khi vào hộp thư Inbox.
            </p>

            <form onSubmit={handleSendTest} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Email nhận thư thử nghiệm *</label>
                <input
                  type="email"
                  required
                  value={testEmail}
                  onChange={(e) => setTestEmail(e.target.value)}
                  placeholder="ví dụ: email_cua_anh@gmail.com"
                  className="w-full text-xs border border-slate-300 rounded-lg px-3 py-2 bg-slate-50 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Tên người nhận</label>
                  <input
                    type="text"
                    value={testName}
                    onChange={(e) => setTestName(e.target.value)}
                    className="w-full text-xs border border-slate-300 rounded-lg px-3 py-2 bg-slate-50"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Tên công ty</label>
                  <input
                    type="text"
                    value={testCompany}
                    onChange={(e) => setTestCompany(e.target.value)}
                    className="w-full text-xs border border-slate-300 rounded-lg px-3 py-2 bg-slate-50"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Ngành mẫu thử nghiệm</label>
                <select
                  value={testIndustry}
                  onChange={(e) => setTestIndustry(e.target.value)}
                  className="w-full text-xs border border-slate-300 rounded-lg px-3 py-2 bg-slate-50"
                >
                  <option value="fnb">Thực phẩm & Đồ uống (Trà Kombucha Xoài Cát Chu)</option>
                  <option value="coffee">Cà phê đặc sản (LangBiang Roasters)</option>
                  <option value="cosmetics">Mỹ phẩm thuần chay (Cocona Botanica)</option>
                  <option value="confectionery">Bánh kẹo & Quà biếu (Delica Crown Heritage)</option>
                  <option value="home_appliances">Gia dụng thông minh (Nồi chiên ElmaTech)</option>
                  <option value="food_nutrition">Thực phẩm dinh dưỡng (VinaBroth Foods)</option>
                </select>
              </div>

              {testSuccessMsg && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs font-semibold">
                  ✓ {testSuccessMsg}
                </div>
              )}

              {testErrorMsg && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-800 rounded-lg text-xs font-semibold">
                  ✕ {testErrorMsg}
                </div>
              )}

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowTestModal(false)}
                  className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Đóng
                </button>
                <button
                  type="submit"
                  disabled={testLoading}
                  className="px-5 py-2 rounded-lg text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-sm transition-all disabled:opacity-50 cursor-pointer"
                >
                  {testLoading ? 'Đang gửi...' : 'Gửi Thử Ngay ⚡'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL: XEM NỘI DUNG THƯ (LOG DETAIL) ── */}
      {selectedLog && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Xem Lại Thư Đã Gửi (Log #{selectedLog.id})
                </span>
                <h3 className="font-serif font-bold text-sm sm:text-base text-slate-900 truncate">
                  {selectedLog.subject}
                </h3>
              </div>
              <button
                onClick={() => setSelectedLog(null)}
                className="text-slate-400 hover:text-slate-600 text-lg p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-4 bg-slate-100 border-b border-slate-200 text-xs text-slate-600 space-y-1">
              <div><strong>Gửi tới:</strong> {selectedLog.recipient_name} &lt;{selectedLog.recipient_email}&gt;</div>
              <div><strong>Doanh nghiệp:</strong> {selectedLog.company_name} · Ngành: {selectedLog.industry}</div>
              <div><strong>Thời gian gửi:</strong> {new Date(selectedLog.sent_at).toLocaleString('vi-VN')}</div>
            </div>

            <div className="p-4 overflow-y-auto flex-1 bg-white">
              {selectedLog.email_body_html ? (
                <div
                  className="border border-slate-200 rounded-lg overflow-hidden"
                  dangerouslySetInnerHTML={{ __html: selectedLog.email_body_html }}
                />
              ) : (
                <div className="p-4 text-xs text-slate-500 whitespace-pre-wrap">
                  {selectedLog.email_body_preview}
                </div>
              )}
            </div>

            <div className="p-3 border-t border-slate-200 bg-slate-50 flex justify-end">
              <button
                onClick={() => setSelectedLog(null)}
                className="px-4 py-1.5 rounded-lg text-xs font-bold bg-slate-900 text-white"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL: THÊM DOANH NGHIỆP MỚI ── */}
      {showAddLeadModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="font-serif font-bold text-base sm:text-lg text-slate-900">
                Thêm Doanh Nghiệp Mục Tiêu
              </h3>
              <button
                onClick={() => setShowAddLeadModal(false)}
                className="text-slate-400 hover:text-slate-600 text-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateLead} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Tên công ty *</label>
                <input
                  type="text"
                  required
                  value={newLead.company_name}
                  onChange={(e) => setNewLead({ ...newLead, company_name: e.target.value })}
                  placeholder="VD: Công ty CP Cà phê Cao Nguyên"
                  className="w-full text-xs border border-slate-300 rounded-lg px-3 py-2 bg-slate-50"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Tên người nhận</label>
                  <input
                    type="text"
                    value={newLead.contact_name}
                    onChange={(e) => setNewLead({ ...newLead, contact_name: e.target.value })}
                    placeholder="VD: Anh Tuấn"
                    className="w-full text-xs border border-slate-300 rounded-lg px-3 py-2 bg-slate-50"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Chức danh</label>
                  <input
                    type="text"
                    value={newLead.contact_title}
                    onChange={(e) => setNewLead({ ...newLead, contact_title: e.target.value })}
                    placeholder="VD: CEO / Brand Manager"
                    className="w-full text-xs border border-slate-300 rounded-lg px-3 py-2 bg-slate-50"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Email doanh nghiệp *</label>
                <input
                  type="email"
                  required
                  value={newLead.email}
                  onChange={(e) => setNewLead({ ...newLead, email: e.target.value })}
                  placeholder="contact@company.vn"
                  className="w-full text-xs border border-slate-300 rounded-lg px-3 py-2 bg-slate-50"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Ngành nghề</label>
                  <select
                    value={newLead.industry}
                    onChange={(e) => setNewLead({ ...newLead, industry: e.target.value })}
                    className="w-full text-xs border border-slate-300 rounded-lg px-3 py-2 bg-slate-50"
                  >
                    <option value="fnb">F&B & Đồ uống</option>
                    <option value="coffee">Cà phê đặc sản</option>
                    <option value="cosmetics">Mỹ phẩm & Skincare</option>
                    <option value="confectionery">Bánh kẹo & Quà biếu</option>
                    <option value="food_nutrition">Thực phẩm dinh dưỡng</option>
                    <option value="home_appliances">Gia dụng & Smart Home</option>
                    <option value="agency">B2B Agencies</option>
                    <option value="general">Khác</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Website</label>
                  <input
                    type="text"
                    value={newLead.website}
                    onChange={(e) => setNewLead({ ...newLead, website: e.target.value })}
                    placeholder="https://..."
                    className="w-full text-xs border border-slate-300 rounded-lg px-3 py-2 bg-slate-50"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Ghi chú về vấn đề DN quan tâm</label>
                <textarea
                  rows={2}
                  value={newLead.notes}
                  onChange={(e) => setNewLead({ ...newLead, notes: e.target.value })}
                  placeholder="VD: Đang ra mắt dòng sản phẩm mới vào quý 3..."
                  className="w-full text-xs border border-slate-300 rounded-lg px-3 py-2 bg-slate-50"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddLeadModal(false)}
                  className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={addLeadLoading}
                  className="px-5 py-2 rounded-lg text-xs font-bold bg-slate-900 text-white shadow-sm hover:bg-slate-800 transition-all disabled:opacity-50"
                >
                  {addLeadLoading ? 'Đang lưu...' : 'Lưu Doanh Nghiệp'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
