import React, { useState,useEffect,useRef } from "react";
import { FiFileText, FiUser, FiInfo, FiLink, FiAlertCircle, FiMessageCircle, FiVideo, FiFile, FiArrowDownCircle, FiChevronDown, FiChevronUp, FiX, FiMinus, FiSend ,FiUpload , FiPlus ,FiCalendar } from "react-icons/fi";
import { FaCheck, FaTimes } from "react-icons/fa";
import { motion } from "framer-motion";
import { useLocation,useNavigate } from "react-router-dom";
import { formatDate } from "../utils/formating";
import axios from "axios";
import { getToken } from "../utils/const";
import ChatApp from "./ChatApp.js";
import Modal from "react-modal";
import { fetchEvidenceFiles,uploadEvidenceFile } from "../utils/evidence.js";
import { generateFIRCopy,generateComplaintCopy } from "../utils/generateFIR.js";
import { decryptToken } from "../authUtils.js";
import Milestone from './Milestone';
import { getPoliceName } from "../utils/assignPolice.js";

//case details component for viewing the information about the case
const CaseDetails = () => {
  const location = useLocation();
  //case details object is passed in the location state in the parent component , so we can use that details directly here without 
  //having to make an API call here again to view the details
  const { caseItem } = location.state || {};
  const [isModalOpen, setIsModalOpen] = useState(false);//state for toggling the open and close of the modal
  const [isExpanded, setIsExpanded] = useState(false); // State for toggling Individual Details
  const [withdrawReason, setWithdrawReason] = useState(""); // State for withdrawal reason
  const [confirmText, setConfirmText] = useState(""); // State for confirm text
  const [isConfirmEnabled, setIsConfirmEnabled] = useState(false);// state for enabling the confirm button for withdrawal
  const [isChatOpen, setIsChatOpen] = useState(false);//state for toggling the open and close of the chat
  const [isMinimized, setIsMinimized] = useState(false);//state for determining if the chat is minimised or not.
  const [message, setMessage] = useState("");//state for capturing the message written in the chat
  const [shouldSendMessage, setShouldSendMessage] = useState(false);
  const [withdrawn, setWithdrawn] = useState(caseItem.iswithdrawn === 1);
  const [policeName,setPoliceName] = useState("");
  const chatContainerRef = useRef(null);//use ref variable to reference the chat container

  const [isEvidenceModalOpen, setIsEvidenceModalOpen] = useState(false);
  const [evidenceFiles, setEvidenceFiles] = useState([]);//state for capturing the evidence files
  const [newEvidenceFile, setNewEvidenceFile] = useState(null);//state for capturing the new evidence
  const [isUploading, setIsUploading] = useState(false);//state for 

  const openEvidenceModal = () => setIsEvidenceModalOpen(true);//handle function to open the evidence modal
  const closeEvidenceModal = () => setIsEvidenceModalOpen(false);
  const navigate = useNavigate();

  const userUrl = process.env.REACT_APP_USER_API;
  const encryptedToken = getToken();
  const token1 = decryptToken(encryptedToken);
  //using the getPoliceName function to get the police name ( i have another getPoliceName function defined in assignPolice.js)
  useEffect(() => {
    const fetchData = async () => {
      const name = await getPoliceName(caseItem.policeid);
      setPoliceName(name);
      console.log(name);
    };
  
    fetchData();
  }, []);

  
//this useEffect will run once the evidence modal opens to load the evidenced uploaded for the case
  useEffect(() => {
   if(isEvidenceModalOpen){
      loadEvidenceFiles();
   }
  }, [isEvidenceModalOpen]);

 
//   const loadPoliceName = aysnc () => {
//     try{
//         const policeName = await getPoliceName(caseItem.policeid);
//         setPoliceName(policeName);
//     }catch(error){
//         console.log("unable to get police name");
//     }
//   };

   


  const loadEvidenceFiles = async () => {
    try {
      const files = await fetchEvidenceFiles(caseItem.complaintid);//(fetch evidence  function is defined in the evidence.js file )
      setEvidenceFiles(files);
    } catch (error) {
      console.error("Error loading evidence files:", error);
    }
  };

  const handleScheduleMeeting = () => {
    navigate(`/meetings/${caseItem.complaintid}`); // this will navigate to the meetings page and passes the case id in the url param
  };


   // Upload new evidence file using utility function
   const handleUploadEvidence = async () => {
    if (!newEvidenceFile) return;

    setIsUploading(true);
    try {
      await uploadEvidenceFile(caseItem.complaintid, newEvidenceFile);//(this function is defined in the evidence.js file)
      loadEvidenceFiles(); // Refresh evidence list ( again the loadevidence is called to fetch the latest set of evidence after uploading new)
      setNewEvidenceFile(null);
    } catch (error) {
      console.error("Error uploading evidence file:", error);
    } finally {
      setIsUploading(false);
    }
  };

  // Hardcoded IDs for now (replace with actual IDs later)
  const connectionId = caseItem.userid; // Logged-in user 
  const receiverId = caseItem.policeid;   // Assigned police officer

  const openChat = () => {setIsChatOpen(true); setIsMinimized(false)};
  const closeChat = () => setIsChatOpen(false);
  const toggleMinimizeChat = () => setIsMinimized(!isMinimized);

  const handleSendMessage = () => {
    if (message.trim()) {
      // Send message (logic for sending message goes here)
      setShouldSendMessage(true);
      console.log("Message sent:", message);
    //   setMessage("");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  //function to generate the FIR or CSR copy
  const handleFIRButtonClick = async (type) => {
    try {
        console.log(caseItem);

        if (type === 'FIR') {
            await generateFIRCopy(caseItem);
            console.log("FIR generated successfully.");
        } else {
            await generateComplaintCopy(caseItem);
            console.log("Complaint Copy generated successfully.");
        }
    } catch (error) {
        console.error(`Failed to generate ${type}:`, error);
    }
};


//   console.log(caseItem);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    setWithdrawReason(""); // Reset reason when modal closes
    setConfirmText(""); // Reset confirm text when modal closes
    setIsConfirmEnabled(false); // Disable confirm button when modal closes
  };

  const toggleExpanded = () => setIsExpanded((prev) => !prev); // Toggle function for expanding/collapsing

  const handleConfirmTextChange = (e) => {
    setConfirmText(e.target.value);
    setIsConfirmEnabled(e.target.value === "confirm");
  };

  const handleWithdrawReasonChange = (e) => setWithdrawReason(e.target.value);

//function to withdraw or cancel the withdrawal process
  const handleWithdrawOrCancel = async () => {
    console.log(withdrawReason);                        
    try {
      // Determine if the action is a withdrawal or cancellation
      const payload = {
        ...caseItem,
        reasonforwithdrawal: withdrawReason || null,
        iswithdrawn: !withdrawn ? 1 : 0, // If it's a withdrawal, set to 1; if it's cancellation, set to 0
        individualDetails: JSON.stringify(caseItem.individualDetails),
      };
  
      // Since the endpoint is the same for both actions, no need for conditional URL logic
      const response = await axios.put(userUrl, payload, {
        headers: {
          Authorization: `Bearer ${token1}`,
          'Content-Type': 'application/json',
        },
      });
  
      if (response.status === 200) {
        if (!withdrawn) {
          console.log("Case withdrawal updated successfully", response.data);
          setWithdrawn(!withdrawn);; // Set flag for withdrawn status
        } else {
          console.log("Case withdrawal cancelled successfully", response.data);
          setWithdrawn(!withdrawn); // Reset flag for withdrawn status
        
        }
        closeModal(); // Close the modal after success
      } else {
        console.log("Error in updating the case withdrawal or cancellation");
      }
    } catch (error) {
      console.log("Failed to make a withdrawal or cancellation request");
    }
  };
  
//get the individial details of the case from the case item
  const individualDetails = JSON.parse(caseItem.individualdetails);
//the useref refers to the chat container , and if the message state changes this function will be excuted to make sure that the chat 
//automatically scrolls when a new message is sent
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [message]);
//   console.log(individualDetails);

  useEffect(() => {
    console.log(caseItem);
    console.log(individualDetails);
}, []); 

  return (
    <div className="bg-blue-100 min-h-screen text-primary-text p-4 sm:p-10 md:p-20 flex justify-center items-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full sm:w-4/5 lg:w-2/3 xl:w-1/2 bg-card-bg p-4 sm:p-8 rounded-lg shadow-lg"  // Updated width to 80% of screen width
      >
        <h2 className="text-3xl md:text-4xl font-bold text-heading-color mb-4 sm:mb-6 text-center">
          Case Details
        </h2>

        {/* Conditional Inspector Approval Message */}
        {!caseItem?.isfirfiled && (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex items-center justify-center bg-amber-100 p-3 sm:p-4 mb-4 sm:mb-6 rounded-lg shadow-md border-l-4 border-amber-500"
          >
            <FiAlertCircle className="text-xl sm:text-2xl text-amber-600 mr-2 sm:mr-3 animate-pulse" />
            <span className="text-base sm:text-lg font-medium text-amber-700">
              Awaiting Inspector Approval
            </span>
          </motion.div>
        )}

        {caseItem ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-card-border p-4 sm:p-6 rounded-lg"
          >
            <div className="flex items-center mb-2 sm:mb-4">
              <FiFileText className="text-2xl sm:text-3xl text-neonBlue mr-2 sm:mr-3" />
              <h3 className="text-lg sm:text-2xl font-semibold text-amber-700">
                Complaint ID: {caseItem.complaintid}
              </h3>
            </div>

            {/* Case Status */}
            {/* <motion.div
              whileHover={{ scale: 1.02 }}
              className="p-4 mb-4 bg-form-bg rounded-md shadow-md"
            >
              <div className="flex items-center text-amber-700 mb-2">
                <FiInfo className="text-xl text-amber mr-2" />
                <span className="text-lg font-semibold">Status:</span>
              </div>
              <p>{caseItem.casestatus}</p>
            </motion.div> */}

            {/* Milestone Status */}
            <motion.div
            whileHover={{ scale: 1.02 }}
            className="p-3 sm:p-4 mb-3 sm:mb-4 bg-form-bg rounded-md shadow-md"
            >
            <div className="flex items-center text-amber-700 mb-2">
                <FiInfo className="text-lg sm:text-xl text-amber mr-2" />
                <span className="text-base sm:text-lg font-semibold">Case Status Milestones:</span>
            </div>
            {/* Render Milestone Component */}
                <Milestone currentStatus={caseItem.casestatus} />
            </motion.div>

            {/* Individual Details Section */}
            <div className="bg-form-bg p-4 sm:p-6 mb-4 rounded-md shadow-md">
              <h3
                className="text-lg sm:text-xl font-semibold text-amber-700 flex items-center justify-between cursor-pointer"
                onClick={toggleExpanded} // Toggle the expanded state on click
              >
                Individual Details
                <motion.div
                  initial={{ rotate: 0 }}
                  animate={{ rotate: isExpanded ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {isExpanded ? <FiChevronUp /> : <FiChevronDown />}
                </motion.div>
              </h3>
              {isExpanded && (
                <div className="space-y-2 sm:space-y-4 ">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="flex items-center text-amber-700"
                  >
                    <FiUser className="text-lg sm:text-xl text-electricPurple mr-2 sm:mr-3" />
                    <span className="font-semibold">Victim Name:</span>
                    <p className="ml-2">{`${caseItem.victimName[0].toUpperCase()}${caseItem.victimName.slice(1)}`}</p>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="flex items-center text-amber-700"
                  >
                    <FiInfo className="text-lg sm:text-xl text-cyberGreen mr-2 sm:mr-3" />
                    <span className="font-semibold">Incident Date:</span>
                    <p className="ml-2">{formatDate(individualDetails.incident_date) || "N/A"}</p>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="flex items-center text-amber-700"
                  >
                    <FiInfo className="text-lg sm:text-xl text-cyberGreen mr-2 sm:mr-3" />
                    <span className="font-semibold">Ransomware Type:</span>
                    <p className="ml-2">{individualDetails.ransomware_type}</p>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="flex items-center text-amber-700"
                  >
                    <FiInfo className="text-lg sm:text-xl text-cyberGreen mr-2 sm:mr-3" />
                    <span className="font-semibold">Ransom Amount:</span>
                    <p className="ml-2">US${individualDetails.ransom_amount}</p>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="flex items-center text-amber-700"
                  >
                    <FiInfo className="text-lg sm:text-xl text-cyberGreen mr-2 sm:mr-3" />
                    <span className="font-semibold">Complainant Name:</span> {/* this logic is to ensure that the first letter of the name is always in capital */}
                    <p className="ml-2">{`${individualDetails.complainant_name[0].toUpperCase()}${individualDetails.complainant_name.slice(1)}`}</p>
                  </motion.div>            {/* The slice function will get the remaining letters except the first letter */}
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="flex items-center text-amber-700"
                  >
                    <FiInfo className="text-lg sm:text-xl text-cyberGreen mr-2 sm:mr-3" />
                    <span className="font-semibold">Complainant Contact:</span>
                    <p className="ml-2">+91 {individualDetails.complainant_contact}</p>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="flex items-center text-amber-700"
                  >
                    <FiInfo className="text-lg sm:text-xl text-cyberGreen mr-2 sm:mr-3" />
                    <span className="font-semibold">Complainant Email:</span>
                    <p className="ml-2">{individualDetails.complainant_email}</p>
                  </motion.div>
                </div>
              )}
            </div>

            {/* Evidence */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="p-3 sm:p-4 mb-3 sm:mb-4 bg-form-bg rounded-md shadow-md "
            >
              <div className="flex items-center text-amber-700 mb-2">
                <FiLink className="text-lg sm:text-xl text-neonBlue mr-2" />
                <span className="text-base sm:text-lg font-semibold">Evidence:</span>
              </div>
              <p>{caseItem.links ? "Available" : "No Evidence Attached"}</p>

              {caseItem.links && (
                <motion.button
                onClick={openEvidenceModal}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="mt-2 flex items-center px-2 sm:px-3 py-1 sm:py-2 bg-neonBlue text-white rounded-md shadow-md"
                >
                <FiLink className="text-lg sm:text-xl mr-2" />
                View Evidence
                </motion.button>
            )}

            {isEvidenceModalOpen && (
                <Modal
                    isOpen={isEvidenceModalOpen}
                    onRequestClose={closeEvidenceModal}
                    className="fixed inset-0 bg-opacity-80 bg-black flex items-center justify-center"
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3 }}
                        className="bg-white p-4 sm:p-6 rounded-md shadow-lg max-w-lg w-full mx-4 sm:mx-0"
                    >
                        <h2 className="text-lg sm:text-xl font-semibold mb-4">View Evidence</h2>
                        <ul className="mb-4 max-h-48 sm:max-h-64 overflow-y-auto">
                            {evidenceFiles && evidenceFiles.length > 0 ? (
                                evidenceFiles.map((file, index) => (
                                    <li key={index} className="flex items-center justify-between mb-2">
                                        <span className="text-gray-800 text-sm sm:text-base">{file.fileName}</span>
                                        <a href={file.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
                                            Open
                                        </a>
                                    </li>
                                ))
                            ) : (
                                <p className="text-sm sm:text-base">No evidence files available.</p>
                            )}
                        </ul>

                        {/* File Upload for New Evidence */}
                        <div className="mt-4">
                            <label className="flex items-center space-x-2 cursor-pointer">
                                <FiUpload className="text-lg sm:text-xl" />
                                <input
                                    type="file"
                                    onChange={(e) => setNewEvidenceFile(e.target.files[0])}
                                    className="hidden"
                                />
                                <span className="text-xs sm:text-sm font-medium">Add New Evidence</span>
                            </label>
                            {newEvidenceFile && (
                                <motion.button
                                    onClick={handleUploadEvidence}
                                    disabled={isUploading}
                                    className={`mt-2 flex items-center px-2 py-1 sm:px-3 sm:py-2 text-white rounded-md shadow-md ${
                                        isUploading ? "bg-gray-400" : "bg-green-600"
                                    }`}
                                    whileHover={!isUploading && { scale: 1.05 }}
                                    whileTap={!isUploading && { scale: 0.95 }}
                                >
                                    <FiPlus className="text-lg sm:text-xl mr-1 sm:mr-2" />
                                    {isUploading ? "Uploading..." : "Upload Evidence"}
                                </motion.button>
                            )}
                        </div>

                        <motion.button
                            onClick={closeEvidenceModal}
                            className="mt-6 px-3 sm:px-4 py-2 bg-red-600 text-white rounded-md"
                            whileHover={{ scale: 1.05 }}
                        >
                            Close
                        </motion.button>
                    </motion.div>
                </Modal>
            )}

            </motion.div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row sm:justify-around mt-4 sm:mt-6 gap-2 sm:gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={openChat}
                className="flex items-center p-2 sm:p-3 bg-green-600 text-white rounded-md shadow-md"
              >
                <FiMessageCircle className="text-lg sm:text-xl mr-2" />
                Chat
              </motion.button>
              {/* Schedule Meeting Button */}
                <motion.button
                    onClick={handleScheduleMeeting}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center p-2 sm:p-3 bg-green-600 text-white rounded-md shadow-md hover:bg-green-700 transition-colors"
                >
                    <FiCalendar className="text-lg sm:text-xl mr-2" />
                    Meetings
                </motion.button>
                <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center p-2 sm:p-3 bg-purple-600 text-white rounded-md shadow-md"
                        onClick={() => handleFIRButtonClick(caseItem.isfirfiled ? 'FIR' : 'Complaint Copy')}
                        >
                        <FiFile className="text-lg sm:text-xl mr-2" />
                        {caseItem.isfirfiled ? 'View FIR' : 'View Complaint Copy'}
                </motion.button>


                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={openModal}
                    className={`flex items-center p-2 sm:p-3 text-white rounded-md shadow-md ${
                        withdrawn ? "bg-yellow-500" : "bg-red-600"
                    }`}
                    >
                    <FiAlertCircle className="text-lg sm:text-xl mr-2" />
                    {withdrawn ? "View Withdrawal Status" : "withdraw"}
                </motion.button>
            </div>
            
           {/* Floating Chat Window in Bottom-Right */}
           {isChatOpen && (
        <motion.div
            className={`fixed bottom-4 right-4 w-80 max-w-sm bg-white border border-gray-300 rounded-xl shadow-lg flex flex-col ${
            isMinimized ? "hidden" : ""
            }`}
            initial={{ height: 0, opacity: 0, scale: 0.8 }}
            animate={{ height: "400px", opacity: 1, scale: 1 }}
            exit={{ height: 0, opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
            {/* Chat Header */}
            <div className="flex items-center justify-between p-3 bg-green-600 text-white rounded-t-lg">
            <span className="font-semibold">Chat with Officer</span>
            <div className="flex space-x-2">
                {/* Minimize Button */}
                <button onClick={toggleMinimizeChat}>
                <FiMinus className="text-xl" />
                </button>
                {/* Close Button */}
                <button onClick={closeChat}>
                <FiX className="text-xl" />
                </button>
            </div>
            </div>

            {/* Chat Body */}
            {!isMinimized && (
            <div ref={chatContainerRef} className="flex-1 overflow-auto bg-gray-100" style={{ borderRadius: "0 0 12px 12px" }}>
                {/* All the neccessary details are passed as props to the chat component*/}
                <ChatApp
                connectionId={connectionId}
                receiverId={receiverId}
                message={message}
                shouldSendMessage={shouldSendMessage}
                setShouldSendMessage={setShouldSendMessage}
                setMessage={setMessage}
                policeName={policeName}  
                />
            </div>
            )}

            {/* Message Input */}
            {!isMinimized && (
            <div className="flex items-center p-3 bg-white border-t border-gray-300 rounded-b-lg">
                <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type a message..."
                className="flex-1 px-3 py-2 text-gray-800 border rounded-full focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <button onClick={handleSendMessage} className="ml-2 text-green-600 hover:text-green-700 focus:outline-none">
                <FiSend className="text-2xl" />
                </button>
            </div>
            )}
        </motion.div>
        )}
        {/* open chat button*/}
        {isMinimized && (
        <motion.button
            onClick={openChat}
            className="fixed bottom-4 right-4 p-3 bg-green-600 text-white rounded-full shadow-lg"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
        >
            <FiMessageCircle className="text-2xl" />
        </motion.button>
        )}

     


               {/* Modal */}
               {isModalOpen && (
                <div
                    className="fixed inset-0 flex justify-center items-center bg-card-border bg-opacity-50"
                    onClick={closeModal}
                >
                    <div
                    className="bg-accent-color p-8 rounded-lg w-96 shadow-lg overflow-auto"
                    onClick={(e) => e.stopPropagation()}
                    >
                    <h3 className="text-2xl font-semibold mb-6 text-center">
                        {caseItem.iswithdrawn === 0 ? "Confirm Withdrawal" : "Withdrawal Request Status"}
                    </h3>

                    {!withdrawn ? (
                        <>
                        {/* Withdrawal Request Form */}
                        <p className="mb-4">Please provide a reason for the withdrawal request.</p>
                        <textarea
                            value={withdrawReason}
                            onChange={handleWithdrawReasonChange}
                            placeholder="Enter reason for withdrawal"
                            className="w-full p-2 mb-4 text-black border rounded-md focus:outline-none focus:border-blue-400"
                            rows={3}
                        ></textarea>

                        <p className="mb-4">To confirm, type <strong>"confirm"</strong> in the box below.</p>
                        <input
                            value={confirmText}
                            onChange={handleConfirmTextChange}
                            placeholder="Type 'confirm' to proceed"
                            className="w-full p-2 mb-6 text-black border rounded-md focus:outline-none focus:border-blue-400"
                        />

                        <div className="flex justify-between mt-6">
                            <button
                            className="bg-green-600 text-white px-6 py-2 rounded-md"
                            onClick={closeModal}
                            >
                            Cancel
                            </button>
                            <button
                            className={`px-6 py-2 rounded-md ${
                                isConfirmEnabled && withdrawReason ? "bg-red-600 text-white" : "bg-gray-400 text-gray-600"
                            }`}
                            onClick={handleWithdrawOrCancel}
                            disabled={!isConfirmEnabled || !withdrawReason}
                            >
                            Confirm
                            </button>
                        </div>
                        </>
                    ) : (
                        <>
                        {/* Withdrawal Status and Option to Cancel */}
                        <div className="mb-6">
                            <p><strong>Status:</strong> Pending Approval</p>
                            <p className="mb-4"><strong>Reason for Withdrawal:</strong> {caseItem.reasonforwithdrawal || "Not provided"}</p>
                            <p>Your withdrawal request is currently under review. You may cancel this request if you no longer wish to proceed.</p>
                        </div>

                        <div className="flex justify-between mt-6">
                            <button
                            className="bg-green-600 text-white px-6 py-2 rounded-md"
                            onClick={closeModal}
                            >
                            Close
                            </button>
                            <button
                            className="bg-red-600 text-white ml-2 px-6 py-2 rounded-md"
                            onClick={handleWithdrawOrCancel}
                            >
                            Cancel Withdrawal Request
                            </button>
                        </div>
                        </>
                    )}
                    </div>
                </div>
                )}
          </motion.div>
        ) : (
          <p className="text-center text-lightGray">No Case Found</p>
        )}
      </motion.div>
    </div>
  );
};

export default CaseDetails;
