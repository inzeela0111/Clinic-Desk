import React, { useState } from 'react';
import { useGetDoctorsQuery, useGetPublicStatsQuery } from '../services/doctorsApi';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';

import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Stethoscope, Menu, X, ArrowRight, Brain, CalendarCheck, ShieldCheck, UserCheck, Star, CheckCircle, Search, Clock, Sparkles, Moon, Sun, Globe } from 'lucide-react';

const fade = { hidden:{opacity:0,y:24}, show:{opacity:1,y:0,transition:{duration:0.55}} };
const stagger = { show:{transition:{staggerChildren:0.13}} };

export default function LandingPage() {
  const [open,setOpen] = useState(false);
  const [sym,setSym] = useState('');
  const { isDark, toggleTheme } = useTheme();
  const { t, lang, setLanguage } = useLanguage();
  const toggleLanguage = () => setLanguage(lang === 'en' ? 'hi' : 'en');
  
  // Dynamic Stats
  const { data: doctorsData } = useGetDoctorsQuery({});
  const doctorCount = Array.isArray(doctorsData) ? doctorsData.length : (doctorsData?.data?.length || 0);
  
  // Format Doctors Count (original data as requested)
  const displayDoctors = doctorCount;

  // Format Patients Count
  const displayPatients = "500+";

  const scroll = id => { document.getElementById(id)?.scrollIntoView({behavior:'smooth'}); setOpen(false); };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">

      {/* NAV */}
      <nav className="sticky top-0 z-50 border-b border-slate-200 bg-blue-50/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
              <Stethoscope className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-extrabold text-blue-600">ClinicDesk</span>
          </Link>
          <div className="hidden md:flex gap-8 text-sm font-medium text-slate-600">
            <Link to="/" className="text-blue-600 font-semibold">{t('home')}</Link>
            <Link to="/doctors-public" className="hover:text-blue-600 transition">{t('findDoctor')}</Link>
            <button onClick={()=>scroll('how-it-works')} className="hover:text-blue-600 transition">{t('howItWorks')}</button>
            <button onClick={()=>scroll('about')} className="hover:text-blue-600 transition">{t('about')}</button>
          </div>
          <div className="hidden md:flex items-center gap-4">
            <div className="flex items-center gap-1 border-r border-slate-200 pr-4">
              <button onClick={toggleLanguage} className="flex items-center gap-1 p-2 rounded-xl hover:bg-slate-200/50 text-slate-600 transition text-xs font-bold" aria-label="Toggle Language">
                <Globe className="w-4 h-4" /> {lang === 'en' ? 'EN' : 'हिंदी'}
              </button>
              <button onClick={toggleTheme} className="p-2 rounded-xl hover:bg-slate-200/50 text-slate-600 transition" aria-label="Toggle Theme">
                {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
            </div>
            <Link to="/login" className="text-sm text-slate-600 hover:text-blue-600 transition">{t('login')}</Link>
            <Link to="/register" className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold px-5 py-2.5 rounded-lg shadow-lg shadow-blue-500/20 transition">{t('getStarted')}</Link>
          </div>
          <div className="md:hidden flex items-center gap-3">
            <button onClick={toggleLanguage} className="flex items-center gap-1 p-2 text-slate-600 text-xs font-bold" aria-label="Toggle Language">
              <Globe className="w-4 h-4" /> {lang === 'en' ? 'EN' : 'हिंदी'}
            </button>
            <button onClick={toggleTheme} className="p-2 text-slate-600" aria-label="Toggle Theme">
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button className="text-slate-600" onClick={()=>setOpen(!open)}>
              {open?<X className="w-6 h-6"/>:<Menu className="w-6 h-6"/>}
            </button>
          </div>
        </div>
        {open&&(
          <div className="md:hidden bg-white border-t border-slate-200 px-6 py-5 flex flex-col gap-4 shadow-xl">
            <Link to="/" onClick={()=>setOpen(false)} className="text-blue-600 font-semibold">{t('home')}</Link>
            <Link to="/doctors-public" onClick={()=>setOpen(false)} className="text-slate-600">{t('findDoctor')}</Link>
            <button onClick={()=>scroll('how-it-works')} className="text-left text-slate-600">{t('howItWorks')}</button>
            <button onClick={()=>scroll('about')} className="text-left text-slate-600">{t('about')}</button>
            <hr className="border-slate-200"/>
            <Link to="/login" onClick={()=>setOpen(false)} className="text-slate-600">{t('login')}</Link>
            <Link to="/register" onClick={()=>setOpen(false)} className="bg-blue-600 text-white text-center py-3 rounded-xl font-bold">{t('getStarted')}</Link>
          </div>
        )}
      </nav>

      {/* HERO */}
      <section className="max-w-7xl mx-auto px-6 pt-8 pb-20 md:pt-16 md:pb-28 flex flex-col md:flex-row items-center gap-14">
        <motion.div className="flex-1 max-w-xl" initial="hidden" animate="show" variants={stagger}>
          <motion.span variants={fade} className="inline-block bg-blue-100 border border-blue-200 text-blue-700 text-xs font-bold tracking-widest uppercase px-4 py-2 rounded-full mb-6">{t('smartHealthcareSolutions')}</motion.span>
          <motion.h1 variants={fade} className="text-5xl md:text-6xl font-extrabold leading-tight mb-6 text-slate-900">
            {t('heroTitle1')}<br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">{t('heroTitle2')}</span>
          </motion.h1>
          <motion.p variants={fade} className="text-slate-600 text-lg leading-relaxed mb-10">{t('heroSubtext')}</motion.p>
          <motion.div variants={fade} className="flex flex-wrap gap-4">
            <Link to="/doctors-public" className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-7 py-3.5 rounded-xl shadow-lg shadow-blue-500/20 transition">{t('bookAppointment')} <ArrowRight className="w-5 h-5"/></Link>
            <button onClick={()=>scroll('symptom-checker')} className="border border-blue-400 hover:border-blue-600 hover:text-blue-600 hover:bg-blue-50 text-slate-700 font-bold px-7 py-3.5 rounded-xl bg-white transition shadow-sm">{t('trySymptomChecker')}</button>
          </motion.div>
        </motion.div>
        <motion.div 
          initial={{ opacity: 0, x: 20 }} 
          animate={{ opacity: 1, x: 0 }} 
          transition={{ duration: 0.8 }} 
          className="flex-1 relative max-w-lg w-full group"
        >
          {/* Decorative background glow */}
          <div className="absolute -inset-4 bg-gradient-to-tr from-blue-400/20 to-indigo-400/20 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          
          <motion.div 
            whileHover={{ scale: 1.03 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="relative rounded-2xl overflow-hidden shadow-2xl aspect-[4/3] ring-1 ring-slate-900/5 transition-shadow duration-500 hover:shadow-blue-500/20"
          >
            <img 
              src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&q=80" 
              alt="Doctor" 
              className="w-full h-full object-cover"
            />
          </motion.div>

          <div className="absolute -bottom-4 -left-4 bg-white border border-slate-200 rounded-2xl shadow-xl px-4 py-3 flex items-center gap-3">
            <div className="w-9 h-9 bg-blue-100 rounded-xl flex items-center justify-center">
              <Stethoscope className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-xl font-extrabold text-slate-900">{displayDoctors}</p>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{t('expertDoctors')}</p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* STATS */}
      <section className="border-y border-slate-200 bg-white py-12 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            {v:displayDoctors,l:t('expertDoctors')},
            {v:displayPatients,l:t('happyPatients')},
            {v:'99.9%',l:t('uptime')},
            {v:'4.9★',l:t('avgRating')}
          ].map(s=>(
            <div key={s.l}><p className="text-3xl font-extrabold text-blue-600">{s.v}</p><p className="text-sm text-slate-500 mt-1">{s.l}</p></div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-20 px-6 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <motion.div initial="hidden" whileInView="show" viewport={{once:true}} variants={stagger} className="text-center mb-14">
            <motion.h2 variants={fade} className="text-4xl font-extrabold text-slate-900 mb-4">{t('about')} <span className="text-blue-600">ClinicDesk?</span></motion.h2>
            <motion.p variants={fade} className="text-slate-600 max-w-xl mx-auto">{t('everythingYouNeed')}</motion.p>
          </motion.div>
          <motion.div initial="hidden" whileInView="show" viewport={{once:true}} variants={stagger} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              {icon:Brain,title:t('aiSymptomChecker'),desc:t('aiSymptomCheckerDesc'),clr:'text-purple-600 bg-purple-100'},
              {icon:CalendarCheck,title:t('instantBooking'),desc:t('instantBookingDesc'),clr:'text-blue-600 bg-blue-100'},
              {icon:ShieldCheck,title:t('secureData'),desc:t('secureDataDesc'),clr:'text-green-600 bg-green-100'},
              {icon:UserCheck,title:t('verifiedDoctors'),desc:t('verifiedDoctorsDesc'),clr:'text-amber-600 bg-amber-100'},
            ].map(({icon:Icon,title,desc,clr})=>(
              <motion.div key={title} variants={fade} className="bg-white border border-slate-200 rounded-2xl p-7 hover:border-blue-300 hover:shadow-lg hover:-translate-y-1 transition duration-300">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-5 ${clr}`}><Icon className="w-6 h-6"/></div>
                <h3 className="font-bold text-slate-900 text-lg mb-2">{title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* AI SYMPTOM CHECKER */}
      <section id="symptom-checker" className="py-20 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 border-y border-slate-200">
        <div className=" max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-14">
          <motion.div initial="hidden" whileInView="show" viewport={{once:true}} variants={stagger} className="flex-1">
            <motion.p variants={fade} className="text-large font-extrabold text-blue-600 text-center  uppercase tracking-widest mb-4 border border-white w-[140px] rounded-2xl py-1 bg-white">{t('aiPowered') || 'AI-Powered'}</motion.p>
            <motion.h2 variants={fade} className="text-4xl md:text-5xl font-extrabold leading-tight mb-6 text-white">
              {t('describeSymptoms')}<br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-100">{t('getAnswers')}</span>
            </motion.h2>
            <motion.p variants={fade} className="text-slate-100 text-lg mb-8 leading-relaxed">{t('aiDescription')}</motion.p>
            <motion.div variants={fade} className="flex items-center gap-3 mb-8">
              <div className="flex -space-x-2">
                {['bg-pink-500','bg-blue-500','bg-amber-500','bg-green-500'].map((c,i)=><div key={i} className={`w-8 h-8 rounded-full ${c} border-2 border-white flex items-center justify-center text-white text-xs font-bold`}>{String.fromCharCode(65+i)}</div>)}
              </div>
              <p className="text-slate-100 text-sm"><span className="text-slate-100 font-extrabold">800K+</span> {t('checksDone')}</p>
            </motion.div>
            {[t('instantResults'), t('notADiagnosis'), t('recommendDoctor')].map(t_text=>(
              <motion.div key={t_text} variants={fade} className="flex items-center gap-3 mb-3">
                <CheckCircle className="w-5 h-5 text-green-400 shrink-0"/>
                <p className="text-slate-100 text-sm">{t_text}</p>
              </motion.div>
            ))}
          </motion.div>
          <motion.div initial={{opacity:0,x:40}} whileInView={{opacity:1,x:0}} viewport={{once:true}} transition={{duration:0.6}} className="flex-1 max-w-md w-full">
            <div className="bg-slate-50 border border-slate-200 rounded-3xl p-8 shadow-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center shadow-md"><Sparkles className="w-5 h-5 text-white"/></div>
                <div><p className="font-bold text-slate-900">{t('aiSymptomChecker')}</p><p className="text-xs text-green-600 flex items-center gap-1 font-medium"><span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block"></span> Online</p></div>
              </div>
              <textarea value={sym} onChange={e=>setSym(e.target.value)} className="w-full bg-white border border-slate-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 rounded-2xl p-4 text-sm text-slate-800 placeholder-slate-400 outline-none resize-none h-28 mb-4 transition shadow-sm" placeholder={t('describeSymptomsPrompt') || "Describe your symptoms..."}/>
              <Link to="/smart-booking" className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white py-3.5 rounded-xl font-bold transition shadow-lg shadow-purple-500/20">
                <Sparkles className="w-4 h-4"/> {t('analyzeSymptoms')}
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* DOCTORS */}
      <section className="py-20 px-6 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <motion.div initial="hidden" whileInView="show" viewport={{once:true}} variants={stagger} className="text-center mb-14">
            <motion.h2 variants={fade} className="text-4xl font-extrabold text-slate-900 mb-4">{t('topRatedSpecialists')}</motion.h2>
            <motion.p variants={fade} className="text-slate-600">{t('worldClassProfessionals')}</motion.p>
          </motion.div>
          <motion.div initial="hidden" whileInView="show" viewport={{once:true}} variants={stagger} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            {[
              {name:'Dr. Navneet Jain',spec:'Neurologist',exp:10,fee:1000,rating:4.9,clr:'text-purple-600 bg-purple-100', id:'69e2a56b0dbe25f73eed09f4'},
              {name:'Dr. Pratibha Dixit',spec:'Dermatologist',exp:4,fee:500,rating:4.8,clr:'text-pink-600 bg-pink-100', id:'69f3bb7464c2efd49232a4f4'},
              {name:'Dr. Anaya Khan',spec:'General Physician',exp:7,fee:350,rating:4.7,clr:'text-blue-600 bg-blue-100', id:'69f3bc8464c2efd49232a4f8'},
            ].map(dr=>(
              <motion.div key={dr.name} variants={fade} className="bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-xl hover:border-blue-300 hover:-translate-y-1 transition duration-300">
                <div className="flex items-center gap-4 mb-5">
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl font-extrabold ${dr.clr}`}>{dr.name.split(' ')[1][0]}</div>
                  <div><h3 className="font-bold text-slate-900 text-lg">{dr.name}</h3><span className={`text-xs font-bold px-3 py-1 rounded-full ${dr.clr}`}>{t(dr.spec.toLowerCase().replace(' ', ''))}</span></div>
                </div>
                <div className="flex justify-around border-y border-slate-100 py-4 mb-5 text-center">
                  <div><p className="text-xs text-slate-500">{t('experience')}</p><p className="font-bold text-slate-900">{dr.exp} Yrs</p></div>
                  <div><p className="text-xs text-slate-500">{t('fees')}</p><p className="font-bold text-slate-900">₹{dr.fee}</p></div>
                  <div><p className="text-xs text-slate-500">{t('rating')}</p><p className="font-bold text-slate-900">{dr.rating} ★</p></div>
                </div>
                <Link to={`/doctor/${dr.id}`} className="block w-full bg-blue-50 hover:bg-blue-100 text-blue-700 text-center py-3 rounded-xl font-semibold transition text-sm">{t('bookAppointment')}</Link>
              </motion.div>
            ))}
          </motion.div>
          <div className="text-center"><Link to="/doctors-public" className="text-blue-600 font-bold hover:text-blue-700 transition">{t('viewAllDoctors')} →</Link></div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="bg-gradient-to-r from-blue-600 to-indigo-600  py-20 px-6 relative overflow-hidden border-y border-slate-200">
        <div className="absolute inset-0 opacity-40" />
        <div className="max-w-3xl mx-auto relative z-10">
          <div className="text-center mb-14">
            <p className="text-xs font-bold text-white uppercase tracking-widest mb-4">{t('simpleProcess')}</p>
            <h2 className="text-4xl md:text-5xl font-extrabold text-white">{t('bookIn3Steps')}</h2>
          </div>
          <motion.div initial="hidden" whileInView="show" viewport={{once:true}} variants={stagger} className="flex flex-col gap-5">
            {[
              {num:'01',Icon:Search,title:t('searchADoctor'),desc:t('searchADoctorDesc'),clr:'from-blue-500 to-blue-600'},
              {num:'02',Icon:Clock,title:t('selectASlot'),desc:t('selectASlotDesc'),clr:'from-indigo-500 to-blue-600'},
              {num:'03',Icon:CheckCircle,title:t('bookAndConfirm'),desc:t('bookAndConfirmDesc'),clr:'from-blue-400 to-indigo-500'},
            ].map(({num,Icon,title,desc,clr})=>(
              <motion.div key={num} variants={fade} className="relative bg-white border border-slate-200 rounded-2xl px-8 py-7 flex items-start gap-6 hover:shadow-lg hover:border-blue-300 transition">
                <span className="absolute top-4 right-6 text-2xl font-extrabold text-slate-100">{num}</span>
                <div className={`shrink-0 w-12 h-12 bg-gradient-to-br ${clr} rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30`}><Icon className="w-6 h-6 text-white"/></div>
                <div className="relative z-10"><h3 className="text-slate-900 font-bold text-lg mb-1">{title}</h3><p className="text-slate-600 text-sm leading-relaxed">{desc}</p></div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-20 px-6 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <motion.div initial="hidden" whileInView="show" viewport={{once:true}} variants={stagger} className="text-center mb-14">
            <motion.h2 variants={fade} className="text-4xl font-extrabold text-slate-900 mb-4">{t('whatPatientsSay')}</motion.h2>
          </motion.div>
          <motion.div initial="hidden" whileInView="show" viewport={{once:true}} variants={stagger} className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {name:'Ayesha K.',review:t('testi1'),rating:5},
              {name:'Rahul M.',review:t('testi2'),rating:5},
              {name:'Sana F.',review:t('testi3'),rating:5},
            ].map(({name,review,rating})=>(
              <motion.div key={name} variants={fade} className="bg-white border border-slate-200 rounded-2xl p-7 hover:shadow-xl transition">
                <div className="flex gap-1 mb-4">{Array(rating).fill(0).map((_,i)=><Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400"/>)}</div>
                <p className="text-slate-600 text-sm leading-relaxed mb-6 italic">"{review}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center text-blue-700 font-bold text-sm">{name[0]}</div>
                  <p className="font-bold text-slate-900 text-sm">{name}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="py-20 px-6 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto">
          <motion.div initial="hidden" whileInView="show" viewport={{once:true}} variants={stagger} className="text-center mb-14">
            <motion.p variants={fade} className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-4">{t('about')}</motion.p>
            <motion.h2 variants={fade} className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4">{t('healthcareReimagined')}</motion.h2>
            <motion.p variants={fade} className="text-slate-600 max-w-2xl mx-auto text-lg leading-relaxed">{t('aboutDesc')}</motion.p>
          </motion.div>
          <motion.div initial="hidden" whileInView="show" viewport={{once:true}} variants={stagger} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              {emoji:'🩺',title:t('patientFirst'),desc:t('patientFirstDesc')},
              {emoji:'🔒',title:t('privacySecurity'),desc:t('privacySecurityDesc')},
              {emoji:'⚡',title:t('speedSimplicity'),desc:t('speedSimplicityDesc')},
              {emoji:'🤝',title:t('doctorPartnerships'),desc:t('doctorPartnershipsDesc')},
            ].map(v=>(
              <motion.div key={v.title} variants={fade} className="bg-slate-50 border border-slate-200 rounded-2xl p-6 hover:shadow-md hover:-translate-y-1 transition">
                <div className="text-3xl mb-3">{v.emoji}</div>
                <h4 className="font-bold text-slate-900 mb-2">{v.title}</h4>
                <p className="text-sm text-slate-600 leading-relaxed">{v.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 bg-slate-50">
        <motion.div initial={{opacity:0,y:40}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{duration:0.7}} className="max-w-4xl mx-auto bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-12 text-center shadow-2xl shadow-blue-600/30">
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4">{t('startJourney')}</h2>
          <p className="text-blue-100 text-lg mb-10">{t('joinThousands')}</p>
          <Link to="/doctors-public" className="inline-flex items-center gap-2 bg-white text-blue-600 hover:bg-blue-50 font-extrabold px-10 py-4 rounded-2xl transition shadow-lg text-lg">{t('bookNowLarge')} <ArrowRight className="w-5 h-5"/></Link>
        </motion.div>
      </section>

      {/* FOOTER */}
      <footer className="bg-white border-t border-slate-200 pt-16 pb-8 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-5">
              <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20"><Stethoscope className="w-5 h-5 text-white"/></div>
              <span className="text-xl font-extrabold text-blue-600">ClinicDesk</span>
            </div>
            <p className="text-slate-600 text-sm leading-relaxed">{t('modernSolutions')}</p>
          </div>
          {[
            {heading:t('patients'),links:[[t('findDoctor'),'/doctors-public'],[t('aiSymptomChecker'),'/smart-booking'],[t('bookAppointment'),'/login']]},
            {heading:t('legal'),links:[[t('termsOfService'),'#'],[t('privacyPolicy'),'#'],[t('cookiePolicy'),'#']]},
          ].map(({heading,links})=>(
            <div key={heading}>
               <h4 className="font-bold text-slate-900 mb-5">{heading}</h4>
              <ul className="space-y-3 text-sm text-slate-600">
                {links.map(([label,to])=><li key={label}><Link to={to} className="hover:text-blue-600 transition">{label}</Link></li>)}
              </ul>
            </div>
          ))}
          <div>
            <h4 className="font-bold text-slate-900 mb-5">{t('contact')}</h4>
            <ul className="space-y-3 text-sm text-slate-600">
              <li>📍 Address: ClinicDesk Medical Center, Indore </li>
              <li>📞 Phone: +91 98765 43210</li>
              <li>📧 Email: support@clinicdesk.com</li>
              <li>
                <a href="https://wa.me/919876543210" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-green-600 font-medium hover:text-green-700 transition">
                  💬 WhatsApp
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto border-t border-slate-200 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} ClinicDesk. {t('rightsReserved')} <span className="opacity-30 text-[10px]">v1.0.1</span></p>
          <div className="flex gap-6">{['Twitter','LinkedIn','Instagram'].map(s=><a key={s} href="#" className="hover:text-blue-600 transition">{s}</a>)}</div>
        </div>
      </footer>
    </div>
  );
}
