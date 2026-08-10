import React from 'react';
import { Link } from 'react-router-dom';
import { HelpCircle, Home, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

const NotFoundPage = () => {
  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-background px-4 text-left">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md bg-card border border-border rounded-[2.5rem] p-8 md:p-12 text-center shadow-xl space-y-6"
      >
        <div className="w-20 h-20 bg-primary/10 text-primary rounded-3xl flex items-center justify-center mx-auto shadow-sm">
          <HelpCircle size={36} />
        </div>
        
        <div className="space-y-2">
          <h1 className="text-6xl font-black text-primary font-mono tracking-widest">404</h1>
          <h2 className="text-xl font-bold text-foreground">Page Not Found</h2>
          <p className="text-xs text-muted-foreground leading-relaxed max-w-xs mx-auto">
            The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-4 justify-center">
          <button 
            onClick={() => window.history.back()} 
            className="flex-1 border border-border hover:bg-muted text-foreground font-bold px-5 py-3 rounded-xl text-xs flex items-center justify-center gap-1.5 focus:outline-none transition-colors"
          >
            <ArrowLeft size={14} /> Go Back
          </button>
          <Link 
            to="/" 
            className="flex-1 bg-primary hover:bg-primary/95 text-primary-foreground font-bold px-5 py-3 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-md shadow-primary/20 transition-all"
          >
            <Home size={14} /> Back Home
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default NotFoundPage;
