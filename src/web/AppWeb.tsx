import React, { useState, useEffect } from 'react';
import { onAuthStateChanged, signOut, User as FirebaseUser } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';
import { auth, firestore } from '../config/firebaseConfig';
import { Sidebar, WebTab } from './components/Sidebar';
import { Header } from './components/Header';
import { DashboardPage } from './pages/DashboardPage';
import { MarketplacePage } from './pages/MarketplacePage';
import { DirectoryPage } from './pages/DirectoryPage';
import { MessagesPage } from './pages/MessagesPage';
import { ProfilePage } from './pages/ProfilePage';
import { AuthPage } from './pages/AuthPage';
import './styles/web.css';

export const AppWeb: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [userData, setUserData] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState(true);

  const [currentTab, setCurrentTab] = useState<WebTab>('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateListingOpen, setIsCreateListingOpen] = useState(false);
  const [activeChatTarget, setActiveChatTarget] = useState<{ userId: string; userName: string; userAvatar?: string } | null>(null);

  // Real-time Firebase Authentication listener
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);
      }
      setAuthLoading(false);
    });
    return () => unsubscribeAuth();
  }, []);

  // Real-time Firestore user profile sync
  useEffect(() => {
    if (currentUser?.uid) {
      const userDocRef = doc(firestore, 'users', currentUser.uid);
      const unsubscribeDoc = onSnapshot(
        userDocRef,
        (docSnap) => {
          if (docSnap.exists()) {
            setUserData(docSnap.data());
          }
        },
        (err) => {
          console.warn('Profile sync notice:', err);
        }
      );
      return () => unsubscribeDoc();
    }
  }, [currentUser?.uid]);

  const handleSelectRealUser = (realUser: any) => {
    setCurrentUser(realUser);
    setUserData(realUser);
  };

  const handleInitiateChat = (userId: string, userName: string, userAvatar?: string) => {
    setActiveChatTarget({ userId, userName, userAvatar });
    setCurrentTab('messages');
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (err: any) {
      console.warn('Logout notice:', err);
    }
    setCurrentUser(null);
    setUserData(null);
  };

  const getPageTitle = (tab: WebTab) => {
    switch (tab) {
      case 'dashboard':
        return { title: 'Campus Community', subtitle: 'Live student feed, university announcements, and campus updates' };
      case 'marketplace':
        return { title: 'Campus Marketplace', subtitle: 'Buy, sell, and trade textbooks, dorm items, and electronics' };
      case 'directory':
        return { title: 'Student & Faculty Directory', subtitle: 'Find peers by major, connect with advisors, and grow your network' };
      case 'messages':
        return { title: 'Campus Messaging', subtitle: 'Real-time messages with students, sellers, and study partners' };
      case 'profile':
        return { title: 'Academic Profile', subtitle: 'Manage your student details, enrollment, and verification status' };
    }
  };

  if (authLoading) {
    return (
      <div style={{
        height: '100vh',
        width: '100vw',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#0f172a',
        color: '#ffffff',
        fontFamily: 'inherit',
        fontSize: '16px',
        fontWeight: 600,
        gap: '12px',
      }}>
        <div style={{ fontSize: '24px' }}>🎓</div>
        <div>Loading College Hub...</div>
      </div>
    );
  }

  // If not logged in, render real Auth Page
  if (!currentUser) {
    return <AuthPage onSelectRealUser={handleSelectRealUser} />;
  }

  const { title, subtitle } = getPageTitle(currentTab);

  return (
    <div className="app-container">
      {/* Desktop Sidebar */}
      <Sidebar
        currentTab={currentTab}
        onSelectTab={(tab) => {
          setCurrentTab(tab);
          setSearchQuery('');
        }}
        user={currentUser}
        userData={userData}
        onLogout={handleLogout}
        onSwitchUser={handleSelectRealUser}
      />

      {/* Main Content Area */}
      <div className="main-content">
        <Header
          title={title}
          subtitle={subtitle}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onNewListing={currentTab === 'marketplace' ? () => setIsCreateListingOpen(true) : undefined}
        />

        <main className="page-body">
          {currentTab === 'dashboard' && (
            <DashboardPage
              searchQuery={searchQuery}
              user={currentUser}
              userData={userData}
            />
          )}

          {currentTab === 'marketplace' && (
            <MarketplacePage
              searchQuery={searchQuery}
              isCreateModalOpen={isCreateListingOpen}
              onCloseCreateModal={() => setIsCreateListingOpen(false)}
              user={currentUser}
              userData={userData}
              onInitiateChat={handleInitiateChat}
            />
          )}

          {currentTab === 'directory' && (
            <DirectoryPage
              searchQuery={searchQuery}
              currentUser={currentUser}
              onInitiateChat={handleInitiateChat}
            />
          )}

          {currentTab === 'messages' && (
            <MessagesPage
              searchQuery={searchQuery}
              user={currentUser}
              userData={userData}
              activeChatTarget={activeChatTarget}
              onSwitchUser={handleSelectRealUser}
            />
          )}

          {currentTab === 'profile' && (
            <ProfilePage
              user={currentUser}
              userData={userData}
            />
          )}
        </main>
      </div>
    </div>
  );
};

export default AppWeb;
