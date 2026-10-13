
"use client";

// ============================================================
// ADD PROPERTY PAGE
// Purpose: Property-owner registration UI
// Backend: Not connected yet; preview only, no data is submitted.
// ============================================================

import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  Building2,
  Check,
  CheckCircle2,
  FileCheck2,
  FileText,
  ImagePlus,
  MapPin,
  MessageCircle,
  ShieldCheck,
  Upload,
  UserRound,
  Wallet,
  X,
} from "lucide-react";

// -------------------- THEME & OPTIONS --------------------

const ORANGE = "#B96928";

const propertyTypes = [
  "Resort", "Hotel", "Homestay", "Guest House",
  "Villa / Cottage", "Camp / Tent Stay", "Other",
];

const businessTypes = [
  "Individual / Proprietorship", "Partnership", "LLP",
  "Private Limited Company", "Public Limited Company",
  "Trust / Society", "Other",
];

const roomTypes = [
  "Standard Room", "Deluxe Room", "Premium Room", "Suite",
  "Family Room", "Cottage", "Villa", "Tent", "Dormitory",
];

const facilitiesList = [
  "Air conditioning", "Wi-Fi", "Restaurant", "Swimming pool",
  "Parking", "Room service", "Power backup", "Hot water",
  "Garden", "River view", "Bonfire", "Conference hall",
  "Kids play area", "Pet friendly", "Accessible rooms",
  "Safari assistance", "Airport / railway transfer", "Laundry",
];

const documentTypes = [
  "Ownership proof", "Lease / rental agreement",
  "Authorisation letter", "GST registration certificate",
  "PAN / business proof", "Tourism / operating registration",
  "Trade licence, if applicable", "FSSAI registration, if applicable",
  "Other supporting document",
];

const steps = [
  { title: "Property & contact", subtitle: "Owner, address", icon: Building2 },
  { title: "Rooms & facilities", subtitle: "Capacity, amenities", icon: CheckCircle2 },
  { title: "Pricing & policies", subtitle: "Rates, timings", icon: Wallet },
  { title: "GST & legal", subtitle: "Business details", icon: FileCheck2 },
  { title: "Photos & review", subtitle: "Files, declaration", icon: FileText },
];

// -------------------- INITIAL FORM DATA --------------------

const initialForm = {
  // Step 1: Owner and property
  ownerName: "",
  designation: "Owner",
  phone: "",
  whatsapp: "",
  email: "",
  alternatePhone: "",
  propertyName: "",
  propertyType: "Resort",
  businessName: "",
  businessType: "Individual / Proprietorship",
  propertyEmail: "",
  website: "",
  description: "",

  // Property address
  address: "",
  locality: "",
  city: "",
  district: "",
  state: "Uttarakhand",
  pinCode: "",
  landmark: "",
  mapUrl: "",

  // Step 2: Inventory and facilities
  totalRooms: "",
  maxGuests: "",
  roomType: "Deluxe Room",
  roomQuantity: "",
  roomCapacity: "2",
  bedType: "Double Bed",
  airConditioning: "AC",
  mealPlan: "Room Only",
  facilities: [],

  // Step 3: Pricing and policies
  basePrice: "",
  weekendPrice: "",
  extraAdultPrice: "",
  childPrice: "",
  mealPrice: "",
  taxIncluded: "not-sure",
  cancellationPolicy: "Flexible",
  advanceRequired: "No",
  minimumNights: "1",
  checkIn: "13:00",
  checkOut: "11:00",

  // Step 4: Business and compliance
  gstRegistered: "no",
  gstin: "",
  legalName: "",
  gstAddress: "",
  panNumber: "",
  propertyOwnership: "owner",
  businessRegistration: "",
  tourismRegistration: "",
  fssaiNumber: "",
  otherLicence: "",
  documentNotes: "",

  // Step 5: Declarations
  declarationAccuracy: false,
  declarationAuthority: false,
  declarationPrivacy: false,
};

// -------------------- REUSABLE FORM COMPONENTS --------------------

const inputClass =
  "w-full min-w-0 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-[#B96928] focus:ring-4 focus:ring-[#B96928]/10";

const labelClass = "mb-1.5 block text-sm font-semibold text-[#172033]";

// Field supports text, email, number, URL, phone and select inputs.
function Field({
  label,
  name,
  value,
  onChange,
  options,
  required,
  error,
  hint,
  ...props
}) {
  return (
    <div className="min-w-0">
      <label htmlFor={name} className={labelClass}>
        {label} {required && <span className="text-red-600">*</span>}
      </label>

      {options ? (
        <select
          id={name}
          name={name}
          value={value ?? ""}
          onChange={onChange}
          required={required}
          className={inputClass}
        >
          {options.map((option) => {
            const item =
              typeof option === "string"
                ? { value: option, label: option }
                : option;

            return (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            );
          })}
        </select>
      ) : (
        <input
          id={name}
          name={name}
          value={value ?? ""}
          onChange={onChange}
          required={required}
          aria-invalid={Boolean(error)}
          className={`${inputClass} ${
            error ? "border-red-400 focus:border-red-500" : ""
          }`}
          {...props}
        />
      )}

      {hint && <p className="mt-1 text-xs leading-5 text-slate-500">{hint}</p>}
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}

// Reusable section heading.
function SectionHeading({ title, description }) {
  return (
    <div className="mb-5 border-b border-slate-100 pb-4">
      <h2 className="text-xl font-black tracking-tight text-[#172033] sm:text-2xl">
        {title}
      </h2>
      {description && (
        <p className="mt-1.5 text-sm leading-5 text-slate-500">{description}</p>
      )}
    </div>
  );
}

// Reusable declaration checkbox.
function Declaration({ checked, onChange, title, description, error }) {
  return (
    <div>
      <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-slate-200 p-3.5 transition hover:border-[#B96928]/50">
        <input
          type="checkbox"
          checked={checked}
          onChange={(event) => onChange(event.target.checked)}
          className="mt-1 h-4 w-4 shrink-0 accent-[#B96928]"
        />
        <span>
          <span className="block text-sm font-bold text-[#172033]">{title}</span>
          <span className="mt-1 block text-xs leading-5 text-slate-500">
            {description}
          </span>
        </span>
      </label>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}

// -------------------- MAIN PAGE --------------------

export default function AddPropertyPage() {
  const [form, setForm] = useState(initialForm);
  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState({});
  const [notice, setNotice] = useState("");
  const [noticeType, setNoticeType] = useState("error");
  const [showPreview, setShowPreview] = useState(false);
  const [photos, setPhotos] = useState([]);
  const [documents, setDocuments] = useState([]);

  const photoInputRef = useRef(null);
  const documentInputRef = useRef(null);

  const completion = Math.round(((step + 1) / steps.length) * 100);

  const selectedPropertyType = useMemo(
    () => propertyTypes.find((item) => item === form.propertyType) || "Other",
    [form.propertyType]
  );

  // -------------------- FORM STATE HELPERS --------------------

  function updateField(event) {
    const { name, value } = event.target;
    setForm((previous) => ({ ...previous, [name]: value }));
    setErrors((previous) => ({ ...previous, [name]: "" }));
    setNotice("");
  }

  function updateValue(name, value) {
    setForm((previous) => ({ ...previous, [name]: value }));
    setErrors((previous) => ({ ...previous, [name]: "" }));
    setNotice("");
  }

  function toggleFacility(facility) {
    setForm((previous) => ({
      ...previous,
      facilities: previous.facilities.includes(facility)
        ? previous.facilities.filter((item) => item !== facility)
        : [...previous.facilities, facility],
    }));
  }

  // -------------------- FILE UPLOAD UI VALIDATION --------------------
  // Files are only held in browser memory. They are not uploaded.

  function addFiles(event, type) {
    const selected = Array.from(event.target.files || []);
    const currentFiles = type === "photos" ? photos : documents;
    const maxFiles = 10;
    const accepted = [];
    const rejected = [];

    for (const file of selected) {
      const isImage = file.type.startsWith("image/");
      const isDocument =
        file.type === "application/pdf" ||
        isImage ||
        file.type === "application/msword" ||
        file.type ===
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document";

      if (file.size > 5 * 1024 * 1024) {
        rejected.push(`${file.name}: maximum file size is 5 MB`);
      } else if (type === "photos" && !isImage) {
        rejected.push(`${file.name}: image files only`);
      } else if (type === "documents" && !isDocument) {
        rejected.push(`${file.name}: unsupported file type`);
      } else {
        accepted.push(file);
      }
    }

    const remaining = Math.max(0, maxFiles - currentFiles.length);
    const filesToAdd = accepted.slice(0, remaining);

    if (accepted.length > remaining) {
      rejected.push(`Maximum ${maxFiles} ${type} allowed`);
    }

    if (type === "photos") {
      setPhotos((previous) => [...previous, ...filesToAdd]);
    } else {
      setDocuments((previous) => [...previous, ...filesToAdd]);
    }

    setNoticeType(rejected.length ? "error" : "info");
    setNotice(rejected.join(". "));
    event.target.value = "";
  }

  function removeFile(type, index) {
    if (type === "photos") {
      setPhotos((previous) => previous.filter((_, i) => i !== index));
    } else {
      setDocuments((previous) => previous.filter((_, i) => i !== index));
    }
  }

  // -------------------- STEP VALIDATION --------------------

  function validateStep(currentStep) {
    const nextErrors = {};

    if (currentStep === 0) {
      if (!form.ownerName.trim()) nextErrors.ownerName = "Owner name is required.";
      if (!/^[6-9]\d{9}$/.test(form.phone.trim())) {
        nextErrors.phone = "Enter a valid 10-digit Indian mobile number.";
      }
      if (form.whatsapp && !/^[6-9]\d{9}$/.test(form.whatsapp.trim())) {
        nextErrors.whatsapp = "Enter a valid 10-digit WhatsApp number.";
      }
      if (
        form.alternatePhone &&
        !/^[6-9]\d{9}$/.test(form.alternatePhone.trim())
      ) {
        nextErrors.alternatePhone = "Enter a valid 10-digit mobile number.";
      }
      if (!form.propertyName.trim()) {
        nextErrors.propertyName = "Property name is required.";
      }
      if (!form.address.trim()) nextErrors.address = "Full address is required.";
      if (!form.city.trim()) nextErrors.city = "City / town is required.";
      if (!form.state.trim()) nextErrors.state = "State is required.";
      if (!/^\d{6}$/.test(form.pinCode.trim())) {
        nextErrors.pinCode = "Enter a valid 6-digit PIN code.";
      }

      for (const key of ["email", "propertyEmail"]) {
        if (
          form[key] &&
          !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form[key].trim())
        ) {
          nextErrors[key] = "Enter a valid email address.";
        }
      }

      for (const key of ["website", "mapUrl"]) {
        if (form[key]) {
          try {
            const url = new URL(form[key]);
            if (!["http:", "https:"].includes(url.protocol)) {
              nextErrors[key] = "Enter a valid HTTP or HTTPS URL.";
            }
          } catch {
            nextErrors[key] = "Enter a valid URL starting with https://.";
          }
        }
      }
    }

    if (currentStep === 1) {
      if (!form.totalRooms || Number(form.totalRooms) < 1) {
        nextErrors.totalRooms = "Enter the total number of rooms or units.";
      }
      if (!form.maxGuests || Number(form.maxGuests) < 1) {
        nextErrors.maxGuests = "Enter the maximum guest capacity.";
      }
    }

    if (currentStep === 2) {
      if (!form.basePrice || Number(form.basePrice) <= 0) {
        nextErrors.basePrice = "Enter a valid starting room price.";
      }
    }

    if (currentStep === 3) {
      if (form.gstRegistered === "yes") {
        if (
          !/^\d{2}[A-Z]{5}\d{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/.test(
            form.gstin.trim().toUpperCase()
          )
        ) {
          nextErrors.gstin = "Enter a valid GSTIN format.";
        }
        if (!form.legalName.trim()) {
          nextErrors.legalName = "Legal business name is required.";
        }
      }

      if (
        form.panNumber &&
        !/^[A-Z]{5}[0-9]{4}[A-Z]$/.test(form.panNumber.trim().toUpperCase())
      ) {
        nextErrors.panNumber = "Enter a valid PAN format.";
      }
    }

    if (currentStep === 4) {
      if (!form.declarationAccuracy) {
        nextErrors.declarationAccuracy = "Please confirm the information is accurate.";
      }
      if (!form.declarationAuthority) {
        nextErrors.declarationAuthority = "Please confirm your authority to list.";
      }
      if (!form.declarationPrivacy) {
        nextErrors.declarationPrivacy = "Please acknowledge the data handling notice.";
      }
    }

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length) {
      setNoticeType("error");
      setNotice("Please check the highlighted fields before continuing.");
      return false;
    }

    setNotice("");
    return true;
  }

  // -------------------- STEP NAVIGATION --------------------

  function goNext() {
    if (!validateStep(step)) return;
    setStep((previous) => Math.min(previous + 1, steps.length - 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function goBack() {
    setStep((previous) => Math.max(previous - 1, 0));
    setNotice("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleSubmit(event) {
    event.preventDefault();
    if (!validateStep(4)) return;
    setShowPreview(true);
  }

  function finishPreview() {
    setShowPreview(false);
    setNoticeType("info");
    setNotice(
      "Preview complete. Nothing has been submitted or saved. Backend integration is required for secure submission."
    );
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const whatsappMessage = encodeURIComponent(
    "Hello Destination Corbett, I would like to discuss listing my property."
  );

  // -------------------- PAGE UI: HERO --------------------

  return (
    <main className="min-h-screen bg-[#F7F5F0] text-[#172033]">
      <section className="relative isolate overflow-hidden bg-[#172033]">
        <div className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full bg-[#B96928]/25 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-28 left-1/3 h-64 w-64 rounded-full bg-emerald-700/20 blur-3xl" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-8 px-5 py-9 sm:px-8 sm:py-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12 lg:px-10 lg:py-14">
          <div>
            <Link
              href="/stay"
              className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.06] px-3.5 py-2 text-sm font-semibold text-white/80 transition hover:bg-white/10"
            >
              <ArrowLeft className="h-4 w-4" />
              Explore stays
            </Link>

            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#D9A36D]/30 bg-[#B96928]/15 px-3 py-1.5 text-xs font-bold tracking-wider text-[#F1C69B]">
              <BadgeCheck className="h-4 w-4" />
              PROPERTY PARTNER REGISTRATION
            </div>

            <h1 className="max-w-2xl text-4xl font-black leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
              Bring your property
              <span className="mt-1 block text-[#E2A36C]">
                to more travellers.
              </span>
            </h1>

            <p className="mt-4 max-w-xl text-base leading-7 text-slate-300">
              Register your hotel, resort, homestay or cottage for review.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href="#property-form"
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#B96928] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#a75b23]"
              >
                Start registration <ArrowRight className="h-4 w-4" />
              </a>

              <a
                href={`https://wa.me/?text=${whatsappMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/[0.06] px-4 py-3 text-sm font-bold text-white transition hover:bg-white/10"
              >
                <MessageCircle className="h-4 w-4" />
                WhatsApp enquiry
              </a>
            </div>

            <div className="mt-6 flex flex-wrap gap-4 text-sm text-slate-300">
              <span className="flex items-center gap-2">
                <Check className="h-4 w-4 text-[#E2A36C]" />
                Five guided steps
              </span>
              <span className="flex items-center gap-2">
                <Check className="h-4 w-4 text-[#E2A36C]" />
                Review before publishing
              </span>
            </div>
          </div>

          {/* Compact onboarding summary */}
          <div className="rounded-3xl border border-white/15 bg-white/[0.07] p-4 shadow-2xl backdrop-blur-xl sm:p-5">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#B96928]/20 text-[#E2A36C]">
                <Building2 className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-[#E2A36C]">
                  Owner onboarding
                </p>
                <h2 className="mt-1 text-xl font-bold text-white">
                  Everything in one place
                </h2>
              </div>
            </div>

            <div className="space-y-2">
              {steps.map((item, index) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.title}
                    className="flex items-center gap-3 rounded-xl border border-white/10 bg-black/10 p-3"
                  >
                    <Icon className="h-5 w-5 shrink-0 text-[#E2A36C]" />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-bold text-white">{item.title}</p>
                      <p className="text-xs text-slate-300">{item.subtitle}</p>
                    </div>
                    <span className="text-xs font-black text-[#E2A36C]">
                      0{index + 1}
                    </span>
                  </div>
                );
              })}
            </div>

            <p className="mt-3 rounded-xl bg-emerald-400/10 px-3.5 py-3 text-sm text-emerald-100">
              <ShieldCheck className="mr-2 inline h-4 w-4" />
              Listing requires review and approval.
            </p>
          </div>
        </div>
      </section>

      {/* -------------------- REGISTRATION FORM -------------------- */}

      <section
        id="property-form"
        className="scroll-mt-5 px-4 py-8 sm:px-6 sm:py-10 lg:px-8"
      >
        <div className="mx-auto grid max-w-7xl items-start gap-6 lg:grid-cols-[minmax(0,1fr)_270px] lg:gap-8">
          <div className="min-w-0">
            <div className="mb-5">
              <p className="text-xs font-black uppercase tracking-wider text-[#B96928]">
                Property registration
              </p>
              <h2 className="mt-1.5 text-3xl font-black tracking-tight sm:text-4xl">
                Register your property
              </h2>
              <p className="mt-2 text-sm text-slate-600">
                Fields marked * are required.
              </p>
            </div>

            {/* Step progress */}
            <div className="mb-4 rounded-2xl border border-slate-200 bg-white p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-bold">
                    Step {step + 1} of {steps.length}: {steps[step].title}
                  </p>
                  <p className="mt-0.5 text-xs text-slate-500">
                    {steps[step].subtitle}
                  </p>
                </div>
                <p className="text-sm font-black text-[#B96928]">{completion}%</p>
              </div>

              <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-[#B96928] transition-all duration-300"
                  style={{ width: `${completion}%` }}
                />
              </div>

              <div className="mt-3 grid grid-cols-5 gap-1.5">
                {steps.map((item, index) => (
                  <button
                    key={item.title}
                    type="button"
                    onClick={() => {
                      if (index <= step) {
                        setStep(index);
                        setNotice("");
                      }
                    }}
                    disabled={index > step}
                    className={`min-w-0 text-left text-[10px] font-bold leading-4 sm:text-xs ${
                      index === step
                        ? "text-[#B96928]"
                        : index < step
                          ? "text-slate-700"
                          : "cursor-not-allowed text-slate-300"
                    }`}
                  >
                    <span className="mb-1 flex h-7 w-7 items-center justify-center rounded-lg border">
                      {index < step ? <Check className="h-4 w-4" /> : index + 1}
                    </span>
                    <span className="block break-words">{item.title}</span>
                  </button>
                ))}
              </div>
            </div>

            <form
              id="property-registration-form"
              onSubmit={handleSubmit}
              noValidate
              className="rounded-3xl border border-slate-200/80 bg-white p-4 shadow-[0_12px_40px_rgba(23,32,51,0.05)] sm:p-6"
            >
              {/* STEP 1: OWNER, PROPERTY AND ADDRESS */}
              {step === 0 && (
                <>
                  <SectionHeading
                    title="Owner & property details"
                    description="Contact information and property location."
                  />

                  <div className="mb-5 flex items-center gap-2 rounded-xl bg-[#B96928]/[0.06] p-3 text-sm text-slate-600">
                    <UserRound className="h-5 w-5 shrink-0 text-[#B96928]" />
                    Use a number our team can reach for onboarding.
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="Owner / contact person" name="ownerName" value={form.ownerName} onChange={updateField} placeholder="Full name" required error={errors.ownerName} autoComplete="name" />

                    <Field label="Designation" name="designation" value={form.designation} onChange={updateField} options={["Owner", "Authorised representative", "Property manager", "Partner", "Director", "Other"]} />

                    <Field label="Mobile number" name="phone" value={form.phone} onChange={(e) => updateValue("phone", e.target.value.replace(/\D/g, "").slice(0, 10))} placeholder="10-digit mobile" type="tel" inputMode="numeric" required error={errors.phone} />

                    <Field label="WhatsApp number" name="whatsapp" value={form.whatsapp} onChange={(e) => updateValue("whatsapp", e.target.value.replace(/\D/g, "").slice(0, 10))} placeholder="Optional" type="tel" inputMode="numeric" error={errors.whatsapp} />

                    <Field label="Email address" name="email" value={form.email} onChange={updateField} placeholder="owner@example.com" type="email" error={errors.email} />

                    <Field label="Alternate mobile" name="alternatePhone" value={form.alternatePhone} onChange={(e) => updateValue("alternatePhone", e.target.value.replace(/\D/g, "").slice(0, 10))} placeholder="Optional" type="tel" inputMode="numeric" error={errors.alternatePhone} />

                    <Field label="Property name" name="propertyName" value={form.propertyName} onChange={updateField} placeholder="e.g. Corbett Nature Retreat" required error={errors.propertyName} />

                    <Field label="Property type" name="propertyType" value={form.propertyType} onChange={updateField} options={propertyTypes} required />

                    <Field label="Legal / trade name" name="businessName" value={form.businessName} onChange={updateField} placeholder="If different from property name" />

                    <Field label="Business constitution" name="businessType" value={form.businessType} onChange={updateField} options={businessTypes} />

                    <Field label="Property email" name="propertyEmail" value={form.propertyEmail} onChange={updateField} placeholder="booking@example.com" type="email" error={errors.propertyEmail} />

                    <Field label="Website" name="website" value={form.website} onChange={updateField} placeholder="https://example.com" type="url" error={errors.website} />
                  </div>

                  <div className="my-6 border-t border-slate-100" />

                  <SectionHeading title="Property address" description="Physical address where guests will stay." />

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                      <Field label="Full address" name="address" value={form.address} onChange={updateField} placeholder="Building, road, village and area" required error={errors.address} />
                    </div>

                    <Field label="Locality / village" name="locality" value={form.locality} onChange={updateField} placeholder="e.g. Dhikuli" />

                    <Field label="City / town" name="city" value={form.city} onChange={updateField} placeholder="e.g. Ramnagar" required error={errors.city} />

                    <Field label="District" name="district" value={form.district} onChange={updateField} placeholder="e.g. Nainital" />

                    <Field label="State" name="state" value={form.state} onChange={updateField} required error={errors.state} />

                    <Field label="PIN code" name="pinCode" value={form.pinCode} onChange={(e) => updateValue("pinCode", e.target.value.replace(/\D/g, "").slice(0, 6))} placeholder="6-digit PIN" inputMode="numeric" maxLength={6} required error={errors.pinCode} />

                    <Field label="Nearest landmark" name="landmark" value={form.landmark} onChange={updateField} placeholder="Optional" />

                    <div className="sm:col-span-2">
                      <Field label="Google Maps link" name="mapUrl" value={form.mapUrl} onChange={updateField} placeholder="Paste Maps share link (optional)" type="url" error={errors.mapUrl} />
                    </div>

                    <div className="sm:col-span-2">
                      <label htmlFor="description" className={labelClass}>Property introduction</label>
                      <textarea id="description" name="description" rows={3} maxLength={1000} value={form.description} onChange={updateField} placeholder="Briefly describe your property and guest experience." className={`${inputClass} resize-y`} />
                      <p className="mt-1 text-right text-xs text-slate-400">{form.description.length}/1000</p>
                    </div>
                  </div>
                </>
              )}

              {/* STEP 2: ROOM INVENTORY AND AMENITIES */}
              {step === 1 && (
                <>
                  <SectionHeading title="Rooms & facilities" description="Accommodation capacity and available amenities." />

                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="Total rooms / units" name="totalRooms" value={form.totalRooms} onChange={updateField} type="number" min="1" placeholder="e.g. 20" required error={errors.totalRooms} />

                    <Field label="Maximum guest capacity" name="maxGuests" value={form.maxGuests} onChange={updateField} type="number" min="1" placeholder="e.g. 60" required error={errors.maxGuests} />

                    <Field label="Primary room type" name="roomType" value={form.roomType} onChange={updateField} options={roomTypes} />

                    <Field label="Units of this room type" name="roomQuantity" value={form.roomQuantity} onChange={updateField} type="number" min="0" placeholder="Optional" />

                    <Field
                      label="Typical room occupancy"
                      name="roomCapacity"
                      value={form.roomCapacity}
                      onChange={updateField}
                      options={[
                        { value: "1", label: "1 guest" },
                        { value: "2", label: "2 guests" },
                        { value: "3", label: "3 guests" },
                        { value: "4", label: "4 guests" },
                        { value: "5+", label: "5+ guests" },
                      ]}
                    />

                    <Field label="Bed type" name="bedType" value={form.bedType} onChange={updateField} options={["Single Bed", "Twin Beds", "Double Bed", "Queen Bed", "King Bed", "Multiple Beds", "Mixed / Other"]} />

                    <Field label="Air conditioning" name="airConditioning" value={form.airConditioning} onChange={updateField} options={["AC", "Non-AC", "Both AC and Non-AC"]} />

                    <Field label="Meal plan" name="mealPlan" value={form.mealPlan} onChange={updateField} options={["Room Only", "Breakfast Included", "Breakfast & Dinner", "All Meals Included", "Meal Plans Available Separately"]} />
                  </div>

                  <div className="my-6 border-t border-slate-100" />

                  <SectionHeading title="Available facilities" description="Select only facilities available to your guests." />

                  <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                    {facilitiesList.map((facility) => (
                      <label
                        key={facility}
                        className={`flex cursor-pointer items-center gap-2.5 rounded-xl border p-2.5 text-sm transition ${
                          form.facilities.includes(facility)
                            ? "border-[#B96928] bg-[#B96928]/[0.05]"
                            : "border-slate-200 hover:border-slate-300"
                        }`}
                      >
                        <input type="checkbox" checked={form.facilities.includes(facility)} onChange={() => toggleFacility(facility)} className="h-4 w-4 accent-[#B96928]" />
                        <span className="font-medium text-slate-700">{facility}</span>
                      </label>
                    ))}
                  </div>

                  <p className="mt-4 rounded-xl bg-slate-50 p-3 text-xs leading-5 text-slate-600">
                    Room-category inventory and availability calendars can be configured during a later onboarding stage.
                  </p>
                </>
              )}

              {/* STEP 3: PRICES, TAX DISPLAY AND BOOKING RULES */}
              {step === 2 && (
                <>
                  <SectionHeading title="Pricing & booking policies" description="Enter indicative rates for review before publishing." />

                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="Starting price per room / night (₹)" name="basePrice" value={form.basePrice} onChange={updateField} type="number" min="1" placeholder="e.g. 2499" required error={errors.basePrice} />

                    <Field label="Weekend price (₹)" name="weekendPrice" value={form.weekendPrice} onChange={updateField} type="number" min="0" placeholder="Optional" />

                    <Field label="Extra adult charge (₹)" name="extraAdultPrice" value={form.extraAdultPrice} onChange={updateField} type="number" min="0" placeholder="Optional" />

                    <Field label="Child charge (₹)" name="childPrice" value={form.childPrice} onChange={updateField} type="number" min="0" placeholder="Optional" />

                    <Field label="Meal plan charge (₹)" name="mealPrice" value={form.mealPrice} onChange={updateField} type="number" min="0" placeholder="If charged separately" />

                    <Field
                      label="Tax included in displayed price?"
                      name="taxIncluded"
                      value={form.taxIncluded}
                      onChange={updateField}
                      options={[
                        { value: "yes", label: "Yes" },
                        { value: "no", label: "No" },
                        { value: "not-sure", label: "To be confirmed" },
                      ]}
                    />

                    <Field label="Cancellation policy" name="cancellationPolicy" value={form.cancellationPolicy} onChange={updateField} options={["Flexible", "Moderate", "Strict", "Non-refundable", "To be decided"]} />

                    <Field label="Advance payment required?" name="advanceRequired" value={form.advanceRequired} onChange={updateField} options={["No", "Yes", "Depends on booking"]} />

                    <Field label="Minimum stay" name="minimumNights" value={form.minimumNights} onChange={updateField} options={[{ value: "1", label: "1 night" }, { value: "2", label: "2 nights" }, { value: "3", label: "3 nights" }, { value: "4", label: "4 nights" }, { value: "5", label: "5+ nights" }]} />

                    <Field label="Check-in time" name="checkIn" value={form.checkIn} onChange={updateField} options={["10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "Flexible"]} />

                    <Field label="Check-out time" name="checkOut" value={form.checkOut} onChange={updateField} options={["09:00", "10:00", "11:00", "12:00", "13:00", "Flexible"]} />
                  </div>

                  <p className="mt-5 rounded-xl border border-amber-200 bg-amber-50 p-3.5 text-sm leading-5 text-amber-900">
                    Final rates, tax treatment, inclusions and cancellation terms must be confirmed before publishing.
                  </p>
                </>
              )}

              {/* STEP 4: GST, PAN AND PROPERTY COMPLIANCE */}
              {step === 3 && (
                <>
                  <SectionHeading title="GST, business & legal details" description="Provide applicable registration details for verification." />

                  <p className="mb-5 rounded-xl border border-blue-200 bg-blue-50 p-3.5 text-sm leading-5 text-blue-900">
                    GST requirements depend on the business and applicable rules. Confirm applicability with your tax professional where needed.
                  </p>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field
                      label="Are you GST registered?"
                      name="gstRegistered"
                      value={form.gstRegistered}
                      onChange={updateField}
                      options={[
                        { value: "yes", label: "Yes, registered" },
                        { value: "no", label: "No" },
                        { value: "applied", label: "Applied for registration" },
                        { value: "unsure", label: "Not sure / need guidance" },
                      ]}
                      required
                    />

                    {form.gstRegistered === "yes" && (
                      <>
                        <Field label="GSTIN" name="gstin" value={form.gstin} onChange={(e) => updateValue("gstin", e.target.value.toUpperCase().slice(0, 15))} placeholder="15-character GSTIN" maxLength={15} required error={errors.gstin} />

                        <div className="sm:col-span-2">
                          <Field label="Legal name as per GST registration" name="legalName" value={form.legalName} onChange={updateField} placeholder="Name on GST certificate" required error={errors.legalName} />
                        </div>

                        <div className="sm:col-span-2">
                          <Field label="Registered business address" name="gstAddress" value={form.gstAddress} onChange={updateField} placeholder="Address as per registration (optional)" />
                        </div>
                      </>
                    )}

                    <Field label="PAN (if applicable)" name="panNumber" value={form.panNumber} onChange={(e) => updateValue("panNumber", e.target.value.toUpperCase().slice(0, 10))} placeholder="10-character PAN" maxLength={10} error={errors.panNumber} hint="Provide only when required for the onboarding process." />

                    <Field label="Property ownership" name="propertyOwnership" value={form.propertyOwnership} onChange={updateField} options={[{ value: "owner", label: "I own the property" }, { value: "leased", label: "Leased / rented" }, { value: "authorised", label: "Managing with authorisation" }, { value: "other", label: "Other arrangement" }]} />

                    <Field label="Business registration details" name="businessRegistration" value={form.businessRegistration} onChange={updateField} placeholder="Number, if applicable" />

                    <Field label="Tourism / operating registration" name="tourismRegistration" value={form.tourismRegistration} onChange={updateField} placeholder="Number, if applicable" />

                    <Field label="FSSAI number" name="fssaiNumber" value={form.fssaiNumber} onChange={updateField} placeholder="If applicable to food operations" />

                    <Field label="Other licence / permit" name="otherLicence" value={form.otherLicence} onChange={updateField} placeholder="Type or reference, if applicable" />

                    <div className="sm:col-span-2">
                      <label htmlFor="documentNotes" className={labelClass}>Additional legal / verification notes</label>
                      <textarea id="documentNotes" name="documentNotes" rows={2} maxLength={500} value={form.documentNotes} onChange={updateField} placeholder="Optional notes about applicable registrations." className={`${inputClass} resize-y`} />
                    </div>
                  </div>

                  {/* Sensitive payout details intentionally omitted until secure backend is available. */}
                  <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50 p-3.5 text-sm leading-5 text-amber-900">
                    <ShieldCheck className="mr-2 inline h-4 w-4" />
                    Bank account and payout details will be collected separately after verification through a secure process.
                  </div>
                </>
              )}

              {/* STEP 5: PROPERTY PHOTOS, DOCUMENTS AND DECLARATIONS */}
              {step === 4 && (
                <>
                  <SectionHeading title="Photos & supporting documents" description="Select property images and applicable verification files." />

                  <p className="mb-5 rounded-xl border border-blue-200 bg-blue-50 p-3.5 text-sm leading-5 text-blue-900">
                    Files are only selected in this browser. They are not uploaded or saved in this version.
                  </p>

                  {/* Property photo selector */}
                  <div>
                    <h3 className="text-sm font-bold">Property photographs</h3>
                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      Maximum 10 images, up to 5 MB each.
                    </p>

                    <input ref={photoInputRef} type="file" accept="image/*" multiple onChange={(event) => addFiles(event, "photos")} className="hidden" />

                    <button type="button" onClick={() => photoInputRef.current?.click()} className="mt-3 flex min-h-24 w-full flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 p-4 text-center transition hover:border-[#B96928]/60">
                      <ImagePlus className="h-7 w-7 text-[#B96928]" />
                      <span className="mt-2 text-sm font-bold">Choose property photos</span>
                      <span className="mt-1 text-xs text-slate-500">Images up to 5 MB each</span>
                    </button>

                    {photos.length > 0 && (
                      <div className="mt-3 space-y-2">
                        {photos.map((file, index) => (
                          <div key={`${file.name}-${file.size}-${index}`} className="flex items-center gap-3 rounded-xl border border-slate-200 p-2.5">
                            <ImagePlus className="h-5 w-5 shrink-0 text-[#B96928]" />
                            <div className="min-w-0 flex-1">
                              <p className="truncate text-sm font-semibold">{file.name}</p>
                              <p className="text-xs text-slate-400">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                            </div>
                            <button type="button" onClick={() => removeFile("photos", index)} aria-label={`Remove ${file.name}`} className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-600">
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="my-6 border-t border-slate-100" />

                  {/* Supporting document selector */}
                  <div>
                    <h3 className="text-sm font-bold">Applicable supporting documents</h3>
                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      Only provide documents relevant to your property and business.
                    </p>

                    <div className="mt-3 grid gap-2 sm:grid-cols-2">
                      {documentTypes.map((item) => (
                        <div key={item} className="flex items-start gap-2 rounded-xl border border-slate-200 p-2.5 text-sm text-slate-700">
                          <FileText className="mt-0.5 h-4 w-4 shrink-0 text-[#B96928]" />
                          {item}
                        </div>
                      ))}
                    </div>

                    <input ref={documentInputRef} type="file" accept=".pdf,.jpg,.jpeg,.png,.webp,.doc,.docx" multiple onChange={(event) => addFiles(event, "documents")} className="hidden" />

                    <button type="button" onClick={() => documentInputRef.current?.click()} className="mt-3 flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-sm font-bold transition hover:border-[#B96928] hover:text-[#B96928]">
                      <Upload className="h-4 w-4" />
                      Choose supporting files
                    </button>

                    <p className="mt-1.5 text-xs text-slate-500">Maximum 10 files, 5 MB each. PDF, images, DOC or DOCX.</p>

                    {documents.length > 0 && (
                      <div className="mt-3 space-y-2">
                        {documents.map((file, index) => (
                          <div key={`${file.name}-${file.size}-${index}`} className="flex items-center gap-3 rounded-xl border border-slate-200 p-2.5">
                            <FileText className="h-5 w-5 shrink-0 text-[#B96928]" />
                            <div className="min-w-0 flex-1">
                              <p className="truncate text-sm font-semibold">{file.name}</p>
                              <p className="text-xs text-slate-400">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                            </div>
                            <button type="button" onClick={() => removeFile("documents", index)} aria-label={`Remove ${file.name}`} className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-600">
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="my-6 border-t border-slate-100" />

                  {/* Required declarations */}
                  <SectionHeading title="Declarations" description="All three confirmations are required for the preview." />

                  <div className="space-y-3">
                    <Declaration checked={form.declarationAccuracy} onChange={(value) => updateValue("declarationAccuracy", value)} title="The information provided is accurate." description="I will correct inaccurate or outdated details." error={errors.declarationAccuracy} />

                    <Declaration checked={form.declarationAuthority} onChange={(value) => updateValue("declarationAuthority", value)} title="I own or am authorised to represent this property." description="I can provide supporting evidence where applicable." error={errors.declarationAuthority} />

                    <Declaration checked={form.declarationPrivacy} onChange={(value) => updateValue("declarationPrivacy", value)} title="I acknowledge the verification and data handling process." description="I understand that real submission requires the applicable privacy notice and secure backend." error={errors.declarationPrivacy} />
                  </div>
                </>
              )}

              {/* Form notices and step controls */}
              {notice && (
                <div role="status" className={`mt-5 rounded-xl border px-3.5 py-3 text-sm leading-5 ${
                  noticeType === "error"
                    ? "border-red-200 bg-red-50 text-red-700"
                    : "border-blue-200 bg-blue-50 text-blue-800"
                }`}>
                  {notice}
                </div>
              )}

              <div className="mt-6 flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
                <button type="button" onClick={goBack} disabled={step === 0} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-bold transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40">
                  <ArrowLeft className="h-4 w-4" />
                  Previous
                </button>

                {step < steps.length - 1 ? (
                  <button type="button" onClick={goNext} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#B96928] px-6 py-2.5 text-sm font-bold text-white transition hover:bg-[#a75b23]">
                    Continue <ArrowRight className="h-4 w-4" />
                  </button>
                ) : (
                  <button type="submit" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#B96928] px-6 py-2.5 text-sm font-bold text-white transition hover:bg-[#a75b23]">
                    Review details <ArrowRight className="h-4 w-4" />
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* -------------------- SIDEBAR: GUIDANCE -------------------- */}
          <aside className="space-y-4 lg:sticky lg:top-6">
            <div className="rounded-3xl bg-[#172033] p-5 text-white shadow-xl">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#B96928]/20 text-[#E2A36C]">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-lg font-bold">Before you submit</h3>

              <ul className="mt-3 space-y-3 text-sm leading-5 text-slate-300">
                <li className="flex gap-2">
                  <Check className="h-4 w-4 shrink-0 text-[#E2A36C]" />
                  Use accurate property details.
                </li>
                <li className="flex gap-2">
                  <Check className="h-4 w-4 shrink-0 text-[#E2A36C]" />
                  Provide applicable documents only.
                </li>
                <li className="flex gap-2">
                  <Check className="h-4 w-4 shrink-0 text-[#E2A36C]" />
                  Confirm prices and policies.
                </li>
                <li className="flex gap-2">
                  <Check className="h-4 w-4 shrink-0 text-[#E2A36C]" />
                  Approval is required before listing.
                </li>
              </ul>

              <a href={`https://wa.me/?text=${whatsappMessage}`} target="_blank" rel="noopener noreferrer" className="mt-5 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-bold text-[#172033] transition hover:bg-slate-100">
                <MessageCircle className="h-4 w-4 text-emerald-700" />
                Talk to our team
              </a>
            </div>

            {/* Current step indicator */}
            <div className="rounded-3xl border border-slate-200 bg-white p-5">
              <h3 className="font-bold">Your progress</h3>
              <div className="mt-4 space-y-3">
                {steps.map((item, index) => (
                  <div key={item.title} className="flex items-center gap-3">
                    <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs font-bold ${
                      index === step
                        ? "bg-[#B96928] text-white"
                        : index < step
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-slate-100 text-slate-400"
                    }`}>
                      {index < step ? <Check className="h-4 w-4" /> : index + 1}
                    </span>
                    <div>
                      <p className="text-sm font-semibold">{item.title}</p>
                      <p className="text-xs text-slate-500">{item.subtitle}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-[#B96928]/15 bg-[#B96928]/[0.05] p-4">
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-[#B96928]" />
                <p className="text-sm font-bold">Looking for a stay?</p>
              </div>
              <Link href="/stay" className="mt-2 inline-flex items-center gap-2 text-sm font-bold text-[#B96928] hover:underline">
                Explore stays <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </aside>
        </div>
      </section>

      {/* -------------------- CONTACT CTA -------------------- */}
      <section className="px-4 pb-10 sm:px-6 sm:pb-12 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-4 rounded-3xl border border-slate-200 bg-white p-5 sm:p-7 md:flex-row md:items-center">
          <div>
            <p className="text-xs font-black uppercase tracking-wider text-[#B96928]">Need assistance?</p>
            <h2 className="mt-1.5 text-xl font-black text-[#172033] sm:text-2xl">Let&apos;s discuss your property.</h2>
            <p className="mt-1.5 text-sm text-slate-600">Ask our team about the listing process.</p>
          </div>
          <Link href="/contact" className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-bold transition hover:border-[#B96928] hover:text-[#B96928]">
            Contact us <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* -------------------- REVIEW PREVIEW MODAL -------------------- */}
      {showPreview && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-[#101827]/70 p-3 backdrop-blur-sm sm:p-4" role="dialog" aria-modal="true" aria-labelledby="preview-title">
          <div className="my-auto max-h-[94vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white p-4 shadow-2xl sm:p-7">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase tracking-wider text-[#B96928]">Registration preview</p>
                <h2 id="preview-title" className="mt-1.5 text-2xl font-black">{form.propertyName || "Your property"}</h2>
                <p className="mt-1.5 text-sm text-slate-500">Review the details before leaving the preview.</p>
              </div>
              <button type="button" onClick={() => setShowPreview(false)} aria-label="Close preview" className="rounded-xl p-2 text-slate-500 hover:bg-slate-100">
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Property summary */}
            <div className="mt-5 rounded-2xl bg-[#F7F5F0] p-4">
              <p className="text-sm font-bold">{selectedPropertyType}</p>
              <p className="mt-1 text-sm text-slate-600">
                {[form.locality, form.city, form.district, form.state, form.pinCode].filter(Boolean).join(", ")}
              </p>
              <p className="mt-2 text-lg font-black text-[#B96928]">
                {form.basePrice ? `Starting at ₹${Number(form.basePrice).toLocaleString("en-IN")} / night` : "Price not entered"}
              </p>
            </div>

            {/* Review fields */}
            <div className="mt-5 grid gap-x-5 gap-y-3 sm:grid-cols-2">
              {[
                ["Owner", form.ownerName],
                ["Designation", form.designation],
                ["Mobile", form.phone],
                ["WhatsApp", form.whatsapp || "Not provided"],
                ["Email", form.email || "Not provided"],
                ["Property email", form.propertyEmail || "Not provided"],
                ["Business name", form.businessName || form.propertyName],
                ["Business constitution", form.businessType],
                ["Full address", form.address],
                ["Website", form.website || "Not provided"],
                ["Total rooms / units", form.totalRooms],
                ["Guest capacity", form.maxGuests],
                ["Primary room type", form.roomType],
                ["Room units", form.roomQuantity || "Not provided"],
                ["Facilities", form.facilities.join(", ") || "Not selected"],
                ["Weekend price", form.weekendPrice ? `₹${form.weekendPrice}` : "Not provided"],
                ["Extra adult charge", form.extraAdultPrice ? `₹${form.extraAdultPrice}` : "Not provided"],
                ["Child charge", form.childPrice ? `₹${form.childPrice}` : "Not provided"],
                ["Tax included", form.taxIncluded],
                ["Cancellation policy", form.cancellationPolicy],
                ["Advance required", form.advanceRequired],
                ["Check-in / check-out", `${form.checkIn} / ${form.checkOut}`],
                ["GST status", form.gstRegistered],
                ["GSTIN", form.gstRegistered === "yes" ? form.gstin : "Not supplied"],
                ["Legal business name", form.legalName || "Not provided"],
                ["PAN", form.panNumber ? "Provided in form" : "Not provided"],
                ["Property ownership", form.propertyOwnership],
                ["Photos selected", String(photos.length)],
                ["Documents selected", String(documents.length)],
              ].map(([label, value]) => (
                <div key={label} className="min-w-0 border-b border-slate-100 pb-2.5">
                  <p className="text-xs text-slate-500">{label}</p>
                  <p className="mt-1 break-words text-sm font-semibold text-[#172033]">{value || "Not provided"}</p>
                </div>
              ))}
            </div>

            {/* Honest UI-only notice */}
            <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50 p-3.5 text-sm leading-5 text-amber-900">
              This is a frontend preview only. Your details and selected files have not been saved or sent. Backend integration is required for real submission.
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <button type="button" onClick={() => { setShowPreview(false); setStep(0); }} className="min-h-11 rounded-xl border border-slate-200 px-4 py-3 text-sm font-bold hover:bg-slate-50">
                Edit information
              </button>
              <button type="button" onClick={finishPreview} className="min-h-11 rounded-xl bg-[#B96928] px-4 py-3 text-sm font-bold text-white hover:bg-[#a75b23]">
                Finish preview
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
