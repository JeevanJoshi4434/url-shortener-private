import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import Log from '../utils/Log';

const Redirect = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [message, setMessage] = useState("Redirecting...");

    useEffect(() => {
        const fetchRedirect = async () => {
            if (!id) {
                Log("frontend", "error", "page", "Missing redirect ID in URL.");
                setMessage("Invalid redirect link.");
                return;
            }

            try {
                Log("frontend", "info", "page", `Attempting to redirect with ID=${id}`);
                const res = await axios.get(`/api/v1/shorturls/redirect/${id}`);

                if (res.data?.data?.redirect) {
                    Log("frontend", "info", "page", `Redirecting to ${res.data.data.redirect}`);
                    window.location.href = res.data.data.redirect;
                } else {
                    Log("frontend", "warn", "page", `Redirect failed. No target URL returned.`);
                    setMessage("This link is broken or invalid.");
                }
            } catch (err) {
                if (err.response?.data?.error?.message === "Short URL is expired.") {
                    Log("frontend", "error", "page", `Short URL with id=${id} is expired.`);
                    setMessage("This short link has expired.");
                } else {
                    Log("frontend", "fatal", "page", `Redirect API failed: ${err.message}`);
                    setMessage("Something went wrong.");
                }
            }
        };

        fetchRedirect();
    }, [id]);

    return (
        <div className="flex items-center justify-center h-screen">
            <h2 className="text-xl font-semibold text-gray-700">{message}</h2>
        </div>
    );
};

export default Redirect;
