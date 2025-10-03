import { useCallback, useEffect, useState } from "react"
import {Link, useNavigate} from "react-router-dom"
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../redux/slice/userDataSlice";
import type { ReduxDispatchType,ReduxStoreType } from "../redux/store";


export default function Login(){
    const navigate=useNavigate();
    const [formData,setFormData]=useState({
        email:"",
        password:"",
    });
    const error=useSelector((state:ReduxStoreType)=>state.userData.error)
    const dispatch=useDispatch<ReduxDispatchType>();
    const token=useSelector((state:ReduxStoreType)=>state.userData.userInfo.token);


    useEffect(()=>{
        if(token)   navigate('/');
    },[token,navigate])

    const handleChange=useCallback((e:React.ChangeEvent<HTMLInputElement>)=>{
        setFormData({...formData,[e.target.name]:e.target.value});
    },[formData]);

    const handleSubmit=useCallback(async (e:React.FormEvent)=>{
        e.preventDefault();
        const email=formData.email;
        const password=formData.password;
        dispatch(loginUser({email,password}));
    },[formData,dispatch,loginUser]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-[#fbdfca] via-[#f1a697] to-[#b95b45] px-4">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
                <h2 className="text-3xl font-bold text-center text-gray-800" >Login</h2>
                <p className="text-center text-gray-500 mt-2" >Welcome back to sweets world</p>
                {error && (<p className="text-red-500 text-center mt-2">{error}</p>)}
                <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                        <input type="email"  name="email" id="email" value={formData.email} onChange={handleChange} placeholder="you@example.com" required
                        className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-[#b95b45] focus:outline-none"/>
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                        <input type="password" name="password" id="password" value={formData.password} onChange={handleChange} placeholder="********" required
                        className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-[#b95b45] focus:outline-none"/>
                    </div>
                    <button type="submit" className="w-full py-2 px-4 bg-gradient-to-r from-[#fbdfca] via-[#f1a697] to-[#b95b45] text-white font-semibold 
                    rounded-lg shadow-md hover:opacity-90 transition">Login</button>
                </form>
                <p className="mt-6 text-center text-sm text-gray-600">Don't have an account?{" "} 
                    <Link to="/register" className="text-[#f1a697]">Register</Link>
                </p>
            </div>
        </div>
    )
}