import React, {useEffect, useRef, useState} from 'react';
import {
  Button,
  PermissionsAndroid,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import {
  createAgoraRtcEngine,
  ChannelProfileType,
  ClientRoleType,
  IRtcEngine,
  IRtcEngineEventHandler,
  RtcConnection,
  RtcSurfaceView,
} from 'react-native-agora';

const getPermission = async () => {
  if (Platform.OS === 'android') {
    await PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
      PermissionsAndroid.PERMISSIONS.CAMERA,
    ]);
  }
};
const appId = '94063bedf4d9430ea47bf70d41aafd21';
const token =
  '007eJxTYHBaXSjbouG0ulowQ2a/1Axt8y1xZbUVs/ab3U2UOvL3yzEFBksTAzPjpNSUNJMUSxNjg9REE/OkNHODFBPDxMS0FCPDD9Kr0xsCGRnevuVlZmSAQBCfi8ExPb8oUaEktbiEgQEAziIhsQ==';
const channelName = 'Agora test';
const uid = Math.floor(Math.random() * 100);

const CallScreen = ({navigation, route}: any) => {
  console.log('routes', route);
  const agoraEngineRef = useRef<IRtcEngine>();
  const [isJoined, setIsJoined] = useState(false);
  const [isHost, setIsHost] = useState(true);
  const [remoteUid, setRemoteUid] = useState(0);
  const [message, setMessage] = useState('');
  const eventHandler = useRef<IRtcEngineEventHandler>();
  const {width, height} = useWindowDimensions();
  console.log(remoteUid);

  useEffect(() => {
    setupVideoSDKEngine();
    return () => {
      agoraEngineRef.current?.unregisterEventHandler(eventHandler.current!);
      agoraEngineRef.current?.release();
    };
  }, []);

  const setupVideoSDKEngine = async () => {
    try {
      if (Platform.OS === 'android') {
        await getPermission();
      }
      agoraEngineRef.current = createAgoraRtcEngine();
      const agoraEngine = agoraEngineRef.current;
      eventHandler.current = {
        onJoinChannelSuccess: () => {
          console.log('Successfully joined channel: ' + channelName);
          setIsJoined(true);
        },
        onUserJoined: (_connection: RtcConnection, uid: number) => {
          setRemoteUid(uid);
        },
        onUserOffline: (_connection: RtcConnection, uid: number) => {
          setRemoteUid(0);
        },
        onError: (err: any) => {
          console.log('error', err);
        },
      };
      agoraEngine.registerEventHandler(eventHandler.current);
      agoraEngine.initialize({
        appId: appId,
      });
      agoraEngine.enableVideo();
      callTOJoin();
    } catch (error) {
      console.log(error);
    }
  };

  const callTOJoin = () => {
    if (isJoined) {
      return;
    }
    try {
      if (isHost) {
        // Start preview
        agoraEngineRef.current?.startPreview();
        // Join the channel as a broadcaster
        agoraEngineRef.current?.joinChannel(token, channelName, uid, {
          // Set channel profile to live broadcast
          channelProfile: ChannelProfileType.ChannelProfileCommunication,
          // Set user role to broadcaster
          clientRoleType: ClientRoleType.ClientRoleBroadcaster,
          // Publish audio collected by the microphone
          publishMicrophoneTrack: true,
          // Publish video collected by the camera
          publishCameraTrack: true,
          // Automatically subscribe to all audio streams
          autoSubscribeAudio: true,
          // Automatically subscribe to all video streams
          autoSubscribeVideo: true,
        });
      } else {
        // Join the channel as an audience
        agoraEngineRef.current?.joinChannel(token, channelName, uid, {
          // Set channel profile to live broadcast
          channelProfile: ChannelProfileType.ChannelProfileCommunication,
          // Set user role to audience
          clientRoleType: ClientRoleType.ClientRoleAudience,
          // Do not publish audio collected by the microphone
          publishMicrophoneTrack: false,
          // Do not publish video collected by the camera
          publishCameraTrack: false,
          // Automatically subscribe to all audio streams
          autoSubscribeAudio: true,
          // Automatically subscribe to all video streams
          autoSubscribeVideo: true,
        });
      }
    } catch (e) {
      console.log(e);
    }
  };

  const onMute = () => {
    try {
      agoraEngineRef.current?.muteLocalAudioStream(true);
      //   console.log(data, 'data___1');
      const cVal = agoraEngineRef?.current?.switchCamera();
      console.log(cVal, 'Data___1');
    } catch (error) {
      console.log(error);
    }
  };

  const leaveCall = () => {
    try {
      // Call leaveChannel method to leave the channel
      agoraEngineRef.current?.leaveChannel();
      setRemoteUid(0);
      setIsJoined(false);
      navigation.navigate('Home');
    } catch (e) {
      console.log(e);
    }
  };

  console.log('Callll');
  return (
    <View style={styles.container}>
      <View
        style={{
          backgroundColor: 'lightblue',
          position: 'absolute',
          top: 0,
          width: '100%',
          height: 50,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Text>Call Screen</Text>
      </View>
      {isJoined && isHost && (
        <React.Fragment key={0}>
          <RtcSurfaceView
            canvas={{uid: 0}}
            style={{width: width, height: height}}
          />
          <View style={styles.bottomContainer}>
            <TouchableOpacity
              onPress={leaveCall}
              style={{...styles.button, backgroundColor: 'red'}}>
              <Text>End Call</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onMute} style={styles.button}>
              <Text>Mute</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={onMute}
              style={{...styles.button, backgroundColor: 'lightgreen'}}>
              <Text>Flip Camera</Text>
            </TouchableOpacity>
          </View>
        </React.Fragment>
      )}
      {isJoined && remoteUid ? (
        <React.Fragment key={remoteUid}>
          <RtcSurfaceView
            canvas={{uid: remoteUid}}
            style={{
              width: 150,
              backgroundColor: 'red',
              height: 200,
              position: 'absolute',
              bottom: 70,
              right: 10,
              borderRadius: 20,
              overflow: 'hidden',
            }}
          />
        </React.Fragment>
      ) : null}
    </View>
  );
};

export default CallScreen;

const styles = StyleSheet.create({
  container: {flex: 1, justifyContent: 'center', alignItems: 'center'},
  bottomContainer: {
    flex: 1,
    position: 'absolute',
    bottom: 10,
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-evenly',
  },
  button: {
    backgroundColor: '#0093E9',
    padding: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    margin: 10,
  },
});
