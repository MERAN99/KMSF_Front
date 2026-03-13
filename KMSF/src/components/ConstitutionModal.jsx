import React, { useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Printer, Download } from 'lucide-react';

const CONSTITUTIONS = {
    HISTORY: {
        title: 'KMSF – Our Full History',
        content: `Since 1988, the Kurdish medical and scientific professionals in the UK have provided continuous support to the institutions of higher education in Kurdistan, and have played an important role in promoting Kurdish human rights. Most of this support and activities have been through established organizations or committees, namely, Kurdish Scientific and Medical Association (KSMA), Support Committee for Higher Education in Iraqi Kurdistan – UK (SCHEIKUK), Kurdish Academic Network (KAN) and Kurdistan Medical Association (KMA).

In recent years, and following the expansion of the number of universities in Kurdistan and also the increasing number of Kurdish doctors and academics in the UK, the Kurdish professional organisations felt the need to get together in order to enhance their productivity and to make their efforts more unified and highly efficient. Subsequently a General Meeting was held in London in January 2005. This meeting was attended by over 120 Kurdish doctors and academics/scientific professionals in the UK from the above named organisations.

Participants agreed to restructure the existing medical and scientific organisations under one umbrella organisation (a Federation), which would incorporate one medical association (now the Kurdish Medical Association – KuMA) and one scientific association (Kurdistan Scientific Association – KSA). It was also agreed that the new structure would eventually replace all the previously existing organisations.

At a subsequent meeting in June 2006, the name Kurdistan Medical and Scientific Federation (KMSF) was agreed for this new umbrella organisation. It was also agreed that SCHEIKUK would come under KMSF.

KMSF activities are overseen by a Board, the membership of which is defined by KMSF constitution.`,
    },
    KMSF: {
        title: 'Kurdistan Medical and Scientific Federation (KMSF) – UK Constitution',
        content: `ARTICLE 1 – NAME
This Organization shall be known as Kurdistan Medical and Scientific Federation, hereinafter referred to as the "KMSF".

ARTICLE 2 – DEFINITIONS
Member Organizations – Member Organizations means a bargaining agent or representative body with respect to collective bargaining that is a member of the Federation.
The Board – means the Executive Board;
Chairperson – The Chairperson for the Federation;
Constitution – means the Constitution of the Federation unless otherwise specified;
Voting Delegate – means a member selected by a Member Organization who is registered as a delegate on behalf of her respective Organization at a Convention of the Federation and who has the right to speak to and vote on business of the Federation;
Invited Guest – means any person whom the Chairperson or The Executive Board invites to attend all or part of a Convention of the Federation. Invited guests may speak to an issue with the consent of two-thirds of the voting delegates.

ARTICLE 3 – HEADQUARTERS
For the time being, the office of The Federation shall be in held virtual.

ARTICLE 4 – OBJECTIVES
The Federation shall be the voice for Kurdish Doctors, healthcare professionals, academics, scientists and those with postgraduate certificates in allied subjects who reside outside Kurdistan – its objectives are to:

• Promote communication between member organisations;
• Safeguard and promote the academic and practical skills for all the members of the federation;
• Establish and promote active links between the Federation and healthcare and academic institutions in Kurdistan Region;
• Promote cooperation and unity between member organizations;
• Promote scientific and educational goals for the Kurdistan Region through active collaboration between experienced members of the federation and relevant institutions in Kurdistan;
• Promote and advocate for the highest standards of services that could found outside Kurdistan for adoption after.

ARTICLE 5 – PRINCIPLES AND STANDARDS OF CONDUCT
In working towards the foregoing general objectives the Federation shall adhere to the following principles and standards of conduct:

• It shall be non-partisan;
• It shall give full recognition to the autonomy of its Member Organizations. All powers, other than those delegated to the Federation, shall remain with the Member Organizations whose fundamental autonomy and freedom shall be maintained by the Federation as a first principle;
• All Member Organizations shall become members of KMSF;
• It shall provide to its members a platform forum to seek assistance for research, legislative, public relations, educational and any other collective bargaining support.

ARTICLE 6 – MEMBERSHIP
• All bona fide members of a Member Organization shall hold membership in the Federation through their Organization;
• The Federation, by two-thirds (2/3) majority of the Board, may accept additional Organizations as Member Organizations. Applications shall be supported by evidence that such is the wish of the applicant's members;
• Membership Certificates shall be issued to all Member Organizations;
• A Member Organization may withdraw from the Federation subject to written notice of twelve (12) months being given to the Federation, supported by evidence that such is the decision of its membership;
• A Member Organization that has withdrawn from the Federation in the manner described above may make written application for re-admission to the Federation through the Board.

ARTICLE 7 – CONVENTIONS
• The Biennial Convention of the Federation shall be held every two (2) years;
• The Convention shall be the supreme governing body of the Federation. The time and place of the Biennial Convention shall be determined by the Board;
• Notice of the time and place of the Convention shall be circulated to all Member Organizations of the Federation three months prior to the commencement of the Convention;
• Organizations in possession of a valid membership as a Member Organization with the Federation shall be entitled to representation at Federation Conventions by voting delegates selected by their respective Organizations. All delegates to Conventions must be members of the Organizations they represent. Each Member Organization may cast its full number of votes provided that it has at least one (1) voting delegate present at the Convention;
• A Special Convention of the Federation may be called at the written request, with signatures, of at least fifty per cent (50%) plus one (1) of the Board and/or ten per cent (10%) of the Federation membership. All expenses for meeting facilities arising out of the Special Convention will be borne equally by the member organizations;
• The Chairperson, Secretary and Treasurer and Board Officers shall have full status as a voting delegate at Conventions by virtue of Office and shall each hold one (1) vote;
• Resolutions to the Federation may be submitted by any member of the Federation. Resolutions must be received at the Federation Office at least two months before the opening date of the Convention. Resolutions shall be circulated to all Member Organizations at least one month prior to the commencement of the Convention;
• Emergent resolutions will be accepted at the Convention up to the deadline established on the agenda;
• Any Member Organization which, is in arrears to the Federation for membership dues shall not be entitled to recognition or representation at the Convention;
• Any Organization which has not applied for and obtained a Membership Certificate at least one (1) month prior to the Convention, shall not be allowed representation;
• Unless otherwise specified in this Constitution, a majority of votes shall be sufficient to pass resolutions or make decisions for the Convention.

ARTICLE 8 – THE KMSF BOARD
• There shall be a Board to oversee the activities of KMSF;
• The Board shall be comprised of: Chairperson, Secretary, Treasurer and a member to represent each Member Organisation;
• The chairperson, Secretary and Treasurer shall be elected at each regular Convention. Nominations for these positions must be received in writing by the Federation showing the mover and seconder of the nominations at least three months prior to the commencement of the Convention and the Ticket of Nominations shall be circulated to all Member Organizations at least one month prior to the commencement of the Convention;
• The Nominee for the above positions shall be responsible for submitting: Signed nomination form; All relevant biographical information within the times described in the point above;
• Nominations from the floor will be accepted at the Biennium only if there has been no nomination to the position of The Chairperson, or Secretary and Treasurer;
• The election of the Chairperson, Secretary and Treasurer of the Federation shall be by secret ballot. A majority of votes cast shall be required before any candidate can be declared elected, and second and subsequent ballots shall be taken if necessary to obtain such a majority. On the second and subsequent ballots, the candidate receiving the lowest number of votes in the previous ballot shall be dropped. In case of a final tie vote, the presiding officer may cast the deciding vote;
• The terms of office of elected officers of the Federation shall commence at the adjournment of the Convention at which they were elected;
• In the event of a vacancy or a leave of absence of less than one year, in the office of the Chairperson, the Secretary shall perform the duties of the Chairperson for the unexpired term or leave of absence.

The Board shall:
• Take such action and render such decisions as may be necessary to carry out fully the decisions and instructions of the Convention of the Federation and to enforce the provisions contained in this Constitution.
• Establish such advisory committees as may be deemed appropriate.
• Be recognized by Member Organizations as the governing body under the terms of the Constitution except when the Federation is in Convention.
• Meet at least twice a year.
• Meet at the call of the Chairperson or at the request of half the members of the Executive Board made in writing to the Chairperson.
• Reimburse members of the Board for necessary expenses in performing their duties for the Federation in relation to specific duties assigned by the Board.
• Be authorized to alter membership dues between Conventions, when such an alternation results in a reduction of dues.
• Each Member of the Board shall be entitled to one (1) vote at Board meetings and a quorum for such meetings shall be a majority of the members of the Board and a majority of Member Organizations;
• The Board shall, as it considers necessary, cause to have such members of the Board and staff of the Federation to be bonded in such amounts as necessary.

ARTICLE 9 – DUTIES OF THE CHAIRPERSON
The Chairperson shall:
• Be the head of the Federation. He/She shall be accountable for the affairs of the Federation, sign all official documents and preside at all Conventions and meetings of the Board;
• Be the official spokesperson of the Federation;
• Report on the administration of their Office and on the affairs of the Federation to the Convention through the report of the Board.

ARTICLE 10 – DUTIES OF SECRETARY AND TREASURER
The Secretary and Treasurer shall:
• Carry out the duties as assigned by the Chairperson and act in lieu of the Chairperson in her absence.
• Be the chief financial officer of the Federation and shall cause to be kept the books, documents, files and effects of the Federation which shall, at all times, be subject to inspection by the Board.
• Be responsible for the preparation of a financial report of the Federation for each meeting of the Board.
• Have the books of the Federation audited and an audited financial statement prepared at a nominated time each year. Such audited financial statements shall be furnished to the Board and the Convention.
• Report on the administration of his / her Office to the Convention.
• Be empowered to require Member Organizations to provide statistical data in their possession relating to the number of persons paying dues to the Member Organization.

ARTICLE 11 – REVENUE AND FINANCIAL CONTROL
The revenue of the Federation shall be derived from membership dues as determined at the Convention. Such dues shall be payable by Member Organizations on the full dues paying membership of each Organization.
Each Member Organization shall forward to the Federation before the last day of each month the membership dues payable for that month.

ARTICLE 12 – INTER-ORGANIZATIONAL DISPUTES
Disputes between Member Organizations shall be addressed in accordance with the policy of the Federation.
Inter-organizational disputes shall be resolved according to the Constitution.

ARTICLE 13 – DISCIPLINE
Non-compliance with the Constitution, or action by a Member Organization to the detriment of the objectives and/or activities of the Federation, shall be regarded as grounds for discipline, suspension or expulsion from the Federation, as determined by the Board.

ARTICLE 14 – AMENDMENTS
The Constitution of the Federation may be amended by the Convention by a two-thirds (2/3) vote. Amendments to the Constitution can be submitted by the Board or by Member Organizations. Amendments must be submitted to the Federation at least three months prior to the opening day of the Convention and must be circulated to all Member Organizations at least one month prior to the commencement of the Convention.
All constitutional amendments shall, unless otherwise specified, take effect immediately after they are adopted.`,
    },

    KSA: {
        title: 'The Kurdistan Scientific Association (KSA) – Constitution',
        content: `INTRODUCTION
This constitution establishes the 'Kurdistan Scientific Association' as a formal association of Kurdish students, academics and professionals who work in science and scientific-based technical fields. Its intent is to promote connection, development and shared expertise amongst scientists and scientific professionals within and between Kurdistan and the Kurdish diaspora. The organisation operates in the United Kingdom and is non-political, not-for-profit and voluntary.

1. NAME
1.1. The organisation is named Kurdistan Scientific Association (KSA).

2. OBJECTIVES
2.1. To advance science and scientific-based technical fields.
2.2. To promote and safeguard the interest of KSA Members.
2.3. To hold regular meetings of KSA Members.
2.4. To organise regular presentations with the object of promoting the social and scientific aims of the KSA.
2.5. To hold activities including training, teaching and research through organisation and co-operation between KSA Members.
2.6. To provide career advice, guidance, and support to KSA Members, especially those newly arrived in the UK.
2.7. To raise funds through subscriptions, donations and sponsorships to support the objectives of the KSA.
2.8. To foster understanding and build connections with scientific institutions in Kurdistan.
2.9. To exchange knowledge, expertise and technologies with other scientific organisations within and between Kurdistan and the Kurdish diaspora.
2.10. To undertake charitable work and provide support for humanitarian purposes.

3. AFFILIATION
3.1. The Association may affiliate with any other scientific association or similar organisation, subject to approval by the Executive Committee and agreement of KSA Members.

4. MEMBERSHIP
4.1. Upon application:
Full membership is open to those with a science or science-based technical degree conferred by a university in Kurdistan, or awarded to a person from the Kurdish diaspora, or to non-Kurds who support the values and objectives of the KSA.
Student membership is open to undergraduates studying science or science-based technical degrees under similar conditions.

4.2. Membership is unlimited.

4.3. Membership may be terminated upon:
• Resignation with formal notice.
• Default of subscription payment for more than two years.
• Expulsion for conduct detrimental to the profession or non-compliance with KSA regulations.

5. SUBSCRIPTIONS
5.1. Payment entitles members to full privileges.
5.2. Subscription amounts set by Executive Committee, subject to General Meeting approval.
5.3. Subscription types:
• Full Members: full subscription.
• Student Members: reduced subscription.
5.4. Retired or unemployed members may receive reduced or waived subscriptions, while retaining voting rights.

6. VOTING
6.1. Only members up-to-date with subscriptions may vote.
6.2. Elections overseen by Executive Committee.
6.3. Voting by secret ballot unless otherwise agreed.
6.4. Proxy voting permitted (one proxy per member). Proxy forms must be submitted before deadline.

7. ORGANISATION AND ADMINISTRATION
7.1. The KSA is governed by Executive Committee and decisions at General Meetings.
7.2. Executive Committee: Always includes President, Secretary, Treasurer. No more than nine members.
7.3. Keeps minutes of meetings.
7.4. Meets at least twice per year.
7.5. Term of office is two years; members may serve up to two consecutive terms.
7.6. Duties include: Implement General Meeting decisions; Present Annual Report to AGM; Manage financial records and bank account; Manage property; Maintain membership records; Oversee KSA activities.

8. GENERAL MEETINGS
8.1. General Meetings hold highest authority.
8.2. Held annually (AGM), or extraordinary if required (EGM).
8.3. AGM sets next meeting date and location.
8.4. AGM may be delayed to two years under exceptional circumstances.
8.5. EGM may be called by Executive Committee or 20% of members.
8.6. Written invitations for EGM must be sent 6 weeks in advance.
8.7. Quorum: 30% of membership.
8.8. Decisions usually made by simple majority (51%).
8.9. Without quorum, 75% of attendees required to pass resolutions.
8.10. President chairs meetings; in absence, Secretary or elected Chair.
8.11. Voting by show of hands unless poll demanded.
8.12. Each member has one vote; tie decided by Chair.
8.13. AGM Duties: Approve constitution and amendments; Supervise Executive Committee; Accept or refuse membership applications; Oversee finances and approve reports; Approve annual plans; Address matters raised by Executive Committee and members.

9. OFFICERS' TERMS OF OFFICE
President: Elected by Executive Committee. Serves two-year term (up to two consecutive terms). Becomes Immediate Past President after term. Oversees KSA, co-signs payments, signs contracts, manages urgent matters.
Secretary: Elected by Executive Committee. Two-year term (up to three consecutive terms). Prepares meetings, maintains records, co-signs contracts.
Treasurer: Elected by Executive Committee. Two-year term (up to three consecutive terms). Manages finances, collects subscriptions, prepares financial reports.

10. BRANCHES
10.1. Branches may be established if sufficient interest exists.
10.2. Structure determined by Executive Committee and local members.
10.3. Branch officers report annually to Executive Committee.
10.4. Branch structures may be set out separately or via constitutional amendment.

11. ACCOUNTS
11.1. Resources used solely to support KSA objectives.
11.2. Treasurer and President oversee financial records.
11.3. Records available for inspection upon request.
11.4. Annual financial reports presented at AGM.
11.5. Income sources: Subscriptions; Organised events; Donations; Other approved sources.
11.6. Subscription fees reviewed periodically.
11.7. Financial year: July 1 – June 30.
11.8. No expenditure without properly signed payment orders.

12. AMENDMENTS
12.1. Amendments may be proposed by Executive Committee or by petition of at least three full members.
12.2. Proposals must be submitted two months prior to AGM, distributed 30 days before meeting.
12.3. Amendments require two-thirds majority at AGM.

13. DISSOLUTION
13.1. Dissolution requires 75% approval at AGM.
13.2. After settling obligations, remaining assets distributed fairly among full members.`,
    },

    KuMA: {
        title: 'The Kurdish Medical Association (KuMA) – UK Constitution',
        content: `INTRODUCTION
The Kurdish Medical Association "The Association" is a professional, non-political and not for profit voluntary organisation to cater for graduates of medical, dental and pharmaceutical professions of Kurdistan Universities or Kurdish graduates of other Universities of the above professions residing in the United Kingdom and Ireland. The Association is governed by the laws of England & Wales and its office will be situated in the United Kingdom.

A. NAME
The name of the association shall be The Kurdish Medical Association (the 'KuMA').

B. OBJECTIVES
• To promote the medical, dental, and pharmaceutical sciences, and maintain the interests of its members.
• To hold or arrange periodical meetings of the members.
• To publish and circulate periodicals in the name of the Association, promoting its social and medical aims.
• To provide career advice and counselling, and to support colleagues arriving in the UK in adjusting socially and professionally.
• To provide central awareness of relevant local and central medical and non-medical bodies, supporting members' interests.
• To raise funds via subscriptions, donations, contributions, and sponsorships to further the Association's objectives.
• To develop medical activities, services, teaching, and research through cooperation among members and branches.
• To exchange professional information, expertise, and technologies with branches and other organizations, locally and internationally.
• To promote ties with medical and health organizations in Kurdistan.
• To undertake charitable activities and medical relief work, where lawful, for humanitarian purposes.
The Association holds no responsibility for the political activities or affiliations of individual members.

C. AFFILIATION
The Association may affiliate with other medical associations or similar bodies, subject to Executive Council approval and member voting.

D. MEMBERSHIP
• No membership limit.
• Eligibility: Open to Kurdish graduates in medicine, dentistry, or pharmaceutical sciences residing in the UK or Republic of Ireland, subject to Executive Council approval. Students in these fields are eligible for student membership.
• Types of Membership: Full Membership (meets Association's criteria); Student Membership (for part-time or full-time students in the relevant fields).
• Termination of Membership: Resignation; Non-payment of subscriptions exceeding two years; Expulsion due to conduct detrimental to the profession or non-compliance with Association regulations.

E. SUBSCRIPTIONS
• Subscription rates set by Executive Council, subject to AGM approval.
• Paid subscriptions grant full membership privileges.
• Full members pay full subscription. Student members are exempt.
• Retired/unemployed members may receive reductions or exemptions.

F. VOTING
• Only full members with paid subscriptions may vote.
• Voting via secret ballot; ballot papers must be numbered and signed.
• Proxy voting allowed (maximum one proxy per member).
• Elections supervised by a 3-member Election Committee, plus two observers.
• Nominee lists signed by the President, Secretary, and Treasurer.

G. ORGANIZATION AND ADMINISTRATION
• Managed by Executive Council, General Meetings, and optional Advisory Committee.
• Executive Council: 9-11 members, including President, Secretary, and Treasurer.
• Sub-Committee Chairmen elected or appointed by Council.
• Council maintains meeting records and resolutions.
• Meets at least four times yearly; term of office is two years (up to three terms).
• Duties include executing AGM decisions, financial management, record keeping, property management, supervising activities, and publications.

H. MEETINGS (ANNUAL GENERAL MEETING – AGM)
• AGM is the highest authority; Executive Council cannot reverse its decisions.
• Held annually; scheduled by AGM; allowed every two years in exceptional cases.
• Quorum: 30% of full members or 20 members, whichever is less.
• Executive Council meets quarterly; 20% of members may call extraordinary meetings.
• Invitations sent six weeks in advance with attendance confirmation required.
• Simple majority (51%) for decisions; 75% majority if no quorum.
• President chairs General Meetings; in their absence, Executive Council elects a chair.
• AGM decisions by simple majority; in case of tie, President decides.
AGM Duties: Approve constitution and amendments; Supervise Executive Council; Approve or refuse membership applications; Handle major financial decisions; Approve financial reports and work plans; Discuss annual reports and all matters raised by members.

I. OFFICERS TERM OF OFFICE
a. Election of the President: Elected by Executive Council for a two-year term. May serve only one additional term; becomes Immediate Past-President after term.
b. Election of Secretary, Treasurer, and Sub-Committee Chairpersons: Term: Two years. Elected by Executive Council via secret ballot.
c. Duties of the President: Chair AGM and Executive Council meetings; Oversee Association and branches with Secretary; Co-sign payment orders with Treasurer; Represent Association to authorities; Sign contracts with Secretary; Handle urgent matters pending Council meetings.
d. Duties of the Secretary: Prepare meeting invitations and agendas; Maintain meeting minutes; Keep membership register and database; Execute Council decisions; Maintain Association correspondence and documents.
e. Duties of the Treasurer: Supervise income/expenses, collect subscriptions, deposit funds; Prepare annual financial reports; Maintain financial records and documents; Co-sign payment orders with President; Issue subscription reminders.

J. BRANCHES
• Executive Council may establish branches based on local demand.
• Local meetings elect branch officers; branches meet at least twice yearly.
• Branches submit annual activity and financial reports.
• Branch Constitution: Managed by a Sub-Committee (3-5 elected members). Elects Chairman, Secretary, Treasurer; term of office: two years.

K. ACCOUNTS
• Resources used to achieve Association objectives (conferences, training, publications, etc.).
• Proper accounts maintained for all financial activities.
• Financial year: July 1 – June 30.
• No payments made without authorized payment orders signed by Treasurer and President.

L. SEAL
The Association's seal is used only with Executive Council authority and proper countersignature.

M. AMENDMENTS
• Amendments proposed via Executive Council or petition by three full members.
• Amendment requests submitted to Secretary two months prior to AGM; circulated 30 days prior.
• Amendments require two-thirds AGM majority approval.

N. DISSOLUTION
• Requires 75% majority vote at AGM by qualified members.
• Upon dissolution, assets distributed to eligible full members after obligations are settled.

O. ADDITIONS AND AMENDMENTS TO THE MEMORANDUM
• Executive Council may propose additions, removals, or amendments, subject to AGM approval.
• Council may co-opt members to fill vacancies or for specific tasks.`,
    },
};

const ConstitutionModal = ({ org, onClose }) => {
    const printRef = useRef(null);
    const data = CONSTITUTIONS[org];

    const handlePrint = () => {
        const printContent = printRef.current?.innerHTML;
        const w = window.open('', '_blank');
        w.document.write(`
      <html>
        <head>
          <title>${data.title}</title>
          <style>
            body { font-family: 'Georgia', serif; max-width: 800px; margin: 40px auto; padding: 20px; color: #111; line-height: 1.7; font-size: 14px; }
            h1 { font-size: 20px; font-weight: bold; margin-bottom: 24px; border-bottom: 2px solid #C8A441; padding-bottom: 12px; }
            pre { white-space: pre-wrap; font-family: inherit; font-size: 14px; line-height: 1.7; }
            @media print { body { margin: 20px; } }
          </style>
        </head>
        <body>
          <h1>${data.title}</h1>
          <pre>${data.content}</pre>
        </body>
      </html>
    `);
        w.document.close();
        w.focus();
        setTimeout(() => { w.print(); }, 400);
    };

    return (
        <AnimatePresence>
            {org && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-gray-950/85 backdrop-blur-sm"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative w-full max-w-3xl bg-gray-900 border border-gray-700 shadow-2xl rounded-lg overflow-hidden max-h-[92vh] flex flex-col"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Gold bar */}
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#C8A441] to-[#F2AE02]" />

                        {/* Header */}
                        <div className="flex items-start justify-between px-5 sm:px-7 pt-6 pb-4 flex-shrink-0 border-b border-gray-700">
                            <div className="pr-4">
                                <h2 className="text-base sm:text-lg font-bold text-white leading-tight">{data.title}</h2>
                            </div>
                            <div className="flex items-center gap-2 flex-shrink-0">
                                <button
                                    onClick={handlePrint}
                                    title="Print / Save as PDF"
                                    className="flex items-center gap-1.5 bg-gradient-to-r from-[#C8A441] to-[#F2AE02] text-gray-900 font-bold text-xs sm:text-sm px-3 sm:px-4 py-2 rounded hover:opacity-90 transition-opacity"
                                >
                                    <Printer size={15} />
                                    <span className="hidden sm:inline">Print / PDF</span>
                                </button>
                                <button onClick={onClose} className="text-gray-400 hover:text-white p-1.5 bg-gray-700/50 hover:bg-gray-700 rounded transition-colors">
                                    <X size={20} />
                                </button>
                            </div>
                        </div>

                        {/* Scrollable content */}
                        <div ref={printRef} className="flex-1 overflow-y-auto px-5 sm:px-8 py-6">
                            <pre className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap font-sans">
                                {data.content}
                            </pre>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default ConstitutionModal;
