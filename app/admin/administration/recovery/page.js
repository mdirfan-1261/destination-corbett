"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Archive,
  CheckCircle2,
  Clock3,
  Database,
  RefreshCw,
  RotateCcw,
  Search,
  ShieldAlert,
  Trash2,
  X,
} from "lucide-react";

export default function RecoveryPage() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("all");

  const [actionLoading, setActionLoading] = useState("");
  const [confirmRecord, setConfirmRecord] = useState(null);
  const [confirmAction, setConfirmAction] = useState("");

  const API_URL =
    process.env.NEXT_PUBLIC_API_URL ||
    "http://localhost:5000";

  // =====================================================
  // FETCH RECOVERY RECORDS
  // =====================================================

  const fetchRecoveryRecords = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("adminToken");

      const response = await fetch(
        `${API_URL}/api/admin/recovery`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to load Recovery Bin."
        );
      }

      setRecords(data.records || []);
    } catch (error) {
      console.error(
        "Recovery Bin error:",
        error
      );

      setError(
        error.message ||
          "Failed to load Recovery Bin."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecoveryRecords();
  }, []);

  // =====================================================
  // DAYS REMAINING
  // =====================================================

  const getRecoveryDeadline = (record) => {
    if (record.recoveryStage === "department") {
      return record.departmentStageExpiresAt;
    }

    if (record.recoveryStage === "super_admin") {
      return record.superAdminExpiresAt;
    }

    return null;
  };

  const getDaysRemaining = (record) => {
    const deadline = getRecoveryDeadline(record);

    if (!deadline) {
      return 0;
    }

    const remaining =
      new Date(deadline).getTime() -
      Date.now();

    return Math.max(
      0,
      Math.ceil(
        remaining /
          (1000 * 60 * 60 * 24)
      )
    );
  };

  // =====================================================
  // RECORD TYPES
  // =====================================================

  const recordTypes = useMemo(() => {
    const types = records.map(
      (record) => record.recordType
    );

    return [
      "all",
      ...Array.from(new Set(types)),
    ];
  }, [records]);

  // =====================================================
  // FILTER RECORDS
  // =====================================================

  const filteredRecords = useMemo(() => {
    const searchValue =
      search.trim().toLowerCase();

    return records.filter((record) => {
      const matchesSearch =
        !searchValue ||
        record.recordName
          ?.toLowerCase()
          .includes(searchValue) ||
        record.department
          ?.toLowerCase()
          .includes(searchValue) ||
        record.deletedByName
          ?.toLowerCase()
          .includes(searchValue) ||
        record.recordType
          ?.toLowerCase()
          .includes(searchValue);

      const matchesType =
        filterType === "all" ||
        record.recordType ===
          filterType;

      return (
        matchesSearch &&
        matchesType
      );
    });
  }, [
    records,
    search,
    filterType,
  ]);

  // =====================================================
  // OPEN CONFIRMATION
  // =====================================================

  const openConfirmation = (
    record,
    action
  ) => {
    setConfirmRecord(record);
    setConfirmAction(action);
  };

  // =====================================================
  // CLOSE CONFIRMATION
  // =====================================================

  const closeConfirmation = () => {
    if (actionLoading) return;

    setConfirmRecord(null);
    setConfirmAction("");
  };

  // =====================================================
  // PERMANENT DELETE
  // =====================================================

  const handlePermanentDelete = async (
    id
  ) => {
    try {
      setActionLoading(id);

      const token =
        localStorage.getItem(
          "adminToken"
        );

      const response = await fetch(
        `${API_URL}/api/admin/recovery/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to permanently delete record."
        );
      }

      setRecords((prevRecords) =>
        prevRecords.filter(
          (record) =>
            record._id !== id
        )
      );

      closeConfirmation();
    } catch (error) {
      console.error(
        "Permanent delete error:",
        error
      );

      setError(
        error.message ||
          "Failed to permanently delete record."
      );

      closeConfirmation();
    } finally {
      setActionLoading("");
    }
  };

  // =====================================================
  // RESTORE
  // =====================================================

  const handleRestore = async (
    id
  ) => {
    try {
      setError("");
      setSuccess("");
      setActionLoading(id);

      const token =
        localStorage.getItem(
          "adminToken"
        );

      const response = await fetch(
        `${API_URL}/api/admin/recovery/${id}/restore`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to restore record."
        );
      }

      /*
        Current backend only confirms that
        the record is ready to be restored.

        It does NOT yet restore the original
        record into its original collection.
      */

      setSuccess(
        "Record restored successfully."
      );

      closeConfirmation();
    } catch (error) {
      console.error(
        "Restore error:",
        error
      );

      setError(
        error.message ||
          "Failed to restore record."
      );

      closeConfirmation();
    } finally {
      setActionLoading("");
    }
  };

  // =====================================================
  // CONFIRM ACTION
  // =====================================================

  const handleConfirmedAction = () => {
    if (!confirmRecord) return;

    if (
      confirmAction ===
      "permanent_delete"
    ) {
      handlePermanentDelete(
        confirmRecord._id
      );
    }

    if (
      confirmAction ===
      "restore"
    ) {
      handleRestore(
        confirmRecord._id
      );
    }
  };

  // =====================================================
  // RECORD LABEL
  // =====================================================

  const getRecordTypeLabel = (
    type
  ) => {
    if (!type) return "Record";

    return type
      .replace(/_/g, " ")
      .replace(/\b\w/g, (letter) =>
        letter.toUpperCase()
      );
  };

  // =====================================================
  // DAYS COLOR
  // =====================================================

  const getDaysClass = (
    days
  ) => {
    if (days <= 3) {
      return "bg-red-50 text-red-600 border-red-100";
    }

    if (days <= 7) {
      return "bg-amber-50 text-amber-700 border-amber-100";
    }

    return "bg-[#18352A]/5 text-[#18352A] border-[#18352A]/10";
  };

  // =====================================================
  // STAGE LABEL
  // =====================================================

  const getStageLabel = (record) => {
    if (
      record.recoveryStage ===
      "department"
    ) {
      return "Department";
    }

    if (
      record.recoveryStage ===
      "super_admin"
    ) {
      return "Super Admin";
    }

    return "Completed";
  };

  return (
    <div className="min-h-full bg-[#F7F5F0] p-3 sm:p-5 lg:p-6">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="mb-4 flex flex-col gap-3 sm:mb-5 sm:flex-row sm:items-center sm:justify-between">

        <div className="flex items-start gap-3">

          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#18352A] text-white shadow-sm">
            <Archive size={18} />
          </div>

          <div>
            <h1 className="text-lg font-bold tracking-tight text-[#172033] sm:text-xl">
              Recovery Bin
            </h1>

            <p className="mt-0.5 text-xs text-gray-500 sm:text-sm">
              Deleted records follow a 7-day department stage and 15-day Super Admin stage.
            </p>
          </div>

        </div>

        <button
          type="button"
          onClick={fetchRecoveryRecords}
          disabled={loading}
          className="inline-flex h-9 items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-3 text-xs font-semibold text-[#172033] shadow-sm transition hover:border-[#18352A]/30 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <RefreshCw
            size={14}
            className={
              loading
                ? "animate-spin"
                : ""
            }
          />

          Refresh
        </button>

      </div>

      {/* =================================================
          ERROR / MESSAGE
      ================================================= */}

      {error && (
        <div className="mb-4 flex items-start gap-3 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-xs text-red-600">

          <ShieldAlert
            size={16}
            className="mt-0.5 shrink-0"
          />

          <span className="flex-1">
            {error}
          </span>

          <button
            type="button"
            onClick={() =>
              setError("")
            }
            className="shrink-0 rounded-md p-1 hover:bg-red-100"
          >
            <X size={14} />
          </button>

        </div>
      )}

      {success && (
        <div className="mb-4 flex items-start gap-3 rounded-xl border border-green-100 bg-green-50 px-4 py-3 text-xs text-green-700">

          <CheckCircle2
            size={16}
            className="mt-0.5 shrink-0"
          />

          <span className="flex-1">
            {success}
          </span>

          <button
            type="button"
            onClick={() =>
              setSuccess("")
            }
            className="shrink-0 rounded-md p-1 hover:bg-green-100"
          >
            <X size={14} />
          </button>

        </div>
      )}

      {/* =================================================
          STATS
      ================================================= */}

      {!loading && (
        <div className="mb-4 grid grid-cols-2 gap-2 sm:grid-cols-3">

          <div className="rounded-xl border border-gray-200 bg-white p-3 shadow-sm">

            <div className="flex items-center gap-2 text-gray-400">
              <Database size={14} />

              <span className="text-[10px] font-semibold uppercase tracking-wide">
                Deleted
              </span>
            </div>

            <p className="mt-1 text-lg font-bold text-[#172033]">
              {records.length}
            </p>

          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-3 shadow-sm">

            <div className="flex items-center gap-2 text-gray-400">
              <Clock3 size={14} />

              <span className="text-[10px] font-semibold uppercase tracking-wide">
                Retention
              </span>
            </div>

            <p className="mt-1 text-lg font-bold text-[#172033]">
              22 Days
            </p>

          </div>

          <div className="col-span-2 rounded-xl border border-gray-200 bg-white p-3 shadow-sm sm:col-span-1">

            <div className="flex items-center gap-2 text-gray-400">
              <CheckCircle2 size={14} />

              <span className="text-[10px] font-semibold uppercase tracking-wide">
                Showing
              </span>
            </div>

            <p className="mt-1 text-lg font-bold text-[#172033]">
              {filteredRecords.length}
            </p>

          </div>

        </div>
      )}

      {/* =================================================
          SEARCH + FILTER
      ================================================= */}

      <div className="mb-4 flex flex-col gap-2 sm:flex-row">

        <div className="relative flex-1">

          <Search
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            type="text"
            value={search}
            onChange={(event) =>
              setSearch(
                event.target.value
              )
            }
            placeholder="Search deleted records..."
            className="h-10 w-full rounded-lg border border-gray-200 bg-white pl-9 pr-3 text-xs text-[#172033] outline-none transition placeholder:text-gray-400 focus:border-[#18352A]/40 focus:ring-2 focus:ring-[#18352A]/5"
          />

        </div>

        <select
          value={filterType}
          onChange={(event) =>
            setFilterType(
              event.target.value
            )
          }
          className="h-10 rounded-lg border border-gray-200 bg-white px-3 text-xs font-medium text-[#172033] outline-none focus:border-[#18352A]/40"
        >
          {recordTypes.map(
            (type) => (
              <option
                key={type}
                value={type}
              >
                {type === "all"
                  ? "All Types"
                  : getRecordTypeLabel(
                      type
                    )}
              </option>
            )
          )}
        </select>

      </div>

      {/* =================================================
          LOADING
      ================================================= */}

      {loading && (
        <div className="rounded-xl border border-gray-200 bg-white p-8 text-center shadow-sm">

          <RefreshCw
            size={20}
            className="mx-auto animate-spin text-[#18352A]"
          />

          <p className="mt-2 text-xs text-gray-500">
            Loading Recovery Bin...
          </p>

        </div>
      )}

      {/* =================================================
          EMPTY
      ================================================= */}

      {!loading &&
        records.length === 0 && (
          <div className="rounded-xl border border-gray-200 bg-white p-8 text-center shadow-sm">

            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#18352A]/5 text-[#18352A]">
              <Archive size={20} />
            </div>

            <h2 className="mt-3 text-sm font-semibold text-[#172033]">
              Recovery Bin is empty
            </h2>

            <p className="mt-1 text-xs text-gray-500">
              Deleted records will appear here.
            </p>

          </div>
        )}

      {/* =================================================
          NO FILTER RESULTS
      ================================================= */}

      {!loading &&
        records.length > 0 &&
        filteredRecords.length === 0 && (
          <div className="rounded-xl border border-gray-200 bg-white p-8 text-center shadow-sm">

            <Search
              size={20}
              className="mx-auto text-gray-400"
            />

            <p className="mt-2 text-sm font-medium text-[#172033]">
              No records found
            </p>

            <p className="mt-1 text-xs text-gray-500">
              Try another search or filter.
            </p>

          </div>
        )}

      {/* =================================================
          DESKTOP TABLE
      ================================================= */}

      {!loading &&
        filteredRecords.length > 0 && (
          <div className="hidden overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm lg:block">

            <div className="overflow-x-auto">

              <table className="w-full min-w-[1000px] text-left">

                <thead className="border-b border-gray-200 bg-gray-50/80">

                  <tr>

                    <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wide text-gray-500">
                      What
                    </th>

                    <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wide text-gray-500">
                      Department
                    </th>

                    <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wide text-gray-500">
                      Deleted By
                    </th>

                    <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wide text-gray-500">
                      Role
                    </th>

                    <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wide text-gray-500">
                      Deleted At
                    </th>

                    <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wide text-gray-500">
                      Stage
                    </th>

                    <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wide text-gray-500">
                      Remaining
                    </th>

                    <th className="px-4 py-3 text-right text-[10px] font-bold uppercase tracking-wide text-gray-500">
                      Actions
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {filteredRecords.map(
                    (record) => {
                      const days =
                        getDaysRemaining(
                          record
                        );

                      const busy =
                        actionLoading ===
                        record._id;

                      return (
                        <tr
                          key={record._id}
                          className="border-b border-gray-100 last:border-0 hover:bg-gray-50/60"
                        >

                          <td className="px-4 py-3">

                            <div className="font-semibold text-sm text-[#172033]">
                              {record.recordName}
                            </div>

                            <div className="mt-0.5 text-[10px] text-gray-400">
                              {getRecordTypeLabel(
                                record.recordType
                              )}
                            </div>

                          </td>

                          <td className="px-4 py-3 text-xs text-gray-600">
                            {record.department ||
                              "—"}
                          </td>

                          <td className="px-4 py-3 text-xs text-gray-600">
                            {record.deletedByName ||
                              "—"}
                          </td>

                          <td className="px-4 py-3">

                            <span className="rounded-full bg-[#18352A]/5 px-2.5 py-1 text-[10px] font-semibold text-[#18352A]">
                              {record.deletedByRole ||
                                "—"}
                            </span>

                          </td>

                          <td className="px-4 py-3 text-xs text-gray-500">
                            {new Date(
                              record.deletedAt
                            ).toLocaleString()}
                          </td>

                          {/* STAGE */}

                          <td className="px-4 py-3">

                            <span className="rounded-full bg-[#18352A]/5 px-2.5 py-1 text-[10px] font-semibold text-[#18352A]">
                              {getStageLabel(
                                record
                              )}
                            </span>

                          </td>

                          {/* REMAINING */}

                          <td className="px-4 py-3">

                            <span
                              className={`inline-flex rounded-full border px-2.5 py-1 text-[10px] font-semibold ${getDaysClass(
                                days
                              )}`}
                            >
                              {days} days
                            </span>

                          </td>

                          <td className="px-4 py-3">

                            <div className="flex justify-end gap-1.5">

                              <button
                                type="button"
                                disabled={busy}
                                onClick={() =>
                                  openConfirmation(
                                    record,
                                    "restore"
                                  )
                                }
                                className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-[#18352A] px-2.5 text-[10px] font-semibold text-white transition hover:bg-[#10291F] disabled:cursor-not-allowed disabled:opacity-50"
                              >
                                <RotateCcw
                                  size={12}
                                />

                                Restore
                              </button>

                              <button
                                type="button"
                                disabled={busy}
                                onClick={() =>
                                  openConfirmation(
                                    record,
                                    "permanent_delete"
                                  )
                                }
                                className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-red-100 px-2.5 text-[10px] font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                              >
                                <Trash2
                                  size={12}
                                />

                                Delete
                              </button>

                            </div>

                          </td>

                        </tr>
                      );
                    }
                  )}

                </tbody>

              </table>

            </div>

          </div>
        )}

      {/* =================================================
          MOBILE CARDS
      ================================================= */}

      {!loading &&
        filteredRecords.length > 0 && (
          <div className="space-y-2.5 lg:hidden">

            {filteredRecords.map(
              (record) => {
                const days =
                  getDaysRemaining(
                    record
                  );

                const busy =
                  actionLoading ===
                  record._id;

                return (
                  <div
                    key={record._id}
                    className="rounded-xl border border-gray-200 bg-white p-3 shadow-sm"
                  >

                    {/* TOP */}

                    <div className="flex items-start justify-between gap-3">

                      <div className="min-w-0">

                        <div className="flex items-center gap-2">

                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#18352A]/5 text-[#18352A]">
                            <Archive
                              size={14}
                            />
                          </div>

                          <div className="min-w-0">

                            <h3 className="truncate text-sm font-bold text-[#172033]">
                              {record.recordName}
                            </h3>

                            <p className="text-[10px] text-gray-400">
                              {getRecordTypeLabel(
                                record.recordType
                              )}
                            </p>

                          </div>

                        </div>

                      </div>

                      <span
                        className={`shrink-0 rounded-full border px-2 py-1 text-[9px] font-bold ${getDaysClass(
                          days
                        )}`}
                      >
                        {days}d left
                      </span>

                    </div>

                    {/* DETAILS */}

                    <div className="mt-3 grid grid-cols-2 gap-2 border-t border-gray-100 pt-3">

                      <div>
                        <p className="text-[9px] font-semibold uppercase tracking-wide text-gray-400">
                          Department
                        </p>

                        <p className="mt-0.5 truncate text-[11px] font-medium text-gray-700">
                          {record.department ||
                            "—"}
                        </p>
                      </div>

                      <div>
                        <p className="text-[9px] font-semibold uppercase tracking-wide text-gray-400">
                          Deleted By
                        </p>

                        <p className="mt-0.5 truncate text-[11px] font-medium text-gray-700">
                          {record.deletedByName ||
                            "—"}
                        </p>
                      </div>

                      <div>
                        <p className="text-[9px] font-semibold uppercase tracking-wide text-gray-400">
                          Role
                        </p>

                        <p className="mt-0.5 truncate text-[11px] font-medium text-[#18352A]">
                          {record.deletedByRole ||
                            "—"}
                        </p>
                      </div>

                      <div>
                        <p className="text-[9px] font-semibold uppercase tracking-wide text-gray-400">
                          Stage
                        </p>

                        <p className="mt-0.5 truncate text-[11px] font-medium text-[#18352A]">
                          {getStageLabel(
                            record
                          )}
                        </p>
                      </div>

                      <div>
                        <p className="text-[9px] font-semibold uppercase tracking-wide text-gray-400">
                          Deleted
                        </p>

                        <p className="mt-0.5 truncate text-[11px] font-medium text-gray-700">
                          {new Date(
                            record.deletedAt
                          ).toLocaleDateString()}
                        </p>
                      </div>

                    </div>

                    {/* ACTIONS */}

                    <div className="mt-3 flex gap-2">

                      <button
                        type="button"
                        disabled={busy}
                        onClick={() =>
                          openConfirmation(
                            record,
                            "restore"
                          )
                        }
                        className="flex h-9 flex-1 items-center justify-center gap-1.5 rounded-lg bg-[#18352A] text-[10px] font-semibold text-white transition hover:bg-[#10291F] disabled:opacity-50"
                      >
                        <RotateCcw
                          size={13}
                        />

                        Restore
                      </button>

                      <button
                        type="button"
                        disabled={busy}
                        onClick={() =>
                          openConfirmation(
                            record,
                            "permanent_delete"
                          )
                        }
                        className="flex h-9 flex-1 items-center justify-center gap-1.5 rounded-lg border border-red-100 text-[10px] font-semibold text-red-600 transition hover:bg-red-50 disabled:opacity-50"
                      >
                        <Trash2
                          size={13}
                        />

                        Permanent Delete
                      </button>

                    </div>

                  </div>
                );
              }
            )}

          </div>
        )}

      {/* =================================================
          CONFIRMATION MODAL
      ================================================= */}

      {confirmRecord && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm">

          <div className="w-full max-w-sm rounded-2xl border border-white/20 bg-white p-5 shadow-2xl">

            <div className="flex items-start gap-3">

              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                  confirmAction ===
                  "permanent_delete"
                    ? "bg-red-50 text-red-600"
                    : "bg-[#18352A]/10 text-[#18352A]"
                }`}
              >
                {confirmAction ===
                "permanent_delete" ? (
                  <Trash2 size={18} />
                ) : (
                  <RotateCcw size={18} />
                )}
              </div>

              <div className="min-w-0 flex-1">

                <h2 className="text-sm font-bold text-[#172033]">
                  {confirmAction ===
                  "permanent_delete"
                    ? "Permanent Delete?"
                    : "Restore Record?"}
                </h2>

                <p className="mt-1 text-xs leading-5 text-gray-500">
                  {confirmAction ===
                  "permanent_delete"
                    ? `“${confirmRecord.recordName}” will be permanently removed from the Recovery Bin. This cannot be undone.`
                    : `Restore request for “${confirmRecord.recordName}” will be sent.`}
                </p>

              </div>

              <button
                type="button"
                onClick={
                  closeConfirmation
                }
                disabled={
                  !!actionLoading
                }
                className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50"
              >
                <X size={16} />
              </button>

            </div>

            <div className="mt-5 flex gap-2">

              <button
                type="button"
                onClick={
                  closeConfirmation
                }
                disabled={
                  !!actionLoading
                }
                className="h-9 flex-1 rounded-lg border border-gray-200 text-xs font-semibold text-gray-600 transition hover:bg-gray-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={
                  handleConfirmedAction
                }
                disabled={
                  !!actionLoading
                }
                className={`h-9 flex-1 rounded-lg text-xs font-semibold text-white transition disabled:opacity-50 ${
                  confirmAction ===
                  "permanent_delete"
                    ? "bg-red-600 hover:bg-red-700"
                    : "bg-[#18352A] hover:bg-[#10291F]"
                }`}
              >
                {actionLoading ? (
                  <span className="inline-flex items-center gap-2">
                    <RefreshCw
                      size={13}
                      className="animate-spin"
                    />
                    Processing...
                  </span>
                ) : confirmAction ===
                  "permanent_delete" ? (
                  "Delete Permanently"
                ) : (
                  "Restore"
                )}
              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}