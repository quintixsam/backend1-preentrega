import fs from 'fs';

class UserManager {
    constructor() {
        //Ruta del Archivo .json que contiene los usuarios
        this.path = './src/users.json';
    }

    //Genera un nuevo id basado en el ultimo id existente
    generateId = (users) => {
        if (users.length > 0) {
            // Retorna el ultimo id +1
            return users[users.length - 1].id + 1;
        } else {
            // si no hay usuarios, asigna el id 1
            return 1;
        }
    }

    //Obtiene todos los usuarios
    getAllUsers = async () => {
        // Lee el archivo .json
        const usersJson = await fs.promises.readFile(this.path, 'utf-8');
        // Convierte el contenido de Json a un array de usuarios
        const users = JSON.parse(usersJson);
        // Devuelve el array de usuarios
        return users;
    }

    // Obtiene un usuario por su id
    getUserById = async (userId) => {
        // Lee el archivo.json
        const usersJson = await fs.promises.readFile(this.path, 'utf-8');
        // Convierte el contenido de JSON a un array de usuarios
        const users = JSON.parse(usersJson);
        // Busca el usuario con el id proporcionado
        const user = users.find((userData) => userData.id === userId);
        // Devuelve el usuario encontrado
        return user;
    }

    // Crea un nuevo usuario
    createUser = async (newUser) => {
        // Lee el archivo .json
        const usersJson = await fs.promises.readFile(this.path, 'utf-8');
        // Convierte el Contenido de JSON a un array de usuarios
        const users = JSON.parse(usersJson);
        // Genera un id Unico para el nuevo usuario
        const id = this.generateId(users);
        // Añade el nuevo usuario al array, con el id generado
        users.push({ id, ...newUser });
        // Sobreescribe el archivo .Json con la lista actualizada 
        await fs.promises.writeFile(this.path, JSON.stringify(users, null, 2), 'utf-8');
        // Devuelve la lista actualizada de usuarios
        return users;
    }

    //Actualiza los datos de un usuario por su id
    updateUserById = async (userId, updatedData) => {
        // Lee el archivo .json
        const usersJson = await fs.promises.readFile(this.path, 'utf-8');
        // Convierte el contenido de JSON a un array de usuarios
        const users = JSON.parse(usersJson);
        // Busca el indice del usuario a actualizar
        const index = users.findIndex(user => user.id === userId);
        //Actualiza el usuaroio con nuevos datos
        users[index] = { ...users[index], ...updatedData };
        await fs.promises.writeFile(this.path, JSON.stringify(users, null, 2), 'utf-8');
        return users;
    }

    // Eliminar usuario por id
    deleteUserById = async (userId) => {
        // Lee archivo .json
        const usersJson = await fs.promises.readFile(this.path, 'utf-8');
        //Convierte el json a un array de usuarios
        const users = JSON.parse(usersJson);
        //Filtra usuarios, eliminando el usuario que tiene el id proporcionado
        const usersFilter = users.filter((userData) => userData.id !== userId);
        // Sobreescribe el archivo .json con la lista filtrada
        await fs.promises.writeFile(this.path, JSON.stringify(usersFilter, null, 2), 'utf-8');
        // Devuelve la lista filtrada de usuarios
        return usersFilter;
    }
}

export default UserManager;