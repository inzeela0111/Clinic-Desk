import { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { useChangePasswordMutation } from '../services/authApi';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Settings, Moon, Sun, Languages, Lock, CheckCircle2, 
  AlertCircle, Eye, EyeOff, Mail, Bell, Clock, Globe, 
  ShieldCheck, User, Zap, Check, Calendar, Hash, 
  ArrowRight, Shield, Sparkles, ChevronRight
} from 'lucide-react';
import toast from 'react-hot-toast';

const SettingsPage = () => {
  const { t, lang, setLanguage } = useLanguage();
  const { isDark, toggleTheme } = useTheme();
  const { user } = useSelector(state => state.auth);
  const [changePassword, { isLoading: isChanging }] = useChangePasswordMutation();
  const [activeTab, setActiveTab] = useState('general');

  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [showPasswords, setShowPasswords] = useState({
    old: false,
    new: false,
    confirm: false
  });

  const [emailPrefs, setEmailPrefs] = useState({
    reminders: true,
    marketing: false,
    system: true
  });

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      return toast.error(t('passwordMismatch'));
    }
    try {
      await changePassword({
        oldPassword: passwordData.oldPassword,
        newPassword: passwordData.newPassword
      }).unwrap();
      toast.success(t('passwordChangedSuccess'));
      setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      toast.error(err?.data?.message || 'Failed to change password');
    }
  };

  const tabs = [
    { id: 'general', label: t('general'), icon: Settings },
    { id: 'preferences', label: t('preferences'), icon: Zap },
    { id: 'account', label: t('account'), icon: User },
    { id: 'security', label: t('security'), icon: ShieldCheck },
    { id: 'notifications', label: t('notificationsTitle'), icon: Bell },
  ];

  return (
    <div className="max-w-7xl mx-auto pb-20 px-4 sm:px-6 lg:px-8">
      {/* Refined Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden mb-8 p-10 rounded-[2.5rem] bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-2xl shadow-blue-500/20"
      >
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <Settings className="w-64 h-64 rotate-12" />
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-5 mb-6">
             <div className="p-4 bg-white/20 backdrop-blur-xl rounded-[1.5rem] border border-white/30 shadow-xl">
                <Settings className="w-8 h-8 text-white" />
             </div>
             <div>
                <h1 className="text-4xl font-black tracking-tight">{t('settingsTitle')}</h1>
                <p className="text-blue-100 font-bold opacity-80 mt-1">Manage your ClinicDesk preferences</p>
             </div>
          </div>
          
          <div className="flex flex-wrap gap-3">
             <div className="px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400"></div>
                System Active
             </div>
             <div className="px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                <Globe className="w-3.5 h-3.5" />
                {lang === 'en' ? 'Global / EN' : 'Localized / हिन्दी'}
             </div>
          </div>
        </div>
      </motion.div>

      {/* Modern Tabs Navigation */}
      <div className="flex items-center gap-1 mb-10 p-2 bg-white dark:bg-slate-900 shadow-sm rounded-[2rem] overflow-x-auto no-scrollbar border border-slate-100 dark:border-slate-800">
          {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 px-5 sm:px-8 py-4 text-[11px] sm:text-sm font-black transition-all rounded-[1.5rem] relative whitespace-nowrap overflow-hidden group snap-center shrink-0 ${
                  activeTab === tab.id 
                    ? 'text-blue-600 dark:text-blue-400' 
                    : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                }`}
              >
                {activeTab === tab.id && (
                    <motion.div 
                        layoutId="activeTab"
                        className="absolute inset-0 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/50"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                )}
                <tab.icon className={`w-4 h-4 relative z-10 ${activeTab === tab.id ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-600'}`} />
                <span className="relative z-10">{tab.label}</span>
              </button>
          ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="space-y-8"
        >
          
          {/* GENERAL TAB */}
          {activeTab === 'general' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2 space-y-8">
                      <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-10 border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/10">
                          <div className="flex items-center gap-5 mb-10">
                              <div className="w-16 h-16 rounded-[1.5rem] bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center">
                                  <Languages className="w-8 h-8 text-blue-600" />
                              </div>
                              <div>
                                  <h3 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">{t('language')}</h3>
                                  <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Choose your preferred interface language</p>
                              </div>
                          </div>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                              {[
                                { id: 'en', label: 'English', sub: 'Standard Global', code: 'EN' },
                                { id: 'hi', label: 'हिन्दी', sub: 'Indian Regional', code: 'हिं' }
                              ].map((l) => (
                                <button 
                                    key={l.id}
                                    onClick={() => setLanguage(l.id)}
                                    className={`flex items-center justify-between p-8 rounded-[2rem] border-2 transition-all group ${
                                        lang === l.id 
                                        ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-500/5' 
                                        : 'border-slate-50 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 hover:border-blue-200'
                                    }`}
                                  >
                                      <div className="flex items-center gap-6">
                                          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-lg transition-all ${
                                              lang === l.id 
                                              ? 'bg-blue-600 text-white shadow-xl shadow-blue-600/20' 
                                              : 'bg-white dark:bg-slate-700 text-slate-400'
                                          }`}>
                                              {l.code}
                                          </div>
                                          <div className="text-left">
                                              <span className={`block text-xl font-black ${lang === l.id ? 'text-blue-600 dark:text-blue-400' : 'text-slate-800 dark:text-slate-200'}`}>{l.label}</span>
                                              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{l.sub}</span>
                                          </div>
                                      </div>
                                      {lang === l.id && <CheckCircle2 className="w-7 h-7 text-blue-600" />}
                                  </button>
                              ))}
                          </div>
                      </div>
                  </div>

                  <div className="space-y-8">
                     <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[2.5rem] p-10 text-white shadow-2xl shadow-blue-600/20 relative overflow-hidden group">
                        <Sparkles className="absolute top-4 right-4 w-12 h-12 text-white/20 rotate-12 group-hover:scale-125 transition-transform" />
                        <h4 className="text-xl font-black mb-4 tracking-tight">Support Hub</h4>
                        <p className="text-blue-50 text-sm font-medium leading-relaxed mb-6">Having issues? Our team is ready to assist you anytime.</p>
                        
                        <div className="space-y-4 mb-8">
                           <div className="flex items-center gap-3 text-xs font-bold text-white/80">
                              <Mail className="w-4 h-4 text-white" /> support@clinicdesk.com
                           </div>
                           <div className="flex items-center gap-3 text-xs font-bold text-white/80">
                              <Zap className="w-4 h-4 text-white" /> +91 98765 43210
                           </div>
                        </div>

                        <Link 
                          to="/contact"
                          className="block w-full py-5 bg-white text-blue-700 rounded-[1.5rem] text-center font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-600/30 hover:scale-[1.05] active:scale-[0.95] transition-all"
                        >
                            Contact Support
                        </Link>
                     </div>
                  </div>
              </div>
          )}

          {/* PREFERENCES TAB */}
          {activeTab === 'preferences' && (
              <div className="space-y-8">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      {/* Appearance Card */}
                      <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-10 border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/10">
                          <div className="flex items-center gap-5 mb-10">
                              <div className="w-16 h-16 rounded-[1.5rem] bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center">
                                  <Sun className="w-8 h-8 text-blue-600" />
                              </div>
                              <div>
                                  <h3 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">{t('appearance')}</h3>
                                  <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Switch between light and dark themes</p>
                              </div>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-8">
                              {[
                                { id: 'light', icon: Sun, label: t('lightMode'), active: !isDark, onClick: () => isDark && toggleTheme() },
                                { id: 'dark', icon: Moon, label: t('darkMode'), active: isDark, onClick: () => !isDark && toggleTheme() }
                              ].map((item) => (
                                <button 
                                    key={item.id}
                                    onClick={item.onClick}
                                    className={`flex flex-col items-center justify-center gap-6 p-12 rounded-[2.5rem] border-2 transition-all group relative ${
                                        item.active 
                                        ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-500/5' 
                                        : 'border-slate-50 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 hover:border-blue-200'
                                    }`}
                                  >
                                      <div className={`w-24 h-24 rounded-[2rem] flex items-center justify-center transition-all ${item.active ? 'bg-blue-600 text-white shadow-2xl shadow-blue-600/30 scale-110' : 'bg-white dark:bg-slate-700 text-slate-300'}`}>
                                          <item.icon className="w-12 h-12" />
                                      </div>
                                      <span className={`text-lg font-black ${item.active ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400'}`}>{item.label}</span>
                                  </button>
                              ))}
                          </div>
                      </div>

                      {/* System Prefs */}
                      <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-10 border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/10">
                          <div className="flex items-center gap-5 mb-10">
                              <div className="w-16 h-16 rounded-[1.5rem] bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center">
                                  <Globe className="w-8 h-8 text-blue-600" />
                              </div>
                              <div>
                                  <h3 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">System Settings</h3>
                                  <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Regional format and time preferences</p>
                              </div>
                          </div>

                          <div className="space-y-8">
                              <div className="space-y-3">
                                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Time Zone</label>
                                  <div className="relative">
                                      <Clock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-600" />
                                      <select className="w-full bg-slate-50/80 dark:bg-slate-800/50 border-2 border-transparent focus:border-blue-600 rounded-2xl px-14 py-5 font-black text-sm text-slate-700 dark:text-white outline-none appearance-none cursor-pointer">
                                          <option>Asia/Kolkata (IST +5:30)</option>
                                          <option>UTC (GMT +0:00)</option>
                                      </select>
                                      <ChevronRight className="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 rotate-90" />
                                  </div>
                              </div>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                  <div className="space-y-3">
                                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Date Format</label>
                                      <div className="relative">
                                          <Calendar className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-600" />
                                          <select className="w-full bg-slate-50/80 dark:bg-slate-800/50 border-2 border-transparent focus:border-blue-600 rounded-2xl px-12 py-5 font-black text-[11px] text-slate-700 dark:text-white outline-none appearance-none cursor-pointer">
                                              <option>DD/MM/YYYY</option>
                                              <option>MM/DD/YYYY</option>
                                          </select>
                                      </div>
                                  </div>
                                  <div className="space-y-3">
                                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Time Format</label>
                                      <div className="relative">
                                          <Hash className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-600" />
                                          <select className="w-full bg-slate-50/80 dark:bg-slate-800/50 border-2 border-transparent focus:border-blue-600 rounded-2xl px-12 py-5 font-black text-[11px] text-slate-700 dark:text-white outline-none appearance-none cursor-pointer">
                                              <option>12 Hour (AM/PM)</option>
                                              <option>24 Hour</option>
                                          </select>
                                      </div>
                                  </div>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
          )}

          {/* ACCOUNT TAB */}
          {activeTab === 'account' && (
              <div className="bg-white dark:bg-slate-900 rounded-[3rem] p-12 border border-slate-100 dark:border-slate-800 shadow-2xl shadow-slate-200/10 relative overflow-hidden">
                  <div className="flex flex-col md:flex-row items-center gap-12 mb-16">
                      <div className="w-48 h-48 rounded-[3.5rem] bg-gradient-to-br from-blue-600 to-indigo-700 p-1 shadow-2xl shadow-blue-500/30">
                          <div className="w-full h-full rounded-[3.2rem] bg-gradient-to-br from-blue-700 to-indigo-900 flex items-center justify-center text-white text-7xl font-black border-4 border-white/10 shadow-inner">
                              {user?.name?.charAt(0).toUpperCase()}
                          </div>
                      </div>
                      <div className="text-center md:text-left">
                          <h3 className="text-5xl font-black text-slate-800 dark:text-white tracking-tighter mb-3">{user?.name}</h3>
                          <div className="flex items-center justify-center md:justify-start gap-4">
                              <span className="px-5 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs font-black uppercase tracking-widest rounded-full">
                                  {user?.isAdmin ? 'Clinic Administrator' : 'Verified Patient'}
                              </span>
                              <span className="text-slate-400 font-bold flex items-center gap-2">
                                  <Mail className="w-5 h-5" /> {user?.email}
                              </span>
                          </div>
                      </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                      {[
                          { label: 'Display Name', val: user?.name, icon: User },
                          { label: 'Login Email', val: user?.email, icon: Mail },
                          { label: 'Role Access', val: user?.isAdmin ? 'Full Admin' : 'Patient View', icon: ShieldCheck },
                          { label: 'Account Status', val: 'Active', icon: CheckCircle2 }
                      ].map((item, i) => (
                          <div key={i} className="p-8 bg-slate-50 dark:bg-slate-800/50 rounded-[2rem] border border-slate-100 dark:border-slate-800">
                              <item.icon className="w-6 h-6 text-blue-600 mb-5" />
                              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">{item.label}</p>
                              <p className="text-base font-black text-slate-800 dark:text-white">{item.val}</p>
                          </div>
                      ))}
                  </div>
              </div>
          )}

          {/* SECURITY TAB */}
          {activeTab === 'security' && (
              <div className="bg-white dark:bg-slate-900 rounded-[3rem] p-12 border border-slate-100 dark:border-slate-800 shadow-2xl shadow-slate-200/10">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
                      <div className="lg:col-span-2">
                          <div className="flex items-center gap-5 mb-12">
                              <div className="w-16 h-16 rounded-[1.5rem] bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center">
                                  <Lock className="w-8 h-8 text-blue-600" />
                              </div>
                              <div>
                                  <h3 className="text-3xl font-black text-slate-800 dark:text-white tracking-tight">Security Center</h3>
                                  <p className="text-sm text-slate-400 font-bold uppercase tracking-widest">Update your login credentials</p>
                              </div>
                          </div>

                          <form onSubmit={handlePasswordChange} className="space-y-8">
                              <div className="space-y-3">
                                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Current Password</label>
                                  <div className="relative">
                                      <input 
                                        type={showPasswords.old ? "text" : "password"}
                                        value={passwordData.oldPassword}
                                        onChange={(e) => setPasswordData({...passwordData, oldPassword: e.target.value})}
                                        className="w-full bg-slate-50 dark:bg-slate-800/50 border-2 border-transparent focus:border-blue-600 rounded-2xl px-6 py-5 font-bold text-slate-700 dark:text-white outline-none transition-all"
                                        placeholder="••••••••"
                                      />
                                      <button type="button" onClick={() => setShowPasswords({...showPasswords, old: !showPasswords.old})} className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300">
                                          {showPasswords.old ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                      </button>
                                  </div>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                  <div className="space-y-3">
                                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">New Password</label>
                                      <div className="relative">
                                          <input 
                                            type={showPasswords.new ? "text" : "password"}
                                            value={passwordData.newPassword}
                                            onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                                            className="w-full bg-slate-50 dark:bg-slate-800/50 border-2 border-transparent focus:border-blue-600 rounded-2xl px-6 py-5 font-bold text-slate-700 dark:text-white outline-none transition-all"
                                            placeholder="••••••••"
                                          />
                                          <button type="button" onClick={() => setShowPasswords({...showPasswords, new: !showPasswords.new})} className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300">
                                              {showPasswords.new ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                          </button>
                                      </div>
                                  </div>
                                  <div className="space-y-3">
                                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Confirm Password</label>
                                      <div className="relative">
                                          <input 
                                            type={showPasswords.confirm ? "text" : "password"}
                                            value={passwordData.confirmPassword}
                                            onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                                            className="w-full bg-slate-50 dark:bg-slate-800/50 border-2 border-transparent focus:border-blue-600 rounded-2xl px-6 py-5 font-bold text-slate-700 dark:text-white outline-none transition-all"
                                            placeholder="••••••••"
                                          />
                                          <button type="button" onClick={() => setShowPasswords({...showPasswords, confirm: !showPasswords.confirm})} className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300">
                                              {showPasswords.confirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                          </button>
                                      </div>
                                  </div>
                              </div>

                              <button type="submit" className="bg-blue-600 text-white px-14 py-5 rounded-2xl font-black text-sm shadow-2xl shadow-blue-600/30 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-3">
                                  <ShieldCheck className="w-6 h-6" /> Save Security Settings
                              </button>
                          </form>
                      </div>

                      <div className="bg-slate-50 dark:bg-slate-800/60 rounded-[2.5rem] p-10 space-y-10">
                          <h4 className="text-xl font-black text-slate-800 dark:text-white flex items-center gap-3">
                              <Shield className="w-7 h-7 text-blue-600" /> Protection Tips
                          </h4>
                          <div className="space-y-6">
                              {[
                                  'Minimum 8 characters long',
                                  'Include numbers & symbols',
                                  'Different from old passwords',
                                  'Update every 3-6 months'
                              ].map((tip, i) => (
                                  <div key={i} className="flex items-center gap-4">
                                      <div className="w-2.5 h-2.5 rounded-full bg-blue-600"></div>
                                      <span className="text-xs font-black text-slate-500 uppercase tracking-widest">{tip}</span>
                                  </div>
                              ))}
                          </div>
                      </div>
                  </div>
              </div>
          )}

          {/* NOTIFICATIONS TAB */}
          {activeTab === 'notifications' && (
              <div className="bg-white dark:bg-slate-900 rounded-[3rem] p-12 border border-slate-100 dark:border-slate-800 shadow-2xl shadow-slate-200/10 max-w-4xl mx-auto">
                  <div className="flex items-center gap-6 mb-16">
                      <div className="w-20 h-20 rounded-[1.5rem] bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center">
                          <Bell className="w-10 h-10 text-blue-600" />
                      </div>
                      <div>
                          <h3 className="text-3xl font-black text-slate-800 dark:text-white tracking-tight">Notification Center</h3>
                          <p className="text-sm text-slate-400 font-bold uppercase tracking-widest">Manage your alerts and emails</p>
                      </div>
                  </div>

                  <div className="space-y-12">
                      {[
                          { id: 'reminders', label: 'Appointment Reminders', desc: 'Get notified about upcoming bookings', icon: Calendar },
                          { id: 'marketing', label: 'Newsletter & Updates', desc: 'Stay updated with new clinic features', icon: Sparkles },
                          { id: 'system', label: 'Critical Security Alerts', desc: 'Important account and system updates', icon: Shield }
                      ].map((pref) => (
                          <div key={pref.id} className="flex items-center justify-between group">
                              <div className="flex items-center gap-8">
                                  <div className="w-14 h-14 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center transition-all group-hover:scale-110">
                                      <pref.icon className="w-6 h-6 text-blue-600" />
                                  </div>
                                  <div>
                                      <p className="text-xl font-black text-slate-800 dark:text-slate-200">{pref.label}</p>
                                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">{pref.desc}</p>
                                  </div>
                              </div>
                              <button 
                                onClick={() => setEmailPrefs({...emailPrefs, [pref.id]: !emailPrefs[pref.id]})}
                                className={`w-16 h-8 rounded-full transition-all relative ${emailPrefs[pref.id] ? 'bg-blue-600' : 'bg-slate-200 dark:bg-slate-700'}`}
                              >
                                  <motion.div 
                                    animate={{ x: emailPrefs[pref.id] ? 34 : 4 }}
                                    className="absolute top-1 w-6 h-6 bg-white rounded-full shadow-lg" 
                                  />
                              </button>
                          </div>
                      ))}
                  </div>
              </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default SettingsPage;
