"use client"

import { HAZARD_COLORS } from "../../services/googlemaps"

const hazardTypes = [
  { value: "speed_breaker", label: "Speed Breaker", color: HAZARD_COLORS.speed_breaker },
  { value: "pothole", label: "Pothole", color: HAZARD_COLORS.pothole },
  { value: "manhole", label: "Manhole", color: HAZARD_COLORS.manhole },
]

export const FiltersPanel = ({ filters, setFilters }) => {
  const toggleType = (type) => {
    setFilters((prev) => ({
      ...prev,
      types: prev.types.includes(type) ? prev.types.filter((t) => t !== type) : [...prev.types, type],
    }))
  }

  const toggleSeverity = (severity) => {
    setFilters((prev) => ({
      ...prev,
      severities: prev.severities.includes(severity)
        ? prev.severities.filter((s) => s !== severity)
        : [...prev.severities, severity],
    }))
  }

  const toggleVerified = () => {
    setFilters((prev) => ({
      ...prev,
      onlyVerified: !prev.onlyVerified,
    }))
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="block text-gray-700 font-medium">Hazard Types</label>
        <div className="grid gap-2 sm:grid-cols-3">
          {hazardTypes.map((type) => (
            <label key={type.value} className="filter-chip">
              <input
                type="checkbox"
                checked={filters.types.includes(type.value)}
                onChange={() => toggleType(type.value)}
                className="sr-only"
              />
              <span className="w-3 h-3 rounded-full inline-block" style={{ backgroundColor: type.color }} />
              <span className="text-gray-700">{type.label}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <label className="block text-gray-700 font-medium">Severity Levels</label>
        <div className="grid grid-cols-3 gap-2">
          {["low", "medium", "high"].map((severity) => (
            <label key={severity} className="filter-chip">
              <input
                type="checkbox"
                checked={filters.severities.includes(severity)}
                onChange={() => toggleSeverity(severity)}
                className="sr-only"
              />
              <span
                className={`w-3 h-3 rounded-full inline-block ${
                  severity === "high" ? "bg-red-500" : severity === "medium" ? "bg-orange-500" : "bg-yellow-500"
                }`}
              />
              <span className="text-gray-700">{severity.charAt(0).toUpperCase() + severity.slice(1)}</span>
            </label>
          ))}
        </div>
      </div>

      <label className="filter-chip justify-between">
        <input type="checkbox" checked={filters.onlyVerified} onChange={toggleVerified} className="sr-only" />
        <span className="text-gray-700 font-medium">Verified Hazards Only</span>
        <span className={`mini-toggle ${filters.onlyVerified ? "mini-toggle-on" : ""}`} />
      </label>

      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
        <div className="text-xs font-medium text-gray-600 mb-2">Color Legend</div>
        <div className="grid grid-cols-2 gap-2 text-xs">
          {hazardTypes.map((type) => (
            <div key={type.value} className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: type.color }} />
              <span className="text-gray-600">{type.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
