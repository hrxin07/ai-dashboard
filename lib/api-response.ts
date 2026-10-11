import { NextResponse } from "next/server";

export function successResponse<T>(data: T, message = "操作成功", status = 200) {
  return NextResponse.json({ success: true, message, data }, { status });
}

export function errorResponse(message: string, status = 400) {
  return NextResponse.json({ success: false, message, data: null }, { status });
}
