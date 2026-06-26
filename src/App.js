import React, { useState } from 'react';
import './App.css';

const OPENROUTER_KEY = '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';

const FOOD_IMAGES = {
  breakfast: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?w=400&h=250&fit=crop',
  lunch: 'https://images.pexels.com/photos/1640772/pexels-photo-1640772.jpeg?w=400&h=250&fit=crop',
  dinner: 'https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg?w=400&h=250&fit=crop',
  snack: 'https://images.pexels.com/photos/1099680/pexels-photo-1099680.jpeg?w=400&h=250&fit=crop',
  salad: 'https://images.pexels.com/photos/2097090/pexels-photo-2097090.jpeg?w=400&h=250&fit=crop',
  smoothie: 'https://images.pexels.com/photos/775031/pexels-photo-775031.jpeg?w=400&h=250&fit=crop',
  salmon: 'https://images.pexels.com/photos/3655916/pexels-photo-3655916.jpeg?w=400&h=250&fit=crop',
  soup: 'https://images.pexels.com/photos/1703272/pexels-photo-1703272.jpeg?w=400&h=250&fit=crop',
  eggs: 'https://images.pexels.com/photos/566566/pexels-photo-566566.jpeg?w=400&h=250&fit=crop',
  bowl: 'https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg?w=400&h=250&fit=crop',
  default: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?w=400&h=250&fit=crop'
};

const EXERCISE_ICONS = {
  'squat': '🏋️', 'lunge': '🦵', 'push': '💪', 'plank': '🧘', 'run': '🏃',
  'walk': '🚶', 'yoga': '🧘', 'stretch': '🤸', 'deadlift': '🏋️', 'row': '💪',
  'curl': '💪', 'press': '💪', 'jump': '⚡', 'swim': '🏊', 'cycle': '🚴',
  'default': '🏃'
};

function getMealImage(mealName) {
  const name = mealName.toLowerCase();
  if (name.includes('smoothie') || name.includes('shake')) return FOOD_IMAGES.smoothie;
  if (name.includes('salad')) return FOOD_IMAGES.salad;
  if (name.includes('salmon') || name.includes('fish')) return FOOD_IMAGES.salmon;
  if (name.includes('soup') || name.includes('stew')) return FOOD_IMAGES.soup;
  if (name.includes('egg') || name.includes('omel')) return FOOD_IMAGES.eggs;
  if (name.includes('bowl')) return FOOD_IMAGES.bowl;
  if (name.includes('breakfast') || name.includes('oat')) return FOOD_IMAGES.breakfast;
  if (name.includes('lunch')) return FOOD_IMAGES.lunch;
  if (name.includes('dinner')) return FOOD_IMAGES.dinner;
  if (name.includes('snack')) return FOOD_IMAGES.snack;
  return FOOD_IMAGES.default;
}

function getExerciseIcon(exerciseName) {
  const name = exerciseName.toLowerCase();
  for (const [key, icon] of Object.entries(EXERCISE_ICONS)) {
    if (name.includes(key)) return icon;
  }
  return EXERCISE_ICONS.default;
}

const PCOS_TYPES = {
  insulin: {
    name: 'Insulin-resistant PCOS',
    badge: 'Most common type',
    desc: 'Your body over-produces insulin, signaling your ovaries to make more androgens. This type responds very well to targeted diet and strength training.',
    symptoms: ['Belly weight gain', 'Sugar cravings', 'Energy crashes', 'Irregular periods'],
    tip: 'Prioritize protein and fiber at every meal to keep blood sugar stable. Strength training 3x/week significantly improves insulin sensitivity.',
    color: '#E8F7F1', textColor: '#0F6E56'
  },
  adrenal: {
    name: 'Adrenal PCOS',
    badge: 'Stress-driven type',
    desc: 'Your adrenal glands over-produce androgens in response to chronic stress. High-intensity exercise can worsen this type.',
    symptoms: ['High stress', 'Fatigue despite sleep', 'Acne and hair loss', 'Slim but symptomatic'],
    tip: 'Stress management is your treatment. Never skip meals. Yoga and walking are more healing than intense workouts.',
    color: '#FEF3E2', textColor: '#7A4F00'
  },
  inflammatory: {
    name: 'Inflammatory PCOS',
    badge: 'Gut & immune-driven',
    desc: 'Chronic low-grade inflammation is triggering your ovaries to overproduce androgens. Healing your gut is the most powerful lever.',
    symptoms: ['Bloating and gut issues', 'Brain fog', 'Joint pain', 'Food sensitivities'],
    tip: 'Try eliminating gluten and dairy for 6 weeks. Load up on omega-3s, turmeric, and fermented foods.',
    color: '#E8F0FB', textColor: '#1A4F8A'
  },
  postpill: {
    name: 'Post-pill PCOS',
    badge: 'Temporary & reversible',
    desc: 'Your hormones are recalibrating after stopping birth control. This type often resolves in 3-6 months with the right support.',
    symptoms: ['Irregular after stopping pill', 'Acne flare-up', 'Normal weight', 'Previously regular cycle'],
    tip: 'Support your liver with cruciferous vegetables, zinc-rich foods, and B vitamins. Try seed cycling.',
    color: '#F7D6DF', textColor: '#6B2438'
  }
};

const QUESTIONS = [
  { id: 'name', type: 'text', placeholder: 'Your first name', q: 'First, what should we call you?', sub: "We'll personalize your results." },
  { id: 'age', type: 'single', q: 'How old are you?', opts: ['Under 20', '20–29', '30–39', '40 or older'] },
  { id: 'goal', type: 'single', q: 'What is your main goal?', opts: ['Lose weight', 'Gain weight', 'Maintain weight', 'Improve hormones'] },
  { id: 'cycle', type: 'single', q: 'How would you describe your menstrual cycle?', opts: ['Very irregular or absent', 'Somewhat irregular', 'Was regular, now irregular', 'Regular but symptomatic'] },
  { id: 'weight', type: 'single', q: 'Where do you tend to carry extra weight?', opts: ['Mostly around my belly and waist', 'Fairly evenly distributed', "I'm slim but still have PCOS symptoms", 'I struggle to gain weight'] },
  { id: 'energy', type: 'single', q: 'How does your energy feel throughout the day?', opts: ['Crashes after meals, especially carbs', 'Generally low and fatigued', 'Anxious and wired, but still tired', 'Pretty stable most of the time'] },
  { id: 'stress', type: 'single', q: 'How would you rate your stress levels?', opts: ['Very high — overwhelmed often', 'Moderate — some stress most days', 'Low — I manage it well', 'Improving after a stressful period'] },
  { id: 'symptoms', type: 'multi', q: 'Which symptoms do you experience?', sub: 'Select all that apply.', opts: ['Acne or oily skin', 'Hair thinning or loss', 'Excess facial or body hair', 'Bloating or digestive issues', 'Brain fog', 'Darkening skin patches', 'Joint pain or inflammation', 'Anxiety or low mood'] },
  { id: 'pill', type: 'single', q: 'Have you recently stopped hormonal birth control?', opts: ['Yes, within the last 6 months', 'Yes, 6–18 months ago', 'No, never used it', 'Currently on hormonal birth control'] },
  { id: 'gut', type: 'single', q: 'How is your gut and digestion?', opts: ['Often bloated or unpredictable', 'Sensitive to certain foods', 'Pretty normal most of the time', 'I have a diagnosed gut condition'] },
  { id: 'exercise', type: 'single', q: 'How does your body respond to intense exercise?', opts: ['Feel great and energized after', 'Exhausted and drained for days', 'Symptoms worsen after intense sessions', "I don't exercise much currently"] },
  { id: 'carbs', type: 'single', q: 'When you eat a high-carb or sugary meal?', opts: ['I crash hard and feel foggy', 'I feel fine — no real reaction', 'I feel inflamed — bloated or achy', 'I feel anxious or jittery'] }
];

function scorePCOS(answers, multi) {
  let s = { insulin: 0, adrenal: 0, inflammatory: 0, postpill: 0 };
  if (answers.weight === 0) s.insulin += 3;
  if (answers.energy === 0) s.insulin += 3;
  if (answers.carbs === 0) s.insulin += 3;
  if ((multi.symptoms || []).includes(5)) s.insulin += 2;
  if (answers.stress === 0) s.adrenal += 3;
  if (answers.weight === 2) s.adrenal += 2;
  if (answers.exercise === 1) s.adrenal += 2;
  if ((multi.symptoms || []).includes(7)) s.adrenal += 2;
  if (answers.energy === 2) s.adrenal += 2;
  if ([0, 1, 3].includes(answers.gut)) s.inflammatory += 3;
  if (answers.carbs === 2) s.inflammatory += 3;
  if ((multi.symptoms || []).includes(6)) s.inflammatory += 2;
  if ((multi.symptoms || []).includes(4)) s.inflammatory += 2;
  if (answers.pill === 0) s.postpill += 5;
  if (answers.pill === 1) s.postpill += 3;
  if (answers.cycle === 2) s.postpill += 3;
  return Object.entries(s).sort((a, b) => b[1] - a[1])[0][0];
}

export default function App() {
  const [page, setPage] = useState('home');
  const [quizStep, setQuizStep] = useState('intro');
  const [qCurrent, setQCurrent] = useState(0);
  const [answers, setAnswers] = useState({});
  const [multi, setMulti] = useState({});
  const [pcosType, setPcosType] = useState('insulin');
  const [userName, setUserName] = useState('');
  const [phase, setPhase] = useState('follicular');
  const [mealSetup, setMealSetup] = useState({ type: 'insulin', goal: 'lose weight', phase: 'follicular', meals: '3', restrictions: [], dislikes: '' });
  const [workoutSetup, setWorkoutSetup] = useState({ type: 'insulin', phase: 'follicular', fitness: 'intermediate', duration: '30–45 minutes', goal: 'lose fat', equipment: ['No equipment'] });
  const [mealPlan, setMealPlan] = useState(null);
  const [workoutPlan, setWorkoutPlan] = useState(null);
  const [mealScreen, setMealScreen] = useState('setup');
  const [workoutScreen, setWorkoutScreen] = useState('setup');
  const [mealDay, setMealDay] = useState(0);
  const [workoutDay, setWorkoutDay] = useState(0);
  const [logs, setLogs] = useState([]);
  const [todayLog, setTodayLog] = useState({ mood: '', energy: 5, bloating: 3, symptoms: [], notes: '' });
  const [plan, setPlan] = useState('free');
  const [billing, setBilling] = useState('monthly');
  const [subCount, setSubCount] = useState(500);
  const [proPct, setProPct] = useState(60);
  const [loadingMsg, setLoadingMsg] = useState('');

  const prices = { monthly: { free: 0, basic: 9.99, pro: 19.99 }, annual: { free: 0, basic: 5.99, pro: 11.99 } };

  const pk = '#C4687E';
  const pkl = '#FDF0F3';
  const pkm = '#F7D6DF';
  const pkb = '#F0B8C8';
  const pkd = '#6B2438';
  const pkt = '#8B3A50';

  function goPage(p) { setPage(p); }

  function selectPhase(p) {
    setPhase(p);
    setMealSetup(prev => ({ ...prev, phase: p }));
    setWorkoutSetup(prev => ({ ...prev, phase: p }));
  }

  function toggleRestriction(item) {
    setMealSetup(prev => ({
      ...prev,
      restrictions: prev.restrictions.includes(item)
        ? prev.restrictions.filter(r => r !== item)
        : [...prev.restrictions, item]
    }));
  }

  function toggleEquipment(item) {
    setWorkoutSetup(prev => ({
      ...prev,
      equipment: prev.equipment.includes(item)
        ? prev.equipment.filter(e => e !== item)
        : [...prev.equipment, item]
    }));
  }

  function selectQ(i) {
    const id = QUESTIONS[qCurrent].id;
    setAnswers(prev => ({ ...prev, [id]: i }));
    setTimeout(() => {
      if (qCurrent < QUESTIONS.length - 1) setQCurrent(c => c + 1);
      else finishQuiz({ ...answers, [id]: i });
    }, 280);
  }

  function toggleMulti(i) {
    const id = QUESTIONS[qCurrent].id;
    setMulti(prev => {
      const arr = prev[id] || [];
      return { ...prev, [id]: arr.includes(i) ? arr.filter(x => x !== i) : [...arr, i] };
    });
  }

  function finishQuiz(finalAnswers) {
    const type = scorePCOS(finalAnswers, multi);
    setPcosType(type);
    const name = (finalAnswers.name || '').trim();
    if (name) setUserName(name);
    setMealSetup(prev => ({ ...prev, type }));
    setWorkoutSetup(prev => ({ ...prev, type }));
    setQuizStep('result');
  }

  function resetQuiz() {
    setQCurrent(0);
    setAnswers({});
    setMulti({});
    setQuizStep('intro');
  }

  async function callAI(prompt, onSuccess, onError) {
    const msgs = ['Analyzing your profile…', 'Building your personalized plan…', 'Syncing to your cycle phase…', 'Almost ready…'];
    let i = 0;
    setLoadingMsg(msgs[0]);
    const iv = setInterval(() => { i = (i + 1) % msgs.length; setLoadingMsg(msgs[i]); }, 2000);
    try {
      const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENROUTER_KEY}`,
          'HTTP-Referer': 'https://hormonize.fit',
          'X-Title': 'Hormonize'
        },
        body: JSON.stringify({
          model: 'mistralai/mistral-nemo',
          max_tokens: 4000,
          messages: [{ role: 'user', content: prompt }]
        })
      });
      const data = await res.json();
      clearInterval(iv);
      const text = data.choices[0].message.content;
      const parsed = JSON.parse(text.replace(/```json|```/g, '').trim());
      onSuccess(parsed);
    } catch (e) {
      clearInterval(iv);
      onError();
    }
  }

  async function genMeals() {
    setMealScreen('loading');
    const { type, goal, phase: p, meals, restrictions, dislikes } = mealSetup;
    const prompt = `You are a registered dietitian specializing in PCOS. Generate a 7-day meal plan for: PCOS type: ${type}, Goal: ${goal}, Cycle phase: ${p}, Meals per day: ${meals}, Restrictions: ${restrictions.join(', ') || 'none'}, Avoid: ${dislikes || 'none'}. Return ONLY valid JSON no markdown: {"title":"","subtitle":"","phase_tip":"","daily_calories":0,"protein_g":0,"carbs_g":0,"fat_g":0,"days":[{"day":"Monday","meals":[{"type":"Breakfast","name":"","description":"2 sentences","tags":["","",""]}]}]}. 7 days Monday–Sunday. Every meal tailored to ${type} PCOS and ${p} phase.`;
    await callAI(prompt, (data) => { setMealPlan(data); setMealDay(0); setMealScreen('result'); }, () => setMealScreen('setup'));
  }

  async function genWorkouts() {
    setWorkoutScreen('loading');
    const { type, phase: p, fitness, duration, goal, equipment } = workoutSetup;
    const prompt = `You are a certified personal trainer specializing in PCOS. Create a 7-day cycle-synced workout plan for: PCOS type: ${type}, Cycle phase: ${p}, Fitness: ${fitness}, Duration: ${duration}, Goal: ${goal}, Equipment: ${equipment.join(', ')}. Return ONLY valid JSON no markdown: {"title":"","subtitle":"","phase_tip":"","active_days":0,"rest_days":0,"avg_duration":"","days":[{"day":"Monday","is_rest":false,"workout_type":"","intensity":"low","name":"","description":"2 sentences","exercises":[{"name":"","sets_reps":"","muscle_group":""}],"duration_min":0,"cooldown":""}]}. 7 days Monday–Sunday. Rest days is_rest:true exercises:[]. Min 1-2 rest days. Include muscle_group for each exercise.`;
    await callAI(prompt, (data) => { setWorkoutPlan(data); setWorkoutDay(0); setWorkoutScreen('result'); }, () => setWorkoutScreen('setup'));
  }

  function saveLog() {
    const today = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    setLogs(prev => [{ ...todayLog, date: today }, ...prev]);
    setTodayLog({ mood: '', energy: 5, bloating: 3, symptoms: [], notes: '' });
    alert("Today's log saved!");
  }

  function calcRevenue() {
    const pm = prices[billing];
    const proUsers = Math.round(subCount * proPct / 100);
    const basicUsers = Math.round(subCount * (100 - proPct) / 100 * 0.6);
    const mrr = proUsers * pm.pro + basicUsers * pm.basic;
    return { mrr: Math.round(mrr), arr: Math.round(mrr * 12), yr3: Math.round(mrr * 12 * 3 * 1.4 / 1000) };
  }

  const rev = calcRevenue();
  const q = QUESTIONS[qCurrent];
  const typeLabel = { insulin: 'Insulin-resistant', adrenal: 'Adrenal', inflammatory: 'Inflammatory', postpill: 'Post-pill' };

  

  return (
    <div style={{ maxWidth: 680, margin: '0 auto', background: pkl, minHeight: '100vh', fontFamily: "'Inter', system-ui, sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap');
        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes fadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
        .fade-in{animation:fadeIn 0.4s ease}
        .meal-img{width:100%;height:180px;object-fit:cover;border-radius:14px 14px 0 0}
        .ex-card{background:#fff;border:0.5px solid ${pkb};border-radius:14px;padding:1rem;margin-bottom:10px;display:flex;gap:14px;align-items:flex-start}
        .ex-icon{width:52px;height:52px;border-radius:12px;background:${pkm};display:flex;align-items:center;justify-content:center;font-size:24px;flex-shrink:0}
        .ex-body{flex:1}
        .ex-name{font-size:15px;font-weight:500;color:#111;margin-bottom:3px}
        .ex-sets{font-size:13px;color:${pkt};margin-bottom:4px}
        .ex-muscle{display:inline-block;padding:2px 10px;border-radius:20px;font-size:11px;background:${pkm};color:${pkd};font-weight:500}
        .chip{padding:6px 13px;border:0.5px solid ${pkb};border-radius:20px;font-size:13px;cursor:pointer;background:#fff;color:${pkt};font-family:inherit}
        .chip.on{border-color:${pk};background:${pkm};color:${pkd};font-weight:500}
        select,input[type=text],textarea{font-family:inherit;width:100%;padding:11px 14px;border:0.5px solid ${pkb};border-radius:12px;font-size:14px;background:#fff;color:#111;outline:none}
        select:focus,input:focus,textarea:focus{border-color:${pk}}
        .pink-btn{background:${pk};color:#fff;border-radius:14px;padding:13px;font-size:15px;font-weight:500;width:100%;cursor:pointer;font-family:inherit;border:none}
        .pink-btn:hover{opacity:0.88}
        .outline-btn{background:none;border:0.5px solid ${pkb};border-radius:10px;padding:9px 16px;font-size:13px;color:${pkt};cursor:pointer;font-family:inherit}
        .day-tab{flex-shrink:0;padding:7px 16px;border:0.5px solid ${pkb};border-radius:20px;font-size:13px;cursor:pointer;background:#fff;color:${pkt};font-family:inherit;border:none}
        .day-tab.active{background:${pk};color:#fff;font-weight:500}
        .nav-btn{flex:1;display:flex;flex-direction:column;align-items:center;padding:10px 0 8px;border:none;background:none;gap:3px;cursor:pointer;font-family:inherit}
        .card{background:#fff;border:0.5px solid ${pkb};border-radius:16px;padding:1.1rem 1.25rem;margin-bottom:10px}
        .section-title{font-size:12px;font-weight:500;color:${pkt};text-transform:uppercase;letter-spacing:0.06em;margin-bottom:0.75rem}
        input[type=range]{width:100%;accent-color:${pk}}
      `}</style>

      {/* TOPBAR */}
      <div style={{ background: '#fff', borderBottom: `0.5px solid ${pkb}`, padding: '0 1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 56, position: 'sticky', top: 0, zIndex: 20 }}>
        <div style={{ fontSize: 20, fontWeight: 600, color: pk, display: 'flex', alignItems: 'center', gap: 8, letterSpacing: '-0.02em' }}>
          <div style={{ width: 28, height: 28, borderRadius: '50%', background: pkm, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>♡</div>
          Hormonize
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 500, background: pkm, color: pkd, border: `0.5px solid ${pkb}` }}>{plan === 'pro' ? '✨ Pro' : plan === 'basic' ? 'Basic' : 'Free'}</div>
          <div onClick={() => goPage('profile')} style={{ width: 32, height: 32, borderRadius: '50%', background: `linear-gradient(135deg,${pk},${pkd})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 600, color: '#fff', cursor: 'pointer' }}>{userName ? userName.charAt(0).toUpperCase() : '?'}</div>
        </div>
      </div>

      <div style={{ padding: '1.25rem', paddingBottom: 90 }}>

        {/* HOME */}
        {page === 'home' && (
          <div className="fade-in">
            <div style={{ background: `linear-gradient(135deg, ${pkm} 0%, #FDF0F3 60%, #F7E8EF 100%)`, border: `0.5px solid ${pkb}`, borderRadius: 24, padding: '2rem 1.5rem', marginBottom: '1.5rem', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: -20, right: -20, width: 120, height: 120, borderRadius: '50%', background: 'rgba(196,104,126,0.08)' }} />
              <div style={{ position: 'absolute', bottom: -30, left: -10, width: 80, height: 80, borderRadius: '50%', background: 'rgba(196,104,126,0.06)' }} />
              <div style={{ fontSize: 48, marginBottom: '0.75rem' }}>🌸</div>
              <div style={{ fontSize: 26, fontWeight: 600, color: pkd, marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>Welcome to Hormonize</div>
              <div style={{ fontSize: 15, color: pkt, lineHeight: 1.7, maxWidth: 360, margin: '0 auto 1.5rem' }}>Your personalized PCOS wellness companion — AI meal plans and workouts made for your hormones.</div>
              <button className="pink-btn" onClick={() => goPage('quiz')} style={{ maxWidth: 240, margin: '0 auto', display: 'block', borderRadius: 30, fontSize: 14, padding: '12px 24px' }}>Take my assessment →</button>
            </div>

            <div className="section-title">Your cycle phase</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: '1.5rem' }}>
              {[
                { key: 'follicular', name: '🌱 Follicular', days: 'Day 1–13', tip: 'Rising energy. Great for strength.', bg: '#E8F7F1', color: '#0F6E56' },
                { key: 'ovulatory', name: '🌸 Ovulatory', days: 'Day 14–16', tip: 'Peak performance window.', bg: pkm, color: pkd },
                { key: 'luteal', name: '🍂 Luteal', days: 'Day 17–28', tip: 'Slow down and prioritize rest.', bg: '#FEF3E2', color: '#7A4F00' },
                { key: 'menstrual', name: '🌙 Menstrual', days: 'Period', tip: 'Rest deeply. Gentle movement.', bg: '#E8F0FB', color: '#1A4F8A' }
              ].map(ph => (
                <div key={ph.key} onClick={() => selectPhase(ph.key)} style={{ padding: '14px', borderRadius: 16, border: phase === ph.key ? `2px solid ${pk}` : '0.5px solid transparent', background: ph.bg, cursor: 'pointer', transition: 'all 0.15s', boxShadow: phase === ph.key ? `0 4px 12px rgba(196,104,126,0.2)` : 'none' }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: ph.color, marginBottom: 3 }}>{ph.name}</div>
                  <div style={{ fontSize: 11, opacity: 0.7, marginBottom: 4 }}>{ph.days}</div>
                  <div style={{ fontSize: 12, lineHeight: 1.5, opacity: 0.85 }}>{ph.tip}</div>
                </div>
              ))}
            </div>

            <div className="section-title">Your toolkit</div>
            {[
              { label: '🧬 PCOS assessment', sub: 'Identify your type in 3 minutes', page: 'quiz' },
              { label: '🥗 Meal plan generator', sub: '7-day hormone-synced nutrition with photos', page: 'meals' },
              { label: '💪 Workout planner', sub: 'Cycle-synced exercise with diagrams', page: 'workouts' },
              { label: '📊 Daily tracker', sub: 'Log symptoms, mood, and energy', page: 'tracker' }
            ].map(item => (
              <div key={item.page} onClick={() => goPage(item.page)} className="card" style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', transition: 'transform 0.15s', marginBottom: 10 }}>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 500 }}>{item.label}</div>
                  <div style={{ fontSize: 13, color: '#888', marginTop: 3 }}>{item.sub}</div>
                </div>
                <span style={{ color: pkb, fontSize: 20 }}>›</span>
              </div>
            ))}
          </div>
        )}

        {/* QUIZ */}
        {page === 'quiz' && (
          <div className="fade-in">
            {quizStep === 'intro' && (
              <div style={{ textAlign: 'center', padding: '2rem 0' }}>
                <div style={{ fontSize: 52, marginBottom: '1rem' }}>🧬</div>
                <div style={{ fontSize: 24, fontWeight: 600, color: pkd, marginBottom: '0.5rem' }}>PCOS assessment</div>
                <div style={{ fontSize: 14, color: '#888', lineHeight: 1.7, maxWidth: 380, margin: '0 auto 1.5rem' }}>12 questions about your symptoms and lifestyle. We'll identify your PCOS type and build a plan around your hormones.</div>
                <button className="pink-btn" onClick={() => setQuizStep('q')} style={{ maxWidth: 240, margin: '0 auto', display: 'block', borderRadius: 30 }}>Start assessment →</button>
                <p style={{ fontSize: 12, color: pkt, marginTop: 12 }}>Educational only · Not medical advice</p>
              </div>
            )}
            {quizStep === 'q' && (
              <div>
                <div style={{ height: 5, background: pkb, borderRadius: 3, marginBottom: '1.5rem', overflow: 'hidden' }}>
                  <div style={{ height: 5, background: `linear-gradient(90deg,${pk},${pkd})`, borderRadius: 3, width: `${Math.round(((qCurrent + 1) / QUESTIONS.length) * 100)}%`, transition: 'width 0.4s' }} />
                </div>
                <div style={{ fontSize: 12, color: pkt, marginBottom: '0.75rem', fontWeight: 500 }}>Question {qCurrent + 1} of {QUESTIONS.length}</div>
                <div style={{ fontSize: 20, fontWeight: 600, marginBottom: '0.5rem', lineHeight: 1.4, color: '#111' }}>{q.q}</div>
                {q.sub && <div style={{ fontSize: 13, color: '#888', marginBottom: '1.25rem' }}>{q.sub}</div>}
                {q.type === 'text' && (
                  <input type="text" value={answers[q.id] || ''} onChange={e => setAnswers(prev => ({ ...prev, [q.id]: e.target.value }))} placeholder={q.placeholder} style={{ marginBottom: '1rem' }} />
                )}
                {q.type === 'single' && q.opts.map((o, i) => (
                  <button key={i} onClick={() => selectQ(i)} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', border: answers[q.id] === i ? `1.5px solid ${pk}` : `0.5px solid ${pkb}`, borderRadius: 14, background: answers[q.id] === i ? pkm : '#fff', cursor: 'pointer', textAlign: 'left', width: '100%', marginBottom: 8, fontSize: 14, fontFamily: 'inherit', transition: 'all 0.15s' }}>
                    <div style={{ width: 18, height: 18, borderRadius: '50%', border: answers[q.id] === i ? `5px solid ${pk}` : `1.5px solid ${pkb}`, flexShrink: 0, transition: 'all 0.15s' }} />
                    <span style={{ fontWeight: answers[q.id] === i ? 500 : 400 }}>{o}</span>
                  </button>
                ))}
                {q.type === 'multi' && q.opts.map((o, i) => (
                  <button key={i} onClick={() => toggleMulti(i)} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', border: (multi[q.id] || []).includes(i) ? `1.5px solid ${pk}` : `0.5px solid ${pkb}`, borderRadius: 14, background: (multi[q.id] || []).includes(i) ? pkm : '#fff', cursor: 'pointer', textAlign: 'left', width: '100%', marginBottom: 8, fontSize: 14, fontFamily: 'inherit' }}>
                    <div style={{ width: 18, height: 18, borderRadius: 4, border: (multi[q.id] || []).includes(i) ? `5px solid ${pk}` : `1.5px solid ${pkb}`, flexShrink: 0 }} />
                    {o}
                  </button>
                ))}
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1.5rem' }}>
                  <button className="outline-btn" onClick={() => setQCurrent(c => Math.max(0, c - 1))} style={{ visibility: qCurrent === 0 ? 'hidden' : 'visible' }}>← Back</button>
                  {q.type !== 'single' && <button onClick={() => { if (qCurrent < QUESTIONS.length - 1) setQCurrent(c => c + 1); else finishQuiz(answers); }} disabled={q.type === 'text' && !(answers[q.id] || '').trim()} style={{ background: pk, border: 'none', borderRadius: 10, padding: '10px 24px', fontSize: 14, fontWeight: 500, color: '#fff', cursor: 'pointer', fontFamily: 'inherit' }}>Continue →</button>}
                </div>
              </div>
            )}
            {quizStep === 'result' && (() => {
              const info = PCOS_TYPES[pcosType];
              return (
                <div className="fade-in">
                  <div style={{ textAlign: 'center', padding: '1rem 0 1.5rem' }}>
                    <div style={{ display: 'inline-block', padding: '5px 16px', borderRadius: 20, fontSize: 13, fontWeight: 500, background: info.color, color: info.textColor, marginBottom: '1rem' }}>{info.badge}</div>
                    <div style={{ fontSize: 22, fontWeight: 600, marginBottom: '0.5rem', color: '#111' }}>{userName ? `${userName}, you have ` : 'You have '}{info.name}</div>
                    <div style={{ fontSize: 14, color: '#666', lineHeight: 1.7 }}>{info.desc}</div>
                  </div>
                  <div className="card" style={{ marginBottom: 12 }}>
                    <div className="section-title">Your key symptoms</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>{info.symptoms.map(s => <span key={s} style={{ padding: '6px 14px', borderRadius: 20, fontSize: 13, background: pkm, color: pkd, fontWeight: 500 }}>{s}</span>)}</div>
                  </div>
                  <div style={{ background: pkm, border: `0.5px solid ${pkb}`, borderRadius: 16, padding: '1.1rem 1.25rem', marginBottom: '1.25rem' }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: pkd, marginBottom: 6 }}>💡 Your key focus</div>
                    <div style={{ fontSize: 14, color: pkt, lineHeight: 1.7 }}>{info.tip}</div>
                  </div>
                  <button className="pink-btn" onClick={() => goPage('meals')} style={{ marginBottom: 10 }}>🥗 Build my meal plan →</button>
                  <button onClick={() => goPage('workouts')} style={{ width: '100%', padding: 13, background: pkm, border: 'none', borderRadius: 14, color: pkd, fontSize: 14, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit', marginBottom: 10 }}>💪 Build my workout plan →</button>
                  <button className="outline-btn" onClick={resetQuiz}>← Retake quiz</button>
                </div>
              );
            })()}
          </div>
        )}

        {/* MEALS */}
        {page === 'meals' && (
          <div className="fade-in">
            {mealScreen === 'setup' && (
              <div>
                <div style={{ fontSize: 22, fontWeight: 600, marginBottom: '0.3rem', color: '#111' }}>🥗 Meal plan generator</div>
                <div style={{ fontSize: 14, color: '#888', marginBottom: '1.5rem', lineHeight: 1.6 }}>A full 7-day plan with photos, built for your PCOS type and cycle phase.</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  {[
                    { label: 'PCOS type', key: 'type', opts: [['insulin', 'Insulin-resistant'], ['adrenal', 'Adrenal'], ['inflammatory', 'Inflammatory'], ['postpill', 'Post-pill']] },
                    { label: 'Goal', key: 'goal', opts: [['lose weight', 'Lose weight'], ['gain weight', 'Gain weight'], ['maintain weight', 'Maintain'], ['balance hormones', 'Balance hormones']] },
                    { label: 'Cycle phase', key: 'phase', opts: [['follicular', 'Follicular'], ['ovulatory', 'Ovulatory'], ['luteal', 'Luteal'], ['menstrual', 'Menstrual']] },
                    { label: 'Meals per day', key: 'meals', opts: [['3', '3 meals'], ['3 meals and 1 snack', '3 + snack'], ['3 meals and 2 snacks', '3 + 2 snacks'], ['5 small meals', '5 small meals']] }
                  ].map(f => (
                    <div key={f.key} style={{ marginBottom: '1rem' }}>
                      <label style={{ fontSize: 13, fontWeight: 500, color: pkt, marginBottom: 6, display: 'block' }}>{f.label}</label>
                      <select value={mealSetup[f.key]} onChange={e => setMealSetup(prev => ({ ...prev, [f.key]: e.target.value }))}>
                        {f.opts.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                      </select>
                    </div>
                  ))}
                </div>
                <label style={{ fontSize: 13, fontWeight: 500, color: pkt, marginBottom: 8, display: 'block' }}>Dietary restrictions</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: '1.25rem' }}>
                  {['Gluten-free', 'Dairy-free', 'Vegetarian', 'Vegan', 'Low-carb', 'Nut-free'].map(r => (
                    <button key={r} className={`chip ${mealSetup.restrictions.includes(r) ? 'on' : ''}`} onClick={() => toggleRestriction(r)}>{r}</button>
                  ))}
                </div>
                <label style={{ fontSize: 13, fontWeight: 500, color: pkt, marginBottom: 6, display: 'block' }}>Foods to avoid</label>
                <input type="text" value={mealSetup.dislikes} onChange={e => setMealSetup(prev => ({ ...prev, dislikes: e.target.value }))} placeholder="e.g. mushrooms, seafood…" style={{ marginBottom: '1.25rem' }} />
                <button className="pink-btn" onClick={genMeals}>Generate 7-day meal plan →</button>
                <p style={{ fontSize: 12, color: pkt, marginTop: 8, textAlign: 'center' }}>Powered by AI</p>
              </div>
            )}
            {mealScreen === 'loading' && (
              <div style={{ textAlign: 'center', padding: '4rem 1rem' }}>
                <div style={{ width: 48, height: 48, border: `3px solid ${pkb}`, borderTopColor: pk, borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 1.25rem' }} />
                <div style={{ fontSize: 15, color: pkt, fontWeight: 500 }}>{loadingMsg}</div>
                <div style={{ fontSize: 13, color: '#aaa', marginTop: 6 }}>Building your personalized plan…</div>
              </div>
            )}
            {mealScreen === 'result' && mealPlan && (
              <div className="fade-in">
                <div style={{ display: 'inline-block', padding: '4px 14px', borderRadius: 20, fontSize: 12, fontWeight: 500, background: pkm, color: pkd, marginBottom: '0.75rem', border: `0.5px solid ${pkb}` }}>{typeLabel[mealSetup.type]} PCOS · {mealSetup.phase} phase</div>
                <div style={{ fontSize: 20, fontWeight: 600, marginBottom: '0.25rem', color: '#111' }}>{mealPlan.title}</div>
                <div style={{ fontSize: 13, color: '#888', lineHeight: 1.6, marginBottom: '1.25rem' }}>{mealPlan.subtitle}</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8, marginBottom: '1.25rem' }}>
                  {[{ val: Math.round(mealPlan.daily_calories), lbl: 'Cal/day', icon: '🔥' }, { val: Math.round(mealPlan.protein_g) + 'g', lbl: 'Protein', icon: '💪' }, { val: Math.round(mealPlan.carbs_g) + 'g', lbl: 'Carbs', icon: '🌾' }].map(s => (
                    <div key={s.lbl} style={{ background: '#fff', border: `0.5px solid ${pkb}`, borderRadius: 14, padding: '12px 10px', textAlign: 'center' }}>
                      <div style={{ fontSize: 18, marginBottom: 2 }}>{s.icon}</div>
                      <div style={{ fontSize: 20, fontWeight: 600, color: pk }}>{s.val}</div>
                      <div style={{ fontSize: 11, color: '#aaa', marginTop: 2 }}>{s.lbl}</div>
                    </div>
                  ))}
                </div>
                <div style={{ background: pkm, border: `0.5px solid ${pkb}`, borderRadius: 14, padding: '1rem 1.25rem', marginBottom: '1.25rem' }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: pkd, marginBottom: 5 }}>💡 Phase tip</div>
                  <div style={{ fontSize: 13, color: pkt, lineHeight: 1.6 }}>{mealPlan.phase_tip}</div>
                </div>
                <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 6, marginBottom: '1.25rem' }}>
                  {mealPlan.days.map((d, i) => (
                    <button key={i} className={`day-tab ${mealDay === i ? 'active' : ''}`} onClick={() => setMealDay(i)}>{d.day.slice(0, 3)}</button>
                  ))}
                </div>
                {mealPlan.days[mealDay].meals.map((m, i) => (
                  <div key={i} style={{ background: '#fff', border: `0.5px solid ${pkb}`, borderRadius: 16, marginBottom: 14, overflow: 'hidden' }}>
                    <img className="meal-img" src={getMealImage(m.name)} alt={m.name} onError={e => { e.target.src = FOOD_IMAGES.default; }} />
                    <div style={{ padding: '1rem 1.25rem' }}>
                      <div style={{ fontSize: 11, fontWeight: 600, color: pkt, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 4 }}>{m.type}</div>
                      <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 6, color: '#111' }}>{m.name}</div>
                      <div style={{ fontSize: 13, color: '#666', lineHeight: 1.7, marginBottom: 10 }}>{m.description}</div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                        {(m.tags || []).map(t => <span key={t} style={{ padding: '4px 12px', borderRadius: 20, fontSize: 12, background: pkl, border: `0.5px solid ${pkb}`, color: pkt, fontWeight: 500 }}>{t}</span>)}
                      </div>
                    </div>
                  </div>
                ))}
                <button className="outline-btn" onClick={() => setMealScreen('setup')}>← Adjust settings</button>
              </div>
            )}
          </div>
        )}

        {/* WORKOUTS */}
        {page === 'workouts' && (
          <div className="fade-in">
            {workoutScreen === 'setup' && (
              <div>
                <div style={{ fontSize: 22, fontWeight: 600, marginBottom: '0.3rem', color: '#111' }}>💪 Workout planner</div>
                <div style={{ fontSize: 14, color: '#888', marginBottom: '1.5rem', lineHeight: 1.6 }}>A cycle-synced 7-day workout schedule with exercise diagrams.</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  {[
                    { label: 'PCOS type', key: 'type', opts: [['insulin', 'Insulin-resistant'], ['adrenal', 'Adrenal'], ['inflammatory', 'Inflammatory'], ['postpill', 'Post-pill']] },
                    { label: 'Cycle phase', key: 'phase', opts: [['follicular', 'Follicular'], ['ovulatory', 'Ovulatory'], ['luteal', 'Luteal'], ['menstrual', 'Menstrual']] },
                    { label: 'Fitness level', key: 'fitness', opts: [['beginner', 'Beginner'], ['intermediate', 'Intermediate'], ['advanced', 'Advanced']] },
                    { label: 'Session length', key: 'duration', opts: [['20–30 minutes', '20–30 min'], ['30–45 minutes', '30–45 min'], ['45–60 minutes', '45–60 min']] },
                    { label: 'Goal', key: 'goal', opts: [['lose fat', 'Lose fat'], ['build muscle', 'Build muscle'], ['balance hormones', 'Balance hormones'], ['reduce stress', 'Reduce stress']] }
                  ].map(f => (
                    <div key={f.key} style={{ marginBottom: '1rem' }}>
                      <label style={{ fontSize: 13, fontWeight: 500, color: pkt, marginBottom: 6, display: 'block' }}>{f.label}</label>
                      <select value={workoutSetup[f.key]} onChange={e => setWorkoutSetup(prev => ({ ...prev, [f.key]: e.target.value }))}>
                        {f.opts.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                      </select>
                    </div>
                  ))}
                </div>
                <label style={{ fontSize: 13, fontWeight: 500, color: pkt, marginBottom: 8, display: 'block' }}>Equipment</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: '1.25rem' }}>
                  {['No equipment', 'Dumbbells', 'Resistance bands', 'Gym access', 'Yoga mat'].map(e => (
                    <button key={e} className={`chip ${workoutSetup.equipment.includes(e) ? 'on' : ''}`} onClick={() => toggleEquipment(e)}>{e}</button>
                  ))}
                </div>
                <button className="pink-btn" onClick={genWorkouts}>Generate workout plan →</button>
                <p style={{ fontSize: 12, color: pkt, marginTop: 8, textAlign: 'center' }}>Powered by AI</p>
              </div>
            )}
            {workoutScreen === 'loading' && (
              <div style={{ textAlign: 'center', padding: '4rem 1rem' }}>
                <div style={{ width: 48, height: 48, border: `3px solid ${pkb}`, borderTopColor: pk, borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 1.25rem' }} />
                <div style={{ fontSize: 15, color: pkt, fontWeight: 500 }}>{loadingMsg}</div>
              </div>
            )}
            {workoutScreen === 'result' && workoutPlan && (
              <div className="fade-in">
                <div style={{ display: 'inline-block', padding: '4px 14px', borderRadius: 20, fontSize: 12, fontWeight: 500, background: pkm, color: pkd, marginBottom: '0.75rem', border: `0.5px solid ${pkb}` }}>{typeLabel[workoutSetup.type]} PCOS · {workoutSetup.phase} phase</div>
                <div style={{ fontSize: 20, fontWeight: 600, marginBottom: '0.25rem', color: '#111' }}>{workoutPlan.title}</div>
                <div style={{ fontSize: 13, color: '#888', lineHeight: 1.6, marginBottom: '1.25rem' }}>{workoutPlan.subtitle}</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8, marginBottom: '1.25rem' }}>
                  {[{ val: workoutPlan.active_days, lbl: 'Active days', icon: '🔥' }, { val: workoutPlan.rest_days, lbl: 'Rest days', icon: '😴' }, { val: workoutPlan.avg_duration, lbl: 'Avg session', icon: '⏱' }].map(s => (
                    <div key={s.lbl} style={{ background: '#fff', border: `0.5px solid ${pkb}`, borderRadius: 14, padding: '12px 10px', textAlign: 'center' }}>
                      <div style={{ fontSize: 18, marginBottom: 2 }}>{s.icon}</div>
                      <div style={{ fontSize: 20, fontWeight: 600, color: pk }}>{s.val}</div>
                      <div style={{ fontSize: 11, color: '#aaa', marginTop: 2 }}>{s.lbl}</div>
                    </div>
                  ))}
                </div>
                <div style={{ background: pkm, border: `0.5px solid ${pkb}`, borderRadius: 14, padding: '1rem 1.25rem', marginBottom: '1.25rem' }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: pkd, marginBottom: 5 }}>💡 Phase tip</div>
                  <div style={{ fontSize: 13, color: pkt, lineHeight: 1.6 }}>{workoutPlan.phase_tip}</div>
                </div>
                <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 6, marginBottom: '1.25rem' }}>
                  {workoutPlan.days.map((d, i) => (
                    <button key={i} className={`day-tab ${workoutDay === i ? 'active' : ''}`} onClick={() => setWorkoutDay(i)}>{d.day.slice(0, 3)}</button>
                  ))}
                </div>
                {workoutPlan.days[workoutDay].is_rest ? (
                  <div style={{ background: '#fff', border: `0.5px dashed ${pkb}`, borderRadius: 16, padding: '1.5rem', textAlign: 'center' }}>
                    <div style={{ fontSize: 40, marginBottom: '0.75rem' }}>😴</div>
                    <div style={{ fontSize: 17, fontWeight: 600, marginBottom: 6, color: '#111' }}>{workoutPlan.days[workoutDay].name}</div>
                    <div style={{ fontSize: 14, color: '#666', lineHeight: 1.6 }}>{workoutPlan.days[workoutDay].description}</div>
                  </div>
                ) : (
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                      <div style={{ fontSize: 16, fontWeight: 600, color: '#111' }}>{workoutPlan.days[workoutDay].name}</div>
                      <span style={{ padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 500, background: workoutPlan.days[workoutDay].intensity === 'high' ? '#FCEBEB' : workoutPlan.days[workoutDay].intensity === 'moderate' ? '#FEF3E2' : '#E8F7F1', color: workoutPlan.days[workoutDay].intensity === 'high' ? '#A32D2D' : workoutPlan.days[workoutDay].intensity === 'moderate' ? '#7A4F00' : '#0F6E56' }}>{workoutPlan.days[workoutDay].intensity} intensity</span>
                    </div>
                    <div style={{ fontSize: 14, color: '#666', lineHeight: 1.6, marginBottom: '1.25rem' }}>{workoutPlan.days[workoutDay].description}</div>
                    {(workoutPlan.days[workoutDay].exercises || []).map((e, i) => (
                      <div key={i} className="ex-card">
                        <div className="ex-icon">{getExerciseIcon(e.name)}</div>
                        <div className="ex-body">
                          <div className="ex-name">{e.name}</div>
                          <div className="ex-sets">📋 {e.sets_reps}</div>
                          {e.muscle_group && <span className="ex-muscle">💪 {e.muscle_group}</span>}
                        </div>
                      </div>
                    ))}
                    <div style={{ display: 'flex', gap: 8, marginTop: '0.75rem', flexWrap: 'wrap' }}>
                      <span style={{ padding: '5px 12px', borderRadius: 12, fontSize: 12, background: pkl, border: `0.5px solid ${pkb}`, color: pkt }}>⏱ {workoutPlan.days[workoutDay].duration_min} min</span>
                      <span style={{ padding: '5px 12px', borderRadius: 12, fontSize: 12, background: pkl, border: `0.5px solid ${pkb}`, color: pkt }}>🧘 {workoutPlan.days[workoutDay].cooldown}</span>
                    </div>
                  </div>
                )}
                <button className="outline-btn" onClick={() => setWorkoutScreen('setup')} style={{ marginTop: '1.25rem' }}>← Adjust settings</button>
              </div>
            )}
          </div>
        )}

        {/* TRACKER */}
        {page === 'tracker' && (
          <div className="fade-in">
            <div style={{ fontSize: 22, fontWeight: 600, marginBottom: '0.25rem', color: '#111' }}>📊 Daily tracker</div>
            <div style={{ fontSize: 14, color: '#888', marginBottom: '1.25rem' }}>Log your symptoms, mood, and energy every day.</div>
            <div className="card">
              <div className="section-title">Today — {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</div>
              <label style={{ fontSize: 13, fontWeight: 500, color: pkt, marginBottom: 8, display: 'block' }}>How are you feeling?</label>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: '1.25rem' }}>
                {['😊 Great', '😐 Okay', '😔 Low', '😤 Anxious', '😴 Exhausted'].map(m => (
                  <button key={m} onClick={() => setTodayLog(prev => ({ ...prev, mood: m }))} style={{ padding: '9px 14px', border: todayLog.mood === m ? `1.5px solid ${pk}` : `0.5px solid ${pkb}`, borderRadius: 20, fontSize: 13, background: todayLog.mood === m ? pkm : '#fff', cursor: 'pointer', fontFamily: 'inherit', fontWeight: todayLog.mood === m ? 500 : 400 }}>{m}</button>
                ))}
              </div>
              <label style={{ fontSize: 13, fontWeight: 500, color: pkt, marginBottom: 6, display: 'block' }}>Energy level — {todayLog.energy}/10</label>
              <input type="range" min="1" max="10" value={todayLog.energy} onChange={e => setTodayLog(prev => ({ ...prev, energy: parseInt(e.target.value) }))} style={{ marginBottom: '1.25rem' }} />
              <label style={{ fontSize: 13, fontWeight: 500, color: pkt, marginBottom: 6, display: 'block' }}>Bloating — {todayLog.bloating}/10</label>
              <input type="range" min="1" max="10" value={todayLog.bloating} onChange={e => setTodayLog(prev => ({ ...prev, bloating: parseInt(e.target.value) }))} style={{ marginBottom: '1.25rem' }} />
              <label style={{ fontSize: 13, fontWeight: 500, color: pkt, marginBottom: 8, display: 'block' }}>Symptoms today</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: '1.25rem' }}>
                {['Cramps', 'Headache', 'Acne', 'Cravings', 'Brain fog', 'Hair loss', 'Insomnia', 'Joint pain'].map(s => (
                  <button key={s} onClick={() => setTodayLog(prev => ({ ...prev, symptoms: prev.symptoms.includes(s) ? prev.symptoms.filter(x => x !== s) : [...prev.symptoms, s] }))} className={`chip ${todayLog.symptoms.includes(s) ? 'on' : ''}`}>{s}</button>
                ))}
              </div>
              <label style={{ fontSize: 13, fontWeight: 500, color: pkt, marginBottom: 6, display: 'block' }}>Notes</label>
              <textarea value={todayLog.notes} onChange={e => setTodayLog(prev => ({ ...prev, notes: e.target.value }))} placeholder="Anything else to log…" rows={2} style={{ resize: 'none', marginBottom: '1.25rem' }} />
              <button className="pink-btn" onClick={saveLog}>Save today's log ✓</button>
            </div>
            {logs.length > 0 && (
              <div>
                <div className="section-title" style={{ marginTop: '1rem' }}>Recent logs</div>
                {logs.slice(0, 5).map((l, i) => (
                  <div key={i} className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 500 }}>{l.date}</div>
                      <div style={{ fontSize: 12, color: pkt, marginTop: 2 }}>{l.mood} · Energy {l.energy}/10</div>
                    </div>
                    <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>{l.symptoms.slice(0, 3).map(s => <span key={s} style={{ padding: '2px 8px', borderRadius: 10, fontSize: 11, background: pkm, color: pkd, fontWeight: 500 }}>{s}</span>)}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* SUBSCRIPTION */}
        {page === 'subscription' && (
          <div className="fade-in">
            <div style={{ textAlign: 'center', padding: '1.5rem 0 1rem' }}>
              <div style={{ fontSize: 48, marginBottom: '0.75rem' }}>✨</div>
              <div style={{ fontSize: 24, fontWeight: 600, color: pkd, marginBottom: '0.5rem' }}>Upgrade Hormonize</div>
              <div style={{ fontSize: 14, color: pkt, lineHeight: 1.7, maxWidth: 380, margin: '0 auto 1.5rem' }}>Unlock unlimited AI plans, advanced tracking, and your full hormonal wellness toolkit.</div>
            </div>
            <div style={{ display: 'flex', background: pkm, borderRadius: 20, padding: 4, marginBottom: '1.25rem', border: `0.5px solid ${pkb}` }}>
              {[['monthly', 'Monthly'], ['annual', 'Annual — Save 40%']].map(([val, lbl]) => (
                <button key={val} onClick={() => setBilling(val)} style={{ flex: 1, padding: 9, borderRadius: 16, border: billing === val ? `0.5px solid ${pkb}` : 'none', background: billing === val ? '#fff' : 'none', fontSize: 13, cursor: 'pointer', color: pkd, fontWeight: billing === val ? 600 : 400, fontFamily: 'inherit' }}>{lbl}</button>
              ))}
            </div>
            {[
              { key: 'free', name: 'Free', emoji: '🌱', features: [{ y: true, t: 'PCOS assessment' }, { y: true, t: '1 meal plan/month' }, { y: false, t: 'Unlimited AI plans' }, { y: false, t: 'Daily symptom tracker' }], btn: 'Current plan', primary: false },
              { key: 'basic', name: 'Basic', emoji: '🌸', features: [{ y: true, t: 'PCOS assessment' }, { y: true, t: '4 meal plans/month' }, { y: true, t: 'Daily symptom tracker' }, { y: false, t: 'Unlimited AI plans' }], btn: 'Start free trial', primary: false },
              { key: 'pro', name: 'Pro', emoji: '✨', features: [{ y: true, t: 'PCOS assessment' }, { y: true, t: 'Unlimited meal plans' }, { y: true, t: 'Daily symptom tracker' }, { y: true, t: 'Unlimited AI plans' }], btn: 'Upgrade to Pro', primary: true, popular: true }
            ].map(t => (
              <div key={t.key} style={{ background: '#fff', border: t.primary ? `2px solid ${pk}` : `0.5px solid ${pkb}`, borderRadius: 20, padding: '1.5rem', marginBottom: 12, position: 'relative', boxShadow: t.primary ? `0 8px 24px rgba(196,104,126,0.15)` : 'none' }}>
                {t.popular && <div style={{ position: 'absolute', top: 16, right: 16, padding: '3px 12px', borderRadius: 20, fontSize: 11, fontWeight: 600, background: pk, color: '#fff' }}>Most popular</div>}
                <div style={{ fontSize: 24, marginBottom: '0.25rem' }}>{t.emoji}</div>
                <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 4 }}>{t.name}</div>
                <div style={{ fontSize: 30, fontWeight: 700, color: pk }}>${prices[billing][t.key].toFixed(2)}<span style={{ fontSize: 15, fontWeight: 400, color: '#888' }}>/mo</span></div>
                <div style={{ fontSize: 12, color: '#aaa', marginBottom: '1.25rem' }}>{billing === 'annual' && t.key !== 'free' ? `Billed $${(prices[billing][t.key] * 12).toFixed(2)}/year` : 'Billed monthly'}</div>
                <div style={{ marginBottom: '1.25rem' }}>{t.features.map((f, i) => <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, color: f.y ? '#111' : '#ccc', marginBottom: 8 }}><span style={{ fontSize: 16 }}>{f.y ? '✅' : '⭕'}</span>{f.t}</div>)}</div>
                <button onClick={() => { if (t.key !== 'free') { setPlan(t.key); alert(`${t.name} plan activated!`); } }} style={{ width: '100%', padding: 13, borderRadius: 14, fontSize: 14, fontWeight: 600, cursor: 'pointer', border: 'none', background: t.primary ? pk : pkm, color: t.primary ? '#fff' : pkd, fontFamily: 'inherit' }}>{t.btn}</button>
              </div>
            ))}
            <div style={{ background: pkm, border: `0.5px solid ${pkb}`, borderRadius: 20, padding: '1.5rem', marginBottom: '1rem' }}>
              <div style={{ fontSize: 16, fontWeight: 600, color: pkd, marginBottom: '1rem' }}>📊 Revenue estimator</div>
              <div style={{ fontSize: 13, color: pkt, marginBottom: 6 }}>Subscribers: <strong>{subCount.toLocaleString()}</strong></div>
              <input type="range" min="50" max="10000" value={subCount} step="50" onChange={e => setSubCount(parseInt(e.target.value))} style={{ marginBottom: '1rem' }} />
              <div style={{ fontSize: 13, color: pkt, marginBottom: 6 }}>Pro subscribers: <strong>{proPct}%</strong></div>
              <input type="range" min="10" max="90" value={proPct} step="5" onChange={e => setProPct(parseInt(e.target.value))} style={{ marginBottom: '1.25rem' }} />
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8 }}>
                {[{ val: `$${rev.mrr.toLocaleString()}`, lbl: 'Monthly', icon: '💰' }, { val: `$${rev.arr.toLocaleString()}`, lbl: 'Annual', icon: '📈' }, { val: `$${rev.yr3}K`, lbl: '3-year est.', icon: '🚀' }].map(s => (
                  <div key={s.lbl} style={{ background: '#fff', borderRadius: 12, padding: '10px 8px', textAlign: 'center' }}>
                    <div style={{ fontSize: 16, marginBottom: 2 }}>{s.icon}</div>
                    <div style={{ fontSize: 17, fontWeight: 700, color: pk }}>{s.val}</div>
                    <div style={{ fontSize: 10, color: '#aaa', marginTop: 1 }}>{s.lbl}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* PROFILE */}
        {page === 'profile' && (
          <div className="fade-in">
            <div style={{ width: 72, height: 72, borderRadius: '50%', background: `linear-gradient(135deg,${pk},${pkd})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, fontWeight: 700, color: '#fff', margin: '0 auto 0.75rem' }}>{userName ? userName.charAt(0).toUpperCase() : '🌸'}</div>
            <div style={{ fontSize: 20, fontWeight: 600, textAlign: 'center', marginBottom: '0.25rem' }}>{userName || 'Set up your profile'}</div>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}><div style={{ padding: '4px 14px', borderRadius: 20, fontSize: 12, fontWeight: 500, background: pkm, color: pkd, border: `0.5px solid ${pkb}` }}>{plan === 'pro' ? '✨ Pro plan' : plan === 'basic' ? '🌸 Basic plan' : '🌱 Free plan'}</div></div>
            <div className="card" style={{ padding: '0 1.25rem' }}>
              {[
                { label: '🧬 Take PCOS assessment', sub: 'Identify your type', action: () => goPage('quiz') },
                { label: '📊 Daily tracker', sub: 'View your logs', action: () => goPage('tracker') },
                { label: '✨ Upgrade to Pro', sub: 'Unlock all features', action: () => goPage('subscription'), pink: true }
              ].map((item, i) => (
                <div key={i} onClick={item.action} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 0', borderBottom: i < 2 ? `0.5px solid ${pkb}` : 'none', cursor: 'pointer' }}>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 500, color: item.pink ? pk : '#111' }}>{item.label}</div>
                    <div style={{ fontSize: 12, color: '#888', marginTop: 2 }}>{item.sub}</div>
                  </div>
                  <span style={{ color: pkb, fontSize: 20 }}>›</span>
                </div>
              ))}
            </div>
            <div style={{ fontSize: 12, color: '#aaa', textAlign: 'center', marginTop: '1.5rem' }}>Hormonize · Educational use only · Always consult your doctor</div>
          </div>
        )}
      </div>

      {/* NAV BAR */}
      <div style={{ background: '#fff', borderTop: `0.5px solid ${pkb}`, display: 'flex', position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: '100%', maxWidth: 680, zIndex: 20 }}>
        {[
          { label: 'Home', p: 'home', icon: '🏠' },
          { label: 'Quiz', p: 'quiz', icon: '🧬' },
          { label: 'Meals', p: 'meals', icon: '🥗' },
          { label: 'Workouts', p: 'workouts', icon: '💪' },
          { label: 'Tracker', p: 'tracker', icon: '📊' },
          { label: 'Upgrade', p: 'subscription', icon: '✨' },
          { label: 'Profile', p: 'profile', icon: '👤' }
        ].map(n => (
          <button key={n.p} className="nav-btn" onClick={() => goPage(n.p)} style={{ color: page === n.p ? pk : '#bbb' }}>
            <span style={{ fontSize: 20 }}>{n.icon}</span>
            <span style={{ fontSize: 9, fontWeight: page === n.p ? 600 : 400 }}>{n.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}