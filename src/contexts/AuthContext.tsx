import {ReactNode, createContext, useState, useEffect} from 'react';
import {onAuthStateChanged} from 'firebase/auth';
import { auth } from '../services/firebaseConnection';

interface IAuthProviderProps {
  children: ReactNode;
}

type AuthContextDate = {
  signed: Boolean;
  loadingAuth: Boolean;
}

interface IUserProps {
  uid: string;
  name: string | null;
  email: string | null;
}

export const AuthContext = createContext({} as AuthContextDate)

function AuthProvider({children}: IAuthProviderProps){
  const [user, setUser] = useState<IUserProps | null>(null)
  const [loadingAuth, setLoadingAuth] = useState(true);

  // Login
  useEffect(() => {

    const unsub = onAuthStateChanged(auth, (user) => {
      if(user){
        // Tem user logado
        setUser({
          uid: user.uid,
          name: user?.displayName,
          email: user?.email
        })

        setLoadingAuth(false);
      }
      else{
        // Não tem user logado
        setUser(null);
        setLoadingAuth(false);
      }
    })

    // Aqui cancela o olheiro, a verificação que fica olhando se tem user logado.
    return () => {
      unsub();
    }
  }, [])

  return(
    <AuthContext.Provider
    value={{
      signed: !!user,
      loadingAuth,
    }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider;