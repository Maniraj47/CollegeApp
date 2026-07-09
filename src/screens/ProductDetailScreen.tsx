import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, SafeAreaView, Dimensions, Share, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

const C = {
  background: '#f7f9fb',
  surfaceLowest: '#ffffff',
  surfaceContainer: '#eceef0',
  surfaceHighest: '#e0e3e5',
  primary: '#0052ff',
  primaryContainer: '#e6eeff',
  onPrimary: '#ffffff',
  onSurface: '#191c1e',
  onSurfaceVariant: '#434656',
  outline: '#737688',
  outlineVariant: '#c3c5d9',
};

const ProductDetailScreen = ({ route }: any) => {
  const navigation = useNavigation<any>();
  const [isLiked, setIsLiked] = useState(false);
  
  // We use mock data matching the screenshot if route params are not passed
  const product = route.params?.product || {
    title: 'Organic Chemistry, 9th Edition',
    price: '$85.00',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBSGxEiKr77u8j5cd1a0SZIMTTnGx4dSyEdoJLl3Yz6-AJ_dYqknEtolmz9sYGWvv403uG7BWusDdTr8CLJbrHpYdOY8UOSHZO70tcYEcPDq-OCemTmpEAFTPRr2wGw3yW5jVEGCyWObUmOV45aSSWEpoX-NNJwuCIpVGP0GQWP_TR88944rtXEGswd56X6Mq8zseejyX1KCT5GvO9307AbUs0MLCSd-CCX3hMtA21cLx4EuSQnrKWPpYb_kKUwJhLzU6Coy4RMQy8',
    seller: 'Sarah Jenkins',
    sellerAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCiWVeICCwzhVRvqUvRMxcd3esXf78wbiTj9CcMN93Modfhnjnwf7uuQunZibeXNilGftgwSDSV5oUak26FYrJZKL4pKCQklkVXKVAGal_ZCW_VQe7FyIP4WVL6_BaCLdJq-ADbpuMbHiLUvam0n7dKQS80ZeMO5SGkbFvMhQvIysH700BJh6ehbw8vUs9nMYKTqOGhwHNMgZGiTJj6x7yxia8oHyEVcgthmOuP-0BEDo37-fBuowkYKlKwwkNhIfpgqYs5HvmNeRc',
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} bounces={false}>
        
        {/* Image Section */}
        <View style={styles.imageContainer}>
          <Image source={{ uri: product.image }} style={styles.heroImage} resizeMode="cover" />
          
          {/* Top Actions */}
          <SafeAreaView style={styles.topActionsSafeArea}>
            <View style={styles.topActions}>
              <TouchableOpacity style={styles.iconButton} onPress={() => navigation.goBack()}>
                <Text style={styles.iconText}>←</Text>
              </TouchableOpacity>
              <View style={styles.topRightActions}>
                <TouchableOpacity style={styles.iconButton} onPress={() => setIsLiked(!isLiked)}>
                  <Text style={styles.iconText}>{isLiked ? '❤️' : '🤍'}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.iconButton} onPress={() => Share.share({ message: `Check out ${product.title} on Campus Exchange!` })}>
                  <Text style={styles.iconText}>🔗</Text>
                </TouchableOpacity>
              </View>
            </View>
          </SafeAreaView>

          {/* Bottom Overlays */}
          <View style={styles.imageBottomOverlays}>
            <View style={styles.pagination}>
              <View style={[styles.dot, styles.dotActive]} />
              <View style={styles.dot} />
              <View style={styles.dot} />
              <View style={styles.dot} />
            </View>
            <View style={styles.pricePill}>
              <Text style={styles.priceText}>{product.price.replace('.00', '')}<Text style={styles.priceDecimals}>.00</Text></Text>
            </View>
          </View>
        </View>

        {/* Content Section */}
        <View style={styles.content}>
          {/* Metadata */}
          <View style={styles.metaRow}>
            <View style={{ flexDirection: 'row', gap: 8 }}>
              <View style={styles.badgePrimary}><Text style={styles.badgePrimaryText}>TEXTBOOKS</Text></View>
              <View style={styles.badgeSecondary}><Text style={styles.badgeSecondaryText}>Used - Like New</Text></View>
            </View>
            <Text style={styles.timeText}>🕒 2h ago</Text>
          </View>

          {/* Title */}
          <Text style={styles.title}>{product.title}</Text>
          <Text style={styles.subtitle}>ISBN: 978-1305080485 • Author: John McMurry</Text>

          {/* Seller */}
          <TouchableOpacity style={styles.sellerCard} onPress={() => navigation.navigate('Profile')}>
            <Image source={{ uri: product.sellerAvatar }} style={styles.sellerAvatar} />
            <View style={styles.sellerInfo}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                <Text style={styles.sellerName}>{product.seller}</Text>
                <View style={styles.verifiedBadge}><Text style={styles.verifiedText}>✓</Text></View>
              </View>
              <Text style={styles.sellerStats}>⭐ 4.9 (24 trusted trades)</Text>
            </View>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>

          {/* Escrow Box */}
          <View style={styles.escrowBox}>
            <View style={styles.escrowHeader}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Text style={{ fontSize: 16 }}>🔒</Text>
                <Text style={styles.escrowTitle}>Secure Escrow</Text>
              </View>
              <Text style={styles.escrowTerms}>TERMS ↗</Text>
            </View>
            
            <Text style={styles.escrowDesc}>
              Your funds are protected. Payment is split into milestones and released only when conditions are met.
            </Text>

            {/* Timeline */}
            <View style={styles.timeline}>
              {/* Step 1 */}
              <View style={styles.step}>
                <View style={styles.stepIconContainerActive}>
                  <Text style={styles.stepIcon}>🏦</Text>
                </View>
                <View style={[styles.stepLine, styles.stepLineActive]} />
                <View style={styles.stepContent}>
                  <View style={styles.stepHeader}>
                    <Text style={styles.stepTitle}>10% Deposit</Text>
                    <Text style={styles.stepAmountActive}>$25.50</Text>
                  </View>
                  <Text style={styles.stepDesc}>Locks in the item. Held securely by Hub Escrow.</Text>
                </View>
              </View>
              {/* Step 2 */}
              <View style={styles.step}>
                <View style={styles.stepIconContainer}>
                  <Text style={styles.stepIcon}>🤝</Text>
                </View>
                <View style={styles.stepLine} />
                <View style={styles.stepContent}>
                  <View style={styles.stepHeader}>
                    <Text style={styles.stepTitle}>40% Mid-point</Text>
                    <Text style={styles.stepAmount}>$34.00</Text>
                  </View>
                  <Text style={styles.stepDesc}>Released when seller confirms meeting or shipping.</Text>
                </View>
              </View>
              {/* Step 3 */}
              <View style={styles.step}>
                <View style={styles.stepIconContainer}>
                  <Text style={styles.stepIcon}>✓</Text>
                </View>
                <View style={styles.stepContent}>
                  <View style={styles.stepHeader}>
                    <Text style={styles.stepTitle}>50% Delivery</Text>
                    <Text style={styles.stepAmount}>$25.50</Text>
                  </View>
                  <Text style={styles.stepDesc}>Released only upon your confirmation of receipt.</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Details Box */}
          <View style={styles.detailsBox}>
            <Text style={styles.detailsTitle}>Details</Text>
            <Text style={styles.detailsText}>
              Used for Chem 201 last semester. Pages are completely clean, no highlighting, pen marks, or folded corners. There is slight wear on the bottom right corner of the front cover from my backpack, but it's structurally perfect.
            </Text>
            <Text style={styles.detailsText}>
              Need to sell this quickly to afford next semester's lab materials! Happy to meet up anywhere near the Student Union building on Tuesdays/Thursdays, or I can ship it to you if you cover the cost.
            </Text>
            <View style={styles.tagsContainer}>
              <View style={styles.tag}><Text style={styles.tagText}>📍 Main Campus</Text></View>
              <View style={styles.tag}><Text style={styles.tagText}>🚚 Shipping Avail.</Text></View>
              <View style={styles.tag}><Text style={styles.tagText}>🤝 Escrow Only</Text></View>
            </View>
          </View>

        </View>
      </ScrollView>

      {/* Sticky Bottom Actions */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.messageBtn} onPress={() => navigation.navigate('ChatDetail', { chat: { name: product.seller } })}>
          <Text style={styles.messageBtnText}>💬 Message</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buyBtn} onPress={() => Alert.alert('Purchase Started', 'Setting up secure escrow for this transaction...')}>
          <Text style={styles.buyBtnText}>Buy Now ➔</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.background },
  scrollContent: { paddingBottom: 100 },
  
  imageContainer: { width: width, height: 400, position: 'relative' },
  heroImage: { width: '100%', height: '100%', borderBottomLeftRadius: 24, borderBottomRightRadius: 24 },
  
  topActionsSafeArea: { position: 'absolute', top: 0, left: 0, right: 0 },
  topActions: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 16, paddingTop: 8 },
  topRightActions: { flexDirection: 'row', gap: 12 },
  iconButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.8)', justifyContent: 'center', alignItems: 'center' },
  iconText: { fontSize: 18, color: '#000' },
  
  imageBottomOverlays: { position: 'absolute', bottom: 16, left: 16, right: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  pagination: { flexDirection: 'row', gap: 6, backgroundColor: 'rgba(0,0,0,0.3)', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 12 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.5)' },
  dotActive: { width: 16, backgroundColor: '#ffffff' },
  
  pricePill: { backgroundColor: '#ffffff', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20 },
  priceText: { fontSize: 18, fontWeight: '800', color: C.primary },
  priceDecimals: { fontSize: 14, fontWeight: '600' },
  
  content: { padding: 20 },
  metaRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  badgePrimary: { backgroundColor: '#e6eeff', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8 },
  badgePrimaryText: { color: C.primary, fontSize: 11, fontWeight: '700', letterSpacing: 0.5 },
  badgeSecondary: { backgroundColor: C.surfaceContainer, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8 },
  badgeSecondaryText: { color: C.onSurfaceVariant, fontSize: 12, fontWeight: '600' },
  timeText: { fontSize: 12, color: C.outline, fontWeight: '600' },
  
  title: { fontSize: 22, fontWeight: '800', color: C.onSurface, marginBottom: 8, lineHeight: 28 },
  subtitle: { fontSize: 13, color: C.onSurfaceVariant, marginBottom: 20 },
  
  sellerCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: C.surfaceLowest, padding: 12, borderRadius: 16, borderWidth: 1, borderColor: '#f0f0f0', marginBottom: 24 },
  sellerAvatar: { width: 40, height: 40, borderRadius: 20, marginRight: 12 },
  sellerInfo: { flex: 1 },
  sellerName: { fontSize: 15, fontWeight: '700', color: C.onSurface },
  verifiedBadge: { width: 14, height: 14, borderRadius: 7, backgroundColor: C.primary, justifyContent: 'center', alignItems: 'center' },
  verifiedText: { color: 'white', fontSize: 8, fontWeight: 'bold' },
  sellerStats: { fontSize: 13, color: C.outline, marginTop: 4 },
  chevron: { fontSize: 24, color: C.outlineVariant, paddingHorizontal: 8 },
  
  escrowBox: { backgroundColor: '#f8faff', padding: 20, borderRadius: 20, borderWidth: 1, borderColor: '#e6eeff', marginBottom: 24 },
  escrowHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  escrowTitle: { fontSize: 16, fontWeight: '800', color: C.primary },
  escrowTerms: { fontSize: 12, fontWeight: '700', color: C.primary },
  escrowDesc: { fontSize: 13, color: C.onSurfaceVariant, lineHeight: 18, marginBottom: 24 },
  
  timeline: { paddingLeft: 8 },
  step: { flexDirection: 'row', marginBottom: 24, position: 'relative' },
  stepIconContainerActive: { width: 32, height: 32, borderRadius: 16, backgroundColor: C.primary, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#ffffff', zIndex: 2 },
  stepIconContainer: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#ffffff', justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: C.outlineVariant, zIndex: 2 },
  stepIcon: { fontSize: 14 },
  stepLine: { position: 'absolute', left: 15, top: 32, bottom: -24, width: 2, backgroundColor: C.outlineVariant, zIndex: 1 },
  stepLineActive: { backgroundColor: C.primary },
  stepContent: { flex: 1, paddingLeft: 16 },
  stepHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  stepTitle: { fontSize: 14, fontWeight: '600', color: C.onSurface },
  stepAmountActive: { fontSize: 14, fontWeight: '700', color: '#8b5cf6' }, // Purple tint matching image
  stepAmount: { fontSize: 14, fontWeight: '600', color: C.outline },
  stepDesc: { fontSize: 12, color: C.outline, lineHeight: 16 },
  
  detailsBox: { backgroundColor: C.surfaceLowest, padding: 20, borderRadius: 20, borderWidth: 1, borderColor: '#f0f0f0' },
  detailsTitle: { fontSize: 16, fontWeight: '800', color: C.onSurface, marginBottom: 12 },
  detailsText: { fontSize: 14, color: C.onSurfaceVariant, lineHeight: 22, marginBottom: 12 },
  tagsContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 8 },
  tag: { backgroundColor: C.surfaceContainer, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 12 },
  tagText: { fontSize: 12, color: C.onSurfaceVariant, fontWeight: '600' },
  
  bottomBar: { position: 'absolute', bottom: 0, left: 0, right: 0, flexDirection: 'row', padding: 16, paddingBottom: 32, backgroundColor: C.surfaceLowest, borderTopWidth: 1, borderTopColor: '#f0f0f0', gap: 12 },
  messageBtn: { flex: 1, height: 52, borderRadius: 26, borderWidth: 1.5, borderColor: C.primary, justifyContent: 'center', alignItems: 'center' },
  messageBtnText: { color: C.primary, fontSize: 16, fontWeight: '700' },
  buyBtn: { flex: 1, height: 52, borderRadius: 26, backgroundColor: C.primary, justifyContent: 'center', alignItems: 'center' },
  buyBtnText: { color: C.onPrimary, fontSize: 16, fontWeight: '700' },
});

export default ProductDetailScreen;
