"use client";

import { useEffect, useState } from "react";
import { fetchNotifications } from "../utils/api";
import { Log } from "../utils/logger";

import {
  Container,
  Typography,
  Card,
  CardContent
} from "@mui/material";

export default function Home() {

  const [notifications, setNotifications] =
    useState<any[]>([]);

  const [readIds, setReadIds] =
    useState<string[]>([]);

  useEffect(() => {

    const stored =
      JSON.parse(
        localStorage.getItem("readNotifications") || "[]"
      );

    setReadIds(stored);

  }, []);

  useEffect(() => {

    async function load() {

      await Log(
        "frontend",
        "info",
        "page",
        "Loading all notifications"
      );

      const data =
        await fetchNotifications();

      setNotifications(data);

    }

    load();

  }, []);

  function markAsRead(id: string) {

    const updated = [...readIds, id];

    setReadIds(updated);

    localStorage.setItem(
      "readNotifications",
      JSON.stringify(updated)
    );
  }

  return (

    <Container>

      <Typography variant="h4" sx={{ mt: 2 }}>
        All Notifications
      </Typography>

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
                fontWeight={
                  isRead
                    ? "normal"
                    : "bold"
                }
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