 import React, {useEffect} from 'react'
import axios from 'axios';
import {withRouter } from 'react-router-dom'
 function LandingPage(props){//Functional Component 만들기
     
    
    useEffect(() => {
        axios.get('/api/hello')      //endpoint. getRequest를 server 즉 index.js로 보내질 것
        .then(response => {console.log(response)})   //server 에서 돌아온 response를 콘솔창에 출력해봄
    }, [])
    
    
    const onClickHandler = () => {
        axios.get('/api/users/logout')
        .then(response => {
            //console.log(response.data)
            if(response.data.success){
                props.history.push("/login")
            }else{
                alert('로그아웃 하는데 실패 했습니다.')
            }
        })
    }


    return(
         <div style={{
             display: 'flex', justifyContent: 'center', alignItems: 'center',
             width: '100%', height: '100vh'
         }}>
          
          <h2> 시작 페이지 </h2>
          

         <button onClick={onClickHandler}>
             로그아웃 
         </button>

         </div>
     )
 }

 export default withRouter(LandingPage)