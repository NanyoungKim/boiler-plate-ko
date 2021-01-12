const mongoose = require('mongoose')


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
        maxLength: 50
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

const User = mongoose.model('User', userSchema)

module.exports = {User}         //이 스키마를 다른 파일에서도 쓸 수 있게 함