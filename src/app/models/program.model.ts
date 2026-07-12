export interface Program {
    id: number;
    programName: string;
    schoolName: string;
    logoUrl: string;
    country: string;
    city: string;
    tuition: number;
    tuitionPeriod: string;
    category: string;
    currentLevel: string;
    intake: string;
    durationYears: number;
    language: string;
    type: 'School' | 'Program';
    rating: number;
}