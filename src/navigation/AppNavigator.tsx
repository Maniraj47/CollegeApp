import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator, BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, LayoutAnimation, Platform, UIManager } from 'react-native';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

// ─── Screen imports (create these files in src/screens/) ───────────────────
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import HomeScreen from '../screens/HomeScreen';
import MarketplaceScreen from '../screens/MarketplaceScreen';
import ChatScreen from '../screens/ChatScreen';
import ProfileScreen from '../screens/ProfileScreen';
import DirectoryScreen from '../screens/DirectoryScreen';
import SettingsScreen from '../screens/SettingsScreen';
import ProductDetailScreen from '../screens/ProductDetailScreen';
import ChatDetailScreen from '../screens/ChatDetailScreen';
import CreatePostScreen from '../screens/CreatePostScreen';

// ─── Hook (create this in src/hooks/useAuth.ts) ────────────────────────────
import { useAuth } from '../hooks/useAuth';

// ─── Route name constants ──────────────────────────────────────────────────
export const ROUTES = {
  // Auth
  LOGIN: 'Login',
  REGISTER: 'Register',

  // Main tabs
  HOME: 'Home',
  DIRECTORY: 'Directory',
  MARKETPLACE: 'Marketplace',
  CHAT: 'Chat',
  SETTINGS: 'Settings',
  
  // Main stack
  MAIN_TABS: 'MainTabs',
  PROFILE: 'Profile',
  PRODUCT_DETAIL: 'ProductDetail',
  CHAT_DETAIL: 'ChatDetail',
  CREATE_POST: 'CreatePost',
} as const;

// ─── TypeScript route param types ─────────────────────────────────────────
export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Directory: undefined;
  Marketplace: undefined;
  Chat: undefined;
  Settings: undefined;
};

export type MainStackParamList = {
  MainTabs: undefined;
  Profile: undefined;
  ProductDetail: { product: any };
  ChatDetail: { chat: any };
  CreatePost: undefined;
};

// ─── Stack + Tab navigator instances ──────────────────────────────────────
const AuthStack = createStackNavigator<AuthStackParamList>();
const MainStack = createStackNavigator<MainStackParamList>();
const MainTab = createBottomTabNavigator<MainTabParamList>();

// ─── Custom Tab Bar ────────────────────────────────────────────────────────
const CustomTabBar = ({ state, descriptors, navigation }: BottomTabBarProps) => {
  return (
    <View style={styles.tabBar}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === index;

        const onPress = () => {
          LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        const icons: Record<string, string> = {
          Home: '🏠',
          Directory: '👥',
          Marketplace: '🛍️',
          Chat: '💬',
          Settings: '⚙️',
        };

        return (
          <TouchableOpacity
            key={route.key}
            onPress={onPress}
            activeOpacity={0.8}
            style={{
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: isFocused ? '#111111' : 'transparent',
              padding: isFocused ? 6 : 0,
              paddingRight: isFocused ? 16 : 0,
              borderRadius: 30,
            }}>
              <View style={{
                backgroundColor: isFocused ? '#0052FF' : '#F5F5F5',
                width: 44,
                height: 44,
                borderRadius: 22,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
                <Text style={{ fontSize: 20, opacity: isFocused ? 1 : 0.6 }}>
                  {icons[route.name] ?? '•'}
                </Text>
              </View>
              {isFocused && (
                <Text
                  numberOfLines={1}
                  style={{
                    marginLeft: 8,
                    color: '#FFFFFF',
                    fontWeight: '600',
                    fontSize: 14,
                  }}
                >
                  {route.name}
                </Text>
              )}
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

// ─── Bottom tab navigator (shown when logged in) ───────────────────────────
const MainTabNavigator = () => (
  <MainTab.Navigator
    tabBar={(props) => <CustomTabBar {...props} />}
    screenOptions={{
      headerShown: false,
    }}
  >
    <MainTab.Screen name={ROUTES.HOME} component={HomeScreen} />
    <MainTab.Screen name={ROUTES.DIRECTORY} component={DirectoryScreen} />
    <MainTab.Screen name={ROUTES.MARKETPLACE} component={MarketplaceScreen} />
    <MainTab.Screen name={ROUTES.CHAT} component={ChatScreen} />
    <MainTab.Screen name={ROUTES.SETTINGS} component={SettingsScreen} />
  </MainTab.Navigator>
);

// ─── Main Stack Navigator (wraps tabs and detail screens) ──────────────────
const MainStackNavigator = () => (
  <MainStack.Navigator screenOptions={{ headerShown: false }}>
    <MainStack.Screen name={ROUTES.MAIN_TABS as any} component={MainTabNavigator} />
    <MainStack.Screen name={ROUTES.PROFILE as any} component={ProfileScreen} />
    <MainStack.Screen name={ROUTES.PRODUCT_DETAIL as any} component={ProductDetailScreen} />
    <MainStack.Screen name={ROUTES.CHAT_DETAIL as any} component={ChatDetailScreen} />
    <MainStack.Screen name={ROUTES.CREATE_POST as any} component={CreatePostScreen} />
  </MainStack.Navigator>
);

// ─── Auth stack navigator (shown when logged out) ─────────────────────────
const AuthNavigator = () => (
  <AuthStack.Navigator
    screenOptions={{
      headerShown: false,
      cardStyleInterpolator: ({ current, layouts }) => ({
        cardStyle: {
          opacity: current.progress,
          transform: [
            {
              translateY: current.progress.interpolate({
                inputRange: [0, 1],
                outputRange: [layouts.screen.height * 0.05, 0],
              }),
            },
          ],
        },
      }),
    }}
  >
    <AuthStack.Screen name={ROUTES.LOGIN} component={LoginScreen} />
    <AuthStack.Screen name={ROUTES.REGISTER} component={RegisterScreen} />
  </AuthStack.Navigator>
);

// ─── Loading splash ────────────────────────────────────────────────────────
const LoadingScreen = () => (
  <View style={styles.loadingContainer}>
    <ActivityIndicator size="large" color="#0052FF" />
    <Text style={styles.loadingText}>College Hub</Text>
  </View>
);

// ─── Root navigator — switches between Auth and Main based on login state ──
const AppNavigator = () => {
  const { user, loading } = useAuth();

  if (loading) return <LoadingScreen />;

  return (
    <NavigationContainer>
      {user ? <MainStackNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
};

// ─── Styles ────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    bottom: 30,
    left: 20,
    right: 20,
    height: 70,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 35,
    paddingHorizontal: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FAFAFA',
    gap: 16,
  },
  loadingText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0052FF',
    letterSpacing: -0.5,
  },
});

export default AppNavigator;
