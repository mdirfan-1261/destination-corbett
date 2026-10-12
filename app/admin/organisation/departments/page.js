
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Building2,
  Users,
  CheckCircle2,
  XCircle,
  Plus,
  Search,
  RefreshCw,
  Pencil,
  X,
  Trash2,
  ShieldCheck,
  SearchX,
  AlertCircle,
  LoaderCircle,
  RotateCcw,
} from "lucide-react";

const API_URL = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
).replace(/\/$/, "");

const INITIAL_FORM = {
  groupId: "",
  name: "",
  description: "",
  status: "active",
};

const STATUS_TABS = [
  { value: "all", label: "All" },
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
];

const toSlug = (value = "") =>
  value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

const formatNumber = (value) =>
  Number(value || 0).toLocaleString("en-IN");

export default function DepartmentsPage() {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(INITIAL_FORM);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const getToken = useCallback(() => {
    if (typeof window === "undefined") return "";

    return (
      localStorage.getItem("adminToken") ||
      localStorage.getItem("token") ||
      ""
    );
  }, []);

  const apiRequest = useCallback(
    async (path, options = {}) => {
      const token = getToken();

      if (!token) {
        throw new Error("Session expired. Please log in again.");
      }

      const response = await fetch(`${API_URL}${path}`, {
        ...options,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          ...options.headers,
        },
      });

      const result = await response.json().catch(() => ({}));

      if (!response.ok || result.success === false) {
        throw new Error(
          result.message || `Request failed (${response.status}).`
        );
      }

      return result;
    },
    [getToken]
  );

  const loadDepartments = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const result = await apiRequest("/api/organisation/departments");

      if (!Array.isArray(result.data)) {
        throw new Error("Department data could not be loaded.");
      }

      setDepartments(result.data);
    } catch (err) {
      setError(err.message || "Unable to load departments.");
    } finally {
      setLoading(false);
    }
  }, [apiRequest]);

  useEffect(() => {
    loadDepartments();
  }, [loadDepartments]);

  useEffect(() => {
    if (!success) return;

    const timer = setTimeout(() => setSuccess(""), 3500);
    return () => clearTimeout(timer);
  }, [success]);

  const dialogOpen = modalOpen || Boolean(deleteTarget);

  useEffect(() => {
    if (!dialogOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event) => {
      if (event.key !== "Escape" || saving || deleting) return;

      setModalOpen(false);
      setDeleteTarget(null);
      setEditingId(null);
      setForm(INITIAL_FORM);
      setError("");
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [dialogOpen, saving, deleting]);

  const activeCount = departments.filter(
    (item) => item.status === "active"
  ).length;

  const inactiveCount = departments.length - activeCount;

  const totalMembers = departments.reduce(
    (total, item) => total + Number(item.totalMembers || 0),
    0
  );

  const filteredDepartments = useMemo(() => {
    const term = search.trim().toLowerCase();

    return departments.filter((item) => {
      const matchesSearch =
        !term ||
        String(item.name || "").toLowerCase().includes(term) ||
        String(item.groupId || "").toLowerCase().includes(term) ||
        String(item.description || "").toLowerCase().includes(term);

      const matchesStatus =
        statusFilter === "all" || item.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [departments, search, statusFilter]);

  const tabCounts = {
    all: departments.length,
    active: activeCount,
    inactive: inactiveCount,
  };

  const openCreateModal = () => {
    setEditingId(null);
    setForm(INITIAL_FORM);
    setError("");
    setSuccess("");
    setModalOpen(true);
  };

  const openEditModal = (department) => {
    setEditingId(department._id);
    setForm({
      groupId: department.groupId || "",
      name: department.name || "",
      description: department.description || "",
      status: department.status || "active",
    });
    setError("");
    setSuccess("");
    setModalOpen(true);
  };

  const closeModal = () => {
    if (saving) return;

    setModalOpen(false);
    setEditingId(null);
    setForm(INITIAL_FORM);
    setError("");
  };

  const handleNameChange = (value) => {
    setForm((previous) => ({
      ...previous,
      name: value,
      ...(editingId ? {} : { groupId: toSlug(value) }),
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    const name = form.name.trim();
    const groupId = toSlug(form.groupId);
    const isEditing = Boolean(editingId);

    if (!name) {
      setError("Please enter a department name.");
      return;
    }

    if (!isEditing && !groupId) {
      setError("Please enter a valid department ID.");
      return;
    }

    setSaving(true);

    try {
      const result = isEditing
        ? await apiRequest(
            `/api/organisation/departments/${editingId}`,
            {
              method: "PUT",
              body: JSON.stringify({
                name,
                description: form.description.trim(),
                status: form.status,
              }),
            }
          )
        : await apiRequest("/api/organisation/departments", {
            method: "POST",
            body: JSON.stringify({
              groupId,
              name,
              description: form.description.trim(),
            }),
          });

      setModalOpen(false);
      setEditingId(null);
      setForm(INITIAL_FORM);
      setSuccess(
        result.message ||
          (isEditing
            ? "Department updated successfully."
            : "Department created successfully.")
      );

      await loadDepartments();
    } catch (err) {
      setError(err.message || "Unable to save department.");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteDepartment = async () => {
    if (!deleteTarget || deleting) return;

    setDeleting(true);
    setError("");
    setSuccess("");

    try {
      const result = await apiRequest(
        `/api/organisation/departments/${deleteTarget._id}`,
        { method: "DELETE" }
      );

      setDeleteTarget(null);
      setSuccess(
        result.message || "Department moved to Recovery Bin successfully."
      );

      await loadDepartments();
    } catch (err) {
      setError(err.message || "Unable to delete department.");
    } finally {
      setDeleting(false);
    }
  };

  const dismissError = () => setError("");

  return (
    <div className="min-h-screen bg-[#F7F5F0] pb-6 text-[#172033]">
      {/* Compact header */}
      <header className="border-b border-[#E7E3DA] bg-white">
        <div className="mx-auto max-w-7xl px-3 py-4 sm:px-4 lg:px-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <div className="mb-1.5 flex items-center gap-1.5 text-xs text-[#777A80]">
                <Building2 size={14} className="text-[#B96928]" />
                <span>Organization</span>
                <span className="text-[#B8B5AD]">/</span>
                <span>Departments</span>
              </div>

              <h1 className="text-xl font-bold tracking-tight text-[#172033] sm:text-2xl">
                Departments
              </h1>

              <p className="mt-1 text-sm text-[#666B72]">
                Manage departments and assigned members.
              </p>
            </div>

            <div className="flex w-full gap-2 sm:w-auto">
              <button
                type="button"
                onClick={loadDepartments}
                disabled={loading}
                className="inline-flex min-h-10 flex-1 items-center justify-center gap-2 rounded-lg border border-[#DCDDD8] bg-white px-3 text-sm font-semibold text-[#343B45] transition hover:bg-[#F7F5F0] disabled:opacity-60 sm:flex-none"
              >
                <RefreshCw
                  size={15}
                  className={loading ? "animate-spin" : ""}
                />
                Refresh
              </button>

              <button
                type="button"
                onClick={openCreateModal}
                className="inline-flex min-h-10 flex-1 items-center justify-center gap-2 rounded-lg bg-[#B96928] px-3.5 text-sm font-semibold text-white transition hover:bg-[#A75B20] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B96928] focus-visible:ring-offset-2 sm:flex-none"
              >
                <Plus size={16} />
                Add department
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl space-y-3 px-3 py-4 sm:px-4 lg:px-5">
        {/* Summary cards */}
        <section
          aria-label="Department summary"
          className="grid grid-cols-2 gap-2 sm:grid-cols-4"
        >
          <Stat
            label="Total departments"
            value={departments.length}
            icon={Building2}
            loading={loading}
          />
          <Stat
            label="Active"
            value={activeCount}
            icon={CheckCircle2}
            loading={loading}
          />
          <Stat
            label="Inactive"
            value={inactiveCount}
            icon={XCircle}
            loading={loading}
          />
          <Stat
            label="Assigned members"
            value={totalMembers}
            icon={Users}
            loading={loading}
          />
        </section>

        {error && !modalOpen && !deleteTarget && (
          <AlertMessage
            type="error"
            message={error}
            onClose={dismissError}
            actionLabel="Try again"
            onAction={loadDepartments}
          />
        )}

        {success && (
          <AlertMessage
            type="success"
            message={success}
            onClose={() => setSuccess("")}
          />
        )}

        {/* Department directory */}
        <section className="overflow-hidden rounded-xl border border-[#E3E0D8] bg-white">
          <div className="border-b border-[#EAE7E0] px-3 py-3 sm:px-4">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-base font-bold text-[#172033]">
                    All departments
                  </h2>
                  <span className="rounded-md bg-[#F3F1EA] px-2 py-1 text-xs font-semibold text-[#65675F]">
                    {filteredDepartments.length} results
                  </span>
                </div>
                <p className="mt-1 text-xs text-[#777A80]">
                  Search and manage department records.
                </p>
              </div>

              <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                <div
                  role="tablist"
                  aria-label="Filter by department status"
                  className="flex w-full rounded-lg border border-[#E4E1D9] bg-[#F8F7F3] p-1 sm:w-auto"
                >
                  {STATUS_TABS.map((tab) => {
                    const selected = statusFilter === tab.value;

                    return (
                      <button
                        key={tab.value}
                        type="button"
                        role="tab"
                        aria-selected={selected}
                        onClick={() => setStatusFilter(tab.value)}
                        className={`flex min-h-8 flex-1 items-center justify-center gap-1 whitespace-nowrap rounded-md px-2 text-xs font-semibold transition sm:flex-none sm:px-3 ${
                          selected
                            ? "bg-white text-[#172033] shadow-sm ring-1 ring-[#E7E4DC]"
                            : "text-[#73767A] hover:text-[#172033]"
                        }`}
                      >
                        {tab.label}
                        <span className="text-[11px] text-[#8A8B86]">
                          {tabCounts[tab.value]}
                        </span>
                      </button>
                    );
                  })}
                </div>

                <div className="relative sm:w-56">
                  <Search
                    size={15}
                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#888B8E]"
                  />
                  <input
                    type="search"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Search departments..."
                    aria-label="Search departments"
                    className="h-10 w-full rounded-lg border border-[#DEDED8] bg-white py-2 pl-9 pr-9 text-sm text-[#172033] outline-none placeholder:text-[#999B9D] focus:border-[#B96928] focus:ring-2 focus:ring-[#B96928]/10"
                  />
                  {search && (
                    <button
                      type="button"
                      onClick={() => setSearch("")}
                      aria-label="Clear search"
                      className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1 text-[#888B8E] hover:bg-[#F1F0EB]"
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {loading ? (
            <ListSkeleton />
          ) : filteredDepartments.length === 0 ? (
            <EmptyState
              hasDepartments={departments.length > 0}
              onCreate={openCreateModal}
              onClear={() => {
                setSearch("");
                setStatusFilter("all");
              }}
            />
          ) : (
            <>
              {/* Desktop table */}
              <div className="hidden overflow-x-auto md:block">
                <table className="w-full min-w-[720px] text-left">
                  <thead>
                    <tr className="border-b border-[#EAE7E0] bg-[#FAF9F6]">
                      {[
                        "Department",
                        "Department ID",
                        "Members",
                        "Status",
                        "Actions",
                      ].map((label) => (
                        <th
                          key={label}
                          className={`px-4 py-2.5 text-[11px] font-bold uppercase tracking-wide text-[#777A80] ${
                            label === "Actions" ? "text-right" : ""
                          }`}
                        >
                          {label}
                        </th>
                      ))}
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-[#F0EEE8]">
                    {filteredDepartments.map((department) => (
                      <DepartmentRow
                        key={department._id}
                        department={department}
                        onEdit={openEditModal}
                        onDelete={(item) => {
                          setError("");
                          setDeleteTarget(item);
                        }}
                        deleting={deleting}
                      />
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile cards */}
              <ul className="grid gap-2 p-2 sm:grid-cols-2 sm:p-3 md:hidden">
                {filteredDepartments.map((department) => (
                  <DepartmentCard
                    key={department._id}
                    department={department}
                    onEdit={openEditModal}
                    onDelete={(item) => {
                      setError("");
                      setDeleteTarget(item);
                    }}
                    deleting={deleting}
                  />
                ))}
              </ul>
            </>
          )}

          <footer className="flex flex-col gap-1.5 border-t border-[#EAE7E0] bg-[#FAF9F6] px-3 py-2.5 text-xs text-[#777A80] sm:flex-row sm:items-center sm:justify-between sm:px-4">
            <span>
              Showing {filteredDepartments.length} of {departments.length}{" "}
              departments
            </span>
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck size={14} className="text-[#467653]" />
              Organization access protected
            </span>
          </footer>
        </section>
      </main>

      {/* Create / Edit modal */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-[#172033]/50 p-0 backdrop-blur-[2px] sm:items-center sm:p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeModal();
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="department-modal-title"
            className="flex max-h-[94dvh] w-full flex-col overflow-hidden rounded-t-2xl bg-white shadow-2xl sm:max-w-lg sm:rounded-xl"
          >
            <div className="flex items-start justify-between gap-3 border-b border-[#EAE7E0] px-4 py-3 sm:px-5">
              <div className="flex min-w-0 items-start gap-2.5">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#F7F0E8] text-[#B96928]">
                  {editingId ? <Pencil size={17} /> : <Building2 size={18} />}
                </div>
                <div>
                  <h2
                    id="department-modal-title"
                    className="text-base font-bold text-[#172033]"
                  >
                    {editingId ? "Edit department" : "Add department"}
                  </h2>
                  <p className="mt-0.5 text-xs text-[#73767A]">
                    {editingId
                      ? "Update department details."
                      : "Enter the new department details."}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={closeModal}
                disabled={saving}
                aria-label="Close dialog"
                className="rounded-lg p-1.5 text-[#73767A] hover:bg-[#F3F1EA] disabled:opacity-50"
              >
                <X size={17} />
              </button>
            </div>

            <form
              onSubmit={handleSubmit}
              className="flex min-h-0 flex-1 flex-col"
            >
              <div className="min-h-0 flex-1 space-y-3 overflow-y-auto px-4 py-4 sm:px-5">
                {error && (
                  <AlertMessage
                    type="error"
                    message={error}
                    onClose={dismissError}
                  />
                )}

                <FormField label="Department name" required>
                  <input
                    id="department-name"
                    value={form.name}
                    onChange={(event) => handleNameChange(event.target.value)}
                    required
                    maxLength={100}
                    placeholder="e.g. Safari Operations"
                    className={inputClass}
                  />
                </FormField>

                <FormField label="Department ID" required={!editingId}>
                  <input
                    id="department-id"
                    value={form.groupId}
                    onChange={(event) =>
                      setForm((previous) => ({
                        ...previous,
                        groupId: toSlug(event.target.value),
                      }))
                    }
                    required={!editingId}
                    disabled={Boolean(editingId)}
                    maxLength={100}
                    placeholder="e.g. safari-operations"
                    className={`${inputClass} font-mono disabled:bg-[#F5F4F0] disabled:text-[#858780]`}
                  />
                  <p className="mt-1 text-xs text-[#777A80]">
                    {editingId
                      ? "Department ID cannot be changed."
                      : "Generated from the name; editable before saving."}
                  </p>
                </FormField>

                <FormField label="Description">
                  <textarea
                    id="department-description"
                    value={form.description}
                    onChange={(event) =>
                      setForm((previous) => ({
                        ...previous,
                        description: event.target.value,
                      }))
                    }
                    rows={3}
                    maxLength={500}
                    placeholder="Brief department description..."
                    className={`${inputClass} min-h-20 resize-y py-2.5`}
                  />
                  <p className="mt-1 text-right text-xs text-[#8A8B86]">
                    {form.description.length}/500
                  </p>
                </FormField>

                {editingId && (
                  <FormField label="Department status">
                    <select
                      id="department-status"
                      value={form.status}
                      onChange={(event) =>
                        setForm((previous) => ({
                          ...previous,
                          status: event.target.value,
                        }))
                      }
                      className={inputClass}
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                    <p className="mt-1 text-xs leading-5 text-[#777A80]">
                      Status changes may be restricted while members are assigned.
                    </p>
                  </FormField>
                )}
              </div>

              <div className="flex flex-col-reverse gap-2 border-t border-[#EAE7E0] bg-[#FAF9F6] px-4 py-3 sm:flex-row sm:justify-end sm:px-5">
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={saving}
                  className="min-h-10 rounded-lg border border-[#DCDDD8] bg-white px-4 text-sm font-semibold text-[#343B45] hover:bg-[#F5F4F0] disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving || !form.name.trim()}
                  className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-[#B96928] px-4 text-sm font-semibold text-white transition hover:bg-[#A75B20] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving && <LoaderCircle size={15} className="animate-spin" />}
                  {saving
                    ? "Saving..."
                    : editingId
                      ? "Save changes"
                      : "Create department"}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}

      {/* Delete confirmation */}
      {deleteTarget && (
        <div
          className="fixed inset-0 z-[60] flex items-end justify-center bg-[#172033]/55 p-0 backdrop-blur-[2px] sm:items-center sm:p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget && !deleting) {
              setDeleteTarget(null);
              setError("");
            }
          }}
        >
          <section
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="delete-department-title"
            aria-describedby="delete-department-description"
            className="w-full rounded-t-2xl bg-white p-4 shadow-2xl sm:max-w-md sm:rounded-xl sm:p-5"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#FCEDEC] text-[#B42318]">
                <Trash2 size={19} />
              </div>
              <button
                type="button"
                disabled={deleting}
                onClick={() => {
                  setDeleteTarget(null);
                  setError("");
                }}
                aria-label="Close confirmation"
                className="rounded-lg p-1.5 text-[#73767A] hover:bg-[#F3F1EA] disabled:opacity-50"
              >
                <X size={17} />
              </button>
            </div>

            <h2
              id="delete-department-title"
              className="mt-3 text-lg font-bold text-[#172033]"
            >
              Move to Recovery Bin?
            </h2>

            <p
              id="delete-department-description"
              className="mt-2 text-sm leading-5 text-[#666B72]"
            >
              <strong className="text-[#172033]">{deleteTarget.name}</strong>{" "}
              will be removed from the department list and can be restored
              through the Recovery Bin, if the backend supports recovery.
            </p>

            <div className="mt-3 flex gap-2 rounded-lg border border-[#F0D9AC] bg-[#FFFAEF] p-3 text-xs leading-5 text-[#79551B]">
              <AlertCircle size={16} className="mt-0.5 shrink-0" />
              <p>
                Departments with assigned members cannot be deleted. Reassign
                members first.
              </p>
            </div>

            {error && (
              <div
                role="alert"
                className="mt-3 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700"
              >
                {error}
              </div>
            )}

            <div className="mt-4 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => {
                  if (deleting) return;
                  setDeleteTarget(null);
                  setError("");
                }}
                disabled={deleting}
                className="min-h-10 rounded-lg border border-[#DCDDD8] px-4 text-sm font-semibold text-[#343B45] hover:bg-[#F5F4F0] disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleDeleteDepartment}
                disabled={deleting}
                className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-[#B42318] px-4 text-sm font-semibold text-white hover:bg-[#921D15] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {deleting ? (
                  <LoaderCircle size={15} className="animate-spin" />
                ) : (
                  <Trash2 size={15} />
                )}
                {deleting ? "Moving..." : "Move to Recovery Bin"}
              </button>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}

const inputClass =
  "min-h-10 w-full rounded-lg border border-[#DCDDD8] bg-white px-3 text-sm text-[#172033] outline-none transition placeholder:text-[#999B9D] focus:border-[#B96928] focus:ring-2 focus:ring-[#B96928]/10";

function FormField({ label, required = false, children }) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-semibold text-[#303946]">
        {label}
        {required && <span className="ml-1 text-[#B96928]">*</span>}
      </label>
      {children}
    </div>
  );
}

function Stat({ label, value, icon: Icon, loading }) {
  return (
    <article className="min-w-0 rounded-lg border border-[#E3E0D8] bg-white p-3 sm:p-3.5">
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-medium leading-4 text-[#666B72] sm:text-sm">
          {label}
        </span>
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#F7F0E8] text-[#B96928]">
          <Icon size={16} />
        </span>
      </div>

      {loading ? (
        <div className="mt-2 h-7 w-14 animate-pulse rounded bg-[#F0EEE8]" />
      ) : (
        <p className="mt-2 text-xl font-bold tracking-tight text-[#172033] sm:text-2xl">
          {formatNumber(value)}
        </p>
      )}
    </article>
  );
}

function DepartmentRow({ department, onEdit, onDelete, deleting }) {
  const total = Number(department.totalMembers || 0);
  const active = Number(department.activeMembers || 0);

  return (
    <tr className="transition-colors hover:bg-[#FCFBF8]">
      <td className="px-4 py-3">
        <div className="flex min-w-0 items-center gap-2.5">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#F7F0E8] text-[#B96928]">
            <Building2 size={17} />
          </div>
          <div className="min-w-0">
            <p className="break-words text-sm font-semibold text-[#172033]">
              {department.name}
            </p>
            <p className="mt-0.5 max-w-xs truncate text-xs text-[#777A80]">
              {department.description || "No description"}
            </p>
          </div>
        </div>
      </td>

      <td className="px-4 py-3">
        <code className="inline-block max-w-40 truncate rounded-md bg-[#F5F4F0] px-2 py-1 text-xs text-[#5D625C]">
          {department.groupId || "—"}
        </code>
      </td>

      <td className="px-4 py-3">
        <p className="text-sm font-semibold text-[#172033]">
          {formatNumber(total)}
          <span className="ml-1 font-normal text-[#777A80]">members</span>
        </p>
        <p className="mt-0.5 text-xs text-[#777A80]">
          {formatNumber(active)} active
        </p>
      </td>

      <td className="px-4 py-3">
        <StatusBadge status={department.status} />
      </td>

      <td className="px-4 py-3">
        <div className="flex items-center justify-end gap-1.5">
          <button
            type="button"
            onClick={() => onEdit(department)}
            aria-label={`Edit ${department.name}`}
            className="inline-flex h-8 items-center gap-1.5 rounded-md border border-[#DCDDD8] px-2.5 text-xs font-semibold text-[#343B45] transition hover:border-[#B96928]/40 hover:bg-[#F9F3EC] hover:text-[#9C521D]"
          >
            <Pencil size={13} />
            Edit
          </button>
          <button
            type="button"
            onClick={() => onDelete(department)}
            disabled={deleting}
            aria-label={`Delete ${department.name}`}
            className="inline-flex h-8 items-center gap-1.5 rounded-md border border-[#E8D6D3] px-2.5 text-xs font-semibold text-[#B42318] transition hover:bg-[#FCEDEC] disabled:opacity-50"
          >
            <Trash2 size={13} />
            Delete
          </button>
        </div>
      </td>
    </tr>
  );
}

function DepartmentCard({ department, onEdit, onDelete, deleting }) {
  const total = Number(department.totalMembers || 0);
  const active = Number(department.activeMembers || 0);

  return (
    <li className="min-w-0 rounded-lg border border-[#E3E0D8] bg-white p-3">
      <div className="flex items-start gap-2.5">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#F7F0E8] text-[#B96928]">
          <Building2 size={17} />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="break-words text-sm font-bold leading-5 text-[#172033]">
            {department.name}
          </h3>
          <code className="mt-1 inline-block max-w-full truncate rounded bg-[#F5F4F0] px-2 py-0.5 text-xs text-[#666B72]">
            {department.groupId || "—"}
          </code>
        </div>
        <StatusBadge status={department.status} />
      </div>

      <p className="mt-2 break-words text-sm leading-5 text-[#777A80]">
        {department.description || "No description added."}
      </p>

      <div className="mt-3 flex items-center justify-between border-y border-[#F0EEE8] py-2.5 text-sm">
        <span className="inline-flex items-center gap-1.5 text-[#666B72]">
          <Users size={15} />
          {formatNumber(total)} members
        </span>
        <span className="text-xs text-[#777A80]">
          {formatNumber(active)} active
        </span>
      </div>

      <div className="mt-2.5 grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => onEdit(department)}
          className="inline-flex min-h-9 items-center justify-center gap-1.5 rounded-lg border border-[#DCDDD8] text-sm font-semibold text-[#343B45] hover:bg-[#F5F4F0]"
        >
          <Pencil size={13} />
          Edit
        </button>
        <button
          type="button"
          onClick={() => onDelete(department)}
          disabled={deleting}
          className="inline-flex min-h-9 items-center justify-center gap-1.5 rounded-lg border border-[#E8D6D3] text-sm font-semibold text-[#B42318] hover:bg-[#FCEDEC] disabled:opacity-50"
        >
          <Trash2 size={13} />
          Delete
        </button>
      </div>
    </li>
  );
}

function StatusBadge({ status }) {
  const active = status === "active";

  return (
    <span
      className={`inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-md px-2 py-1 text-xs font-semibold ${
        active
          ? "bg-[#EAF3EA] text-[#356844]"
          : "bg-[#F0F0ED] text-[#686B70]"
      }`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          active ? "bg-[#467653]" : "bg-[#92948E]"
        }`}
      />
      {active ? "Active" : "Inactive"}
    </span>
  );
}

function AlertMessage({
  type = "error",
  message,
  onClose,
  actionLabel,
  onAction,
}) {
  const isSuccess = type === "success";

  return (
    <div
      role={isSuccess ? "status" : "alert"}
      className={`flex items-start gap-2.5 rounded-lg border p-3 text-sm ${
        isSuccess
          ? "border-[#CFE3D1] bg-[#F0F7F0] text-[#285B37]"
          : "border-[#EBCBC7] bg-[#FFF4F2] text-[#9D2B20]"
      }`}
    >
      {isSuccess ? (
        <CheckCircle2 size={17} className="mt-0.5 shrink-0" />
      ) : (
        <AlertCircle size={17} className="mt-0.5 shrink-0" />
      )}

      <p className="min-w-0 flex-1 break-words leading-5">{message}</p>

      {actionLabel && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="shrink-0 rounded-md bg-white px-2 py-1.5 text-xs font-semibold text-[#9D2B20] ring-1 ring-black/5 hover:bg-[#FFF9F8]"
        >
          {actionLabel}
        </button>
      )}

      <button
        type="button"
        onClick={onClose}
        aria-label="Dismiss message"
        className="shrink-0 rounded-md p-1 hover:bg-black/5"
      >
        <X size={14} />
      </button>
    </div>
  );
}

function EmptyState({ hasDepartments, onCreate, onClear }) {
  return (
    <div className="flex min-h-52 flex-col items-center justify-center px-5 py-8 text-center">
      <div className="flex h-11 w-11 items-center justify-center rounded-lg border border-[#E3E0D8] bg-[#F8F6F0] text-[#B96928]">
        {hasDepartments ? <SearchX size={21} /> : <Building2 size={22} />}
      </div>

      <h3 className="mt-3 text-base font-bold text-[#172033]">
        {hasDepartments ? "No matching departments" : "No departments yet"}
      </h3>

      <p className="mt-1 max-w-sm text-sm leading-5 text-[#777A80]">
        {hasDepartments
          ? "Try another keyword or change the status filter."
          : "Create your first department to organize your teams."}
      </p>

      {hasDepartments ? (
        <button
          type="button"
          onClick={onClear}
          className="mt-3 inline-flex min-h-9 items-center gap-2 rounded-lg border border-[#DCDDD8] px-3 text-sm font-semibold text-[#343B45] hover:bg-[#F5F4F0]"
        >
          <RotateCcw size={14} />
          Clear filters
        </button>
      ) : (
        <button
          type="button"
          onClick={onCreate}
          className="mt-3 inline-flex min-h-9 items-center gap-2 rounded-lg bg-[#B96928] px-3.5 text-sm font-semibold text-white hover:bg-[#A75B20]"
        >
          <Plus size={15} />
          Add department
        </button>
      )}
    </div>
  );
}

function ListSkeleton() {
  return (
    <div className="divide-y divide-[#F0EEE8]" aria-busy="true">
      <p className="sr-only">Loading departments...</p>
      {[0, 1, 2, 3].map((item) => (
        <div key={item} className="flex items-center gap-3 px-4 py-3">
          <div className="h-9 w-9 shrink-0 animate-pulse rounded-lg bg-[#F0EEE8]" />
          <div className="min-w-0 flex-1 space-y-2">
            <div className="h-3.5 w-40 max-w-full animate-pulse rounded bg-[#F0EEE8]" />
            <div className="h-3 w-56 max-w-full animate-pulse rounded bg-[#F7F5F0]" />
          </div>
          <div className="hidden h-7 w-16 animate-pulse rounded-md bg-[#F0EEE8] sm:block" />
        </div>
      ))}
    </div>
  );
}
