import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, MessageSquare, Send, ArrowLeft, Clock, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ContactPage = () => {
  const navigate = useNavigate();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <div className="max-w-7xl mx-auto pb-20 px-4 sm:px-6 lg:px-8">
      {/* Header with Back Button */}
      <div className="flex items-center gap-4 mb-8 pt-4">
        <button 
          onClick={() => navigate(-1)}
          className="p-3 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 hover:scale-110 active:scale-95 transition-all text-slate-600 dark:text-slate-400"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-3xl font-black text-slate-800 dark:text-white tracking-tight">Contact Support</h1>
          <p className="text-sm text-slate-400 font-bold uppercase tracking-widest mt-1">We're here to help you 24/7</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Contact Info Cards */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="lg:col-span-1 space-y-6"
        >
          <motion.div variants={itemVariants} className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/20 group">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center mb-6 transition-transform group-hover:scale-110">
              <Mail className="w-7 h-7 text-blue-600" />
            </div>
            <h3 className="text-xl font-black text-slate-800 dark:text-white mb-2">Email Us</h3>
            <p className="text-sm text-slate-400 font-medium mb-4 italic">Expect a response within 2 hours.</p>
            <p className="text-lg font-black text-blue-600">support@clinicdesk.com</p>
          </motion.div>

          <motion.div variants={itemVariants} className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/20 group">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center mb-6 transition-transform group-hover:scale-110">
              <Phone className="w-7 h-7 text-emerald-600" />
            </div>
            <h3 className="text-xl font-black text-slate-800 dark:text-white mb-2">Call Us</h3>
            <p className="text-sm text-slate-400 font-medium mb-4 italic">Direct line for urgent issues.</p>
            <p className="text-lg font-black text-emerald-600">+91 98765 43210</p>
          </motion.div>

          <motion.div variants={itemVariants} className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/20 group">
            <div className="w-14 h-14 rounded-2xl bg-amber-50 dark:bg-amber-900/30 flex items-center justify-center mb-6 transition-transform group-hover:scale-110">
              <MapPin className="w-7 h-7 text-amber-600" />
            </div>
            <h3 className="text-xl font-black text-slate-800 dark:text-white mb-2">Visit Us</h3>
            <p className="text-sm text-slate-400 font-medium mb-4 italic">Our main medical center.</p>
            <p className="text-slate-600 dark:text-slate-300 font-bold leading-relaxed">
              ClinicDesk Medical Center,<br />Indore, Madhya Pradesh
            </p>
          </motion.div>
        </motion.div>

        {/* Message Form */}
        <motion.div 
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-2"
        >
          <div className="bg-white dark:bg-slate-900 p-10 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-2xl shadow-slate-200/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-10 opacity-5">
               <MessageSquare className="w-64 h-64 rotate-12" />
            </div>
            
            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-10">
                <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center text-white">
                  <MessageSquare className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-black text-slate-800 dark:text-white">Send a Message</h2>
              </div>

              <form className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Your Name</label>
                    <input 
                      type="text" 
                      className="w-full bg-slate-50 dark:bg-slate-800/50 border-2 border-transparent focus:border-blue-600 rounded-2xl px-6 py-4 font-bold text-slate-700 dark:text-white outline-none transition-all"
                      placeholder="Enter your name"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Email Address</label>
                    <input 
                      type="email" 
                      className="w-full bg-slate-50 dark:bg-slate-800/50 border-2 border-transparent focus:border-blue-600 rounded-2xl px-6 py-4 font-bold text-slate-700 dark:text-white outline-none transition-all"
                      placeholder="example@mail.com"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Subject</label>
                  <select className="w-full bg-slate-50 dark:bg-slate-800/50 border-2 border-transparent focus:border-blue-600 rounded-2xl px-6 py-4 font-bold text-slate-700 dark:text-white outline-none appearance-none cursor-pointer">
                    <option>General Inquiry</option>
                    <option>Technical Support</option>
                    <option>Billing Issue</option>
                    <option>Feedback</option>
                  </select>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">How can we help?</label>
                  <textarea 
                    rows="5"
                    className="w-full bg-slate-50 dark:bg-slate-800/50 border-2 border-transparent focus:border-blue-600 rounded-2xl px-6 py-4 font-bold text-slate-700 dark:text-white outline-none transition-all resize-none"
                    placeholder="Describe your issue in detail..."
                  ></textarea>
                </div>

                <button 
                  type="submit"
                  className="bg-blue-600 text-white px-12 py-5 rounded-2xl font-black text-sm shadow-xl shadow-blue-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-3 group"
                >
                  <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  Send Message
                </button>
              </form>
            </div>
          </div>
          
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center gap-4 p-6 bg-blue-50/50 dark:bg-blue-900/10 rounded-[2rem] border border-blue-100 dark:border-blue-800/50">
                  <div className="w-12 h-12 rounded-xl bg-white dark:bg-slate-800 flex items-center justify-center text-blue-600 shadow-sm">
                      <Clock className="w-6 h-6" />
                  </div>
                  <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Response Time</p>
                      <p className="text-sm font-black text-slate-800 dark:text-white">Under 24 Hours</p>
                  </div>
              </div>
              <div className="flex items-center gap-4 p-6 bg-emerald-50/50 dark:bg-emerald-900/10 rounded-[2rem] border border-emerald-100 dark:border-emerald-800/50">
                  <div className="w-12 h-12 rounded-xl bg-white dark:bg-slate-800 flex items-center justify-center text-emerald-600 shadow-sm">
                      <Zap className="w-6 h-6" />
                  </div>
                  <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">System Status</p>
                      <p className="text-sm font-black text-slate-800 dark:text-white">All Systems Operational</p>
                  </div>
              </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ContactPage;
