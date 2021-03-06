import api from '../api';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { useNotify } from '../hooks/useNotify';
import Head from 'next/head'
import Image from  'next/image';

import styles from '../styles/loginRegister.module.scss'
import logoImg from '../assets/logo.svg';
import { ToastContainer } from 'react-toastify';

import { Input } from '../components/Input';
import { Button } from '../components/Button';


export default function Register() {
  const { errorNotify, successNotify } = useNotify();

  const validationSchema = Yup.object().shape({
    name: Yup.string().required('Campo obrigatório'),
    email: Yup.string().email('Email inválido').required('Campo obrigatório'),
    password: Yup.string().required('Campo obrigatório').min(8, 'Requer no mínimo 8 caractéres'),
    confirmPassword: Yup.string().required('Campo obrigatório').equals([Yup.ref('password'), null], 'As senhas diferem')
  });

  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: ''
    },
    validationSchema,
    onSubmit: async data => {
      try {
        const result = await api.post('/register', data);

        successNotify('Usuário registreado com sucesso', '/');
      } catch(err: any) {
        errorNotify(err.response.data.message);
      }
    }
  });

  return (
    <>
      <Head>
        <title>Github Profile | Register</title>
      </Head>

      <main className={styles.container}>
        <form className={styles.form}>
          <Image src={logoImg} alt="Logo"/>

          <Input 
            label="Nome" 
            name="name" 
            type="text" 
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.name}
            error={formik.errors.name}
          />

          <Input 
            label="E-mail" 
            name="email" 
            type="text" 
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.email}
            error={formik.errors.email}
          />

          <Input 
            label="Senha" 
            name="password" 
            type="password" 
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.password}
            error={formik.errors.password}
          />

          <Input 
            label="Confirme senha" 
            name="confirmPassword" 
            type="password"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.confirmPassword}
            error={formik.errors.confirmPassword}
          />

          <Button 
            text="Registrar" 
            type="submit"
            onClick={async (e) => {
              e.preventDefault()
              await formik.submitForm()
            }}
          />
          <ToastContainer />
        </form>
      </main>
    </>
  )
}
