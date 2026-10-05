"use client"

import { Gauge, Radar } from "lucide-react"

export const SpeedPanel = ({ currentSpeed, warningDistance, setWarningDistance }) => {
  const speed = currentSpeed !== null && currentSpeed !== undefined ? Math.round(currentSpeed) : 0

  return (
    <div className="grid gap-3 sm:grid-cols-[0.85fr_1.15fr] mb-4">
      <div className="status-metric">
        <div className="flex items-center gap-2 text-xs font-medium text-gray-500 uppercase tracking-wide">
          <Gauge className="w-4 h-4 text-blue-600" />
          Current Speed
        </div>
        <div className="mt-2 flex items-end gap-1">
          <span className="text-4xl font-bold text-blue-600 leading-none">{speed}</span>
          <span className="text-sm text-gray-600 mb-1">km/h</span>
        </div>
      </div>

      <div className="status-metric">
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 text-xs font-medium text-gray-500 uppercase tracking-wide">
            <Radar className="w-4 h-4 text-orange-500" />
            Warning Radius
          </label>
          <span className="text-lg font-semibold text-orange-500">{warningDistance}m</span>
        </div>
        <input
          type="range"
          min="25"
          max="500"
          step="25"
          value={warningDistance}
          onChange={(e) => setWarningDistance(Number(e.target.value))}
          className="ui-range mt-4"
        />
        <div className="flex justify-between text-xs text-gray-500">
          <span>25m</span>
          <span>500m</span>
        </div>
      </div>
    </div>
  )
}
