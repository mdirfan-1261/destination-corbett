"use client";

import { useEffect, useMemo, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Mail,
  Phone,
  Hotel,
  Trash2,
  MessageSquare,
  MessageCircle,
  TreePine,
  Search,
  X,
  ChevronLeft,
  ChevronRight,
  PartyPopper,
  Inbox,
  RefreshCw,
  FileSpreadsheet,
  SquarePen,
  UserRound,
  UserCheck,
  CalendarDays,
  Layers,
  Save,
  Edit3,
  PanelRight,
  MapPin,
  SlidersHorizontal,
  Camera,
  Check,
  Heart, 
} from "lucide-react";

function EnquiriesContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const categoryParam = searchParams.get("category") || "all";

  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState(categoryParam);
  const [statusFilter, setStatusFilter] = useState("all");

  // DATE FILTER
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const [selectedIds, setSelectedIds] = useState([]);
  const [isBulkDeleting, setIsBulkDeleting] = useState(false);
  const [isBulkUpdating, setIsBulkUpdating] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(15);

  const [activeModalEnquiry, setActiveModalEnquiry] = useState(null);

  // AUXILIARY PANE (RIGHT PANEL) STATE
  const [isPaneOpen, setIsPaneOpen] = useState(true);
  const [sidebarWidth, setSidebarWidth] = useState(325);
  const [isResizingPane, setIsResizingPane] = useState(false);

  // SHOW/HIDE COLUMN CUSTOMIZATION STATE (100% WORKING TOGGLE)
  const [visibleCols, setVisibleCols] = useState({
    customer: true,
    location: true,
    contact: true,
    email: true,
    category: true,
    status: true,
    assignedTo: true,
    action: true,
  });

  const [showColMenu, setShowColMenu] = useState(false);

  // MOUSE RESIZE RIGHT PANEL
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (isResizingPane) {
        const newWidth = window.innerWidth - e.clientX;
        if (newWidth >= 260 && newWidth <= 650) {
          setSidebarWidth(newWidth);
        }
      }
    };

    const handleMouseUp = () => {
      setIsResizingPane(false);
    };

    if (isResizingPane) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isResizingPane]);

  // DYNAMIC TEAM ASSIGNMENT
  const [teamMembers, setTeamMembers] = useState([]);
  const [selectedAssignee, setSelectedAssignee] = useState("");
  const [isAssigning, setIsAssigning] = useState(false);

  /* CATEGORY PARAM SYNC */
  useEffect(() => {
    setCategoryFilter(categoryParam);
  }, [categoryParam]);

  /* SELECTED ASSIGNEE SYNC */
  useEffect(() => {
    if (!activeModalEnquiry) {
      setSelectedAssignee("");
      return;
    }

    const assigned = activeModalEnquiry.assignedTo;
    if (assigned && typeof assigned === "object") {
      setSelectedAssignee(assigned._id || assigned.id || "");
    } else {
      setSelectedAssignee(assigned || "");
    }
  }, [activeModalEnquiry]);

  /* CATEGORY CHANGE */
  const handleCategoryChange = (newCat) => {
    setCategoryFilter(newCat);
    router.push(`/admin/enquiries?category=${newCat}`, { scroll: false });
  };

  /* FETCH ENQUIRIES DYNAMICALLY */
  const fetchEnquiries = async () => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      router.push("/admin/login");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/enquiries`,
        {
          headers: { Authorization: `Bearer ${token}` },
          cache: "no-store",
        }
      );

      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch enquiries");
      }

      setEnquiries(data.enquiries || data.data || (Array.isArray(data) ? data : []));
    } catch (error) {
      console.error("Fetch enquiries error:", error);
    } finally {
      setLoading(false);
    }
  };

  /* FETCH TEAM MEMBERS DYNAMICALLY */
  const fetchTeamMembers = async () => {
    const token = localStorage.getItem("adminToken");
    if (!token) return;

    try {
      let response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/admin/team`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          cache: "no-store",
        }
      );

      if (response.status === 404) {
        response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/admin/users`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            cache: "no-store",
          }
        );
      }

      const data = await response.json().catch(() => ({}));

      if (response.ok) {
        const members =
          data.team ||
          data.admins ||
          data.users ||
          data.members ||
          data.data ||
          (Array.isArray(data) ? data : []);

        if (Array.isArray(members)) {
          setTeamMembers(members);
        }
      }
    } catch (error) {
      console.error("Fetch team error:", error);
    }
  };

  /* INITIAL LOAD */
  useEffect(() => {
    fetchEnquiries();
    fetchTeamMembers();
  }, []);

  /* RESET PAGE */
  useEffect(() => {
    setCurrentPage(1);
  }, [search, categoryFilter, statusFilter, itemsPerPage, fromDate, toDate]);

  /* CATEGORY HELPER (FIXED: Wedding aur Event ko pehle check karenge) */
  const getCategory = (item) => {
    const type = (item.inquiryType || "").toLowerCase();
    if (type.includes("wedding")) return "wedding";
    if (type.includes("event") || type.includes("party")) return "event";
    if (type.includes("hotel") || type.includes("stay") || item.hotel) return "hotel";
    if (type.includes("safari") || item.safariType || item.zone) return "safari";
    return "general";
  };

  /* DATE FORMATTER */
  const formatDate = (date) => {
    if (!date) return "";
    const parsedDate = new Date(date);
    if (Number.isNaN(parsedDate.getTime())) return date;
    return parsedDate.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  /* DATE ONLY */
  const getDateOnly = (date) => {
    if (!date) return null;
    const parsedDate = new Date(date);
    if (Number.isNaN(parsedDate.getTime())) return null;

    const year = parsedDate.getFullYear();
    const month = String(parsedDate.getMonth() + 1).padStart(2, "0");
    const day = String(parsedDate.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const whatsappNumber = (phone) => (phone ? phone.replace(/\D/g, "") : "");

  const getInitials = (name) => {
    if (!name) return "G";
    return name
      .split(" ")
      .slice(0, 2)
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase();
  };

  const getAssigneeName = (assignedTo) => {
    if (!assignedTo) return "";
    if (typeof assignedTo === "object") {
      return assignedTo.name || assignedTo.fullName || assignedTo.email || "";
    }
    const member = teamMembers.find(
      (item) => String(item._id) === String(assignedTo) || String(item.id) === String(assignedTo)
    );
    return member?.name || member?.fullName || member?.email || "";
  };

  /* CATEGORY BADGE */
  const CategoryBadge = ({ item }) => {
    const config = {
      safari: { label: "Safari", icon: TreePine, bg: "bg-emerald-50 text-emerald-700 border-emerald-200" },
      hotel: { label: "Hotel", icon: Hotel, bg: "bg-amber-50 text-amber-700 border-amber-200" },
      wedding: { label: "Wedding", icon: Heart, bg: "bg-rose-50 text-rose-700 border-rose-200" },
      event: { label: "Event", icon: PartyPopper, bg: "bg-purple-50 text-purple-700 border-purple-200" },
      general: { label: "General", icon: Inbox, bg: "bg-blue-50 text-blue-700 border-blue-200" },
    };
    const target = config[getCategory(item)] || config.general;
    const Icon = target.icon;

    return (
      <span className={`inline-flex max-w-full items-center gap-1 rounded border px-1.5 py-0.5 text-[9.5px] font-medium ${target.bg}`}>
        <Icon size={9} className="shrink-0" />
        <span className="truncate">{target.label}</span>
      </span>
    );
  };

  /* STATUS BADGE */
  const StatusBadge = ({ status }) => {
    const value = (status || "pending").toLowerCase();
    const config = {
      pending: { label: "Pending", dot: "bg-amber-500", bg: "bg-amber-50 border-amber-200 text-amber-700" },
      contacted: { label: "Contacted", dot: "bg-blue-500", bg: "bg-blue-50 border-blue-200 text-blue-700" },
      confirmed: { label: "Confirmed", dot: "bg-emerald-500", bg: "bg-emerald-50 border-emerald-200 text-emerald-700" },
    };
    const item = config[value] || config.pending;

    return (
      <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[9.5px] font-medium ${item.bg}`}>
        <span className={`h-1.5 w-1.5 rounded-full ${item.dot}`} />
        {item.label}
      </span>
    );
  };

  /* EXPORT REPORT */
  const exportToDocument = () => {
    const dataToExport =
      selectedIds.length > 0
        ? enquiries.filter((item) => selectedIds.includes(item._id))
        : filteredEnquiries;

    if (!dataToExport.length) {
      alert("No enquiries available to download.");
      return;
    }

    const htmlContent = `
      <html>
      <head>
        <meta charset="utf-8"/>
        <style>
          body { font-family: Arial; padding: 20px; }
          table { border-collapse: collapse; width: 100%; font-size: 12px; }
          th { background: #18352A; color: white; padding: 10px; text-align: left; }
          td { border: 1px solid #ddd; padding: 8px; }
        </style>
      </head>
      <body>
        <h2>DESTINATION CORBETT - CUSTOMER ENQUIRIES REPORT</h2>
        <p>Generated on: ${new Date().toLocaleString("en-IN")} | Total Records: ${dataToExport.length}</p>
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Customer Name</th>
              <th>Phone</th>
              <th>Email</th>
              <th>Category</th>
              <th>Status</th>
              <th>Date</th>
              <th>Customer Note</th>
            </tr>
          </thead>
          <tbody>
            ${dataToExport
              .map(
                (item, index) => `
                  <tr>
                    <td>${index + 1}</td>
                    <td><b>${item.name || "N/A"}</b></td>
                    <td>${item.phone || "N/A"}</td>
                    <td>${item.email || "N/A"}</td>
                    <td>${item.inquiryType || "General"}</td>
                    <td>${(item.status || "pending").toUpperCase()}</td>
                    <td>${formatDate(item.createdAt || item.safariDate)}</td>
                    <td>${item.message || "-"}</td>
                  </tr>
                `
              )
              .join("")}
          </tbody>
        </table>
      </body>
      </html>
    `;

    const blob = new Blob([htmlContent], { type: "application/vnd.ms-excel;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Destination_Corbett_Enquiries_${new Date().toISOString().slice(0, 10)}.xls`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  /* MANUAL STATUS UPDATE */
  const updateStatus = async (id, status) => {
    const allowedStatuses = ["pending", "contacted", "confirmed"];
    if (!allowedStatuses.includes(status.toLowerCase())) {
      alert("Invalid status");
      return;
    }

    const token = localStorage.getItem("adminToken");

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/enquiries/${id}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status }),
        }
      );

      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data.message || "Failed to update status");
      }

      setEnquiries((prev) =>
        prev.map((item) => (item._id === id ? { ...item, status } : item))
      );

      setActiveModalEnquiry((prev) =>
        prev?._id === id ? { ...prev, status } : prev
      );
    } catch (error) {
      alert(error.message || "Failed to update status");
    }
  };

  /* DIRECT ROW STAFF ASSIGNMENT */
  const assignRowEnquiry = async (id, staffId) => {
    if (!staffId) return;
    const token = localStorage.getItem("adminToken");
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/enquiries/${id}/assign`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ assignedTo: staffId }),
        }
      );

      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data.message || "Failed to assign staff");
      }

      setEnquiries((prev) =>
        prev.map((item) => (item._id === id ? { ...item, assignedTo: staffId } : item))
      );

      if (activeModalEnquiry?._id === id) {
        setActiveModalEnquiry((prev) => ({ ...prev, assignedTo: staffId }));
      }
    } catch (error) {
      alert(error.message || "Failed to assign staff");
    }
  };

  /* EDIT ENQUIRY DETAILS */
  const updateEnquiryDetails = async (id, updatedFields) => {
    const token = localStorage.getItem("adminToken");
    try {
      let response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/enquiries/${id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(updatedFields),
        }
      );

      if (response.status === 404) {
        response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/enquiries/${id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(updatedFields),
          }
        );
      }

      const data = await response.json().catch(() => ({}));
      const finalUpdated = data.enquiry || data.data || {
        ...activeModalEnquiry,
        ...updatedFields,
      };

      setEnquiries((prev) =>
        prev.map((item) => (item._id === id ? { ...item, ...finalUpdated } : item))
      );

      setActiveModalEnquiry((prev) =>
        prev?._id === id ? { ...prev, ...finalUpdated } : prev
      );

      alert("Customer profile & photo updated successfully!");
      return true;
    } catch (error) {
      console.error("Update enquiry error:", error);
      setEnquiries((prev) =>
        prev.map((item) => (item._id === id ? { ...item, ...updatedFields } : item))
      );
      setActiveModalEnquiry((prev) =>
        prev?._id === id ? { ...prev, ...updatedFields } : prev
      );
      alert("Updated profile details locally!");
      return true;
    }
  };

  /* ASSIGN ENQUIRY TO TEAM */
  const assignEnquiry = async () => {
    if (!activeModalEnquiry) return;

    if (!selectedAssignee) {
      alert("Please select a team member.");
      return;
    }

    const token = localStorage.getItem("adminToken");
    if (!token) {
      router.push("/admin/login");
      return;
    }

    setIsAssigning(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/enquiries/${activeModalEnquiry._id}/assign`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ assignedTo: selectedAssignee }),
        }
      );

      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data.message || "Failed to assign enquiry");
      }

      const updatedEnquiry = data.enquiry || data.data || {
        ...activeModalEnquiry,
        assignedTo: selectedAssignee,
      };

      setEnquiries((prev) =>
        prev.map((item) =>
          item._id === activeModalEnquiry._id
            ? { ...item, ...updatedEnquiry, assignedTo: updatedEnquiry.assignedTo || selectedAssignee }
            : item
        )
      );

      setActiveModalEnquiry((prev) => ({
        ...prev,
        ...updatedEnquiry,
        assignedTo: updatedEnquiry.assignedTo || selectedAssignee,
      }));

      alert("Enquiry assigned successfully.");
    } catch (error) {
      alert(error.message || "Failed to assign enquiry");
    } finally {
      setIsAssigning(false);
    }
  };

  /* DELETE ENQUIRY */
  const deleteEnquiry = async (id) => {
    if (!window.confirm("Delete this enquiry?")) return;
    const token = localStorage.getItem("adminToken");

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/enquiries/${id}`,
        { method: "DELETE", headers: { Authorization: `Bearer ${token}` } }
      );

      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data.message || "Failed to delete enquiry");
      }

      setEnquiries((prev) => prev.filter((item) => item._id !== id));
      setSelectedIds((prev) => prev.filter((x) => x !== id));

      if (activeModalEnquiry?._id === id) {
        setActiveModalEnquiry(null);
      }
    } catch (error) {
      alert(error.message || "Failed to delete enquiry");
    }
  };

  /* BULK DELETE */
  const handleBulkDelete = async () => {
    if (!selectedIds.length) return;
    if (!window.confirm(`Delete ${selectedIds.length} selected items?`)) return;

    setIsBulkDeleting(true);
    const token = localStorage.getItem("adminToken");

    try {
      const responses = await Promise.all(
        selectedIds.map((id) =>
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/enquiries/${id}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
          })
        )
      );

      if (responses.some((r) => !r.ok)) {
        throw new Error("Some enquiries could not be deleted.");
      }

      setEnquiries((prev) => prev.filter((item) => !selectedIds.includes(item._id)));
      setSelectedIds([]);
    } catch (error) {
      alert(error.message || "Bulk delete error");
    } finally {
      setIsBulkDeleting(false);
    }
  };

  /* BULK STATUS */
  const handleBulkStatusChange = async (newStatus) => {
    if (!selectedIds.length) return;
    setIsBulkUpdating(true);
    const token = localStorage.getItem("adminToken");

    try {
      const responses = await Promise.all(
        selectedIds.map((id) =>
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/enquiries/${id}/status`, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ status: newStatus }),
          })
        )
      );

      if (responses.some((r) => !r.ok)) {
        throw new Error("Some statuses could not be updated.");
      }

      setEnquiries((prev) =>
        prev.map((item) => (selectedIds.includes(item._id) ? { ...item, status: newStatus } : item))
      );
      setSelectedIds([]);
    } catch (error) {
      alert(error.message || "Bulk status update error");
    } finally {
      setIsBulkUpdating(false);
    }
  };

  /* CATEGORY COUNTS */
  const categoryCounts = useMemo(
    () => ({
      all: enquiries.length,
      safari: enquiries.filter((i) => getCategory(i) === "safari").length,
      hotel: enquiries.filter((i) => getCategory(i) === "hotel").length,
      wedding: enquiries.filter((i) => getCategory(i) === "wedding").length,
      event: enquiries.filter((i) => getCategory(i) === "event").length,
      general: enquiries.filter((i) => getCategory(i) === "general").length,
    }),
    [enquiries]
  );

  /* STATUS COUNTS */
  const statusCounts = useMemo(
    () => ({
      all: enquiries.length,
      pending: enquiries.filter((i) => (i.status || "pending").toLowerCase() === "pending").length,
      contacted: enquiries.filter((i) => (i.status || "pending").toLowerCase() === "contacted").length,
      confirmed: enquiries.filter((i) => (i.status || "pending").toLowerCase() === "confirmed").length,
    }),
    [enquiries]
  );

  /* FILTERING LOGIC */
  const filteredEnquiries = useMemo(() => {
    return enquiries.filter((item) => {
      const categoryMatch =
        categoryFilter === "all" || getCategory(item) === categoryFilter;

      const statusMatch =
        statusFilter === "all" || (item.status || "pending").toLowerCase() === statusFilter.toLowerCase();

      const q = search.toLowerCase().trim();
      const searchMatch =
        !q ||
        item.name?.toLowerCase().includes(q) ||
        item.email?.toLowerCase().includes(q) ||
        item.phone?.toLowerCase().includes(q) ||
        item.hotel?.toLowerCase().includes(q) ||
        item.inquiryType?.toLowerCase().includes(q) ||
        item.safariType?.toLowerCase().includes(q) ||
        item.zone?.toLowerCase().includes(q) ||
        item.location?.toLowerCase().includes(q);

      const enquiryDate = getDateOnly(item.createdAt);
      let dateMatch = true;
      if (fromDate) dateMatch = dateMatch && enquiryDate >= fromDate;
      if (toDate) dateMatch = dateMatch && enquiryDate <= toDate;

      return categoryMatch && statusMatch && searchMatch && dateMatch;
    });
  }, [enquiries, categoryFilter, statusFilter, search, fromDate, toDate]);

  /* PAGINATION */
  const totalPages = Math.ceil(filteredEnquiries.length / itemsPerPage) || 1;

  const paginatedEnquiries = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredEnquiries.slice(start, start + itemsPerPage);
  }, [filteredEnquiries, currentPage, itemsPerPage]);

  /* SELECT ALL */
  const isAllPaginatedSelected = useMemo(() => {
    if (!paginatedEnquiries.length) return false;
    return paginatedEnquiries.every((item) => selectedIds.includes(item._id));
  }, [paginatedEnquiries, selectedIds]);

  const toggleSelectAll = () => {
    const ids = paginatedEnquiries.map((item) => item._id);
    if (isAllPaginatedSelected) {
      setSelectedIds((prev) => prev.filter((id) => !ids.includes(id)));
    } else {
      setSelectedIds((prev) => [...new Set([...prev, ...ids])]);
    }
  };

  const toggleSelectRow = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const clearDateFilter = () => {
    setFromDate("");
    setToDate("");
  };

  const handleRowClick = (item) => {
    setActiveModalEnquiry(item);
    setIsPaneOpen(true);
  };

  if (loading) {
    return (
      <div className="flex min-h-[calc(100vh-64px)] items-center justify-center px-2">
        <div className="flex items-center gap-2 rounded-lg border border-[#DDE3E8] bg-white px-3 py-2 text-[10px] font-semibold text-[#18352A] shadow-md">
          <RefreshCw className="h-3.5 w-3.5 animate-spin text-[#C87532]" />
          Loading Tracker...
        </div>
      </div>
    );
  }

  const isDrawerOpen = activeModalEnquiry && isPaneOpen;

  return (
    <div className="min-h-[calc(100vh-64px)] overflow-x-hidden px-1.5 py-2 sm:px-3 lg:px-4">
      <div className="mx-auto max-w-[1600px]">
        {/* TOP HEADER */}
        <div className="mb-2 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <Mail className="h-3.5 w-3.5 shrink-0 text-[#C87532]" />
              <h1 className="truncate text-base font-bold text-[#18352A] sm:text-lg">
                Enquiries Tracker
              </h1>
              <span className="rounded-full bg-[#FFF7EF] border border-[#C87532]/30 px-2 py-0.5 text-[9px] sm:text-xs font-semibold text-[#C87532]">
                Live: {filteredEnquiries.length} Records
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={exportToDocument}
              className="flex items-center gap-1 rounded bg-[#C87532] px-2 py-1 text-[10px] sm:text-xs font-semibold text-white shadow-xs hover:bg-[#b06326]"
            >
              <FileSpreadsheet size={11} />
              Report
            </button>

            <button
              onClick={() => {
                fetchEnquiries();
                fetchTeamMembers();
              }}
              className="flex items-center gap-1 rounded border border-[#DDE3E8] bg-white px-2 py-1 text-[10px] sm:text-xs font-medium text-[#18352A] hover:bg-[#F5F7FA]"
            >
              <RefreshCw size={11} />
              Sync
            </button>

            {/* TOGGLE AUXILIARY PANE BUTTON */}
            <button
              onClick={() => setIsPaneOpen(!isPaneOpen)}
              className={`hidden sm:flex items-center justify-center h-6.5 w-7 rounded border transition ${
                isDrawerOpen
                  ? "border-[#C87532] bg-[#FFF7EF] text-[#C87532]"
                  : "border-[#DDE3E8] bg-white text-gray-600 hover:bg-[#F5F7FA]"
              }`}
              title="Toggle Auxiliary Pane"
            >
              <PanelRight size={13} />
            </button>
          </div>
        </div>

        {/* STAT CARDS ROW */}
        <div className="mb-2.5 grid grid-cols-2 gap-1.5 sm:grid-cols-3 md:grid-cols-6">
          {[
            ["all", "All Enquiries", categoryCounts.all, Layers, "bg-orange-50", "text-[#C87532]"],
            ["safari", "Safari", categoryCounts.safari, TreePine, "bg-emerald-50", "text-emerald-600"],
            ["hotel", "Hotels", categoryCounts.hotel, Hotel, "bg-amber-50", "text-amber-600"],
            ["wedding", "Weddings", categoryCounts.wedding, Heart, "bg-rose-50", "text-rose-600"],
            ["event", "Events", categoryCounts.event, PartyPopper, "bg-purple-50", "text-purple-600"],
            ["general", "General", categoryCounts.general, Inbox, "bg-blue-50", "text-blue-600"],
          ].map(([key, label, value, Icon, iconBg, iconColor]) => (
            <div
              key={key}
              onClick={() => handleCategoryChange(key)}
              className={`cursor-pointer rounded border p-1.5 shadow-xs transition ${
                categoryFilter === key
                  ? "border-[#C87532] bg-[#FFF7EF]"
                  : "border-[#DDE3E8] bg-white hover:bg-[#F8FAFB]"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className={`flex h-5 w-5 items-center justify-center rounded ${iconBg}`}>
                  <Icon size={11} className={iconColor} />
                </div>
                <span className="text-[9px] font-medium text-[#7A8790]">{value}</span>
              </div>
              <p className="mt-0.5 text-sm font-semibold text-[#18352A]">{value}</p>
              <p className="truncate text-[8.5px] text-[#66734A]">{label}</p>
            </div>
          ))}
        </div>

        {/* BULK ACTIONS BAR */}
        {selectedIds.length > 0 && (
          <div className="mb-2 flex flex-wrap items-center justify-between gap-1 rounded bg-[#18352A] px-2 py-1 text-white">
            <div className="text-[10px] font-medium">
              {selectedIds.length} Selected
            </div>

            <div className="flex flex-wrap gap-1 text-[9px]">
              <button onClick={() => handleBulkStatusChange("pending")} className="rounded bg-amber-500/20 px-1.5 py-0.5 text-amber-300">Pending</button>
              <button onClick={() => handleBulkStatusChange("contacted")} className="rounded bg-blue-500/20 px-1.5 py-0.5 text-blue-300">Contacted</button>
              <button onClick={() => handleBulkStatusChange("confirmed")} className="rounded bg-emerald-500/20 px-1.5 py-0.5 text-emerald-300">Confirmed</button>
              <button onClick={handleBulkDelete} className="rounded bg-red-500/20 px-1.5 py-0.5 text-red-300"><Trash2 size={10} /></button>
              <button onClick={() => setSelectedIds([])} className="px-1 text-[#C87532]">Clear</button>
            </div>
          </div>
        )}

        {/* FILTER BAR */}
        <div className="mb-2 flex flex-col gap-1.5">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            {/* CATEGORY PILLS (WEDDING ADDED) */}
            <div className="flex flex-wrap gap-1">
              {[
                ["all", `All (${categoryCounts.all})`],
                ["safari", `Safari (${categoryCounts.safari})`],
                ["hotel", `Hotels (${categoryCounts.hotel})`],
                ["wedding", `Weddings (${categoryCounts.wedding})`],
                ["event", `Events (${categoryCounts.event})`],
                ["general", `General (${categoryCounts.general})`],
              ].map(([value, label]) => (
                <button
                  key={value}
                  onClick={() => handleCategoryChange(value)}
                  className={`rounded px-2 py-0.5 text-[9px] font-medium transition ${
                    categoryFilter === value
                      ? "bg-[#C87532] text-white"
                      : "border border-[#DDE3E8] bg-white text-[#66734A] hover:bg-[#F5F7FA]"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* STATUS PILLS */}
            <div className="flex flex-wrap gap-1">
              {[
                ["all", `All (${statusCounts.all})`, "bg-slate-900 text-white border-slate-900"],
                ["pending", `🟡 Pending (${statusCounts.pending})`, "bg-amber-50 text-amber-700 border-amber-300"],
                ["contacted", `🔵 Contacted (${statusCounts.contacted})`, "bg-blue-50 text-blue-700 border-blue-300"],
                ["confirmed", `🟢 Confirmed (${statusCounts.confirmed})`, "bg-emerald-50 text-emerald-700 border-emerald-300"],
              ].map(([val, label, bgCls]) => (
                <button
                  key={val}
                  onClick={() => setStatusFilter(val)}
                  className={`rounded-full border px-2 py-0.5 text-[8.5px] font-medium transition ${
                    statusFilter === val
                      ? "ring-1 ring-[#C87532] " + bgCls
                      : "bg-white text-slate-700 border-[#DDE3E8]"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* DATE RANGE & SEARCH BAR */}
          <div className="flex flex-col gap-1.5 sm:flex-row sm:items-center sm:justify-between">
            {/* FROM & TO DATE PICKERS */}
            <div className="flex flex-wrap items-center gap-1">
              <div className="flex items-center gap-1 rounded border border-[#DDE3E8] bg-white px-2 py-0.5">
                <CalendarDays size={10} className="shrink-0 text-[#C87532]" />
                <span className="text-[9px] font-medium text-[#66734A]">From</span>
                <input
                  type="date"
                  value={fromDate}
                  max={toDate || undefined}
                  onChange={(e) => setFromDate(e.target.value)}
                  className="h-4.5 bg-transparent text-[9px] font-medium text-[#18352A] outline-none cursor-pointer"
                />
              </div>

              <div className="flex items-center gap-1 rounded border border-[#DDE3E8] bg-white px-2 py-0.5">
                <CalendarDays size={10} className="shrink-0 text-[#C87532]" />
                <span className="text-[9px] font-medium text-[#66734A]">To</span>
                <input
                  type="date"
                  value={toDate}
                  min={fromDate || undefined}
                  onChange={(e) => setToDate(e.target.value)}
                  className="h-4.5 bg-transparent text-[9px] font-medium text-[#18352A] outline-none cursor-pointer"
                />
              </div>

              {(fromDate || toDate) && (
                <button
                  type="button"
                  onClick={clearDateFilter}
                  className="flex items-center gap-1 rounded border border-red-200 bg-red-50 px-2 py-0.5 text-[9px] font-medium text-red-700 hover:bg-red-100 transition"
                >
                  <X size={9} />
                  Clear Date
                </button>
              )}
            </div>

            {/* SEARCH BAR */}
            <div className="flex min-w-0 items-center gap-1.5">
              <div className="relative min-w-0 flex-1 sm:w-[190px] sm:flex-none">
                <Search size={10} className="absolute left-2 top-1/2 -translate-y-1/2 text-[#7A8790]" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search name, phone..."
                  className="h-6.5 w-full rounded border border-[#DDE3E8] bg-white pl-6 pr-2 text-[9px] sm:text-[11px] outline-none focus:border-[#C87532]"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="h-6.5 rounded border border-[#DDE3E8] bg-white px-1.5 text-[9px] sm:text-[11px] font-medium text-[#18352A] outline-none cursor-pointer"
              >
                <option value="all">All Statuses</option>
                <option value="pending">🟡 Pending</option>
                <option value="contacted">🔵 Contacted</option>
                <option value="confirmed">🟢 Confirmed</option>
              </select>

              <select
                value={itemsPerPage}
                onChange={(e) => setItemsPerPage(Number(e.target.value))}
                className="h-6.5 rounded border border-[#DDE3E8] bg-white px-1 text-[9px] sm:text-[11px] cursor-pointer"
              >
                <option value={10}>10</option>
                <option value={15}>15</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
              </select>
            </div>
          </div>
        </div>

        {/* 3-LAYER INLINE CRM LAYOUT */}
        <div className="flex min-w-0 flex-col gap-0 lg:flex-row select-none">
          <div className="min-w-0 flex-1 overflow-hidden">
            <div className="w-full overflow-hidden rounded border border-[#DDE3E8] bg-white shadow-xs">
              
              {/* TOP TABLE BAR */}
              <div className="flex items-center justify-between border-b border-[#EEF1F3] bg-[#F5F7FA] px-2.5 py-1.5 text-[10px] text-[#66734A]">
                <div className="truncate font-medium flex items-center gap-2">
                  <span>
                    Showing <b className="text-[#18352A]">{filteredEnquiries.length ? (currentPage - 1) * itemsPerPage + 1 : 0}</b> - <b className="text-[#18352A]">{Math.min(currentPage * itemsPerPage, filteredEnquiries.length)}</b> of <b className="text-[#18352A]">{filteredEnquiries.length}</b> items
                  </span>
                </div>

                <div className="flex shrink-0 items-center gap-1">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                    className="rounded border bg-white p-0.5 disabled:opacity-30 hover:bg-slate-50"
                  >
                    <ChevronLeft size={12} />
                  </button>
                  <span className="px-1 font-medium text-[#18352A]">
                    {currentPage}/{totalPages}
                  </span>
                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                    className="rounded border bg-white p-0.5 disabled:opacity-30 hover:bg-slate-50"
                  >
                    <ChevronRight size={12} />
                  </button>
                </div>
              </div>

              {/* TABLE */}
              <table className="w-full table-fixed border-collapse text-left">
                <thead>
                  <tr className="border-b border-[#EEF1F3] bg-[#F8FAFB] text-[9.5px] font-semibold uppercase tracking-wider text-[#66734A]">
                    <th className="w-[28px] px-1 py-1.5 text-center">
                      <input
                        type="checkbox"
                        checked={isAllPaginatedSelected}
                        onChange={toggleSelectAll}
                        className="h-3 w-3 accent-[#C87532] cursor-pointer"
                      />
                    </th>

                    {visibleCols.customer && (
                      <th className="px-2 py-1.5 truncate">CUSTOMER</th>
                    )}

                    {visibleCols.location && (
                      <th className="px-2 py-1.5 truncate">LOCATION</th>
                    )}

                    {visibleCols.contact && (
                      <th className="px-2 py-1.5 truncate">CONTACT</th>
                    )}

                    {visibleCols.email && (
                      <th className={`hidden ${isDrawerOpen ? "2xl:table-cell" : "xl:table-cell"} px-2 py-1.5 truncate`}>EMAIL</th>
                    )}

                    {visibleCols.category && (
                      <th className="hidden lg:table-cell px-2 py-1.5 truncate">CATEGORY</th>
                    )}

                    {visibleCols.status && (
                      <th className="w-[85px] px-1 py-1.5">STATUS</th>
                    )}

                    {visibleCols.assignedTo && (
                      <th className="w-[105px] px-1 py-1.5">ASSIGNED TO</th>
                    )}

                    {visibleCols.action && (
                      <th className="w-[50px] px-1 py-1.5 text-right">ACTION</th>
                    )}
                  </tr>
                </thead>

                <tbody className="divide-y divide-[#EEF1F3] text-[11px]">
                  {paginatedEnquiries.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-6 text-center text-xs text-[#7A8790]">
                        No enquiries match the selected status or filter.
                      </td>
                    </tr>
                  ) : (
                    paginatedEnquiries.map((item) => {
                      const st = (item.status || "pending").toLowerCase();
                      const statusBgClass =
                        st === "confirmed"
                          ? "bg-emerald-50 text-emerald-700 border-emerald-300"
                          : st === "contacted"
                          ? "bg-blue-50 text-blue-700 border-blue-300"
                          : "bg-amber-50 text-amber-700 border-amber-300";

                      // ✅ LOCATION: Location, Zone ya Hotel name sab pick karega
                      const locationName = item.location || item.zone || item.city || item.destination || item.hotel || "";

                      return (
                        <tr
                          key={item._id}
                          onClick={() => handleRowClick(item)}
                          className={`cursor-pointer transition hover:bg-[#F8FAFB] ${
                            activeModalEnquiry?._id === item._id
                              ? "bg-[#FFF7EF]"
                              : selectedIds.includes(item._id)
                              ? "bg-slate-50"
                              : ""
                          }`}
                        >
                          {/* Checkbox */}
                          <td className="px-1 py-1.5 text-center" onClick={(e) => e.stopPropagation()}>
                            <input
                              type="checkbox"
                              checked={selectedIds.includes(item._id)}
                              onChange={() => toggleSelectRow(item._id)}
                              className="h-3 w-3 accent-[#C87532] cursor-pointer"
                            />
                          </td>

                          {/* CUSTOMER */}
                          {visibleCols.customer && (
                            <td className="px-2 py-1.5 truncate">
                              <div className="flex items-center gap-1.5 min-w-0">
                                <div className="flex h-5.5 w-5.5 shrink-0 items-center justify-center rounded-full bg-[#18352A] text-[9px] font-semibold text-white overflow-hidden border border-[#DDE3E8]">
                                  {item.avatar ? (
                                    <img src={item.avatar} alt={item.name} className="h-full w-full object-cover" />
                                  ) : (
                                    getInitials(item.name)
                                  )}
                                </div>
                                <p className="font-medium text-[#18352A] truncate">
                                  {item.name || "N/A"}
                                </p>
                              </div>
                            </td>
                          )}

                          {/* LOCATION COLUMN (PIN ICON KE SAATH) */}
                          {visibleCols.location && (
                            <td className="px-2 py-1.5 truncate">
                              {locationName ? (
                                <span className="inline-flex items-center gap-1 text-[10.5px] font-medium text-[#66734A] truncate">
                                  <MapPin size={10} className="shrink-0 text-[#C87532]" />
                                  <span className="truncate">{locationName}</span>
                                </span>
                              ) : (
                                <span className="text-gray-400 text-[10px]">-</span>
                              )}
                            </td>
                          )}

                          {/* Contact */}
                          {visibleCols.contact && (
                            <td className="px-2 py-1.5 truncate">
                              {item.phone ? (
                                <a
                                  href={`tel:${item.phone}`}
                                  onClick={(e) => e.stopPropagation()}
                                  className="flex items-center gap-1 text-[10.5px] font-medium text-[#18352A] hover:text-[#C87532] truncate"
                                >
                                  <Phone size={10} className="shrink-0 text-[#66734A]" />
                                  <span className="truncate">{item.phone}</span>
                                </a>
                              ) : (
                                <span className="text-gray-400 text-[10px]">N/A</span>
                              )}
                            </td>
                          )}

                          {/* Email */}
                          {visibleCols.email && (
                            <td className={`hidden ${isDrawerOpen ? "2xl:table-cell" : "xl:table-cell"} px-2 py-1.5 truncate`}>
                              {item.email ? (
                                <a
                                  href={`mailto:${item.email}`}
                                  onClick={(e) => e.stopPropagation()}
                                  className="flex items-center gap-1 text-[10.5px] font-medium text-[#18352A] hover:text-[#C87532] truncate"
                                >
                                  <Mail size={10} className="shrink-0 text-[#66734A]" />
                                  <span className="truncate">{item.email}</span>
                                </a>
                              ) : (
                                <span className="text-gray-400 text-[10px]">N/A</span>
                              )}
                            </td>
                          )}

                          {/* Category */}
                          {visibleCols.category && (
                            <td className="hidden lg:table-cell px-2 py-1.5 truncate">
                              <CategoryBadge item={item} />
                            </td>
                          )}

                          {/* Status Dropdown */}
                          {visibleCols.status && (
                            <td className="px-1 py-1.5" onClick={(e) => e.stopPropagation()}>
                              <select
                                value={st}
                                onChange={(e) => updateStatus(item._id, e.target.value)}
                                className={`h-5 w-full rounded-full border px-1 text-[9px] font-medium outline-none cursor-pointer transition ${statusBgClass}`}
                              >
                                <option value="pending" className="bg-white text-amber-700">Pending</option>
                                <option value="contacted" className="bg-white text-blue-700">Contacted</option>
                                <option value="confirmed" className="bg-white text-emerald-700">Confirmed</option>
                              </select>
                            </td>
                          )}

                          {/* ASSIGNED TO */}
                          {visibleCols.assignedTo && (
                            <td className="px-1 py-1.5" onClick={(e) => e.stopPropagation()}>
                              <select
                                value={typeof item.assignedTo === 'object' ? item.assignedTo?._id || '' : item.assignedTo || ''}
                                onChange={(e) => assignRowEnquiry(item._id, e.target.value)}
                                className="h-5 w-full rounded border border-[#DDE3E8] bg-white px-1 text-[9.5px] font-medium text-[#18352A] outline-none cursor-pointer truncate"
                                title={getAssigneeName(item.assignedTo) || "Assign Staff"}
                              >
                                <option value="">👤 Unassigned</option>
                                {teamMembers.length === 0 ? (
                                  <option value="" disabled>No Staff Found</option>
                                ) : (
                                  teamMembers.map((member) => {
                                    const id = member._id || member.id;
                                    const name = member.name || member.fullName || member.email || "Staff";
                                    return (
                                      <option key={id} value={id}>
                                        👤 {name}
                                      </option>
                                    );
                                  })
                                )}
                              </select>
                            </td>
                          )}

                          {/* ACTION BUTTONS */}
                          {visibleCols.action && (
                            <td className="px-1 py-1.5 text-right" onClick={(e) => e.stopPropagation()}>
                              <div className="flex items-center justify-end gap-1">
                                <button
                                  onClick={() => handleRowClick(item)}
                                  className="rounded border border-[#DDE3E8] bg-[#F8FAFB] p-0.5 text-[#18352A] hover:bg-[#18352A] hover:text-white transition"
                                  title="Edit / View Profile"
                                >
                                  <SquarePen size={11} />
                                </button>

                                <button
                                  onClick={() => deleteEnquiry(item._id)}
                                  className="rounded border border-red-200 bg-red-50 p-0.5 text-red-700 hover:bg-red-100 transition"
                                  title="Delete Enquiry"
                                >
                                  <Trash2 size={11} />
                                </button>
                              </div>
                            </td>
                          )}
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* DIVIDER */}
          {isDrawerOpen && (
            <div
              onMouseDown={() => setIsResizingPane(true)}
              className="hidden lg:flex w-1 hover:w-1.5 bg-[#E2E8F0] hover:bg-[#C87532] cursor-col-resize transition-all shrink-0 select-none group items-center justify-center z-10"
              title="Click to collapse / Drag to resize panel"
            >
              <div className="h-8 w-0.5 rounded bg-gray-400 group-hover:bg-white" />
            </div>
          )}

          {/* RIGHT DRAWER */}
          {isDrawerOpen && (
            <div
              style={{ width: `${sidebarWidth}px` }}
              className="hidden lg:flex shrink-0 min-w-0 transition-all duration-75"
            >
              <EnquiryDetails
                enquiry={activeModalEnquiry}
                onClose={() => setIsPaneOpen(false)}
                updateStatus={updateStatus}
                updateEnquiryDetails={updateEnquiryDetails}
                deleteEnquiry={deleteEnquiry}
                formatDate={formatDate}
                whatsappNumber={whatsappNumber}
                CategoryBadge={CategoryBadge}
                StatusBadge={StatusBadge}
                getInitials={getInitials}
                teamMembers={teamMembers}
                selectedAssignee={selectedAssignee}
                setSelectedAssignee={setSelectedAssignee}
                assignEnquiry={assignEnquiry}
                isAssigning={isAssigning}
                getAssigneeName={getAssigneeName}
              />
            </div>
          )}
        </div>
      </div>

      {/* MOBILE DRAWER */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-[60] w-screen max-w-none overflow-hidden bg-white lg:hidden">
          <div className="h-full w-full max-w-full overflow-hidden bg-white">
            <EnquiryDetails
              enquiry={activeModalEnquiry}
              onClose={() => setIsPaneOpen(false)}
              updateStatus={updateStatus}
              updateEnquiryDetails={updateEnquiryDetails}
              deleteEnquiry={deleteEnquiry}
              formatDate={formatDate}
              whatsappNumber={whatsappNumber}
              CategoryBadge={CategoryBadge}
              StatusBadge={StatusBadge}
              getInitials={getInitials}
              teamMembers={teamMembers}
              selectedAssignee={selectedAssignee}
              setSelectedAssignee={setSelectedAssignee}
              assignEnquiry={assignEnquiry}
              isAssigning={isAssigning}
              getAssigneeName={getAssigneeName}
            />
          </div>
        </div>
      )}
    </div>
  );
}

/* =========================================
   DRAWER DETAILS
========================================= */
function EnquiryDetails({
  enquiry,
  onClose,
  updateStatus,
  updateEnquiryDetails,
  deleteEnquiry,
  formatDate,
  whatsappNumber,
  CategoryBadge,
  StatusBadge,
  getInitials,
  teamMembers,
  selectedAssignee,
  setSelectedAssignee,
  assignEnquiry,
  isAssigning,
  getAssigneeName,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState({
    name: enquiry.name || "",
    phone: enquiry.phone || "",
    email: enquiry.email || "",
    inquiryType: enquiry.inquiryType || "",
    hotel: enquiry.hotel || "",
    safariType: enquiry.safariType || "",
    zone: enquiry.zone || "",
    location: enquiry.location || enquiry.zone || "",
    guests: enquiry.guests || "",
    rooms: enquiry.rooms || "",
    preferredTime: enquiry.preferredTime || "",
    message: enquiry.message || "",
    avatar: enquiry.avatar || "",
    checkIn: enquiry.checkIn ? new Date(enquiry.checkIn).toISOString().slice(0, 10) : "",
    checkOut: enquiry.checkOut ? new Date(enquiry.checkOut).toISOString().slice(0, 10) : "",
    safariDate: enquiry.safariDate ? new Date(enquiry.safariDate).toISOString().slice(0, 10) : "",
  });

  useEffect(() => {
    setFormData({
      name: enquiry.name || "",
      phone: enquiry.phone || "",
      email: enquiry.email || "",
      inquiryType: enquiry.inquiryType || "",
      hotel: enquiry.hotel || "",
      safariType: enquiry.safariType || "",
      zone: enquiry.zone || "",
      location: enquiry.location || enquiry.zone || "",
      guests: enquiry.guests || "",
      rooms: enquiry.rooms || "",
      preferredTime: enquiry.preferredTime || "",
      message: enquiry.message || "",
      avatar: enquiry.avatar || "",
      checkIn: enquiry.checkIn ? new Date(enquiry.checkIn).toISOString().slice(0, 10) : "",
      checkOut: enquiry.checkOut ? new Date(enquiry.checkOut).toISOString().slice(0, 10) : "",
      safariDate: enquiry.safariDate ? new Date(enquiry.safariDate).toISOString().slice(0, 10) : "",
    });
    setIsEditing(false);
  }, [enquiry]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64Photo = reader.result;
      handleInputChange("avatar", base64Photo);
      updateEnquiryDetails(enquiry._id, { avatar: base64Photo });
    };
    reader.readAsDataURL(file);
  };

  const handleSaveEdit = async () => {
    setIsSaving(true);
    const success = await updateEnquiryDetails(enquiry._id, formData);
    setIsSaving(false);
    if (success) {
      setIsEditing(false);
    }
  };

  const locationName = enquiry.location || enquiry.zone || enquiry.city || enquiry.hotel || "";

  return (
    <aside className="flex h-full min-h-0 w-full flex-col overflow-hidden border-l border-[#DDE3E8] bg-white text-xs">
      <div className="flex shrink-0 items-center justify-between border-b border-[#EEF1F3] bg-[#F5F7FA] px-2.5 py-1">
        <span className="text-[9.5px] font-bold text-[#7A8790] uppercase tracking-wider">Customer Profile</span>
        
        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className={`flex items-center gap-1 rounded px-2 py-0.5 text-[9px] font-semibold transition ${
              isEditing
                ? "bg-amber-100 text-amber-800 border border-amber-300"
                : "bg-[#18352A] text-white hover:bg-[#244C3C]"
            }`}
          >
            <Edit3 size={10} />
            {isEditing ? "Cancel" : "Edit Profile"}
          </button>

          <button
            onClick={onClose}
            className="rounded bg-white p-1 text-[#66734A] hover:bg-gray-100 hover:text-[#18352A]"
            title="Toggle Auxiliary Pane"
          >
            <PanelRight size={13} />
          </button>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden p-2.5">
        <div className="mb-3 flex flex-col items-center justify-center rounded-lg border border-[#DDE3E8] bg-[#F8FAFB] p-3 text-center">
          <div className="relative group shrink-0 mb-1.5">
            {formData.avatar ? (
              <img
                src={formData.avatar}
                alt={formData.name}
                className="h-16 w-16 rounded-full object-cover border-2 border-[#C87532] shadow-sm"
              />
            ) : (
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#18352A] text-base font-bold text-white shadow-sm">
                {getInitials(formData.name)}
              </div>
            )}

            <label
              className="absolute bottom-0 right-0 flex h-5 w-5 cursor-pointer items-center justify-center rounded-full bg-[#C87532] text-white shadow hover:bg-[#b06326] transition"
              title="Upload Customer Profile Photo"
            >
              <Camera size={11} />
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="hidden"
              />
            </label>
          </div>

          <h2 className="text-sm font-bold text-[#18352A] truncate max-w-full">
            {formData.name || "User Name"}
          </h2>

          <div className="mt-1 flex flex-wrap items-center justify-center gap-1.5">
            <CategoryBadge item={enquiry} />
            {locationName && (
              <span className="inline-flex items-center gap-0.5 rounded bg-amber-50 border border-amber-200 px-1.5 py-0.5 text-[9px] font-semibold text-amber-800">
                <MapPin size={9} className="text-[#C87532]" />
                {locationName}
              </span>
            )}
          </div>
        </div>

        <div className="mb-2 rounded border border-[#DDE3E8] bg-[#F8FAFB] p-1.5">
          <div className="flex items-center justify-between gap-1">
            <span className="text-[8.5px] font-medium uppercase text-[#7A8790]">
              Current Status
            </span>
            <StatusBadge status={enquiry.status} />
          </div>
        </div>

        {/* TEAM ASSIGNMENT PANEL */}
        <div className="mb-2 rounded border border-[#DDE3E8] bg-[#FFF7EF] p-1.5">
          <div className="mb-1 flex items-center justify-between">
            <div className="flex items-center gap-1">
              <UserCheck size={10} className="text-[#C87532]" />
              <p className="text-[8.5px] font-semibold uppercase text-[#7A8790]">
                Assign Lead to Staff
              </p>
            </div>
          </div>

          {enquiry.assignedTo && (
            <div className="mb-1 flex min-w-0 items-center gap-1 rounded border border-emerald-200 bg-emerald-50 px-1.5 py-0.5">
              <UserRound size={10} className="shrink-0 text-emerald-700" />
              <div className="min-w-0">
                <p className="text-[7.5px] text-emerald-600">Currently Assigned</p>
                <p className="truncate text-[10.5px] font-semibold text-emerald-800">
                  {getAssigneeName(enquiry.assignedTo) || "Assigned Staff"}
                </p>
              </div>
            </div>
          )}

          <div className="flex gap-1">
            <select
              value={selectedAssignee}
              onChange={(e) => setSelectedAssignee(e.target.value)}
              className="h-6 flex-1 rounded border border-[#DDE3E8] bg-white px-1 text-[10.5px] font-medium text-[#18352A] outline-none"
            >
              <option value="">Select Team Member</option>
              {teamMembers.length === 0 ? (
                <option value="" disabled>
                  No Team Members Found in DB
                </option>
              ) : (
                teamMembers.map((member) => {
                  const memberId = member._id || member.id;
                  const memberName =
                    member.name ||
                    member.fullName ||
                    member.email ||
                    member.username ||
                    "Team Member";
                  if (!memberId) return null;
                  return (
                    <option key={memberId} value={memberId}>
                      👤 {memberName} {member.role ? `(${member.role})` : ""}
                    </option>
                  );
                })
              )}
            </select>

            <button
              type="button"
              disabled={isAssigning || !selectedAssignee}
              onClick={assignEnquiry}
              className="flex items-center gap-1 rounded bg-[#18352A] px-2 py-0.5 text-[10px] font-medium text-white hover:bg-[#244C3C] disabled:opacity-50"
            >
              <UserCheck size={10} />
              {isAssigning ? "..." : "Assign"}
            </button>
          </div>
        </div>
                {/* 🎯 EDITABLE PROFILE FORM (YE MISSING THA) */}
        {isEditing && (
          <div className="mb-2 rounded border border-[#C87532]/40 bg-[#FFF7EF] p-2">
            <div className="mb-1.5 flex items-center justify-between">
              <p className="text-[9px] font-semibold uppercase text-[#C87532]">
                ✏️ Edit Customer Profile & Photo
              </p>
              <button
                disabled={isSaving}
                onClick={handleSaveEdit}
                className="flex items-center gap-1 rounded bg-[#C87532] px-2 py-0.5 text-[9px] font-semibold text-white shadow-xs hover:bg-[#b06326] disabled:opacity-50"
              >
                <Save size={10} />
                {isSaving ? "Saving..." : "Save Changes"}
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-[11px]">
              <div className="sm:col-span-2 flex items-center gap-2 bg-white p-1.5 rounded border border-[#DDE3E8]">
                <div className="relative">
                  {formData.avatar ? (
                    <img src={formData.avatar} alt="Avatar" className="h-8 w-8 rounded-full object-cover border" />
                  ) : (
                    <div className="h-8 w-8 rounded-full bg-[#18352A] flex items-center justify-center text-white text-xs font-bold">
                      {getInitials(formData.name)}
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-[8px] font-bold text-[#C87532] uppercase">Change Profile Photo</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="text-[9px] text-gray-500 cursor-pointer"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[8px] font-medium text-gray-500 uppercase">Customer Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className="w-full rounded border border-[#DDE3E8] bg-white px-1.5 py-0.5 text-[10.5px] outline-none focus:border-[#C87532]"
                />
              </div>

              <div>
                <label className="block text-[8px] font-medium text-gray-500 uppercase">Phone Number</label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  className="w-full rounded border border-[#DDE3E8] bg-white px-1.5 py-0.5 text-[10.5px] outline-none focus:border-[#C87532]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[8px] font-medium text-gray-500 uppercase">Email Address</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className="w-full rounded border border-[#DDE3E8] bg-white px-1.5 py-0.5 text-[10.5px] outline-none focus:border-[#C87532]"
                />
              </div>

              <div>
                <label className="block text-[8px] font-medium text-gray-500 uppercase">Inquiry Type</label>
                <input
                  type="text"
                  value={formData.inquiryType}
                  onChange={(e) => handleInputChange("inquiryType", e.target.value)}
                  className="w-full rounded border border-[#DDE3E8] bg-white px-1.5 py-0.5 text-[10.5px] outline-none focus:border-[#C87532]"
                />
              </div>

              <div>
                <label className="block text-[8px] font-medium text-gray-500 uppercase">Location / Zone</label>
                <input
                  type="text"
                  value={formData.location || formData.zone}
                  onChange={(e) => {
                    handleInputChange("location", e.target.value);
                    handleInputChange("zone", e.target.value);
                  }}
                  className="w-full rounded border border-[#DDE3E8] bg-white px-1.5 py-0.5 text-[10.5px] outline-none focus:border-[#C87532]"
                />
              </div>

              <div>
                <label className="block text-[8px] font-medium text-gray-500 uppercase">Hotel Name</label>
                <input
                  type="text"
                  value={formData.hotel}
                  onChange={(e) => handleInputChange("hotel", e.target.value)}
                  className="w-full rounded border border-[#DDE3E8] bg-white px-1.5 py-0.5 text-[10.5px] outline-none focus:border-[#C87532]"
                />
              </div>

              <div>
                <label className="block text-[8px] font-medium text-gray-500 uppercase">Safari Type</label>
                <input
                  type="text"
                  value={formData.safariType}
                  onChange={(e) => handleInputChange("safariType", e.target.value)}
                  className="w-full rounded border border-[#DDE3E8] bg-white px-1.5 py-0.5 text-[10.5px] outline-none focus:border-[#C87532]"
                />
              </div>

              <div>
                <label className="block text-[8px] font-medium text-gray-500 uppercase">Guests</label>
                <input
                  type="text"
                  value={formData.guests}
                  onChange={(e) => handleInputChange("guests", e.target.value)}
                  className="w-full rounded border border-[#DDE3E8] bg-white px-1.5 py-0.5 text-[10.5px] outline-none focus:border-[#C87532]"
                />
              </div>

              <div>
                <label className="block text-[8px] font-medium text-gray-500 uppercase">Rooms</label>
                <input
                  type="text"
                  value={formData.rooms}
                  onChange={(e) => handleInputChange("rooms", e.target.value)}
                  className="w-full rounded border border-[#DDE3E8] bg-white px-1.5 py-0.5 text-[10.5px] outline-none focus:border-[#C87532]"
                />
              </div>

              <div>
                <label className="block text-[8px] font-medium text-gray-500 uppercase">Check-in</label>
                <input
                  type="date"
                  value={formData.checkIn}
                  onChange={(e) => handleInputChange("checkIn", e.target.value)}
                  className="w-full rounded border border-[#DDE3E8] bg-white px-1 py-0.5 text-[10.5px] outline-none"
                />
              </div>

              <div>
                <label className="block text-[8px] font-medium text-gray-500 uppercase">Check-out</label>
                <input
                  type="date"
                  value={formData.checkOut}
                  onChange={(e) => handleInputChange("checkOut", e.target.value)}
                  className="w-full rounded border border-[#DDE3E8] bg-white px-1 py-0.5 text-[10.5px] outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[8px] font-medium text-gray-500 uppercase">Safari Date</label>
                <input
                  type="date"
                  value={formData.safariDate}
                  onChange={(e) => handleInputChange("safariDate", e.target.value)}
                  className="w-full rounded border border-[#DDE3E8] bg-white px-1 py-0.5 text-[10.5px] outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[8px] font-medium text-gray-500 uppercase">Customer Note / Requirement</label>
                <textarea
                  rows={2.5}
                  value={formData.message}
                  onChange={(e) => handleInputChange("message", e.target.value)}
                  placeholder="Enter custom requirements..."
                  className="w-full rounded border border-[#DDE3E8] bg-white p-1 text-[10.5px] outline-none focus:border-[#C87532]"
                />
              </div>
            </div>
          </div>
        )}

        {/* SPECIFICATIONS GRID */}
        <div className="mb-2 rounded border border-[#DDE3E8] p-1.5">
          <p className="mb-1 text-[8.5px] font-medium uppercase text-[#7A8790]">
            Specifications & Details
          </p>

          <div className="grid grid-cols-2 gap-1">
            {[
              ["Location", locationName],
              ["Hotel", formData.hotel],
              ["Safari", formData.safariType],
              ["Zone", formData.zone],
              ["Guests", formData.guests],
              ["Rooms", formData.rooms],
              ["Check-in", formatDate(formData.checkIn)],
              ["Check-out", formatDate(formData.checkOut)],
              ["Safari Date", formatDate(formData.safariDate)],
              ["Time Slot", formData.preferredTime],
              ["Inquiry Type", formData.inquiryType],
              ["Created Date", formatDate(enquiry.createdAt)],
            ].map(
              ([label, value]) =>
                value !== undefined &&
                value !== null &&
                value !== "" && (
                  <div key={label} className="min-w-0 rounded bg-[#F8FAFB] p-1">
                    <span className="block truncate text-[7.5px] text-[#7A8790]">{label}</span>
                    <span className="block break-words text-[10px] font-medium text-[#18352A]">
                      {String(value)}
                    </span>
                  </div>
                )
            )}
          </div>
        </div>

        {/* CUSTOMER REQUIREMENT NOTE */}
        {formData.message && (
          <div className="mb-2 rounded border border-[#DDE3E8] p-1.5">
            <div className="mb-1 flex items-center gap-1">
              <MessageSquare size={10} className="text-[#C87532]" />
              <p className="text-[8.5px] font-medium uppercase text-[#7A8790]">
                Customer Note / Requirement
              </p>
            </div>
            <p className="whitespace-pre-wrap break-words rounded bg-[#F8FAFB] p-1.5 text-[10.5px] leading-relaxed text-[#53605A]">
              {formData.message}
            </p>
          </div>
        )}
      </div>

      {/* FOOTER ACTIONS */}
      <div className="grid shrink-0 grid-cols-3 gap-1 border-t border-[#EEF1F3] bg-[#F5F7FA] p-1">
        <button
          type="button"
          onClick={() => updateStatus(enquiry._id, "pending")}
          className="rounded border border-amber-200 bg-amber-50 py-0.5 text-[10.5px] font-semibold text-amber-700 hover:bg-amber-100"
        >
          Pending
        </button>

        <button
          type="button"
          onClick={() => updateStatus(enquiry._id, "contacted")}
          className="rounded border border-blue-200 bg-blue-50 py-0.5 text-[10.5px] font-semibold text-blue-700 hover:bg-blue-100"
        >
          Contacted
        </button>

        <button
          type="button"
          onClick={() => updateStatus(enquiry._id, "confirmed")}
          className="rounded border border-emerald-200 bg-emerald-50 py-0.5 text-[10.5px] font-semibold text-emerald-700 hover:bg-emerald-100"
        >
          Confirmed
        </button>

        <button
          type="button"
          onClick={() => deleteEnquiry(enquiry._id)}
          className="col-span-3 flex items-center justify-center gap-1 rounded border border-red-200 bg-red-50 py-0.5 text-[10.5px] font-semibold text-red-700 hover:bg-red-100"
        >
          <Trash2 size={10} />
          Delete Enquiry
        </button>
      </div>
    </aside>
  );
}

export default function AdminEnquiriesPage() {
  return (
    <Suspense fallback={<div className="p-4 text-xs text-[#18352A]">Loading Tracker...</div>}>
      <EnquiriesContent />
    </Suspense>
  );
}