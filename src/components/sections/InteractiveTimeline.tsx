import React from 'react';
import { motion } from 'framer-motion';
import { TIMELINE_EVENTS, TEAM_MEMBERS } from '../../data/productsData';
import { History, Award, ShieldCheck, CheckCircle2, Building2, Users } from 'lucide-react';

export const InteractiveTimeline: React.FC = () => {
  return (
    <section id="about" className="py-24 bg-[#FAFBFD] relative overflow-hidden">
      
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-[#6EA8FE]/5 blur-[150px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-20">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#E6ECF5] shadow-2xs">
            <History className="w-3.5 h-3.5 text-[#6EA8FE]" />
            <span className="text-xs font-mono font-bold text-[#6EA8FE] uppercase tracking-widest">
              29+ Years of Scientific Legacy
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#23324D] tracking-tight font-display">
            OUR JOURNEY & <span className="text-[#6EA8FE]">TRACK RECORD</span>
          </h2>

          <p className="text-[#5F708A] text-base font-light leading-relaxed">
            From our founding in 1996 to becoming India's premier government rate contract supplier across ICAR, CSIR, ICMR, and top technological institutes.
          </p>
        </div>

        {/* Vertical Timeline Track */}
        <div className="relative max-w-4xl mx-auto mb-28">
          
          {/* Central Glowing Line */}
          <div className="absolute left-1/2 -translate-x-1/2 top-4 bottom-4 w-1 bg-gradient-to-b from-[#6EA8FE] via-[#8DBBFF] to-[#F28B82] rounded-full opacity-60 hidden md:block" />

          <div className="space-y-12 relative">
            {TIMELINE_EVENTS.map((event, idx) => {
              const isEven = idx % 2 === 0;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.55, delay: idx * 0.12 }}
                  className={`flex flex-col md:flex-row items-center ${isEven ? 'md:flex-row-reverse' : ''} gap-8`}
                >
                  {/* Timeline Event Card */}
                  <div className="w-full md:w-1/2">
                    <div className="p-7 rounded-3xl bg-white border border-[#E6ECF5] hover:border-[#CDD8E7] shadow-xs hover:shadow-md space-y-3 relative group transition-all">
                      
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

                  {/* Central Node Badge */}
                  <div className="relative z-10 w-12 h-12 rounded-full bg-white border-2 border-[#6EA8FE] text-[#23324D] flex items-center justify-center text-xl shadow-xs shrink-0 hidden md:flex">
                    {event.icon}
                  </div>

                  {/* Empty Spacer */}
                  <div className="w-full md:w-1/2 hidden md:block" />

                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Credentials Breakdown & Institutional Partnerships Card */}
        <div className="p-8 rounded-3xl bg-white border border-[#E6ECF5] shadow-xs mb-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center gap-2 text-[#6EA8FE] font-mono text-xs font-bold uppercase tracking-wider">
                <Building2 className="w-4 h-4" /> Proven Track Record & Institutional Contracts
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-[#23324D] font-display">
                SUPPLYING UNDER ANNUAL RATE CONTRACTS
              </h3>
              <p className="text-[#5F708A] text-sm leading-relaxed font-light">
                Biobusiness Development Agency has successfully executed rate contracts for laboratory plasticware, glassware, and precision instruments with prestigious organizations across India, satisfying technical, regulatory, and operational compliance.
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
                  <ShieldCheck className="w-5 h-5 text-[#7CC9A5]" /> GeM Portal Technical Expertise
                </div>
                <p className="text-xs text-[#5F708A] leading-relaxed">
                  Technically proficient on the Government e-Marketplace (GeM) Portal with active participation in bidding processes.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-[#DCEEFF] border border-[#CDD8E7] space-y-2">
                <div className="flex items-center gap-2 font-bold text-[#23324D] text-base font-display">
                  <Award className="w-5 h-5 text-[#6EA8FE]" /> 30+ Years Technical Guidance
                </div>
                <p className="text-xs text-[#5F708A] leading-relaxed">
                  Supported by experienced scientific professionals ensuring accurate product selection and dependable support.
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
            <h3 className="text-3xl font-bold text-[#23324D] font-display">
              EXECUTIVE LEADERSHIP
            </h3>
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
                <div className="w-28 h-28 rounded-2xl overflow-hidden border-2 border-[#6EA8FE]/40 shrink-0 shadow-xs group-hover:scale-105 transition-transform">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="space-y-2 text-center sm:text-left">
                  <h4 className="text-xl font-bold text-[#23324D] font-display group-hover:text-[#6EA8FE] transition-colors">
                    {member.name}
                  </h4>
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
    </section>
  );
};
