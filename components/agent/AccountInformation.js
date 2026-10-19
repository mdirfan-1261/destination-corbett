
import { Mail, Phone, UserRound, ShieldCheck } from "lucide-react";
import StatusBadge from "@/components/agent/StatusBadge";

export default function AccountInformation({ agent = {} }) {
  const name =
    agent.name ||
    agent.fullName ||
    agent.agentName ||
    "Agent";

  const email = agent.email || "Not provided";
  const phone =
    agent.phone ||
    agent.mobile ||
    agent.phoneNumber ||
    "Not provided";

  const status =
    agent.status ||
    (agent.isVerified ? "verified" : "pending");

  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-5">
      <div className="flex items-center gap-3">
        <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-50 text-[#B96928]">
          <UserRound size={23} />
        </span>

        <div className="min-w-0">
          <h2 className="text-lg font-extrabold text-[#172033]">
            Account Information
          </h2>
          <p className="text-sm text-gray-500">
            Your agent profile
          </p>
        </div>
      </div>

      <div className="mt-5 space-y-4">
        <div className="flex items-start gap-3">
          <UserRound size={18} className="mt-0.5 text-gray-400" />
          <div className="min-w-0">
            <p className="text-xs text-gray-500">Full name</p>
            <p className="break-words text-sm font-semibold text-[#172033]">
              {name}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <Mail size={18} className="mt-0.5 text-gray-400" />
          <div className="min-w-0">
            <p className="text-xs text-gray-500">Email address</p>
            <p className="break-all text-sm font-semibold text-[#172033]">
              {email}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <Phone size={18} className="mt-0.5 text-gray-400" />
          <div className="min-w-0">
            <p className="text-xs text-gray-500">Phone number</p>
            <p className="break-words text-sm font-semibold text-[#172033]">
              {phone}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <ShieldCheck size={18} className="mt-0.5 text-gray-400" />
          <div className="min-w-0">
            <p className="mb-2 text-xs text-gray-500">Account status</p>
            <StatusBadge status={status} />
          </div>
        </div>
      </div>
    </section>
  );
}
