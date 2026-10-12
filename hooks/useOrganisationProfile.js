"use client";

import { useEffect, useState } from "react";


const DEFAULT_PROFILE = {
  name: "Destination Corbett",
  logo: "",
  phone: "",
  email: "",
  whatsapp: "",
  website: "",
  address: "",
  description: "",
};

export function useOrganisationProfile() {
  const [profile, setProfile] = useState(DEFAULT_PROFILE);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const configuredUrl =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

    // Works whether the environment variable ends with /api or not.
    const apiBase = configuredUrl
      .replace(/\/+$/, "")
      .replace(/\/api$/, "");

    async function fetchProfile() {
      try {
        const response = await fetch(
          `${apiBase}/api/public/organisation-profile`
        );

        if (!response.ok) {
          throw new Error(`API request failed: ${response.status}`);
        }

        const result = await response.json();

        if (!result.success || !result.data) {
          throw new Error("Organisation profile data is unavailable.");
        }

        if (!cancelled) {
          setProfile({
            ...DEFAULT_PROFILE,
            ...result.data,
          });
          setError("");
        }
      } catch (err) {
        console.error("Organisation profile API error:", err);

        if (!cancelled) {
          setError(err.message || "Failed to load organisation profile.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchProfile();

    return () => {
      cancelled = true;
    };
  }, []);

  return { profile, loading, error };
}