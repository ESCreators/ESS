import React, { useContext, useState, useRef, useEffect } from 'react';
import styled from 'styled-components/native';
import { Button, Input, ErrorMessage } from '../components';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { signin } from '../firebase';
import { Alert } from 'react-native';
import { validateEmail, removeWhitespace } from '../utils';
import { UserContext, ProgressContext } from '../contexts';

const Container = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: #2a3c55;
  padding: 0 20px;
  padding-top: ${({ insets: { top } }) => top}px;
  padding-bottom: ${({ insets: { bottom } }) => bottom}px;
`;

const LogoImage = styled.Image`
  width: 100px;
  height: 100px;
`;

const LogoText = styled.Text`
  color: #ffffff;
  font-size: 24px;
`;

const LOGO =
  'https://firebasestorage.googleapis.com/v0/b/ess-react.appspot.com/o/icon.png?alt=media';

const Signin = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const { setUser } = useContext(UserContext);
  const { spinner } = useContext(ProgressContext);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [disabled, setDisabled] = useState(true);
  const refPassword = useRef(null);

  useEffect(() => {
    setDisabled(!(email && password && !errorMessage));
  }, [email, password, errorMessage]);

  const _handleEmailChange = email => {
    const changedEmail = removeWhitespace(email);
    setEmail(changedEmail);
    setErrorMessage(
      validateEmail(changedEmail) ? '' : '이메일 형식이 맞지 않습니다.'
    );
  };
  const _handlePasswordChange = password => {
    setPassword(removeWhitespace(password));
  };

  const _handleSigninBtnPress = async () => {
    try {
      spinner.start();
      const user = await signin({ email, password });
      setUser(user);
    } catch (e) {
      Alert.alert('로그인 실패', e.message);
    } finally {
      spinner.stop();
    }
  };

  return (
    <KeyboardAwareScrollView
      extraScrollHeight={20}
      contentContainerStyle={{ flex: 1 }}
    >
      <Container insets={insets}>
        <LogoImage source={{ uri: LOGO}} />
        <LogoText>EUNSAN</LogoText>
        <LogoText>Safety</LogoText>
        <Input
          label='아이디'
          placeholder='id@esmail.co.kr'
          returnKeyType='next'
          value={email}
          onChangeText={_handleEmailChange}
          onSubmitEditing={() => refPassword.current.focus()}
        />
        <Input
          ref={refPassword}
          label='비밀번호'
          placeholder='비밀번호'
          returnKeyType='done'
          value={password}
          onChangeText={_handlePasswordChange}
          isPassword={true}
          onSubmitEditing={_handleSigninBtnPress}
        />
        <ErrorMessage message={errorMessage} />
        <Button
          title='로그인'
          onPress={_handleSigninBtnPress}
          disabled={disabled}
        />
        {/* <Button
          title='signup'
          onPress={() => navigation.navigate('Signup')}
          containerStyle={{ marginTop: 0, backgroundColor: 'transparent' }}
          textStyle={{ color: theme.btnTextLink, fontSize: 18 }}
        /> */}
      </Container>
    </KeyboardAwareScrollView>
  );
};

export default Signin;
