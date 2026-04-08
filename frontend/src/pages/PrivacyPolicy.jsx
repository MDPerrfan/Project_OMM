import React from 'react';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white p-8 border border-gray-200 rounded-xl shadow-sm">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Privacy Policy</h1>
        <p className="text-sm text-gray-500 mb-8 font-medium">Last updated: April 08, 2026</p>

        <div className="prose prose-slate max-w-none space-y-6 text-gray-700 leading-relaxed">
          <p>
            This Privacy Policy describes Our policies and procedures on the collection, use and disclosure of Your information when You use the Service and tells You about Your privacy rights and how the law protects You.
          </p>
          
          <p>
            We use Your Personal Data to provide and improve the Service. By using the Service, You agree to the collection and use of information in accordance with this Privacy Policy.
          </p>

          <hr className="my-8 border-gray-100" />

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Interpretation and Definitions</h2>
            <h3 className="text-xl font-medium text-gray-800 mt-6 mb-2">Interpretation</h3>
            <p>
              The words whose initial letters are capitalized have meanings defined under the following conditions. The following definitions shall have the same meaning regardless of whether they appear in singular or in plural.
            </p>

            <h3 className="text-xl font-medium text-gray-800 mt-6 mb-2">Definitions</h3>
            <p className="mb-4">For the purposes of this Privacy Policy:</p>
            <ul className="list-disc pl-6 space-y-3">
              <li><strong>Account</strong> means a unique account created for You to access our Service.</li>
              <li><strong>Company</strong> (referred to as &quot;the Company&quot;, &quot;We&quot;, &quot;Us&quot; or &quot;Our&quot;) refers to OMM.</li>
              <li><strong>Country</strong> refers to: Bangladesh.</li>
              <li><strong>Personal Data</strong> is any information that relates to an identified or identifiable individual.</li>
              <li><strong>Website</strong> refers to OMM, accessible from <a href="https://ommverse.com" className="text-blue-600 hover:underline">https://ommverse.com</a>.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Collecting and Using Your Personal Data</h2>
            <h3 className="text-xl font-medium text-gray-800 mt-6 mb-2">Types of Data Collected</h3>
            
            <h4 className="font-semibold mt-4 italic">Personal Data</h4>
            <ul className="list-disc pl-6 mb-4">
              <li>Email address</li>
              <li>First name and last name</li>
            </ul>

            <h4 className="font-semibold mt-4 italic">Usage Data</h4>
            <p>
              Usage Data is collected automatically when using the Service. This may include Your Device's IP address, browser type, pages visited, and time spent on our Service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Use of Your Personal Data</h2>
            <p className="mb-4">The Company may use Personal Data for the following purposes:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>To maintain our Service:</strong> monitoring the usage of our Service.</li>
              <li><strong>To manage Your Account:</strong> managing Your registration as a user.</li>
              <li><strong>To contact You:</strong> via email regarding updates or security notifications.</li>
              <li><strong>For business transfers:</strong> evaluating potential mergers or sales.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Retention and Deletion</h2>
            <p>
              The Company will retain Your Personal Data only for as long as is necessary for the purposes set out in this Privacy Policy. You have the right to delete or request that We assist in deleting the Personal Data that We have collected about You.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Security of Your Personal Data</h2>
            <p>
              The security of Your Personal Data is important to Us, but remember that no method of transmission over the Internet is 100% secure. While We strive to use commercially reasonable means to protect Your data, We cannot guarantee its absolute security.
            </p>
          </section>

          <section className="bg-gray-50 p-6 rounded-lg border border-gray-100 mt-12">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Contact Us</h2>
            <p className="mb-4">If you have any questions about this Privacy Policy, You can contact us:</p>
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <span className="font-semibold">By email:</span>
                <a href="mailto:projectomm2026@gmail.com" className="text-blue-600 hover:underline">projectomm2026@gmail.com</a>
              </li>
              <li className="flex items-center gap-2">
                <span className="font-semibold">By phone:</span>
                <span className="text-gray-700">+8801632-343999</span>
              </li>
            </ul>
          </section>
        </div>
      </div>
      
      <footer className="mt-12 text-center text-sm text-gray-400">
        &copy; {new Date().getFullYear()} OMM. All rights reserved.
      </footer>
    </div>
  );
}
