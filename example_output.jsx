import React from 'react';

const PrivacyPolicyComponent = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="prose prose-lg max-w-none">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">Privacy Policy</h1>
        <p className="text-sm sm:text-base lg:text-lg text-gray-700 mb-4 leading-relaxed">Last updated: January 15, 2024</p>
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-gray-800 mb-5 mt-8 leading-tight">Information We Collect</h2>
        <p className="text-sm sm:text-base lg:text-lg text-gray-700 mb-4 leading-relaxed">We collect information you provide directly to us, such as when you create an account, make a purchase, or contact us for support.</p>
        <h3 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-gray-800 mb-4 mt-6 leading-tight">Personal Information</h3>
        <p className="text-sm sm:text-base lg:text-lg text-gray-700 mb-4 leading-relaxed">This may include your name, email address, phone number, and billing information.</p>
        <h3 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-gray-800 mb-4 mt-6 leading-tight">Usage Information</h3>
        <p className="text-sm sm:text-base lg:text-lg text-gray-700 mb-4 leading-relaxed">We automatically collect certain information about your device and how you interact with our services.</p>
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-gray-800 mb-5 mt-8 leading-tight">How We Use Your Information</h2>
        <p className="text-sm sm:text-base lg:text-lg text-gray-700 mb-4 leading-relaxed">We use the information we collect to provide, maintain, and improve our services, process transactions, and communicate with you.</p>
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-gray-800 mb-5 mt-8 leading-tight">Information Sharing</h2>
        <p className="text-sm sm:text-base lg:text-lg text-gray-700 mb-4 leading-relaxed">We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as described in this policy.</p>
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-gray-800 mb-5 mt-8 leading-tight">Contact Us</h2>
        <p className="text-sm sm:text-base lg:text-lg text-gray-700 mb-4 leading-relaxed">If you have any questions about this Privacy Policy, please contact us at <a href="mailto:privacy@example.com" className="text-blue-600 hover:text-blue-800 underline transition-colors duration-200 break-words" target="_blank" rel="noopener noreferrer">privacy@example.com</a> or visit our website at <a href="https://example.com/contact" className="text-blue-600 hover:text-blue-800 underline transition-colors duration-200 break-words" target="_blank" rel="noopener noreferrer">https://example.com/contact</a>.</p>
      </div>
    </div>
  );
};

export default PrivacyPolicyComponent;