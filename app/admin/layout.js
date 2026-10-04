"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

import {
  Trees,
  LogOut,
  Menu,
  Sun,
  Moon,
  Clock3,
  Bell,
  User,
  Pencil,
  LockKeyhole,
  ChevronDown,
  X,
  Save,
  Check,
  Loader2,
  Eye,
  EyeOff,
} from "lucide-react";

import AdminSidebar from "@/components/admin/AdminSidebar";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:5000";

export default function AdminLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();

  const [sidebarOpen, setSidebarOpen] =
    useState(false);

  const [sidebarCollapsed, setSidebarCollapsed] =
    useState(false);

  const [darkMode, setDarkMode] =
    useState(false);

  // PROFILE DROPDOWN
  const [profileOpen, setProfileOpen] =
    useState(false);

  // NOTIFICATION DROPDOWN
  const [notificationOpen, setNotificationOpen] =
    useState(false);

  const [notifications, setNotifications] =
    useState([]);

  const [notificationLoading, setNotificationLoading] =
    useState(false);

  const [notificationActionLoading, setNotificationActionLoading] =
    useState(false);

  const [unreadCount, setUnreadCount] =
    useState(0);

  // DYNAMIC PROFILE
  const [profile, setProfile] = useState({
    id: null,
    name: "",
    email: "",
    role: "",
    group: "",
    status: "",
    lastLoginAt: null,
    permissions: [],
    parentAdmin: null,
  });

  const [profileLoading, setProfileLoading] =
    useState(true);

  // EDIT PROFILE MODAL
  const [showEditProfile, setShowEditProfile] =
    useState(false);

  const [profileForm, setProfileForm] =
    useState({
      name: "",
      email: "",
    });

  // CHANGE PASSWORD MODAL
  const [
    showChangePassword,
    setShowChangePassword,
  ] = useState(false);

  const [passwordForm, setPasswordForm] =
    useState({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });

  const [passwordMessage, setPasswordMessage] =
    useState("");

  // PASSWORD SHOW / HIDE
  const [showCurrentPassword, setShowCurrentPassword] =
    useState(false);

  const [showNewPassword, setShowNewPassword] =
    useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  // =========================
  // LOGIN CHECK
  // =========================

  useEffect(() => {
    const token =
      localStorage.getItem("adminToken");

    if (
      !token &&
      pathname !== "/admin/login"
    ) {
      router.replace("/admin/login");
    }
  }, [pathname, router]);

  // =========================
  // LOAD THEME
  // =========================

  useEffect(() => {
    const savedTheme =
      localStorage.getItem("adminTheme");

    if (savedTheme === "dark") {
      setDarkMode(true);
    }
  }, []);

  // =========================
  // SAVE THEME
  // =========================

  useEffect(() => {
    if (pathname === "/admin/login") {
      return;
    }

    localStorage.setItem(
      "adminTheme",
      darkMode ? "dark" : "light"
    );
  }, [darkMode, pathname]);

  // =========================
  // FETCH DYNAMIC ADMIN PROFILE
  // =========================

  useEffect(() => {
    if (pathname === "/admin/login") {
      return;
    }

    const fetchAdminProfile = async () => {
      try {
        setProfileLoading(true);

        const token =
          localStorage.getItem("adminToken");

        if (!token) {
          return;
        }

        const response = await fetch(
          `${API_URL}/api/admin/profile`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type":
                "application/json",
            },
            cache: "no-store",
          }
        );

        if (
          response.status === 401 ||
          response.status === 403
        ) {
          localStorage.removeItem(
            "adminToken"
          );

          localStorage.removeItem(
            "adminProfile"
          );

          router.replace("/admin/login");
          return;
        }

        const data =
          await response.json();

        if (!response.ok) {
          throw new Error(
            data?.message ||
              "Failed to fetch admin profile."
          );
        }

        if (data?.admin) {
          const admin = data.admin;

          const dynamicProfile = {
            id: admin.id || null,
            name: admin.name || "",
            email: admin.email || "",
            role: admin.role || "",
            group: admin.group || "",
            status: admin.status || "",
            lastLoginAt:
              admin.lastLoginAt || null,
            permissions:
              Array.isArray(
                admin.permissions
              )
                ? admin.permissions
                : [],
            parentAdmin:
              admin.parentAdmin || null,
          };

          setProfile(dynamicProfile);

          setProfileForm({
            name:
              admin.name || "",
            email:
              admin.email || "",
          });

          localStorage.setItem(
            "adminProfile",
            JSON.stringify(
              dynamicProfile
            )
          );
        }
      } catch (error) {
        console.error(
          "Fetch admin profile error:",
          error
        );
      } finally {
        setProfileLoading(false);
      }
    };

    fetchAdminProfile();
  }, [pathname, router]);

  // =========================
  // FETCH NOTIFICATIONS
  // =========================

  const fetchNotifications = async (
    showLoader = true
  ) => {
    if (
      pathname === "/admin/login"
    ) {
      return;
    }

    try {
      if (showLoader) {
        setNotificationLoading(true);
      }

      const token =
        localStorage.getItem("adminToken");

      if (!token) {
        return;
      }

      const response = await fetch(
        `${API_URL}/api/admin/notifications`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type":
              "application/json",
          },
          cache: "no-store",
        }
      );

      if (
        response.status === 401 ||
        response.status === 403
      ) {
        return;
      }

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data?.message ||
            "Failed to fetch notifications."
        );
      }

      setNotifications(
        Array.isArray(
          data?.notifications
        )
          ? data.notifications
          : []
      );

      setUnreadCount(
        Number(data?.unreadCount) || 0
      );
    } catch (error) {
      console.error(
        "Fetch notifications error:",
        error
      );
    } finally {
      if (showLoader) {
        setNotificationLoading(false);
      }
    }
  };

  // =========================
  // LOAD NOTIFICATIONS
  // =========================

  useEffect(() => {
    if (
      pathname === "/admin/login"
    ) {
      return;
    }

    fetchNotifications();

    const interval =
      setInterval(() => {
        fetchNotifications(false);
      }, 30000);

    return () => {
      clearInterval(interval);
    };
  }, [pathname]);

  // =========================
  // CLOSE NOTIFICATION ON
  // OUTSIDE CLICK
  // =========================

  useEffect(() => {
    const handleOutsideClick = (
      event
    ) => {
      if (
        !event.target.closest(
          "[data-notification-wrapper]"
        )
      ) {
        setNotificationOpen(false);
      }
    };

    if (notificationOpen) {
      document.addEventListener(
        "mousedown",
        handleOutsideClick
      );
    }

    return () => {
      document.removeEventListener(
        "mousedown",
        handleOutsideClick
      );
    };
  }, [notificationOpen]);

  // =========================
  // MARK SINGLE NOTIFICATION
  // AS READ
  // =========================

  const markNotificationAsRead = async (
    notificationId
  ) => {
    try {
      const token =
        localStorage.getItem("adminToken");

      if (!token) {
        return;
      }

      const response = await fetch(
        `${API_URL}/api/admin/notifications/${notificationId}/read`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type":
              "application/json",
          },
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data?.message ||
            "Failed to mark notification as read."
        );
      }

      setNotifications((prev) =>
  prev.filter(
    (notification) =>
      String(notification._id) !==
      String(notificationId)
  )
);




      setUnreadCount((prev) =>
        Math.max(0, prev - 1)
      );
    } catch (error) {
      console.error(
        "Mark notification read error:",
        error
      );
    }
  };

  // =========================
  // MARK ALL AS READ
  // =========================

  const markAllNotificationsAsRead =
    async () => {
      try {
        setNotificationActionLoading(
          true
        );

        const token =
          localStorage.getItem("adminToken");

        if (!token) {
          return;
        }

        const response = await fetch(
          `${API_URL}/api/admin/notifications/read-all`,
          {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type":
                "application/json",
            },
          }
        );

        const data =
          await response.json();

        if (!response.ok) {
          throw new Error(
            data?.message ||
              "Failed to mark all notifications as read."
          );
        }

        setNotifications([]);
setUnreadCount(0);

        setUnreadCount(0);
      } catch (error) {
        console.error(
          "Mark all notifications error:",
          error
        );
      } finally {
        setNotificationActionLoading(
          false
        );
      }
    };

  // =========================
  // NOTIFICATION TIME
  // =========================

  const formatNotificationTime = (
    createdAt
  ) => {
    if (!createdAt) {
      return "";
    }

    const date =
      new Date(createdAt);

    if (
      Number.isNaN(
        date.getTime()
      )
    ) {
      return "";
    }

    const now = new Date();

    const diff =
      now.getTime() -
      date.getTime();

    const minutes =
      Math.floor(
        diff / 60000
      );

    if (minutes < 1) {
      return "Just now";
    }

    if (minutes < 60) {
      return `${minutes} min ago`;
    }

    const hours =
      Math.floor(
        minutes / 60
      );

    if (hours < 24) {
      return `${hours} hr ago`;
    }

    const days =
      Math.floor(
        hours / 24
      );

    if (days < 7) {
      return `${days} day${
        days > 1 ? "s" : ""
      } ago`;
    }

    return date.toLocaleDateString(
      "en-IN",
      {
        day: "numeric",
        month: "short",
      }
    );
  };

  // =========================
  // FORMAT ROLE
  // =========================

  const formatRole = (role) => {
    if (!role) {
      return "—";
    }

    return role
      .split("_")
      .map(
        (word) =>
          word.charAt(0).toUpperCase() +
          word.slice(1)
      )
      .join(" ");
  };

  // =========================
  // FORMAT GROUP
  // =========================

  const formatGroup = (group) => {
    if (!group) {
      return "—";
    }

    return group
      .split("_")
      .map(
        (word) =>
          word.charAt(0).toUpperCase() +
          word.slice(1)
      )
      .join(" ");
  };

  // =========================
  // FORMAT LAST LOGIN
  // =========================

  const formatLastLogin = (
    lastLoginAt
  ) => {
    if (!lastLoginAt) {
      return "First login";
    }

    const date =
      new Date(lastLoginAt);

    if (
      Number.isNaN(
        date.getTime()
      )
    ) {
      return "—";
    }

    return date.toLocaleString(
      "en-IN",
      {
        day: "numeric",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }
    );
  };

  // =========================
  // LOGOUT
  // =========================

  const logout = () => {
    localStorage.removeItem(
      "adminToken"
    );

    localStorage.removeItem(
      "adminProfile"
    );

    setSidebarOpen(false);
    setProfileOpen(false);
    setNotificationOpen(false);

    router.push("/admin/login");
  };

  // =========================
  // OPEN EDIT PROFILE
  // =========================

  const openEditProfile = () => {
    setProfileForm({
      name: profile.name || "",
      email: profile.email || "",
    });

    setProfileOpen(false);
    setShowEditProfile(true);
  };

  // =========================
  // SAVE PROFILE
  // =========================

  const saveProfile = () => {
    const updatedName =
      profileForm.name.trim();

    const updatedEmail =
      profileForm.email.trim();

    if (!updatedName) {
      return;
    }

    if (!updatedEmail) {
      return;
    }

    const updatedProfile = {
      ...profile,
      name: updatedName,
      email: updatedEmail,
    };

    setProfile(updatedProfile);

    localStorage.setItem(
      "adminProfile",
      JSON.stringify(
        updatedProfile
      )
    );

    setShowEditProfile(false);
  };

  // =========================
  // OPEN CHANGE PASSWORD
  // =========================

  const openChangePassword = () => {
    setPasswordForm({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });

    // RESET EYE STATES
    setShowCurrentPassword(false);
    setShowNewPassword(false);
    setShowConfirmPassword(false);

    setPasswordMessage("");

    setProfileOpen(false);
    setShowChangePassword(true);
  };

  // =========================
  // PASSWORD UI VALIDATION
  // =========================

  const handlePasswordSave = () => {
    if (
      !passwordForm.currentPassword ||
      !passwordForm.newPassword ||
      !passwordForm.confirmPassword
    ) {
      setPasswordMessage(
        "Please fill all password fields."
      );

      return;
    }

    if (
      passwordForm.newPassword.length < 6
    ) {
      setPasswordMessage(
        "New password must be at least 6 characters."
      );

      return;
    }

    if (
      passwordForm.newPassword !==
      passwordForm.confirmPassword
    ) {
      setPasswordMessage(
        "New password and confirm password do not match."
      );

      return;
    }

    setPasswordMessage(
      "Password validated. Backend update will be connected next."
    );
  };

  // =========================
  // ADMIN LOGIN PAGE
  // =========================

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  return (
    <main
      className={`min-h-screen transition-colors duration-300 ${
        darkMode
          ? "text-white"
          : "text-[#18352A]"
      }`}
    >
      {/* BACKGROUND */}

      <div className="fixed inset-0 -z-20 bg-[#F5F7FA]" />

      <div
        className={`fixed inset-0 -z-10 transition-all duration-300 ${
          darkMode
            ? "bg-[#07100C]/40"
            : "bg-[#F5F7FA]/70"
        }`}
      />

      {/* ========================= */}
      {/* TOP HEADER */}
      {/* ========================= */}

      <header
        className={`sticky top-0 z-50 border-b backdrop-blur-2xl transition-all duration-300 ${
          darkMode
            ? "border-white/10 bg-[#142019]/90"
            : "border-[#18352A]/20 bg-[#18352A]/95"
        }`}
      >
        <div className="flex h-14 items-center justify-between gap-3 px-3 sm:px-5">

          {/* LEFT SIDE */}

          <div className="flex min-w-0 items-center gap-2.5">

            {/* MOBILE MENU */}

            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();

                setSidebarOpen(
                  (prev) => !prev
                );
              }}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/30 bg-[#18352A] text-white shadow-md transition active:scale-95 md:hidden"
              aria-label="Open mobile menu"
            >
              <Menu size={18} />
            </button>

            {/* LOGO */}

            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#18352A]/95 text-[#E8DDC8] shadow-md">
              <Trees size={19} />
            </div>

            {/* TITLE */}

            <div className="min-w-0">
              <h1 className="truncate text-xs font-extrabold tracking-wider text-white sm:text-sm">
                DESTINATION CORBETT
              </h1>

              <p className="truncate text-[9px] font-semibold uppercase tracking-[0.18em] text-[#B8C19F]">
                Admin Console
              </p>
            </div>
          </div>

          {/* ========================= */}
          {/* HEADER RIGHT */}
          {/* ========================= */}

          <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">

            {/* LAST LOGIN */}

            <div className="flex h-9 items-center gap-1.5 rounded-lg border border-white/15 bg-white/10 px-2.5 text-white">

              <Clock3
                size={14}
                className="shrink-0 text-[#D8C59E]"
              />

              <div className="hidden sm:block leading-none">

                <p className="text-[8px] font-medium uppercase tracking-wide text-white/60">
                  Last Login
                </p>

                <p className="mt-0.5 whitespace-nowrap text-[10px] font-semibold text-white">
                  {profileLoading
                    ? "Loading..."
                    : formatLastLogin(
                        profile.lastLoginAt
                      )}
                </p>

              </div>
            </div>

            {/* ========================= */}
            {/* NOTIFICATION */}
            {/* ========================= */}

            <div
              className="relative"
              data-notification-wrapper
            >

              <button
                type="button"
                aria-label="Notifications"
                onClick={() => {
                  setNotificationOpen(
                    (prev) => !prev
                  );

                  setProfileOpen(false);

                  if (!notificationOpen) {
                    fetchNotifications();
                  }
                }}
                className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-white/15 bg-white/10 text-white transition hover:bg-white/20 active:scale-95"
              >
                <Bell size={16} />

                {unreadCount > 0 && (
                  <span className="absolute -right-1 -top-1 flex min-h-[16px] min-w-[16px] items-center justify-center rounded-full bg-[#F08A5D] px-1 text-[8px] font-bold leading-none text-white shadow-sm">
                    {unreadCount > 99
                      ? "99+"
                      : unreadCount}
                  </span>
                )}
              </button>

              {/* NOTIFICATION DROPDOWN */}

              {notificationOpen && (
                <div className="absolute right-0 top-[calc(100%+8px)] z-[120] w-[340px] max-w-[calc(100vw-24px)] overflow-hidden rounded-xl border border-gray-200 bg-white text-[#18352A] shadow-2xl">

                  {/* HEADER */}

                  <div className="flex items-center justify-between border-b border-gray-100 bg-[#F7F5F0] px-4 py-3">

                    <div>
                      <p className="text-xs font-bold text-[#18352A]">
                        Notifications
                      </p>

                      <p className="mt-0.5 text-[9px] text-gray-400">
                        {unreadCount > 0
                          ? `${unreadCount} unread notification${
                              unreadCount > 1
                                ? "s"
                                : ""
                            }`
                          : "You're all caught up"}
                      </p>
                    </div>

                    {unreadCount > 0 && (
                      <button
                        type="button"
                        onClick={
                          markAllNotificationsAsRead
                        }
                        disabled={
                          notificationActionLoading
                        }
                        className="flex items-center gap-1 rounded-md px-2 py-1.5 text-[9px] font-semibold text-[#A66A2C] transition hover:bg-[#F3EBDD] disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {notificationActionLoading ? (
                          <Loader2
                            size={11}
                            className="animate-spin"
                          />
                        ) : (
                          <Check size={11} />
                        )}

                        Mark all read
                      </button>
                    )}
                  </div>

                  {/* NOTIFICATION LIST */}

                  <div className="max-h-[360px] overflow-y-auto">

                    {notificationLoading ? (
                      <div className="flex items-center justify-center gap-2 px-4 py-10 text-[10px] text-gray-400">
                        <Loader2
                          size={15}
                          className="animate-spin"
                        />

                        Loading notifications...
                      </div>
                    ) : notifications.length ===
                      0 ? (
                      <div className="px-5 py-10 text-center">

                        <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-[#F3EBDD] text-[#A66A2C]">
                          <Bell size={17} />
                        </div>

                        <p className="mt-3 text-xs font-semibold text-gray-700">
                          No notifications
                        </p>

                        <p className="mt-1 text-[9px] text-gray-400">
                          New enquiries and admin
                          activity will appear here.
                        </p>

                      </div>
                    ) : (
                      notifications.map(
                        (notification) => (
                          <button
                            type="button"
                            key={
                              notification._id
                            }
                            onClick={() => {
                              if (
                                !notification.isRead
                              ) {
                                markNotificationAsRead(
                                  notification._id
                                );
                              }
                            }}
                            className={`flex w-full gap-3 border-b border-gray-100 px-4 py-3 text-left transition last:border-b-0 ${
                              notification.isRead
                                ? "bg-white hover:bg-gray-50"
                                : "bg-[#FFFBF5] hover:bg-[#FFF7EA]"
                            }`}
                          >

                            {/* STATUS DOT */}

                            <div className="pt-1">

                              <span
                                className={`block h-2 w-2 rounded-full ${
                                  notification.isRead
                                    ? "bg-gray-200"
                                    : "bg-[#F08A5D]"
                                }`}
                              />

                            </div>

                            {/* CONTENT */}

                            <div className="min-w-0 flex-1">

                              <div className="flex items-start justify-between gap-2">

                                <p
                                  className={`text-[11px] ${
                                    notification.isRead
                                      ? "font-medium text-gray-600"
                                      : "font-bold text-[#18352A]"
                                  }`}
                                >
                                  {
                                    notification.title
                                  }
                                </p>

                                <span className="shrink-0 text-[8px] text-gray-400">
                                  {formatNotificationTime(
                                    notification.createdAt
                                  )}
                                </span>

                              </div>

                              <p className="mt-1 line-clamp-2 text-[9px] leading-4 text-gray-500">
                                {
                                  notification.message
                                }
                              </p>

                              {notification.group && (
                                <span className="mt-1.5 inline-block rounded-full bg-[#E8F0EB] px-1.5 py-0.5 text-[7px] font-semibold uppercase tracking-wide text-[#28563C]">
                                  {formatGroup(
                                    notification.group
                                  )}
                                </span>
                              )}

                            </div>

                          </button>
                        )
                      )
                    )}

                  </div>
                </div>
              )}
            </div>

            {/* THEME */}

            <button
              type="button"
              onClick={() =>
                setDarkMode(
                  (prev) => !prev
                )
              }
              aria-label="Toggle theme"
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/15 bg-white/10 text-white transition hover:bg-white/20 active:scale-95"
            >
              {darkMode ? (
                <Sun size={16} />
              ) : (
                <Moon size={16} />
              )}
            </button>

            {/* ========================= */}
            {/* PROFILE AREA */}
            {/* ========================= */}

            <div className="relative">

              {/* PROFILE BUTTON */}

              <button
                type="button"
                onClick={() => {
                  setProfileOpen(
                    (prev) => !prev
                  );

                  setNotificationOpen(false);
                }}
                className="flex h-9 items-center gap-2 rounded-lg border border-white/15 bg-white/10 px-2 text-white transition hover:bg-white/20 active:scale-95"
              >

                {/* PROFILE ICON */}

                <div className="flex h-6 w-6 items-center justify-center rounded-md bg-[#D8C59E] text-[#18352A]">
                  <User size={14} />
                </div>

                {/* NAME */}

                <div className="hidden text-left sm:block">

                  <p className="max-w-[100px] truncate text-[10px] font-bold">
                    {profileLoading
                      ? "Loading..."
                      : profile.name ||
                        "Admin"}
                  </p>

                  <p className="text-[8px] text-white/60">
                    {profileLoading
                      ? "—"
                      : formatRole(
                          profile.role
                        )}
                  </p>

                </div>

                <ChevronDown
                  size={13}
                  className={`hidden transition-transform sm:block ${
                    profileOpen
                      ? "rotate-180"
                      : ""
                  }`}
                />

              </button>

              {/* PROFILE DROPDOWN */}

              {profileOpen && (
                <div className="absolute right-0 top-[calc(100%+8px)] z-[100] w-[275px] overflow-hidden rounded-xl border border-gray-200 bg-white text-[#18352A] shadow-xl">

                  {/* PROFILE HEADER */}

                  <div className="border-b border-gray-100 bg-[#F7F5F0] px-4 py-3">

                    <div className="flex items-center gap-3">

                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#18352A] text-[#E8DDC8]">
                        <User size={19} />
                      </div>

                      <div className="min-w-0">

                        <p className="truncate text-sm font-bold text-[#18352A]">
                          {profile.name ||
                            "Admin"}
                        </p>

                        <p className="truncate text-[10px] text-gray-500">
                          {profile.email ||
                            "—"}
                        </p>

                      </div>

                    </div>
                  </div>

                  {/* PROFILE INFO */}

                  <div className="border-b border-gray-100 px-4 py-3">

                    <div className="flex items-center justify-between py-1">

                      <span className="text-[10px] font-medium text-gray-400">
                        Role
                      </span>

                      <span className="text-[10px] font-semibold text-[#18352A]">
                        {formatRole(
                          profile.role
                        )}
                      </span>

                    </div>

                    <div className="flex items-center justify-between py-1">

                      <span className="text-[10px] font-medium text-gray-400">
                        Group
                      </span>

                      <span className="text-[10px] font-semibold capitalize text-[#18352A]">
                        {formatGroup(
                          profile.group
                        )}
                      </span>

                    </div>

                  </div>

                  {/* ACTIONS */}

                  <div className="p-2">

                    {/* EDIT PROFILE */}

                    <button
                      type="button"
                      onClick={
                        openEditProfile
                      }
                      className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition hover:bg-[#F7F5F0]"
                    >

                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#F3EBDD] text-[#A66A2C]">
                        <Pencil size={14} />
                      </div>

                      <div>

                        <p className="text-[11px] font-semibold text-gray-800">
                          Edit Profile
                        </p>

                        <p className="text-[9px] text-gray-400">
                          Update your profile details
                        </p>

                      </div>

                    </button>

                    {/* CHANGE PASSWORD */}

                    <button
                      type="button"
                      onClick={
                        openChangePassword
                      }
                      className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition hover:bg-[#F7F5F0]"
                    >

                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#E8F0EB] text-[#28563C]">
                        <LockKeyhole
                          size={14}
                        />
                      </div>

                      <div>

                        <p className="text-[11px] font-semibold text-gray-800">
                          Change Password
                        </p>

                        <p className="text-[9px] text-gray-400">
                          Update your account password
                        </p>

                      </div>

                    </button>

                    {/* LOGOUT */}

                    <button
                      type="button"
                      onClick={logout}
                      className="mt-1 flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition hover:bg-red-50"
                    >

                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-50 text-red-500">
                        <LogOut
                          size={14}
                        />
                      </div>

                      <div>

                        <p className="text-[11px] font-semibold text-red-600">
                          Logout
                        </p>

                        <p className="text-[9px] text-gray-400">
                          Sign out from admin console
                        </p>

                      </div>

                    </button>

                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* ========================= */}
      {/* ADMIN CONTENT AREA */}
      {/* ========================= */}

      <div className="flex items-start min-h-[calc(100vh-56px)]">

        {/* SIDEBAR */}

        <AdminSidebar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          sidebarCollapsed={
            sidebarCollapsed
          }
          setSidebarCollapsed={
            setSidebarCollapsed
          }
        />

        {/* PAGE CONTENT */}

       <section className="min-w-0 flex-1">
  {children}
</section>

      </div>

      {/* ========================= */}
      {/* EDIT PROFILE MODAL */}
      {/* ========================= */}

      {showEditProfile && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm">

          <div className="w-full max-w-[400px] overflow-hidden rounded-2xl bg-white shadow-2xl">

            <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">

              <div>

                <h2 className="text-sm font-bold text-[#18352A]">
                  Edit Profile
                </h2>

                <p className="mt-0.5 text-[10px] text-gray-400">
                  Update your profile details
                </p>

              </div>

              <button
                type="button"
                onClick={() =>
                  setShowEditProfile(
                    false
                  )
                }
                className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-700"
              >
                <X size={16} />
              </button>

            </div>

            <div className="space-y-4 px-5 py-5">

              <div>

                <label className="mb-1.5 block text-[10px] font-semibold text-gray-600">
                  Full Name
                </label>

                <input
                  type="text"
                  value={
                    profileForm.name
                  }
                  onChange={(e) =>
                    setProfileForm({
                      ...profileForm,
                      name: e.target.value,
                    })
                  }
                  className="h-10 w-full rounded-lg border border-gray-200 px-3 text-xs outline-none transition focus:border-[#C87532]"
                  placeholder="Enter your name"
                />

              </div>

              <div>

                <label className="mb-1.5 block text-[10px] font-semibold text-gray-600">
                  Email
                </label>

                <input
                  type="email"
                  value={
                    profileForm.email
                  }
                  onChange={(e) =>
                    setProfileForm({
                      ...profileForm,
                      email:
                        e.target.value,
                    })
                  }
                  className="h-10 w-full rounded-lg border border-gray-200 px-3 text-xs outline-none transition focus:border-[#C87532]"
                  placeholder="Enter your email"
                />

              </div>

              <div className="grid grid-cols-2 gap-3">

                <div className="rounded-lg bg-[#F7F5F0] px-3 py-2.5">

                  <p className="text-[9px] font-medium text-gray-400">
                    Role
                  </p>

                  <p className="mt-0.5 text-[10px] font-bold capitalize text-[#18352A]">
                    {formatRole(
                      profile.role
                    )}
                  </p>

                </div>

                <div className="rounded-lg bg-[#F7F5F0] px-3 py-2.5">

                  <p className="text-[9px] font-medium text-gray-400">
                    Group
                  </p>

                  <p className="mt-0.5 text-[10px] font-bold capitalize text-[#18352A]">
                    {formatGroup(
                      profile.group
                    )}
                  </p>

                </div>

              </div>

            </div>

            <div className="flex justify-end gap-2 border-t border-gray-100 bg-gray-50 px-5 py-3">

              <button
                type="button"
                onClick={() =>
                  setShowEditProfile(
                    false
                  )
                }
                className="rounded-lg border border-gray-200 px-4 py-2 text-[10px] font-semibold text-gray-600 hover:bg-white"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={
                  saveProfile
                }
                className="flex items-center gap-1.5 rounded-lg bg-[#18352A] px-4 py-2 text-[10px] font-semibold text-white hover:bg-[#244B39]"
              >
                <Save size={13} />
                Save Changes
              </button>

            </div>
          </div>
        </div>
      )}

      {/* ========================= */}
      {/* CHANGE PASSWORD MODAL */}
      {/* ========================= */}

      {showChangePassword && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm">

          <div className="w-full max-w-[400px] overflow-hidden rounded-2xl bg-white shadow-2xl">

            {/* MODAL HEADER */}

            <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">

              <div>

                <h2 className="text-sm font-bold text-[#18352A]">
                  Change Password
                </h2>

                <p className="mt-0.5 text-[10px] text-gray-400">
                  Update your account password
                </p>

              </div>

              <button
                type="button"
                onClick={() =>
                  setShowChangePassword(
                    false
                  )
                }
                className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-700"
              >
                <X size={16} />
              </button>

            </div>

            {/* PASSWORD FORM */}

            <div className="space-y-4 px-5 py-5">

              {/* CURRENT PASSWORD */}

              <div>

                <label className="mb-1.5 block text-[10px] font-semibold text-gray-600">
                  Current Password
                </label>

                <div className="relative">

                  <input
                    type={
                      showCurrentPassword
                        ? "text"
                        : "password"
                    }
                    value={
                      passwordForm.currentPassword
                    }
                    onChange={(e) =>
                      setPasswordForm({
                        ...passwordForm,
                        currentPassword:
                          e.target.value,
                      })
                    }
                    className="h-10 w-full rounded-lg border border-gray-200 px-3 pr-10 text-xs outline-none focus:border-[#C87532]"
                    placeholder="Enter current password"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowCurrentPassword(
                        (prev) => !prev
                      )
                    }
                    className="absolute right-0 top-0 flex h-10 w-10 items-center justify-center text-gray-400 transition hover:text-[#18352A]"
                    aria-label={
                      showCurrentPassword
                        ? "Hide current password"
                        : "Show current password"
                    }
                  >
                    {showCurrentPassword ? (
                      <EyeOff size={15} />
                    ) : (
                      <Eye size={15} />
                    )}
                  </button>

                </div>
              </div>

              {/* NEW PASSWORD */}

              <div>

                <label className="mb-1.5 block text-[10px] font-semibold text-gray-600">
                  New Password
                </label>

                <div className="relative">

                  <input
                    type={
                      showNewPassword
                        ? "text"
                        : "password"
                    }
                    value={
                      passwordForm.newPassword
                    }
                    onChange={(e) =>
                      setPasswordForm({
                        ...passwordForm,
                        newPassword:
                          e.target.value,
                      })
                    }
                    className="h-10 w-full rounded-lg border border-gray-200 px-3 pr-10 text-xs outline-none focus:border-[#C87532]"
                    placeholder="Enter new password"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowNewPassword(
                        (prev) => !prev
                      )
                    }
                    className="absolute right-0 top-0 flex h-10 w-10 items-center justify-center text-gray-400 transition hover:text-[#18352A]"
                    aria-label={
                      showNewPassword
                        ? "Hide new password"
                        : "Show new password"
                    }
                  >
                    {showNewPassword ? (
                      <EyeOff size={15} />
                    ) : (
                      <Eye size={15} />
                    )}
                  </button>

                </div>
              </div>

              {/* CONFIRM PASSWORD */}

              <div>

                <label className="mb-1.5 block text-[10px] font-semibold text-gray-600">
                  Confirm New Password
                </label>

                <div className="relative">

                  <input
                    type={
                      showConfirmPassword
                        ? "text"
                        : "password"
                    }
                    value={
                      passwordForm.confirmPassword
                    }
                    onChange={(e) =>
                      setPasswordForm({
                        ...passwordForm,
                        confirmPassword:
                          e.target.value,
                      })
                    }
                    className="h-10 w-full rounded-lg border border-gray-200 px-3 pr-10 text-xs outline-none focus:border-[#C87532]"
                    placeholder="Confirm new password"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword(
                        (prev) => !prev
                      )
                    }
                    className="absolute right-0 top-0 flex h-10 w-10 items-center justify-center text-gray-400 transition hover:text-[#18352A]"
                    aria-label={
                      showConfirmPassword
                        ? "Hide confirm password"
                        : "Show confirm password"
                    }
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={15} />
                    ) : (
                      <Eye size={15} />
                    )}
                  </button>

                </div>
              </div>

              {/* MESSAGE */}

              {passwordMessage && (
                <div className="rounded-lg bg-[#F7F5F0] px-3 py-2 text-[10px] font-medium text-[#A66A2C]">
                  {passwordMessage}
                </div>
              )}

            </div>

            {/* MODAL FOOTER */}

            <div className="flex justify-end gap-2 border-t border-gray-100 bg-gray-50 px-5 py-3">

              <button
                type="button"
                onClick={() =>
                  setShowChangePassword(
                    false
                  )
                }
                className="rounded-lg border border-gray-200 px-4 py-2 text-[10px] font-semibold text-gray-600 hover:bg-white"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={
                  handlePasswordSave
                }
                className="flex items-center gap-1.5 rounded-lg bg-[#18352A] px-4 py-2 text-[10px] font-semibold text-white hover:bg-[#244B39]"
              >
                <LockKeyhole
                  size={13}
                />

                Update Password
              </button>

            </div>

          </div>
        </div>
      )}
    </main>
  );
}