import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { useAuthStore } from '../services/useAuthStore';
import { IconArrowLeft } from '../components/Icons';
import { validatePhone } from '@/utils/validation';

// Mock Data for States and Districts
const STATE_DATA: { [key: string]: string[] } = {
  "Tamil Nadu": [
    "Ariyalur",
    "Chengalpattu",
    "Chennai",
    "Coimbatore",
    "Cuddalore",
    "Dharmapuri",
    "Dindigul",
    "Erode",
    "Kallakurichi",
    "Kancheepuram",
    "Karur",
    "Krishnagiri",
    "Madurai",
    "Mayiladuthurai",
    "Nagapattinam",
    "Namakkal",
    "Nilgiris",
    "Perambalur",
    "Pudukkottai",
    "Ramanathapuram",
    "Ranipet",
    "Salem",
    "Sivaganga",
    "Tenkasi",
    "Thanjavur",
    "Theni",
    "Thoothukudi",
    "Tiruchirappalli",
    "Tirunelveli",
    "Tirupathur",
    "Tiruppur",
    "Tiruvallur",
    "Tiruvannamalai",
    "Tiruvarur",
    "Vellore",
    "Viluppuram",
    "Virudhunagar"
  ],
  "Kerala": ["Thiruvananthapuram", "Kochi", "Kozhikode", "Thrissur", "Kannur"],
  "Karnataka": ["Bengaluru", "Mysuru", "Mangaluru", "Hubballi-Dharwad", "Belagavi"],
  "Andhra Pradesh": ["Visakhapatnam", "Vijayawada", "Guntur", "Nellore", "Kurnool"],
  "Telangana": ["Hyderabad", "Warangal", "Nizamabad", "Karimnagar"],
  "Maharashtra": ["Mumbai", "Pune", "Nagpur", "Nashik", "Aurangabad"]
};

export const Register: React.FC = () => {
  const { signupStepOneData, finalRegister } = useAuthStore();
  const [errors, setErrors] = useState<any>({});
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  // Correct fullName value from step-1
  const [formData, setFormData] = useState({
    fullName: signupStepOneData?.fullName || '',
    phoneNo: '',
    address1: '',
    address2: '',
    address3: '',
    pincode: '',
    state: '',
    district: ''
  });

  const [districts, setDistricts] = useState<string[]>([]);

  // Update districts when state changes
  useEffect(() => {
    if (formData.state && STATE_DATA[formData.state]) {
      setDistricts(STATE_DATA[formData.state]);
      setFormData(prev => ({
        ...prev,
        district: ''
      }));
    } else {
      setDistricts([]);
    }
  }, [formData.state]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (name === "pincode" && !/^\d*$/.test(value)) return;

    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: any = {};

    // PHONE VALIDATION
    if (!validatePhone(formData.phoneNo)) {
      newErrors.phoneNo = "Enter a valid 10-digit mobile number";
    }

    // ADDRESS VALIDATION
    if (!formData.address1) newErrors.address1 = "Address Line 1 is required";
    if (!formData.state) newErrors.state = "State is required";
    if (!formData.district) newErrors.district = "District is required";
    if (!formData.pincode || formData.pincode.length !== 6)
      newErrors.pincode = "Enter a valid 6-digit pincode";

    // SET ERRORS
    setErrors(newErrors);

    //  STOP if validation fails
    if (Object.keys(newErrors).length > 0) return;

    // START LOADING AFTER VALIDATION
    setLoading(true);

    try {
      await finalRegister({
        fullName: formData.fullName,
        phoneNo: formData.phoneNo,
        email: signupStepOneData?.email!,
        password: signupStepOneData?.password!,
        addresses: [
          {
            address1: formData.address1,
            address2: formData.address2,
            address3: formData.address3,
            state: formData.state,
            district: formData.district,
            pincode: formData.pincode,
          },
        ],
      });

      navigate("/");
    } catch (error) {
      console.error("Registration Failed", error);
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 pt-24">
      <div className="max-w-3xl w-full bg-white rounded-3xl shadow-sm border border-neutral-100 overflow-hidden">

        {/* Header */}
        <div className="bg-neutral-900 px-8 py-6 text-white flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-display font-bold">Complete Profile</h2>
            <p className="text-neutral-400 text-sm mt-1">Please provide your delivery details</p>
          </div>
          <div className="text-right">
            <div className="text-xs font-bold uppercase tracking-widest text-brand-accent mb-1">Step 2 of 2</div>
            <div className="w-32 h-2 bg-neutral-700 rounded-full overflow-hidden">
              <div className="w-full h-full bg-brand-accent"></div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-8 md:p-10 space-y-8">

          {/* Personal Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Full Name"
              name="fullName"
              placeholder="Enter your full name"
              value={formData.fullName}
              onChange={handleChange}
              required
            />

            <Input
              label="Phone Number"
              name="phoneNo"
              placeholder="+91 | Enter your mobile number"
              value={formData.phoneNo}
              onChange={handleChange}
              error={errors.phoneNo}
              required
            />
          </div>

          <div className="h-px bg-neutral-100 w-full" />

          {/* Address Section */}
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-neutral-900 flex items-center">
              <span className="w-6 h-6 rounded-full bg-brand-muted text-brand-dark flex items-center justify-center text-xs mr-2">
                2
              </span>
              Address Details
            </h3>

            <div className="space-y-4">
              <Input
                label="Address Line 1"
                name="address1"
                placeholder="House No / Street / Area"
                value={formData.address1}
                onChange={handleChange}
                required
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Address Line 2"
                  name="address2"
                  placeholder="Landmark (Optional)"
                  value={formData.address2}
                  onChange={handleChange}
                />

                <Input
                  label="Address Line 3"
                  name="address3"
                  placeholder="Additional Info (Optional)"
                  value={formData.address3}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

              {/* State */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">State</label>
                <div className="relative">
                  <select
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-neutral-200 bg-neutral-50"
                    required
                  >
                    <option value="">Select State</option>
                    {Object.keys(STATE_DATA).map(state => (
                      <option key={state} value={state}>{state}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* District */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">District</label>
                <div className="relative">
                  <select
                    name="district"
                    value={formData.district}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-neutral-200 bg-neutral-50"
                    required
                    disabled={!formData.state}
                  >
                    <option value="">Select District</option>
                    {districts.map(dist => (
                      <option key={dist} value={dist}>{dist}</option>
                    ))}
                  </select>
                </div>
              </div>

              <Input
                label="Pincode"
                name="pincode"
                placeholder="600001"
                value={formData.pincode}
                onChange={handleChange}
                maxLength={6}
                required
              />

            </div>
          </div>

          {/* Buttons */}
          <div className="pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <button
              type="button"
              onClick={() => navigate('/signup')}
              className="text-neutral-500 hover:text-neutral-900 font-medium flex items-center"
            >
              <IconArrowLeft className="w-4 h-4 mr-2" />
              Back to Signup
            </button>

            <Button type="submit" size="lg" className="w-full md:w-auto min-w-[200px]" isLoading={loading}>
              Complete Registration
            </Button>
          </div>

        </form>
      </div>
    </div>
  );
};
