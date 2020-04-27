import {useEffect} from 'react';
import Login from '@/components/login';
import LoginForm from './basic/login-form';

const WLogin = () => {
  useEffect(() => {
    const loader = document.getElementById('loader');
    if (loader) loader.remove();
  }, []);
  return (
    <Login>
      <LoginForm />
    </Login>
  );
};

export default WLogin;
