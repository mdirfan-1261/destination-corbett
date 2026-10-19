"use client";

function getStatusStyle(status) {
  const value = String(status || "unknown").toLowerCase().trim();

  if (
    value.includes("confirm") ||
    value.includes("approved") ||
    value.includes("active") ||
    value.includes("verified") ||
    value.includes("completed")
  ) {
    return "bg-emerald-50 text-emerald-700 ring-emerald-600/20";
  }

  if (
    value.includes("reject") ||
    value.includes("cancel") ||
    value.includes("suspend") ||
    value.includes("fail") ||
    value.includes("inactive")
  ) {
    return "bg-red-50 text-red-700 ring-red-600/20";
  }

  if (
    value.includes("review") ||
    value.includes("pending") ||
    value.includes("process") ||
    value.includes("requested") ||
    value.includes("awaiting")
  ) {
    return "bg-amber-50 text-amber-700 ring-amber-600/20";
  }

  return "bg-slate-100 text-slate-700 ring-slate-500/20";
}

function formatStatus(status) {
  if (!status) return "Unknown";

  return String(status)
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

export default function StatusBadge({ status, className = "" }) {
  return (
    <span
      className={`inline-flex max-w-full items-center rounded-full px-2.5 py-1 text-xs font-semibold leading-4 ring-1 ring-inset ${getStatusStyle(
        status
      )} ${className}`}
    >
      <span className="mr-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-current" />
      <span className="break-words">{formatStatus(status)}</span>
    </span>
  );
}
