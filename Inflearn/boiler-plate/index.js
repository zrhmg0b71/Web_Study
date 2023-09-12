const express = require('express')  // express 모듈을 가져옴.
const app = express()  // express를 실행하여 app에 할당.
const port = 3000  // 포트 번호를 3000으로 설정.
const bodyParser = require('body-parser')
const { User } = require("./models/User")

const config = require('./config/key')

// application/x-www-form-urlencoded 타입으로 된 것을 분석해서 가져옴
app.use(bodyParser.urlencoded({extended: true}))

// application/json 타입으로 된 것을 분석해서 가져옴
app.use(bodyParser.json())


const mongoose = require('mongoose')
mongoose.connect(config.mongoURI, {
    // useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false
}).then(() => console.log('MongoDB Connected...'))  // 연결이 잘 되었을 때
  .catch(err => console.log(err))  // 연결이 안 되었을 때

app.get('/', (req, res) => res.send('Hello World! 안뇽앙뇬'))

app.post('/register', async (req, res) => {
    // 회원 가입 할 때 필요한 정보들을 Client에서 가져오면
    // 그것들을 데이터 베이스에 넣어줌.
    
    // body parser를 통해 body에 담긴 정보 가져옴 
    const user = new User(req.body)

    // mongoDB 메서드, user 모델에 저장 
    const result = await user.save().then(() => {
        res.status(200).json({
        success: true
        })
    }).catch((err) => {
        res.json({success: false, err})
    })
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))