//import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import * as yup from 'yup';
import { Formik, Field } from 'formik';
import { signInThunk } from '../../redux/auth/authOperations';
import css from './SigninForm.module.css';

import {
  StyledError,
  StyledFieldName,
  StyledForm,
  StyledSubmitBtn,
  StyledToggleBtn,
  StyledWrapper,
} from './SignInForm.styled';
//import { HiOutlineEyeSlash, HiOutlineEye } from 'react-icons/hi2';
import { useState } from 'react';
import { Icon } from '../Icon/Icon';

const SignInSchema = yup.object().shape({
  email: yup
    .string()
    .email('Please enter a valid email')
    .required('E-mail is required'),
  password: yup
    .string()
    .min(8, 'Password must be 8 or more characters')
    .max(64)
    .required('Password is required'),
});

const SignInForm = () => {
  const [isPasswordVisible, setPasswordVisibility] = useState(false);

  const dispatch = useDispatch();

  const formInitialValues = {
    email: '',
    password: '',
  };

  const handleSubmit = ({ email, password }, { resetForm }) => {
    event.preventDefault();
    const newUser = { email, password };
    dispatch(signInThunk(newUser));
    resetForm();
  };
  return (
    <Formik
      initialValues={formInitialValues}
      validationSchema={SignInSchema}
      onSubmit={handleSubmit}
    >
      <StyledWrapper>
        <StyledForm>
          <h1>Sign In</h1>
          <div className={css.signInFields}>
            <label>
              <StyledFieldName>Enter your email</StyledFieldName>
              <Field name="email" type="email" placeholder="E-mail" />
              <StyledError name="email" component="span" />
            </label>
            <label>
              <StyledFieldName>Enter your password</StyledFieldName>
              <div>
                <Field
                  name="password"
                  type={isPasswordVisible ? 'text' : 'password'}
                  placeholder="Password"
                />
                <StyledToggleBtn
                  type="button"
                  onClick={() => setPasswordVisibility(!isPasswordVisible)}
                >
                  {isPasswordVisible ? (
                    <Icon
                      iconName={'icon-eye'}
                      width={'16px'}
                      height={'16px'}
                    />
                  ) : (
                    <Icon
                      iconName={'icon-eye-slash'}
                      width={'16px'}
                      height={'16px'}
                    />
                  )}
                </StyledToggleBtn>
              </div>
              <StyledError name="password" component="span" />
            </label>
            <StyledSubmitBtn type="submit">Sign In</StyledSubmitBtn>
          </div>
          <Link to="/signup">Sign Up</Link>
        </StyledForm>
      </StyledWrapper>
    </Formik>
  );
};

export default SignInForm;
