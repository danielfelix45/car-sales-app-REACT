import {useContext} from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import logoImg from '../../assets/logo.svg';
import {FiUser, FiLogIn} from 'react-icons/fi';  
import { Link } from 'react-router-dom';

export function Header(){
  const {signed, loadingAuth} = useContext(AuthContext);

  return(
    <div className='w-full flex items-center justify-center bg-white h-16 mb-4 drop-shadow'>
      < header className='flex w-full max-w-7xl mx-auto items-center justify-between px-4'>
        <Link to={'/'}>
          <img src={logoImg} alt="Logo do site" />
        </Link>

        {!loadingAuth && signed && (
          <Link to={'/dashboard'}>
            <div className='border-2 border-black rounded-full p-1'>
              <FiUser size={22} color="#000"/>
            </div>
          </Link>
        )}
        {!loadingAuth && !signed && (
          <Link to={'/login'}>
            <div className="border-2 border-black rounded-full p-1">
              <FiLogIn size={22} color="#000"/>
            </div>
          </Link>
        )}
      </header>
    </div>
  )
}