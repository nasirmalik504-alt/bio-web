import React from 'react';
import { motion } from 'framer-motion';
import { TIMELINE_EVENTS, TEAM_MEMBERS } from '../data/productsData';
import { History, Award, ShieldCheck, Building2, Users, CheckCircle2, Sparkles } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="pt-28 pb-20 bg-[#FAFBFD] relative overflow-hidden min-h-screen text-[#5F708A]">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-20">
        
        {/* Page Hero Header */}
        <div className="text-center max-w-3xl mx-auto space-y-6 pt-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#E6ECF5] shadow-2xs">
            <History className="w-3.5 h-3.5 text-[#6EA8FE]" />
            <span className="text-xs font-mono font-bold text-[#6EA8FE] uppercase tracking-widest">
              About Biobusiness Development Agency
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#23324D] tracking-tight font-display">
            SCIENTIFIC LEADERSHIP & <span className="text-[#6EA8FE]">EXCELLENCE</span>
          </h1>

          <p className="text-[#5F708A] text-base sm:text-lg font-light leading-relaxed">
            We are proud to be one of India’s leading suppliers of comprehensive laboratory products, serving the specialized requirements of research, healthcare, agriculture, and industrial institutions.
          </p>

          {/* Stats Boxes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto pt-4">
            <div className="p-6 rounded-2xl bg-white border border-[#E6ECF5] text-center space-y-1 shadow-2xs">
              <div className="text-4xl font-extrabold font-display text-[#6EA8FE]">29+ Years</div>
              <div className="text-xs font-mono text-[#23324D] uppercase font-bold tracking-wider">Years of Market Experience</div>
            </div>
            <div className="p-6 rounded-2xl bg-white border border-[#E6ECF5] text-center space-y-1 shadow-2xs">
              <div className="text-4xl font-extrabold font-display text-[#7CC9A5]">30+ Years</div>
              <div className="text-xs font-mono text-[#23324D] uppercase font-bold tracking-wider">Collective Scientific Expertise</div>
            </div>
          </div>
        </div>

        {/* Storytelling Timeline Track */}
        <div className="space-y-12">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-extrabold text-[#23324D] font-display">
              OUR HISTORICAL MILESTONES
            </h2>
            <p className="text-[#5F708A] text-sm max-w-xl mx-auto font-light">
              Tracking our growth from founding in 1996 to nationwide rate contracts and digital GeM integration.
            </p>
          </div>

          <div className="relative max-w-4xl mx-auto">
            <div className="absolute left-1/2 -translate-x-1/2 top-4 bottom-4 w-1 bg-gradient-to-b from-[#6EA8FE] via-[#8DBBFF] to-[#F28B82] rounded-full opacity-60 hidden md:block" />

            <div className="space-y-12 relative">
              {TIMELINE_EVENTS.map((event, idx) => {
                const isEven = idx % 2 === 0;
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 25 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: idx * 0.1 }}
                    className={`flex flex-col md:flex-row items-center ${isEven ? 'md:flex-row-reverse' : ''} gap-8`}
                  >
                    <div className="w-full md:w-1/2">
                      <div className="p-7 rounded-3xl bg-white border border-[#E6ECF5] hover:border-[#CDD8E7] shadow-2xs hover:shadow-xs space-y-3 relative group transition-all">
                        <div className="flex items-center justify-between">
                          <span className="text-2xl font-extrabold font-mono text-[#6EA8FE]">
                            {event.year}
                          </span>
                          <span className="px-3 py-1 rounded-full bg-[#DCEEFF] text-[#23324D] text-xs font-mono font-bold">
                            {event.badge}
                          </span>
                        </div>

                        <h3 className="text-xl font-bold text-[#23324D] font-display group-hover:text-[#6EA8FE] transition-colors">
                          {event.title}
                        </h3>

                        <p className="text-sm text-[#5F708A] leading-relaxed font-light">
                          {event.description}
                        </p>

                        {event.stats && (
                          <div className="pt-2 flex items-center gap-2 text-xs font-bold text-[#23324D] font-mono">
                            <CheckCircle2 className="w-4 h-4 text-[#7CC9A5]" />
                            <span>Milestone: {event.stats}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="relative z-10 w-12 h-12 rounded-full bg-white border-2 border-[#6EA8FE] text-[#23324D] flex items-center justify-center text-xl shadow-2xs shrink-0 hidden md:flex">
                      {event.icon}
                    </div>

                    <div className="w-full md:w-1/2 hidden md:block" />
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Credentials Breakdown & Institutional Partnerships Card */}
        <div className="p-8 sm:p-10 rounded-3xl bg-white border border-[#E6ECF5] shadow-xs">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center gap-2 text-[#6EA8FE] font-mono text-xs font-bold uppercase tracking-wider">
                <Building2 className="w-4 h-4" /> Performance & Proven Track Record
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#23324D] font-display">
                INSTITUTIONAL RATE CONTRACTS
              </h2>
              <p className="text-[#5F708A] text-sm leading-relaxed font-light">
                We have successfully executed annual rate contracts for laboratory plasticware, borosilicate glassware, liquid handling, and instruments with prestigious organizations across India:
              </p>

              <div className="flex flex-wrap gap-2 pt-2">
                {['ICAR', 'CSIR', 'ICMR', 'DST', 'DBT', 'DAE', 'DOS', 'IITs', 'Medical Colleges', 'Blood Banks', 'Pollution Control Boards'].map((org, i) => (
                  <span key={i} className="px-3 py-1.5 rounded-lg bg-[#F4F8FC] border border-[#E6ECF5] text-[#23324D] text-xs font-bold font-mono">
                    {org}
                  </span>
                ))}
              </div>
            </div>

            <div className="lg:col-span-5 grid grid-cols-1 gap-4">
              <div className="p-5 rounded-2xl bg-[#EAF7F2] border border-[#CDD8E7] space-y-2">
                <div className="flex items-center gap-2 font-bold text-[#23324D] text-base font-display">
                  <ShieldCheck className="w-5 h-5 text-[#7CC9A5]" /> GeM Portal Expertise
                </div>
                <p className="text-xs text-[#5F708A] leading-relaxed font-light">
                  Technically proficient on the Government e-Marketplace (GeM) Portal, actively participating in bidding processes and ensuring compliance with government procurement standards.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-[#DCEEFF] border border-[#CDD8E7] space-y-2">
                <div className="flex items-center gap-2 font-bold text-[#23324D] text-base font-display">
                  <Award className="w-5 h-5 text-[#6EA8FE]" /> Technical Strength
                </div>
                <p className="text-xs text-[#5F708A] leading-relaxed font-light">
                  Supported by technically qualified professionals with over 30 years of industry experience, assisting in accurate product selection and technical guidance.
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* Leadership Team Showcase */}
        <div className="space-y-10">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-2 text-[#6EA8FE] text-xs font-mono font-bold uppercase">
              <Users className="w-4 h-4" /> Leadership Team
            </div>
            <h2 className="text-3xl font-bold text-[#23324D] font-display">
              EXECUTIVE LEADERSHIP
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {TEAM_MEMBERS.map((member, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.15 }}
                className="p-6 rounded-3xl bg-white border border-[#E6ECF5] hover:border-[#CDD8E7] shadow-2xs hover:shadow-xs flex flex-col sm:flex-row items-center gap-6 group transition-all"
              >
                <div className="w-28 h-28 rounded-2xl overflow-hidden border-2 border-[#6EA8FE]/30 shrink-0 shadow-2xs group-hover:scale-105 transition-transform">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="space-y-2 text-center sm:text-left">
                  <h3 className="text-xl font-bold text-[#23324D] font-display group-hover:text-[#6EA8FE] transition-colors">
                    {member.name}
                  </h3>
                  <div className="text-xs font-bold text-[#6EA8FE] font-mono">
                    {member.role}
                  </div>
                  <div className="text-[11px] px-2.5 py-0.5 rounded bg-[#F4F8FC] border border-[#E6ECF5] text-[#23324D] font-mono font-bold inline-block">
                    {member.experience}
                  </div>
                  <p className="text-xs text-[#5F708A] leading-relaxed pt-1 font-light">
                    {member.bio}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
