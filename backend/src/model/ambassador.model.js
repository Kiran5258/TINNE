const mongoose = require('mongoose');

const ambassadorSchema = new mongoose.Schema({
    // ── 1. Personal Information ──────────────────────────────────────────
    fullName: { type: String, required: true, trim: true },
    mobileNumber: { type: String, required: true, trim: true },
    whatsAppNumber: { type: String, trim: true },
    email: { type: String, trim: true, lowercase: true },
    dateOfBirth: { type: String },

    // ── 2. Address Details ───────────────────────────────────────────────
    streetAddress: { type: String, required: true, trim: true },
    villageOrCity: { type: String, required: true, trim: true },
    district: { type: String, required: true, trim: true },
    state: { type: String, required: true, trim: true },
    pinCode: { type: String, required: true, trim: true },

    // ── 3. Identity Verification ─────────────────────────────────────────
    aadhaarNumber: { type: String, required: true, trim: true },

    // ── 4. Banking Details ───────────────────────────────────────────────
    accountHolderName: { type: String, required: true, trim: true },
    bankName: { type: String, required: true, trim: true },
    accountNumber: { type: String, required: true, trim: true },
    ifscCode: { type: String, required: true, trim: true, uppercase: true },
    upiId: { type: String, trim: true },

    // ── 5. Professional Information ──────────────────────────────────────
    occupation: { type: String, trim: true },
    collegeName: { type: String, trim: true },
    companyName: { type: String, trim: true },
    socialMediaLink: { type: String, trim: true },

    // ── 6. Ambassador Information ────────────────────────────────────────
    referralCode: { type: String, trim: true },
    joiningDate: { type: Date, default: Date.now },
    packageSelected: {
        type: String,
        enum: ['starter', 'premium'],
        required: true,
    },

    // ── 7. Document Uploads (Cloudinary URLs) ────────────────────────────
    photoUrl: { type: String },
    aadhaarCardUrl: { type: String },
    bankPassbookUrl: { type: String },

    // ── 8. Declaration & Consent ─────────────────────────────────────────
    declarationAccurate: { type: Boolean, default: false },
    declarationTerms: { type: Boolean, default: false },
    declarationCommission: { type: Boolean, default: false },
    declarationConsent: { type: Boolean, default: false },

    // ── Signature ─────────────────────────────────────────────────────────
    signatureName: { type: String, trim: true },
    signaturePlace: { type: String, trim: true },

    // ── Admin Status ─────────────────────────────────────────────────────
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending',
    },

}, { timestamps: true });

module.exports = mongoose.model('Ambassador', ambassadorSchema);
