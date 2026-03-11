import React, { useEffect, useState } from 'react';
import { IconClose } from './Icons';
import { Button } from './Button';
import { axiosInstance } from '../config/axios';

export const PromoPopup: React.FC = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [settings, setSettings] = useState<any>(null);

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const res = await axiosInstance.get('/settings');
                const data = res.data;
                if (data && data.popup && data.popup.enabled) {
                    setSettings(data.popup);
                    // Check if already closed in this session (optional, using sessionStorage)
                    const seen = sessionStorage.getItem('promo_popup_seen');
                    if (!seen) {
                        setTimeout(() => setIsVisible(true), 2000); // 2-second delay
                    }
                }
            } catch (error) {
                console.error("Failed to load promo settings");
            }
        };
        fetchSettings();
    }, []);

    const handleClose = () => {
        setIsVisible(false);
        sessionStorage.setItem('promo_popup_seen', 'true');
    };

    if (!isVisible || !settings) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 bg-black/50 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden relative transform transition-all scale-100">
                <button
                    onClick={handleClose}
                    className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-900 z-10 bg-white/50 rounded-full p-1"
                >
                    <IconClose className="w-5 h-5" />
                </button>

                {settings.image && (
                    <div className="h-48 w-full bg-neutral-100">
                        <img src={settings.image} alt="Promo" className="w-full h-full object-cover" />
                    </div>
                )}

                <div className="p-8 text-center">
                    <h3 className="text-2xl font-display font-bold text-neutral-900 mb-2">
                        {settings.title || "Special Offer!"}
                    </h3>
                    <p className="text-neutral-600 mb-6">
                        {settings.message || "Exciting deals await you."}
                    </p>

                    <Button variant="primary" size="lg" className="w-full" onClick={handleClose}>
                        Shop Now
                    </Button>
                </div>
            </div>
        </div>
    );
};
