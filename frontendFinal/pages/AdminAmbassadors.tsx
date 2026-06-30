import React, { useEffect, useState } from "react";
import { axiosInstance } from "../config/axios";
import toast from "react-hot-toast";
import { PageLoader } from "../components/PageLoader";
import {
  IconCheck,
  IconClose,
  IconClock,
  IconUsers,
  IconMapPin,
  IconUser
} from "../components/Icons";

interface Ambassador {
  _id: string;
  fullName: string;
  mobileNumber: string;
  whatsAppNumber?: string;
  email?: string;
  dateOfBirth?: string;
  streetAddress: string;
  villageOrCity: string;
  district: string;
  state: string;
  pinCode: string;
  aadhaarNumber: string;
  accountHolderName: string;
  bankName: string;
  accountNumber: string;
  ifscCode: string;
  upiId?: string;
  occupation?: string;
  collegeName?: string;
  companyName?: string;
  socialMediaLink?: string;
  packageSelected: "starter" | "premium";
  referralCode?: string;
  joiningDate: string;
  photoUrl?: string;
  aadhaarCardUrl?: string;
  bankPassbookUrl?: string;
  declarationAccurate: boolean;
  declarationTerms: boolean;
  declarationCommission: boolean;
  declarationConsent: boolean;
  signatureName?: string;
  signaturePlace?: string;
  status: "pending" | "approved" | "rejected";
  createdAt?: string;
}

export const AdminAmbassadors: React.FC = () => {
  const [ambassadors, setAmbassadors] = useState<Ambassador[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAmbassador, setSelectedAmbassador] = useState<Ambassador | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "approved" | "rejected">("all");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchAmbassadors = async (currentPage: number) => {
    try {
      setLoading(true);
      const res = await axiosInstance.get(`/ambassador?page=${currentPage}&limit=50`);
      if (res.data) {
        setAmbassadors(res.data.ambassadors || []);
        setTotalPages(res.data.pages || 1);
        setPage(res.data.page || 1);
      }
    } catch (err: any) {
      toast.error("Failed to load ambassador applications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAmbassadors(page);
  }, [page]);

  const handleUpdateStatus = async (id: string, newStatus: "approved" | "rejected") => {
    try {
      setUpdatingId(id);
      const res = await axiosInstance.patch(`/ambassador/${id}/status`, { status: newStatus });
      if (res.data) {
        toast.success(`Application ${newStatus} successfully!`);
        
        // Update local list
        setAmbassadors((prev) =>
          prev.map((item) => (item._id === id ? { ...item, status: newStatus } : item))
        );

        // Update selected modal view if open
        if (selectedAmbassador && selectedAmbassador._id === id) {
          setSelectedAmbassador((prev) => (prev ? { ...prev, status: newStatus } : null));
        }
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to update status");
    } finally {
      setUpdatingId(null);
    }
  };

  // Helper function to trigger HTML form download
  const handleDownloadForm = (ambassador: Ambassador) => {
    const content = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Ambassador Registration - ${ambassador.fullName}</title>
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; margin: 40px; background-color: #f9f9f9; }
        .form-container { max-width: 850px; margin: 0 auto; border: 1px solid #e2e8f0; padding: 40px; border-radius: 12px; background: #fff; box-shadow: 0 4px 10px rgba(0,0,0,0.03); }
        h1 { text-align: center; color: #111827; font-size: 26px; margin-bottom: 5px; font-weight: 800; letter-spacing: -0.025em; }
        .subtitle { text-align: center; color: #6b7280; font-size: 14px; margin-bottom: 30px; text-transform: uppercase; font-weight: 600; letter-spacing: 0.05em; }
        h2 { font-size: 14px; text-transform: uppercase; color: #111827; border-bottom: 2px solid #f3f4f6; padding-bottom: 6px; margin-top: 35px; font-weight: 700; letter-spacing: 0.05em; }
        .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px 28px; margin-top: 15px; }
        .field { display: flex; flex-direction: column; }
        .label { font-size: 10px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em; }
        .value { font-size: 14px; font-weight: 500; color: #1f2937; margin-top: 4px; border-bottom: 1px solid #f3f4f6; padding-bottom: 4px; }
        .doc-link { display: inline-flex; align-items: center; color: #10b981; text-decoration: none; font-weight: 700; font-size: 13px; margin-top: 6px; }
        .doc-link:hover { text-decoration: underline; }
        .footer { margin-top: 50px; text-align: center; font-size: 11px; color: #9ca3af; border-top: 1px solid #e5e7eb; padding-top: 20px; }
        @media print {
            body { margin: 0; background: #fff; }
            .form-container { border: none; box-shadow: none; padding: 0; }
            .btn-print { display: none; }
        }
        .btn-print { display: block; margin: 0 auto 30px auto; padding: 12px 24px; font-size: 14px; background: #111827; color: #fff; border: none; border-radius: 8px; cursor: pointer; font-weight: bold; transition: background 0.2s; }
        .btn-print:hover { background: #374151; }
        .badge { display: inline-block; padding: 4px 10px; border-radius: 9999px; font-size: 11px; font-weight: 700; text-transform: uppercase; }
        .badge-pending { bg-color: #fef3c7; color: #d97706; background: #fef3c7; }
        .badge-approved { bg-color: #d1fae5; color: #065f46; background: #d1fae5; }
        .badge-rejected { bg-color: #fee2e2; color: #991b1b; background: #fee2e2; }
    </style>
</head>
<body>
    <div class="form-container">
        <button class="btn-print" onclick="window.print()">Print or Save as PDF</button>
        <h1>TINNÉ</h1>
        <div class="subtitle">Sales Ambassador Registration Form</div>
        
        <div style="display: flex; justify-content: space-between; align-items: center;">
            <div>
                <span class="label">Application Reference</span>
                <div class="value" style="border: none; font-weight: bold;">#${ambassador._id}</div>
            </div>
            <div>
                <span class="label">Status</span>
                <div style="margin-top: 4px;">
                    <span class="badge badge-${ambassador.status}">${ambassador.status.toUpperCase()}</span>
                </div>
            </div>
        </div>

        <h2>1. Personal Information</h2>
        <div class="grid">
            <div class="field"><span class="label">Full Name (as per Bank Account)</span><span class="value">${ambassador.fullName}</span></div>
            <div class="field"><span class="label">Mobile Number</span><span class="value">${ambassador.mobileNumber}</span></div>
            <div class="field"><span class="label">WhatsApp Number</span><span class="value">${ambassador.whatsAppNumber || 'N/A'}</span></div>
            <div class="field"><span class="label">Email ID</span><span class="value">${ambassador.email || 'N/A'}</span></div>
            <div class="field"><span class="label">Date of Birth</span><span class="value">${ambassador.dateOfBirth || 'N/A'}</span></div>
        </div>

        <h2>2. Address Details</h2>
        <div class="grid">
            <div class="field" style="grid-column: span 2;"><span class="label">House / Street Address</span><span class="value">${ambassador.streetAddress}</span></div>
            <div class="field"><span class="label">Village / Town / City</span><span class="value">${ambassador.villageOrCity}</span></div>
            <div class="field"><span class="label">District</span><span class="value">${ambassador.district}</span></div>
            <div class="field"><span class="label">State</span><span class="value">${ambassador.state}</span></div>
            <div class="field"><span class="label">PIN Code</span><span class="value">${ambassador.pinCode}</span></div>
        </div>

        <h2>3. Identity Verification</h2>
        <div class="grid">
            <div class="field"><span class="label">Aadhaar Number</span><span class="value">${ambassador.aadhaarNumber}</span></div>
        </div>

        <h2>4. Banking Details</h2>
        <div class="grid">
            <div class="field"><span class="label">Account Holder Name</span><span class="value">${ambassador.accountHolderName}</span></div>
            <div class="field"><span class="label">Bank Name</span><span class="value">${ambassador.bankName}</span></div>
            <div class="field"><span class="label">Account Number</span><span class="value">${ambassador.accountNumber}</span></div>
            <div class="field"><span class="label">IFSC Code</span><span class="value">${ambassador.ifscCode}</span></div>
            <div class="field" style="grid-column: span 2;"><span class="label">UPI ID (Optional)</span><span class="value">${ambassador.upiId || 'N/A'}</span></div>
        </div>

        <h2>5. Professional & Package Information</h2>
        <div class="grid">
            <div class="field"><span class="label">Occupation</span><span class="value">${ambassador.occupation || 'N/A'}</span></div>
            <div class="field"><span class="label">College / Company Name</span><span class="value">${ambassador.collegeName || ambassador.companyName || 'N/A'}</span></div>
            <div class="field"><span class="label">Package Selected</span><span class="value" style="font-weight: 700;">${ambassador.packageSelected.toUpperCase()}</span></div>
            <div class="field"><span class="label">Referral Code Used</span><span class="value">${ambassador.referralCode || 'N/A'}</span></div>
            <div class="field" style="grid-column: span 2;"><span class="label">Social Media Link</span><span class="value">${ambassador.socialMediaLink || 'N/A'}</span></div>
        </div>

        <h2>6. Submitted Documents</h2>
        <div class="grid">
            <div class="field">
                <span class="label">Passport Size Photo</span>
                ${ambassador.photoUrl ? `<a class="doc-link" href="${ambassador.photoUrl}" target="_blank">View / Download Photo</a>` : '<span class="value">Not Uploaded</span>'}
            </div>
            <div class="field">
                <span class="label">Aadhaar Card copy</span>
                ${ambassador.aadhaarCardUrl ? `<a class="doc-link" href="${ambassador.aadhaarCardUrl}" target="_blank">View / Download Aadhaar</a>` : '<span class="value">Not Uploaded</span>'}
            </div>
            <div class="field" style="grid-column: span 2;">
                <span class="label">Bank Passbook / Cancelled Cheque</span>
                ${ambassador.bankPassbookUrl ? `<a class="doc-link" href="${ambassador.bankPassbookUrl}" target="_blank">View / Download Bank Doc</a>` : '<span class="value">Not Uploaded</span>'}
            </div>
        </div>

        <h2>7. Declaration & Consent</h2>
        <div class="grid" style="grid-template-columns: 1fr;">
            <div class="field"><span class="value" style="border: none;">✔️ I hereby declare that all information supplied is accurate.</span></div>
            <div class="field"><span class="value" style="border: none;">✔️ I agree to Tinné\'s Ambassador Terms & Conditions.</span></div>
        </div>
        <div class="grid" style="margin-top: 25px;">
            <div class="field"><span class="label">Signature Name</span><span class="value">${ambassador.signatureName || 'N/A'}</span></div>
            <div class="field"><span class="label">Place</span><span class="value">${ambassador.signaturePlace || 'N/A'}</span></div>
        </div>

        <div class="footer">
            <p>Form generated on: ${new Date().toLocaleString('en-IN')}</p>
            <p>Submission Date: ${new Date(ambassador.createdAt || ambassador.joiningDate).toLocaleString('en-IN')}</p>
            <p>© Tinné Organic Products. All Rights Reserved.</p>
        </div>
    </div>
</body>
</html>
    `;

    const blob = new Blob([content], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Tinne_Ambassador_${ambassador.fullName.replace(/\s+/g, "_")}_Form.html`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Filter logic
  const filteredAmbassadors = ambassadors.filter((item) => {
    // Search query matching
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      item.fullName.toLowerCase().includes(query) ||
      item.mobileNumber.includes(query) ||
      (item.email && item.email.toLowerCase().includes(query)) ||
      item.aadhaarNumber.includes(query);

    // Status matching
    const matchesStatus = statusFilter === "all" || item.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-display font-bold text-neutral-900 flex items-center gap-2">
            <IconUsers className="w-6 h-6 text-brand-dark" />
            Ambassador Registrations
          </h1>
          <p className="text-sm text-neutral-500 mt-1">
            Review and manage ambassador applications, verify documents, and download submission forms.
          </p>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1">
          <input
            type="text"
            className="w-full border border-neutral-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-dark transition-colors"
            placeholder="Search by name, mobile, email, or Aadhaar..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex rounded-xl bg-neutral-100 p-1">
          {(["all", "pending", "approved", "rejected"] as const).map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-4 py-2 text-xs font-bold rounded-lg uppercase tracking-wider transition-all ${
                statusFilter === status
                  ? "bg-white text-brand-dark shadow-sm"
                  : "text-neutral-500 hover:text-neutral-900"
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Main Table */}
      {loading ? (
        <PageLoader message="Loading Applications" />
      ) : filteredAmbassadors.length === 0 ? (
        <div className="text-center py-16 border-2 border-dashed border-neutral-100 rounded-2xl bg-neutral-50">
          <p className="text-neutral-400 font-medium">No registrations match your search filters.</p>
        </div>
      ) : (
        <div className="bg-white border border-neutral-100 rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-neutral-50 border-b border-neutral-100 text-xs font-bold uppercase tracking-wider text-neutral-500">
                  <th className="py-4 px-6">Name</th>
                  <th className="py-4 px-6">Contact Details</th>
                  <th className="py-4 px-6">Selected Package</th>
                  <th className="py-4 px-6">Date Registered</th>
                  <th className="py-4 px-6 text-center">Status</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 text-sm">
                {filteredAmbassadors.map((item) => (
                  <tr key={item._id} className="hover:bg-neutral-50/50 transition-colors">
                    <td className="py-4 px-6 font-bold text-neutral-900">{item.fullName}</td>
                    <td className="py-4 px-6">
                      <div className="text-neutral-800">{item.mobileNumber}</div>
                      <div className="text-xs text-neutral-400">{item.email || "No Email"}</div>
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`inline-block text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full ${
                          item.packageSelected === "premium"
                            ? "bg-purple-100 text-purple-700"
                            : "bg-blue-100 text-blue-700"
                        }`}
                      >
                        {item.packageSelected}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-neutral-500">
                      {new Date(item.createdAt || item.joiningDate).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric"
                      })}
                    </td>
                    <td className="py-4 px-6 text-center">
                      <span
                        className={`inline-flex items-center gap-1 text-xs font-bold uppercase px-2.5 py-1 rounded-full ${
                          item.status === "approved"
                            ? "bg-green-50 text-green-700 border border-green-100"
                            : item.status === "rejected"
                            ? "bg-red-50 text-red-700 border border-red-100"
                            : "bg-amber-50 text-amber-700 border border-amber-100"
                        }`}
                      >
                        {item.status === "approved" && <IconCheck className="w-3.5 h-3.5" />}
                        {item.status === "rejected" && <IconClose className="w-3.5 h-3.5" />}
                        {item.status === "pending" && <IconClock className="w-3.5 h-3.5" />}
                        {item.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right space-x-2">
                      <button
                        onClick={() => setSelectedAmbassador(item)}
                        className="text-xs font-bold bg-neutral-900 text-white hover:bg-neutral-800 px-3.5 py-2 rounded-xl transition-all"
                      >
                        View Details
                      </button>
                      <button
                        onClick={() => handleDownloadForm(item)}
                        className="text-xs font-bold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 px-3.5 py-2 rounded-xl transition-all border border-emerald-100"
                      >
                        Download Form
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-between items-center px-6 py-4 bg-neutral-50 border-t border-neutral-100">
              <button
                disabled={page === 1}
                onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                className="text-xs font-bold text-neutral-600 hover:text-neutral-900 disabled:opacity-40 disabled:pointer-events-none"
              >
                Previous
              </button>
              <span className="text-xs font-medium text-neutral-500">
                Page {page} of {totalPages}
              </span>
              <button
                disabled={page === totalPages}
                onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
                className="text-xs font-bold text-neutral-600 hover:text-neutral-900 disabled:opacity-40 disabled:pointer-events-none"
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}

      {/* Application Details Modal */}
      {selectedAmbassador && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-6 border-b border-neutral-100 flex justify-between items-center">
              <div>
                <h2 className="text-xl font-display font-bold text-neutral-900">
                  Application Details: {selectedAmbassador.fullName}
                </h2>
                <p className="text-xs text-neutral-500 mt-1">Ref ID: #{selectedAmbassador._id}</p>
              </div>
              <button
                onClick={() => setSelectedAmbassador(null)}
                className="p-2 text-neutral-400 hover:text-neutral-900 rounded-full hover:bg-neutral-100 transition-all"
              >
                <IconClose className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto flex-1 space-y-8">
              {/* Profile Block */}
              <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center bg-neutral-50 p-6 rounded-2xl border border-neutral-200">
                <div className="w-16 h-16 rounded-full bg-brand-dark text-white flex items-center justify-center text-2xl font-bold flex-shrink-0">
                  {selectedAmbassador.fullName.charAt(0)}
                </div>
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <h3 className="text-lg font-bold text-neutral-900">{selectedAmbassador.fullName}</h3>
                    <span
                      className={`inline-block text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full ${
                        selectedAmbassador.packageSelected === "premium"
                          ? "bg-purple-100 text-purple-700"
                          : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {selectedAmbassador.packageSelected} Package
                    </span>
                  </div>
                  <p className="text-sm text-neutral-500 mt-1">
                    Joined Date:{" "}
                    {new Date(
                      selectedAmbassador.createdAt || selectedAmbassador.joiningDate
                    ).toLocaleString("en-IN")}
                  </p>
                </div>
                <div>
                  <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest block text-right">
                    Current Status
                  </span>
                  <span
                    className={`inline-block text-xs font-bold uppercase px-3 py-1 rounded-full mt-1.5 ${
                      selectedAmbassador.status === "approved"
                        ? "bg-green-100 text-green-700"
                        : selectedAmbassador.status === "rejected"
                        ? "bg-red-100 text-red-700"
                        : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    {selectedAmbassador.status}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* 1. Personal & Professional Details */}
                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-widest border-b pb-2">
                    1. Contact & Info
                  </h4>
                  <div className="space-y-3">
                    <div>
                      <span className="text-xs text-neutral-400 block">Mobile Number</span>
                      <span className="text-sm font-semibold text-neutral-900">
                        {selectedAmbassador.mobileNumber}
                      </span>
                    </div>
                    <div>
                      <span className="text-xs text-neutral-400 block">WhatsApp Number</span>
                      <span className="text-sm font-semibold text-neutral-900">
                        {selectedAmbassador.whatsAppNumber || "Same / N/A"}
                      </span>
                    </div>
                    <div>
                      <span className="text-xs text-neutral-400 block">Email Address</span>
                      <span className="text-sm font-semibold text-neutral-900">
                        {selectedAmbassador.email || "No Email Supplied"}
                      </span>
                    </div>
                    <div>
                      <span className="text-xs text-neutral-400 block">Date of Birth</span>
                      <span className="text-sm font-semibold text-neutral-900">
                        {selectedAmbassador.dateOfBirth || "N/A"}
                      </span>
                    </div>
                    <div>
                      <span className="text-xs text-neutral-400 block">Aadhaar Number</span>
                      <span className="text-sm font-semibold text-neutral-900 tracking-wider">
                        {selectedAmbassador.aadhaarNumber}
                      </span>
                    </div>
                    <div>
                      <span className="text-xs text-neutral-400 block">Occupation / College / Company</span>
                      <span className="text-sm font-semibold text-neutral-900">
                        {selectedAmbassador.occupation || "N/A"}
                        {selectedAmbassador.collegeName && ` - ${selectedAmbassador.collegeName}`}
                        {selectedAmbassador.companyName && ` - ${selectedAmbassador.companyName}`}
                      </span>
                    </div>
                  </div>
                </div>

                {/* 2. Address Details */}
                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-widest border-b pb-2">
                    2. Address Details
                  </h4>
                  <div className="space-y-3">
                    <div>
                      <span className="text-xs text-neutral-400 block">Street Address</span>
                      <span className="text-sm font-semibold text-neutral-900">
                        {selectedAmbassador.streetAddress}
                      </span>
                    </div>
                    <div>
                      <span className="text-xs text-neutral-400 block">Village / Town / City</span>
                      <span className="text-sm font-semibold text-neutral-900">
                        {selectedAmbassador.villageOrCity}
                      </span>
                    </div>
                    <div>
                      <span className="text-xs text-neutral-400 block">District & State</span>
                      <span className="text-sm font-semibold text-neutral-900">
                        {selectedAmbassador.district}, {selectedAmbassador.state}
                      </span>
                    </div>
                    <div>
                      <span className="text-xs text-neutral-400 block">PIN Code</span>
                      <span className="text-sm font-semibold text-neutral-900">
                        {selectedAmbassador.pinCode}
                      </span>
                    </div>
                    {selectedAmbassador.referralCode && (
                      <div>
                        <span className="text-xs text-neutral-400 block">Referral Code Used</span>
                        <span className="text-sm font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                          {selectedAmbassador.referralCode}
                        </span>
                      </div>
                    )}
                    {selectedAmbassador.socialMediaLink && (
                      <div>
                        <span className="text-xs text-neutral-400 block">Social Media Profile</span>
                        <a
                          href={selectedAmbassador.socialMediaLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm font-semibold text-blue-600 hover:underline"
                        >
                          {selectedAmbassador.socialMediaLink}
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* 3. Banking Details */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-widest border-b pb-2">
                  3. Banking Information
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 bg-neutral-50 p-4 rounded-xl border border-neutral-100">
                  <div>
                    <span className="text-xs text-neutral-400 block">Account Holder Name</span>
                    <span className="text-sm font-bold text-neutral-900">
                      {selectedAmbassador.accountHolderName}
                    </span>
                  </div>
                  <div>
                    <span className="text-xs text-neutral-400 block">Bank Name</span>
                    <span className="text-sm font-bold text-neutral-900">
                      {selectedAmbassador.bankName}
                    </span>
                  </div>
                  <div>
                    <span className="text-xs text-neutral-400 block">Account Number</span>
                    <span className="text-sm font-bold text-neutral-900">
                      {selectedAmbassador.accountNumber}
                    </span>
                  </div>
                  <div>
                    <span className="text-xs text-neutral-400 block">IFSC Code</span>
                    <span className="text-sm font-bold text-neutral-900 tracking-wider">
                      {selectedAmbassador.ifscCode}
                    </span>
                  </div>
                  {selectedAmbassador.upiId && (
                    <div className="col-span-full pt-2">
                      <span className="text-xs text-neutral-400 block">UPI ID</span>
                      <span className="text-sm font-bold text-neutral-900">
                        {selectedAmbassador.upiId}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* 4. Submitted Documents & Verification Link */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-widest border-b pb-2">
                  4. Uploaded Documents
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Photo */}
                  <div className="border border-neutral-200 rounded-xl p-4 flex flex-col justify-between hover:bg-neutral-50 transition-colors">
                    <div>
                      <span className="font-bold text-xs text-neutral-950 uppercase tracking-wide block">
                        Passport Photo
                      </span>
                      <p className="text-xs text-neutral-400 mt-1">Formal headshot profile photo.</p>
                    </div>
                    {selectedAmbassador.photoUrl ? (
                      <div className="mt-4 flex flex-col gap-2">
                        <img
                          src={selectedAmbassador.photoUrl}
                          alt="Ambassador headshot"
                          className="w-16 h-16 object-cover rounded-lg border"
                        />
                        <a
                          href={selectedAmbassador.photoUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs font-bold text-emerald-600 hover:text-emerald-700 mt-2 block"
                          download
                        >
                          View / Download File
                        </a>
                      </div>
                    ) : (
                      <span className="text-xs font-bold text-red-500 mt-4 block">Not Uploaded</span>
                    )}
                  </div>

                  {/* Aadhaar Copy */}
                  <div className="border border-neutral-200 rounded-xl p-4 flex flex-col justify-between hover:bg-neutral-50 transition-colors">
                    <div>
                      <span className="font-bold text-xs text-neutral-950 uppercase tracking-wide block">
                        Aadhaar Document
                      </span>
                      <p className="text-xs text-neutral-400 mt-1">Uploaded copy of Aadhaar Card.</p>
                    </div>
                    {selectedAmbassador.aadhaarCardUrl ? (
                      <div className="mt-4">
                        <div className="w-12 h-12 bg-neutral-100 rounded-lg flex items-center justify-center border border-neutral-200">
                          <IconUser className="w-6 h-6 text-neutral-400" />
                        </div>
                        <a
                          href={selectedAmbassador.aadhaarCardUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs font-bold text-emerald-600 hover:text-emerald-700 mt-3 block"
                          download
                        >
                          View / Download File
                        </a>
                      </div>
                    ) : (
                      <span className="text-xs font-bold text-red-500 mt-4 block">Not Uploaded</span>
                    )}
                  </div>

                  {/* Bank Doc */}
                  <div className="border border-neutral-200 rounded-xl p-4 flex flex-col justify-between hover:bg-neutral-50 transition-colors">
                    <div>
                      <span className="font-bold text-xs text-neutral-950 uppercase tracking-wide block">
                        Bank Passbook / Cheque
                      </span>
                      <p className="text-xs text-neutral-400 mt-1">Verification file for bank details.</p>
                    </div>
                    {selectedAmbassador.bankPassbookUrl ? (
                      <div className="mt-4">
                        <div className="w-12 h-12 bg-neutral-100 rounded-lg flex items-center justify-center border border-neutral-200">
                          <IconMapPin className="w-6 h-6 text-neutral-400" />
                        </div>
                        <a
                          href={selectedAmbassador.bankPassbookUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs font-bold text-emerald-600 hover:text-emerald-700 mt-3 block"
                          download
                        >
                          View / Download File
                        </a>
                      </div>
                    ) : (
                      <span className="text-xs font-bold text-red-500 mt-4 block">Not Uploaded</span>
                    )}
                  </div>
                </div>
              </div>

              {/* 5. Signature & Signoff */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-widest border-b pb-2">
                  5. Signature & Declaration
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-neutral-50 p-4 rounded-xl border border-neutral-100">
                  <div>
                    <span className="text-xs text-neutral-400 block">Signature Name</span>
                    <span className="text-sm font-bold text-neutral-900 font-serif italic border-b border-neutral-300 pb-1 px-4 inline-block mt-1">
                      {selectedAmbassador.signatureName || selectedAmbassador.fullName}
                    </span>
                  </div>
                  <div>
                    <span className="text-xs text-neutral-400 block">Declaration Place</span>
                    <span className="text-sm font-semibold text-neutral-900 mt-1 block">
                      {selectedAmbassador.signaturePlace || "N/A"}
                    </span>
                  </div>
                  <div className="col-span-full text-xs text-neutral-500 space-y-1 mt-2">
                    <p>✔️ Declaration check: Applicant confirmed they supplied true and accurate details.</p>
                    <p>✔️ Terms agreement: Applicant accepted Tinné Ambassador T&C and commission models.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer Actions */}
            <div className="p-6 border-t border-neutral-100 bg-neutral-50 rounded-b-2xl flex flex-col sm:flex-row justify-between gap-4">
              <button
                onClick={() => handleDownloadForm(selectedAmbassador)}
                className="w-full sm:w-auto px-5 py-3 border border-emerald-200 text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded-xl font-bold text-sm transition-all"
              >
                Download Form (HTML File)
              </button>

              <div className="flex gap-3 w-full sm:w-auto justify-end">
                {selectedAmbassador.status !== "rejected" && (
                  <button
                    disabled={updatingId !== null}
                    onClick={() => handleUpdateStatus(selectedAmbassador._id, "rejected")}
                    className="flex-1 sm:flex-initial px-5 py-3 bg-red-50 hover:bg-red-100 text-red-700 font-bold rounded-xl text-sm border border-red-100 transition-all disabled:opacity-50"
                  >
                    Reject Application
                  </button>
                )}
                {selectedAmbassador.status !== "approved" && (
                  <button
                    disabled={updatingId !== null}
                    onClick={() => handleUpdateStatus(selectedAmbassador._id, "approved")}
                    className="flex-1 sm:flex-initial px-5 py-3 bg-neutral-900 hover:bg-neutral-800 text-white font-bold rounded-xl text-sm transition-all disabled:opacity-50"
                  >
                    Approve Application
                  </button>
                )}
                <button
                  onClick={() => setSelectedAmbassador(null)}
                  className="px-5 py-3 bg-white border border-neutral-200 hover:bg-neutral-100 text-neutral-700 font-bold rounded-xl text-sm transition-all"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
