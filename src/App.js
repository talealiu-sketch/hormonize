import React, { useState } from 'react';
import './App.css';

const PCOS_TYPES = {
  insulin: {
    name: 'Insulin-resistant PCOS',
    badge: 'Most common type',
    desc: 'Your body over-produces insulin, signaling your ovaries to make more androgens. This type responds very well to targeted diet and strength training.',
    symptoms: ['Belly weight gain', 'Sugar cravings', 'Energy crashes', 'Irregular periods'],
    tip: 'Prioritize protein and fiber at every meal to keep blood sugar stable. Strength training 3x/week significantly improves insulin sensitivity.'
  },
  adrenal: {
    name: 'Adrenal PCOS',
    badge: 'Stress-driven type',
    desc: 'Your adrenal glands over-produce androgens in response to chronic stress. High-intensity exercise can worsen this type.',
    symptoms: ['High stress', 'Fatigue despite sleep', 'Acne and hair loss', 'Slim but symptomatic'],
    tip: 'Stress management is your treatment. Never skip meals. Yoga and walking are more healing than intense workouts.'
  },
  inflammatory: {
    name: 'Inflammatory PCOS',
    badge: 'Gut & immune-driven',
    desc: 'Chronic low-grade inflammation is triggering your ovaries to overproduce androgens. Healing your gut is the most powerful lever.',
    symptoms: ['Bloating and gut issues', 'Brain fog', 'Joint pain', 'Food sensitivities'],
    tip: 'Try eliminating gluten and dairy for 6 weeks. Load up on omega-3s, turmeric, and fermented foods.'
  },
  postpill: {
    name: 'Post-pill PCOS',
    badge: 'Temporary & reversible',
    desc: 'Your hormones are recalibrating after stopping birth control. This type often resolves in 3-6 months with the right support.',
    symptoms: ['Irregular after stopping pill', 'Acne flare-up', 'Normal weight', 'Previously regular cycle'],
    tip: 'Support your liver with cruciferous vegetables, zinc-rich foods, and B vitamins. Try seed cycling.'
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

  async function callClaude(prompt, onSuccess, onError) {
    const msgs = ['Analyzing your profile…', 'Building your personalized plan…', 'Syncing to your cycle phase…', 'Almost ready…'];
    let i = 0;
    setLoadingMsg(msgs[0]);
    const iv = setInterval(() => { i = (i + 1) % msgs.length; setLoadingMsg(msgs[i]); }, 2000);
    try {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-api-key': process.env.REACT_APP_ANTHROPIC_KEY, 'anthropic-version': '2023-06-01', 'anthropic-dangerous-direct-browser-access': 'true' },
        body: JSON.stringify({ model: 'claude-sonnet-4-6', max_tokens: 4000, messages: [{ role: 'user', content: prompt }] })
      });
      const data = await res.json();
      clearInterval(iv);
      const text = data.content.filter(b => b.type === 'text').map(b => b.text).join('');
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
    await callClaude(prompt, (data) => { setMealPlan(data); setMealDay(0); setMealScreen('result'); }, () => setMealScreen('setup'));
  }

  async function genWorkouts() {
    setWorkoutScreen('loading');
    const { type, phase: p, fitness, duration, goal, equipment } = workoutSetup;
    const prompt = `You are a certified personal trainer specializing in PCOS. Create a 7-day cycle-synced workout plan for: PCOS type: ${type}, Cycle phase: ${p}, Fitness: ${fitness}, Duration: ${duration}, Goal: ${goal}, Equipment: ${equipment.join(', ')}. Return ONLY valid JSON no markdown: {"title":"","subtitle":"","phase_tip":"","active_days":0,"rest_days":0,"avg_duration":"","days":[{"day":"Monday","is_rest":false,"workout_type":"","intensity":"low","name":"","description":"2 sentences","exercises":[{"name":"","sets_reps":""}],"duration_min":0,"cooldown":""}]}. 7 days Monday–Sunday. Rest days is_rest:true exercises:[]. Min 1-2 rest days.`;
    await callClaude(prompt, (data) => { setWorkoutPlan(data); setWorkoutDay(0); setWorkoutScreen('result'); }, () => setWorkoutScreen('setup'));
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
    <div style={{ maxWidth: 680, margin: '0 auto', background: '#FDF0F3', minHeight: '100vh', fontFamily: 'system-ui, sans-serif' }}>

      {/* TOPBAR */}
      <div style={{ background: '#fff', borderBottom: '0.5px solid #F0B8C8', padding: '0 1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 56, position: 'sticky', top: 0, zIndex: 20 }}>
        <div style={{ fontSize: 20, fontWeight: 500, color: '#C4687E', display: 'flex', alignItems: 'center', gap: 7 }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#C4687E' }} />
          Hormonize
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 500, background: '#F7D6DF', color: '#8B3A50', border: '0.5px solid #F0B8C8' }}>{plan === 'pro' ? 'Pro' : plan === 'basic' ? 'Basic' : 'Free'}</div>
          <div onClick={() => goPage('profile')} style={{ width: 30, height: 30, borderRadius: '50%', background: '#F7D6DF', border: '0.5px solid #F0B8C8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 500, color: '#8B3A50', cursor: 'pointer' }}>{userName ? userName.charAt(0).toUpperCase() : '?'}</div>
        </div>
      </div>

      {/* PAGES */}
      <div style={{ padding: '1.25rem', paddingBottom: 90 }}>

        {/* HOME */}
        {page === 'home' && (
          <div>
            <div style={{ background: 'linear-gradient(135deg,#FDF0F3,#F7D6DF)', border: '0.5px solid #F0B8C8', borderRadius: 20, padding: '1.75rem 1.5rem', marginBottom: '1.25rem', textAlign: 'center' }}>
              <div style={{ fontSize: 38, color: '#C4687E', marginBottom: '0.6rem' }}>♡</div>
              <div style={{ fontSize: 24, fontWeight: 500, color: '#6B2438', marginBottom: '0.4rem' }}>Welcome to Hormonize</div>
              <div style={{ fontSize: 14, color: '#8B3A50', lineHeight: 1.6, maxWidth: 380, margin: '0 auto 1.25rem' }}>Your personalized PCOS wellness companion — track your cycle, get AI meal plans, and workouts made for your hormones.</div>
              <button onClick={() => goPage('quiz')} style={{ background: '#C4687E', border: 'none', borderRadius: 14, padding: '13px 32px', color: '#fff', fontSize: 15, fontWeight: 500, cursor: 'pointer' }}>Take my assessment →</button>
            </div>
            <div style={{ fontSize: 12, fontWeight: 500, color: '#8B3A50', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.75rem' }}>Your cycle phase</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: '1.25rem' }}>
              {[{ key: 'follicular', name: 'Follicular', days: 'Day 1–13', tip: 'Rising energy. Great for strength.', bg: '#E8F7F1', color: '#0F6E56' }, { key: 'ovulatory', name: 'Ovulatory', days: 'Day 14–16', tip: 'Peak performance window.', bg: '#F7D6DF', color: '#6B2438' }, { key: 'luteal', name: 'Luteal', days: 'Day 17–28', tip: 'Slow down and prioritize rest.', bg: '#FEF3E2', color: '#7A4F00' }, { key: 'menstrual', name: 'Menstrual', days: 'Period', tip: 'Rest deeply. Gentle movement.', bg: '#E8F0FB', color: '#1A4F8A' }].map(ph => (
                <div key={ph.key} onClick={() => selectPhase(ph.key)} style={{ padding: '12px 14px', borderRadius: 14, border: phase === ph.key ? '1.5px solid #C4687E' : '0.5px solid transparent', background: ph.bg, cursor: 'pointer' }}>
                  <div style={{ fontSize: 12, fontWeight: 500, color: ph.color, marginBottom: 2 }}>{ph.name}</div>
                  <div style={{ fontSize: 11, opacity: 0.7, marginBottom: 3 }}>{ph.days}</div>
                  <div style={{ fontSize: 12, lineHeight: 1.4, opacity: 0.85 }}>{ph.tip}</div>
                </div>
              ))}
            </div>
            <div style={{ fontSize: 12, fontWeight: 500, color: '#8B3A50', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.75rem' }}>Quick access</div>
            {[{ label: 'PCOS assessment', sub: 'Identify your type in 3 minutes', page: 'quiz' }, { label: 'Meal plan generator', sub: '7-day hormone-synced nutrition', page: 'meals' }, { label: 'Workout planner', sub: 'Cycle-synced exercise week', page: 'workouts' }, { label: 'Daily tracker', sub: 'Log symptoms, mood, and energy', page: 'tracker' }].map(item => (
              <div key={item.page} onClick={() => goPage(item.page)} style={{ background: '#fff', border: '0.5px solid #F0B8C8', borderRadius: 16, padding: '1.1rem 1.25rem', marginBottom: 10, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 500 }}>{item.label}</div>
                  <div style={{ fontSize: 13, color: '#888', marginTop: 3 }}>{item.sub}</div>
                </div>
                <span style={{ color: '#F0B8C8' }}>›</span>
              </div>
            ))}
          </div>
        )}

        {/* QUIZ */}
        {page === 'quiz' && (
          <div>
            {quizStep === 'intro' && (
              <div style={{ textAlign: 'center', padding: '2rem 0' }}>
                <div style={{ fontSize: 36, color: '#C4687E', marginBottom: '1rem' }}>♡</div>
                <div style={{ fontSize: 22, fontWeight: 500, color: '#6B2438', marginBottom: '0.5rem' }}>PCOS assessment</div>
                <div style={{ fontSize: 14, color: '#888', lineHeight: 1.7, maxWidth: 380, margin: '0 auto 1.5rem' }}>12 questions about your symptoms and lifestyle. We'll identify your PCOS type and sync everything to your hormones.</div>
                <button onClick={() => setQuizStep('q')} style={{ background: '#C4687E', border: 'none', borderRadius: 14, padding: '13px 32px', color: '#fff', fontSize: 15, fontWeight: 500, cursor: 'pointer' }}>Start assessment →</button>
                <p style={{ fontSize: 12, color: '#C4687E', marginTop: 10 }}>Educational only · Not medical advice</p>
              </div>
            )}
            {quizStep === 'q' && (
              <div>
                <div style={{ height: 4, background: '#F0B8C8', borderRadius: 2, marginBottom: '1.25rem' }}>
                  <div style={{ height: 4, background: '#C4687E', borderRadius: 2, width: `${Math.round(((qCurrent + 1) / QUESTIONS.length) * 100)}%`, transition: 'width 0.4s' }} />
                </div>
                <div style={{ fontSize: 12, color: '#C4687E', marginBottom: '0.5rem' }}>Question {qCurrent + 1} of {QUESTIONS.length}</div>
                <div style={{ fontSize: 18, fontWeight: 500, marginBottom: '0.4rem', lineHeight: 1.4 }}>{q.q}</div>
                {q.sub && <div style={{ fontSize: 13, color: '#888', marginBottom: '1rem' }}>{q.sub}</div>}
                {q.type === 'text' && (
                  <input type="text" value={answers[q.id] || ''} onChange={e => setAnswers(prev => ({ ...prev, [q.id]: e.target.value }))} placeholder={q.placeholder} style={{ width: '100%', padding: '11px 14px', border: '0.5px solid #F0B8C8', borderRadius: 12, fontSize: 14, marginBottom: '1rem' }} />
                )}
                {q.type === 'single' && q.opts.map((o, i) => (
                  <button key={i} onClick={() => selectQ(i)} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', border: answers[q.id] === i ? '1.5px solid #C4687E' : '0.5px solid #F0B8C8', borderRadius: 14, background: answers[q.id] === i ? '#F7D6DF' : '#fff', cursor: 'pointer', textAlign: 'left', width: '100%', marginBottom: 8, fontSize: 14 }}>
                    <div style={{ width: 17, height: 17, borderRadius: '50%', border: answers[q.id] === i ? '5px solid #C4687E' : '1.5px solid #F0B8C8', flexShrink: 0 }} />
                    {o}
                  </button>
                ))}
                {q.type === 'multi' && q.opts.map((o, i) => (
                  <button key={i} onClick={() => toggleMulti(i)} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', border: (multi[q.id] || []).includes(i) ? '1.5px solid #C4687E' : '0.5px solid #F0B8C8', borderRadius: 14, background: (multi[q.id] || []).includes(i) ? '#F7D6DF' : '#fff', cursor: 'pointer', textAlign: 'left', width: '100%', marginBottom: 8, fontSize: 14 }}>
                    <div style={{ width: 17, height: 17, borderRadius: 4, border: (multi[q.id] || []).includes(i) ? '5px solid #C4687E' : '1.5px solid #F0B8C8', flexShrink: 0 }} />
                    {o}
                  </button>
                ))}
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1.25rem' }}>
                  <button onClick={() => setQCurrent(c => Math.max(0, c - 1))} style={{ background: 'none', border: '0.5px solid #F0B8C8', borderRadius: 10, padding: '9px 16px', fontSize: 13, color: '#8B3A50', cursor: 'pointer', visibility: qCurrent === 0 ? 'hidden' : 'visible' }}>← Back</button>
                  {q.type !== 'single' && <button onClick={() => { if (qCurrent < QUESTIONS.length - 1) setQCurrent(c => c + 1); else finishQuiz(answers); }} disabled={q.type === 'text' && !(answers[q.id] || '').trim()} style={{ background: '#C4687E', border: 'none', borderRadius: 10, padding: '9px 22px', fontSize: 14, fontWeight: 500, color: '#fff', cursor: 'pointer' }}>Continue →</button>}
                </div>
              </div>
            )}
            {quizStep === 'result' && (() => {
              const info = PCOS_TYPES[pcosType];
              return (
                <div>
                  <div style={{ textAlign: 'center', padding: '1rem 0 1.25rem' }}>
                    <div style={{ display: 'inline-block', padding: '5px 16px', borderRadius: 20, fontSize: 13, fontWeight: 500, background: '#F7D6DF', color: '#6B2438', border: '0.5px solid #F0B8C8', marginBottom: '0.75rem' }}>{info.badge}</div>
                    <div style={{ fontSize: 21, fontWeight: 500, marginBottom: '0.4rem' }}>{userName ? `${userName}, you have ` : 'You have '}{info.name}</div>
                    <div style={{ fontSize: 13, color: '#888', lineHeight: 1.6 }}>{info.desc}</div>
                  </div>
                  <div style={{ background: '#fff', border: '0.5px solid #F0B8C8', borderRadius: 16, padding: '1.1rem 1.25rem', marginBottom: 10 }}>
                    <div style={{ fontSize: 12, fontWeight: 500, color: '#8B3A50', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>Your key symptoms</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>{info.symptoms.map(s => <span key={s} style={{ padding: '5px 12px', borderRadius: 20, fontSize: 13, background: '#F7D6DF', color: '#6B2438', border: '0.5px solid #F0B8C8' }}>{s}</span>)}</div>
                  </div>
                  <div style={{ background: '#F7D6DF', border: '0.5px solid #F0B8C8', borderRadius: 14, padding: '1rem 1.25rem', marginBottom: '1rem' }}>
                    <div style={{ fontSize: 12, fontWeight: 500, color: '#6B2438', marginBottom: 4 }}>Your key focus</div>
                    <div style={{ fontSize: 13, color: '#8B3A50', lineHeight: 1.6 }}>{info.tip}</div>
                  </div>
                  <button onClick={() => goPage('meals')} style={{ width: '100%', padding: 13, background: '#C4687E', border: 'none', borderRadius: 14, color: '#fff', fontSize: 14, fontWeight: 500, cursor: 'pointer', marginBottom: 8 }}>Build my meal plan →</button>
                  <button onClick={() => goPage('workouts')} style={{ width: '100%', padding: 13, background: '#F7D6DF', border: 'none', borderRadius: 14, color: '#6B2438', fontSize: 14, fontWeight: 500, cursor: 'pointer', marginBottom: 8 }}>Build my workout plan →</button>
                  <button onClick={resetQuiz} style={{ background: 'none', border: '0.5px solid #F0B8C8', borderRadius: 10, padding: '9px 16px', fontSize: 13, color: '#8B3A50', cursor: 'pointer', marginTop: 8 }}>← Retake quiz</button>
                </div>
              );
            })()}
          </div>
        )}

        {/* MEALS */}
        {page === 'meals' && (
          <div>
            {mealScreen === 'setup' && (
              <div>
                <div style={{ fontSize: 19, fontWeight: 500, marginBottom: '0.3rem' }}>Meal plan generator</div>
                <div style={{ fontSize: 13, color: '#888', marginBottom: '1.25rem', lineHeight: 1.6 }}>A full 7-day plan built for your PCOS type, cycle phase, and goal.</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  {[{ label: 'PCOS type', key: 'type', opts: [['insulin', 'Insulin-resistant'], ['adrenal', 'Adrenal'], ['inflammatory', 'Inflammatory'], ['postpill', 'Post-pill']] }, { label: 'Goal', key: 'goal', opts: [['lose weight', 'Lose weight'], ['gain weight', 'Gain weight'], ['maintain weight', 'Maintain'], ['balance hormones', 'Balance hormones']] }, { label: 'Cycle phase', key: 'phase', opts: [['follicular', 'Follicular'], ['ovulatory', 'Ovulatory'], ['luteal', 'Luteal'], ['menstrual', 'Menstrual']] }, { label: 'Meals per day', key: 'meals', opts: [['3', '3 meals'], ['3 meals and 1 snack', '3 + snack'], ['3 meals and 2 snacks', '3 + 2 snacks'], ['5 small meals', '5 small meals']] }].map(f => (
                    <div key={f.key}>
                      <label style={{ fontSize: 13, fontWeight: 500, color: '#8B3A50', marginBottom: 5, display: 'block' }}>{f.label}</label>
                      <select value={mealSetup[f.key]} onChange={e => setMealSetup(prev => ({ ...prev, [f.key]: e.target.value }))} style={{ width: '100%', padding: '10px 12px', border: '0.5px solid #F0B8C8', borderRadius: 12, fontSize: 14, background: '#fff', marginBottom: '1rem' }}>
                        {f.opts.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                      </select>
                    </div>
                  ))}
                </div>
                <label style={{ fontSize: 13, fontWeight: 500, color: '#8B3A50', marginBottom: 5, display: 'block' }}>Dietary restrictions</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7, marginBottom: '1rem' }}>
                  {['Gluten-free', 'Dairy-free', 'Vegetarian', 'Vegan', 'Low-carb', 'Nut-free'].map(r => (
                    <button key={r} onClick={() => toggleRestriction(r)} style={{ padding: '6px 13px', border: mealSetup.restrictions.includes(r) ? '1.5px solid #C4687E' : '0.5px solid #F0B8C8', borderRadius: 20, fontSize: 13, background: mealSetup.restrictions.includes(r) ? '#F7D6DF' : '#fff', color: mealSetup.restrictions.includes(r) ? '#6B2438' : '#8B3A50', cursor: 'pointer', fontWeight: mealSetup.restrictions.includes(r) ? 500 : 400 }}>{r}</button>
                  ))}
                </div>
                <label style={{ fontSize: 13, fontWeight: 500, color: '#8B3A50', marginBottom: 5, display: 'block' }}>Foods to avoid</label>
                <input type="text" value={mealSetup.dislikes} onChange={e => setMealSetup(prev => ({ ...prev, dislikes: e.target.value }))} placeholder="e.g. mushrooms, seafood…" style={{ width: '100%', padding: '11px 14px', border: '0.5px solid #F0B8C8', borderRadius: 12, fontSize: 14, marginBottom: '1rem' }} />
                <button onClick={genMeals} style={{ width: '100%', padding: 13, background: '#C4687E', border: 'none', borderRadius: 14, color: '#fff', fontSize: 15, fontWeight: 500, cursor: 'pointer' }}>Generate 7-day meal plan →</button>
                <p style={{ fontSize: 12, color: '#C4687E', marginTop: 8, textAlign: 'center' }}>Powered by Claude AI</p>
              </div>
            )}
            {mealScreen === 'loading' && (
              <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
                <div style={{ width: 36, height: 36, border: '3px solid #F0B8C8', borderTopColor: '#C4687E', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 1rem' }} />
                <div style={{ fontSize: 14, color: '#8B3A50' }}>{loadingMsg}</div>
                <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
              </div>
            )}
            {mealScreen === 'result' && mealPlan && (
              <div>
                <div style={{ display: 'inline-block', padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 500, background: '#F7D6DF', color: '#6B2438', marginBottom: '0.6rem', border: '0.5px solid #F0B8C8' }}>{typeLabel[mealSetup.type]} PCOS · {mealSetup.phase} phase</div>
                <div style={{ fontSize: 18, fontWeight: 500, marginBottom: '0.25rem' }}>{mealPlan.title}</div>
                <div style={{ fontSize: 13, color: '#888', lineHeight: 1.6, marginBottom: '1rem' }}>{mealPlan.subtitle}</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8, marginBottom: '1rem' }}>
                  {[{ val: Math.round(mealPlan.daily_calories), lbl: 'Cal/day' }, { val: Math.round(mealPlan.protein_g) + 'g', lbl: 'Protein' }, { val: Math.round(mealPlan.carbs_g) + 'g', lbl: 'Carbs' }].map(s => (
                    <div key={s.lbl} style={{ background: '#fff', border: '0.5px solid #F0B8C8', borderRadius: 12, padding: 10, textAlign: 'center' }}>
                      <div style={{ fontSize: 20, fontWeight: 500, color: '#C4687E' }}>{s.val}</div>
                      <div style={{ fontSize: 11, color: '#aaa', marginTop: 2 }}>{s.lbl}</div>
                    </div>
                  ))}
                </div>
                <div style={{ background: '#F7D6DF', border: '0.5px solid #F0B8C8', borderRadius: 14, padding: '1rem 1.25rem', marginBottom: '1rem' }}>
                  <div style={{ fontSize: 12, fontWeight: 500, color: '#6B2438', marginBottom: 4 }}>Phase tip</div>
                  <div style={{ fontSize: 13, color: '#8B3A50', lineHeight: 1.6 }}>{mealPlan.phase_tip}</div>
                </div>
                <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 4, marginBottom: '1rem' }}>
                  {mealPlan.days.map((d, i) => (
                    <button key={i} onClick={() => setMealDay(i)} style={{ flexShrink: 0, padding: '7px 14px', border: mealDay === i ? 'none' : '0.5px solid #F0B8C8', borderRadius: 20, fontSize: 13, background: mealDay === i ? '#C4687E' : '#fff', color: mealDay === i ? '#fff' : '#8B3A50', cursor: 'pointer', fontWeight: mealDay === i ? 500 : 400 }}>{d.day.slice(0, 3)}</button>
                  ))}
                </div>
                {mealPlan.days[mealDay].meals.map((m, i) => (
                  <div key={i} style={{ background: '#fff', border: '0.5px solid #F0B8C8', borderRadius: 14, padding: '1rem 1.25rem', marginBottom: 10 }}>
                    <div style={{ fontSize: 11, fontWeight: 500, color: '#8B3A50', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 3 }}>{m.type}</div>
                    <div style={{ fontSize: 15, fontWeight: 500, marginBottom: 4 }}>{m.name}</div>
                    <div style={{ fontSize: 13, color: '#888', lineHeight: 1.6, marginBottom: 8 }}>{m.description}</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>{(m.tags || []).map(t => <span key={t} style={{ padding: '3px 10px', borderRadius: 12, fontSize: 12, background: '#F7D6DF', border: '0.5px solid #F0B8C8', color: '#8B3A50' }}>{t}</span>)}</div>
                  </div>
                ))}
                <button onClick={() => setMealScreen('setup')} style={{ background: 'none', border: '0.5px solid #F0B8C8', borderRadius: 10, padding: '9px 16px', fontSize: 13, color: '#8B3A50', cursor: 'pointer', marginTop: '1rem' }}>← Adjust settings</button>
              </div>
            )}
          </div>
        )}

        {/* WORKOUTS */}
        {page === 'workouts' && (
          <div>
            {workoutScreen === 'setup' && (
              <div>
                <div style={{ fontSize: 19, fontWeight: 500, marginBottom: '0.3rem' }}>Workout planner</div>
                <div style={{ fontSize: 13, color: '#888', marginBottom: '1.25rem', lineHeight: 1.6 }}>A cycle-synced 7-day workout schedule tailored to your PCOS type.</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  {[{ label: 'PCOS type', key: 'type', opts: [['insulin', 'Insulin-resistant'], ['adrenal', 'Adrenal'], ['inflammatory', 'Inflammatory'], ['postpill', 'Post-pill']] }, { label: 'Cycle phase', key: 'phase', opts: [['follicular', 'Follicular'], ['ovulatory', 'Ovulatory'], ['luteal', 'Luteal'], ['menstrual', 'Menstrual']] }, { label: 'Fitness level', key: 'fitness', opts: [['beginner', 'Beginner'], ['intermediate', 'Intermediate'], ['advanced', 'Advanced']] }, { label: 'Session length', key: 'duration', opts: [['20–30 minutes', '20–30 min'], ['30–45 minutes', '30–45 min'], ['45–60 minutes', '45–60 min']] }, { label: 'Goal', key: 'goal', opts: [['lose fat', 'Lose fat'], ['build muscle', 'Build muscle'], ['balance hormones', 'Balance hormones'], ['reduce stress', 'Reduce stress']] }].map(f => (
                    <div key={f.key}>
                      <label style={{ fontSize: 13, fontWeight: 500, color: '#8B3A50', marginBottom: 5, display: 'block' }}>{f.label}</label>
                      <select value={workoutSetup[f.key]} onChange={e => setWorkoutSetup(prev => ({ ...prev, [f.key]: e.target.value }))} style={{ width: '100%', padding: '10px 12px', border: '0.5px solid #F0B8C8', borderRadius: 12, fontSize: 14, background: '#fff', marginBottom: '1rem' }}>
                        {f.opts.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                      </select>
                    </div>
                  ))}
                </div>
                <label style={{ fontSize: 13, fontWeight: 500, color: '#8B3A50', marginBottom: 5, display: 'block' }}>Equipment</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7, marginBottom: '1rem' }}>
                  {['No equipment', 'Dumbbells', 'Resistance bands', 'Gym access', 'Yoga mat'].map(e => (
                    <button key={e} onClick={() => toggleEquipment(e)} style={{ padding: '6px 13px', border: workoutSetup.equipment.includes(e) ? '1.5px solid #C4687E' : '0.5px solid #F0B8C8', borderRadius: 20, fontSize: 13, background: workoutSetup.equipment.includes(e) ? '#F7D6DF' : '#fff', color: workoutSetup.equipment.includes(e) ? '#6B2438' : '#8B3A50', cursor: 'pointer', fontWeight: workoutSetup.equipment.includes(e) ? 500 : 400 }}>{e}</button>
                  ))}
                </div>
                <button onClick={genWorkouts} style={{ width: '100%', padding: 13, background: '#C4687E', border: 'none', borderRadius: 14, color: '#fff', fontSize: 15, fontWeight: 500, cursor: 'pointer' }}>Generate workout plan →</button>
                <p style={{ fontSize: 12, color: '#C4687E', marginTop: 8, textAlign: 'center' }}>Powered by Claude AI</p>
              </div>
            )}
            {workoutScreen === 'loading' && (
              <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
                <div style={{ width: 36, height: 36, border: '3px solid #F0B8C8', borderTopColor: '#C4687E', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 1rem' }} />
                <div style={{ fontSize: 14, color: '#8B3A50' }}>{loadingMsg}</div>
              </div>
            )}
            {workoutScreen === 'result' && workoutPlan && (
              <div>
                <div style={{ display: 'inline-block', padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 500, background: '#F7D6DF', color: '#6B2438', marginBottom: '0.6rem', border: '0.5px solid #F0B8C8' }}>{typeLabel[workoutSetup.type]} PCOS · {workoutSetup.phase} phase</div>
                <div style={{ fontSize: 18, fontWeight: 500, marginBottom: '0.25rem' }}>{workoutPlan.title}</div>
                <div style={{ fontSize: 13, color: '#888', lineHeight: 1.6, marginBottom: '1rem' }}>{workoutPlan.subtitle}</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8, marginBottom: '1rem' }}>
                  {[{ val: workoutPlan.active_days, lbl: 'Active days' }, { val: workoutPlan.rest_days, lbl: 'Rest days' }, { val: workoutPlan.avg_duration, lbl: 'Avg session' }].map(s => (
                    <div key={s.lbl} style={{ background: '#fff', border: '0.5px solid #F0B8C8', borderRadius: 12, padding: 10, textAlign: 'center' }}>
                      <div style={{ fontSize: 20, fontWeight: 500, color: '#C4687E' }}>{s.val}</div>
                      <div style={{ fontSize: 11, color: '#aaa', marginTop: 2 }}>{s.lbl}</div>
                    </div>
                  ))}
                </div>
                <div style={{ background: '#F7D6DF', border: '0.5px solid #F0B8C8', borderRadius: 14, padding: '1rem 1.25rem', marginBottom: '1rem' }}>
                  <div style={{ fontSize: 12, fontWeight: 500, color: '#6B2438', marginBottom: 4 }}>Phase tip</div>
                  <div style={{ fontSize: 13, color: '#8B3A50', lineHeight: 1.6 }}>{workoutPlan.phase_tip}</div>
                </div>
                <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 4, marginBottom: '1rem' }}>
                  {workoutPlan.days.map((d, i) => (
                    <button key={i} onClick={() => setWorkoutDay(i)} style={{ flexShrink: 0, padding: '7px 14px', border: workoutDay === i ? 'none' : '0.5px solid #F0B8C8', borderRadius: 20, fontSize: 13, background: workoutDay === i ? '#C4687E' : '#fff', color: workoutDay === i ? '#fff' : '#8B3A50', cursor: 'pointer', fontWeight: workoutDay === i ? 500 : 400 }}>{d.day.slice(0, 3)}</button>
                  ))}
                </div>
                {workoutPlan.days[workoutDay].is_rest ? (
                  <div style={{ background: '#fff', border: '0.5px dashed #F0B8C8', borderRadius: 14, padding: '1rem 1.25rem', marginBottom: 10 }}>
                    <div style={{ fontSize: 15, fontWeight: 500, marginBottom: 4 }}>{workoutPlan.days[workoutDay].name}</div>
                    <div style={{ fontSize: 13, color: '#888', lineHeight: 1.6 }}>{workoutPlan.days[workoutDay].description}</div>
                  </div>
                ) : (
                  <div style={{ background: '#fff', border: '0.5px solid #F0B8C8', borderRadius: 14, padding: '1rem 1.25rem', marginBottom: 10 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                      <div style={{ fontSize: 11, fontWeight: 500, color: '#8B3A50', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{workoutPlan.days[workoutDay].workout_type}</div>
                      <span style={{ padding: '3px 10px', borderRadius: 12, fontSize: 11, fontWeight: 500, background: '#F7D6DF', color: '#6B2438' }}>{workoutPlan.days[workoutDay].intensity} intensity</span>
                    </div>
                    <div style={{ fontSize: 15, fontWeight: 500, marginBottom: 4 }}>{workoutPlan.days[workoutDay].name}</div>
                    <div style={{ fontSize: 13, color: '#888', lineHeight: 1.6, marginBottom: 8 }}>{workoutPlan.days[workoutDay].description}</div>
                    {(workoutPlan.days[workoutDay].exercises || []).map((e, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', background: '#FDF0F3', borderRadius: 10, border: '0.5px solid #F0B8C8', marginBottom: 6 }}>
                        <div style={{ fontSize: 13, fontWeight: 500 }}>{e.name}</div>
                        <div style={{ fontSize: 12, color: '#888' }}>{e.sets_reps}</div>
                      </div>
                    ))}
                    <div style={{ fontSize: 12, color: '#8B3A50', marginTop: 8 }}>⏱ {workoutPlan.days[workoutDay].duration_min} min · {workoutPlan.days[workoutDay].cooldown}</div>
                  </div>
                )}
                <button onClick={() => setWorkoutScreen('setup')} style={{ background: 'none', border: '0.5px solid #F0B8C8', borderRadius: 10, padding: '9px 16px', fontSize: 13, color: '#8B3A50', cursor: 'pointer', marginTop: '1rem' }}>← Adjust settings</button>
              </div>
            )}
          </div>
        )}

        {/* TRACKER */}
        {page === 'tracker' && (
          <div>
            <div style={{ fontSize: 19, fontWeight: 500, marginBottom: '0.25rem' }}>Daily tracker</div>
            <div style={{ fontSize: 13, color: '#888', marginBottom: '1.25rem' }}>Log your symptoms, mood, and energy every day.</div>
            <div style={{ background: '#fff', border: '0.5px solid #F0B8C8', borderRadius: 16, padding: '1.1rem 1.25rem', marginBottom: '1rem' }}>
              <div style={{ fontSize: 12, fontWeight: 500, color: '#8B3A50', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.75rem' }}>Today — {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</div>
              <label style={{ fontSize: 13, fontWeight: 500, color: '#8B3A50', marginBottom: 6, display: 'block' }}>How are you feeling?</label>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: '1rem' }}>
                {['😊 Great', '😐 Okay', '😔 Low', '😤 Anxious', '😴 Exhausted'].map(m => (
                  <button key={m} onClick={() => setTodayLog(prev => ({ ...prev, mood: m }))} style={{ padding: '8px 14px', border: todayLog.mood === m ? '1.5px solid #C4687E' : '0.5px solid #F0B8C8', borderRadius: 20, fontSize: 13, background: todayLog.mood === m ? '#F7D6DF' : '#fff', cursor: 'pointer' }}>{m}</button>
                ))}
              </div>
              <label style={{ fontSize: 13, fontWeight: 500, color: '#8B3A50', marginBottom: 5, display: 'block' }}>Energy level — {todayLog.energy}/10</label>
              <input type="range" min="1" max="10" value={todayLog.energy} onChange={e => setTodayLog(prev => ({ ...prev, energy: parseInt(e.target.value) }))} style={{ width: '100%', accentColor: '#C4687E', marginBottom: '1rem' }} />
              <label style={{ fontSize: 13, fontWeight: 500, color: '#8B3A50', marginBottom: 5, display: 'block' }}>Bloating — {todayLog.bloating}/10</label>
              <input type="range" min="1" max="10" value={todayLog.bloating} onChange={e => setTodayLog(prev => ({ ...prev, bloating: parseInt(e.target.value) }))} style={{ width: '100%', accentColor: '#C4687E', marginBottom: '1rem' }} />
              <label style={{ fontSize: 13, fontWeight: 500, color: '#8B3A50', marginBottom: 5, display: 'block' }}>Symptoms today</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7, marginBottom: '1rem' }}>
                {['Cramps', 'Headache', 'Acne', 'Cravings', 'Brain fog', 'Hair loss', 'Insomnia', 'Joint pain'].map(s => (
                  <button key={s} onClick={() => setTodayLog(prev => ({ ...prev, symptoms: prev.symptoms.includes(s) ? prev.symptoms.filter(x => x !== s) : [...prev.symptoms, s] }))} style={{ padding: '6px 13px', border: todayLog.symptoms.includes(s) ? '1.5px solid #C4687E' : '0.5px solid #F0B8C8', borderRadius: 20, fontSize: 13, background: todayLog.symptoms.includes(s) ? '#F7D6DF' : '#fff', color: todayLog.symptoms.includes(s) ? '#6B2438' : '#8B3A50', cursor: 'pointer' }}>{s}</button>
                ))}
              </div>
              <label style={{ fontSize: 13, fontWeight: 500, color: '#8B3A50', marginBottom: 5, display: 'block' }}>Notes</label>
              <textarea value={todayLog.notes} onChange={e => setTodayLog(prev => ({ ...prev, notes: e.target.value }))} placeholder="Anything else to log…" rows={2} style={{ width: '100%', padding: '11px 14px', border: '0.5px solid #F0B8C8', borderRadius: 12, fontSize: 14, resize: 'none', marginBottom: '1rem' }} />
              <button onClick={saveLog} style={{ width: '100%', padding: 13, background: '#C4687E', border: 'none', borderRadius: 14, color: '#fff', fontSize: 15, fontWeight: 500, cursor: 'pointer' }}>Save today's log</button>
            </div>
            {logs.length > 0 && (
              <div>
                <div style={{ fontSize: 12, fontWeight: 500, color: '#8B3A50', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.75rem' }}>Recent logs</div>
                {logs.slice(0, 5).map((l, i) => (
                  <div key={i} style={{ background: '#fff', border: '0.5px solid #F0B8C8', borderRadius: 12, padding: '10px 14px', marginBottom: 8, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 500 }}>{l.date}</div>
                      <div style={{ fontSize: 12, color: '#8B3A50', marginTop: 2 }}>{l.mood} · Energy {l.energy}/10</div>
                    </div>
                    <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>{l.symptoms.slice(0, 3).map(s => <span key={s} style={{ padding: '2px 8px', borderRadius: 10, fontSize: 11, background: '#F7D6DF', color: '#6B2438' }}>{s}</span>)}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* SUBSCRIPTION */}
        {page === 'subscription' && (
          <div>
            <div style={{ textAlign: 'center', padding: '1.5rem 0 1rem' }}>
              <div style={{ fontSize: 40, color: '#C4687E', marginBottom: '0.75rem' }}>♛</div>
              <div style={{ fontSize: 22, fontWeight: 500, color: '#6B2438', marginBottom: '0.4rem' }}>Upgrade Hormonize</div>
              <div style={{ fontSize: 14, color: '#8B3A50', lineHeight: 1.6, maxWidth: 380, margin: '0 auto 1.5rem' }}>Unlock your full hormonal wellness toolkit — unlimited AI plans, advanced tracking, and priority support.</div>
            </div>
            <div style={{ display: 'flex', background: '#F7D6DF', borderRadius: 20, padding: 3, marginBottom: '1.25rem', border: '0.5px solid #F0B8C8' }}>
              {[['monthly', 'Monthly'], ['annual', 'Annual — Save 40%']].map(([val, lbl]) => (
                <button key={val} onClick={() => setBilling(val)} style={{ flex: 1, padding: 8, borderRadius: 17, border: billing === val ? '0.5px solid #F0B8C8' : 'none', background: billing === val ? '#fff' : 'none', fontSize: 13, cursor: 'pointer', color: '#6B2438', fontWeight: billing === val ? 500 : 400 }}>{lbl}</button>
              ))}
            </div>
            {[{ key: 'free', name: 'Free', features: [{ y: true, t: 'PCOS assessment' }, { y: true, t: '1 meal plan/month' }, { y: true, t: '1 workout plan/month' }, { y: false, t: 'Daily symptom tracker' }, { y: false, t: 'Unlimited AI plans' }, { y: false, t: 'Push notifications' }], btn: 'Current plan', primary: false }, { key: 'basic', name: 'Basic', features: [{ y: true, t: 'PCOS assessment' }, { y: true, t: '4 meal plans/month' }, { y: true, t: '4 workout plans/month' }, { y: true, t: 'Daily symptom tracker' }, { y: false, t: 'Unlimited AI plans' }, { y: true, t: 'Push notifications' }], btn: 'Start free trial', primary: false }, { key: 'pro', name: 'Pro', features: [{ y: true, t: 'PCOS assessment' }, { y: true, t: 'Unlimited meal plans' }, { y: true, t: 'Unlimited workout plans' }, { y: true, t: 'Daily symptom tracker' }, { y: true, t: 'Unlimited AI plans' }, { y: true, t: 'Push notifications' }], btn: 'Upgrade to Pro', primary: true, popular: true }].map(t => (
              <div key={t.key} style={{ background: '#fff', border: t.primary ? '1.5px solid #C4687E' : '0.5px solid #F0B8C8', borderRadius: 16, padding: '1.25rem', marginBottom: 10, position: 'relative' }}>
                {t.popular && <div style={{ position: 'absolute', top: 14, right: 14, padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 500, background: '#C4687E', color: '#fff' }}>Most popular</div>}
                <div style={{ fontSize: 16, fontWeight: 500, marginBottom: 4 }}>{t.name}</div>
                <div style={{ fontSize: 28, fontWeight: 500, color: '#C4687E' }}>${prices[billing][t.key].toFixed(2)}<span style={{ fontSize: 14, fontWeight: 400, color: '#888' }}>/mo</span></div>
                <div style={{ fontSize: 12, color: '#aaa', marginBottom: '1rem' }}>{billing === 'annual' && t.key !== 'free' ? `Billed $${(prices[billing][t.key] * 12).toFixed(2)}/year` : 'Billed monthly'}</div>
                <div style={{ marginBottom: '1.25rem' }}>{t.features.map((f, i) => <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: f.y ? '#111' : '#ccc', marginBottom: 7 }}><span style={{ color: f.y ? '#1D9E75' : '#ddd' }}>{f.y ? '✓' : '✗'}</span>{f.t}</div>)}</div>
                <button onClick={() => { if (t.key !== 'free') { setPlan(t.key); alert(`${t.name} plan activated! (Demo)`); } }} style={{ width: '100%', padding: 12, borderRadius: 12, fontSize: 14, fontWeight: 500, cursor: 'pointer', border: 'none', background: t.primary ? '#C4687E' : '#F7D6DF', color: t.primary ? '#fff' : '#6B2438' }}>{t.btn}</button>
              </div>
            ))}
            <div style={{ background: '#F7D6DF', border: '0.5px solid #F0B8C8', borderRadius: 16, padding: '1.25rem', marginBottom: '1rem' }}>
              <div style={{ fontSize: 15, fontWeight: 500, color: '#6B2438', marginBottom: '0.75rem' }}>📊 Revenue estimator</div>
              <div style={{ fontSize: 13, color: '#8B3A50', marginBottom: 5 }}>Subscribers: <strong>{subCount.toLocaleString()}</strong></div>
              <input type="range" min="50" max="10000" value={subCount} step="50" onChange={e => setSubCount(parseInt(e.target.value))} style={{ width: '100%', accentColor: '#C4687E', marginBottom: '0.75rem' }} />
              <div style={{ fontSize: 13, color: '#8B3A50', marginBottom: 5 }}>Pro subscribers: <strong>{proPct}%</strong></div>
              <input type="range" min="10" max="90" value={proPct} step="5" onChange={e => setProPct(parseInt(e.target.value))} style={{ width: '100%', accentColor: '#C4687E', marginBottom: '1rem' }} />
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8 }}>
                {[{ val: `$${rev.mrr.toLocaleString()}`, lbl: 'Monthly' }, { val: `$${rev.arr.toLocaleString()}`, lbl: 'Annual' }, { val: `$${rev.yr3}K`, lbl: '3-year est.' }].map(s => (
                  <div key={s.lbl} style={{ background: '#fff', borderRadius: 10, padding: 8, textAlign: 'center' }}>
                    <div style={{ fontSize: 16, fontWeight: 500, color: '#C4687E' }}>{s.val}</div>
                    <div style={{ fontSize: 10, color: '#aaa', marginTop: 1 }}>{s.lbl}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* PROFILE */}
        {page === 'profile' && (
          <div>
            <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#F7D6DF', border: '2px solid #F0B8C8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, fontWeight: 500, color: '#6B2438', margin: '0 auto 0.75rem' }}>{userName ? userName.charAt(0).toUpperCase() : '?'}</div>
            <div style={{ fontSize: 18, fontWeight: 500, textAlign: 'center', marginBottom: '0.25rem' }}>{userName || 'Set up your profile'}</div>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.25rem' }}><div style={{ padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 500, background: '#F7D6DF', color: '#6B2438', border: '0.5px solid #F0B8C8' }}>{plan === 'pro' ? 'Pro plan' : plan === 'basic' ? 'Basic plan' : 'Free plan'}</div></div>
            <div style={{ background: '#fff', border: '0.5px solid #F0B8C8', borderRadius: 16, padding: '0 1.25rem', marginBottom: 10 }}>
              {[{ label: 'Take PCOS assessment', sub: 'Identify your type', action: () => goPage('quiz') }, { label: 'Daily tracker', sub: 'View your logs', action: () => goPage('tracker') }, { label: 'Upgrade to Pro', sub: 'Unlock all features', action: () => goPage('subscription'), pink: true }].map((item, i) => (
                <div key={i} onClick={item.action} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '13px 0', borderBottom: i < 2 ? '0.5px solid #F0B8C8' : 'none', cursor: 'pointer' }}>
                  <div>
                    <div style={{ fontSize: 14, color: item.pink ? '#C4687E' : '#111' }}>{item.label}</div>
                    <div style={{ fontSize: 12, color: '#888', marginTop: 2 }}>{item.sub}</div>
                  </div>
                  <span style={{ color: '#F0B8C8' }}>›</span>
                </div>
              ))}
            </div>
            <div style={{ fontSize: 12, color: '#aaa', textAlign: 'center', marginTop: '1rem' }}>Hormonize · Educational use only · Always consult your doctor</div>
          </div>
        )}

      </div>

      {/* NAV BAR */}
      <div style={{ background: '#fff', borderTop: '0.5px solid #F0B8C8', display: 'flex', position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: '100%', maxWidth: 680, zIndex: 20 }}>
        {[{ label: 'Home', p: 'home', icon: '⌂' }, { label: 'Assessment', p: 'quiz', icon: '♡' }, { label: 'Meals', p: 'meals', icon: '◎' }, { label: 'Workouts', p: 'workouts', icon: '↯' }, { label: 'Tracker', p: 'tracker', icon: '◈' }, { label: 'Upgrade', p: 'subscription', icon: '♛' }, { label: 'Profile', p: 'profile', icon: '◉' }].map(n => (
          <button key={n.p} onClick={() => goPage(n.p)} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '10px 0 8px', border: 'none', background: 'none', gap: 3, cursor: 'pointer', color: page === n.p ? '#C4687E' : '#aaa' }}>
            <span style={{ fontSize: 18 }}>{n.icon}</span>
            <span style={{ fontSize: 9, fontWeight: 500 }}>{n.label}</span>
          </button>
        ))}
      </div>

    </div>
  );
}