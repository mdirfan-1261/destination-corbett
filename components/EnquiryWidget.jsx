"use client";

import { useState } from "react";
import {
  ArrowRight,
  MessageSquareText,
  X,
  Loader2,
  CheckCircle2,
} from "lucide-react";

export default function EnquiryWidget({ open, onOpenChange }) {
  const [showEnquiry, setShowEnquiry] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const isControlled = typeof open === "boolean";
  const enquiryOpen = isControlled ? open : showEnquiry;

  const setEnquiryOpen = (value) => {
    if (isControlled) {
      onOpenChange?.(value);
    } else {
      setShowEnquiry(value);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.phone || !formData.email) {
      setError("Please fill all fields.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/enquiries`,
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
        throw new Error(data.message || "Failed to send enquiry");
      }

      setSuccess(true);

      setFormData({
        name: "",
        phone: "",
        email: "",
      });

      setTimeout(() => {
        setSuccess(false);
        setEnquiryOpen(false);
      }, 2000);
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  /*
    ================================
    HEADER MODAL MODE
    ================================
  */

  if (isControlled) {
    return (
      <>
        {enquiryOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">

            {/* BACKDROP */}
            <div
              className="
                absolute inset-0
                bg-[#172033]/50
                backdrop-blur-md
              "
              onClick={() => {
                setEnquiryOpen(false);
                setError("");
              }}
            />

            {/* MODAL */}
            <div
              className="
                relative
                w-full
                max-w-md
                rounded-3xl
                bg-white/90
                backdrop-blur-3xl
                border border-white
                shadow-[0_30px_100px_rgba(23,32,51,0.30)]
                overflow-hidden
                animate-in
                fade-in
                zoom-in-95
                duration-200
              "
            >

              {/* HEADER */}
              <div
                className="
                  flex
                  items-center
                  justify-between
                  bg-[#172033]
                  px-6
                  py-5
                  text-white
                "
              >
                <div>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-[#C87532] font-semibold">
                    Quick Enquiry
                  </p>

                  <h3 className="text-lg font-semibold mt-1">
                    Let us help you plan
                  </h3>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setEnquiryOpen(false);
                    setError("");
                  }}
                  className="
                    w-9
                    h-9
                    rounded-full
                    bg-white/10
                    flex
                    items-center
                    justify-center
                    hover:bg-white/20
                    transition
                  "
                >
                  <X size={18} />
                </button>
              </div>

              {/* SUCCESS */}
              {success ? (
                <div className="px-6 py-12 text-center">

                  <CheckCircle2
                    size={48}
                    className="mx-auto text-green-700 mb-4"
                  />

                  <p className="text-lg font-semibold text-gray-800">
                    Enquiry Sent!
                  </p>

                  <p className="text-sm text-gray-500 mt-2">
                    We'll contact you soon.
                  </p>

                </div>
              ) : (
                <form
                  onSubmit={handleSubmit}
                  className="p-6 space-y-4"
                >

                  {/* ERROR */}
                  {error && (
                    <div className="text-xs text-red-600 bg-red-50 rounded-xl px-3 py-2.5">
                      {error}
                    </div>
                  )}

                  {/* NAME */}
                  <div>
                    <label className="block text-xs font-semibold text-[#172033] mb-1.5">
                      Name
                    </label>

                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Your name"
                      className="
                        w-full
                        px-4
                        py-3
                        rounded-xl
                        border
                        border-gray-200
                        bg-white
                        text-sm
                        outline-none
                        focus:border-[#C87532]
                        focus:ring-2
                        focus:ring-[#C87532]/10
                        transition
                      "
                    />
                  </div>

                  {/* PHONE */}
                  <div>
                    <label className="block text-xs font-semibold text-[#172033] mb-1.5">
                      Phone
                    </label>

                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="Phone number"
                      className="
                        w-full
                        px-4
                        py-3
                        rounded-xl
                        border
                        border-gray-200
                        bg-white
                        text-sm
                        outline-none
                        focus:border-[#C87532]
                        focus:ring-2
                        focus:ring-[#C87532]/10
                        transition
                      "
                    />
                  </div>

                  {/* EMAIL */}
                  <div>
                    <label className="block text-xs font-semibold text-[#172033] mb-1.5">
                      Email
                    </label>

                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Email address"
                      className="
                        w-full
                        px-4
                        py-3
                        rounded-xl
                        border
                        border-gray-200
                        bg-white
                        text-sm
                        outline-none
                        focus:border-[#C87532]
                        focus:ring-2
                        focus:ring-[#C87532]/10
                        transition
                      "
                    />
                  </div>

                  {/* SUBMIT */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="
                      w-full
                      flex
                      items-center
                      justify-center
                      gap-2
                      bg-[#C87532]
                      text-white
                      py-3.5
                      rounded-xl
                      text-sm
                      font-semibold
                      shadow-[0_8px_25px_rgba(200,117,50,0.25)]
                      hover:bg-[#B96928]
                      hover:shadow-[0_10px_30px_rgba(185,105,40,0.30)]
                      transition
                      disabled:opacity-60
                    "
                  >
                    {loading ? (
                      <Loader2
                        size={17}
                        className="animate-spin"
                      />
                    ) : (
                      <>
                        Send Enquiry
                        <ArrowRight size={16} />
                      </>
                    )}
                  </button>

                </form>
              )}
            </div>
          </div>
        )}
      </>
    );
  }

  /*
    ================================
    BOTTOM RIGHT WIDGET MODE
    ================================
  */

  return (
    <div className="fixed right-5 bottom-5 z-50">

      {/* ENQUIRY BUTTON */}

      {!enquiryOpen && (
        <button
          type="button"
          onClick={() => setEnquiryOpen(true)}
          className="
            flex
            items-center
            gap-2
            bg-[#C87532]
            text-white
            px-4
            py-3
            rounded-full
            shadow-xl
            hover:bg-[#B96928]
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

      {/* SMALL WIDGET */}

      {enquiryOpen && (
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

          {/* HEADER */}

          <div className="flex items-center justify-between bg-[#172033] px-4 py-3 text-white">

            <div>
              <p className="text-[10px] uppercase tracking-wider text-[#C87532] font-semibold">
                Quick Enquiry
              </p>

              <h3 className="text-sm font-semibold">
                Let us help you plan
              </h3>
            </div>

            <button
              type="button"
              onClick={() => {
                setEnquiryOpen(false);
                setError("");
              }}
              className="
                w-7
                h-7
                rounded-full
                bg-white/10
                flex
                items-center
                justify-center
                hover:bg-white/20
              "
            >
              <X size={15} />
            </button>

          </div>

          {/* SUCCESS */}

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
            <form
              onSubmit={handleSubmit}
              className="p-4 space-y-2.5"
            >

              {/* ERROR */}

              {error && (
                <div className="text-[11px] text-red-600 bg-red-50 rounded-md px-2.5 py-2">
                  {error}
                </div>
              )}

              {/* NAME */}

              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your name"
                className="
                  w-full
                  px-3
                  py-2.5
                  rounded-lg
                  border
                  border-gray-200
                  bg-white
                  text-xs
                  outline-none
                  focus:border-[#C87532]
                "
              />

              {/* PHONE */}

              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Phone number"
                className="
                  w-full
                  px-3
                  py-2.5
                  rounded-lg
                  border
                  border-gray-200
                  bg-white
                  text-xs
                  outline-none
                  focus:border-[#C87532]
                "
              />

              {/* EMAIL */}

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email address"
                className="
                  w-full
                  px-3
                  py-2.5
                  rounded-lg
                  border
                  border-gray-200
                  bg-white
                  text-xs
                  outline-none
                  focus:border-[#C87532]
                "
              />

              {/* SUBMIT */}

              <button
                type="submit"
                disabled={loading}
                className="
                  w-full
                  flex
                  items-center
                  justify-center
                  gap-2
                  bg-[#C87532]
                  text-white
                  py-2.5
                  rounded-lg
                  text-xs
                  font-semibold
                  hover:bg-[#B96928]
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