"use client";

import { AppBar, Toolbar, Button } from "@mui/material";
import Link from "next/link";

export default function Navbar() {
  return (
    <AppBar position="static">
      <Toolbar>

        <Link href="/">
          <Button color="inherit">
            All Notifications
          </Button>
        </Link>

        <Link href="/priority">
          <Button color="inherit">
            Priority Inbox
          </Button>
        </Link>

      </Toolbar>
    </AppBar>
  );
}