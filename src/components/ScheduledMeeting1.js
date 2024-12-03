import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaCopy, FaVideo, FaExternalLinkAlt } from "react-icons/fa";
import { motion } from "framer-motion";
import axios from "axios";
import { decryptToken } from "../authUtils";
import dayjs from "dayjs";

const ScheduledMeeting1 = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notification, setNotification] = useState("");
  const [videoIdMap, setVideoIdMap] = useState({});
  const navigate = useNavigate();
  const { caseId } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const encryptedToken = sessionStorage.getItem("jwt");
        const userName = sessionStorage.getItem("userName");

        if (!encryptedToken || !userName) {
          throw new Error("Missing authorization credentials in session storage.");
        }

        const token = decryptToken(encryptedToken);
        if (!token) throw new Error("Failed to decrypt the authorization token.");
        const url = process.env.REACT_APP_VIDEO_FETCH_MEETING;
        const response = await axios.get(
          url,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const responseBody = JSON.parse(response.data.body);
        const filteredData = responseBody.filter(
          (item) => item.complaint_id === caseId
        );

        setData(filteredData);
      } catch (err) {
        setError(err.message || "Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [caseId]);

  const handleDownloadRecording = async (videoId) => {
    const apiUrl =process.env.REACT_APP_VIDEO_RECORDING_FETCH;
    const requestBody = {
      body: { concatenationId: videoId },
    };

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error(`API call failed with status ${response.status}`);
      }

      const data = await response.json();
      const url = JSON.parse(data.body);
      const videoUrl = url.files[0].url;

      if (videoUrl) {
        window.open(videoUrl, "_blank");
      }
    } catch (error) {
      console.error("Error fetching video URL:", error);
    }
  };

  const fetchVideoId = async (meetingId, complaintId) => {
    try {
      const requestBody = {
        meetingId,
        complaintId,
      };
      const url = process.env.REACT_APP_VIDEOID_FETCH;
      const response = await fetch(
        url,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ body: JSON.stringify(requestBody) }),
        }
      );

      const data = await response.json();
      const parsedData = JSON.parse(data.body);

      return parsedData.item?.videoid || null;
    } catch (error) {
      console.error("Error fetching video ID:", error);
      return null;
    }
  };

  const handleCopyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setNotification("Meeting ID copied to clipboard!");
  };

  const handleJoinMeeting = (meetingId) => {
    navigate(`/joinmeeting/${meetingId}`, { state: { meetingId } });
  };

  return (
    <div className="p-6 bg-blue-100 min-h-screen">
      {loading && (
        <div className="fixed inset-0 flex justify-center items-center bg-white bg-opacity-75 z-50">
          <motion.div
            className="w-12 h-12 border-4 border-blue-500 rounded-full border-t-transparent animate-spin"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
          />
        </div>
      )}

      <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
        Scheduled Meetings
      </h1>

      {error ? (
        <p className="text-red-500 text-center">{error}</p>
      ) : data.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="table-auto w-full bg-white shadow-md rounded-lg">
            <thead className="bg-blue-400  text-white">
              <tr>
                <th className="px-4 py-2">Sender Name</th>
                <th className="px-4 py-2">Meeting ID</th>
                <th className="px-4 py-2">Date</th>
                <th className="px-4 py-2">Start Time</th>
                <th className="px-4 py-2">End Time</th>
                <th className="px-4 py-2">Receiver Name</th>
                <th className="px-4 py-2">Receiver Email</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row, index) => {
                const now = dayjs();
                const meetingStart = dayjs(`${row.date}T${row.start_time}`);
                const meetingEnd = dayjs(`${row.date}T${row.end_time}`);
                const videoId = videoIdMap[row.meeting_id];

                let actionButtonLabel;
                let actionButtonDisabled = false;

                if (now.isBefore(meetingStart)) {
                  actionButtonLabel = "Yet to Start";
                  actionButtonDisabled = true;
                } else if (now.isAfter(meetingEnd)) {
                  actionButtonLabel = "Ended";
                  actionButtonDisabled = true;

                  if (!videoIdMap[row.meeting_id]) {
                    fetchVideoId(row.meeting_id, row.complaint_id).then(
                      (videoId) => {
                        if (videoId) {
                          setVideoIdMap((prev) => ({
                            ...prev,
                            [row.meeting_id]: videoId,
                          }));
                        }
                      }
                    );
                  }
                } else {
                  actionButtonLabel = "Join Meeting";
                }

                return (
                  <tr key={index} className="border-b">
                    <td className="px-4 py-2 text-center">{row.sender_name}</td>
                    <td
                      className="px-4 py-2 text-center cursor-pointer text-blue-500"
                      onClick={() => handleCopyToClipboard(row.meeting_id)}
                    >
                      <FaCopy className="inline-block mr-1" /> {row.meeting_id}
                    </td>
                    <td className="px-4 py-2 text-center">{row.date}</td>
                    <td className="px-4 py-2 text-center">{row.start_time}</td>
                    <td className="px-4 py-2 text-center">{row.end_time}</td>
                    <td className="px-4 py-2 text-center">{row.receiver_name}</td>
                    <td className="px-4 py-2 text-center">{row.receiver_email}</td>
                    <td className="px-4 py-2 text-center">
                      <button
                        className={`px-4 py-2 rounded ${
                          actionButtonDisabled
                            ? "bg-gray-300 text-gray-700"
                            : "bg-blue-500 text-white hover:bg-blue-600"
                        }`}
                        onClick={() =>
                          actionButtonLabel === "Join Meeting"
                            ? handleJoinMeeting(row.meeting_id)
                            : null
                        }
                        disabled={actionButtonDisabled}
                      >
                        {actionButtonLabel}
                      </button>
                      <button
                        className={`px-4 py-2 ml-2 mt-2 rounded ${
                          videoId
                            ? "bg-green-500 text-white hover:bg-green-600"
                            : "bg-gray-300 text-gray-700"
                        }`}
                        onClick={() => handleDownloadRecording(videoId)}
                        disabled={!videoId}
                      >
                        <FaVideo className="inline-block mr-1" /> Recordings
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-center text-gray-700">No records found for the current user.</p>
      )}

      {notification && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-5 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-4 py-2 rounded shadow-lg"
        >
          {notification}
        </motion.div>
      )}
    </div>
  );
};

export default ScheduledMeeting1;
