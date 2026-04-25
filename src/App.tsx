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
import { AdminGlobal } from './pages/AdminGlobal';
import { AdminSettings } from './pages/AdminSettings';
import { ScrollToTop } from './components/ScrollToTop';
import { ContentProvider } from './context/ContentContext';
import { NotificationProvider } from './context/NotificationContext';

import { AdminPages } from './pages/AdminPages';
import { AdminPageEditor } from './pages/AdminPageEditor';
import { AdminBlog } from './pages/AdminBlog';
import { AdminGallery } from './pages/AdminGallery';
import { AdminServices } from './pages/AdminServices';
import { AdminTeam } from './pages/AdminTeam';
import { WhatsAppButton } from './components/WhatsAppButton';

import { DynamicPage } from './pages/DynamicPage';
import { useContent } from './context/ContentContext';
import { Loader2 } from 'lucide-react';

export default function App() {
  return (
    <NotificationProvider>
      <ContentProvider>
        <AppContent />
      </ContentProvider>
    </NotificationProvider>
  );
}

function AppContent() {
  const { loading } = useContent();

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-brand-primary animate-spin" />
      </div>
    );
  }

  return (
    <Router basename="/orlando-dental-2">
      <ScrollToTop />
      <div className="flex flex-col min-h-screen">
        <Routes>
          {/* Private Admin Routes */}
          <Route path="/admin" element={<AdminLayout children={<AdminDashboard />} />} />
          <Route path="/admin/global" element={<AdminLayout children={<AdminGlobal />} />} />
          <Route path="/admin/settings" element={<AdminLayout children={<AdminSettings />} />} />
          <Route path="/admin/pages" element={<AdminLayout children={<AdminPages />} />} />
          <Route path="/admin/pages/edit/:pageId" element={<AdminLayout children={<AdminPageEditor />} />} />
          <Route path="/admin/blog" element={<AdminLayout children={<AdminBlog />} />} />
          <Route path="/admin/gallery" element={<AdminLayout children={<AdminGallery />} />} />
          <Route path="/admin/services" element={<AdminLayout children={<AdminServices />} />} />
          <Route path="/admin/team" element={<AdminLayout children={<AdminTeam />} />} />
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
                  {/* Dynamic Pages */}
                  <Route path="*" element={<DynamicPage />} />
                </Routes>
              </main>
              <Footer />
              <WhatsAppButton />
            </>
          } />
        </Routes>
      </div>
    </Router>
  );
}
