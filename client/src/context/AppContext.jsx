import { children, createContext, useContext, useEffect, useState } from "react"
import axios from "axios";
import {useNavigate} from 'react-router-dom'
import toast from "react-hot-toast";
const AppContext = createContext()


axios.defaults.baseURL= import.meta.env.VITE_BACKEND_URL;

export const AppProvider=({ children })=>{

    const navigate =useNavigate()

    const [token,setToken]=useState(null)
    const [blogs,setBlogs]=useState([])
     const [input,setInput]=useState("")

    const fetchBlogs = async () => {
  try {
    const { data } = await axios.get('/api/blog/all');
    //console.log("📦 API response:", data); // ✅ Log the response for debugging
    data.success && Array.isArray(data.blogs)
      ? setBlogs(data.blogs)
      : toast.error(data.message || "Invalid blog data");
  } catch (error) {
    toast.error(error.message);
  }
};


    useEffect(()=>{
            fetchBlogs();
            const token=localStorage.getItem('token')
            if (token) {
                setToken(token)
                axios.defaults.headers.common['Authorization']=`${token}`;
            }
    },[])
    const value={
        axios,navigate,token,setToken,blogs,setBlogs,input,setInput
    }
    return (
        
        <AppContext.Provider value={value}>
            { children }
            </AppContext.Provider>
    )
}
export const useAppContext= ()=>{
    return useContext(AppContext)
};