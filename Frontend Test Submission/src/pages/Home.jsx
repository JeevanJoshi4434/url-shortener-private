import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';
import Log from '../utils/Log';

const Home = () => {
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLinks = async () => {
      try {
        const res = await axios.get(`/api/v1/shorturls`);
        setLinks(res.data.data || []);
        Log("frontend", "info", "page", "Fetched all short URLs successfully.");
      } catch (err) {
        Log("frontend", "error", "api", `Failed to fetch short URLs: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };
    fetchLinks();
  }, []);

  const handleCopy = (url) => {
    navigator.clipboard.writeText(url);
    Log("frontend", "info", "copy", `Copied URL to clipboard: ${url}`);
  };

  return (
    <>
      <Navbar />
      <div className="p-4">
        <h2 className="text-2xl font-semibold my-4">Your Shortened URLs</h2>

        {loading ? (
          <p>Loading...</p>
        ) : links.length === 0 ? (
          <p className="text-gray-600">No links available.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {links.map(link => {
              const shortUrl = `https://url-shortner-cj44.onrender.com/${link._id}`;
              return (
                <div key={link._id} className="p-4 border rounded-lg shadow bg-white">
                  <div className="flex items-center gap-2 text-gray-600 text-sm">
                    <span>Short link:</span>
                    <a
                      href={shortUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 underline break-all"
                    >
                      {shortUrl}
                    </a>
                    <button
                      onClick={() => handleCopy(shortUrl)}
                      className="ml-1 p-1 hover:text-blue-700"
                      title="Copy to clipboard"
                    >
                      📋
                    </button>
                  </div>

                  <p className="text-blue-600 break-all">
                    Original URL: <a href={link.originalUrl} target="_blank" rel="noopener noreferrer">{link.originalUrl}</a>
                  </p>
                  <p className="text-sm text-gray-500">Created At: {new Date(link.createdAt).toLocaleString()}</p>
                  <p className="text-sm text-gray-500">Expires In: {Math.floor(link.expireIn / 60000)} mins</p>
                  <p className="text-sm text-gray-500">Clicks: {link.clicks?.length || 0}</p>
                  <button
                    onClick={() => navigate(`/stats/${link._id}`)}
                    className="mt-2 bg-blue-600 text-white py-1 px-3 rounded hover:bg-blue-700"
                  >
                    View Stats
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
};

export default Home;
