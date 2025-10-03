import React from 'react';

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white pt-16">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0  opacity-20"></div>
        <div className="relative z-10 flex flex-col items-center justify-center py-20 px-4">
          <img
            src="/KMSF_logo.png"
            alt="KMSF Logo"
            className="w-32 h-32 mb-8 rounded-full shadow-lg"
          />
          <h1 className="text-5xl md:text-6xl font-bold text-center mb-6 bg-gradient-to-r from-[#C8A441] to-[#F2AE02] bg-clip-text text-transparent">
            About KMSF
          </h1>
          <p className="text-xl md:text-2xl text-center max-w-3xl leading-relaxed">
            Kurdistan Medical and Scientific Federation - Advancing Kurdish healthcare and scientific excellence since 1988
          </p>
        </div>
        <div
          className="absolute inset-0 bg-cover bg-center opacity-10"
          style={{  }}
        ></div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-16 space-y-16">
        {/* History Section */}
        <section className="bg-gray-800 bg-opacity-50 rounded-2xl p-8 shadow-2xl">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center bg-gradient-to-r from-[#C8A441] to-[#F2AE02] bg-clip-text text-transparent">Our History</h2>
          <div className="space-y-6 text-lg leading-relaxed">
            <p>
              Since 1988, Kurdish medical and scientific professionals in the UK have provided continuous support to institutions of higher education in Kurdistan and have played an important role in promoting Kurdish human rights. Most of this support and activities have been through established organizations or committees.
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gray-700 bg-opacity-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-3 bg-gradient-to-r from-[#C8A441] to-[#F2AE02] bg-clip-text text-transparent">Key Organizations</h3>
                <ul className="space-y-2 text-gray-300">
                  <li>• Kurdish Scientific and Medical Association (KSMA)</li>
                  <li>• Support Committee for Higher Education in Iraqi Kurdistan – UK (SCHEIKUK)</li>
                  <li>• Kurdish Academic Network (KAN)</li>
                  <li>• Kurdistan Medical Association (KMA)</li>
                </ul>
              </div>
              <div className="bg-gray-700 bg-opacity-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-3 bg-gradient-to-r from-[#C8A441] to-[#F2AE02] bg-clip-text text-transparent">Milestones</h3>
                <ul className="space-y-2 text-gray-300">
                  <li>• 1988: Initial support activities begin</li>
                  <li>• 2005: General Meeting in London</li>
                  <li>• 2006: KMSF officially established</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Formation Section */}
        <section className="bg-gradient-to-r  rounded-2xl p-8 shadow-2xl">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">Formation of KMSF</h2>
          <div className="space-y-6 text-lg leading-relaxed">
            <p>
              In recent years, following the expansion of universities in Kurdistan and the increasing number of Kurdish doctors and academics in the UK, the Kurdish professional organizations felt the need to unite to enhance their productivity and efficiency.
            </p>
            <p>
              A General Meeting was held in London in January 2005, attended by over 120 Kurdish doctors and academics from the above organizations. Participants agreed to restructure under one umbrella organization - the Kurdistan Medical and Scientific Federation (KMSF).
            </p>
            <div className=" bg-opacity-10 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-3">New Structure</h3>
              <ul className="space-y-2">
                <li>• Kurdish Medical Association (KuMA)</li>
                <li>• Kurdistan Scientific Association (KSA)</li>
                <li>• SCHEIKUK integrated under KMSF</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Governance Section */}
        <section className="bg-gray-800 bg-opacity-50 rounded-2xl p-8 shadow-2xl">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center bg-gradient-to-r from-[#C8A441] to-[#F2AE02] bg-clip-text text-transparent">Governance</h2>
          <div className="text-center space-y-6">
            <p className="text-lg leading-relaxed max-w-3xl mx-auto">
              KMSF activities are overseen by a dedicated Board, with membership defined by the KMSF constitution. This ensures transparent and effective leadership in our mission to support Kurdish healthcare and scientific advancement.
            </p>
            <div className="bg-gradient-to-r from-[#C8A441] to-[#F2AE02] p-6 rounded-lg inline-block">
              <h3 className="text-xl font-semibold mb-2">Board Oversight</h3>
              <p className="text-gray-200">Guided by our constitution for unified excellence</p>
            </div>
          </div>
        </section>
      </div>


    </div>
  );
};

export default About;
