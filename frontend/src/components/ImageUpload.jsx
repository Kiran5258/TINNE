import React, { useRef, useState } from "react";

export default function ImageUpload({ onFileChange, uploadProgress, previewUrl, setPreviewUrl }) {
  const fileRef = useRef();

  const handleFile = (file) => {
    if (!file) return;
    setPreviewUrl(URL.createObjectURL(file));
    onFileChange(file);
  };

  return (
    <div className="w-full">
      <div
        onClick={() => fileRef.current.click()}
        className="cursor-pointer border-2 border-dashed rounded-xl p-6 flex items-center justify-center flex-col h-64"
      >
        {previewUrl ? (
          <img src={previewUrl} alt="preview" className="max-h-56 object-contain" />
        ) : (
          <>
            <div className="text-center">
              <p className="font-semibold">Click or drop an image here</p>
              <p className="text-sm text-gray-500">PNG, JPG, WEBP — will be uploaded to Cloudinary</p>
            </div>
          </>
        )}
      </div>

      <input
        type="file"
        ref={fileRef}
        className="hidden"
        accept="image/*"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />

      {uploadProgress != null && (
        <div className="mt-2 h-2 bg-gray-200 rounded">
          <div className="h-2 rounded" style={{ width: `${uploadProgress}%`, backgroundColor: "var(--tw-prose-invert)" }} />
        </div>
      )}
    </div>
  );
}
