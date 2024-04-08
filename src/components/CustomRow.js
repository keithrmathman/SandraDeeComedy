import React,  { useState } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import * as Font from "expo-font";
import Apploading from "expo-app-loading";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        padding: 10,
        marginLeft:36,
        marginRight:16,
        marginTop: 8,
        marginBottom: 8,
        borderRadius: 5,
        opacity: 1,
        elevation: 2,
    },
    title: {
        fontSize: '1em',
        opacity: 1,
        color: 'white',
        paddingRight: '1%',
        fontWeight: 'bolder',
        fontFamily: 'Bondie',

    },
    TransitionWord: {
      fontSize: '1em',
      opacity: 1,
      color: 'white',
      paddingRight: '1%',
      fontWeight: 'bolder',
      fontFamily: 'Bondie',
      textDecorationLine: 'underline',

  },
    headline: {
        fontSize: '1em',
        opacity: 1,
        color: 'white',
        paddingRight: '1%',
        fontWeight: 'bolder',
        fontFamily: 'Bondie',
        textDecorationLine: 'underline',


    },
    location: {
        fontSize: '0.8em',
        fontFamily: 'Bondie',
        color: 'gray',
        fontWeight: 'bold', 
        color: 'white'
        

    },
    container1_text: {
        flex: 1,
        flexDirection: 'row',
        marginLeft: '-13%',
        justifyContent: 'center',
        color: 'white',

    },
    container2_text: {
        flex: 1,
        flexDirection: 'column',
        marginLeft: 12,
        justifyContent: 'center',
        color: 'white',

    },
    description: {
        fontSize: '0.8em',
        fontFamily: 'Bondie',
        color: 'white',
        

    },
    photo: {
        height: 50,
        width: 50,
    },
    overlay: {
        flex: 0,
        position: 'absolute',
        left: 0,
        top: 0,
        opacity: 0.5,
        backgroundColor: 'black',
        width: '100%',
        height: '100%'
      } 
});

const getFonts = () =>
console.log("in here.")
  Font.loadAsync({
    juriFrontageCondensedOutline: require('../assets/fonts/JuriZaechFrontageCondensedOutline.ttf'),
    juriFrontageBold: require('../assets/fonts/Frontage-Bold.ttf'),
    Amithen: require('../assets/fonts/Amithen.ttf'),
    Bondie: require('../assets/fonts/Bondie Demo.otf'),


  });
  console.log("done.")

  export default function CustomRow ( {title, description, image_url,day, month, year} ){
    const [fontsloaded, setFontsLoaded] = useState(false);

    if (fontsloaded) {
        return (
         //you can return any component of your choice here
         <View style={styles.container}>
         <View style={styles.overlay} />

{/* <Image source={{ uri: image_url }} style={styles.photo} /> */}
<View style={styles.container1_text}>
 <Text style={[styles.title, {marginRight: '0%'}]}>
    {day} 
 </Text>&nbsp;&nbsp;<Text style={[styles.title, {marginRight: '0%', textDecorationLine: 'underline'}]}>{month} </Text>
 <Text style={styles.description}>
 </Text>

</View>

<View style={styles.container2_text}>
 <Text style={styles.headline}>
     {title}
 </Text>
 <Text style={styles.location}>
     {description}
 </Text>

</View>

</View>
        );
      } else {
        return (
          <Apploading
            startAsync={getFonts}
            onFinish={() => {
              setFontsLoaded(true);
            }}
            onError={console.warn}
          />
        );
      }

   
    }

//export default CustomRow;
