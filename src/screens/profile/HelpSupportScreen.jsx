import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Linking,
    Modal,
    TextInput,
    Platform,
    useColorScheme,
    StatusBar,
    Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { HugeiconsIcon } from '@hugeicons/react-native';
import {
    Cancel01Icon,
    Note01Icon,
    HelpCircleIcon,
    Mail01Icon,
    MessageChat01Icon,
    Idea01Icon,
    ArrowRight01Icon,
    ArrowLeft01Icon,
    Tick02Icon,
    StarIcon,
    SentIcon,
    Call02Icon,
    QuestionCircleIcon,
    BookOpen01Icon,
} from '@hugeicons/core-free-icons';
import { useThemeColors } from '../../components/ui/colors';
import { showToast } from '../../config/toastConfig';

const HelpSupportScreen = () => {
    const navigation = useNavigation();
    const COLORS = useThemeColors();
    const scheme = useColorScheme();
    const isDark = scheme === 'dark';

    // Modals state
    const [faqModalVisible, setFaqModalVisible] = useState(false);
    const [guideModalVisible, setGuideModalVisible] = useState(false);
    const [feedbackModalVisible, setFeedbackModalVisible] = useState(false);
    const [liveChatModalVisible, setLiveChatModalVisible] = useState(false);

    // Feedback state
    const [rating, setRating] = useState(5);
    const [feedbackCategory, setFeedbackCategory] = useState('General');
    const [feedbackText, setFeedbackText] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Expanded FAQ items state
    const [expandedFaq, setExpandedFaq] = useState(null);

    // Live chat state
    const [chatMessages, setChatMessages] = useState([
        {
            id: '1',
            sender: 'support',
            text: 'Hello! 👋 Welcome to Swasthya Support. How can we help you today with your medication, vitals, or connections?',
            time: 'Just now',
        },
    ]);
    const [chatInput, setChatInput] = useState('');

    const handleSendChatMessage = () => {
        if (!chatInput.trim()) return;
        const userMsg = {
            id: Date.now().toString(),
            sender: 'user',
            text: chatInput.trim(),
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setChatMessages((prev) => [...prev, userMsg]);
        setChatInput('');

        setTimeout(() => {
            const replyMsg = {
                id: (Date.now() + 1).toString(),
                sender: 'support',
                text: 'Thank you for reaching out! A healthcare support specialist has received your message and will respond shortly.',
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            };
            setChatMessages((prev) => [...prev, replyMsg]);
        }, 1000);
    };

    const handleEmailSupport = async () => {
        const email = 'support@swasthya.app';
        const subject = encodeURIComponent('Swasthya App Support Request');
        const body = encodeURIComponent('Hi Swasthya Support Team,\n\nI need assistance with:\n');
        const mailUrl = `mailto:${email}?subject=${subject}&body=${body}`;

        try {
            const canOpen = await Linking.canOpenURL(mailUrl);
            if (canOpen) {
                await Linking.openURL(mailUrl);
            } else {
                showToast('info', 'Support Email', 'Contact us at: support@swasthya.app');
            }
        } catch (error) {
            showToast('info', 'Support Email', 'Contact us at: support@swasthya.app');
        }
    };

    const handleSubmitFeedback = () => {
        if (!feedbackText.trim()) {
            showToast('warning', 'Feedback Required', 'Please enter your comments or suggestions.');
            return;
        }
        setIsSubmitting(true);
        setTimeout(() => {
            setIsSubmitting(false);
            setFeedbackModalVisible(false);
            setFeedbackText('');
            showToast('success', 'Feedback Submitted', 'Thank you for helping us improve Swasthya!');
        }, 800);
    };

    const faqItems = [
        {
            q: 'How do I add a new medication reminder?',
            a: 'Go to the Medication screen and tap "+ Add Medication". Choose your medicine form, dosage, schedule times, frequency, and stock alert preferences.',
        },
        {
            q: 'How do I connect and share health data with family?',
            a: 'Navigate to the Care Circle / Connections screen from Home. Tap "Add Connection", enter their registered user code, and select the permission level you want to share.',
        },
        {
            q: 'What happens when I mark a dose as "Taken"?',
            a: 'Marking a dose as taken logs the exact intake timestamp into your history, automatically decreases your pill stock count, and updates your daily adherence percentage.',
        },
        {
            q: 'Are my personal health records private and secure?',
            a: 'Yes, all your biometric data, logs, and profile records are encrypted with healthcare-standard end-to-end encryption.',
        },
    ];

    const guideSteps = [
        {
            step: '1',
            title: 'Set up Daily Medications',
            desc: 'Add scheduled timings so Swasthya can send precise alarm notifications even when the app is backgrounded.',
        },
        {
            step: '2',
            title: 'Track Vitals & Hydration',
            desc: 'Log your daily water intake, sleep cycles, and heart rate for complete adherence insights.',
        },
        {
            step: '3',
            title: 'Invite Caregivers',
            desc: 'Enable caregivers or relatives to receive alerts if important doses are missed.',
        },
    ];

    const theme = isDark ? darkStyles : lightStyles;

    return (
        <SafeAreaView style={[styles.safeArea, theme.safeArea]}>
            <StatusBar
                barStyle={isDark ? 'light-content' : 'dark-content'}
                backgroundColor={isDark ? '#0B0F19' : '#FFFFFF'}
            />

            {/* ── Top Bar with Close Action ── */}
            <View style={[styles.topBar, theme.topBar]}>
                <TouchableOpacity
                    style={[styles.closeButton, theme.closeButton]}
                    onPress={() => navigation.goBack()}
                    activeOpacity={0.7}
                >
                    <HugeiconsIcon icon={Cancel01Icon} size={22} color={isDark ? '#F8FAFC' : '#0F172A'} />
                </TouchableOpacity>
            </View>

            <ScrollView
                style={styles.container}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* ── SECTION 1: Learn more ── */}
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, theme.sectionTitle]}>Learn more</Text>

                    <TouchableOpacity
                        style={[styles.menuItem, theme.menuItem]}
                        onPress={() => setGuideModalVisible(true)}
                        activeOpacity={0.7}
                    >
                        <View style={styles.menuItemLeft}>
                            <HugeiconsIcon icon={Note01Icon} size={20} color={isDark ? '#E2E8F0' : '#1E293B'} />
                            <Text style={[styles.menuItemText, theme.menuItemText]}>How to use Swasthya</Text>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.menuItem, theme.menuItem]}
                        onPress={() => setGuideModalVisible(true)}
                        activeOpacity={0.7}
                    >
                        <View style={styles.menuItemLeft}>
                            <HugeiconsIcon icon={HelpCircleIcon} size={20} color={isDark ? '#E2E8F0' : '#1E293B'} />
                            <Text style={[styles.menuItemText, theme.menuItemText]}>Help Center</Text>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.menuItem, theme.menuItem]}
                        onPress={() => setFaqModalVisible(true)}
                        activeOpacity={0.7}
                    >
                        <View style={styles.menuItemLeft}>
                            <HugeiconsIcon icon={Note01Icon} size={20} color={isDark ? '#E2E8F0' : '#1E293B'} />
                            <Text style={[styles.menuItemText, theme.menuItemText]}>Client FAQ</Text>
                        </View>
                    </TouchableOpacity>
                </View>

                {/* Divider Line */}
                <View style={[styles.sectionDivider, theme.sectionDivider]} />

                {/* ── SECTION 2: Contact Us ── */}
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, theme.sectionTitle]}>Contact Us</Text>

                    <TouchableOpacity
                        style={[styles.menuItem, theme.menuItem]}
                        onPress={handleEmailSupport}
                        activeOpacity={0.7}
                    >
                        <View style={styles.menuItemLeft}>
                            <HugeiconsIcon icon={Mail01Icon} size={20} color={isDark ? '#E2E8F0' : '#1E293B'} />
                            <Text style={[styles.menuItemText, theme.menuItemText]}>Email</Text>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.menuItem, theme.menuItem]}
                        onPress={() => setLiveChatModalVisible(true)}
                        activeOpacity={0.7}
                    >
                        <View style={styles.menuItemLeft}>
                            <HugeiconsIcon icon={MessageChat01Icon} size={20} color={isDark ? '#E2E8F0' : '#1E293B'} />
                            <Text style={[styles.menuItemText, theme.menuItemText]}>Live chat</Text>
                        </View>
                    </TouchableOpacity>
                </View>

                {/* Divider Line */}
                <View style={[styles.sectionDivider, theme.sectionDivider]} />

                {/* ── SECTION 3: Feedback ── */}
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, theme.sectionTitle]}>Feedback</Text>

                    <TouchableOpacity
                        style={[styles.menuItem, theme.menuItem]}
                        onPress={() => setFeedbackModalVisible(true)}
                        activeOpacity={0.7}
                    >
                        <View style={styles.menuItemLeft}>
                            <HugeiconsIcon icon={Idea01Icon} size={20} color={isDark ? '#E2E8F0' : '#1E293B'} />
                            <Text style={[styles.menuItemText, theme.menuItemText]}>Submit your feedback</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </ScrollView>

            {/* ─────────────────────────────────────────────────────────────
                FAQ MODAL
            ───────────────────────────────────────────────────────────── */}
            <Modal
                visible={faqModalVisible}
                animationType="slide"
                transparent={false}
                onRequestClose={() => setFaqModalVisible(false)}
            >
                <SafeAreaView style={[styles.safeArea, theme.safeArea]}>
                    <View style={[styles.modalHeader, theme.modalHeader]}>
                        <TouchableOpacity
                            style={[styles.iconBtn, theme.iconBtn]}
                            onPress={() => setFaqModalVisible(false)}
                        >
                            <HugeiconsIcon icon={ArrowLeft01Icon} size={20} color={isDark ? '#FFFFFF' : '#0F172A'} />
                        </TouchableOpacity>
                        <Text style={[styles.modalHeaderTitle, theme.modalHeaderTitle]}>Client FAQ</Text>
                        <View style={{ width: 40 }} />
                    </View>

                    <ScrollView contentContainerStyle={styles.modalScrollContent}>
                        {faqItems.map((item, idx) => {
                            const isExpanded = expandedFaq === idx;
                            return (
                                <TouchableOpacity
                                    key={idx}
                                    style={[styles.faqCard, theme.faqCard]}
                                    onPress={() => setExpandedFaq(isExpanded ? null : idx)}
                                    activeOpacity={0.8}
                                >
                                    <View style={styles.faqQuestionRow}>
                                        <Text style={[styles.faqQuestionText, theme.faqQuestionText]}>{item.q}</Text>
                                        <HugeiconsIcon
                                            icon={isExpanded ? Cancel01Icon : ArrowRight01Icon}
                                            size={16}
                                            color="#3B82F6"
                                        />
                                    </View>
                                    {isExpanded && (
                                        <Text style={[styles.faqAnswerText, theme.faqAnswerText]}>{item.a}</Text>
                                    )}
                                </TouchableOpacity>
                            );
                        })}
                    </ScrollView>
                </SafeAreaView>
            </Modal>

            {/* ─────────────────────────────────────────────────────────────
                GUIDE / HOW TO USE MODAL
            ───────────────────────────────────────────────────────────── */}
            <Modal
                visible={guideModalVisible}
                animationType="slide"
                transparent={false}
                onRequestClose={() => setGuideModalVisible(false)}
            >
                <SafeAreaView style={[styles.safeArea, theme.safeArea]}>
                    <View style={[styles.modalHeader, theme.modalHeader]}>
                        <TouchableOpacity
                            style={[styles.iconBtn, theme.iconBtn]}
                            onPress={() => setGuideModalVisible(false)}
                        >
                            <HugeiconsIcon icon={ArrowLeft01Icon} size={20} color={isDark ? '#FFFFFF' : '#0F172A'} />
                        </TouchableOpacity>
                        <Text style={[styles.modalHeaderTitle, theme.modalHeaderTitle]}>How to use Swasthya</Text>
                        <View style={{ width: 40 }} />
                    </View>

                    <ScrollView contentContainerStyle={styles.modalScrollContent}>
                        {guideSteps.map((guide, idx) => (
                            <View key={idx} style={[styles.guideCard, theme.guideCard]}>
                                <View style={styles.guideStepBadge}>
                                    <Text style={styles.guideStepBadgeText}>{guide.step}</Text>
                                </View>
                                <View style={styles.guideTextCol}>
                                    <Text style={[styles.guideTitle, theme.guideTitle]}>{guide.title}</Text>
                                    <Text style={[styles.guideDesc, theme.guideDesc]}>{guide.desc}</Text>
                                </View>
                            </View>
                        ))}
                    </ScrollView>
                </SafeAreaView>
            </Modal>

            {/* ─────────────────────────────────────────────────────────────
                FEEDBACK MODAL
            ───────────────────────────────────────────────────────────── */}
            <Modal
                visible={feedbackModalVisible}
                animationType="slide"
                transparent={false}
                onRequestClose={() => setFeedbackModalVisible(false)}
            >
                <SafeAreaView style={[styles.safeArea, theme.safeArea]}>
                    <View style={[styles.modalHeader, theme.modalHeader]}>
                        <TouchableOpacity
                            style={[styles.iconBtn, theme.iconBtn]}
                            onPress={() => setFeedbackModalVisible(false)}
                        >
                            <HugeiconsIcon icon={Cancel01Icon} size={20} color={isDark ? '#FFFFFF' : '#0F172A'} />
                        </TouchableOpacity>
                        <Text style={[styles.modalHeaderTitle, theme.modalHeaderTitle]}>Submit Feedback</Text>
                        <View style={{ width: 40 }} />
                    </View>

                    <ScrollView contentContainerStyle={styles.modalScrollContent}>
                        {/* Rating Stars */}
                        <Text style={[styles.fieldLabel, theme.fieldLabel]}>HOW WOULD YOU RATE SWASTHYA?</Text>
                        <View style={styles.starsRow}>
                            {[1, 2, 3, 4, 5].map((star) => (
                                <TouchableOpacity
                                    key={star}
                                    onPress={() => setRating(star)}
                                    activeOpacity={0.7}
                                    style={styles.starBtn}
                                >
                                    <HugeiconsIcon
                                        icon={StarIcon}
                                        size={32}
                                        color={star <= rating ? '#F59E0B' : (isDark ? '#26334D' : '#CBD5E1')}
                                        variant={star <= rating ? 'solid' : 'stroke'}
                                    />
                                </TouchableOpacity>
                            ))}
                        </View>

                        {/* Feedback Category */}
                        <Text style={[styles.fieldLabel, theme.fieldLabel, { marginTop: 24 }]}>CATEGORY</Text>
                        <View style={styles.categoryRow}>
                            {['General', 'Medication', 'Alarms', 'Vitals', 'Bug'].map((cat) => (
                                <TouchableOpacity
                                    key={cat}
                                    onPress={() => setFeedbackCategory(cat)}
                                    style={[
                                        styles.categoryChip,
                                        feedbackCategory === cat ? styles.categoryChipActive : theme.categoryChipInactive,
                                    ]}
                                >
                                    <Text
                                        style={[
                                            styles.categoryChipText,
                                            feedbackCategory === cat ? styles.categoryChipTextActive : theme.categoryChipTextInactive,
                                        ]}
                                    >
                                        {cat}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        {/* Comments Input */}
                        <Text style={[styles.fieldLabel, theme.fieldLabel, { marginTop: 24 }]}>YOUR COMMENTS & SUGGESTIONS</Text>
                        <TextInput
                            style={[styles.feedbackInput, theme.feedbackInput]}
                            placeholder="Tell us what you like or how we can make Swasthya better for you..."
                            placeholderTextColor={isDark ? '#64748B' : '#94A3B8'}
                            multiline
                            numberOfLines={5}
                            textAlignVertical="top"
                            value={feedbackText}
                            onChangeText={setFeedbackText}
                        />

                        {/* Submit Button */}
                        <TouchableOpacity
                            style={[styles.submitBtn, isSubmitting && { opacity: 0.7 }]}
                            onPress={handleSubmitFeedback}
                            disabled={isSubmitting}
                            activeOpacity={0.85}
                        >
                            <Text style={styles.submitBtnText}>
                                {isSubmitting ? 'Submitting...' : 'Send Feedback'}
                            </Text>
                        </TouchableOpacity>
                    </ScrollView>
                </SafeAreaView>
            </Modal>

            {/* ─────────────────────────────────────────────────────────────
                LIVE CHAT MODAL
            ───────────────────────────────────────────────────────────── */}
            <Modal
                visible={liveChatModalVisible}
                animationType="slide"
                transparent={false}
                onRequestClose={() => setLiveChatModalVisible(false)}
            >
                <SafeAreaView style={[styles.safeArea, theme.safeArea]}>
                    <View style={[styles.modalHeader, theme.modalHeader]}>
                        <TouchableOpacity
                            style={[styles.iconBtn, theme.iconBtn]}
                            onPress={() => setLiveChatModalVisible(false)}
                        >
                            <HugeiconsIcon icon={ArrowLeft01Icon} size={20} color={isDark ? '#FFFFFF' : '#0F172A'} />
                        </TouchableOpacity>
                        <View style={{ alignItems: 'center' }}>
                            <Text style={[styles.modalHeaderTitle, theme.modalHeaderTitle]}>Live Support</Text>
                            <View style={styles.chatStatusRow}>
                                <View style={styles.onlineDot} />
                                <Text style={styles.onlineText}>Online • Typically replies in 2 mins</Text>
                            </View>
                        </View>
                        <View style={{ width: 40 }} />
                    </View>

                    <ScrollView
                        contentContainerStyle={styles.chatMessagesContainer}
                        showsVerticalScrollIndicator={false}
                    >
                        {chatMessages.map((msg) => {
                            const isUser = msg.sender === 'user';
                            return (
                                <View
                                    key={msg.id}
                                    style={[
                                        styles.chatBubbleWrapper,
                                        isUser ? styles.chatBubbleUserWrapper : styles.chatBubbleSupportWrapper,
                                    ]}
                                >
                                    <View
                                        style={[
                                            styles.chatBubble,
                                            isUser ? styles.chatBubbleUser : theme.chatBubbleSupport,
                                        ]}
                                    >
                                        <Text style={[styles.chatBubbleText, isUser ? styles.chatBubbleTextUser : theme.chatBubbleTextSupport]}>
                                            {msg.text}
                                        </Text>
                                        <Text style={[styles.chatBubbleTime, isUser ? styles.chatBubbleTimeUser : theme.chatBubbleTimeSupport]}>
                                            {msg.time}
                                        </Text>
                                    </View>
                                </View>
                            );
                        })}
                    </ScrollView>

                    {/* Chat Input Bar */}
                    <View style={[styles.chatInputBar, theme.chatInputBar]}>
                        <TextInput
                            style={[styles.chatTextInput, theme.chatTextInput]}
                            placeholder="Type a message..."
                            placeholderTextColor={isDark ? '#64748B' : '#94A3B8'}
                            value={chatInput}
                            onChangeText={setChatInput}
                            onSubmitEditing={handleSendChatMessage}
                        />
                        <TouchableOpacity
                            style={styles.chatSendBtn}
                            onPress={handleSendChatMessage}
                            activeOpacity={0.8}
                        >
                            <HugeiconsIcon icon={SentIcon} size={18} color="#FFFFFF" />
                        </TouchableOpacity>
                    </View>
                </SafeAreaView>
            </Modal>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
    },
    topBar: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        paddingHorizontal: 20,
        paddingTop: Platform.OS === 'ios' ? 8 : 14,
        paddingBottom: 10,
    },
    closeButton: {
        padding: 6,
        borderRadius: 20,
    },
    container: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: 24,
        paddingTop: 8,
        paddingBottom: 40,
    },
    section: {
        paddingVertical: 14,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '700',
        marginBottom: 16,
    },
    menuItem: {
        paddingVertical: 14,
    },
    menuItemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    menuItemText: {
        fontSize: 16,
        fontWeight: '600',
    },
    sectionDivider: {
        height: 1,
        width: '100%',
        marginVertical: 4,
    },

    // Modal Common Styles
    modalHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 14,
        borderBottomWidth: 1,
    },
    iconBtn: {
        width: 40,
        height: 40,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
    },
    modalHeaderTitle: {
        fontSize: 17,
        fontWeight: '800',
    },
    modalScrollContent: {
        padding: 20,
    },

    // FAQ
    faqCard: {
        borderRadius: 16,
        borderWidth: 1,
        padding: 16,
        marginBottom: 12,
    },
    faqQuestionRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    faqQuestionText: {
        fontSize: 15,
        fontWeight: '700',
        flex: 1,
        marginRight: 10,
    },
    faqAnswerText: {
        fontSize: 13,
        lineHeight: 19,
        marginTop: 10,
    },

    // Guide
    guideCard: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        borderRadius: 18,
        borderWidth: 1,
        padding: 16,
        marginBottom: 14,
        gap: 14,
    },
    guideStepBadge: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#2563EB',
        alignItems: 'center',
        justifyContent: 'center',
    },
    guideStepBadgeText: {
        color: '#FFFFFF',
        fontWeight: '800',
        fontSize: 14,
    },
    guideTextCol: {
        flex: 1,
    },
    guideTitle: {
        fontSize: 15,
        fontWeight: '700',
        marginBottom: 4,
    },
    guideDesc: {
        fontSize: 13,
        lineHeight: 18,
    },

    // Feedback
    fieldLabel: {
        fontSize: 11,
        fontWeight: '800',
        letterSpacing: 0.6,
        marginBottom: 10,
    },
    starsRow: {
        flexDirection: 'row',
        gap: 12,
    },
    starBtn: {
        padding: 4,
    },
    categoryRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    categoryChip: {
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 12,
        borderWidth: 1,
    },
    categoryChipActive: {
        backgroundColor: '#2563EB',
        borderColor: '#2563EB',
    },
    categoryChipText: {
        fontSize: 13,
        fontWeight: '700',
    },
    categoryChipTextActive: {
        color: '#FFFFFF',
    },
    feedbackInput: {
        borderRadius: 16,
        borderWidth: 1,
        padding: 16,
        minHeight: 120,
        fontSize: 14,
    },
    submitBtn: {
        backgroundColor: '#2563EB',
        paddingVertical: 14,
        borderRadius: 16,
        alignItems: 'center',
        marginTop: 24,
    },
    submitBtnText: {
        color: '#FFFFFF',
        fontSize: 15,
        fontWeight: '800',
    },

    // Live Chat
    chatStatusRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginTop: 2,
    },
    onlineDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#10B981',
    },
    onlineText: {
        fontSize: 11,
        color: '#10B981',
        fontWeight: '600',
    },
    chatMessagesContainer: {
        padding: 16,
        gap: 12,
    },
    chatBubbleWrapper: {
        flexDirection: 'row',
        width: '100%',
    },
    chatBubbleUserWrapper: {
        justifyContent: 'flex-end',
    },
    chatBubbleSupportWrapper: {
        justifyContent: 'flex-start',
    },
    chatBubble: {
        maxWidth: '82%',
        padding: 14,
        borderRadius: 18,
    },
    chatBubbleUser: {
        backgroundColor: '#2563EB',
        borderBottomRightRadius: 4,
    },
    chatBubbleText: {
        fontSize: 14,
        lineHeight: 20,
    },
    chatBubbleTextUser: {
        color: '#FFFFFF',
    },
    chatBubbleTime: {
        fontSize: 10,
        marginTop: 4,
        textAlign: 'right',
    },
    chatBubbleTimeUser: {
        color: 'rgba(255, 255, 255, 0.7)',
    },
    chatInputBar: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderTopWidth: 1,
        gap: 10,
    },
    chatTextInput: {
        flex: 1,
        height: 44,
        borderRadius: 22,
        paddingHorizontal: 16,
        borderWidth: 1,
        fontSize: 14,
    },
    chatSendBtn: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#2563EB',
        alignItems: 'center',
        justifyContent: 'center',
    },
});

// ─── Dark Theme Styles ─────────────────────────────────────────────
const darkStyles = StyleSheet.create({
    safeArea: {
        backgroundColor: '#0B0F19',
    },
    topBar: {
        backgroundColor: '#0B0F19',
    },
    closeButton: {
        backgroundColor: '#161E2E',
    },
    sectionTitle: {
        color: '#64748B',
    },
    menuItem: {},
    menuItemText: {
        color: '#F8FAFC',
    },
    sectionDivider: {
        backgroundColor: '#1E293B',
    },
    modalHeader: {
        backgroundColor: '#0B0F19',
        borderBottomColor: '#1E293B',
    },
    iconBtn: {
        backgroundColor: '#161E2E',
        borderColor: '#26334D',
    },
    modalHeaderTitle: {
        color: '#F8FAFC',
    },
    faqCard: {
        backgroundColor: '#131B2A',
        borderColor: '#1E293B',
    },
    faqQuestionText: {
        color: '#F8FAFC',
    },
    faqAnswerText: {
        color: '#94A3B8',
    },
    guideCard: {
        backgroundColor: '#131B2A',
        borderColor: '#1E293B',
    },
    guideTitle: {
        color: '#F8FAFC',
    },
    guideDesc: {
        color: '#94A3B8',
    },
    fieldLabel: {
        color: '#94A3B8',
    },
    categoryChipInactive: {
        backgroundColor: '#131B2A',
        borderColor: '#1E293B',
    },
    categoryChipTextInactive: {
        color: '#94A3B8',
    },
    feedbackInput: {
        backgroundColor: '#131B2A',
        borderColor: '#1E293B',
        color: '#F8FAFC',
    },
    chatBubbleSupport: {
        backgroundColor: '#131B2A',
        borderColor: '#1E293B',
        borderWidth: 1,
        borderBottomLeftRadius: 4,
    },
    chatBubbleTextSupport: {
        color: '#F8FAFC',
    },
    chatBubbleTimeSupport: {
        color: '#64748B',
    },
    chatInputBar: {
        backgroundColor: '#0B0F19',
        borderTopColor: '#1E293B',
    },
    chatTextInput: {
        backgroundColor: '#131B2A',
        borderColor: '#1E293B',
        color: '#F8FAFC',
    },
});

// ─── Light Theme Styles ────────────────────────────────────────────
const lightStyles = StyleSheet.create({
    safeArea: {
        backgroundColor: '#FFFFFF',
    },
    topBar: {
        backgroundColor: '#FFFFFF',
    },
    closeButton: {
        backgroundColor: '#F8FAFC',
    },
    sectionTitle: {
        color: '#64748B',
    },
    menuItem: {},
    menuItemText: {
        color: '#0F172A',
    },
    sectionDivider: {
        backgroundColor: '#F1F5F9',
    },
    modalHeader: {
        backgroundColor: '#FFFFFF',
        borderBottomColor: '#E2E8F0',
    },
    iconBtn: {
        backgroundColor: '#F8FAFC',
        borderColor: '#E2E8F0',
    },
    modalHeaderTitle: {
        color: '#0F172A',
    },
    faqCard: {
        backgroundColor: '#FFFFFF',
        borderColor: '#E2E8F0',
    },
    faqQuestionText: {
        color: '#0F172A',
    },
    faqAnswerText: {
        color: '#64748B',
    },
    guideCard: {
        backgroundColor: '#FFFFFF',
        borderColor: '#E2E8F0',
    },
    guideTitle: {
        color: '#0F172A',
    },
    guideDesc: {
        color: '#64748B',
    },
    fieldLabel: {
        color: '#64748B',
    },
    categoryChipInactive: {
        backgroundColor: '#F8FAFC',
        borderColor: '#E2E8F0',
    },
    categoryChipTextInactive: {
        color: '#64748B',
    },
    feedbackInput: {
        backgroundColor: '#F8FAFC',
        borderColor: '#E2E8F0',
        color: '#0F172A',
    },
    chatBubbleSupport: {
        backgroundColor: '#F8FAFC',
        borderColor: '#E2E8F0',
        borderWidth: 1,
        borderBottomLeftRadius: 4,
    },
    chatBubbleTextSupport: {
        color: '#0F172A',
    },
    chatBubbleTimeSupport: {
        color: '#94A3B8',
    },
    chatInputBar: {
        backgroundColor: '#FFFFFF',
        borderTopColor: '#E2E8F0',
    },
    chatTextInput: {
        backgroundColor: '#F8FAFC',
        borderColor: '#E2E8F0',
        color: '#0F172A',
    },
});

export default HelpSupportScreen;
