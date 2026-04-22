/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { About } from './pages/About';
import { Services } from './pages/Services';
import { Gallery } from './pages/Gallery';
import { Contact } from './pages/Contact';
import { PrivacyPolicy } from './pages/PrivacyPolicy';
import { AdminLogin } from './pages/AdminLogin';
import { AdminLayout } from './components/AdminLayout';
import { AdminDashboard } from './pages/AdminDashboard';
import { AdminSettings } from './pages/AdminSettings';
import { ScrollToTop } from './components/ScrollToTop';
import { ContentProvider } from './context/ContentContext';

export default function App() {
  return (
    <ContentProvider>
      <Router basename="/orlando-dental-2">
        <ScrollToTop />
        <div className="flex flex-col min-h-screen">
          <Routes>
            {/* Private Admin Routes */}
            <Route path="/admin" element={<AdminLayout children={<AdminDashboard />} />} />
            <Route path="/admin/settings" element={<AdminLayout children={<AdminSettings />} />} />
            <Route path="/admin/pages" element={<AdminLayout children={<div className="p-12 text-center text-gray-400 font-bold bg-white rounded-[40px] border border-dashed border-gray-200">Page Management Module Coming Soon</div>} />} />
            <Route path="/admin/media" element={<AdminLayout children={<div className="p-12 text-center text-gray-400 font-bold bg-white rounded-[40px] border border-dashed border-gray-200">Media Library Module Coming Soon</div>} />} />
            
            {/* Public Routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/*" element={
              <>
                <Navbar />
                <main className="flex-grow">
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/services" element={<Services />} />
                    <Route path="/gallery" element={<Gallery />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                  </Routes>
                </main>
                <Footer />
              </>
            } />
          </Routes>
          
          <a 
            href="tel:407-737-9444" 
            className="fixed bottom-6 right-6 z-50 md:hidden bg-brand-primary text-white p-4 rounded-full shadow-2xl flex items-center justify-center animate-bounce border-2 border-white"
          >
          <span className="sr-only">Call Now</span>
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M20 15.5c-1.2 0-2.4-.2-3.6-.6-.3-.1-.7 0-1 .2l-2.2 2.2c-2.8-1.4-5.1-3.8-6.6-6.6l2.2-2.2c.3-.3.4-.7.2-1-.3-1.1-.5-2.3-.5-3.5 0-.6-.4-1-1-1H4c-.6 0-1 .4-1 1 0 9.4 7.6 17 17 17 .6 0 1-.4 1-1v-3.5c0-.6-.4-1-1-1zM12 9V2L11 3M15 9V2l1 1M18 9V2l1 1" />
          </svg>
        </a>
      </div>
    </Router>
    </ContentProvider>
  );
}
