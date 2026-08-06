import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { useQuoteStore } from '../../store/useQuoteStore';
import { submitQuoteRequest } from '../../services/api';
import { X, Trash2, Plus, Minus, Send, CheckCircle2, ShoppingBag, Loader2, AlertTriangle, Sparkles, FlaskConical } from 'lucide-react';

interface QuoteDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const QuoteDrawer: React.FC<QuoteDrawerProps> = ({ isOpen, onClose }) => {
  const { items, updateQuantity, removeItem, clearQuote } = useQuoteStore();

  const [formData, setFormData] = useState({
    institution: '',
    email: '',
    phone: '',
    gstin: '',
    tenderRef: '',
    notes: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<{ success: boolean; referenceId?: string; error?: string } | null>(null);

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmissionResult(null);

    const result = await submitQuoteRequest({
      institution: formData.institution,
      email: formData.email,
      phone: formData.phone,
      gstin: formData.gstin,
      tenderRef: formData.tenderRef,
      notes: formData.notes,
      items,
    });

    setIsSubmitting(false);

    if (result.success) {
      setSubmissionResult({ success: true, referenceId: result.referenceId });

      confetti({
        particleCount: 90,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#6EA8FE', '#F28B82', '#7CC9A5'],
      });

      setTimeout(() => {
        clearQuote();
        setSubmissionResult(null);
        setFormData({ institution: '', email: '', phone: '', gstin: '', tenderRef: '', notes: '' });
        onClose();
      }, 3500);
    } else {
      setSubmissionResult({ success: false, error: result.error || 'Unable to submit request. Please try again later.' });
    }
  };

  if (!isOpen) return null;

  const drawerContent = (
    <AnimatePresence>
      <div className="fixed inset-0 z-[99999] overflow-hidden">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-[#23324D]/60 backdrop-blur-md z-[99999]"
        />

        <div className="fixed inset-y-0 right-0 max-w-full flex pl-10 z-[100000]">
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="w-screen max-w-md bg-white border-l border-[#E6ECF5] shadow-2xl flex flex-col justify-between"
          >
            {/* Header */}
            <div className="p-6 border-b border-[#E6ECF5] flex items-center justify-between bg-[#FAFBFD]">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-[#6EA8FE]" />
                <h2 className="text-lg font-bold text-[#23324D] font-display">
                  INSTITUTIONAL QUOTE BASKET
                </h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-full bg-white border border-[#E6ECF5] text-[#5F708A] hover:text-[#23324D] transition-all cursor-pointer shadow-2xs"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content Body with data-lenis-prevent */}
            <div data-lenis-prevent className="p-6 overflow-y-auto space-y-6 flex-1 bg-white">
              
              {/* Submission Result Feedback */}
              {submissionResult?.success ? (
                <div className="py-16 text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-[#EAF7F2] text-[#7CC9A5] border border-[#7CC9A5]/30 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-extrabold text-[#23324D] font-display">
                    REQUEST SUBMITTED!
                  </h3>
                  <div className="p-4 rounded-2xl bg-[#FAFBFD] border border-[#E6ECF5] max-w-xs mx-auto space-y-1">
                    <div className="text-xs text-[#5F708A] font-mono">Reference ID</div>
                    <div className="text-xl font-bold font-mono text-[#6EA8FE]">
                      {submissionResult.referenceId}
                    </div>
                  </div>
                  <p className="text-xs text-[#5F708A] max-w-xs mx-auto font-light leading-relaxed">
                    Our technical procurement team has received your request and will email an official proforma invoice shortly.
                  </p>
                </div>
              ) : items.length === 0 ? (
                <div className="py-20 text-center space-y-3">
                  <ShoppingBag className="w-12 h-12 text-[#9AA7BC] mx-auto" />
                  <h3 className="text-lg font-bold text-[#23324D]">Your basket is empty</h3>
                  <p className="text-xs text-[#5F708A] font-light">
                    Browse our catalogue and click "Add to Quote Basket" to generate a formal quote.
                  </p>
                </div>
              ) : (
                <>
                  {/* Error Notification Alert */}
                  {submissionResult?.success === false && (
                    <div className="p-4 rounded-2xl bg-[#FCECEF] border border-[#F28B82]/30 flex items-start gap-3 text-xs text-[#23324D]">
                      <AlertTriangle className="w-5 h-5 text-[#F28B82] shrink-0 mt-0.5" />
                      <div>
                        <div className="font-bold">Submission Error</div>
                        <div className="font-light text-[#5F708A] mt-0.5">{submissionResult.error}</div>
                      </div>
                    </div>
                  )}

                  {/* Items List */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs font-mono text-[#5F708A]">
                      <span>Selected Items ({items.length})</span>
                      <button
                        onClick={clearQuote}
                        className="text-[#F28B82] hover:underline cursor-pointer"
                      >
                        Clear All
                      </button>
                    </div>

                    {items.map(({ product, quantity }) => {
                      const isSpecialInquiry =
                        product.sku === 'QUALIKEMS-SPECIAL' ||
                        product.id.includes('qualikems-custom') ||
                        product.id.includes('custom-inquiry');

                      const isChemical =
                        isSpecialInquiry ||
                        product.category?.toLowerCase().includes('chemical') ||
                        product.brand?.toLowerCase().includes('qualikems') ||
                        product.manufacturer?.toLowerCase().includes('qualikems') ||
                        product.id.includes('qualikems');

                      return (
                        <div
                          key={product.id}
                          className={`p-3.5 rounded-2xl border flex items-center justify-between gap-3 ${
                            isSpecialInquiry
                              ? 'bg-[#ECFDF5] border-emerald-300'
                              : isChemical
                              ? 'bg-emerald-50/40 border-emerald-200'
                              : 'bg-[#FAFBFD] border-[#E6ECF5]'
                          }`}
                        >
                          <div className="w-12 h-12 rounded-xl bg-white border border-[#E6ECF5] p-1 flex items-center justify-center shrink-0">
                            {isSpecialInquiry ? (
                              <Sparkles className="w-6 h-6 text-emerald-600" />
                            ) : isChemical ? (
                              <FlaskConical className="w-6 h-6 text-emerald-600" />
                            ) : (
                              <img
                                src={product.image}
                                alt={product.name}
                                className="w-full h-full object-contain"
                              />
                            )}
                          </div>

                          <div className="flex-1 overflow-hidden">
                            {isSpecialInquiry && (
                              <span className="px-2 py-0.5 rounded-md bg-emerald-600 text-white text-[9px] font-mono font-bold uppercase tracking-wider inline-block mb-1">
                                Special Request
                              </span>
                            )}
                            <h4 className="text-xs font-bold text-[#23324D] font-display leading-snug line-clamp-2">
                              {product.name}
                            </h4>
                            <div className="text-[10px] font-mono text-[#5F708A] mt-0.5">
                              SKU: {product.sku} {product.model && product.model !== 'undefined' ? `| ${product.model}` : ''}
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5 bg-white border border-[#E6ECF5] rounded-lg p-1 shrink-0">
                            <button
                              onClick={() => updateQuantity(product.id, quantity - 1)}
                              className="p-1 text-[#5F708A] hover:text-[#23324D]"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="text-xs font-bold text-[#23324D] px-1 font-mono">{quantity}</span>
                            <button
                              onClick={() => updateQuantity(product.id, quantity + 1)}
                              className="p-1 text-[#5F708A] hover:text-[#23324D]"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          <button
                            onClick={() => removeItem(product.id)}
                            className="p-1.5 text-[#9AA7BC] hover:text-[#F28B82] transition-colors shrink-0"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      );
                    })}
                  </div>

                  {/* Submission Form */}
                  <form onSubmit={handleSubmit} className="pt-4 border-t border-[#E6ECF5] space-y-3">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-[#23324D] font-display">
                      INSTITUTIONAL DETAILS
                    </h3>

                    <div>
                      <input
                        type="text"
                        required
                        placeholder="Institution / University / Company Name *"
                        value={formData.institution}
                        onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAFBFD] border border-[#E6ECF5] text-xs text-[#23324D] placeholder-[#9AA7BC] focus:outline-none focus:border-[#6EA8FE]"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="email"
                        required
                        placeholder="Official Email *"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAFBFD] border border-[#E6ECF5] text-xs text-[#23324D] placeholder-[#9AA7BC] focus:outline-none focus:border-[#6EA8FE]"
                      />
                      <input
                        type="tel"
                        required
                        placeholder="Phone / WhatsApp *"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAFBFD] border border-[#E6ECF5] text-xs text-[#23324D] placeholder-[#9AA7BC] focus:outline-none focus:border-[#6EA8FE]"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        placeholder="GSTIN (Optional)"
                        value={formData.gstin}
                        onChange={(e) => setFormData({ ...formData, gstin: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAFBFD] border border-[#E6ECF5] text-xs text-[#23324D] placeholder-[#9AA7BC] focus:outline-none focus:border-[#6EA8FE]"
                      />
                      <input
                        type="text"
                        placeholder="Tender Ref (Optional)"
                        value={formData.tenderRef}
                        onChange={(e) => setFormData({ ...formData, tenderRef: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAFBFD] border border-[#E6ECF5] text-xs text-[#23324D] placeholder-[#9AA7BC] focus:outline-none focus:border-[#6EA8FE]"
                      />
                    </div>

                    <div>
                      <textarea
                        rows={2}
                        placeholder="Additional specs, delivery timeline, or BOQ notes..."
                        value={formData.notes}
                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAFBFD] border border-[#E6ECF5] text-xs text-[#23324D] placeholder-[#9AA7BC] focus:outline-none focus:border-[#6EA8FE]"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={`w-full py-3.5 rounded-xl text-white font-extrabold text-xs shadow-2xs flex items-center justify-center gap-2 transition-all ${
                        isSubmitting
                          ? 'bg-[#6EA8FE]/60 cursor-not-allowed'
                          : 'bg-[#6EA8FE] hover:bg-[#5B95F5] cursor-pointer'
                      }`}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" /> Submitting Request...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" /> Request Official Proforma Quotation
                        </>
                      )}
                    </button>
                  </form>
                </>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-[#E6ECF5] bg-[#FAFBFD] text-center text-[10px] text-[#9AA7BC] font-mono">
              🛡️ Official GSTIN Invoice & Rate Contract Compliant
            </div>
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );

  return ReactDOM.createPortal(drawerContent, document.body);
};
