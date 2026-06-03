import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const C = {
  background: '#f7f9fb',
  surfaceLowest: '#ffffff',
  surfaceContainer: '#eceef0',
  surfaceHigh: '#e6e8ea',
  surfaceVariant: '#e0e3e5',
  primary: '#003ec7',
  primaryContainer: '#0052ff',
  onPrimaryContainer: '#dfe3ff',
  onSurface: '#191c1e',
  onSurfaceVariant: '#434656',
  outline: '#737688',
  outlineVariant: '#c3c5d9',
  secondaryContainer: '#fe6b00',
  tertiary: '#005471',
};

const TRANSACTIONS = [
  { id: '1', title: 'Organic Chemistry 8th Ed.', subtitle: 'Seller: @alex_j', amount: '-₹7,000.00', type: 'escrow', icon: '📖' },
  { id: '2', title: 'UPI Deposit', subtitle: 'Today, 10:42 AM', amount: '+₹5,000.00', type: 'deposit', icon: '↙️' },
  { id: '3', title: 'Sold: Dorm Mini Fridge', subtitle: 'Yesterday, 4:15 PM', amount: '+₹10,000.00', type: 'sold', icon: '🛍️' },
];

const WalletScreen = () => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.iconBtn}><Text style={styles.iconTxt}>🔍</Text></TouchableOpacity>
        <Text style={styles.headerTitle}>College Hub</Text>
        <TouchableOpacity style={styles.profileBtn}>
          <Image source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDdcLhO9U7gGW4gpHtZ9W3w_U8s6P2giz6pZqWVL3a26RGtvZrashao3At0Zz5hZ8eC9wNBMf5FSR_F7xb0can8OBcQBBGtJvdPsZJF7fv56oD6yed-dr3M6oqjcoGI1DnCev2hDxxGMA8LUCRK_QkyZHuOZ9gQQ-UdmndUh4I4LYQdVppk549_9GDnyw9Um5GsO6l6Q8gjZhz4R_VhKYA6GUaXfjDCtHunX7x5jARudaz61mnrOEzkFDQmadwprD7Z0jmqUU1T_P4' }} style={styles.profileAvatar} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.topSection}>
          <Text style={styles.screenTitle}>Wallet</Text>
          <TouchableOpacity style={styles.settingsBtn}><Text style={styles.settingsIcon}>⚙️</Text></TouchableOpacity>
        </View>

        <View style={styles.cardsRow}>
          {/* Available Balance */}
          <View style={styles.balanceCard}>
            <View>
              <View style={styles.balanceHeader}>
                <Text style={styles.walletIcon}>💳</Text>
                <Text style={styles.balanceLabel}>Available Balance</Text>
              </View>
              <View style={styles.amountRow}>
                <Text style={styles.amountWhole}>₹37,350</Text>
                <Text style={styles.amountDecimal}>.00</Text>
              </View>
            </View>
            <View style={styles.balanceActions}>
              <TouchableOpacity style={styles.withdrawBtn}>
                <Text style={styles.withdrawIcon}>⬆️</Text>
                <Text style={styles.withdrawText}>Withdraw</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.historyBtn}>
                <Text style={styles.historyIcon}>🕒</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Locked Escrow */}
          <View style={styles.escrowCard}>
            <View>
              <View style={styles.escrowHeader}>
                <View style={styles.escrowHeaderLeft}>
                  <Text style={styles.lockIcon}>🔒</Text>
                  <Text style={styles.escrowLabel}>Locked in Escrow</Text>
                </View>
                <View style={styles.activePill}><Text style={styles.activePillText}>2 Active</Text></View>
              </View>
              <View style={styles.amountRow}>
                <Text style={styles.escrowAmountWhole}>₹10,000</Text>
                <Text style={styles.escrowAmountDecimal}>.00</Text>
              </View>
            </View>
            
            <View style={styles.progressBarSection}>
              <View style={styles.progressLabels}>
                <Text style={styles.progressLabel}>Awaiting Met/Ship</Text>
                <Text style={styles.progressLabel}>Releasing Soon</Text>
              </View>
              <View style={styles.progressTrack}>
                <View style={[styles.progressFill, { width: '65%' }]} />
              </View>
            </View>
          </View>
        </View>

        {/* Quick Deposit */}
        <View style={styles.quickDepositCard}>
          <Text style={styles.sectionTitle}>Quick Deposit</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.presetScroll}>
            <TouchableOpacity style={styles.presetChip}><Text style={styles.presetText}>+₹500</Text></TouchableOpacity>
            <TouchableOpacity style={[styles.presetChip, styles.presetChipActive]}><Text style={[styles.presetText, styles.presetTextActive]}>+₹1,000</Text></TouchableOpacity>
            <TouchableOpacity style={styles.presetChip}><Text style={styles.presetText}>+₹2,500</Text></TouchableOpacity>
            <TouchableOpacity style={styles.presetChip}><Text style={styles.presetText}>+₹5,000</Text></TouchableOpacity>
          </ScrollView>
          <View style={styles.depositActionRow}>
            <View style={styles.depositInputContainer}>
              <Text style={styles.currencySymbol}>₹</Text>
              <TextInput style={styles.depositInput} value="1000" keyboardType="numeric" />
            </View>
            <TouchableOpacity style={styles.payBtn}>
              <Text style={styles.payIcon}>🏦</Text>
              <Text style={styles.payBtnText}>Pay with UPI</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Recent Activity */}
        <View style={styles.activitySection}>
          <View style={styles.activityHeader}>
            <Text style={styles.sectionTitle}>Recent Activity</Text>
            <TouchableOpacity><Text style={styles.viewAllText}>View All</Text></TouchableOpacity>
          </View>

          <View style={styles.activityList}>
            {TRANSACTIONS.map((tx, idx) => (
              <TouchableOpacity key={tx.id} style={styles.txCard}>
                {tx.type === 'escrow' && <View style={styles.txAccentBar} />}
                
                <View style={styles.txHeader}>
                  <View style={styles.txLeft}>
                    <View style={[styles.txIconBox, tx.type === 'deposit' && styles.txIconBoxDeposit, tx.type === 'sold' && styles.txIconBoxSold]}>
                      <Text style={styles.txIcon}>{tx.icon}</Text>
                    </View>
                    <View>
                      <Text style={styles.txTitle}>{tx.title}</Text>
                      <View style={styles.txSubtitleRow}>
                        <Text style={styles.txSubtitle}>{tx.subtitle}</Text>
                        {tx.type === 'escrow' && <View style={styles.verifiedDot}><Text style={styles.verifiedDotText}>✓</Text></View>}
                      </View>
                    </View>
                  </View>
                  <View style={styles.txRight}>
                    <Text style={[styles.txAmount, tx.type === 'deposit' && styles.txAmountDeposit, tx.type === 'sold' && styles.txAmountSold]}>{tx.amount}</Text>
                    {tx.type === 'escrow' ? (
                      <View style={styles.statusPillEscrow}><Text style={styles.statusPillTextEscrow}>Escrow</Text></View>
                    ) : tx.type === 'sold' ? (
                      <View style={styles.statusPillSold}><Text style={styles.statusPillTextSold}>✓ Released</Text></View>
                    ) : (
                      <Text style={styles.statusTextNormal}>Completed</Text>
                    )}
                  </View>
                </View>

                {tx.type === 'escrow' && (
                  <View style={styles.escrowTimeline}>
                    <View style={styles.timelineTrack} />
                    <View style={[styles.timelineProgress, { width: '50%' }]} />
                    <View style={styles.timelineNodes}>
                      <View style={styles.nodePaid}><Text style={styles.nodeIconPaid}>✓</Text></View>
                      <View style={styles.nodeActive}><Text style={styles.nodeIconActive}>📦</Text></View>
                      <View style={styles.nodePending}><Text style={styles.nodeIconPending}>🔓</Text></View>
                    </View>
                    <View style={styles.timelineLabels}>
                      <Text style={styles.timelineLabel}>Paid</Text>
                      <Text style={[styles.timelineLabel, styles.timelineLabelActive]}>Shipped</Text>
                      <Text style={styles.timelineLabel}>Released</Text>
                    </View>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: C.background },
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    paddingHorizontal: 16, 
    height: 52, 
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderBottomWidth: 0.5,
    borderBottomColor: '#e5e7eb'
  },
  headerTitle: { fontSize: 20, fontWeight: '800', color: C.primaryContainer, letterSpacing: -0.5 },
  profileBtn: { width: 32, height: 32 },
  profileAvatar: { width: 32, height: 32, borderRadius: 16, borderWidth: 1.5, borderColor: C.primaryContainer },
  iconBtn: { width: 32, height: 32, justifyContent: 'center', alignItems: 'center' },
  iconTxt: { fontSize: 18 },
  
  content: { padding: 16 },
  topSection: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  screenTitle: { fontSize: 28, fontWeight: '800', color: C.onSurface },
  settingsBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: C.surfaceContainer, justifyContent: 'center', alignItems: 'center' },
  settingsIcon: { fontSize: 18 },
  
  cardsRow: { gap: 16, marginBottom: 24 },
  
  balanceCard: { backgroundColor: C.primaryContainer, borderRadius: 24, padding: 24, minHeight: 180, justifyContent: 'space-between' },
  balanceHeader: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  walletIcon: { fontSize: 16 },
  balanceLabel: { fontSize: 14, color: 'rgba(255,255,255,0.8)', fontWeight: '600' },
  amountRow: { flexDirection: 'row', alignItems: 'baseline', marginTop: 4 },
  amountWhole: { fontSize: 36, fontWeight: '800', color: 'white', letterSpacing: -1 },
  amountDecimal: { fontSize: 24, color: 'rgba(255,255,255,0.7)', fontWeight: '700' },
  
  balanceActions: { flexDirection: 'row', gap: 12, marginTop: 24 },
  withdrawBtn: { flex: 1, backgroundColor: C.surfaceLowest, borderRadius: 24, paddingVertical: 12, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 6 },
  withdrawIcon: { fontSize: 16 },
  withdrawText: { fontSize: 14, fontWeight: '700', color: C.primary },
  historyBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center' },
  historyIcon: { fontSize: 18 },
  
  escrowCard: { backgroundColor: C.surfaceLowest, borderRadius: 24, padding: 24, minHeight: 180, justifyContent: 'space-between', borderWidth: 1, borderColor: 'rgba(195,197,217,0.3)' },
  escrowHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  escrowHeaderLeft: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  lockIcon: { fontSize: 16 },
  escrowLabel: { fontSize: 14, color: C.onSurfaceVariant, fontWeight: '600' },
  activePill: { backgroundColor: C.surfaceContainer, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  activePillText: { fontSize: 11, color: C.onSurfaceVariant, fontWeight: '700' },
  escrowAmountWhole: { fontSize: 32, fontWeight: '800', color: C.onSurface, letterSpacing: -1 },
  escrowAmountDecimal: { fontSize: 20, color: C.outline, fontWeight: '700' },
  
  progressBarSection: { marginTop: 20 },
  progressLabels: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  progressLabel: { fontSize: 11, color: C.onSurfaceVariant, fontWeight: '700' },
  progressTrack: { height: 12, backgroundColor: C.surfaceVariant, borderRadius: 6, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: C.secondaryContainer, borderRadius: 6 },
  
  quickDepositCard: { backgroundColor: C.surfaceContainer, borderRadius: 24, padding: 20, marginBottom: 24, borderWidth: 1, borderColor: 'rgba(195,197,217,0.2)' },
  sectionTitle: { fontSize: 20, fontWeight: '700', color: C.onSurface, marginBottom: 16 },
  presetScroll: { flexDirection: 'row', marginBottom: 16 },
  presetChip: { backgroundColor: C.surfaceLowest, borderWidth: 1, borderColor: 'rgba(195,197,217,0.5)', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 20, marginRight: 8 },
  presetChipActive: { backgroundColor: 'rgba(0,62,199,0.1)', borderColor: C.primary },
  presetText: { fontSize: 14, fontWeight: '600', color: C.onSurface },
  presetTextActive: { color: C.primary },
  
  depositActionRow: { flexDirection: 'row', gap: 12 },
  depositInputContainer: { flex: 1, backgroundColor: C.surfaceLowest, borderRadius: 12, borderWidth: 1, borderColor: 'rgba(195,197,217,0.5)', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16 },
  currencySymbol: { fontSize: 20, color: C.onSurfaceVariant, fontWeight: '600', marginRight: 8 },
  depositInput: { flex: 1, height: 52, fontSize: 20, fontWeight: '600', color: C.onSurface },
  payBtn: { backgroundColor: C.onSurface, borderRadius: 12, paddingHorizontal: 20, flexDirection: 'row', alignItems: 'center', gap: 8 },
  payIcon: { fontSize: 18 },
  payBtnText: { color: C.surfaceLowest, fontSize: 14, fontWeight: '600' },
  
  activitySection: { paddingTop: 8 },
  activityHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  viewAllText: { fontSize: 14, fontWeight: '600', color: C.primary },
  activityList: { gap: 12 },
  
  txCard: { backgroundColor: C.surfaceLowest, borderRadius: 12, padding: 16, borderWidth: 1, borderColor: 'rgba(195,197,217,0.2)', overflow: 'hidden' },
  txAccentBar: { position: 'absolute', left: 0, top: 0, bottom: 0, width: 4, backgroundColor: C.secondaryContainer },
  txHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  txLeft: { flexDirection: 'row', gap: 12, flex: 1 },
  txIconBox: { width: 40, height: 40, borderRadius: 8, backgroundColor: C.surfaceContainer, justifyContent: 'center', alignItems: 'center' },
  txIconBoxDeposit: { backgroundColor: 'rgba(0,84,113,0.2)' },
  txIconBoxSold: { backgroundColor: 'rgba(0,62,199,0.1)' },
  txIcon: { fontSize: 18 },
  txTitle: { fontSize: 14, fontWeight: '600', color: C.onSurface, marginBottom: 2 },
  txSubtitleRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  txSubtitle: { fontSize: 12, color: C.onSurfaceVariant },
  verifiedDot: { width: 12, height: 12, borderRadius: 6, backgroundColor: C.primary, justifyContent: 'center', alignItems: 'center' },
  verifiedDotText: { color: 'white', fontSize: 8, fontWeight: 'bold' },
  
  txRight: { alignItems: 'flex-end' },
  txAmount: { fontSize: 18, fontWeight: '700', color: C.onSurface },
  txAmountDeposit: { color: C.tertiary },
  txAmountSold: { color: C.primary },
  
  statusPillEscrow: { backgroundColor: 'rgba(254,107,0,0.1)', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6, marginTop: 4 },
  statusPillTextEscrow: { fontSize: 10, color: C.secondaryContainer, fontWeight: '700' },
  statusPillSold: { backgroundColor: 'rgba(0,62,199,0.1)', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6, marginTop: 4 },
  statusPillTextSold: { fontSize: 10, color: C.primary, fontWeight: '700' },
  statusTextNormal: { fontSize: 11, color: C.outline, marginTop: 4 },
  
  escrowTimeline: { marginTop: 24, paddingHorizontal: 8, marginBottom: 8 },
  timelineTrack: { position: 'absolute', top: 14, left: 24, right: 24, height: 4, backgroundColor: C.surfaceVariant, borderRadius: 2 },
  timelineProgress: { position: 'absolute', top: 14, left: 24, height: 4, backgroundColor: C.secondaryContainer, borderRadius: 2 },
  timelineNodes: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', zIndex: 10 },
  
  nodePaid: { width: 28, height: 28, borderRadius: 14, backgroundColor: C.surfaceLowest, borderWidth: 2, borderColor: C.secondaryContainer, justifyContent: 'center', alignItems: 'center' },
  nodeIconPaid: { color: C.secondaryContainer, fontSize: 14, fontWeight: 'bold' },
  nodeActive: { width: 32, height: 32, borderRadius: 16, backgroundColor: C.secondaryContainer, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: 'rgba(254,107,0,0.2)' },
  nodeIconActive: { color: 'white', fontSize: 16 },
  nodePending: { width: 28, height: 28, borderRadius: 14, backgroundColor: C.surfaceHigh, borderWidth: 2, borderColor: C.surfaceVariant, justifyContent: 'center', alignItems: 'center' },
  nodeIconPending: { color: C.outline, fontSize: 14 },
  
  timelineLabels: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 },
  timelineLabel: { fontSize: 11, color: C.onSurfaceVariant, width: 60, textAlign: 'center' },
  timelineLabelActive: { color: C.secondaryContainer, fontWeight: '700' },
});

export default WalletScreen;
