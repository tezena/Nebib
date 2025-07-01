import { NextResponse } from "next/server"

export const GET = async (request: Request, { params }: { params: Promise<{ formId: string }> }) => {
  try {
    console.log("🔍 Debug Route - Raw params object:", params)

    const resolvedParams = await params
    console.log("🔍 Debug Route - Resolved params:", resolvedParams)

    const formId = resolvedParams.formId
    console.log("🔍 Debug Route - Extracted formId:", formId)

    const url = new URL(request.url)
    console.log("🔍 Debug Route - Full URL:", url.href)
    console.log("🔍 Debug Route - Pathname:", url.pathname)

    return NextResponse.json({
      success: true,
      rawParams: params,
      resolvedParams,
      formId,
      url: request.url,
      pathname: url.pathname,
    })
  } catch (error) {
    console.error("🚨 Debug Route Error:", error)
    return NextResponse.json({
      error: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
    })
  }
}
