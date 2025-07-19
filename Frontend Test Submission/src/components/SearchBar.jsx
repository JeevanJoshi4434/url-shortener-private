import React, { useState } from "react";
import Button from "./Button";
import { IoMdAdd } from "react-icons/io";
import Modal from "./Modal";
import axios from "axios";
import Log from "../utils/Log";

const MAX_LINKS = 5;

const SearchBar = () => {
    const [modalOpen, setModalOpen] = useState(false);
    const [urls, setUrls] = useState([{
        url: "",
        shortCode: "",
        expireIn: ""
    }]);
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleInputChange = (index, field, value) => {
        const newUrls = [...urls];
        newUrls[index][field] = value;
        setUrls(newUrls);
    };


    const addInputField = () => {
        if (urls.length < MAX_LINKS) setUrls([...urls, ""]);
    };

    const createShortLinks = async () => {
        setLoading(true);
        setResults([]);
        const promises = urls.map(async (url) => {
            try {
                if(!url.url){
                    Log("frontend", "error", "api", "No url provided");
                    return;
                }
                if(url.expireIn && url.expireIn <= 1){
                    Log("frontend", "error", "api", "Invalid expiration time");
                    return;
                }

                const URLRegex =  /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}/;
                if(!url.url.match(URLRegex)){
                    Log("frontend", "error", "api", "Invalid URL");
                    return;
                }
                const res = await axios.post(`${process.env.REACT_APP_SERVICE_URL}/api/v1/shorturls`, {
                    url: url.url,
                    validity: url.expireIn ? Math.round(url.expireIn * 60 * 1000) : (1000*60*30),
                    shortCode: url.shortCode
                });
                return {
                    url,
                    shortLink: res.data.data.shortLink,
                    expiry: res.data.data.expiry,
                    status: "success",
                };
            } catch (err) {
                Log("frontend", "error", "api", err);
                return {
                    url,
                    error: err?.response?.data?.message || "Unknown error",
                    status: "error",
                };
            }
        });
        const resolved = await Promise.all(promises);
        setResults(resolved);
        setLoading(false);
    };

    return (
        <div className="flex items-center">
            <Button
                className="rounded-md h-10 text-sm font-semibold ml-2 bg-white text-black flex items-center justify-center p-2"
                text="Create short URL"
                Icon={IoMdAdd}
                onClick={() => setModalOpen(true)}
            />

            {modalOpen && (
                <Modal onClose={() => setModalOpen(false)} title="Create Short URLs">
                    <div className="space-y-2">
                        {urls.map((entry, i) => (
                            <div key={i} className="space-y-2">
                                <input
                                    type="text"
                                    value={entry.url}
                                    onChange={(e) => handleInputChange(i, "url", e.target.value)}
                                    placeholder="Enter full URL"
                                    className="w-full border text-black border-gray-300 p-2 rounded-md"
                                />
                                <input
                                    type="text"
                                    value={entry.shortCode}
                                    onChange={(e) => handleInputChange(i, "shortCode", e.target.value)}
                                    placeholder="Custom shortcode (optional)"
                                    className="w-full border text-black border-gray-300 p-2 rounded-md"
                                />
                                <input
                                    type="number"
                                    value={entry.expireIn}
                                    onChange={(e) => handleInputChange(i, "expireIn", e.target.value)}
                                    placeholder="Expiry in minutes (Default: 30)"
                                    className="w-full border text-black border-gray-300 p-2 rounded-md"
                                />
                            </div>
                        ))}

                        {urls.length < MAX_LINKS && (
                            <button
                                onClick={addInputField}
                                className="text-blue-500 hover:underline text-sm"
                            >
                                + Add another link
                            </button>
                        )}

                        <Button
                            text={loading ? "Creating..." : "Generate Short Links"}
                            onClick={createShortLinks}
                            className="bg-blue-600 text-white w-full py-2 mt-2"
                        />

                        {results.length > 0 && (
                            <div className="mt-4 space-y-2">
                                {results.map((res, i) => (
                                    <div key={i} className={`p-3 rounded-md ${res?.status === "success" ? "bg-green-100" : "bg-red-100"}`}>
                                        <div className="font-semibold text-sm text-black">
                                            {res && res?.status === "success" ? (
                                                <>
                                                    <a href={res.shortLink} className="text-blue-600 underline" target="_blank" rel="noreferrer">{res.shortLink}</a><br />
                                                    Expires: {new Date(res.expiry).toLocaleString()}
                                                </>
                                            ) : (
                                                <>Error: {res?.error}</>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </Modal>
            )}
        </div>
    );
};

export default SearchBar;
