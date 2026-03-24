const authToken = localStorage.getItem('authToken');
const taskForm = document.getElementById('task-form');
const taskIdInput = document.getElementById('task-id');
const titleInput = document.getElementById('title');
const descriptionInput = document.getElementById('description');
const completedInput = document.getElementById('completed');
const submitButton = document.getElementById('submit-button');
const cancelButton = document.getElementById('cancel-button');
const refreshButton = document.getElementById('refresh-button');
const taskList = document.getElementById('task-list');
const statusText = document.getElementById('status');
const profileForm = document.getElementById('profile-form');
const profileNameInput = document.getElementById('profile-name');
const profileImageInput = document.getElementById('profile-image');
const profilePreview = document.getElementById('profile-preview');
const profilePlaceholder = document.getElementById('profile-placeholder');
const profileStatus = document.getElementById('profile-status');
const logoutButton = document.getElementById('logout-button');
const userGreeting = document.getElementById('user-greeting');

if (!authToken) {
  window.location.replace('/');
}

function getAuthHeaders(extraHeaders = {}) {
  return {
    ...extraHeaders,
    Authorization: `Bearer ${authToken}`,
  };
}

function setStatus(message, isError = false) {
  statusText.textContent = message;
  statusText.classList.toggle('error', isError);
}

function setProfileStatus(message, isError = false) {
  profileStatus.textContent = message;
  profileStatus.classList.toggle('error', isError);
}

function resetForm() {
  taskIdInput.value = '';
  titleInput.value = '';
  descriptionInput.value = '';
  completedInput.checked = false;
  submitButton.textContent = 'Create Task';
  cancelButton.classList.add('hidden');
}

function populateForm(task) {
  taskIdInput.value = task._id;
  titleInput.value = task.title;
  descriptionInput.value = task.description || '';
  completedInput.checked = task.completed;
  submitButton.textContent = 'Update Task';
  cancelButton.classList.remove('hidden');
}

function renderTasks(tasks) {
  taskList.innerHTML = '';

  if (tasks.length === 0) {
    const emptyState = document.createElement('li');
    emptyState.className = 'empty-state';
    emptyState.textContent = 'No tasks found.';
    taskList.appendChild(emptyState);
    return;
  }

  tasks.forEach((task) => {
    const item = document.createElement('li');
    item.className = 'task-item';

    const content = document.createElement('div');
    content.className = 'task-content';

    const heading = document.createElement('div');
    heading.className = 'task-heading';

    const title = document.createElement('h3');
    title.textContent = task.title;

    const badge = document.createElement('span');
    badge.className = `badge ${task.completed ? 'done' : 'pending'}`;
    badge.textContent = task.completed ? 'Completed' : 'Pending';

    heading.appendChild(title);
    heading.appendChild(badge);

    const description = document.createElement('p');
    description.textContent = task.description || 'No description';

    content.appendChild(heading);
    content.appendChild(description);

    const actions = document.createElement('div');
    actions.className = 'item-actions';

    const editButton = document.createElement('button');
    editButton.className = 'secondary';
    editButton.textContent = 'Edit';
    editButton.addEventListener('click', () => populateForm(task));

    const deleteButton = document.createElement('button');
    deleteButton.className = 'danger';
    deleteButton.textContent = 'Delete';
    deleteButton.addEventListener('click', async () => {
      await deleteTask(task._id);
    });

    actions.appendChild(editButton);
    actions.appendChild(deleteButton);

    item.appendChild(content);
    item.appendChild(actions);
    taskList.appendChild(item);
  });
}

function renderProfile(profile) {
  if (!profile) {
    profilePreview.classList.add('hidden');
    profilePlaceholder.classList.remove('hidden');
    profilePlaceholder.textContent = 'No image';
    return;
  }

  profileNameInput.value = profile.name || '';
  profilePreview.src = profile.imageUrl;
  profilePreview.classList.remove('hidden');
  profilePlaceholder.classList.add('hidden');
}

async function fetchCurrentUser() {
  try {
    const response = await fetch('/api/auth/me', {
      headers: getAuthHeaders(),
    });
    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || 'Session expired');
    }

    userGreeting.textContent = `Signed in as ${result.user.name}`;
  } catch (error) {
    localStorage.removeItem('authToken');
    window.location.replace('/');
  }
}

async function fetchProfile() {
  try {
    const response = await fetch('/api/profile', {
      headers: getAuthHeaders(),
    });

    if (response.status === 404) {
      renderProfile(null);
      setProfileStatus('No profile uploaded yet.');
      return;
    }

    const profile = await response.json();

    if (!response.ok) {
      throw new Error(profile.error || 'Failed to load profile');
    }

    renderProfile(profile);
    setProfileStatus('Profile loaded.');
  } catch (error) {
    setProfileStatus(error.message, true);
  }
}

async function uploadProfile(event) {
  event.preventDefault();

  if (!profileImageInput.files[0]) {
    setProfileStatus('Please choose an image file.', true);
    return;
  }

  const formData = new FormData();
  formData.append('name', profileNameInput.value);
  formData.append('image', profileImageInput.files[0]);

  try {
    setProfileStatus('Uploading profile image...');
    const response = await fetch('/api/profile', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: formData,
    });
    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || 'Failed to upload profile image');
    }

    renderProfile(result);
    profileImageInput.value = '';
    setProfileStatus('Profile image uploaded successfully.');
  } catch (error) {
    setProfileStatus(error.message, true);
  }
}

async function fetchTasks() {
  try {
    setStatus('Loading tasks...');
    const response = await fetch('/api/tasks', {
      headers: getAuthHeaders(),
    });
    const tasks = await response.json();

    if (!response.ok) {
      throw new Error(tasks.error || 'Failed to load tasks');
    }

    renderTasks(tasks);
    setStatus(`Loaded ${tasks.length} task${tasks.length === 1 ? '' : 's'}.`);
  } catch (error) {
    setStatus(error.message, true);
  }
}

async function saveTask(event) {
  event.preventDefault();

  const id = taskIdInput.value;
  const payload = {
    title: titleInput.value,
    description: descriptionInput.value,
    completed: completedInput.checked,
  };

  try {
    const response = await fetch(id ? `/api/tasks/${id}` : '/api/tasks', {
      method: id ? 'PUT' : 'POST',
      headers: getAuthHeaders({
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify(payload),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || 'Failed to save task');
    }

    resetForm();
    await fetchTasks();
    setStatus(id ? 'Task updated successfully.' : 'Task created successfully.');
  } catch (error) {
    setStatus(error.message, true);
  }
}

async function deleteTask(id) {
  try {
    const response = await fetch(`/api/tasks/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || 'Failed to delete task');
    }

    if (taskIdInput.value === id) {
      resetForm();
    }

    await fetchTasks();
    setStatus(result.message || 'Task deleted successfully.');
  } catch (error) {
    setStatus(error.message, true);
  }
}

function logout() {
  localStorage.removeItem('authToken');
  window.location.replace('/');
}

taskForm.addEventListener('submit', saveTask);
cancelButton.addEventListener('click', resetForm);
refreshButton.addEventListener('click', fetchTasks);
profileForm.addEventListener('submit', uploadProfile);
logoutButton.addEventListener('click', logout);

fetchCurrentUser();
fetchProfile();
fetchTasks();
