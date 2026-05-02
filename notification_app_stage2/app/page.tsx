"use client";

import { useEffect, useState } from "react";
import { fetchNotifications, type Notification } from "../utils/api";

import {
  Container,
  Typography,
  Card,
  CardContent,
  Alert,
  CircularProgress
} from "@mui/material";

export default function Home() {

  const [notifications, setNotifications] =
    useState<Notification[]>([]);

  const [error, setError] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [readIds, setReadIds] =
    useState<string[]>(() => {
      if (typeof window === "undefined") {
        return [];
      }

      try {
        const stored = JSON.parse(
          window.localStorage.getItem("readNotifications") || "[]"
        );

        return Array.isArray(stored) ? stored : [];
      } catch {
        window.localStorage.removeItem("readNotifications");
        return [];
      }
    });

  // fetch notifications from API
  useEffect(() => {

    async function load() {

      try {
        const data = await fetchNotifications();
        setNotifications(data);
        setError("");
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Unable to load notifications"
        );
      } finally {
        setLoading(false);
      }

    }

    load();

  }, []);

  // mark notification as read
  function markAsRead(id: string) {

    if (readIds.includes(id)) {
      return;
    }

    const updated = [...readIds, id];

    setReadIds(updated);

    window.localStorage.setItem(
      "readNotifications",
      JSON.stringify(updated)
    );
  }

  return (

    <Container>

      <Typography variant="h4" sx={{ mt: 2 }}>
        All Notifications
      </Typography>

      {loading && (
        <CircularProgress sx={{ mt: 3 }} />
      )}

      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}

      {!loading && !error && notifications.length === 0 && (
        <Alert severity="info" sx={{ mt: 2 }}>
          No notifications found.
        </Alert>
      )}

      {notifications.map((n) => {

        const isRead =
          readIds.includes(n.id);

        return (

          <Card
            key={n.id}
            sx={{
              my: 2,
              backgroundColor:
                isRead
                  ? "#f5f5f5"
                  : "#e3f2fd",
              cursor: "pointer"
            }}
            onClick={() =>
              markAsRead(n.id)
            }
          >

            <CardContent>

              <Typography
                sx={{
                  fontWeight: isRead
                    ? "normal"
                    : "bold"
                }}
              >
                {n.message}
              </Typography>

              <Typography color="gray">
                {n.type}
              </Typography>

            </CardContent>

          </Card>

        );

      })}

    </Container>

  );

}
