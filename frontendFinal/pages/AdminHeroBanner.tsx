import React, { useEffect, useState } from "react";
import { useHeroStore } from "../services/useHeroStore";
import { Button } from "@/components/Button";
import { IconClose, IconUpload } from "@/components/Icons";

export const AdminHeroBanner: React.FC = () => {
    const images = useHeroStore((state) => state.images);
    const fetchHero = useHeroStore((state) => state.fetchHero);
    const updateHero = useHeroStore((state) => state.updateHero);



    const [localImages, setLocalImages] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);

    // Load hero images on mount
    useEffect(() => {
        fetchHero();
    }, []);

    // Sync backend images into local state
    useEffect(() => {
        if (images.length > 0) setLocalImages(images);
    }, [images]);

    // Upload new hero images
    const handleImageUpload = (e: any) => {
        const files = Array.from(e.target.files || []) as File[];

        files.forEach((file) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                setLocalImages((prev) => [...prev, reader.result as string]);
            };
            reader.readAsDataURL(file);
        });
    };

    // Remove image
    const removeImage = (index: number) => {
        setLocalImages((prev) => prev.filter((_, i) => i !== index));
    };

    // Drag & Drop Reordering
    const onDragStart = (e: any, index: number) => {
        e.dataTransfer.setData("index", index);
    };

    const onDrop = (e: any, index: number) => {
        const fromIndex = Number(e.dataTransfer.getData("index"));
        const updated = [...localImages];
        const [moved] = updated.splice(fromIndex, 1);
        updated.splice(index, 0, moved);
        setLocalImages(updated);
    };

    // Save to backend
    const handleSave = async () => {
        setLoading(true);
        await updateHero(localImages);
        setLoading(false);
    };

    return (
        <div className="p-10 max-w-5xl mx-auto">

            <h1 className="text-3xl font-display font-bold mb-8">
                Manage Hero Banner Images
            </h1>

            {/* Upload Box */}
            <label className="border-2 border-dashed border-neutral-300 rounded-xl p-10 flex flex-col items-center justify-center cursor-pointer bg-neutral-50 hover:bg-neutral-100 transition">
                <IconUpload className="w-10 h-10 text-neutral-400 mb-3" />
                <p className="text-neutral-500">Click to upload hero images</p>
                <input type="file" multiple className="hidden" onChange={handleImageUpload} />
            </label>

            {/* Image Preview Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mt-10">
                {localImages.map((img, idx) => (
                    <div
                        key={idx}
                        draggable
                        onDragStart={(e) => onDragStart(e, idx)}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={(e) => onDrop(e, idx)}
                        className="relative rounded-xl overflow-hidden shadow group cursor-move"
                    >
                        <img src={img} className="w-full h-48 object-cover" />

                        <button
                            onClick={() => removeImage(idx)}
                            className="absolute top-2 right-2 p-2 bg-white rounded-full shadow text-red-500 opacity-0 group-hover:opacity-100 transition"
                        >
                            <IconClose />
                        </button>

                        <div className="absolute bottom-0 left-0 right-0 bg-black/40 text-white text-xs p-2 text-center">
                            Slide {idx + 1}
                        </div>
                    </div>
                ))}
            </div>

            {/* Save Button */}
            <Button
                onClick={handleSave}
                isLoading={loading}
                disabled={localImages.length === 0}
                className="mt-10 w-full"
            >
                Save Hero Banner
            </Button>
        </div>
    );
};
