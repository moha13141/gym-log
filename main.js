
/* Simple GymLog SPA - static build (vanilla JS) */
/* Data structure stored in localStorage key 'gymlog_v1' */
(function(){
  const STORAGE_KEY = 'gymlog_v1_v2';
  const DEFAULT_EXERCISES = [
    {id:'e1', name_en:'Bench Press', name_ar:'بنش برس', group:'Push'},
    {id:'e2', name_en:'Overhead Press', name_ar:'ضغط كتف', group:'Push'},
    {id:'e3', name_en:'Pull Ups', name_ar:'سحب BW', group:'Pull'},
    {id:'e4', name_en:'Squat', name_ar:'قرفصاء', group:'Legs'}
  ];

  // i18n texts
  const i18n = {
    en: {title:'GymLog', today:"Today's Session", addSet:'Add set', reps:'Reps', weight:'Weight', saveSession:'Save session', exercises:'Exercises', export:'Export', import:'Import', madeby:'made by : Mohammed Abdallah', history:'History', themeDark:'Dark', themeLight:'Light', langBtn:'العربية'},
    ar: {title:'سجل التمرين', today:'جلسة اليوم', addSet:'أضف مجموعة', reps:'عدات', weight:'الوزن', saveSession:'احفظ الجلسة', exercises:'التمارين', export:'تصدير', import:'استيراد', madeby:'made by : Mohammed Abdallah', history:'التاريخ', themeDark:'داكن', themeLight:'فاتح', langBtn:'English'}
  };

  // app state
  let state = { lang:'ar', theme:'light', exercises: DEFAULT_EXERCISES, sessions: [] };
  // load state
  function load(){ try{ const raw=localStorage.getItem(STORAGE_KEY); if(raw){ const obj=JSON.parse(raw); state = Object.assign(state, obj); } }catch(e){console.warn(e);} }
  function save(){ localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }

  load();

  // DOM refs
  const app = document.getElementById('app');
  const appTitle = document.getElementById('appTitle');
  const appSubtitle = document.getElementById('appSubtitle');
  const langBtn = document.getElementById('langBtn');
  const themeBtn = document.getElementById('themeBtn');
  const sessionType = document.getElementById('sessionType');
  const exercisesList = document.getElementById('exercisesList');
  const libraryList = document.getElementById('libraryList');
  const saveSessionBtn = document.getElementById('saveSession');
  const exportBtn = document.getElementById('exportBtn');
  const importFile = document.getElementById('importFile');
  const historyList = document.getElementById('historyList');

  // render functions
  function applyTheme(){ if(state.theme==='dark'){ app.classList.remove('light'); app.classList.add('dark'); themeBtn.textContent = i18n[state.lang].themeLight; }else{ app.classList.remove('dark'); app.classList.add('light'); themeBtn.textContent = i18n[state.lang].themeDark; } }
  function applyLang(){ appTitle.textContent = i18n[state.lang].title; appSubtitle.textContent = i18n[state.lang].today; langBtn.textContent = i18n[state.lang].langBtn; document.querySelector('.madeby').textContent = i18n[state.lang].madeby; document.getElementById('saveSession').textContent = i18n[state.lang].saveSession; exportBtn.textContent = i18n[state.lang].export; document.querySelector('.filelabel').childNodes[0].nodeValue = i18n[state.lang].import; document.getElementById('libraryTitle').textContent = i18n[state.lang].exercises; renderExercises(); renderLibrary(); renderHistory(); }
  function createCard(ex){ const card = document.createElement('div'); card.className='card fade-in'; const title = document.createElement('div'); title.className='row'; const h = document.createElement('div'); h.textContent = (state.lang==='ar'?ex.name_ar:ex.name_en); h.style.fontWeight = '600'; title.appendChild(h); const setsCount = document.createElement('div'); setsCount.textContent = (ex.sets?ex.sets.length:0)+' sets'; setsCount.style.color='var(--muted)'; title.appendChild(setsCount); card.appendChild(title); const setsWrap = document.createElement('div'); setsWrap.style.marginTop='10px'; (ex.sets||[]).forEach((s,idx)=>{ const row=document.createElement('div'); row.className='row'; row.style.marginBottom='6px'; const reps = document.createElement('input'); reps.type='number'; reps.value=s.reps; reps.className='input small'; reps.addEventListener('change',e=>{ s.reps = Number(e.target.value); updateSessionData(); }); const weight = document.createElement('input'); weight.type='number'; weight.value=s.weight; weight.className='input'; weight.addEventListener('change',e=>{ s.weight = Number(e.target.value); updateSessionData(); }); const vol = document.createElement('div'); vol.textContent = (s.reps * s.weight).toFixed(1); vol.style.color='var(--muted)'; row.appendChild(reps); row.appendChild(weight); row.appendChild(vol); setsWrap.appendChild(row); }); card.appendChild(setsWrap); const addBtn = document.createElement('button'); addBtn.className='btn small'; addBtn.textContent = state.lang==='ar'? 'أضف مجموعة' : 'Add set'; addBtn.addEventListener('click',()=>{ ex.sets = ex.sets||[]; ex.sets.push({reps:8,weight:0}); renderExercises(); }); card.appendChild(addBtn); return card; }

  function renderExercises(){
    exercisesList.innerHTML='';
    const type = sessionType.value;
    const picks = state.exercises.filter(e=>e.group===type).map(e=>({ ...e, sets: [] }));
    // merge with unsaved session data if exists in state.currentSession
    if(state.currentSession && state.currentSession.type===type){
      // override sets by id
      picks.forEach(p=>{ const found = (state.currentSession.exercises||[]).find(x=>x.id===p.id); if(found) p.sets = found.sets.map(s=>({...s})); });
    }
    // store into a temporary currentSession in state for editing
    state.currentSession = { id:'sess-temp-'+Date.now(), date:new Date().toISOString(), type:type, exercises:picks };
    picks.forEach(ex=>{ exercisesList.appendChild(createCard(ex)); });
  }

  function renderLibrary(){
    libraryList.innerHTML='';
    state.exercises.forEach(e=>{ const div=document.createElement('div'); div.className='item'; div.textContent = (state.lang==='ar'?e.name_ar:e.name_en) + ' • ' + e.group; libraryList.appendChild(div); });
  }

  function updateSessionData(){
    // read UI back into state.currentSession
    // we re-create from DOM, simpler to keep session in state when adding sets
    // here we already mutate state.currentSession when inputs change
    save();
    renderHistory();
  }

  function saveSession(){
    // push currentSession into sessions
    if(!state.currentSession) return alert('No session');
    state.sessions = state.sessions || [];
    const copy = JSON.parse(JSON.stringify(state.currentSession));
    copy.date = new Date().toISOString();
    state.sessions.unshift(copy);
    // clear current session sets for fresh start
    state.currentSession.exercises.forEach(ex=> ex.sets = []);
    save();
    renderExercises();
    renderHistory();
    alert(i18n[state.lang].saveSession + ' ✓');
  }

  function renderHistory(){
    historyList.innerHTML='';
    (state.sessions||[]).forEach(s=>{
      const it = document.createElement('div'); it.className='item';
      it.textContent = (new Date(s.date)).toLocaleString() + ' — ' + s.type + ' — ' + s.exercises.reduce((sum,ex)=> sum + (ex.sets?ex.sets.length:0),0) + ' sets';
      it.addEventListener('click', ()=> { showSessionDetail(s); });
      historyList.appendChild(it);
    });
  }

  function showSessionDetail(s){
    const w = window.open('', '_blank');
    w.document.write('<pre style="white-space:pre-wrap;font-family:monospace;padding:12px">'+JSON.stringify(s,null,2)+'</pre>');
  }

  // export/import
  function exportData(){
    const blob = new Blob([JSON.stringify(state, null, 2)], {type:'application/json'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href=url; a.download='gymlog-data.json'; a.click(); URL.revokeObjectURL(url);
  }
  function importData(file){
    const reader = new FileReader();
    reader.onload = function(e){
      try{
        const obj = JSON.parse(e.target.result);
        state = Object.assign(state, obj);
        save();
        applyLang(); applyTheme(); renderExercises(); renderLibrary(); renderHistory();
        alert(i18n[state.lang].import+' ✓');
      }catch(err){ alert('Invalid JSON'); }
    };
    reader.readAsText(file);
  }

  // UI events
  langBtn.addEventListener('click', ()=>{
    state.lang = state.lang==='ar' ? 'en' : 'ar';
    save(); applyLang();
  });
  themeBtn.addEventListener('click', ()=>{
    state.theme = state.theme==='dark' ? 'light' : 'dark';
    save(); applyTheme();
  });
  sessionType.addEventListener('change', ()=>{ renderExercises(); });
  saveSessionBtn.addEventListener('click', saveSession);
  exportBtn.addEventListener('click', exportData);
  importFile.addEventListener('change', (e)=> importData(e.target.files[0]));

  // initial
  applyTheme(); applyLang(); renderExercises(); renderLibrary(); renderHistory();

  // PWA install prompt handler (save event to show later)
  let deferredPrompt;
  window.addEventListener('beforeinstallprompt', (e)=>{ e.preventDefault(); deferredPrompt = e; /* could show install button */ });

  // service worker registration (done in index script, but re-check)
  if('serviceWorker' in navigator){
    navigator.serviceWorker.register('service-worker.js').catch(()=>{});
  }

})();
