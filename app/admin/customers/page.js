"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Users,
  UserRound,
  UserCheck,
  UserX,
  Search,
  RefreshCw,
  Plus,
  Edit3,
  Trash2,
  X,
  Save,
  Phone,
  Mail,
  MapPin,
  Building2,
  FileText,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  PanelRight,
  CheckCircle2,
  Camera,
  Upload,
} from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const SOURCE_OPTIONS = [
  "website",
  "enquiry",
  "whatsapp",
  "phone",
  "walk-in",
  "referral",
  "other",
];

const STATUS_OPTIONS = ["active", "inactive"];

export default function AdminCustomersPage() {
  const router = useRouter();

  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sourceFilter, setSourceFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(15);

  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [isPaneOpen, setIsPaneOpen] = useState(true);

  const [sidebarWidth, setSidebarWidth] = useState(325);
  const [isResizingPane, setIsResizingPane] = useState(false);

  const [showCustomerModal, setShowCustomerModal] = useState(false);

  const [editingCustomer, setEditingCustomer] = useState(null);

  const [isSaving, setIsSaving] = useState(false);

  /* =========================================================
     AUTH
  ========================================================= */

  const getToken = () => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("adminToken");
  };

  /* =========================================================
     FETCH CUSTOMERS
  ========================================================= */

  const fetchCustomers = async () => {
    const token = getToken();

    if (!token) {
      router.push("/admin/login");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/customers`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to fetch customers"
        );
      }

      const customerList = Array.isArray(data.customers)
        ? data.customers
        : Array.isArray(data.data)
          ? data.data
          : [];

      const customersWithPhotos = customerList.map((customer) => {
        let savedPhoto = "";

        try {
          savedPhoto =
            localStorage.getItem(
              `customerProfilePhoto_${customer._id}`
            ) || "";
        } catch {
          savedPhoto = "";
        }

        return savedPhoto
          ? { ...customer, photo: savedPhoto }
          : customer;
      });

      setCustomers(customersWithPhotos);
    } catch (error) {
      console.error("Fetch customers error:", error);
      alert(
        error.message || "Failed to fetch customers"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  /* =========================================================
     HELPERS
  ========================================================= */

  const getInitials = (name) => {
    if (!name) return "CU";

    return name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase();
  };

  const formatDate = (date) => {
    if (!date) return "-";

    const parsed = new Date(date);

    if (Number.isNaN(parsed.getTime())) return "-";

    return parsed.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getDateOnly = (date) => {
    if (!date) return null;

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) return null;

    const year = parsedDate.getFullYear();
    const month = String(
      parsedDate.getMonth() + 1
    ).padStart(2, "0");
    const day = String(
      parsedDate.getDate()
    ).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  const formatSource = (source) => {
    if (!source) return "Unknown";

    return source
      .replace(/-/g, " ")
      .replace(/\b\w/g, (letter) =>
        letter.toUpperCase()
      );
  };

  /* =========================================================
     DYNAMIC STATS
  ========================================================= */

  const stats = useMemo(() => {
    const total = customers.length;

    const active = customers.filter(
      (customer) =>
        (customer.status || "active").toLowerCase() ===
        "active"
    ).length;

    const inactive = customers.filter(
      (customer) =>
        (customer.status || "").toLowerCase() ===
        "inactive"
    ).length;

    const now = new Date();

    const newCustomers = customers.filter((customer) => {
      if (!customer.createdAt) return false;

      const created = new Date(customer.createdAt);

      if (Number.isNaN(created.getTime())) return false;

      const difference =
        (now.getTime() - created.getTime()) /
        (1000 * 60 * 60 * 24);

      return difference <= 7;
    }).length;

    return {
      total,
      active,
      inactive,
      newCustomers,
    };
  }, [customers]);

  /* =========================================================
     FILTER
  ========================================================= */

  const filteredCustomers = useMemo(() => {
    const query = search.trim().toLowerCase();

    return customers.filter((customer) => {
      const status = (
        customer.status || "active"
      ).toLowerCase();

      const source = (
        customer.source || "other"
      ).toLowerCase();

      const searchMatch =
        !query ||
        customer.name?.toLowerCase().includes(query) ||
        customer.email?.toLowerCase().includes(query) ||
        customer.phone?.toLowerCase().includes(query) ||
        customer.company?.toLowerCase().includes(query) ||
        customer.location?.toLowerCase().includes(query) ||
        customer.notes?.toLowerCase().includes(query) ||
        source.includes(query);

      const statusMatch =
        statusFilter === "all" ||
        status === statusFilter;

      const sourceMatch =
        sourceFilter === "all" ||
        source === sourceFilter;

      const matchesDate =
        !dateFilter ||
        getDateOnly(customer.createdAt) === dateFilter;

      return (
        searchMatch &&
        statusMatch &&
        sourceMatch &&
        matchesDate
      );
    });
  }, [
    customers,
    search,
    statusFilter,
    sourceFilter,
    dateFilter,
  ]);

  /* =========================================================
     PAGINATION
  ========================================================= */

  useEffect(() => {
    setCurrentPage(1);
  }, [
    search,
    statusFilter,
    sourceFilter,
    dateFilter,
    itemsPerPage,
  ]);

  const totalPages =
    Math.ceil(
      filteredCustomers.length / itemsPerPage
    ) || 1;

  const paginatedCustomers = useMemo(() => {
    const start =
      (currentPage - 1) * itemsPerPage;

    return filteredCustomers.slice(
      start,
      start + itemsPerPage
    );
  }, [
    filteredCustomers,
    currentPage,
    itemsPerPage,
  ]);

  /* =========================================================
     CREATE
  ========================================================= */

  const createCustomer = async (formData) => {
    const token = getToken();

    if (!token) {
      router.push("/admin/login");
      return;
    }

    setIsSaving(true);

    try {
      const { photo, ...customerData } = formData;

      const response = await fetch(
        `${API_URL}/api/customers`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(customerData),
        }
      );

      const data = await response
        .json()
        .catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to create customer"
        );
      }

      const newCustomer = data.customer;

      if (newCustomer) {
        if (photo) {
          try {
            localStorage.setItem(
              `customerProfilePhoto_${newCustomer._id}`,
              photo
            );
          } catch (storageError) {
            console.error(
              "Photo storage error:",
              storageError
            );
          }

          newCustomer.photo = photo;
        }

        setCustomers((prev) => [
          newCustomer,
          ...prev,
        ]);

        setSelectedCustomer(newCustomer);
        setIsPaneOpen(true);
      }

      setShowCustomerModal(false);

      alert(
        "Customer created successfully."
      );
    } catch (error) {
      console.error(
        "Create customer error:",
        error
      );

      alert(
        error.message ||
          "Failed to create customer"
      );
    } finally {
      setIsSaving(false);
    }
  };

  /* =========================================================
     UPDATE
  ========================================================= */

  const updateCustomer = async (
    id,
    formData
  ) => {
    const token = getToken();

    if (!token) {
      router.push("/admin/login");
      return false;
    }

    setIsSaving(true);

    try {
      const response = await fetch(
        `${API_URL}/api/customers/${id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response
        .json()
        .catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to update customer"
        );
      }

      const updatedCustomer =
        data.customer;

      if (updatedCustomer) {
        let savedPhoto = "";

        try {
          savedPhoto =
            localStorage.getItem(
              `customerProfilePhoto_${id}`
            ) || "";
        } catch {
          savedPhoto = "";
        }

        const customerWithPhoto =
          savedPhoto
            ? {
                ...updatedCustomer,
                photo: savedPhoto,
              }
            : updatedCustomer;

        setCustomers((prev) =>
          prev.map((customer) =>
            customer._id === id
              ? customerWithPhoto
              : customer
          )
        );

        setSelectedCustomer(
          customerWithPhoto
        );
      }

      setEditingCustomer(null);
      setShowCustomerModal(false);

      alert(
        "Customer updated successfully."
      );

      return true;
    } catch (error) {
      console.error(
        "Update customer error:",
        error
      );

      alert(
        error.message ||
          "Failed to update customer"
      );

      return false;
    } finally {
      setIsSaving(false);
    }
  };

  /* =========================================================
     DELETE
  ========================================================= */

  const deleteCustomer = async (id) => {
    const customer = customers.find(
      (item) => item._id === id
    );

    if (!customer) return;

    const confirmed = window.confirm(
      `Delete customer "${
        customer.name || "this customer"
      }"?`
    );

    if (!confirmed) return;

    const token = getToken();

    if (!token) {
      router.push("/admin/login");
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/api/customers/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response
        .json()
        .catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to delete customer"
        );
      }

      setCustomers((prev) =>
        prev.filter(
          (item) => item._id !== id
        )
      );

      try {
        localStorage.removeItem(
          `customerProfilePhoto_${id}`
        );
      } catch {}

      if (
        selectedCustomer?._id === id
      ) {
        setSelectedCustomer(null);
        setEditingCustomer(null);
        setIsPaneOpen(false);
      }

      alert(
        "Customer deleted successfully."
      );
    } catch (error) {
      console.error(
        "Delete customer error:",
        error
      );

      alert(
        error.message ||
          "Failed to delete customer"
      );
    }
  };

  /* =========================================================
     OPEN EDIT
  ========================================================= */

  const openEditCustomer = (customer) => {
    setSelectedCustomer(customer);
    setIsPaneOpen(true);
    setEditingCustomer(customer);
  };

  /* =========================================================
     OPEN PROFILE
  ========================================================= */

  const openCustomer = (customer) => {
    setSelectedCustomer(customer);
    setEditingCustomer(null);
    setIsPaneOpen(true);
  };

  /* =========================================================
     RESIZE PROFILE
  ========================================================= */

  useEffect(() => {
    if (!isResizingPane) return;

    const handleMouseMove = (e) => {
      const newWidth =
        window.innerWidth - e.clientX;

      setSidebarWidth(
        Math.min(
          650,
          Math.max(260, newWidth)
        )
      );
    };

    const handleMouseUp = () => {
      setIsResizingPane(false);
    };

    document.addEventListener(
      "mousemove",
      handleMouseMove
    );

    document.addEventListener(
      "mouseup",
      handleMouseUp
    );

    document.body.style.cursor =
      "col-resize";

    document.body.style.userSelect =
      "none";

    return () => {
      document.removeEventListener(
        "mousemove",
        handleMouseMove
      );

      document.removeEventListener(
        "mouseup",
        handleMouseUp
      );

      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };
  }, [isResizingPane]);

  const drawerOpen =
    selectedCustomer && isPaneOpen;

  return (
    <div className="min-h-[calc(100vh-64px)] overflow-x-hidden px-1.5 py-2 sm:px-3 lg:px-4">
      <div className="mx-auto max-w-[1600px]">

        {/* HEADER */}

        <div className="mb-2.5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">

          <div className="min-w-0">
            <div className="flex items-center gap-1.5">

              <Users
                size={16}
                className="shrink-0 text-[#C87532]"
              />

              <h1 className="truncate text-base font-bold text-[#18352A] sm:text-lg">
                Customers
              </h1>

              <span className="rounded-full border border-[#C87532]/30 bg-[#FFF7EF] px-2 py-0.5 text-[9px] font-semibold text-[#C87532] sm:text-xs">
                Live: {filteredCustomers.length}
              </span>

            </div>

            <p className="mt-0.5 text-[9px] text-[#7A8790]">
              Manage customer profiles and enquiry records
            </p>
          </div>

          <div className="flex items-center gap-1">

            <button
              type="button"
              onClick={() =>
                setShowCustomerModal(true)
              }
              className="flex items-center gap-1 rounded bg-[#C87532] px-2.5 py-1.5 text-[10px] font-semibold text-white shadow-sm transition hover:bg-[#B06326]"
            >
              <Plus size={12} />
              Add Customer
            </button>

            <button
              type="button"
              onClick={async () => {
                setSyncing(true);
                await fetchCustomers();
                setSyncing(false);
              }}
              className="flex items-center gap-1 rounded border border-[#DDE3E8] bg-white px-2.5 py-1.5 text-[10px] font-medium text-[#18352A] transition hover:bg-[#F5F7FA]"
            >
              <RefreshCw
                size={11}
                className={
                  syncing
                    ? "animate-spin"
                    : ""
                }
              />
              Sync
            </button>

            <button
              type="button"
              onClick={() =>
                setIsPaneOpen(
                  (prev) => !prev
                )
              }
              className={`hidden h-7 w-7 items-center justify-center rounded border sm:flex ${
                drawerOpen
                  ? "border-[#C87532] bg-[#FFF7EF] text-[#C87532]"
                  : "border-[#DDE3E8] bg-white text-gray-600"
              }`}
              title="Toggle Customer Profile"
            >
              <PanelRight size={13} />
            </button>

          </div>
        </div>

        {/* STAT CARDS */}

        <div className="mb-2.5 grid grid-cols-2 gap-1.5 sm:grid-cols-4">

          <StatCard
            icon={Users}
            label="Total Customers"
            value={stats.total}
            active={
              statusFilter === "all"
            }
            onClick={() =>
              setStatusFilter("all")
            }
            iconBg="bg-orange-50"
            iconColor="text-[#C87532]"
          />

          <StatCard
            icon={UserCheck}
            label="Active"
            value={stats.active}
            active={
              statusFilter === "active"
            }
            onClick={() =>
              setStatusFilter("active")
            }
            iconBg="bg-emerald-50"
            iconColor="text-emerald-600"
          />

          <StatCard
            icon={UserX}
            label="Inactive"
            value={stats.inactive}
            active={
              statusFilter === "inactive"
            }
            onClick={() =>
              setStatusFilter("inactive")
            }
            iconBg="bg-red-50"
            iconColor="text-red-600"
          />

          <StatCard
            icon={UserRound}
            label="New · Last 7 Days"
            value={stats.newCustomers}
            iconBg="bg-blue-50"
            iconColor="text-blue-600"
          />

        </div>

        {/* FILTER BAR */}

        <div className="mb-2 flex flex-col gap-1.5">

          <div className="flex flex-col gap-1.5 sm:flex-row sm:items-center sm:justify-between">

            <div className="flex min-w-0 flex-1 items-center gap-1.5 sm:max-w-[440px]">

              <div className="relative min-w-0 flex-1">

                <Search
                  size={11}
                  className="pointer-events-none absolute left-2 top-1/2 -translate-y-1/2 text-[#7A8790]"
                />

                <input
                  type="text"
                  value={search}
                  onChange={(e) =>
                    setSearch(e.target.value)
                  }
                  placeholder="Search name, phone, email, company..."
                  className="h-7 w-full rounded border border-[#DDE3E8] bg-white pl-6 pr-2 text-[10px] outline-none transition focus:border-[#C87532] sm:text-[11px]"
                />

              </div>

              <div className="relative shrink-0">

                <CalendarDays
                  size={11}
                  className="pointer-events-none absolute left-2 top-1/2 -translate-y-1/2 text-[#7A8790]"
                />

                <input
                  type="date"
                  value={dateFilter}
                  onChange={(e) => {
                    setDateFilter(
                      e.target.value
                    );
                    setCurrentPage(1);
                  }}
                  className="h-7 w-[125px] rounded border border-[#DDE3E8] bg-white pl-6 pr-1.5 text-[10px] text-[#18352A] outline-none focus:border-[#C87532]"
                  title="Filter by customer created date"
                />

              </div>

            </div>

            <div className="flex flex-wrap gap-1">

              <select
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(
                    e.target.value
                  )
                }
                className="h-7 rounded border border-[#DDE3E8] bg-white px-2 text-[10px] font-medium text-[#18352A] outline-none"
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

              <select
                value={sourceFilter}
                onChange={(e) =>
                  setSourceFilter(
                    e.target.value
                  )
                }
                className="h-7 rounded border border-[#DDE3E8] bg-white px-2 text-[10px] font-medium text-[#18352A] outline-none"
              >
                <option value="all">
                  All Sources
                </option>

                {SOURCE_OPTIONS.map(
                  (source) => (
                    <option
                      key={source}
                      value={source}
                    >
                      {formatSource(
                        source
                      )}
                    </option>
                  )
                )}
              </select>

              <select
                value={itemsPerPage}
                onChange={(e) =>
                  setItemsPerPage(
                    Number(e.target.value)
                  )
                }
                className="h-7 rounded border border-[#DDE3E8] bg-white px-2 text-[10px] font-medium text-[#18352A] outline-none"
              >
                <option value={10}>
                  10
                </option>
                <option value={15}>
                  15
                </option>
                <option value={25}>
                  25
                </option>
                <option value={50}>
                  50
                </option>
              </select>

            </div>
          </div>
        </div>

        {/* MAIN CRM LAYOUT */}

        <div className="flex w-full min-w-0 flex-row gap-0 overflow-hidden">

          {/* TABLE */}

          <div className="min-w-0 flex-1 basis-0 overflow-hidden">

            <div className="overflow-hidden rounded border border-[#DDE3E8] bg-white shadow-sm">

              <div className="flex items-center justify-between border-b border-[#EEF1F3] bg-[#F5F7FA] px-2.5 py-1.5">

                <span className="text-[9px] text-[#66734A] sm:text-[10px]">
                  Showing{" "}
                  <b className="text-[#18352A]">
                    {filteredCustomers.length
                      ? (currentPage - 1) *
                          itemsPerPage +
                        1
                      : 0}
                  </b>
                  {" - "}
                  <b className="text-[#18352A]">
                    {Math.min(
                      currentPage *
                        itemsPerPage,
                      filteredCustomers.length
                    )}
                  </b>
                  {" of "}
                  <b className="text-[#18352A]">
                    {filteredCustomers.length}
                  </b>
                </span>

                <div className="flex items-center gap-1">

                  <button
                    type="button"
                    disabled={
                      currentPage === 1
                    }
                    onClick={() =>
                      setCurrentPage(
                        (page) =>
                          Math.max(
                            page - 1,
                            1
                          )
                      )
                    }
                    className="rounded border bg-white p-0.5 disabled:opacity-30"
                  >
                    <ChevronLeft size={12} />
                  </button>

                  <span className="px-1 text-[9px] font-medium text-[#18352A]">
                    {currentPage}/
                    {totalPages}
                  </span>

                  <button
                    type="button"
                    disabled={
                      currentPage ===
                      totalPages
                    }
                    onClick={() =>
                      setCurrentPage(
                        (page) =>
                          Math.min(
                            page + 1,
                            totalPages
                          )
                      )
                    }
                    className="rounded border bg-white p-0.5 disabled:opacity-30"
                  >
                    <ChevronRight size={12} />
                  </button>

                </div>
              </div>

              {/* MOBILE COMPACT FIX: Smooth Horizontal Scroll Container */}
              <div className="w-full overflow-x-auto">

                <table className="w-full min-w-[850px] border-collapse text-left text-xs sm:table-fixed sm:min-w-0">

                  <colgroup>
                    <col className="w-[17%]" />
                    <col className="w-[11%]" />
                    <col className="w-[17%]" />
                    <col className="w-[13%]" />
                    <col className="w-[12%]" />
                    <col className="w-[9%]" />
                    <col className="w-[9%]" />
                    <col className="w-[9%]" />
                    <col className="w-[8%]" />
                  </colgroup>

                  <thead>
                    <tr className="border-b border-[#EEF1F3] bg-[#F8FAFB] text-[9px] font-semibold uppercase tracking-wider text-[#66734A]">

                      <th className="whitespace-nowrap px-2.5 py-2">
                        Customer
                      </th>

                      <th className="whitespace-nowrap px-2 py-2">
                        Contact
                      </th>

                      <th className="whitespace-nowrap px-2 py-2">
                        Email
                      </th>

                      <th className="whitespace-nowrap px-2 py-2">
                        Company
                      </th>

                      <th className="whitespace-nowrap px-2 py-2">
                        Location
                      </th>

                      <th className="whitespace-nowrap px-2 py-2">
                        Source
                      </th>

                      <th className="whitespace-nowrap px-2 py-2">
                        Status
                      </th>

                      <th className="whitespace-nowrap px-2 py-2">
                        Created
                      </th>

                      <th className="whitespace-nowrap px-1.5 py-2 text-right">
                        Action
                      </th>

                    </tr>
                  </thead>

                  <tbody className="divide-y divide-[#EEF1F3]">

                    {loading ? (

                      <tr>
                        <td
                          colSpan={9}
                          className="py-12 text-center"
                        >
                          <RefreshCw
                            size={18}
                            className="mx-auto animate-spin text-[#C87532]"
                          />

                          <p className="mt-2 text-[10px] text-[#7A8790]">
                            Loading customers...
                          </p>
                        </td>
                      </tr>

                    ) : paginatedCustomers.length === 0 ? (

                      <tr>
                        <td
                          colSpan={9}
                          className="py-12 text-center"
                        >
                          <div className="flex flex-col items-center justify-center">

                            <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-full bg-[#F5F7FA]">
                              <Users
                                size={17}
                                className="text-[#7A8790]"
                              />
                            </div>

                            <p className="text-xs font-semibold text-[#18352A]">
                              No customers found
                            </p>

                            <p className="mt-0.5 text-[9px] text-[#7A8790]">
                              Try changing your search or filters.
                            </p>

                          </div>
                        </td>
                      </tr>

                    ) : (

                      paginatedCustomers.map(
                        (customer) => {

                          const status =
                            (
                              customer.status ||
                              "active"
                            ).toLowerCase();

                          const isSelected =
                            selectedCustomer?._id ===
                            customer._id;

                          return (
                            <tr
                              key={customer._id}
                              onClick={() =>
                                openCustomer(
                                  customer
                                )
                              }
                              className={`cursor-pointer transition hover:bg-[#F8FAFB] ${
                                isSelected
                                  ? "bg-[#FFF7EF]"
                                  : ""
                              }`}
                            >

                              {/* CUSTOMER */}

                              <td className="max-w-0 px-2.5 py-2">

                                <div className="flex min-w-0 items-center gap-2">

                                  <div className="flex h-7 w-7 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#18352A] text-[9px] font-bold text-white">

                                    {customer.photo ? (
                                      <img
                                        src={
                                          customer.photo
                                        }
                                        alt=""
                                        className="h-full w-full object-cover"
                                      />
                                    ) : (
                                      getInitials(
                                        customer.name
                                      )
                                    )}

                                  </div>

                                  <div className="min-w-0">

                                    <p className="truncate text-[10.5px] font-semibold text-[#18352A]">
                                      {customer.name ||
                                        "Unnamed Customer"}
                                    </p>

                                    <p className="truncate text-[8.5px] text-[#7A8790]">
                                      ID:{" "}
                                      {customer._id?.slice(
                                        -8
                                      )}
                                    </p>

                                  </div>

                                </div>
                              </td>

                              {/* CONTACT */}

                              <td className="max-w-0 px-2 py-2">

                                {customer.phone && (
                                  <a
                                    href={`tel:${customer.phone}`}
                                    onClick={(e) =>
                                      e.stopPropagation()
                                    }
                                    className="flex min-w-0 items-center gap-1 text-[9.5px] font-medium text-[#18352A] hover:text-[#C87532]"
                                  >
                                    <Phone
                                      size={9}
                                      className="shrink-0 text-[#7A8790]"
                                    />

                                    <span className="truncate">
                                      {
                                        customer.phone
                                      }
                                    </span>
                                  </a>
                                )}

                              </td>

                              {/* EMAIL */}

                              <td className="max-w-0 px-2 py-2">

                                {customer.email && (
                                  <a
                                    href={`mailto:${customer.email}`}
                                    onClick={(e) =>
                                      e.stopPropagation()
                                    }
                                    className="flex min-w-0 items-center gap-1 text-[9px] text-[#66734A] hover:text-[#C87532]"
                                  >
                                    <Mail
                                      size={9}
                                      className="shrink-0"
                                    />

                                    <span className="truncate">
                                      {
                                        customer.email
                                      }
                                    </span>
                                  </a>
                                )}

                              </td>

                              {/* COMPANY */}

                              <td className="max-w-0 px-2 py-2">

                                {customer.company ? (
                                  <span className="flex min-w-0 items-center gap-1 truncate text-[9.5px] font-medium text-[#53605A]">

                                    <Building2
                                      size={9}
                                      className="shrink-0 text-[#7A8790]"
                                    />

                                    <span className="truncate">
                                      {
                                        customer.company
                                      }
                                    </span>

                                  </span>
                                ) : (
                                  <span className="text-[9px] text-gray-400">
                                    -
                                  </span>
                                )}

                              </td>

                              {/* LOCATION */}

                              <td className="max-w-0 px-2 py-2">

                                {customer.location ? (
                                  <span className="flex min-w-0 items-center gap-1 truncate text-[9.5px] font-medium text-[#66734A]">

                                    <MapPin
                                      size={9}
                                      className="shrink-0 text-[#C87532]"
                                    />

                                    <span className="truncate">
                                      {
                                        customer.location
                                      }
                                    </span>

                                  </span>
                                ) : (
                                  <span className="text-[9px] text-gray-400">
                                    -
                                  </span>
                                )}

                              </td>

                              {/* SOURCE */}

                              <td className="px-2 py-2">

                                <span className="inline-flex max-w-full truncate rounded border border-[#DDE3E8] bg-[#F8FAFB] px-1.5 py-0.5 text-[8.5px] font-medium text-[#53605A]">
                                  {formatSource(
                                    customer.source
                                  )}
                                </span>

                              </td>

                              {/* STATUS */}

                              <td className="px-2 py-2">

                                <span
                                  className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[8.5px] font-medium ${
                                    status === "active"
                                      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                                      : "border-red-200 bg-red-50 text-red-700"
                                  }`}
                                >

                                  <span
                                    className={`h-1.5 w-1.5 rounded-full ${
                                      status === "active"
                                        ? "bg-emerald-500"
                                        : "bg-red-500"
                                    }`}
                                  />

                                  {status === "active"
                                    ? "Active"
                                    : "Inactive"}

                                </span>

                              </td>

                              {/* CREATED */}

                              <td className="px-2 py-2">

                                <span className="flex items-center gap-1 whitespace-nowrap text-[9px] text-[#66734A]">

                                  <CalendarDays
                                    size={9}
                                  />

                                  {formatDate(
                                    customer.createdAt
                                  )}

                                </span>

                              </td>

                              {/* ACTION */}

                              <td
                                className="px-1.5 py-2 text-right"
                                onClick={(e) =>
                                  e.stopPropagation()
                                }
                              >

                                <div className="flex items-center justify-end gap-1">

                                  <button
                                    type="button"
                                    onClick={() =>
                                      openEditCustomer(
                                        customer
                                      )
                                    }
                                    className="rounded border border-[#DDE3E8] bg-[#F8FAFB] p-1 text-[#18352A] transition hover:bg-[#18352A] hover:text-white"
                                    title="Edit Customer"
                                  >
                                    <Edit3 size={10} />
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() =>
                                      deleteCustomer(
                                        customer._id
                                      )
                                    }
                                    className="rounded border border-red-200 bg-red-50 p-1 text-red-700 transition hover:bg-red-100"
                                    title="Delete Customer"
                                  >
                                    <Trash2 size={10} />
                                  </button>

                                </div>

                              </td>

                            </tr>
                          );
                        }
                      )

                    )}

                  </tbody>

                </table>

              </div>
            </div>
          </div>

          {/* DESKTOP PROFILE */}

          {drawerOpen && (
            <div
              className="relative hidden h-full min-w-0 shrink-0 lg:flex"
              style={{
                width: `${sidebarWidth}px`,
                minWidth: `${sidebarWidth}px`,
                maxWidth: `${sidebarWidth}px`,
              }}
            >

              <div
                onMouseDown={() =>
                  setIsResizingPane(true)
                }
                className="absolute left-0 top-0 z-20 h-full w-1 cursor-col-resize bg-transparent hover:bg-[#C87532]/30"
                title="Drag to resize"
              />

              <CustomerProfile
                customer={selectedCustomer}
                onClose={() => {
                  setEditingCustomer(null);
                  setIsPaneOpen(false);
                }}
                onEdit={() =>
                  setEditingCustomer(
                    selectedCustomer
                  )
                }
                onCancelEdit={() =>
                  setEditingCustomer(null)
                }
                onSave={updateCustomer}
                onDelete={deleteCustomer}
                formatDate={formatDate}
                formatSource={formatSource}
                isEditing={
                  editingCustomer?._id ===
                  selectedCustomer?._id
                }
                isSaving={isSaving}
              />

            </div>
          )}

        </div>
      </div>

      {/* MOBILE PROFILE */}

      {drawerOpen && (
        <div className="fixed inset-0 z-[60] overflow-hidden bg-white lg:hidden">

          <CustomerProfile
            customer={selectedCustomer}
            onClose={() => {
              setEditingCustomer(null);
              setIsPaneOpen(false);
            }}
            onEdit={() =>
              setEditingCustomer(
                selectedCustomer
              )
            }
            onCancelEdit={() =>
              setEditingCustomer(null)
            }
            onSave={updateCustomer}
            onDelete={deleteCustomer}
            formatDate={formatDate}
            formatSource={formatSource}
            isEditing={
              editingCustomer?._id ===
              selectedCustomer?._id
            }
            isSaving={isSaving}
            mobile
          />

        </div>
      )}

      {/* ADD CUSTOMER */}

      {showCustomerModal && (
        <CustomerFormModal
          customer={null}
          isSaving={isSaving}
          onClose={() => {
            if (!isSaving) {
              setShowCustomerModal(false);
            }
          }}
          onSubmit={createCustomer}
        />
      )}

    </div>
  );
}

/* =========================================================
   STAT CARD
========================================================= */

function StatCard({
  icon: Icon,
  label,
  value,
  active,
  onClick,
  iconBg,
  iconColor,
}) {
  return (
    <div
      onClick={onClick}
      className={`cursor-pointer rounded border p-2 shadow-sm transition ${
        active
          ? "border-[#C87532] bg-[#FFF7EF]"
          : "border-[#DDE3E8] bg-white hover:bg-[#F8FAFB]"
      }`}
    >

      <div className="flex items-center justify-between">

        <div
          className={`flex h-6 w-6 items-center justify-center rounded ${iconBg}`}
        >
          <Icon
            size={12}
            className={iconColor}
          />
        </div>

        <span className="text-[9px] font-medium text-[#7A8790]">
          Live
        </span>

      </div>

      <p className="mt-1 text-base font-bold text-[#18352A]">
        {value}
      </p>

      <p className="truncate text-[8.5px] text-[#66734A]">
        {label}
      </p>

    </div>
  );
}

/* =========================================================
   CUSTOMER PROFILE
========================================================= */

function CustomerProfile({
  customer,
  onClose,
  onEdit,
  onCancelEdit,
  onSave,
  onDelete,
  formatDate,
  formatSource,
  isEditing,
  isSaving,
  mobile = false,
}) {
  const [profilePhoto, setProfilePhoto] =
    useState("");

  const [formData, setFormData] =
    useState({
      name: "",
      email: "",
      phone: "",
      company: "",
      location: "",
      notes: "",
      source: "enquiry",
      status: "active",
    });

  /* PROFILE PHOTO */

  useEffect(() => {
    if (!customer?._id) return;

    const savedPhoto =
      localStorage.getItem(
        `customerProfilePhoto_${customer._id}`
      );

    setProfilePhoto(
      savedPhoto ||
        customer.photo ||
        ""
    );
  }, [customer]);

  /* EDIT FORM */

  useEffect(() => {
    if (!customer) return;

    setFormData({
      name: customer.name || "",
      email: customer.email || "",
      phone: customer.phone || "",
      company: customer.company || "",
      location: customer.location || "",
      notes: customer.notes || "",
      source:
        customer.source ||
        "enquiry",
      status:
        customer.status ||
        "active",
    });
  }, [customer, isEditing]);

  if (!customer) return null;

  const status =
    (
      customer.status ||
      "active"
    ).toLowerCase();

  const getInitials = (name) => {
    if (!name) return "CU";

    return name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((word) =>
        word.charAt(0)
      )
      .join("")
      .toUpperCase();
  };

  const updateField = (
    field,
    value
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  /* SAVE EDIT */

  const handleEditSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.name.trim() ||
      !formData.email.trim() ||
      !formData.phone.trim()
    ) {
      alert(
        "Name, email and phone are required."
      );
      return;
    }

    const success = await onSave(
      customer._id,
      {
        ...formData,
        name: formData.name.trim(),
        email: formData.email
          .trim()
          .toLowerCase(),
        phone: formData.phone.trim(),
        company:
          formData.company.trim(),
        location:
          formData.location.trim(),
        notes:
          formData.notes.trim(),
      }
    );

    if (success) {
      onCancelEdit();
    }
  };

  /* PHOTO UPLOAD */

  const handlePhotoUpload = (e) => {
    const file =
      e.target.files?.[0];

    if (!file) return;

    if (
      !file.type.startsWith(
        "image/"
      )
    ) {
      alert(
        "Please select an image file."
      );
      return;
    }

    if (
      file.size >
      2 * 1024 * 1024
    ) {
      alert(
        "Please select an image smaller than 2MB."
      );
      return;
    }

    const reader =
      new FileReader();

    reader.onload = () => {
      const image =
        reader.result;

      setProfilePhoto(image);

      localStorage.setItem(
        `customerProfilePhoto_${customer._id}`,
        image
      );
    };

    reader.readAsDataURL(file);

    e.target.value = "";
  };

  const removePhoto = () => {
    setProfilePhoto("");

    localStorage.removeItem(
      `customerProfilePhoto_${customer._id}`
    );
  };

  return (
    <aside className="flex h-full min-h-0 min-w-0 w-full flex-col overflow-hidden border-l border-[#DDE3E8] bg-white">

      {/* HEADER */}

      <div className="flex shrink-0 items-center justify-between border-b border-[#EEF1F3] bg-[#F5F7FA] px-2.5 py-1.5">

        <div>

          <p className="text-[9px] font-bold uppercase tracking-wider text-[#7A8790]">
            Customer Profile
          </p>

          <p className="text-[8px] text-[#A0A8AD]">
            Customer Record
          </p>

        </div>

        <div className="flex items-center gap-1">

          {!isEditing && (
            <button
              type="button"
              onClick={onEdit}
              className="flex items-center gap-1 rounded bg-[#18352A] px-2 py-1 text-[9px] font-semibold text-white transition hover:bg-[#244C3C]"
            >
              <Edit3 size={10} />
              Edit
            </button>
          )}

          <button
            type="button"
            onClick={() => {
              if (isEditing) {
                onCancelEdit();
              } else {
                onClose();
              }
            }}
            disabled={isSaving}
            className="rounded bg-white p-1 text-[#66734A] transition hover:bg-gray-100 disabled:opacity-50"
          >
            <X size={13} />
          </button>

        </div>

      </div>

      {/* BODY */}

      <div className="min-h-0 flex-1 overflow-y-auto p-2.5">

        {isEditing ? (

          /* INLINE EDIT */

          <form
            onSubmit={handleEditSubmit}
            className="space-y-2"
          >

            <div className="rounded-lg border border-[#C87532]/30 bg-[#FFF7EF] p-2.5">

              <div className="flex items-center gap-1.5">

                <Edit3
                  size={12}
                  className="text-[#C87532]"
                />

                <div>

                  <p className="text-[10px] font-bold text-[#18352A]">
                    Edit Customer
                  </p>

                  <p className="text-[8px] text-[#7A8790]">
                    Update CRM customer information
                  </p>

                </div>

              </div>

            </div>

            <ProfileSection
              icon={UserRound}
              title="Customer Information"
            >

              <InlineFormField
                label="Customer Name *"
                value={formData.name}
                onChange={(value) =>
                  updateField(
                    "name",
                    value
                  )
                }
                placeholder="Enter customer name"
              />

              <InlineFormField
                label="Phone Number *"
                value={formData.phone}
                onChange={(value) =>
                  updateField(
                    "phone",
                    value
                  )
                }
                placeholder="Enter phone number"
              />

              <InlineFormField
                label="Email Address *"
                type="email"
                value={formData.email}
                onChange={(value) =>
                  updateField(
                    "email",
                    value
                  )
                }
                placeholder="Enter email address"
              />

            </ProfileSection>

            <ProfileSection
              icon={Building2}
              title="Customer Details"
            >

              <InlineFormField
                label="Company"
                value={
                  formData.company
                }
                onChange={(value) =>
                  updateField(
                    "company",
                    value
                  )
                }
                placeholder="Company / organisation"
              />

              <InlineFormField
                label="Location"
                value={
                  formData.location
                }
                onChange={(value) =>
                  updateField(
                    "location",
                    value
                  )
                }
                placeholder="City / location"
              />

              <div>

                <label className="mb-0.5 block text-[7.5px] font-semibold uppercase text-[#7A8790]">
                  Source
                </label>

                <select
                  value={
                    formData.source
                  }
                  onChange={(e) =>
                    updateField(
                      "source",
                      e.target.value
                    )
                  }
                  className="h-7 w-full rounded border border-[#DDE3E8] bg-white px-2 text-[10px] text-[#18352A] outline-none focus:border-[#C87532]"
                >

                  {SOURCE_OPTIONS.map(
                    (source) => (
                      <option
                        key={source}
                        value={source}
                      >
                        {formatSource(
                          source
                        )}
                      </option>
                    )
                  )}

                </select>

              </div>

              <div>

                <label className="mb-0.5 block text-[7.5px] font-semibold uppercase text-[#7A8790]">
                  Status
                </label>

                <select
                  value={
                    formData.status
                  }
                  onChange={(e) =>
                    updateField(
                      "status",
                      e.target.value
                    )
                  }
                  className="h-7 w-full rounded border border-[#DDE3E8] bg-white px-2 text-[10px] text-[#18352A] outline-none focus:border-[#C87532]"
                >

                  {STATUS_OPTIONS.map(
                    (statusOption) => (
                      <option
                        key={
                          statusOption
                        }
                        value={
                          statusOption
                        }
                      >
                        {statusOption
                          .charAt(0)
                          .toUpperCase() +
                          statusOption.slice(
                            1
                          )}
                      </option>
                    )
                  )}

                </select>

              </div>

            </ProfileSection>

            <div className="rounded border border-[#DDE3E8] p-1.5">

              <div className="mb-1 flex items-center gap-1">

                <FileText
                  size={10}
                  className="text-[#C87532]"
                />

                <p className="text-[8.5px] font-semibold uppercase text-[#7A8790]">
                  Customer Notes
                </p>

              </div>

              <textarea
                rows={6}
                value={
                  formData.notes
                }
                onChange={(e) =>
                  updateField(
                    "notes",
                    e.target.value
                  )
                }
                placeholder="Add customer requirements, preferences or notes..."
                className="w-full resize-none rounded border border-[#DDE3E8] bg-white p-2 text-[10px] leading-relaxed text-[#18352A] outline-none focus:border-[#C87532]"
              />

            </div>

            <div className="sticky bottom-0 flex gap-1 border-t border-[#EEF1F3] bg-white py-2">

              <button
                type="button"
                onClick={onCancelEdit}
                disabled={isSaving}
                className="flex flex-1 items-center justify-center gap-1 rounded border border-[#DDE3E8] bg-white py-1.5 text-[10px] font-semibold text-[#66734A] hover:bg-[#F5F7FA] disabled:opacity-50"
              >
                <X size={10} />
                Cancel
              </button>

              <button
                type="submit"
                disabled={isSaving}
                className="flex flex-1 items-center justify-center gap-1 rounded bg-[#C87532] py-1.5 text-[10px] font-semibold text-white hover:bg-[#B06326] disabled:opacity-50"
              >

                {isSaving ? (
                  <>
                    <RefreshCw
                      size={11}
                      className="animate-spin"
                    />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save size={11} />
                    Save Changes
                  </>
                )}

              </button>

            </div>

          </form>

        ) : (

          /* NORMAL PROFILE */

          <>

            <div className="mb-2.5 rounded-lg border border-[#DDE3E8] bg-[#F8FAFB] p-3 text-center">

              {/* PHOTO */}

              <div className="relative mx-auto mb-2 h-16 w-16">

                <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-full border-2 border-[#C87532] bg-[#18352A] text-lg font-bold text-white shadow-sm">

                  {profilePhoto ? (
                    <img
                      src={
                        profilePhoto
                      }
                      alt={
                        customer.name ||
                        "Customer"
                      }
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    getInitials(
                      customer.name
                    )
                  )}

                </div>

                <label
                  htmlFor={`customer-photo-${customer._id}`}
                  className="absolute bottom-0 right-0 flex h-6 w-6 cursor-pointer items-center justify-center rounded-full border-2 border-white bg-[#C87532] text-white shadow-sm transition hover:bg-[#B06326]"
                  title="Upload customer photo"
                >
                  <Camera size={11} />
                </label>

                <input
                  id={`customer-photo-${customer._id}`}
                  type="file"
                  accept="image/*"
                  onChange={
                    handlePhotoUpload
                  }
                  className="hidden"
                />

              </div>

              <h2 className="truncate text-sm font-bold text-[#18352A]">
                {customer.name ||
                  "Unnamed Customer"}
              </h2>

              {customer.company && (
                <p className="mt-0.5 truncate text-[9px] text-[#7A8790]">
                  {
                    customer.company
                  }
                </p>
              )}

              <div className="mt-2 flex flex-wrap items-center justify-center gap-1">

                <span
                  className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[8.5px] font-medium ${
                    status === "active"
                      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                      : "border-red-200 bg-red-50 text-red-700"
                  }`}
                >

                  <span
                    className={`h-1.5 w-1.5 rounded-full ${
                      status === "active"
                        ? "bg-emerald-500"
                        : "bg-red-500"
                    }`}
                  />

                  {status === "active"
                    ? "Active"
                    : "Inactive"}

                </span>

                <span className="rounded border border-[#DDE3E8] bg-white px-1.5 py-0.5 text-[8.5px] font-medium text-[#66734A]">
                  {formatSource(
                    customer.source
                  )}
                </span>

              </div>

              <div className="mt-2 flex items-center justify-center gap-1">

                <label
                  htmlFor={`customer-photo-upload-${customer._id}`}
                  className="flex cursor-pointer items-center gap-1 rounded border border-[#DDE3E8] bg-white px-2 py-1 text-[8.5px] font-semibold text-[#18352A] transition hover:bg-[#F5F7FA]"
                >
                  <Upload size={9} />

                  {profilePhoto
                    ? "Change Photo"
                    : "Upload Photo"}
                </label>

                <input
                  id={`customer-photo-upload-${customer._id}`}
                  type="file"
                  accept="image/*"
                  onChange={
                    handlePhotoUpload
                  }
                  className="hidden"
                />

                {profilePhoto && (
                  <button
                    type="button"
                    onClick={
                      removePhoto
                    }
                    className="rounded border border-red-200 bg-red-50 px-2 py-1 text-[8.5px] font-semibold text-red-700 transition hover:bg-red-100"
                  >
                    Remove
                  </button>
                )}

              </div>

              <p className="mt-1 text-[7.5px] text-[#A0A8AD]">
                JPG, PNG or WEBP · Max 2MB
              </p>

            </div>

            <ProfileSection
              icon={Phone}
              title="Contact Information"
            >

              <ProfileRow
                icon={Phone}
                label="Phone"
                value={
                  customer.phone
                }
                href={
                  customer.phone
                    ? `tel:${customer.phone}`
                    : undefined
                }
              />

              <ProfileRow
                icon={Mail}
                label="Email"
                value={
                  customer.email
                }
                href={
                  customer.email
                    ? `mailto:${customer.email}`
                    : undefined
                }
              />

            </ProfileSection>

            <ProfileSection
              icon={Building2}
              title="Customer Details"
            >

              <ProfileRow
                icon={Building2}
                label="Company"
                value={
                  customer.company
                }
              />

              <ProfileRow
                icon={MapPin}
                label="Location"
                value={
                  customer.location
                }
              />

              <ProfileRow
                icon={UserRound}
                label="Source"
                value={formatSource(
                  customer.source
                )}
              />

            </ProfileSection>

            <ProfileSection
              icon={CalendarDays}
              title="Record Information"
            >

              <ProfileRow
                icon={CalendarDays}
                label="Created"
                value={formatDate(
                  customer.createdAt
                )}
              />

              <ProfileRow
                icon={CalendarDays}
                label="Updated"
                value={formatDate(
                  customer.updatedAt
                )}
              />

            </ProfileSection>

            <div className="mb-2 rounded border border-[#DDE3E8] p-1.5">

              <div className="mb-1 flex items-center gap-1">

                <FileText
                  size={10}
                  className="text-[#C87532]"
                />

                <p className="text-[8.5px] font-semibold uppercase text-[#7A8790]">
                  Customer Notes
                </p>

              </div>

              <p className="min-h-[45px] whitespace-pre-wrap break-words rounded bg-[#F8FAFB] p-1.5 text-[10px] leading-relaxed text-[#53605A]">
                {customer.notes ||
                  "No notes added yet."}
              </p>

            </div>

            <div className="rounded border border-dashed border-[#DDE3E8] bg-[#FAFBFC] p-2">

              <p className="mb-1 text-[8px] font-semibold uppercase tracking-wide text-[#7A8790]">
                CRM Activity
              </p>

              <div className="space-y-1">

                <div className="flex items-center gap-1.5 rounded bg-white p-1.5 text-[9px] text-[#7A8790]">

                  <CheckCircle2
                    size={10}
                    className="text-emerald-500"
                  />

                  Customer record available

                </div>

                <div className="flex items-center gap-1.5 rounded bg-white p-1.5 text-[9px] text-[#7A8790]">

                  <CalendarDays
                    size={10}
                    className="text-[#C87532]"
                  />

                  Follow-ups can be connected here

                </div>

              </div>

            </div>

          </>

        )}

      </div>

      {/* FOOTER */}

      {!isEditing && (
        <div className="grid shrink-0 grid-cols-2 gap-1 border-t border-[#EEF1F3] bg-[#F5F7FA] p-1">

          <button
            type="button"
            onClick={onEdit}
            className="flex items-center justify-center gap-1 rounded border border-[#DDE3E8] bg-white py-1 text-[10px] font-semibold text-[#18352A] hover:bg-[#F8FAFB]"
          >
            <Edit3 size={10} />
            Edit Customer
          </button>

          <button
            type="button"
            onClick={() =>
              onDelete(
                customer._id
              )
            }
            className="flex items-center justify-center gap-1 rounded border border-red-200 bg-red-50 py-1 text-[10px] font-semibold text-red-700 hover:bg-red-100"
          >
            <Trash2 size={10} />
            Delete
          </button>

        </div>
      )}

    </aside>
  );
}

/* =========================================================
   PROFILE SECTION
========================================================= */

function ProfileSection({
  icon: Icon,
  title,
  children,
}) {
  return (
    <div className="mb-2 rounded border border-[#DDE3E8] p-1.5">

      <div className="mb-1 flex items-center gap-1">

        <Icon
          size={10}
          className="text-[#C87532]"
        />

        <p className="text-[8.5px] font-semibold uppercase text-[#7A8790]">
          {title}
        </p>

      </div>

      <div className="space-y-1">
        {children}
      </div>

    </div>
  );
}

/* =========================================================
   PROFILE ROW
========================================================= */

function ProfileRow({
  icon: Icon,
  label,
  value,
  href,
}) {
  const content = (
    <div className="flex min-w-0 items-center gap-1.5 rounded bg-[#F8FAFB] p-1.5">

      <Icon
        size={10}
        className="shrink-0 text-[#7A8790]"
      />

      <div className="min-w-0">

        <span className="block text-[7.5px] text-[#7A8790]">
          {label}
        </span>

        <span className="block truncate text-[10px] font-medium text-[#18352A]">
          {value || "-"}
        </span>

      </div>

    </div>
  );

  if (!href) return content;

  return (
    <a
      href={href}
      onClick={(e) =>
        e.stopPropagation()
      }
      className="block hover:opacity-80"
    >
      {content}
    </a>
  );
}

/* =========================================================
   INLINE FORM FIELD
========================================================= */

function InlineFormField({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}) {
  return (
    <div>

      <label className="mb-0.5 block text-[7.5px] font-semibold uppercase text-[#7A8790]">
        {label}
      </label>

      <input
        type={type}
        value={value}
        onChange={(e) =>
          onChange(
            e.target.value
          )
        }
        placeholder={placeholder}
        className="h-7 w-full rounded border border-[#DDE3E8] bg-white px-2 text-[10px] text-[#18352A] outline-none placeholder:text-[#A0A8AD] focus:border-[#C87532]"
      />

    </div>
  );
}

/* =========================================================
   ADD CUSTOMER FORM MODAL
========================================================= */

function CustomerFormModal({
  customer,
  isSaving,
  onClose,
  onSubmit,
}) {
  const isEditing =
    Boolean(customer?._id);

  const [photoPreview, setPhotoPreview] =
    useState(
      customer?.photo || ""
    );

  const [formData, setFormData] =
    useState({
      name: customer?.name || "",
      email:
        customer?.email || "",
      phone:
        customer?.phone || "",
      company:
        customer?.company || "",
      location:
        customer?.location || "",
      notes:
        customer?.notes || "",
      source:
        customer?.source ||
        "enquiry",
      status:
        customer?.status ||
        "active",
    });

  useEffect(() => {
    setFormData({
      name:
        customer?.name || "",
      email:
        customer?.email || "",
      phone:
        customer?.phone || "",
      company:
        customer?.company || "",
      location:
        customer?.location || "",
      notes:
        customer?.notes || "",
      source:
        customer?.source ||
        "enquiry",
      status:
        customer?.status ||
        "active",
    });

    setPhotoPreview(
      customer?.photo || ""
    );
  }, [customer]);

  const updateField = (
    field,
    value
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  /* ADD CUSTOMER PHOTO */

  const handlePhotoUpload = (e) => {
    const file =
      e.target.files?.[0];

    if (!file) return;

    if (
      !file.type.startsWith(
        "image/"
      )
    ) {
      alert(
        "Please select an image file."
      );
      return;
    }

    if (
      file.size >
      2 * 1024 * 1024
    ) {
      alert(
        "Please select an image smaller than 2MB."
      );
      return;
    }

    const reader =
      new FileReader();

    reader.onload = () => {
      setPhotoPreview(
        reader.result
      );
    };

    reader.readAsDataURL(file);

    e.target.value = "";
  };

  const removePhoto = () => {
    setPhotoPreview("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !formData.name.trim() ||
      !formData.email.trim() ||
      !formData.phone.trim()
    ) {
      alert(
        "Name, email and phone are required."
      );
      return;
    }

    onSubmit({
      ...formData,
      name:
        formData.name.trim(),
      email:
        formData.email
          .trim()
          .toLowerCase(),
      phone:
        formData.phone.trim(),
      photo: photoPreview,
    });
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/40 p-3">

      <div className="w-full max-w-[520px] overflow-hidden rounded-xl border border-[#DDE3E8] bg-white shadow-2xl">

        {/* HEADER */}

        <div className="flex items-center justify-between border-b border-[#EEF1F3] bg-[#F5F7FA] px-3 py-2">

          <div>

            <h2 className="text-sm font-bold text-[#18352A]">
              {isEditing
                ? "Edit Customer"
                : "Add Customer"}
            </h2>

            <p className="text-[8.5px] text-[#7A8790]">
              {isEditing
                ? "Update customer CRM information"
                : "Create a new customer record"}
            </p>

          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            className="rounded bg-white p-1 text-[#66734A] hover:bg-gray-100 disabled:opacity-50"
          >
            <X size={14} />
          </button>

        </div>

        {/* FORM */}

        <form
          onSubmit={handleSubmit}
          className="max-h-[75vh] overflow-y-auto p-3"
        >

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">

            {/* CUSTOMER PHOTO */}

            <div className="sm:col-span-2">

              <label className="mb-0.5 block text-[8px] font-semibold uppercase text-[#7A8790]">
                Customer Photo
              </label>

              <div className="flex items-center gap-2 rounded border border-[#DDE3E8] bg-[#F8FAFB] p-2">

                <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full border border-[#C87532] bg-[#18352A] text-white">

                  {photoPreview ? (
                    <img
                      src={
                        photoPreview
                      }
                      alt="Customer"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <UserRound
                      size={18}
                    />
                  )}

                </div>

                <div className="min-w-0">

                  <label
                    htmlFor="add-customer-photo"
                    className="inline-flex cursor-pointer items-center gap-1 rounded border border-[#DDE3E8] bg-white px-2 py-1 text-[9px] font-semibold text-[#18352A] hover:bg-[#F5F7FA]"
                  >
                    <Camera size={10} />

                    {photoPreview
                      ? "Change Photo"
                      : "Upload Photo"}
                  </label>

                  <input
                    id="add-customer-photo"
                    type="file"
                    accept="image/*"
                    onChange={
                      handlePhotoUpload
                    }
                    className="hidden"
                  />

                  {photoPreview && (
                    <button
                      type="button"
                      onClick={
                        removePhoto
                      }
                      className="ml-1 rounded border border-red-200 bg-red-50 px-2 py-1 text-[9px] font-semibold text-red-700 hover:bg-red-100"
                    >
                      Remove
                    </button>
                  )}

                  <p className="mt-0.5 text-[7.5px] text-[#A0A8AD]">
                    JPG, PNG or WEBP · Max 2MB
                  </p>

                </div>

              </div>

            </div>

            <FormField
              label="Customer Name *"
              value={
                formData.name
              }
              onChange={(value) =>
                updateField(
                  "name",
                  value
                )
              }
              placeholder="Enter customer name"
            />

            <FormField
              label="Phone Number *"
              value={
                formData.phone
              }
              onChange={(value) =>
                updateField(
                  "phone",
                  value
                )
              }
              placeholder="Enter phone number"
            />

            <FormField
              label="Email Address *"
              type="email"
              value={
                formData.email
              }
              onChange={(value) =>
                updateField(
                  "email",
                  value
                )
              }
              placeholder="Enter email address"
            />

            <FormField
              label="Company"
              value={
                formData.company
              }
              onChange={(value) =>
                updateField(
                  "company",
                  value
                )
              }
              placeholder="Company / organisation"
            />

            <FormField
              label="Location"
              value={
                formData.location
              }
              onChange={(value) =>
                updateField(
                  "location",
                  value
                )
              }
              placeholder="City / location"
            />

            <div>

              <label className="mb-0.5 block text-[8px] font-semibold uppercase text-[#7A8790]">
                Source
              </label>

              <select
                value={
                  formData.source
                }
                onChange={(e) =>
                  updateField(
                    "source",
                    e.target.value
                  )
                }
                className="h-7 w-full rounded border border-[#DDE3E8] bg-white px-2 text-[10px] text-[#18352A] outline-none focus:border-[#C87532]"
              >

                {SOURCE_OPTIONS.map(
                  (source) => (
                    <option
                      key={source}
                      value={source}
                    >
                      {formatSourceText(
                        source
                      )}
                    </option>
                  )
                )}

              </select>

            </div>

            <div>

              <label className="mb-0.5 block text-[8px] font-semibold uppercase text-[#7A8790]">
                Status
              </label>

              <select
                value={
                  formData.status
                }
                onChange={(e) =>
                  updateField(
                    "status",
                    e.target.value
                  )
                }
                className="h-7 w-full rounded border border-[#DDE3E8] bg-white px-2 text-[10px] text-[#18352A] outline-none focus:border-[#C87532]"
              >

                {STATUS_OPTIONS.map(
                  (status) => (
                    <option
                      key={status}
                      value={status}
                    >
                      {status
                        .charAt(0)
                        .toUpperCase() +
                        status.slice(
                          1
                        )}
                    </option>
                  )
                )}

              </select>

            </div>

            <div className="sm:col-span-2">

              <label className="mb-0.5 block text-[8px] font-semibold uppercase text-[#7A8790]">
                Customer Notes
              </label>

              <textarea
                rows={4}
                value={
                  formData.notes
                }
                onChange={(e) =>
                  updateField(
                    "notes",
                    e.target.value
                  )
                }
                placeholder="Add customer requirements, preferences or notes..."
                className="w-full resize-none rounded border border-[#DDE3E8] bg-white p-2 text-[10px] text-[#18352A] outline-none focus:border-[#C87532]"
              />

            </div>

          </div>

          {/* ACTIONS */}

          <div className="mt-3 flex justify-end gap-1.5 border-t border-[#EEF1F3] pt-2">

            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="rounded border border-[#DDE3E8] bg-white px-3 py-1.5 text-[10px] font-semibold text-[#66734A] hover:bg-[#F5F7FA] disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSaving}
              className="flex items-center gap-1 rounded bg-[#C87532] px-3 py-1.5 text-[10px] font-semibold text-white hover:bg-[#B06326] disabled:opacity-50"
            >

              {isSaving ? (
                <>
                  <RefreshCw
                    size={11}
                    className="animate-spin"
                  />
                  Saving...
                </>
              ) : (
                <>
                  <Save size={11} />
                  {isEditing
                    ? "Save Changes"
                    : "Create Customer"}
                </>
              )}

            </button>

          </div>

        </form>

      </div>
    </div>
  );
}

/* =========================================================
   FORM FIELD
========================================================= */

function FormField({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}) {
  return (
    <div>

      <label className="mb-0.5 block text-[8px] font-semibold uppercase text-[#7A8790]">
        {label}
      </label>

      <input
        type={type}
        value={value}
        onChange={(e) =>
          onChange(
            e.target.value
          )
        }
        placeholder={
          placeholder
        }
        className="h-7 w-full rounded border border-[#DDE3E8] bg-white px-2 text-[10px] text-[#18352A] outline-none placeholder:text-[#A0A8AD] focus:border-[#C87532]"
      />

    </div>
  );
}

/* =========================================================
   SOURCE TEXT
========================================================= */

function formatSourceText(source) {
  if (!source) return "Unknown";

  return source
    .replace(/-/g, " ")
    .replace(/\b\w/g, (letter) =>
      letter.toUpperCase()
    );
}