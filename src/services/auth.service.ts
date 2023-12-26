import axios from "axios";
import User, { UserType } from "../models/user.model";
import Globals from "../api/globals";




export default class AuthService {
    private static _instance: AuthService | null = null;

    private constructor() {
    }
  
    static getInstance(): AuthService {
      if (!AuthService._instance) {
        AuthService._instance = new AuthService();
      }
      return AuthService._instance;
    }
    async login(identifier: string, password: string): Promise<boolean> {
        try {
            var response = await axios.post(`${Globals.apiUrl}/auth/local`,
                {
                    'identifier': `${identifier}`,
                    'password': `${password}`
                });
            if (response.status == 200) {
                localStorage.setItem('token', response.data['jwt']);
                localStorage.setItem('isLogged', 'true');
                return true;
            }
            return false;
        } catch (error) {
            return false;
        }

    }

    async logout(): Promise<boolean> {
        try {
            localStorage.clear();
            return true;

        } catch (error) {
            return false;
        }

    }
}