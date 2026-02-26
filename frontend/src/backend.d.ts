import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Test {
    id: bigint;
    title: string;
    category: string;
    questions: Array<Question>;
}
export interface Ranker {
    studentName: string;
    rank: bigint;
    score: bigint;
    examCategory: string;
}
export interface Question {
    question: string;
    answer: string;
    options: Array<string>;
}
export interface ContactSubmission {
    name: string;
    email: string;
    message: string;
    timestamp: bigint;
}
export interface backendInterface {
    addRanker(token: string, studentName: string, examCategory: string, score: bigint): Promise<void>;
    addTest(token: string, title: string, category: string, questions: Array<Question>): Promise<void>;
    deleteRanker(token: string, rank: bigint): Promise<void>;
    deleteTest(token: string, id: bigint): Promise<void>;
    generateQuestions(topic: string, difficulty: string): Promise<Array<Question>>;
    getContactSubmissions(token: string): Promise<Array<ContactSubmission>>;
    getContactSubmissionsUser(): Promise<Array<ContactSubmission>>;
    getTestById(id: bigint): Promise<Test>;
    getTests(): Promise<Array<Test>>;
    getTopRankers(): Promise<Array<Ranker>>;
    login(username: string, password: string): Promise<string>;
    logout(token: string): Promise<void>;
    submitContact(name: string, email: string, message: string): Promise<void>;
    updateTest(token: string, id: bigint, title: string, category: string, questions: Array<Question>): Promise<void>;
    validateSession(token: string): Promise<boolean>;
}
