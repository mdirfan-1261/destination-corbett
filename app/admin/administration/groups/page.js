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
} from "lucide-react";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const emptyForm = {
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
          name: formData.name.trim(),
          description: formData.description.trim(),
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

      const token = localStorage.getItem("adminToken");

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
            name: group.name,
            description: group.description || "",
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

      const token = localStorage.getItem("adminToken");

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
    <div className="min-h-screen bg-[#F7F5F0] p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">

        {/* HEADER */}
        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

          <div>
            <div className="mb-2 flex items-center gap-2 text-sm text-[#64748B]">
              <Building2 size={16} />
              <span>Administration</span>
              <span>/</span>
              <span>Groups</span>
            </div>

            <h1 className="text-2xl font-semibold text-[#172033] sm:text-3xl">
              Groups & Departments
            </h1>

            <p className="mt-1 text-sm text-[#64748B]">
              Manage organizational groups and departments.
            </p>
          </div>

          <button
            type="button"
            onClick={openCreateModal}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#C87532] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#B76527]"
          >
            <Plus size={18} />
            Create Group
          </button>
        </div>

        {/* ALERTS */}

        {error && (
          <div className="mb-5 flex items-start justify-between gap-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            <span>{error}</span>

            <button
              type="button"
              onClick={() => setError("")}
              className="shrink-0"
            >
              <X size={17} />
            </button>
          </div>
        )}

        {success && (
          <div className="mb-5 flex items-start justify-between gap-4 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
            <span>{success}</span>

            <button
              type="button"
              onClick={() => setSuccess("")}
              className="shrink-0"
            >
              <X size={17} />
            </button>
          </div>
        )}

        {/* STATS */}

        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">

          <div className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#64748B]">
                  Total Groups
                </p>

                <p className="mt-2 text-2xl font-semibold text-[#172033]">
                  {groups.length}
                </p>
              </div>

              <div className="rounded-xl bg-[#F7F5F0] p-3 text-[#C87532]">
                <Building2 size={21} />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#64748B]">
                  Active Groups
                </p>

                <p className="mt-2 text-2xl font-semibold text-[#18352A]">
                  {activeCount}
                </p>
              </div>

              <div className="rounded-xl bg-green-50 p-3 text-green-600">
                <Users size={21} />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#64748B]">
                  Inactive Groups
                </p>

                <p className="mt-2 text-2xl font-semibold text-[#172033]">
                  {inactiveCount}
                </p>
              </div>

              <div className="rounded-xl bg-gray-100 p-3 text-gray-600">
                <Power size={21} />
              </div>
            </div>
          </div>

        </div>

        {/* FILTER BAR */}

        <div className="mb-5 rounded-2xl border border-[#E2E8F0] bg-white p-4 shadow-sm">

          <div className="flex flex-col gap-3 lg:flex-row">

            <div className="relative flex-1">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]"
              />

              <input
                type="text"
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                placeholder="Search groups..."
                className="h-11 w-full rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] pl-10 pr-4 text-sm text-[#172033] outline-none transition focus:border-[#C87532] focus:ring-2 focus:ring-[#C87532]/10"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value)
              }
              className="h-11 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-4 text-sm text-[#172033] outline-none focus:border-[#C87532]"
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
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-[#E2E8F0] bg-white px-4 text-sm font-medium text-[#172033] transition hover:bg-[#F8FAFC] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <RefreshCw
                size={17}
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

        {/* TABLE */}

        <div className="overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white shadow-sm">

          {loading ? (
            <div className="flex min-h-[300px] items-center justify-center">
              <div className="flex items-center gap-3 text-sm text-[#64748B]">
                <RefreshCw
                  size={18}
                  className="animate-spin"
                />
                Loading groups...
              </div>
            </div>
          ) : filteredGroups.length === 0 ? (
            <div className="flex min-h-[300px] flex-col items-center justify-center px-6 text-center">
              <div className="mb-4 rounded-2xl bg-[#F7F5F0] p-4 text-[#C87532]">
                <Building2 size={28} />
              </div>

              <h3 className="text-base font-semibold text-[#172033]">
                No groups found
              </h3>

              <p className="mt-1 max-w-md text-sm text-[#64748B]">
                {search || statusFilter !== "all"
                  ? "Try changing your search or status filter."
                  : "Create your first group to start managing departments."}
              </p>

              {!search &&
                statusFilter === "all" && (
                  <button
                    type="button"
                    onClick={openCreateModal}
                    className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#C87532] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#B76527]"
                  >
                    <Plus size={17} />
                    Create Group
                  </button>
                )}
            </div>
          ) : (
            <div className="overflow-x-auto">

              <table className="w-full min-w-[760px]">

                <thead>
                  <tr className="border-b border-[#E2E8F0] bg-[#F8FAFC] text-left">
                    <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-[#64748B]">
                      Group
                    </th>

                    <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-[#64748B]">
                      Description
                    </th>

                    <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-[#64748B]">
                      Status
                    </th>

                    <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wide text-[#64748B]">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>

                  {filteredGroups.map(
                    (group) => (
                      <tr
                        key={group.id}
                        className="border-b border-[#E2E8F0] last:border-b-0 hover:bg-[#FAFBFC]"
                      >

                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">

                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#F7F5F0] text-[#C87532]">
                              <Building2
                                size={19}
                              />
                            </div>

                            <div>
                              <p className="font-medium text-[#172033]">
                                {group.name}
                              </p>

                              <p className="mt-0.5 text-xs text-[#94A3B8]">
                                {group.id}
                              </p>
                            </div>

                          </div>
                        </td>

                        <td className="max-w-md px-5 py-4">
                          <p className="truncate text-sm text-[#64748B]">
                            {group.description ||
                              "No description"}
                          </p>
                        </td>

                        <td className="px-5 py-4">
                          <span
                            className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
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

                        <td className="px-5 py-4">
                          <div className="flex justify-end gap-2">

                            <button
                              type="button"
                              onClick={() =>
                                openEditModal(
                                  group
                                )
                              }
                              className="rounded-lg border border-[#E2E8F0] p-2 text-[#64748B] transition hover:border-[#C87532] hover:text-[#C87532]"
                              title="Edit"
                            >
                              <Pencil
                                size={16}
                              />
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                toggleStatus(
                                  group
                                )
                              }
                              className={`rounded-lg border p-2 transition ${
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
                              <Power
                                size={16}
                              />
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
                              className="rounded-lg border border-red-200 p-2 text-red-500 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                              title="Delete"
                            >
                              {deletingId ===
                              group.id ? (
                                <RefreshCw
                                  size={16}
                                  className="animate-spin"
                                />
                              ) : (
                                <Trash2
                                  size={16}
                                />
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
          )}

        </div>

      </div>

      {/* CREATE / EDIT MODAL */}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">

          <div className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl">

            {/* MODAL HEADER */}

            <div className="flex items-center justify-between border-b border-[#E2E8F0] px-6 py-5">

              <div>
                <h2 className="text-lg font-semibold text-[#172033]">
                  {editingGroup
                    ? "Edit Group"
                    : "Create Group"}
                </h2>

                <p className="mt-1 text-sm text-[#64748B]">
                  {editingGroup
                    ? "Update group information."
                    : "Add a new organizational group."}
                </p>
              </div>

              <button
                type="button"
                onClick={closeModal}
                disabled={saving}
                className="rounded-lg p-2 text-[#64748B] hover:bg-[#F8FAFC]"
              >
                <X size={19} />
              </button>

            </div>

            {/* FORM */}

            <form
              onSubmit={handleSubmit}
              className="space-y-5 p-6"
            >

              <div>
                <label className="mb-2 block text-sm font-medium text-[#172033]">
                  Group Name
                </label>

                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter group name"
                  required
                  className="h-11 w-full rounded-xl border border-[#E2E8F0] bg-white px-4 text-sm text-[#172033] outline-none focus:border-[#C87532] focus:ring-2 focus:ring-[#C87532]/10"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-[#172033]">
                  Description
                </label>

                <textarea
                  name="description"
                  value={
                    formData.description
                  }
                  onChange={handleChange}
                  placeholder="Enter group description"
                  rows={4}
                  className="w-full resize-none rounded-xl border border-[#E2E8F0] bg-white px-4 py-3 text-sm text-[#172033] outline-none focus:border-[#C87532] focus:ring-2 focus:ring-[#C87532]/10"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-[#172033]">
                  Status
                </label>

                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="h-11 w-full rounded-xl border border-[#E2E8F0] bg-white px-4 text-sm text-[#172033] outline-none focus:border-[#C87532]"
                >
                  <option value="active">
                    Active
                  </option>

                  <option value="inactive">
                    Inactive
                  </option>
                </select>
              </div>

              {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              )}

              {/* FOOTER */}

              <div className="flex flex-col-reverse gap-3 border-t border-[#E2E8F0] pt-5 sm:flex-row sm:justify-end">

                <button
                  type="button"
                  onClick={closeModal}
                  disabled={saving}
                  className="rounded-xl border border-[#E2E8F0] px-5 py-2.5 text-sm font-medium text-[#172033] hover:bg-[#F8FAFC] disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={
                    saving ||
                    !formData.name.trim()
                  }
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#C87532] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#B76527] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {saving && (
                    <RefreshCw
                      size={16}
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