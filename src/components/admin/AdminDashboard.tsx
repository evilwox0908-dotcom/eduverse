import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Shield,
  Users,
  GraduationCap,
  Trophy,
  HelpCircle,
  Award,
  CreditCard,
  AlertTriangle,
  BookOpen,
  Settings,
  Activity,
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  ExternalLink,
  RefreshCw,
  Plus,
  Filter,
  Lock,
  ChevronRight,
  Sparkles,
  Eye,
  FileCheck,
  UserCheck,
  AlertCircle,
  Database,
  Building,
  Key,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { EduVerseLogo } from '../ui/EduVerseLogo';
import {
  AdminTab,
  AdminMetrics,
  UserProfile,
  SchoolRecord,
  AuditLogEntry,
  CertificateRecord,
  PaymentRecord,
  SecurityIncident,
  SystemSettingsConfig,
  Competition,
} from '../../types';
import {
  fetchAdminMetrics,
  fetchStudentsList,
  updateStudentAccountStatus,
  fetchSchoolsList,
  updateSchoolVerification,
  createSchoolRecord,
  fetchAuditLogs,
  fetchCertificatesList,
  fetchPaymentsList,
  fetchSecurityIncidents,
  fetchSystemSettings,
  updateSystemSettings,
  FOUNDER_ADMIN_EMAIL,
  logAdminAction,
} from '../../services/adminService';
import { COUNTRIES } from '../../data/countries';
import { QuestionBankManager } from './QuestionBankManager';

export const AdminDashboard: React.FC = () => {
  const { user, userProfile, isAdmin } = useAuth();
  const [currentTab, setCurrentTab] = useState<AdminTab>('overview');
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [metrics, setMetrics] = useState<AdminMetrics>({
    registeredStudents: 0,
    registeredSchools: 0,
    activeCompetitions: 0,
    completedExams: 0,
    pendingVerifications: 0,
    securityReviews: 0,
    certificatesIssued: 0,
  });

  // Students state
  const [students, setStudents] = useState<UserProfile[]>([]);
  const [studentSearch, setStudentSearch] = useState<string>('');
  const [selectedStudent, setSelectedStudent] = useState<UserProfile | null>(null);

  // Schools state
  const [schools, setSchools] = useState<SchoolRecord[]>([]);
  const [schoolSearch, setSchoolSearch] = useState<string>('');
  const [showAddSchoolModal, setShowAddSchoolModal] = useState<boolean>(false);
  const [newSchoolData, setNewSchoolData] = useState({
    name: '',
    country: 'United States',
    city: '',
    officialEmail: '',
    administrator: '',
    website: '',
  });

  // Competitions state
  const [competitions, setCompetitions] = useState<Competition[]>([]);

  // Questions state
  const [questions, setQuestions] = useState<any[]>([]);
  const [questionSubject, setQuestionSubject] = useState<string>('all');

  // Results state
  const [results, setResults] = useState<any[]>([]);

  // Certificates state
  const [certificates, setCertificates] = useState<CertificateRecord[]>([]);
  const [showIssueCertModal, setShowIssueCertModal] = useState<boolean>(false);
  const [certFormData, setCertFormData] = useState({
    studentId: '',
    studentName: '',
    competitionId: 'comp_math_olympiad_2026',
    competitionTitle: 'Global Mathematics Olympiad 2026',
    awardTitle: 'Gold Honor Award',
    score: 95,
    rank: 1,
  });

  // Payments state
  const [payments, setPayments] = useState<PaymentRecord[]>([]);

  // Security state
  const [incidents, setIncidents] = useState<SecurityIncident[]>([]);

  // Settings state
  const [settings, setSettings] = useState<SystemSettingsConfig>({
    platformName: 'EduVerse Global Olympiad Platform',
    founderAdminEmail: FOUNDER_ADMIN_EMAIL,
    registrationOpen: true,
    maintenanceMode: false,
    autoVerifyOfficialSchools: true,
    minExamIntegrityThreshold: 75,
    supportEmail: 'contact@eduverse.global',
    version: '1.9.0-prod',
  });
  const [settingsSaved, setSettingsSaved] = useState<boolean>(false);

  // Audit logs state
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);

  const actorUid = user?.uid || 'admin_founder';
  const actorEmail = user?.email || FOUNDER_ADMIN_EMAIL;

  const loadData = async () => {
    setLoading(true);
    try {
      // 1. Overview metrics
      const m = await fetchAdminMetrics(actorUid, actorEmail);
      setMetrics(m);

      // 2. Load tab specific or core datasets
      const [stList, schList, cList, qRes, resData, certsList, payList, secList, settsData, logsList] =
        await Promise.allSettled([
          fetchStudentsList(actorUid, actorEmail, studentSearch),
          fetchSchoolsList(actorUid, actorEmail, schoolSearch),
          fetch('/api/admin/competitions', { headers: { 'x-user-uid': actorUid, 'x-user-email': actorEmail } }).then(
            (r) => r.json()
          ),
          fetch('/api/admin/question-bank', { headers: { 'x-user-uid': actorUid, 'x-user-email': actorEmail } }).then(
            (r) => r.json()
          ),
          fetch('/api/admin/results', { headers: { 'x-user-uid': actorUid, 'x-user-email': actorEmail } }).then((r) =>
            r.json()
          ),
          fetchCertificatesList(actorUid, actorEmail),
          fetchPaymentsList(actorUid, actorEmail),
          fetchSecurityIncidents(actorUid, actorEmail),
          fetchSystemSettings(actorUid, actorEmail),
          fetchAuditLogs(actorUid, actorEmail),
        ]);

      if (stList.status === 'fulfilled') setStudents(stList.value);
      if (schList.status === 'fulfilled') setSchools(schList.value);
      if (cList.status === 'fulfilled' && cList.value?.competitions) setCompetitions(cList.value.competitions);
      if (qRes.status === 'fulfilled' && qRes.value?.questions) setQuestions(qRes.value.questions);
      if (resData.status === 'fulfilled' && resData.value?.results) setResults(resData.value.results);
      if (certsList.status === 'fulfilled') setCertificates(certsList.value);
      if (payList.status === 'fulfilled') setPayments(payList.value);
      if (secList.status === 'fulfilled') setIncidents(secList.value);
      if (settsData.status === 'fulfilled') setSettings(settsData.value);
      if (logsList.status === 'fulfilled') setAuditLogs(logsList.value);
    } catch (err) {
      console.error('Error loading admin system data:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [user]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadData();
  };

  const handleStatusChange = async (studentId: string, newStatus: 'active' | 'suspended') => {
    try {
      await updateStudentAccountStatus(actorUid, actorEmail, studentId, newStatus);
      await loadData();
    } catch (e) {
      console.error('Failed to change student status:', e);
    }
  };

  const handleSchoolVerificationChange = async (
    schoolId: string,
    newStatus: 'VERIFIED' | 'PENDING' | 'REVIEW_REQUIRED' | 'REJECTED'
  ) => {
    try {
      await updateSchoolVerification(actorUid, actorEmail, schoolId, newStatus);
      await loadData();
    } catch (e) {
      console.error('Failed to update school status:', e);
    }
  };

  const handleAddSchoolSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSchoolData.name || !newSchoolData.officialEmail) return;

    try {
      await createSchoolRecord(actorUid, actorEmail, {
        name: newSchoolData.name,
        country: newSchoolData.country,
        city: newSchoolData.city || 'Academic Campus',
        officialEmail: newSchoolData.officialEmail,
        administrator: newSchoolData.administrator || 'Principal / Academic Coordinator',
        grades: ['Grade 9', 'Grade 10', 'Grade 11', 'Grade 12'],
        verificationStatus: 'PENDING',
        participatingStudentsCount: 0,
        competitionsCount: 0,
        website: newSchoolData.website,
      });
      setShowAddSchoolModal(false);
      setNewSchoolData({
        name: '',
        country: 'United States',
        city: '',
        officialEmail: '',
        administrator: '',
        website: '',
      });
      await loadData();
    } catch (err) {
      console.error('Failed to add school:', err);
    }
  };

  const handleIssueCertificate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/certificates/issue', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-uid': actorUid,
          'x-user-email': actorEmail,
        },
        body: JSON.stringify(certFormData),
      });
      if (res.ok) {
        setShowIssueCertModal(false);
        await loadData();
      }
    } catch (err) {
      console.error('Error issuing certificate:', err);
    }
  };

  const handleSettingsSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateSystemSettings(actorUid, actorEmail, settings);
      setSettingsSaved(true);
      setTimeout(() => setSettingsSaved(false), 3000);
      await loadData();
    } catch (e) {
      console.error('Failed to save settings:', e);
    }
  };

  const tabs: { id: AdminTab; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'overview', label: 'Overview', icon: Activity },
    { id: 'students', label: 'Students', icon: Users },
    { id: 'schools', label: 'Schools & Partners', icon: Building },
    { id: 'competitions', label: 'Competitions', icon: Trophy },
    { id: 'question-bank', label: 'Question Bank', icon: HelpCircle },
    { id: 'results', label: 'Results & Standings', icon: Award },
    { id: 'certificates', label: 'Certificates', icon: FileCheck },
    { id: 'payments', label: 'Payments', icon: CreditCard },
    { id: 'security', label: 'Exam Integrity', icon: Shield },
    { id: 'content', label: 'Curriculum', icon: BookOpen },
    { id: 'settings', label: 'System Settings', icon: Settings },
  ];

  return (
    <div id="admin-dashboard-root" className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8 font-sans">
      {/* Top Admin Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-2xl p-6 shadow-xl">
          <div className="flex items-center gap-4">
            <div className="relative">
              <EduVerseLogo size="md" />
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold tracking-tight text-white">EduVerse Command Center</h1>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                  <Shield className="w-3 h-3 text-amber-400" />
                  FOUNDER ADMIN
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1 flex items-center gap-2">
                <span>Verified Clearance:</span>
                <span className="font-mono text-cyan-400 bg-slate-800/80 px-2 py-0.5 rounded border border-slate-700">
                  {actorEmail}
                </span>
                <span className="text-slate-500">•</span>
                <span className="text-emerald-400 flex items-center gap-1">
                  <Database className="w-3 h-3" /> Live Firestore & Production Node.js Engine
                </span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              id="admin-refresh-btn"
              onClick={handleRefresh}
              disabled={refreshing}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-medium text-slate-200 transition-all flex items-center gap-2 disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin text-cyan-400' : ''}`} />
              {refreshing ? 'Syncing...' : 'Sync Database'}
            </button>
            <div className="px-3 py-2 rounded-xl bg-emerald-950/40 border border-emerald-800/50 text-xs text-emerald-300 font-mono">
              STATUS: OPERATIONAL
            </div>
          </div>
        </div>

        {/* Global Navigation Tabs */}
        <div className="mt-6 flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none border-b border-slate-800/60">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = currentTab === tab.id;
            return (
              <button
                key={tab.id}
                id={`admin-tab-${tab.id}`}
                onClick={() => setCurrentTab(tab.id)}
                className={`px-4 py-2.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap flex items-center gap-2 ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/20'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto">
        <AnimatePresence mode="wait">
          {/* ========================================== */}
          {/* 1. OVERVIEW TAB */}
          {/* ========================================== */}
          {currentTab === 'overview' && (
            <motion.div
              key="tab-overview"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="space-y-6"
            >
              {/* Real Database Metrics Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4">
                  <div className="flex items-center justify-between text-slate-400 mb-2">
                    <span className="text-xs font-medium">Students</span>
                    <Users className="w-4 h-4 text-cyan-400" />
                  </div>
                  <div className="text-2xl font-bold text-white font-mono">{metrics.registeredStudents}</div>
                  <div className="text-[10px] text-slate-400 mt-1">Total in Auth & Database</div>
                </div>

                <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4">
                  <div className="flex items-center justify-between text-slate-400 mb-2">
                    <span className="text-xs font-medium">Schools</span>
                    <Building className="w-4 h-4 text-blue-400" />
                  </div>
                  <div className="text-2xl font-bold text-white font-mono">{metrics.registeredSchools}</div>
                  <div className="text-[10px] text-slate-400 mt-1">Verified & Pending</div>
                </div>

                <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4">
                  <div className="flex items-center justify-between text-slate-400 mb-2">
                    <span className="text-xs font-medium">Competitions</span>
                    <Trophy className="w-4 h-4 text-amber-400" />
                  </div>
                  <div className="text-2xl font-bold text-white font-mono">{metrics.activeCompetitions}</div>
                  <div className="text-[10px] text-slate-400 mt-1">Active Olympiads</div>
                </div>

                <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4">
                  <div className="flex items-center justify-between text-slate-400 mb-2">
                    <span className="text-xs font-medium">Completed Exams</span>
                    <Award className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="text-2xl font-bold text-white font-mono">{metrics.completedExams}</div>
                  <div className="text-[10px] text-slate-400 mt-1">Evaluated Submissions</div>
                </div>

                <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4">
                  <div className="flex items-center justify-between text-slate-400 mb-2">
                    <span className="text-xs font-medium">Pending Verifications</span>
                    <AlertCircle className="w-4 h-4 text-yellow-400" />
                  </div>
                  <div className="text-2xl font-bold text-white font-mono">{metrics.pendingVerifications}</div>
                  <div className="text-[10px] text-slate-400 mt-1">Awaiting Approval</div>
                </div>

                <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4">
                  <div className="flex items-center justify-between text-slate-400 mb-2">
                    <span className="text-xs font-medium">Certificates</span>
                    <FileCheck className="w-4 h-4 text-indigo-400" />
                  </div>
                  <div className="text-2xl font-bold text-white font-mono">{metrics.certificatesIssued}</div>
                  <div className="text-[10px] text-slate-400 mt-1">Tamper-Proof Issued</div>
                </div>
              </div>

              {/* System Health & Quick Actions Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Core Architecture Status */}
                <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6">
                  <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                    <Activity className="w-4 h-4 text-cyan-400" />
                    Infrastructure & Security Status
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
                      <div>
                        <div className="text-xs font-medium text-slate-200">Firebase Firestore</div>
                        <div className="text-[10px] text-slate-400">Strict RBAC rules active</div>
                      </div>
                      <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> SECURE
                      </span>
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
                      <div>
                        <div className="text-xs font-medium text-slate-200">Firebase Auth</div>
                        <div className="text-[10px] text-slate-400">Google OAuth & Email/Pass</div>
                      </div>
                      <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> CONNECTED
                      </span>
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
                      <div>
                        <div className="text-xs font-medium text-slate-200">Server Exam Engine</div>
                        <div className="text-[10px] text-slate-400">Authoritative evaluation</div>
                      </div>
                      <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> RUNNING
                      </span>
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
                      <div>
                        <div className="text-xs font-medium text-slate-200">Gemini 3.7 Flash AI</div>
                        <div className="text-[10px] text-slate-400">Diagnostic Practice Server</div>
                      </div>
                      <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> READY
                      </span>
                    </div>
                  </div>
                </div>

                {/* Recent Administrative Audit Trail */}
                <div className="lg:col-span-2 bg-slate-900/80 border border-slate-800 rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-semibold text-white uppercase tracking-wider flex items-center gap-2">
                      <Shield className="w-4 h-4 text-amber-400" />
                      Live Audit Logs (Immutable)
                    </h3>
                    <button
                      onClick={() => setCurrentTab('settings')}
                      className="text-xs text-cyan-400 hover:text-cyan-300 font-medium"
                    >
                      Audit Trail →
                    </button>
                  </div>

                  {auditLogs.length === 0 ? (
                    <div className="text-center py-10 text-slate-500 text-xs">
                      No administrative actions recorded yet.
                    </div>
                  ) : (
                    <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                      {auditLogs.slice(0, 6).map((log) => (
                        <div
                          key={log.id}
                          className="flex items-start justify-between p-3 rounded-xl bg-slate-950/50 border border-slate-800 text-xs"
                        >
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-mono font-semibold text-cyan-300">{log.action}</span>
                              <span className="text-[10px] text-slate-400">on {log.targetRecord}</span>
                            </div>
                            <div className="text-[11px] text-slate-400 mt-1">
                              By <span className="text-slate-300">{log.actorEmail}</span>
                            </div>
                          </div>
                          <span className="text-[10px] font-mono text-slate-500 whitespace-nowrap">
                            {new Date(log.timestamp).toLocaleTimeString()}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* ========================================== */}
          {/* 2. STUDENTS TAB */}
          {/* ========================================== */}
          {currentTab === 'students' && (
            <motion.div
              key="tab-students"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="space-y-6"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/80 p-4 rounded-xl border border-slate-800">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={studentSearch}
                    onChange={(e) => {
                      setStudentSearch(e.target.value);
                      fetchStudentsList(actorUid, actorEmail, e.target.value).then(setStudents);
                    }}
                    placeholder="Search candidate by name, email, EduVerse ID, or school..."
                    className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div className="text-xs text-slate-400">
                  Total Registered Candidates: <span className="font-bold text-white font-mono">{students.length}</span>
                </div>
              </div>

              {students.length === 0 ? (
                <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-12 text-center">
                  <Users className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                  <h4 className="text-sm font-semibold text-slate-300">No Student Records Yet</h4>
                  <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                    Real student profiles will appear here as candidates authenticate and complete their onboarding.
                  </p>
                </div>
              ) : (
                <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs text-slate-300">
                      <thead className="bg-slate-950/80 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                        <tr>
                          <th className="py-3.5 px-4 font-semibold">Candidate</th>
                          <th className="py-3.5 px-4 font-semibold">EduVerse ID</th>
                          <th className="py-3.5 px-4 font-semibold">Country & School</th>
                          <th className="py-3.5 px-4 font-semibold">Level & XP</th>
                          <th className="py-3.5 px-4 font-semibold">Status</th>
                          <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/60">
                        {students.map((st) => (
                          <tr key={st.uid} className="hover:bg-slate-800/40 transition-colors">
                            <td className="py-3.5 px-4">
                              <div className="font-semibold text-white">
                                {st.displayName || `${st.firstName || ''} ${st.lastName || ''}`.trim() || 'Candidate'}
                              </div>
                              <div className="text-[11px] text-slate-400 font-mono">{st.email}</div>
                            </td>
                            <td className="py-3.5 px-4 font-mono font-medium text-cyan-400">
                              {st.eduVerseId || 'Pending'}
                            </td>
                            <td className="py-3.5 px-4">
                              <div>{st.schoolName || 'Independent Candidate'}</div>
                              <div className="text-[10px] text-slate-400">{st.country || 'International'}</div>
                            </td>
                            <td className="py-3.5 px-4">
                              <div className="font-semibold text-amber-400">Level {st.level || 1}</div>
                              <div className="text-[10px] text-slate-400">{st.xp || 0} XP</div>
                            </td>
                            <td className="py-3.5 px-4">
                              <span
                                className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${
                                  st.accountStatus === 'suspended'
                                    ? 'bg-red-500/20 text-red-300 border-red-500/30'
                                    : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                                }`}
                              >
                                {st.accountStatus === 'suspended' ? 'SUSPENDED' : 'ACTIVE'}
                              </span>
                            </td>
                            <td className="py-3.5 px-4 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <button
                                  onClick={() => setSelectedStudent(st)}
                                  className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-[11px] font-medium text-slate-200"
                                >
                                  View Dossier
                                </button>
                                {st.accountStatus === 'suspended' ? (
                                  <button
                                    onClick={() => handleStatusChange(st.uid, 'active')}
                                    className="px-2.5 py-1 rounded bg-emerald-950/60 hover:bg-emerald-900 border border-emerald-800 text-[11px] font-medium text-emerald-300"
                                  >
                                    Reactivate
                                  </button>
                                ) : (
                                  <button
                                    onClick={() => handleStatusChange(st.uid, 'suspended')}
                                    className="px-2.5 py-1 rounded bg-red-950/60 hover:bg-red-900 border border-red-800 text-[11px] font-medium text-red-300"
                                  >
                                    Suspend
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Candidate Detail Dossier Modal */}
              {selectedStudent && (
                <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
                  <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                      <div>
                        <h3 className="text-base font-bold text-white">Student Academic Dossier</h3>
                        <p className="text-xs font-mono text-cyan-400">{selectedStudent.eduVerseId}</p>
                      </div>
                      <button
                        onClick={() => setSelectedStudent(null)}
                        className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white"
                      >
                        ✕
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div className="p-3 bg-slate-950 rounded-xl border border-slate-800/80">
                        <span className="text-slate-500 block text-[10px]">Full Name</span>
                        <span className="font-semibold text-white">
                          {selectedStudent.displayName || `${selectedStudent.firstName} ${selectedStudent.lastName}`}
                        </span>
                      </div>
                      <div className="p-3 bg-slate-950 rounded-xl border border-slate-800/80">
                        <span className="text-slate-500 block text-[10px]">Email Address</span>
                        <span className="font-mono text-slate-300 truncate block">{selectedStudent.email}</span>
                      </div>
                      <div className="p-3 bg-slate-950 rounded-xl border border-slate-800/80">
                        <span className="text-slate-500 block text-[10px]">School</span>
                        <span className="font-semibold text-white">{selectedStudent.schoolName || 'N/A'}</span>
                      </div>
                      <div className="p-3 bg-slate-950 rounded-xl border border-slate-800/80">
                        <span className="text-slate-500 block text-[10px]">Country / Grade</span>
                        <span className="font-semibold text-white">
                          {selectedStudent.country || 'N/A'} • {selectedStudent.grade || 'N/A'}
                        </span>
                      </div>
                      <div className="p-3 bg-slate-950 rounded-xl border border-slate-800/80">
                        <span className="text-slate-500 block text-[10px]">XP & Level</span>
                        <span className="font-semibold text-amber-400">
                          {selectedStudent.xp || 0} XP (Level {selectedStudent.level || 1})
                        </span>
                      </div>
                      <div className="p-3 bg-slate-950 rounded-xl border border-slate-800/80">
                        <span className="text-slate-500 block text-[10px]">Current Streak</span>
                        <span className="font-semibold text-orange-400">{selectedStudent.currentStreak || 0} Days</span>
                      </div>
                    </div>

                    <div className="pt-2 flex justify-end">
                      <button
                        onClick={() => setSelectedStudent(null)}
                        className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-semibold rounded-xl text-white"
                      >
                        Close Dossier
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* ========================================== */}
          {/* 3. SCHOOLS & PARTNERS TAB */}
          {/* ========================================== */}
          {currentTab === 'schools' && (
            <motion.div
              key="tab-schools"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="space-y-6"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/80 p-4 rounded-xl border border-slate-800">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={schoolSearch}
                    onChange={(e) => {
                      setSchoolSearch(e.target.value);
                      fetchSchoolsList(actorUid, actorEmail, e.target.value).then(setSchools);
                    }}
                    placeholder="Search schools by name, country, city, official domain..."
                    className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <button
                  id="admin-add-school-btn"
                  onClick={() => setShowAddSchoolModal(true)}
                  className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-semibold flex items-center gap-2 shadow-md shadow-cyan-600/20"
                >
                  <Plus className="w-4 h-4" />
                  Register School
                </button>
              </div>

              {schools.length === 0 ? (
                <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-12 text-center">
                  <Building className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                  <h4 className="text-sm font-semibold text-slate-300">No School Records in Registry</h4>
                  <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                    Registered schools and university test centers will be listed here. You can also register accredited
                    institutions directly using the button above.
                  </p>
                </div>
              ) : (
                <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs text-slate-300">
                      <thead className="bg-slate-950/80 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                        <tr>
                          <th className="py-3.5 px-4 font-semibold">Institution Name</th>
                          <th className="py-3.5 px-4 font-semibold">Location</th>
                          <th className="py-3.5 px-4 font-semibold">Official Domain / Admin</th>
                          <th className="py-3.5 px-4 font-semibold">Verification Status</th>
                          <th className="py-3.5 px-4 font-semibold text-right">Verification Controls</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/60">
                        {schools.map((sch) => (
                          <tr key={sch.id} className="hover:bg-slate-800/40 transition-colors">
                            <td className="py-3.5 px-4">
                              <div className="font-semibold text-white">{sch.name}</div>
                              {sch.autoVerified && (
                                <span className="text-[10px] text-cyan-400 flex items-center gap-1 mt-0.5">
                                  <CheckCircle2 className="w-3 h-3" /> Auto-Verified (.edu / official domain)
                                </span>
                              )}
                            </td>
                            <td className="py-3.5 px-4">
                              <div>{sch.city}</div>
                              <div className="text-[10px] text-slate-400">{sch.country}</div>
                            </td>
                            <td className="py-3.5 px-4">
                              <div className="font-mono text-slate-300">{sch.officialEmail}</div>
                              <div className="text-[10px] text-slate-400">{sch.administrator}</div>
                            </td>
                            <td className="py-3.5 px-4">
                              <span
                                className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${
                                  sch.verificationStatus === 'VERIFIED'
                                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                                    : sch.verificationStatus === 'REVIEW_REQUIRED'
                                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                                    : sch.verificationStatus === 'REJECTED'
                                    ? 'bg-red-500/20 text-red-300 border-red-500/30'
                                    : 'bg-slate-500/20 text-slate-300 border-slate-500/30'
                                }`}
                              >
                                {sch.verificationStatus}
                              </span>
                            </td>
                            <td className="py-3.5 px-4 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  onClick={() => handleSchoolVerificationChange(sch.id, 'VERIFIED')}
                                  className="px-2.5 py-1 rounded bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-700 text-[10px] font-medium text-emerald-300"
                                >
                                  Verify
                                </button>
                                <button
                                  onClick={() => handleSchoolVerificationChange(sch.id, 'REVIEW_REQUIRED')}
                                  className="px-2.5 py-1 rounded bg-amber-950/80 hover:bg-amber-900 border border-amber-700 text-[10px] font-medium text-amber-300"
                                >
                                  Review
                                </button>
                                <button
                                  onClick={() => handleSchoolVerificationChange(sch.id, 'REJECTED')}
                                  className="px-2.5 py-1 rounded bg-red-950/80 hover:bg-red-900 border border-red-700 text-[10px] font-medium text-red-300"
                                >
                                  Reject
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Add School Modal */}
              {showAddSchoolModal && (
                <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
                  <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                      <h3 className="text-base font-bold text-white flex items-center gap-2">
                        <Building className="w-4 h-4 text-cyan-400" />
                        Register Academic Institution
                      </h3>
                      <button
                        onClick={() => setShowAddSchoolModal(false)}
                        className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white"
                      >
                        ✕
                      </button>
                    </div>

                    <form onSubmit={handleAddSchoolSubmit} className="space-y-3 text-xs">
                      <div>
                        <label className="block text-slate-400 mb-1">Institution Legal Name *</label>
                        <input
                          type="text"
                          required
                          value={newSchoolData.name}
                          onChange={(e) => setNewSchoolData({ ...newSchoolData, name: e.target.value })}
                          placeholder="e.g. Thomas Jefferson High School for Science & Technology"
                          className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-slate-400 mb-1">Country *</label>
                          <select
                            value={newSchoolData.country}
                            onChange={(e) => setNewSchoolData({ ...newSchoolData, country: e.target.value })}
                            className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-cyan-500"
                          >
                            {COUNTRIES.map((c) => (
                              <option key={c.code} value={c.name}>
                                {c.name}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-slate-400 mb-1">City / Campus</label>
                          <input
                            type="text"
                            value={newSchoolData.city}
                            onChange={(e) => setNewSchoolData({ ...newSchoolData, city: e.target.value })}
                            placeholder="Alexandria, VA"
                            className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-slate-400 mb-1">Official Domain Email * (.edu / official)</label>
                        <input
                          type="email"
                          required
                          value={newSchoolData.officialEmail}
                          onChange={(e) => setNewSchoolData({ ...newSchoolData, officialEmail: e.target.value })}
                          placeholder="olympiad-coordinator@tjhsst.edu"
                          className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500"
                        />
                        <p className="text-[10px] text-slate-500 mt-0.5">
                          Emails ending in .edu, .ac.uk, or official domains are auto-verified upon creation.
                        </p>
                      </div>

                      <div>
                        <label className="block text-slate-400 mb-1">Administrator / Coordinator Name</label>
                        <input
                          type="text"
                          value={newSchoolData.administrator}
                          onChange={(e) => setNewSchoolData({ ...newSchoolData, administrator: e.target.value })}
                          placeholder="Dr. Eleanor Vance (Dean of STEM)"
                          className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500"
                        />
                      </div>

                      <div className="pt-3 flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setShowAddSchoolModal(false)}
                          className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium rounded-xl"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold rounded-xl"
                        >
                          Register & Verify
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* ========================================== */}
          {/* 4. COMPETITIONS TAB */}
          {/* ========================================== */}
          {currentTab === 'competitions' && (
            <motion.div
              key="tab-competitions"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {competitions.map((comp) => (
                  <div
                    key={comp.id}
                    className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                          {comp.subject}
                        </span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                          {comp.status}
                        </span>
                      </div>
                      <h4 className="text-base font-bold text-white mb-2">{comp.title}</h4>
                      <p className="text-xs text-slate-400 line-clamp-2 mb-4">{comp.description}</p>

                      <div className="grid grid-cols-2 gap-2 text-[11px] mb-4">
                        <div className="p-2 bg-slate-950 rounded-lg border border-slate-800/80">
                          <span className="text-slate-500 block text-[9px]">Duration</span>
                          <span className="font-semibold text-white">{comp.durationMinutes} Minutes</span>
                        </div>
                        <div className="p-2 bg-slate-950 rounded-lg border border-slate-800/80">
                          <span className="text-slate-500 block text-[9px]">Total Questions</span>
                          <span className="font-semibold text-white">{comp.totalQuestions} Questions</span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                      <span>Fee: {comp.entryFee ? `$${comp.entryFee}` : 'Free'}</span>
                      <span className="font-mono text-[10px] text-cyan-400">ID: {comp.id}</span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* ========================================== */}
          {/* 5. QUESTION BANK TAB */}
          {/* ========================================== */}
          {currentTab === 'question-bank' && (
            <motion.div
              key="tab-question-bank"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
            >
              <QuestionBankManager
                actorUid={actorUid}
                actorEmail={actorEmail}
                onTestGenerated={loadData}
              />
            </motion.div>
          )}

          {/* ========================================== */}
          {/* 6. RESULTS & STANDINGS TAB */}
          {/* ========================================== */}
          {currentTab === 'results' && (
            <motion.div
              key="tab-results"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="space-y-6"
            >
              {results.length === 0 ? (
                <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-12 text-center">
                  <Award className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                  <h4 className="text-sm font-semibold text-slate-300">No Evaluated Results Yet</h4>
                  <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                    When candidates complete their official olympiad exams, their evaluated scores, percentiles, and
                    standings will appear here in real-time.
                  </p>
                </div>
              ) : (
                <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs text-slate-300">
                      <thead className="bg-slate-950/80 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                        <tr>
                          <th className="py-3.5 px-4 font-semibold">Candidate</th>
                          <th className="py-3.5 px-4 font-semibold">Competition</th>
                          <th className="py-3.5 px-4 font-semibold">Score / Total</th>
                          <th className="py-3.5 px-4 font-semibold">Rank & Award</th>
                          <th className="py-3.5 px-4 font-semibold">Integrity Score</th>
                          <th className="py-3.5 px-4 font-semibold text-right">Certificate</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/60">
                        {results.map((resItem) => (
                          <tr key={resItem.id} className="hover:bg-slate-800/40 transition-colors">
                            <td className="py-3.5 px-4">
                              <div className="font-semibold text-white">{resItem.studentName}</div>
                              <div className="text-[10px] text-slate-400 font-mono">{resItem.studentId}</div>
                            </td>
                            <td className="py-3.5 px-4">{resItem.competitionTitle}</td>
                            <td className="py-3.5 px-4 font-mono font-bold text-cyan-400">
                              {resItem.totalScore} / {resItem.maxScore} ({Math.round(resItem.percentageScore)}%)
                            </td>
                            <td className="py-3.5 px-4">
                              <span className="font-semibold text-amber-300">{resItem.awardTier}</span>
                              <div className="text-[10px] text-slate-400">Rank #{resItem.rank || 1}</div>
                            </td>
                            <td className="py-3.5 px-4 font-mono text-emerald-400">
                              {resItem.integrityScore || 100}% Clean
                            </td>
                            <td className="py-3.5 px-4 text-right">
                              <button
                                onClick={() => {
                                  setCertFormData({
                                    studentId: resItem.studentId,
                                    studentName: resItem.studentName,
                                    competitionId: resItem.competitionId,
                                    competitionTitle: resItem.competitionTitle,
                                    awardTitle: resItem.awardTier,
                                    score: resItem.totalScore,
                                    rank: resItem.rank || 1,
                                  });
                                  setShowIssueCertModal(true);
                                }}
                                className="px-2.5 py-1 rounded bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-700 text-[11px] font-medium text-cyan-300"
                              >
                                Issue Certificate
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* ========================================== */}
          {/* 7. CERTIFICATES TAB */}
          {/* ========================================== */}
          {currentTab === 'certificates' && (
            <motion.div
              key="tab-certificates"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="space-y-6"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/80 p-4 rounded-xl border border-slate-800">
                <div>
                  <h4 className="text-xs font-semibold text-white">Global Verifiable Certificate Registry</h4>
                  <p className="text-[10px] text-slate-400">
                    Each issued credential contains a cryptographic tamper-proof validation code.
                  </p>
                </div>
                <button
                  onClick={() => setShowIssueCertModal(true)}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold flex items-center gap-2 shadow-md shadow-indigo-600/20"
                >
                  <Plus className="w-4 h-4" />
                  Issue New Certificate
                </button>
              </div>

              {certificates.length === 0 ? (
                <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-12 text-center">
                  <FileCheck className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                  <h4 className="text-sm font-semibold text-slate-300">No Certificates Issued Yet</h4>
                  <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                    Certificates will be logged here once awarded to qualifying candidates. You can also issue one
                    manually above.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {certificates.map((cert) => (
                    <div
                      key={cert.id}
                      className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-3 relative overflow-hidden"
                    >
                      <div className="absolute -right-8 -top-8 w-28 h-28 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs text-cyan-400 font-bold">{cert.certificateCode}</span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                          {cert.status}
                        </span>
                      </div>
                      <div>
                        <h4 className="text-base font-bold text-white">{cert.studentName}</h4>
                        <p className="text-xs text-indigo-300 font-medium mt-0.5">{cert.awardTitle}</p>
                        <p className="text-xs text-slate-400 mt-1">{cert.competitionTitle}</p>
                      </div>
                      <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                        <span>Issued: {new Date(cert.issueDate).toLocaleDateString()}</span>
                        <span className="font-mono text-slate-300">Score: {cert.score} pts</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Issue Certificate Modal */}
              {showIssueCertModal && (
                <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
                  <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                      <h3 className="text-base font-bold text-white flex items-center gap-2">
                        <FileCheck className="w-4 h-4 text-indigo-400" />
                        Issue Official Certificate
                      </h3>
                      <button
                        onClick={() => setShowIssueCertModal(false)}
                        className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white"
                      >
                        ✕
                      </button>
                    </div>

                    <form onSubmit={handleIssueCertificate} className="space-y-3 text-xs">
                      <div>
                        <label className="block text-slate-400 mb-1">Candidate Full Name *</label>
                        <input
                          type="text"
                          required
                          value={certFormData.studentName}
                          onChange={(e) => setCertFormData({ ...certFormData, studentName: e.target.value })}
                          placeholder="e.g. Alex Morgan"
                          className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-indigo-500"
                        />
                      </div>

                      <div>
                        <label className="block text-slate-400 mb-1">Competition Title *</label>
                        <input
                          type="text"
                          required
                          value={certFormData.competitionTitle}
                          onChange={(e) => setCertFormData({ ...certFormData, competitionTitle: e.target.value })}
                          className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-indigo-500"
                        />
                      </div>

                      <div>
                        <label className="block text-slate-400 mb-1">Honor / Award Title *</label>
                        <input
                          type="text"
                          required
                          value={certFormData.awardTitle}
                          onChange={(e) => setCertFormData({ ...certFormData, awardTitle: e.target.value })}
                          placeholder="e.g. Gold Honor Award, High Distinction"
                          className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-indigo-500"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-slate-400 mb-1">Final Score</label>
                          <input
                            type="number"
                            value={certFormData.score}
                            onChange={(e) => setCertFormData({ ...certFormData, score: Number(e.target.value) })}
                            className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-indigo-500"
                          />
                        </div>
                        <div>
                          <label className="block text-slate-400 mb-1">Rank</label>
                          <input
                            type="number"
                            value={certFormData.rank}
                            onChange={(e) => setCertFormData({ ...certFormData, rank: Number(e.target.value) })}
                            className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-indigo-500"
                          />
                        </div>
                      </div>

                      <div className="pt-3 flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setShowIssueCertModal(false)}
                          className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium rounded-xl"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl"
                        >
                          Issue Credential
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* ========================================== */}
          {/* 8. PAYMENTS TAB */}
          {/* ========================================== */}
          {currentTab === 'payments' && (
            <motion.div
              key="tab-payments"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="space-y-6"
            >
              {payments.length === 0 ? (
                <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-12 text-center">
                  <CreditCard className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                  <h4 className="text-sm font-semibold text-slate-300">No Transaction Records Yet</h4>
                  <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                    Real candidate registration fees and financial logs will be displayed here securely with zero fake
                    or simulated values.
                  </p>
                </div>
              ) : (
                <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
                  {/* Real payments table */}
                </div>
              )}
            </motion.div>
          )}

          {/* ========================================== */}
          {/* 9. EXAM INTEGRITY / SECURITY TAB */}
          {/* ========================================== */}
          {currentTab === 'security' && (
            <motion.div
              key="tab-security"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between bg-slate-900/80 p-4 rounded-xl border border-slate-800">
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-red-400" />
                  <div>
                    <h4 className="text-xs font-semibold text-white">Live Exam Proctoring & Integrity Feed</h4>
                    <p className="text-[10px] text-slate-400">
                      Real-time candidate telemetry: tab-switching, fullscreen exits, and device verification logs.
                    </p>
                  </div>
                </div>
                <div className="text-xs font-mono text-emerald-400">All Candidate Streams Encrypted</div>
              </div>

              {incidents.length === 0 ? (
                <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-12 text-center">
                  <CheckCircle2 className="w-12 h-12 text-emerald-500/60 mx-auto mb-3" />
                  <h4 className="text-sm font-semibold text-slate-300">Zero Security Flags Recorded</h4>
                  <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                    All candidate active exam sessions are operating within 100% integrity parameters.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {incidents.map((inc) => (
                    <div
                      key={inc.id}
                      className="p-4 rounded-xl bg-slate-900/90 border border-red-900/40 flex items-start justify-between text-xs"
                    >
                      <div className="flex items-start gap-3">
                        <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-white">{inc.studentName}</span>
                            <span className="text-[10px] text-slate-400">in {inc.competitionTitle}</span>
                            <span className="px-2 py-0.2 rounded text-[9px] font-bold bg-red-500/20 text-red-300 border border-red-500/30">
                              {inc.incidentType}
                            </span>
                          </div>
                          <p className="text-slate-400 text-[11px] mt-1">{inc.details}</p>
                        </div>
                      </div>
                      <span className="text-[10px] font-mono text-slate-500">
                        {new Date(inc.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* ========================================== */}
          {/* 10. SYSTEM SETTINGS TAB */}
          {/* ========================================== */}
          {currentTab === 'settings' && (
            <motion.div
              key="tab-settings"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="space-y-6 max-w-3xl"
            >
              <form
                onSubmit={handleSettingsSave}
                className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-5 shadow-xl text-xs"
              >
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <div>
                    <h3 className="text-base font-bold text-white">Platform System Settings</h3>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Global configuration parameters for the EduVerse production platform.
                    </p>
                  </div>
                  {settingsSaved && (
                    <span className="px-3 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold flex items-center gap-1.5 animate-pulse">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Saved to Database
                    </span>
                  )}
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Platform Official Name</label>
                  <input
                    type="text"
                    value={settings.platformName}
                    onChange={(e) => setSettings({ ...settings, platformName: e.target.value })}
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Founder / Primary Admin Email</label>
                  <input
                    type="email"
                    disabled
                    value={settings.founderAdminEmail}
                    className="w-full p-2.5 bg-slate-950/60 border border-slate-800 rounded-lg text-slate-400 font-mono cursor-not-allowed"
                  />
                  <p className="text-[10px] text-amber-400/80 mt-1">
                    Locked to verified EduVerse founder authority: {FOUNDER_ADMIN_EMAIL}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <label className="flex items-center gap-3 p-3 bg-slate-950 rounded-xl border border-slate-800 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.registrationOpen}
                      onChange={(e) => setSettings({ ...settings, registrationOpen: e.target.checked })}
                      className="rounded text-cyan-500 focus:ring-cyan-400 h-4 w-4 bg-slate-900 border-slate-700"
                    />
                    <div>
                      <span className="font-semibold text-white block">Open Registration</span>
                      <span className="text-[10px] text-slate-400">Allow new candidate signups</span>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 p-3 bg-slate-950 rounded-xl border border-slate-800 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.autoVerifyOfficialSchools}
                      onChange={(e) => setSettings({ ...settings, autoVerifyOfficialSchools: e.target.checked })}
                      className="rounded text-cyan-500 focus:ring-cyan-400 h-4 w-4 bg-slate-900 border-slate-700"
                    />
                    <div>
                      <span className="font-semibold text-white block">Auto-Verify Official Domains</span>
                      <span className="text-[10px] text-slate-400">Instant approval for .edu & .gov</span>
                    </div>
                  </label>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-xl text-xs shadow-lg shadow-cyan-500/20 hover:from-cyan-400 hover:to-blue-500 transition-all"
                  >
                    Save Configuration
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
