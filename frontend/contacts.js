const grid = document.getElementById('contactsGrid');
const form = document.getElementById('contactForm');
const formTitle = document.getElementById('formTitle');
const idInput = document.getElementById('contactId');
const status = document.getElementById('status');
const showFormBtn = document.getElementById('showFormBtn');
const cancelBtn = document.getElementById('cancelBtn');
const searchInput = document.getElementById('searchInput');

let allContacts = [];
let searchTerm = '';

const fields = ['firstName', 'lastName', 'email', 'favoriteColor', 'birthday'];

function setStatus(msg) {
  status.textContent = msg;
}

function formatBirthdate(raw) {
  if (!raw) return '';
  const d = new Date(raw);
  if (isNaN(d.getTime())) return raw;
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

function isHexColor(str) {
  return /^#([0-9a-fA-F]{3}){1,2}$/.test(str.trim());
}

function initialsOf(c) {
  return ((c.firstName || '?').charAt(0) + (c.lastName || '').charAt(0)).toUpperCase() || '?';
}

function normalizeColor(color) {
  const c = (color || '').trim();
  if (!c) return '#4aa8e8';
  return isHexColor(c) ? c : c.toLowerCase();
}

function renderContacts(contacts) {
  grid.innerHTML = '';
  if (!contacts.length) {
    grid.innerHTML = '<p class="card-field">No contacts match your search.</p>';
    return;
  }
  contacts.forEach(c => {
    const color = normalizeColor(c.favoriteColor);
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <div class="avatar" style="background:${color}">${escapeHtml(initialsOf(c))}</div>
      <h2 class="card-title">${escapeHtml(c.firstName)} ${escapeHtml(c.lastName)}</h2>
      <span class="card-role">Contact</span>
      <div class="card-body">
        <p class="card-field"><strong>Email:</strong> ${escapeHtml(c.email)}</p>
        <p class="card-field"><strong>Color:</strong> <span class="color-chip" style="background:${color}"></span>${escapeHtml(c.favoriteColor || '—')}</p>
        <p class="card-field"><strong>Birthday:</strong> ${formatBirthdate(c.birthday)}</p>
      </div>
      <div class="card-actions">
        <button class="btn btn-light btn-sm edit-btn" data-id="${c._id}">Edit</button>
        <button class="btn btn-light btn-sm delete-btn" data-id="${c._id}">Delete</button>
      </div>
    `;
    grid.appendChild(card);
  });
  grid.querySelectorAll('.edit-btn').forEach(btn => btn.addEventListener('click', () => loadContact(btn.dataset.id)));
  grid.querySelectorAll('.delete-btn').forEach(btn => btn.addEventListener('click', () => deleteContact(btn.dataset.id)));
}

function applyFilter() {
  const term = searchTerm.trim().toLowerCase();
  const visible = term
    ? allContacts.filter(c =>
        `${c.firstName} ${c.lastName} ${c.email}`.toLowerCase().includes(term)
      )
    : allContacts;
  renderContacts(visible);
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str ?? '';
  return div.innerHTML;
}

function openForm(addMode = true, data = null) {
  formTitle.textContent = addMode ? 'Add Contact' : 'Edit Contact';
  idInput.value = addMode ? '' : data._id;
  fields.forEach(f => document.getElementById(f).value = data ? (data[f] ?? '') : '');
  form.classList.remove('hidden');
  showFormBtn.classList.add('hidden');
}

function closeForm() {
  form.classList.add('hidden');
  showFormBtn.classList.remove('hidden');
  form.reset();
}

async function loadContacts() {
  setStatus('Loading…');
  try {
    const res = await fetch('/contacts');
    if (!res.ok) throw new Error(res.statusText);
    allContacts = await res.json();
    applyFilter();
    setStatus('');
  } catch (err) {
    setStatus('Failed to load contacts.');
  }
}

async function loadContact(id) {
  try {
    const res = await fetch(`/contacts/${id}`);
    if (!res.ok) throw new Error(res.statusText);
    const data = await res.json();
    openForm(false, data);
  } catch (err) {
    setStatus('Failed to load contact.');
  }
}

async function deleteContact(id) {
  if (!confirm('Delete this contact?')) return;
  setStatus('Deleting…');
  try {
    const res = await fetch(`/contacts/${id}`, { method: 'DELETE' });
    if (res.ok) {
      await loadContacts();
    } else {
      setStatus('Delete failed.');
    }
  } catch (err) {
    setStatus('Delete failed.');
  }
}

showFormBtn.addEventListener('click', () => openForm(true));
cancelBtn.addEventListener('click', closeForm);

searchInput.addEventListener('input', (e) => {
  searchTerm = e.target.value;
  applyFilter();
});

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const body = {};
  fields.forEach(f => body[f] = document.getElementById(f).value.trim());

  const isEdit = !!idInput.value;
  const url = isEdit ? `/contacts/${idInput.value}` : '/contacts';
  const method = isEdit ? 'PUT' : 'POST';
  setStatus(isEdit ? 'Saving…' : 'Creating…');

  try {
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (res.ok) {
      closeForm();
      await loadContacts();
    } else {
      const msg = await res.text();
      setStatus(`Error: ${msg}`);
    }
  } catch (err) {
    setStatus('Request failed.');
  }
});

loadContacts();