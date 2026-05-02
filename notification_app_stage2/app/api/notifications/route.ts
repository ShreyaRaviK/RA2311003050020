import { NextResponse } from "next/server";

const ACCESS_TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJzcjAzNzBAc3JtaXN0LmVkdS5pbiIsImV4cCI6MTc3NzcwOTUzOCwiaWF0IjoxNzc3NzA4NjM4LCJpc3MiOiJBZmZvcmQgTWVkaWNhbCBUZWNobm9sb2dpZXMgUHJpdmF0ZSBMaW1pdGVkIiwianRpIjoiYzgyZGM2ZjEtOWRlYi00ODUwLTgzNTQtYTE0YmU1YTkxOWZkIiwibG9jYWxlIjoiZW4tSU4iLCJuYW1lIjoic2hyZXlhIHJhdmkga290dGF5YWtrYXJhbiIsInN1YiI6ImZlMDlhZTUxLWNiZDQtNGJhOC1iOWYyLWQ1ZmUxMTFjYWEwMCJ9LCJlbWFpbCI6InNyMDM3MEBzcm1pc3QuZWR1LmluIiwibmFtZSI6InNocmV5YSByYXZpIGtvdHRheWFra2FyYW4iLCJyb2xsTm8iOiJyYTIzMTEwMDMwNTAwMjAiLCJhY2Nlc3NDb2RlIjoiUWticHhIIiwiY2xpZW50SUQiOiJmZTA5YWU1MS1jYmQ0LTRiYTgtYjlmMi1kNWZlMTExY2FhMDAiLCJjbGllbnRTZWNyZXQiOiJwWUF5VFdtUkZabktickJBIn0.H-UQAk4TpBgV43fdqi0RGFHnTr8FSI81BYlbSldj5Yw";

const NOTIFICATIONS_URL =
  "http://20.207.122.201/evaluation-service/notifications";

type Notification = {
  id: string;
  message: string;
  type: string;
  timestamp?: string;
};

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object"
    ? value as Record<string, unknown>
    : {};
}

function toStringValue(value: unknown, fallback = ""): string {
  return typeof value === "string" || typeof value === "number"
    ? String(value)
    : fallback;
}

function toOptionalString(value: unknown): string | undefined {
  return typeof value === "string" || typeof value === "number"
    ? String(value)
    : undefined;
}

function normalizeNotification(value: unknown, index: number): Notification {
  const item = asRecord(value);

  return {
    id: toStringValue(item.id ?? item.ID ?? item.notification_id, String(index)),
    message: toStringValue(item.message ?? item.Message ?? item.content ?? item.title),
    type: toStringValue(item.type ?? item.Type ?? item.notification_type),
    timestamp: toOptionalString(item.timestamp ?? item.Timestamp ?? item.created_at)
  };
}

function extractNotifications(data: unknown): Notification[] {
  if (Array.isArray(data)) {
    return data.map(normalizeNotification);
  }

  const body = asRecord(data);
  const notifications = body.notifications ?? body.data;

  return Array.isArray(notifications)
    ? notifications.map(normalizeNotification)
    : [];
}

export async function GET(request: Request) {
  const incomingUrl = new URL(request.url);
  const serviceUrl = new URL(NOTIFICATIONS_URL);
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);

  for (const key of ["page", "limit", "notification_type"]) {
    const value = incomingUrl.searchParams.get(key);

    if (value) {
      serviceUrl.searchParams.set(key, value);
    }
  }

  try {
    const response = await fetch(serviceUrl, {
      headers: {
        Authorization: `Bearer ${ACCESS_TOKEN}`
      },
      cache: "no-store",
      signal: controller.signal
    });

    const data = await response.json();

    if (!response.ok) {
      const message = toStringValue(
        asRecord(data).message,
        "Unable to fetch notifications"
      );

      return NextResponse.json({ message }, { status: response.status });
    }

    return NextResponse.json({
      notifications: extractNotifications(data)
    });
  } catch (error) {
    const message =
      error instanceof Error && error.name === "AbortError"
        ? "Notification service timed out. Please try again."
        : "Unable to connect to notification service.";

    return NextResponse.json({ message }, { status: 504 });
  } finally {
    clearTimeout(timeout);
  }
}
