import { create } from 'zustand';
import { axiosInstance } from '../config/axios';

interface AmbassadorFormData {
  // 1. Personal
  fullName: string;
  mobileNumber: string;
  whatsAppNumber: string;
  email: string;
  dateOfBirth: string;
  // 2. Address
  streetAddress: string;
  villageOrCity: string;
  district: string;
  state: string;
  pinCode: string;
  // 3. Identity
  aadhaarNumber: string;
  // 4. Banking
  accountHolderName: string;
  bankName: string;
  accountNumber: string;
  ifscCode: string;
  upiId: string;
  // 5. Professional
  occupation: string;
  collegeName: string;
  companyName: string;
  socialMediaLink: string;
  // 6. Ambassador
  referralCode: string;
  packageSelected: 'starter' | 'premium' | '';
  // 7. Documents (base64)
  photoBase64: string;
  aadhaarCardBase64: string;
  bankPassbookBase64: string;
  // 8. Declaration
  declarationAccurate: boolean;
  declarationTerms: boolean;
  declarationCommission: boolean;
  declarationConsent: boolean;
  // Signature
  signatureName: string;
  signaturePlace: string;
}

interface AmbassadorStore {
  isSubmitting: boolean;
  submitSuccess: boolean;
  submitError: string | null;
  submitAmbassador: (data: AmbassadorFormData) => Promise<void>;
  resetState: () => void;
}

export const useAmbassadorStore = create<AmbassadorStore>((set) => ({
  isSubmitting: false,
  submitSuccess: false,
  submitError: null,

  submitAmbassador: async (data) => {
    set({ isSubmitting: true, submitError: null, submitSuccess: false });
    try {
      await axiosInstance.post('/ambassador', data);
      set({ isSubmitting: false, submitSuccess: true });
    } catch (error: any) {
      const msg = error?.response?.data?.message || 'Submission failed. Please try again.';
      set({ isSubmitting: false, submitError: msg });
    }
  },

  resetState: () => set({ isSubmitting: false, submitSuccess: false, submitError: null }),
}));
