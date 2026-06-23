const express = require('express');
const {
    submitAmbassadorForm,
    getAllAmbassadors,
    getAmbassadorById,
    updateAmbassadorStatus,
} = require('../controller/ambassador.controller');
const { protect } = require('../middleware/auth.middleware');
const { isAdmin } = require('../middleware/admin.middlware');

const router = express.Router();

// Public – anyone can submit
router.post('/', submitAmbassadorForm);

// Admin only
router.get('/', protect, isAdmin, getAllAmbassadors);
router.get('/:id', protect, isAdmin, getAmbassadorById);
router.patch('/:id/status', protect, isAdmin, updateAmbassadorStatus);


module.exports = router;
