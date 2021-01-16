const { User } = require('../../models/User');



let auth = (req, res, next) => {


    //인증 처리를 하는 곳 
    //1. 클라이언트 쿠키에서 토큰을 가져온다. cooike-parser 이용
    let token = req.cookies.x_auth

    //2. 토큰을 복호화한 후 유저를 찾는다. 유저 모델에서 메소드 만들어서 
    User.findByToken(token, (err,user) => {
        if(err) throw err;
        if(!user) return res.json({ isAuth: false, error: true})    //유저가 없을 때. 클라이언트에 전해줌.


        //유저가 있으면 유저 정보 넣어줌 ~> User.js에서 req를 통해 유저 정보에 접근 가능해짐 
        req.token = token;
        req.user = user;
        next(); //미들웨어 끝나고 다음으로 넘어갈 수 있도록 해줌 
         
    })
    //3. 유저가 있으면 인증 Ok
    //4. 유저가 없으면 인증 NO

}

module.exports = {auth};     //auth를 다른 파일에서도 쓸 수 있게 해줌