
import { Mail, BookOpen } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-bold text-white text-lg mb-4">Dr. Thoufeeq Rahman Vazhakkat</h3>
            <p className="text-sm leading-relaxed">
              Assistant Professor in Arabic, specializing in Arabic Language and Literature 
              with over 12 years of teaching experience.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold text-white mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/about" className="hover:text-white transition-colors">About</Link>
              </li>
              <li>
                <Link to="/publications" className="hover:text-white transition-colors">Publications</Link>
              </li>
              <li>
                <Link to="/awards" className="hover:text-white transition-colors">Awards</Link>
              </li>
              <li>
                <Link to="/blog" className="hover:text-white transition-colors">Blog</Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-white mb-4">Contact</h4>
            <div className="space-y-3 text-sm">
              <a 
                href="mailto:thoufimry1@gmail.com" 
                className="flex items-center gap-2 hover:text-white transition-colors"
              >
                <Mail className="h-4 w-4" />
                thoufimry1@gmail.com
              </a>
              <a 
                href="/resume.pdf" 
                download
                className="flex items-center gap-2 hover:text-white transition-colors"
              >
                <BookOpen className="h-4 w-4" />
                Download Resume
              </a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-slate-700 mt-8 pt-6 text-center text-sm">
          <p>&copy; 2025 Afonex. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
