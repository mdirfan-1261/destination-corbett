"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { optimizeImage } from "@/lib/imageOptimizer";
import staticResorts from "@/data/resorts";
import staticLuxuryHotels from "@/data/luxuryStays";
import staticDeluxeHotels from "@/data/deluxeStays";
import {
  ArrowLeft,
  Building2,
  MapPin,
  RefreshCw,
  CheckCircle2,
  XCircle,
  Users,
  X,
  Clock3,
  BedDouble,
  Globe,
  EyeOff,
  Phone,
  Mail,
  CalendarDays,
  ShieldCheck,
  Layers,
  Pencil,
  Trash2,
  Camera,
  ImagePlus,
  Save,
  Star,
  Plus,
  IndianRupee,
  Tag,
  Check,
  Filter,
  ExternalLink,
} from "lucide-react";

const API_URL = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
).replace(/\/+$/, "");

async function stayApi(path, options = {}) {
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("adminToken") || localStorage.getItem("token")
      : null;

  if (!token) {
    throw new Error("Admin session expired. Please log in again.");
  }

  const headers = {
    Authorization: `Bearer ${token}`,
    ...options.headers,
  };

  if (options.body && !(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  });

  const result = await response.json().catch(() => ({}));

  if (!response.ok || result.success === false) {
    throw new Error(
      result.message || `Request failed (${response.status})`
    );
  }

  return result;
}

const DEFAULT_CATEGORIES = [
  {
    slug: "resorts",
    title: "Resorts & Stays",
    description: "Regular resorts and comfortable stays.",
    image: "/stay/resort-hero.webp",
    href: "/stay/resorts",
  },
  {
    slug: "luxury",
    title: "Luxury Resorts",
    description: "Premium and luxury properties.",
    image: "/stay/luxury-resort.webp",
    href: "/stay/luxury",
  },
  {
    slug: "deluxe",
    title: "Deluxe Hotels",
    description: "Deluxe hotels and accommodation.",
    image: "/stay/premium-hotel.webp",
    href: "/stay/deluxe",
  },
  {
    slug: "group_accommodation",
    title: "Group Accommodation",
    description: "Spacious stays for groups, tours and corporate outings.",
    image: "/stay/group-stay.webp",
    href: "/stay/rooms",
  },
];

const PROPERTY_TYPES = [
  { value: "resort", label: "Resort" },
  { value: "hotel", label: "Hotel" },
  { value: "homestay", label: "Homestay" },
  { value: "guest-house", label: "Guest House" },
  { value: "lodge", label: "Lodge" },
  { value: "villa", label: "Villa" },
];

const MAX_IMAGES = 10;
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

// Dynamically generate static website properties using Organisation Profile details
function buildStaticWebsiteProperties(profile = {}) {
  const orgName = profile.name || "Destination Corbett";
  const orgPhone = profile.phone || profile.whatsapp || "";
  const orgEmail = profile.email || "";
  const orgAddress = profile.address || "Jim Corbett";

  return [
    ...(Array.isArray(staticResorts) ? staticResorts : []).map((item) => ({
      id: `static-resort-${item.id || item.slug}`,
      name: item.name,
      propertyType: "resort",
      address: item.location || orgAddress,
      locality: item.locationSlug || "corbett",
      city: "Jim Corbett",
      state: "Uttarakhand",
      description: item.description || "",
      totalRooms: item.rooms?.length || 10,
      pricePerNight: item.rooms?.[0]?.price || 4999,
      maxGuestsPerBooking: 20,
      contactName: orgName,
      contactPhone: orgPhone,
      contactEmail: orgEmail,
      images: (item.images || [item.image])
        .filter(Boolean)
        .map((url, i) => ({ url, isCover: i === 0 })),
      amenities: item.amenities || [],
      propertyStatus: "approved",
      publicationStatus: "published",
      stayCategory: "resorts",
      isStaticListing: true,
    })),
    ...(Array.isArray(staticLuxuryHotels) ? staticLuxuryHotels : []).map((item) => ({
      id: `static-lux-${item.id || item.slug}`,
      name: item.name,
      propertyType: "resort",
      address: item.location || orgAddress,
      locality: item.locationSlug || "corbett",
      city: "Jim Corbett",
      state: "Uttarakhand",
      description: item.description || "",
      totalRooms: 12,
      pricePerNight: item.price || 7499,
      maxGuestsPerBooking: 20,
      contactName: orgName,
      contactPhone: orgPhone,
      contactEmail: orgEmail,
      images: (item.images || [item.image])
        .filter(Boolean)
        .map((url, i) => ({ url, isCover: i === 0 })),
      amenities: item.amenities || [],
      propertyStatus: "approved",
      publicationStatus: "published",
      stayCategory: "luxury",
      isStaticListing: true,
    })),
    ...(Array.isArray(staticDeluxeHotels) ? staticDeluxeHotels : []).map((item) => ({
      id: `static-deluxe-${item.id || item.slug}`,
      name: item.name,
      propertyType: "hotel",
      address: item.location || orgAddress,
      locality: item.locationSlug || "corbett",
      city: "Jim Corbett",
      state: "Uttarakhand",
      description: item.description || "",
      totalRooms: 15,
      pricePerNight: item.price || 4499,
      maxGuestsPerBooking: 20,
      contactName: orgName,
      contactPhone: orgPhone,
      contactEmail: orgEmail,
      images: (item.images || [item.image])
        .filter(Boolean)
        .map((url, i) => ({ url, isCover: i === 0 })),
      amenities: item.amenities || [],
      propertyStatus: "approved",
      publicationStatus: "published",
      stayCategory: "deluxe",
      isStaticListing: true,
    })),
    {
      id: "static-group-1",
      name: "Corbett Jungle Group Retreat",
      propertyType: "resort",
      address: "Dhikuli, Jim Corbett",
      locality: "dhikuli",
      city: "Jim Corbett",
      state: "Uttarakhand",
      description:
        "Spacious group accommodation featuring private cottages, lawns, and group dining for corporate and family groups.",
      totalRooms: 20,
      pricePerNight: 5999,
      maxGuestsPerBooking: 60,
      contactName: orgName,
      contactPhone: orgPhone,
      contactEmail: orgEmail,
      images: [{ url: "/stay/group-stay.webp", isCover: true }],
      amenities: [
        "Free WiFi",
        "Swimming Pool",
        "Conference Hall",
        "Bonfire",
        "Buffet Dining",
      ],
      propertyStatus: "approved",
      publicationStatus: "published",
      stayCategory: "group_accommodation",
      isStaticListing: true,
    },
    {
      id: "static-group-2",
      name: "Wild Riverside Camp & Cottages",
      propertyType: "villa",
      address: "Mohan, Jim Corbett",
      locality: "mohan",
      city: "Jim Corbett",
      state: "Uttarakhand",
      description:
        "Riverside group camp and spacious cottages perfect for big corporate groups, wedding parties, and student tours.",
      totalRooms: 25,
      pricePerNight: 4999,
      maxGuestsPerBooking: 80,
      contactName: orgName,
      contactPhone: orgPhone,
      contactEmail: orgEmail,
      images: [{ url: "/stay/stay-hero.webp", isCover: true }],
      amenities: [
        "River Access",
        "Large Dining Area",
        "Free Parking",
        "Outdoor Activities",
      ],
      propertyStatus: "approved",
      publicationStatus: "published",
      stayCategory: "group_accommodation",
      isStaticListing: true,
    },
  ];
}

function mapProperty(item) {
  return {
    ...item,
    id: item._id || item.id,
    name: item.name || "",
    propertyType: item.propertyType || "resort",
    address: item.address || "",
    locality: item.locality || "",
    city: item.city || "",
    state: item.state || "",
    description: item.description || "",
    totalRooms: item.totalRooms ?? 0,
    pricePerNight: item.pricePerNight ?? 0,
    maxGuestsPerBooking: item.maxGuestsPerBooking ?? 0,
    contactName: item.contactName || "",
    contactPhone: item.contactPhone || "",
    contactEmail: item.contactEmail || "",
    images: Array.isArray(item.images) ? item.images : [],
    amenities: Array.isArray(item.amenities) ? item.amenities : [],
    propertyStatus: item.propertyStatus || "draft",
    publicationStatus: item.publicationStatus || "unpublished",
    stayCategory: item.stayCategory || "",
    rejectionReason: item.rejectionReason || "",
    isActive: item.isActive !== false,
    ownerId: item.ownerId || null,
    agentId: item.agentId || null,
    submittedAt: item.submittedAt || item.createdAt || null,
    isStaticListing: false,
  };
}

const inputClass =
  "w-full rounded-xl border border-gray-200 bg-white px-3 py-3 text-sm text-gray-800 outline-none transition focus:border-[#B96928] focus:ring-2 focus:ring-[#B96928]/10 disabled:bg-gray-50 disabled:text-gray-500";

const labelClass = "mb-1.5 block text-sm font-semibold text-gray-700";

const EMPTY_REVIEW = {
  property: null,
  decision: "",
  reason: "",
};

const EMPTY_PUBLICATION = {
  property: null,
  category: "resorts",
};

function formatDate(date) {
  if (!date) return "Not available";
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return "Not available";
  return parsed.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function getPropertyImage(property) {
  const images = property.images || [];
  const cover = images.find((image) => image.isCover);
  return cover?.url || images[0]?.url || "";
}

function getOwner(property) {
  return property.ownerId || property.agentId || {};
}

function getPropertyStatusStyle(status) {
  const styles = {
    draft: "bg-gray-100 text-gray-600",
    pending: "bg-amber-50 text-amber-700 border-amber-200",
    approved: "bg-green-50 text-green-700 border-green-200",
    rejected: "bg-red-50 text-red-700 border-red-200",
    suspended: "bg-orange-50 text-orange-700 border-orange-200",
  };
  return styles[status] || "bg-gray-100 text-gray-600";
}

function normalizeImages(images) {
  const list = (Array.isArray(images) ? images : []).filter(
    (image) => image && image.url
  );
  if (list.length === 0) return [];
  const coverIndex = list.findIndex((image) => image.isCover);
  const finalCover = coverIndex === -1 ? 0 : coverIndex;
  return list.map((image, index) => ({
    ...image,
    isCover: index === finalCover,
  }));
}

export default function StayManagementPage() {
  const [properties, setProperties] = useState([]);
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Dynamic Organisation Profile state (phone, email, whatsapp, address)
  const [orgProfile, setOrgProfile] = useState({
    name: "Destination Corbett",
    phone: "",
    whatsapp: "",
    email: "",
    address: "Jim Corbett, Uttarakhand",
  });

  const [review, setReview] = useState(EMPTY_REVIEW);
  const [publication, setPublication] = useState(EMPTY_PUBLICATION);

  // Category Edit / Create Modal
  const [categoryModal, setCategoryModal] = useState({
    isOpen: false,
    isNew: false,
    data: {
      slug: "",
      title: "",
      description: "",
      image: "",
      href: "",
      order: 1,
      isActive: true,
    },
  });

  // Category Change Modal for property
  const [changeCatModal, setChangeCatModal] = useState({
    isOpen: false,
    property: null,
    newCategory: "resorts",
  });

  // Price Edit State
  const [priceModal, setPriceModal] = useState({
    isOpen: false,
    property: null,
    amount: "",
  });

  // Full Property Edit state
  const [editingId, setEditingId] = useState(null);
  const [draft, setDraft] = useState(null);

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  // Static properties editable overrides & deleted IDs stored in localStorage
  const [staticOverrides, setStaticOverrides] = useState({});
  const [deletedStaticIds, setDeletedStaticIds] = useState([]);

  useEffect(() => {
    try {
      const savedOverrides = localStorage.getItem("DC_STATIC_PROPERTIES_OVERRIDES");
      if (savedOverrides) {
        setStaticOverrides(JSON.parse(savedOverrides));
      }
      const savedDeleted = localStorage.getItem("DC_STATIC_PROPERTIES_DELETED");
      if (savedDeleted) {
        setDeletedStaticIds(JSON.parse(savedDeleted));
      }
    } catch {
      // ignore
    }
  }, []);

  function saveStaticOverride(propertyId, changes) {
    setStaticOverrides((prev) => {
      const updated = {
        ...prev,
        [propertyId]: { ...(prev[propertyId] || {}), ...changes },
      };
      try {
        localStorage.setItem(
          "DC_STATIC_PROPERTIES_OVERRIDES",
          JSON.stringify(updated)
        );
      } catch {}
      return updated;
    });
  }

  function deleteStaticProperty(propertyId) {
    setDeletedStaticIds((prev) => {
      const updated = [...prev, propertyId];
      try {
        localStorage.setItem(
          "DC_STATIC_PROPERTIES_DELETED",
          JSON.stringify(updated)
        );
      } catch {}
      return updated;
    });
  }

  const fileInputRef = useRef(null);

  const showMessage = (text) => setMessage(text);

  // Load Dynamic Organisation Profile from database
  const loadOrgProfile = useCallback(async () => {
    try {
      // 1. Try Admin profile endpoint
      let res = await stayApi("/api/organisation/profile").catch(() => null);

      // 2. Fallback to public endpoint if admin endpoint has issue
      if (!res?.data && !res?.profile) {
        const pub = await fetch(`${API_URL}/api/public/organisation/profile`).catch(() => null);
        if (pub && pub.ok) {
          res = await pub.json().catch(() => null);
        }
      }

      const data = res?.profile || res?.data || res?.organisation || res;
      if (data && typeof data === "object") {
        setOrgProfile({
          name: data.companyName || data.name || "Destination Corbett",
          phone:
            data.phone ||
            data.primaryPhone ||
            data.contactNumber ||
            data.mobile ||
            "",
          whatsapp:
            data.whatsapp ||
            data.whatsappNumber ||
            data.phone ||
            "",
          email: data.email || data.contactEmail || data.supportEmail || "",
          address: data.address || data.location || "Jim Corbett, Uttarakhand",
        });
      }
    } catch (err) {
      console.error("Organisation profile fetch error:", err);
    }
  }, []);

  // Load Categories from Backend
  const loadCategories = useCallback(async () => {
    try {
      const result = await stayApi("/api/admin/stay-categories");
      if (result.success && Array.isArray(result.data) && result.data.length > 0) {
        setCategories(result.data);
      }
    } catch {
      // Fallback stays in place
    }
  }, []);

  // Load Properties
  const loadData = useCallback(async () => {
    setLoading(true);
    setMessage("");
    try {
      const result = await stayApi(
        "/api/admin/properties?status=all&page=1&limit=100"
      );
      setProperties(
        (Array.isArray(result.data) ? result.data : []).map(mapProperty)
      );
    } catch (error) {
      showMessage(error.message || "Unable to load stay properties.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadOrgProfile();
    loadCategories();
    loadData();
  }, [loadOrgProfile, loadCategories, loadData]);

  function getCategoryLabel(slug) {
    return (
      categories.find((item) => item.slug === slug)?.title ||
      "Not assigned"
    );
  }

  // Dynamic Static Website Properties updated with Organisation Profile details
  const dynamicStaticWebsiteProperties = useMemo(() => {
    return buildStaticWebsiteProperties(orgProfile);
  }, [orgProfile]);

  // Combine DB submissions with Core Website Static properties
  const activeStaticProperties = dynamicStaticWebsiteProperties
    .filter((p) => !deletedStaticIds.includes(p.id))
    .map((p) => {
      const override = staticOverrides[p.id];
      // Note: contact details always prioritize fresh orgProfile
      return override
        ? {
            ...p,
            ...override,
            contactName: orgProfile.name || p.contactName,
            contactPhone: orgProfile.phone || orgProfile.whatsapp || p.contactPhone,
            contactEmail: orgProfile.email || p.contactEmail,
          }
        : p;
    });

  const allDisplayProperties = [...properties, ...activeStaticProperties];

  // Filter properties
  const filteredProperties = allDisplayProperties.filter((property) => {
    // Category filter
    if (selectedCategory !== "all" && property.stayCategory !== selectedCategory) {
      return false;
    }

    // Status filter
    if (statusFilter !== "all" && property.propertyStatus !== statusFilter) {
      return false;
    }

    // Type filter
    if (typeFilter !== "all" && property.propertyType !== typeFilter) {
      return false;
    }

    // Search query
    if (search.trim()) {
      const query = search.toLowerCase();
      const owner = getOwner(property);
      const isStatic = Boolean(property.isStaticListing);
      const matchesName = property.name?.toLowerCase().includes(query);
      const matchesCity = property.city?.toLowerCase().includes(query);
      const matchesOwner = (isStatic ? orgProfile.name : owner.name)?.toLowerCase().includes(query);
      const matchesPhone = (isStatic ? (orgProfile.phone || orgProfile.whatsapp) : (owner.phone || property.contactPhone))?.includes(query);
      return matchesName || matchesCity || matchesOwner || matchesPhone;
    }

    return true;
  });

  const pendingProperties = properties.filter(
    (property) => property.propertyStatus === "pending"
  ).length;

  const approvedProperties = properties.filter(
    (property) => property.propertyStatus === "approved"
  ).length;

  const publishedProperties = properties.filter(
    (property) => property.publicationStatus === "published"
  ).length;

  // ---------------- CATEGORY CRUD ACTIONS ----------------
  function openAddCategory() {
    setCategoryModal({
      isOpen: true,
      isNew: true,
      data: {
        slug: "",
        title: "",
        description: "",
        image: "/stay/resort-hero.webp",
        href: "",
        order: categories.length + 1,
        isActive: true,
      },
    });
  }

  function openEditCategory(cat) {
    setCategoryModal({
      isOpen: true,
      isNew: false,
      data: {
        slug: cat.slug,
        title: cat.title,
        description: cat.description || "",
        image: cat.image || "",
        href: cat.href || `/stay/${cat.slug}`,
        order: cat.order ?? 1,
        isActive: cat.isActive !== false,
      },
    });
  }

  async function handleSaveCategory() {
    const { slug, title, description, image, href, order, isActive } = categoryModal.data;
    if (!title?.trim()) {
      showMessage("Category title is required.");
      return;
    }
    const cleanSlug = (slug || title)
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "_")
      .replace(/[^a-z0-9_]/g, "");

    if (!cleanSlug) {
      showMessage("A valid slug is required.");
      return;
    }

    setSaving(true);
    try {
      if (categoryModal.isNew) {
        await stayApi("/api/admin/stay-categories", {
          method: "POST",
          body: JSON.stringify({
            slug: cleanSlug,
            title: title.trim(),
            description: description?.trim(),
            image: image?.trim(),
            href: href?.trim() || `/stay/${cleanSlug}`,
            order: Number(order) || 1,
            isActive,
          }),
        });
        showMessage(`Category "${title}" created successfully!`);
      } else {
        await stayApi(`/api/admin/stay-categories/${categoryModal.data.slug}`, {
          method: "PATCH",
          body: JSON.stringify({
            title: title.trim(),
            description: description?.trim(),
            image: image?.trim(),
            href: href?.trim() || `/stay/${categoryModal.data.slug}`,
            order: Number(order) || 1,
            isActive,
          }),
        });
        showMessage(`Category "${title}" updated successfully!`);
      }
      setCategoryModal({ isOpen: false, isNew: false, data: {} });
      await loadCategories();
    } catch (err) {
      showMessage(err.message || "Failed to save category.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteCategory(cat) {
    const confirmed = window.confirm(
      `Are you sure you want to delete category "${cat.title}"? Properties assigned to it will retain their status.`
    );
    if (!confirmed) return;

    setSaving(true);
    try {
      await stayApi(`/api/admin/stay-categories/${cat.slug}`, {
        method: "DELETE",
      });
      showMessage(`Category "${cat.title}" deleted.`);
      if (selectedCategory === cat.slug) setSelectedCategory("all");
      await loadCategories();
    } catch (err) {
      showMessage(err.message || "Failed to delete category.");
    } finally {
      setSaving(false);
    }
  }

  // ---------------- PRICE EDIT ACTION ----------------
  function openPriceModal(property) {
    setPriceModal({
      isOpen: true,
      property,
      amount: String(property.pricePerNight || ""),
    });
  }

  async function savePrice() {
    const property = priceModal.property;
    if (!property?.id) return;
    const amountNum = Math.max(0, Number(priceModal.amount) || 0);

    if (property.isStaticListing) {
      saveStaticOverride(property.id, { pricePerNight: amountNum });
      setPriceModal({ isOpen: false, property: null, amount: "" });
      showMessage(`Rate updated to ₹${amountNum.toLocaleString("en-IN")}/night.`);
      return;
    }

    setSaving(true);
    try {
      await stayApi(`/api/admin/properties/${property.id}/price`, {
        method: "PATCH",
        body: JSON.stringify({ pricePerNight: amountNum }),
      });
      setProperties((prev) =>
        prev.map((p) =>
          p.id === property.id ? { ...p, pricePerNight: amountNum } : p
        )
      );
      setPriceModal({ isOpen: false, property: null, amount: "" });
      showMessage(`Rate updated to ₹${amountNum.toLocaleString("en-IN")}/night.`);
    } catch (err) {
      showMessage(err.message || "Unable to update rate.");
    } finally {
      setSaving(false);
    }
  }

  // ---------------- CATEGORY CHANGE ACTION ----------------
  function openChangeCategoryModal(property) {
    setChangeCatModal({
      isOpen: true,
      property,
      newCategory: property.stayCategory || categories[0]?.slug || "resorts",
    });
  }

  async function saveCategoryChange() {
    const property = changeCatModal.property;
    const newCategory = changeCatModal.newCategory;
    if (!property?.id || !newCategory) return;

    if (property.isStaticListing) {
      saveStaticOverride(property.id, { stayCategory: newCategory });
      setChangeCatModal({ isOpen: false, property: null, newCategory: "resorts" });
      showMessage(
        `Property category updated to "${getCategoryLabel(newCategory)}".`
      );
      return;
    }

    setSaving(true);
    try {
      await stayApi(`/api/admin/properties/${property.id}/category`, {
        method: "PATCH",
        body: JSON.stringify({ stayCategory: newCategory }),
      });
      setProperties((prev) =>
        prev.map((p) =>
          p.id === property.id ? { ...p, stayCategory: newCategory } : p
        )
      );
      setChangeCatModal({ isOpen: false, property: null, newCategory: "resorts" });
      showMessage(
        `Property category updated to "${getCategoryLabel(newCategory)}".`
      );
    } catch (err) {
      showMessage(err.message || "Unable to update category.");
    } finally {
      setSaving(false);
    }
  }

  // ---------------- REVIEW (APPROVE / REJECT) ----------------
  function openReview(property, decision) {
    setReview({
      property,
      decision,
      reason: "",
    });
    setMessage("");
  }

  function closeReview() {
    setReview(EMPTY_REVIEW);
  }

  async function submitReview() {
    const property = review.property;
    const decision = review.decision;
    if (!property?.id || !decision) return;

    if (decision === "reject" && !review.reason.trim()) {
      showMessage("Please enter a rejection reason.");
      return;
    }

    setSaving(true);
    setMessage("");
    try {
      await stayApi(`/api/admin/properties/${property.id}/review`, {
        method: "PATCH",
        body: JSON.stringify({
          decision,
          reason: decision === "reject" ? review.reason.trim() : "",
        }),
      });
      closeReview();
      await loadData();
      showMessage(
        decision === "approve"
          ? "Property approved successfully."
          : "Property rejected successfully."
      );
    } catch (error) {
      showMessage(error.message || "Unable to review property.");
    } finally {
      setSaving(false);
    }
  }

  // ---------------- PUBLICATION (PUBLISH / UNPUBLISH) ----------------
  function openPublicationModal(property) {
    setPublication({
      property,
      category: categories.some((item) => item.slug === property.stayCategory)
        ? property.stayCategory
        : categories[0]?.slug || "resorts",
    });
    setMessage("");
  }

  function closePublicationModal() {
    setPublication(EMPTY_PUBLICATION);
  }

  async function confirmPublication() {
    const property = publication.property;
    const category = publication.category;
    if (!property?.id) return;

    setSaving(true);
    setMessage("");
    try {
      await stayApi(`/api/admin/properties/${property.id}/publication`, {
        method: "PATCH",
        body: JSON.stringify({
          publicationStatus: "published",
          stayCategory: category,
        }),
      });
      closePublicationModal();
      await loadData();
      showMessage(
        `Property published successfully under ${getCategoryLabel(category)}.`
      );
    } catch (error) {
      showMessage(error.message || "Unable to publish property.");
    } finally {
      setSaving(false);
    }
  }

  async function togglePublication(property) {
    if (property.isStaticListing) {
      const nextStatus =
        property.publicationStatus === "published"
          ? "unpublished"
          : "published";
      saveStaticOverride(property.id, { publicationStatus: nextStatus });
      showMessage(
        nextStatus === "published"
          ? `"${property.name}" published to ${getCategoryLabel(property.stayCategory)}.`
          : `"${property.name}" unpublished.`
      );
      return;
    }

    if (property.publicationStatus !== "published") {
      openPublicationModal(property);
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to unpublish "${property.name}"?`
    );
    if (!confirmed) return;

    setSaving(true);
    setMessage("");
    try {
      await stayApi(`/api/admin/properties/${property.id}/publication`, {
        method: "PATCH",
        body: JSON.stringify({
          publicationStatus: "unpublished",
        }),
      });
      await loadData();
      showMessage(
        "Property unpublished successfully. Its assigned category has been retained."
      );
    } catch (error) {
      showMessage(error.message || "Unable to unpublish property.");
    } finally {
      setSaving(false);
    }
  }

  // ---------------- DELETE PROPERTY ACTION (STATIC & DB) ----------------
  async function handleDeleteProperty(property) {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${property.name}"? This will remove it from the stay department.`
    );
    if (!confirmed) return;

    if (property.isStaticListing) {
      deleteStaticProperty(property.id);
      showMessage(`Property "${property.name}" deleted.`);
      return;
    }

    setSaving(true);
    try {
      await stayApi(`/api/admin/properties/${property.id}`, {
        method: "DELETE",
      });
      setProperties((prev) => prev.filter((p) => p.id !== property.id));
      showMessage(`Property "${property.name}" deleted successfully.`);
    } catch (err) {
      showMessage(err.message || "Failed to delete property.");
    } finally {
      setSaving(false);
    }
  }

  // ---------------- FULL PROPERTY EDIT ----------------
  function updateDraft(field, value) {
    setDraft((previous) => ({
      ...previous,
      [field]: value,
    }));
  }

  function startEdit(property) {
    const isStatic = Boolean(property.isStaticListing);
    setEditingId(property.id);
    setDraft({
      id: property.id,
      name: property.name,
      propertyType: property.propertyType,
      address: property.address,
      locality: property.locality,
      city: property.city,
      state: property.state,
      description: property.description,
      totalRooms: String(property.totalRooms ?? ""),
      pricePerNight: String(property.pricePerNight ?? "0"),
      maxGuestsPerBooking: String(property.maxGuestsPerBooking ?? ""),
      contactName: isStatic ? (orgProfile.name || property.contactName) : property.contactName,
      contactPhone: isStatic ? (orgProfile.phone || orgProfile.whatsapp || property.contactPhone) : property.contactPhone,
      contactEmail: isStatic ? (orgProfile.email || property.contactEmail) : property.contactEmail,
      images: normalizeImages(property.images),
      isStaticListing: isStatic,
    });
    setMessage("");
  }

  function cancelEdit() {
    if (saving || uploading) return;
    setEditingId(null);
    setDraft(null);
  }

  function setCoverImage(index) {
    setDraft((previous) => ({
      ...previous,
      images: previous.images.map((image, imageIndex) => ({
        ...image,
        isCover: imageIndex === index,
      })),
    }));
  }

  function removeImage(index) {
    setDraft((previous) => ({
      ...previous,
      images: normalizeImages(
        previous.images.filter((_, imageIndex) => imageIndex !== index)
      ),
    }));
  }

  async function handleImageChange(event) {
    const files = Array.from(event.target.files || []);
    if (files.length === 0 || !draft) return;

    const remainingSlots = MAX_IMAGES - draft.images.length;
    if (remainingSlots <= 0) {
      showMessage(`You can add up to ${MAX_IMAGES} images.`);
      event.target.value = "";
      return;
    }

    const selectedFiles = files.slice(0, remainingSlots);
    setUploading(true);
    setMessage("Uploading images...");
    const uploaded = [];

    try {
      for (const file of selectedFiles) {
        const optimizedFile = await optimizeImage(file);
        const formData = new FormData();
        formData.append("image", optimizedFile);
        formData.append("folder", "stay");

        const result = await stayApi("/api/images/upload", {
          method: "POST",
          body: formData,
        });

        const imageData = result.data || {};
        const imageUrl = imageData.url || imageData.secure_url;
        if (!imageUrl) throw new Error("Image upload failed.");

        uploaded.push({
          url: imageUrl,
          assetId: imageData.assetId || imageData.public_id || "",
          isCover: false,
        });
      }

      setDraft((previous) => ({
        ...previous,
        images: normalizeImages([...previous.images, ...uploaded]),
      }));
      showMessage("Images uploaded. Save the property to apply.");
    } catch (error) {
      showMessage(error.message || "Image upload failed.");
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  }

  async function saveProperty() {
    if (!draft || !editingId) return;
    if (!draft.name.trim()) {
      showMessage("Property name is required.");
      return;
    }

    const isStatic = draft.isStaticListing || editingId.startsWith("static-");

    if (isStatic) {
      const updatedFields = {
        name: draft.name.trim(),
        propertyType: draft.propertyType,
        address: draft.address.trim(),
        locality: draft.locality.trim(),
        city: draft.city.trim(),
        state: draft.state.trim(),
        description: draft.description.trim(),
        totalRooms: Number(draft.totalRooms) || 0,
        pricePerNight: Number(draft.pricePerNight) || 0,
        maxGuestsPerBooking: Number(draft.maxGuestsPerBooking) || 20,
        contactName: orgProfile.name || draft.contactName.trim(),
        contactPhone: orgProfile.phone || orgProfile.whatsapp || draft.contactPhone.trim(),
        contactEmail: orgProfile.email || draft.contactEmail.trim(),
        images: normalizeImages(draft.images),
      };

      saveStaticOverride(editingId, updatedFields);
      cancelEdit();
      showMessage(`"${updatedFields.name}" updated successfully.`);
      return;
    }

    setSaving(true);
    try {
      const payload = {
        name: draft.name.trim(),
        propertyType: draft.propertyType,
        address: draft.address.trim(),
        locality: draft.locality.trim(),
        city: draft.city.trim(),
        state: draft.state.trim(),
        description: draft.description.trim(),
        totalRooms: Number(draft.totalRooms) || 0,
        pricePerNight: Number(draft.pricePerNight) || 0,
        maxGuestsPerBooking: Number(draft.maxGuestsPerBooking) || 20,
        contactName: draft.contactName.trim(),
        contactPhone: draft.contactPhone.trim(),
        contactEmail: draft.contactEmail.trim(),
        images: normalizeImages(draft.images),
      };

      await stayApi(`/api/admin/properties/${editingId}`, {
        method: "PUT",
        body: JSON.stringify(payload),
      });

      cancelEdit();
      await loadData();
      showMessage("Property updated successfully.");
    } catch (err) {
      showMessage(err.message || "Failed to update property.");
    } finally {
      setSaving(false);
    }
  }

  const busy = loading || saving || uploading;
  const currentEditingProperty =
    allDisplayProperties.find((p) => p.id === editingId) || null;

  return (
    <main className="min-h-screen bg-[#F7F5F0] px-4 py-6 text-[#172033] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* HEADER */}
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <Link
              href="/admin"
              aria-label="Back to admin dashboard"
              className="mt-1 flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white hover:bg-gray-50"
            >
              <ArrowLeft size={18} />
            </Link>

            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#B96928]">
                Organization / Departments
              </p>
              <h1 className="mt-1 text-2xl font-black sm:text-3xl">
                Stay Department Management
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Manage website stay categories, partner/owner properties, rates and publication.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={openAddCategory}
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#172033] px-4 py-3 text-sm font-bold text-white hover:bg-black"
            >
              <Plus size={16} />
              Add Stay Category
            </button>

            <button
              type="button"
              onClick={() => {
                loadOrgProfile();
                loadCategories();
                loadData();
              }}
              disabled={busy}
              className="inline-flex items-center gap-2 rounded-xl bg-[#B96928] px-4 py-3 text-sm font-bold text-white hover:bg-[#9D5721] disabled:opacity-50"
            >
              <RefreshCw size={17} className={loading ? "animate-spin" : ""} />
              Refresh
            </button>
          </div>
        </header>

        {/* NOTIFICATION MESSAGE */}
        {message && (
          <div
            role="status"
            className="flex items-start justify-between gap-3 rounded-xl border border-gray-200 bg-white p-4 text-sm font-medium shadow-sm"
          >
            <span>{message}</span>
            <button
              type="button"
              onClick={() => setMessage("")}
              className="text-gray-500 hover:text-gray-900"
            >
              <X size={17} />
            </button>
          </div>
        )}

        {/* ============================================================== */}
        {/* SECTION 1: STAY WEBSITE CATEGORIES (EDITABLE CARDS)             */}
        {/* ============================================================== */}
        <section className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h2 className="text-lg font-black text-[#172033]">
                Website Stay Categories ({categories.length})
              </h2>
              <p className="text-xs text-gray-500">
                Click any card to view all properties (static website resorts + submissions).
              </p>
            </div>

            {selectedCategory !== "all" && (
              <button
                type="button"
                onClick={() => setSelectedCategory("all")}
                className="inline-flex items-center gap-1.5 rounded-lg border border-[#B96928] bg-white px-3 py-1.5 text-xs font-bold text-[#B96928] hover:bg-[#B96928]/5"
              >
                Clear Category Filter ({getCategoryLabel(selectedCategory)}) ✕
              </button>
            )}
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map((cat) => {
              const count = allDisplayProperties.filter((p) => p.stayCategory === cat.slug).length;
              const isSelected = selectedCategory === cat.slug;

              return (
                <div
                  key={cat.slug}
                  className={`group relative overflow-hidden rounded-2xl border bg-white shadow-sm transition-all duration-200 hover:shadow-md ${
                    isSelected
                      ? "border-2 border-[#B96928] ring-2 ring-[#B96928]/20"
                      : "border-gray-200"
                  }`}
                >
                  {/* Category Image Header */}
                  <div
                    onClick={() => {
                      setSelectedCategory(isSelected ? "all" : cat.slug);
                      setTimeout(() => {
                        document.getElementById("property-list-section")?.scrollIntoView({ behavior: "smooth" });
                      }, 50);
                    }}
                    className="relative h-28 w-full cursor-pointer bg-gray-900"
                  >
                    <img
                      src={cat.image || "/stay/resort-hero.webp"}
                      alt={cat.title}
                      className="h-full w-full object-cover brightness-90 transition-transform duration-300 group-hover:scale-105"
                      onError={(e) => {
                        e.target.src = "/stay/resort-hero.webp";
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                    <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between text-white">
                      <span className="rounded-full bg-white/20 px-2.5 py-0.5 text-[10px] font-extrabold uppercase backdrop-blur-md">
                        {count} Properties
                      </span>
                      {isSelected && (
                        <span className="rounded-full bg-[#B96928] px-2 py-0.5 text-[10px] font-bold">
                          Active Filter
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Category Details */}
                  <div className="p-4">
                    <div className="flex items-start justify-between gap-1">
                      <h3
                        onClick={() => {
                          setSelectedCategory(isSelected ? "all" : cat.slug);
                          setTimeout(() => {
                            document.getElementById("property-list-section")?.scrollIntoView({ behavior: "smooth" });
                          }, 50);
                        }}
                        className="cursor-pointer font-extrabold text-[#172033] hover:text-[#B96928]"
                      >
                        {cat.title}
                      </h3>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => openEditCategory(cat)}
                          title="Edit Category Details"
                          className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100 hover:text-[#B96928]"
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteCategory(cat)}
                          title="Delete Category"
                          className="rounded-lg p-1.5 text-gray-500 hover:bg-red-50 hover:text-red-600"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>

                    <p className="mt-1 line-clamp-2 text-xs text-gray-500">
                      {cat.description || "No description provided."}
                    </p>

                    <div className="mt-3 flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedCategory(isSelected ? "all" : cat.slug);
                          setTimeout(() => {
                            document.getElementById("property-list-section")?.scrollIntoView({ behavior: "smooth" });
                          }, 50);
                        }}
                        className={`flex-1 rounded-xl py-2 text-xs font-bold transition ${
                          isSelected
                            ? "bg-[#B96928] text-white"
                            : "border border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-100"
                        }`}
                      >
                        {isSelected ? "Showing Properties ✓" : "View Properties ↓"}
                      </button>
                      <Link
                        href={cat.href || `/stay/${cat.slug}`}
                        target="_blank"
                        title="Open Live Public Website Page in New Tab"
                        className="inline-flex items-center justify-center rounded-xl border border-gray-200 bg-gray-50 px-2.5 py-2 text-xs font-bold text-gray-700 hover:bg-gray-100 hover:text-[#B96928]"
                      >
                        <ExternalLink size={13} />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* SUMMARY STATS */}
        <section className="grid gap-4 sm:grid-cols-3">
          <SummaryCard
            icon={<Building2 size={20} />}
            title="Total Properties"
            value={allDisplayProperties.length}
            subtitle={`${activeStaticProperties.length} core website + ${properties.length} submissions`}
          />
          <SummaryCard
            icon={<Clock3 size={20} />}
            title="Pending Submissions"
            value={pendingProperties}
            subtitle="Needs admin approval"
          />
          <SummaryCard
            icon={<CheckCircle2 size={20} />}
            title="Approved & Published"
            value={publishedProperties + activeStaticProperties.length}
            subtitle="Live on the website"
          />
        </section>

        {/* ============================================================== */}
        {/* SECTION 2: PROPERTY LIST & FILTER CONTROLS                      */}
        {/* ============================================================== */}
        <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-extrabold">Property Directory</h2>
              <p className="mt-1 text-xs text-gray-500">
                Review website properties and partner submissions for the selected category.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-gray-100 px-3 py-1.5 text-xs font-bold text-gray-600">
                {filteredProperties.length} Properties
              </span>
            </div>
          </div>

          <div className="mt-4 grid gap-3 md:grid-cols-3">
            <input
              className={inputClass}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search property name, location, phone..."
            />

            {/* Status Filter */}
            <select
              className={inputClass}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending Submissions</option>
              <option value="approved">Approved &amp; Published</option>
              <option value="draft">Draft</option>
              <option value="rejected">Rejected</option>
            </select>

            {/* Type Filter */}
            <select
              className={inputClass}
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
            >
              <option value="all">All Property Types</option>
              {PROPERTY_TYPES.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>
        </section>

        {/* LOADING */}
        {loading && (
          <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center text-sm text-gray-500">
            Loading stay properties...
          </div>
        )}

        {/* PROPERTY LIST */}
        <section id="property-list-section" className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-black">Stay Properties</h2>
              <p className="mt-1 text-xs text-gray-500">
                {selectedCategory === "all"
                  ? "Showing all properties across all categories."
                  : `Filtered by category: ${getCategoryLabel(selectedCategory)} (${filteredProperties.length} properties)`}
              </p>
            </div>
          </div>

          {!loading && filteredProperties.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-10 text-center">
              <Building2 className="mx-auto text-gray-400" size={38} />
              <h3 className="mt-3 font-bold">No properties found</h3>
              <p className="mt-1 text-sm text-gray-500">
                No property matches your current filters or category selection.
              </p>
            </div>
          ) : (
            !loading && (
              <div className="grid gap-5 xl:grid-cols-2">
                {filteredProperties.map((property) => {
                  const coverImage = getPropertyImage(property);
                  const owner = getOwner(property);
                  const isPublished =
                    property.publicationStatus === "published";
                  const isStatic = Boolean(property.isStaticListing);

                  // DYNAMIC VALUES DIRECTLY FROM ORGANISATION PROFILE FOR STATIC LISTINGS
                  const displayOwnerName = isStatic
                    ? (orgProfile.name || "Destination Corbett")
                    : (owner.name || property.contactName || "Direct Owner");

                  const displayPhone = isStatic
                    ? (orgProfile.phone || orgProfile.whatsapp || "Not Set")
                    : (owner.phone || property.contactPhone || orgProfile.phone || orgProfile.whatsapp || "Not Set");

                  const displayEmail = isStatic
                    ? (orgProfile.email || "Not Set")
                    : (owner.email || property.contactEmail || orgProfile.email || "Not Set");

                  const displayAddress = isStatic
                    ? (property.address || orgProfile.address || "Jim Corbett")
                    : (owner.address || property.address || orgProfile.address || "Jim Corbett");

                  return (
                    <article
                      key={property.id}
                      className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md"
                    >
                      {/* CARD TOP HEADER */}
                      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 p-4">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-lg font-black text-[#172033]">
                            {property.name}
                          </h3>

                          {/* Approval Status Badge */}
                          <span
                            className={`rounded-full border px-2.5 py-0.5 text-xs font-bold capitalize ${getPropertyStatusStyle(
                              property.propertyStatus
                            )}`}
                          >
                            {property.propertyStatus}
                          </span>

                          {/* Static Core vs Submitted Badge */}
                          {isStatic ? (
                            <span className="inline-flex items-center gap-1 rounded-full border border-sky-300 bg-sky-50 px-2.5 py-0.5 text-xs font-bold text-sky-800">
                              🌐 Core Website Listing
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 rounded-full border border-emerald-300 bg-emerald-50 px-2.5 py-0.5 text-xs font-bold text-emerald-800">
                              ⭐ Direct Owner Property
                            </span>
                          )}
                        </div>

                        {/* Publication Status Badge */}
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-xs font-extrabold capitalize ${
                            isPublished
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {property.publicationStatus}
                        </span>
                      </div>

                      {/* CARD BODY */}
                      <div className="grid gap-4 p-5 sm:grid-cols-3">
                        {/* Cover Image */}
                        <div className="relative h-36 overflow-hidden rounded-xl bg-gray-100 sm:h-full">
                          {coverImage ? (
                            <img
                              src={coverImage}
                              alt={property.name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center text-xs text-gray-400">
                              No image
                            </div>
                          )}
                        </div>

                        {/* Details */}
                        <div className="space-y-3 sm:col-span-2">
                          <div className="flex items-center gap-1.5 text-xs text-gray-500">
                            <MapPin size={14} className="text-[#B96928]" />
                            <span>
                              {[property.locality, property.city, property.state]
                                .filter(Boolean)
                                .join(", ") || "Location not set"}
                            </span>
                          </div>

                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <div className="rounded-lg bg-gray-50 p-2">
                              <span className="text-gray-400">Type</span>
                              <p className="font-bold capitalize text-gray-800">
                                {property.propertyType}
                              </p>
                            </div>

                            <div className="rounded-lg bg-gray-50 p-2">
                              <span className="text-gray-400">Rooms</span>
                              <p className="font-bold text-gray-800">
                                {property.totalRooms || 0} Rooms
                              </p>
                            </div>
                          </div>

                          {/* RATE / AMOUNT EDIT BOX */}
                          <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-amber-50/50 p-2.5 text-xs">
                            <div>
                              <span className="font-medium text-gray-500">
                                Rate / Night:
                              </span>{" "}
                              <span className="text-sm font-black text-[#172033]">
                                ₹{(property.pricePerNight || 0).toLocaleString("en-IN")}
                              </span>
                            </div>
                            <button
                              type="button"
                              onClick={() => openPriceModal(property)}
                              className="inline-flex items-center gap-1 rounded-lg bg-white px-2.5 py-1 text-xs font-bold text-[#B96928] shadow-sm hover:bg-gray-50"
                            >
                              <Pencil size={12} />
                              Edit Rate
                            </button>
                          </div>

                          {/* WEBSITE STAY CATEGORY ASSIGNMENT */}
                          <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-gray-50 p-2.5 text-xs">
                            <div>
                              <span className="font-medium text-gray-500">
                                Website Category:
                              </span>{" "}
                              <span className="font-bold text-[#B96928]">
                                {getCategoryLabel(property.stayCategory)}
                              </span>
                            </div>
                            <button
                              type="button"
                              onClick={() => openChangeCategoryModal(property)}
                              className="inline-flex items-center gap-1 rounded-lg bg-white px-2.5 py-1 text-xs font-bold text-gray-700 shadow-sm hover:bg-gray-100"
                            >
                              <Tag size={12} />
                              Change
                            </button>
                          </div>

                          {/* PROPERTY OWNER DETAILS - 100% DYNAMIC */}
                          <div className="rounded-xl border border-gray-100 bg-gray-50/70 p-3 text-xs">
                            <p className="font-bold text-gray-700">Property Details / Owner</p>
                            <div className="mt-2 grid grid-cols-2 gap-2 text-gray-600">
                              <div>
                                <span className="text-gray-400">Owner Name:</span>
                                <p className="font-bold text-gray-800">
                                  {displayOwnerName}
                                </p>
                              </div>
                              <div>
                                <span className="text-gray-400">Phone:</span>
                                <p className="font-bold text-gray-800">
                                  {displayPhone}
                                </p>
                              </div>
                              <div>
                                <span className="text-gray-400">Email:</span>
                                <p className="font-bold text-gray-800 truncate">
                                  {displayEmail}
                                </p>
                              </div>
                              <div>
                                <span className="text-gray-400">Address:</span>
                                <p className="font-bold text-gray-800 truncate">
                                  {displayAddress}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* CARD ACTIONS */}
                      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-gray-100 bg-gray-50/50 p-4">
                        <div className="flex flex-wrap items-center gap-2">
                          {/* Approve / Reject if pending */}
                          {property.propertyStatus === "pending" && !isStatic && (
                            <>
                              <button
                                type="button"
                                disabled={busy}
                                onClick={() => openReview(property, "approve")}
                                className="inline-flex items-center gap-1 rounded-xl bg-green-600 px-3 py-2 text-xs font-bold text-white hover:bg-green-700 disabled:opacity-50"
                              >
                                <CheckCircle2 size={14} />
                                Approve
                              </button>
                              <button
                                type="button"
                                disabled={busy}
                                onClick={() => openReview(property, "reject")}
                                className="inline-flex items-center gap-1 rounded-xl border border-red-200 bg-white px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-50 disabled:opacity-50"
                              >
                                <XCircle size={14} />
                                Reject
                              </button>
                            </>
                          )}

                          {/* Full Edit Button for ALL properties */}
                          <button
                            type="button"
                            disabled={busy}
                            onClick={() => startEdit(property)}
                            className="inline-flex items-center gap-1 rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs font-bold text-gray-700 hover:bg-gray-100 disabled:opacity-50"
                          >
                            <Pencil size={14} />
                            Full Edit
                          </button>

                          {/* Delete Button for ALL properties */}
                          <button
                            type="button"
                            disabled={busy}
                            onClick={() => handleDeleteProperty(property)}
                            title="Delete Property"
                            className="inline-flex items-center gap-1 rounded-xl border border-red-200 bg-white px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-50 disabled:opacity-50"
                          >
                            <Trash2 size={14} />
                            Delete
                          </button>
                        </div>

                        {/* Right side actions */}
                        <div className="flex items-center gap-2">
                          {/* Publish / Unpublish button for ALL properties */}
                          <button
                            type="button"
                            disabled={busy}
                            onClick={() => togglePublication(property)}
                            className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold transition disabled:opacity-50 ${
                              isPublished
                                ? "border border-red-200 bg-white text-red-600 hover:bg-red-50"
                                : "bg-[#B96928] text-white hover:bg-[#9D5721]"
                            }`}
                          >
                            {isPublished ? (
                              <>
                                <EyeOff size={14} />
                                Unpublish
                              </>
                            ) : (
                              <>
                                <Globe size={14} />
                                Publish
                              </>
                            )}
                          </button>

                          {/* Live website link */}
                          <Link
                            href={
                              property.stayCategory === "luxury"
                                ? "/stay/luxury"
                                : property.stayCategory === "deluxe"
                                ? "/stay/deluxe"
                                : property.stayCategory === "group_accommodation"
                                ? "/stay/rooms"
                                : "/stay/resorts"
                            }
                            target="_blank"
                            title="View live website page in new tab"
                            className="inline-flex items-center gap-1 rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs font-bold text-[#B96928] hover:bg-orange-50 shadow-sm"
                          >
                            <Globe size={13} />
                            Live ↗
                          </Link>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            )
          )}
        </section>
      </div>

      {/* ============================================================== */}
      {/* MODAL 1: ADD / EDIT CATEGORY CARD                              */}
      {/* ============================================================== */}
      {categoryModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-lg font-black text-[#172033]">
                {categoryModal.isNew
                  ? "Add New Stay Category"
                  : "Edit Category Card"}
              </h3>
              <button
                type="button"
                onClick={() => setCategoryModal({ isOpen: false, isNew: false, data: {} })}
                className="text-gray-400 hover:text-gray-800"
              >
                <X size={20} />
              </button>
            </div>

            <div className="mt-4 space-y-4">
              <div>
                <label className={labelClass}>Category Title *</label>
                <input
                  className={inputClass}
                  placeholder="e.g. Heritage Homestays"
                  value={categoryModal.data.title || ""}
                  onChange={(e) =>
                    setCategoryModal((prev) => ({
                      ...prev,
                      data: { ...prev.data, title: e.target.value },
                    }))
                  }
                />
              </div>

              {categoryModal.isNew && (
                <div>
                  <label className={labelClass}>Unique Slug *</label>
                  <input
                    className={inputClass}
                    placeholder="e.g. heritage_homestays"
                    value={categoryModal.data.slug || ""}
                    onChange={(e) =>
                      setCategoryModal((prev) => ({
                        ...prev,
                        data: { ...prev.data, slug: e.target.value },
                      }))
                    }
                  />
                  <p className="mt-1 text-[11px] text-gray-500">
                    Used in database and URLs (lowercase, underscores only).
                  </p>
                </div>
              )}

              <div>
                <label className={labelClass}>Description</label>
                <textarea
                  className={inputClass}
                  rows={2}
                  placeholder="Brief description for website card..."
                  value={categoryModal.data.description || ""}
                  onChange={(e) =>
                    setCategoryModal((prev) => ({
                      ...prev,
                      data: { ...prev.data, description: e.target.value },
                    }))
                  }
                />
              </div>

              <div>
                <label className={labelClass}>Cover Image URL or Path</label>
                <input
                  className={inputClass}
                  placeholder="/stay/resort-hero.webp or https://..."
                  value={categoryModal.data.image || ""}
                  onChange={(e) =>
                    setCategoryModal((prev) => ({
                      ...prev,
                      data: { ...prev.data, image: e.target.value },
                    }))
                  }
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelClass}>Display Order</label>
                  <input
                    type="number"
                    className={inputClass}
                    value={categoryModal.data.order ?? 1}
                    onChange={(e) =>
                      setCategoryModal((prev) => ({
                        ...prev,
                        data: { ...prev.data, order: Number(e.target.value) },
                      }))
                    }
                  />
                </div>

                <div>
                  <label className={labelClass}>Target Link</label>
                  <input
                    className={inputClass}
                    placeholder="/stay/..."
                    value={categoryModal.data.href || ""}
                    onChange={(e) =>
                      setCategoryModal((prev) => ({
                        ...prev,
                        data: { ...prev.data, href: e.target.value },
                      }))
                    }
                  />
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2 border-t pt-4">
              <button
                type="button"
                onClick={() => setCategoryModal({ isOpen: false, isNew: false, data: {} })}
                className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-bold hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={saving}
                onClick={handleSaveCategory}
                className="inline-flex items-center gap-1.5 rounded-xl bg-[#B96928] px-5 py-2.5 text-sm font-bold text-white hover:bg-[#9D5721] disabled:opacity-50"
              >
                <Save size={16} />
                {saving ? "Saving..." : "Save Category"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL 2: EDIT PROPERTY RATE / AMOUNT                           */}
      {/* ============================================================== */}
      {priceModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl">
            <h3 className="text-lg font-black text-[#172033]">
              Edit Property Rate
            </h3>
            <p className="mt-1 text-xs text-gray-500">
              Set nightly starting price for &quot;{priceModal.property?.name}&quot;.
            </p>

            <div className="mt-4">
              <label className={labelClass}>Price / Night (₹ INR)</label>
              <div className="relative">
                <span className="absolute left-3 top-3 text-sm font-bold text-gray-500">
                  ₹
                </span>
                <input
                  type="number"
                  min="0"
                  className={`${inputClass} pl-8`}
                  placeholder="e.g. 5000"
                  value={priceModal.amount}
                  onChange={(e) =>
                    setPriceModal((prev) => ({
                      ...prev,
                      amount: e.target.value,
                    }))
                  }
                />
              </div>
            </div>

            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setPriceModal({ isOpen: false, property: null, amount: "" })}
                className="rounded-xl border border-gray-200 px-4 py-2 text-xs font-bold hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={saving}
                onClick={savePrice}
                className="rounded-xl bg-[#B96928] px-4 py-2 text-xs font-bold text-white hover:bg-[#9D5721] disabled:opacity-50"
              >
                {saving ? "Saving..." : "Save Rate"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL 3: CHANGE WEBSITE CATEGORY                               */}
      {/* ============================================================== */}
      {changeCatModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <h3 className="text-lg font-black text-[#172033]">
              Assign Website Category
            </h3>
            <p className="mt-1 text-xs text-gray-500">
              Select which category &quot;{changeCatModal.property?.name}&quot; appears under on the website.
            </p>

            <div className="mt-4 space-y-2">
              {categories.map((cat) => {
                const selected = changeCatModal.newCategory === cat.slug;
                return (
                  <button
                    key={cat.slug}
                    type="button"
                    onClick={() =>
                      setChangeCatModal((prev) => ({
                        ...prev,
                        newCategory: cat.slug,
                      }))
                    }
                    className={`flex w-full items-center justify-between rounded-xl border p-3 text-left transition ${
                      selected
                        ? "border-[#B96928] bg-amber-50/60 text-[#B96928]"
                        : "border-gray-200 hover:bg-gray-50 text-gray-800"
                    }`}
                  >
                    <div>
                      <p className="font-extrabold text-sm">{cat.title}</p>
                      <p className="text-[11px] text-gray-500">{cat.description}</p>
                    </div>
                    {selected && <Check size={18} className="text-[#B96928]" />}
                  </button>
                );
              })}
            </div>

            <div className="mt-5 flex justify-end gap-2 border-t pt-3">
              <button
                type="button"
                onClick={() => setChangeCatModal({ isOpen: false, property: null, newCategory: "resorts" })}
                className="rounded-xl border border-gray-200 px-4 py-2 text-xs font-bold hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={saving}
                onClick={saveCategoryChange}
                className="rounded-xl bg-[#B96928] px-4 py-2 text-xs font-bold text-white hover:bg-[#9D5721] disabled:opacity-50"
              >
                {saving ? "Saving..." : "Confirm Category"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL 4: PUBLISH TO CATEGORY MODAL                             */}
      {/* ============================================================== */}
      {publication.property && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <h3 className="text-lg font-black text-[#172033]">
              Publish Property to Website
            </h3>
            <p className="mt-1 text-xs text-gray-500">
              Choose a stay category for &quot;{publication.property.name}&quot; before publishing.
            </p>

            <div className="mt-4 space-y-2">
              {categories.map((cat) => {
                const selected = publication.category === cat.slug;
                return (
                  <button
                    key={cat.slug}
                    type="button"
                    onClick={() =>
                      setPublication((prev) => ({
                        ...prev,
                        category: cat.slug,
                      }))
                    }
                    className={`flex w-full items-center justify-between rounded-xl border p-3 text-left transition ${
                      selected
                        ? "border-[#B96928] bg-amber-50/60 text-[#B96928]"
                        : "border-gray-200 hover:bg-gray-50 text-gray-800"
                    }`}
                  >
                    <div>
                      <p className="font-extrabold text-sm">{cat.title}</p>
                      <p className="text-[11px] text-gray-500">{cat.description}</p>
                    </div>
                    {selected && <Check size={18} className="text-[#B96928]" />}
                  </button>
                );
              })}
            </div>

            <div className="mt-5 flex justify-end gap-2 border-t pt-3">
              <button
                type="button"
                onClick={closePublicationModal}
                className="rounded-xl border border-gray-200 px-4 py-2 text-xs font-bold hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={saving}
                onClick={confirmPublication}
                className="rounded-xl bg-[#B96928] px-4 py-2 text-xs font-bold text-white hover:bg-[#9D5721] disabled:opacity-50"
              >
                {saving ? "Publishing..." : "Publish Property"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL 5: APPROVE / REJECT REVIEW MODAL                         */}
      {/* ============================================================== */}
      {review.property && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <h3 className="text-lg font-black text-[#172033]">
              {review.decision === "approve"
                ? "Approve Property Submission"
                : "Reject Property Submission"}
            </h3>
            <p className="mt-1 text-xs text-gray-500">
              {review.decision === "approve"
                ? `Approve "${review.property.name}" so it can be published on the website.`
                : `Please provide a reason for rejecting "${review.property.name}".`}
            </p>

            {review.decision === "reject" && (
              <div className="mt-4">
                <label className={labelClass}>Rejection Reason *</label>
                <textarea
                  className={inputClass}
                  rows={3}
                  placeholder="Explain why this property was rejected..."
                  value={review.reason}
                  onChange={(e) =>
                    setReview((prev) => ({
                      ...prev,
                      reason: e.target.value,
                    }))
                  }
                />
              </div>
            )}

            <div className="mt-5 flex justify-end gap-2 border-t pt-3">
              <button
                type="button"
                onClick={closeReview}
                className="rounded-xl border border-gray-200 px-4 py-2 text-xs font-bold hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={saving}
                onClick={submitReview}
                className={`rounded-xl px-4 py-2 text-xs font-bold text-white disabled:opacity-50 ${
                  review.decision === "approve"
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-red-600 hover:bg-red-700"
                }`}
              >
                {saving
                  ? "Processing..."
                  : review.decision === "approve"
                  ? "Approve Now"
                  : "Reject Submission"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL 6: FULL PROPERTY EDIT DRAWER                             */}
      {/* ============================================================== */}
      {draft && currentEditingProperty && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-lg font-black text-[#172033]">
                Edit Property: {currentEditingProperty.name}
              </h3>
              <button
                type="button"
                onClick={cancelEdit}
                className="text-gray-400 hover:text-gray-800"
              >
                <X size={20} />
              </button>
            </div>

            <div className="mt-4 space-y-4">
              <div>
                <label className={labelClass}>Property Name *</label>
                <input
                  className={inputClass}
                  value={draft.name}
                  onChange={(e) => updateDraft("name", e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelClass}>Property Type</label>
                  <select
                    className={inputClass}
                    value={draft.propertyType}
                    onChange={(e) => updateDraft("propertyType", e.target.value)}
                  >
                    {PROPERTY_TYPES.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className={labelClass}>Total Rooms</label>
                  <input
                    type="number"
                    className={inputClass}
                    value={draft.totalRooms}
                    onChange={(e) => updateDraft("totalRooms", e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelClass}>Rate / Night (₹)</label>
                  <input
                    type="number"
                    className={inputClass}
                    value={draft.pricePerNight}
                    onChange={(e) => updateDraft("pricePerNight", e.target.value)}
                  />
                </div>

                <div>
                  <label className={labelClass}>Max Guests</label>
                  <input
                    type="number"
                    className={inputClass}
                    value={draft.maxGuestsPerBooking}
                    onChange={(e) =>
                      updateDraft("maxGuestsPerBooking", e.target.value)
                    }
                  />
                </div>
              </div>

              <div>
                <label className={labelClass}>Address</label>
                <input
                  className={inputClass}
                  value={draft.address}
                  onChange={(e) => updateDraft("address", e.target.value)}
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className={labelClass}>Locality</label>
                  <input
                    className={inputClass}
                    value={draft.locality}
                    onChange={(e) => updateDraft("locality", e.target.value)}
                  />
                </div>
                <div>
                  <label className={labelClass}>City</label>
                  <input
                    className={inputClass}
                    value={draft.city}
                    onChange={(e) => updateDraft("city", e.target.value)}
                  />
                </div>
                <div>
                  <label className={labelClass}>State</label>
                  <input
                    className={inputClass}
                    value={draft.state}
                    onChange={(e) => updateDraft("state", e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className={labelClass}>Description</label>
                <textarea
                  className={inputClass}
                  rows={3}
                  value={draft.description}
                  onChange={(e) => updateDraft("description", e.target.value)}
                />
              </div>

              {/* IMAGES */}
              <div>
                <label className={labelClass}>
                  Photos ({draft.images?.length || 0}/{MAX_IMAGES})
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {draft.images?.map((img, index) => (
                    <div
                      key={img.url || index}
                      className="group relative h-20 overflow-hidden rounded-lg border bg-gray-100"
                    >
                      <img
                        src={img.url}
                        alt="Photo"
                        className="h-full w-full object-cover"
                      />
                      <div className="absolute inset-0 flex items-center justify-center gap-1 bg-black/50 opacity-0 transition group-hover:opacity-100">
                        <button
                          type="button"
                          onClick={() => setCoverImage(index)}
                          className={`rounded p-1 text-xs ${
                            img.isCover ? "bg-amber-500 text-white" : "bg-white text-gray-800"
                          }`}
                        >
                          <Star size={12} />
                        </button>
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="rounded bg-red-600 p-1 text-white hover:bg-red-700"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                      {img.isCover && (
                        <span className="absolute bottom-1 left-1 rounded bg-amber-500 px-1 text-[9px] font-bold text-white">
                          Cover
                        </span>
                      )}
                    </div>
                  ))}
                </div>

                <div className="mt-2">
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/jpeg,image/png,image/webp"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                  <button
                    type="button"
                    disabled={uploading || (draft.images?.length || 0) >= MAX_IMAGES}
                    onClick={() => fileInputRef.current?.click()}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-xs font-bold text-gray-700 hover:bg-gray-100 disabled:opacity-50"
                  >
                    <ImagePlus size={14} />
                    {uploading ? "Uploading..." : "Upload Photos"}
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2 border-t pt-4">
              <button
                type="button"
                onClick={cancelEdit}
                className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-bold hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={saving}
                onClick={saveProperty}
                className="inline-flex items-center gap-1.5 rounded-xl bg-[#B96928] px-5 py-2.5 text-sm font-bold text-white hover:bg-[#9D5721] disabled:opacity-50"
              >
                <Save size={16} />
                {saving ? "Saving..." : "Save Property"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

function SummaryCard({ icon, title, value, subtitle }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex items-center gap-2 text-[#B96928]">
        {icon}
        <span className="text-sm font-semibold text-gray-600">{title}</span>
      </div>
      <p className="mt-3 text-2xl font-black text-[#172033]">{value}</p>
      <p className="mt-1 text-xs text-gray-500">{subtitle}</p>
    </div>
  );
}