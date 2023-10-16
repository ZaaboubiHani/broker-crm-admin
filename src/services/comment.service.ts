import axios from "axios";
import CommentModel from "../models/comment.model";
import Globals from "../api/globals";

export default class CommentService {

    async getAllComments(): Promise<CommentModel[]> {
        const token = localStorage.getItem('token');
        var response = await axios.get(`${Globals.apiUrl}/company-comments`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

        if (response.status == 200) {
            var comments: CommentModel[] = [];
            for (let index = 0; index < response.data.data.length; index++) {
                var comment = CommentModel.fromJson(response.data.data[index]);
                comments.push(comment);
            }
            return comments;
        }
        return [];
    }

    async getDraftedComments(): Promise<CommentModel[]> {
        const token = localStorage.getItem('token');
        var response = await axios.get(`${Globals.apiUrl}/company-comments?publicationState=preview&filters[publishedAt][$null]=true`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

        if (response.status == 200) {
            var comments: CommentModel[] = [];
            for (let index = 0; index < response.data.data.length; index++) {
                var comment = CommentModel.fromJson(response.data.data[index]);
                comments.push(comment);
            }
            return comments;
        }
        return [];
    }

    async createComment(comment: string): Promise<boolean> {
        const token = localStorage.getItem('token');
        var response = await axios.post(`${Globals.apiUrl}/company-comments`,
            {
                data: {
                    comment: `${comment}`,
                    company: 1
                }
            },
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

        if (response.status == 200) {
            return true;
        }
        return false;
    }
    async draftComment(commentId: number): Promise<boolean> {
        const token = localStorage.getItem('token');
        var response = await axios.put(`${Globals.apiUrl}/company-comments/${commentId}`,
            {
                data: {
                    publishedAt: null
                }
            },
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

        if (response.status == 200) {

            return true;
        }
        return false;
    }
    async publishComment(commentId: number): Promise<boolean> {
        const token = localStorage.getItem('token');
        var response = await axios.put(`${Globals.apiUrl}/company-comments/${commentId}`,
            {
                data: {
                    publishedAt: new Date()
                }
            },
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

        if (response.status == 200) {

            return true;
        }
        return false;
    }
}