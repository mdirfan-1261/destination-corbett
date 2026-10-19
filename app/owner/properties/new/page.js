"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Building2 } from "lucide-react";
import PropertyForm from "@/components/owner/PropertyForm";

import { createProperty } from "@/lib/ownerApi";

const propertyFields = [
  {
    name: "name",
    label: "Property Name",
    required: true,
    placeholder: "Enter property name",
  },
  {
    name: "propertyType",
    label: "Property Type",
    type: "select",
    required: true,
    options: [
      { value: "resort", label: "Resort" },
      { value: "hotel", label: "Hotel" },
      { value: "homestay", label: "Homestay" },
      { value: "villa", label: "Villa" },
      { value: "guest_house", label: "Guest House" },
      { value: "other", label: "Other" },
    ],
  },
  {
    name: "totalRooms",
    label: "Total Rooms",
    type: "number",
    min: 0,
    placeholder: "e.g. 20",
  },
  {
    name: "pincode",
    label: "PIN Code",
    placeholder: "Enter PIN code",
  },
  {
    name: "address",
    label: "Full Address",
    required: true,
    placeholder: "Enter property address",
  },
  {
    name: "city",
    label: "City / Area",
    required: true,
    placeholder: "City or area",
  },
  {
    name: "state",
    label: "State",
    type: "select",
    required: true,
    options: [
      "Uttarakhand",
      "Uttar Pradesh",
      "Delhi",
      "Haryana",
      "Rajasthan",
      "Himachal Pradesh",
      "Punjab",
      "Other",
    ],
  },
  {
    name: "description",
    label: "Property Description",
    type: "textarea",
    rows: 4,
    fullWidth: true,
    placeholder: "Describe your property and facilities",
  },
  {
    name: "contactName",
    label: "Contact Person",
    required: true,
    placeholder: "Contact person name",
  },
  {
    name: "contactPhone",
    label: "Contact Phone",
    type: "tel",
    required: true,
    placeholder: "Phone number",
  },
  {
    name: "contactEmail",
    label: "Contact Email",
    type: "email",
    placeholder: "Email address",
  },
  {
    name: "checkInTime",
    label: "Check-in Time",
    type: "time",
  },
  {
    name: "checkOutTime",
    label: "Check-out Time",
    type: "time",
  },
];

const initialForm = {
  name: "",
  propertyType: "resort",
  description: "",
  address: "",
  city: "",
  state: "",
  pincode: "",
  contactName: "",
  contactPhone: "",
  contactEmail: "",
  totalRooms: "",
  checkInTime: "12:00",
  checkOutTime: "11:00",
};

export default function NewOwnerPropertyPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function submit(values) {
    if (saving) return;

    setSaving(true);
    setError("");

    try {
      const payload = {
        ...values,
        totalRooms:
          values.totalRooms === "" || values.totalRooms == null
            ? undefined
            : Number(values.totalRooms),
      };

      const result = await createProperty(payload);

      const data = result?.data?.data ?? result?.data ?? result;
      const property = data?.property || data?.data?.property || data;
      const id = property?._id || property?.id || property?.propertyId;

      router.push(id ? `/owner/properties/${id}` : "/owner/properties");
      router.refresh();
    } catch (err) {
      if ([401, 403].includes(Number(err?.status))) {
        localStorage.removeItem("destin_owner_token");
        router.replace("/owner/login");
        return;
      }

      setError(err?.message || "Unable to create property.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#F7F5F0] p-4 text-[#172033] sm:p-6 lg:p-8">
      <div className="mx-auto max-w-4xl">
        <Link
          href="/owner/properties"
          className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 transition hover:text-[#B96928]"
        >
          <ArrowLeft size={16} />
          My Properties
        </Link>

        <div className="mt-5 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-50 text-[#B96928]">
            <Building2 size={24} />
          </div>

          <div>
            <h1 className="text-2xl font-black sm:text-3xl">
              Add Your Property
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              List your resort, hotel, homestay or villa on Destination Corbett.
            </p>
          </div>
        </div>

        <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-5 sm:p-7">
          <PropertyForm
            fields={propertyFields}
            initialValues={initialForm}
            onSubmit={submit}
            loading={saving}
            error={error}
            submitLabel="Submit Property"
          />
        </div>
      </div>
    </main>
  );
}