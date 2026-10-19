"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  CheckCircle2,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import { ownerApiRequest } from "@/lib/ownerApi";

const initialForm = {
  name: "",
  email: "",
  phone: "",
  password: "",
  resortName: "",
  resortAddress: "",
  city: "Ramnagar",
  termsAccepted: false,
};

export default function OwnerRegisterPage() {
  const router = useRouter();

  const [form, setForm] = useState(initialForm);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const updateField = (event) => {
    const { name, value, checked, type } = event.target;
    setForm((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));
    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    const name = form.name.trim();
    const email = form.email.trim().toLowerCase();
    const phone = form.phone.trim();
    const password = form.password;

    if (name.length < 2 || name.length > 100) {
      setError("Name must be between 2 and 100 characters.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!/^[0-9]{10,15}$/.test(phone)) {
      setError("Phone number must contain 10 to 15 digits.");
      return;
    }

    if (password.length < 8 || password.length > 128) {
      setError("Password must contain 8 to 128 characters.");
      return;
    }

    if (!form.termsAccepted) {
      setError("Please accept the terms before registering.");
      return;
    }

    setLoading(true);

    try {
      const result = await ownerApiRequest("owner/auth/register", {
        method: "POST",
        body: JSON.stringify({
          name,
          email,
          phone,
          password,
          resortName: form.resortName.trim(),
          resortAddress: form.resortAddress.trim(),
          city: form.city.trim() || "Ramnagar",
        }),
      });

      setSuccess(
        result.message ||
          "Registration successful! Your resort partner account is submitted for admin review."
      );

      setForm({ ...initialForm });
    } catch (err) {
      setError(err.message || "Unable to complete registration. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full min-h-[47px] rounded-md border border-[#DED9CF] bg-white px-3.5 py-3 text-[14px] text-[#172033] outline-none placeholder:text-[#96938D] transition-colors hover:border-[#BDB5A8] focus:border-[#B96928] focus:ring-2 focus:ring-[#B96928]/10";

  const labelClass =
    "mb-2 block text-[12px] font-semibold tracking-[0.01em] text-[#354052]";

  const sectionHeading =
    "flex items-center gap-2.5 text-[15px] font-bold tracking-[-0.02em] text-[#172033]";

  return (
    <main className="min-h-screen bg-[#F7F5F0] px-4 py-5 sm:px-6 sm:py-8">
      <div className="mx-auto max-w-6xl">
        <Link
          href="/"
          className="mb-5 inline-flex items-center gap-2 text-[13px] font-semibold text-[#596170] transition-colors hover:text-[#B96928]"
        >
          <ArrowLeft size={16} />
          Back to Destination Corbett
        </Link>

        <div className="overflow-hidden rounded-xl border border-[#E3DDD2] bg-white shadow-[0_12px_40px_rgba(23,32,51,0.055)]">
          <div className="grid lg:grid-cols-[0.76fr_1.24fr]">
            {/* Left Brand Panel */}
            <aside className="flex flex-col justify-between bg-[#172033] px-6 py-7 text-white sm:px-9 sm:py-9 lg:px-10 lg:py-11">
              <div>
                <Link href="/" className="inline-flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-md bg-[#B96928]">
                    <Building2 size={21} strokeWidth={1.8} />
                  </span>

                  <span className="flex flex-col">
                    <span className="text-[10px] font-bold tracking-[0.2em]">
                      DESTINATION
                    </span>
                    <span className="mt-1 text-[18px] font-bold leading-none tracking-[0.04em]">
                      CORBETT
                    </span>
                  </span>
                </Link>

                <div className="mt-10 border-l-2 border-[#C88A3D] pl-4 sm:mt-14">
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#D8AC79]">
                    Resort Partnerships
                  </p>

                  <h1 className="mt-4 text-[31px] font-semibold leading-[1.2] tracking-[-0.035em] sm:text-[37px]">
                    List your resort.
                    <span className="mt-1 block text-[#D8AC79]">
                      Welcome guests.
                    </span>
                  </h1>

                  <p className="mt-5 max-w-sm text-[13px] leading-6 text-[#D1D6DF]">
                    Showcase your luxury stay, jungle lodge, or resort to
                    tourists exploring Jim Corbett. Create your owner account.
                  </p>
                </div>

                <div className="mt-9 space-y-0 border-t border-white/15">
                  <div className="flex gap-3 border-b border-white/10 py-4">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-white/[0.07] text-[#D8AC79]">
                      <Building2 size={17} />
                    </span>
                    <div>
                      <p className="text-[13px] font-semibold">
                        Add and manage property
                      </p>
                      <p className="mt-1 text-[12px] leading-5 text-[#B9C1CE]">
                        Set up room types, amenities, and photos.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3 border-b border-white/10 py-4">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-white/[0.07] text-[#D8AC79]">
                      <CheckCircle2 size={17} />
                    </span>
                    <div>
                      <p className="text-[13px] font-semibold">
                        Calendar & seasonal rates
                      </p>
                      <p className="mt-1 text-[12px] leading-5 text-[#B9C1CE]">
                        Update live availability and room rates directly.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3 py-4">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-white/[0.07] text-[#D8AC79]">
                      <ShieldCheck size={17} />
                    </span>
                    <div>
                      <p className="text-[13px] font-semibold">
                        Prompt payouts
                      </p>
                      <p className="mt-1 text-[12px] leading-5 text-[#B9C1CE]">
                        Hassle-free settlement directly to your bank account.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-7 flex items-start gap-2.5 border-t border-white/15 pt-5">
                <ShieldCheck size={17} className="mt-0.5 shrink-0 text-[#D8AC79]" />
                <p className="text-[11px] leading-5 text-[#B9C1CE]">
                  All partner accounts are verified by Destination Corbett administration.
                </p>
              </div>
            </aside>

            {/* Right Registration Form */}
            <section className="min-w-0 px-5 py-7 sm:px-8 sm:py-9 lg:px-10 lg:py-10">
              <div className="mb-7 border-b border-[#EAE5DC] pb-5">
                <div className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#B96928]" />
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#B96928]">
                    Resort registration
                  </p>
                </div>

                <h2 className="mt-3 text-[27px] font-semibold tracking-[-0.04em] text-[#172033] sm:text-[30px]">
                  List your property
                </h2>

                <p className="mt-2 text-[13px] leading-6 text-[#697181]">
                  Fill out your details to begin listing your resort.
                  <span className="ml-1 text-red-600">*</span>
                  <span className="ml-1">Required fields</span>
                </p>
              </div>

              {success ? (
                <div
                  role="status"
                  className="rounded-lg border border-[#D8E6D9] bg-[#F5F9F4] p-5 sm:p-7"
                >
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#E1EDE0] text-[#315B39]">
                    <CheckCircle2 size={25} />
                  </span>

                  <h3 className="mt-5 text-xl font-semibold text-[#172033]">
                    Registration submitted
                  </h3>

                  <p className="mt-3 text-[13px] leading-6 text-[#526052]">{success}</p>

                  <button
                    type="button"
                    onClick={() => router.push("/owner/login")}
                    className="mt-6 inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-[#B96928] px-5 py-3 text-[13px] font-semibold text-white transition-colors hover:bg-[#99531F]"
                  >
                    Continue to login
                    <ArrowRight size={16} />
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-7">
                  {/* Owner details */}
                  <section>
                    <h3 className={sectionHeading}>
                      <UserRound size={18} className="text-[#B96928]" />
                      Owner details
                    </h3>

                    <div className="mt-4 grid gap-x-4 gap-y-4 sm:grid-cols-2">
                      <div className="sm:col-span-2">
                        <label htmlFor="name" className={labelClass}>
                          Full name <span className="text-red-600">*</span>
                        </label>
                        <input
                          id="name"
                          name="name"
                          required
                          value={form.name}
                          onChange={updateField}
                          placeholder="e.g. Ramesh Singh Rawat"
                          className={inputClass}
                        />
                      </div>

                      <div>
                        <label htmlFor="email" className={labelClass}>
                          Email address <span className="text-red-600">*</span>
                        </label>
                        <div className="relative">
                          <Mail
                            size={16}
                            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#858B95]"
                          />
                          <input
                            id="email"
                            name="email"
                            type="email"
                            required
                            value={form.email}
                            onChange={updateField}
                            placeholder="owner@example.com"
                            className={`${inputClass} pl-9`}
                          />
                        </div>
                      </div>

                      <div>
                        <label htmlFor="phone" className={labelClass}>
                          Phone number <span className="text-red-600">*</span>
                        </label>
                        <div className="relative">
                          <Phone
                            size={16}
                            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#858B95]"
                          />
                          <input
                            id="phone"
                            name="phone"
                            type="tel"
                            required
                            value={form.phone}
                            onChange={updateField}
                            placeholder="10–15 digit number"
                            className={`${inputClass} pl-9`}
                          />
                        </div>
                      </div>

                      <div className="sm:col-span-2">
                        <label htmlFor="password" className={labelClass}>
                          Password <span className="text-red-600">*</span>
                        </label>
                        <div className="relative">
                          <LockKeyhole
                            size={16}
                            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#858B95]"
                          />
                          <input
                            id="password"
                            name="password"
                            type={showPassword ? "text" : "password"}
                            required
                            minLength={8}
                            value={form.password}
                            onChange={updateField}
                            placeholder="Create a password (min 8 characters)"
                            className={`${inputClass} pl-9 pr-12`}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword((v) => !v)}
                            className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-md p-2 text-[#747B86] hover:text-[#B96928]"
                          >
                            {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                          </button>
                        </div>
                      </div>
                    </div>
                  </section>

                  {/* Resort details */}
                  <section className="border-t border-[#EAE5DC] pt-6">
                    <h3 className={sectionHeading}>
                      <Building2 size={18} className="text-[#B96928]" />
                      Resort information
                    </h3>

                    <div className="mt-4 grid gap-x-4 gap-y-4 sm:grid-cols-2">
                      <div className="sm:col-span-2">
                        <label htmlFor="resortName" className={labelClass}>
                          Resort or property name <span className="text-red-600">*</span>
                        </label>
                        <input
                          id="resortName"
                          name="resortName"
                          required
                          value={form.resortName}
                          onChange={updateField}
                          placeholder="e.g. Corbett Wilderness Retreat"
                          className={inputClass}
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label htmlFor="resortAddress" className={labelClass}>
                          Resort address / locality
                        </label>
                        <input
                          id="resortAddress"
                          name="resortAddress"
                          value={form.resortAddress}
                          onChange={updateField}
                          placeholder="e.g. Dhikuli, Ramnagar"
                          className={inputClass}
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label htmlFor="city" className={labelClass}>
                          City / Region
                        </label>
                        <input
                          id="city"
                          name="city"
                          value={form.city}
                          onChange={updateField}
                          placeholder="Ramnagar"
                          className={inputClass}
                        />
                      </div>
                    </div>
                  </section>

                  {/* Terms */}
                  <section className="border-t border-[#EAE5DC] pt-5">
                    <label className="flex cursor-pointer items-start gap-3">
                      <input
                        type="checkbox"
                        name="termsAccepted"
                        checked={form.termsAccepted}
                        onChange={updateField}
                        required
                        className="mt-1 h-4 w-4 shrink-0 accent-[#B96928]"
                      />
                      <span className="text-[12px] leading-5 text-[#596170]">
                        I confirm that I am the authorized owner/representative
                        of this property and agree to the partnership terms.
                      </span>
                    </label>
                  </section>

                  {error && (
                    <div
                      role="alert"
                      className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-[13px] leading-5 text-red-700"
                    >
                      {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="flex min-h-12 w-full items-center justify-center gap-2 rounded-md bg-[#B96928] px-5 py-3 text-[14px] font-semibold text-white transition-colors hover:bg-[#99531F] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {loading ? "Registering resort..." : "List your resort"}
                    {!loading && <ArrowRight size={17} />}
                  </button>

                  <p className="text-center text-[13px] text-[#697181]">
                    Already registered?{" "}
                    <Link
                      href="/owner/login"
                      className="font-semibold text-[#B96928] underline-offset-4 hover:underline"
                    >
                      Sign in
                    </Link>
                  </p>
                </form>
              )}
            </section>
          </div>
        </div>

        <footer className="mt-5 flex flex-wrap items-center justify-center gap-2 text-center text-[11px] text-[#858B95]">
          <MapPin size={13} />
          <span>Destination Corbett</span>
          <span aria-hidden="true">·</span>
          <span>Resort Partner Extranet</span>
        </footer>
      </div>
    </main>
  );
}