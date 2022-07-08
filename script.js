const form = document.getElementById('form');
const index = document.getElementById('index');
const name = document.getElementById('name');
const phone = document.getElementById('phone');
const email = document.getElementById('email');
const submit = document.getElementById('submit')

form.addEventListener('submit', (event) => {
    event.preventDefault();
    let isValidate = true;
    if (name.value.trim().length === 0) {
        isValidate = false;
        showError(name, 'Name is required');
    } else {
        showSuccess(name);
    }

    if (phone.value.trim().length === 0) {
        isValidate = false;
        showError(phone, 'Phone is required');
    } else {
        showSuccess(phone);
    }

    if (phone.value.trim().length > 0 && !validatePhoneNumber(phone.value)) {
        isValidate = false;
        showError(phone, 'Phone is invalid format!');
    }

    if (email.value.trim().length === 0) {
        isValidate = false;
        showError(email, 'Email is required');
    } else {
        showSuccess(email);
    }

    if (email.value.trim().length > 0 && !validateEmail(email.value.trim())) {
        isValidate = false;
        showError(email, 'Email is invalid!');
    }

    if (isValidate) {
        saveData(name, phone, email)
    }
})

const validateEmail = (email) => {
    const regExpEmail = RegExp(/^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[A-Za-z]+$/);

    return regExpEmail.test(email)
}

// Show error message
const showError = (input, message) => {
    const formControl = input.parentElement;
    formControl.className = 'form-control error';

    const small = formControl.querySelector('small')
    small.innerText =  message
}

// Show success message
const showSuccess = (input, message) => {
    const formControl = input.parentElement;
    formControl.className = 'form-control success';

    const small = formControl.querySelector('small')
    small.innerText =  message
}

const validatePhoneNumber = (phone) => {
    let rePhone = /^\(?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{4})$/;
    return rePhone.test(phone);
}

const saveData = () => {
    let localStorages = getLocalStorages();
    let id = localStorages.length + 1;
    if (submit.value === 'Update') {
        id = index.value;
    }
    const data = {
        id: id,
        name: name.value.trim(),
        phone: phone.value.trim(),
        email: email.value.trim(),
        date: getCurrentDate()
    };

    localStorage.setItem(id.toString(), JSON.stringify(data));
    window.location.reload();
}

const editInfo = (id) => {
    let labelUpdate = 'Update';
    let obj = JSON.parse(localStorage.getItem(id));
    name.value = obj.name;
    phone.value = obj.phone;
    email.value = obj.email;
    submit.value = labelUpdate;
    submit.innerText = labelUpdate;
    index.value = id
}

const deleteInfo = (id) => {
    if (confirm(`Are you sure want to delete id: ${id}?`)) {
        localStorage.removeItem(id);
        window.location.reload();
    }
}

const getCells = (data) => {
    return (
        `
        <td>${data.name}</td>
        <td>${data.phone}</td>
        <td>${data.email}</td>
        <td>${data.date}</td>
        <td>
        <button class="btn-success" onclick="editInfo(${data.id})">Edit</button>
        <button class="btn-danger" onclick="deleteInfo(${data.id})">Delete</button>
        </td>
        `
    )
}

const createBody = (data) => {
    if (data.length > 0) {
        let index = 0;
        return data.map(row => `<tr><td>${++index}</td>${getCells(row)}</tr>`).join('');
    }

    return "<tr><td colspan='6' class='no-record'><strong>No record in local storage</strong></td></tr>";
}

const createTable = (data) => {
    const [...rows] = data;
    return `
    <table id="list-info" class="list-info">
        <thead>
            <tr>
                <th>#</th>
                <th>Name</th>
                <th>Phone</th>
                <th>Email</th>
                <th>Date</th>
                <th></th>
            </tr>
        </thead>
        <tbody>${createBody(rows)}</tbody>
    </table>
  `;
}

const getLocalStorages = () => {
    let data = [];
    for (let [, value] of Object.entries(localStorage)) {
        data.push(JSON.parse(value))
    }

    return data
}

const getCurrentDate = () => {
    let date = new Date();
    return date.getFullYear() + "/" +
        ("00" + (date.getMonth() + 1)).slice(-2) + "/" +
        ("00" + date.getDate()).slice(-2) + " " +
        ("00" + date.getHours()).slice(-2) + ":" +
        ("00" + date.getMinutes()).slice(-2);
}

(function() {
    document.getElementById('container-table').innerHTML = createTable(getLocalStorages());
})();