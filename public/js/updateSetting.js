/* eslint-disable */
const userDataForm = document.querySelector('.form-user-data');
const passwordDataForm = document.querySelector('.form-user-settings');
const btnPassword = document.querySelector('.btn--pass');

function showAlert(status, text) {
  const markUp = `<div class="alert alert--${status}">${text}</div>`;
  document.querySelector('body').insertAdjacentHTML('afterbegin', markUp);
}
function hideAlert() {
  const el = document.querySelector('.alert');
  if (el) el.parentElement.removeChild(el);
}

const updateUserData = async (data, type) => {
  try {
    const url =
      type === 'password'
        ? '/api/v2/users/updatePassword'
        : '/api/v2/users/updateMe';
    const res = await axios({
      method: 'PATCH',
      url,
      data
    });
    showAlert('success', `${type.toUpperCase()} Update successfully`);
    window.setTimeout(hideAlert, 3000);
  } catch (err) {
    showAlert('error', err.response.data.message);
    window.setTimeout(hideAlert, 3000);
  }
};

if (userDataForm) {
  userDataForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const form = new FormData();
    form.append('name', document.getElementById('name').value);
    form.append('email', document.getElementById('email').value);
    form.append('photo', document.getElementById('photo').files[0]);

    updateUserData(form, 'data');
  });
}

if (passwordDataForm) {
  passwordDataForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    btnPassword.innerHTML = 'Updating...';
    const currentPassword = document.getElementById('password-current').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('password-confirm').value;
    await updateUserData(
      { currentPassword, password, confirmPassword },
      'password'
    );

    btnPassword.innerHTML = 'Save password';
    document.getElementById('password-current').value = '';
    document.getElementById('password').value = '';
    document.getElementById('password-confirm').value = '';
  });
}
