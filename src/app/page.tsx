"use client";

import axios from "axios";
import { motion } from "framer-motion";
import { useState } from "react";

export default function Home() {
  const [repoUrl, setRepoUrl] = useState("");
  const [files, setFiles] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFetch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setFiles([]);

    try {
      const response = await axios.post("/api/fetch-files", { repoUrl });
      if (response.data.files) {
        setFiles(response.data.files);
      } else {
        setError(response.data.error || "Something went wrong.");
      }
    } catch (err) {
      setError("Failed to fetch files. Please try again.");
      console.log("error fetching", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        "/api/download-folder",
        { repoUrl },
        { responseType: "blob" }
      );
      const blob = new Blob([response.data], { type: "application/zip" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "repository.zip";
      link.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      setError("Failed to download the folder.");
      console.log("error downloading", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center">
      <motion.div
        className="max-w-lg w-full bg-opacity-30 bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
      >
        <h1 className="text-center text-3xl font-extrabold text-white tracking-wide mb-6">
          <span className="text-cyan-400">GitSnap</span>
        </h1>
        <p className="text-gray-300 text-center mb-8">
          Paste your GitHub repository folder URL, and we’ll fetch and zip it
          for you in seconds.
        </p>
        <form onSubmit={handleFetch}>
          <div className="relative mb-6">
            <input
              type="url"
              placeholder="Paste GitHub URL..."
              value={repoUrl}
              onChange={(e) => setRepoUrl(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-gray-800 text-gray-300 border border-gray-700 focus:ring-2 focus:ring-cyan-400 focus:outline-none"
            />
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="w-full px-6 py-3 rounded-lg bg-cyan-500 text-white font-semibold tracking-wide hover:shadow-cyan-400/50 hover:shadow-lg transition-all duration-300"
          >
            {loading ? "Loading..." : "Fetch Files"}
          </motion.button>
        </form>
        {error && <p className="text-red-400 mt-4 text-center">{error}</p>}
        {files.length > 0 && (
          <div className="mt-6">
            <h2 className="text-lg font-semibold text-white mb-4">
              Available Files:
            </h2>
            <div className="h-48 overflow-y-auto custom-scrollbar">
              <ul className="space-y-2">
                {files.map((file, index) => (
                  <motion.li
                    key={index}
                    className="bg-gray-800 p-2 rounded-lg text-gray-300"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.4 }}
                  >
                    {file}
                  </motion.li>
                ))}
              </ul>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleDownload}
              className="mt-6 w-full px-6 py-3 rounded-lg bg-cyan-600 text-white font-semibold tracking-wide hover:shadow-cyan-400/50 hover:shadow-lg transition-all duration-300"
            >
              {loading ? "Downloading..." : "Download Folder"}
            </motion.button>
          </div>
        )}
      </motion.div>
    </div>
  );
}
