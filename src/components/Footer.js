import React, { useState, useEffect } from 'react';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaGithub } from 'react-icons/fa';
import logo from "../assets/digipo1.png";
import { useNavigate } from 'react-router-dom';

const Footer = () => {
    const [currentDateTime, setCurrentDateTime] = useState(new Date());
    const navigate = useNavigate();
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentDateTime(new Date());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="bg-blue-900 text-gray-200 p-6">
            <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
                {/* Company Info */}
                <div className="text-center md:text-left">
                    <img src={logo} alt="DiGIPo Logo" className="inline-block mb-2 w-14 h-14 rounded-full " />
                    <h5 className="text-lg font-semibold text-yellow-400">DiGiPo</h5>
                    <p className="text-sm text-gray-400">Content is owned and maintained by DiGiPo IT Services.</p>
                </div>

                {/* Quick Links */}
                <div className="hidden sm:block">
                    <h6 className="text-lg font-semibold text-yellow-400 mb-2">Quick Links</h6>
                    <div className="grid grid-cols-2 gap-1 text-gray-400">
                        {[
                            'Officers Login',
                            'Site Map',
                            'Feedback',
                            'Recruitment',
                            'Crime Prevention',
                            'Privacy Policy',
                            'Disclaimer',
                            'Terms of Use',
                        ].map((link, index) => (
                            <a href="#" key={index} className="hover:text-gray-200 text-sm">
                                {link}
                            </a>
                        ))}
                    </div>
                </div>

                {/* Social Media */}
                <div className="hidden sm:block">
                    <h6 className="text-lg font-semibold text-yellow-400 mb-2">Follow Us</h6>
                    <div className="flex justify-center md:justify-start space-x-4 text-yellow-400">
                        {[
                            { icon: <FaFacebook />, url: 'https://facebook.com' },
                            { icon: <FaTwitter />, url: 'https://twitter.com' },
                            { icon: <FaInstagram />, url: 'https://instagram.com' },
                        ].map((social, index) => (
                            <a href={social.url} target="_blank" rel="noopener noreferrer" key={index} className="text-xl hover:text-white">
                                {social.icon}
                            </a>
                        ))}
                    </div>
                    <p className="text-sm text-gray-400 mt-4">Designed and Developed by DiGiPo IT Services, Chennai</p>
                </div>

                {/* Contact Info */}
                <div className="text-center md:text-left">
                    <h6 className="text-lg font-semibold text-yellow-400 mb-2">Contact Us</h6>
                    <p className="text-sm text-gray-400">digitalpoliceportal@gmail.com</p>
                    <p className="text-sm text-gray-400">+1 234 567 890</p>
                    <p className="text-sm text-yellow-400 font-semibold mt-2">
                        Current Date & Time: <strong>{currentDateTime.toLocaleString()}</strong>
                    </p>
                </div>
            </div>

            {/* Footer Bottom */}
            <div className="border-t border-yellow-400 mt-4 pt-2 text-center text-gray-400 text-sm">
                Best viewed in Firefox (v50.0 & Above), Google Chrome (v37.0 & Above), and Firefox for Android.
            </div>
        </div>
    );
};

export default Footer;
