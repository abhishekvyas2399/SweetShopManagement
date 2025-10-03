import { useCallback, useEffect, useState } from "react"
import {Link, useNavigate} from "react-router-dom"
import { useDispatch, useSelector } from "react-redux";
import type { ReduxDispatchType, ReduxStoreType } from "../redux/store";
import { registerUser } from "../redux/slice/userDataSlice";

export default function Register(){
    const navigate=useNavigate();
    const [formData,setFormData]=useState({
        name:"",
        email:"",
        password:"",
        confirmPassword:""
    });
    const error=useSelector((state:ReduxStoreType)=>state.userData.error);
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
        if(formData.password!==formData.confirmPassword){
            alert("password not match...");
            return;
        }
        const name=formData.name;
        const email=formData.email;
        const password=formData.password;
        dispatch(registerUser({name,email,password}));
    },[formData,dispatch,registerUser]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-[#fbdfca] via-[#f1a697] to-[#b95b45] px-4">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
                <h2 className="text-3xl font-bold text-center text-gray-800" >Create Account</h2>
                <p className="text-center text-gray-500 mt-2" >Join us and explore the sweet world</p>
                {error && (<p className="text-red-500 text-center mt-2">{error}</p>)}
                <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                        <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} placeholder="full name" required
                        className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-[#b95b45] focus:outline-none"/>
                    </div>
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
                    <div>
                        <label htmlFor="confirmPass" className="block text-sm font-medium text-gray-700"> Confirm Password </label> 
                        <input type="password" name="confirmPassword" id="confirmPass"value={formData.confirmPassword} onChange={handleChange} placeholder="********" required
                        className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-[#b95b45] focus:outline-none"/>
                    </div>
                    <button type="submit" className="w-full py-2 px-4 bg-gradient-to-r from-[#fbdfca] via-[#f1a697] to-[#b95b45] text-white font-semibold 
                    rounded-lg shadow-md hover:opacity-90 transition">Register</button>
                </form>
                <p className="mt-6 text-center text-sm text-gray-600">Already have an account?{" "} 
                    <Link to="/login" className="text-[#f1a697]">Login</Link>
                </p>
            </div>
        </div>
    )
}