"use client"

import { Power, ShieldAlert } from "lucide-react"

export const HazardStatusPanel = ({ statusText, proximityAlert, isDetecting, setIsDetecting }) => {
  return (
    <div className="grid gap-3 sm:grid-cols-[1fr_1.2fr]">
      <button
        onClick={() => setIsDetecting(!isDetecting)}
        className={`flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-semibold transition-all ${
          isDetecting
            ? "bg-red-500/15 text-red-700 border border-red-300 hover:bg-red-500/20"
            : "bg-green-500/15 text-green-700 border border-green-300 hover:bg-green-500/20"
        }`}
      >
        <Power className="w-4 h-4" />
        {isDetecting ? "Stop Detection" : "Start Detection"}
      </button>

      <div
        className={`flex items-center gap-3 p-3 rounded-lg font-medium ${
          proximityAlert
            ? "bg-red-100/50 text-red-800 border border-red-300"
            : "bg-green-100/50 text-green-800 border border-green-300"
        }`}
      >
        <ShieldAlert className="w-5 h-5 flex-shrink-0" />
        <span>{statusText}</span>
      </div>
    </div>
  )
}
