import { useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Container } from '../../components/container';
import { Input } from '../../components/input';
import logoImg from '../../assets/logo.svg';

import {useForm} from 'react-hook-form';
import {z} from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import { auth } from '../../services/firebaseConnection'; 
import { createUserWithEmailAndPassword, signOut, updateProfile } from 'firebase/auth';
import { AuthContext } from '../../contexts/AuthContext';

import { toast } from 'react-hot-toast';

const schema = z.object({
  name: z.string().nonempty('O campo nome é obrigatório'),
  email: z.string().email('Insira um email válido').nonempty('O campo email é obrigatório'),
  password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres').nonempty('O campo senha é obrigatório')
});

type FormData = z.infer<typeof schema>;

export function Register(){
  const navigate = useNavigate();
  const {handleInfoUser} = useContext(AuthContext);
  const { register, handleSubmit, formState: {errors}} = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: 'onChange'
  })

  // Aqui desloga o usuário, pra acessar a página de cadastro precisa estar logado.
  useEffect(() => {
    async function handleLogout(){
      await signOut(auth)
    }

    handleLogout();
  }, []);

  async function onSubmit(data: FormData){
    createUserWithEmailAndPassword(auth, data.email, data.password)
    .then(async (user) => {
      await updateProfile(user.user, {
        displayName: data.name
      })

      // Aqui atualiza o usuário cadastrado, no context.
      handleInfoUser({
        uid: user.user.uid,
        name: data.name,
        email: data.email
      })

      toast.success("Bem-vindo ao WebCarros!")
      navigate("/dashboard", {replace: true});
    })
    .catch((e) => {
      console.log(e);
    })
  }

  return(
    <Container>
      <div className='w-full min-h-screen flex justify-center items-center flex-col gap-4'>
        <Link to={'/'} className='mb-6 max-w-sm w-full'>
          <img src={logoImg} alt="Logo do site" className="w-full" />
        </Link>

        <form className="bg-white max-w-xl w-full rounded-lg p-4" onSubmit={handleSubmit(onSubmit)}>
        <div className='mb-3'>
            <Input
              type='text'
              placeholder='Digite seu nome completo...'
              name='name'
              error={errors.name?.message}
              register={register}
            />
          </div>
          <div className='mb-3'>
            <Input
              type='email'
              placeholder='Digite seu email...'
              name='email'
              error={errors.email?.message}
              register={register}
            />
          </div>
          <div className='mb-3'>
            <Input
              type='password'
              placeholder='Digite sua senha...'
              name='password'
              error={errors.password?.message}
              register={register}
            />
          </div>

          <button 
            type='submit' 
            className='bg-zinc-900 w-full rounded-md text-white h-10 font-madium'
          >
            Cadastrar
          </button>
          
        </form>

        <Link to={'/login'}>
          Já possui uma conta? <span className='font-medium'>Faça login!</span>
        </Link>

      </div>
    </Container>
  )
}