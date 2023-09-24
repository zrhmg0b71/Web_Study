import React, { useEffect } from 'react'
// import Axios from 'axios';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { auth } from '../_actions/user_actions'

const Auth = (SpecificComponent, option, adminRoute = null) => {
    function AuthenticationCheck(props) {
        const dispatch = useDispatch()
        const navigate = useNavigate();

        useEffect(() => {
            dispatch(auth()).then(response => {
                console.log(response)

                // 로그인 하지 않은 상태
                if(!response.payload.isAuth) {
                    if(option) {
                        navigate('/login')
                    }
                } else { // 로그인한 상태 
                    if(adminRoute && !response.payload.isAdmin) {
                        navigate('/')
                    } else {
                        if (option === false)
                            navigate('/')
                    }
                }
            })
        }, []);

        return (
            <SpecificComponent />
        )
    }

    return AuthenticationCheck;
}

export default Auth;