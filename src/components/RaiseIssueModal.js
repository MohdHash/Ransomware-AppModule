import React, { useState } from "react";
import { motion } from "framer-motion";
import { FiXCircle, FiAlertCircle, FiEdit } from "react-icons/fi"; // Importing React Icons
import { toast } from 'react-toastify';

//This RaiseIssueModal accepts caseItem and closemodal function as a Prop from the parent component ( case card)
const RaiseIssueModal = ({ caseItem, closeModal }) => {
  const [issueDescription, setIssueDescription] = useState("");
    console.log(caseItem);
  const handleSubmit = (e) => {
    e.preventDefault();
    // console.log("Issue raised:", issueDescription);
    toast.success(`Issue raised for Case Id: ${caseItem.complaintid}`);
    closeModal(); // Close modal after submitting
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
          <h2 className="text-xl font-bold text-darkBlue">Raise an Issue</h2>
          <button onClick={closeModal} className="text-gray-500 hover:text-gray-700">
            <FiXCircle className="text-2xl" />
          </button>
        </div>
        <p className="mt-4 text-gray-700">
          Please provide details for raising an issue for the case with ID: <strong>{caseItem.complaintid}</strong>
        </p>
        <div className="relative mt-4">
          <FiEdit className="absolute left-3 top-3 text-gray-400" /> {/* Icon inside the text area */}
          <textarea
            value={issueDescription}
            onChange={(e) => setIssueDescription(e.target.value)}
            className="mt-4 w-full p-3 pl-10 border border-gray-300 rounded-md"
            rows="4"
            placeholder="Describe the issue..."
          />
        </div>
        <div className="mt-4 flex justify-end">
          <button
            onClick={handleSubmit}
            className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-200"
          >
            Raise Issue
            <FiAlertCircle className="ml-2 inline-block" /> {/* Icon beside the button text */}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default RaiseIssueModal;
