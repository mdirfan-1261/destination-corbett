"use client";

import { useEffect, useState } from "react";
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  Power,
  X,
  RefreshCw,
  Users,
  Building2,
  CalendarDays,
} from "lucide-react";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:5000";

const emptyForm = {
  groupId: "",
  name: "",
  description: "",
  status: "active",
};

export default function GroupsPage() {
  const [groups, setGroups] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [showModal, setShowModal] = useState(false);
  const [editingGroup, setEditingGroup] = useState(null);

  const [formData, setFormData] = useState(emptyForm);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // --------------------------------------------------
  // DATE FORMAT
  // --------------------------------------------------

  const formatDate = (date) => {
    if (!date) return "—";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "—";
    }

    return parsedDate.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // --------------------------------------------------
  // GET GROUPS
  // --------------------------------------------------

  const fetchGroups = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("adminToken");

      if (!token) {
        throw new Error(
          "Authentication required. Please login again."
        );
      }

      const response = await fetch(
        `${API_URL}/api/admin/groups`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          cache: "no-store",
        }
      );

      let data;

      try {
        data = await response.json();
      } catch {
        throw new Error(
          "Invalid response received from server."
        );
      }

      if (!response.ok) {
        throw new Error(
          data?.message || "Failed to fetch groups."
        );
      }

      if (!data?.success) {
        throw new Error(
          data?.message || "Failed to fetch groups."
        );
      }

      setGroups(
        Array.isArray(data.groups)
          ? data.groups
          : []
      );
    } catch (err) {
      console.error("Fetch groups error:", err);

      setGroups([]);

      setError(
        err.message || "Failed to fetch groups."
      );
    } finally {
      setLoading(false);
    }
  };

  // --------------------------------------------------
  // INITIAL LOAD
  // --------------------------------------------------

  useEffect(() => {
    fetchGroups();
  }, []);

  // --------------------------------------------------
  // FORM HANDLING
  // --------------------------------------------------

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const openCreateModal = () => {
    setEditingGroup(null);

    setFormData({
      ...emptyForm,
    });

    setError("");
    setSuccess("");

    setShowModal(true);
  };

  const openEditModal = (group) => {
    setEditingGroup(group);

    setFormData({
      groupId: group.groupId || "",
      name: group.name || "",
      description: group.description || "",
      status: group.status || "active",
    });

    setError("");
    setSuccess("");

    setShowModal(true);
  };

  const closeModal = () => {
    if (saving) return;

    setShowModal(false);
    setEditingGroup(null);

    setFormData({
      ...emptyForm,
    });
  };

  // --------------------------------------------------
  // CREATE / UPDATE GROUP
  // --------------------------------------------------

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.groupId.trim()) {
      setError("Group ID is required.");
      return;
    }

    if (!formData.name.trim()) {
      setError("Group name is required.");
      return;
    }

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const token = localStorage.getItem("adminToken");

      if (!token) {
        throw new Error(
          "Authentication required. Please login again."
        );
      }

      const isEditing = Boolean(editingGroup);

      const url = isEditing
        ? `${API_URL}/api/admin/groups/${editingGroup.id}`
        : `${API_URL}/api/admin/groups`;

      const method = isEditing ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          groupId: formData.groupId
            .trim()
            .toLowerCase(),

          name: formData.name.trim(),

          description:
            formData.description.trim(),

          status: formData.status,
        }),
      });

      let data;

      try {
        data = await response.json();
      } catch {
        throw new Error(
          "Invalid response received from server."
        );
      }

      if (!response.ok) {
        throw new Error(
          data?.message ||
            `Failed to ${
              isEditing ? "update" : "create"
            } group.`
        );
      }

      if (!data?.success) {
        throw new Error(
          data?.message ||
            `Failed to ${
              isEditing ? "update" : "create"
            } group.`
        );
      }

      setSuccess(
        isEditing
          ? "Group updated successfully."
          : "Group created successfully."
      );

      closeModal();

      await fetchGroups();
    } catch (err) {
      console.error("Save group error:", err);

      setError(
        err.message || "Failed to save group."
      );
    } finally {
      setSaving(false);
    }
  };

  // --------------------------------------------------
  // TOGGLE STATUS
  // --------------------------------------------------

  const toggleStatus = async (group) => {
    try {
      setError("");
      setSuccess("");

      const token =
        localStorage.getItem("adminToken");

      if (!token) {
        throw new Error(
          "Authentication required. Please login again."
        );
      }

      const nextStatus =
        group.status === "active"
          ? "inactive"
          : "active";

      const response = await fetch(
        `${API_URL}/api/admin/groups/${group.id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            groupId: group.groupId,
            name: group.name,
            description:
              group.description || "",
            status: nextStatus,
          }),
        }
      );

      let data;

      try {
        data = await response.json();
      } catch {
        throw new Error(
          "Invalid response received from server."
        );
      }

      if (!response.ok) {
        throw new Error(
          data?.message ||
            "Failed to update group status."
        );
      }

      if (!data?.success) {
        throw new Error(
          data?.message ||
            "Failed to update group status."
        );
      }

      await fetchGroups();

      setSuccess(
        `Group ${
          nextStatus === "active"
            ? "activated"
            : "deactivated"
        } successfully.`
      );
    } catch (err) {
      console.error(
        "Toggle group status error:",
        err
      );

      setError(
        err.message ||
          "Failed to update group status."
      );
    }
  };

  // --------------------------------------------------
  // DELETE GROUP
  // --------------------------------------------------

  const handleDelete = async (group) => {
    const confirmed = window.confirm(
      `Delete "${group.name}"? This action cannot be undone.`
    );

    if (!confirmed) return;

    try {
      setDeletingId(group.id);

      setError("");
      setSuccess("");

      const token =
        localStorage.getItem("adminToken");

      if (!token) {
        throw new Error(
          "Authentication required. Please login again."
        );
      }

      const response = await fetch(
        `${API_URL}/api/admin/groups/${group.id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      let data;

      try {
        data = await response.json();
      } catch {
        throw new Error(
          "Invalid response received from server."
        );
      }

      if (!response.ok) {
        throw new Error(
          data?.message ||
            "Failed to delete group."
        );
      }

      if (!data?.success) {
        throw new Error(
          data?.message ||
            "Failed to delete group."
        );
      }

      await fetchGroups();

      setSuccess(
        "Group deleted successfully."
      );
    } catch (err) {
      console.error(
        "Delete group error:",
        err
      );

      setError(
        err.message ||
          "Failed to delete group."
      );
    } finally {
      setDeletingId(null);
    }
  };

  // --------------------------------------------------
  // FILTER
  // --------------------------------------------------

  const filteredGroups = groups.filter(
    (group) => {
      const searchValue =
        search.trim().toLowerCase();

      const matchesSearch =
        !searchValue ||
        group.name
          ?.toLowerCase()
          .includes(searchValue) ||
        group.groupId
          ?.toLowerCase()
          .includes(searchValue) ||
        group.description
          ?.toLowerCase()
          .includes(searchValue);

      const matchesStatus =
        statusFilter === "all" ||
        group.status === statusFilter;

      return (
        matchesSearch && matchesStatus
      );
    }
  );

  const activeCount = groups.filter(
    (group) =>
      group.status === "active"
  ).length;

  const inactiveCount = groups.filter(
    (group) =>
      group.status === "inactive"
  ).length;

  return (
    <div className="min-h-screen bg-[#F7F5F0] px-[6px] py-3 sm:px-3 sm:py-4 md:px-4 lg:px-6 lg:py-5">
      <div className="mx-auto w-full max-w-7xl">

        {/* HEADER */}

        <div className="mb-4 sm:mb-5 lg:mb-5">
          <div className="flex flex-col gap-3 sm:gap-4 lg:flex-row lg:items-end lg:justify-between">

            <div className="min-w-0">

              <div className="mb-1 flex items-center gap-1.5 text-[10px] sm:text-[11px] text-[#64748B]">
                <Building2
                  size={13}
                  className="shrink-0"
                />

                <span>
                  Administration
                </span>

                <span>/</span>

                <span>
                  Groups
                </span>
              </div>

              <h1 className="text-lg sm:text-xl lg:text-2xl font-bold tracking-tight text-[#172033]">
                Groups & Departments
              </h1>

              <p className="mt-0.5 text-[10px] sm:text-xs lg:text-sm text-[#64748B]">
                Manage organizational groups and departments.
              </p>

            </div>

            <button
              type="button"
              onClick={openCreateModal}
              className="inline-flex w-full sm:w-auto items-center justify-center gap-1.5 rounded-lg bg-[#C87532] px-3.5 sm:px-4 py-2 sm:py-2.5 text-[11px] sm:text-xs lg:text-sm font-semibold text-white shadow-sm transition hover:bg-[#B96928] active:bg-[#A85F24]"
            >
              <Plus
                size={15}
              />

              Create Group
            </button>

          </div>
        </div>

        {/* ALERTS */}

        {error && (
          <div className="mb-3 flex items-start justify-between gap-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-[11px] sm:text-xs text-red-700">

            <span className="min-w-0 break-words">
              {error}
            </span>

            <button
              type="button"
              onClick={() =>
                setError("")
              }
              className="shrink-0 rounded-md p-0.5 hover:bg-red-100"
            >
              <X size={14} />
            </button>

          </div>
        )}

        {success && (
          <div className="mb-3 flex items-start justify-between gap-3 rounded-lg border border-green-200 bg-green-50 px-3 py-2.5 text-[11px] sm:text-xs text-green-700">

            <span className="min-w-0 break-words">
              {success}
            </span>

            <button
              type="button"
              onClick={() =>
                setSuccess("")
              }
              className="shrink-0 rounded-md p-0.5 hover:bg-green-100"
            >
              <X size={14} />
            </button>

          </div>
        )}

        {/* STATS */}

        <div className="mb-3 sm:mb-4 grid grid-cols-3 gap-1.5 sm:gap-2.5">

          {/* TOTAL */}

          <div className="rounded-lg border border-[#E2E8F0] bg-white px-2.5 py-2.5 sm:px-3.5 sm:py-3.5 shadow-sm">

            <div className="flex items-center justify-between gap-1.5">

              <div className="min-w-0">

                <p className="truncate text-[8px] sm:text-[10px] lg:text-xs text-[#64748B]">
                  Total Groups
                </p>

                <p className="mt-0.5 text-base sm:text-lg lg:text-xl font-bold text-[#172033]">
                  {groups.length}
                </p>

              </div>

              <div className="hidden sm:flex shrink-0 rounded-lg bg-[#F7F5F0] p-2 text-[#C87532]">
                <Building2 size={17} />
              </div>

            </div>

          </div>

          {/* ACTIVE */}

          <div className="rounded-lg border border-[#E2E8F0] bg-white px-2.5 py-2.5 sm:px-3.5 sm:py-3.5 shadow-sm">

            <div className="flex items-center justify-between gap-1.5">

              <div className="min-w-0">

                <p className="truncate text-[8px] sm:text-[10px] lg:text-xs text-[#64748B]">
                  Active
                </p>

                <p className="mt-0.5 text-base sm:text-lg lg:text-xl font-bold text-[#18352A]">
                  {activeCount}
                </p>

              </div>

              <div className="hidden sm:flex shrink-0 rounded-lg bg-green-50 p-2 text-green-600">
                <Users size={17} />
              </div>

            </div>

          </div>

          {/* INACTIVE */}

          <div className="rounded-lg border border-[#E2E8F0] bg-white px-2.5 py-2.5 sm:px-3.5 sm:py-3.5 shadow-sm">

            <div className="flex items-center justify-between gap-1.5">

              <div className="min-w-0">

                <p className="truncate text-[8px] sm:text-[10px] lg:text-xs text-[#64748B]">
                  Inactive
                </p>

                <p className="mt-0.5 text-base sm:text-lg lg:text-xl font-bold text-[#172033]">
                  {inactiveCount}
                </p>

              </div>

              <div className="hidden sm:flex shrink-0 rounded-lg bg-gray-100 p-2 text-gray-600">
                <Power size={17} />
              </div>

            </div>

          </div>

        </div>

        {/* FILTER BAR */}

        <div className="mb-3 sm:mb-4 rounded-lg border border-[#E2E8F0] bg-white p-2 sm:p-3 shadow-sm">

          <div className="flex flex-col gap-2 sm:flex-row">

            <div className="relative min-w-0 flex-1">

              <Search
                size={15}
                className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#94A3B8]"
              />

              <input
                type="text"
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                placeholder="Search groups..."
                className="h-9 sm:h-10 w-full rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] pl-8 pr-3 text-[11px] sm:text-xs lg:text-sm text-[#172033] outline-none transition focus:border-[#C87532] focus:ring-2 focus:ring-[#C87532]/10"
              />

            </div>

            <div className="grid grid-cols-2 gap-2 sm:flex sm:gap-2">

              <select
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(
                    e.target.value
                  )
                }
                className="h-9 sm:h-10 min-w-0 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] px-2.5 sm:px-3 text-[11px] sm:text-xs lg:text-sm text-[#172033] outline-none focus:border-[#C87532]"
              >
                <option value="all">
                  All Status
                </option>

                <option value="active">
                  Active
                </option>

                <option value="inactive">
                  Inactive
                </option>
              </select>

              <button
                type="button"
                onClick={fetchGroups}
                disabled={loading}
                className="inline-flex h-9 sm:h-10 items-center justify-center gap-1.5 rounded-lg border border-[#E2E8F0] bg-white px-3 text-[11px] sm:text-xs lg:text-sm font-medium text-[#172033] transition hover:bg-[#F8FAFC] disabled:cursor-not-allowed disabled:opacity-50"
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

          </div>
        </div>

        {/* GROUP LIST */}

        <div className="overflow-hidden rounded-lg border border-[#E2E8F0] bg-white shadow-sm">

          {loading ? (
            <div className="flex min-h-[220px] items-center justify-center">

              <div className="flex items-center gap-2 text-xs text-[#64748B]">

                <RefreshCw
                  size={16}
                  className="animate-spin"
                />

                Loading groups...

              </div>

            </div>
          ) : filteredGroups.length === 0 ? (

            <div className="flex min-h-[240px] flex-col items-center justify-center px-5 text-center">

              <div className="mb-3 rounded-xl bg-[#F7F5F0] p-3 text-[#C87532]">
                <Building2 size={23} />
              </div>

              <h3 className="text-sm font-semibold text-[#172033]">
                No groups found
              </h3>

              <p className="mt-1 max-w-md text-[10px] sm:text-xs text-[#64748B]">
                {search ||
                statusFilter !== "all"
                  ? "Try changing your search or status filter."
                  : "Create your first group to start managing departments."}
              </p>

              {!search &&
                statusFilter === "all" && (
                  <button
                    type="button"
                    onClick={
                      openCreateModal
                    }
                    className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-[#C87532] px-3.5 py-2 text-[11px] sm:text-xs font-semibold text-white hover:bg-[#B96928]"
                  >
                    <Plus size={14} />

                    Create Group
                  </button>
                )}

            </div>

          ) : (

            <>
              {/* DESKTOP / TABLET */}

              <div className="hidden md:block overflow-x-auto">

                <table className="w-full">

                  <thead>

                    <tr className="border-b border-[#E2E8F0] bg-[#F8FAFC] text-left">

                      <th className="px-4 lg:px-5 py-3 text-[9px] lg:text-[10px] font-semibold uppercase tracking-wide text-[#64748B]">
                        Group
                      </th>

                      <th className="px-4 lg:px-5 py-3 text-[9px] lg:text-[10px] font-semibold uppercase tracking-wide text-[#64748B]">
                        Description
                      </th>

                      <th className="px-4 lg:px-5 py-3 text-[9px] lg:text-[10px] font-semibold uppercase tracking-wide text-[#64748B]">
                        Created
                      </th>

                      <th className="px-4 lg:px-5 py-3 text-[9px] lg:text-[10px] font-semibold uppercase tracking-wide text-[#64748B]">
                        Status
                      </th>

                      <th className="px-4 lg:px-5 py-3 text-right text-[9px] lg:text-[10px] font-semibold uppercase tracking-wide text-[#64748B]">
                        Actions
                      </th>

                    </tr>

                  </thead>

                  <tbody>

                    {filteredGroups.map(
                      (group) => (
                        <tr
                          key={group.id}
                          className="border-b border-[#E2E8F0] last:border-b-0 transition hover:bg-[#FAFBFC]"
                        >

                          {/* GROUP */}

                          <td className="px-4 lg:px-5 py-3">

                            <div className="flex items-center gap-2.5">

                              <div className="flex h-8 w-8 lg:h-9 lg:w-9 shrink-0 items-center justify-center rounded-lg bg-[#F7F5F0] text-[#C87532]">
                                <Building2 size={15} />
                              </div>

                              <div className="min-w-0">

                                <p className="truncate text-[11px] lg:text-xs font-semibold text-[#172033]">
                                  {group.name}
                                </p>

                                <p className="mt-0.5 truncate text-[9px] lg:text-[10px] text-[#94A3B8]">
                                  {group.groupId ||
                                    group.id}
                                </p>

                              </div>

                            </div>

                          </td>

                          {/* DESCRIPTION */}

                          <td className="max-w-[280px] px-4 lg:px-5 py-3">

                            <p className="truncate text-[10px] lg:text-xs text-[#64748B]">
                              {group.description ||
                                "No description"}
                            </p>

                          </td>

                          {/* CREATED */}

                          <td className="px-4 lg:px-5 py-3">

                            <div className="flex items-center gap-1.5 text-[10px] lg:text-xs text-[#64748B] whitespace-nowrap">

                              <CalendarDays
                                size={13}
                                className="text-[#94A3B8]"
                              />

                              {formatDate(
                                group.createdAt
                              )}

                            </div>

                          </td>

                          {/* STATUS */}

                          <td className="px-4 lg:px-5 py-3">

                            <span
                              className={`inline-flex rounded-full px-2 py-0.5 text-[9px] lg:text-[10px] font-semibold ${
                                group.status ===
                                "active"
                                  ? "bg-green-50 text-green-700"
                                  : "bg-gray-100 text-gray-600"
                              }`}
                            >
                              {group.status ===
                              "active"
                                ? "Active"
                                : "Inactive"}
                            </span>

                          </td>

                          {/* ACTIONS */}

                          <td className="px-4 lg:px-5 py-3">

                            <div className="flex justify-end gap-1.5">

                              <button
                                type="button"
                                onClick={() =>
                                  openEditModal(
                                    group
                                  )
                                }
                                className="rounded-md border border-[#E2E8F0] p-1.5 text-[#64748B] transition hover:border-[#C87532] hover:bg-[#F7F5F0] hover:text-[#C87532]"
                                title="Edit"
                              >
                                <Pencil size={13} />
                              </button>

                              <button
                                type="button"
                                onClick={() =>
                                  toggleStatus(
                                    group
                                  )
                                }
                                className={`rounded-md border p-1.5 transition ${
                                  group.status ===
                                  "active"
                                    ? "border-amber-200 text-amber-600 hover:bg-amber-50"
                                    : "border-green-200 text-green-600 hover:bg-green-50"
                                }`}
                                title={
                                  group.status ===
                                  "active"
                                    ? "Deactivate"
                                    : "Activate"
                                }
                              >
                                <Power size={13} />
                              </button>

                              <button
                                type="button"
                                onClick={() =>
                                  handleDelete(
                                    group
                                  )
                                }
                                disabled={
                                  deletingId ===
                                  group.id
                                }
                                className="rounded-md border border-red-200 p-1.5 text-red-500 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                                title="Delete"
                              >
                                {deletingId ===
                                group.id ? (
                                  <RefreshCw
                                    size={13}
                                    className="animate-spin"
                                  />
                                ) : (
                                  <Trash2 size={13} />
                                )}
                              </button>

                            </div>

                          </td>

                        </tr>
                      )
                    )}

                  </tbody>

                </table>

              </div>

              {/* MOBILE */}

              <div className="md:hidden divide-y divide-[#E2E8F0]">

                {filteredGroups.map(
                  (group) => (
                    <div
                      key={group.id}
                      className="p-2"
                    >

                      <div className="rounded-lg border border-[#E2E8F0] bg-white p-2.5">

                        {/* TOP */}

                        <div className="flex items-start justify-between gap-2">

                          <div className="flex min-w-0 items-center gap-2">

                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#F7F5F0] text-[#C87532]">
                              <Building2 size={15} />
                            </div>

                            <div className="min-w-0">

                              <p className="truncate text-xs font-semibold text-[#172033]">
                                {group.name}
                              </p>

                              <p className="mt-0.5 truncate text-[9px] text-[#94A3B8]">
                                {group.groupId ||
                                  group.id}
                              </p>

                            </div>

                          </div>

                          <span
                            className={`shrink-0 rounded-full px-2 py-0.5 text-[8px] font-semibold ${
                              group.status ===
                              "active"
                                ? "bg-green-50 text-green-700"
                                : "bg-gray-100 text-gray-600"
                            }`}
                          >
                            {group.status ===
                            "active"
                              ? "Active"
                              : "Inactive"}
                          </span>

                        </div>

                        {/* INFO */}

                        <div className="mt-2 grid grid-cols-2 gap-1.5">

                          <div className="rounded-md bg-[#F8FAFC] px-2 py-1.5">

                            <p className="text-[8px] text-[#94A3B8]">
                              Description
                            </p>

                            <p className="mt-0.5 truncate text-[9px] text-[#64748B]">
                              {group.description ||
                                "No description"}
                            </p>

                          </div>

                          <div className="rounded-md bg-[#F8FAFC] px-2 py-1.5">

                            <p className="text-[8px] text-[#94A3B8]">
                              Created
                            </p>

                            <div className="mt-0.5 flex items-center gap-1 text-[9px] text-[#64748B]">

                              <CalendarDays
                                size={10}
                                className="shrink-0"
                              />

                              {formatDate(
                                group.createdAt
                              )}

                            </div>

                          </div>

                        </div>

                        {/* ACTIONS */}

                        <div className="mt-2 flex items-center gap-1.5">

                          <button
                            type="button"
                            onClick={() =>
                              openEditModal(
                                group
                              )
                            }
                            className="flex h-7 flex-1 items-center justify-center gap-1 rounded-md border border-[#E2E8F0] text-[9px] font-medium text-[#64748B] transition hover:border-[#C87532] hover:bg-[#F7F5F0] hover:text-[#C87532]"
                          >
                            <Pencil size={11} />

                            Edit
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              toggleStatus(
                                group
                              )
                            }
                            className={`flex h-7 flex-1 items-center justify-center gap-1 rounded-md border text-[9px] font-medium transition ${
                              group.status ===
                              "active"
                                ? "border-amber-200 text-amber-600 hover:bg-amber-50"
                                : "border-green-200 text-green-600 hover:bg-green-50"
                            }`}
                          >
                            <Power size={11} />

                            {group.status ===
                            "active"
                              ? "Deactivate"
                              : "Activate"}
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              handleDelete(
                                group
                              )
                            }
                            disabled={
                              deletingId ===
                              group.id
                            }
                            className="flex h-7 w-8 shrink-0 items-center justify-center rounded-md border border-red-200 text-red-500 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                            title="Delete"
                          >
                            {deletingId ===
                            group.id ? (
                              <RefreshCw
                                size={11}
                                className="animate-spin"
                              />
                            ) : (
                              <Trash2 size={11} />
                            )}
                          </button>

                        </div>

                      </div>

                    </div>
                  )
                )}

              </div>
            </>
          )}

        </div>

      </div>

      {/* CREATE / EDIT MODAL */}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-0 backdrop-blur-sm sm:items-center sm:p-4">

          <div className="w-full overflow-hidden rounded-t-2xl bg-white shadow-2xl sm:max-w-md sm:rounded-2xl">

            {/* MODAL HEADER */}

            <div className="flex items-center justify-between gap-3 border-b border-[#E2E8F0] px-4 py-3.5 sm:px-5 sm:py-4">

              <div className="min-w-0">

                <h2 className="text-sm sm:text-base font-semibold text-[#172033]">
                  {editingGroup
                    ? "Edit Group"
                    : "Create Group"}
                </h2>

                <p className="mt-0.5 text-[9px] sm:text-[11px] text-[#64748B]">
                  {editingGroup
                    ? "Update group information."
                    : "Add a new organizational group."}
                </p>

              </div>

              <button
                type="button"
                onClick={closeModal}
                disabled={saving}
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-[#64748B] hover:bg-[#F8FAFC]"
              >
                <X size={15} />
              </button>

            </div>

            {/* FORM */}

            <form
              onSubmit={handleSubmit}
              className="max-h-[calc(94vh-65px)] overflow-y-auto space-y-3.5 p-4 sm:p-5"
            >

              {/* GROUP ID */}

              <div>

                <label className="mb-1.5 block text-[10px] sm:text-xs font-medium text-[#172033]">
                  Group ID
                </label>

                <input
                  type="text"
                  name="groupId"
                  value={formData.groupId}
                  onChange={handleChange}
                  placeholder="e.g. safari"
                  required
                  disabled={
                    Boolean(editingGroup)
                  }
                  className="h-9 sm:h-10 w-full rounded-lg border border-[#E2E8F0] bg-white px-3 text-[11px] sm:text-xs text-[#172033] outline-none focus:border-[#C87532] focus:ring-2 focus:ring-[#C87532]/10 disabled:bg-[#F8FAFC] disabled:text-[#94A3B8]"
                />

                <p className="mt-1 text-[8px] sm:text-[10px] text-[#94A3B8]">
                  Use a unique ID like safari,
                  stay or events.
                </p>

              </div>

              {/* GROUP NAME */}

              <div>

                <label className="mb-1.5 block text-[10px] sm:text-xs font-medium text-[#172033]">
                  Group Name
                </label>

                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter group name"
                  required
                  className="h-9 sm:h-10 w-full rounded-lg border border-[#E2E8F0] bg-white px-3 text-[11px] sm:text-xs text-[#172033] outline-none focus:border-[#C87532] focus:ring-2 focus:ring-[#C87532]/10"
                />

              </div>

              {/* DESCRIPTION */}

              <div>

                <label className="mb-1.5 block text-[10px] sm:text-xs font-medium text-[#172033]">
                  Description
                </label>

                <textarea
                  name="description"
                  value={
                    formData.description
                  }
                  onChange={handleChange}
                  placeholder="Enter group description"
                  rows={3}
                  className="w-full resize-none rounded-lg border border-[#E2E8F0] bg-white px-3 py-2.5 text-[11px] sm:text-xs text-[#172033] outline-none focus:border-[#C87532] focus:ring-2 focus:ring-[#C87532]/10"
                />

              </div>

              {/* STATUS */}

              <div>

                <label className="mb-1.5 block text-[10px] sm:text-xs font-medium text-[#172033]">
                  Status
                </label>

                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="h-9 sm:h-10 w-full rounded-lg border border-[#E2E8F0] bg-white px-3 text-[11px] sm:text-xs text-[#172033] outline-none focus:border-[#C87532]"
                >
                  <option value="active">
                    Active
                  </option>

                  <option value="inactive">
                    Inactive
                  </option>
                </select>

              </div>

              {/* ERROR */}

              {error && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-[10px] sm:text-xs text-red-700">
                  {error}
                </div>
              )}

              {/* FOOTER */}

              <div className="flex flex-col-reverse gap-2 border-t border-[#E2E8F0] pt-3.5 sm:flex-row sm:justify-end">

                <button
                  type="button"
                  onClick={closeModal}
                  disabled={saving}
                  className="h-9 sm:h-10 rounded-lg border border-[#E2E8F0] px-4 text-[11px] sm:text-xs font-medium text-[#172033] hover:bg-[#F8FAFC] disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={
                    saving ||
                    !formData.groupId.trim() ||
                    !formData.name.trim()
                  }
                  className="inline-flex h-9 sm:h-10 items-center justify-center gap-1.5 rounded-lg bg-[#C87532] px-4 text-[11px] sm:text-xs font-semibold text-white hover:bg-[#B96928] active:bg-[#A85F24] disabled:cursor-not-allowed disabled:opacity-50"
                >

                  {saving && (
                    <RefreshCw
                      size={13}
                      className="animate-spin"
                    />
                  )}

                  {saving
                    ? "Saving..."
                    : editingGroup
                    ? "Update Group"
                    : "Create Group"}

                </button>

              </div>

            </form>

          </div>

        </div>
      )}
    </div>
  );
}