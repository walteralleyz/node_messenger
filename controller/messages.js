class Messages {
    io;
    clients = [];
    client_data = [];

    constructor(io) {
        this.io = io;
    }

    connect() {
        this.io.on('connection', socket => {
            this.clients.push(socket.id);

            this.io.to(socket.id).emit('id', socket.id);

            socket.on('send', data => this.send(data));
            socket.on('login', data => this.login(data));
            socket.on('disconnect', () => this.disconnect(socket));
        });
    }

    disconnect(socket) {
        this.clients = this.clients.filter(client => client !== socket.id);
        this.client_data = this.client_data.filter(client => client._id !== socket.id);

        this.io.emit('list_users', { client_data: this.client_data });
    }

    send(data) {
        const client = this.client_data.filter(client => client._id === data.user_id);
        const chatObj = {icon: client[0].icon, name: client[0].name, contact_id: data.user_id, message: data.message};

        if(data.contact_id) {
            this.io.to(data.contact_id)
                .emit('chat', chatObj);

            this.io.to(data.user_id)
                .emit('chat', chatObj);

            return false;
        }

        this.io.emit('chat', chatObj);
    }

    login(data) {
        if(this.client_data.length) {
            const exists = this.client_data.filter(client => client._id === data.id);

            if(exists.length)
                return false;
        }

        this.client_data.push({
            _id: data.id,
            name: data.name,
            icon: data.icon
        });

        this.io.emit('list_users', { client_data: this.client_data });
    }
}

module.exports = Messages;