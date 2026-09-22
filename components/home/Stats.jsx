import { Stats } from "@/data/Stats";

export default function stats() {
  return (
    <section className="bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {Stats.map((stat) => (
            <div
              key={stat.label}
              className="text-center md:border-r md:last:border-r-0 border-gray-200"
            >
              <h3 className="text-3xl md:text-4xl font-bold text-[#172033]">
                {stat.value}
              </h3>

              <p className="mt-2 text-sm text-gray-500 font-medium">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}