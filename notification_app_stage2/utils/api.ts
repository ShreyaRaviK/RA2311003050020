export type Notification = {
  id: string;
  message: string;
  type: string;
  timestamp?: string;
};

type NotificationsResponse = {
  notifications?: Notification[];
  message?: string;
};

export async function fetchNotifications(
  page: number = 1,
  limit: number = 100,
  type: string = ""
): Promise<Notification[]> {
  const safeLimit = Math.max(limit, 5);
  const params = new URLSearchParams({
    page: String(page),
    limit: String(safeLimit)
  });

  if (type) {
    params.set("notification_type", type);
  }

  const response = await fetch(`/api/notifications?${params.toString()}`);
  const data = (await response.json()) as NotificationsResponse;

  if (!response.ok) {
    throw new Error(data.message || "Unable to fetch notifications");
  }

  return data.notifications ?? [];
}
