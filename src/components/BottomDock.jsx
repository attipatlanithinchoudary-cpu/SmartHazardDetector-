"use client"

import { useState } from "react"
import { SpeedPanel } from "./panels/SpeedPanel"
import { HazardStatusPanel } from "./panels/HazardStatusPanel"
import { AddHazardPanel } from "./panels/AddHazardPanel"
import { RemoveHazardPanel } from "./panels/RemoveHazardPanel"
import { FiltersPanel } from "./panels/FiltersPanel"
import { RouteSummaryPanel } from "./panels/RouteSummaryPanel"
import { RoadStatusIndicator } from "./RoadStatusIndicator"
import { Activity, Filter, Gauge, MapPinned, PlusCircle, Trash2 } from "lucide-react"

export const BottomDock = ({
  currentSpeed,
  warningDistance,
  setWarningDistance,
  isDetecting,
  setIsDetecting,
  statusText,
  proximityAlert,
  hazardsInProximity,
  hazards,
  onAddHazard,
  onRemoveHazard,
  filters,
  setFilters,
  routeSummary,
  predictedHazards = [],
  currentSegmentStatus,
}) => {
  const [activeTab, setActiveTab] = useState("status")

  const tabs = [
    { id: "status", label: "Status", icon: Gauge },
    { id: "add-hazard", label: "Report", icon: PlusCircle },
    { id: "remove-hazard", label: "Remove", icon: Trash2 },
    { id: "filters", label: "Filters", icon: Filter },
    { id: "summary", label: "Route", icon: MapPinned },
  ]

  const activeHazards = hazardsInProximity.length

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 px-3 pb-3 sm:px-4 sm:pb-4">
      <div className="dock-shell overflow-hidden">
        <div className="px-4 pt-3 pb-3 border-b border-gray-100 flex items-center justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2 text-xs text-gray-500 font-medium uppercase tracking-wide">
              <Activity className="w-3.5 h-3.5 text-blue-600" />
              Road Condition
            </div>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-sm font-semibold text-gray-900 truncate">{statusText}</span>
              <span className="text-xs text-gray-500">{activeHazards} nearby</span>
            </div>
          </div>
          <RoadStatusIndicator
            hazards={hazards}
            predictedHazards={predictedHazards}
            currentSegmentStatus={currentSegmentStatus}
          />
        </div>

        {/* Tab Navigation */}
        <div className="dock-tabs">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`dock-tab ${
                activeTab === tab.id
                  ? "dock-tab-active"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
            )
          })}
        </div>

        {/* Tab Content */}
        <div className="dock-content">
          {activeTab === "status" && (
            <>
              <SpeedPanel
                currentSpeed={currentSpeed}
                warningDistance={warningDistance}
                setWarningDistance={setWarningDistance}
              />
              <HazardStatusPanel
                statusText={statusText}
                proximityAlert={proximityAlert}
                isDetecting={isDetecting}
                setIsDetecting={setIsDetecting}
              />
            </>
          )}

          {activeTab === "add-hazard" && <AddHazardPanel onAddHazard={onAddHazard} />}

          {activeTab === "remove-hazard" && <RemoveHazardPanel hazards={hazards} onRemoveHazard={onRemoveHazard} />}

          {activeTab === "filters" && <FiltersPanel filters={filters} setFilters={setFilters} />}

          {activeTab === "summary" && (
            <RouteSummaryPanel routeSummary={routeSummary} predictedHazards={predictedHazards} />
          )}
        </div>
      </div>
    </div>
  )
}
