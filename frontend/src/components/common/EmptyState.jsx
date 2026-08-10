import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const EmptyState = ({ 
  icon: Icon, 
  title, 
  description, 
  actionText, 
  actionLink, 
  onActionClick 
}) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center justify-center text-center p-8 max-w-md mx-auto"
    >
      <div className="w-20 h-20 bg-primary/10 text-primary rounded-3xl flex items-center justify-center mb-6 shadow-sm">
        {Icon && <Icon size={36} />}
      </div>
      <h3 className="text-xl font-bold text-foreground mb-2">
        {title}
      </h3>
      <p className="text-sm text-muted-foreground mb-8 leading-relaxed max-w-sm">
        {description}
      </p>

      {actionText && (
        actionLink ? (
          <Link
            to={actionLink}
            className="inline-flex items-center justify-center bg-primary hover:bg-primary/90 text-primary-foreground font-bold px-6 py-3 rounded-xl transition-all shadow-lg shadow-primary/25 hover:shadow-primary/30"
          >
            {actionText}
          </Link>
        ) : (
          <button
            onClick={onActionClick}
            className="inline-flex items-center justify-center bg-primary hover:bg-primary/90 text-primary-foreground font-bold px-6 py-3 rounded-xl transition-all shadow-lg shadow-primary/25 hover:shadow-primary/30 focus:outline-none focus:ring-2 focus:ring-ring"
          >
            {actionText}
          </button>
        )
      )}
    </motion.div>
  );
};

export default EmptyState;
