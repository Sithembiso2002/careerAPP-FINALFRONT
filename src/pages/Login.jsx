import React, {useState} from 'react';
import API from '../api';
export default function Login(){
  const [email,setEmail] = useState(''); const [password,setPassword]=useState('');
  const [msg,setMsg] = useState('');
  const submit = async (e)=>{
    e.preventDefault();
    try {
      const res = await API.post('/auth/login',{email,password});
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      setMsg('Logged in as ' + res.data.user.role);
    } catch (e) {
      setMsg(e.response?.data?.error || 'Login failed');
    }
  };
  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={submit}>
        <input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} /><br/>
        <input placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} /><br/>
        <button>Login</button>
      </form>
      <p>{msg}</p>
    </div>
  );
}
