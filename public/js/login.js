/* eslint-disable */
const form = document.querySelector('.form--login');
const logoutBtn = document.querySelector('.nav__el--logout');

function showAlert(status, text) {
  const markUp = `<div class="alert alert--${status}">${text}</div>`;
  document.querySelector('body').insertAdjacentHTML('afterbegin', markUp);
}
function hideAlert() {
  const el = document.querySelector('.alert');
  if (el) el.parentElement.removeChild(el);
}

const login = async (email, password) => {
  try {
    const res = await axios({
      method: 'POST',
      url: '/api/v2/users/login',
      data: {
        email,
        password
      }
    });
    if (res.data.status === 'success') {
      showAlert('success', 'loggedIn Successfully');
      window.setTimeout(() => {
        location.assign('/');
      }, 500);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
    window.setTimeout(hideAlert, 3000);
  }
};

const logout = async () => {
  try {
    const res = await axios({
      method: 'GET',
      url: '/api/v2/users/logout'
    });
    if (res.data.status === 'success') location.assign('/');
  } catch (err) {
    showAlert('error', 'Error logging out! Try again');
    window.setTimeout(hideAlert, 3000);
  }
};

if (logoutBtn === null && form !== null) {
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    login(email, password);
  });
} else if (logoutBtn !== null) {
  logoutBtn.addEventListener('click', function(e) {
    logout();
  });
}
