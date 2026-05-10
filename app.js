
let currentUser = null;
let questions = [];
let currentIndex = 0;
let answers = {};

function $(id){ return document.getElementById(id); }

function setMsg(t){ const el = $('msg'); if(el) el.textContent = t; }

function getUsers(){ return JSON.parse(localStorage.getItem('cbt_users') || '{}'); }
function saveUsers(u){ localStorage.setItem('cbt_users', JSON.stringify(u)); }

function signup(){
  const email = $('email').value.trim();
  const password = $('password').value;
  if(!email || !password) return setMsg('Enter email and password.');
  const users = getUsers();
  users[email] = { password };
  saveUsers(users);
  setMsg('Sign up successful.');
}

function login(){
  const email = $('email').value.trim();
  const password = $('password').value;
  const users = getUsers();
  if(!users[email] || users[email].password !== password){
    return setMsg('Invalid email or password.');
  }
  currentUser = email;
  setMsg('Login successful.');
  startExam();
}

function adminLogin(){
  if($('adminPassword').value !== 'admin123') return alert('Wrong password');
  $('loginBox').style.display = 'none';
  $('adminPanel').style.display = 'block';
}

async function uploadQuestionsJSON(){
  const input = $('jsonFile');
  if(!input.files.length) return alert('Please choose a JSON file.');
  try{
    const text = await input.files[0].text();
    const data = JSON.parse(text);
    if(!Array.isArray(data)) throw new Error('JSON must be an array');

    const valid = [];
    for(const q of data){
      const options = q.options || [q.option1,q.option2,q.option3,q.option4].filter(Boolean);
      if(!q.question || options.length < 2 || !q.answer) continue;
      valid.push({
        question: q.question,
        options,
        answer: q.answer,
        section: q.section || ''
      });
    }

    localStorage.setItem('cbt_questions', JSON.stringify(valid));
    alert(valid.length + ' questions uploaded successfully.');
  } catch(e){
    alert('Upload failed: ' + e.message);
  }
}

function startExam(){
  questions = JSON.parse(localStorage.getItem('cbt_questions') || '[]');
  if(!questions.length){
    return setMsg('No questions uploaded yet. Contact admin.');
  }
  $('authBox').style.display = 'none';
  $('examBox').style.display = 'block';
  currentIndex = 0;
  answers = {};
  renderQuestion();
}

function renderQuestion(){
  const q = questions[currentIndex];
  $('qCounter').textContent = `Question ${currentIndex + 1} of ${questions.length}`;
  $('questionText').textContent = q.question;
  const optionsDiv = $('options');
  optionsDiv.innerHTML = '';
  q.options.forEach(opt => {
    const label = document.createElement('label');
    label.className = 'option';
    const checked = answers[currentIndex] === opt ? 'checked' : '';
    label.innerHTML = `<input type="radio" name="option" value="${escapeHtml(opt)}" ${checked}> ${escapeHtml(opt)}`;
    label.querySelector('input').addEventListener('change', () => {
      answers[currentIndex] = opt;
    });
    optionsDiv.appendChild(label);
  });
}

function escapeHtml(s){
  return String(s).replace(/[&<>"']/g, c => ({
    '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
  }[c]));
}

function nextQuestion(){
  if(currentIndex < questions.length - 1){
    currentIndex++;
    renderQuestion();
  }
}

function prevQuestion(){
  if(currentIndex > 0){
    currentIndex--;
    renderQuestion();
  }
}

function submitExam(){
  let score = 0;
  questions.forEach((q, i) => {
    if(answers[i] === q.answer) score++;
  });

  const results = JSON.parse(localStorage.getItem('cbt_results') || '[]');
  results.push({
    email: currentUser,
    score,
    total: questions.length,
    date: new Date().toLocaleString()
  });
  localStorage.setItem('cbt_results', JSON.stringify(results));

  alert(`Exam submitted!\nScore: ${score}/${questions.length}`);
  location.reload();
}

function viewResults(){
  const results = JSON.parse(localStorage.getItem('cbt_results') || '[]');
  $('resultsBox').textContent = JSON.stringify(results, null, 2);
}
