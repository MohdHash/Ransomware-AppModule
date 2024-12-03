import React from "react";
import { motion } from "framer-motion";
import logo from "../assets/digipo1.png";

// LogoSpinner component accepts a `isPulse` prop to decide the animation type
const LogoSpinner = ({ isPulse }) => {
  return (
    <div className="flex justify-center items-center min-h-screen bg-blue-100">
      <motion.img
        src={logo}
        alt="Loading"
        className="w-40 h-40"
        animate={{
          // Choose animation based on `isPulse` prop
          rotateY: isPulse ? 0 : 360, // No rotation in pulse, rotation in old effect
          scale: isPulse ? [1, 1.1, 1] : [1, 1.2, 1], // Pulse effect or larger scaling for old effect
        }}
        transition={{
          repeat: Infinity, // Pulse loops infinitely, rotation does not
          duration: isPulse ? 1.5 : 2, // Shorter duration for pulse
          ease: "easeInOut",
          times: [0, 0.5, 1], // Pulse timing
        }}
        style={{ transformStyle: "preserve-3d" }} // Keep 3D effect for the old animation
      />
    </div>
  );
};

export default LogoSpinner;
