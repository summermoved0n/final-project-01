import { FormikContext, useFormik } from 'formik';
import * as yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';

import sprite from '../../images/sprite.svg';

import css from './SettingModal.module.css';
import Modal from '../Modal/Modal';
import { selectAuthUserData } from '../../redux/auth/authSelectors';
import {
  updateUserInfoThunk,
  userAvatarThunk,
} from '../../redux/userInfo/userInfoOperations';
import { useState } from 'react';

// const testUser = {
//   token:
//     'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2MjVhMDE2NjBmMjcyY2M4ZDMwZWU3ZiIsImlhdCI6MTcxMzc0MTg0N30.UPeK_rPUxPAKcy7Je9-ACJ6uM49HQczRhS8_0Po1wVQ',
//   user: {
//     _id: '6625a01660f272cc8d30ee7f',
//     email: 'test-setting-modal@mail.com',
//     name: 'User',
//     gender: null,
//     waterRate: 2000,
//     avatarURL: '//www.gravatar.com/avatar/759547a9c2c5213af970762f8e9786ae',
//   },
// };

export default function SettingModal({ isOpen, setIsSettingOpen }) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isOldPasswordVisible, setIsOldPasswordVisible] = useState(false);
  const [isRepeatPasswordVisible, setIsRepeatPasswordVisible] = useState(false);
  const dispatch = useDispatch();
  const user = useSelector(selectAuthUserData);

  const { email, avatarURL, gender, name } = user;

  const avatarHandleChange = async (e) => {
    const file = e.target.files[0];

    await dispatch(userAvatarThunk(file));
    setIsSettingOpen(false);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const errors = await formik.validateForm();
    if (Object.keys(errors).length === 0) {
      formik.handleSubmit();
    }
  };

  const validationSchema = yup.object().shape({
    email: yup
      .string()
      .matches(
        /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
        'Invalid email address'
      )
      .required(),
    name: yup
      .string()
      .required()
      .min(3, 'Name must be at least 3 characters')
      .max(32, 'Name is too long'),
    gender: yup
      .string()
      .oneOf(['male', 'female'], 'Gender must be either male or female'),
    oldPassword: yup
      .string()
      .test(
        'isOldPasswordRequired',
        'Please fill in old password',
        function (value) {
          return !this.parent.password || value;
        }
      )
      .min(8, 'Password must be at least 8 characters')
      .max(64, 'Password is too long'),
    password: yup
      .string()
      .test(
        'isPasswordRequired',
        'Please fill in new password',
        function (value) {
          return !this.parent.oldPassword || value;
        }
      )
      .test(
        'isSamePassword',
        'This is your old password, create a new password',
        function (value) {
          return this.parent.oldPassword !== value || !value;
        }
      )
      .min(8, 'Password must be at least 8 characters')
      .max(64),
    repeatPassword: yup
      .string()
      .test('passwords-match', 'The passwords do not match', function (value) {
        return this.parent.password === value;
      }),
  });

  const formik = useFormik({
    initialValues: {
      email: email || '',
      name: name || '',
      gender: gender || '',
      oldPassword: '',
      password: '',
      repeatPassword: '',
    },
    onSubmit: async () => {
      const updateUserInfo = {};

      const { name, gender, email, password, oldPassword } = formik.values;

      if (name.trim() !== '') {
        updateUserInfo.name = name;
      }

      if (gender.trim() !== '') {
        updateUserInfo.gender = gender;
      }

      if (email.trim() !== '') {
        updateUserInfo.email = email;
      }

      if (oldPassword.trim() !== '') {
        updateUserInfo.oldPassword = oldPassword;
      }

      if (password.trim() !== '') {
        updateUserInfo.password = password;
      }

      setIsSettingOpen(false);
      await dispatch(updateUserInfoThunk(updateUserInfo));
    },
    validationSchema: validationSchema,
  });

  return (
    <>
      <Modal isOpen={isOpen} onClose={() => setIsSettingOpen(false)}>
        <FormikContext.Provider value={formik}>
          <form
            className={css.form}
            onSubmit={handleFormSubmit}
            noValidate
            autoComplete="off"
          >
            <h2 className={css.title}>Setting</h2>

            <h3 className={css.subtitle_photo}>Your photo</h3>

            <div className={css.avatar_conteiner}>
              <img
                className={css.avatar}
                src={avatarURL || ''}
                alt="user avatar"
                height={80}
                width={80}
              />
              <input
                className={css.input_avatar}
                id="avatarURL"
                name="avatarURL"
                type="file"
                accept="image/*,.png,.jpg"
                onChange={avatarHandleChange}
              />

              <label className={css.photo_lable} htmlFor="avatarURL">
                <svg className={css.uploadPhotoSvg} width="16" height="16">
                  <use
                    xlinkHref={`${sprite}#icon-upload-photo`}
                    width="16"
                    height="16"
                  ></use>
                </svg>
                Upload a photo
              </label>
            </div>
            <div className={css.settingContainer}>
              <div className={css.userContainer}>
                <h3 className={css.subtitle_gender}>Your gender identity</h3>

                <div className={css.gender_conteiner}>
                  <div className={css.gender_wraper}>
                    <input
                      type="radio"
                      id="female"
                      name="gender"
                      value="female"
                      checked={formik.values.gender === 'female'}
                      onChange={formik.handleChange}
                      className={css.genderRadio}
                    />
                    <label htmlFor="female">Woman</label>
                  </div>

                  <div className={css.gender_wraper}>
                    <input
                      type="radio"
                      id="male"
                      name="gender"
                      value="male"
                      checked={formik.values.gender === 'male'}
                      onChange={formik.handleChange}
                      className={css.genderRadio}
                    />
                    <label htmlFor="male">Man</label>
                  </div>
                </div>

                <label className={css.name_lable} htmlFor="name">
                  Your name
                </label>
                <input
                  style={{
                    color: formik.errors.name ? '#EF5050' : '#407BFF',
                    borderColor: formik.errors.name ? '#EF5050' : '#D7E3FF',
                  }}
                  className={`${css.input_field} ${
                    formik.errors.name && css.errorInput
                  }`}
                  id="name"
                  name="name"
                  type="text"
                  onChange={formik.handleChange}
                  value={formik.values.name}
                  placeholder="Name"
                />

                {formik.errors.name ? (
                  <div className={css.error}>{formik.errors.name}</div>
                ) : null}

                <label className={css.email_lable} htmlFor="email">
                  E-mail
                </label>
                <input
                  style={{
                    color: formik.errors.email ? '#EF5050' : '#407BFF',
                    borderColor: formik.errors.email ? '#EF5050' : '#D7E3FF',
                  }}
                  className={`${css.input_field} ${
                    formik.errors.email && css.errorInput
                  }`}
                  id="email"
                  name="email"
                  type="email"
                  onChange={formik.handleChange}
                  value={formik.values.email}
                  placeholder="E-mail"
                />

                {formik.errors.email ? (
                  <div className={css.error}>{formik.errors.email}</div>
                ) : null}
              </div>

              <div className={css.passwordContainer}>
                <h3 className={css.subtitle_password}>Password</h3>

                <label className={css.lable_password} htmlFor="oldPassword">
                  Outdated password:
                </label>
                <div className={css.inputContainer}>
                  <input
                    style={{
                      color: formik.errors.oldPassword ? '#EF5050' : '#407BFF',
                      borderColor: formik.errors.oldPassword
                        ? '#EF5050'
                        : '#D7E3FF',
                    }}
                    className={`${css.input_field} ${
                      formik.errors.oldPassword && css.errorInput
                    }`}
                    id="oldPassword"
                    name="oldPassword"
                    type={isOldPasswordVisible ? 'text' : 'password'}
                    onChange={formik.handleChange}
                    value={formik.values.oldPassword}
                    placeholder="Password"
                  />
                  <button
                    className={css.eyeButton}
                    type="button"
                    onClick={() =>
                      setIsOldPasswordVisible(!isOldPasswordVisible)
                    }
                  >
                    {isOldPasswordVisible ? (
                      <svg className={css.eyeSlash} width="16" height="16">
                        <use href={`${sprite}#icon-eye`}></use>
                      </svg>
                    ) : (
                      <svg className={css.eyeSlash} width="16" height="16">
                        <use href={`${sprite}#icon-eye-slash`}></use>
                      </svg>
                    )}
                  </button>
                </div>
                {formik.errors.oldPassword ? (
                  <div className={css.error}>{formik.errors.oldPassword}</div>
                ) : null}

                <label className={css.lable_password} htmlFor="password">
                  New Password:
                </label>
                <div className={css.inputContainer}>
                  <input
                    style={{
                      color: formik.errors.password ? '#EF5050' : '#407BFF',
                      borderColor: formik.errors.password
                        ? '#EF5050'
                        : '#D7E3FF',
                    }}
                    className={`${css.input_field} ${
                      formik.errors.password && css.errorInput
                    }`}
                    id="password"
                    name="password"
                    type={isPasswordVisible ? 'text' : 'password'}
                    onChange={formik.handleChange}
                    value={formik.values.password}
                    placeholder="Password"
                  />
                  <button
                    className={css.eyeButton}
                    type="button"
                    onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                  >
                    {isPasswordVisible ? (
                      <svg className={css.eyeSlash} width="16" height="16">
                        <use href={`${sprite}#icon-eye`}></use>
                      </svg>
                    ) : (
                      <svg className={css.eyeSlash} width="16" height="16">
                        <use href={`${sprite}#icon-eye-slash`}></use>
                      </svg>
                    )}
                  </button>
                </div>
                {formik.errors.password ? (
                  <div className={css.error}>{formik.errors.password}</div>
                ) : null}

                <label className={css.lable_password} htmlFor="repeatPassword">
                  Repeat new password:
                </label>
                <div className={css.inputContainer}>
                  <input
                    style={{
                      color: formik.errors.repeatPassword
                        ? '#EF5050'
                        : '#407BFF',
                      borderColor: formik.errors.repeatPassword
                        ? '#EF5050'
                        : '#D7E3FF',
                    }}
                    className={`${css.input_field} ${
                      formik.errors.repeatPassword && css.errorInput
                    }`}
                    id="repeatPassword"
                    name="repeatPassword"
                    type={isRepeatPasswordVisible ? 'text' : 'password'}
                    onChange={formik.handleChange}
                    value={formik.values.repeatPassword}
                    placeholder="Password"
                  />
                  <button
                    className={css.eyeButton}
                    type="button"
                    onClick={() =>
                      setIsRepeatPasswordVisible(!isRepeatPasswordVisible)
                    }
                  >
                    {isRepeatPasswordVisible ? (
                      <svg className={css.eyeSlash} width="16" height="16">
                        <use href={`${sprite}#icon-eye`}></use>
                      </svg>
                    ) : (
                      <svg className={css.eyeSlash} width="16" height="16">
                        <use href={`${sprite}#icon-eye-slash`}></use>
                      </svg>
                    )}
                  </button>
                </div>
                {formik.errors.repeatPassword ? (
                  <div className={css.error}>
                    {formik.errors.repeatPassword}
                  </div>
                ) : null}
              </div>
            </div>
            <button className={css.save_btn} type="submit">
              Save
            </button>
          </form>
        </FormikContext.Provider>
      </Modal>
    </>
  );
}
