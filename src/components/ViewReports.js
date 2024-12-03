import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import CaseCard from "./CaseCard";
import { FiAlertCircle, FiSearch, FiXCircle } from "react-icons/fi";
import { getToken } from "../utils/const";
import LogoSpinner from './LogoSpinner';
import { jwtDecode } from "jwt-decode";
import { decryptToken } from "../authUtils";
import { toast } from 'react-toastify';
import FeedbackModal from "./FeedbackModal";
import RaiseIssueModal from "./RaiseIssueModal";

const ViewReports = () => {
  const navigate = useNavigate();
  const [caseData, setCaseData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [isRaiseIssueModalOpen, setIsRaiseIssueModalOpen] = useState(false);
  const [selectedCase, setSelectedCase] = useState(null);

  // Handle opening the Feedback modal
  const handleFeedback = (caseItem) => {
    setSelectedCase(caseItem);
    setIsFeedbackModalOpen(true);
  };

  // Handle opening the Raise Issue modal
  const handleRaiseIssue = (caseItem) => {
    setSelectedCase(caseItem);
    setIsRaiseIssueModalOpen(true);
  };
  
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6; // no of cards are by default set to 6 cards per page.

  const userUrl = process.env.REACT_APP_USER_API;
  const encryptedToken = getToken();
  const token1 = decryptToken(encryptedToken);
  const decodedToken = jwtDecode(token1);
  const userId = decodedToken["cognito:username"];

  useEffect(() => {
    const fetchCaseData = async () => {
      try {
        const payload = { userid: userId };
        const response = await axios.post(userUrl, payload, {
          headers: {
            Authorization: `Bearer ${token1}`,
            'Content-Type': 'application/json',
          },
        });
    
        const { items } = JSON.parse(response.data.body);
    
        // Filter cases by categoryid = 13 first
        const filteredByCategory = items.filter((caseItem) => caseItem.categoryid === 13);
    
        // Map to include victimName for the filtered items
        const caseDataWithVictimName = filteredByCategory.map((caseItem) => {
          const individualDetails = JSON.parse(caseItem.individualdetails);
          return { ...caseItem, victimName: individualDetails.victim_name };
        });
    
        // Set state with processed data
        setCaseData(caseDataWithVictimName);
        setFilteredData(caseDataWithVictimName); // Initialize filtered data
      } catch (err) {
        setError('No Complaints Yet!');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
  
    fetchCaseData();
  }, []);
  
//card click handler to navigate to te case details page and also pass the case item as a state to be used in that component
  const handleCardClick = (caseItem) => {
    navigate(`/case-details/${caseItem.complaintid}`, { state: { caseItem } });
  };

  //search handler to set the search state and to filter the case cards according the search
  const handleSearch = (event) => {
    const term = event.target.value.toLowerCase();
    setSearchTerm(term);

    const filtered = caseData.filter((caseItem) => {
      const complaintIdString = String(caseItem.complaintid);
      const victimNameLower = caseItem.victimName.toLowerCase();
      return (
        complaintIdString.includes(term) || // if the user enters the case id or the victim name , filter the case card according to the search
        victimNameLower.includes(term)
      );
    });
    setFilteredData(filtered);
    setCurrentPage(1);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  return (
    <div className="bg-blue-100 min-h-screen text-primary-text p-6 sm:p-12 md:p-16">
      <h1 className="text-3xl sm:text-4xl font-bold text-heading-color mb-6 text-center">View Reports</h1>
      
      <div className="flex items-center justify-center mb-6">
        <div className="relative w-full sm:w-3/4 md:w-1/2">
          <FiSearch className="absolute left-3 top-3 text-gray-500 text-xl" />
          <input
            type="text"
            placeholder="Search by Complaint ID or Victim Name"
            value={searchTerm}
            onChange={handleSearch}
            className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          {searchTerm && (
            <FiXCircle
              className="absolute right-3 top-3 text-gray-500 cursor-pointer text-xl"
              onClick={() => setSearchTerm("")}
            />
          )}
        </div>
      </div>

      {loading && <LogoSpinner isPulse={false} />}

      {error && (
        <div className="flex justify-center items-center min-h-screen">
          <div className="bg-red-500 text-white p-6 rounded-md shadow-lg flex items-center">
            <FiAlertCircle className="mr-3 text-2xl" />
            <span>{error}</span>
          </div>
        </div>
      )}

       {/* No Results Found Message */}
       {!loading && !error && filteredData.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center text-center p-8 rounded-lg bg-white shadow-lg mt-10"
        >
          <FiAlertCircle className="text-red-500 text-5xl mb-4" />
          <h2 className="text-2xl font-semibold text-gray-700 mb-2">
            No Results Found
          </h2>
          <p className="text-gray-600 mb-4">
            We couldn't find any reports matching your search. Try a different search term.
          </p>
          <button
            onClick={() => setSearchTerm("")}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition duration-200"
          >
            Clear Search
          </button>
        </motion.div>
      )}

      <motion.div
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0, y: 50 },
          visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
        }}
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-6"
      >
        {currentItems.map((caseItem) => (
          <motion.div
            key={caseItem.complaintid}
            onClick={() => handleCardClick(caseItem)}
            whileHover={{ scale: 1.05 }}
            className="cursor-pointer transform transition duration-300 hover:shadow-xl rounded-lg overflow-hidden"
          >
            <CaseCard
              complaintId={caseItem.complaintid}
              caseStatus={caseItem.casestatus}
              victimName={caseItem.victimName}
              onFeedback={() => handleFeedback(caseItem)}   // Handle feedback
              onRaiseIssue={() => handleRaiseIssue(caseItem)} // Handle raise issue
            />
          </motion.div>
        ))}
      </motion.div>

      {totalPages > 1 && (
        <div className="flex justify-center items-center mt-8 space-x-2">
          <button
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-gray-200 rounded-full hover:bg-gray-300 disabled:opacity-50"
          >
            Previous
          </button>
          <span className="px-4 py-2 text-lg font-semibold">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-gray-200 rounded-full hover:bg-gray-300 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}

      {/* Feedback Modal */}
      {isFeedbackModalOpen && (
        <FeedbackModal
          caseItem={selectedCase}
          closeModal={() => setIsFeedbackModalOpen(false)}
        />
      )}

      {/* Raise Issue Modal */}
      {isRaiseIssueModalOpen && (
        <RaiseIssueModal
          caseItem={selectedCase}
          closeModal={() => setIsRaiseIssueModalOpen(false)}
        />
      )}

    </div>
  );
};

export default ViewReports;
