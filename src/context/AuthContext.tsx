import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import {
  User,
  onAuthStateChanged,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  verifyPasswordResetCode,
  confirmPasswordReset,
  signOut,
  updateProfile as updateFirebaseProfile,
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { auth, googleProvider, db, getUserProfile } from '../services/firebase';
import { UserProfile, OnboardingState } from '../types';

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  loginWithGoogle: () => Promise<{ isNewUser: boolean; profile: UserProfile | null }>;
  loginWithEmail: (email: string, pass: string) => Promise<UserProfile | null>;
  signupWithEmail: (firstName: string, lastName: string, email: string, pass: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  verifyResetCode: (code: string) => Promise<string>;
  confirmPasswordResetWithCode: (code: string, newPass: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUserProfile: () => Promise<UserProfile | null>;
  saveOnboardingProfile: (data: OnboardingState) => Promise<void>;
}

function generateRandomEVCode(): string {
  const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return `EV-${code}`;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch Firestore user profile
  const fetchProfile = async (uid: string): Promise<UserProfile | null> => {
    try {
      const profile = await getUserProfile(uid);
      setUserProfile(profile);
      return profile;
    } catch (err) {
      console.error('Failed to load profile:', err);
      return null;
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        await fetchProfile(currentUser.uid);
      } else {
        setUserProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loginWithGoogle = async (): Promise<{ isNewUser: boolean; profile: UserProfile | null }> => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const authenticatedUser = result.user;
      
      // Check if profile exists in Firestore
      const userDocRef = doc(db, 'users', authenticatedUser.uid);
      const snap = await getDoc(userDocRef);

      if (!snap.exists()) {
        // Parse names from displayName
        const displayName = authenticatedUser.displayName || '';
        const nameParts = displayName.split(' ');
        const firstName = nameParts[0] || '';
        const lastName = nameParts.slice(1).join(' ') || '';

        const evId = generateRandomEVCode();

        const initialData: Partial<UserProfile> = {
          uid: authenticatedUser.uid,
          eduVerseId: evId,
          firstName,
          lastName,
          displayName: displayName || `${firstName} ${lastName}`.trim(),
          email: authenticatedUser.email || '',
          photoURL: authenticatedUser.photoURL || '',
          role: 'student',
          country: '',
          countryCode: '',
          region: '',
          schoolName: '',
          schoolVerificationStatus: 'pending',
          grade: '',
          educationSystem: '',
          eduverseScore: 0,
          xp: 0,
          level: 1,
          profileCompleted: false,
          privacySettings: {
            isPublicProfile: false,
            showSchool: true,
            showCountry: true,
            showAchievements: true,
            showCompetitionResults: true,
          },
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        };

        await setDoc(userDocRef, initialData);

        // Also sync profile with backend store
        try {
          await fetch(`/api/students/${authenticatedUser.uid}/profile-sync`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(initialData),
          });
        } catch (e) {
          console.warn('Backend profile sync error:', e);
        }

        const profile = await fetchProfile(authenticatedUser.uid);
        return { isNewUser: true, profile };
      } else {
        const profile = snap.data() as UserProfile;
        setUserProfile(profile);
        return { isNewUser: !profile.profileCompleted, profile };
      }
    } catch (error) {
      console.error('Google login error:', error);
      throw error;
    }
  };

  const loginWithEmail = async (email: string, pass: string): Promise<UserProfile | null> => {
    try {
      const result = await signInWithEmailAndPassword(auth, email.trim(), pass);
      return await fetchProfile(result.user.uid);
    } catch (error) {
      console.error('Email login error:', error);
      throw error;
    }
  };

  const signupWithEmail = async (
    firstName: string,
    lastName: string,
    email: string,
    pass: string
  ): Promise<void> => {
    try {
      const result = await createUserWithEmailAndPassword(auth, email.trim(), pass);
      const newUser = result.user;

      // Update Firebase Auth profile displayName
      await updateFirebaseProfile(newUser, {
        displayName: `${firstName.trim()} ${lastName.trim()}`.trim(),
      });

      const evId = generateRandomEVCode();

      // Create initial Firestore doc
      const userDocRef = doc(db, 'users', newUser.uid);
      const initialData: Partial<UserProfile> = {
        uid: newUser.uid,
        eduVerseId: evId,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        displayName: `${firstName.trim()} ${lastName.trim()}`.trim(),
        email: newUser.email || email.trim(),
        role: 'student',
        country: '',
        countryCode: '',
        region: '',
        schoolName: '',
        schoolVerificationStatus: 'pending',
        grade: '',
        educationSystem: '',
        eduverseScore: 0,
        xp: 0,
        level: 1,
        profileCompleted: false,
        privacySettings: {
          isPublicProfile: false,
          showSchool: true,
          showCountry: true,
          showAchievements: true,
          showCompetitionResults: true,
        },
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      await setDoc(userDocRef, initialData);

      // Also sync profile with backend store
      try {
        await fetch(`/api/students/${newUser.uid}/profile-sync`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(initialData),
        });
      } catch (e) {
        console.warn('Backend profile sync error:', e);
      }

      await fetchProfile(newUser.uid);
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  };

  const resetPassword = async (email: string): Promise<void> => {
    try {
      await sendPasswordResetEmail(auth, email.trim());
    } catch (error) {
      console.error('Reset password error:', error);
      throw error;
    }
  };

  const verifyResetCode = async (code: string): Promise<string> => {
    try {
      return await verifyPasswordResetCode(auth, code);
    } catch (error) {
      console.error('Verify reset code error:', error);
      throw error;
    }
  };

  const confirmPasswordResetWithCode = async (code: string, newPass: string): Promise<void> => {
    try {
      await confirmPasswordReset(auth, code, newPass);
    } catch (error) {
      console.error('Confirm password reset error:', error);
      throw error;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await signOut(auth);
      setUser(null);
      setUserProfile(null);
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  };

  const refreshUserProfile = async (): Promise<UserProfile | null> => {
    if (user) {
      return await fetchProfile(user.uid);
    }
    return null;
  };

  const saveOnboardingProfile = async (data: OnboardingState): Promise<void> => {
    if (!user) {
      throw new Error('User is not authenticated');
    }

    const userDocRef = doc(db, 'users', user.uid);
    const profilePayload: Partial<UserProfile> = {
      uid: user.uid,
      firstName: data.firstName.trim(),
      lastName: data.lastName.trim(),
      displayName: `${data.firstName.trim()} ${data.lastName.trim()}`.trim(),
      email: user.email || '',
      photoURL: data.photoURL || user.photoURL || '',
      role: data.role,
      country: data.country,
      countryCode: data.countryCode,
      region: data.region,
      schoolName: data.schoolName.trim(),
      schoolVerificationStatus: data.schoolVerificationStatus,
      grade: data.grade,
      educationSystem: data.educationSystem,
      profileCompleted: true,
      updatedAt: serverTimestamp(),
    };

    // Update Firebase Auth user display name if changed
    try {
      await updateFirebaseProfile(user, {
        displayName: `${data.firstName.trim()} ${data.lastName.trim()}`.trim(),
        photoURL: data.photoURL || user.photoURL || undefined,
      });
    } catch (e) {
      console.warn('Could not update Firebase user displayName', e);
    }

    await updateDoc(userDocRef, profilePayload);

    // Sync with backend store
    try {
      await fetch(`/api/students/${user.uid}/profile-sync`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profilePayload),
      });
    } catch (e) {
      console.warn('Backend profile sync error:', e);
    }

    await fetchProfile(user.uid);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        userProfile,
        loading,
        loginWithGoogle,
        loginWithEmail,
        signupWithEmail,
        resetPassword,
        verifyResetCode,
        confirmPasswordResetWithCode,
        logout,
        refreshUserProfile,
        saveOnboardingProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

