import { useState } from 'react';
import bg from '../../assets/login2.png';
import victory from '../../assets/victory.svg';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { toast } from 'sonner';
import { LOGIN_ROUTE, SIGNUP_ROUTE } from '../../utils/constants';
import apiClient from '../../lib/api-client';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../store';

const Auth = () => {
  //import userinfo from zustand
  const {setUserInfo} = useAppStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confimrPassword, setconfirmPassword] = useState('');
  const navigate = useNavigate();

  const validateSignup = ()=>{
    if(!email.length ){
      toast.error("Email is Required!");
      return false;
    }
    if(!password.length ){
      toast.error("Password is Required!");
      return false;
    }
    if(password !== confimrPassword ){
      toast.error("Password and confirm password should be same!");
      return false;
    }

    return true;
  }

  const validateLogin = ()=>{
    if(!email.length ){
      toast.error("Email is Required!");
      return false;
    }
    if(!password.length ){
      toast.error("Password is Required!");
      return false;
    }

    return true;
  }

  const handleLogin = async () => {
    if(validateLogin()){
      const response = await apiClient.post(LOGIN_ROUTE, {email, password}, {
        withCredentials: true,
      })
      console.log(response);
      setUserInfo(response.data.user)
      if(response.data.user.profileSetup) {
        navigate('/chat');
      }
      else navigate('/profile');
    }
    
  }
  const handleSignup = async () => {
    if(validateSignup()){
      const response = await apiClient.post(SIGNUP_ROUTE, {email, password}, {
        withCredentials: true,
      });
      console.log(response);
      if(response.status === 200){
        setUserInfo(response.data.user)
        navigate('/profile');
      }
    }


  }

  return (
    <div className="h-[100vh] w-[100vw] flex items-center justify-center"
    >

      <div className="h-[80vh] bg-white border-2 border-white text-opacity-90 shadow-2xl w-[80vw] md:w-[90vw] lg:w-[70vw] xl:w-[60vw] rounded-3xl grid xl:grid-cols-2">
        {/* left side  */}
        <div className="flex flex-col gap-10 items-center justify-center"
        >
          <div className="flex items-center justify-center flex-col">
            <div className="flex items-center justify-center">
              <h1 className="text-5xl font-bold md:text-6xl">Welcome</h1>
              <img src={victory} alt="victory" className='h-[100px]' />
            </div>
            <p className='font-medium text-center'>
              Fill in the details to get started with the best chat app!
            </p>

          </div>
          <div className='flex items-center justify-center w-full'>
            <Tabs className={'w-3/4'} defaultValue= "login" >
              <TabsList className={'bg-transparent rounded-none w-full'}>
                <TabsTrigger value="login" className={'data-[state=active]:bg-transparent text-black text-opacity-90 border-b-2 rounded-none w-full data-[state=active]:text-black data-[state=active]:font-semibold data-[state=active]:border-b-purple-500 p-3 transition-all duration-300'}>Login</TabsTrigger>
                <TabsTrigger value='signup' className={'data-[state=active]:bg-transparent text-black text-opacity-90 border-b-2 rounded-none w-full data-[state=active]:text-black data-[state=active]:font-semibold data-[state=active]:border-b-purple-500 p-3 transition-all duration-300'}>Signup</TabsTrigger>
              </TabsList>

              <TabsContent value="login" className='flex flex-col gap-5 mt-5'>
                <Input placeholder="Email" type={"email"} className={'rounded-full p-6'} value={email} onChange={e => setEmail(e.target.value)} />
                <Input placeholder="Password" type={"password"} className={'rounded-full p-6'} value={password} onChange={e => setPassword(e.target.value)} />
                <Button className={'rounded-full p-6'} onClick={handleLogin}>Login</Button>
              </TabsContent>
              <TabsContent value="signup" className='flex flex-col gap-5 mt-5'>
                <Input placeholder="Email" type={"email"} className={'rounded-full p-6'} value={email} onChange={e => setEmail(e.target.value)} />
                <Input placeholder="Password" type={"password"} className={'rounded-full p-6'} value={password} onChange={e => setPassword(e.target.value)} />
                <Input placeholder="Confirm Password" type={"password"} className={'rounded-full p-6'} value={confimrPassword} onChange={e => setconfirmPassword(e.target.value)} />
                <Button className={'rounded-full p-6'} onClick={handleSignup}>Signup</Button>
              </TabsContent>
            </Tabs>
          </div>
        </div>
        {/* right side  */}
        <div className='hidden xl:flex justify-center items-center'>
          <img src={bg} alt="backgroundImage"  className='h-[500px] '/>
        </div>
      </div>
    </div>
  )
}

export default Auth

