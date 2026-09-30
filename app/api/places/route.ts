import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const input = request.nextUrl.searchParams.get("input")?.trim()
    const apiKey = process.env.GOOGLE_MAPS_API_KEY || process.env.ELEVATION_API_KEY || process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY

    if (!apiKey) {
      return NextResponse.json({ error: "Google Maps API key is not configured." }, { status: 500 })
    }

    if (!input || input.length < 3) {
      return NextResponse.json({ suggestions: [] })
    }

    const response = await fetch("https://places.googleapis.com/v1/places:autocomplete", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": apiKey,
        "X-Goog-FieldMask": "suggestions.placePrediction.placeId,suggestions.placePrediction.text.text",
      },
      body: JSON.stringify({
        input,
        languageCode: "en-US",
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json(
        { error: data.error?.message || "Unable to load location suggestions." },
        { status: response.status },
      )
    }

    const suggestions =
      data.suggestions
        ?.map((suggestion: any) => suggestion.placePrediction)
        .filter(Boolean)
        .map((prediction: any) => ({
          placeId: prediction.placeId,
          description: prediction.text?.text || "",
        }))
        .filter((suggestion: any) => suggestion.placeId && suggestion.description) || []

    return NextResponse.json({ suggestions })
  } catch (error: any) {
    console.error("[Server] Places autocomplete error:", error)
    return NextResponse.json({ error: error.message || "Unable to load location suggestions." }, { status: 500 })
  }
}
