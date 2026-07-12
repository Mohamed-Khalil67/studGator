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
    duration: string;
    language: string;
    type: 'School' | 'Program';
    rating: number;
}