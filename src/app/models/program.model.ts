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
}
/*
export interface ProgramDetail extends Program {
    heroImageUrl: string;
    topSchool: boolean;
    language: string;
    durationYears: string;
    aboutText: string;
    requirements: string[];
    campuses: string[];
    mapsLink: string;
    intakeSeasons: string[];
    intakeNote: string;
    accreditations: string[];
    entryLevels: string[];
    degreeLevel: string;
} */