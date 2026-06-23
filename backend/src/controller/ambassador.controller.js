const Ambassador = require('../model/ambassador.model');
const cloudinary = require('../config/cloudinary'); // use the project's pre-configured instance

// ── Helper: upload base64 to Cloudinary (returns null if nothing provided) ───
const uploadToCloudinary = async (base64String, folder) => {
    if (!base64String || base64String.trim() === '') return null;
    try {
        const result = await cloudinary.uploader.upload(base64String, {
            folder: `tinne/ambassadors/${folder}`,
            resource_type: 'auto',
        });
        return result.secure_url;
    } catch (err) {
        console.error(`Cloudinary upload failed for ${folder}:`, err.message);
        return null; // don't block form submission if upload fails
    }
};

// ── POST /api/ambassador ──────────────────────────────────────────────────────
const submitAmbassadorForm = async (req, res) => {
    try {
        const {
            // Personal
            fullName, mobileNumber, whatsAppNumber, email, dateOfBirth,
            // Address
            streetAddress, villageOrCity, district, state, pinCode,
            // Identity
            aadhaarNumber,
            // Banking
            accountHolderName, bankName, accountNumber, ifscCode, upiId,
            // Professional
            occupation, collegeName, companyName, socialMediaLink,
            // Ambassador
            referralCode, packageSelected,
            // Documents (base64)
            photoBase64, aadhaarCardBase64, bankPassbookBase64,
            // Declaration
            declarationAccurate, declarationTerms, declarationCommission, declarationConsent,
            // Signature
            signatureName, signaturePlace,
        } = req.body;

        // Required field checks
        const required = { fullName, mobileNumber, streetAddress, villageOrCity, district, state, pinCode, aadhaarNumber, accountHolderName, bankName, accountNumber, ifscCode, packageSelected };
        for (const [key, val] of Object.entries(required)) {
            if (!val || String(val).trim() === '') {
                return res.status(400).json({ message: `${key} is required.` });
            }
        }

        if (!['starter', 'premium'].includes(packageSelected)) {
            return res.status(400).json({ message: 'Invalid package selected.' });
        }

        // Upload documents to Cloudinary
        const [photoUrl, aadhaarCardUrl, bankPassbookUrl] = await Promise.all([
            uploadToCloudinary(photoBase64, 'photos'),
            uploadToCloudinary(aadhaarCardBase64, 'aadhaar'),
            uploadToCloudinary(bankPassbookBase64, 'passbook'),
        ]);

        const ambassador = await Ambassador.create({
            fullName, mobileNumber, whatsAppNumber, email, dateOfBirth,
            streetAddress, villageOrCity, district, state, pinCode,
            aadhaarNumber,
            accountHolderName, bankName, accountNumber, ifscCode, upiId,
            occupation, collegeName, companyName, socialMediaLink,
            referralCode, packageSelected,
            photoUrl, aadhaarCardUrl, bankPassbookUrl,
            declarationAccurate: Boolean(declarationAccurate),
            declarationTerms: Boolean(declarationTerms),
            declarationCommission: Boolean(declarationCommission),
            declarationConsent: Boolean(declarationConsent),
            signatureName, signaturePlace,
        });

        res.status(201).json({ message: 'Ambassador registration submitted successfully!', id: ambassador._id });
    } catch (error) {
        console.error('Ambassador submit error:', error);
        res.status(500).json({ message: error.message || 'Server error' });
    }
};

// ── GET /api/ambassador  (admin) ──────────────────────────────────────────────
const getAllAmbassadors = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const skip = (page - 1) * limit;

        const [ambassadors, total] = await Promise.all([
            Ambassador.find().sort({ createdAt: -1 }).skip(skip).limit(limit),
            Ambassador.countDocuments(),
        ]);

        res.json({ ambassadors, total, page, pages: Math.ceil(total / limit) });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ── GET /api/ambassador/:id  (admin) ─────────────────────────────────────────
const getAmbassadorById = async (req, res) => {
    try {
        const ambassador = await Ambassador.findById(req.params.id);
        if (!ambassador) return res.status(404).json({ message: 'Not found' });
        res.json(ambassador);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ── PATCH /api/ambassador/:id/status  (admin) ────────────────────────────────
const updateAmbassadorStatus = async (req, res) => {
    try {
        const { status } = req.body;
        if (!['pending', 'approved', 'rejected'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status value.' });
        }
        const ambassador = await Ambassador.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );
        if (!ambassador) return res.status(404).json({ message: 'Not found' });
        res.json({ message: `Status updated to ${status}`, ambassador });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { submitAmbassadorForm, getAllAmbassadors, getAmbassadorById, updateAmbassadorStatus };
