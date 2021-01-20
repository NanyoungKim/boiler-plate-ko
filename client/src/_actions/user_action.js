import Axios from 'axios';
import {
    LOGIN_USER, REGISTER_USER, AUTH_USER
} from './types';


export function loginUser(dataTosubmit) {

    const request = Axios.post('/api/users/login', dataTosubmit)        //서버에 리퀘스트 날리고 
        .then(response => response.data)                     //받은 데이터를 request에 저장


        return {                     //Action 했으니까 이제 Reducer로 보냄
            type: LOGIN_USER,
            payload: request
        }
    

}


export function registerUser(dataTosubmit) {

    const request = Axios.post('/api/users/register', dataTosubmit)         //서버에 리퀘스트 날리고 
        .then(response => response.data)                                    //받은 데이터를 request에 저장


        return {                    //Action 했으니까 이제 Reducer로 보냄
            type: REGISTER_USER,
            payload: request
        }
    

}

export function auth() {

    const request = Axios.get('/api/users/auth')        //endpoint로 get request , get이니까 login과 다르게 get 이니까 body 파라미터 필요 없음 
        .then(response => response.data)                     


        return {                    //Action 했으니까 이제 Reducer로 보냄
            type: AUTH_USER,
            payload: request
        }
    

}



