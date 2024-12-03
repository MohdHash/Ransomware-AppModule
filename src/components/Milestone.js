// Milestone component
import { motion } from "framer-motion";
import { useState } from "react";
import { FiCheckCircle, FiCircle } from "react-icons/fi";

// Define milestones
const milestones = [
    { status: "Complaint Registered", description: "Complaint has been registered" },
    { status: "Verification in Progress", description: "Verification of complaint is ongoing" },
    { status: "Investigation Ongoing", description: "Investigation into the case is ongoing" },
    { status: "Action Taken", description: "Actions are being taken based on findings" },
    { status: "Case Closed", description: "Case has been closed" },
  ];
  
// Milestone component accepts case status as a prop from the parent component and depending on the status , it will render the milestone
const Milestone = ({ currentStatus }) => {
    console.log(currentStatus);
  const [hoveredMilestone, setHoveredMilestone] = useState(null);

  const getStatusIndex = (status) => milestones.findIndex(m => m.status === status);
  const currentMilestoneIndex = getStatusIndex(currentStatus);

  return (
    <div className="flex items-center space-x-4">
      {milestones.map((milestone, index) => (
        <div key={milestone.status} className="relative">
          {/* Milestone Circle */}
          <motion.div
            className={`w-8 h-8 rounded-full flex items-center justify-center
              ${index <= currentMilestoneIndex ? "bg-blue-500" : "bg-gray-300"} 
              cursor-pointer`}
            onHoverStart={() => setHoveredMilestone(milestone.status)}
            onHoverEnd={() => setHoveredMilestone(null)}
          >
            {index <= currentMilestoneIndex ? (
              <FiCheckCircle className="text-white" />
            ) : (
              <FiCircle className="text-white" />
            )}
          </motion.div>

          {/* Milestone Label */}
          <p className={`text-xs mt-1 ${index <= currentMilestoneIndex ? "text-blue-500" : "text-gray-500"}`}>
            {milestone.status}
          </p>

          {/* Hover Details Tooltip */}
          {hoveredMilestone === milestone.status && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
              className="absolute -top-10 left-1/2 transform -translate-x-1/2 w-32 p-2 bg-white border rounded shadow-lg text-center text-xs"
            >
              {milestone.description}
            </motion.div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Milestone;
