const express = require('express')
const app = express()
const port = 5000

const config = require('./config/key');

//body-parser 와 User 가져오기 
const bodyParser = require('body-parser');
const {User} = require("./models/User"); 

//bodyParser에 옵션주기
app.use(bodyParser.urlencoded({extended: true}));   //Clinet가 보낸 application/x-www-form-urlencoded로 된 데이터를 분석해서 가져올 수 있도록 함
app.use(bodyParser.json());                         //이건 application/json 형태의 데이터 가져올 수 있게 함 




const mongoose = require('mongoose')
mongoose.connect(config.mongoURI,{
    useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false
}).then(() => console.log('MongoDB Connected...'))
.catch(err => console.log(err))



app.get('/', (req, res) => {
  res.send('Hello World! 수정됨!!!! ')
})

        //endpoint
app.post('/register', (req,res) => {

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

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})


