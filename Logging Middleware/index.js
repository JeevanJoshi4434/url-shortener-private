const axios = require("axios");
const LOG_API_URL = "http://20.244.56.144/evaluation-service/logs";
 
const TOKEN = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJqZWV3YW5qb3NoaTI1QGdtYWlsLmNvbSIsImV4cCI6MTc1MjU1NTk5MiwiaWF0IjoxNzUyNTU1MDkyLCJpc3MiOiJBZmZvcmQgTWVkaWNhbCBUZWNobm9sb2dpZXMgUHJpdmF0ZSBMaW1pdGVkIiwianRpIjoiNTRiNWNlOTQtMDA5NC00MzAxLTg0M2ItNzA2NDY2OTkwNDdhIiwibG9jYWxlIjoiZW4tSU4iLCJuYW1lIjoiamVldmFuIGpvc2hpIiwic3ViIjoiYzlkMjlkNTctYzk3ZS00ODhmLWFiYjEtYjQ2N2NjNTg0ZWZmIn0sImVtYWlsIjoiamVld2Fuam9zaGkyNUBnbWFpbC5jb20iLCJuYW1lIjoiamVldmFuIGpvc2hpIiwicm9sbE5vIjoiMjI2MTI4NiIsImFjY2Vzc0NvZGUiOiJRQWhEVXIiLCJjbGllbnRJRCI6ImM5ZDI5ZDU3LWM5N2UtNDg4Zi1hYmIxLWI0NjdjYzU4NGVmZiIsImNsaWVudFNlY3JldCI6IkpwY0dmYkV1a3BXV1J4dmUifQ.fYilNqRAa9mBChVJUnhUQiE6wzxehT-fPqIpaI6UPaI";
async function Log(stack, level, pkg, message) {
  try {
    const res = await axios.post(
      LOG_API_URL,
      {
        stack,
        level,
        package: pkg,
        message
      },
      {
        headers: {
          Authorization: TOKEN
        }
      }
    );

    return res.data;
  } catch (err) {
    console.error("Failed to send log:", err.message);
  }
}

module.exports = Log;
