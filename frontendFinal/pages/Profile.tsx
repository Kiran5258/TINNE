import React, { useState } from "react";
import { useAuthStore } from "../services/useAuthStore";
import { Input } from "../components/Input";
import { Button } from "../components/Button";
import { IconMapPin, IconCheck, IconAlertCircle } from "../components/Icons";

export const Profile: React.FC = () => {
  const { authUser } = useAuthStore(); // FIX: correct value
  const [loading, setLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);

  // SAFE name split (no errors even if undefined)
  const fullName = authUser?.fullName || "";
  const nameParts = fullName.split(" ");

  const firstName = nameParts[0] || "";
  const lastName = nameParts.slice(1).join(" ") || "";

  const userAddress = authUser?.addresses?.[0];

  const [formData, setFormData] = useState({
    firstName,
    lastName,
    email: authUser?.email || "",
    phoneNo: authUser?.phoneNo || "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }, 1000);
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Success Toast */}
      {showToast && (
        <div className="fixed top-24 right-6 bg-white border border-green-100 shadow-lg rounded-xl p-4 flex items-center gap-3 z-50 animate-in slide-in-from-right-10 fade-in duration-300">
          <div className="bg-green-100 p-2 rounded-full">
            <IconCheck className="w-4 h-4 text-green-600" />
          </div>
          <div>
            <p className="font-bold text-sm text-neutral-900">Profile Updated</p>
            <p className="text-xs text-neutral-500">
              Your changes have been saved successfully.
            </p>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 overflow-hidden">
        {/* Header */}
        <div className="p-8 border-b border-neutral-100 flex flex-col sm:flex-row items-center gap-6">
          <div className="w-24 h-24 rounded-full bg-brand-muted flex items-center justify-center text-3xl font-display font-bold text-brand-dark/40 border-4 border-white shadow-sm">
            {formData.firstName.charAt(0)}
          </div>

          <div className="text-center sm:text-left">
            <h2 className="text-2xl font-display font-bold text-neutral-900">
              {formData.firstName} {formData.lastName}
            </h2>
            <p className="text-neutral-500">{formData.email}</p>

            <span className="inline-block mt-2 px-3 py-1 bg-brand-accent/10 text-brand-dark text-xs font-bold rounded-full uppercase tracking-wider">
              {authUser?.role || "Member"}
            </span>
          </div>
        </div>

        {/* Form */}
        <div className="p-8">
          <form onSubmit={handleSave} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="First Name"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
              />
              <Input
                label="Last Name"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Email Address"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
              />
              <Input
                label="Phone Number"
                name="phoneNo"
                value={formData.phoneNo}
                onChange={handleChange}
              />
            </div>

            {/* Address Section */}
            <div className="pt-4">
              <label className="block text-sm font-medium text-neutral-700 mb-3">
                Default Delivery Address
              </label>

              {userAddress ? (
                <div className="border border-neutral-200 rounded-xl p-4 flex items-start justify-between bg-neutral-50 hover:bg-white hover:border-brand-accent/50 transition-colors group cursor-pointer">
                  <div className="flex gap-4">
                    <div className="bg-white p-2 rounded-lg border border-neutral-100 text-neutral-400 group-hover:text-brand-accent transition-colors">
                      <IconMapPin className="w-5 h-5" />
                    </div>

                    <div>
                      <p className="text-sm font-bold text-neutral-900 mb-1">Home</p>

                      <p className="text-sm text-neutral-500 leading-relaxed">
                        {userAddress.address1}, {userAddress.address2 && <>{userAddress.address2}, </>}
                        {userAddress.address3 && <>{userAddress.address3}, </>}
                        {userAddress.district}, {userAddress.state} - {userAddress.pincode}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="text-xs font-bold text-brand-dark hover:text-brand-accent uppercase tracking-wide px-3 py-1"
                  >
                    Edit
                  </button>
                </div>
              ) : (
                <p className="text-sm text-neutral-500">No address added yet.</p>
              )}
            </div>

            <div className="pt-6 border-t border-neutral-100 flex justify-end">
              <Button type="submit" isLoading={loading}>
                Save Changes
              </Button>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="bg-neutral-50 p-6 text-center border-t border-neutral-100">
          <div className="flex justify-center mb-2">
            <IconAlertCircle className="w-4 h-4 text-brand-accent" />
          </div>
          <p className="text-xs text-neutral-500 font-medium uppercase tracking-widest">
            We value purity, privacy, and trust.
          </p>
          <p className="text-[10px] text-neutral-400 mt-1">
            Your personal data is encrypted and always protected.
          </p>
        </div>
      </div>
    </div>
  );
};
