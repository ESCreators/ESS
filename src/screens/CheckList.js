import React, { useEffect, useState, useRef } from 'react';
import styled from 'styled-components/native';
import { Alert, Pressable, SafeAreaView, ScrollView, TouchableHighlight } from 'react-native';
import { CheckBox } from 'react-native-elements'
import { AntDesign, MaterialIcons } from '@expo/vector-icons';
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
  padding: 10px;
`;
const InputSubContainer = styled.View`
  flex: 1;
  flex-direction: row;
  align-items: center;
  padding: 0 0 5px 0;
`;
const InputTitle = styled.Text`
  flex: 1;
  font-size: 18px;
  text-align: center;
`;
const InputSubTitle = styled.Text`
  flex: 2;
  font-size: 18px;
  text-align: center;
`;
const CheckInput = styled.TextInput`
  flex: 2;
  font-size: 16px;
  color: #3679fe;
  text-align: center;
  margin: 5px;
  text-align-vertical: top;
  border-bottom-color: #e3e3e3;
  border-bottom-width: 1px;
`;
const DateInput = styled.TextInput`
  flex: 1;
  border-bottom-color: #e3e3e3;
  border-bottom-width: 1px;
  font-size: 16px;
  color: #3679fe;
  text-align: center;
  text-align-vertical: top;
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
  flex-direction: row;
  background-color: #fff;
  border-bottom-color: #ccc;
  border-bottom-width: 1px;
  padding: 0 5px;
  align-items: center;
`;
const CheckTitle = styled.Text`
  width: 25%;
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
  text-align: center;
  text-align-vertical: center;
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
const ErrorText = styled.Text`
  color: #e84118;
  align-items: center;
  height: 20px;
  line-height: 20px;
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
  const [isSelected, setSelected] = useState([]);
  const [isAllSelected, setAllSelected] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [disabled, setDisabled] = useState(true);

  const refDidMount = useRef(null);
  
  const userInfo = getCurrentUser();

  useEffect(() => {
    setDisabled(
      !(isSelectedPicker && isCheckDate && isLicense && isModel && isStartDate && isEndDate && !errorMessage)
    );
  }, [isSelectedPicker, isCheckDate, isLicense, isModel, isStartDate, isEndDate, errorMessage]);

  useEffect(() => {
    if (refDidMount.current) {
      let error = '';
      if (!isSelectedPicker) {
        error = '현장을 선택하세요.';
      } else if (!isCheckDate) {
        error = '점검날짜를 선택하세요.';
      } else if (!isLicense) {
        error = '등록번호를 입력하세요.';
      } else if (!isModel) {
        error = '모델을 입력하세요.';
      } else if (!isStartDate) {
        error = '보험시작일을 입력하세요.'
      } else if (!isEndDate) {
        error = '보험종료일을 입력하세요.'
      } else {
        error = '';
      }
      setErrorMessage(error);
    } else {
      refDidMount.current = true;
    }    
  }, [isSelectedPicker, isCheckDate, isLicense, isModel, isStartDate, isEndDate]);

  useEffect(() => {
    const userInfoList = DB.collection('ESS_USER').doc(userInfo.email);
    userInfoList.get().then((doc) => {
      setUserInfo(doc.data());
    }).catch((error) => {
      console.log('유저정보 가져오기 애러:', error);
    });
  }, []);
  
  useEffect(() => {
    const dataItem = DB.collection('ESS_ITEM').doc(route.params.id);
    dataItem.get().then((doc) => {
      const items = doc.data().check;
      setItemName(doc.data().itemName);
      setList(items);
    }).catch((error) => {
      console.log('error: ', error);
    });

    navigation.setOptions({ title: route.params.title });
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

    let datetemp = dateFormat.replace(/-/g, '');

    let y = parseInt(datetemp.substr(0, 4)) + 1;
    let m = datetemp.substr(4, 2);
    let d = datetemp.substr(6, 2);

    let dateAdd = y + '-' + m + '-' + d;

    hideDatePicker();
    
    if (_checkType == 'check') {
      setCheckDate(dateFormat);
      navigation.setOptions({ title: isItemName });
    }
    else if (_checkType == 'start') {
      setStartDate(dateFormat);
      setEndDate(dateAdd);
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

  const DetailImageSrc = 'https://firebasestorage.googleapis.com/v0/b/ess-react.appspot.com/o/menu%2F' + route.params.id + '_detail.png?alt=media';
  
  const CheckItem = ({ item: { checkNum, checkTitle, checkDesc } }) => {

    return (
    <CheckItemContainer>
      <CheckTitle>{ checkTitle }</CheckTitle>
      <CheckDescription>{ checkDesc }</CheckDescription>
      <CheckButtonContainer>
        <CheckBox
          center
          checked={ isSelected.includes(checkNum) ? true : false }
          onPress={ () => {
            if (!isSelected.includes(checkNum)) {
              setSelected([...isSelected, checkNum]);
            }
            else {
              setSelected(isSelected.filter((el) => el !== checkNum));
            }
          }}
        />
      </CheckButtonContainer>
    </CheckItemContainer>
  );
}

  return (
    <SafeAreaView>
      <ScrollView>
        <Container>
          <InputContainer>
            <ModalSelector
              data={ isUserInfo.group }
              initValue='현장을 선택해주세요.'
              onChange={(option)=>{ setSelectedPicker(option.label) }}
              animationType={'slide'}
              style={{flex: 1, }}
              initValueTextStyle={{color: '#000'}}
              selectStyle={{borderWidth: 0, borderBottomWidth: 1, borderTopWidth: 1, }}
              selectTextStyle={{color: '#3679fe'}}
            />
            <MaterialIcons name='expand-more' size={24} color='#000' style={{ position: 'absolute', right: 10, top: 18, zIndex: -1, }} />
          </InputContainer>
          <InputContainer>
            <InputSubContainer>
              <InputTitle onPress={() => showDatePicker('check')} placeholderTextColor='#000000'>장비점검날짜</InputTitle>
              <TouchableHighlight onPress={() => showDatePicker('check')} style={{ position: 'absolute', right: 10, }}>
                <CalendarIcon />
              </TouchableHighlight>
            </InputSubContainer>
            <DateInput
              placeholder='날짜를 선택해주세요.'
              placeholderTextColor='#000'
              value={ isCheckDate }
              editable={ false }
            />
          </InputContainer>
          <InputContainer>
            <DetailImage source={{ uri: DetailImageSrc }} />
          </InputContainer>
          <InputSubContainer>
            <InputSubTitle>등록번호</InputSubTitle>
            <InputSubTitle>모델 및 규격</InputSubTitle>
          </InputSubContainer>
          <InputSubContainer>
            <CheckInput
              placeholder={'등록번호를 입력해주세요.'}
              value={ isLicense }
              onChangeText={ setLicense }
            />
            <CheckInput
              placeholder={'모델 및 규격을 입력해주세요.'}
              value={ isModel }
              onChangeText={ setModel }
            />
          </InputSubContainer>
          <InputSubContainer>
            <InputSubContainer>
              <InputSubTitle>보험시작일</InputSubTitle>
              <TouchableHighlight onPress={() => showDatePicker('start')} style={{ position: 'absolute', right: 10, }}>
                <CalendarIcon />
              </TouchableHighlight>
            </InputSubContainer>
            <InputSubContainer>
              <InputSubTitle>보험종료일</InputSubTitle>
              <TouchableHighlight onPress={() => showDatePicker('end')} style={{ position: 'absolute', right: 10, }}>
                <CalendarIcon />
              </TouchableHighlight>
            </InputSubContainer>
          </InputSubContainer>
          <InputSubContainer>
            <Pressable style={{ flex: 2 }} onPress={() => showDatePicker('start')}>
              <DateInput
                value={ isStartDate }
                editable={ false }
                placeholder='날짜를 선택해주세요.'
              />
            </Pressable>
            <Pressable style={{ flex: 2 }} onPress={() => showDatePicker('end')}>
              <DateInput
                value={ isEndDate }
                editable={ false }
                placeholder='날짜를 선택해주세요.'
              />
            </Pressable>
          </InputSubContainer>
          <CheckContainer>
            <CheckItemContainer style={{ backgroundColor: '#ccc' }}>
              <CheckTitle>점검항목</CheckTitle>
              <CheckDescription>점검방법</CheckDescription>
              <CheckButtonContainer>
                <CheckBox
                  center
                  checked={ isAllSelected }
                  onPress={() => {
                    if (isSelected.length === 0) {
                      const allList = [];
                      for(let i = 1; i <= isList.length; i++) {
                        allList.push(i);
                      }
                      setSelected(allList);
                      setAllSelected(true);
                    } else {
                      setSelected([]);
                      setAllSelected(false);
                    }
                  }}
                />
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
          <InputContainer>
            <ErrorText>{ errorMessage }</ErrorText>
          </InputContainer>
          <InputContainer style={{ marginBottom: 10, }}>
            <SubmitButton
              title='제출하기'
              onPress={ _handleSubmitBtnPress }
              disabled={disabled}
            />
          </InputContainer>
        </Container>
        <DateTimePickerModal
          isVisible={ isDatePickerVisible }
          mode='date'
          onConfirm={ handleConfirm }
          onCancel={ hideDatePicker }
          locale='ko_KR'
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default CheckList;
