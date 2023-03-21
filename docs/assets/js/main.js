const nameInput = document.querySelector('#firstName');
const lastNameInput = document.querySelector('#lastName');
const nationality = document.querySelector('#nationality');
const userEmail = document.querySelector('#email');
const userDate = document.querySelector('.date');
const userMonth = document.querySelector('.month');
const userYear = document.querySelector('.year');
const userGender = document.querySelector('#male');
const userPassword = document.querySelector('#password');
const userConfirmPassword = document.querySelector('#confirmPassword');
const submitBtn = document.querySelector('.container__main__form__submitBtn');
const form = document.querySelector('.container__main__form');

const title = document.querySelector('.container__main__title');
const titleMessage = document.querySelector('.container__main__description');

const modal = document.querySelector('.container__modalWrapper');
const modalMessage = document.querySelector('.container__modalWrapper__modal__message');
const closeModalBtn = document.querySelector('.container__modalWrapper__modal__closeBtn');

const checkEmail = () => {
    if(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userEmail.value)) {
        return checkPassword();
    } else {
        modalMessage.innerText = 'Введите правильную почту!';
        userEmail.style.borderColor = '#FF2828';
        userEmail.style.color = '#FF2222';
        userEmail.style.borderWidth = '2px';
        userEmail.value = '';
        return false;
    }
};
const checkPassword = () => {
    if (userPassword.value.length < 8 || !(/[A-Z]/.test(userPassword.value)) || !(/[a-z]/.test(userPassword.value)) || !(/\d/.test(userPassword.value))) {
        modalMessage.innerText = 'Пароль пользователя должен содержать от 8 символов, заглавные и строчные буквы, а также цифры!';
        openModal();
        userPassword.style.borderColor = '#FF2828';
        userPassword.style.color = '#FF2222';
        userPassword.style.borderWidth = '2px';
        userPassword.value = '';
        userConfirmPassword.value = '';
        return
    } else {
        return true;
    }
};

const validationForm = () => {
    if (nameInput.value.trim() === "" || lastNameInput.value.trim() === "" || userEmail.value.trim() === "" || userPassword.value.trim() === "" || userConfirmPassword.value.trim() === "") {
        modalMessage.innerText = 'Заполните все поля!';
        openModal();
        return;
    } else if ( checkEmail()) {
        const user = {
            id: Date.now(),
            name: nameInput.value,
            lastName: lastNameInput.value,
            nationality: nationality.value,
            birthday: {
                date: userDate.value,
                month: userMonth.value,
                year: userYear.value
            },
            gender: userGender.value,
            userPassword: userPassword.value
        }
        SubmitNewUser(user);
    } else {
        openModal();
    }
};
const openModal = () => {
    modal.classList.remove('hiddenModal');
}
const closeModal = () => {
    modalMessage.innerText = '';
    modal.classList.add('hiddenModal');
}
closeModalBtn.addEventListener('click', closeModal);

const SubmitNewUser =  async(user) => {
    const data = await fetch('http://localhost:3004/users', {
        method: 'POST',
        headers: {'Content-Type': 'application/json;charset=utf-8'},
        body:JSON.stringify(user)
    });
    if (data.status < 400) {
        form.style.display = 'none';
        title.style.marginLeft = '43.8px';
        title.style.marginTop = '176.5px';
        titleMessage.style.marginLeft = '43.8px';
        title.innerText = 'Thank You!';
        titleMessage.innerText = 'you registered!';
        nameInput.value = '';
        lastNameInput.value = '';
        userEmail.value = '';
        userPassword.value = '';
        userConfirmPassword.value = '';
    } else {
        submitBtn.classList.add('trem');
        setTimeout(() => {
            submitBtn.classList.remove('trem');
        }, 1000)
    }
};
userEmail.addEventListener('focus', () => {
    userEmail.style.borderColor = '#F2F2F2';
    userEmail.style.color = '#111';
    userEmail.style.borderWidth = '1px';
});
userPassword.addEventListener('focus', () => {
    userEmail.style.borderColor = '#F2F2F2';
    userEmail.style.color = '#111';
    userEmail.style.borderWidth = '1px';
});
userConfirmPassword.addEventListener('focus', () => {
    userConfirmPassword.style.borderColor = '#F2F2F2';
    userConfirmPassword.style.color = '#111';
    userConfirmPassword.style.borderWidth = '1px';
});
submitBtn.addEventListener('click', (e) => {
    e.preventDefault();
    userPassword.style.borderColor = '#F2F2F2';
    userPassword.style.color = '#111';
    userPassword.style.borderWidth = '1px';
    if (userPassword.value === userConfirmPassword.value) {
        validationForm();
    } else {
        modalMessage.innerText = 'Неправильное подтверждение пароля';
        openModal();
        userConfirmPassword.style.borderColor = '#FF2828';
        userConfirmPassword.style.color = '#FF2222';
        userConfirmPassword.style.borderWidth = '2px';
        userConfirmPassword.value = '';
    }
});