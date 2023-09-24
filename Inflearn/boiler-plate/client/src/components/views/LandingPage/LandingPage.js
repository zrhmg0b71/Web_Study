import React, { useEffect } from 'react'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { withRouter } from 'react-router-dom';
import { Auth } from '../_actions/user_actions'

function LandingPage() {
    const navigate = useNavigate();

    useEffect(() => {
        axios.get('/api/hello')
        .then(response => {
            if(response.data.success) {
                navigate('/')
            } else {
                alert('로그아웃 하는 데 실패했습니다.')
            }
        })
    }, [])

    const onClickHandler = () => {
        axios.get('/api/users/logout')
        .then(response => {
            console.log(response.data)
        })
    }

    return (
        <div style={{ display:'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: '100vh'
        }}>
            <h2>시작 페이지</h2>

            <button onClick={onClickHandler}>
                로그아웃
            </button>
        </div>
    )
}

export default Auth(LandingPage, null);