import AccountLayout from "../../components/AccountLayout";
import Input from "../../components/Input";
import { useAuthStore } from "../../store/useAuthStore";
import { useState } from "react";

export default function Addresses() {
    const { authUser,isupdatingProfile,updateprofile } = useAuthStore();

    const [address, setAddress] = useState({
        addressNo: authUser?.address?.addressNo || "",
        address: authUser?.address?.address || "",
        city: authUser?.address?.city || "",
        state: authUser?.address?.state || "",
        pinNo: authUser?.address?.pinNo || "",
    });
    const handleSave = () => {
        updateprofile({
            address: {
                addressNo: address.addressNo,
                address: address.address,
                city: address.city,
                state: address.state,
                pinNo: address.pinNo,
            },
        });
    };

    return (
        <AccountLayout title="Your Addresses">
            <h2 className="text-2xl mb-6">Your Addresses</h2>

            {/* FORM */}
            <div className="space-y-6 max-w-xl">
                <div>
                    <label className="text-gray-600">Address No</label>
                    <Input
                        type="text"
                        value={address.addressNo}
                        onChange={(e) =>
                            setAddress({ ...address, addressNo: e.target.value })
                        }
                        className="border w-full p-3 rounded"
                    />
                </div>
                <div>
                    <label className="text-gray-600">Address</label>
                    <Input
                        type="text"
                        value={address.address}
                        onChange={(e) =>
                            setAddress({ ...address, address: e.target.value })
                        }
                        className="border w-full p-3 rounded"
                    />
                </div>
                <div>
                    <label className="text-gray-600">City</label>
                    <Input
                        type="text"
                        value={address.city}
                        onChange={(e) =>
                            setAddress({ ...address, city: e.target.value })
                        }
                        className="border w-full p-3 rounded"
                    />
                </div>

                <div>
                    <label className="text-gray-600">State</label>
                    <Input
                        type="text"
                        value={address.state}
                        onChange={(e) =>
                            setAddress({ ...address, state: e.target.value })
                        }
                        className="border w-full p-3 rounded"
                    />
                </div>

                <div>
                    <label className="text-gray-600">Postal / ZIP</label>
                    <Input
                        type="text"
                        value={address.pinNo}
                        onChange={(e) =>
                            setAddress({ ...address, pinNo: e.target.value })
                        }
                        className="border w-full p-3 rounded"
                    />
                </div>

                <button className="bg-black text-white px-6 py-3 transition-all ease-in-out duration-300 hover:scale-[1.04] cursor-pointer"
                    onClick={handleSave} disabled={isupdatingProfile}>
                    {isupdatingProfile ? "Saving..." : "SAVE ADDRESS"}
                </button>
            </div>
        </AccountLayout>
    );
}
