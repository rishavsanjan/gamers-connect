'use client'
import axios from 'axios';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { login } from '@/lib/auth';
import { getUserInformation } from '@/components/UserInformation';


const Login = () => {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState('login');
    const [loginForm, setLoginForm] = useState({
        email: "",
        password: ""
    });
    const [signUpForm, setSignUpForm] = useState({
        email: "",
        password: "",
        username: "",
        confirmpassword: ""
    });

    const [errors, setErros] = useState({
        email: "",
        password: ''
    })

    useEffect(() => {
        const getUserInfo = async () => {
            const info = await getUserInformation();
            console.log(info)
        }

        getUserInfo()
    }, [])



    const handleSignUpSubmit = async () => {
        console.log('k')
        if (signUpForm.password.length < 8) {
            setErros(prev => ({ ...prev, password: 'Password must be at least 8 characters long' }));
            return;
        }

        if (signUpForm.password !== signUpForm.confirmpassword) {
            setErros(prev => ({ ...prev, password: "Passwords don't match" }));
            return;
        }

        const response = await axios({
            url: "/api/auth/signup",
            data: {
                email: signUpForm.email,
                username: signUpForm.username,
                password: signUpForm.password
            },
            method: 'post'
        })


        console.log(response.data)
    }

    const handleLoginSubmit = async () => {
        console.log('k')
        if (loginForm.password.length < 8) {
            setErros(prev => ({ ...prev, password: 'Password must be at least 8 characters long' }));
            return;
        }

        const response = await axios({
            url: "/api/auth/login",
            data: {
                email: loginForm.email,
                password: loginForm.password
            },
            method: 'post'
        })
        if (response.data.success) {
            localStorage.setItem('gametoken', response.data.token);
            router.push('/');
        }
        console.log(response.data)


    }



    return (
        <div className='flex flex-col items-center justify-center h-screen relative'>
            <img
                src="https://cdn.pixabay.com/photo/2024/05/24/16/40/ai-generated-8785420_1280.jpg"
                alt="Hero Background"
                className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm"></div>
            <div className='z-10 flex-col flex items-center gap-2 mb-8'>
                <h1 className='text-5xl font-bold'>Welcome Back</h1>
                <span className='text-gray-500 font-medium '>Join the ultimate gaming community</span>
            </div>

            <div className='z-10 bg-black/50 p-8 flex flex-col gap-4 w-96 rounded-xl'>
                <div className='flex flex-row justify-between gap-4'>
                    <button className={`${activeTab === 'login' ? 'bg-gradient-to-r from-purple-400 to-pink-600' : 'bg-black/50'} w-full p-2 px-8 rounded-lg`} onClick={() => {
                        setActiveTab('login')
                        setLoginForm(prev => ({
                            ...prev, email: '', password: ''
                        }))
                        setErros(prev => ({
                            ...prev, email: '', password: ''
                        }))
                    }}>Login</button>
                    <button className={`${activeTab === 'signup' ? 'bg-gradient-to-r from-purple-400 to-pink-600' : 'bg-black/50'} w-full p-2 px-8 rounded-lg`} onClick={() => {
                        setActiveTab('signup')
                        setSignUpForm(prev => ({
                            ...prev, email: '', password: '', username: '', confirmpassword: ""
                        }))
                        setErros(prev => ({
                            ...prev, email: '', password: ''
                        }))
                    }}>Sign Up</button>
                </div>
                <div className='flex flex-col gap-4'>
                    {
                        activeTab === 'login' ?
                            <>
                                <div>
                                    <p>Email</p>
                                    <input value={loginForm.email} onChange={(e) => { setLoginForm(prev => ({ ...prev, email: e.target.value })) }} placeholder='e.g. test@gmail.com' className='bg-black/30 w-full p-3 rounded-lg my-2 placeholder:text-gray-500/70' type="email" />
                                </div>
                                <div>
                                    <p>Password</p>
                                    <input value={loginForm.password} onChange={(e) => { setLoginForm(prev => ({ ...prev, password: e.target.value })) }} placeholder='Enter password' className='bg-black/30 w-full p-3 rounded-lg my-2 placeholder:text-gray-500/70' type="password" />
                                </div>
                            </>

                            :

                            <>
                                <div>
                                    <p>Username</p>
                                    <input value={signUpForm.username} onChange={(e) => { setSignUpForm(prev => ({ ...prev, username: e.target.value })) }} placeholder='Enter username' className='bg-black/30 w-full p-3 rounded-lg my-2 placeholder:text-gray-500/70' type="text" />
                                </div>
                                <div>
                                    <p>Email</p>
                                    <input
                                        required
                                        value={signUpForm.email}
                                        onChange={(e) => { setSignUpForm(prev => ({ ...prev, email: e.target.value })) }}
                                        placeholder='e.g. test@gmail.com'
                                        className='bg-black/30 w-full p-3 rounded-lg my-2 placeholder:text-gray-500/70' type="email" />
                                </div>
                                <div>
                                    <p>Password</p>
                                    <input value={signUpForm.password} onChange={(e) => { setSignUpForm(prev => ({ ...prev, password: e.target.value })) }} placeholder='Enter password' className='bg-black/30 w-full p-3 rounded-lg my-2 placeholder:text-gray-500/70' type="password" />
                                    <p className='text-red-500'>{errors.password}</p>
                                </div>
                                <div>
                                    <p>Confirm Password</p>
                                    <input value={signUpForm.confirmpassword} onChange={(e) => { setSignUpForm(prev => ({ ...prev, confirmpassword: e.target.value })) }} placeholder='Confirm password' className='bg-black/30 w-full p-3 rounded-lg my-2 placeholder:text-gray-500/70' type="password" />
                                </div>
                            </>
                    }

                </div>
                <div className='self-center'>
                    <button
                        onClick={() => {
                            activeTab === 'signup' ? handleSignUpSubmit() : handleLoginSubmit()
                        }}
                        className='bg-gradient-to-r from-purple-700 to-pink-400 p-2 px-8 rounded-lg cursor-pointer'>
                        {activeTab === 'login' ? 'Login' : 'Sign Up'}</button>
                </div>
                <p className='text-center text-gray-300/50'>Or</p>
                <div className='self-center'>
                    <button onClick={() => { login() }} className='flex flex-row items-center gap-4 bg-gray-600 p-2 rounded-lg cursor-pointer'>
                        <img className=' w-8 h-8' src="https://img.icons8.com/?size=100&id=YSWCDCSF4H3N&format=png&color=1A1A1A" alt="" />
                        <p>SignIn with Github</p>
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Login