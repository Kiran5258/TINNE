import React, { useState, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAmbassadorStore } from '../services/useAmbassadorStore';

// ─── Types ───────────────────────────────────────────────────────────────────
type FormData = {
  fullName: string; mobileNumber: string; whatsAppNumber: string;
  email: string; dateOfBirth: string;
  streetAddress: string; villageOrCity: string; district: string;
  state: string; pinCode: string;
  aadhaarNumber: string;
  accountHolderName: string; bankName: string; accountNumber: string;
  ifscCode: string; upiId: string;
  occupation: string; collegeName: string; companyName: string;
  socialMediaLink: string;
  referralCode: string; packageSelected: 'starter' | 'premium' | '';
  photoBase64: string; aadhaarCardBase64: string; bankPassbookBase64: string;
  declarationAccurate: boolean; declarationTerms: boolean;
  declarationCommission: boolean; declarationConsent: boolean;
  signatureName: string; signaturePlace: string;
};

type Errors = Partial<Record<keyof FormData, string>>;

// ─── Steps meta ──────────────────────────────────────────────────────────────
const STEPS = [
  { id: 1, label: 'Personal' },
  { id: 2, label: 'Address' },
  { id: 3, label: 'Identity' },
  { id: 4, label: 'Banking' },
  { id: 5, label: 'Professional' },
  { id: 6, label: 'Package' },
  { id: 7, label: 'Documents' },
  { id: 8, label: 'Declaration' },
];

const INITIAL: FormData = {
  fullName: '', mobileNumber: '', whatsAppNumber: '', email: '', dateOfBirth: '',
  streetAddress: '', villageOrCity: '', district: '', state: '', pinCode: '',
  aadhaarNumber: '',
  accountHolderName: '', bankName: '', accountNumber: '', ifscCode: '', upiId: '',
  occupation: '', collegeName: '', companyName: '', socialMediaLink: '',
  referralCode: '', packageSelected: '',
  photoBase64: '', aadhaarCardBase64: '', bankPassbookBase64: '',
  declarationAccurate: false, declarationTerms: false,
  declarationCommission: false, declarationConsent: false,
  signatureName: '', signaturePlace: '',
};

// ─── Helper: file to base64 ──────────────────────────────────────────────────
const toBase64 = (file: File): Promise<string> =>
  new Promise((res, rej) => {
    const reader = new FileReader();
    reader.onload = () => res(reader.result as string);
    reader.onerror = rej;
    reader.readAsDataURL(file);
  });

// ─── Field Components ─────────────────────────────────────────────────────────
const Field: React.FC<{
  label: string; required?: boolean; hint?: string; error?: string; children: React.ReactNode;
}> = ({ label, required, hint, error, children }) => (
  <div className="flex flex-col gap-1">
    <label className="text-sm font-semibold text-neutral-700">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    {hint && <p className="text-xs text-neutral-400 -mt-1">{hint}</p>}
    {children}
    {error && <p className="text-xs text-red-500 mt-0.5">{error}</p>}
  </div>
);

const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement> & { error?: string }> = ({ error, ...props }) => (
  <input
    {...props}
    className={`w-full px-4 py-3 rounded-xl border text-sm transition-all duration-200 outline-none
      bg-white focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400
      ${error ? 'border-red-400 bg-red-50' : 'border-neutral-200 hover:border-neutral-300'}
      ${props.className || ''}`}
  />
);

// ─── Main Component ───────────────────────────────────────────────────────────
export const Ambassador: React.FC = () => {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormData>(INITIAL);
  const [errors, setErrors] = useState<Errors>({});
  const [previews, setPreviews] = useState<{ photo?: string; aadhaar?: string; passbook?: string }>({});
  const topRef = useRef<HTMLDivElement>(null);

  const { isSubmitting, submitSuccess, submitError, submitAmbassador, resetState } = useAmbassadorStore();

  const set = useCallback((key: keyof FormData, value: any) => {
    setForm(prev => ({ ...prev, [key]: value }));
    setErrors(prev => ({ ...prev, [key]: undefined }));
  }, []);

  // ── Validation per step ────────────────────────────────────────────────────
  const validate = (): boolean => {
    const errs: Errors = {};
    if (step === 1) {
      if (!form.fullName.trim()) errs.fullName = 'Full name is required';
      if (!form.mobileNumber.trim()) errs.mobileNumber = 'Mobile number is required';
      else if (!/^\d{10}$/.test(form.mobileNumber.trim())) errs.mobileNumber = 'Enter a valid 10-digit number';
    }
    if (step === 2) {
      if (!form.streetAddress.trim()) errs.streetAddress = 'Street address is required';
      if (!form.villageOrCity.trim()) errs.villageOrCity = 'Village / City is required';
      if (!form.district.trim()) errs.district = 'District is required';
      if (!form.state.trim()) errs.state = 'State is required';
      if (!form.pinCode.trim()) errs.pinCode = 'PIN Code is required';
      else if (!/^\d{6}$/.test(form.pinCode.trim())) errs.pinCode = 'Enter a valid 6-digit PIN code';
    }
    if (step === 3) {
      if (!form.aadhaarNumber.trim()) errs.aadhaarNumber = 'Aadhaar number is required';
      else if (!/^\d{12}$/.test(form.aadhaarNumber.replace(/\s/g, ''))) errs.aadhaarNumber = 'Enter a valid 12-digit Aadhaar number';
    }
    if (step === 4) {
      if (!form.accountHolderName.trim()) errs.accountHolderName = 'Account holder name is required';
      if (!form.bankName.trim()) errs.bankName = 'Bank name is required';
      if (!form.accountNumber.trim()) errs.accountNumber = 'Account number is required';
      if (!form.ifscCode.trim()) errs.ifscCode = 'IFSC code is required';
      else if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(form.ifscCode.trim().toUpperCase())) errs.ifscCode = 'Enter a valid IFSC code (e.g. SBIN0001234)';
    }
    if (step === 6) {
      if (!form.packageSelected) errs.packageSelected = 'Please select a package to continue';
    }
    if (step === 8) {
      if (!form.declarationAccurate) errs.declarationAccurate = 'Please confirm the information is accurate';
      if (!form.declarationTerms) errs.declarationTerms = 'You must agree to the Terms & Conditions';
      if (!form.declarationCommission) errs.declarationCommission = 'Please acknowledge the commission policy';
      if (!form.declarationConsent) errs.declarationConsent = 'Communication consent is required';
      if (!form.signatureName.trim()) errs.signatureName = 'Signature name is required';
      if (!form.signaturePlace.trim()) errs.signaturePlace = 'Place is required';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const next = () => {
    if (!validate()) return;
    setStep(s => Math.min(s + 1, 8));
    topRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const back = () => {
    setStep(s => Math.max(s - 1, 1));
    topRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
    field: 'photoBase64' | 'aadhaarCardBase64' | 'bankPassbookBase64',
    previewKey: 'photo' | 'aadhaar' | 'passbook'
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const b64 = await toBase64(file);
    set(field, b64);
    setPreviews(prev => ({ ...prev, [previewKey]: b64 }));
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    await submitAmbassador(form as any);
  };

  // ── Progress ───────────────────────────────────────────────────────────────
  const progress = Math.round(((step - 1) / (STEPS.length - 1)) * 100);

  // ── Success Screen ────────────────────────────────────────────────────────
  if (submitSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-emerald-50 flex items-center justify-center px-4 pt-24 pb-16">
        <div className="max-w-lg w-full text-center">
          <div className="w-24 h-24 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-emerald-200">
            <svg className="w-12 h-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-3xl font-display font-bold text-neutral-900 mb-3">Application Submitted!</h1>
          <p className="text-neutral-500 mb-2 text-base leading-relaxed">
            Thank you, <strong>{form.fullName}</strong>! Your Tinné Sales Ambassador registration has been received.
          </p>
          <p className="text-neutral-400 text-sm mb-8">Our team will review your application and contact you on <strong>{form.mobileNumber}</strong> within 2–3 business days.</p>
          <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 p-6 mb-8 text-left space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-neutral-500">Package</span>
              <span className="font-semibold text-neutral-800">
                {form.packageSelected === 'starter' ? 'Starter Ambassador – Rs.999' : 'Premium Ambassador – Rs.3,333'}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-neutral-500">Status</span>
              <span className="font-semibold text-amber-600">Pending Review</span>
            </div>
          </div>
          <div className="flex gap-3 justify-center">
            <Link to="/" className="px-6 py-3 bg-neutral-900 text-white rounded-full text-sm font-semibold hover:bg-neutral-800 transition-colors">
              Back to Home
            </Link>
            <button
              onClick={() => { resetState(); setForm(INITIAL); setStep(1); }}
              className="px-6 py-3 border border-neutral-200 rounded-full text-sm font-semibold text-neutral-600 hover:border-neutral-300 transition-colors"
            >
              Submit Another
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div ref={topRef} className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50 pt-24 pb-20 px-4">

      {/* Hero Banner */}
      <div className="max-w-3xl mx-auto mb-10 text-center">
        <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-700 text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full mb-4">
          Sales Ambassador Program
        </div>
        <h1 className="text-4xl md:text-5xl font-display font-bold text-neutral-900 mb-4 leading-tight">
          Join the <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-500">Tinné Family</span>
        </h1>
        <p className="text-neutral-500 text-base max-w-xl mx-auto leading-relaxed">
          Become a Tinné Sales Ambassador and earn commissions promoting pure, organic products
          from your community. Fill in the details below to get started.
        </p>
      </div>

      {/* Step Indicator */}
      <div className="max-w-3xl mx-auto mb-8">
        {/* Progress bar */}
        <div className="h-2 bg-neutral-100 rounded-full mb-6 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
        {/* Step pills */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          {STEPS.map(s => (
            <button
              key={s.id}
              onClick={() => step > s.id && setStep(s.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 flex-shrink-0
                ${step === s.id
                  ? 'bg-gradient-to-r from-amber-400 to-orange-500 text-white shadow-sm shadow-amber-200'
                  : step > s.id
                    ? 'bg-emerald-100 text-emerald-700 cursor-pointer hover:bg-emerald-200'
                    : 'bg-neutral-100 text-neutral-400 cursor-not-allowed'}`}
            >
              <span className="w-4 h-4 rounded-full border flex items-center justify-center text-[10px] font-bold
                border-current leading-none">
                {step > s.id ? '✓' : s.id}
              </span>
              <span>{s.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Form Card */}
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-3xl shadow-xl shadow-neutral-100 border border-neutral-100 overflow-hidden">

          {/* Card Header */}
          <div className="bg-gradient-to-r from-neutral-900 to-neutral-800 px-8 py-6">
            <div>
              <p className="text-amber-400 text-xs font-bold uppercase tracking-widest">Step {step} of {STEPS.length}</p>
              <h2 className="text-white text-xl font-display font-bold mt-1">
                {step === 1 && 'Personal Information'}
                {step === 2 && 'Address Details'}
                {step === 3 && 'Identity Verification'}
                {step === 4 && 'Banking Details'}
                {step === 5 && 'Professional Information'}
                {step === 6 && 'Ambassador Package'}
                {step === 7 && 'Document Uploads'}
                {step === 8 && 'Declaration & Consent'}
              </h2>
            </div>
          </div>

          {/* Card Body */}
          <div className="p-8 space-y-6">

            {/* STEP 1: Personal */}
            {step === 1 && (
              <>
                <Field label="Full Name (as per Bank Account)" required error={errors.fullName}>
                  <Input id="fullName" placeholder="e.g. Ravi Kumar S" value={form.fullName}
                    onChange={e => set('fullName', e.target.value)} error={errors.fullName} />
                </Field>
                <Field label="Mobile Number" required error={errors.mobileNumber}>
                  <Input id="mobileNumber" type="tel" maxLength={10} placeholder="10-digit mobile number"
                    value={form.mobileNumber} onChange={e => set('mobileNumber', e.target.value.replace(/\D/g, ''))} error={errors.mobileNumber} />
                </Field>
                <Field label="WhatsApp Number" hint="Leave blank if same as mobile">
                  <Input id="whatsAppNumber" type="tel" maxLength={10} placeholder="WhatsApp number (if different)"
                    value={form.whatsAppNumber} onChange={e => set('whatsAppNumber', e.target.value.replace(/\D/g, ''))} />
                </Field>
                <Field label="Email ID" hint="Optional">
                  <Input id="email" type="email" placeholder="your@email.com"
                    value={form.email} onChange={e => set('email', e.target.value)} />
                </Field>
                <Field label="Date of Birth" hint="Optional">
                  <Input id="dateOfBirth" type="date" value={form.dateOfBirth}
                    onChange={e => set('dateOfBirth', e.target.value)} />
                </Field>
              </>
            )}

            {/* STEP 2: Address */}
            {step === 2 && (
              <>
                <Field label="House / Street Address" required error={errors.streetAddress}>
                  <textarea
                    id="streetAddress"
                    rows={2}
                    placeholder="Door no., Street name, Area..."
                    value={form.streetAddress}
                    onChange={e => set('streetAddress', e.target.value)}
                    className={`w-full px-4 py-3 rounded-xl border text-sm resize-none transition-all duration-200 outline-none
                      bg-white focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400
                      ${errors.streetAddress ? 'border-red-400 bg-red-50' : 'border-neutral-200 hover:border-neutral-300'}`}
                  />
                  {errors.streetAddress && <p className="text-xs text-red-500 mt-0.5">{errors.streetAddress}</p>}
                </Field>
                <Field label="Village / Town / City" required error={errors.villageOrCity}>
                  <Input id="villageOrCity" placeholder="e.g. Coimbatore" value={form.villageOrCity}
                    onChange={e => set('villageOrCity', e.target.value)} error={errors.villageOrCity} />
                </Field>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <Field label="District" required error={errors.district}>
                    <Input id="district" placeholder="e.g. Erode" value={form.district}
                      onChange={e => set('district', e.target.value)} error={errors.district} />
                  </Field>
                  <Field label="State" required error={errors.state}>
                    <Input id="state" placeholder="e.g. Tamil Nadu" value={form.state}
                      onChange={e => set('state', e.target.value)} error={errors.state} />
                  </Field>
                </div>
                <Field label="PIN Code" required error={errors.pinCode}>
                  <Input id="pinCode" type="text" maxLength={6} placeholder="6-digit PIN code"
                    value={form.pinCode} onChange={e => set('pinCode', e.target.value.replace(/\D/g, ''))} error={errors.pinCode} />
                </Field>
              </>
            )}

            {/* STEP 3: Identity */}
            {step === 3 && (
              <>
                <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 text-sm text-blue-700">
                  <p className="font-semibold mb-1">Secure & Encrypted</p>
                  <p>Your Aadhaar details are encrypted and stored securely. We comply with all applicable data protection regulations.</p>
                </div>
                <Field label="Aadhaar Number" required error={errors.aadhaarNumber}>
                  <Input
                    id="aadhaarNumber"
                    type="text"
                    maxLength={12}
                    placeholder="12-digit Aadhaar number"
                    value={form.aadhaarNumber}
                    onChange={e => set('aadhaarNumber', e.target.value.replace(/\D/g, ''))}
                    error={errors.aadhaarNumber}
                  />
                </Field>
              </>
            )}

            {/* STEP 4: Banking */}
            {step === 4 && (
              <>
                <Field label="Account Holder Name" required error={errors.accountHolderName}>
                  <Input id="accountHolderName" placeholder="As per bank records"
                    value={form.accountHolderName} onChange={e => set('accountHolderName', e.target.value)} error={errors.accountHolderName} />
                </Field>
                <Field label="Bank Name" required error={errors.bankName}>
                  <Input id="bankName" placeholder="e.g. State Bank of India"
                    value={form.bankName} onChange={e => set('bankName', e.target.value)} error={errors.bankName} />
                </Field>
                <Field label="Account Number" required error={errors.accountNumber}>
                  <Input id="accountNumber" type="text" placeholder="Bank account number"
                    value={form.accountNumber} onChange={e => set('accountNumber', e.target.value.replace(/\D/g, ''))} error={errors.accountNumber} />
                </Field>
                <Field label="IFSC Code" required error={errors.ifscCode} hint="e.g. SBIN0001234">
                  <Input id="ifscCode" placeholder="IFSC Code"
                    value={form.ifscCode} onChange={e => set('ifscCode', e.target.value.toUpperCase())} error={errors.ifscCode} />
                </Field>
                <Field label="UPI ID" hint="Optional">
                  <Input id="upiId" placeholder="yourname@upi"
                    value={form.upiId} onChange={e => set('upiId', e.target.value)} />
                </Field>
              </>
            )}

            {/* STEP 5: Professional */}
            {step === 5 && (
              <>
                <Field label="Occupation">
                  <Input id="occupation" placeholder="e.g. Student / Homemaker / Business"
                    value={form.occupation} onChange={e => set('occupation', e.target.value)} />
                </Field>
                <Field label="College Name" hint="If you are a student">
                  <Input id="collegeName" placeholder="College / University name"
                    value={form.collegeName} onChange={e => set('collegeName', e.target.value)} />
                </Field>
                <Field label="Company Name" hint="If you are employed">
                  <Input id="companyName" placeholder="Your employer's name"
                    value={form.companyName} onChange={e => set('companyName', e.target.value)} />
                </Field>
                <Field label="Social Media Profile Link" hint="Optional – Instagram, Facebook, YouTube, etc.">
                  <Input id="socialMediaLink" type="url" placeholder="https://instagram.com/yourhandle"
                    value={form.socialMediaLink} onChange={e => set('socialMediaLink', e.target.value)} />
                </Field>
              </>
            )}

            {/* STEP 6: Package */}
            {step === 6 && (
              <>
                <Field label="Referral Code Used" hint="Optional – enter if someone referred you">
                  <Input id="referralCode" placeholder="Enter referral code"
                    value={form.referralCode} onChange={e => set('referralCode', e.target.value.toUpperCase())} />
                </Field>

                <div>
                  <p className="text-sm font-semibold text-neutral-700 mb-3">Select Your Package <span className="text-red-500">*</span></p>
                  {errors.packageSelected && (
                    <p className="text-xs text-red-500 mb-3">{errors.packageSelected}</p>
                  )}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                    {/* Starter */}
                    <button
                      type="button"
                      id="pkg-starter"
                      onClick={() => set('packageSelected', 'starter')}
                      className={`relative p-6 rounded-2xl border-2 text-left transition-all duration-200
                        ${form.packageSelected === 'starter'
                          ? 'border-amber-400 bg-amber-50 shadow-lg shadow-amber-100'
                          : 'border-neutral-200 bg-white hover:border-amber-300 hover:shadow-md'}`}
                    >
                      {form.packageSelected === 'starter' && (
                        <span className="absolute top-3 right-3 w-6 h-6 bg-amber-400 rounded-full flex items-center justify-center text-xs text-white font-bold">✓</span>
                      )}
                      <h3 className="font-display font-bold text-lg text-neutral-900 mb-1">Starter Ambassador</h3>
                      <p className="text-3xl font-bold text-amber-600 mb-4">Rs.999</p>
                      <ul className="space-y-2 text-xs text-neutral-500">
                        <li className="flex items-center gap-2">
                          <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-[10px] font-bold flex-shrink-0">✓</span>
                          Access to all products
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-[10px] font-bold flex-shrink-0">✓</span>
                          Commission on every sale
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-[10px] font-bold flex-shrink-0">✓</span>
                          Ambassador ID and referral code
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-[10px] font-bold flex-shrink-0">✓</span>
                          WhatsApp support group
                        </li>
                      </ul>
                    </button>

                    {/* Premium */}
                    <button
                      type="button"
                      id="pkg-premium"
                      onClick={() => set('packageSelected', 'premium')}
                      className={`relative p-6 rounded-2xl border-2 text-left transition-all duration-200
                        ${form.packageSelected === 'premium'
                          ? 'border-violet-500 bg-violet-50 shadow-lg shadow-violet-100'
                          : 'border-neutral-200 bg-white hover:border-violet-300 hover:shadow-md'}`}
                    >
                      {form.packageSelected === 'premium' && (
                        <span className="absolute top-3 right-3 w-6 h-6 bg-violet-500 rounded-full flex items-center justify-center text-xs text-white font-bold">✓</span>
                      )}
                      <div className="absolute -top-2 left-4 bg-gradient-to-r from-violet-500 to-purple-600 text-white text-[10px] font-bold uppercase tracking-wider px-3 py-0.5 rounded-full">
                        Best Value
                      </div>
                      <h3 className="font-display font-bold text-lg text-neutral-900 mb-1">Premium Ambassador</h3>
                      <p className="text-3xl font-bold text-violet-600 mb-4">Rs.3,333</p>
                      <ul className="space-y-2 text-xs text-neutral-500">
                        <li className="flex items-center gap-2">
                          <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-[10px] font-bold flex-shrink-0">✓</span>
                          Everything in Starter
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-[10px] font-bold flex-shrink-0">✓</span>
                          Higher commission rates
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-[10px] font-bold flex-shrink-0">✓</span>
                          Priority onboarding support
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-[10px] font-bold flex-shrink-0">✓</span>
                          Exclusive product bundles
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-[10px] font-bold flex-shrink-0">✓</span>
                          Monthly incentive bonuses
                        </li>
                      </ul>
                    </button>

                  </div>
                </div>
              </>
            )}

            {/* STEP 7: Documents */}
            {step === 7 && (
              <>
                <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 text-sm text-amber-800">
                  <p className="font-semibold mb-1">Upload Instructions</p>
                  <p>Upload clear, readable copies. Accepted formats: JPG, PNG, PDF. Max size: 5 MB each.</p>
                </div>

                {[
                  { key: 'photoBase64' as const, previewKey: 'photo' as const, label: 'Passport-Size Photograph', accept: 'image/*' },
                  { key: 'aadhaarCardBase64' as const, previewKey: 'aadhaar' as const, label: 'Aadhaar Card Copy', accept: 'image/*,application/pdf' },
                  { key: 'bankPassbookBase64' as const, previewKey: 'passbook' as const, label: 'Bank Passbook / Cancelled Cheque', accept: 'image/*,application/pdf' },
                ].map(({ key, previewKey, label, accept }) => (
                  <div key={key}>
                    <p className="text-sm font-semibold text-neutral-700 mb-2">{label}</p>
                    <label
                      className={`flex flex-col items-center justify-center gap-2 border-2 border-dashed rounded-2xl p-6 cursor-pointer transition-all duration-200
                        ${form[key] ? 'border-emerald-400 bg-emerald-50' : 'border-neutral-200 bg-neutral-50 hover:border-amber-400 hover:bg-amber-50'}`}
                    >
                      {previews[previewKey] && previews[previewKey]!.startsWith('data:image') ? (
                        <img src={previews[previewKey]} alt="Preview" className="h-24 w-auto object-contain rounded-lg" />
                      ) : form[key] ? (
                        <div className="flex items-center gap-2 text-emerald-600 text-sm font-semibold">
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                          File uploaded
                        </div>
                      ) : (
                        <>
                          <svg className="w-10 h-10 text-neutral-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                          </svg>
                          <p className="text-sm text-neutral-400">Click to upload or drag and drop</p>
                        </>
                      )}
                      <input type="file" accept={accept} className="hidden"
                        onChange={e => handleFileChange(e, key, previewKey)} />
                    </label>
                    {form[key] && (
                      <button type="button" onClick={() => { set(key, ''); setPreviews(prev => ({ ...prev, [previewKey]: undefined })); }}
                        className="mt-1 text-xs text-red-400 hover:text-red-600 transition-colors">
                        Remove file
                      </button>
                    )}
                  </div>
                ))}
              </>
            )}

            {/* STEP 8: Declaration */}
            {step === 8 && (
              <>
                <p className="text-sm text-neutral-500 leading-relaxed">
                  Please read and confirm each statement below. All fields marked with * are required to submit your application.
                </p>

                <div className="space-y-4">
                  {[
                    { key: 'declarationAccurate' as const, text: 'The information provided by me is true and accurate.' },
                    { key: 'declarationTerms' as const, text: 'I agree to abide by the Tinné Sales Ambassador Program Terms & Conditions.' },
                    { key: 'declarationCommission' as const, text: 'I understand that commissions and incentives are based on actual product sales.' },
                    { key: 'declarationConsent' as const, text: 'I consent to receive communications from Tinné through WhatsApp, SMS, phone calls, and email regarding business activities, updates, and promotional information.' },
                  ].map(({ key, text }) => (
                    <label key={key} className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all duration-200
                      ${form[key] ? 'border-emerald-300 bg-emerald-50' : errors[key] ? 'border-red-300 bg-red-50' : 'border-neutral-200 bg-neutral-50 hover:border-neutral-300'}`}>
                      <div className={`flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center mt-0.5 transition-all
                        ${form[key] ? 'bg-emerald-500 border-emerald-500' : errors[key] ? 'border-red-400' : 'border-neutral-300'}`}>
                        {form[key] && (
                          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                      <input type="checkbox" className="hidden" checked={form[key]} onChange={e => set(key, e.target.checked)} />
                      <span className="text-sm text-neutral-700 leading-relaxed">{text}</span>
                    </label>
                  ))}
                  {(errors.declarationAccurate || errors.declarationTerms || errors.declarationCommission || errors.declarationConsent) && (
                    <p className="text-xs text-red-500">Please check all declaration boxes to continue.</p>
                  )}
                </div>

                {/* Signature */}
                <div className="border-t border-neutral-100 pt-6 mt-2">
                  <h3 className="text-sm font-bold text-neutral-700 mb-4">Applicant Signature</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Field label="Full Name (as Signature)" required error={errors.signatureName}>
                      <Input id="signatureName" placeholder="Type your full name"
                        value={form.signatureName} onChange={e => set('signatureName', e.target.value)} error={errors.signatureName} />
                    </Field>
                    <Field label="Place" required error={errors.signaturePlace}>
                      <Input id="signaturePlace" placeholder="City / Town"
                        value={form.signaturePlace} onChange={e => set('signaturePlace', e.target.value)} error={errors.signaturePlace} />
                    </Field>
                  </div>
                  {form.signatureName && (
                    <div className="mt-4 p-4 bg-neutral-50 rounded-xl border border-neutral-100">
                      <p className="text-xs text-neutral-400 mb-1">Preview:</p>
                      <p className="font-script text-2xl text-neutral-800">{form.signatureName}</p>
                      <p className="text-xs text-neutral-400 mt-1">Date: {new Date().toLocaleDateString('en-IN')} &nbsp;|&nbsp; Place: {form.signaturePlace || '—'}</p>
                    </div>
                  )}
                </div>

                {/* Error */}
                {submitError && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700">
                    {submitError}
                  </div>
                )}
              </>
            )}

          </div>{/* /Card Body */}

          {/* Navigation Buttons */}
          <div className="px-8 pb-8 flex justify-between items-center gap-4">
            <button
              type="button"
              onClick={back}
              disabled={step === 1}
              className="px-6 py-3 rounded-xl border border-neutral-200 text-sm font-semibold text-neutral-600 hover:border-neutral-300 hover:bg-neutral-50 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Back
            </button>

            {step < 8 ? (
              <button
                type="button"
                onClick={next}
                className="px-8 py-3 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 text-white text-sm font-bold shadow-md shadow-amber-200 hover:shadow-lg hover:shadow-amber-300 hover:-translate-y-0.5 transition-all duration-200"
              >
                Continue
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="px-8 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-sm font-bold shadow-md shadow-emerald-200 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                    </svg>
                    Submitting...
                  </>
                ) : 'Submit Application'}
              </button>
            )}
          </div>

        </div>{/* /Card */}

        {/* Footer note */}
        <p className="text-center text-xs text-neutral-400 mt-6">
          Your information is encrypted and stored securely. &nbsp;
          <Link to="/" className="underline hover:text-neutral-600">Return to Home</Link>
        </p>
      </div>
    </div>
  );
};
