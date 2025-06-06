import React from 'react';
import { Link } from 'react-router-dom';
import { Github, Mail, Heart } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-white py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">CivicPulse</h3>
            <p className="text-gray-300 mb-4">
              Empowering citizens to report and track local issues for a better community.
            </p>
            <div className="flex space-x-4">
              <a href="#" aria-label="Github" className="text-gray-300 hover:text-white transition-colors">
                <Github size={20} />
              </a>
              <a href="mailto:contact@civicpulse.com" aria-label="Email" className="text-gray-300 hover:text-white transition-colors">
                <Mail size={20} />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-white transition-colors">Map</Link>
              </li>
              <li>
                <Link to="/dashboard" className="text-gray-300 hover:text-white transition-colors">Dashboard</Link>
              </li>
              <li>
                <Link to="/report" className="text-gray-300 hover:text-white transition-colors">Report Issue</Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-300 hover:text-white transition-colors">About Us</Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/help" className="text-gray-300 hover:text-white transition-colors">Help Center</Link>
              </li>
              <li>
                <Link to="/faq" className="text-gray-300 hover:text-white transition-colors">FAQ</Link>
              </li>
              <li>
                <Link to="/privacy" className="text-gray-300 hover:text-white transition-colors">Privacy Policy</Link>
              </li>
              <li>
                <Link to="/terms" className="text-gray-300 hover:text-white transition-colors">Terms of Service</Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-300">© {new Date().getFullYear()} CivicPulse. All rights reserved.</p>
          <div className="mt-4 md:mt-0 flex items-center text-gray-300">
            <span>Made with</span>
            <Heart size={16} className="mx-1 text-red-500" />
            <span>for better communities</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;