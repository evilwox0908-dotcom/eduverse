import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  query,
  where,
  orderBy,
  limit,
  addDoc,
  serverTimestamp,
  onSnapshot,
  Unsubscribe,
  getCountFromServer,
} from 'firebase/firestore';
import { db } from './firebase';
import {
  UserProfile,
  SchoolRecord,
  AdminMetrics,
  AuditLogEntry,
  CertificateRecord,
  PaymentRecord,
  SecurityIncident,
  SystemSettingsConfig,
  Competition,
  CompetitionResult,
  AdminTab,
} from '../types';

export const FOUNDER_ADMIN_EMAIL = 'shohruhabdukarimov05@gmail.com';

// Verify if a user is authorized admin
export async function verifyAdminStatus(userUid: string, userEmail: string): Promise<boolean> {
  if (!userUid) return false;
  
  // 1. Direct founder email check
  if (userEmail && userEmail.toLowerCase() === FOUNDER_ADMIN_EMAIL.toLowerCase()) {
    return true;
  }

  // 2. Server API authorization verification
  try {
    const res = await fetch('/api/admin/verify-role', {
      headers: {
        'x-user-uid': userUid,
        'x-user-email': userEmail,
      },
    });
    if (res.ok) {
      const data = await res.json();
      return Boolean(data.isAdmin);
    }
  } catch (e) {
    console.warn('Server admin verify failed, fallback to Firestore doc:', e);
  }

  // 3. Firestore user document role check
  try {
    const userDocRef = doc(db, 'users', userUid);
    const snap = await getDoc(userDocRef);
    if (snap.exists()) {
      const data = snap.data();
      return data.role === 'admin' || (data.email && data.email.toLowerCase() === FOUNDER_ADMIN_EMAIL.toLowerCase());
    }
  } catch (e) {
    console.error('Error verifying admin status in Firestore:', e);
  }

  return false;
}

// Log administrative action
export async function logAdminAction(
  actorUid: string,
  actorEmail: string,
  action: string,
  targetRecord: string,
  details: Record<string, any> = {}
): Promise<void> {
  try {
    const logData: Omit<AuditLogEntry, 'id'> = {
      timestamp: new Date().toISOString(),
      action,
      actorUid,
      actorEmail,
      targetRecord,
      details,
    };

    // 1. Send to server
    fetch('/api/admin/audit-logs', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-user-uid': actorUid,
        'x-user-email': actorEmail,
      },
      body: JSON.stringify(logData),
    }).catch((e) => console.warn('Server audit log failed:', e));

    // 2. Write to Firestore audit_logs collection
    const logsRef = collection(db, 'audit_logs');
    await addDoc(logsRef, {
      ...logData,
      createdAt: serverTimestamp(),
    });
  } catch (err) {
    console.warn('Could not record audit log:', err);
  }
}

// Real database metrics query
export async function fetchAdminMetrics(actorUid: string, actorEmail: string): Promise<AdminMetrics> {
  // First try server API which compiles realtime stores and DB
  try {
    const res = await fetch('/api/admin/overview', {
      headers: {
        'x-user-uid': actorUid,
        'x-user-email': actorEmail,
      },
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (e) {
    console.warn('Failed to fetch metrics from server, querying Firestore directly:', e);
  }

  // Fallback direct Firestore count queries
  try {
    const usersCol = collection(db, 'users');
    const schoolsCol = collection(db, 'schools');
    const compsCol = collection(db, 'competitions');
    const resultsCol = collection(db, 'competitionResults');
    const certsCol = collection(db, 'certificates');

    const [usersSnap, schoolsSnap, compsSnap, resultsSnap, certsSnap] = await Promise.allSettled([
      getDocs(usersCol),
      getDocs(schoolsCol),
      getDocs(compsCol),
      getDocs(resultsCol),
      getDocs(certsCol),
    ]);

    const usersCount = usersSnap.status === 'fulfilled' ? usersSnap.value.size : 0;
    const schoolsCount = schoolsSnap.status === 'fulfilled' ? schoolsSnap.value.size : 0;
    const compsCount = compsSnap.status === 'fulfilled' ? compsSnap.value.size : 0;
    const resultsCount = resultsSnap.status === 'fulfilled' ? resultsSnap.value.size : 0;
    const certsCount = certsSnap.status === 'fulfilled' ? certsSnap.value.size : 0;

    return {
      registeredStudents: usersCount,
      registeredSchools: schoolsCount,
      activeCompetitions: compsCount,
      completedExams: resultsCount,
      pendingVerifications: 0,
      securityReviews: 0,
      certificatesIssued: certsCount,
    };
  } catch (e) {
    console.error('Error fetching admin metrics from Firestore:', e);
    return {
      registeredStudents: 0,
      registeredSchools: 0,
      activeCompetitions: 0,
      completedExams: 0,
      pendingVerifications: 0,
      securityReviews: 0,
      certificatesIssued: 0,
    };
  }
}

// ==========================================
// STUDENT MANAGEMENT
// ==========================================

export async function fetchStudentsList(
  actorUid: string,
  actorEmail: string,
  searchTerm: string = '',
  countryFilter: string = '',
  statusFilter: string = ''
): Promise<UserProfile[]> {
  try {
    const res = await fetch(`/api/admin/students?search=${encodeURIComponent(searchTerm)}&country=${encodeURIComponent(countryFilter)}&status=${encodeURIComponent(statusFilter)}`, {
      headers: {
        'x-user-uid': actorUid,
        'x-user-email': actorEmail,
      },
    });
    if (res.ok) {
      const data = await res.json();
      return data.students || [];
    }
  } catch (e) {
    console.warn('Server students fetch failed, fallback to Firestore:', e);
  }

  // Fallback to Firestore
  try {
    const usersRef = collection(db, 'users');
    const snap = await getDocs(usersRef);
    let list: UserProfile[] = snap.docs.map((d) => ({
      uid: d.id,
      ...d.data(),
    })) as UserProfile[];

    // Filter in-memory if needed
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      list = list.filter(
        (u) =>
          u.firstName?.toLowerCase().includes(term) ||
          u.lastName?.toLowerCase().includes(term) ||
          u.email?.toLowerCase().includes(term) ||
          u.eduVerseId?.toLowerCase().includes(term) ||
          u.schoolName?.toLowerCase().includes(term)
      );
    }
    if (countryFilter) {
      list = list.filter((u) => u.country === countryFilter);
    }
    return list;
  } catch (err) {
    console.error('Error fetching students:', err);
    return [];
  }
}

export async function updateStudentAccountStatus(
  actorUid: string,
  actorEmail: string,
  studentId: string,
  status: 'active' | 'suspended' | 'pending_verification'
): Promise<void> {
  const userRef = doc(db, 'users', studentId);
  await updateDoc(userRef, {
    accountStatus: status,
    updatedAt: serverTimestamp(),
  });

  await logAdminAction(
    actorUid,
    actorEmail,
    'STUDENT_STATUS_CHANGE',
    `users/${studentId}`,
    { status }
  );
}

// ==========================================
// SCHOOL MANAGEMENT
// ==========================================

export async function fetchSchoolsList(
  actorUid: string,
  actorEmail: string,
  searchTerm: string = '',
  statusFilter: string = ''
): Promise<SchoolRecord[]> {
  try {
    const res = await fetch(`/api/admin/schools?search=${encodeURIComponent(searchTerm)}&status=${encodeURIComponent(statusFilter)}`, {
      headers: {
        'x-user-uid': actorUid,
        'x-user-email': actorEmail,
      },
    });
    if (res.ok) {
      const data = await res.json();
      return data.schools || [];
    }
  } catch (e) {
    console.warn('Server schools fetch failed, querying Firestore:', e);
  }

  try {
    const schoolsRef = collection(db, 'schools');
    const snap = await getDocs(schoolsRef);
    let list: SchoolRecord[] = snap.docs.map((d) => ({
      id: d.id,
      ...d.data(),
    })) as SchoolRecord[];

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      list = list.filter(
        (s) =>
          s.name?.toLowerCase().includes(term) ||
          s.country?.toLowerCase().includes(term) ||
          s.city?.toLowerCase().includes(term) ||
          s.officialEmail?.toLowerCase().includes(term)
      );
    }
    if (statusFilter) {
      list = list.filter((s) => s.verificationStatus === statusFilter);
    }
    return list;
  } catch (e) {
    console.error('Error fetching schools:', e);
    return [];
  }
}

export async function updateSchoolVerification(
  actorUid: string,
  actorEmail: string,
  schoolId: string,
  newStatus: 'VERIFIED' | 'PENDING' | 'REVIEW_REQUIRED' | 'REJECTED'
): Promise<void> {
  const schoolRef = doc(db, 'schools', schoolId);
  await updateDoc(schoolRef, {
    verificationStatus: newStatus,
    updatedAt: new Date().toISOString(),
  });

  await logAdminAction(
    actorUid,
    actorEmail,
    'SCHOOL_VERIFICATION_CHANGE',
    `schools/${schoolId}`,
    { newStatus }
  );
}

export async function createSchoolRecord(
  actorUid: string,
  actorEmail: string,
  schoolData: Omit<SchoolRecord, 'id' | 'createdAt' | 'updatedAt'>
): Promise<string> {
  const schoolsRef = collection(db, 'schools');
  const now = new Date().toISOString();
  
  // Auto-verification workflow: if official email domain ends in .edu, .ac, or official recognized state domain
  const emailDomain = schoolData.officialEmail.split('@')[1]?.toLowerCase() || '';
  const isOfficialDomain = emailDomain.endsWith('.edu') || emailDomain.endsWith('.ac.uk') || emailDomain.endsWith('.gov');
  const status = isOfficialDomain ? 'VERIFIED' : schoolData.verificationStatus || 'PENDING';

  const docRef = await addDoc(schoolsRef, {
    ...schoolData,
    verificationStatus: status,
    autoVerified: isOfficialDomain,
    createdAt: now,
    updatedAt: now,
  });

  await logAdminAction(
    actorUid,
    actorEmail,
    'SCHOOL_CREATED',
    `schools/${docRef.id}`,
    { name: schoolData.name, status, autoVerified: isOfficialDomain }
  );

  return docRef.id;
}

// ==========================================
// AUDIT LOGS
// ==========================================

export async function fetchAuditLogs(
  actorUid: string,
  actorEmail: string,
  maxCount: number = 50
): Promise<AuditLogEntry[]> {
  try {
    const res = await fetch(`/api/admin/audit-logs?limit=${maxCount}`, {
      headers: {
        'x-user-uid': actorUid,
        'x-user-email': actorEmail,
      },
    });
    if (res.ok) {
      const data = await res.json();
      return data.logs || [];
    }
  } catch (e) {
    console.warn('Server audit logs fetch failed, fallback to Firestore:', e);
  }

  try {
    const logsRef = collection(db, 'audit_logs');
    const q = query(logsRef, orderBy('createdAt', 'desc'), limit(maxCount));
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({
      id: d.id,
      ...d.data(),
    })) as AuditLogEntry[];
  } catch (e) {
    console.error('Error fetching audit logs:', e);
    return [];
  }
}

// ==========================================
// CERTIFICATES
// ==========================================

export async function fetchCertificatesList(
  actorUid: string,
  actorEmail: string
): Promise<CertificateRecord[]> {
  try {
    const res = await fetch('/api/admin/certificates', {
      headers: {
        'x-user-uid': actorUid,
        'x-user-email': actorEmail,
      },
    });
    if (res.ok) {
      const data = await res.json();
      return data.certificates || [];
    }
  } catch (e) {
    console.warn('Server certificates fetch failed:', e);
  }

  try {
    const certsRef = collection(db, 'certificates');
    const snap = await getDocs(certsRef);
    return snap.docs.map((d) => ({
      id: d.id,
      ...d.data(),
    })) as CertificateRecord[];
  } catch (e) {
    return [];
  }
}

// ==========================================
// PAYMENTS
// ==========================================

export async function fetchPaymentsList(
  actorUid: string,
  actorEmail: string
): Promise<PaymentRecord[]> {
  try {
    const res = await fetch('/api/admin/payments', {
      headers: {
        'x-user-uid': actorUid,
        'x-user-email': actorEmail,
      },
    });
    if (res.ok) {
      const data = await res.json();
      return data.payments || [];
    }
  } catch (e) {
    console.warn('Server payments fetch failed:', e);
  }
  return [];
}

// ==========================================
// SECURITY INCIDENTS / LIVE EXAM MONITORING
// ==========================================

export async function fetchSecurityIncidents(
  actorUid: string,
  actorEmail: string
): Promise<SecurityIncident[]> {
  try {
    const res = await fetch('/api/admin/security', {
      headers: {
        'x-user-uid': actorUid,
        'x-user-email': actorEmail,
      },
    });
    if (res.ok) {
      const data = await res.json();
      return data.incidents || [];
    }
  } catch (e) {
    console.warn('Server security incidents fetch failed:', e);
  }
  return [];
}

// ==========================================
// SYSTEM SETTINGS
// ==========================================

export async function fetchSystemSettings(
  actorUid: string,
  actorEmail: string
): Promise<SystemSettingsConfig> {
  const defaultSettings: SystemSettingsConfig = {
    platformName: 'EduVerse Global Olympiad Platform',
    founderAdminEmail: FOUNDER_ADMIN_EMAIL,
    registrationOpen: true,
    maintenanceMode: false,
    autoVerifyOfficialSchools: true,
    minExamIntegrityThreshold: 75,
    supportEmail: 'contact@eduverse.global',
    version: '1.9.0-prod',
  };

  try {
    const res = await fetch('/api/admin/settings', {
      headers: {
        'x-user-uid': actorUid,
        'x-user-email': actorEmail,
      },
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (e) {
    console.warn('Server settings fetch failed, querying Firestore:', e);
  }

  try {
    const docRef = doc(db, 'system_settings', 'global');
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      return { ...defaultSettings, ...snap.data() };
    }
  } catch (e) {
    console.warn('Firestore system settings read:', e);
  }

  return defaultSettings;
}

export async function updateSystemSettings(
  actorUid: string,
  actorEmail: string,
  updates: Partial<SystemSettingsConfig>
): Promise<void> {
  const docRef = doc(db, 'system_settings', 'global');
  await setDoc(docRef, { ...updates, updatedAt: new Date().toISOString() }, { merge: true });

  await logAdminAction(
    actorUid,
    actorEmail,
    'SYSTEM_SETTINGS_UPDATE',
    'system_settings/global',
    updates
  );
}
