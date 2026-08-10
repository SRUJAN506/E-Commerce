import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Send, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    // Mock API call
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      toast.success('Password reset link sent to your email');
    }, 1500);
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center relative overflow-hidden bg-background py-12 px-4 sm:px-6 lg:px-8">
      {/* Animated Background */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <motion.div 
          animate={{ x: [0, 100, 0], y: [0, 50, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-[20%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/10 blur-3xl"
        />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-card/80 backdrop-blur-xl border border-border rounded-3xl p-8 shadow-2xl relative z-10"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-6">
            <Mail size={32} />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Forgot Password?</h1>
          <p className="text-muted-foreground mt-2">
            No worries, we'll send you reset instructions.
          </p>
        </div>

        {!submitted ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground ml-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                <input
                  type="email"
                  className="w-full bg-background border border-border rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  placeholder="you@example.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-primary/25 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <><Send size={18} /> Send Reset Link</>
              )}
            </button>
          </form>
        ) : (
          <div className="text-center bg-primary/5 border border-primary/20 rounded-xl p-6 mb-6">
             <p className="text-sm text-foreground font-medium mb-2">Check your email</p>
             <p className="text-sm text-muted-foreground mb-4">We've sent a password reset link to <br/><strong>{email}</strong></p>
             <button onClick={() => setSubmitted(false)} className="text-sm text-primary font-semibold hover:underline">
               Try another email
             </button>
          </div>
        )}

        <div className="mt-8 text-center text-sm text-muted-foreground">
          <Link to="/login" className="text-muted-foreground hover:text-primary font-medium flex items-center justify-center gap-2 transition-colors">
            <ArrowLeft size={16} /> Back to log in
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default ForgotPasswordPage;
