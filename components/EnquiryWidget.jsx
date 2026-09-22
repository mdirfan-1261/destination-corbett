"use client";

import { useState } from "react";
import {
  ArrowRight,
  MessageSquareText,
  X,
  Loader2,
  CheckCircle2,
} from "lucide-react";

export default function EnquiryWidget() {
  const [showEnquiry, setShowEnquiry] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.phone ||
      !formData.email
    ) {
      setError("Please fill all fields.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        "http://localhost:5000/api/enquiries",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            hotel: "Quick Enquiry",
            name: formData.name,
            phone: formData.phone,
            email: formData.email,
            message: "Quick enquiry via widget",
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to send enquiry"
        );
      }

      setSuccess(true);

      setFormData({
        name: "",
        phone: "",
        email: "",
      });

      setTimeout(() => {
        setSuccess(false);
        setShowEnquiry(false);
      }, 2000);
    } catch (err) {
      setError(
        err.message || "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed right-5 bottom-5 z-50">

      {/* Enquiry Button */}

      {!showEnquiry && (
        <button
          onClick={() => setShowEnquiry(true)}
          className="
            flex items-center gap-2
            bg-[#C88A3D]
            text-white
            px-4 py-3
            rounded-full
            shadow-xl
            hover:bg-[#A96F2E]
            hover:scale-105
            transition
          "
        >
          <MessageSquareText size={18} />

          <span className="text-sm font-semibold">
            Enquiry
          </span>
        </button>
      )}

      {/* Small Widget */}

      {showEnquiry && (
        <div
          className="
            w-[290px]
            bg-white/80
            backdrop-blur-2xl
            rounded-2xl
            shadow-2xl
            border border-white
            overflow-hidden
          "
        >

          {/* Header */}

          <div className="flex items-center justify-between bg-[#172033] px-4 py-3 text-white">

            <div>
              <p className="text-[10px] uppercase tracking-wider text-[#C88A3D] font-semibold">
                Quick Enquiry
              </p>

              <h3 className="text-sm font-semibold">
                Let us help you plan
              </h3>
            </div>

            <button
              type="button"
              onClick={() => {
                setShowEnquiry(false);
                setError("");
              }}
              className="
                w-7 h-7
                rounded-full
                bg-white/10
                flex items-center justify-center
                hover:bg-white/20
              "
            >
              <X size={15} />
            </button>

          </div>

          {/* Success */}

          {success ? (
            <div className="px-5 py-7 text-center">

              <CheckCircle2
                size={34}
                className="mx-auto text-green-700 mb-2"
              />

              <p className="text-sm font-semibold text-gray-800">
                Enquiry Sent!
              </p>

              <p className="text-xs text-gray-500 mt-1">
                We'll contact you soon.
              </p>

            </div>
          ) : (

            /* Form */

            <form
              onSubmit={handleSubmit}
              className="p-4 space-y-2.5"
            >

              {/* Error */}

              {error && (
                <div className="text-[11px] text-red-600 bg-red-50 rounded-md px-2.5 py-2">
                  {error}
                </div>
              )}

              {/* Name */}

              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your name"
                className="
                  w-full
                  px-3 py-2.5
                  rounded-lg
                  border border-gray-200
                  bg-white
                  text-xs
                  outline-none
                  focus:border-[#C88A3D]
                "
              />

              {/* Phone */}

              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Phone number"
                className="
                  w-full
                  px-3 py-2.5
                  rounded-lg
                  border border-gray-200
                  bg-white
                  text-xs
                  outline-none
                  focus:border-[#C88A3D]
                "
              />

              {/* Email */}

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email address"
                className="
                  w-full
                  px-3 py-2.5
                  rounded-lg
                  border border-gray-200
                  bg-white
                  text-xs
                  outline-none
                  focus:border-[#C88A3D]
                "
              />

              {/* Submit */}

              <button
                type="submit"
                disabled={loading}
                className="
                  w-full
                  flex items-center justify-center gap-2
                  bg-[#C88A3D]
                  text-white
                  py-2.5
                  rounded-lg
                  text-xs
                  font-semibold
                  hover:bg-[#A96F2E]
                  transition
                  disabled:opacity-60
                "
              >
                {loading ? (
                  <Loader2
                    size={14}
                    className="animate-spin"
                  />
                ) : (
                  <>
                    Send Enquiry
                    <ArrowRight size={14} />
                  </>
                )}
              </button>

            </form>
          )}

        </div>
      )}
    </div>
  );
}