export async function Log(
  stack: string,
  level: string,
  pkg: string,
  message: string
) {
  const accessToken =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJzcjAzNzBAc3JtaXN0LmVkdS5pbiIsImV4cCI6MTc3NzcwOTUzOCwiaWF0IjoxNzc3NzA4NjM4LCJpc3MiOiJBZmZvcmQgTWVkaWNhbCBUZWNobm9sb2dpZXMgUHJpdmF0ZSBMaW1pdGVkIiwianRpIjoiYzgyZGM2ZjEtOWRlYi00ODUwLTgzNTQtYTE0YmU1YTkxOWZkIiwibG9jYWxlIjoiZW4tSU4iLCJuYW1lIjoic2hyZXlhIHJhdmkga290dGF5YWtrYXJhbiIsInN1YiI6ImZlMDlhZTUxLWNiZDQtNGJhOC1iOWYyLWQ1ZmUxMTFjYWEwMCJ9LCJlbWFpbCI6InNyMDM3MEBzcm1pc3QuZWR1LmluIiwibmFtZSI6InNocmV5YSByYXZpIGtvdHRheWFra2FyYW4iLCJyb2xsTm8iOiJyYTIzMTEwMDMwNTAwMjAiLCJhY2Nlc3NDb2RlIjoiUWticHhIIiwiY2xpZW50SUQiOiJmZTA5YWU1MS1jYmQ0LTRiYTgtYjlmMi1kNWZlMTExY2FhMDAiLCJjbGllbnRTZWNyZXQiOiJwWUF5VFdtUkZabktickJBIn0.H-UQAk4TpBgV43fdqi0RGFHnTr8FSI81BYlbSldj5Yw";

  try {
    await fetch(
      "http://20.207.122.201/evaluation-service/logs",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          stack,
          level,
          package: pkg,
          message
        })
      }
    );
  } catch (err) {
    console.log(err);
  }
}
