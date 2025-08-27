import React, { useState, useRef, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Image,
  Animated,
  Easing,
  Keyboard,
  Platform,
  FlatList,
  TouchableWithoutFeedback,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import GeneralModal from '../../components/common/GeneralModal';
import Toast from 'react-native-toast-message';
import { connectionApi } from '../../api/connectionApi';
import { useAuth } from '../../context/AuthContext';
import { COLORS } from '../../components/ui/colors';
import { BlurView } from '@react-native-community/blur';
import Icon from 'react-native-vector-icons/Ionicons';

const SPOTLIGHT_ANIM_DURATION = 220;
const INPUT_SLIDE_ANIM_DURATION = 220;
const SCREEN_WIDTH = Dimensions.get('window').width;

const Connection = () => {
  const { authState } = useAuth();

  // Overlay search state
  const [spotlightVisible, setSpotlightVisible] = useState(false);
  const spotlightAnim = useRef(new Animated.Value(0)).current;
  const inputOverlayRef = useRef(null);

  // Search input slide/expand state
  const inputAnim = useRef(new Animated.Value(0)).current;
  const [inputHasFocus, setInputHasFocus] = useState(false);

  // Spotlight search data
  const [spotlightQuery, setSpotlightQuery] = useState('');
  const [spotlightLoading, setSpotlightLoading] = useState(false);
  const [spotlightResults, setSpotlightResults] = useState([]);
  const [spotlightError, setSpotlightError] = useState('');

  // Main UI state
  const [activeModal, setActiveModal] = useState(null);
  const [requests, setRequests] = useState([]);
  const [connections, setConnections] = useState([]);

  // Toast helper
  const showToast = (type, message, subMessage = '') => {
    Toast.show({
      type,
      text1: message,
      text2: subMessage,
      visibilityTime: 3200,
      autoHide: true,
      topOffset: 55,
    });
  };

  // Fetch requests/connections logic (unchanged)
  const fetchRequests = async () => {
    try {
      const response = await connectionApi.viewPending();
      setRequests((response.data.connections || []).filter(Boolean));
    } catch (error) {
      showToast('error', error.response?.data?.message || 'Failed to fetch requests');
    }
  };

  const sendRequest = async (receiverId) => {
    try {
      await connectionApi.sendRequest(receiverId);
      showToast('success', 'Connection Request Sent');
    } catch (error) {
      showToast('error', error.response?.data?.message || 'An error occurred');
    }
  };

  const updateConnection = async (senderId, status) => {
    try {
      await connectionApi.updateRequest(senderId, status);
      await fetchRequests();
      showToast('success', 'Connection Updated');
    } catch (error) {
      showToast('error', error.response?.data?.message || 'An error occurred');
    }
  };

  const fetchConnections = async () => {
    try {
      const response = await connectionApi.viewAll() || [];
      setConnections(response.data.connections || []);
    } catch (error) {
      showToast('error', error.response?.data?.message || 'Failed to fetch connections');
    }
  };

  // Modal logic
  const openModal = (modalName) => {
    if (!activeModal) setActiveModal(modalName);
  };
  const closeModal = () => setActiveModal(null);

  // Modals load data when opened
  useEffect(() => {
    if (activeModal === 'request') fetchRequests();
    else if (activeModal === 'view') fetchConnections();
  }, [activeModal]);

  // Spotlight opening/closing and animation with input bar slide
  const openSpotlight = () => {
    setSpotlightVisible(true);
    Animated.timing(spotlightAnim, {
      toValue: 1,
      duration: SPOTLIGHT_ANIM_DURATION,
      easing: Easing.out(Easing.ease),
      useNativeDriver: false,
    }).start(() => {
      // Start input animation immediately after overlay is shown
      Animated.timing(inputAnim, {
        toValue: 1,
        duration: INPUT_SLIDE_ANIM_DURATION,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: false,
      }).start(() => {
        inputOverlayRef.current?.focus();
        setInputHasFocus(true);
      });
    });
  };

  const closeSpotlight = () => {
    // Animate input wider again then hide entire overlay
    Animated.timing(inputAnim, {
      toValue: 0,
      duration: INPUT_SLIDE_ANIM_DURATION - 40,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: false,
    }).start(() => {
      setInputHasFocus(false);
      Animated.timing(spotlightAnim, {
        toValue: 0,
        duration: 190,
        easing: Easing.in(Easing.ease),
        useNativeDriver: false,
      }).start(() => {
        setSpotlightVisible(false);
        setSpotlightQuery('');
        setSpotlightLoading(false);
        setSpotlightResults([]);
        setSpotlightError('');
        Keyboard.dismiss();
      });
    });
  };

  // Animations for overlay and search bar input
  const overlayBgColor = spotlightAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['rgba(0,0,0,0)', 'rgba(0,0,0,0.14)'],
  });
  const overlayTranslateY = spotlightAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-2, 0],
  });
  const overlayOpacity = spotlightAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-0, 1],
  });

  // Search bar input width and back button animation
  const INPUT_MARGIN = 8;
  const BACK_BUTTON_WIDTH = 55; // Approximate width of back button
  const minInputWidth = SCREEN_WIDTH - (INPUT_MARGIN + BACK_BUTTON_WIDTH);
  const maxInputWidth = SCREEN_WIDTH - (BACK_BUTTON_WIDTH + INPUT_MARGIN);

  const inputWidth = inputAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [maxInputWidth, minInputWidth],
  });

  // Input translateX animation - slides in from left
  const inputTranslateX = inputAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-BACK_BUTTON_WIDTH + 22, 0],
  });

  // Back button should be visible immediately when overlay opens
  const backButtonOpacity = spotlightAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  // Search API call
  const handleSpotlightSearch = async (query) => {
    setSpotlightQuery(query);
    if (!query.trim()) {
      setSpotlightResults([]);
      setSpotlightError('');
      return;
    }
    setSpotlightLoading(true);
    setSpotlightError('');
    try {
      const response = await connectionApi.find(query.trim());
      setSpotlightResults(response.data.user ? [response.data.user] : []);
      if (!response.data.user) setSpotlightError('No user found.');
    } catch (error) {
      setSpotlightResults([]);
      setSpotlightError(error.response?.data?.message || 'No user found.');
    }
    setSpotlightLoading(false);
  };

  // Render: Spotlight result row
  const renderSpotlightResultItem = ({ item }) => (
    <View style={styles.spotlightResultItem}>
      <Image
        source={{ uri: item.avatar }}
        style={styles.spotlightAvatar}
      />
      <View style={{ flex: 1 }}>
        <Text style={styles.spotlightName}>{item.username}</Text>
        <Text style={styles.spotlightEmail}>{item.email}</Text>
      </View>
      <TouchableOpacity
        style={styles.sendRequestBtn}
        onPress={() => sendRequest(item.userId)}
      >
        <Text style={styles.sendRequestText}>Connect</Text>
      </TouchableOpacity>
    </View>
  );

  // Requests modal content
  const ViewRequestModalContent = () => {
    const filteredRequests = requests.filter(req => req._id !== authState.user.id);
    return (
      <View>
        {filteredRequests.length === 0 ? (
          <Text style={styles.noDataText}>No connection requests found.</Text>
        ) : (
          filteredRequests.map(req => (
            <View key={req._id} style={styles.requestItem}>
              <Image source={{ uri: req.avatar }} style={styles.requestAvatar} />
              <View style={{ flex: 1 }}>
                <Text style={styles.requestUsername}>{req.username}</Text>
                <Text style={styles.requestEmail}>{req.email}</Text>
              </View>
              <View style={styles.requestBtns}>
                <TouchableOpacity
                  style={styles.acceptBtn}
                  onPress={() => updateConnection(req._id, 'accepted')}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <Text style={styles.acceptText}>Accept</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.rejectBtn}
                  onPress={() => updateConnection(req._id, 'rejected')}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <Text style={styles.acceptText}>Reject</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </View>
    );
  };

  // Connections modal content
  const ViewConnectionsModalContent = () => (
    <View>
      {connections.length === 0 ? (
        <Text style={styles.noDataText}>No connections found.</Text>
      ) : (
        connections.map(conn => (
          <View key={conn._id} style={styles.connectionItem}>
            <Image source={{ uri: conn.avatar }} style={styles.requestAvatar} />
            <View style={{ flex: 1 }}>
              <Text style={styles.connectionUsername}>{conn.username}</Text>
              <Text style={styles.connectionEmail}>{conn.email}</Text>
              <Text style={styles.connectionEmail}>{conn.mobile}</Text>
            </View>
          </View>
        ))
      )}
    </View>
  );

  // Main render
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={Platform.OS === 'ios' ? { height: 12 } : null} />

        {/* Search Activator Bar */}
        <TouchableOpacity
          style={styles.spotlightActivator}
          activeOpacity={0.9}
          onPress={openSpotlight}
        >
          <Text style={[styles.spotlightActivatorText, { position: 'relative', paddingLeft: 18 }]}>Search with UID</Text>
          <Icon style={{ position: 'absolute', left: 10, }} name="search" size={20} color={COLORS.placeholder} />
        </TouchableOpacity>

        {/* Main Cards */}
        <View style={styles.cards}>
          <TouchableOpacity
            style={styles.card}
            onPress={() => openModal('request')}
            activeOpacity={0.96}
          >
            {/* <Image source={require('../../../assets/images/request.png')} style={styles.cardImage} /> */}
            <View style={styles.cardIconContainer}>
              <Icon name="person-add" size={24} color={COLORS.text} />
            </View>
            <View style={styles.cardTextContainer}>

              {/* <Text style={styles.cardHeader}>Connection Requests</Text> */}
              <Text style={styles.cardSubheading}>View and manage requests</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.card}
            onPress={() => openModal('view')}
            activeOpacity={0.96}
          >
            {/* <Image source={require('../../../assets/images/connections.png')} style={styles.cardImage} /> */}
            <View style={styles.cardIconContainer}>
              <Icon name="people" size={24} color={COLORS.text} />
            </View>
            <View style={styles.cardTextContainer}>
              {/* <Text style={styles.cardHeader}>Connections</Text> */}
              <Text style={styles.cardSubheading}>View your connections</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Requests Modal */}
        <GeneralModal
          visible={activeModal === 'request'}
          onClose={closeModal}
          title="Connection Requests"
        >
          <ViewRequestModalContent />
        </GeneralModal>
        {/* Connections Modal */}
        <GeneralModal
          visible={activeModal === 'view'}
          onClose={closeModal}
          title="Your Connections"
        >
          <ViewConnectionsModalContent />
        </GeneralModal>

        {/* Spotlight Search Overlay */}
        {spotlightVisible && (
          <Animated.View
            pointerEvents="box-none"
            style={[
              StyleSheet.absoluteFill,
              {
                zIndex: 999,
                backgroundColor: overlayBgColor,
                opacity: overlayOpacity,
              },
            ]}
          >
            <BlurView
              style={StyleSheet.absoluteFill}
              blurType={Platform.OS === 'ios' ? 'regular' : 'light'}
              blurAmount={25}
              overlayColor=""
            />
            <TouchableWithoutFeedback onPress={closeSpotlight}>
              <View style={{ flex: 1 }} />
            </TouchableWithoutFeedback>
            <Animated.View
              style={[
                styles.spotlightOverlaySheet,
                {
                  transform: [{ translateY: overlayTranslateY }],
                  opacity: overlayOpacity,
                }
              ]}
            >
              {/* Search bar and Back button */}
              <View style={styles.overlaySearchBarRow}>
                <Animated.View style={{ opacity: backButtonOpacity, marginRight: 8 }}>
                  <TouchableOpacity
                    hitSlop={{ top: 12, bottom: 12, left: 16, right: 16 }}
                    onPress={closeSpotlight}
                  >
                    <Icon name="arrow-back-outline" size={28} color={COLORS.text} />
                  </TouchableOpacity>
                </Animated.View>

                <Animated.View style={{
                  width: inputWidth,
                  transform: [{ translateX: inputTranslateX }]
                }}>
                  <TextInput
                    ref={inputOverlayRef}
                    style={styles.overlaySearchInput}
                    placeholder="Search by User ID"
                    value={spotlightQuery}
                    onChangeText={handleSpotlightSearch}
                    placeholderTextColor={COLORS.inputText}
                    autoCapitalize="none"
                    returnKeyType="search"
                    selectionColor={COLORS.primary}
                    onFocus={() => {
                      if (!inputHasFocus) {
                        Animated.timing(inputAnim, {
                          toValue: 1,
                          duration: INPUT_SLIDE_ANIM_DURATION,
                          useNativeDriver: false,
                        }).start();
                        setInputHasFocus(true);
                      }
                    }}
                  />
                  <Icon name="search" size={20} color={COLORS.placeholder} style={{ position: 'absolute', left: 10, top: 14 }} />
                </Animated.View>
              </View>
              {/* Results or Loading */}
              <View style={styles.spotlightResultsArea}>
                {spotlightLoading ? (
                  <Text style={styles.loadingText}>Searching...</Text>
                ) : spotlightQuery.length === 0 ? (
                  <></>
                ) : spotlightError ? (
                  <Text style={styles.noDataText}>{spotlightError}</Text>
                ) : (
                  <FlatList
                    data={spotlightResults}
                    keyExtractor={item => item.userId || item._id}
                    renderItem={renderSpotlightResultItem}
                    ListEmptyComponent={<Text style={styles.noDataText}>No user found.</Text>}
                  />
                )}
              </View>
            </Animated.View>
          </Animated.View>
        )}
      </View>
    </SafeAreaView>
  );
};

// (styles unchanged except for coloring and input overlay minor tweaks for animation/flex)
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    flex: 1,
    // padding: 18,
    backgroundColor: COLORS.background,
  },
  spotlightActivator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.inputBackground,
    borderRadius: 28,
    paddingHorizontal: 16,
    marginHorizontal: 18,
    paddingVertical: Platform.OS === 'ios' ? 12 : 9,
    marginBottom: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#2e354a',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.10,
        shadowRadius: 5,
      },
      android: {
        elevation: 1.2,
      }
    }),
    height: 50,
  },
  spotlightActivatorText: {
    fontSize: 17,
    color: COLORS.inputText,
  },
  spotlightOverlaySheet: {
    height: '100%',
    position: 'absolute',
    left: 0, right: 0, top: 0,
    borderBottomLeftRadius: 18,
    borderBottomRightRadius: 18,
    paddingTop: Platform.OS === 'ios' ? 62 : 18,
    paddingHorizontal: 18,
    minHeight: 185,
    shadowColor: '#000',
    shadowOpacity: 0.16,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 16,
    elevation: 3,
  },
  overlaySearchBarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    width: '100%',
  },
  overlaySearchInput: {
    position: 'relative',
    paddingLeft: 38,
    fontSize: 17,
    color: COLORS.text,
    paddingVertical: Platform.OS === 'ios' ? 10 : 7,
    paddingHorizontal: 14,
    backgroundColor: COLORS.inputBackground,
    borderRadius: 28,
    borderWidth: 0,
    height: 50,
    width: '100%',
  },
  cancelBtnText: {
    color: COLORS.primary,
    fontSize: 17,
    fontWeight: '600',
    paddingHorizontal: 2,
  },
  spotlightResultsArea: {
    minHeight: 80,
    paddingBottom: 14,
  },
  spotlightResultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.cardBackground,
    borderRadius: 11,
    marginBottom: 12,
    padding: 12,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
    elevation: 1,
    borderWidth: 0.75,
    borderColor: COLORS.border,
  },
  spotlightAvatar: {
    width: 40,
    height: 40,
    borderRadius: 11,
    marginRight: 14,
    backgroundColor: COLORS.inputBackground,
  },
  spotlightName: {
    fontWeight: 'bold',
    fontSize: 16,
    color: COLORS.text,
  },
  spotlightEmail: {
    color: COLORS.textSecondary,
    fontSize: 14,
  },
  loadingText: {
    color: COLORS.primary,
    textAlign: 'center',
    marginVertical: 14,
    fontSize: 15,
  },
  cardIconContainer: {
    width: 38,
    height: 38,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.iconBackground,
    padding: 6,
    borderRadius: 100
  },
  // CARDS (unchanged)
  cards: {
    width: '100%',
    padding: 20,
    // marginTop: 20,
    // gap: 20,
    // flex: 1,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  card: {
    flexDirection: 'column',
    width: '48%',
    minHeight: 120,
    // alignItems: 'center',
    backgroundColor: COLORS.cardBackground,
    borderColor: COLORS.border,
    borderWidth: 1,
    borderRadius: 10,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.09,
    shadowRadius: 8,
    marginBottom: 15,
  },
  cardImage: {
    width: 62,
    height: 62,
    marginRight: 16,
    borderRadius: 10,
  },
  cardTextContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  cardHeader: {
    fontSize: 19,
    fontWeight: '700',
    color: '#ebebebed',
  },
  cardSubheading: {
    fontSize: 15,
    color: '#ebebebaf',
    marginTop: 4,
    fontWeight: '400',
  },

  // REQUESTS MODAL
  requestItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 13,
    backgroundColor: COLORS.cardBackground,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 10,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.14,
        shadowRadius: 2,
      },
      android: {
        elevation: 2,
      }
    }),
  },
  requestAvatar: {
    width: 40,
    height: 40,
    borderRadius: 12,
    marginRight: 12,
    backgroundColor: COLORS.cardBackground,
  },
  requestUsername: {
    fontWeight: 'bold',
    fontSize: 16,
    color: COLORS.text,
  },
  requestEmail: {
    color: COLORS.textSecondary,
    fontSize: 14,
    marginTop: 1,
  },
  requestBtns: {
    marginLeft: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  acceptBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: 6,
    paddingVertical: 5,
    paddingHorizontal: 12,
    marginBottom: 5,
    minWidth: 68,
    alignItems: 'center',
  },
  rejectBtn: {
    backgroundColor: '#FF3B30',
    borderRadius: 6,
    paddingVertical: 5,
    paddingHorizontal: 12,
    minWidth: 68,
    alignItems: 'center',
  },
  acceptText: {
    color: '#fff',
    fontWeight: '600',
  },

  // CONNECTIONS MODAL
  connectionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 13,
    backgroundColor: COLORS.cardBackground,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    padding: 10,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.12,
        shadowRadius: 2,
      },
      android: {
        elevation: 2,
      }
    }),
  },
  connectionUsername: {
    fontWeight: 'bold',
    fontSize: 16,
    color: COLORS.text,
  },
  connectionEmail: {
    color: COLORS.textSecondary,
    fontSize: 14,
    marginTop: 1,
  },

  // COMMON
  sendRequestBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    padding: 9,
    borderRadius: 8,
    marginLeft: 6,
  },
  sendRequestText: {
    fontSize: 15,
    color: '#fff',
    fontWeight: '600',
  },
  noDataText: {
    textAlign: 'center',
    color: COLORS.textSecondary,
    fontSize: 15,
    marginVertical: 12,
  },
});

export default Connection;