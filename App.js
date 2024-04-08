//ENTRY:
<style>
@import url('https://fonts.googleapis.com/css2?family=Merriweather:wght@300&display=swap');
@import url(//db.onlinewebfonts.com/c/22666f3327d67d77b16655c5a673bad2?family=FrontageCondensed-Bold);
</style>
import './src/Styles/CustomTextStyles.css'
import Timeline from 'react-native-timeline-flatlist';
import CustomListview from './src/components/CustomListView';
import React, {Component, useState} from 'react';
import SliderEntry from './src/components/SliderEntry';
import * as Font from "expo-font";
import Apploading from "expo-app-loading";
import {Dimensions, ImageBackground, StyleSheet, Text, Image, View, Pressable, FlatList, ScrollView,TouchableOpacity, Row, Modal, TextInput, WebView} from 'react-native';
import {LinearGradient} from 'expo-linear-gradient';
import { Thumbnail } from 'react-native-thumbnail-video';
import {Link, Element} from 'react-scroll'

//TODO: Overlay view does not render for eventscontainer2
//TODO: When Clicking BIO, if the mobile BIO section is visible, it scrolls to normal view BIO eventhough its not there. FIX: add another BIO button to nav to that BIO 
/*GLOBALS*/
const SCREEN_HEIGHT = Dimensions.get('window').height;
const SCREEN_WIDTH = Dimensions.get('window').width;
const ITEM_WIDTH = Math.round(SCREEN_WIDTH * 0.9);
const SLIDER_1_FIRST_ITEM = 0
const picsumImages = new Array(11).fill("http://placeimg.com/640/360/any");
const videoList = [
  'https://www.youtube.com/watch?v=yRtzWn_5zko',
  'https://www.youtube.com/watch?v=WeCUgAxfJOM',
  'https://www.youtube.com/watch?v=lYj92o7vv5k',
  //'https://www.youtube.com/shorts/9sozCuT7LcE',
  'https://www.youtube.com/watch?v=IESeVWDnsM4',
  'https://www.youtube.com/watch?v=bxfZxcqExro&feature=youtu.be',
  'https://www.youtube.com/watch?v=Im_k_hSK_Xs&feature=youtu.be'


]
const numColumns = 3;
const numVideoColumns = 2;
const timelineIcon = require('./src/assets/microphone icon.png')
const ImageGallery = [
 "https://source.unsplash.com/1024x768/?girl",
 "https://source.unsplash.com/1024x768/?girl",
 "https://source.unsplash.com/1024x768/?girl",
 "https://source.unsplash.com/1024x768/?girl",
 "https://source.unsplash.com/1024x768/?girl",
 "https://source.unsplash.com/1024x768/?girl"
]
const DATA = [
  {index:1, icon: timelineIcon, illustration: 'https://source.unsplash.com/1024x768/?nature' , title: "Sandra dee at one with nature", subtitle: "Sandra Dee taking a pick in Osaka, Japan"},
  {index:2, icon: timelineIcon, illustration: 'https://source.unsplash.com/1024x768/?girl' , title: "Sandra dee herself",  subtitle: "Sandra dee at her finest of life"},
  {index:3, icon: timelineIcon, illustration: 'https://source.unsplash.com/1024x768/?tree' , title: "A Tree of Sandra Dee",  subtitle: "Sandra dee's Tree she planted at age 8"},
  {index:4, icon: timelineIcon, illustration: 'https://source.unsplash.com/1024x768/?water' , title: "Sandra dee at one with water.",  subtitle: "Sandra dee loves the water"},
  {index:5, icon: timelineIcon, illustration: 'https://source.unsplash.com/1024x768/?nature' , title: "Sandra dee at one with nature",  subtitle: "Sandra Dee taking a pick in Dallas, Texas"}
];
const SandraDeeBottomImg = require("./src/assets/sandra dee events.jpg")
//ALL CUSTOM FONTS ARE REFRENCED HERE.//
const getFonts = () =>
console.log("in here.")
  Font.loadAsync({
    juriFrontageCondensedOutline: require('./src/assets/fonts/JuriZaechFrontageCondensedOutline.ttf'),
    juriFrontageBold: require('./src/assets/fonts/Frontage-Bold.ttf'),
    Amithen: require('./src/assets/fonts/Amithen.ttf'),
    Bondie: require('./src/assets/fonts/Bondie Demo.otf'),
    Cloud: require('./src/assets/fonts/CloudCond-Bold.ttf'),
    CloudLight: require('./src/assets/fonts/CloudCond-Light.ttf')

  });
  console.log("done.")

const EVENTS_VIEW_SIZE_CONSTRAINT_THRESHOLD = 600
const BIO_VIEW_SIZE_CONSTRAINT_THRESHOLD = 550
const VIDEOS_VIEW_SIZE_CONSTRAINT_THRESHOLD = 425
const BIO_TEXT_THRESHOLD  =1200

class App extends Component {

  constructor(props) {

    super(props);
    
    this.data = [
      {time: '09/21/19',icon: timelineIcon,  title: 'First Comedy Show', description: 'Sandra Dee participated at her first comedy premiere.'},
      {time: '10/31/19', icon: timelineIcon,title: 'Won First Local Contest', description: 'Won "Best Comic In Houston" at the Secret Group Local Contest'},
      {time: '10/1/20',icon: timelineIcon, title: 'Semi-Finalist for "Best Comic In Texas"', description: 'Semi-Finalist For "Best Comic in Texas" hosted at the Improve Theatre.'},
      {time: '12/31/20', icon: timelineIcon,title: 'Texas\'s "New Year Comedy Battle" Winner', description: 'Texas\'s "New Year Comedy Battle" Winner. She won out of 64 contestants.'},
      {time: '1/31/21',icon: timelineIcon, title: '"Battle of the Best" Award Recipent', description: 'Won the "Battle of the Best" Contest at Joke Joint out of 200 contestants.'}
    ]
    this._renderItem = this._renderItem.bind(this)
    this.enlargeImg = this.enlargeImg.bind(this)
    this.renderImage = this.renderImage.bind(this)
    this.createPhotoGallery = this.createPhotoGallery.bind(this)

  }
  
   importAll(r) {
    let images = {};
     r.keys().forEach((item, index) => { images[item.replace('./', '')] = r(item); });
    return images
   }

   
  componentDidMount() {
    this.createPhotoGallery()
    this.renderEventsView()
    this.renderBioView()
    this.renderVideosView()
    this.screenLT1200()
    document.body.style.backgroundColor = "black"
    if(Dimensions.get('window').width > EVENTS_VIEW_SIZE_CONSTRAINT_THRESHOLD){
      console.log("We're in Big View!")
      document.body.style.zoom = 1.5
    }

  }
  state = {
    imageList: this.importAll(require.context('./src/assets/ImageSlideshow', false, /\.(png|jpe?g|svg)$/)),
    photoGallery: [],
    enlargedImage: {},
    loading: false,
    bioLT550: false,
    screenSizeLT1200px: false,
    videosLT425: false,
    eventsViewMobile: false,
    fontsLoaded: false,
    lightboxIsOpen: false,
    headerDimensions:{
      width: 100, //default values so that main screen and header do not overlap.
    height: 100
    },
    
    slider1ActiveSlide: SLIDER_1_FIRST_ITEM,
    // selectedIndex: 0,
    selectedImage: {},
    eventList: [{
      image_url: "https://source.unsplash.com/1024x768/?girl",
      title: 'ADULT COMEDY SHOWS',
      description: "Comedy shows that caters to the adult crowd.",
      day: 'SANDRA DEE',
      month: 'DOES...',
      year: ''
    },
    {
      image_url: "https://source.unsplash.com/1024x768/?girl",
      title: "KID-FRIENDLY COMEDY",
      description: "Comedy for people of all ages to enjoy.",
      day: '',
      month: '',
      year: ''
    },
    {
      image_url: "https://source.unsplash.com/1024x768/?girl",
      title: 'STANDUP COMEDY',
      description: "Book her for a comedy show at a comedy club or bar.",
      day: '',
      month: '',
      year: ''
    },
    {
      image_url: "https://source.unsplash.com/1024x768/?girl",
      title: "SKITS/MOVIES/ENTERTAINMENT",
      description: "She acts as well. Bring her on for a role in your entertainment endeavor.",
      day: '',
      month: '',
      year: ''
    },
    {
      image_url: "https://source.unsplash.com/1024x768/?girl",
      title: 'PRIVATE PARTIES',
      description: "Want to book her for a private party? Contact her now!",
      day: '',
      month: '',
      year: ''
    }],
    images: [
      {author: "Sandra Dee", uri: "https://source.unsplash.com/1024x768/?nature", 'metadata': {"description": "Sandra dee at one with nature."} },
      {author: "Sandra Dee", uri: "https://source.unsplash.com/1024x768/?water",  'metadata': {"description": "Sandra dee at one with water."} },
      {author: "Sandra Dee", uri: "https://source.unsplash.com/1024x768/?girl",  'metadata': {"description": "Sandra dee at one with girl."} },
      {author: "Sandra Dee", uri: "https://source.unsplash.com/1024x768/?tree",  'metadata': {"description": "Sandra dee at one with tree."} }
  ]

  };
  createPhotoGallery=() =>{
    let imageList = this.state.imageList
    let imageListTemp = []
    let imageObj = {}
    Object.keys(this.state.imageList).map(function(key) {
      imageObj["title"] = key.replace(/[_][0-9]+/g, "").replace(/.[^.]+$/g, "")
      imageObj["url"] = imageList[key]
      imageListTemp.push(imageObj)
      imageObj = {}
  });
  this.setState ({
    photoGallery: imageListTemp
  })
  console.log(this.state.photoGallery)
  

   return imageListTemp
   }
  enlargeImg=(image)=>{
    console.log("here", image)
    this.setState(state => ({
     lightboxIsOpen: !state.lightboxIsOpen,
     selectedImage: {author: "Sandra Dee", index: image},
     enlargedImage: {uri: image.url, title: image.title}
   }));
  return 
   }

 styles = StyleSheet.create({
  carouselContainer: {
    marginTop: 50
  },
  highlightsContainer:{
    flex: 0.12,
    backgroundColor: 'black',
    alignItems: 'center',
   marginTop: '26%',
  //  marginBottom:'15%',
   alignContent: 'center',
   textAlign:'center'
  },
  eventsContainer:{
  
    flex: 0.13,
    backgroundColor: 'black',
    alignItems: 'center',
   marginTop: '0%',
  //  marginBottom:'15%',
   alignContent: 'center',
   textAlign:'center',
  },

  eventsContainer2:{
    flex: 0.3,
    backgroundColor: 'black',
    alignItems: 'center',
   marginTop: '6%',
  // marginBottom:'15%',
   alignContent: 'center',
   textAlign:'center',
  },
  under600px:{
    marginTop:'7%',
    resizeMode:'contain'
  },
  titleContainer:{
    backgroundColor: 'transparent',
width: '90%',
alignSelf:'center'
  },
  listContainer: {
    justifyContent: 'center',
    alignSelf: 'center',
    alignContent: 'center',
    alignItems: 'center',
    marginTop: '2%',
    opacity: 1,
    width: '90%',
    flex: 1
  },
  itemContainer: {
    width: '90%',
    height: '95%',
    alignItems: 'center',
    borderRadius: 10
  },
  itemLabel: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold'
  },
  counter: {
    marginTop: 25,
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  scene: {
    flex: 1,
  },

  background: {
    backgroundColor: 'black',
    position: 'fixed', 
    zIndex: 1,
    width: '100%',
    flex:0.1,
    //maxWidth: 1800
  },
  backgroundPlaceholder: {
    backgroundColor: 'white',
    //height: Dimensions.get('window').height * 0.1,
    position: 'relative', 
    width: '100%',
  },
  mainBackground: {
    //flex:0.9,
    //marginTop: this.state.headerDimensions.height,
    width: '100%',
    backgroundColor: 'black',
    //backgroundColor: '#430C41',
    //overflow: 'scroll',
   
  },
  topImage: {
    marginVertical: '10px',
    alignSelf: 'center',
    width: '90%',
    flexGrow:1
  },
  mark: {
    
    backgroundColor: '#5c1559',
    color: 'white'
  },
  header:{
    //backgroundColor: '#430C41',
    resizeMode:'contain',
    flex: 0.125,
  },
  backgroundPhoto:{
    //backgroundColor: '#430C41',
    flex: 0.14,
  },
  headerText:{
    fontSize: '30pt', 
    fontWeight: 'bold',
    textAlign: "center",
    textAlignVertical: "center"
    
  },
  gradientBackground: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    padding: 40,
    height: '75%',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  subheaderText:{
    color: 'white',
    fontSize: '10pt', 
    fontWeight: 'normal',
    textAlign: "center",
    textAlignVertical: "center",
    
  },
  overlay: {
    flex: 0.3,
    position: 'absolute',
    left: 0,
    top: '40%',
    opacity: 0.8,
    backgroundColor: 'black',
    width: '100%',
    height: '40%',
    alignContent: 'center',
    alignItems: 'center'
  } ,
  sectionTitle: {
    marginTop: 5,
    paddingHorizontal: 30,
    backgroundColor: 'transparent',
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 59,
    fontWeight: 'normal',
    textAlign: 'center',
    fontFamily: 'juriFrontageCondensedOutline'
  },
  sectionSubTitle:{
    marginTop: 3,
    paddingHorizontal: 30,
    backgroundColor: 'transparent',
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 17,
    fontWeight: 'normal',
    textAlign: 'center',
    fontFamily: 'Cloud'
  },
  slideTitle: {
    marginTop: 5,
    paddingHorizontal: 30,
    backgroundColor: 'transparent',
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center'
},
footerText:{
  fontSize: '0.8em',
  fontFamily: 'GraphikRegular',
  color: 'white',
  textAlign:'center'
},
slideSubtitle: {
  marginTop: 5,
  paddingHorizontal: 30,
  backgroundColor: 'transparent',
  color: 'rgba(255, 255, 255, 0.75)',
  fontSize: 13,
  fontWeight: 'bold',
  fontStyle: 'italic',
  textAlign: 'center'
},
slider: {
  marginTop: 15,
  overflow: 'hidden' // for custom animations
},
sliderContentContainer: {
  paddingVertical: 10 // for custom animation
},
bookContainer: {
  flex: 1,
  flexDirection: 'row',
  flexWrap: 'wrap',
  alignItems: 'flex-start' // if you want to fill rows left to right
},
bookItem: {
  marginTop: '1%',
  width: '50%', // is 50% of container width
  height: '100%',
  alignContent: 'center'
},
centerItem: {
  
  width: '100%', // is 50% of container width
  height: '100%',
  alignContent: 'center',
  alignSelf: 'center',
  opacity: 1, 
  marginTop: '2%',
  resizeMode: 'contain'
},
centerItemLT600: {
  
  width: '100%', // is 50% of container width
  height: '50%',
  opacity: 0.9, 
  marginTop: '2%',
  resizeMode:'contain'
},

BioTextAlt: {
  width:'98%', height:'90%',  marginVertical:'11%', alignSelf: 'center'

},

BioText:{
  width:'50%', height:'90%', marginLeft:'5%', marginVertical:'6%'
},
bioItem: {
  
  width: '100%', // is 50% of container width
  height: '100%',
  alignContent: 'start',
  alignSelf: 'start',
  opacity: 0.9,
  marginTop:'15%',
  resizeMode: 'contain'
},
rightItem: {
  marginTop: '1%',
  width: '50%', // is 50% of container width
  height: '100%',
  flexDirection: 'row',
  justifyContent: 'flex-end',
  
  opacity: 0.5
},
paginationContainer: {
  paddingVertical: 8,
},
paginationDot: {
  width: 12,
  height: 12,
  borderRadius: 4,
  marginHorizontal: 8
},
modalButton: {
  borderRadius: 20,
  padding: 10,
  elevation: 2
},
modalButtonOpen: {
  backgroundColor: "#9542f5",
},
  flexPanel: {
    borderRadius:10, 
    marginRight: '1%',
    alignContent: 'center'
  },
  container: {
    flexGrow: 0.2,
    padding: 20,
  },
  text: {
    color: "white",
    fontSize: 18,
    lineHeight: '395%',
    fontWeight: "bold",
    textAlign: "center",
    backgroundColor: "#000000c0",
    marginRight:'30px'
  },
  image: {
    flexGrow: 0.5,
    alignSelf: 'flex-start',
    justifyContent: 'space-around',
    overflow: 'hidden',
    marginRight: '30px'
  },

});

  
   //Renders Image for flatlist
    renderImage({item} ) {
      console.info(item)
    return (
      <TouchableOpacity style={{paddingHorizontal:'10px', paddingVertical:'10px', flex: 1 / numColumns}} onPress={() => {
        this.enlargeImg(item)}}>
      <Image
        source={{ uri: item.url }}
        style={{aspectRatio: 1  }}
      /></TouchableOpacity>
    );
  }
//Populates the photo gallery with images in the local directory
  populatePhotoGallery(folderDir){

  }
  //Determines if screen width is LT events view screen size threshold value
  renderEventsView(){
    console.log("in function")
    if (SCREEN_WIDTH < EVENTS_VIEW_SIZE_CONSTRAINT_THRESHOLD ){
        this.setState({
          eventsViewMobile: true
        })
        return
    }
    this.setState({
      eventsViewMobile: false
    })
  }

  screenLT1200(){
    if(SCREEN_WIDTH < BIO_TEXT_THRESHOLD){
      this.setState({
        screenSizeLT1200px: true
      })
      return
    }
    
    this.setState({
      screenSizeLT1200px: false
    })
  
  }

  renderBioView(){
    console.log("in function")
    if (SCREEN_WIDTH < BIO_VIEW_SIZE_CONSTRAINT_THRESHOLD ){
        this.setState({
          bioLT550: true
        })
        return
    }
    this.setState({
      bioLT550: false
    })
  }

  renderVideosView(){
    console.log("in function")
    if (SCREEN_WIDTH <= VIDEOS_VIEW_SIZE_CONSTRAINT_THRESHOLD ){
        this.setState({
          videosLT425: true
        })
        return
    }
    this.setState({
      videosLT425: false
    })
  }

    //Renders Image for flatlist
    renderVideo({ item }) {
      console.log("value of this: " + item)
    return (
      <View id="thumbnail" style={{resizeMode:'contain', paddingHorizontal:'10px',  borderColor: 'purple' , aspectRatio: 1, flex: 1 / numVideoColumns}}>
      <Thumbnail style={{paddingVertical: '50%'}} iconStyle={{color:'white', width: SCREEN_WIDTH * 0.05, height: SCREEN_WIDTH * 0.05, justifyContent:'center', alignSelf:'center' }} url={item} />
      </View>
    );
  }

 
   imagePressed(item){
    console.log("here", item)

    this.setState(state => ({
         lightboxIsOpen: !state.lightboxIsOpen,
         selectedImage: {author: "Sandra Dee", index: item.index},
         enlargedImage: {uri: item.image.uri}
       }));

      //  this.state.lightboxIsOpen = !this.state.lightboxIsOpen
      //  this.state.selectedImage = {author: "Sandra Dee", index: item.index}
      //  this.state.enlargedImage = [{source: item.image.uri}]

       console.log("states", this.state)

   }
   _renderItem({ item, index }) {
    return (
       <SliderEntry data={item} even={(index + 1) % 2 === 0} />

      // <View style={this.styles.itemContainer}>
      //   <TouchableOpacity style={this.styles.itemContainer} onPress={()=>{this.imagePressed(item)}}>
      //   <Image source={item.image} style={{width:'100%', height: '90%', borderRadius: 10}}></Image>
      //   </TouchableOpacity> 
      //   <Text style={this.styles.itemLabel}>{`${item.metadata.description}`}</Text>
      // </View>
    );
  }
  onLayout = event => {
    if (this.state.dimensions) {
      console.log("layout",event.nativeEvent.layout )

      return // layout was already called
    }
    let {width, height} = event.nativeEvent.layout
    this.setState({headerDimensions: {width, height}})
  }

  sendEmail(email, messageText){
    // Load the AWS SDK for Node.js
var AWS = require('aws-sdk');
// Set the region 
AWS.config.update({region: 'REGION'});

// Create sendEmail params 
var params = {
  Destination: { /* required */
    CcAddresses: [
      /* more items */
    ],
    ToAddresses: [
      'sandyrobinson0@yahoo.com',
      /* more items */
    ]
  },
  Message: { /* required */
    Body: { /* required */
      Html: {
       Charset: "UTF-8",
       Data: "HTML_FORMAT_BODY"
      },
      Text: {
       Charset: "UTF-8",
       Data: "TEXT_FORMAT_BODY"
      }
     },
     Subject: {
      Charset: 'UTF-8',
      Data: 'Message From: ' + email
     }
    },
  Source: 'SENDER_EMAIL_ADDRESS', /* required */
  ReplyToAddresses: [
     'EMAIL_ADDRESS',
    /* more items */
  ],
};

// Create the promise and SES service object
var sendPromise = new AWS.SES({apiVersion: '2010-12-01'}).sendEmail(params).promise();

// Handle promise's fulfilled/rejected states
sendPromise.then(
  function(data) {
    console.log(data.MessageId);
  }).catch(
    function(err) {
    console.error(err, err.stack);
  });
  }
 render () {
  const { slider1ActiveSlide } = this.state;
  const images= [
    "https://source.unsplash.com/1024x768/?nature",
    "https://source.unsplash.com/1024x768/?water",
    "https://source.unsplash.com/1024x768/?girl",
    "https://source.unsplash.com/1024x768/?tree", // Network image
              // Local image
  ]
  const image = { uri: "https://reactjs.org/logo-og.png" };
  const eventsImage = require('./src/assets/Upcoming Events BG.png');

  const leftBookingImage = { uri: require('./src/assets/ImageSlideshow/One of Her Favorite Clubs to Peform At_4.jpg') };
  const topImage = { uri: 'https://cdn.shopify.com/s/files/1/0088/8887/7156/files/DSC00620_2_1296x.jpg?v=1629077379'};
  const responsive = {
    superLargeDesktop: {
      breakpoint: { max: 464, min: 0 },

      items: 1
    },
    desktop: {
      breakpoint: { max: 464, min: 0 },

      items: 1
    },
    tablet: {
      breakpoint: { max: 464, min: 0 },

      items: 1
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1
    }
  };
  if (this.state.fontsLoaded) {
  return (
      <View style={[{backgroundColor: 'black', height:6300}]}>
         
<View style={this.styles.background}  onLayout={this.onLayout}>
    <ScrollView contentContainerStyle={{
      flexDirection: "row",
      padding: 0,
      marginLeft: '2%'
     
      
  }}
  horizontal={true}
  scrollEnabled={true}>
      <View style={   this.styles.flexPanel} >
      <Link  activeClass="active" to='events' offset={-100}>
      <Text style={this.styles.text}>Capabilities of Sandra Dee</Text>
    </Link>
    </View>
    <View style={this.styles.flexPanel} >
      <Link  activeClass="active" to= 'bio' offset={-100}>
      <Text style={this.styles.text}>BIO</Text>
    </Link>
    </View>
    <View style={this.styles.flexPanel} >
      <Link activeClass="active" to='accomplishments' offset={-100} >
      <Text style={this.styles.text}>Acheivements</Text>
    </Link>
    </View>
    <View style={this.styles.flexPanel} >
      <Link  activeClass="active" to='photos' offset={-100}>
      <Text style={this.styles.text}>Photos</Text>
    </Link>
    </View>
    <View style={this.styles.flexPanel} >
      <Link  activeClass="active" to='videos' offset={-100}>
      <Text style={this.styles.text}>Videos</Text>
    </Link>
    </View>
    <View style={this.styles.flexPanel} >
      <Link  activeClass="active" to='contact' offset={-100}>
      <Text style={this.styles.text}>Contact</Text>
    </Link>
    </View>
   <View style={{width: '30%', height:'100%', flexDirection:'row', marginLeft:'20%', alignSelf:'row-reverse'}}>
    <View style={{width: '10%', height:'50%', marginLeft: '4%', alignItems: 'flex-start',     alignSelf: 'center'}} >
    <a href="https://www.youtube.com/@TheSandraDee/featured" style={{justifyContent:'center', resizeMode:'contain', width: '100%', height:'100%'}}>
    <Image source={{uri:'https://billburr.com/wp-content/themes/bill-burr/images/youtube-icon2.png'}} style={{justifyContent:'center', resizeMode:'contain', width: '100%', height:'100%'}}>
    </Image>
    </a>
    </View>
    <View style={{width: '10%', height:'50%', marginLeft: '4%', alignItems: 'flex-start',     alignSelf: 'center'}} >
    <a href="https://twitter.com/deecomedian?lang=en" style={{justifyContent:'center', resizeMode:'contain', width: '100%', height:'100%'}}>

      <Image source={{uri:'https://billburr.com/wp-content/uploads/2018/11/twitter-icon.png'}} style={{justifyContent:'center', resizeMode:'contain', width: '100%', height:'100%'}}>

    </Image>
    </a>
    </View>
    <View style={{width: '10%', height:'50%', marginLeft: '4%', alignItems: 'flex-start',     alignSelf: 'center'}} >
    <a href="https://www.instagram.com/sandradee100/?hl=en" style={{justifyContent:'center', resizeMode:'contain', width: '100%', height:'100%'}}>

      <Image source={{uri:'https://billburr.com/wp-content/uploads/2018/11/instagram-icon.png'}} style={{justifyContent:'center', resizeMode:'contain', width: '100%', height:'100%'}}>

    </Image>
    </a>
    </View>
    <View style={{width: '10%', height:'50%', marginLeft: '4%', alignItems: 'flex-start',     alignSelf: 'center'}} >
    <a href="https://www.facebook.com/sandra.dee.58726823" style={{justifyContent:'center', resizeMode:'contain', width: '100%', height:'100%'}}>

      <Image source={{uri:'https://billburr.com/wp-content/uploads/2018/11/facebook-icon.png'}} style={{justifyContent:'center', resizeMode:'contain', width: '100%', height:'100%'}}>

    </Image>
    </a>
    </View>
    </View>
    </ScrollView>
    </View>

               <View  style={this.styles.backgroundPlaceholder}>
               <ScrollView contentContainerStyle={{
      flexDirection: "row",
      padding: 0,
      marginLeft: '2%',
     
      
  }}
  horizontal={true}
  scrollEnabled={false}>
      <View style={   this.styles.flexPanel} >
      <TouchableOpacity  style={this.styles.image}>
      <Text style={this.styles.text}>About Me</Text>
    </TouchableOpacity>
    </View>
    <View style={this.styles.flexPanel} >
      <TouchableOpacity  style={this.styles.image}>
      <Text style={this.styles.text}>Media</Text>
    </TouchableOpacity>
    </View>
    <View style={this.styles.flexPanel} >
      <TouchableOpacity  style={this.styles.image}>
      <Text style={this.styles.text}>Acheivements</Text>
    </TouchableOpacity>
    </View>
    <View style={this.styles.flexPanel} >
      <TouchableOpacity  style={this.styles.image}>
      <Text style={this.styles.text}>Merchandise</Text>
    </TouchableOpacity>
    </View>
    <View style={this.styles.flexPanel} >
      <TouchableOpacity  style={this.styles.image}>
      <Text style={this.styles.text}>Events</Text>
    </TouchableOpacity>
    </View>
    </ScrollView>
               </View>

      <View
      style={[this.state.videosLT425 ?  [this.styles.mainBackground, {height:6300}] : this.styles.mainBackground]}
     
      >
        <Modal
        animationType="slide"
        presentationStyle="fullScreen"
        transparent={true}
        visible={this.state.lightboxIsOpen}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
        }}>
         
        <View style={{flex:1, padding: 40,backgroundColor:'black', height: '90%'}}>
        <Text style={{color: 'white',fontFamily:'Cloud', fontWeight:'bold', fontSize:'22pt', marginTop:'2%', marginBottom: '1%', alignSelf: 'center', textAlign:'center'}}>{this.state.enlargedImage.title}</Text>

        <Image source={this.state.enlargedImage.uri} style={{height: '80%', resizeMode:'contain', marginBottom: '2%'}}></Image>
        {/* <Text style={{color: 'white',fontFamily:'CloudLight', fontSize:'15pt', alignSelf: 'center', marginBottom: '4%'}}>SANDRA DEE ON STAGE WITH CLIFF HUX</Text> */}

        <Pressable
              style={[this.styles.modalButton, this.styles.modalButtonOpen]}
              onPress={() => this.setState(state => ({
                lightboxIsOpen: !state.lightboxIsOpen,
               
              }))}
            ><Text style={{ color: "white",
            fontWeight: "bold",
            textAlign: "center"}}>Close</Text></Pressable>
        </View>
      </Modal>
      <View style={this.styles.backgroundPhoto}>
        <ImageBackground  style={{ width:'100%'}} source={require('./src/assets/Sandra Dee Background.jpg')}>
        <LinearGradient
    colors={['transparent', 'rgba(1,1,1,1)']}
    style={this.styles.gradientBackground}
  />

           {/* <View style={this.styles.overlay} >
<Image style={{height:'100%', width:'70%', opacity: 0.9}} source={require('./src/assets/Sandra Dee Intro.gif')}/>
             </View> */}

      <View style={this.styles.header}>
        <Image style={[this.state.screenSizeLT1200px? {resizeMode:'contain', height:'20%', width: '65%', alignSelf: 'center', marginTop: '2%', marginLeft:'2%', paddingVertical:'7%',  opacity: 1}: {resizeMode:'contain', height:'20%', width: '37.5%', alignSelf: 'center', marginTop: '5%', marginLeft:'-40%', paddingVertical:'7%',  opacity: 1}]} source={require('./src/assets/Sandra Dee Official Title.png')}></Image>
        <View style={{marginLeft: '5%' ,marginTop: '10%', width: '40%'}}>
    <span class="kingdom kingdom--shadow" data-text='"ONE OF THE'>
      "ONE OF THE</span> <span class="kingdom kingdom--shadow" data-text="FUNNIEST">FUNNIEST</span><span class="kingdom kingdom--shadow" data-text="COMICS">COMICS</span>
      <span class="kingdom kingdom--shadow" data-text="YOU'LL">YOU'LL</span><span class ="kingdom kingdom--shadow strikethrough" data-text="PROBABLY" >PROBABLY </span>
       <span class="kingdom kingdom--shadow" data-text="DEFINITELY">DEFINITELY</span>
       <span class="kingdom kingdom--shadow" data-text="EVER MEET.">EVER MEET." <br></br><Text style={{fontSize: '15pt', color: 'gray', fontWeight: 'bold', fontFamily:'Cloud'}}>- EVERYONE WHO DIDN'T DIE FROM LAUGHTER</Text></span>
<br></br>

  </View>

  <View style={{width: '90%', height: '160%', }}>

  <Image style={{height:"110%", width: '92%', marginTop: '8%', marginLeft:'10%',resizeMode:'contain'}} source={require('./src/assets/Triple Circle Widget new.png')}></Image>
</View>


        </View>
        
    </ImageBackground>
    </View>
    {/* <View style={{flexGrow:0.225, paddingBottom: '20px'}}>
    <Image source={topImage} style={this.styles.topImage}></Image>
    </View> */}
    <View style={this.styles.highlightsContainer}>
    <Text style={{fontFamily:'Amithen', color:'white', fontSize: '45pt', alignSelf:'center', marginTop: '9%'}}>SANDRA DEE</Text>

    <View style={[this.styles.titleContainer, {flex:0.9}]}>
  <View style = {[this.styles.listContainer, {flex:0.9}]}>
  <iframe width="100%" height="100%" src="https://www.youtube.com/embed/yRtzWn_5zko" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
      </View>
  </View>
    </View>

     <View  nativeID='events' style={[!this.state.eventsViewMobile ? this.styles.eventsContainer: {flex:0, height:0, overflow:'hidden'}]}>
      
     <View style={this.styles.centerItem}>

    <ImageBackground source={eventsImage} resizeMode='contain' style={{resizeMode: 'contain', height: '100%', width:'100%', orderWidth: 1,
    borderRadius: 2,
    alignSelf: 'end',
    borderColor: 'black',
    borderBottomWidth: 5,
    opacity:1,
    borderTopWidth: 5,
    marginBottom: '18%'
    }}>
  
  <View style={this.styles.titleContainer}>
  <Text style={[this.state.screenSizeLT1200px? {fontFamily:'juriFrontageCondensedOutline', color:'white', fontSize: '45pt', alignSelf:'center', marginTop: '10%'}: {fontFamily:'juriFrontageCondensedOutline', color:'white', fontSize: '65pt', alignSelf:'center', marginTop: '10%'}]}>BOOK A SHOW WITH SANDRA DEE</Text>

  <View style = {[this.styles.listContainer, {height:'40%', marginTop:'10%'}]}>
        <CustomListview
          itemList={this.state.eventList}
        />
      </View>
  </View>
    
      </ImageBackground>
  </View>
 

      </View>  
      <View  nativeID='eventsAlt' style={[this.state.eventsViewMobile? this.styles.eventsContainer2: {flex:0.0, height: 0,  overflow:'hidden' }]}>
      <View style={this.styles.titleContainer}>
  <Text style={{fontFamily:'juriFrontageCondensedOutline', color:'white', fontSize: '45pt', alignSelf:'center', marginTop: '1%'}}>BOOK A SHOW WITH SANDRA DEE</Text>
  </View>
  <View style={this.styles.centerItemLT600}>

<Image source={eventsImage} style={{ height: '45%', width:'100%', orderWidth: 1,
borderRadius: 2,
marginTop: '-5%',
alignSelf: 'end',
borderColor: 'black',
borderBottomWidth: 5,
opacity:1,
borderTopWidth: 5,
resizeMode: 'contain',
position:'relative'
}}>
</Image>
<View style={[this.styles.listContainer]}>
<CustomListview
          itemList={this.state.eventList}
        />
      </View>

  
</View>
  

      </View> 
     
     
      <View nativeID='bio' style={[this.state.bioLT550 ?{ width: '98%',  alignSelf:'center', backgroundColor: 'transparent', paddingBottom: 20,   marginTop: '2%', marginBottom: '10%',resizeMode: 'contain' }: {flex:0.0, height: 0,  overflow:'hidden' }]}>


    <View  style={this.styles.bioItem}>
     <Text style={{fontFamily:'Amithen', color:'white', fontSize: '45pt', alignSelf:'center'}}>BIO</Text>
     <View style={this.styles.BioTextAlt}>
       <Text style={{fontFamily: 'Cloud', fontSize:'15px', color:'white'} }>
       <h2>Sandra Dee (a.k.a. Sandra Robinson)</h2>{"\n"}

      <h3>The Original D.O.G.
(Dirty Ol’ Grandma)</h3>
{"\n"}

She took Houston Comedy scene by storm beginning in February of 2017.
A phenomenon on the stage. Sandra Dee brings high energy to the stage. She uses her age to bring humor and wisdom to all subjects including real life and politics. The “wow-factor” in Sandra Dee’s comedy as someone’s older auntie the audience is fully engaged, and ears and eyes are wide open waiting to hear what’s next from the “Mom’s Marley” comedy style of the Original D.O.G.  Of comedy can be raw and with an appeal to various audiences that tackles the events of our time with flare.

Sandra has one best of comedy festivals. She has also won best come in Houston in the mainstream and clean comedy sectors. She has appeared in a clip on America’s got talent,

Sandra is a comedian actress, writer, and host. 
       </Text>
       
       </View>
     </View>
</View>
    <View  style={[!this.state.bioLT550 ?{width: '98%',  alignSelf:'center', backgroundColor: 'transparent', paddingBottom: 20,   marginTop: '25%',resizeMode: 'contain' }: {flex:0.0, height: 0,  overflow:'hidden' }]}>

    <ImageBackground nativeID='bio' source={require('./src/assets/Parallax Background.png')} resizeMode='contain' style={{resizeMode: 'contain',backgroundColor: 'transparent', alignSelf: 'center', marginTop: '7%', marginRight:'0%', height:'100%', borderTopWidth: '3px'
    }}>
    <View  style={this.styles.bioItem}>
     <Text style={{fontFamily:'Amithen', color:'white', fontSize: '65pt', alignSelf:'center'}}>BIO</Text>
     <View style={{width:'50%', height:'90%', marginLeft:'5%', marginVertical:'6%'}}>

      
       <Text style={[ this.state.screenSizeLT1200px ?{fontFamily: 'Cloud', fontSize:'15px', color:'white'} : {fontFamily: 'Cloud', fontSize:'25px', color:'white'}]}>
       <h2>Sandra Dee (a.k.a. Sandra Robinson)</h2>{"\n"}

<h3>The Original D.O.G.
(Dirty Ol’ Grandma)</h3>
{"\n"}
She took Houston Comedy scene by storm beginning in February of 2017.
A phenomenon on the stage. Sandra Dee brings high energy to the stage. She uses her age to bring humor and wisdom to all subjects including real life and politics. The “wow-factor” in Sandra Dee’s comedy as someone’s older auntie the audience is fully engaged, and ears and eyes are wide open waiting to hear what’s next from the “Mom’s Marley” comedy style of the Original D.O.G.  Of comedy can be raw and with an appeal to various audiences that tackles the events of our time with flare.

Sandra has one best of comedy festivals. She has also won best come in Houston in the mainstream and clean comedy sectors. She has appeared in a clip on America’s got talent,

Sandra is a comedian actress, writer, and host. 
       </Text>
       
       </View>
     </View>
       </ImageBackground>    
    </View>
    <View nativeID='accomplishments' style={[SCREEN_WIDTH > 800 ?{width: '100%', marginTop:'10%', alignSelf:'center',  backgroundColor: 'transparent', paddingBottom: 150, flex: 0.1}: {flex:0.0, height: 0,  overflow:'hidden' }]}>
      
    <ImageBackground nativeID='bio' source={require('./src/assets/timeline photo.jpg')} resizeMode='contain' style={{resizeMode: 'contain',backgroundColor: 'transparent', alignSelf: 'center', marginTop: '7%', marginRight:'0%', height:'100%', width: '100%', borderTopWidth: '3px'
    }}>
   
   <View style={{fontFamily:'Amithen', alignSelf:'center', resizeMode:'contain', marginTop: '5%', textAlign:'center', width: '90%'}}>
    <Text style={{fontFamily:'Amithen', color:'white', fontSize: '300%', alignSelf:'center', textAlign:'center'}}>Sandra Dee's Journey</Text>
    <Text style={[this.styles.sectionSubTitle, {marginBottom:'10%'}]}>A Timeline of How She Became the Comedian She Is Today!</Text>
    </View>
{/* <View style = {{
        flex: 1,
        left: 0,
        top: 0,
        opacity: 5,
        backgroundColor: 'black',
        width: '60%',
        height: '100%'
      }}> */}
    <Timeline
          data={this.data}
          circleSize={30}
          circleColor='gold'
          lineColor='black'
          timeContainerStyle={{minWidth:52, marginTop: -5, marginLeft: '50px'}}
          innerCircle={'icon'}
          icon = {timelineIcon}
          separator={false}
          timeStyle={{textAlign: 'center', backgroundColor:'#540675', color:'white', padding:5, borderRadius:13}}
          descriptionStyle={{fontSize: 10, color:'black',backgroundColor:'white',paddingHorizontal:'3px',borderRadius:'10px', alignSelf: 'flex-start', fontWeight: 900}}
          titleStyle={{color:'white', backgroundColor:'black', borderRadius:'10px', alignSelf: 'flex-start', paddingHorizontal: '3px'}}
          options={{
            style:{paddingTop:5, alignSelf: 'center',  marginLeft: '3%', marginTop: '30%', height: '70%'}
          }}
        />
        {/* </View> */}
               </ImageBackground>   

    </View>
    <View nativeID='accomplishments' style={[SCREEN_WIDTH <= 800 ?{width: '90%', marginTop:'10%', alignSelf:'center',  backgroundColor: 'transparent', paddingBottom: 50}: {flex:0.0, height: 0,  overflow:'hidden' }]}>
    <Text style={{fontFamily:'Amithen', color:'white', fontSize: '45pt', alignSelf:'center', marginTop: '5%', textAlign:'center'}}>Sandra Dee's Journey</Text>
    <Text style={[this.styles.sectionSubTitle, {marginBottom:'10%'}]}>A Timeline of How She Became the Comedian She Is Today!</Text>

    <Timeline
          data={this.data}
          circleSize={30}
          circleColor='gold'
          lineColor='rgb(45,156,219)'
          timeContainerStyle={{minWidth:52, marginTop: -5}}
          innerCircle={'icon'}
          icon = {timelineIcon}
          separator={false}
          timeStyle={{textAlign: 'center', backgroundColor:'#f87b06', color:'white', padding:5, borderRadius:13}}
          descriptionStyle={{color:'gray'}}
          titleStyle={{color:'white'}}
          options={{
            style:{paddingTop:5}
          }}
        />
    </View>
    <View nativeID='photos' style={[!this.state.eventsViewMobile? {flex: 0.27, marginTop:'10%',paddingBottom: '3%', backgroundColor: 'transparent', width: '90%',  alignSelf:'center'}:{flex: 0.13, marginTop:'10%',paddingBottom: '3%', backgroundColor: 'transparent', width: '90%',  alignSelf:'center'}]}>
    <Text style={{fontFamily:'Amithen', color:'white', fontSize: '45pt', alignSelf:'center', marginTop: '5%', marginBottom:'5%'}}>PHOTOS</Text>
    <FlatList data={this.state.photoGallery} renderItem={this.renderImage} numColumns={numColumns} />;
   
</View>

<View nativeID='videos' style={[ !this.state.eventsViewMobile? {flex: 0.19, marginTop:'10%',paddingBottom: '3%', backgroundColor: 'transparent', width: '90%',  alignSelf:'center'} : {flex: 0.18, marginTop:'10%',paddingBottom: '3%', backgroundColor: 'transparent', width: '90%',  alignSelf:'center'}]}>
<View style={{ flexDirection: 'row', alignItems: 'center', alignContent: 'center', justifyContent:'center'}}><Text style={[!this.state.videosLT425? {fontFamily:'Amithen', color:'white', fontSize: '45pt', alignSelf:'center', marginTop: '5%', marginBottom:'2%'}: {fontFamily:'Amithen', color:'white', fontSize: '35pt', alignSelf:'center', marginTop: '5%', marginBottom:'2%'}]}>VIDEOS</Text>
<Text style ={[!this.state.videosLT425? {fontFamily:'juriFrontageCondensedOutline', fontSize:'16pt', color:'white'}:{fontFamily:'juriFrontageCondensedOutline', fontSize:'10pt', color:'white'}]}>{'    '}WATCH MORE ON </Text><Image style={{ resizeMode: 'contain', height:'20%', width: '4%'}} source={{uri:'https://www.shareicon.net/download/2015/09/19/103425_video.svg'}}></Image></View>
    <FlatList data={videoList} renderItem={this.renderVideo} numColumns={numVideoColumns} />

  {/* </View>
</View> */}
</View>


<View nativeID='contact'  style={[this.state.videosLT425 ? {flex: 0.15, marginTop:'10%',paddingBottom: '3%', backgroundColor: 'transparent', width: '90%',  alignSelf:'center'} : {flex: 0.1, marginTop:'10%',paddingBottom: '3%', backgroundColor: 'transparent', width: '90%',  alignSelf:'center'}]}>

<Text style={this.styles.sectionTitle}>Contact Sandra Dee</Text>

<View style={{flex: 0.9,width: '90%',  marginTop:'3%', alignSelf:'center', flexDirection: 'row',
   flexWrap: 'wrap',
   alignItems: 'flex-start'}} // if you want to fill rows left to right}}
   >
   
   
 
<View style={this.styles.bookItem}>
   <Image source={leftBookingImage} style={{height: '100%', borderRadius: 10}}/>
 </View>
 <View style={[this.styles.bookItem, {marginLeft:'2%', width:'48%'}]}>
   {/* <React.Fragment>
 <dl style={{marginLeft: '10%', whiteSpace: 'initial', color:'white', overflow: 'scroll', maxLines: 2}}>
     <dt>Phone:</dt>
     <dd><strong>832-466-8988</strong></dd>
     <dt>Email:</dt>
     <dd><strong>sandyRobinson@gmail.com</strong></dd>
     </dl>
     </React.Fragment> */}
     <View style={{height:'90%'}}>
     <Text style={{fontFamily:'cloudLight', fontSize: 18, color: 'white', marginTop:'20%', alignSelf: 'center'}}>Email Address:</Text>
      <Text
      
      style={{padding: 10, color: 'white', alignSelf:'center', width: '90%', borderRadius: '10px', borderColor:'gray', textAlign: 'center'}}
    ><b>sandradee@hilarioussandradee.com</b></Text>
    <View style={{marginBottom:'-6%'}}></View>
       <Text style={{fontFamily:'cloudLight', fontSize: 18, color: 'white', marginTop:'20%', alignSelf: 'center'}}>Phone Number:</Text>
      <Text
  
      style={{padding: 10,color:'white', alignSelf:'center', width: '90%', borderRadius: '10px', marginBottom: 10, textAlign: 'center'}}
    ><b>(832)-466-9809</b></Text>
    </View>
   
     </View>
     </View>
    </View>

    <View nativeID='contact'  style={[!this.state.eventsViewMobile ? {flex: 0.0, marginTop:'10%',paddingBottom: '3%', backgroundColor: 'transparent', width: '90%',  alignSelf:'center'} : {flex: 0.0, marginTop:'10%',paddingBottom: '3%', backgroundColor: 'transparent', width: '90%',  alignSelf:'center'}]}>
<ImageBackground style={{width: '100%', height: "90%"}} source={SandraDeeBottomImg} ></ImageBackground>
    </View>
    <View style={{flex: 0.015, marginTop: 'auto',  textAlignVertical:'bottom', textAlign:'center',  backgroundColor:'transparent'}}>
      <Text style={this.styles.footerText}>2022. Sandra Dee, All Rights Reserved.</Text>
      <Text style={this.styles.footerText}>Website and Content Design by Keith Russell. Contact @ keithrmathman@gmail.com.</Text>
    </View>
    </View>
</View>

  );
          }
          else {
            return (
              <Apploading
                startAsync={getFonts}
                onFinish={() => {
                  this.setState(state => ({
                    fontsLoaded: true
                   }));
                  //setFontsLoaded(true);
                }}
                onError={console.warn}
              />
            );
          }


  
  // ...
//   const [index, setIndex] = React.useState(0);
//   const [routes] = React.useState([
//     {key: 'first', title: 'First'},
//     {key: 'second', title: 'Second'}
//   ]);

const FirstRoute = () => (
  <View style={{ flex: 1, backgroundColor: '#ff4081' }} />
);

// const SecondRoute = () => (
//   <View style={{ flex: 1, backgroundColor: '#673ab7' }} />
// );

//   const renderScene = SceneMap({
//     first: FirstRoute,
//     second: SecondRoute
    
//   });

//   return (
//     <TabView
//       navigationState={{index, routes}}
//       renderTabBar={renderTabBar}
//       renderScene={renderScene}
//       onIndexChange={setIndex}
//       initialLayout={initialLayout}
//     />
//   );
 };

 toggleLightbox = (post, selectedIndex) => {
  // this.setState(state => ({
  //   lightboxIsOpen: !state.lightboxIsOpen,
  //   selectedIndex
  // }));
  this.setState(state => ({
    lightboxIsOpen: !state.lightboxIsOpen,
    selectedImage: { author:"Sandra Dee", index: selectedIndex }
  }));
};



}

export default  App;
// const apiData = [S
//   {
//     id: 1,
//     title: "The Simpsons",
//     year: 1989,
//     image: require("./simpson.jpg"), 
//   },
//   {
//     id: 2,
//     title: "SpongeBob SquarePants ",
//     year: 1999,
//     image: require("./spongebob.jpg"),
//   },
// ];