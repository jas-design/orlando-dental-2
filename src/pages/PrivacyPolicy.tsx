import { motion } from 'motion/react';

export function PrivacyPolicy() {
  return (
    <div className="pt-24 min-h-screen bg-white">
      {/* Header */}
      <section className="bg-[#D4ECEE] py-24 mb-12">
        <div className="container mx-auto px-4 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-display font-bold text-brand-dark mb-6"
          >
            Privacy Policy
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-gray-700 font-medium text-xl max-w-2xl mx-auto leading-relaxed"
          >
            Count on our dental team to protect your data in office and online. Read our privacy policy below.
          </motion.p>
        </div>
      </section>

      {/* Content */}
      <section className="container mx-auto px-4 pb-24 max-w-4xl">
        <div className="prose prose-lg prose-slate max-w-none space-y-12">
          <div className="space-y-6">
            <h2 className="text-3xl font-display font-bold text-brand-dark">Conway Dental Care Privacy Policy</h2>
            <p className="text-gray-600 leading-relaxed text-lg">
              We are glad to provide you with excellent dental services while also respecting your privacy. This notice discloses the privacy practices for information collected by this website, including:
            </p>
            <ul className="list-disc pl-6 space-y-3 text-gray-600 text-lg">
              <li>What personally identifiable information is collected from you through the website, how it is used, and with whom it may be shared;</li>
              <li>How you can ensure the accuracy of the information;</li>
              <li>Our security procedures designed to protect the misuse of your information; and</li>
              <li>Your options regarding the use of your data.</li>
            </ul>
          </div>

          <div className="space-y-6">
            <h3 className="text-2xl font-display font-bold text-brand-dark">Collection, Use, And Sharing Of Information</h3>
            <p className="text-gray-600 leading-relaxed text-lg">
              Our website permits us to access information that you voluntarily give us via email or other direct contact from you. We are the sole owners of such information collected on this site; we do not sell or rent this information to anyone.
            </p>
            <p className="text-gray-600 leading-relaxed text-lg">
              We use your information to respond to your inquiries and requests, primarily to ensure we are meeting your expectations for dental services. We will not share your information with any third party outside of our organization, other than as necessary to fulfill your requests and to provide you with outstanding care.
            </p>
            <p className="text-gray-600 leading-relaxed text-lg">
              We may occasionally contact you via email to notify you of specials, new products or services, or changes to this privacy policy (unless, of course, you direct us not to).
            </p>
          </div>

          <div className="space-y-6">
            <h3 className="text-2xl font-display font-bold text-brand-dark">Your Access To And Control Over Information</h3>
            <p className="text-gray-600 leading-relaxed text-lg">
              You may opt out of any future contacts from us at any time. By using the contact form on our website, you can:
            </p>
            <ul className="list-disc pl-6 space-y-3 text-gray-600 text-lg">
              <li>Request a description of the information we have about you, if any;</li>
              <li>Correct any inaccurate information;</li>
              <li>Direct us to delete information related to you;</li>
              <li>And share any concern you have about our use of information.</li>
            </ul>
          </div>

          <div className="space-y-6">
            <h3 className="text-2xl font-display font-bold text-brand-dark">Keeping Your Private Information Secure</h3>
            <p className="text-gray-600 leading-relaxed text-lg italic">
              In an abundance of caution, we suggest that you not use our contact form to email us confidential information. While we will not disclose such information to anyone beyond those necessary to facilitate our care of you, such information could possibly be intercepted in transit by unauthorized entities.
            </p>
          </div>

          <div className="space-y-6">
            <h3 className="text-2xl font-display font-bold text-brand-dark">Dentist-approved Cookies</h3>
            <p className="text-gray-600 leading-relaxed text-lg">
              While it may seem funny, our dental website uses “cookies.” A cookie is a piece of data stored on a site visitor’s computer or device to improve access to our site and to identify you as a repeat visitor. For example, cookies eliminate the need for you to log in with a password more than once, thereby saving time while on our site. Cookies can also enable us to remember the interests of our patients to enhance their experience on our site. So our cookies are safe for your teeth and help us serve you better! Usage of a cookie is in no way linked to any personally identifiable information on our site.
            </p>
          </div>

          <div className="space-y-6">
            <h3 className="text-2xl font-display font-bold text-brand-dark">Links</h3>
            <p className="text-gray-600 leading-relaxed text-lg">
              We have linked our website to other sites that may be of help or interest to you. We are not responsible for the content or privacy practices of such other sites. Please be aware when leaving our site and read the privacy statements of other sites to determine to what extent they collect or use personally identifiable information. We invite you to contact us if you feel that we can better implement this privacy policy.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
