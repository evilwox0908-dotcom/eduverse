import { AcademicGrade } from '../types';

export interface GradeDefinition {
  id: AcademicGrade;
  numeric: number;
  label: string;
  shortLabel: string;
  category: 'Middle School' | 'High School';
  typicalAge: string;
  ukEquivalent: string;
  ibEquivalent: string;
  uzbekEquivalent: string;
  recommendedTimeModifier: number; // e.g. 1.0 standard
}

export const ACADEMIC_GRADES: GradeDefinition[] = [
  {
    id: 'Grade 5',
    numeric: 5,
    label: 'Grade 5 (Primary / Early Middle)',
    shortLabel: 'G5',
    category: 'Middle School',
    typicalAge: '10–11 years',
    ukEquivalent: 'Year 6 (Key Stage 2/3)',
    ibEquivalent: 'PYP 5 / MYP 1',
    uzbekEquivalent: '5-sinf',
    recommendedTimeModifier: 1.2,
  },
  {
    id: 'Grade 6',
    numeric: 6,
    label: 'Grade 6 (Middle School)',
    shortLabel: 'G6',
    category: 'Middle School',
    typicalAge: '11–12 years',
    ukEquivalent: 'Year 7 (Key Stage 3)',
    ibEquivalent: 'MYP 1',
    uzbekEquivalent: '6-sinf',
    recommendedTimeModifier: 1.15,
  },
  {
    id: 'Grade 7',
    numeric: 7,
    label: 'Grade 7 (Middle School)',
    shortLabel: 'G7',
    category: 'Middle School',
    typicalAge: '12–13 years',
    ukEquivalent: 'Year 8 (Key Stage 3)',
    ibEquivalent: 'MYP 2',
    uzbekEquivalent: '7-sinf',
    recommendedTimeModifier: 1.1,
  },
  {
    id: 'Grade 8',
    numeric: 8,
    label: 'Grade 8 (Junior Secondary / Middle)',
    shortLabel: 'G8',
    category: 'Middle School',
    typicalAge: '13–14 years',
    ukEquivalent: 'Year 9 (Key Stage 3)',
    ibEquivalent: 'MYP 3',
    uzbekEquivalent: '8-sinf',
    recommendedTimeModifier: 1.05,
  },
  {
    id: 'Grade 9',
    numeric: 9,
    label: 'Grade 9 (Freshman / Secondary)',
    shortLabel: 'G9',
    category: 'High School',
    typicalAge: '14–15 years',
    ukEquivalent: 'Year 10 (GCSE / IGCSE)',
    ibEquivalent: 'MYP 4',
    uzbekEquivalent: '9-sinf',
    recommendedTimeModifier: 1.0,
  },
  {
    id: 'Grade 10',
    numeric: 10,
    label: 'Grade 10 (Sophomore / Secondary)',
    shortLabel: 'G10',
    category: 'High School',
    typicalAge: '15–16 years',
    ukEquivalent: 'Year 11 (GCSE / IGCSE)',
    ibEquivalent: 'MYP 5',
    uzbekEquivalent: '10-sinf',
    recommendedTimeModifier: 1.0,
  },
  {
    id: 'Grade 11',
    numeric: 11,
    label: 'Grade 11 (Junior / Upper Secondary)',
    shortLabel: 'G11',
    category: 'High School',
    typicalAge: '16–17 years',
    ukEquivalent: 'Year 12 (AS-Level / Sixth Form)',
    ibEquivalent: 'DP 1 (Diploma Programme Year 1)',
    uzbekEquivalent: '11-sinf / 1-kurs litsey',
    recommendedTimeModifier: 1.0,
  },
  {
    id: 'Grade 12',
    numeric: 12,
    label: 'Grade 12 (Senior / Upper Secondary)',
    shortLabel: 'G12',
    category: 'High School',
    typicalAge: '17–18+ years',
    ukEquivalent: 'Year 13 (A-Level / Sixth Form)',
    ibEquivalent: 'DP 2 (Diploma Programme Year 2)',
    uzbekEquivalent: '2-kurs litsey / Bitiruvchi',
    recommendedTimeModifier: 1.0,
  },
];

export function getGradeDefinition(grade: string): GradeDefinition | undefined {
  const clean = grade.toLowerCase().replace(/[^a-z0-9]/g, '');
  return ACADEMIC_GRADES.find((g) => {
    const gClean = g.id.toLowerCase().replace(/[^a-z0-9]/g, '');
    return clean === gClean || clean === `grade${g.numeric}` || clean === `g${g.numeric}`;
  });
}

export function isGradeEligible(userGrade: string, allowedGrades?: string[]): boolean {
  if (!allowedGrades || allowedGrades.length === 0 || allowedGrades.includes('All') || allowedGrades.includes('ANY')) {
    return true;
  }
  const cleanUser = userGrade.toLowerCase().replace(/[^a-z0-9]/g, '');
  return allowedGrades.some((allowed) => {
    const cleanAllowed = allowed.toLowerCase().replace(/[^a-z0-9]/g, '');
    return cleanUser.includes(cleanAllowed) || cleanAllowed.includes(cleanUser);
  });
}
