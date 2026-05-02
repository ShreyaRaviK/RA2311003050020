const Log = require("../logging_middleware/logger");

const ACCESS_TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJzcjAzNzBAc3JtaXN0LmVkdS5pbiIsImV4cCI6MTc3NzcwNjg5MCwiaWF0IjoxNzc3NzA1OTkwLCJpc3MiOiJBZmZvcmQgTWVkaWNhbCBUZWNobm9sb2dpZXMgUHJpdmF0ZSBMaW1pdGVkIiwianRpIjoiNzA2ZjRjZjQtNzZkYi00YTViLTg3YjUtYmUzNjM4Njk2Nzc1IiwibG9jYWxlIjoiZW4tSU4iLCJuYW1lIjoic2hyZXlhIHJhdmkga290dGF5YWtrYXJhbiIsInN1YiI6ImZlMDlhZTUxLWNiZDQtNGJhOC1iOWYyLWQ1ZmUxMTFjYWEwMCJ9LCJlbWFpbCI6InNyMDM3MEBzcm1pc3QuZWR1LmluIiwibmFtZSI6InNocmV5YSByYXZpIGtvdHRheWFra2FyYW4iLCJyb2xsTm8iOiJyYTIzMTEwMDMwNTAwMjAiLCJhY2Nlc3NDb2RlIjoiUWticHhIIiwiY2xpZW50SUQiOiJmZTA5YWU1MS1jYmQ0LTRiYTgtYjlmMi1kNWZlMTExY2FhMDAiLCJjbGllbnRTZWNyZXQiOiJwWUF5VFdtUkZabktickJBIn0.S2qCU9quJy1J1X40fw54RVeDdIRWSnHeWjY1EllEcQ0";

const API_URL =
  "http://20.207.122.201/evaluation-service/notifications";

const PRIORITY = {
  Placement: 3,
  Result: 2,
  Event: 1
};

// fetch notifications
async function fetchNotifications() {
  try {
    await Log("frontend", "info", "api", "Fetching notifications");

    const response = await fetch(API_URL, {
      headers: {
        Authorization: `Bearer ${ACCESS_TOKEN}`
      }
    });

    const data = await response.json();

    await Log(
      "frontend",
      "info",
      "api",
      "Notifications fetched successfully"
    );

    return data.notifications;
  } catch (error) {
    await Log("frontend", "error", "api", error.message);
  }
}

// sorting logic
function sortNotifications(notifications) {
  return notifications.sort((a, b) => {
    if (PRIORITY[b.type] !== PRIORITY[a.type]) {
      return PRIORITY[b.type] - PRIORITY[a.type];
    }

    return new Date(b.timestamp) - new Date(a.timestamp);
  });
}

// dynamic top-n selection
function getTopNotifications(notifications, n = 10) {
  return notifications.slice(0, n);
}

// main execution
async function runStage1() {
  try {
    const notifications = await fetchNotifications();

    if (!notifications || notifications.length === 0) {
      console.log("No notifications received");
      return;
    }

    await Log(
      "frontend",
      "info",
      "component",
      "Sorting notifications started"
    );

    const sortedNotifications =
      sortNotifications(notifications);

    // read user input from command line
    let n = parseInt(process.argv[2]);

    // default fallback
    if (!n || n <= 0) {
      n = 10;
    }

    await Log(
      "frontend",
      "info",
      "state",
      `Generating top ${n} notifications`
    );

    const topNotifications =
      getTopNotifications(sortedNotifications, n);

    console.log(`\nTOP ${n} IMPORTANT NOTIFICATIONS\n`);

    console.table(topNotifications);

  } catch (error) {
    await Log("frontend", "fatal", "component", error.message);
  }
}

runStage1();