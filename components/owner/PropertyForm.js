
"use client";

import { useState } from "react";
import { LoaderCircle, Save, X } from "lucide-react";

export default function PropertyForm({
  fields = [],
  initialValues = {},
  onSubmit,
  onCancel,
  loading = false,
  error = "",
  submitLabel = "Save Property",
}) {
  const [values, setValues] = useState(() => ({ ...initialValues }));
  const [submitError, setSubmitError] = useState("");

  function handleChange(name, value) {
    setValues((current) => ({
      ...current,
      [name]: value,
    }));

    setSubmitError("");
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (loading || typeof onSubmit !== "function") {
      return;
    }

    setSubmitError("");

    try {
      await onSubmit({ ...values });
    } catch (err) {
      setSubmitError(
        err?.message || "Unable to save property. Please try again."
      );
    }
  }

  function renderField(field) {
    const {
      name,
      label,
      type = "text",
      required = false,
      placeholder = "",
      options = [],
      disabled = false,
      rows = 4,
      min,
      max,
      step,
      description,
    } = field;

    const value = values[name] ?? "";
    const fieldId = `property-${name}`;

    const commonClass =
      "w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-[#B96928] focus:ring-2 focus:ring-[#B96928]/15 disabled:cursor-not-allowed disabled:bg-slate-50";

    return (
      <div
        key={name}
        className={field.fullWidth ? "sm:col-span-2" : ""}
      >
        <label
          htmlFor={fieldId}
          className="mb-1.5 block text-sm font-semibold text-slate-700"
        >
          {label}
          {required && (
            <span className="ml-1 text-red-600">*</span>
          )}
        </label>

        {type === "textarea" ? (
          <textarea
            id={fieldId}
            name={name}
            rows={rows}
            required={required}
            disabled={disabled || loading}
            placeholder={placeholder}
            value={value}
            onChange={(event) =>
              handleChange(name, event.target.value)
            }
            aria-describedby={
              description ? `${fieldId}-description` : undefined
            }
            className={`${commonClass} resize-y`}
          />
        ) : type === "select" ? (
          <select
            id={fieldId}
            name={name}
            required={required}
            disabled={disabled || loading}
            value={value}
            onChange={(event) =>
              handleChange(name, event.target.value)
            }
            className={commonClass}
          >
            <option value="">Select {label}</option>

            {options.map((option) => {
              const optionValue =
                typeof option === "object"
                  ? option.value
                  : option;

              const optionLabel =
                typeof option === "object"
                  ? option.label
                  : option;

              return (
                <option
                  key={String(optionValue)}
                  value={optionValue}
                >
                  {optionLabel}
                </option>
              );
            })}
          </select>
        ) : type === "checkbox" ? (
          <label className="flex min-h-11 items-center gap-3 rounded-xl border border-slate-200 px-3.5">
            <input
              id={fieldId}
              name={name}
              type="checkbox"
              checked={Boolean(value)}
              disabled={disabled || loading}
              onChange={(event) =>
                handleChange(name, event.target.checked)
              }
              className="h-4 w-4 accent-[#B96928]"
            />

            <span className="text-sm text-slate-700">
              {description || label}
            </span>
          </label>
        ) : (
          <input
            id={fieldId}
            name={name}
            type={type}
            required={required}
            disabled={disabled || loading}
            placeholder={placeholder}
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={(event) => {
              const inputValue = event.target.value;

              handleChange(name, inputValue);
            }}
            aria-describedby={
              description ? `${fieldId}-description` : undefined
            }
            className={commonClass}
          />
        )}

        {description && type !== "checkbox" && (
          <p
            id={`${fieldId}-description`}
            className="mt-1.5 text-xs text-slate-500"
          >
            {description}
          </p>
        )}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {(error || submitError) && (
        <div
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {submitError || error}
        </div>
      )}

      {fields.length === 0 ? (
        <p className="rounded-xl border border-dashed border-slate-300 p-5 text-sm text-slate-500">
          Form fields are not configured. Provide the fields
          from the property schema.
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {fields.map(renderField)}
        </div>
      )}

      <div className="flex flex-wrap justify-end gap-3 border-t border-slate-100 pt-4">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
          >
            <X size={16} />
            Cancel
          </button>
        )}

        <button
          type="submit"
          disabled={loading || fields.length === 0}
          className="inline-flex items-center gap-2 rounded-xl bg-[#B96928] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#9F5922] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? (
            <LoaderCircle
              size={17}
              className="animate-spin"
            />
          ) : (
            <Save size={17} />
          )}

          {loading ? "Saving..." : submitLabel}
        </button>
      </div>
    </form>
  );
}
