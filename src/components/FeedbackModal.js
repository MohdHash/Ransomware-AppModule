import React, { useState } from "react";
import { motion } from "framer-motion";
import { FiCheckCircle } from "react-icons/fi";
import { toast } from 'react-toastify';

const FeedbackModal = ({ caseItem, closeModal }) => {
  const [feedback, setFeedback] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Feedback submitted:", feedback);
    toast.success("Feedback submitted successfully!");
    closeModal(); // Close modal after submitting ( the callback is passed as prop from the parent component and is called here)
  };

  return (
    <motion.div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-white rounded-lg shadow-lg w-full max-w-md sm:max-w-lg p-8 sm:p-10"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0 }}
      >
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold">Provide Feedback</h2>
          <button onClick={closeModal} className="text-gray-500">
            X
          </button>
        </div>
        <p className="mt-4 text-gray-700">
          Please provide feedback for the case with ID: <strong>{caseItem.complaintid}</strong>
        </p>
        <textarea
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          className="mt-4 w-full p-3 border border-gray-300 rounded-md"
          rows="4"
          placeholder="Your feedback..."
        />
        <div className="mt-4 flex justify-end">
          <button
            onClick={handleSubmit}
            className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-200"
          >
            Submit Feedback
            <FiCheckCircle className="ml-2 inline-block" />
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default FeedbackModal;
