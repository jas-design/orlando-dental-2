import React, { useState, useEffect } from 'react';
import { useContent } from '../context/ContentContext';
import { 
  Calendar, 
  ExternalLink, 
  Settings as SettingsIcon, 
  Clock, 
  User, 
  Mail, 
  CheckCircle2, 
  AlertCircle,
  Loader2,
  RefreshCw
} from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';
import { useNotification } from '../context/NotificationContext';

interface CalendlyEvent {
  uri: string;
  name: string;
  status: string;
  start_time: string;
  end_time: string;
  event_guests: any[];
  event_memberships: any[];
  invitees_counter: {
    total: number;
    active: number;
    limit: number;
  };
  created_at: string;
  updated_at: string;
}

interface Invitee {
  email: string;
  name: string;
  status: string;
  questions_and_answers: any[];
}

export function AdminAppointments() {
  const { content } = useContent();
  const { calendlyToken, calendlyLink } = content.contactInfo;
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { showNotification } = useNotification();

  const fetchAppointments = async () => {
    if (!calendlyToken) return;

    setLoading(true);
    setError(null);
    try {
      // 1. Get current user URI
      const userRes = await fetch('https://api.calendly.com/users/me', {
        headers: {
          'Authorization': `Bearer ${calendlyToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (!userRes.ok) throw new Error('Failed to authenticate with Calendly. Check your token.');
      
      const userData = await userRes.json();
      const userUri = userData.resource.uri;

      // 2. Fetch scheduled events
      const eventsRes = await fetch(`https://api.calendly.com/scheduled_events?user=${userUri}&status=active&sort=start_time:desc`, {
        headers: {
          'Authorization': `Bearer ${calendlyToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (!eventsRes.ok) throw new Error('Failed to fetch events from Calendly.');
      
      const eventsData = await eventsRes.json();
      
      // 3. For each event, we might want to fetch invitee details (optional but better)
      // For now, we'll just show the events. 
      // Note: Calendly API limits might apply if we fetch too many invitees.
      
      const enrichedEvents = await Promise.all(eventsData.collection.map(async (event: CalendlyEvent) => {
          const inviteeRes = await fetch(`${event.uri}/invitees`, {
              headers: {
                  'Authorization': `Bearer ${calendlyToken}`,
                  'Content-Type': 'application/json'
              }
          });
          const inviteeData = await inviteeRes.json();
          return {
              ...event,
              invitee: inviteeData.collection[0] || null
          };
      }));

      setAppointments(enrichedEvents);
    } catch (err: any) {
      console.error(err);
      setError(err.message);
      showNotification(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (calendlyToken) {
      fetchAppointments();
    }
  }, [calendlyToken]);

  if (!calendlyToken) {
    return (
      <div className="max-w-4xl mx-auto space-y-12">
        <div className="text-center space-y-4">
           <div className="w-20 h-20 bg-brand-primary/10 text-brand-primary rounded-3xl flex items-center justify-center mx-auto">
              <Calendar className="w-10 h-10" />
           </div>
           <h1 className="text-4xl font-display font-bold text-brand-dark">Calendly Integration</h1>
           <p className="text-gray-500 max-w-lg mx-auto">
              Connect your Calendly account to see scheduled appointments directly in your admin panel.
           </p>
        </div>

        <div className="bg-white rounded-[40px] border border-gray-100 p-12 shadow-sm space-y-8 text-center">
           <div className="space-y-2">
              <h3 className="text-xl font-bold text-brand-dark">Setup Instructions</h3>
              <p className="text-sm text-gray-400">Follow these steps to get your Personal Access Token:</p>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
              {[
                { step: '1', title: 'Go to Calendly', desc: 'Login to your Calendly dashboard and go to "Integrations".' },
                { step: '2', title: 'API & Webhooks', desc: 'Select "API & Webhooks" and generate a Personal Access Token.' },
                { step: '3', title: 'Paste Token', desc: 'Go to "Global Changes" and paste your token in the Calendly section.' }
              ].map((item) => (
                <div key={item.step} className="p-6 bg-gray-50 rounded-3xl space-y-3">
                   <span className="w-8 h-8 bg-brand-primary text-white rounded-lg flex items-center justify-center font-black text-xs">{item.step}</span>
                   <h4 className="font-bold text-brand-dark">{item.title}</h4>
                   <p className="text-xs text-gray-500 leading-relaxed">{item.desc}</p>
                </div>
              ))}
           </div>

           <a 
             href="/admin/global" 
             className="inline-flex items-center gap-2 px-8 py-4 bg-brand-primary text-white rounded-2xl font-bold text-sm tracking-widest uppercase shadow-xl shadow-brand-primary/20 hover:bg-brand-dark transition-all"
           >
             <SettingsIcon className="w-4 h-4" />
             Go to Settings
           </a>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row justify-between md:items-end gap-6">
        <div>
           <p className="text-brand-primary font-black uppercase tracking-[0.3em] mb-2 text-xs">Appointments</p>
           <h1 className="text-4xl font-display font-bold text-brand-dark">Scheduled Visits</h1>
        </div>
        <div className="flex gap-4">
           <button 
             onClick={fetchAppointments}
             disabled={loading}
             className="px-6 py-3 bg-white text-brand-dark border border-gray-100 rounded-2xl font-bold text-sm tracking-widest uppercase hover:bg-gray-50 transition-all flex items-center gap-2 disabled:opacity-50"
           >
              {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4 text-brand-primary" />}
              Refresh
           </button>
           {calendlyLink && (
             <a 
               href={calendlyLink}
               target="_blank"
               rel="noopener noreferrer"
               className="px-6 py-3 bg-brand-primary text-white rounded-2xl font-bold text-sm tracking-widest uppercase shadow-xl shadow-brand-primary/20 hover:bg-brand-dark transition-all flex items-center gap-2"
             >
                Open Calendly <ExternalLink className="w-4 h-4" />
             </a>
           )}
        </div>
      </div>

      {loading && appointments.length === 0 ? (
        <div className="bg-white rounded-[40px] border border-gray-100 p-24 flex flex-col items-center justify-center space-y-4">
           <Loader2 className="w-10 h-10 text-brand-primary animate-spin" />
           <p className="text-gray-400 font-bold tracking-widest uppercase text-xs">Fetching Appointments...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-100 p-12 rounded-[40px] text-center space-y-4">
           <AlertCircle className="w-12 h-12 text-red-400 mx-auto" />
           <div className="space-y-2">
              <h3 className="text-xl font-bold text-red-900">Connection Error</h3>
              <p className="text-red-700">{error}</p>
           </div>
           <button 
             onClick={fetchAppointments}
             className="px-6 py-2 bg-red-100 text-red-700 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-red-200 transition-all"
           >
             Try Again
           </button>
        </div>
      ) : appointments.length === 0 ? (
        <div className="bg-white rounded-[40px] border border-gray-100 p-24 text-center space-y-6">
           <div className="w-20 h-20 bg-gray-50 text-gray-300 rounded-3xl flex items-center justify-center mx-auto">
              <Calendar className="w-10 h-10" />
           </div>
           <div className="space-y-2">
              <h3 className="text-2xl font-display font-bold text-brand-dark">No Appointments Found</h3>
              <p className="text-gray-400">You don't have any active appointments scheduled yet.</p>
           </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
           {appointments.map((appt, i) => (
             <motion.div 
               key={appt.uri}
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: i * 0.05 }}
               className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm hover:shadow-md transition-all group flex flex-col lg:flex-row lg:items-center gap-8"
             >
                <div className="flex-1 space-y-4">
                   <div className="flex items-center gap-3">
                      <span className={cn(
                        "px-3 py-1 rounded-lg text-[10px] font-black tracking-widest uppercase",
                        appt.status === 'active' ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-400"
                      )}>
                        {appt.status}
                      </span>
                      <h3 className="text-xl font-bold text-brand-dark">{appt.name}</h3>
                   </div>
                   
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center gap-3 text-gray-500">
                         <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-brand-primary">
                            <Clock className="w-4 h-4" />
                         </div>
                         <div className="text-sm">
                            <p className="font-bold text-brand-dark">
                               {new Date(appt.start_time).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                            </p>
                            <p className="text-xs uppercase font-black tracking-widest text-gray-400">
                               {new Date(appt.start_time).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })} - {new Date(appt.end_time).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                            </p>
                         </div>
                      </div>

                      {appt.invitee && (
                        <div className="flex items-center gap-3 text-gray-500">
                           <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-brand-primary">
                              <User className="w-4 h-4" />
                           </div>
                           <div className="text-sm">
                              <p className="font-bold text-brand-dark">{appt.invitee.name}</p>
                              <p className="text-xs font-medium text-gray-400 flex items-center gap-1">
                                 <Mail className="w-3 h-3" /> {appt.invitee.email}
                              </p>
                           </div>
                        </div>
                      )}
                   </div>
                </div>

                <div className="flex items-center gap-3 lg:border-l lg:pl-8 border-gray-50">
                   <div className="w-12 h-12 rounded-2xl bg-brand-primary/10 text-brand-primary flex items-center justify-center">
                      <CheckCircle2 className="w-6 h-6" />
                   </div>
                   <div>
                      <p className="text-[10px] uppercase font-black tracking-widest text-gray-400">Scheduled on</p>
                      <p className="text-sm font-bold text-brand-dark">
                         {new Date(appt.created_at).toLocaleDateString()}
                      </p>
                   </div>
                </div>
             </motion.div>
           ))}
        </div>
      )}

      <div className="bg-brand-dark text-white p-12 rounded-[40px] relative overflow-hidden">
         <div className="relative z-10 space-y-6">
            <h3 className="text-2xl font-display font-bold">Manage Events</h3>
            <p className="text-white/60 max-w-xl">
               To change availability, event types, or manual cancellations, please visit your Calendly Dashboard.
            </p>
            <a 
              href="https://calendly.com/dashboard/event_types" 
              target="_blank" 
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-brand-dark rounded-2xl font-bold text-sm tracking-widest uppercase hover:bg-brand-primary hover:text-white transition-all"
            >
               Go to Calendly Dashboard <ExternalLink className="w-4 h-4" />
            </a>
         </div>
         <div className="absolute top-0 right-0 w-96 h-96 bg-brand-primary/10 rounded-full blur-3xl -mr-48 -mt-48"></div>
      </div>
    </div>
  );
}
