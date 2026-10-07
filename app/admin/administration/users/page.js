"use client";

import { useEffect, useMemo, useState, useRef } from "react";
import {
  Plus,
  Search,
  MoreHorizontal,
  Pencil,
  Trash2,
  UserX,
  X,
  Loader2,
  AlertCircle,
  Users,
  ShieldCheck,
  UserCog,
  UserRoundCheck,
  ChevronDown,
  Eye,
  EyeOff,
  KeyRound,
  Check,
  Save,
  RefreshCw,
} from "lucide-react";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const emptyForm = {
  name: "",
  email: "",
  password: "",
  role: "",
  group: "",
};

/* =====================================================
   JWT ROLE
===================================================== */

const getCurrentRoleFromToken = () => {
  try {
    if (typeof window === "undefined") return "";

    const token = localStorage.getItem("adminToken");

    if (!token) return "";

    const parts = token.split(".");

    if (parts.length !== 3) return "";

    const payload = JSON.parse(
      atob(
        parts[1]
          .replace(/-/g, "+")
          .replace(/_/g, "/")
      )
    );

    return payload?.role || "";
  } catch (error) {
    console.error(
      "Unable to read admin role from token:",
      error
    );

    return "";
  }
};

/* =====================================================
   PERMISSION HELPERS
===================================================== */

const getPermissionLabel = (permission) => {
  if (!permission) return "";

  const [module, action] = permission.split(".");

  const format = (value) =>
    value
      ? value.charAt(0).toUpperCase() +
        value.slice(1).replace(/_/g, " ")
      : "";

  return `${format(module)} ${format(action)}`;
};

const getPermissionGroups = (permissions = []) => {
  const groups = {};

  permissions.forEach((permission) => {
    const module = permission?.split(".")?.[0];

    if (!module) return;

    if (!groups[module]) {
      groups[module] = [];
    }

    groups[module].push(permission);
  });

  return groups;
};

/* =====================================================
   PAGE
===================================================== */

export default function UserManagementPage() {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [groups, setGroups] = useState([]);

  const [currentRole, setCurrentRole] = useState("");
  const [currentPermissions, setCurrentPermissions] =
    useState([]);

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  const [loading, setLoading] = useState(true);
  const [rolesLoading, setRolesLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  const [formData, setFormData] = useState(emptyForm);
  const [showPassword, setShowPassword] = useState(false);

  const [openActionId, setOpenActionId] = useState(null);

  const [showPermissionModal, setShowPermissionModal] =
    useState(false);

  const [permissionUser, setPermissionUser] =
    useState(null);

  const [permissionOptions, setPermissionOptions] =
    useState([]);

  const [selectedPermissions, setSelectedPermissions] =
    useState([]);

  const [permissionsLoading, setPermissionsLoading] =
    useState(false);

  const [permissionsSaving, setPermissionsSaving] =
    useState(false);

  /* =====================================================
     ASSIGNMENT ACTIVITY
  ===================================================== */

  const [assignmentActivity, setAssignmentActivity] =
    useState([]);

  const [assignmentLoading, setAssignmentLoading] =
    useState(false);

  /* =====================================================
     PERMISSION CHECK
  ===================================================== */

  const hasPermission = (permission) => {
    if (currentRole === "super_admin") {
      return true;
    }

    return currentPermissions.includes(permission);
  };

  /* =====================================================
     FETCH USERS
  ===================================================== */

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError("");

      const token =
        localStorage.getItem("adminToken");

      if (!token) {
        setError("Admin session not found.");
        return;
      }

      const response = await fetch(
        `${API_URL}/api/admin/users`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          cache: "no-store",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.message || "Failed to fetch users."
        );
      }

      setUsers(
        Array.isArray(data?.users)
          ? data.users
          : Array.isArray(data)
          ? data
          : []
      );
    } catch (err) {
      console.error("Fetch users error:", err);

      setError(
        err.message || "Failed to fetch users."
      );
    } finally {
      setLoading(false);
    }
  };

  /* =====================================================
     FETCH ROLES
  ===================================================== */

  const fetchRoles = async () => {
    try {
      setRolesLoading(true);

      const token =
        localStorage.getItem("adminToken");

      if (!token) return;

      const response = await fetch(
        `${API_URL}/api/admin/roles`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          cache: "no-store",
        }
      );

      if (response.status === 403) {
        setRoles([]);
        setCurrentPermissions([]);
        return;
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.message || "Failed to fetch roles."
        );
      }

      setRoles(
        Array.isArray(data?.roles)
          ? data.roles
          : []
      );

      if (
        Array.isArray(data?.availablePermissions)
      ) {
        setCurrentPermissions(
          data.availablePermissions
        );
      }
    } catch (err) {
      console.error("Fetch roles error:", err);
      setRoles([]);
    } finally {
      setRolesLoading(false);
    }
  };

  /* =====================================================
     FETCH GROUPS
  ===================================================== */

  const fetchGroups = async () => {
    try {
      const token =
        localStorage.getItem("adminToken");

      if (!token) return;

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

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.message || "Failed to fetch groups."
        );
      }

      setGroups(
        Array.isArray(data?.groups)
          ? data.groups
          : Array.isArray(data)
          ? data
          : []
      );
    } catch (err) {
      console.error("Fetch groups error:", err);
      setGroups([]);
    }
  };

  /* =====================================================
     FETCH ASSIGNMENT ACTIVITY
  ===================================================== */

  const fetchAssignmentActivity = async () => {
    try {
      setAssignmentLoading(true);

      const token =
        localStorage.getItem("adminToken");

      if (!token) {
        setAssignmentActivity([]);
        return;
      }

      const response = await fetch(
        `${API_URL}/api/admin/assignments/recent`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          cache: "no-store",
        }
      );

      if (!response.ok) {
        setAssignmentActivity([]);
        return;
      }

      const data = await response.json();

      setAssignmentActivity(
        Array.isArray(data?.assignments)
          ? data.assignments
          : []
      );
    } catch (err) {
      console.error(
        "Fetch assignment activity error:",
        err
      );

      setAssignmentActivity([]);
    } finally {
      setAssignmentLoading(false);
    }
  };

  /* =====================================================
     INITIAL LOAD
  ===================================================== */

  useEffect(() => {
    const role =
      getCurrentRoleFromToken();

    setCurrentRole(role);

    fetchUsers();
    fetchRoles();
    fetchGroups();
    fetchAssignmentActivity();
  }, []);

  /* =====================================================
     HELPERS
  ===================================================== */

  const getRoleLabel = (roleId) => {
    const role = roles.find(
      (item) => item.roleId === roleId
    );

    if (role?.name) return role.name;

    const labels = {
      super_admin: "Super Admin",
      admin: "Admin",
      manager: "Manager",
      staff: "Staff",
    };

    return (
      labels[roleId] ||
      roleId ||
      "—"
    );
  };

  const getGroupLabel = (groupId) => {
    if (!groupId) return "—";

    if (typeof groupId === "object") {
      return (
        groupId.name ||
        groupId.groupId ||
        "—"
      );
    }

    const group = groups.find(
      (item) =>
        item._id === groupId ||
        item.groupId === groupId
    );

    return (
      group?.name ||
      group?.groupId ||
      groupId
    );
  };

  /* =====================================================
     ROLE STYLE
  ===================================================== */

  const getRoleStyle = (role) => {
    switch (role) {
      case "super_admin":
        return {
          badge:
            "bg-purple-50 text-purple-700 border-purple-200",
          dot: "bg-purple-500",
        };

      case "admin":
        return {
          badge:
            "bg-orange-50 text-orange-700 border-orange-200",
          dot: "bg-orange-500",
        };

      case "manager":
        return {
          badge:
            "bg-blue-50 text-blue-700 border-blue-200",
          dot: "bg-blue-500",
        };

      case "staff":
        return {
          badge:
            "bg-green-50 text-green-700 border-green-200",
          dot: "bg-green-500",
        };

      default:
        return {
          badge:
            "bg-gray-50 text-gray-600 border-gray-200",
          dot: "bg-gray-400",
        };
    }
  };

  const getStatusStyle = (status) => {
    return status === "active"
      ? "bg-green-50 text-green-700 border-green-200"
      : "bg-gray-100 text-gray-500 border-gray-200";
  };

  /* =====================================================
     FILTERED USERS
  ===================================================== */

  const filteredUsers = useMemo(() => {
    const query =
      search.trim().toLowerCase();

    return users.filter((user) => {
      const role =
        user.role || "";

      const group =
        typeof user.group === "object"
          ? user.group?.name ||
            user.group?.groupId ||
            ""
          : user.group || "";

      const matchesSearch =
        !query ||
        user.name
          ?.toLowerCase()
          .includes(query) ||
        user.email
          ?.toLowerCase()
          .includes(query) ||
        role
          .toLowerCase()
          .includes(query) ||
        group
          .toLowerCase()
          .includes(query);

      const matchesRole =
        roleFilter === "all" ||
        role === roleFilter;

      return (
        matchesSearch &&
        matchesRole
      );
    });
  }, [
    users,
    search,
    roleFilter,
  ]);

  /* =====================================================
     SUMMARY
  ===================================================== */

  const totalUsers =
    users.length;

  const superAdmins =
    users.filter(
      (user) =>
        user.role === "super_admin"
    ).length;

  const admins =
    users.filter(
      (user) =>
        user.role === "admin"
    ).length;

  const managers =
    users.filter(
      (user) =>
        user.role === "manager"
    ).length;

  const staff =
    users.filter(
      (user) =>
        user.role === "staff"
    ).length;

  /* =====================================================
     ADD USER
  ===================================================== */

  const handleAddUser = () => {
    if (!hasPermission("team.create")) {
      setError(
        "You do not have permission to create users."
      );
      return;
    }

    setEditingUser(null);

    setFormData({
      ...emptyForm,
      role: "staff",
      group: "",
    });

    setShowPassword(false);
    setError("");
    setSuccess("");
    setShowModal(true);
  };

  /* =====================================================
     EDIT USER
  ===================================================== */

  const handleEditUser = (user) => {
    if (!hasPermission("team.update")) {
      setError(
        "You do not have permission to update users."
      );
      return;
    }

    setEditingUser(user);

    setFormData({
      name: user.name || "",
      email: user.email || "",
      password: "",
      role: user.role || "",
      group:
        typeof user.group === "object"
          ? user.group?._id ||
            user.group?.groupId ||
            ""
          : user.group || "",
    });

    setShowPassword(false);
    setError("");
    setSuccess("");
    setOpenActionId(null);
    setShowModal(true);
  };

  /* =====================================================
     FORM CHANGE
  ===================================================== */

  const handleFormChange = (
    field,
    value
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  /* =====================================================
     CREATE / UPDATE USER
  ===================================================== */

  const handleSubmit = async (event) => {
    event.preventDefault();

    const requiredPermission =
      editingUser
        ? "team.update"
        : "team.create";

    if (
      !hasPermission(
        requiredPermission
      )
    ) {
      setError(
        "You do not have permission for this action."
      );
      return;
    }

    if (!formData.name.trim()) {
      setError("Please enter full name.");
      return;
    }

    if (!formData.email.trim()) {
      setError("Please enter email.");
      return;
    }

    if (!formData.role) {
      setError("Please select a role.");
      return;
    }

    if (
      formData.role !== "super_admin" &&
      !formData.group
    ) {
      setError(
        "Please select a department."
      );
      return;
    }

    if (
      !editingUser &&
      !formData.password
    ) {
      setError(
        "Please enter password."
      );
      return;
    }

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const token =
        localStorage.getItem("adminToken");

      const body = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        role: formData.role,
        group:
          formData.role === "super_admin"
            ? null
            : formData.group,
      };

      if (formData.password.trim()) {
        body.password =
          formData.password.trim();
      }

      const url = editingUser
        ? `${API_URL}/api/admin/users/${editingUser._id}`
        : `${API_URL}/api/admin/users`;

      const response = await fetch(url, {
        method: editingUser
          ? "PUT"
          : "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data?.message ||
            "Failed to save user."
        );
      }

      setSuccess(
        editingUser
          ? "User updated successfully."
          : "User created successfully."
      );

      setShowModal(false);
      setEditingUser(null);
      setFormData(emptyForm);

      await fetchUsers();

      setTimeout(() => {
        setSuccess("");
      }, 3000);
    } catch (err) {
      console.error(
        "Save user error:",
        err
      );

      setError(
        err.message ||
          "Failed to save user."
      );
    } finally {
      setSaving(false);
    }
  };

  /* =====================================================
     TOGGLE STATUS
  ===================================================== */

  const handleToggleStatus = async (
    user
  ) => {
    if (!hasPermission("team.update")) {
      setError(
        "You do not have permission to update users."
      );
      return;
    }

    try {
      setError("");
      setSuccess("");

      const token =
        localStorage.getItem("adminToken");

      const newStatus =
        user.status === "active"
          ? "inactive"
          : "active";

      const response = await fetch(
        `${API_URL}/api/admin/users/${user._id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status: newStatus,
          }),
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data?.message ||
            "Failed to update status."
        );
      }

      setSuccess(
        newStatus === "active"
          ? "User activated successfully."
          : "User deactivated successfully."
      );

      setOpenActionId(null);

      await fetchUsers();

      setTimeout(() => {
        setSuccess("");
      }, 3000);
    } catch (err) {
      console.error(
        "Toggle status error:",
        err
      );

      setError(
        err.message ||
          "Failed to update status."
      );
    }
  };

  /* =====================================================
     DELETE USER
  ===================================================== */

  const handleDeleteUser = async (
    user
  ) => {
    if (!hasPermission("team.delete")) {
      setError(
        "You do not have permission to delete users."
      );
      return;
    }

    const confirmed =
      window.confirm(
        `Delete ${user.name}?`
      );

    if (!confirmed) return;

    try {
      setError("");
      setSuccess("");

      const token =
        localStorage.getItem("adminToken");

      const response = await fetch(
        `${API_URL}/api/admin/users/${user._id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data?.message ||
            "Failed to delete user."
        );
      }

      setSuccess(
        "User deleted successfully."
      );

      setOpenActionId(null);

      await fetchUsers();

      setTimeout(() => {
        setSuccess("");
      }, 3000);
    } catch (err) {
      console.error(
        "Delete user error:",
        err
      );

      setError(
        err.message ||
          "Failed to delete user."
      );
    }
  };

  /* =====================================================
     MANAGE PERMISSIONS
  ===================================================== */

  const handleManagePermissions = async (
    user
  ) => {
    if (!hasPermission("team.view")) {
      setError(
        "You do not have permission to view permissions."
      );
      return;
    }

    try {
      setPermissionsLoading(true);
      setError("");

      const token =
        localStorage.getItem("adminToken");

      const response = await fetch(
        `${API_URL}/api/admin/users/${user._id}/permissions`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          cache: "no-store",
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data?.message ||
            "Failed to fetch permissions."
        );
      }

      setPermissionUser(user);

      setPermissionOptions(
        Array.isArray(
          data?.availablePermissions
        )
          ? data.availablePermissions
          : []
      );

      setSelectedPermissions(
        Array.isArray(data?.permissions)
          ? data.permissions
          : []
      );

      setOpenActionId(null);
      setShowPermissionModal(true);
    } catch (err) {
      console.error(
        "Manage permissions error:",
        err
      );

      setError(
        err.message ||
          "Failed to fetch permissions."
      );
    } finally {
      setPermissionsLoading(false);
    }
  };

  /* =====================================================
     SAVE PERMISSIONS
  ===================================================== */

  const handleSavePermissions = async () => {
    if (!permissionUser) return;

    if (!hasPermission("team.update")) {
      setError(
        "You do not have permission to update permissions."
      );
      return;
    }

    try {
      setPermissionsSaving(true);
      setError("");
      setSuccess("");

      const token =
        localStorage.getItem("adminToken");

      const response = await fetch(
        `${API_URL}/api/admin/users/${permissionUser._id}/permissions`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            permissions:
              selectedPermissions,
          }),
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data?.message ||
            "Failed to save permissions."
        );
      }

      setSuccess(
        "Permissions updated successfully."
      );

      setShowPermissionModal(false);
      setPermissionUser(null);

      await fetchUsers();

      setTimeout(() => {
        setSuccess("");
      }, 3000);
    } catch (err) {
      console.error(
        "Save permissions error:",
        err
      );

      setError(
        err.message ||
          "Failed to save permissions."
      );
    } finally {
      setPermissionsSaving(false);
    }
  };

  /* =====================================================
     PERMISSION SELECT
  ===================================================== */

  const togglePermission = (
    permission
  ) => {
    setSelectedPermissions(
      (prev) =>
        prev.includes(permission)
          ? prev.filter(
              (item) =>
                item !== permission
            )
          : [
              ...prev,
              permission,
            ]
    );
  };

  const selectAllPermissions = () => {
    setSelectedPermissions([
      ...permissionOptions,
    ]);
  };

  const clearAllPermissions = () => {
    setSelectedPermissions([]);
  };

  /* =====================================================
     CLOSE MODALS
  ===================================================== */

  const closeUserModal = () => {
    if (saving) return;

    setShowModal(false);
    setEditingUser(null);
    setFormData(emptyForm);
    setShowPassword(false);
  };

  const closePermissionModal = () => {
    if (permissionsSaving) return;

    setShowPermissionModal(false);
    setPermissionUser(null);
    setPermissionOptions([]);
    setSelectedPermissions([]);
  };

  /* =====================================================
     ASSIGNMENT FORMAT
  ===================================================== */

  const getAssignmentName = (
    value
  ) => {
    if (!value) return "—";

    if (typeof value === "object") {
      return (
        value.name ||
        value.email ||
        value._id ||
        "—"
      );
    }

    return value;
  };

  const formatAssignmentDate = (
    value
  ) => {
    if (!value) return "—";

    const date =
      new Date(value);

    if (
      Number.isNaN(
        date.getTime()
      )
    ) {
      return "—";
    }

    return date.toLocaleString(
      "en-GB",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }
    );
  };

  /* =====================================================
     RENDER
  ===================================================== */

  return (
    <div className="min-h-screen bg-[#F7F5F0] text-[#172033]">

      <div className="p-3 sm:p-4 lg:p-5">

        {/* HEADER */}

        <div className="mb-4">

          <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-3">

            <div className="min-w-0">

              <div className="flex items-center gap-2">

                <div className="w-9 h-9 rounded-xl bg-[#18352A] flex items-center justify-center shrink-0">

                  <Users className="w-4.5 h-4.5 text-white" />

                </div>

                <div className="min-w-0">

                  <p className="text-[10px] text-[#C87532] font-semibold uppercase tracking-wide">
                    Administration
                  </p>

                  <h1 className="text-lg sm:text-xl font-bold text-[#172033] truncate">
                    User Management
                  </h1>

                  <p className="text-[10px] sm:text-[11px] text-gray-500">
                    Manage users, roles and department access.
                  </p>

                </div>

              </div>

            </div>

            {/* ASSIGNMENT */}

            <div className="w-full xl:w-auto xl:min-w-[330px]">

              <div className="bg-white border border-gray-200 rounded-xl shadow-sm px-3 py-2.5">

                <div className="flex items-center justify-between gap-2 mb-1.5">

                  <p className="text-[10px] sm:text-[11px] font-semibold text-[#172033]">
                    Assignment
                  </p>

                  {assignmentActivity.length > 0 && (
                    <span className="text-[8px] text-gray-400">
                      Recent
                    </span>
                  )}

                </div>

                {assignmentLoading ? (

                  <div className="flex items-center gap-1.5 text-[9px] text-gray-400">

                    <Loader2 className="w-3 h-3 animate-spin" />

                    Loading...

                  </div>

                ) : assignmentActivity.length === 0 ? (

                  <p className="text-[9px] text-gray-400">
                    No recent assignment
                  </p>

                ) : (

                  <div className="space-y-2">

                    {assignmentActivity
                      .slice(0, 2)
                      .map(
                        (
                          activity,
                          index
                        ) => (

                          <div
                            key={
                              activity._id ||
                              activity.id ||
                              index
                            }
                            className={
                              index > 0
                                ? "pt-2 border-t border-gray-100"
                                : ""
                            }
                          >

                            <p className="text-[10px] sm:text-[11px] font-semibold text-gray-800 truncate">

                              {getAssignmentName(
                                activity.assignedBy
                              )}

                              <span className="mx-1.5 text-[#C87532]">
                                →
                              </span>

                              {getAssignmentName(
                                activity.assignedTo
                              )}

                            </p>

                            <p className="text-[8px] sm:text-[9px] text-gray-400 mt-0.5 truncate">

                              {getGroupLabel(
                                activity.group
                              )}

                              {" • "}

                              {getRoleLabel(
                                typeof activity.role ===
                                "object"
                                  ? activity.role?.roleId
                                  : activity.role
                              )}

                              {" • "}

                              {formatAssignmentDate(
                                activity.assignedAt
                              )}

                            </p>

                          </div>

                        )
                      )}

                  </div>

                )}

              </div>

            </div>

          </div>

        </div>

        {/* SUMMARY */}

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mb-4">

          <SummaryCard
            icon={Users}
            label="Total Users"
            value={totalUsers}
          />

          <SummaryCard
            icon={ShieldCheck}
            label="Super Admin"
            value={superAdmins}
          />

          <SummaryCard
            icon={UserCog}
            label="Admin"
            value={admins}
          />

          <SummaryCard
            icon={UserRoundCheck}
            label="Managers"
            value={managers}
          />

          <SummaryCard
            icon={Users}
            label="Staff"
            value={staff}
          />

        </div>

        {/* ALERTS */}

        {error && (

          <div className="mb-3 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2.5 text-red-700">

            <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />

            <p className="text-[11px]">
              {error}
            </p>

            <button
              onClick={() =>
                setError("")
              }
              className="ml-auto"
            >
              <X className="w-3.5 h-3.5" />
            </button>

          </div>

        )}

        {success && (

          <div className="mb-3 flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 px-3 py-2.5 text-green-700">

            <Check className="w-4 h-4" />

            <p className="text-[11px]">
              {success}
            </p>

          </div>

        )}

        {/* TOOLBAR */}

        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-2.5 sm:p-3 mb-3">

          <div className="flex flex-col md:flex-row gap-2">

            {/* SEARCH */}

            <div className="relative flex-1">

              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-[14px] h-[14px] text-gray-400" />

              <input
                type="text"
                value={search}
                onChange={(e) =>
                  setSearch(
                    e.target.value
                  )
                }
                placeholder="Search users..."
                className="w-full h-[34px] sm:h-9 rounded-lg border border-gray-200 bg-gray-50 pl-[32px] pr-2.5 text-[10px] sm:text-[11px] outline-none focus:border-[#C87532] focus:bg-white"
              />

            </div>

            {/* ROLE FILTER */}

            <div className="relative w-full md:w-[170px]">

              <select
                value={roleFilter}
                onChange={(e) =>
                  setRoleFilter(
                    e.target.value
                  )
                }
                className="w-full h-[34px] sm:h-9 appearance-none rounded-lg border border-gray-200 bg-gray-50 px-2.5 pr-7 text-[10px] sm:text-[11px] outline-none focus:border-[#C87532] focus:bg-white"
              >

                <option value="all">
                  All Roles
                </option>

                <option value="super_admin">
                  Super Admin
                </option>

                <option value="admin">
                  Admin
                </option>

                <option value="manager">
                  Manager
                </option>

                <option value="staff">
                  Staff
                </option>

              </select>

              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-[13px] h-[13px] text-gray-400 pointer-events-none" />

            </div>

            {/* BUTTONS */}

            <div className="flex items-center gap-[6px]">

              <button
                onClick={() => {
                  fetchUsers();
                  fetchGroups();
                  fetchAssignmentActivity();
                }}
                className="h-[34px] sm:h-9 flex-1 md:flex-none md:px-3 px-2.5 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-gray-600 flex items-center justify-center gap-[5px] text-[9px] sm:text-[10px] font-medium whitespace-nowrap"
              >

                <RefreshCw className="w-[13px] h-[13px]" />

                <span>
                  Refresh
                </span>

              </button>

              <button
                onClick={handleAddUser}
                disabled={
                  !hasPermission(
                    "team.create"
                  )
                }
                className="h-[34px] sm:h-9 flex-1 md:flex-none px-2.5 sm:px-3.5 rounded-lg bg-[#C87532] hover:bg-[#B96928] disabled:opacity-40 disabled:cursor-not-allowed text-white flex items-center justify-center gap-[5px] text-[9px] sm:text-[10px] font-semibold whitespace-nowrap"
              >

                <Plus className="w-[13px] h-[13px]" />

                <span>
                  Add User
                </span>

              </button>

            </div>

          </div>

        </div>

        {/* DESKTOP TABLE */}

        <div className="hidden md:block bg-white border border-gray-200 rounded-xl shadow-sm overflow-visible">

          <div className="overflow-x-auto">

            <table className="w-full">

              <thead>

                <tr className="border-b border-gray-100 bg-gray-50/70">

                  <th className="text-left px-4 py-3 text-[10px] font-semibold text-gray-500 uppercase">
                    User
                  </th>

                  <th className="text-left px-4 py-3 text-[10px] font-semibold text-gray-500 uppercase">
                    Role
                  </th>

                  <th className="text-left px-4 py-3 text-[10px] font-semibold text-gray-500 uppercase">
                    Department
                  </th>

                  <th className="text-left px-4 py-3 text-[10px] font-semibold text-gray-500 uppercase">
                    Status
                  </th>

                  <th className="text-left px-4 py-3 text-[10px] font-semibold text-gray-500 uppercase">
                    Created
                  </th>

                  <th className="text-right px-4 py-3 text-[10px] font-semibold text-gray-500 uppercase">
                    Action
                  </th>

                </tr>

              </thead>

              <tbody>

                {loading ? (

                  <tr>

                    <td
                      colSpan={6}
                      className="py-12 text-center"
                    >

                      <Loader2 className="w-5 h-5 animate-spin text-[#C87532] mx-auto" />

                    </td>

                  </tr>

                ) : filteredUsers.length === 0 ? (

                  <tr>

                    <td
                      colSpan={6}
                      className="py-12 text-center text-[11px] text-gray-400"
                    >
                      No users found.
                    </td>

                  </tr>

                ) : (

                  filteredUsers.map(
                    (user) => (

                      <tr
                        key={user._id}
                        className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50/60"
                      >

                        <td className="px-4 py-3">

                          <div className="flex items-center gap-2.5">

                            <div className="w-8 h-8 rounded-full bg-[#18352A] text-white flex items-center justify-center text-[10px] font-bold shrink-0">

                              {(
                                user.name ||
                                "U"
                              )
                                .charAt(0)
                                .toUpperCase()}

                            </div>

                            <div className="min-w-0">

                              <p className="text-[11px] font-semibold text-gray-800 truncate max-w-[180px]">
                                {user.name ||
                                  "—"}
                              </p>

                              <p className="text-[9px] text-gray-400 truncate max-w-[200px]">
                                {user.email ||
                                  "—"}
                              </p>

                            </div>

                          </div>

                        </td>

                        <td className="px-4 py-3">

                          <span
                            className={`inline-flex items-center rounded-full border px-2 py-1 text-[9px] font-medium ${
                              getRoleStyle(
                                user.role
                              ).badge
                            }`}
                          >
                            {getRoleLabel(
                              user.role
                            )}
                          </span>

                        </td>

                        <td className="px-4 py-3 text-[10px] text-gray-600">

                          {getGroupLabel(
                            user.group
                          )}

                        </td>

                        <td className="px-4 py-3">

                          <span
                            className={`inline-flex items-center rounded-full border px-2 py-1 text-[9px] font-medium ${getStatusStyle(
                              user.status
                            )}`}
                          >

                            {user.status ===
                            "active"
                              ? "Active"
                              : "Inactive"}

                          </span>

                        </td>

                        <td className="px-4 py-3 text-[9px] text-gray-400">

                          {user.createdAt
                            ? new Date(
                                user.createdAt
                              ).toLocaleDateString(
                                "en-GB"
                              )
                            : "—"}

                        </td>

                        <td className="px-4 py-3 text-right">

                          <ActionMenu
                            user={user}
                            openActionId={
                              openActionId
                            }
                            setOpenActionId={
                              setOpenActionId
                            }
                            onEdit={
                              handleEditUser
                            }
                            onPermissions={
                              handleManagePermissions
                            }
                            onToggleStatus={
                              handleToggleStatus
                            }
                            onDelete={
                              handleDeleteUser
                            }
                            canEdit={hasPermission(
                              "team.update"
                            )}
                            canDelete={hasPermission(
                              "team.delete"
                            )}
                            canViewPermissions={hasPermission(
                              "team.view"
                            )}
                          />

                        </td>

                      </tr>

                    )
                  )

                )}

              </tbody>

            </table>

          </div>

        </div>

        {/* MOBILE USERS */}

        <div className="md:hidden space-y-[6px]">

          {loading ? (

            <div className="h-[110px] bg-white border border-gray-200 rounded-xl shadow-sm flex items-center justify-center">

              <Loader2 className="w-5 h-5 animate-spin text-[#C87532]" />

            </div>

          ) : filteredUsers.length === 0 ? (

            <div className="h-[120px] bg-white border border-gray-200 rounded-xl shadow-sm flex flex-col items-center justify-center px-4">

              <Users className="w-6 h-6 text-gray-300" />

              <p className="text-[11px] font-medium text-gray-700 mt-1.5">
                No users found
              </p>

              <p className="text-[9px] text-gray-400 mt-0.5 text-center">
                Try changing your search or filter.
              </p>

            </div>

          ) : (

            filteredUsers.map(
              (user) => {

                const roleStyle =
                  getRoleStyle(
                    user.role
                  );

                const userAssignment =
                  assignmentActivity
                    .filter(
                      (activity) => {

                        const assignedTo =
                          typeof activity.assignedTo ===
                          "object"
                            ? activity.assignedTo?._id
                            : activity.assignedTo;

                        return (
                          !assignedTo ||
                          assignedTo ===
                            user._id
                        );
                      }
                    )
                    .slice(0, 1);

                return (

                  <div
                    key={user._id}
                    className="bg-white border border-gray-200 rounded-xl p-[10px] shadow-sm"
                  >

                    <div className="h-[36px] flex items-center justify-between gap-2">

                      <div className="flex items-center gap-[8px] min-w-0">

                        <div className="w-[34px] h-[34px] rounded-full bg-[#18352A] flex items-center justify-center shrink-0">

                          <UserRoundCheck className="w-[14px] h-[14px] text-white" />

                        </div>

                        <div className="min-w-0">

                          <p className="text-[10px] font-semibold text-gray-800 truncate leading-[13px]">

                            {user.name ||
                              "—"}

                          </p>

                          <p className="text-[8px] text-gray-500 truncate max-w-[190px] leading-[11px] mt-[1px]">

                            {user.email ||
                              "—"}

                          </p>

                        </div>

                      </div>

                      <ActionMenu
                        user={user}
                        openActionId={
                          openActionId
                        }
                        setOpenActionId={
                          setOpenActionId
                        }
                        onEdit={
                          handleEditUser
                        }
                        onPermissions={
                          handleManagePermissions
                        }
                        onToggleStatus={
                          handleToggleStatus
                        }
                        onDelete={
                          handleDeleteUser
                        }
                        canEdit={hasPermission(
                          "team.update"
                        )}
                        canDelete={hasPermission(
                          "team.delete"
                        )}
                        canViewPermissions={hasPermission(
                          "team.view"
                        )}
                        mobile={true}
                      />

                    </div>

                    <div className="mt-[8px] flex flex-wrap items-center gap-[5px]">

                      <span
                        className={`inline-flex items-center gap-[4px] h-[22px] px-[7px] rounded-lg border text-[8px] font-semibold ${roleStyle.badge}`}
                      >

                        <span
                          className={`w-[5px] h-[5px] rounded-full ${roleStyle.dot}`}
                        />

                        {getRoleLabel(
                          user.role
                        )}

                      </span>

                      <span className="h-[22px] inline-flex items-center px-[7px] rounded-lg bg-gray-50 border border-gray-200 text-[8px] text-gray-600">

                        {getGroupLabel(
                          user.group
                        )}

                      </span>

                      <span
                        className={`h-[22px] inline-flex items-center px-[7px] rounded-lg text-[8px] font-semibold ${
                          user.status ===
                          "inactive"
                            ? "bg-gray-100 text-gray-600"
                            : "bg-green-50 text-green-700"
                        }`}
                      >

                        {user.status ===
                        "inactive"
                          ? "Inactive"
                          : "Active"}

                      </span>

                    </div>

                    <div className="mt-[6px] px-[7px] py-[5px] rounded-lg bg-gray-50 border border-gray-100">

                      <p className="text-[7px] text-gray-400 uppercase tracking-wide">
                        Created
                      </p>

                      <p className="text-[8px] text-gray-600 mt-[1px]">
                        {user.createdAt
                          ? new Date(
                              user.createdAt
                            ).toLocaleDateString(
                              "en-GB"
                            )
                          : "—"}
                      </p>

                    </div>

                    {userAssignment.length >
                      0 && (

                      <div className="mt-[6px] px-[7px] py-[6px] rounded-lg bg-[#F7F5F0] border border-gray-100">

                        {userAssignment.map(
                          (
                            activity,
                            index
                          ) => (

                            <div
                              key={
                                activity._id ||
                                activity.id ||
                                index
                              }
                            >

                              <p className="text-[9px] font-semibold text-gray-800 truncate">

                                {getAssignmentName(
                                  activity.assignedBy
                                )}

                                <span className="mx-[5px] text-[#C87532]">
                                  →
                                </span>

                                {getAssignmentName(
                                  activity.assignedTo
                                )}

                              </p>

                              <p className="text-[7px] text-gray-400 mt-[2px] truncate">

                                {getGroupLabel(
                                  activity.group
                                )}

                                {" • "}

                                {getRoleLabel(
                                  typeof activity.role ===
                                  "object"
                                    ? activity.role?.roleId
                                    : activity.role
                                )}

                                {" • "}

                                {formatAssignmentDate(
                                  activity.assignedAt
                                )}

                              </p>

                            </div>

                          )
                        )}

                      </div>

                    )}

                  </div>

                );

              }
            )

          )}

        </div>

      </div>

      {/* ADD / EDIT USER MODAL */}

      {showModal && (

        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-3">

          <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden">

            <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">

              <div>

                <h2 className="text-sm font-bold text-[#172033]">

                  {editingUser
                    ? "Edit User"
                    : "Add User"}

                </h2>

                <p className="text-[9px] text-gray-400 mt-0.5">
                  Create user access and assign department.
                </p>

              </div>

              <button
                onClick={
                  closeUserModal
                }
                className="w-7 h-7 rounded-lg hover:bg-gray-100 flex items-center justify-center"
              >

                <X className="w-4 h-4 text-gray-500" />

              </button>

            </div>

            <form
              onSubmit={handleSubmit}
              className="p-4 space-y-3"
            >

              <div>

                <label className="block text-[10px] font-semibold text-gray-600 mb-1">
                  Full Name
                </label>

                <input
                  value={formData.name}
                  onChange={(e) =>
                    handleFormChange(
                      "name",
                      e.target.value
                    )
                  }
                  placeholder="Enter full name"
                  className="w-full h-9 rounded-lg border border-gray-200 px-3 text-[11px] outline-none focus:border-[#C87532]"
                />

              </div>

              <div>

                <label className="block text-[10px] font-semibold text-gray-600 mb-1">
                  Email
                </label>

                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    handleFormChange(
                      "email",
                      e.target.value
                    )
                  }
                  placeholder="Enter email"
                  className="w-full h-9 rounded-lg border border-gray-200 px-3 text-[11px] outline-none focus:border-[#C87532]"
                />

              </div>

              <div>

                <label className="block text-[10px] font-semibold text-gray-600 mb-1">
                  Password
                </label>

                <div className="relative">

                  <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />

                  <input
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    value={
                      formData.password
                    }
                    onChange={(e) =>
                      handleFormChange(
                        "password",
                        e.target.value
                      )
                    }
                    placeholder={
                      editingUser
                        ? "Leave blank to keep current password"
                        : "Enter password"
                    }
                    className="w-full h-9 rounded-lg border border-gray-200 pl-9 pr-9 text-[11px] outline-none focus:border-[#C87532]"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(
                        (prev) =>
                          !prev
                      )
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                  >

                    {showPassword ? (
                      <EyeOff className="w-3.5 h-3.5" />
                    ) : (
                      <Eye className="w-3.5 h-3.5" />
                    )}

                  </button>

                </div>

              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

                <div>

                  <label className="block text-[10px] font-semibold text-gray-600 mb-1">
                    Role
                  </label>

                  <div className="relative">

                    <select
                      value={formData.role}
                      onChange={(e) =>
                        handleFormChange(
                          "role",
                          e.target.value
                        )
                      }
                      className="w-full h-9 appearance-none rounded-lg border border-gray-200 px-3 pr-8 text-[11px] outline-none focus:border-[#C87532]"
                    >

                      <option value="">
                        Select role
                      </option>

                      <option value="admin">
                        Admin
                      </option>

                      <option value="manager">
                        Manager
                      </option>

                      <option value="staff">
                        Staff
                      </option>

                      {currentRole === "super_admin" && (
                        <option value="super_admin">
                          Super Admin
                        </option>
                      )}

                    </select>

                    <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />

                  </div>

                </div>

                <div>

                  <label className="block text-[10px] font-semibold text-gray-600 mb-1">
                    Department
                  </label>

                  <div className="relative">

                    <select
                      value={
                        formData.group
                      }
                      onChange={(e) =>
                        handleFormChange(
                          "group",
                          e.target.value
                        )
                      }
                      disabled={
                        formData.role ===
                        "super_admin"
                      }
                      className="w-full h-9 appearance-none rounded-lg border border-gray-200 px-3 pr-8 text-[11px] outline-none focus:border-[#C87532] disabled:bg-gray-100 disabled:text-gray-400"
                    >

                      <option value="">
                        Select department
                      </option>

                      {groups.map(
                        (group) => (

                          <option
                            key={
                              group._id ||
                              group.groupId
                            }
                            value={
                              group._id ||
                              group.groupId
                            }
                          >
                            {group.name ||
                              group.groupId}
                          </option>

                        )
                      )}

                    </select>

                    <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />

                  </div>

                </div>

              </div>

              <div className="pt-2 flex items-center justify-end gap-2">

                <button
                  type="button"
                  onClick={
                    closeUserModal
                  }
                  className="h-9 px-4 rounded-lg border border-gray-200 text-[10px] font-medium text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="h-9 px-4 rounded-lg bg-[#C87532] hover:bg-[#B96928] disabled:opacity-50 text-white text-[10px] font-semibold flex items-center gap-1.5"
                >

                  {saving ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Save className="w-3.5 h-3.5" />
                  )}

                  {editingUser
                    ? "Update User"
                    : "Create User"}

                </button>

              </div>

            </form>

          </div>

        </div>

      )}

      {/* PERMISSION MODAL */}

      {showPermissionModal && (

        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-3">

          <div className="w-full max-w-2xl max-h-[90vh] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col">

            <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between shrink-0">

              <div>

                <h2 className="text-sm font-bold text-[#172033]">
                  Manage Permissions
                </h2>

                <p className="text-[9px] text-gray-400 mt-0.5">

                  {permissionUser?.name ||
                    "User"}

                  {" • "}

                  {getRoleLabel(
                    permissionUser?.role
                  )}

                  {" • "}

                  {getGroupLabel(
                    permissionUser?.group
                  )}

                </p>

              </div>

              <button
                onClick={
                  closePermissionModal
                }
                className="w-7 h-7 rounded-lg hover:bg-gray-100 flex items-center justify-center"
              >

                <X className="w-4 h-4 text-gray-500" />

              </button>

            </div>

            <div className="p-4 overflow-y-auto">

              <div className="flex items-center justify-between gap-3 mb-3">

                <div>

                  <p className="text-[11px] font-semibold text-gray-800">
                    Available Permissions
                  </p>

                  <p className="text-[9px] text-gray-400">
                    Only permissions available to you can be delegated.
                  </p>

                </div>

                <span className="text-[9px] text-[#C87532] font-semibold whitespace-nowrap">
                  {selectedPermissions.length} selected
                </span>

              </div>

              {permissionsLoading ? (

                <div className="py-12 flex justify-center">

                  <Loader2 className="w-5 h-5 animate-spin text-[#C87532]" />

                </div>

              ) : permissionOptions.length === 0 ? (

                <div className="py-12 text-center text-[10px] text-gray-400">
                  No permissions available.
                </div>

              ) : (

                <>

                  <div className="flex items-center gap-2 mb-3">

                    <button
                      type="button"
                      onClick={
                        selectAllPermissions
                      }
                      className="h-8 px-3 rounded-lg bg-gray-100 hover:bg-gray-200 text-[9px] font-medium text-gray-700"
                    >
                      Select All
                    </button>

                    <button
                      type="button"
                      onClick={
                        clearAllPermissions
                      }
                      className="h-8 px-3 rounded-lg border border-gray-200 hover:bg-gray-50 text-[9px] font-medium text-gray-600"
                    >
                      Clear
                    </button>

                  </div>

                  <div className="space-y-3">

                    {Object.entries(
                      getPermissionGroups(
                        permissionOptions
                      )
                    ).map(
                      ([
                        module,
                        permissions,
                      ]) => (

                        <div
                          key={module}
                          className="border border-gray-200 rounded-xl overflow-hidden"
                        >

                          <div className="px-3 py-2 bg-gray-50 border-b border-gray-100">

                            <p className="text-[10px] font-semibold text-[#172033] capitalize">
                              {module.replace(
                                /_/g,
                                " "
                              )}
                            </p>

                          </div>

                          <div className="p-3 grid grid-cols-1 sm:grid-cols-2 gap-2">

                            {permissions.map(
                              (
                                permission
                              ) => {

                                const checked =
                                  selectedPermissions.includes(
                                    permission
                                  );

                                return (

                                  <label
                                    key={
                                      permission
                                    }
                                    className={`flex items-center gap-2 rounded-lg border px-2.5 py-2 cursor-pointer transition ${
                                      checked
                                        ? "border-[#C87532] bg-orange-50"
                                        : "border-gray-200 hover:bg-gray-50"
                                    }`}
                                  >

                                    <input
                                      type="checkbox"
                                      checked={
                                        checked
                                      }
                                      onChange={() =>
                                        togglePermission(
                                          permission
                                        )
                                      }
                                      className="accent-[#C87532]"
                                    />

                                    <span className="text-[10px] text-gray-700">
                                      {getPermissionLabel(
                                        permission
                                      )}
                                    </span>

                                  </label>

                                );
                              }
                            )}

                          </div>

                        </div>

                      )
                    )}

                  </div>

                </>

              )}

            </div>

            <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-end gap-2 shrink-0">

              <button
                type="button"
                onClick={
                  closePermissionModal
                }
                className="h-9 px-4 rounded-lg border border-gray-200 text-[10px] font-medium text-gray-600 hover:bg-gray-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={
                  handleSavePermissions
                }
                disabled={
                  permissionsSaving ||
                  permissionsLoading
                }
                className="h-9 px-4 rounded-lg bg-[#C87532] hover:bg-[#B96928] disabled:opacity-50 text-white text-[10px] font-semibold flex items-center gap-1.5"
              >

                {permissionsSaving ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Save className="w-3.5 h-3.5" />
                )}

                Save Permissions

              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}

/* =====================================================
   SUMMARY CARD
===================================================== */

function SummaryCard({
  icon: Icon,
  label,
  value,
}) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm px-3 py-2.5">

      <div className="flex items-center gap-2">

        <div className="w-7 h-7 rounded-lg bg-[#18352A]/8 flex items-center justify-center shrink-0">

          <Icon className="w-3.5 h-3.5 text-[#18352A]" />

        </div>

        <div className="min-w-0">

          <p className="text-[8px] sm:text-[9px] text-gray-400 truncate">
            {label}
          </p>

          <p className="text-sm sm:text-base font-bold text-[#172033]">
            {value}
          </p>

        </div>

      </div>

    </div>
  );
}

/* =====================================================
   ACTION MENU (DYNAMIC CONTAINER BOUND RECT POSITIONING)
===================================================== */

function ActionMenu({
  user,
  openActionId,
  setOpenActionId,
  onEdit,
  onPermissions,
  onToggleStatus,
  onDelete,
  canEdit,
  canDelete,
  canViewPermissions,
  mobile = false,
}) {
  const isOpen = openActionId === user._id;
  const buttonRef = useRef(null);
  const [openUpward, setOpenUpward] = useState(false);

  const checkPosition = () => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      // Find nearest scrollable container, table, or outer wrapper
      const container =
        buttonRef.current.closest(
          ".overflow-x-auto, .overflow-y-auto, .overflow-auto, table, body"
        ) || document.body;
      const containerRect = container.getBoundingClientRect();

      const spaceBelowContainer = containerRect.bottom - rect.bottom;
      const spaceBelowWindow = window.innerHeight - rect.bottom;

      // If space below inside container OR window is less than 200px, open UPWARD
      if (spaceBelowContainer < 200 || spaceBelowWindow < 200) {
        setOpenUpward(true);
      } else {
        setOpenUpward(false);
      }
    }
  };

  useEffect(() => {
    if (isOpen) {
      checkPosition();
    }
  }, [isOpen]);

  const handleToggle = (e) => {
    e.stopPropagation();
    if (!isOpen) {
      checkPosition();
    }
    setOpenActionId(isOpen ? null : user._id);
  };

  return (
    <div className="relative inline-block text-left">

      <button
        ref={buttonRef}
        type="button"
        onClick={handleToggle}
        className={
          mobile
            ? "w-[28px] h-[28px] rounded-lg border border-gray-200 bg-white flex items-center justify-center text-gray-500 hover:bg-gray-50"
            : "w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-500"
        }
      >

        <MoreHorizontal className={mobile ? "w-[14px] h-[14px]" : "w-4 h-4"} />

      </button>

      {isOpen && (

        <>

          <div
            className="fixed inset-0 z-20"
            onClick={() => setOpenActionId(null)}
          />

          <div
            onClick={(e) => e.stopPropagation()}
            className={`absolute right-0 ${
              openUpward
                ? "bottom-full mb-1"
                : "top-full mt-1"
            } z-30 ${
              mobile ? "w-[174px] p-[5px]" : "w-44 overflow-hidden"
            } bg-white border border-gray-200 rounded-xl shadow-xl`}
          >

            <button
              type="button"
              disabled={!canEdit}
              onClick={() => {
                setOpenActionId(null);
                onEdit(user);
              }}
              className={
                mobile
                  ? "w-full h-[34px] flex items-center gap-2 px-2.5 rounded-lg text-[10px] text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
                  : "w-full flex items-center gap-2 px-3 py-2.5 text-left text-[10px] text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
              }
            >

              <Pencil className={mobile ? "w-[13px] h-[13px]" : "w-3.5 h-3.5"} />

              Edit User

            </button>

            <button
              type="button"
              disabled={!canViewPermissions}
              onClick={() => {
                setOpenActionId(null);
                onPermissions(user);
              }}
              className={
                mobile
                  ? "w-full h-[34px] flex items-center gap-2 px-2.5 rounded-lg text-[10px] text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
                  : "w-full flex items-center gap-2 px-3 py-2.5 text-left text-[10px] text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
              }
            >

              <ShieldCheck className={mobile ? "w-[13px] h-[13px]" : "w-3.5 h-3.5"} />

              Permissions

            </button>

            <button
              type="button"
              disabled={!canEdit}
              onClick={() => {
                setOpenActionId(null);
                onToggleStatus(user);
              }}
              className={
                mobile
                  ? "w-full h-[34px] flex items-center gap-2 px-2.5 rounded-lg text-[10px] text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
                  : "w-full flex items-center gap-2 px-3 py-2.5 text-left text-[10px] text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
              }
            >

              {user.status === "active" ? (
                <UserX className={mobile ? "w-[13px] h-[13px]" : "w-3.5 h-3.5"} />
              ) : (
                <UserRoundCheck className={mobile ? "w-[13px] h-[13px]" : "w-3.5 h-3.5"} />
              )}

              {user.status === "active" ? "Deactivate" : "Activate"}

            </button>

            <div className={mobile ? "my-[4px] border-t border-gray-100" : "border-t border-gray-100"} />

            <button
              type="button"
              disabled={!canDelete}
              onClick={() => {
                setOpenActionId(null);
                onDelete(user);
              }}
              className={
                mobile
                  ? "w-full h-[34px] flex items-center gap-2 px-2.5 rounded-lg text-[10px] text-red-600 hover:bg-red-50 disabled:opacity-40 disabled:cursor-not-allowed"
                  : "w-full flex items-center gap-2 px-3 py-2.5 text-left text-[10px] text-red-600 hover:bg-red-50 disabled:opacity-40 disabled:cursor-not-allowed"
              }
            >

              <Trash2 className={mobile ? "w-[13px] h-[13px]" : "w-3.5 h-3.5"} />

              Delete User

            </button>

          </div>

        </>

      )}

    </div>
  );
}