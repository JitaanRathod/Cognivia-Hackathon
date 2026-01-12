import { useState } from 'react';
import api from '../services/api';
import HerCureLogo from '../components/branding/HerCureLogo';

export default function Signup() {
  const [form, setForm] = useState({ email:'', password:'', confirmPassword:'', acceptTerms:false });

  const submit = async (e) => {
    e.preventDefault();
    await api.post('/auth/signup', form);
    window.location.href = '/login';
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-purple-50">
      <form onSubmit={submit} className="bg-white p-8 rounded-xl shadow w-96">
        <HerCureLogo />
        <input className="w-full mt-4 p-2 border rounded" placeholder="Email"
          onChange={e=>setForm({...form,email:e.target.value})}/>
        <input type="password" className="w-full mt-3 p-2 border rounded" placeholder="Password"
          onChange={e=>setForm({...form,password:e.target.value})}/>
        <input type="password" className="w-full mt-3 p-2 border rounded" placeholder="Confirm Password"
          onChange={e=>setForm({...form,confirmPassword:e.target.value})}/>
        <label className="flex items-center mt-3 text-sm">
          <input type="checkbox" onChange={e=>setForm({...form,acceptTerms:e.target.checked})}/>
          <span className="ml-2">Accept Terms</span>
        </label>
        <button className="w-full mt-4 bg-purple-600 text-white py-2 rounded">
          Create Account
        </button>
        <p className="text-xs text-gray-400 text-center mt-4">
  By continuing, you agree to HerCure’s privacy-first care policy
</p>

      </form>
    </div>
  );
}
