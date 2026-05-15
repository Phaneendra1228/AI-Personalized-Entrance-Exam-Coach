/**
 * TypeScript interfaces matching backend Pydantic schemas.
 */

export interface Domain {
  id: number;
  name: string;
  description: string | null;
  icon: string | null;
  created_at: string;
}

export interface Subject {
  id: number;
  name: string;
  description: string | null;
  domain_id: number;
  created_at: string;
}

export interface MockTest {
  id: number;
  name: string;
  description: string | null;
  subject_id: number;
  difficulty: 'easy' | 'medium' | 'hard';
  duration_minutes: number;
  question_count: number | null;
  created_at: string;
}

export interface Question {
  id: number;
  test_id: number;
  text: string;
  options: string[];
  topic: string;
  explanation: string | null;
  order_num: number;
  correct_answer: number | null;
}

export interface SubmitAttemptRequest {
  student_id: string;
  test_id: number;
  answers: Record<string, number>;
  time_taken_seconds?: number;
}

export interface AttemptResult {
  attempt_id: number;
  score: number;
  total: number;
  percentage: number;
  correct_questions: number[];
  incorrect_questions: number[];
  topic_breakdown: Record<string, { correct: number; total: number }>;
}

export interface TopicPerformance {
  topic: string;
  correct: number;
  total_attempted: number;
  accuracy: number;
  weakness_score: number;
}

export interface Analytics {
  student_id: string;
  total_tests_taken: number;
  overall_accuracy: number;
  topic_performance: TopicPerformance[];
  weakest_topics: string[];
  strongest_topics: string[];
  recent_attempts: {
    attempt_id: number;
    test_id: number;
    test_name: string;
    score: number;
    total: number;
    percentage: number;
    created_at: string;
  }[];
}

export interface StudySession {
  topic: string;
  duration_minutes: number;
  learning_objective: string;
  resources: { title: string; url: string; type: string }[];
  weakness_score: number;
}

export interface DayPlan {
  day: number;
  date: string;
  sessions: StudySession[];
  total_minutes: number;
}

export interface RevisionPlan {
  student_id: string;
  plan: DayPlan[];
  generated_at: string;
  total_topics_covered: number;
}

export interface ResourceItem {
  title: string;
  description: string;
  url: string | null;
  resource_type: string;
  score: number;
}

export interface ResourcesResponse {
  topic: string;
  resources: ResourceItem[];
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface ChatRequest {
  student_id: string;
  message: string;
  history: ChatMessage[];
}

export interface ChatResponse {
  response: string;
  student_id: string;
}
