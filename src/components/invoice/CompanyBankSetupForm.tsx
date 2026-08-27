import React, { useState } from 'react';
import { CompanyInvoiceConfig } from '../../config/invoiceConfig';
import { getStoredCompanyConfig, saveStoredCompanyConfig } from '../../utils/companyConfigStorage';
import { verifyPassword, saveStoredPassword } from '../../utils/authStorage';
import { Save, CheckCircle2, Building2, CreditCard, ShieldCheck, Lock, KeyRound, AlertCircle, Eye, EyeOff } from 'lucide-react';

export const CompanyBankSetupForm: React.FC = () => {
  const [config, setConfig] = useState<CompanyInvoiceConfig>(getStoredCompanyConfig());
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Password Management State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPasswords, setShowPasswords] = useState(false);
  const [passError, setPassError] = useState('');
  const [passSuccess, setPassSuccess] = useState('');

  const handleFieldChange = (field: keyof CompanyInvoiceConfig, value: any) => {
    setConfig((prev) => ({ ...prev, [field]: value }));
  };

  const handleBankDetailChange = (field: keyof CompanyInvoiceConfig['bankDetails'], value: string) => {
    setConfig((prev) => ({
      ...prev,
      bankDetails: {
        ...prev.bankDetails,
        [field]: value
      }
    }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    saveStoredCompanyConfig(config);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handlePasswordChangeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPassError('');
    setPassSuccess('');

    if (!currentPassword.trim()) {
      setPassError('Please enter your current password.');
      return;
    }

    if (!verifyPassword(currentPassword.trim())) {
      setPassError('Current password is incorrect.');
      return;
    }

    if (!newPassword.trim()) {
      setPassError('Please enter a new password.');
      return;
    }

    if (newPassword.length < 4) {
      setPassError('New password must be at least 4 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPassError('New password and confirm password do not match.');
      return;
    }

    saveStoredPassword(newPassword.trim());
    setPassSuccess('Dashboard password updated successfully! Future logins will require your new password.');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setTimeout(() => setPassSuccess(''), 5000);
  };

  return (
    <div className="space-y-6">
      
      {/* SECTION 0: Security & Password Management */}
      <div className="bg-white p-6 rounded-2xl border border-[#E6ECF5] shadow-2xs space-y-4">
        <div className="flex items-center justify-between border-b border-[#E6ECF5] pb-3">
          <div>
            <h3 className="text-base font-bold text-[#23324D] flex items-center gap-2">
              <Lock className="w-4 h-4 text-[#6EA8FE]" /> Dashboard Access Password & Security
            </h3>
            <p className="text-xs text-[#5F708A] mt-0.5">
              Change the password used to access the Admin Portal, Dashboard & Tax Invoice Maker.
            </p>
          </div>
        </div>

        {passError && (
          <div className="p-3 bg-[#FCECEF] text-[#C42828] border border-[#F8B4BF] rounded-xl text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" /> {passError}
          </div>
        )}

        {passSuccess && (
          <div className="p-3 bg-[#EAF7F2] text-[#1B6D4A] border border-[#A8E6CE] rounded-xl text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#1B6D4A]" /> {passSuccess}
          </div>
        )}

        <form onSubmit={handlePasswordChangeSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
          <div>
            <label className="block text-xs font-semibold text-[#5F708A] mb-1">
              Current Password
            </label>
            <div className="relative">
              <input
                type={showPasswords ? 'text' : 'password'}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Current password"
                className="w-full px-3 py-2 text-sm border border-[#E6ECF5] rounded-xl focus:ring-2 focus:ring-[#6EA8FE] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#5F708A] mb-1">
              New Password
            </label>
            <input
              type={showPasswords ? 'text' : 'password'}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="New password"
              className="w-full px-3 py-2 text-sm border border-[#E6ECF5] rounded-xl focus:ring-2 focus:ring-[#6EA8FE] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#5F708A] mb-1">
              Confirm New Password
            </label>
            <input
              type={showPasswords ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              className="w-full px-3 py-2 text-sm border border-[#E6ECF5] rounded-xl focus:ring-2 focus:ring-[#6EA8FE] focus:outline-none"
            />
          </div>

          <div className="md:col-span-3 flex flex-wrap items-center justify-between gap-3 pt-2">
            <button
              type="button"
              onClick={() => setShowPasswords(!showPasswords)}
              className="text-xs text-[#6EA8FE] hover:underline flex items-center gap-1 cursor-pointer"
            >
              {showPasswords ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              {showPasswords ? 'Hide Password Text' : 'Show Password Text'}
            </button>

            <button
              type="submit"
              className="px-4 py-2 bg-[#23324D] hover:bg-[#1A263B] text-white text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <KeyRound className="w-3.5 h-3.5 text-[#6EA8FE]" /> Update Dashboard Password
            </button>
          </div>
        </form>
      </div>

    <form onSubmit={handleSave} className="bg-white p-6 rounded-2xl border border-[#E6ECF5] shadow-2xs space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E6ECF5] pb-4">
        <div>
          <h3 className="text-lg font-bold text-[#23324D] flex items-center gap-2">
            <span>⚙️</span> Company & Bank Setup
          </h3>
          <p className="text-xs text-[#5F708A] mt-0.5">
            Configure central bank account details, payment terms, jurisdiction, and company signatories for all tax invoices.
          </p>
        </div>

        <button
          type="submit"
          className="px-4 py-2 bg-[#23324D] hover:bg-[#1A263B] text-white text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
        >
          <Save className="w-4 h-4 text-[#6EA8FE]" /> Save Configuration
        </button>
      </div>

      {savedSuccess && (
        <div className="p-3 bg-[#EAF7F2] text-[#1B6D4A] border border-[#A8E6CE] rounded-xl text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-[#1B6D4A]" /> Central Company & Bank Configuration Saved Successfully!
        </div>
      )}

      {/* SECTION 1: Bank Account Details */}
      <div className="space-y-4">
        <h4 className="text-sm font-bold text-[#23324D] flex items-center gap-2 border-b border-[#E6ECF5] pb-2">
          <CreditCard className="w-4 h-4 text-[#6EA8FE]" /> Bank Account Details (Appears on Tax Invoice)
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[#5F708A] mb-1">
              Bank Name
            </label>
            <input
              type="text"
              value={config.bankDetails.bankName}
              onChange={(e) => handleBankDetailChange('bankName', e.target.value)}
              placeholder="e.g. HDFC BANK LTD."
              className="w-full px-3 py-2 text-sm border border-[#E6ECF5] rounded-xl focus:ring-2 focus:ring-[#6EA8FE] focus:outline-none uppercase font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#5F708A] mb-1">
              Branch & City
            </label>
            <input
              type="text"
              value={config.bankDetails.branch}
              onChange={(e) => handleBankDetailChange('branch', e.target.value)}
              placeholder="e.g. VIKASPURI, NEW DELHI - 110018"
              className="w-full px-3 py-2 text-sm border border-[#E6ECF5] rounded-xl focus:ring-2 focus:ring-[#6EA8FE] focus:outline-none uppercase"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#5F708A] mb-1">
              Account Beneficiary Name
            </label>
            <input
              type="text"
              value={config.bankDetails.beneficiary}
              onChange={(e) => handleBankDetailChange('beneficiary', e.target.value)}
              placeholder="e.g. BIOBUSINESS DEVELOPMENT AGENCY"
              className="w-full px-3 py-2 text-sm border border-[#E6ECF5] rounded-xl focus:ring-2 focus:ring-[#6EA8FE] focus:outline-none uppercase font-bold"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#5F708A] mb-1">
              Account Number
            </label>
            <input
              type="text"
              value={config.bankDetails.accountNumber}
              onChange={(e) => handleBankDetailChange('accountNumber', e.target.value)}
              placeholder="e.g. 50200028491823"
              className="w-full px-3 py-2 text-sm border border-[#E6ECF5] rounded-xl focus:ring-2 focus:ring-[#6EA8FE] focus:outline-none font-mono font-bold"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#5F708A] mb-1">
              IFSC Code
            </label>
            <input
              type="text"
              value={config.bankDetails.ifsc}
              onChange={(e) => handleBankDetailChange('ifsc', e.target.value)}
              placeholder="e.g. HDFC0000451"
              className="w-full px-3 py-2 text-sm border border-[#E6ECF5] rounded-xl focus:ring-2 focus:ring-[#6EA8FE] focus:outline-none uppercase font-mono font-bold"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#5F708A] mb-1">
              MICR Code
            </label>
            <input
              type="text"
              value={config.bankDetails.micr}
              onChange={(e) => handleBankDetailChange('micr', e.target.value)}
              placeholder="e.g. 110240066"
              className="w-full px-3 py-2 text-sm border border-[#E6ECF5] rounded-xl focus:ring-2 focus:ring-[#6EA8FE] focus:outline-none font-mono"
            />
          </div>
        </div>
      </div>

      {/* SECTION 2: Company Signatory & Terms */}
      <div className="space-y-4">
        <h4 className="text-sm font-bold text-[#23324D] flex items-center gap-2 border-b border-[#E6ECF5] pb-2">
          <Building2 className="w-4 h-4 text-[#6EA8FE]" /> Company Name, Signatory & Payment Terms
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[#5F708A] mb-1">
              Authorised Signatory Company Heading
            </label>
            <input
              type="text"
              value={config.signatoryHeading}
              onChange={(e) => handleFieldChange('signatoryHeading', e.target.value)}
              placeholder="e.g. For Biobusiness Development Agency"
              className="w-full px-3 py-2 text-sm border border-[#E6ECF5] rounded-xl focus:ring-2 focus:ring-[#6EA8FE] focus:outline-none font-bold"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#5F708A] mb-1">
              Contact Phone Number
            </label>
            <input
              type="text"
              value={config.contactNumber}
              onChange={(e) => handleFieldChange('contactNumber', e.target.value)}
              placeholder="e.g. 9899571171"
              className="w-full px-3 py-2 text-sm border border-[#E6ECF5] rounded-xl focus:ring-2 focus:ring-[#6EA8FE] focus:outline-none font-mono"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-[#5F708A] mb-1">
              Default Terms for Payment
            </label>
            <textarea
              rows={2}
              value={config.defaultPaymentTerms}
              onChange={(e) => handleFieldChange('defaultPaymentTerms', e.target.value)}
              placeholder="Payment, within 20 days from the date of submission of the invoice..."
              className="w-full px-3 py-2 text-xs border border-[#E6ECF5] rounded-xl focus:ring-2 focus:ring-[#6EA8FE] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#5F708A] mb-1">
              Jurisdiction Clause
            </label>
            <input
              type="text"
              value={config.defaultJurisdiction}
              onChange={(e) => handleFieldChange('defaultJurisdiction', e.target.value)}
              placeholder="e.g. All disputes are subject to jurisdiction Delhi only"
              className="w-full px-3 py-2 text-xs border border-[#E6ECF5] rounded-xl focus:ring-2 focus:ring-[#6EA8FE] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#5F708A] mb-1">
              Payment Interest Note
            </label>
            <input
              type="text"
              value={config.defaultPaymentNote}
              onChange={(e) => handleFieldChange('defaultPaymentNote', e.target.value)}
              placeholder="e.g. If the Invoice not paid within the due date, an interest @18% PA will be charged..."
              className="w-full px-3 py-2 text-xs border border-[#E6ECF5] rounded-xl focus:ring-2 focus:ring-[#6EA8FE] focus:outline-none"
            />
          </div>
        </div>
      </div>
    </form>
  </div>
);
};
