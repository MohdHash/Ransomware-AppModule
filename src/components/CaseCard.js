import React from "react";
import { FiCheckCircle, FiXCircle, FiLoader, FiUser, FiAlertTriangle, FiArrowRightCircle } from "react-icons/fi";
//Case card component to be rendered in the view reports page
const CaseCard = ({ complaintId, caseStatus, victimName, onFeedback, onRaiseIssue }) => {
  //complaint id and the other parameters are passed as props
  let statusIcon;
  let statusClass;

  // Determine the icon and background color based on the case status
  switch (caseStatus) {
    case "Complaint Registered":
      statusIcon = <FiArrowRightCircle className="text-xl" />;
      statusClass = "bg-blue-400 text-white";
      break;

    case "Verification in Progress":
      statusIcon = <FiLoader className="animate-spin text-xl" />;
      statusClass = "bg-purple-500 text-white";
      break;

    case "Investigation Ongoing":
      statusIcon = <FiAlertTriangle className="text-xl" />;
      statusClass = "bg-yellow-500 text-white";
      break;

    case "Action Taken":
      statusIcon = <FiCheckCircle className="text-xl" />;
      statusClass = "bg-green-500 text-white";
      break;

    case "Case Closed":
      statusIcon = <FiXCircle className="text-xl" />;
      statusClass = "bg-gray-500 text-white";
      break;

    default:
      statusIcon = <FiLoader className="animate-spin text-xl" />;
      statusClass = "bg-gray-500 text-white";
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-4 transition duration-300 hover:shadow-xl transform">
      <div className="flex flex-wrap justify-between items-center">
        {/* Case ID */}
        <div className="text-lg font-semibold text-darkBlue w-full sm:w-auto">
          Case ID: <span className="font-bold">{complaintId}</span>
        </div>
        {/* Status */}
        <div className={`flex items-center px-4 py-2 rounded-full ${statusClass}`}>
          <span className="mr-2">{statusIcon}</span>
          {caseStatus}
        </div>
      </div>

      {/* Victim Name with React Icon */}
      {victimName && (
        <div className="mt-4 flex items-center text-sm text-gray-700">
          <FiUser className="mr-2 text-darkBlue" />
          <span className="font-medium text-darkBlue">Victim:</span> {victimName}
        </div>
      )}

      {/* Conditional Action Buttons */}
      <div className="mt-4 flex justify-end">
        {caseStatus === "Case Closed" ? (
          <button
            onClick={(e) => {
              e.stopPropagation(); // Prevents the card's onClick from being triggered , EVENT BUBBLING
              onFeedback(); // as I have mentioned , this will trigger the handle function that is passed from the parent component
            }}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-200 w-full sm:w-auto"
          >
            Provide Feedback
          </button>
        ) : (
          <button
            onClick={(e) => {
              e.stopPropagation(); // Prevents the card's onClick from being triggered, EVENT BUBBLING
              onRaiseIssue();//executing the callback that is passed from the parent , thereby triggering the handle function in the parent component
            }}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-200 w-full sm:w-auto"
          >
            Raise an Issue
          </button>
        )}
      </div>
    </div>
  );
};

export default CaseCard;
