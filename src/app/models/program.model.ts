// Fields shown on the program card (list view)
export interface Program {
    id: number;
    programName: string;
    schoolName: string;
    logoUrl: string;
    country: string;
    tuition: number;
    tuitionPeriod: string;
    category: string;
    type: 'School' | 'Program';
    rating: number;
}