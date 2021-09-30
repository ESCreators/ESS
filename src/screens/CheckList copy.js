import React, { useEffect, useState } from 'react';
import styled from 'styled-components/native';
import { Alert, CheckBox } from 'react-native';
import { SafeAreaView, ScrollView, TouchableHighlight } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { FlatList } from 'react-native';
import ModalSelector from 'react-native-modal-selector'
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { DB, createCheckList, getCurrentUser } from '../firebase';

const Container = styled.View`
  flex: 1;
`;
const ContainerSub = styled.View`
  flex: 1;
  flex-direction: row;
`;

const InputContainer = styled.View`
  flex: 1;
  flex-direction: column;
  padding: 10px;
`;
const InputSubContainer = styled.View`
  flex: 1;
  width: 100%;
  flex-direction: row;
  align-items: center;
  padding: 5px;
`;
const InputTitle = styled.Text`
  font-size: 18px;
`;
const CheckInput = styled.TextInput`
  width: 100%;
  font-size: 14px;
  color: #3679fe;
`;
const DateInput = styled.TextInput`
  width: 90px;
  color: #3679fe;
  text-align: center;
  text-align-vertical: center;
  line-height: 10px;
  height: 20px;
`;
const CalendarIcon = () => {
  return (
    <AntDesign
      name={'calendar'}
      size={20}
    />
  );
};

const DetailImage = styled.Image`
  width: 100%;
  height: 120px;
`;
const CheckContainer = styled.View`
  flex: 1;
`;
const CheckItemContainer = styled.View`
  flex: 1;
  flex-direction: row;
  background-color: #fff;
  border-bottom-color: #ccc;
  border-bottom-width: 1px;
  padding: 0 5px;
`;
const CheckTitle = styled.Text`
  width: 25%;
  flex: 1;
  flex-wrap: wrap;
  text-align: center;
  text-align-vertical: center;
  color: #333;
  font-weight: bold;
  padding: 5px;
`;
const CheckDescription = styled.Text`
  width: 65%;
  flex-wrap: wrap;
  color: #000;
  padding: 5px;
`;
const CheckButtonContainer = styled.View`
  width: 10%;
  flex-wrap: wrap;
  padding: 5px;
`;
const CommentContainer = styled.View`
  flex: 1;
  flex-direction: row;
  padding: 15px 5px;
`;
const CommentTitle = styled.Text`
  width: 25%;
  font-size: 16px;
  text-align: center;
  text-align-vertical: center;
  background-color: #ccc;
`;
const CommentInput = styled.TextInput`
  width: 75%;
  padding: 5px;
  font-size: 20px;
  color: #3679fe;
  background-color: #fff;
  border-color: #ccc;
  border-width: 1px;
`;
const SubmitButton = styled.Button`
  flex: 1;
  justify-content: center;
  align-items: center;
  border-radius: 4px;
  background-color: #3679fe;
  font-size: 22px;
`;

Date.prototype.format = function(f) {
  if (!this.valueOf()) return " ";

  var weekName = ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"];
  var d = this;

  return f.replace(/(yyyy|yy|MM|dd|E|hh|mm|ss|a\/p)/gi, function($1) {
    switch ($1) {
      case "yyyy": return d.getFullYear();
      case "yy": return (d.getFullYear() % 1000).zf(2);
      case "MM": return (d.getMonth() + 1).zf(2);
      case "dd": return d.getDate().zf(2);
      case "E": return weekName[d.getDay()];
      case "HH": return d.getHours().zf(2);
      case "hh": return ((h = d.getHours() % 12) ? h : 12).zf(2);
      case "mm": return d.getMinutes().zf(2);
      case "ss": return d.getSeconds().zf(2);
      case "a/p": return d.getHours() < 12 ? "오전" : "오후";
      default: return $1;
    }
  });
};

String.prototype.string = function(len){var s = '', i = 0; while (i++ < len) { s += this; } return s;};
String.prototype.zf = function(len){return "0".string(len - this.length) + this;};
Number.prototype.zf = function(len){return this.toString().zf(len);};

let _checkType = '';

const CheckList = ({ navigation, route }) => {
  const [isList, setList] = useState([]);
  const [isItemName, setItemName] = useState('');
  const [isUserInfo, setUserInfo] = useState([]);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isLicense, setLicense] = useState('');
  const [isModel, setModel] = useState('');
  const [isDesc, setDesc] = useState('');
  const [isCheckDate, setCheckDate] = useState('');
  const [isStartDate, setStartDate] = useState('');
  const [isEndDate, setEndDate] = useState('');
  const [isSelectedPicker, setSelectedPicker] = useState('');
  const _placeholder = '날짜 선택';
  
  const userInfo = getCurrentUser();

  useEffect(() => {
    const userInfoList = DB.collection('ESS_USER').doc(userInfo.email);
    userInfoList.get().then((doc) => {
      setUserInfo(doc.data());
      console.log('1');
    }).catch((error) => {
      console.log('유저정보 가져오기 애러:', error);
    });
    console.log('2');
    
    const dataItem = DB.collection('ESS_ITEM').doc(route.params.id);
    dataItem.get().then((doc) => {
      const items = doc.data().check;
      setItemName(doc.data().itemName);
      setList(items);
    }).catch((error) => {
      console.log('error: ', error);
    });
  }, []);
  
  const showDatePicker = (checkType) => {
    setDatePickerVisibility(true);
    _checkType = checkType;
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date) => {
    const dateFormat = date.format('yyyy-MM-dd');
    hideDatePicker();
    
    if (_checkType == 'check') {
      setCheckDate(dateFormat);
    }
    else if (_checkType == 'start') {
      setStartDate(dateFormat);
    }
    else if (_checkType == 'end') {
      setEndDate(dateFormat);
    }
  };

  const _handleSubmitBtnPress = async () => {
    try {
      const id = await createCheckList({
        isLicense, isModel, isDesc, isCheckDate, isStartDate, isEndDate, isName: isUserInfo.name, isRank: isUserInfo.rank, isItemName: isItemName, isGroupName: isSelectedPicker
      });
      Alert.alert('제출이 완료 되었습니다.');
      navigation.navigate('Home', { id });
    } catch (e) {
      Alert.alert('리스트 전송 애러', e.message);
    } finally {

    }
  };

  console.log('0');
  navigation.setOptions({ title: isItemName });

  const DetailImageSrc = 'https://firebasestorage.googleapis.com/v0/b/ess-react.appspot.com/o/menu%2F' + route.params.id + '_detail.png?alt=media';
  
  const CheckItem = ({ item: { checkTitle, checkDesc } }) => {
  const [isSelected, setSelected] = useState(false);

  return (
    <CheckItemContainer>
      <CheckTitle>{ checkTitle }</CheckTitle>
      <CheckDescription>{ checkDesc }</CheckDescription>
      <CheckButtonContainer>
        <CheckBox value={ isSelected } onValueChange={ setSelected } />
      </CheckButtonContainer>
    </CheckItemContainer>
  );
}

  return (
    <SafeAreaView>
      <ScrollView>
        <Container>
          <InputContainer>
            <InputSubContainer>
              <ContainerSub>
                <InputTitle>장비명: </InputTitle>
                <InputTitle>{ isItemName }</InputTitle>
              </ContainerSub>
            </InputSubContainer>
            <InputSubContainer>
              <ContainerSub>
                <InputTitle>현장명: </InputTitle>
                <ModalSelector
                  data={ isUserInfo.group }
                  initValue='현장선택'
                  onChange={(option)=>{ setSelectedPicker(option.label) }}
                  animationType={'slide'}
                  // selectStyle={{height: 18}}
                  // style={{fontSize: 18}}
                  // initValueTextStyle={{fontSize: 18, lineHeight: 18,}}
                  selectTextStyle={{fontSize: 18, lineHeight: 18, color: '#3679fe'}}
                />
              </ContainerSub>
            </InputSubContainer>
            <InputSubContainer>
              <ContainerSub>
                <InputTitle>점검일: </InputTitle>
                <DateInput
                  style={{ marginRight: 5, lineHeight: 20, height: 20 }}
                  value={ isCheckDate }
                  editable={ false }
                  placeholder={ _placeholder }
                />
                <TouchableHighlight onPress={() => showDatePicker('check')}>
                  <CalendarIcon />
                </TouchableHighlight>
              </ContainerSub>
              <ContainerSub style={{ marginLeft: 10, alignSelf:'flex-end', position: 'absolute', top: 5, right: 0, }}>
                <InputTitle>점검자: </InputTitle>
                <InputTitle>{ isUserInfo.name } { isUserInfo.rank }</InputTitle>
              </ContainerSub>
            </InputSubContainer>
            <InputSubContainer>
              <InputTitle>등록번호: </InputTitle>
              <CheckInput
                placeholder={'등록번호를 입력해주세요.'}
                value={ isLicense }
                onChangeText={ setLicense }
              />
            </InputSubContainer>
            <InputSubContainer>
              <InputTitle>모델 및 규격: </InputTitle>
              <CheckInput
                placeholder={'모델을 입력해주세요.'}
                value={ isModel }
                onChangeText={ setModel }
              />
            </InputSubContainer>
            <InputSubContainer>
              <ContainerSub>
                <InputTitle>보험시작일: </InputTitle>
                <DateInput
                  style={{ marginRight: 5, }}
                  value={ isStartDate }
                  editable={ false }
                  placeholder={ _placeholder }
                />
                <TouchableHighlight onPress={() => showDatePicker('start')}>
                  <CalendarIcon />
                </TouchableHighlight>
              </ContainerSub>
              <ContainerSub style={{ marginLeft: 10, alignSelf:'flex-end', position: 'absolute', top: 5, right: 0, }}>
                <InputTitle>보험종료일: </InputTitle>
                <DateInput
                  style={{ marginRight: 5, }}
                  value={ isEndDate }
                  editable={ false }
                  placeholder={ _placeholder }
                />
                <TouchableHighlight onPress={() => showDatePicker('end')}>
                  <CalendarIcon />
                </TouchableHighlight>
              </ContainerSub>
            </InputSubContainer>
          </InputContainer>
          <InputContainer>
            <DetailImage source={{ uri: DetailImageSrc }} />
          </InputContainer>
          <CheckContainer>
            <CheckItemContainer style={{ backgroundColor: '#ccc' }}>
              <CheckTitle>점검항목</CheckTitle>
              <CheckDescription style={{ textAlign: 'center', }}>점검방법</CheckDescription>
              <CheckButtonContainer>
                <InputTitle>체크</InputTitle>
              </CheckButtonContainer>
            </CheckItemContainer>
          </CheckContainer>
          <FlatList
            data={ isList }
            renderItem={({ item }) => <CheckItem item={ item } />}
            keyExtractor={ item => item['checkTitle'].toString() }
            nestedScrollEnabled
          />
          <CommentContainer>
            <CommentTitle>점검자 의견</CommentTitle>
            <CommentInput
              value={ isDesc }
              onChangeText={ setDesc }
            />
          </CommentContainer>
          <InputContainer style={{ marginBottom: 10, }}>
            <SubmitButton
              title='제출하기'
              onPress={ _handleSubmitBtnPress }
            />
          </InputContainer>
        </Container>
        <Container>
          <DateTimePickerModal
            isVisible={ isDatePickerVisible }
            mode='date'
            onConfirm={ handleConfirm }
            onCancel={ hideDatePicker }
            locale='ko_KR'
          />
        </Container>
      </ScrollView>
    </SafeAreaView>
  );
};

export default CheckList;
