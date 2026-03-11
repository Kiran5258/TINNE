const Settings = require("../model/settings.model.js");

exports.getSettings = async (req, res) => {
    try {
        let settings = await Settings.findOne();
        if (!settings) {
            settings = await Settings.create({});
        }
        res.status(200).json(settings);
    } catch (error) {
        console.log("Error in getSettings controller", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

exports.updateSettings = async (req, res) => {
    try {
        const { globalOffer, popup } = req.body;
        let settings = await Settings.findOne();

        if (!settings) {
            settings = new Settings({ globalOffer, popup });
        } else {
            settings.globalOffer = globalOffer;
            settings.popup = popup;
        }

        await settings.save();
        res.status(200).json(settings);
    } catch (error) {
        console.log("Error in updateSettings controller", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
