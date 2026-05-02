"use client";

import {
  useEffect,
  useState
} from "react";

import {
  fetchNotifications
} from "../../utils/api";

import {
  Container,
  Typography,
  Select,
  MenuItem,
  TextField
} from "@mui/material";

export default function PriorityInbox() {

  const [limit, setLimit] =
    useState(10);

  const [type, setType] =
    useState("");

  const [notifications, setNotifications] =
    useState<any[]>([]);

  useEffect(() => {

    async function load() {

      const data =
        await fetchNotifications(
          1,
          limit,
          type
        );

      setNotifications(data);

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

      {notifications.map((n) => (

        <div key={n.id}>
          {n.message}
        </div>

      ))}

    </Container>

  );

}