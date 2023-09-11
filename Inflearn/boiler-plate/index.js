const express = require('express')  // express 모듈을 가져옴.
const app = express()  // express를 실행하여 app에 할당.
const port = 3000  // 포트 번호를 3000으로 설정.

const mongoose = require('mongoose')
mongoose.connect('mongodb+srv://Naheun:abcd1234@webstudy.wtdaqh9.mongodb.net/?retryWrites=true&w=majority', {
    // useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false
}).then(() => console.log('MongoDB Connected...'))  // 연결이 잘 되었을 때
  .catch(err => console.log(err))  // 연결이 안 되었을 때


app.get('/', (req, res) => res.send('Hello World!'))

app.listen(port, () => console.log(`Example app listening on port ${port}!`))