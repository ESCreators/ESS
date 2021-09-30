import React from 'react';
import { FlatList } from 'react-native';
import styled from 'styled-components/native';
import { SafeAreaView, ScrollView } from 'react-native';

const menus = [
  {
    id: '001',
    title: '타워크레인',
    uri: 'https://firebasestorage.googleapis.com/v0/b/ess-react.appspot.com/o/menu%2F001.png?alt=media&ver=210907'
  },
  {
    id: '002',
    title: '지게차',
    uri: 'https://firebasestorage.googleapis.com/v0/b/ess-react.appspot.com/o/menu%2F002.png?alt=media&ver=210907'
  },
  {
    id: '003',
    title: '굴착기',
    uri: 'https://firebasestorage.googleapis.com/v0/b/ess-react.appspot.com/o/menu%2F003.png?alt=media&ver=210907'
  },
  {
    id: '004',
    title: '롤러',
    uri: 'https://firebasestorage.googleapis.com/v0/b/ess-react.appspot.com/o/menu%2F004.png?alt=media&ver=210907'
  },
  {
    id: '005',
    title: '불도저',
    uri: 'https://firebasestorage.googleapis.com/v0/b/ess-react.appspot.com/o/menu%2F005.png?alt=media&ver=210907'
  },
  {
    id: '006',
    title: '덤프트럭',
    uri: 'https://firebasestorage.googleapis.com/v0/b/ess-react.appspot.com/o/menu%2F006.png?alt=media&ver=210907'
  },{
    id: '007',
    title: '천공기',
    uri: 'https://firebasestorage.googleapis.com/v0/b/ess-react.appspot.com/o/menu%2F007.png?alt=media&ver=210907'
  },
  {
    id: '008',
    title: '항타기',
    uri: 'https://firebasestorage.googleapis.com/v0/b/ess-react.appspot.com/o/menu%2F008.png?alt=media&ver=210907'
  },
  {
    id: '009',
    title: '크롤러크레인',
    uri: 'https://firebasestorage.googleapis.com/v0/b/ess-react.appspot.com/o/menu%2F009.png?alt=media&ver=210907'
  },
  {
    id: '010',
    title: '하이드로크레인',
    uri: 'https://firebasestorage.googleapis.com/v0/b/ess-react.appspot.com/o/menu%2F010.png?alt=media&ver=210907'
  },
  {
    id: '011',
    title: '카고크레인',
    uri: 'https://firebasestorage.googleapis.com/v0/b/ess-react.appspot.com/o/menu%2F011.png?alt=media&ver=210907'
  },
  {
    id: '012',
    title: '펌프카',
    uri: 'https://firebasestorage.googleapis.com/v0/b/ess-react.appspot.com/o/menu%2F012.png?alt=media&ver=210907'
  },
  {
    id: '013',
    title: '고소작업대',
    uri: 'https://firebasestorage.googleapis.com/v0/b/ess-react.appspot.com/o/menu%2F013.png?alt=media&ver=210907'
  },
  {
    id: '014',
    title: '고소작업차',
    uri: 'https://firebasestorage.googleapis.com/v0/b/ess-react.appspot.com/o/menu%2F014.png?alt=media&ver=210907'
  },
  {
    id: '015',
    title: '건설용리프트',
    uri: 'https://firebasestorage.googleapis.com/v0/b/ess-react.appspot.com/o/menu%2F015.png?alt=media&ver=210907'
  },
];

const MenuContainer = styled.View`
  align-items: center;
`;
const MenuItemContainer = styled.TouchableOpacity`
  align-items: center;
  flex-direction: column;
  width: 33%;
  padding: 20px 20px;
`;
const MenuImage = styled.Image`
  width: 50px;
  height: 50px;
`;
const MenuText = styled.Text`
  font-size: 13px;
  margin-top: 5px;
`;
const NoticeImage = styled.Image`
  width: 100%;
  height: 200px;
`;
const Container = styled.View`
  flex: 1;
  flex-direction: row;
  justify-content: space-between;
  flex-wrap: wrap;
`;
const Item = ({ item: { id, title, uri }, onPress }) => {
  return (
    <MenuItemContainer onPress={() => onPress({ id, title })}>
      <MenuImage source={{ uri: uri }} />
      <MenuText>{title}</MenuText>
    </MenuItemContainer>
  );
};

const MenuList = ({ navigation }) => {
  return (
    <SafeAreaView>
      <ScrollView>
        <Container>
          <NoticeImage source={require('../../assets/menu/banner_210904.png')} />
          <MenuContainer>
            <FlatList
              data={menus}
              horizontal={false}
              numColumns={3}
              renderItem={({ item }) => (
                <Item
                  item={item}
                  onPress={params => navigation.navigate('CheckList', params)}
                />
              )}
              keyExtractor={item => item['id'].toString()}
              nestedScrollEnabled
            />
          </MenuContainer>
        </Container>
      </ScrollView>
    </SafeAreaView>
  );
};

export default MenuList;