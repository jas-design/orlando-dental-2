export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
  image: string;
  category?: string;
}

export interface BlogPost {
  id: string;
  date: string;
  category: string;
  author: string;
  title: string;
  description: string;
  image: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  content: string;
  rating: number;
  image: string;
}

export interface doctor {
  id: string;
  name: string;
  specialty: string;
  image: string;
  description: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}
