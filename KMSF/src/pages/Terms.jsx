import React from 'react';

const Terms = () => {
    return (
        <div className="min-h-screen pt-32 pb-20 dark:bg-gray-900 bg-gray-50 dark:text-white text-gray-900 px-4">
            <div className="max-w-4xl mx-auto dark:bg-gray-800 bg-white p-8 md:p-12 shadow-2xl">
                <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center bg-gradient-to-r from-[#C8A441] to-[#F2AE02] bg-clip-text text-transparent">Terms and Conditions</h1>

                <div className="space-y-6 text-gray-700 dark:text-gray-300 leading-relaxed">
                    <p className="font-semibold">Kurdistan Medical and Scientific Federation (KMSF)</p>

                    <div>
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">1. Introduction</h2>
                        <p>Welcome to the website of the Kurdistan Medical and Scientific Federation (“KMSF”, “we”, “our”, or “us”). By accessing or using our website, registering for membership, or participating in our events, you agree to comply with and be bound by these Terms and Conditions.</p>
                        <p className="mt-2">If you do not agree with these Terms, please do not use our website or services.</p>
                    </div>

                    <div>
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">2. About KMSF</h2>
                        <p>KMSF is a professional organisation dedicated to supporting medical and scientific collaboration, education, networking, and community engagement.</p>
                    </div>

                    <div>
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">3. Membership</h2>
                        <h3 className="font-semibold mt-2 mb-1 text-gray-900 dark:text-gray-200">3.1 Membership Fees</h3>
                        <p>Membership with KMSF is charged at £4.50 per month unless otherwise stated.</p>
                        <p className="mt-2 mb-1">By subscribing for membership, you agree to:</p>
                        <ul className="list-disc pl-5 space-y-1">
                            <li>Provide accurate and complete information;</li>
                            <li>Maintain up-to-date contact details;</li>
                            <li>Pay membership fees on time.</li>
                        </ul>

                        <h3 className="font-semibold mt-4 mb-1 text-gray-900 dark:text-gray-200">3.2 Payments</h3>
                        <p>Membership fees may be collected through recurring monthly payments. Failure to maintain payment may result in suspension or termination of membership benefits.</p>

                        <h3 className="font-semibold mt-4 mb-1 text-gray-900 dark:text-gray-200">3.3 Cancellation</h3>
                        <p>Members may cancel their membership at any time by contacting KMSF through the details provided on our website. Fees already paid are generally non-refundable unless required by law.</p>
                    </div>

                    <div>
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">4. Use of Website</h2>
                        <p>You agree to use this website only for lawful purposes. You must not:</p>
                        <ul className="list-disc pl-5 mt-2 mb-2 space-y-1">
                            <li>Attempt to gain unauthorised access to the website;</li>
                            <li>Upload malicious software or harmful content;</li>
                            <li>Use the website in a way that may damage KMSF’s reputation or operations.</li>
                        </ul>
                        <p>We reserve the right to suspend or restrict access where misuse is identified.</p>
                    </div>

                    <div>
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">5. Intellectual Property</h2>
                        <p>All content on this website, including logos, text, graphics, images, videos, and publications, is the property of KMSF unless otherwise stated.</p>
                        <p className="mt-2">You may not reproduce, distribute, or commercially exploit any material without prior written permission from KMSF.</p>
                    </div>

                    <div>
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">6. Photography and Media Consent</h2>
                        <p>By attending KMSF public events, conferences, workshops, or gatherings, you acknowledge and agree that photographs, video recordings, and other media may be taken during the event.</p>
                        <p className="mt-2">KMSF reserves the right to use, reproduce, publish, and distribute these images and recordings for promotional, educational, marketing, social media, website, and organisational purposes without compensation or further notice.</p>
                        <p className="mt-2">If you do not wish to appear in photographs or recordings, you should notify event organisers in advance where reasonably possible.</p>
                    </div>

                    <div>
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">7. Event Participation</h2>
                        <p>KMSF reserves the right to:</p>
                        <ul className="list-disc pl-5 mt-2 space-y-1">
                            <li>Refuse admission to events;</li>
                            <li>Remove attendees whose behaviour is inappropriate, disruptive, discriminatory, or unsafe;</li>
                            <li>Modify event schedules, speakers, or venues where necessary.</li>
                        </ul>
                    </div>

                    <div>
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">8. Limitation of Liability</h2>
                        <p>While we aim to ensure that the information on our website is accurate and up to date, KMSF makes no guarantees regarding completeness, reliability, or accuracy.</p>
                        <p className="mt-2">To the fullest extent permitted by law, KMSF shall not be liable for any indirect, incidental, or consequential damages arising from:</p>
                        <ul className="list-disc pl-5 mt-2 space-y-1">
                            <li>Use of the website;</li>
                            <li>Participation in KMSF events;</li>
                            <li>Reliance on information published by KMSF.</li>
                        </ul>
                    </div>

                    <div>
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">9. Third-Party Links</h2>
                        <p>Our website may include links to external websites for convenience or informational purposes. KMSF is not responsible for the content, accuracy, or practices of third-party websites.</p>
                    </div>

                    <div>
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">10. Changes to Terms</h2>
                        <p>We reserve the right to update or modify these Terms and Conditions at any time. Continued use of the website following changes constitutes acceptance of those changes.</p>
                    </div>

                    <div>
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">11. Governing Law</h2>
                        <p>These Terms and Conditions shall be governed by and interpreted in accordance with the laws of the United Kingdom.</p>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Terms;
