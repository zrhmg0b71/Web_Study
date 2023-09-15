const express = require('express')  // express 모듈을 가져옴.
const app = express()  // express를 실행하여 app에 할당.
const port = 3000  // 포트 번호를 3000으로 설정.
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const { User } = require("./models/User")
const { auth } = require("./middleware/auth");

const config = require('./config/key')

// application/x-www-form-urlencoded 타입으로 된 것을 분석해서 가져옴
app.use(bodyParser.urlencoded({extended: true}))

// application/json 타입으로 된 것을 분석해서 가져옴
app.use(bodyParser.json())
app.use(cookieParser());

const mongoose = require('mongoose')
mongoose.connect(config.mongoURI, {
    // useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false
}).then(() => console.log('MongoDB Connected...'))  // 연결이 잘 되었을 때
  .catch(err => console.log(err))  // 연결이 안 되었을 때

app.get('/', (req, res) => res.send('Hello World! 안뇽앙뇬'))

app.post('/api/users/register', async (req, res) => {
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

app.post('/api/users/login', (req, res) => {
    // 요청된 이메일을 데이터베이스에서 있는지 찾음 
    User.findOne({ email: req.body.email }).then(user=>{
        if(!user) {
            return res.json({
                loginSuccess: false,
                message: "제공된 이메일에 해당하는 유저가 없습니다."
            })
        }

        // 요청된 이메일이 데이터 베이스에 있따면 비밀번호가 맞는 비밀번호인지 확인 
        user.comparePassword(req.body.password, (err, isMatch) => {
            if(!isMatch) return res.json({ loginSuccess: false, message: "비밀번호가 틀렸습니다."})
            
            // 비밀번호까지 맞으면 토큰을 생성하기 
            user.generateToken((err, user) => {
                if(err) return res.status(400).send(err);

                // 토큰을 저장한다. 어디에? 쿠키, 로컬스토리지
                res.cookie("x_auth", user.token)
                .status(200)
                .json({ loginSuccess: true, userId: user._id })
            })
        })
    })
    .catch((err)=>{
        return res.status(400).send(err);
    })
})

// role 1 어드민        role 2 특정 부서 어드민
// role 0 -> 일반유저       role 0이 아니면 관리자 
app.get('/api/users/auth', auth, (req, res) => {
    // 여기까지 미들웨어를 통과해 왔다는 얘기는
    // Authentication 이 True라는 말
    res.status(200).json({
        _id: req.user._id,
        isAdmin: req.user.role === 0 ? false : true,
        isAuth: true,
        email: req.user.email,
        name: req.user.name,
        lastname: req.user.lastname,
        role: req.user.role,
        image: req.user.image,
    })
})

app.get('/api/users/logout', auth, (req, res) => {
    User.findOneAndUpdate({ _id: req.user._id}, {token: ""})
    .then(() => {
        return res.status(200).send({ success: true });
    })
    .catch((err) => {
        return res.json({ success: false, err})
    });
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))