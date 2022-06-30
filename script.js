const form = document.getElementById('form');
const index = document.getElementById('index');
const name = document.getElementById('name');
const phone = document.getElementById('phone');
const email = document.getElementById('email');
const submit = document.getElementById('submit')

form.addEventListener('submit', function(e) {
    e.preventDefault();
    let isValidate = true;

    const validateEmail = (email) => {
        return email.match(
            /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
    };

    if (name.value == '') {
        isValidate = false;
        showError(name, 'Name is required');
    } else {
        showSuccess(name);
    }
    if (phone.value == '') {
        isValidate = false;
        showError(phone, 'Phone is required');
    } else {
        showSuccess(phone);
    }
    if (email.value == '') {
        isValidate = false;
        showError(email, 'Email is required');
    } else {
        showSuccess(email);
    }

    if (email.value != '' && !validateEmail(email.value)) {
        isValidate = false;
        showError(email, 'Email is invalid!');
    }

    if (checkExistEmail(email.value, index.value)) {
        isValidate = false;
        showExistEmailError(email, `${email.value} is already exist!`)
    }

    if (isValidate) {
        saveData(name, phone, email)
    }
})

// Show error message
function showError(input, message) {
    const formControl = input.parentElement;
    formControl.className = 'form-control error';

    const small = formControl.querySelector('small')
    small.innerText =  message
}

function showExistEmailError(input, message) {
    const formControl = input.parentElement;
    formControl.className = 'form-control error';

    const small = formControl.querySelector('small')
    small.innerText =  message
}

// Show success message
function showSuccess(input, message) {
    const formControl = input.parentElement;
    formControl.className = 'form-control success';

    const small = formControl.querySelector('small')
    small.innerText =  message
}

function checkExistEmail(email, id = 0) {
    let data = getLocalStorages();
    return data.some(function(el) {
        return el.email === email && el.id != id;
    });
}

function saveData(name, phone, email) {
    let localStorages = getLocalStorages();
    let id = localStorages.length + 1;
    if (submit.value == 'Update') {
        id = index.value;
    }
    const data = {
        id: id,
        name: name.value.trim(),
        phone: phone.value.trim(),
        email: email.value.trim(),
        date: getCurrentDate()
    };

    localStorage.setItem(id, JSON.stringify(data));
    window.location.reload();
}

function editInfo(id) {
    let labelUpdate = 'Update';
    let obj = JSON.parse(localStorage.getItem(id));
    name.value = obj.name;
    phone.value = obj.phone;
    email.value = obj.email;
    submit.value = labelUpdate;
    submit.innerText = labelUpdate;
    index.value = id
}

function deleteInfo(id) {
    if (confirm(`Are you sure want to delete id: ${id}?`)) {
        localStorage.removeItem(id);
        window.location.reload();
    }
}

function getCells(data, type) {
    return (
        `
        <td>${data.id}</td>
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

function createBody(data) {
    if (data.length > 0) {
        return data.map(row => `<tr>${getCells(row, 'td')}</tr>`).join('');
    }

    return "<tr><td colspan='6' class='no-record'><strong>No record in local storage</strong></td></tr>";
}

function createTable(data) {
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

function getLocalStorages() {
    let data = [];
    for (let [key, value] of Object.entries(localStorage)) {
        data.push(JSON.parse(value))
    }

    return data
}

function getCurrentDate() {
    let date = new Date();
    let dateStr =
        date.getFullYear() + "/" +
        ("00" + (date.getMonth() + 1)).slice(-2) + "/" +
        ("00" + date.getDate()).slice(-2) + " " +
        ("00" + date.getHours()).slice(-2) + ":" +
        ("00" + date.getMinutes()).slice(-2);

    return dateStr;
}

(function() {
    getCurrentDate();
    document.getElementById('container-table').innerHTML = createTable(getLocalStorages());
})();