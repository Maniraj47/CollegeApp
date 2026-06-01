import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';

// ─── Screen imports (create these files in src/screens/) ───────────────────
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import HomeScreen from '../screens/HomeScreen';
import MarketplaceScreen from '../screens/MarketplaceScreen';
import ChatScreen from '../screens/ChatScreen';
import ProfileScreen from '../screens/ProfileScreen';

// ─── Hook (create this in src/hooks/useAuth.ts) ────────────────────────────
import { useAuth } from '../hooks/useAuth';

// ─── Route name constants ──────────────────────────────────────────────────
export const ROUTES = {
  // Auth
  LOGIN: 'Login',
  REGISTER: 'Register',

  // Main tabs
  HOME: 'Home',
  MARKETPLACE: 'Marketplace',
  CHAT: 'Chat',
  PROFILE: 'Profile',
} as const;

// ─── TypeScript route param types ─────────────────────────────────────────
export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Marketplace: undefined;
  Chat: undefined;
  Profile: undefined;
};

// ─── Stack + Tab navigator instances ──────────────────────────────────────
const AuthStack = createStackNavigator<AuthStackParamList>();
const MainTab = createBottomTabNavigator<MainTabParamList>();

// ─── Tab bar icon (uses text icon — swap with react-native-vector-icons) ──
const TabIcon = ({
  label,
  focused,
}: {
  label: string;
  focused: boolean;
}) => {
  const icons: Record<string, string> = {
    Home: '🏠',
    Marketplace: '🛍️',
    Chat: '💬',
    Profile: '👤',
  };
  return (
    <Text style={{ fontSize: 20, opacity: focused ? 1 : 0.4 }}>
      {icons[label] ?? '•'}
    </Text>
  );
};

// ─── Bottom tab navigator (shown when logged in) ───────────────────────────
const MainTabNavigator = () => (
  <MainTab.Navigator
    screenOptions={({ route }) => ({
      headerShown: false,
      tabBarShowLabel: true,
      tabBarLabelStyle: styles.tabLabel,
      tabBarStyle: styles.tabBar,
      tabBarActiveTintColor: '#6C47FF',
      tabBarInactiveTintColor: '#9E9E9E',
      tabBarIcon: ({ focused }) => (
        <TabIcon label={route.name} focused={focused} />
      ),
    })}
  >
    <MainTab.Screen name={ROUTES.HOME} component={HomeScreen} />
    <MainTab.Screen name={ROUTES.MARKETPLACE} component={MarketplaceScreen} />
    <MainTab.Screen name={ROUTES.CHAT} component={ChatScreen} />
    <MainTab.Screen name={ROUTES.PROFILE} component={ProfileScreen} />
  </MainTab.Navigator>
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
    <ActivityIndicator size="large" color="#6C47FF" />
    <Text style={styles.loadingText}>CollegeApp</Text>
  </View>
);

// ─── Root navigator — switches between Auth and Main based on login state ──
const AppNavigator = () => {
  const { user, loading } = useAuth();

  if (loading) return <LoadingScreen />;

  return (
    <NavigationContainer>
      {user ? <MainTabNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
};

// ─── Styles ────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 0.5,
    borderTopColor: '#E0E0E0',
    height: 64,
    paddingBottom: 8,
    paddingTop: 6,
    elevation: 0,
    shadowOpacity: 0,
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '500',
    marginTop: 2,
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
    color: '#6C47FF',
    letterSpacing: -0.5,
  },
});

export default AppNavigator;
