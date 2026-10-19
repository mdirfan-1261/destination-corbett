"use client";
import { useCallback, useEffect, useState } from "react";
import { RefreshCw, AlertCircle, IndianRupee, MapPin, CheckCircle2, Clock } from "lucide-react";

const API_BASE = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000")
  .replace(/\/+$/, "").replace(/\/api$/, "");

function formatPrice(p) {
  if (p >= 10000000) return `₹${(p / 10000000).toFixed(2)} Cr`;
  if (p >= 100000) return `₹${(p / 100000).toFixed(2)} L`;
  return `₹${Number(p).toLocaleString("en-IN")}`;
}

export default function AgentREDealsPage() {
  const [deals, setDeals] = useState([]);
  const [payouts, setPayouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [tab, setTab] = useState("deals");

  const fetchAll = useCallback(async () => {
    setLoading(true); setError("");
    try {
      const token = localStorage.getItem("agentToken");
      const [dealsRes, payoutsRes] = await Promise.all([
        fetch(`${API_BASE}/api/re/deals/agent/my`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${API_BASE}/api/re/deals/agent/payouts`, { headers: { Authorization: `Bearer ${token}` } }),
      ]);
      const dealsData = await dealsRes.json();
      const payoutsData = await payoutsRes.json();
      if (!dealsRes.ok) throw new Error(dealsData.message);
      setDeals(dealsData.deals || []);
      setPayouts(payoutsData.payouts || []);
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const totalEarned = payouts.filter(p => p.status === "paid").reduce((s, p) => s + p.amount, 0);
  const totalPending = payouts.filter(p => p.status === "pending").reduce((s, p) => s + p.amount, 0);

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="overflow-hidden rounded-2xl bg-[#172033] p-5 text-white sm:p-7">
        <p className="text-xs font-bold uppercase tracking-widest text-[#D8A36B]">Real Estate</p>
        <h1 className="mt-2 text-2xl font-bold sm:text-3xl">My Deals & Earnings</h1>
        <p className="mt-2 text-sm text-slate-300">Track your property deals and commission payouts</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Total Deals", value: deals.length, unit: "deals", color: "text-slate-800" },
          { label: "Pending Payout", value: formatPrice(totalPending), color: "text-amber-700" },
          { label: "Total Earned", value: formatPrice(totalEarned), color: "text-emerald-700" },
        ].map(s => (
          <div key={s.label} className="rounded-2xl border border-slate-200 bg-white p-5">
            <p className="text-sm text-slate-500">{s.label}</p>
            <p className={`text-2xl font-bold mt-2 ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 rounded-xl bg-slate-100 p-1 w-fit">
        {["deals", "payouts"].map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`rounded-lg px-5 py-2 text-sm font-semibold capitalize transition ${tab === t ? "bg-white shadow text-slate-800" : "text-slate-500 hover:text-slate-700"}`}>
            {t}
          </button>
        ))}
      </div>

      {error && <div className="flex items-center gap-3 rounded-xl bg-rose-50 border border-rose-200 p-4 text-rose-700 text-sm"><AlertCircle size={18} />{error}</div>}

      {loading ? (
        <div className="flex items-center justify-center py-20 text-slate-400 gap-3"><RefreshCw size={20} className="animate-spin" />Loading...</div>
      ) : tab === "deals" ? (
        deals.length === 0 ? (
          <div className="py-20 text-center rounded-2xl border border-slate-200 bg-white text-slate-400 font-semibold">No deals yet</div>
        ) : (
          <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500 border-b border-slate-200">
                  <tr>
                    {["Property","Buyer","Deal Price","My Commission","Status","Date"].map(h => (
                      <th key={h} className="px-5 py-3.5 text-left font-semibold">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {deals.map(d => (
                    <tr key={d._id} className="hover:bg-slate-50">
                      <td className="px-5 py-4">
                        <p className="font-semibold text-slate-800">{d.propertyId?.title || "—"}</p>
                        <p className="text-xs text-slate-500">{d.propertyId?.city || ""}</p>
                      </td>
                      <td className="px-5 py-4 text-slate-700">{d.buyerName || "—"}</td>
                      <td className="px-5 py-4 font-bold text-slate-800">{formatPrice(d.dealPrice)}</td>
                      <td className="px-5 py-4 font-bold text-emerald-700">{formatPrice(d.listingAgentCommission)} <span className="text-xs font-normal text-slate-400">({d.listingAgentRate}%)</span></td>
                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${d.status === "closed" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>
                          {d.status === "closed" ? <CheckCircle2 size={11} /> : <Clock size={11} />}
                          {d.status?.replace("_", " ")}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-xs text-slate-400">{new Date(d.createdAt).toLocaleDateString("en-IN")}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )
      ) : (
        payouts.length === 0 ? (
          <div className="py-20 text-center rounded-2xl border border-slate-200 bg-white text-slate-400 font-semibold">No payouts yet</div>
        ) : (
          <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500 border-b border-slate-200">
                  <tr>
                    {["Deal","Amount","Status","Paid On"].map(h => (
                      <th key={h} className="px-5 py-3.5 text-left font-semibold">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {payouts.map(p => (
                    <tr key={p._id} className="hover:bg-slate-50">
                      <td className="px-5 py-4 text-slate-700">{p.dealId?.buyerName || "Deal"}</td>
                      <td className="px-5 py-4 font-bold text-emerald-700">{formatPrice(p.amount)}</td>
                      <td className="px-5 py-4">
                        <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${p.status === "paid" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>
                          {p.status}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-xs text-slate-400">
                        {p.paidAt ? new Date(p.paidAt).toLocaleDateString("en-IN") : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )
      )}
    </div>
  );
}