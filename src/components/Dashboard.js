// src/components/Dashboard.js
import React , {useState , useEffect , useRef}from "react";
// eslint-disable-next-line
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import axios from 'axios';
import { FiUserPlus, FiEye, FiTrendingUp, FiShield, FiPhoneCall, FiLock,FiMapPin } from "react-icons/fi";
import { FaCheckCircle, FaClock, FaFileAlt, FaHourglassHalf } from 'react-icons/fa';
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { getToken } from "../utils/const";
import { formatDate } from "../utils/formating";
import LogoSpinner from "./LogoSpinner";
import { decryptToken } from "../authUtils";
import { jwtDecode } from "jwt-decode";
import MapSection from "./MapSection";



const COLORS = ["#34D399", "#3B82F6", "#F59E0B"];

// Guidelines and Tips Data
const guidelines = [
  {
    title: "Stay Alert for Phishing Attempts",
    icon: <FiShield />,
    text: "Never click on suspicious links or download attachments from unknown sources.",
  },
  {
    title: "Use Strong Passwords",
    icon: <FiLock />,
    text: "Always create strong passwords with a mix of characters, and avoid using personal information.",
  },
  {
    title: "Enable Two-Factor Authentication",
    icon: <FiUserPlus />,
    text: "Secure your accounts with an additional layer of protection using 2FA wherever possible.",
  },
  {
    title: "Report Suspicious Activity",
    icon: <FiPhoneCall />,
    text: "Contact the cybercrime helpline if you notice any unusual activities on your accounts.",
  },
];

// Trending Threats Data
const trendingThreats = [
  { title: "New Ransomware Attack", description: "Increased attacks targeting small businesses.", severity: "High" },
  { title: "Phishing Scams Rise", description: "Be cautious of email links requesting personal information.", severity: "Moderate" },
  { title: "Data Breaches", description: "Recent breaches impacting sensitive personal data.", severity: "High" },
  { title: "Malware Surge", description: "Growth in malware distributed through fake apps.", severity: "Moderate" },
];

// Slider settings for auto-scrolling
const sliderSettings = {
  dots: false,
  infinite: true,
  speed: 500,
  slidesToShow: 3,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 3000,
  pauseOnHover: true,
  responsive: [
    {
      breakpoint: 768,
      settings: {
        slidesToShow: 1,
      },
    },
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 2,
      },
    },
  ],
};

const Dashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const userUrl = process.env.REACT_APP_USER_API;
  const encryptedToken = getToken();
  const token1 = decryptToken(encryptedToken);
  const decodedToken = jwtDecode(token1);
  const userId = decodedToken["cognito:username"];

  const mapRef = useRef(null);

  // Function to handle smooth scroll to the map section
  const scrollToMap = () => {
    mapRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  };

  const handleNavigation = (path) => { // Enable the pulse effect before navigating
    setLoading(true);
    setTimeout(() => {
      navigate(path); // Navigate after animation
      setLoading(false); // Reset to the old effect
    }, 1500); // Duration of the pulse effect
  };

  const tips = [
    "You're taking a strong step by staying vigilant. Remember, every action you take counts in keeping you safe!",
    "Welcome back! Just a reminder: You’re not alone in this. We're here to help you stay secure every step of the way.",
    "Remember, reporting even the smallest concern can make a big difference. Your vigilance helps keep everyone safer.",
    "Staying informed is the first step in fighting cyber threats. Keep up the great work, and we're here to support you!",
    "You’re doing great! Every precaution you take brings us closer to a safer online world.",
  ];

  // Generate a random tip when the component mounts
  const [tipOfTheDay, setTipOfTheDay] = useState('');
  const [latestComplaints, setLatestComplaints] = useState([]);

  useEffect(() => {
    const randomTip = tips[Math.floor(Math.random() * tips.length)];
    setTipOfTheDay(randomTip);
  }, []);

  useEffect(() => {
    const fetchComplaints = async () => {
      const payload = { userid: userId };
    
      try {
        const response = await axios.post(userUrl, payload, {
          headers: {
            Authorization: `Bearer ${token1}`,
            'Content-Type': 'application/json',
          },
        });
        console.log(response);
    
        const { items } = JSON.parse(response.data.body);
    
        // Filter complaints by categoryid = 13
        const filteredComplaints = items.filter(complaint => complaint.categoryid === 13);
    
        // Sort the filtered complaints by complaintid in descending order
        const sortedComplaints = filteredComplaints.sort((a, b) => b.complaintid - a.complaintid);
    
        // Extract the top 3 latest complaints
        const latestThreeComplaints = sortedComplaints.slice(0, 3);
    
        // Update state
        setLatestComplaints(latestThreeComplaints);
      } catch (error) {
        console.error('Error fetching complaints:', error);
      }
    };

    fetchComplaints();
  }, []);

  // Icons based on the case status
  const getStatusIcon = (status) => {
    switch (status) {
      case "Case Closed":
        return <FaCheckCircle className="text-green-500" />;
      case "Action Taken":
        return <FaFileAlt className="text-blue-500" />;
      case "Investigation Ongoing":
        return <FaHourglassHalf className="text-yellow-500" />;
      case "Complaint Registered":
      default:
        return <FaClock className="text-gray-500" />;
    }
  };

  if(loading){
    return <LogoSpinner isPulse={true}/>; // Show loading spinner during the animation
  }

  return (
    <div className="bg-blue-100 min-h-screen text-primary-text p-16 flex flex-col gap-12 ">

      {/* {loading && <LogoSpinner isPulse={true}/>} */}
      {/* Header */}
      <h1 className="text-4xl font-bold text-heading-color mb-6">Cyber Crime Dashboard</h1>

       {/* Section 2: Case Status Timeline and Navigation Buttons */}
       <div className="flex flex-col md:flex-row gap-10 items-center">
        
        {/* Latest Case Status Timeline */}
        <motion.div
          className="bg-card-bg p-6 rounded-lg shadow-lg w-full"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl font-semibold mb-4 text-heading-color">Latest Case Status Updates</h2>
          
          <div className="space-y-4">
            {latestComplaints.map((complaint) => (
              <motion.div
                key={complaint.complaintid}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="relative pl-10 bg-white p-4 rounded-lg shadow-sm border-l-4 border-blue-500"
              >
                <div className="absolute top-2 left-2">
                  {getStatusIcon(complaint.casestatus)}
                </div>
                <div className="text-gray-700">
                  <h3 className="text-lg font-semibold">
                    {complaint.casestatus}
                  </h3>
                  <p className="text-sm text-gray-600">
                    Victim: {JSON.parse(complaint.individualdetails).victim_name}
                  </p>
                  <p className="text-sm text-gray-600">
                    Incident Date: {formatDate(JSON.parse(complaint.individualdetails).incident_date)}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Navigation Buttons */}
        {/* <motion.div
          className="flex flex-col gap-6"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <button
            onClick={() => handleNavigation('/register-complaint')}
            className="flex items-center bg-highlight-color text-bg-dark px-6 py-3 rounded-full hover:bg-accent-color shadow-md transition duration-300"
          >
            <FiUserPlus className="mr-2" /> Report Cyber Attack
          </button>
          <button
            onClick={() => navigate('/view-reports')}
            className="flex items-center bg-highlight-color text-bg-dark px-6 py-3 rounded-full hover:bg-accent-color shadow-md transition duration-300"
          >
            <FiEye className="mr-2" /> View Cases & Follow up
          </button> */}
          {/* <button
            onClick={() => navigate('/follow-up')}
            className="flex items-center bg-highlight-color text-bg-dark px-6 py-3 rounded-full hover:bg-accent-color shadow-md transition duration-300"
          >
            <FiTrendingUp className="mr-2" /> Follow Up
          </button> */}
        {/* </motion.div> */}

         {/* Cybersecurity Tip of the Day */}
        <motion.div
          className="bg-card-bg p-4 rounded-lg shadow-lg text-center flex flex-col items-center"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h3 className="text-lg text-heading-color font-semibold mb-3">Cybersecurity Tip of the Day</h3>
          <p className="text-sm text-secondary-text font-semibold">{tipOfTheDay}</p>
        </motion.div>
      </div>

      {/* Section 3: Navigation Buttons */}
      <motion.div
        className="flex flex-row gap-6 justify-center"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <button
          onClick={() => handleNavigation('/register-complaint')}
          className="flex items-center bg-highlight-color text-bg-dark px-6 py-3 rounded-full hover:bg-accent-color shadow-md transition duration-300"
        >
          <FiUserPlus className="mr-2" /> Report Cyber Attack
        </button>
        <button
          onClick={() => navigate('/view-reports')}
          className="flex items-center bg-highlight-color text-bg-dark px-6 py-3 rounded-full hover:bg-accent-color shadow-md transition duration-300"
        >
          <FiEye className="mr-2" /> View Cases & Follow up
        </button>
          {/* Nearest Police Stations Button */}
          <button
          onClick={scrollToMap}
          className="flex items-center bg-highlight-color text-bg-dark px-6 py-3 rounded-full hover:bg-accent-color shadow-md transition duration-300"
        >
          <FiMapPin className="mr-2" /> Nearest Police Stations
        </button>
      </motion.div>

      {/* Trending Cyber Threats Section */}
      <div className="mt-10 bg-card-bg p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold text-heading-color mb-4">Trending Cyber Threats</h2>
        <Slider {...sliderSettings}>
          {trendingThreats.map((threat, index) => (
            <div key={index}>
              <motion.div
                className="bg-card-border p-4 rounded-lg shadow-lg"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                whileHover={{ scale: 1.05 }}
              >
                <h3 className="text-xl font-bold text-heading-color">{threat.title}</h3>
                <p className="text-secondary-text mt-2">{threat.description}</p>
                <p className={`mt-2 ${threat.severity === "High" ? "text-red-500" : "text-yellow-500"}`}>
                  Severity: {threat.severity}
                </p>
              </motion.div>
            </div>
          ))}
        </Slider>
      </div>

      {/* Section 3: Guidelines and Tips */}
      <div className="bg-card-bg p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold text-heading-color mb-6">Cybercrime Safety Guidelines</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {guidelines.map((guideline, index) => (
            <motion.div
              key={index}
              className="bg-card-border p-4 rounded-md shadow-md flex gap-4 items-center"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2, duration: 0.5 }}
            >
              <div className="text-heading-color text-3xl">
                {guideline.icon}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-heading-color">{guideline.title}</h3>
                <p className="text-secondary-text text-sm">{guideline.text}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
          


      {/* Consistent Map Section */}
      <div ref={mapRef} className="bg-card-bg p-6 rounded-lg shadow-lg">
        <motion.h2
          className="text-2xl font-semibold text-heading-color mb-6"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Nearest Police Stations
        </motion.h2>

        {/* Map Component Container */}
        <div className="bg-card-border p-4 rounded-md shadow-md relative z-10">
          {/* Map container with a fixed height to avoid breaking */}
          <div className="relative z-10 overflow-hidden" style={{ height: '400px' }}>
            <MapSection />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
