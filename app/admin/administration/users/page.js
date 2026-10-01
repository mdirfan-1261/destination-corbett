"use client";

import { useEffect, useMemo, useState } from "react";
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
  Mail,
  CalendarDays,
} from "lucide-react";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

/* =====================================================
   DEFAULT FORM
===================================================== */

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
   PAGE
===================================================== */

export default function UsersPage() {
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

  const [formData, setFormData] =
    useState(emptyForm);

  const [showPassword, setShowPassword] =
    useState(false);

  const [openActionId, setOpenActionId] =
    useState(null);

  /* =====================================================
     PERMISSION CHECK
  ===================================================== */

  const hasPermission = (permission) => {
    /*
      Super Admin backend par bhi unrestricted hai.
    */

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
        throw new Error(
          "Authentication required. Please login again."
        );
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

      let data;

      try {
        data = await response.json();
      } catch {
        throw new Error(
          "Invalid response received from users API."
        );
      }

      if (!response.ok) {
        throw new Error(
          data?.message ||
            "Failed to fetch users."
        );
      }

      if (
        !data?.success &&
        !Array.isArray(data?.users)
      ) {
        throw new Error(
          data?.message ||
            "Failed to fetch users."
        );
      }

      setUsers(
        Array.isArray(data.users)
          ? data.users
          : []
      );
    } catch (err) {
      console.error(
        "Fetch users error:",
        err
      );

      setError(
        err?.message ||
          "Failed to load users."
      );
    } finally {
      setLoading(false);
    }
  };

  /* =====================================================
     FETCH ROLES + CURRENT ROLE PERMISSIONS
  ===================================================== */

  const fetchRoles = async () => {
    try {
      setRolesLoading(true);

      const token =
        localStorage.getItem("adminToken");

      if (!token) {
        throw new Error(
          "Authentication required. Please login again."
        );
      }

      const roleFromToken =
        getCurrentRoleFromToken();

      setCurrentRole(roleFromToken);

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

      let data;

      try {
        data = await response.json();
      } catch {
        throw new Error(
          "Invalid response received from roles API."
        );
      }

      /*
        Agar current user ke paas roles.view
        permission nahi hai.
      */

      if (response.status === 403) {
        setRoles([]);
        setCurrentPermissions([]);
        return;
      }

      if (!response.ok) {
        throw new Error(
          data?.message ||
            "Failed to fetch roles."
        );
      }

      if (!data?.success) {
        throw new Error(
          data?.message ||
            "Failed to fetch roles."
        );
      }

      const fetchedRoles =
        Array.isArray(data.roles)
          ? data.roles
          : [];

      setRoles(fetchedRoles);

      /*
        IMPORTANT:
        Current logged-in user's permissions
        MongoDB Role document se aa rahi hain.
      */

      const currentRoleData =
        fetchedRoles.find(
          (role) =>
            role.id === roleFromToken
        );

      if (
        roleFromToken ===
        "super_admin"
      ) {
        setCurrentPermissions(
          Array.isArray(
            currentRoleData?.permissions
          )
            ? currentRoleData.permissions
            : []
        );
      } else {
        setCurrentPermissions(
          Array.isArray(
            currentRoleData?.permissions
          )
            ? currentRoleData.permissions
            : []
        );
      }

      /*
        Default role for Add User
      */

      if (fetchedRoles.length > 0) {
        const staffRole =
          fetchedRoles.find(
            (role) =>
              role.id === "staff"
          );

        setFormData((prev) => ({
          ...prev,
          role:
            prev.role ||
            staffRole?.id ||
            fetchedRoles[0].id,
        }));
      }

      console.log(
        "CURRENT RBAC:",
        {
          role: roleFromToken,
          permissions:
            currentRoleData?.permissions || [],
        }
      );
    } catch (err) {
      console.error(
        "Fetch roles error:",
        err
      );

      setRoles([]);
      setCurrentPermissions([]);
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
          "Invalid response received from groups API."
        );
      }

      console.log(
        "GROUP API RESPONSE:",
        data
      );

      if (!response.ok) {
        throw new Error(
          data?.message ||
            "Failed to fetch departments."
        );
      }

      if (!data?.success) {
        throw new Error(
          data?.message ||
            "Failed to fetch departments."
        );
      }

      const fetchedGroups =
        Array.isArray(data.groups)
          ? data.groups
          : [];

      setGroups(fetchedGroups);
    } catch (err) {
      console.error(
        "Fetch groups error:",
        err
      );

      setGroups([]);
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
  }, []);

  /* =====================================================
     ROLE LABEL
  ===================================================== */

  const getRoleLabel = (roleId) => {
    const role = roles.find(
      (item) =>
        item.id === roleId
    );

    if (role?.name) {
      return role.name;
    }

    if (!roleId) return "-";

    return roleId
      .split("_")
      .map(
        (word) =>
          word.charAt(0).toUpperCase() +
          word.slice(1)
      )
      .join(" ");
  };

  /* =====================================================
     GROUP LABEL
  ===================================================== */

  const getGroupLabel = (groupId) => {
    const group = groups.find(
      (item) =>
        item.id === groupId
    );

    return (
      group?.name ||
      groupId ||
      "-"
    );
  };

  /* =====================================================
     ROLE STYLE
  ===================================================== */

  const getRoleStyle = (role) => {
    if (role === "super_admin") {
      return {
        badge:
          "border-violet-200 bg-violet-50 text-violet-700",
        dot: "bg-violet-500",
      };
    }

    if (role === "admin") {
      return {
        badge:
          "border-blue-200 bg-blue-50 text-blue-700",
        dot: "bg-blue-500",
      };
    }

    if (role === "manager") {
      return {
        badge:
          "border-orange-200 bg-orange-50 text-orange-700",
        dot: "bg-orange-500",
      };
    }

    return {
      badge:
        "border-slate-200 bg-slate-50 text-slate-600",
      dot: "bg-slate-400",
    };
  };

  /* =====================================================
     FILTER USERS
  ===================================================== */

  const filteredUsers = useMemo(() => {
    const value =
      search.trim().toLowerCase();

    return users.filter((user) => {
      const matchesSearch =
        !value ||
        user.name
          ?.toLowerCase()
          .includes(value) ||
        user.email
          ?.toLowerCase()
          .includes(value) ||
        user.role
          ?.toLowerCase()
          .includes(value) ||
        user.group
          ?.toLowerCase()
          .includes(value);

      const matchesRole =
        roleFilter === "all" ||
        user.role === roleFilter;

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
        user.role ===
        "super_admin"
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

  const activeManagers =
    users.filter(
      (user) =>
        user.role === "manager" &&
        user.status !== "inactive"
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
    if (
      !hasPermission(
        "team.create"
      )
    ) {
      setError(
        "You do not have permission to create users."
      );

      return;
    }

    const defaultRole =
      roles.find(
        (role) =>
          role.id === "staff"
      ) || roles[0];

    setEditingUser(null);

    setFormData({
      ...emptyForm,
      role:
        defaultRole?.id || "",
      group: "",
    });

    setShowPassword(false);
    setError("");
    setSuccess("");
    setOpenActionId(null);
    setShowModal(true);
  };

  /* =====================================================
     EDIT USER
  ===================================================== */

  const handleEditUser = (user) => {
    if (
      !hasPermission(
        "team.update"
      )
    ) {
      setError(
        "You do not have permission to edit users."
      );

      return;
    }

    setEditingUser(user);

    setFormData({
      name:
        user.name || "",
      email:
        user.email || "",
      password: "",
      role:
        user.role || "",
      group:
        user.group || "",
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

  const handleChange = (e) => {
    const {
      name,
      value,
    } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /* =====================================================
     SAVE USER
  ===================================================== */

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const token =
        localStorage.getItem(
          "adminToken"
        );

      if (!token) {
        throw new Error(
          "Authentication required. Please login again."
        );
      }

      if (editingUser) {
        if (
          !hasPermission(
            "team.update"
          )
        ) {
          throw new Error(
            "You do not have permission to update users."
          );
        }
      } else {
        if (
          !hasPermission(
            "team.create"
          )
        ) {
          throw new Error(
            "You do not have permission to create users."
          );
        }
      }

      if (
        !formData.name.trim()
      ) {
        throw new Error(
          "Name is required."
        );
      }

      if (
        !formData.email.trim()
      ) {
        throw new Error(
          "Email is required."
        );
      }

      if (!formData.role) {
        throw new Error(
          "Please select a role."
        );
      }

      if (!formData.group) {
        throw new Error(
          "Please select a department."
        );
      }

      if (
        !editingUser &&
        !formData.password.trim()
      ) {
        throw new Error(
          "Password is required."
        );
      }

      const url =
        editingUser
          ? `${API_URL}/api/admin/users/${editingUser._id}`
          : `${API_URL}/api/admin/users`;

      const method =
        editingUser
          ? "PUT"
          : "POST";

      const body = {
        name:
          formData.name.trim(),

        email:
          formData.email.trim(),

        role:
          formData.role,

        group:
          formData.group || null,
      };

      if (
        !editingUser ||
        formData.password.trim()
      ) {
        body.password =
          formData.password;
      }

      const response =
        await fetch(
          url,
          {
            method,

            headers: {
              "Content-Type":
                "application/json",

              Authorization:
                `Bearer ${token}`,
            },

            body:
              JSON.stringify(body),
          }
        );

      let data;

      try {
        data =
          await response.json();
      } catch {
        throw new Error(
          "Invalid response received from server."
        );
      }

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

      setFormData({
        ...emptyForm,
        role:
          roles.find(
            (role) =>
              role.id === "staff"
          )?.id ||
          roles[0]?.id ||
          "",
        group: "",
      });

      setEditingUser(null);

      await fetchUsers();
    } catch (err) {
      console.error(
        "Save user error:",
        err
      );

      setError(
        err?.message ||
          "Failed to save user."
      );
    } finally {
      setSaving(false);
    }
  };

  /* =====================================================
     TOGGLE USER STATUS
  ===================================================== */

  const handleToggleStatus =
    async (user) => {
      if (
        !hasPermission(
          "team.update"
        )
      ) {
        setError(
          "You do not have permission to change user status."
        );

        return;
      }

      const newStatus =
        user.status ===
        "inactive"
          ? "active"
          : "inactive";

      try {
        setError("");
        setSuccess("");
        setOpenActionId(null);

        const token =
          localStorage.getItem(
            "adminToken"
          );

        if (!token) {
          throw new Error(
            "Authentication required. Please login again."
          );
        }

        const response =
          await fetch(
            `${API_URL}/api/admin/users/${user._id}`,
            {
              method: "PUT",

              headers: {
                "Content-Type":
                  "application/json",

                Authorization:
                  `Bearer ${token}`,
              },

              body: JSON.stringify({
                status:
                  newStatus,
              }),
            }
          );

        let data;

        try {
          data =
            await response.json();
        } catch {
          throw new Error(
            "Invalid response received from server."
          );
        }

        if (!response.ok) {
          throw new Error(
            data?.message ||
              "Failed to update user status."
          );
        }

        setSuccess(
          newStatus ===
            "inactive"
            ? "User deactivated successfully."
            : "User activated successfully."
        );

        await fetchUsers();
      } catch (err) {
        console.error(
          "Toggle user status error:",
          err
        );

        setError(
          err?.message ||
            "Failed to update user status."
        );
      }
    };

  /* =====================================================
     DELETE USER
  ===================================================== */

  const handleDelete = async (
    user
  ) => {
    /*
      IMPORTANT:
      Frontend permission check.
      Actual security backend middleware
      se enforce hoti hai.
    */

    if (
      !hasPermission(
        "team.delete"
      )
    ) {
      setError(
        "You do not have permission to delete users."
      );

      return;
    }

    const confirmed =
      window.confirm(
        `Are you sure you want to delete ${user.name}?`
      );

    if (!confirmed) {
      return;
    }

    try {
      setError("");
      setSuccess("");
      setOpenActionId(null);

      const token =
        localStorage.getItem(
          "adminToken"
        );

      if (!token) {
        throw new Error(
          "Authentication required. Please login again."
        );
      }

      const response =
        await fetch(
          `${API_URL}/api/admin/users/${user._id}`,
          {
            method: "DELETE",

            headers: {
              Authorization:
                `Bearer ${token}`,

              "Content-Type":
                "application/json",
            },
          }
        );

      let data;

      try {
        data =
          await response.json();
      } catch {
        throw new Error(
          "Invalid response received from server."
        );
      }

      /*
        Backend 403 yahin catch hoga.
      */

      if (!response.ok) {
        throw new Error(
          data?.message ||
            "Failed to delete user."
        );
      }

      setSuccess(
        "User deleted successfully."
      );

      await fetchUsers();
    } catch (err) {
      console.error(
        "Delete user error:",
        err
      );

      setError(
        err?.message ||
          "Failed to delete user."
      );
    }
  };

  /* =====================================================
     CLOSE MODAL
  ===================================================== */

  const closeModal = () => {
    if (saving) return;

    setShowModal(false);
    setEditingUser(null);
    setShowPassword(false);

    setFormData({
      ...emptyForm,

      role:
        roles.find(
          (role) =>
            role.id === "staff"
        )?.id ||
        roles[0]?.id ||
        "",

      group: "",
    });
  };

  /* =====================================================
     CURRENT USER PERMISSIONS
  ===================================================== */

  const canCreateUser =
    hasPermission(
      "team.create"
    );

  const canEditUser =
    hasPermission(
      "team.update"
    );

  const canDeleteUser =
    hasPermission(
      "team.delete"
    );

  /* =====================================================
     UI
  ===================================================== */

  return (
    <div
      className="min-h-screen bg-[#F7F5F0] p-3 sm:p-4 lg:p-5 xl:p-6"
      onClick={() =>
        setOpenActionId(null)
      }
    >
      <div className="mx-auto w-full max-w-[1600px]">

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="mb-4 flex flex-col gap-3 sm:mb-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="min-w-0">
            <div className="mb-1 flex items-center gap-2">
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#C87532]" />

              <span className="text-[9px] font-bold uppercase tracking-[0.16em] text-[#C87532] sm:text-[10px]">
                Administration
              </span>
            </div>

            <h1 className="text-xl font-bold tracking-tight text-[#172033] sm:text-2xl">
              User Management
            </h1>

            <p className="mt-1 max-w-xl text-xs leading-5 text-slate-500 sm:text-[13px]">
              Manage admin users, roles and
              access across your Destination
              Corbett workspace.
            </p>
          </div>

          <div className="flex w-full items-center gap-2 sm:w-auto">
            {currentRole && (
              <div className="hidden items-center gap-2 rounded-lg border border-[#E5E0D8] bg-white px-2.5 py-2 shadow-sm sm:flex">
                <div className="flex h-7 w-7 items-center justify-center rounded-md bg-[#EDF3EE]">
                  <ShieldCheck
                    size={14}
                    className="text-[#18352A]"
                  />
                </div>

                <div>
                  <p className="text-[9px] font-medium uppercase tracking-wide text-slate-400">
                    Signed in as
                  </p>

                  <p className="text-[11px] font-bold text-[#172033]">
                    {getRoleLabel(
                      currentRole
                    )}
                  </p>
                </div>
              </div>
            )}

            {canCreateUser && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleAddUser();
                }}
                disabled={
                  rolesLoading ||
                  roles.length === 0
                }
                className="inline-flex h-9 flex-1 items-center justify-center gap-1.5 rounded-lg bg-[#C87532] px-3 text-xs font-semibold text-white shadow-[0_5px_15px_rgba(200,117,50,0.18)] transition hover:bg-[#B76527] disabled:cursor-not-allowed disabled:opacity-50 sm:flex-none"
              >
                <Plus size={15} />
                Add User
              </button>
            )}
          </div>
        </div>

        {/* =================================================
            ALERTS
        ================================================= */}

        {error && (
          <div
            className="mb-3 flex items-start gap-2.5 rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-xs text-red-700 shadow-sm"
            onClick={(e) =>
              e.stopPropagation()
            }
          >
            <AlertCircle
              size={16}
              className="mt-0.5 shrink-0"
            />

            <span className="leading-5">
              {error}
            </span>

            <button
              onClick={() =>
                setError("")
              }
              className="ml-auto shrink-0 rounded-md p-0.5 hover:bg-red-100"
            >
              <X size={14} />
            </button>
          </div>
        )}

        {success && (
          <div
            className="mb-3 flex items-center gap-2.5 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2.5 text-xs font-medium text-emerald-700 shadow-sm"
            onClick={(e) =>
              e.stopPropagation()
            }
          >
            <UserRoundCheck size={16} />

            <span>{success}</span>

            <button
              onClick={() =>
                setSuccess("")
              }
              className="ml-auto rounded-md p-0.5 hover:bg-emerald-100"
            >
              <X size={14} />
            </button>
          </div>
        )}

        {/* =================================================
            SUMMARY CARDS
        ================================================= */}

        <div className="mb-4 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
          <SummaryCard
            icon={Users}
            label="Total Users"
            value={totalUsers}
            description="All admin accounts"
            iconClass="bg-[#EEF3F0] text-[#18352A]"
          />

          <SummaryCard
            icon={ShieldCheck}
            label="Super Admins"
            value={superAdmins}
            description="Full system access"
            iconClass="bg-violet-50 text-violet-600"
          />

          <SummaryCard
            icon={UserCog}
            label="Admins"
            value={admins}
            description="Management access"
            iconClass="bg-blue-50 text-blue-600"
          />

          <SummaryCard
            icon={UserCog}
            label="Managers"
            value={managers}
            description="Management access"
            iconClass="bg-orange-50 text-orange-600"
          />

          <SummaryCard
            icon={ShieldCheck}
            label="Department Managers"
            value={activeManagers}
            description="Active department managers"
            iconClass="bg-amber-50 text-amber-600"
          />

          <SummaryCard
            icon={UserRoundCheck}
            label="Staff"
            value={staff}
            description="Operational access"
            iconClass="bg-emerald-50 text-emerald-600"
          />
        </div>

        {/* =================================================
            MAIN CARD
        ================================================= */}

        <div
          className="overflow-hidden rounded-xl border border-[#E5E0D8] bg-white shadow-[0_5px_24px_rgba(23,32,51,0.04)] sm:rounded-2xl"
          onClick={(e) =>
            e.stopPropagation()
          }
        >
          {/* TOOLBAR */}

          <div className="border-b border-[#EEEAE3] px-3 py-3 sm:px-4 sm:py-3.5">
            <div className="flex flex-col gap-2.5 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 className="text-sm font-bold text-[#172033]">
                  Team Members
                </h2>

                <p className="mt-0.5 text-[10px] text-slate-400 sm:text-[11px]">
                  {filteredUsers.length} of{" "}
                  {users.length} users displayed
                </p>
              </div>

              <div className="flex w-full flex-col gap-2 sm:flex-row lg:w-auto">
                {/* SEARCH */}

                <div className="relative min-w-0 flex-1 sm:w-[250px] sm:flex-none">
                  <Search
                    size={15}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    type="text"
                    placeholder="Search name, email..."
                    value={search}
                    onChange={(e) =>
                      setSearch(
                        e.target.value
                      )
                    }
                    className="h-9 w-full rounded-lg border border-[#E4E0D8] bg-[#FBFAF8] pl-9 pr-3 text-xs text-[#172033] outline-none transition placeholder:text-slate-400 focus:border-[#C87532] focus:bg-white focus:ring-2 focus:ring-[#C87532]/10"
                  />
                </div>

                {/* ROLE FILTER */}

                <div className="relative sm:w-[145px]">
                  <select
                    value={roleFilter}
                    onChange={(e) =>
                      setRoleFilter(
                        e.target.value
                      )
                    }
                    className="h-9 w-full appearance-none rounded-lg border border-[#E4E0D8] bg-[#FBFAF8] pl-3 pr-8 text-xs font-medium text-slate-600 outline-none transition focus:border-[#C87532] focus:bg-white focus:ring-2 focus:ring-[#C87532]/10"
                  >
                    <option value="all">
                      All roles
                    </option>

                    {roles.map(
                      (role) => (
                        <option
                          key={role.id}
                          value={role.id}
                        >
                          {role.name ||
                            getRoleLabel(
                              role.id
                            )}
                        </option>
                      )
                    )}
                  </select>

                  <ChevronDown
                    size={14}
                    className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* TABLE */}

          {loading ? (
            <div className="flex min-h-[260px] items-center justify-center sm:min-h-[300px]">
              <div className="flex flex-col items-center">
                <div className="mb-2.5 flex h-9 w-9 items-center justify-center rounded-lg bg-[#F3F6F4]">
                  <Loader2
                    size={18}
                    className="animate-spin text-[#18352A]"
                  />
                </div>

                <p className="text-xs font-medium text-slate-600">
                  Loading users...
                </p>

                <p className="mt-0.5 text-[10px] text-slate-400">
                  Please wait a moment
                </p>
              </div>
            </div>
          ) : filteredUsers.length ===
            0 ? (
            <div className="flex min-h-[260px] flex-col items-center justify-center px-4 text-center sm:min-h-[300px]">
              <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-[#F3F5F3]">
                <UserX
                  size={21}
                  className="text-[#7B8A7E]"
                />
              </div>

              <h3 className="text-sm font-bold text-[#172033]">
                No users found
              </h3>

              <p className="mt-1 max-w-sm text-xs text-slate-400">
                {search ||
                roleFilter !== "all"
                  ? "Try changing your search or role filter."
                  : "No admin users have been created yet."}
              </p>

              {canCreateUser &&
                !search &&
                roleFilter === "all" && (
                  <button
                    onClick={
                      handleAddUser
                    }
                    className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-[#18352A] px-3.5 py-2 text-xs font-semibold text-white hover:bg-[#10291F]"
                  >
                    <Plus size={14} />
                    Create first user
                  </button>
                )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px]">
                <thead>
                  <tr className="border-b border-[#EEEAE3] bg-[#FCFBF9]">
                    <th className="px-4 py-2.5 text-left text-[9px] font-bold uppercase tracking-[0.11em] text-slate-400 sm:px-4">
                      User
                    </th>

                    <th className="px-3 py-2.5 text-left text-[9px] font-bold uppercase tracking-[0.11em] text-slate-400">
                      Role
                    </th>

                    <th className="px-3 py-2.5 text-left text-[9px] font-bold uppercase tracking-[0.11em] text-slate-400">
                      Department
                    </th>

                    <th className="px-3 py-2.5 text-left text-[9px] font-bold uppercase tracking-[0.11em] text-slate-400">
                      Status
                    </th>

                    <th className="px-3 py-2.5 text-left text-[9px] font-bold uppercase tracking-[0.11em] text-slate-400">
                      Created
                    </th>

                    <th className="px-4 py-2.5 text-right text-[9px] font-bold uppercase tracking-[0.11em] text-slate-400">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredUsers.map(
                    (user) => {
                      const roleStyle =
                        getRoleStyle(
                          user.role
                        );

                      return (
                        <tr
                          key={user._id}
                          className="group border-b border-[#F0ECE6] last:border-0 hover:bg-[#FCFBF9]"
                        >
                          {/* USER */}

                          <td className="px-4 py-2.5">
                            <div className="flex items-center gap-2.5">
                              <div className="relative shrink-0">
                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#18352A] text-xs font-bold text-white shadow-sm">
                                  {user.name
                                    ?.charAt(
                                      0
                                    )
                                    ?.toUpperCase() ||
                                    "U"}
                                </div>

                                <span
                                  className={`absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-white ${
                                    user.status ===
                                    "inactive"
                                      ? "bg-slate-400"
                                      : "bg-emerald-500"
                                  }`}
                                />
                              </div>

                              <div className="min-w-0">
                                <p className="max-w-[220px] truncate text-xs font-semibold text-[#172033]">
                                  {user.name ||
                                    "Unnamed User"}
                                </p>

                                <div className="mt-0.5 flex items-center gap-1">
                                  <Mail
                                    size={10}
                                    className="shrink-0 text-slate-400"
                                  />

                                  <p className="max-w-[230px] truncate text-[10px] text-slate-400">
                                    {user.email}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* ROLE */}

                          <td className="px-3 py-2.5">
                            <span
                              className={`inline-flex items-center gap-1.5 rounded-md border px-2 py-1 text-[10px] font-bold ${roleStyle.badge}`}
                            >
                              <span
                                className={`h-1.5 w-1.5 rounded-full ${roleStyle.dot}`}
                              />

                              {getRoleLabel(
                                user.role
                              )}
                            </span>
                          </td>

                          {/* DEPARTMENT */}

                          <td className="px-3 py-2.5">
                            {user.group ? (
                              <span className="inline-flex max-w-[150px] truncate rounded-md border border-[#E5E0D8] bg-[#FBFAF8] px-2 py-1 text-[10px] font-semibold text-slate-600">
                                {getGroupLabel(
                                  user.group
                                )}
                              </span>
                            ) : (
                              <span className="text-[11px] text-slate-400">
                                —
                              </span>
                            )}
                          </td>

                          {/* STATUS */}

                          <td className="px-3 py-2.5">
                            {user.status ===
                            "inactive" ? (
                              <span className="inline-flex items-center gap-1.5 text-[10px] font-medium text-slate-500">
                                <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
                                Inactive
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1.5 text-[10px] font-medium text-emerald-600">
                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                                Active
                              </span>
                            )}
                          </td>

                          {/* CREATED */}

                          <td className="px-3 py-2.5">
                            <div className="flex items-center gap-1.5 whitespace-nowrap text-[10px] text-slate-500">
                              <CalendarDays
                                size={12}
                                className="text-slate-400"
                              />

                              {user.createdAt
                                ? new Date(
                                    user.createdAt
                                  ).toLocaleDateString(
                                    "en-IN",
                                    {
                                      day: "2-digit",
                                      month:
                                        "short",
                                      year: "numeric",
                                    }
                                  )
                                : "-"}
                            </div>
                          </td>

                          {/* ACTIONS */}

                          <td className="relative px-4 py-2.5">
                            <div className="flex justify-end">
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();

                                  setOpenActionId(
                                    openActionId ===
                                      user._id
                                      ? null
                                      : user._id
                                  );
                                }}
                                className="flex h-7 w-7 items-center justify-center rounded-md border border-transparent text-slate-400 transition hover:border-[#E5E0D8] hover:bg-white hover:text-[#172033]"
                              >
                                <MoreHorizontal
                                  size={16}
                                />
                              </button>
                            </div>

                            {openActionId ===
                              user._id && (
                              <div
                                onClick={(e) =>
                                  e.stopPropagation()
                                }
                                className="absolute right-4 top-10 z-30 w-40 overflow-hidden rounded-lg border border-[#E5E0D8] bg-white p-1 shadow-[0_12px_35px_rgba(23,32,51,0.14)]"
                              >
                                {canEditUser && (
                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleEditUser(
                                        user
                                      )
                                    }
                                    className="flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-left text-[11px] font-medium text-slate-600 hover:bg-[#F7F5F0] hover:text-[#172033]"
                                  >
                                    <Pencil
                                      size={14}
                                    />
                                    Edit user
                                  </button>
                                )}

                                {canEditUser && (
                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleToggleStatus(
                                        user
                                      )
                                    }
                                    className={`flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-left text-[11px] font-medium ${
                                      user.status ===
                                      "inactive"
                                        ? "text-emerald-600 hover:bg-emerald-50"
                                        : "text-amber-600 hover:bg-amber-50"
                                    }`}
                                  >
                                    <UserRoundCheck
                                      size={14}
                                    />

                                    {user.status ===
                                    "inactive"
                                      ? "Activate user"
                                      : "Deactivate user"}
                                  </button>
                                )}

                                {canDeleteUser && (
                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleDelete(
                                        user
                                      )
                                    }
                                    className="flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-left text-[11px] font-medium text-red-600 hover:bg-red-50"
                                  >
                                    <Trash2
                                      size={14}
                                    />
                                    Delete user
                                  </button>
                                )}

                                {!canEditUser &&
                                  !canDeleteUser && (
                                    <div className="px-2.5 py-2 text-[11px] text-slate-400">
                                      No actions
                                      available
                                    </div>
                                  )}
                              </div>
                            )}
                          </td>
                        </tr>
                      );
                    }
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* FOOTER */}

          {!loading &&
            filteredUsers.length > 0 && (
              <div className="border-t border-[#EEEAE3] bg-[#FCFBF9] px-4 py-2.5">
                <p className="text-[10px] text-slate-400 sm:text-[11px]">
                  Showing{" "}
                  <span className="font-semibold text-slate-600">
                    {filteredUsers.length}
                  </span>{" "}
                  of{" "}
                  <span className="font-semibold text-slate-600">
                    {users.length}
                  </span>{" "}
                  users
                </p>
              </div>
            )}
        </div>
      </div>

      {/* =================================================
          ADD / EDIT MODAL
      ================================================= */}

      {showModal && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-[#101713]/50 p-3 backdrop-blur-[3px] sm:p-4"
          onClick={closeModal}
        >
          <div
            className="my-auto max-h-[94vh] w-full max-w-[500px] overflow-y-auto rounded-xl border border-white/70 bg-white shadow-[0_25px_80px_rgba(0,0,0,0.20)] sm:rounded-2xl"
            onClick={(e) =>
              e.stopPropagation()
            }
          >
            {/* MODAL HEADER */}

            <div className="border-b border-[#EEEAE3] bg-[#FCFBF9] px-4 py-3.5 sm:px-5 sm:py-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#18352A] text-white shadow-sm">
                    {editingUser ? (
                      <Pencil size={15} />
                    ) : (
                      <Users size={15} />
                    )}
                  </div>

                  <div className="min-w-0">
                    <h2 className="text-sm font-bold text-[#172033]">
                      {editingUser
                        ? "Edit User"
                        : "Add User"}
                    </h2>

                    <p className="mt-0.5 text-[10px] leading-4 text-slate-400 sm:text-[11px]">
                      {editingUser
                        ? "Update account details and access role."
                        : "Create a new admin account."}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={closeModal}
                  disabled={saving}
                  className="shrink-0 rounded-md p-1.5 text-slate-400 transition hover:bg-white hover:text-slate-700 disabled:opacity-50"
                >
                  <X size={17} />
                </button>
              </div>
            </div>

            {/* FORM */}

            <form
              onSubmit={handleSubmit}
              className="space-y-3.5 p-4 sm:space-y-4 sm:p-5"
            >
              {/* NAME */}

              <div>
                <label className="mb-1 block text-[10px] font-bold uppercase tracking-wide text-slate-500">
                  Full Name
                </label>

                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="e.g. Rahul Sharma"
                  className="h-9 w-full rounded-lg border border-[#E2DED6] bg-white px-3 text-xs text-[#172033] outline-none transition placeholder:text-slate-300 focus:border-[#C87532] focus:ring-2 focus:ring-[#C87532]/10"
                />
              </div>

              {/* EMAIL */}

              <div>
                <label className="mb-1 block text-[10px] font-bold uppercase tracking-wide text-slate-500">
                  Email Address
                </label>

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="name@company.com"
                  className="h-9 w-full rounded-lg border border-[#E2DED6] bg-white px-3 text-xs text-[#172033] outline-none transition placeholder:text-slate-300 focus:border-[#C87532] focus:ring-2 focus:ring-[#C87532]/10"
                />
              </div>

              {/* PASSWORD */}

              <div>
                <label className="mb-1 block text-[10px] font-bold uppercase tracking-wide text-slate-500">
                  Password
                </label>

                <div className="relative">
                  <input
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    name="password"
                    value={
                      formData.password
                    }
                    onChange={
                      handleChange
                    }
                    required={
                      !editingUser
                    }
                    placeholder={
                      editingUser
                        ? "Leave blank to keep current password"
                        : "Enter a secure password"
                    }
                    className="h-9 w-full rounded-lg border border-[#E2DED6] bg-white px-3 pr-10 text-xs text-[#172033] outline-none transition placeholder:text-slate-300 focus:border-[#C87532] focus:ring-2 focus:ring-[#C87532]/10"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(
                        (prev) =>
                          !prev
                      )
                    }
                    className="absolute right-1.5 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-md text-slate-400 hover:bg-slate-50 hover:text-slate-700"
                  >
                    {showPassword ? (
                      <EyeOff
                        size={15}
                      />
                    ) : (
                      <Eye
                        size={15}
                      />
                    )}
                  </button>
                </div>

                {editingUser && (
                  <p className="mt-1 text-[10px] text-slate-400">
                    Leave blank if you do not
                    want to change the password.
                  </p>
                )}
              </div>

              {/* ROLE */}

              <div>
                <label className="mb-1 block text-[10px] font-bold uppercase tracking-wide text-slate-500">
                  Access Role
                </label>

                <div className="relative">
                  <select
                    name="role"
                    value={
                      formData.role
                    }
                    onChange={
                      handleChange
                    }
                    required
                    disabled={
                      rolesLoading ||
                      roles.length === 0
                    }
                    className="h-9 w-full appearance-none rounded-lg border border-[#E2DED6] bg-white px-3 pr-9 text-xs font-medium text-[#172033] outline-none transition focus:border-[#C87532] focus:ring-2 focus:ring-[#C87532]/10 disabled:bg-slate-50 disabled:text-slate-400"
                  >
                    {rolesLoading ? (
                      <option value="">
                        Loading roles...
                      </option>
                    ) : roles.length ===
                      0 ? (
                      <option value="">
                        No roles available
                      </option>
                    ) : (
                      roles.map(
                        (role) => (
                          <option
                            key={
                              role.id
                            }
                            value={
                              role.id
                            }
                          >
                            {role.name ||
                              getRoleLabel(
                                role.id
                              )}
                          </option>
                        )
                      )
                    )}
                  </select>

                  <ChevronDown
                    size={14}
                    className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                </div>

                <p className="mt-1 text-[10px] leading-4 text-slate-400">
                  Role determines what this
                  user can access in the admin
                  panel.
                </p>
              </div>

              {/* DEPARTMENT */}

              <div>
                <label className="mb-1 block text-[10px] font-bold uppercase tracking-wide text-slate-500">
                  Department / Group
                </label>

                <div className="relative">
                  <select
                    name="group"
                    value={
                      formData.group
                    }
                    onChange={
                      handleChange
                    }
                    required
                    disabled={
                      groups.length === 0
                    }
                    className="h-9 w-full appearance-none rounded-lg border border-[#E2DED6] bg-white px-3 pr-9 text-xs font-medium text-[#172033] outline-none transition focus:border-[#C87532] focus:ring-2 focus:ring-[#C87532]/10 disabled:bg-slate-50 disabled:text-slate-400"
                  >
                    <option value="">
                      {groups.length ===
                      0
                        ? "Loading departments..."
                        : "Select department"}
                    </option>

                    {groups.map(
                      (group) => (
                        <option
                          key={group.id}
                          value={group.id}
                        >
                          {group.name}
                        </option>
                      )
                    )}
                  </select>

                  <ChevronDown
                    size={14}
                    className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                </div>

                <p className="mt-1 text-[10px] leading-4 text-slate-400">
                  Select the department this
                  user belongs to.
                </p>
              </div>

              {/* BUTTONS */}

              <div className="flex flex-col-reverse gap-2 border-t border-[#EEEAE3] pt-3.5 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={saving}
                  className="h-9 rounded-lg border border-[#DEDAD2] px-4 text-xs font-semibold text-slate-600 transition hover:bg-[#F7F5F0] disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={
                    saving ||
                    rolesLoading ||
                    roles.length === 0 ||
                    groups.length === 0
                  }
                  className="inline-flex h-9 items-center justify-center gap-2 rounded-lg bg-[#18352A] px-4 text-xs font-semibold text-white shadow-sm transition hover:bg-[#10291F] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving && (
                    <Loader2
                      size={14}
                      className="animate-spin"
                    />
                  )}

                  {editingUser
                    ? "Save Changes"
                    : "Create User"}
                </button>
              </div>
            </form>
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
  description,
  iconClass,
}) {
  return (
    <div className="rounded-xl border border-[#E5E0D8] bg-white p-3 shadow-[0_4px_16px_rgba(23,32,51,0.03)] transition hover:-translate-y-0.5 hover:shadow-[0_6px_22px_rgba(23,32,51,0.055)] sm:p-3.5">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="truncate text-[10px] font-medium text-slate-400 sm:text-[11px]">
            {label}
          </p>

          <p className="mt-1 text-xl font-bold tracking-tight text-[#172033] sm:text-[22px]">
            {value}
          </p>

          <p className="mt-0.5 truncate text-[9px] text-slate-400 sm:text-[10px]">
            {description}
          </p>
        </div>

        <div
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg sm:h-9 sm:w-9 ${iconClass}`}
        >
          <Icon size={16} />
        </div>
      </div>
    </div>
  );
}