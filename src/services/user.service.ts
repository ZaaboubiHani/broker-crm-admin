import axios, { AxiosResponse } from "axios";
import UserModel, { UserType } from "../models/user.model";
import Globals from "../api/globals";



export default class UserService {

    async addUser(user: UserModel): Promise<boolean> {
        const token = localStorage.getItem('token');
        var activityResponse: AxiosResponse;
        var currentUser = await this.getMe();
        if (user.type !== UserType.supervisor) {
            activityResponse = await axios.post(`${Globals.apiUrl}/activities`,
                {
                    data: {
                        delegate: user.id,
                        wilayas: user.wilayas?.map<number>(w => w.id!)
                    }
                }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
        }


        var response = await axios.post(`${Globals.apiUrl}/users`,
            {
                fullName: `${user.username}`,
                username: `${user.username}`,
                email: `${user.email}`,
                password: `${user.password}`,
                phoneOne: user.phoneOne,
                creatorId: currentUser.id,
                confirmed: true,
                role: 1,
                relatedType: user.type === UserType.delegate ? 3 : user.type === UserType.supervisor ? 2 : 4,
                wilayaActivity: user.type !== UserType.supervisor ? activityResponse!.data.data.id : null
            }, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.status == 200) {

            return true;
        }
        return false;
    }

    async updateUser(user: UserModel): Promise<boolean> {

        const token = localStorage.getItem('token');

        var activityResponse = await axios.get(`${Globals.apiUrl}/users/${user.id}?fields[0]=id&populate=wilayaActivity`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

        if (activityResponse.data.wilayaActivity) {
            await axios.put(`${Globals.apiUrl}/activities/${activityResponse.data.wilayaActivity.id}`,
                {
                    data: {
                        wilayas: user.wilayas?.map<number>(w => w.id!)
                    }
                }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
        }

        await axios.put(`${Globals.apiUrl}/users/${user.id}`,
            {
                data: {
                    password: `${user.password}`,
                    blocked: user.isBlocked,
                }
            }, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });


        return true;
    }

    async getUser(userId: number): Promise<UserModel> {
        var token = localStorage.getItem('token');
        var response = await axios.get(`${Globals.apiUrl}/users/${userId}?populate=*`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

        if (response.status == 200) {

            var user = UserModel.fromJson(response.data);
            user.token = token!;
            Globals.user = user;
            return user;
        }
        return new UserModel({});
    }

    async getAllUsers(): Promise<UserModel[]> {
        const token = localStorage.getItem('token');
        //filters[relatedType][id][\$eq]=3&
        var response = await axios.get(`${Globals.apiUrl}/users?populate=wilayaActivity.wilayas&populate=relatedType&populate=company`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
        if (response.status == 200) {
            var users: UserModel[] = [];
            for (let index = 0; index < response.data.length; index++) {
                var user = UserModel.fromJson(response.data[index]);

                users.push(user);
            }
            return users;
        }
        return [];
    }

    async getUsersByType(creatorId: number): Promise<UserModel[]> {
        const token = localStorage.getItem('token');


        var response = await axios.get(`${Globals.apiUrl}/users?populate=wilayaActivity.wilayas&populate=relatedType&populate=company&filters[creatorId][\$eq]=${creatorId}`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
        if (response.status == 200) {
            var users: UserModel[] = [];
            for (let index = 0; index < response.data.length; index++) {
                var user = UserModel.fromJson(response.data[index]);

                users.push(user);
            }
            return users;
        }
        return [];
    }

    async getDelegateUsers(): Promise<UserModel[]> {
        const token = localStorage.getItem('token');
        var response = await axios.get(`${Globals.apiUrl}/users?filters[relatedType][id]=3&populate=*`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

        if (response.status == 200) {
            var users: UserModel[] = [];
            for (let index = 0; index < response.data.length; index++) {
                var user = UserModel.fromJson(response.data[index]);
                users.push(user);
            }
            return users;
        }
        return [];
    }

    async getMe(): Promise<UserModel> {
        const token = localStorage.getItem('token');
        var response = await axios.get(`${Globals.apiUrl}/users/me?populate=*`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
        if (response.status == 200) {
            var user = UserModel.fromJson(response.data);
            user.token = token || undefined;
            return user;
        }
        return new UserModel({});
    }
}