import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const C = {
  background: '#f7f9fb',
  surfaceLowest: '#ffffff',
  surfaceContainer: '#eceef0',
  surfaceHighest: '#e0e3e5',
  primary: '#003ec7',
  primaryContainer: '#0052ff',
  onPrimary: '#ffffff',
  onSurface: '#191c1e',
  onSurfaceVariant: '#434656',
  outline: '#737688',
  outlineVariant: '#c3c5d9',
};

const CATEGORIES = ['All Items', 'Textbooks', 'Dorm Essentials', 'Tutoring Services', 'Electronics'];

const ITEMS = [
  {
    id: '1',
    title: 'Calculus Early Transcendentals 8th Ed',
    price: '₹3,700',
    category: 'Textbooks',
    seller: 'Alex Chen',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBSGxEiKr77u8j5cd1a0SZIMTTnGx4dSyEdoJLl3Yz6-AJ_dYqknEtolmz9sYGWvv403uG7BWusDdTr8CLJbrHpYdOY8UOSHZO70tcYEcPDq-OCemTmpEAFTPRr2wGw3yW5jVEGCyWObUmOV45aSSWEpoX-NNJwuCIpVGP0GQWP_TR88944rtXEGswd56X6Mq8zseejyX1KCT5GvO9307AbUs0MLCSd-CCX3hMtA21cLx4EuSQnrKWPpYb_kKUwJhLzU6Coy4RMQy8',
    sellerAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA6r-xhNFGTFNwImTSdxjwT-DfbDVleSz-gVsUxf-myqeA8PZLcbjMSSuf1JaSSKjJyg4Rvh4eB_tFAAg8B9Qm6gChYuMt5aZQfsWmy0863yyae-JA-8U6il5kacGsPXIWG_tc98Glavd7qySF-wdioEZB25yYMXxRT9oaxRJ5EZ2bz47ONEnpto_557r8gHkL7OhfUgdfI_eP2UBGLKBPhjoH0vJ78rewu6XpbD9U8c7oG2bQIys-gZngKAHVwgpglwdjkhDB7dLQ',
  },
  {
    id: '2',
    title: 'Organic Chemistry 101 Tutoring',
    price: '₹1,600/hr',
    category: 'Tutoring',
    seller: 'Sarah Jenkins',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCtaETVHvljqQuGoTnUwPiJgpiRapRDwaSyYA1TTaz1gp8IHeZK-6fhNIkp8kwm4UEk7XD4qHY4TfmDbn3_jBVSZaUdgXSSAeE0XJz0_ASlTD63vQvSzDl9fQhLmG_Dv2Xi_kPdO_vyfVY9RuXbRtgadK8SEICM8RJfMg4tDQi9qjPK0Kmq40iZjAS40EyxVr33SHLPCcFgO5AUQPqD_PzQ9vjsl-gAxt8EvqtUbmWE6dzLKwuCzYa908qNyG6UbjOcES1NaxwbgRw',
    sellerAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCiWVeICCwzhVRvqUvRMxcd3esXf78wbiTj9CcMN93Modfhnjnwf7uuQunZibeXNilGftgwSDSV5oUak26FYrJZKL4pKCQklkVXKVAGal_ZCW_VQe7FyIP4WVL6_BaCLdJq-ADbpuMbHiLUvam0n7dKQS80ZeMO5SGkbFvMhQvIysH700BJh6ehbw8vUs9nMYKTqOGhwHNMgZGiTJj6x7yxia8oHyEVcgthmOuP-0BEDo37-fBuowkYKlKwwkNhIfpgqYs5HvmNeRc',
  },
  {
    id: '3',
    title: 'Danby Mini Fridge - Perfect Condition',
    price: '₹5,000',
    category: 'Dorm Stuff',
    seller: 'Marcus T.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDWME9iwZS8V5AgqgYJRgHCYxlqsF-hd7OZcDZlo-WMd0zc-tgNJlB-spL7zpfXiNU3KJj2IyKIaephZsF_ivCbBUwnfV6eOKqMWagTG_k6ehH9HgkqpREdTjwPqSgm5BCFYdD8wRf-hQMA1Zaaq7_O9WLKbnGjMfwJ7nxexgT4vk-slaLW-dUmdtPiHO4A1QfyomWQuuRDjL9usnY4JS8_w67s1MaPsiJzNI0dXpLHpuMSmgmbJMXlclvgpO5yWiPvIf3peEHNYjM',
    sellerAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuChcDr5z3aS8aP9tvKBFFQYPyo0_-UeCyceyxVlNMiu2NHndG2kJr69dvh-GCONv2LiKYjZfj3c4HQuMwLpwZx571R8PVBV9Jsq6lDlvnlNTW_Xqpd21-Q2K-5V0ivMVsjf1-iGUflf_XaitPpmDDhS4AxPIHHTGlgDkdowBsaLQr5eFjt6QAM0GwWqpeGN6B_E30YVzc5QNpfpl4nj544o_YkelwQpcTfzuIiDQ0wFXovrnErwWQV-pF2SXkjpmkXZvVvrUL-a0VQ',
  },
  {
    id: '4',
    title: 'MacBook Pro M1 2020 (8GB RAM, 256GB)',
    price: '₹70,000',
    category: 'Electronics',
    seller: 'Emily R.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD0glZ0eavI72_scOsFF2VP_z4VIOF-zFKy-JUft4z9VPF-s1rv2XLyHSpkCJUyvv0YVCyaggwdAiG7k5k7CDnKW2_EsgM7LrhPdckh-Cp42F4btTUnWBmd7_BPoJwiWEuL31-FOg3MuuycxZlc5wkU6Sy4c-jhvsuq06CF0ztoGuZkz0EtnCQnr_3f5iu56WcfvwUgRRz48URXS-sxIT85fYBdRGISMh7hz0Zt6vm0KVsZ8uu9tJi36owMSWZcTdt6-7ylekWqgZU',
    sellerAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDNpbatKp0UocH9s2VedIa6-kXnulsqhuEMgbMIf1kxtxjXAcSAbeR5W5VJVVkYWUpcO-SC2J8umxPlRmIGeglBdfgqYOB_DxSOmSHyFG4WaRX_R-DxlzlcyyhgTj_szejasK_V668K3YNT4E9J8PSKeIqRoxgkqJ5AI-fmlwos7V2DUhNcf3CYdSWy0TyX8E4I-m705aWdchpMt0N2Scbnd5UVsmOsFD7Ha03PUvTAxdZGGHg_CacGr5-_blQVIEfF_2dI-XqWJ28',
  },
];

const MarketplaceScreen = () => {
  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.iconBtn}><Text style={styles.iconTxt}>🔍</Text></TouchableOpacity>
        <Text style={styles.headerTitle}>College Hub</Text>
        <TouchableOpacity style={styles.profileBtn}>
          <Image source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBGcNUOIk296kRmxiwH7TsFB5pgStc-WrxSkGQKq1dBKg9cl0lpKXarmTbuOs8ejBYcIybadPRCo0Ptw9tS8xgX-yeH7pviKdsBoKVBK1Eg4e94Cg1i6QBKT5VClojNBI9ZSU-_xFr_bfU-5jgw7FD_Cxpp852EPIVyPX6OoAbcb6oF0SV0rCAJ8PEtUn9F8Zzeh6kzkEb8p2RPuXkgAj5LEFxOKajXqlY1pEd1LU2R68B4eEEJ_1a2SDUfj_8rLwQ46fGGsO_CHxU' }} style={styles.profileAvatar} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* Search Section */}
        <View style={styles.searchSection}>
          <Text style={styles.screenTitle}>Campus Exchange</Text>
          <View style={styles.searchBar}>
            <Text style={styles.searchIcon}>🔍</Text>
            <TextInput 
              style={styles.searchInput}
              placeholder="Search textbooks, dorm decor, tutoring..."
              placeholderTextColor={C.onSurfaceVariant}
            />
          </View>
        </View>

        {/* Categories */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoriesContainer}>
          {CATEGORIES.map((cat, i) => (
            <TouchableOpacity key={cat} style={[styles.categoryChip, i === 0 && styles.activeChip]}>
              <Text style={[styles.categoryText, i === 0 && styles.activeChipText]}>{cat}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Grid Items */}
        <View style={styles.grid}>
          {ITEMS.map(item => (
            <TouchableOpacity key={item.id} style={styles.card}>
              <View style={styles.imageContainer}>
                <Image source={{ uri: item.image }} style={styles.cardImage} />
                <View style={styles.pricePill}>
                  <Text style={styles.priceText}>{item.price}</Text>
                </View>
              </View>
              
              <View style={styles.cardBody}>
                <Text style={styles.itemTitle} numberOfLines={2}>{item.title}</Text>
                
                <View style={styles.cardFooter}>
                  <Text style={styles.itemCategory}>{item.category}</Text>
                  <View style={styles.sellerRow}>
                    <Image source={{ uri: item.sellerAvatar }} style={styles.sellerAvatar} />
                    <Text style={styles.sellerName} numberOfLines={1}>{item.seller}</Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))}
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
  
  scrollContent: { paddingBottom: 24 },
  
  searchSection: { paddingHorizontal: 20, paddingTop: 24, paddingBottom: 8 },
  screenTitle: { fontSize: 32, fontWeight: '800', color: C.onSurface, marginBottom: 16 },
  searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: C.surfaceContainer, borderRadius: 28, height: 56, paddingHorizontal: 16 },
  searchIcon: { fontSize: 18, color: C.outline, marginRight: 8 },
  searchInput: { flex: 1, fontSize: 16, color: C.onSurface },
  
  categoriesContainer: { paddingHorizontal: 20, paddingVertical: 8, gap: 8 },
  categoryChip: { backgroundColor: C.surfaceHighest, paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20 },
  activeChip: { backgroundColor: C.primaryContainer },
  categoryText: { fontSize: 14, fontWeight: '600', color: C.onSurface },
  activeChipText: { color: C.onPrimary },
  
  grid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 16, paddingTop: 16, justifyContent: 'space-between' },
  
  card: { 
    width: '48%', 
    backgroundColor: C.surfaceLowest, 
    borderRadius: 24, 
    marginBottom: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(195,197,217,0.2)',
    shadowColor: C.primaryContainer,
    shadowOpacity: 0.04,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  imageContainer: { width: '100%', aspectRatio: 4/5, backgroundColor: C.surfaceContainer },
  cardImage: { width: '100%', height: '100%' },
  pricePill: { position: 'absolute', top: 12, right: 12, backgroundColor: 'rgba(255,255,255,0.8)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16 },
  priceText: { fontSize: 14, fontWeight: '700', color: C.onSurface },
  
  cardBody: { padding: 12, flex: 1, justifyContent: 'space-between' },
  itemTitle: { fontSize: 14, fontWeight: '600', color: C.onSurface, lineHeight: 20, marginBottom: 12 },
  
  cardFooter: { gap: 4 },
  itemCategory: { fontSize: 11, fontWeight: '700', color: C.onSurfaceVariant, textTransform: 'uppercase' },
  sellerRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  sellerAvatar: { width: 20, height: 20, borderRadius: 10 },
  sellerName: { fontSize: 11, color: C.onSurfaceVariant, flex: 1 },
});

export default MarketplaceScreen;
