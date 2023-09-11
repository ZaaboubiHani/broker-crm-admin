import axios from "axios";
import User, { UserType } from "../models/user.model";
import Globals from "../api/globals";




export default class AuthService {

    async login(identifier: string, password: string): Promise<number> {
        var response = await axios.post(`${Globals.apiUrl}/auth/local`,
            {
                "identifier": `${identifier}`,
                "password": `${password}`
            });
        if (response.status == 200) {
            Globals.user = new User({token: response.data['jwt']});
            return response.data['user']['id'];
        }
        return 0;
    }
}