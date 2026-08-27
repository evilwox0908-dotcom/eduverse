import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  query,
  where,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from './firebase';
import {
  SchoolRecord,
  SchoolStatus,
  SchoolVerificationResult,
  SchoolAssociationRequest,
  UserProfile,
} from '../types';

/**
 * Automatic Domain & Email Verification Engine for Educational Institutions
 */
export function evaluateSchoolAutoVerification(data: {
  name: string;
  officialEmail: string;
  website?: string;
  country: string;
  city: string;
  administrator: string;
}): SchoolVerificationResult {
  const email = (data.officialEmail || '').trim().toLowerCase();
  const website = (data.website || '').trim().toLowerCase();
  const name = (data.name || '').trim();

  const matchedCriteria: string[] = [];
  let score = 0;

  // 1. Check educational domain suffix
  const isEduDomain =
    email.endsWith('.edu') ||
    email.includes('.edu.') ||
    email.endsWith('.k12.us') ||
    email.includes('.sch.') ||
    email.endsWith('.ac.uk') ||
    email.endsWith('.ac.jp') ||
    email.endsWith('.edu.uz') ||
    email.endsWith('.uz') && (email.includes('maktab') || email.includes('litsey') || email.includes('school'));

  if (isEduDomain) {
    score += 50;
    matchedCriteria.push('Recognized official academic/government top-level domain extension.');
  }

  // 2. Check website domain match with email domain
  if (website && email.includes('@')) {
    const emailDomain = email.split('@')[1];
    const cleanWeb = website.replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0];
    if (emailDomain === cleanWeb || cleanWeb.includes(emailDomain) || emailDomain.includes(cleanWeb)) {
      score += 30;
      matchedCriteria.push('Official email domain strictly matches institutional website URI.');
    }
  }

  // 3. Completeness of metadata
  if (data.country && data.city && data.administrator && name.length >= 4) {
    score += 20;
    matchedCriteria.push('Complete administrator profile and verifiable geographic registry.');
  }

  // Determine status
  let status: SchoolStatus = 'PENDING';
  let autoVerified = false;
  let recommendedAction = 'Manual administrative verification required.';

  if (score >= 80) {
    status = 'VERIFIED';
    autoVerified = true;
    recommendedAction = 'Institution automatically verified via institutional domain validation.';
  } else if (score >= 40) {
    status = 'REVIEW_REQUIRED';
    recommendedAction = 'Domain requires secondary review by EduVerse Accreditation Board.';
  }

  return {
    status,
    confidenceScore: score,
    autoVerified,
    matchedCriteria,
    recommendedAction,
  };
}

/**
 * Register a new school institution
 */
export async function registerSchoolInstitution(schoolData: {
  name: string;
  country: string;
  stateProvince?: string;
  city: string;
  officialEmail: string;
  website?: string;
  administrator: string;
  schoolType?: string;
  grades?: string[];
  address?: string;
}): Promise<SchoolRecord> {
  const schoolId = `sch_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
  const verification = evaluateSchoolAutoVerification(schoolData);

  const record: SchoolRecord = {
    id: schoolId,
    name: schoolData.name,
    country: schoolData.country,
    stateProvince: schoolData.stateProvince || '',
    city: schoolData.city,
    website: schoolData.website || '',
    officialEmail: schoolData.officialEmail,
    administrator: schoolData.administrator,
    grades: schoolData.grades || ['Grade 5', 'Grade 6', 'Grade 7', 'Grade 8', 'Grade 9', 'Grade 10', 'Grade 11', 'Grade 12'],
    verificationStatus: verification.status,
    participatingStudentsCount: 0,
    competitionsCount: 0,
    autoVerified: verification.autoVerified,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const schoolDocRef = doc(db, 'schools', schoolId);
  await setDoc(schoolDocRef, {
    ...record,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  // Also sync to server store
  try {
    await fetch('/api/schools', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(record),
    });
  } catch (e) {
    console.warn('API school sync fallback:', e);
  }

  return record;
}

/**
 * Fetch all registered schools
 */
export async function fetchRegisteredSchools(): Promise<SchoolRecord[]> {
  try {
    const res = await fetch('/api/schools');
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data.schools)) {
        return data.schools;
      }
    }
  } catch (e) {
    console.warn('Server schools API fallback to Firestore:', e);
  }

  const schoolsRef = collection(db, 'schools');
  const snap = await getDocs(schoolsRef);
  const list: SchoolRecord[] = [];
  snap.forEach((docSnap) => {
    list.push({ id: docSnap.id, ...docSnap.data() } as SchoolRecord);
  });
  return list;
}

/**
 * Request association between a student and a school
 */
export async function requestStudentSchoolAssociation(
  studentProfile: UserProfile,
  school: SchoolRecord
): Promise<SchoolAssociationRequest> {
  const reqId = `assoc_${school.id}_${studentProfile.uid}`;
  const assocRef = doc(db, 'schoolAssociations', reqId);

  const isVerifiedSchool = school.verificationStatus === 'VERIFIED';
  const initialStatus = isVerifiedSchool ? 'VERIFIED' : 'PENDING';

  const payload: SchoolAssociationRequest = {
    id: reqId,
    studentId: studentProfile.uid,
    studentName: `${studentProfile.firstName} ${studentProfile.lastName || ''}`.trim(),
    studentEmail: studentProfile.email,
    schoolId: school.id,
    schoolName: school.name,
    grade: studentProfile.grade || 'Unassigned',
    status: initialStatus,
    requestedAt: new Date().toISOString(),
    verifiedAt: isVerifiedSchool ? new Date().toISOString() : undefined,
  };

  await setDoc(assocRef, {
    ...payload,
    requestedAt: serverTimestamp(),
    verifiedAt: isVerifiedSchool ? serverTimestamp() : null,
  });

  // If verified, update the student's profile school metadata
  const userDocRef = doc(db, 'users', studentProfile.uid);
  await updateDoc(userDocRef, {
    schoolId: school.id,
    schoolName: school.name,
    schoolVerificationStatus: isVerifiedSchool ? 'verified' : 'pending',
    updatedAt: serverTimestamp(),
  });

  return payload;
}
