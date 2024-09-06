import Cookies from 'js-cookie';

export const retriveUserID = async()=>{
    const apiURL = import.meta.env.VITE_SERVER_BASE_URL;
    try
    {
        const response = await fetch(`${apiURL}/api/user/auth`,{
            method: "POST",
            headers:{"Content-Type": "application/json"},
            credentials: 'include'
          });
          const data = await response.json();
          return data;
    }
    catch(error)
    {
        return error;
    }
  }