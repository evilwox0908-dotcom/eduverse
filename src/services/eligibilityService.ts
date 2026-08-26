import { Competition, UserProfile, EligibilityResult, EligibilityCheckItem } from '../types';

/**
 * Checks eligibility of a student profile for a given competition.
 * Provides granular criteria validation with human-readable diagnostic messages.
 */
export function evaluateStudentEligibility(
  competition: Competition | null | undefined,
  userProfile: UserProfile | null | undefined
): EligibilityResult {
  if (!competition) {
    return {
      isEligible: false,
      reason: 'Competition details could not be loaded.',
      checks: [],
    };
  }

  if (!userProfile) {
    return {
      isEligible: false,
      reason: 'Authentication and student profile are required to verify eligibility.',
      checks: [
        {
          id: 'auth',
          title: 'Account Verification',
          passed: false,
          details: 'Please log in to verify your academic eligibility.',
        },
      ],
    };
  }

  const checks: EligibilityCheckItem[] = [];

  // 1. Profile Completion Check
  const isProfileComplete = Boolean(userProfile.profileCompleted);
  checks.push({
    id: 'profile',
    title: 'Student Profile Setup',
    passed: isProfileComplete,
    details: isProfileComplete
      ? 'Academic profile is fully registered and verified.'
      : 'Complete your student onboarding to participate in verified competitions.',
  });

  // 2. Role Check (Students primarily)
  const isStudent = userProfile.role === 'student';
  checks.push({
    id: 'role',
    title: 'Academic Standing',
    passed: isStudent,
    details: isStudent
      ? 'Verified registered scholar account.'
      : `Account role is '${userProfile.role}'. Only active students can enter Olympiad divisions.`,
  });

  // 3. Country / Region Scope Check
  let countryPassed = true;
  let countryDetails = 'Global eligibility: Open to scholars worldwide.';

  if (
    competition.eligibleCountries &&
    competition.eligibleCountries.length > 0 &&
    !competition.eligibleCountries.includes('GLOBAL') &&
    !competition.eligibleCountries.includes('ALL')
  ) {
    const userCountryCode = (userProfile.countryCode || '').toUpperCase();
    const isEligibleCountry = competition.eligibleCountries.some(
      (c) => c.toUpperCase() === userCountryCode
    );

    if (!isEligibleCountry) {
      countryPassed = false;
      countryDetails = `This arena is restricted to [${competition.eligibleCountries.join(', ')}]. Your registered nation is ${userProfile.country} (${userProfile.countryCode}).`;
    } else {
      countryDetails = `Your registered nation (${userProfile.country}) is authorized for this division.`;
    }
  } else if (competition.countryEligibility && competition.countryEligibility.toLowerCase() !== 'global') {
    const isGlobal = competition.countryEligibility.toLowerCase().includes('global');
    if (!isGlobal) {
      const match =
        competition.countryEligibility.toLowerCase().includes((userProfile.country || '').toLowerCase()) ||
        competition.countryEligibility.toUpperCase().includes((userProfile.countryCode || '').toUpperCase());
      if (!match) {
        countryPassed = false;
        countryDetails = `Eligible region is restricted to ${competition.countryEligibility}.`;
      } else {
        countryDetails = `Eligible for regional division ${competition.countryEligibility}.`;
      }
    }
  }

  checks.push({
    id: 'country',
    title: 'Geographic Division',
    passed: countryPassed,
    details: countryDetails,
  });

  // 4. Grade / Academic Level Check
  let gradePassed = true;
  let gradeDetails = 'Open to all academic grades.';

  if (competition.eligibleGrades && competition.eligibleGrades.length > 0) {
    const userGrade = (userProfile.grade || '').trim();
    const isEligibleGrade = competition.eligibleGrades.some((g) =>
      g.toLowerCase().includes(userGrade.toLowerCase()) || userGrade.toLowerCase().includes(g.toLowerCase())
    );

    if (!isEligibleGrade) {
      gradePassed = false;
      gradeDetails = `Designated for [${competition.eligibleGrades.join(', ')}]. Your profile grade is '${userProfile.grade}'.`;
    } else {
      gradeDetails = `Your grade (${userProfile.grade}) is authorized for this division.`;
    }
  } else if (competition.grade && competition.grade !== 'All' && competition.grade !== 'Any') {
    const userGrade = (userProfile.grade || '').toLowerCase();
    const compGrade = (competition.grade || '').toLowerCase();
    if (!userGrade.includes(compGrade) && !compGrade.includes(userGrade)) {
      gradePassed = false;
      gradeDetails = `Division restricted to ${competition.grade}. Your profile is ${userProfile.grade}.`;
    } else {
      gradeDetails = `Academic level matched for ${competition.grade}.`;
    }
  }

  checks.push({
    id: 'grade',
    title: 'Grade / Academic Level',
    passed: gradePassed,
    details: gradeDetails,
  });

  // 5. Registration Window & Competition Status Check
  let windowPassed = true;
  let windowDetails = 'Registration is currently active.';

  const compStatus = (competition.status || '').toUpperCase();
  if (compStatus === 'REGISTRATION_CLOSED') {
    windowPassed = false;
    windowDetails = 'Official registration has closed for this event.';
  } else if (compStatus === 'FINISHED' || compStatus === 'CANCELLED') {
    windowPassed = false;
    windowDetails = `This competition is ${compStatus.toLowerCase()}.`;
  } else {
    const now = Date.now();
    if (competition.registrationStart) {
      const regStart = new Date(competition.registrationStart).getTime();
      if (!isNaN(regStart) && now < regStart) {
        windowPassed = false;
        windowDetails = `Registration opens on ${new Date(competition.registrationStart).toLocaleDateString()}.`;
      }
    }
    if (competition.registrationEnd) {
      const regEnd = new Date(competition.registrationEnd).getTime();
      if (!isNaN(regEnd) && now > regEnd) {
        windowPassed = false;
        windowDetails = `Registration closed on ${new Date(competition.registrationEnd).toLocaleDateString()}.`;
      }
    }
  }

  checks.push({
    id: 'window',
    title: 'Registration Window',
    passed: windowPassed,
    details: windowDetails,
  });

  // 6. Participant Capacity Limit
  let capacityPassed = true;
  let capacityDetails = 'Seats are available.';

  if (
    competition.participantLimit &&
    competition.participantLimit > 0 &&
    typeof competition.registeredCount === 'number'
  ) {
    if (competition.registeredCount >= competition.participantLimit) {
      capacityPassed = false;
      capacityDetails = `Capacity reached (${competition.registeredCount}/${competition.participantLimit} scholars registered).`;
    } else {
      capacityDetails = `${competition.participantLimit - competition.registeredCount} registration spots remaining.`;
    }
  }

  checks.push({
    id: 'capacity',
    title: 'Arena Capacity',
    passed: capacityPassed,
    details: capacityDetails,
  });

  const isEligible = checks.every((c) => c.passed);
  const failedCheck = checks.find((c) => !c.passed);

  return {
    isEligible,
    reason: isEligible
      ? 'All academic and division eligibility criteria verified.'
      : failedCheck?.details || 'Eligibility criteria requirements not satisfied.',
    checks,
  };
}
