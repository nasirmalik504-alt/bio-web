import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Truck, Headphones, Sparkles, Award } from 'lucide-react';

export const WhyChooseUs: React.FC = () => {
  const reasons = [
    {
      icon: <Award className="w-7 h-7 text-[#6EA8FE]" />,
      bg: 'bg-[#DCEEFF]',
      title: 'Scientific Expertise',
      desc: 'Over 30 years of collective scientific background ensuring technical precision in lab consumables and instrument selection.'
    },
    {
      icon: <ShieldCheck className="w-7 h-7 text-[#7CC9A5]" />,
      bg: 'bg-[#EAF7F2]',
      title: 'Certified Lab Products',
      desc: 'ISO 9001:2015, NABL accredited glassware, and CE certified instruments tested for maximum reproducibility.'
    },
    {
      icon: <Truck className="w-7 h-7 text-[#8DBBFF]" />,
      bg: 'bg-[#EDF8FF]',
      title: 'Government Logistics',
      desc: 'Streamlined supply chains capable of delivering bulk rate contract shipments securely to remote university and government labs.'
    },
    {
      icon: <Headphones className="w-7 h-7 text-[#23324D]" />,
      bg: 'bg-[#EEE8FF]',
      title: 'End-to-End Support',
      desc: 'Dedicated technical team providing after-sales support, calibration assistance, and instant quote turnarounds.'
    }
  ];

  return (
    <section className="py-24 bg-[#FAFBFD] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#E6ECF5] shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-[#6EA8FE]" />
            <span className="text-xs font-mono font-bold text-[#6EA8FE] uppercase tracking-widest">
              Why Partner With Biobusiness
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#23324D] tracking-tight font-display">
            UNCOMPROMISING QUALITY & <span className="text-[#6EA8FE]">RELIABILITY</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {reasons.map((reason, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: idx * 0.1 }}
              className="p-7 rounded-3xl bg-white border border-[#E6ECF5] hover:border-[#CDD8E7] shadow-2xs hover:shadow-md space-y-4 group transition-all"
            >
              <div className={`p-3.5 rounded-2xl ${reason.bg} w-fit group-hover:scale-110 transition-transform`}>
                {reason.icon}
              </div>

              <h3 className="text-xl font-bold text-[#23324D] font-display group-hover:text-[#6EA8FE] transition-colors">
                {reason.title}
              </h3>

              <p className="text-xs text-[#5F708A] leading-relaxed font-light">
                {reason.desc}
              </p>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};
