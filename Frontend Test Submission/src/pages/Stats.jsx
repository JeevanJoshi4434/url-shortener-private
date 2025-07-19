import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Log from '../utils/Log';

const Stats = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_SERVICE_URL}/api/v1/shorturls/${id}`);
        setData(res.data.data);
        Log("frontend", "info", "page", `Stats loaded for ${id}`);
      } catch (err) {
        const msg = err?.response?.data?.message ||
          err?.response?.data?.error?.messag ||
          "Something went wrong.";
        setErrorMsg(msg);
        Log("frontend", "error", "page", `Error fetching stats: ${msg}`);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [id]);

  if (loading) return <div className="p-4">Loading...</div>;
  if (errorMsg) return <div className="p-4 text-red-600">Error: {errorMsg}</div>;

  const clickList = data?.shortUrl?.clicks || [];

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Stats for ID: {id}</h2>
      <p className="mb-2 text-sm text-gray-600">
        Total Clicks: <strong>{clickList.length}</strong>
      </p>

      {clickList.length > 0 ? (
        <table className="min-w-full bg-white border rounded">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-2 border">Time</th>
              <th className="p-2 border">IP</th>
              <th className="p-2 border">Referrer</th>
              <th className="p-2 border">Country</th>
              <th className="p-2 border">Region</th>
              <th className="p-2 border">City</th>
            </tr>
          </thead>
          <tbody>
            {clickList.map((click, idx) => (
              <tr key={click._id || idx} className="hover:bg-gray-50">
                <td className="p-2 border">{new Date(click.time).toLocaleString()}</td>
                <td className="p-2 border">{click.ip}</td>
                <td className="p-2 border">{click.referrer || "N/A"}</td>
                <td className="p-2 border">{click.location?.country || "N/A"}</td>
                <td className="p-2 border">{click.location?.region || "N/A"}</td>
                <td className="p-2 border">{click.location?.city || "N/A"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-gray-600">No clicks recorded yet.</p>
      )}
    </div>
  );
};

export default Stats;
