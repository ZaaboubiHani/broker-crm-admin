import axios, { AxiosResponse } from "axios";
import UserModel, { UserType } from "../models/user.model";
import Globals from "../api/globals";



export default class UserService {
    private static _instance: UserService | null = null;

    private constructor() {
    }

    static getInstance(): UserService {
        if (!UserService._instance) {
            UserService._instance = new UserService();
        }
        return UserService._instance;
    }

    async addUser(user: UserModel): Promise<boolean> {
        const token = localStorage.getItem('token');
        var activityResponse: AxiosResponse;
        var currentUser = await this.getMe();
        var companyResponse = await axios.get(`${Globals.apiUrl}/companies`,
           {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (user.type !== UserType.supervisor) {
            activityResponse = await axios.post(`${Globals.apiUrl}/activities`,
                {
                    data: {
                        delegate: user.id,
                        wilayas: user.wilayas?.map<number>(w => w.id!),
                        
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
                company: companyResponse.data.data[0].id ,
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
            console.log({
                wilayas: user.wilayas?.map<number>(w => w.id!)
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

        if (user.password && user.password?.length >= 8) {

            await axios.put(`${Globals.apiUrl}/updateUser`,
                {
                    User: {
                        id: user.id,
                        password: `${user.password}`
                    }
                }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
        }

        var res = await axios.put(`${Globals.apiUrl}/updateUser`,
            {
                User: {
                    id: user.id,
                    isBlocked: user.isBlocked,
                    username: user.username,
                    email: user.email,
                    phoneOne: user.phoneOne,
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

    async getUsersByCreator(creatorId: number, userType: UserType): Promise<UserModel[]> {

        const token = localStorage.getItem('token');

        var typeFilter = '';

        switch (userType) {
            case UserType.delegate: {
                typeFilter = `&filters[relatedType][reference][$eq]=delegate`;
                break;
            }
            case UserType.supervisor: {
                typeFilter = `&filters[relatedType][reference][$eq]=supervisor`;
                break;
            }
            case UserType.kam: {
                typeFilter = `&filters[relatedType][reference][$eq]=cam`;
                break;
            }
            case UserType.operator: {
                typeFilter = `&filters[$and][0][relatedType][reference][$ne]=operator&filters[$and][1][relatedType][reference][$ne]=admin&filters[$and][2][relatedType][reference][$ne]=delegate`;
                break;
            }
            case UserType.admin: {
                typeFilter = `&filters[$and][0][relatedType][reference][$ne]=admin&filters[$and][1][relatedType][reference][$ne]=delegate`;
                break;
            }
            default: {
                typeFilter = '';
                break;
            }
        }

        var response = await axios.get(`${Globals.apiUrl}/users?populate=wilayaActivity.wilayas&populate=relatedType&populate=company${userType === UserType.delegate ? `&filters[creatorId][\$eq]=${creatorId}` : ''}${typeFilter}`,
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

        try {
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
        } catch (error: any) {
            if (error.response.status === 401) {
                return new UserModel({ isBlocked: true });
            }
            return new UserModel({});
        }
    }
}