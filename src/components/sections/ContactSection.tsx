import React, { useState } from 'react';
import { submitContactMessage } from '../../services/api';
import { Send, MapPin, Mail, ShieldCheck, CheckCircle2, Loader2, AlertTriangle } from 'lucide-react';

export const ContactSection: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'Institutional Inquiry',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<{ success: boolean; referenceId?: string; error?: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setResult(null);

    const res = await submitContactMessage(formData);
    setIsSubmitting(false);

    if (res.success) {
      setResult({ success: true, referenceId: res.referenceId });
      setFormData({ name: '', email: '', phone: '', subject: 'Institutional Inquiry', message: '' });
    } else {
      setResult({ success: false, error: res.error || 'Unable to submit message. Please try again later.' });
    }
  };

  return (
    <section id="contact-section" className="py-24 bg-[#FAFBFD] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#E6ECF5] shadow-2xs">
            <Mail className="w-3.5 h-3.5 text-[#6EA8FE]" />
            <span className="text-xs font-mono font-bold text-[#6EA8FE] uppercase tracking-widest">
              Direct Technical Support
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-extrabold text-[#23324D] tracking-tight font-display">
            GET IN TOUCH WITH OUR <span className="text-[#6EA8FE]">EXPERT TEAM</span>
          </h1>

          <p className="text-[#5F708A] text-base font-light leading-relaxed">
            Have questions about rate contracts, bulk procurement, or technical specifications? Fill in the form below to receive an instant response.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Contact Info Cards */}
          <div className="lg:col-span-5 space-y-4">
            
            <div className="p-6 rounded-3xl bg-white border border-[#E6ECF5] shadow-2xs space-y-6">
              <h3 className="text-lg font-bold text-[#23324D] font-display flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#6EA8FE]" /> Official Supplier Helpdesk
              </h3>

              <div className="space-y-4 text-xs">
                <div className="flex items-start gap-3 text-[#5F708A]">
                  <MapPin className="w-5 h-5 text-[#6EA8FE] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-[#23324D] block font-bold">Registered Office</strong>
                    A-126, Fateh Nagar, New Delhi, Delhi, 110018
                  </div>
                </div>

                <div className="flex items-center gap-3 text-[#5F708A]">
                  <Mail className="w-5 h-5 text-[#6EA8FE] shrink-0" />
                  <div>
                    <strong className="text-[#23324D] block font-bold">Official Email</strong>
                    <a href="mailto:sales@biobusiness.in" className="text-[#6EA8FE] hover:underline font-mono">
                      sales@biobusiness.in
                    </a>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-[#E6ECF5] text-[11px] text-[#9AA7BC] font-mono leading-relaxed">
                Operating Hours: Monday – Saturday (9:00 AM – 6:30 PM IST). Inquiries received after hours will be answered next business morning.
              </div>
            </div>

          </div>

          {/* Right Column: Contact Form */}
          <div className="lg:col-span-7">
            <div className="p-8 sm:p-10 rounded-3xl bg-white border border-[#E6ECF5] shadow-2xs space-y-6">
              
              {result?.success ? (
                <div className="py-12 text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-[#EAF7F2] text-[#7CC9A5] border border-[#7CC9A5]/30 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-extrabold text-[#23324D] font-display">
                    MESSAGE SENT SUCCESSFULLY!
                  </h3>
                  <div className="p-4 rounded-2xl bg-[#FAFBFD] border border-[#E6ECF5] max-w-xs mx-auto space-y-1">
                    <div className="text-xs text-[#5F708A] font-mono">Reference ID</div>
                    <div className="text-xl font-bold font-mono text-[#6EA8FE]">
                      {result.referenceId}
                    </div>
                  </div>
                  <p className="text-xs text-[#5F708A] max-w-sm mx-auto font-light leading-relaxed">
                    Thank you for reaching out. An automated confirmation email has been dispatched to your inbox.
                  </p>
                  <button
                    onClick={() => setResult(null)}
                    className="px-6 py-2.5 rounded-xl bg-[#6EA8FE] text-white font-bold text-xs cursor-pointer"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  
                  {result?.success === false && (
                    <div className="p-4 rounded-2xl bg-[#FCECEF] border border-[#F28B82]/30 flex items-start gap-3 text-xs text-[#23324D]">
                      <AlertTriangle className="w-5 h-5 text-[#F28B82] shrink-0 mt-0.5" />
                      <div>
                        <div className="font-bold">Submission Error</div>
                        <div className="font-light text-[#5F708A] mt-0.5">{result.error}</div>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-[#23324D] mb-1">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Dr. Rajesh Kumar"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-[#FAFBFD] border border-[#E6ECF5] text-xs text-[#23324D] placeholder-[#9AA7BC] focus:outline-none focus:border-[#6EA8FE]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#23324D] mb-1">
                        Official Email *
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="rajesh@iitd.ac.in"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-[#FAFBFD] border border-[#E6ECF5] text-xs text-[#23324D] placeholder-[#9AA7BC] focus:outline-none focus:border-[#6EA8FE]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-[#23324D] mb-1">
                        Phone / WhatsApp (Optional)
                      </label>
                      <input
                        type="tel"
                        placeholder="+91 98765 43210"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-[#FAFBFD] border border-[#E6ECF5] text-xs text-[#23324D] placeholder-[#9AA7BC] focus:outline-none focus:border-[#6EA8FE]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#23324D] mb-1">
                        Subject *
                      </label>
                      <select
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-[#FAFBFD] border border-[#E6ECF5] text-xs text-[#23324D] focus:outline-none focus:border-[#6EA8FE]"
                      >
                        <option value="Institutional Inquiry">Institutional Inquiry</option>
                        <option value="GeM Rate Contract">GeM Rate Contract</option>
                        <option value="Product Calibration / Service">Product Calibration / Service</option>
                        <option value="Bulk Order Quote">Bulk Order Quote</option>
                        <option value="Other Technical Request">Other Technical Request</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#23324D] mb-1">
                      Message / Requirement Details *
                    </label>
                    <textarea
                      required
                      rows={4}
                      placeholder="Please specify your product models, quantity requirements, or inquiry..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-[#FAFBFD] border border-[#E6ECF5] text-xs text-[#23324D] placeholder-[#9AA7BC] focus:outline-none focus:border-[#6EA8FE]"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full py-4 rounded-xl text-white font-extrabold text-xs shadow-2xs flex items-center justify-center gap-2 transition-all ${
                      isSubmitting
                        ? 'bg-[#6EA8FE]/60 cursor-not-allowed'
                        : 'bg-[#6EA8FE] hover:bg-[#5B95F5] cursor-pointer'
                    }`}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" /> Submitting Message...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" /> Send Direct Inquiry Message
                      </>
                    )}
                  </button>
                </form>
              )}

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
