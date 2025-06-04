"use client"; // if you're using app router

import React from 'react';

const PrivacyPolicy = () => {
  return (
    <div className="bg-gray-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto bg-white shadow-xl rounded-2xl p-8 sm:p-10">
        <header className="mb-10">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Privacy Policy</h1>
        </header>

        <section className="space-y-6 text-gray-700 leading-relaxed">
          <p>
            At <strong className="text-gray-900">CADD CORE Training Institute</strong>, we are committed to protecting the privacy and personal information of our students, visitors, and users. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or enroll in our programs.
          </p>

          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">1. Information We Collect</h2>
            <div className="space-y-4">
              <div>
                <p className="font-medium">a. Personal Information:</p>
                <ul className="list-disc list-inside ml-4">
                  <li>Full Name</li>
                  <li>Email Address</li>
                  <li>Phone Number</li>
                  <li>Date of Birth</li>
                  <li>Address</li>
                  <li>Educational Background</li>
                  <li>ID Proofs (if applicable)</li>
                </ul>
              </div>
              <div>
                <p className="font-medium">b. Usage Data:</p>
                <ul className="list-disc list-inside ml-4">
                  <li>IP Address</li>
                  <li>Browser Type and Version</li>
                  <li>Pages Visited</li>
                  <li>Time Spent on Pages</li>
                  <li>Referring Site Details</li>
                </ul>
              </div>
              <div>
                <p className="font-medium">c. Course-Related Information:</p>
                <ul className="list-disc list-inside ml-4">
                  <li>Course Enrollment History</li>
                  <li>Attendance Records</li>
                  <li>Assessment Results</li>
                  <li>Certificates Issued</li>
                </ul>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">2. How We Use Your Information</h2>
            <ul className="list-disc list-inside ml-4">
              <li>Managing course registrations and certifications</li>
              <li>Providing customer support</li>
              <li>Sending updates, notifications, and promotional materials</li>
              <li>Improving our training programs and website</li>
              <li>Maintaining internal records for administrative/legal purposes</li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">3. Sharing Your Information</h2>
            <p>We <strong>do not sell or rent</strong> your personal data. However, we may share your information with:</p>
            <ul className="list-disc list-inside ml-4 mt-2">
              <li>Affiliated educational or certification bodies</li>
              <li>Government authorities (if required by law)</li>
              <li>Service providers for IT support, communication, or hosting</li>
            </ul>
            <p className="mt-2">All third parties are required to maintain the confidentiality of your information.</p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">4. Data Security</h2>
            <p>We use appropriate technical and organizational measures to protect your personal information from unauthorized access, loss, or misuse.</p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">5. Your Rights</h2>
            <p>You have the right to:</p>
            <ul className="list-disc list-inside ml-4 mt-2">
              <li>Access your personal data</li>
              <li>Request correction of inaccurate data</li>
              <li>Request deletion of your data (subject to legal obligations)</li>
              <li>Withdraw consent (where applicable)</li>
            </ul>
            <p className="mt-2">To exercise your rights, contact us at: <strong>caddcorebd@gmail.com</strong></p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">6. Cookies</h2>
            <p>Our website may use cookies to enhance your experience. You can disable cookies through your browser settings.</p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">7. Third-Party Links</h2>
            <p>We are not responsible for the privacy practices of external websites linked from our site.</p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">8. Changes to This Policy</h2>
            <p>This policy may be updated periodically. All changes will be posted on this page with a new effective date.</p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">9. Contact Us</h2>
            <div className="bg-gray-100 p-4 rounded-lg shadow-sm mt-2">
              <p><strong>CADD CORE Training Institute</strong></p>
              <p>📍 ১৪৯/এ, বায়তুশ শরফ কমপ্লেক্স (২য় তলা), এয়ারপোর্ট রোড, ফার্মগেট, ঢাকা-১২১৫</p>
              <p>📞 +880 1611-223631 | +880 1611-223637</p>
              <p>📧 <a href="mailto:caddcorebd@gmail.com" className="text-blue-600 hover:underline">caddcorebd@gmail.com</a></p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
