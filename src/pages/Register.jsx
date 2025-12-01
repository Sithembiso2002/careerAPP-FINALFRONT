import React, {useState} from 'react';
import API from '../api';
export default function Register(){
  const [email,setEmail] = useState(''); const [password,setPassword]=useState(''); const [role,setRole]=useState('student'); const [name,setName]=useState('');
  const [msg,setMsg]=useState('');
  const submit = async (e)=>{
    e.preventDefault();
    try {
      const res = await API.post('/auth/register',{email,password,role,name});
      setMsg('Registered. Role: '+res.data.user.role);
    } catch (e) {
      setMsg(e.response?.data?.error || 'Registration failed');
    }
  };
  return (
    <div>
      <h2>Register</h2>
      <form onSubmit={submit}>
        <input placeholder="Name" value={name} onChange={e=>setName(e.target.value)} /><br/>
        <input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} /><br/>
        <input placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} /><br/>
        <select value={role} onChange={e=>setRole(e.target.value)}>
          <option value="student">Student</option>
          <option value="institution">Institution</option>
          <option value="admin">Admin</option>
        </select><br/>
        <button>Register</button>
      </form>
      <p>{msg}</p>
    </div>
  );
}
