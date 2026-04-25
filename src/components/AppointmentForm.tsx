import { useState, FormEvent } from 'react';
import { Calendar, User, Phone, CheckCircle2 } from 'lucide-react';
import { cn } from '../lib/utils';
import { Button } from './Button';
import { CONTACT_INFO } from '../constants';
import { useContent } from '../context/ContentContext';
import { ExternalLink } from 'lucide-react';

interface AppointmentFormProps {
  layout?: 'horizontal' | 'vertical';
}

export function AppointmentForm({ layout = 'vertical' }: AppointmentFormProps) {
  const { content } = useContent();
  const { calendlyLink } = content.contactInfo;
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    date: '',
    time: '',
    service: ''
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    // Construct email body
    const subject = `New Appointment Request from ${formData.name}`;
    const body = `
Name: ${formData.name}
Phone: ${formData.phone}
Email: ${formData.email}
Service: ${formData.service}
Preferred Date: ${formData.date}
Preferred Time: ${formData.time}
    `.trim();

    // Open mailto link
    const mailtoUrl = `mailto:${content.contactInfo.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoUrl;

    // Show success state
    setIsSubmitted(true);
    setFormData({ name: '', phone: '', email: '', date: '', time: '', service: '' });
    
    // Reset success state after a few seconds
    setTimeout(() => setIsSubmitted(false), 5000);
  };

  if (isSubmitted) {
    return (
      <div className="bg-green-50 border border-green-100 p-8 rounded-3xl text-center space-y-4">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto text-green-600">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-bold text-green-900">Request Sent!</h3>
          <p className="text-green-700">
            Thank you for reaching out. We've opened your email client to send the details to <strong>{CONTACT_INFO.email}</strong>. 
            We will contact you shortly to confirm.
          </p>
        </div>
      </div>
    );
  }


  if (layout === 'horizontal') {
    return (
      <form onSubmit={handleSubmit} className="bg-white p-6 md:p-8 rounded-3xl shadow-xl flex flex-col lg:flex-row gap-4 items-end">
        <div className="w-full lg:flex-1 space-y-2">
          <label className="text-xs font-bold uppercase tracking-widest text-gray-400 px-1">Full Name</label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input 
              required
              type="text" 
              placeholder="Your Name"
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-brand-primary"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </div>
        </div>
        <div className="w-full lg:flex-1 space-y-2">
           <label className="text-xs font-bold uppercase tracking-widest text-gray-400 px-1">Phone Number</label>
           <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input 
              required
              type="tel" 
              placeholder="Phone number"
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-brand-primary"
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
            />
          </div>
        </div>
        <div className="w-full lg:flex-1 space-y-2">
           <label className="text-xs font-bold uppercase tracking-widest text-gray-400 px-1">Preferred Date</label>
           <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input 
              required
              type="date"
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-brand-primary"
              value={formData.date}
              onChange={(e) => setFormData({...formData, date: e.target.value})}
            />
          </div>
        </div>
        <div className="w-full lg:w-auto">
          <Button type="submit" className="w-full lg:w-auto whitespace-nowrap min-w-[160px]">
            Book Now
          </Button>
        </div>
      </form>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700">Full Name</label>
          <input 
            required
            type="text" 
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition-all"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700">Phone Number</label>
          <input 
            required
            type="tel" 
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition-all"
            value={formData.phone}
            onChange={(e) => setFormData({...formData, phone: e.target.value})}
          />
        </div>
      </div>
      <div className="space-y-2">
        <label className="text-sm font-semibold text-gray-700">Email Address</label>
        <input 
          required
          type="email" 
          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition-all"
          value={formData.email}
          onChange={(e) => setFormData({...formData, email: e.target.value})}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700">Select Date</label>
          <input 
            required
            type="date" 
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition-all"
            value={formData.date}
            onChange={(e) => setFormData({...formData, date: e.target.value})}
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700">Select Time</label>
          <input 
            required
            type="time" 
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition-all"
            value={formData.time}
            onChange={(e) => setFormData({...formData, time: e.target.value})}
          />
        </div>
      </div>
      <div className="space-y-2">
        <label className="text-sm font-semibold text-gray-700">Service Needed</label>
        <select 
          required
          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition-all"
          value={formData.service}
          onChange={(e) => setFormData({...formData, service: e.target.value})}
        >
          <option value="">Choose a service</option>
          <option value="cleaning">Dental Cleaning</option>
          <option value="invisalign">Invisalign</option>
          <option value="cosmetic">Cosmetic Dentistry</option>
          <option value="implants">Dental Implants</option>
          <option value="exam">Oral Exam</option>
        </select>
      </div>
      <Button type="submit" className="w-full">
        Schedule Appointment
      </Button>
    </form>
  );
}
