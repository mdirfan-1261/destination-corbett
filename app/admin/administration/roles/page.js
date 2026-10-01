
"use client";

import { useEffect, useState } from "react";
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
} from "lucide-react";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function RolesPage() {
  const [roles, setRoles] = useState([]);
  const [availablePermissions, setAvailablePermissions] = useState([]);
  const [openRole, setOpenRole] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [savingRole, setSavingRole] = useState(null);
  const [saveMessage, setSaveMessage] = useState("");

  useEffect(() => {
    fetchRoles();
  }, []);

  // =====================================================
  // FETCH ROLES
  // =====================================================

  const fetchRoles = async () => {
    try {
      setLoading(true);
      setError("");
      setSaveMessage("");

      const token = localStorage.getItem("adminToken");

      if (!token) {
        throw new Error("Admin authentication token not found.");
      }

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

      const data = await response.json();

      if (!response.ok || !data?.success) {
        throw new Error(
          data?.message ||
            "Failed to fetch roles and permissions."
        );
      }

      const fetchedRoles = Array.isArray(data.roles)
        ? data.roles
        : [];

      const fetchedPermissions = Array.isArray(
        data.availablePermissions
      )
        ? [...new Set(data.availablePermissions)]
        : [];

      setRoles(fetchedRoles);
      setAvailablePermissions(fetchedPermissions);

      if (fetchedRoles.length > 0) {
        setOpenRole(fetchedRoles[0].id);
      }
    } catch (error) {
      console.error("Roles fetch error:", error);

      setRoles([]);
      setAvailablePermissions([]);

      setError(
        error?.message ||
          "Something went wrong while loading roles."
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // TOGGLE ROLE
  // =====================================================

  const toggleRole = (roleId) => {
    setOpenRole((current) =>
      current === roleId ? null : roleId
    );

    setSaveMessage("");
  };

  // =====================================================
  // TOGGLE PERMISSION
  // =====================================================

  const togglePermission = (roleId, permission) => {
    setSaveMessage("");

    setRoles((currentRoles) =>
      currentRoles.map((role) => {
        if (role.id !== roleId) {
          return role;
        }

        const currentPermissions = Array.isArray(
          role.permissions
        )
          ? role.permissions
          : [];

        const hasPermission =
          currentPermissions.includes(permission);

        return {
          ...role,
          permissions: hasPermission
            ? currentPermissions.filter(
                (item) => item !== permission
              )
            : [...currentPermissions, permission],
        };
      })
    );
  };

  // =====================================================
  // SAVE PERMISSIONS
  // =====================================================

  const saveRolePermissions = async (role) => {
    try {
      setSavingRole(role.id);
      setSaveMessage("");
      setError("");

      const token = localStorage.getItem("adminToken");

      if (!token) {
        throw new Error(
          "Admin authentication token not found."
        );
      }

      let permissions = Array.isArray(role.permissions)
        ? [...new Set(role.permissions)]
        : [];

      // Super Admin must always retain this permission
      if (
        role.id === "super_admin" &&
        !permissions.includes("roles.manage")
      ) {
        permissions.push("roles.manage");
      }

      const response = await fetch(
        `${API_URL}/api/admin/roles/${role.id}/permissions`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            permissions,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data?.success) {
        throw new Error(
          data?.message ||
            "Failed to update role permissions."
        );
      }

      if (data.role) {
        setRoles((currentRoles) =>
          currentRoles.map((item) =>
            item.id === role.id
              ? {
                  ...item,
                  permissions:
                    data.role.permissions || [],
                  permissionCount:
                    data.role.permissionCount ??
                    data.role.permissions?.length ??
                    0,
                }
              : item
          )
        );
      }

      setSaveMessage(
        `${role.name || role.id} permissions saved successfully.`
      );
    } catch (error) {
      console.error(
        "Save role permissions error:",
        error
      );

      setSaveMessage(
        error?.message ||
          "Failed to save role permissions."
      );
    } finally {
      setSavingRole(null);
    }
  };

  // =====================================================
  // HELPERS
  // =====================================================

  const getRoleColor = (roleId) => {
    if (roleId === "super_admin") {
      return "bg-[#18352A]";
    }

    if (roleId === "admin") {
      return "bg-[#C87532]";
    }

    return "bg-[#64748B]";
  };

  const getRoleDescription = (roleId) => {
    const descriptions = {
      super_admin:
        "Full access to administration and all system modules.",

      admin:
        "Manage day-to-day operations, users and business modules.",

      staff:
        "Limited operational access for day-to-day staff activities.",
    };

    return (
      descriptions[roleId] ||
      "Access permissions configured for this role."
    );
  };

  const formatPermission = (permission) => {
    if (!permission) return "";

    return permission
      .split(".")
      .map((word) =>
        word
          .replace(/_/g, " ")
          .replace(/\b\w/g, (char) =>
            char.toUpperCase()
          )
      )
      .join(" ");
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-[#F7F5F0]">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Loader2
            size={18}
            className="animate-spin"
          />
          Loading roles and permissions...
        </div>
      </div>
    );
  }

  // =====================================================
  // ERROR
  // =====================================================

  if (error) {
    return (
      <div className="min-h-screen bg-[#F7F5F0] p-4 sm:p-6">
        <div className="rounded-xl border border-red-200 bg-white p-5">
          <div className="flex items-start gap-3">
            <AlertCircle
              size={20}
              className="mt-0.5 shrink-0 text-red-500"
            />

            <div>
              <h2 className="text-sm font-semibold text-[#172033]">
                Unable to load roles
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                {error}
              </p>

              <button
                type="button"
                onClick={fetchRoles}
                className="mt-4 rounded-lg bg-[#18352A] px-4 py-2 text-sm font-medium text-white hover:opacity-90"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // =====================================================
  // PAGE
  // =====================================================

  return (
    <div className="min-h-screen bg-[#F7F5F0] p-4 sm:p-6">

      {/* PAGE HEADER */}

      <div className="mb-7">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#18352A] text-white shadow-sm">
            <ShieldCheck size={22} />
          </div>

          <div>
            <h1 className="text-2xl font-bold tracking-tight text-[#172033]">
              Roles & Permissions
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              Control what each role can access across the admin panel.
            </p>
          </div>
        </div>
      </div>

      {/* INFO CARD */}

      <div className="mb-6 rounded-xl border border-[#E6DED5] bg-white p-4 shadow-sm">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#F3E8DD] text-[#C87532]">
            <Lock size={17} />
          </div>

          <div>
            <p className="text-sm font-semibold text-[#172033]">
              Role based access control
            </p>

            <p className="mt-1 text-sm leading-6 text-gray-500">
              Enable or disable individual permissions for each
              role. Changes are saved directly to the RBAC
              configuration.
            </p>
          </div>
        </div>
      </div>

      {/* SAVE MESSAGE */}

      {saveMessage && (
        <div
          className={`mb-5 flex items-center gap-2 rounded-xl border px-4 py-3 text-sm ${
            saveMessage
              .toLowerCase()
              .includes("successfully")
              ? "border-green-200 bg-green-50 text-green-700"
              : "border-red-200 bg-red-50 text-red-700"
          }`}
        >
          {saveMessage
            .toLowerCase()
            .includes("successfully") ? (
            <Check size={17} />
          ) : (
            <AlertCircle size={17} />
          )}

          <span>{saveMessage}</span>
        </div>
      )}

      {/* ROLES */}

      {roles.length === 0 ? (
        <div className="rounded-xl border border-gray-200 bg-white p-10 text-center shadow-sm">
          <ShieldCheck
            size={30}
            className="mx-auto text-gray-400"
          />

          <h2 className="mt-3 text-sm font-semibold text-[#172033]">
            No roles found
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            No roles are currently configured in the backend.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {roles.map((role) => {
            const isOpen = openRole === role.id;

            const rolePermissions = Array.isArray(
              role.permissions
            )
              ? role.permissions
              : [];

            const isSaving = savingRole === role.id;

            return (
              <div
                key={role.id}
                className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm"
              >
                {/* ROLE HEADER */}

                <button
                  type="button"
                  onClick={() => toggleRole(role.id)}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition hover:bg-gray-50"
                >
                  <div className="flex min-w-0 items-center gap-4">
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${getRoleColor(
                        role.id
                      )} text-white`}
                    >
                      <Users size={18} />
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h2 className="text-sm font-bold text-[#172033]">
                          {role.name || role.id}
                        </h2>

                        <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-gray-500">
                          {role.id.replace("_", " ")}
                        </span>
                      </div>

                      <p className="mt-1 text-xs text-gray-500">
                        {getRoleDescription(role.id)}
                      </p>
                    </div>
                  </div>

                  <div className="flex shrink-0 items-center gap-3">
                    <span className="hidden rounded-full border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs font-medium text-gray-600 sm:inline-flex">
                      {rolePermissions.length} permissions
                    </span>

                    {isOpen ? (
                      <ChevronUp
                        size={19}
                        className="text-gray-400"
                      />
                    ) : (
                      <ChevronDown
                        size={19}
                        className="text-gray-400"
                      />
                    )}
                  </div>
                </button>

                {/* OPEN ROLE */}

                {isOpen && (
                  <div className="border-t border-gray-100 bg-[#FAFAF8]">

                    {/* ACCESS HEADER */}

                    <div className="flex flex-col gap-4 border-b border-gray-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <h3 className="text-sm font-semibold text-[#172033]">
                          Module Access
                        </h3>

                        <p className="mt-1 text-xs text-gray-500">
                          Click a permission to turn access on or off.
                        </p>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="rounded-full bg-green-50 px-3 py-1.5 text-xs font-medium text-green-700">
                          {rolePermissions.length} active
                        </span>

                        <button
                          type="button"
                          onClick={() =>
                            saveRolePermissions(role)
                          }
                          disabled={isSaving}
                          className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#18352A] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#214535] disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {isSaving ? (
                            <>
                              <Loader2
                                size={16}
                                className="animate-spin"
                              />
                              Saving...
                            </>
                          ) : (
                            <>
                              <Save size={16} />
                              Save Changes
                            </>
                          )}
                        </button>
                      </div>
                    </div>

                    {/* PERMISSIONS */}

                    <div className="p-5">
                      {availablePermissions.length === 0 ? (
                        <div className="rounded-xl border border-gray-200 bg-white p-6 text-center text-sm text-gray-500">
                          No permissions configured.
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                          {availablePermissions.map(
                            (permission) => {
                              const hasPermission =
                                rolePermissions.includes(
                                  permission
                                );

                              const isProtected =
                                role.id === "super_admin" &&
                                permission === "roles.manage";

                              return (
                                <button
                                  type="button"
                                  key={`${role.id}-${permission}`}
                                  onClick={() => {
                                    if (!isProtected) {
                                      togglePermission(
                                        role.id,
                                        permission
                                      );
                                    }
                                  }}
                                  disabled={
                                    isProtected || isSaving
                                  }
                                  className={`group flex w-full items-center justify-between gap-3 rounded-xl border p-4 text-left transition ${
                                    hasPermission
                                      ? "border-green-200 bg-white shadow-sm"
                                      : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm"
                                  } ${
                                    isProtected
                                      ? "cursor-not-allowed"
                                      : "cursor-pointer"
                                  }`}
                                >
                                  <div className="flex min-w-0 items-center gap-3">
                                    {/* ICON */}

                                    <div
                                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                                        hasPermission
                                          ? "bg-green-50 text-green-600"
                                          : "bg-gray-100 text-gray-400"
                                      }`}
                                    >
                                      {hasPermission ? (
                                        <Check size={17} />
                                      ) : (
                                        <span className="text-sm">
                                          —
                                        </span>
                                      )}
                                    </div>

                                    {/* TEXT */}

                                    <div className="min-w-0">
                                      <p
                                        className={`truncate text-sm font-medium ${
                                          hasPermission
                                            ? "text-[#172033]"
                                            : "text-gray-500"
                                        }`}
                                      >
                                        {formatPermission(
                                          permission
                                        )}
                                      </p>

                                      <p
                                        className={`mt-0.5 text-[11px] ${
                                          hasPermission
                                            ? "text-green-600"
                                            : "text-gray-400"
                                        }`}
                                      >
                                        {isProtected
                                          ? "Required permission"
                                          : hasPermission
                                          ? "Access enabled"
                                          : "Access disabled"}
                                      </p>
                                    </div>
                                  </div>

                                  {/* TOGGLE */}

                                  <div
                                    className={`relative h-5 w-9 shrink-0 rounded-full transition ${
                                      hasPermission
                                        ? "bg-[#18352A]"
                                        : "bg-gray-300"
                                    }`}
                                  >
                                    <div
                                      className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition ${
                                        hasPermission
                                          ? "left-[18px]"
                                          : "left-0.5"
                                      }`}
                                    />
                                  </div>
                                </button>
                              );
                            }
                          )}
                        </div>
                      )}
                    </div>

                    {/* FOOTER */}

                    <div className="border-t border-gray-200 bg-white px-5 py-3">
                      <div className="flex items-center justify-between">
                        <p className="text-xs text-gray-400">
                          Changes are not applied until you save.
                        </p>

                        <span className="text-xs font-medium text-gray-500">
                          {availablePermissions.length} total permissions
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* BOTTOM INFO */}

      <div className="mt-6 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
        <div className="flex items-start gap-3">
          <ShieldCheck
            size={18}
            className="mt-0.5 shrink-0 text-[#18352A]"
          />

          <div>
            <p className="text-sm font-semibold text-[#172033]">
              RBAC configuration
            </p>

            <p className="mt-1 text-xs leading-5 text-gray-500">
              Permissions are loaded from the backend configuration.
              Only authorized administrators can update role access.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
