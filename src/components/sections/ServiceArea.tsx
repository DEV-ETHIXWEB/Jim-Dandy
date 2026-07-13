import { useMemo, useState } from "react";
import { MapPin, Search } from "lucide-react";
import { business, serviceAreaCities } from "@data/site";

const mapPins = [
  { label: "Everett", x: 62, y: 10 },
  { label: "Kirkland", x: 68, y: 34 },
  { label: "Seattle", x: 46, y: 44 },
  { label: "Bellevue", x: 72, y: 46 },
  { label: "Renton", x: 70, y: 66 },
  { label: "Tacoma", x: 40, y: 86 },
];

export default function ServiceArea() {
  const [query, setQuery] = useState("");

  const filteredCities = useMemo(() => {
    if (!query.trim()) return serviceAreaCities;
    return serviceAreaCities.filter((city) =>
      city.toLowerCase().includes(query.trim().toLowerCase()),
    );
  }, [query]);

  const isFiltering = query.trim().length > 0;
  const visibleCities = isFiltering ? filteredCities : filteredCities.slice(0, 10);
  const hiddenCount = filteredCities.length - visibleCities.length;

  return (
    <div className="flex flex-col gap-10">
      <div className="relative mx-auto w-full max-w-md">
        <label htmlFor="city-search" className="sr-only">
          Search your city
        </label>
        <input
          id="city-search"
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search your city..."
          className="w-full rounded-full border border-navy-200 bg-white py-3.5 pl-5 pr-12 text-navy-800 shadow-sm outline-none transition-colors placeholder:text-navy-300 focus:border-brand-green-500"
        />
        <Search className="pointer-events-none absolute right-5 top-1/2 h-5 w-5 -translate-y-1/2 text-navy-300" aria-hidden="true" />
      </div>

      <div className="relative aspect-[16/9] w-full overflow-hidden rounded-[32px] bg-navy-900 sm:aspect-[2/1]">
        <svg className="absolute inset-0 h-full w-full opacity-25" aria-hidden="true">
          <defs>
            <pattern id="service-area-dots" width="18" height="18" patternUnits="userSpaceOnUse">
              <circle cx="1.5" cy="1.5" r="1.5" fill="white" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#service-area-dots)" />
        </svg>
        <div className="pointer-events-none absolute inset-0" style={{ background: "radial-gradient(400px circle at 50% 45%, rgba(105,190,40,0.18), transparent 70%)" }} />

        {mapPins.map((pin) => (
          <div
            key={pin.label}
            className="absolute flex -translate-x-1/2 -translate-y-full flex-col items-center gap-1.5"
            style={{ left: `${pin.x}%`, top: `${pin.y}%` }}
          >
            <span className="whitespace-nowrap text-xs font-semibold text-navy-200">{pin.label}</span>
            <span className="h-2.5 w-2.5 rounded-full bg-brand-green-500" aria-hidden="true" />
          </div>
        ))}

        <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-2 text-center">
          <MapPin className="h-9 w-9 text-white" aria-hidden="true" />
          <p className="font-display text-2xl font-bold text-white sm:text-[28px]">Puget Sound Region</p>
          <p className="text-sm font-medium text-white/80 sm:text-base">King · Snohomish · Pierce Counties</p>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3">
        {filteredCities.length > 0 ? (
          <>
            {visibleCities.map((city) => (
              <a
                key={city}
                href={`/service-area#${city.toLowerCase().replace(/\s+/g, "-")}`}
                className="rounded-md bg-navy-800 px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-navy-700"
              >
                {city}
              </a>
            ))}
            {hiddenCount > 0 && (
              <a href="/service-area" className="text-sm font-semibold text-navy-700 hover:text-brand-green-600">
                And more →
              </a>
            )}
          </>
        ) : (
          <p className="text-sm text-navy-400">
            We couldn't find that city - call us at{" "}
            <a href={business.phoneHref} className="font-semibold text-navy-700 underline">
              {business.phone}
            </a>
            , we likely still serve your area.
          </p>
        )}
      </div>

      <div className="text-center">
        <a href="/service-area" className="inline-flex items-center gap-1 font-semibold text-navy-700 hover:text-brand-green-600">
          See Full Service Area →
        </a>
      </div>
    </div>
  );
}
