import { type NextRequest, NextResponse } from "next/server"

const makeWaypoint = (value: string) => {
  const trimmed = value.trim()
  const match = trimmed.match(/^(-?\d+(?:\.\d+)?),\s*(-?\d+(?:\.\d+)?)$/)

  if (match) {
    return {
      location: {
        latLng: {
          latitude: Number(match[1]),
          longitude: Number(match[2]),
        },
      },
    }
  }

  return { address: trimmed }
}

const decodePolyline = (encoded: string) => {
  const points = []
  let index = 0
  let lat = 0
  let lng = 0

  while (index < encoded.length) {
    let result = 0
    let shift = 0
    let byte = 0

    do {
      byte = encoded.charCodeAt(index++) - 63
      result |= (byte & 0x1f) << shift
      shift += 5
    } while (byte >= 0x20)

    lat += result & 1 ? ~(result >> 1) : result >> 1
    result = 0
    shift = 0

    do {
      byte = encoded.charCodeAt(index++) - 63
      result |= (byte & 0x1f) << shift
      shift += 5
    } while (byte >= 0x20)

    lng += result & 1 ? ~(result >> 1) : result >> 1
    points.push({ lat: lat / 1e5, lng: lng / 1e5 })
  }

  return points
}

const formatDistance = (meters = 0) => {
  if (meters < 1000) return `${Math.round(meters)} m`
  return `${(meters / 1000).toFixed(1)} km`
}

const formatDuration = (duration = "0s") => {
  const seconds = Number.parseInt(duration.replace("s", ""), 10) || 0
  const minutes = Math.round(seconds / 60)
  if (minutes < 60) return `${minutes} min`
  const hours = Math.floor(minutes / 60)
  const remainingMinutes = minutes % 60
  return remainingMinutes ? `${hours} hr ${remainingMinutes} min` : `${hours} hr`
}

const getStepPoint = (step: any, key: "startLocation" | "endLocation") => ({
  lat: step?.[key]?.latLng?.latitude || 0,
  lng: step?.[key]?.latLng?.longitude || 0,
})

export async function POST(request: NextRequest) {
  try {
    const { origin, destination } = await request.json()
    const apiKey = process.env.ELEVATION_API_KEY || process.env.GOOGLE_MAPS_API_KEY || process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY

    if (!apiKey) {
      return NextResponse.json({ error: "Google Maps API key is not configured." }, { status: 500 })
    }

    if (!origin || !destination) {
      return NextResponse.json({ error: "Origin and destination are required." }, { status: 400 })
    }

    const response = await fetch("https://routes.googleapis.com/directions/v2:computeRoutes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": apiKey,
        "X-Goog-FieldMask":
          "routes.distanceMeters,routes.duration,routes.polyline.encodedPolyline,routes.legs.steps.distanceMeters,routes.legs.steps.staticDuration,routes.legs.steps.navigationInstruction,routes.legs.steps.startLocation,routes.legs.steps.endLocation",
      },
      body: JSON.stringify({
        origin: makeWaypoint(origin),
        destination: makeWaypoint(destination),
        travelMode: "DRIVE",
        routingPreference: "TRAFFIC_AWARE",
        polylineEncoding: "ENCODED_POLYLINE",
        languageCode: "en-US",
      }),
    })

    const data = await response.json()

    if (!response.ok || !data.routes?.length) {
      return NextResponse.json(
        { error: data.error?.message || "No route found between these locations." },
        { status: response.ok ? 404 : response.status },
      )
    }

    const route = data.routes[0]
    const overviewPath = decodePolyline(route.polyline?.encodedPolyline || "")
    const steps =
      route.legs?.[0]?.steps?.map((step: any) => ({
        distance: {
          text: formatDistance(step.distanceMeters),
          value: step.distanceMeters || 0,
        },
        duration: {
          text: formatDuration(step.staticDuration),
          value: Number.parseInt((step.staticDuration || "0s").replace("s", ""), 10) || 0,
        },
        instructions: step.navigationInstruction?.instructions || "Continue",
        maneuver: (step.navigationInstruction?.maneuver || "").toLowerCase().replaceAll("_", "-"),
        start_location: getStepPoint(step, "startLocation"),
        end_location: getStepPoint(step, "endLocation"),
      })) || []

    return NextResponse.json({
      routes: [
        {
          overview_path: overviewPath,
          legs: [
            {
              distance: {
                text: formatDistance(route.distanceMeters),
                value: route.distanceMeters || 0,
              },
              duration: {
                text: formatDuration(route.duration),
                value: Number.parseInt((route.duration || "0s").replace("s", ""), 10) || 0,
              },
              steps,
            },
          ],
        },
      ],
    })
  } catch (error: any) {
    console.error("[Server] Routes API error:", error)
    return NextResponse.json({ error: error.message || "Failed to calculate route." }, { status: 500 })
  }
}
