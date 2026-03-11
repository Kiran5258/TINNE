const HeroBanner = require("../model/hero.model");
const cloudinary = require("../config/cloudinary");

exports.getHeroImages = async (req, res) => {
    const banner = await HeroBanner.findOne();
    res.json(banner || { images: [] });
};
exports.updateHeroImages = async (req, res) => {
    try {
        const { images } = req.body;

        if (!images || !Array.isArray(images) || images.length === 0) {
            return res.status(400).json({ message: "At least one image required" });
        }

        //  Upload all images in parallel
        const uploadPromises = images.map((img) => {
            if (img.startsWith("data:")) {
                return cloudinary.uploader.upload(img, {
                    folder: "tinne_hero",
                });
            } else {
                return Promise.resolve({ secure_url: img });
            }
        });

        const results = await Promise.all(uploadPromises);
        const uploaded = results.map((res) => res.secure_url);

        // Save in DB
        let banner = await HeroBanner.findOne();
        if (!banner) {
            banner = await HeroBanner.create({ images: uploaded });
        } else {
            banner.images = uploaded;
            await banner.save();
        }

        res.json({ message: "Hero Images Updated", images: uploaded });

    } catch (err) {
        console.error("Hero upload error:", err);
        res.status(500).json({ message: "Server error" });
    }
};
