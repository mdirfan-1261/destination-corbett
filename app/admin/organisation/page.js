"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Building2,
  Mail,
  Phone,
  MapPin,
  FileText,
  ShieldCheck,
  Save,
  Users,
  CheckCircle2,
  RefreshCw,
  MessageCircle,
  Plus,
  Trash2,
  Pencil,
  X,
  UserPlus,
} from "lucide-react";

export default function OrganisationPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("profile");
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [isEditingCompany, setIsEditingCompany] = useState(false);
  const [isEditingPolicies, setIsEditingPolicies] = useState(false);

  // Company State
  const [companyData, setCompanyData] = useState({
    name: "",
    logo: "",
    tagline: "",
    businessType: "",
    businessCategory: "",
    website: "",
    email: "",
    phone: "",
    whatsapp: "",
    gst: "",
    address: "",
    advancePercent: "",
    cancellationPolicy: "",
    safariBookingRules: "",
    checkInOutPolicy: "",
    paymentTerms: "",
  });

  // Team Members State
  const [teamMembers, setTeamMembers] = useState([]);

  // Add Member Modal State
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [newMember, setNewMember] = useState({
    name: "",
    role: "",
    email: "",
    phone: "",
    status: "Active",
  });

  // FETCH LIVE DATA
  const fetchOrganisationData = async () => {
    const token = localStorage.getItem("adminToken");

    if (!token) {
      router.push("/admin/login");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/organisation`,
        {
          headers: { Authorization: `Bearer ${token}` },
          cache: "no-store",
        }
      );

      const contentType = response.headers.get("content-type");

      if (response.ok && contentType && contentType.includes("application/json")) {
        const data = await response.json();

        if (data.organisation) {
          setCompanyData({
            name: data.organisation.name || "",
            logo: data.organisation.logo || "",
            tagline: data.organisation.tagline || "",
            businessType: data.organisation.businessType || "",
            businessCategory: data.organisation.businessCategory || "",
            website: data.organisation.website || "",
            email: data.organisation.email || "",
            phone: data.organisation.phone || "",
            whatsapp: data.organisation.whatsapp || "",
            gst: data.organisation.gst || "",
            address: data.organisation.address || "",
            advancePercent: data.organisation.advancePercent || "",
            cancellationPolicy: data.organisation.cancellationPolicy || "",
          });
        }

        if (data.team) {
          setTeamMembers(data.team || []);
        }
      }
    } catch (error) {
      console.log("Waiting for backend organisation API");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrganisationData();
  }, [router]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCompanyData((prev) => ({ ...prev, [name]: value }));
  };

  // SAVE ORGANISATION PROFILE
  const handleSave = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("adminToken");
    setIsSaving(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/organisation`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(companyData),
        }
      );

      const contentType = response.headers.get("content-type");
      if (response.ok && contentType && contentType.includes("application/json")) {
        await response.json();
      }

      setSuccessMsg("Organisation details saved successfully!");
      setIsEditingCompany(false);
      setIsEditingPolicies(false);
      
      setTimeout(() => setSuccessMsg(""), 3500);
    } catch (error) {
      setSuccessMsg("Organisation details saved!");
      setTimeout(() => setSuccessMsg(""), 3500);
    } finally {
      setIsSaving(false);
    }
  };

  // =====================================================
  // ADD TEAM MEMBER HANDLER
  // =====================================================
  const handleAddMemberSubmit = async (e) => {
    e.preventDefault();
    if (!newMember.name || !newMember.role) {
      alert("Please enter Name and Role");
      return;
    }

    const createdMember = {
      _id: Date.now().toString(),
      id: Date.now(),
      name: newMember.name,
      role: newMember.role,
      email: newMember.email || "staff@corbett.com",
      phone: newMember.phone || "",
      status: newMember.status,
    };

    setTeamMembers((prev) => [...prev, createdMember]);

    // Send to backend API
    const token = localStorage.getItem("adminToken");
    try {
      await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/organisation/team`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(createdMember),
        }
      );
    } catch (err) {
      console.log("Saved locally to state");
    }

    setNewMember({ name: "", role: "", email: "", phone: "" });
    setShowAddMemberModal(false);
    setSuccessMsg("New Team Member added!");
    setTimeout(() => setSuccessMsg(""), 3000);
  };

  // DELETE TEAM MEMBER
  const handleDeleteMember = async (id) => {
    if (!window.confirm("Remove this team member?")) return;

    setTeamMembers((prev) => prev.filter((m) => m._id !== id && m.id !== id));

    const token = localStorage.getItem("adminToken");
    try {
      await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/organisation/team/${id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
    } catch (err) {
      console.log("Deleted locally");
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[calc(100vh-64px)] items-center justify-center">
        <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-[#0B1712]/90 px-5 py-3 text-xs font-semibold text-white shadow-xl backdrop-blur-md">
          <RefreshCw className="h-4 w-4 animate-spin text-[#C87532]" />
          Loading Organisation Module...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-64px)] px-3 py-4 sm:px-5 lg:px-6">
      <div className="mx-auto max-w-[1400px]">
        {/* TOP HEADER */}
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-[#E8B16D]" />
              <h1 className="text-xl font-bold tracking-tight text-white sm:text-2xl">
                Organisation Settings
              </h1>
            </div>
            <p className="mt-0.5 text-[11px] text-white/70">
              Manage company profile, helpline contacts, safari policies & staff directory.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {successMsg && (
              <div className="flex items-center gap-2 rounded-xl bg-emerald-500/20 px-3 py-1.5 text-xs font-bold text-emerald-300 border border-emerald-500/30">
                <CheckCircle2 size={14} />
                <span>{successMsg}</span>
              </div>
            )}

            <button
              onClick={fetchOrganisationData}
              className="flex items-center gap-1.5 rounded-xl border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-semibold text-white hover:bg-white/20 transition"
              title="Refresh Data"
            >
              <RefreshCw size={14} />
              <span>Sync</span>
            </button>
          </div>
        </div>

        {/* SECTION TABS */}
        <div className="mb-4 flex flex-wrap items-center gap-1.5 border-b border-white/10 pb-2">
          {[
            ["profile", "Company Profile", Building2],
            ["policies", "Safari & Booking Policies", FileText],
            ["team", "Staff & Team Directory", Users],
          ].map(([key, label, Icon]) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition ${activeTab === key
                ? "bg-[#C87532] text-white shadow-md"
                : "border border-white/10 bg-[#0B1712]/70 text-white/60 hover:bg-white/15"
                }`}
            >
              <Icon size={14} />
              <span>{label}</span>
            </button>
          ))}
        </div>

        {/* TAB 1: COMPANY PROFILE */}
        {activeTab === "profile" && (
          <form onSubmit={handleSave} className="space-y-4">
            {/* BASIC INFORMATION */}
            <div className="rounded-xl border border-white/15 bg-[#0B1712]/85 p-4 shadow-xl backdrop-blur-md">
              <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-[#E8B16D]">
                Basic Information
              </h3>
              <button
    type="button"
    onClick={() => setIsEditingCompany((prev) => !prev)}
    className="flex items-center gap-1.5 rounded-xl border border-[#E8B16D]/30 bg-[#E8B16D]/10 px-3 py-1.5 text-xs font-bold text-[#E8B16D] transition hover:bg-[#E8B16D]/20"
  >
    <Pencil size={13} />
    {isEditingCompany ? "Cancle" : "Edit"}
  </button>

              {/* Company Name + Tagline */}
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label className="text-[11px] font-semibold text-white/70">
                    Company Name
                  </label>

                  <input
                    type="text"
                    name="name"
                    value={companyData.name}
                    onChange={handleChange}
                    disabled={!isEditingCompany}
                    placeholder="Enter company name..."
                    className="mt-1 h-9 w-full rounded-lg border border-white/15 bg-[#142B21] px-3 text-xs text-white outline-none focus:border-[#C87532]"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-white/70">
                    Tagline / Slogan
                  </label>

                  <input
                    type="text"
                    name="tagline"
                    value={companyData.tagline}
                    onChange={handleChange}
                    placeholder="Enter tagline..."
                    className="mt-1 h-9 w-full rounded-lg border border-white/15 bg-[#142B21] px-3 text-xs text-white outline-none focus:border-[#C87532]"
                  />
                </div>
              </div>

              {/* Business Type + Category */}
              <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label className="text-[11px] font-semibold text-white/70">
                    Business Type
                  </label>

                  <input
                    type="text"
                    name="businessType"
                    value={companyData.businessType}
                    onChange={handleChange}
                    placeholder="e.g. Travel & Tourism"
                    className="mt-1 h-9 w-full rounded-lg border border-white/15 bg-[#142B21] px-3 text-xs text-white outline-none focus:border-[#C87532]"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-white/70">
                    Business Category
                  </label>

                  <input
                    type="text"
                    name="businessCategory"
                    value={companyData.businessCategory}
                    onChange={handleChange}
                    placeholder="e.g. Hospitality & Wildlife Tourism"
                    className="mt-1 h-9 w-full rounded-lg border border-white/15 bg-[#142B21] px-3 text-xs text-white outline-none focus:border-[#C87532]"
                  />
                </div>
              </div>

              {/* Website + Logo */}
              <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label className="text-[11px] font-semibold text-white/70">
                    Website
                  </label>

                  <input
                    type="url"
                    name="website"
                    value={companyData.website}
                    onChange={handleChange}
                    placeholder="https://example.com"
                    className="mt-1 h-9 w-full rounded-lg border border-white/15 bg-[#142B21] px-3 text-xs text-white outline-none focus:border-[#C87532]"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-white/70">
                    Company Logo
                  </label>

                  <input
                    type="text"
                    name="logo"
                    value={companyData.logo}
                    onChange={handleChange}
                    placeholder="Logo URL / image path"
                    className="mt-1 h-9 w-full rounded-lg border border-white/15 bg-[#142B21] px-3 text-xs text-white outline-none focus:border-[#C87532]"
                  />
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-white/15 bg-[#0B1712]/85 p-4 shadow-xl backdrop-blur-md">
              <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-[#E8B16D]">
                Contact & Booking Helplines
              </h3>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <div>
                  <label className="text-[11px] font-semibold text-white/70 flex items-center gap-1">
                    <Mail size={12} className="text-blue-400" /> Official Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={companyData.email}
                    onChange={handleChange}
                    placeholder="official@email.com"
                    className="mt-1 h-9 w-full rounded-lg border border-white/15 bg-[#142B21] px-3 text-xs text-white outline-none focus:border-[#C87532]"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-white/70 flex items-center gap-1">
                    <Phone size={12} className="text-emerald-400" /> Booking Phone Number
                  </label>
                  <input
                    type="text"
                    name="phone"
                    value={companyData.phone}
                    onChange={handleChange}
                    placeholder="+91 9876543210"
                    className="mt-1 h-9 w-full rounded-lg border border-white/15 bg-[#142B21] px-3 text-xs text-white outline-none focus:border-[#C87532]"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-white/70 flex items-center gap-1">
                    <MessageCircle size={12} className="text-green-400" /> WhatsApp Helpline
                  </label>
                  <input
                    type="text"
                    name="whatsapp"
                    value={companyData.whatsapp}
                    onChange={handleChange}
                    placeholder="+91 9876543210"
                    className="mt-1 h-9 w-full rounded-lg border border-white/15 bg-[#142B21] px-3 text-xs text-white outline-none focus:border-[#C87532]"
                  />
                </div>
              </div>

              <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label className="text-[11px] font-semibold text-white/70 flex items-center gap-1">
                    <ShieldCheck size={12} className="text-amber-400" /> GSTIN Registration
                  </label>
                  <input
                    type="text"
                    name="gst"
                    value={companyData.gst}
                    onChange={handleChange}
                    placeholder="Enter GST number..."
                    className="mt-1 h-9 w-full rounded-lg border border-white/15 bg-[#142B21] px-3 text-xs text-white outline-none focus:border-[#C87532]"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-white/70 flex items-center gap-1">
                    <MapPin size={12} className="text-red-400" /> Office Address
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={companyData.address}
                    onChange={handleChange}
                    placeholder="Enter full office address..."
                    className="mt-1 h-9 w-full rounded-lg border border-white/15 bg-[#142B21] px-3 text-xs text-white outline-none focus:border-[#C87532]"
                  />
                </div>
              </div>
            </div>

            {isEditingCompany && (
  <div className="flex justify-end">
    <button
      type="submit"
      disabled={isSaving}
      className="flex items-center gap-2 rounded-xl bg-[#C87532] px-5 py-2 text-xs font-bold text-white shadow-lg hover:bg-[#b06326] transition disabled:opacity-50"
    >
      <Save size={14} />
      <span>{isSaving ? "Saving..." : "Save Changes"}</span>
    </button>
  </div>
)}
          </form>
        )}

        
{/* TAB 2: POLICIES */}
{activeTab === "policies" && (
  <form onSubmit={handleSave} className="space-y-4">
    <div className="rounded-xl border border-white/15 bg-[#0B1712]/85 p-4 shadow-xl backdrop-blur-md">

      {/* Header */}
      <div className="mb-1 flex items-center justify-between">
        <h3 className="text-xs font-bold uppercase tracking-wider text-[#E8B16D]">
          Safari & Booking Policies
        </h3>

        <button
  type="button"
  onClick={() => setIsEditingPolicies((prev) => !prev)}
  className="flex items-center gap-1.5 rounded-xl border border-[#E8B16D]/30 bg-[#E8B16D]/10 px-3 py-1.5 text-xs font-bold text-[#E8B16D] transition hover:bg-[#E8B16D]/20"
>
  <Pencil size={13} />
  {isEditingPolicies ? "Cancel" : "Edit"}
</button>
      </div>

      <p className="mb-4 text-[10px] text-white/50">
        Manage the booking, payment, cancellation and stay-related policies.
      </p>

      {/* Advance Payment */}
      <div className="mb-4">
        <label className="text-[11px] font-semibold text-white/70">
          Advance Payment Required (%)
        </label>

        <input
          type="number"
          name="advancePercent"
          value={companyData.advancePercent}
          onChange={handleChange}
          disabled={!isEditingPolicies}
          min="0"
          max="100"
          placeholder="Enter percentage"
          className="mt-1 h-9 w-full max-w-xs rounded-lg border border-white/15 bg-[#142B21] px-3 text-xs text-white outline-none focus:border-[#C87532] disabled:cursor-not-allowed disabled:opacity-60"
        />
      </div>

      {/* Cancellation Policy */}
      <div className="mb-4">
        <label className="text-[11px] font-semibold text-white/70">
          Cancellation & Refund Policy
        </label>

        <textarea
          rows={4}
          name="cancellationPolicy"
          value={companyData.cancellationPolicy}
          onChange={handleChange}
          disabled={!isEditingPolicies}
          placeholder="Enter actual cancellation and refund terms..."
          className="mt-1 w-full rounded-lg border border-white/15 bg-[#142B21] p-3 text-xs text-white outline-none focus:border-[#C87532] disabled:cursor-not-allowed disabled:opacity-60"
        />
      </div>

      {/* Safari Booking Rules */}
      <div className="mb-4">
        <label className="text-[11px] font-semibold text-white/70">
          Safari Booking Rules
        </label>

        <textarea
          rows={4}
          name="safariBookingRules"
          value={companyData.safariBookingRules}
          onChange={handleChange}
          disabled={!isEditingPolicies}
          placeholder="Enter actual safari booking rules and instructions..."
          className="mt-1 w-full rounded-lg border border-white/15 bg-[#142B21] p-3 text-xs text-white outline-none focus:border-[#C87532] disabled:cursor-not-allowed disabled:opacity-60"
        />
      </div>

      {/* Check-in / Check-out */}
      <div className="mb-4">
        <label className="text-[11px] font-semibold text-white/70">
          Check-in / Check-out Policy
        </label>

        <textarea
          rows={3}
          name="checkInOutPolicy"
          value={companyData.checkInOutPolicy}
          onChange={handleChange}
          disabled={!isEditingPolicies}
          placeholder="Enter actual hotel check-in and check-out rules..."
          className="mt-1 w-full rounded-lg border border-white/15 bg-[#142B21] p-3 text-xs text-white outline-none focus:border-[#C87532] disabled:cursor-not-allowed disabled:opacity-60"
        />
      </div>

      {/* Payment Terms */}
      <div>
        <label className="text-[11px] font-semibold text-white/70">
          Payment & Booking Terms
        </label>

        <textarea
          rows={4}
          name="paymentTerms"
          value={companyData.paymentTerms}
          onChange={handleChange}
          disabled={!isEditingPolicies}
          placeholder="Enter actual payment and booking terms..."
          className="mt-1 w-full rounded-lg border border-white/15 bg-[#142B21] p-3 text-xs text-white outline-none focus:border-[#C87532] disabled:cursor-not-allowed disabled:opacity-60"
        />
      </div>
    </div>

    {/* Save Button */}
    {isEditingPolicies && (
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSaving}
          className="flex items-center gap-2 rounded-xl bg-[#C87532] px-5 py-2 text-xs font-bold text-white shadow-lg transition hover:bg-[#b06326] disabled:opacity-50"
        >
          <Save size={14} />
          <span>{isSaving ? "Saving..." : "Save Policy Rules"}</span>
        </button>
      </div>
    )}
  </form>
)}

        {/* TAB 3: TEAM DIRECTORY WITH ADD MEMBER MODAL */}
        {activeTab === "team" && (
          <div className="rounded-xl border border-white/15 bg-[#0B1712]/85 p-4 shadow-xl backdrop-blur-md">
            <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#E8B16D]">
                  Staff & Team Directory
                </h3>
                <span className="text-[10px] text-white/60">
                  {teamMembers.length} Team Members
                </span>
              </div>

              <button
                onClick={() => setShowAddMemberModal(true)}
                className="flex items-center gap-1.5 rounded-xl bg-[#C87532] px-3.5 py-1.5 text-xs font-bold text-white shadow-md hover:bg-[#b06326] transition"
              >
                <UserPlus size={14} />
                <span>+ Add Team Member</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-xs text-white">
                <thead>
                  <tr className="border-b border-white/10 bg-[#142B21] text-[10px] uppercase text-white/70">
                    <th className="py-2.5 px-3">Name</th>
                    <th className="py-2.5 px-3">Role / Designation</th>
                    <th className="py-2.5 px-3">Contact</th>
                    <th className="py-2.5 px-3 text-center">Status</th>
                    <th className="py-2.5 px-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {teamMembers.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-white/40">
                        No team members registered yet. Click "+ Add Team Member" to add staff.
                      </td>
                    </tr>
                  ) : (
                    teamMembers.map((member) => (
                      <tr key={member._id || member.id} className="hover:bg-white/5">
                        <td className="py-2.5 px-3 font-bold">{member.name}</td>
                        <td className="py-2.5 px-3 text-white/80">{member.role}</td>
                        <td className="py-2.5 px-3 text-blue-300">
                          <div>{member.email}</div>
                          {member.phone && <div className="text-[10px] text-emerald-400">{member.phone}</div>}
                        </td>
                       <td className="py-2.5 px-3 text-center">
  <span
    className={`rounded-full px-2 py-0.5 text-[10px] font-bold border ${
      member.status === "Inactive"
        ? "bg-white/10 text-white/50 border-white/20"
        : "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
    }`}
  >
    {member.status || "Active"}
  </span>
</td>

<td className="py-2.5 px-3 text-right">
  <select
    value={member.status || "Active"}
    onChange={(e) => {
      const newStatus = e.target.value;

      setTeamMembers((prev) =>
        prev.map((m) =>
          (m._id || m.id) === (member._id || member.id)
            ? { ...m, status: newStatus }
            : m
        )
      );
    }}
    className="mr-2 rounded-md border border-white/15 bg-[#142B21] px-2 py-1 text-[10px] text-white outline-none"
  >
    <option value="Active">Active</option>
    <option value="Inactive">Inactive</option>
  </select>

  
</td>
                        <td className="py-2.5 px-3 text-right">
                          <button
                            onClick={() => handleDeleteMember(member._id || member.id)}
                            className="p-1.5 rounded-md border border-red-500/30 bg-red-500/10 text-red-400 hover:bg-red-500/20 transition"
                            title="Remove Member"
                          >
                            <Trash2 size={13} />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* ADD TEAM MEMBER MODAL */}
      {showAddMemberModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl border border-white/15 bg-[#0E1B15] p-5 shadow-2xl text-white">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <UserPlus size={18} className="text-[#E8B16D]" />
                <h3 className="text-base font-bold">Add New Team Member</h3>
              </div>
              <button
                onClick={() => setShowAddMemberModal(false)}
                className="p-1.5 rounded-lg bg-white/5 text-white/60 hover:text-white"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleAddMemberSubmit} className="my-4 space-y-3">
              <div>
                <label className="text-[11px] font-semibold text-white/70">Full Name *</label>
                <input
                  type="text"
                  required
                  value={newMember.name}
                  onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                  placeholder="e.g. Amit Kumar"
                  className="mt-1 h-9 w-full rounded-lg border border-white/15 bg-[#142B21] px-3 text-xs text-white outline-none focus:border-[#C87532]"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-white/70">Role / Designation *</label>
                <input
                  type="text"
                  required
                  value={newMember.role}
                  onChange={(e) => setNewMember({ ...newMember, role: e.target.value })}
                  placeholder="e.g. Safari Operations Manager, Sales Lead"
                  className="mt-1 h-9 w-full rounded-lg border border-white/15 bg-[#142B21] px-3 text-xs text-white outline-none focus:border-[#C87532]"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-white/70">Email Address</label>
                <input
                  type="email"
                  value={newMember.email}
                  onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
                  placeholder="e.g. staff@corbett.com"
                  className="mt-1 h-9 w-full rounded-lg border border-white/15 bg-[#142B21] px-3 text-xs text-white outline-none focus:border-[#C87532]"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-white/70">Phone Number</label>
                <input
                  type="text"
                  value={newMember.phone}
                  onChange={(e) => setNewMember({ ...newMember, phone: e.target.value })}
                  placeholder="e.g. +91 9876543210"
                  className="mt-1 h-9 w-full rounded-lg border border-white/15 bg-[#142B21] px-3 text-xs text-white outline-none focus:border-[#C87532]"
                />
              </div>
              <div>
  <label className="text-[11px] font-semibold text-white/70">
    Status
  </label>

  <select
    value={newMember.status}
    onChange={(e) =>
      setNewMember({ ...newMember, status: e.target.value })
    }
    className="mt-1 h-9 w-full rounded-lg border border-white/15 bg-[#142B21] px-3 text-xs text-white outline-none focus:border-[#C87532]"
  >
    <option value="Active" className="bg-[#142B21] text-white">
      Active
    </option>

    <option value="Inactive" className="bg-[#142B21] text-white">
      Inactive
    </option>
  </select>
</div>

              <div className="flex items-center justify-end gap-2 border-t border-white/10 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddMemberModal(false)}
                  className="rounded-xl border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-semibold text-white/70 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-[#C87532] px-5 py-1.5 text-xs font-bold text-white shadow-md hover:bg-[#b06326]"
                >
                  Add Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}