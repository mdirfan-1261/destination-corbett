"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ShieldCheck,
  Users,
  ChevronDown,
  ChevronUp,
  Check,
  Lock,
  Loader2,
  AlertCircle,
  Save,
  UserRound,
  Building2,
  X,
} from "lucide-react";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const ROLE_ORDER = ["admin", "manager", "staff"];

const ROLE_LABELS = {
  admin: "Admin",
  manager: "Manager",
  staff: "Staff",
};

const ROLE_COLORS = {
  admin: "bg-orange-50 text-orange-700 border-orange-200",
  manager: "bg-blue-50 text-blue-700 border-blue-200",
  staff: "bg-green-50 text-green-700 border-green-200",
};

const ROLE_DESCRIPTIONS = {
  admin: "Department administrator",
  manager: "Team manager",
  staff: "Team member",
};

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

const formatPermission = (permission) => {
  return permission
    .split(".")
    .map(
      (word) =>
        word.charAt(0).toUpperCase() + word.slice(1)
    )
    .join(" ");
};

export default function RolesPermissionsPage() {
  const [groups, setGroups] = useState([]);
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [availablePermissions, setAvailablePermissions] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [openGroups, setOpenGroups] = useState({});
  const [openRoles, setOpenRoles] = useState({});

  const [selectedUser, setSelectedUser] = useState(null);
  const [userPermissions, setUserPermissions] = useState([]);
  const [permissionsLoading, setPermissionsLoading] = useState(false);
  const [savingPermissions, setSavingPermissions] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");

  const getToken = () => {
    if (typeof window === "undefined") return "";

    return (
      localStorage.getItem("adminToken") ||
      sessionStorage.getItem("adminToken") ||
      ""
    );
  };

  const authHeaders = () => ({
    Authorization: `Bearer ${getToken()}`,
    "Content-Type": "application/json",
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");

      const [groupsResponse, usersResponse, rolesResponse] =
        await Promise.all([
          fetch(`${API_URL}/api/admin/groups`, {
            headers: authHeaders(),
          }),
          fetch(`${API_URL}/api/admin/users`, {
            headers: authHeaders(),
          }),
          fetch(`${API_URL}/api/admin/roles`, {
            headers: authHeaders(),
          }),
        ]);

      const groupsData = await groupsResponse.json();
      const usersData = await usersResponse.json();
      const rolesData = await rolesResponse.json();

      if (!groupsResponse.ok) {
        throw new Error(
          groupsData.message || "Failed to load departments."
        );
      }

      if (!usersResponse.ok) {
        throw new Error(
          usersData.message || "Failed to load users."
        );
      }

      if (!rolesResponse.ok) {
        throw new Error(
          rolesData.message || "Failed to load permissions."
        );
      }

      setGroups(
        Array.isArray(groupsData.groups)
          ? groupsData.groups
          : []
      );

      setUsers(
        Array.isArray(usersData.users)
          ? usersData.users
          : []
      );

      setRoles(
        Array.isArray(rolesData.roles)
          ? rolesData.roles
          : []
      );

      setAvailablePermissions(
        Array.isArray(rolesData.availablePermissions)
          ? rolesData.availablePermissions
          : []
      );
    } catch (err) {
      console.error("Role & Permissions load error:", err);
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const groupedData = useMemo(() => {
    return groups.map((group) => {
      const groupUsers = users.filter(
        (user) =>
          String(user.group || "").toLowerCase() ===
          String(group.groupId || "").toLowerCase()
      );

      return {
        ...group,
        users: groupUsers,
      };
    });
  }, [groups, users]);

  const activeGroups = groups.filter(
    (group) => group.status === "active"
  ).length;

  const inactiveGroups = groups.length - activeGroups;

  const getRoleUsers = (groupUsers, role) => {
    return groupUsers.filter(
      (user) =>
        String(user.role || "").toLowerCase() === role
    );
  };

  const getRolePermissionCount = (role) => {
    const roleData = roles.find(
      (item) =>
        String(item.roleId || "").toLowerCase() === role
    );

    return Array.isArray(roleData?.permissions)
      ? roleData.permissions.length
      : 0;
  };

  const toggleGroup = (groupId) => {
    setOpenGroups((prev) => ({
      ...prev,
      [groupId]: !prev[groupId],
    }));
  };

  const toggleRole = (groupId, role) => {
    const key = `${groupId}-${role}`;

    setOpenRoles((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const openUserPermissions = async (user) => {
  try {
    setSelectedUser(user);
    setPermissionsLoading(true);
    setSaveMessage("");

    const response = await fetch(
      `${API_URL}/api/admin/users/${user._id}/permissions`,
      {
        headers: authHeaders(),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message || "Failed to load user permissions."
      );
    }

    /*
      Backend already tells us which permissions
      the logged-in admin is allowed to delegate.

      Super Admin:
      -> all permissions

      Admin / Manager:
      -> only their own current permissions
    */
    const allowedPermissions = Array.isArray(
      data.availablePermissions
    )
      ? data.availablePermissions
      : [];

    const targetPermissions = Array.isArray(
      data.permissions
    )
      ? data.permissions
      : [];

    /*
      Important:
      Target user's old permissions are filtered against
      the current admin's permissions.

      Example:
      Manager does NOT have enquiries.update
      Staff has enquiries.update from old data

      enquiries.update will NOT appear/select.
    */
    const filteredPermissions =
      targetPermissions.filter((permission) =>
        allowedPermissions.includes(permission)
      );

    setAvailablePermissions(allowedPermissions);
    setUserPermissions(filteredPermissions);
  } catch (err) {
    console.error("User permissions error:", err);

    setSaveMessage(
      err.message || "Failed to load permissions."
    );
  } finally {
    setPermissionsLoading(false);
  }
};

  const togglePermission = (permission) => {
  // Never allow a permission outside the current
  // admin's delegation scope.
  if (!availablePermissions.includes(permission)) {
    return;
  }

  setUserPermissions((current) =>
    current.includes(permission)
      ? current.filter(
          (item) => item !== permission
        )
      : [...current, permission]
  );

  setSaveMessage("");
};

  const saveUserPermissions = async () => {
  if (!selectedUser) return;

  try {
    setSavingPermissions(true);
    setSaveMessage("");

    /*
      Final safety check before sending to backend.

      Even if somehow UI state contains an old/disallowed
      permission, it will NOT be sent.
    */
    const allowedPermissions = new Set(
      availablePermissions
    );

    const permissionsToSave =
      userPermissions.filter((permission) =>
        allowedPermissions.has(permission)
      );

    const response = await fetch(
      `${API_URL}/api/admin/users/${selectedUser._id}/permissions`,
      {
        method: "PUT",
        headers: authHeaders(),
        body: JSON.stringify({
          permissions: permissionsToSave,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message ||
          "Failed to save permissions."
      );
    }

    setSaveMessage(
      "Permissions updated successfully."
    );

    setUserPermissions(permissionsToSave);

    setUsers((currentUsers) =>
      currentUsers.map((user) =>
        user._id === selectedUser._id
          ? {
              ...user,
              permissions: permissionsToSave,
            }
          : user
      )
    );

    setSelectedUser((current) =>
      current
        ? {
            ...current,
            permissions: permissionsToSave,
          }
        : current
    );
  } catch (err) {
    console.error(
      "Save permissions error:",
      err
    );

    setSaveMessage(
      err.message ||
        "Failed to save permissions."
    );
  } finally {
    setSavingPermissions(false);
  }
};

  const closePermissions = () => {
    setSelectedUser(null);
    setUserPermissions([]);
    setSaveMessage("");
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex items-center gap-2 text-gray-500 text-sm">
          <Loader2 className="w-5 h-5 animate-spin" />
          Loading roles & permissions...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-3 sm:p-4 lg:p-6">
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />

          <div>
            <h3 className="font-semibold text-red-800 text-sm">
              Unable to load roles & permissions
            </h3>

            <p className="text-xs text-red-700 mt-1">
              {error}
            </p>

            <button
              onClick={loadData}
              className="mt-3 px-4 py-2 rounded-lg bg-[#C87532] hover:bg-[#B96928] text-white text-xs font-medium"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="w-full min-w-0 px-2 sm:px-4 lg:px-6 py-4 sm:py-5 lg:py-6">

        {/* HEADER */}

        <div className="mb-5">
          <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#18352A] flex items-center justify-center shadow-sm">
                <ShieldCheck className="w-5 h-5 text-white" />
              </div>

              <div>
                <h1 className="text-xl lg:text-2xl font-bold text-[#172033]">
                  Role & Permissions
                </h1>

                <p className="text-xs text-gray-500 mt-0.5">
                  Manage roles and permissions by department.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 w-full xl:w-auto">

              <div className="bg-white border border-gray-200 rounded-xl px-4 py-2.5 shadow-sm">
                <p className="text-[10px] text-gray-500">
                  Departments
                </p>
                <p className="text-lg font-bold text-[#172033]">
                  {groups.length}
                </p>
              </div>

              <div className="bg-white border border-gray-200 rounded-xl px-4 py-2.5 shadow-sm">
                <p className="text-[10px] text-gray-500">
                  Users
                </p>
                <p className="text-lg font-bold text-[#172033]">
                  {users.length}
                </p>
              </div>

              <div className="bg-green-50 border border-green-100 rounded-xl px-4 py-2.5">
                <p className="text-[10px] text-gray-500">
                  Active
                </p>
                <p className="text-lg font-bold text-green-700">
                  {activeGroups}
                </p>
              </div>

              <div className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5">
                <p className="text-[10px] text-gray-500">
                  Inactive
                </p>
                <p className="text-lg font-bold text-gray-600">
                  {inactiveGroups}
                </p>
              </div>

            </div>
          </div>
        </div>

        {/* DEPARTMENTS */}

        <div className="space-y-3">
          {groupedData.length === 0 ? (
            <div className="bg-white border border-gray-200 rounded-2xl p-10 text-center shadow-sm">
              <Building2 className="w-9 h-9 mx-auto text-gray-300" />

              <h3 className="mt-3 font-semibold text-gray-800 text-sm">
                No departments found
              </h3>

              <p className="text-xs text-gray-500 mt-1">
                Create a department from Group Management.
              </p>
            </div>
          ) : (
            groupedData.map((group) => {
              const isGroupOpen =
                openGroups[group.groupId];

              return (
                <div
                  key={group.groupId}
                  className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                >
                  {/* DEPARTMENT */}

                  <button
                    type="button"
                    onClick={() =>
                      toggleGroup(group.groupId)
                    }
                    className="w-full px-3 sm:px-5 py-3.5 flex items-center justify-between gap-3 hover:bg-[#FCFBF8] transition text-left"
                  >
                    <div className="flex items-center gap-3 min-w-0">

                      <div className="w-10 h-10 rounded-xl bg-[#F7F5F0] flex items-center justify-center shrink-0">
                        <Building2 className="w-5 h-5 text-[#C87532]" />
                      </div>

                      <div className="min-w-0">

                        <div className="flex items-center gap-2 flex-wrap">
                          <h2 className="text-sm sm:text-base font-bold text-[#172033] truncate">
                            {group.name}
                          </h2>

                          <span
                            className={`px-2 py-0.5 rounded-full text-[9px] font-semibold border ${
                              group.status === "active"
                                ? "bg-green-50 text-green-700 border-green-200"
                                : "bg-gray-100 text-gray-600 border-gray-200"
                            }`}
                          >
                            {group.status === "active"
                              ? "Active"
                              : "Inactive"}
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 mt-1">
                          <span className="text-[10px] text-gray-500">
                            {group.users.length}{" "}
                            {group.users.length === 1
                              ? "user"
                              : "users"}
                          </span>

                          <span className="hidden sm:block text-gray-300">
                            •
                          </span>

                          <span className="text-[10px] text-gray-400">
                            Created {formatDate(group.createdAt)}
                          </span>
                        </div>

                      </div>
                    </div>

                    <div className="w-8 h-8 rounded-lg border border-gray-200 bg-white flex items-center justify-center shrink-0">
                      {isGroupOpen ? (
                        <ChevronUp className="w-4 h-4 text-gray-500" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-gray-500" />
                      )}
                    </div>
                  </button>

                  {/* ROLES */}

                  {isGroupOpen && (
                    <div className="border-t border-gray-100 bg-[#FAFAF8] p-2.5 sm:p-4 space-y-2.5">

                      {ROLE_ORDER.map((role) => {
                        const roleUsers = getRoleUsers(
                          group.users,
                          role
                        );

                        const roleKey =
                          `${group.groupId}-${role}`;

                        const isRoleOpen =
                          openRoles[roleKey];

                        return (
                          <div
                            key={roleKey}
                            className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.03)]"
                          >
                            <button
                              type="button"
                              onClick={() =>
                                toggleRole(
                                  group.groupId,
                                  role
                                )
                              }
                              className="w-full px-3 sm:px-4 py-3 flex items-center justify-between gap-3 hover:bg-gray-50 transition text-left"
                            >
                              <div className="flex items-center gap-2.5 min-w-0">

                                <div
                                  className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                                    role === "admin"
                                      ? "bg-orange-50"
                                      : role === "manager"
                                      ? "bg-blue-50"
                                      : "bg-green-50"
                                  }`}
                                >
                                  <ShieldCheck
                                    className={`w-4 h-4 ${
                                      role === "admin"
                                        ? "text-orange-600"
                                        : role === "manager"
                                        ? "text-blue-600"
                                        : "text-green-600"
                                    }`}
                                  />
                                </div>

                                <div className="min-w-0">
                                  <div className="flex items-center gap-2">
                                    <span
                                      className={`px-2 py-0.5 rounded-md border text-[10px] font-semibold ${ROLE_COLORS[role]}`}
                                    >
                                      {ROLE_LABELS[role]}
                                    </span>

                                    <span className="hidden sm:block text-[10px] text-gray-400">
                                      {ROLE_DESCRIPTIONS[role]}
                                    </span>
                                  </div>

                                  <p className="text-[10px] text-gray-500 mt-1">
                                    {roleUsers.length}{" "}
                                    {roleUsers.length === 1
                                      ? "user"
                                      : "users"}{" "}
                                    ·{" "}
                                    {getRolePermissionCount(
                                      role
                                    )}{" "}
                                    permissions
                                  </p>
                                </div>
                              </div>

                              <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0">
                                {isRoleOpen ? (
                                  <ChevronUp className="w-4 h-4 text-gray-400" />
                                ) : (
                                  <ChevronDown className="w-4 h-4 text-gray-400" />
                                )}
                              </div>
                            </button>

                            {isRoleOpen && (
                              <div className="border-t border-gray-100 bg-[#FAFAF8] p-2 sm:p-3">

                                {roleUsers.length === 0 ? (
                                  <div className="py-6 text-center">
                                    <Users className="w-6 h-6 mx-auto text-gray-300" />

                                    <p className="text-[11px] text-gray-500 mt-2">
                                      No{" "}
                                      {ROLE_LABELS[
                                        role
                                      ].toLowerCase()}{" "}
                                      users.
                                    </p>
                                  </div>
                                ) : (
                                  <div className="space-y-2">
                                    {roleUsers.map(
                                      (user) => {
                                        const selected =
                                          selectedUser?._id ===
                                          user._id;

                                        return (
                                          <div
                                            key={
                                              user._id
                                            }
                                            className={`bg-white border rounded-xl px-3 py-2.5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5 ${
                                              selected
                                                ? "border-[#C87532] ring-1 ring-[#C87532]/20"
                                                : "border-gray-200"
                                            }`}
                                          >
                                            <div className="flex items-center gap-2.5 min-w-0">
                                              <div className="w-8 h-8 rounded-full bg-[#18352A] flex items-center justify-center shrink-0">
                                                <UserRound className="w-4 h-4 text-white" />
                                              </div>

                                              <div className="min-w-0">
                                                <p className="text-xs font-semibold text-gray-800 truncate">
                                                  {user.name}
                                                </p>

                                                <p className="text-[10px] text-gray-500 truncate">
                                                  {user.email}
                                                </p>
                                              </div>
                                            </div>

                                            <div className="flex items-center justify-between sm:justify-end gap-2">
                                              <span
                                                className={`px-2 py-1 rounded-full text-[9px] font-medium ${
                                                  user.status ===
                                                  "active"
                                                    ? "bg-green-50 text-green-700"
                                                    : "bg-gray-100 text-gray-600"
                                                }`}
                                              >
                                                {user.status ||
                                                  "active"}
                                              </span>

                                              <button
                                                type="button"
                                                onClick={() =>
                                                  openUserPermissions(
                                                    user
                                                  )
                                                }
                                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#C87532] hover:bg-[#B96928] text-white text-[10px] font-medium transition"
                                              >
                                                <Lock className="w-3.5 h-3.5" />
                                                Permissions
                                              </button>
                                            </div>
                                          </div>
                                        );
                                      }
                                    )}
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* PERMISSIONS */}

      {selectedUser && (
        <div className="fixed inset-0 z-50 bg-black/45 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="w-full sm:max-w-3xl h-[94vh] sm:h-auto sm:max-h-[90vh] bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl overflow-hidden flex flex-col">

            <div className="px-4 sm:px-5 py-3.5 border-b border-gray-200 flex items-center justify-between gap-3">
              <div className="min-w-0">
                <h2 className="text-base font-bold text-[#172033] truncate">
                  {selectedUser.name}
                </h2>

                <p className="text-[10px] text-gray-500 mt-0.5 truncate">
                  {groupedData.find(
                    (group) =>
                      group.groupId === selectedUser.group
                  )?.name || selectedUser.group}
                  {" · "}
                  {ROLE_LABELS[selectedUser.role] ||
                    selectedUser.role}
                </p>
              </div>

              <button
                type="button"
                onClick={closePermissions}
                className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-3 sm:p-5">
              {permissionsLoading ? (
                <div className="py-16 flex justify-center">
                  <div className="flex items-center gap-2 text-gray-500 text-sm">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Loading permissions...
                  </div>
                </div>
              ) : (
                <>
                  <div className="mb-4">
                    <p className="text-sm font-semibold text-gray-800">
                      Permissions
                    </p>

                    <p className="text-[10px] text-gray-500 mt-0.5">
                      {userPermissions.length} selected
                    </p>
                  </div>

                  {availablePermissions.length === 0 ? (
                    <div className="rounded-xl border border-gray-200 p-6 text-center text-xs text-gray-500">
                      No permissions available.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {availablePermissions.map(
                        (permission) => {
                          const checked =
                            userPermissions.includes(
                              permission
                            );

                          return (
                            <button
                              key={permission}
                              type="button"
                              onClick={() =>
                                togglePermission(
                                  permission
                                )
                              }
                              className={`text-left border rounded-xl p-3 transition ${
                                checked
                                  ? "border-[#18352A] bg-[#18352A]/5"
                                  : "border-gray-200 bg-white hover:bg-gray-50"
                              }`}
                            >
                              <div className="flex items-center justify-between gap-2">
                                <div className="min-w-0">
                                  <p className="text-xs font-semibold text-gray-800 truncate">
                                    {formatPermission(
                                      permission
                                    )}
                                  </p>

                                  <p className="text-[9px] text-gray-400 mt-0.5 truncate">
                                    {permission}
                                  </p>
                                </div>

                                <div
                                  className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${
                                    checked
                                      ? "bg-[#18352A] border-[#18352A]"
                                      : "bg-white border-gray-300"
                                  }`}
                                >
                                  {checked && (
                                    <Check className="w-2.5 h-2.5 text-white stroke-[3]" />
                                  )}
                                </div>
                              </div>
                            </button>
                          );
                        }
                      )}
                    </div>
                  )}
                </>
              )}
            </div>

            <div className="px-4 sm:px-5 py-3.5 border-t border-gray-200 bg-gray-50">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">

                <div className="min-h-[18px]">
                  {saveMessage && (
                    <p
                      className={`text-[10px] sm:text-xs ${
                        saveMessage.includes(
                          "successfully"
                        )
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {saveMessage}
                    </p>
                  )}
                </div>

                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={closePermissions}
                    className="px-3.5 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 text-xs font-medium hover:bg-gray-100"
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    onClick={saveUserPermissions}
                    disabled={
                      permissionsLoading ||
                      savingPermissions
                    }
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#C87532] hover:bg-[#B96928] text-white text-xs font-medium disabled:opacity-50"
                  >
                    {savingPermissions ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Save className="w-3.5 h-3.5" />
                    )}

                    {savingPermissions
                      ? "Saving..."
                      : "Save"}
                  </button>
                </div>

              </div>
            </div>

          </div>
        </div>
      )}
    </>
  );
}