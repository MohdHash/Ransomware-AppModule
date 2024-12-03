import React, { useState } from "react";
import { motion } from "framer-motion";
import { FiEdit, FiCheckCircle, FiX  } from "react-icons/fi";
import { FaCheck, FaWhatsapp } from "react-icons/fa";
const ConfirmationPage = ({ 
  victimName, 
  victimNameOther, 
  incidentDate, 
  description, 
  ransomwareType, 
  ransomAmount, 
  complainantName, 
  complainantContact, 
  complainantEmail, 
  evidenceFiles, 
  onEdit, 
  onSubmit,
  onNotificationChange,
  qrCodeImage,
}) => {
  // State to manage checkboxes
  const [isInfoConfirmed, setIsInfoConfirmed] = useState(false);
  const [isTermsAgreed, setIsTermsAgreed] = useState(false);
  const[notificationPreference,setNotificationPreference] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);

  const handleNotificationChange = ()=>{
    const newPreference = !notificationPreference;
    setNotificationPreference(newPreference);
    onNotificationChange(newPreference);//the callback that is passed from the parent component ( register complain) is called here.
    if (newPreference) setShowQrModal(true);
  }

  // Enable submit only when both checkboxes are checked
  const isSubmitEnabled = isInfoConfirmed && isTermsAgreed;

  return (
    <div className="bg-card-bg min-h-screen text-lightGray p-16 flex flex-col items-center">
      {/* Title Section */}
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-5xl font-bold mb-8 text-center text-heading-color"
      >
        Confirm Your Complaint Details
      </motion.h1>
      
      {/* Main Content */}
      <motion.div
        className="bg-white  text-primary-text p-8 rounded-lg shadow-lg space-y-6 w-4/5 text-left"
      >
        {/* Case Details Section */}
        <div className="space-y-4">
          <h2 className="text-3xl text-cyberGreen font-semibold mb-4">
            <FiCheckCircle className="inline-block mr-2" />
            Case Details
          </h2>
          <p className="text-xl"><strong>Victim Name:</strong> {victimName === "self" ? "Self" : victimNameOther}</p>
          <p className="text-xl"><strong>Incident Date:</strong> {incidentDate}</p>
          <p className="text-xl"><strong>Description:</strong> {description}</p>
          <p className="text-xl"><strong>Ransomware Type:</strong> {ransomwareType}</p>
          <p className="text-xl"><strong>Ransom Amount:</strong> ${ransomAmount}</p>
        </div>

        {/* Complainant Details Section */}
        <div className="space-y-4">
          <h2 className="text-3xl text-cyberGreen font-semibold mb-4">
            <FiCheckCircle className="inline-block mr-2" />
            Complainant Details
          </h2>
          <p className="text-xl"><strong>Complainant Name:</strong> {complainantName}</p>
          <p className="text-xl"><strong>Complainant Contact:</strong> {complainantContact}</p>
          <p className="text-xl"><strong>Complainant Email:</strong> {complainantEmail}</p>
        </div>

        {/* Evidence Files Section */}
        <div className="space-y-4">
          <h2 className="text-3xl text-cyberGreen font-semibold mb-4">
            <FiCheckCircle className="inline-block mr-2" />
            Evidence Files
          </h2>
          {evidenceFiles.length > 0 ? (
            evidenceFiles.map((file, index) => (
              <p key={index} className="text-xl"><strong>File {index + 1}:</strong> {file.name || "No file uploaded"}</p>
            ))
          ) : (
            <p className="text-xl text-red-500">No evidence files uploaded.</p>
          )}
        </div>

        {/* Custom Confirmation Checkboxes */}
        <div className="mt-8 space-y-4">

        <label className="flex items-center text-xl cursor-pointer space-x-2">
          <motion.div
            className={`w-6 h-6 rounded-sm border-2 flex items-center justify-center ${
              notificationPreference
                ? "bg-cyberGreen border-cyberGreen"
                : "border-gray-400"
            }`}
            whileTap={{ scale: 0.9 }}
            onClick={handleNotificationChange}
          >
            {notificationPreference && <FaCheck className="text-darkBlue" />}
          </motion.div>
          <span>Enable notifications via WhatsApp and SMS.</span>
        </label>

          {/* Information Confirmation Checkbox */}
          <label className="flex items-center text-xl cursor-pointer space-x-2">
            <motion.div
              className={`w-6 h-6 rounded-sm border-2 flex items-center justify-center ${isInfoConfirmed ? 'bg-cyberGreen border-cyberGreen' : 'border-gray-400'}`}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsInfoConfirmed(!isInfoConfirmed)}
            >
              {isInfoConfirmed && (
                <FaCheck className="text-darkBlue" />
              )}
            </motion.div>
            <span>I confirm that the information provided is true and accurate.</span>
          </label>

          {/* Terms and Conditions Checkbox */}
          <label className="flex items-center text-xl cursor-pointer space-x-2">
            <motion.div
              className={`w-6 h-6 rounded-sm border-2 flex items-center justify-center ${isTermsAgreed ? 'bg-cyberGreen border-cyberGreen' : 'border-gray-400'}`}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsTermsAgreed(!isTermsAgreed)}
            >
              {isTermsAgreed && (
                <FaCheck className="text-darkBlue" />
              )}
            </motion.div>
            <span>I agree to the terms and conditions.</span>
          </label>
        </div>

        {/* Buttons for Edit and Confirm */}
        <div className="mt-8 flex justify-between items-center">
          <motion.button 
            onClick={onEdit} 
            whileHover={{ scale: 1.05 }}
            className="px-8 py-3 bg-gray-500 hover:bg-gray-600 rounded-lg font-bold text-lightGray flex items-center gap-2"
          >
            <FiEdit /> Edit Details
          </motion.button>
          <motion.button 
            onClick={isSubmitEnabled ? onSubmit : null} 
            whileHover={{ scale: isSubmitEnabled ? 1.05 : 1 }} 
            className={`px-8 py-3 rounded-lg font-bold text-darkBlue flex items-center gap-2 ${isSubmitEnabled ? 'bg-cyberGreen hover:bg-green-600' : 'bg-gray-400 cursor-not-allowed'}`}
            disabled={!isSubmitEnabled}
          >
            <FiCheckCircle /> Confirm and Submit
          </motion.button>
        </div>
      </motion.div>
        
         {/* QR Code Modal */}
      {showQrModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="bg-white p-8 rounded-lg shadow-lg text-center max-w-sm w-full"
          >
            <button
              onClick={() => setShowQrModal(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <FiX size={24} />
            </button>
            <h2 className="text-2xl font-bold text-cyberGreen mb-4">
              <FaWhatsapp className="inline-block mr-2" />
              WhatsApp Notification Setup
            </h2>
            <p className="text-lg text-gray-600 mb-6">Scan the QR code with WhatsApp to enable notifications.</p>
            <img src={qrCodeImage} alt="QR Code" className="w-48 h-48 mx-auto" />
            <button
              onClick={() => setShowQrModal(false)}
              className="mt-6 px-6 py-2 bg-cyberGreen hover:bg-green-600 text-white font-semibold rounded-lg"
            >
              Close
            </button>
          </motion.div>
        </div>
      )}

    </div>
  );
};

export default ConfirmationPage;
    