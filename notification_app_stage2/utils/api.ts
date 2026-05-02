const ACCESS_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJzcjAzNzBAc3JtaXN0LmVkdS5pbiIsImV4cCI6MTc3NzcwNjg5MCwiaWF0IjoxNzc3NzA1OTkwLCJpc3MiOiJBZmZvcmQgTWVkaWNhbCBUZWNobm9sb2dpZXMgUHJpdmF0ZSBMaW1pdGVkIiwianRpIjoiNzA2ZjRjZjQtNzZkYi00YTViLTg3YjUtYmUzNjM4Njk2Nzc1IiwibG9jYWxlIjoiZW4tSU4iLCJuYW1lIjoic2hyZXlhIHJhdmkga290dGF5YWtrYXJhbiIsInN1YiI6ImZlMDlhZTUxLWNiZDQtNGJhOC1iOWYyLWQ1ZmUxMTFjYWEwMCJ9LCJlbWFpbCI6InNyMDM3MEBzcm1pc3QuZWR1LmluIiwibmFtZSI6InNocmV5YSByYXZpIGtvdHRheWFra2FyYW4iLCJyb2xsTm8iOiJyYTIzMTEwMDMwNTAwMjAiLCJhY2Nlc3NDb2RlIjoiUWticHhIIiwiY2xpZW50SUQiOiJmZTA5YWU1MS1jYmQ0LTRiYTgtYjlmMi1kNWZlMTExY2FhMDAiLCJjbGllbnRTZWNyZXQiOiJwWUF5VFdtUkZabktickJBIn0.S2qCU9quJy1J1X40fw54RVeDdIRWSnHeWjY1EllEcQ0";

export async function fetchNotifications(
  page: number = 1,
  limit: number = 10,
  type: string = ""
) {
  let url =
    `http://20.207.122.201/evaluation-service/notifications?page=${page}&limit=${limit}`;

  if (type) {
    url += `&notification_type=${type}`;
  }

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${ACCESS_TOKEN}`
    }
  });

  const data = await response.json();

  return data.notifications;
}