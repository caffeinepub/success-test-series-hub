import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface CurrentAffairs {
    id: bigint;
    content: string;
    date: string;
}
export interface Ranker {
    studentName: string;
    rank: bigint;
    score: bigint;
    examCategory: string;
}
export type Time = bigint;
export interface Newspaper {
    id: bigint;
    date: string;
    link: string;
}
export interface Test {
    id: bigint;
    title: string;
    negativeMarkValue: number;
    category: ExamCategory;
    questions: Array<Question>;
    price: bigint;
}
export interface Slider {
    id: bigint;
    title?: string;
    imageUrl: string;
}
export interface Question {
    question: string;
    explanationHi?: string;
    explanation?: string;
    answer: string;
    optionsHi?: Array<string>;
    questionHi?: string;
    options: Array<string>;
}
export interface UserProfile {
    name: string;
    email?: string;
}
export interface Student {
    id: bigint;
    otp?: string;
    password: string;
    mobileNumber: string;
    profilePhotoBase64?: string;
    registeredAt: Time;
}
export enum ExamCategory {
    ssc = "ssc",
    railway = "railway",
    bpsc = "bpsc",
    upsc = "upsc",
    banking = "banking",
    stateExams = "stateExams"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addCurrentAffairs(token: string, date: string, content: string): Promise<void>;
    addNewspaper(token: string, date: string, link: string): Promise<void>;
    addRanker(token: string, studentName: string, examCategory: string, score: bigint): Promise<void>;
    addSlider(token: string, imageUrl: string, title: string | null): Promise<void>;
    addTest(token: string, title: string, questions: Array<Question>, price: bigint, negativeMarkValue: number, category: ExamCategory): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    deleteCurrentAffairs(token: string, id: bigint): Promise<void>;
    deleteNewspaper(token: string, id: bigint): Promise<void>;
    deleteRanker(token: string, rank: bigint): Promise<void>;
    deleteSlider(token: string, id: bigint): Promise<void>;
    deleteTest(token: string, id: bigint): Promise<void>;
    generateQuestions(token: string, topic: string, difficulty: string): Promise<Array<Question>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getCurrentAffairs(): Promise<Array<CurrentAffairs>>;
    getNewspapers(): Promise<Array<Newspaper>>;
    getSliders(): Promise<Array<Slider>>;
    getStudentProfile(token: string): Promise<Student | null>;
    getStudents(token: string): Promise<Array<Student>>;
    getTestById(id: bigint): Promise<Test>;
    getTests(): Promise<Array<Test>>;
    getTopRankers(): Promise<Array<Ranker>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    login(username: string, password: string): Promise<string>;
    logout(token: string): Promise<void>;
    registerStudent(mobileNumber: string, password: string): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    studentLogin(mobileNumber: string, password: string): Promise<string>;
    studentLogout(token: string): Promise<void>;
    submitContact(name: string, email: string, message: string): Promise<void>;
    updateStudentProfilePhoto(token: string, photoBase64: string): Promise<void>;
    updateTest(token: string, id: bigint, title: string, questions: Array<Question>, price: bigint, negativeMarkValue: number, category: ExamCategory): Promise<void>;
    validateSession(token: string): Promise<boolean>;
}
