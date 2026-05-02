const BASE_URL =
  "http://20.207.122.201/evaluation-service/logs";

const ACCESS_TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJzcjAzNzBAc3JtaXN0LmVkdS5pbiIsImV4cCI6MTc3NzcwNjg5MCwiaWF0IjoxNzc3NzA1OTkwLCJpc3MiOiJBZmZvcmQgTWVkaWNhbCBUZWNobm9sb2dpZXMgUHJpdmF0ZSBMaW1pdGVkIiwianRpIjoiNzA2ZjRjZjQtNzZkYi00YTViLTg3YjUtYmUzNjM4Njk2Nzc1IiwibG9jYWxlIjoiZW4tSU4iLCJuYW1lIjoic2hyZXlhIHJhdmkga290dGF5YWtrYXJhbiIsInN1YiI6ImZlMDlhZTUxLWNiZDQtNGJhOC1iOWYyLWQ1ZmUxMTFjYWEwMCJ9LCJlbWFpbCI6InNyMDM3MEBzcm1pc3QuZWR1LmluIiwibmFtZSI6InNocmV5YSByYXZpIGtvdHRheWFra2FyYW4iLCJyb2xsTm8iOiJyYTIzMTEwMDMwNTAwMjAiLCJhY2Nlc3NDb2RlIjoiUWticHhIIiwiY2xpZW50SUQiOiJmZTA5YWU1MS1jYmQ0LTRiYTgtYjlmMi1kNWZlMTExY2FhMDAiLCJjbGllbnRTZWNyZXQiOiJwWUF5VFdtUkZabktickJBIn0.S2qCU9quJy1J1X40fw54RVeDdIRWSnHeWjY1EllEcQ0";

async function Log(stack, level, pkg, message) {
  try {
    const response = await fetch(BASE_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${ACCESS_TOKEN}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        stack,
        level,
        package: pkg,
        message
      })
    });

    const data = await response.json();

    console.log("LOG SUCCESS:", data);
  } catch (error) {
    console.log("LOG ERROR:", error.message);
  }
}

module.exports = Log;