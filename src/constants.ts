import { Service, Testimonial, doctor, FAQItem } from './types';

export const SERVICES: Service[] = [
  {
    id: 'scaling',
    title: 'Scaling and Root Planing',
    description: 'Deep Clean, Healthy Gums: Scaling and Root Planing at...',
    icon: 'Sparkles',
    image: 'https://images.unsplash.com/photo-1606811971618-4486d14f3f99?auto=format&fit=crop&q=80&w=800',
    category: 'Root Canal'
  },
  {
    id: 'whitening',
    title: 'Teeth Whitening',
    description: 'Brighten Your Smile Instantly with Professional Teeth Whitening A...',
    icon: 'Stethoscope',
    image: 'https://images.unsplash.com/photo-1516062423079-7ca13cdc7f52?auto=format&fit=crop&q=80&w=800',
    category: 'Root Canal'
  },
  {
    id: 'invisalign',
    title: 'Invisalign & ClearCorrect',
    description: 'Invisalign & ClearCorrect: The Clear Choice for a Perfect...',
    icon: 'Smile',
    image: 'https://images.unsplash.com/photo-1598256989800-fe5f95da9787?auto=format&fit=crop&q=80&w=800',
    category: 'Specialized Care'
  },
  {
    id: 'crowns',
    title: 'Zirconium Crowns',
    description: 'Durable & Natural-Looking Zirconium Crowns for Lasting Dental Restoration.',
    icon: 'ShieldCheck',
    image: 'https://images.unsplash.com/photo-1609840114035-3c981b782dfe?auto=format&fit=crop&q=80&w=800',
    category: 'Specialized Care'
  },
  {
    id: 'dentures',
    title: 'Partials & Dentures',
    description: 'Comfortable & Affordable Partials & Denture. Losing one or...',
    icon: 'Activity',
    image: 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&q=80&w=800',
    category: 'Preventive Dentistry'
  },
  {
    id: 'extraction',
    title: 'Wisdom Tooth Extraction',
    description: 'Safe & Gentle Wisdom Tooth Extraction at HappySmile At...',
    icon: 'Stethoscope',
    image: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&q=80&w=800',
    category: 'Preventive Dentistry'
  },
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: '1',
    name: 'Kristen Stewart',
    role: 'Cosmetic Dentist',
    content: "Finding a pediatric dentist who can make kids feel comfortable is rare, and Dr. Jenna Park is that rare gem. My son had his first visit with her last year...",
    rating: 5,
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200',
  },
];

export const TEAM: doctor[] = [
  {
    id: '1',
    name: 'Dr. A. Viviana Santos',
    specialty: 'Lead Medical Director',
    description: 'Expert in comprehensive dental care and smile transformations with over 25 years of experience.',
    image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=600',
  },
  {
    id: '2',
    name: 'Mary Vels',
    specialty: 'Medical & Dentist',
    description: 'Working Experience At HappySmile - Medical & Dentist, our team...',
    image: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&q=80&w=600',
  },
  {
    id: '3',
    name: 'Nico Robin',
    specialty: 'Medical & Dentist',
    description: 'Working Experience At HappySmile - Medical & Dentist, our team...',
    image: 'https://images.unsplash.com/photo-1559839734-2b71f1536783?auto=format&fit=crop&q=80&w=600',
  },
];

export const BLOG_POSTS = [
  {
    id: '1',
    date: 'March 23, 2024',
    category: 'Oral Health Tips',
    author: 'Admin',
    title: 'How to Maintain a Beautiful Holiday Smile',
    description: 'There are many variations of passages of lorem ipsum available...',
    image: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: '2',
    date: 'July 23, 2024',
    category: 'General Dentistry',
    author: 'Admin',
    title: 'Root Canal Treatment for Children: What Parents to Know',
    description: 'There are many variations of passages of lorem ipsum available...',
    image: 'https://images.unsplash.com/photo-1593059080506-3458322287bd?auto=format&fit=crop&q=80&w=800'
  }
];

export const FAQS: FAQItem[] = [
  {
    question: 'How often should I visit the dentist?',
    answer: 'Generally, it is recommended to visit the dentist every 6 months for a routine check-up and professional cleaning.',
  },
  {
    question: 'What should I do in a dental emergency?',
    answer: 'If you experience severe pain, loose teeth, or a knocked-out tooth, contact us immediately. We offer priority same-day emergency appointments.',
  },
  {
    question: 'Do you offer services for kids?',
    answer: 'Yes! We are a family-friendly practice and provide comprehensive dental care for patients of all ages, including pediatric dentistry.',
  },
  {
    question: 'What are my options for replacing missing teeth?',
    answer: 'We offer several durable solutions including dental implants, bridges, and partial dentures tailored to your specific needs.',
  },
  {
    question: 'Is teeth whitening safe?',
    answer: 'Yes, professional teeth whitening is a safe and effective way to brighten your smile when performed under dentist supervision.',
  },
];

export const CONTACT_INFO = {
  address: '5211 Curry Ford Rd. Suite 1, Orlando, FL 32812',
  phone: '407-737-9444',
  whatsapp: '',
  email: 'orlandodentalcare@gmail.com',
  logoUrl: '',
  calendlyLink: '',
  calendlyToken: '',
  hours: [
    { day: 'Mon - Fri', time: '9:00 AM - 6:00 PM' },
    { day: 'Saturday', time: '9:00 AM - 2:00 PM' },
    { day: 'Sunday', time: 'Closed' },
  ],
  socialLinks: {
    facebook: 'https://facebook.com',
    instagram: 'https://instagram.com',
    twitter: 'https://twitter.com',
    linkedin: 'https://linkedin.com',
    youtube: 'https://youtube.com',
  },
};

export const BRANDING = {
  primaryColor: '#27A2A8',
  secondaryColor: '#DEB80F',
};

