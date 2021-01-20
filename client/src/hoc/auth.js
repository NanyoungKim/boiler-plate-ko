import React, {useEffect} from 'react';
import axios from 'axios';
import {useDispatch} from 'react-redux'
import {auth} from '../_actions/user_action'
export default function (SpecificComponent, option, adminRoute = null){


    function AuthenticationCheck(props){

        const dispatch = useDispatch();

        useEffect(() => {
                    //auth는 action이름 
            dispatch(auth()).then(response => { //backend에서 처리한 정보들이 response안에 다 들어있음 
                console.log(response)


                //로그인 하지 않은 상태인데 
                if(!response.payload.isAuth) {  //option이 true이면 즉 로그인 된 유저만 들어갈 수 있어야하면 
                    if(option){
                        props.history.push('/login')
                    }
                } else{ //로그인 된 상태인데 
                    if(adminRoute && !response.payload.isAdmin){
                        props.history.push('/')
                    }
                    else{
                        if(option===false){ //option이 false면 로그인한 유저는 출입 불가능함. 로그인 페이지 or 회원가입 페이지
                            props.history.push('/')
                        }
                    } 
                }

            })
            
        }, [])

        return (
            <SpecificComponent/>
        )
    }


    return AuthenticationCheck
}