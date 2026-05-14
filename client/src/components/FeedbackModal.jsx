import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, MessageSquare, Send, X, Sparkles, CheckCircle2 } from 'lucide-react';
import { useSubmitFeedbackMutation } from '../services/appointmentsApi';
import toast from 'react-hot-toast';

const FeedbackModal = ({ appointment, onClose }) => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submitFeedback, { isLoading }] = useSubmitFeedbackMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) return toast.error('Please select a rating');
    
    try {
      await submitFeedback({
        id: appointment._id,
        rating,
        feedback: message
      }).unwrap();
      
      setSubmitted(true);
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (err) {
      toast.error(err?.data?.message || 'Failed to submit feedback');
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-[3rem] shadow-2xl shadow-blue-500/20 overflow-hidden border border-white/20"
        >
          {/* Header Background */}
          <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-br from-blue-600 to-indigo-700 opacity-10"></div>
          
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 p-2 bg-white dark:bg-slate-800 rounded-full shadow-lg text-slate-400 hover:text-slate-600 dark:hover:text-white transition-all z-10"
          >
            <X className="w-5 h-5" />
          </button>

          {!submitted ? (
            <div className="p-10 pt-12 relative z-10">
              <div className="text-center mb-10">
                <div className="w-20 h-20 bg-blue-600 rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-xl shadow-blue-500/30">
                  <Sparkles className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-3xl font-black text-slate-800 dark:text-white tracking-tight">How was your session?</h2>
                <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mt-2">Appointment with Dr. {appointment?.doctorId?.name}</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Star Rating */}
                <div className="flex justify-center gap-3">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <motion.button
                      key={star}
                      type="button"
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHover(star)}
                      onMouseLeave={() => setHover(0)}
                      className="focus:outline-none"
                    >
                      <Star 
                        className={`w-10 h-10 transition-colors ${
                          star <= (hover || rating) 
                            ? 'fill-amber-400 text-amber-400' 
                            : 'text-slate-200 dark:text-slate-700'
                        }`} 
                      />
                    </motion.button>
                  ))}
                </div>

                {/* Feedback Textarea */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 ml-1 text-slate-400">
                    <MessageSquare className="w-4 h-4" />
                    <label className="text-[10px] font-black uppercase tracking-widest">Share your thoughts</label>
                  </div>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800/50 border-2 border-transparent focus:border-blue-600 rounded-[1.5rem] p-5 font-bold text-slate-700 dark:text-white outline-none transition-all resize-none h-32"
                    placeholder="What did you like or what can we improve?"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-blue-600 text-white py-5 rounded-[1.5rem] font-black text-sm uppercase tracking-widest shadow-xl shadow-blue-600/30 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                >
                  {isLoading ? 'Submitting...' : (
                    <>
                      <Send className="w-5 h-5" /> Submit Feedback
                    </>
                  )}
                </button>
              </form>
            </div>
          ) : (
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-20 text-center"
            >
              <div className="w-24 h-24 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl shadow-emerald-500/30">
                <CheckCircle2 className="w-12 h-12 text-white" />
              </div>
              <h2 className="text-3xl font-black text-slate-800 dark:text-white tracking-tight mb-3">Thank You!</h2>
              <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Your feedback helps us improve.</p>
            </motion.div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default FeedbackModal;
