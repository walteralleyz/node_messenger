const socket = io();

window.onload = () => {
    const form = document.forms[0];

    localStorage.clear();

    form.onsubmit = (event) => {
        event.preventDefault();
        const m = document.getElementById('m');

        socket.emit('send', {
            contact_id: localStorage.getItem('contact_id') || '', 
            message: m.value,
            user_id: localStorage.getItem('user_id')
        });
        m.value = '';

        return false;
    }

    socket.on('id', data => localStorage.setItem('user_id', data));
    socket.on('list_users', data => loadUserList(data));
    socket.on('chat', data => drawMessage(data));
}

function login(event) {
    event.preventDefault();

    const name = document.getElementById('name').value;
    const id = localStorage.getItem('user_id');
    const icon = document.querySelector('.img-selected').dataset['icon'];
    const modal = document.querySelector('.modal');

    if (!name)
        return alert('Nome é obrigatório!');

    socket.emit('login', { name, id, icon });
    modal.remove();
}

function changeIcon(event) {
    const target = event.currentTarget;
    const selected = document.querySelector('.img-selected');

    selected.classList.remove('border-danger', 'img-selected');

    target.classList.add('border-danger', 'img-selected');
}

function loadUserList(data) {
    const user_list = document.querySelector('#user-list #holder');

    user_list.innerHTML = '';
    const global = drawContact({name: 'Global', icon: 'globe', _id: ''});

    user_list.appendChild(global);

    for (let d of data.client_data) {
        if (localStorage.getItem('user_id') === d._id)
            continue;

        const container = drawContact(d);
        user_list.appendChild(container);
    }
}

function drawContact(data) {
    const container = document.createElement('div');
    const icon = document.createElement('img');
    const name = document.createElement('span');

    name.textContent = data.name;
    name.style.paddingTop = '20px';
    name.classList.add('font-weight-bold');

    icon.alt = 'user-icon';
    icon.src = './images/' + data.icon + '.png';
    icon.style.maxWidth = '64px';

    container.appendChild(icon);
    container.appendChild(name);
    container.setAttribute('data-id', data._id);
    container.style.gap = '20px';

    container.onclick = () => startChat(data);

    container.classList.add('d-flex', 'my-2', 'text-light', 'bg-info', 'p-2', 'rounded');

    return container;
}

function drawMessage(data) {
    const message = document.createElement('div');
    const content_holder = document.createElement('div');
    const content = document.createElement('span');
    const date = document.createElement('small');
    const name = document.createElement('h6');
    const id = localStorage.getItem('user_id');

    name.textContent = data.contact_id === id ? 'Eu' : data.name;
    name.classList.add('font-weight-bold');

    content.textContent = data.message;
    date.textContent = new Date().toLocaleDateString() + ' ' + String(new Date().getHours()).padStart(2, '0') + ':' + String(new Date().getMinutes()).padStart(2, '0');
    date.style.display = 'block';
    date.style.fontSize = '0.5rem';

    content_holder.appendChild(name);
    content_holder.appendChild(content);
    content_holder.appendChild(date);

    content_holder.classList.add('p-3');
    content_holder.style.display = 'inline-block';
    content_holder.style.maxWidth = '50%';
    content_holder.style.wordWrap = 'break-word';
    content_holder.classList.add('rounded');

    if(data.contact_id !== id)
        content_holder.classList.add('bg-info', 'text-light');
    else {
        content_holder.classList.add('bg-success', 'text-light');
        message.classList.add('d-flex', 'justify-content-end');
    }

    message.appendChild(content_holder);
    message.classList.add('my-2');

    document.getElementById('messages').appendChild(message);
}

function startChat(data) {
    localStorage.setItem('contact_id', data._id);

    const chatImg = document.querySelector('.message-container__header img');
    const chatName = document.querySelector('.message-container__header span');

    chatImg.src = './images/' + data.icon + '.png';
    chatName.textContent = data.name;
}