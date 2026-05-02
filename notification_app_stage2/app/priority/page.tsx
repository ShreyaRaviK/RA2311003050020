"use client";

import {
  useState,
  useEffect
} from "react";

import {
  fetchNotifications,
  type Notification
} from "../../utils/api";

import {
  Container,
  Typography,
  Select,
  MenuItem,
  TextField,
  Card,
  CardContent,
  Alert,
  CircularProgress
} from "@mui/material";

const PRIORITY: Record<string, number> = {
  Placement: 3,
  Result: 2,
  Event: 1
};

function sortByPriority(notifications: Notification[]) {
  return [...notifications].sort((a, b) => {
    const priorityDifference =
      (PRIORITY[b.type] ?? 0) - (PRIORITY[a.type] ?? 0);

    if (priorityDifference !== 0) {
      return priorityDifference;
    }

    return (
      new Date(b.timestamp ?? 0).getTime() -
      new Date(a.timestamp ?? 0).getTime()
    );
  });
}

export default function PriorityInbox() {

  const [limit, setLimit] =
    useState(10);

  const [type, setType] =
    useState("");

  const [notifications, setNotifications] =
    useState<Notification[]>([]);

  const [error, setError] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {

    async function load() {

      setLoading(true);

      try {
        const data =
          await fetchNotifications(
            1,
            100,
            type
          );

        setNotifications(
          sortByPriority(data).slice(0, limit)
        );
        setError("");
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Unable to load priority notifications"
        );
      } finally {
        setLoading(false);
      }

    }

    load();

  }, [limit, type]);

  return (

    <Container>

      <Typography variant="h4" sx={{ mt: 2 }}>
        Priority Inbox
      </Typography>

      <TextField
        label="Top N"
        type="number"
        value={limit}
        onChange={(e) =>
          setLimit(Number(e.target.value))
        }
        sx={{ mr: 2 }}
      />

      <Select
        value={type}
        onChange={(e) =>
          setType(e.target.value)
        }
      >

        <MenuItem value="">
          All
        </MenuItem>

        <MenuItem value="Event">
          Event
        </MenuItem>

        <MenuItem value="Result">
          Result
        </MenuItem>

        <MenuItem value="Placement">
          Placement
        </MenuItem>

      </Select>

      {loading && (
        <CircularProgress sx={{ mt: 3, display: "block" }} />
      )}

      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}

      {!loading && !error && notifications.length === 0 && (
        <Alert severity="info" sx={{ mt: 2 }}>
          No priority notifications found.
        </Alert>
      )}

      {notifications.map((n) => (

        <Card key={n.id} sx={{ my: 2 }}>

          <CardContent>

            <Typography sx={{ fontWeight: "bold" }}>
              {n.message}
            </Typography>

            <Typography color="gray">
              {n.type}
            </Typography>

          </CardContent>

        </Card>

      ))}

    </Container>

  );

}
