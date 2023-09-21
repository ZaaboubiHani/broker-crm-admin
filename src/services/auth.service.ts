import axios from "axios";
import User, { UserType } from "../models/user.model";
import Globals from "../api/globals";




export default class AuthService {

    async login(identifier: string, password: string): Promise<boolean> {
        try {
            var response = await axios.post(`${Globals.apiUrl}/auth/local`,
                {
                    'identifier': `${identifier}`,
                    'password': `${password}`
                });
            if (response.status == 200) {
                localStorage.setItem('token', response.data['jwt']);
                localStorage.setItem('id', response.data.user.id);
                return true;
            }
            return false;
        } catch (error) {
            return false;
        }

    }
}