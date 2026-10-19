
"use client";

import PropertyForm from "@/components/agent/PropertyForm";

export default function RoomForm({
  fields = [],
  initialValues = {},
  onSubmit,
  onCancel,
  loading = false,
  error = "",
  submitLabel = "Save Room",
}) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
      <div className="mb-5">
        <h2 className="text-lg font-bold text-slate-900">
          Room Details
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Enter the room information required by your property setup.
        </p>
      </div>

      <PropertyForm
        fields={fields}
        initialValues={initialValues}
        onSubmit={onSubmit}
        onCancel={onCancel}
        loading={loading}
        error={error}
        submitLabel={submitLabel}
      />
    </section>
  );
}

