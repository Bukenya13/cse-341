const grid = document.getElementById('usersGrid');
const status = document.getElementById('status');
const searchInput = document.getElementById('searchInput');

let allUsers = [];
let searchTerm = '';

const palette = ['#2563eb', '#7c3aed', '#db2777', '#ea580c', '#0d9488', '#4f46e5', '#0891b2', '#ca8a04'];

function setStatus(msg) {
  status.textContent = msg;
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str ?? '';
  return div.innerHTML;
}

function colorFor(name) {
  let hash = 0;
  for (const ch of name) {
    hash = (hash * 31 + ch.charCodeAt(0)) >>> 0;
  }
  return palette[hash % palette.length];
}

function nameOf(u) {
  return [u.firstName, u.lastName].filter(Boolean).join(' ').trim() || u.username || '?';
}

function initialsOf(u) {
  const first = (u.firstName || '').trim();
  const last = (u.lastName || '').trim();
  if (first && last) {
    return (first.charAt(0) + last.charAt(0)).toUpperCase();
  }
  const name = first || u.username || '?';
  return name.slice(0, 2).toUpperCase() || '?';
}

function avatarOf(u, name) {
  if (u.profilePicture) {
    return `<img class="avatar" src="${escapeHtml(u.profilePicture)}" alt="${escapeHtml(name)} profile picture">`;
  }
  return `<div class="avatar" style="background:${colorFor(name)}">${escapeHtml(initialsOf(u))}</div>`;
}

function renderUsers(users) {
  grid.innerHTML = '';
  if (!users.length) {
    grid.innerHTML = '<p class="card-field">No users match your search.</p>';
    return;
  }
  users.forEach(u => {
    const name = nameOf(u);
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      ${avatarOf(u, name)}
      <h2 class="card-title">${escapeHtml(name)}</h2>
      <span class="card-role">User</span>
      <div class="card-body">
        <p class="card-field"><strong>Username:</strong> ${escapeHtml(u.username)}</p>
        <p class="card-field"><strong>Email:</strong> ${escapeHtml(u.email)}</p>
        <p class="card-field"><strong>IP:</strong> ${escapeHtml(u.ipaddress)}</p>
      </div>
    `;
    grid.appendChild(card);
  });
}

function applyFilter() {
  const term = searchTerm.trim().toLowerCase();
  const visible = term
    ? allUsers.filter(u =>
        `${nameOf(u)} ${u.username} ${u.email}`.toLowerCase().includes(term)
      )
    : allUsers;
  renderUsers(visible);
}

async function loadUsers() {
  setStatus('Loading…');
  try {
    const res = await fetch('/users');
    if (!res.ok) throw new Error(res.statusText);
    allUsers = await res.json();
    applyFilter();
    setStatus('');
  } catch (err) {
    setStatus('Failed to load users.');
  }
}

searchInput.addEventListener('input', (e) => {
  searchTerm = e.target.value;
  applyFilter();
});

loadUsers();