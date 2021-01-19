const express = require('express')
const app = express()

const port = 5000
const config = require('./config/key');

const cookieParser = require('cookie-parser');

//body-parser 와 User 가져오기 
const bodyParser = require('body-parser');
const { User} = require("../models/User"); 

const { auth } = require('./middleware/auth');

//bodyParser에 옵션주기
app.use(bodyParser.urlencoded({extended: true}));   //Clinet가 보낸 application/x-www-form-urlencoded로 된 데이터를 분석해서 가져올 수 있도록 함
app.use(bodyParser.json());                         //이건 application/json 형태의 데이터 가져올 수 있게 함 

app.use(cookieParser());


const mongoose = require('mongoose')
mongoose.connect(config.mongoURI,{
    useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false
}).then(() => console.log('MongoDB Connected...'))
.catch(err => console.log(err))



app.get('/', (req, res) => {
  res.send('Hello World! 수정됨!!!! ')  
})

app.get('/api/hello', (req,res) => {
    res.send('안녕하세요~')
})




        //endpoint
app.post('/api/users/register', (req,res) => {

    //회원 가입할 때 필요한 정보들을 Client에서 가져오면
    //그것들을 DB에 넣는다.

    const user = new User(req.body)

    //req.body에는 아래와 같이 body-parser를 이용해서 json 형태로 받은 데이터 들어있음
    // {
    //     id: "hello"
    //     password: "123"
    // }


    user.save((err, userInfo) =>{
        if(err) return res.json({success: false, err})  //실패하면 에러메세지를 json 형태로 출력 
        return res.status(200).json({   //status(200)은 성공했다는 뜻
            success: true
        })
    }) //MongoDB에서 오는 메소드 

})


//로그인 기능 
app.post('/api/users/login',(req,res) => {


    //로그인 라우터에서 할 일 
    //1. 요청된 이메일이 디비에 있는지 찾는다.
    User.findOne({email: req.body.email }, (err,user) => {
        if(!user) {
            return res.json({
                loginSuccess: false,
                message: "제공된 이메일에 해당하는 유저가 없습니다."
            })
        }
    
        //2. 요청된 이메일이 디비에 있다면 유저가 입력한 비밀번호가 맞는 비밀번호인지 확인 
        user.comparePassword(req.body.password, (err,isMatch) => {
            if(!isMatch)    //비밀번호 틀렸으면 틀렸다고 알려주는 response를 clinet에게 줌
                return res.json({loginSuccess: false, message: "비밀번호가 틀렸습니다." })
            

            //3. 비밀번호까지 맞다면 토큰 생성
            user.generateToken((err, user) => {
                if(err) return res.status(400).send(err);   //에러 발생 시, client에게 에러 있다고 알려주고(400), 에러 메세지도 함께 send
                
                //token을 저장한다. 어디에? 여러군데에 할 수 있음. 쿠키, 로컬스토리지,세션,,, 
                //어디가 안전한지에 대해 논란 많은데 여기선 쿠키에 할 것! (각각 장단점이 있음)

                
                res.cookie("x_auth", user.token)        //x_auth는 임의로 설정한 값
                .status(200)    //성공했다고 알려줌
                .json({loginSuccess: true, userId: user._id})

            })    
            
        })
    })
})



//Authentication 인증 부분
app.get('/api/users/auth', auth , (req,res) => {    //auth : 미들웨어 -> 

 
    //미들웨어 auth에 문제 생겨서 false가 되면 미들웨어내에서 return돼서 다른 곳으로 빠져나감. 
    //즉, 여기까지 미들웨어를 통과해 왔다는 얘기는 Authentication이 True 라는 말
    //True니까 유저 정보를 클라이언트에 전달해주면 됨

    res.status(200).json({  //클라이언트에 유저 정보 제공
        _id: req.user._id,
        isAdmin: req.user.role === 0 ? false : true,        //관리자 유저인지 아닌지. role이
        isAuth: true,
        email: req.user.email,
        name: req.user.name,
        lastname: req.user.lastname,
        role: req.user.role,
        image: req.user.image

    })

})


//로그아웃 기능
app.get('/api/users/logout', auth, (req,res) => {

    User.findOneAndUpdate({ _id: req.user._id },
        { token: "" }             //토큰을 지워준다
        , (err,user) => {       //콜백 함수
        if(err) return res.json({ success: false, err });
        return res.status(200).send({
            success: true
        })
    })
})





// app.listen(port, () => {
//   console.log(`Example app listening at http://localhostc:${port}`)
// })

app.listen(port, () => console.log(`Example app listening on port ${port}!`))