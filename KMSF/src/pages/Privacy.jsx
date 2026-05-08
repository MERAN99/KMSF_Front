import React from 'react';

const Privacy = () => {
    return (
        <div className="min-h-screen pt-32 pb-20 dark:bg-gray-900 bg-gray-50 dark:text-white text-gray-900 px-4">
            <div className="max-w-4xl mx-auto dark:bg-gray-800 bg-white p-8 md:p-12 shadow-2xl">
                <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center bg-gradient-to-r from-[#C8A441] to-[#F2AE02] bg-clip-text text-transparent">Privacy Policy</h1>

                <div className="space-y-6 text-gray-700 dark:text-gray-300 leading-relaxed">
                    <p className="font-semibold">Kurdistan Medical and Scientific Federation (KMSF)</p>
                    <p>At the Kurdistan Medical and Scientific Federation (KMSF), we are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy outlines how we collect, use, and safeguard the data you provide to us.</p>

                    <div>
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Collection of Personal Information</h2>
                        <p>We may collect personal information, such as your name, contact details, and professional background, when you voluntarily provide it to us through our website, membership application, event registrations, or other interactions.</p>
                        <p className="mt-2">We may also collect non-personal information, such as your browser type, IP address, and website usage statistics, through the use of cookies or similar technologies.</p>
                    </div>

                    <div>
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Use of Personal Information</h2>
                        <p>We use the personal information you provide to us for the purposes of:</p>
                        <ul className="list-disc pl-5 mt-2 mb-2 space-y-1">
                            <li>Communication;</li>
                            <li>Member services;</li>
                            <li>Event registrations;</li>
                            <li>Improving our website and services.</li>
                        </ul>
                        <p>We may also use your information to send newsletters, updates, or other relevant information related to KMSF activities, events, and opportunities.</p>
                        <p className="mt-2">We will not sell, trade, or rent your personal information to third parties without your consent, except:</p>
                        <ul className="list-disc pl-5 mt-2 space-y-1">
                            <li>As required by law; or</li>
                            <li>As necessary to provide requested services.</li>
                        </ul>
                    </div>

                    <div>
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Data Security</h2>
                        <p>We implement appropriate technical and organisational measures to protect your personal information against unauthorised access, loss, or alteration.</p>
                        <p className="mt-2">However, please note that no data transmission over the internet or electronic storage method can be guaranteed to be 100% secure. While we strive to protect your personal information, we cannot guarantee the absolute security of the data you transmit to us.</p>
                    </div>

                    <div>
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Third-Party Websites</h2>
                        <p>Our website may contain links to third-party websites or services. Please note that this Privacy Policy does not apply to those external sites, and we are not responsible for their privacy practices or content.</p>
                        <p className="mt-2">We encourage you to review the privacy policies of any third-party sites or services before providing your personal information.</p>
                    </div>

                    <div>
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Photography and Media</h2>
                        <p>Photographs and videos may be taken at KMSF public events. These images may be used by KMSF for promotional, educational, marketing, website, publication, and social media purposes.</p>
                        <p className="mt-2">By attending public events, attendees consent to such use unless they explicitly notify organisers otherwise.</p>
                    </div>

                    <div>
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Changes to the Privacy Policy</h2>
                        <p>We reserve the right to modify or update this Privacy Policy at any time. Any changes will be effective immediately upon posting the revised policy on our website.</p>
                        <p className="mt-2">We encourage you to review this page periodically for updates.</p>
                    </div>

                    <div>
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Contact Us</h2>
                        <p>If you have any questions or concerns about this Privacy Policy or the handling of your personal information, please contact us using the information provided on our “Contact Us” page.</p>
                        <p className="mt-4 font-semibold">Thank you for your trust in the Kurdistan Medical and Scientific Federation.</p>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Privacy;
