import React, { useState } from "react";
import { motion } from "framer-motion";
import { FiPlusCircle } from "react-icons/fi";
import { FaChevronDown } from 'react-icons/fa';
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { toast } from 'react-toastify';
import ConfirmationPage from "./ConfirmationPage";
import qrpic from '../assets/qr.jpeg';
import { getToken } from "../utils/const";
import { assignPolice,updateAssignedCases } from "../utils/assignPolice";
import { useNavigate } from "react-router-dom";
import { sendComplaintMail } from "../service/sendEmail";
import { decryptToken } from "../authUtils";
import {sendSMS,sendWhatsappMsg} from '../service/sendNotification';

const RegisterComplaint = () => {
  const [evidenceFiles, setEvidenceFiles] = useState([{}]);
  const [currentStep, setCurrentStep] = useState(1); // Track current step in the form
  const [showConfirmation, setShowConfirmation] = useState(false);
  // Step 1: Case Details
  const [victimName, setVictimName] = useState("self");
  const [victimNameOther, setVictimNameOther] = useState(""); // For 'other' option
  const [incidentDate, setIncidentDate] = useState("");
  const [description, setDescription] = useState("");
  const [ransomwareType, setRansomwareType] = useState("");
  const [ransomAmount, setRansomAmount] = useState("");

  // Step 2: Complainant Details
  const [complainantName, setComplainantName] = useState("");
  // eslint-disable-next-line
  const [complainantContact, setComplainantContact] = useState("");
  // eslint-disable-next-line
  const [complainantEmail, setComplainantEmail] = useState("");

  const [errors, setErrors] = useState({});

  const[isNotificationneeded , setIsNotificationneeded] = useState(false);

  const [customType, setCustomType] = useState('');
  const [isOtherSelected, setIsOtherSelected] = useState(false);
  const ransomwareOptions = [
    'Double Extortion',
    'Triple Extortion',
    'Locker Ransomware',
    'Crypto Ransomware',
    'Wiper',
    'Ransomware as a Service (RaaS)',
    'Data-Stealing Ransomware',
    'Other',
  ];
  
  const compaintUrl = process.env.REACT_APP_COMPLAINT_API;
  const uploadUrl = process.env.REACT_APP_UPLOAD_API;
  const encryptedToken = getToken();
  const token1 = decryptToken(encryptedToken);

  const handleRansomwareTypeChange = (event) => {
    const selectedType = event.target.value;
    setRansomwareType(selectedType);
    setIsOtherSelected(selectedType === 'Other');
    if (selectedType !== 'Other') {
      setCustomType(''); // Clear custom input if not "Other"
    }
  };

  const handleNotificationPreference = (preference) => {
    setIsNotificationneeded(preference);
    console.log("Notification Preference" , preference);
  }


  const navigate = useNavigate();
  const decodedToken = jwtDecode(token1);
  console.log(decodedToken);
  // console.log(decodedToken["cognito:username"]);
  const userId = decodedToken["cognito:username"];
  const phoneNumber = decodedToken["phone_number"];
  console.log(phoneNumber);
  const email = decodedToken["email"];
  const fullName = decodedToken["name"];
  console.log(userId);

    // Go to the confirmation page
    const goToConfirmation = () => {
      setShowConfirmation(true);
    };
  
    // Go back to the form for editing
    const handleEdit = () => {
      setShowConfirmation(false);
    };

    const validateName = (name) => /^[A-Za-z\s]+$/.test(name);



  const addEvidenceField = () => {
    setEvidenceFiles([...evidenceFiles, {}]);
  };

  const nextStep = (e) => {
    e.preventDefault();

    let valid = true;
    const newErrors = {};

    // Step 1 validation
    if (currentStep === 1) {
      setComplainantContact(phoneNumber);
      setComplainantEmail(email);
        if (!victimName) {
            newErrors.victimName = "Victim name is required";
            valid = false;
        }
        if (victimName === "other") {
            if (!victimNameOther) {
                newErrors.victimNameOther = "Victim's name is required";
                valid = false;
            } else if (!validateName(victimNameOther)) {
                newErrors.victimNameOther = "Victim's name must contain only letters";
                valid = false;
            }
        }
        if (!incidentDate) {
          newErrors.incidentDate = "Incident date is required";
          valid = false;
      } else {
          const selectedDate = new Date(incidentDate);
          const currentDate = new Date();
          const selectedYear = selectedDate.getFullYear();
          const maxYear = currentDate.getFullYear() + 1; // Allow for a 1-year buffer if necessary
      
          if (selectedDate > currentDate) {
              newErrors.incidentDate = "Incident date cannot be in the future";
              valid = false;
          } else if (selectedYear > maxYear) {
              newErrors.incidentDate = `Incident date cannot have a year beyond ${maxYear}`;
              valid = false;
          }
      }

        if (!description) {
            newErrors.description = "Description is required";
            valid = false;
        }
        if (!ransomwareType) {
            newErrors.ransomwareType = "Ransomware type is required";
            valid = false;
        }
        // if (!ransomAmount) {
        //     newErrors.ransomAmount = "Ransom amount is required";
        //     valid = false;
        // }
    }

    // Step 2 validation
    if (currentStep === 2) {
        // if (!complainantName) {
        //     newErrors.complainantName = "Complainant name is required";
        //     valid = false;
        // } else if (!validateName(complainantName)) {
        //     newErrors.complainantName = "Complainant's name must contain only letters";
        //     valid = false;
        // }
        if (!complainantContact) {
            newErrors.complainantContact = "Complainant contact is required";
            valid = false;
        }
        if (!complainantEmail) {
            newErrors.complainantEmail = "Complainant email is required";
            valid = false;
        }
    }

    // Step 3 validation - At least one evidence file should be uploaded
    if (currentStep === 3) {
        if (evidenceFiles.length === 0) {
            newErrors.evidenceFiles = "At least one evidence file is required";
            valid = false;
        }
    }

    // Set errors if any
    setErrors(newErrors);

    // Proceed to the next step if there are no validation errors
    if (valid) {
        setCurrentStep(currentStep + 1);
    }
};


  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

   // Function to request a pre-signed URL for file upload
   const getPreSignedUrl = async (file, folderName) => {
    try {
      const formData = {
        body: {
          folderName,
          fileName: file.name,
          fileType: file.type,
          isEvidence: true,
        },
      };

      const response = await axios.post(uploadUrl, formData);
      console.log(JSON.parse(response.data.body));// Assuming your API returns the pre-signed URL
      const {url} = JSON.parse(response.data.body);
      console.log(url);
      return url; // Return the pre-signed URL for the file upload
    } catch (error) {
      console.error("Error getting pre-signed URL:", error);
      return null;
    }
  };

  // Function to upload file using pre-signed URL
  const uploadFileToS3 = async (file, preSignedUrl) => {
    try {
      const response = await axios.put(preSignedUrl, file, {
        headers: {
          "Content-Type": file.type,
        },
      });

      if (response.status === 200) {
        console.log("File uploaded successfully!");
      }
    } catch (error) {
      console.error("Error uploading file to S3:", error);
    }
  };

  // Function to handle file upload process
  const uploadEvidenceFiles = async (complaintid) => {
    console.log(complaintid);
    try {
      //the evidence files are looped and the presigned url is fetched and used to upload to the S3.
      for (let i = 0; i < evidenceFiles.length; i++) {
        const file = evidenceFiles[i];
        const folderName = complaintid.toString(); 

        // Get pre-signed URL from the backend
        const preSignedUrl = await getPreSignedUrl(file, folderName);
        if (preSignedUrl) {
          // Upload the file using the pre-signed URL
          await uploadFileToS3(file, preSignedUrl);
        }
      }
    } catch (error) {
      console.error("Error during file upload process:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent form from reloading the page
    const caseAppliedTime = new Date().toISOString(); // the case applied time is initialised

    const assignedOfficer = await assignPolice(); // ( Assign Police file is defined in ./utils/assingPolice.js)
    if (!assignedOfficer) {
      alert("No suitable police officer is available for assignment.");
      return;
  }
   
    // Prepare the form data
    const formData = {
      categoryid: 13,
      userid: userId,
      policeid: assignedOfficer.personid,
      reasonforwithdrawal: null,
      iswithdrawalaccepted: 0,
      iswithdrawn: 0,
      iscomplaintaccepted: 1,
      casestatus: "Complaint Registered",
      isfirfiled: 0,
      isfake:0,
      individualdetails: JSON.stringify({
        victim_name: victimName === "self" ? "Self" : victimNameOther,
        incident_date: incidentDate,
        description: description,
        incident_description:description,
        ransomware_type: ransomwareType,
        ransom_amount: ransomAmount,
        complainant_name: fullName,
        complainantName:fullName,
        complainant_contact: phoneNumber,
        complainant_email: email,
        victim_email:email,
        caseappliedtime: caseAppliedTime,
      }),
    };
  
    await assignPolice();
    
  
    try {
      // Use `await` for the axios POST request to ensure it completes before moving on
      const response = await axios.post(
        compaintUrl,
        formData,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token1}`, // Adding the Bearer token here
          },
        }
      );
  
      console.log('Success:', response.data);
      const { data } = JSON.parse(response.data.body);
      const complaintid = data.complaintid;
      console.log('Complaint ID:', complaintid);

      toast.success("Case registered ! Awaiting Approval...");
  
      // Call uploadEvidenceFiles only after complaintid is retrieved
      await uploadEvidenceFiles(complaintid);

      await updateAssignedCases(assignedOfficer);

      const complaintDetails = {
        complaintId: complaintid, // Unique ID for the complaint, ideally autogenerated
        victimName: victimName, // "self" or value from victimNameOther if "other" is selected
        victimNameOther: victimNameOther || "", // Specific name if victim is "other"
        incidentDate: incidentDate || new Date().toLocaleDateString(), // Date of the incident, defaulting to today
        description: description, // Detailed description of the ransomware incident
        ransomwareType: ransomwareType, // Type of ransomware, e.g., "Trojan", "WannaCry", etc.
        ransomAmount: ransomAmount, // Ransom amount demanded, if available
        complainantName: fullName, // Name of the person filing the complaint
        complainantContact: phoneNumber, // Contact number of the complainant
        complainantEmail: email, // Email address of the complainant
        isFIRFiled: false, // Boolean to indicate if an FIR has been filed
        caseStatus: "Complaint Registered", // Status of the case, can be "Pending", "Closed", etc.
      };

      await sendComplaintMail(complaintDetails); // this function is defined in ( ./service/sendEmail.js)
      {isNotificationneeded && await sendSMS(phoneNumber)}; //this function is defined in ( ./service/sendEmail.js)
      {isNotificationneeded && await sendWhatsappMsg(phoneNumber)}//this function is defined in ( ./service/sendEmail.js)

      setTimeout(()=>{ // navigate to the dashboard after registering the complaint
        navigate('/dashboard');
      },3000);
      
    } catch (error) {
      console.error('Error:', error);

      toast.error("Error registering case. Please try again.")
      // Handle error (e.g., show an error message)
    }
  };
  

  

  // Step labels for breadcrumbs
  const steps = ["Case Details", "Complainant Details", "Evidence Upload"];

  return (
    <div className="bg-card-bg min-h-screen text-lightGray p-16 scroll-smooth flex flex-col lg:flex-row">
      {showConfirmation ? (
      <ConfirmationPage
        victimName={victimName}
        victimNameOther={victimNameOther}
        incidentDate={incidentDate}
        description={description}
        ransomwareType={ransomwareType}
        ransomAmount={ransomAmount}
        complainantName={fullName}
        complainantContact={phoneNumber}
        complainantEmail={email}
        evidenceFiles={evidenceFiles}
        onEdit={handleEdit}
        onSubmit={handleSubmit}
        onNotificationChange={handleNotificationPreference}
        qrCodeImage={qrpic}
      />
    ) : (
      <div className="lg:w-3/4 lg:pr-6 flex flex-col w-full">
        {/* Progress Flow (Breadcrumb) */}
        <div className="hidden md:flex justify-center space-x-2 lg:space-x-4 mb-6 text-sm lg:text-base">
          {steps.map((step, index) => (
            <div
              key={index}
              className={`${
                currentStep === index + 1 ? "text-heading-color" : "text-secondary-text"
              } font-bold`}
            >
              <span className="text-sm lg:text-lg">{step}</span>
              {index < steps.length - 1 && <span className="mx-1 lg:mx-2">→</span>}
            </div>
          ))}
        </div>

        {/* Registration Form */}
        <h1 className="text-2xl lg:text-4xl font-bold  mb-6 text-heading-color">
          Register Cyber Crime Complaint
        </h1>

        <form onSubmit={handleSubmit} className=" bg-white text-primary-text  p-4 lg:p-6 rounded-lg shadow-lg space-y-6 text-left">
          {/* Step 1: Case Details */}
          {currentStep === 1 && (
            <>
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="mb-4"
              >
                <label className="text-sm lg:text-lg">Victim Name:</label>
                <select
                  value={victimName}
                  onChange={(e) => setVictimName(e.target.value)} 
                  className="w-full p-2 bg-white rounded-md text-gray-700 border border-blue-500"
                >
                  <option value="self">Self</option>
                  <option value="other">Other</option>
                </select>
              </motion.div>
              
              {victimName === "other" && (
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.7 }}
                  className="mb-4"
                >
                  <label className="text-sm lg:text-lg">Enter Victim's Name:</label>
                  <input
                    type="text"
                    value={victimNameOther}
                    onChange={(e) => setVictimNameOther(e.target.value)}
                    className="w-full p-2  rounded-md  border  bg-white text-gray-700 border-blue-500"
                    placeholder="Enter victim's name"
                  />
                  {errors.victimNameOther && (
                <p className="text-red-500 text-sm">{errors.victimNameOther}</p>
                  )}
                </motion.div>
              )}

              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7 }}
                className="mb-4"
              >
                <label className="text-sm lg:text-lg">Incident Date:</label>
                <input
                  type="datetime-local"
                  value={incidentDate}
                  onChange={(e) => setIncidentDate(e.target.value)}
                  className="w-full p-2 rounded-md  border  bg-white text-gray-700 border-blue-500"
                  required
                />
                {errors.incidentDate && (
                <p className="text-red-500 text-sm">{errors.incidentDate}</p>
                  )}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="mb-4"
              >
                <label className="text-sm lg:text-lg">Description:</label>
                <textarea
                  rows="4"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-2  rounded-md  border  bg-white text-gray-700 border-blue-500"
                  placeholder="Describe the incident in detail."
                  required
                />
                 {errors.description && (
                <p className="text-red-500 text-sm">{errors.description}</p>
                  )}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.9 }}
                className="mb-4"
              >
                <label className="text-sm lg:text-lg  mb-2 block">
                  Ransomware Type:
                </label>
                
                {/* Dropdown Selector */}
                <div className="relative">
                  <select
                    value={ransomwareType}
                    onChange={handleRansomwareTypeChange}
                    className="w-full p-2  rounded-md  border  appearance-none bg-white text-gray-700 border-blue-500"
                    style={{ paddingRight: '2rem' }}
                  >
                    <option value="" disabled>
                      Select a ransomware type
                    </option>
                    {ransomwareOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                  {/* Dropdown Icon */}
                  <FaChevronDown className="absolute top-3 right-3 text-primary-text pointer-events-none" />
                </div>

                {/* Custom Input for "Other" option */}
                {isOtherSelected && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="mt-4"
                  >
                    <input
                      type="text"
                      value={customType}
                      onChange={(e) => setCustomType(e.target.value)}
                      className="w-full p-2  rounded-md  border  bg-white text-gray-700 border-blue-500"
                      placeholder="Specify other ransomware type"
                      required
                    />
                  </motion.div>
                )}

                {errors.ransomwareType && (
                <p className="text-red-500 text-sm">{errors.ransomwareType}</p>
                  )}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1 }}
                className="mb-4"
              >
                <label className="text-sm lg:text-lg">Ransom Amount:</label>
                <input
                  type="number"
                  value={ransomAmount}
                  onChange={(e) => setRansomAmount(e.target.value)}
                  className="w-full p-2  rounded-md  border  bg-white text-gray-700 border-blue-500"
                  placeholder="Amount demanded by attackers"
                  required
                  min='1'
                />
              </motion.div>
            </>
          )}

          {/* Step 2: Complainant Details */}
          {currentStep === 2 && (
            <>
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="mb-4"
              >
                <label className="text-lg">Complainant Name:</label>
                <input
                  type="text"
                  value={fullName}
                  readOnly
                  onChange={(e) => setComplainantName(fullName)}
                  className="w-full p-2  rounded-md  border  bg-white text-gray-700 border-blue-500"
                  placeholder="Enter complainant's name"
                  required
                />
                {errors.complainantName && (
                <p className="text-red-500 text-sm">{errors.complainantName}</p>
              )}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7 }}
                className="mb-4"
              >
                <label className="text-lg">Complainant Contact:</label>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setComplainantContact(phoneNumber)}
                  className="w-full p-2  rounded-md  border  bg-white text-gray-700 border-blue-500"
                  placeholder="Enter complainant's contact"
                  required
                  pattern="^\d{10}$"
                  title="Enter a valid 10-digit phone number"
                />
               {errors.complainantContact && (
                <p className="text-red-500 text-sm">{errors.complainantContact}</p>
              )}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="mb-4"
              >
                <label className="text-lg">Complainant Email:</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setComplainantEmail(email)}
                  className="w-full p-2  rounded-md  border  bg-white text-gray-700 border-blue-500"
                  placeholder="Enter complainant's email"
                  required
                />
                 {errors.complainantEmail && (
                <p className="text-red-500 text-sm">{errors.complainantEmail}</p>
              )}
              </motion.div>
            </>
          )}

          {/* Step 3: Evidence Upload */}
          {currentStep === 3 && (
            <>
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.9 }}
                className="mb-4"
              >
                <label className="text-lg">Upload Evidence:</label>
                {evidenceFiles.map((file, index) => (
                  <div key={index} className="mb-2">
                    <input
                      type="file"
                      onChange={(e) => {
                        const newFiles = [...evidenceFiles];
                        newFiles[index] = e.target.files[0];
                        setEvidenceFiles(newFiles);
                      }}
                      className="p-2  rounded-md  border  bg-white text-gray-700 border-blue-500"
                    />
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addEvidenceField}
                  className="flex items-center space-x-2 text-cyberGreen"
                >
                  <FiPlusCircle />
                  <span>Add another file</span>
                </button>
              </motion.div>
            </>
          )}

          {/* Buttons */}
          <div className="flex justify-between mt-6">
            {currentStep > 1 && (
              <button
                type="button"
                onClick={prevStep}
                className="py-2 px-4 bg-cyberGreen text-darkBlue rounded-md"
              >
                Previous
              </button>
            )}
            {currentStep < 3 ? (
              <button
                type="button"
                onClick={nextStep}
                className="py-2 px-4 bg-cyberGreen text-darkBlue rounded-md"
              >
                Next
              </button>
            ) : (
              <button
                type="submit"
                onClick={goToConfirmation}
                className="py-2 px-4 bg-cyberGreen text-darkBlue rounded-md"
              >
                Review & Confirm
              </button>
            )}
          </div>
        </form>
      </div>
    )}
  </div>
);
  
};

export default RegisterComplaint;



