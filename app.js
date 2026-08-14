const STORAGE_KEY = 'ai-client-portal-demo-v1';

const defaultState = {
  session: false,
  tasks: [
    { id: 't1', title: 'Connect client CRM', owner: 'Implementation', status: 'In progress', priority: 'High' },
    { id: 't2', title: 'Confirm onboarding email copy', owner: 'Client', status: 'Blocked', priority: 'High' },
    { id: 't3', title: 'Validate dashboard metrics', owner: 'QA', status: 'Ready', priority: 'Medium' },
    { id: 't4', title: 'Prepare launch checklist', owner: 'Implementation', status: 'Ready', priority: 'Medium' },
    { id: 't5', title: 'Document handoff workflow', owner: 'Implementation', status: 'Done', priority: 'Low' },
  ],
  approvals: [
    { id: 'a1', title: 'Onboarding email sequence', note: 'Approve copy before automation is enabled.', status: 'Waiting' },
    { id: 'a2', title: 'Launch dashboard KPI set', note: 'Confirm the four metrics shown to the client team.', status: 'Waiting' },
  ],
  activity: [
    'Workspace initialized with demo-safe client data.',
    'CRM connection moved into implementation.',
    'Onboarding email sequence requires client approval.'
  ]
};

let state = loadState();

const els = {
  loginScreen: document.getElementById('loginScreen'),
  app: document.getElementById('app'),
  enterDemo: document.getElementById('enterDemo'),
  logoutBtn: document.getElementById('logoutBtn'),
  milestones: document.getElementById('milestones'),
  taskList: document.getElementById('taskList'),
  approvalList: document.getElementById('approvalList'),
  approvalBadge: document.getElementById('approvalBadge'),
  brief: document.getElementById('brief'),
  refreshBrief: document.getElementById('refreshBrief'),
  activityLog: document.getElementById('activityLog'),
  openTaskMetric: document.getElementById('openTaskMetric'),
  blockedTaskMetric: document.getElementById('blockedTaskMetric'),
  approvalMetric: document.getElementById('approvalMetric'),
  healthMetric: document.getElementById('healthMetric'),
  resetDemo: document.getElementById('resetDemo'),
};

function cloneDefault() {
  return JSON.parse(JSON.stringify(defaultState));
}

function loadState() {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return stored ? { ...cloneDefault(), ...stored } : cloneDefault();
  } catch {
    return cloneDefault();
  }
}

function persist() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function log(message) {
  state.activity.unshift(`${new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })} — ${message}`);
  state.activity = state.activity.slice(0, 12);
  persist();
  renderActivity();
}

function setSession(isActive) {
  state.session = isActive;
  persist();
  els.loginScreen.hidden = isActive;
  els.app.hidden = !isActive;
  if (isActive) renderAll();
}

function nextTaskStatus(status) {
  const order = ['Ready', 'In progress', 'Blocked', 'Done'];
  return order[(order.indexOf(status) + 1) % order.length];
}

function projectHealth() {
  const done = state.tasks.filter((task) => task.status === 'Done').length;
  const blocked = state.tasks.filter((task) => task.status === 'Blocked').length;
  const waiting = state.approvals.filter((approval) => approval.status === 'Waiting').length;
  const base = 68 + done * 6 - blocked * 4 - waiting * 2;
  return Math.max(45, Math.min(96, base));
}

function buildBrief() {
  const blocked = state.tasks.filter((task) => task.status === 'Blocked');
  const waiting = state.approvals.filter((approval) => approval.status === 'Waiting');
  const ready = state.tasks.filter((task) => task.status === 'Ready');
  const done = state.tasks.filter((task) => task.status === 'Done').length;

  const priority = blocked.length
    ? `Resolve “${blocked[0].title}” before pushing launch automation forward.`
    : waiting.length
      ? `Clear ${waiting.length} client approval gate${waiting.length > 1 ? 's' : ''} to unlock the next stage.`
      : ready.length
        ? `Advance “${ready[0].title}” into implementation.`
        : 'No critical action is currently waiting.';

  const risk = blocked.length
    ? `${blocked.length} blocked task${blocked.length > 1 ? 's' : ''} could delay launch readiness.`
    : waiting.length
      ? 'Delivery risk is concentrated in client decisions rather than implementation.'
      : 'No material workflow blocker is visible in the current demo state.';

  const progress = `${done} of ${state.tasks.length} tasks are complete, with project health at ${projectHealth()}%.`;

  els.brief.innerHTML = `
    <div class="brief-block"><span>Priority</span><p>${priority}</p></div>
    <div class="brief-block"><span>Risk</span><p>${risk}</p></div>
    <div class="brief-block"><span>Progress</span><p>${progress}</p></div>
    <div class="brief-block"><span>Recommended next move</span><p>${waiting.length ? 'Resolve the oldest approval gate, record the decision, then verify the dependent task state.' : 'Advance the highest-priority ready task and verify the resulting project state.'}</p></div>
  `;
}

function renderMilestones() {
  const health = projectHealth();
  const milestones = [
    { date: 'Aug 14', title: 'System setup', note: 'Workspace, data model, and client context.', progress: 100, badge: 'Verified' },
    { date: 'Aug 18', title: 'Workflow integration', note: 'CRM, tasks, approvals, and business rules.', progress: Math.min(100, health), badge: health > 78 ? 'On track' : 'Watch' },
    { date: 'Aug 21', title: 'Launch readiness', note: 'QA, client decisions, and handoff validation.', progress: Math.max(32, health - 24), badge: 'Upcoming' },
  ];

  els.milestones.innerHTML = milestones.map((item) => `
    <div class="milestone">
      <div><span class="micro">${item.date}</span><strong>${item.title}</strong></div>
      <div><p>${item.note}</p><div class="progress"><i style="width:${item.progress}%"></i></div></div>
      <span class="badge ${item.badge === 'Verified' || item.badge === 'On track' ? 'success' : 'neutral'}">${item.badge}</span>
    </div>
  `).join('');
}

function renderTasks() {
  els.taskList.innerHTML = state.tasks.map((task) => `
    <div class="task">
      <div><strong>${task.title}</strong><small>${task.owner} · ${task.priority} priority</small></div>
      <span class="badge ${task.status === 'Done' ? 'success' : task.status === 'Blocked' ? 'danger' : 'neutral'}">${task.status}</span>
      <button class="ghost status-btn" data-task="${task.id}">Advance</button>
    </div>
  `).join('');

  document.querySelectorAll('[data-task]').forEach((button) => {
    button.addEventListener('click', () => {
      const task = state.tasks.find((item) => item.id === button.dataset.task);
      const prior = task.status;
      task.status = nextTaskStatus(task.status);
      persist();
      log(`Task “${task.title}” moved from ${prior} to ${task.status}.`);
      renderAll();
    });
  });
}

function renderApprovals() {
  const waiting = state.approvals.filter((approval) => approval.status === 'Waiting').length;
  els.approvalBadge.textContent = waiting ? `${waiting} waiting` : 'All resolved';
  els.approvalBadge.className = `badge ${waiting ? 'warning' : 'success'}`;

  els.approvalList.innerHTML = state.approvals.map((approval) => `
    <div class="approval">
      <h3>${approval.title}</h3>
      <p>${approval.note}</p>
      <div class="approval-actions">
        ${approval.status === 'Waiting' ? `
          <button class="primary" data-approve="${approval.id}">Approve</button>
          <button class="ghost" data-reject="${approval.id}">Request change</button>
        ` : `<span class="badge ${approval.status === 'Approved' ? 'success' : 'neutral'}">${approval.status}</span>`}
      </div>
    </div>
  `).join('');

  document.querySelectorAll('[data-approve]').forEach((button) => button.addEventListener('click', () => resolveApproval(button.dataset.approve, 'Approved')));
  document.querySelectorAll('[data-reject]').forEach((button) => button.addEventListener('click', () => resolveApproval(button.dataset.reject, 'Changes requested')));
}

function resolveApproval(id, decision) {
  const approval = state.approvals.find((item) => item.id === id);
  if (!approval || approval.status !== 'Waiting') return;
  approval.status = decision;
  approval.decidedAt = new Date().toISOString();
  persist();
  log(`Decision gate resolved: “${approval.title}” → ${decision}.`);
  renderAll();
}

function renderMetrics() {
  const open = state.tasks.filter((task) => task.status !== 'Done').length;
  const blocked = state.tasks.filter((task) => task.status === 'Blocked').length;
  const waiting = state.approvals.filter((approval) => approval.status === 'Waiting').length;
  els.openTaskMetric.textContent = open;
  els.blockedTaskMetric.textContent = `${blocked} blocked`;
  els.approvalMetric.textContent = waiting;
  els.healthMetric.textContent = `${projectHealth()}%`;
}

function renderActivity() {
  els.activityLog.innerHTML = state.activity.map((entry) => `<li>${entry}</li>`).join('');
}

function renderAll() {
  renderMetrics();
  renderMilestones();
  renderTasks();
  renderApprovals();
  buildBrief();
  renderActivity();
}

els.enterDemo.addEventListener('click', () => {
  setSession(true);
  log('Demo client session opened.');
});

els.logoutBtn.addEventListener('click', () => setSession(false));
els.refreshBrief.addEventListener('click', () => {
  buildBrief();
  log('Executive brief refreshed from current project state.');
});
els.resetDemo.addEventListener('click', () => {
  const session = state.session;
  state = cloneDefault();
  state.session = session;
  persist();
  log('Demo state reset to baseline.');
  renderAll();
});

setSession(Boolean(state.session));
