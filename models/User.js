const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRoudns = 10  //암호화하는데에 필요한 salt의 글자 수(길이)


const jwt = require('jsonwebtoken');

const userSchema = mongoose.Schema({
    name:{
        type: String,
        maxLength: 50
    },
    email: {
        type: String,
        trim: true,      //공백 없애줌 
        unique: 1
    },
    password: {
        type: String,
        maxLength: 100
    },
    lastname: {
        type: String,
        maxLength:50
    },
    role: {
        type: Number,
        default: 0
    },
    image: String,
    token: {    //유효성 관리 
        type: String
    },
    tokenExp: { //토큰 사용 가능한 유효기간 
        type: Number
    }
})



//저장하기 전에 비밀번호를 암호화시킨다. index.js의 save 함수 실행 전에! 
userSchema.pre('save', function(next){
    var user = this;

    if(user.isModified('password')){//비밀번호를 바꿀때만 암호화해야함. 이메일 바꿨는데 비밀번호가 암호화 되면 x 

        bcrypt.genSalt(saltRoudns, function(err,salt){
            if(err) return next(err)


            //user.password : client가 입력한 비밀번호
            //hash : 암호화된 비밀번호 
            bcrypt.hash(user.password, salt, function(err, hash){
                if(err) return next(err)
                user.password = hash        //해시된 비밀번호로 교체
                next()
            })
        })
    } else{ //다른거 바꿀때는 다음으로 넘어감 
        next()
    }
}) 


//함수 정의     
userSchema.methods.comparePassword = function(plainPassword, cb){   //cb : callback function
    
    //암호화된 비밀번호 복호화 불가 -> plain password를 암호화해서 그 결과값 비교해봐야함
    bcrypt.compare(plainPassword, this.password, function(err,isMatch){
        if(err) return cb(err);
        cb(null, isMatch)
        

    })
}

userSchema.methods.generateToken = function(cb) {
    var user = this;
    
    //jsonwebtoken을 이용해서 token 생성하기 
    var token = jwt.sign(user._id.toHexString(),  'secretToken')

    user.token = token                      //만든 값 넣어주기
    user.save(function(err,user){
        if(err) return cb(err)              //에러 발생시 콜백으로 에러 전달

        cb(null, user)                       //에러 발생 안하면 err는 null이고 user 정보 전달
    })

}

userSchema.statics.findByToken = function(token,cb){
    var user = this;

    //가져온 토큰(token)을 디코드한다.
    jwt.verify(token, 'secretToken', function(err,decoded) { 

        //유저 아이디(decoded)를 이용해서 유저를 찾은 다음,
        //클라이언트에서 가져온 token과 DB에 보관된 cctoken이 일치하는지 확인


        //findOne()는 MongoDB에 이미 있는 함수임. id와 token으로 찾을것
        user.findOne({"_id": decoded, "token": token}, function(err,user){
            if(err) return cb(err)  //에러 있으면 콜백으로 에러 전달
            cb(null, user)          //에러 없으면 유저 정보 전달
        })
    })
}

const User = mongoose.model('User', userSchema)

module.exports = {User}         //이 스키마를 다른 파일에서도 쓸 수 있게 함 