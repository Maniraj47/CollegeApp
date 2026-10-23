import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, Pressable, TextInput, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { firestore } from '../../config/firebaseConfig';

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

const MarketplaceScreen = () => {
  const navigation = useNavigation<any>();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All Items');
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(firestore, 'products'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const products = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setItems(products);
      setLoading(false);
    }, (error) => {
      console.error('Error fetching products:', error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const filteredItems = items.filter(item => {
    const title = item.title || '';
    const category = item.category || '';
    const matchesSearch = title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          category.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = activeCategory === 'All Items' || 
      (activeCategory === 'Dorm Essentials' && category === 'Dorm Stuff') ||
      (activeCategory === 'Tutoring Services' && category === 'Tutoring') ||
      (category === activeCategory);
      
    return matchesSearch && matchesCategory;
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.iconBtn} />
        <Text style={styles.headerTitle}>College Hub</Text>
        <Pressable style={styles.profileBtn} onPress={() => navigation.navigate('Profile')}>
          <Image source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCKRZlSsme-lB6TGmwXEPErD2kQmja88j0FklGzU4Fzgg8BdaGNb5RRHpnYjci5jJ5G1m9dVv19DcQ66h_Xlp_iEVG4qm0veJIgnCGuLM3noDCVvf4UTtHSquHfJTd5aRMbUms3M4Hviya-Asgo4q9QbnZiDFtNDJEYc_bE-g2ZcHyFK9gKyH3UmsUppizhW7fk_Akf4_UqYA3bvEjJmveplDBSDNzMDrruXjxJDYRg6UoM9TgwYSzAXAQW-NmZZ17BXqTEGdSDjLE' }} style={styles.profileAvatar} />
        </Pressable>
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
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        </View>

        {/* Categories */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoriesContainer}>
          {CATEGORIES.map((cat, i) => (
            <Pressable 
              key={cat} 
              style={[styles.categoryChip, activeCategory === cat && styles.activeChip]}
              onPress={() => setActiveCategory(cat)}
            >
              <Text style={[styles.categoryText, activeCategory === cat && styles.activeChipText]}>{cat}</Text>
            </Pressable>
          ))}
        </ScrollView>

        {/* Grid Items */}
        <View style={styles.grid}>
          {filteredItems.length > 0 ? filteredItems.map(item => (
            <Pressable 
              key={item.id} 
              style={styles.card}
              onPress={() => navigation.navigate('ProductDetail', { product: item })}
            >
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
                    <Image source={{ uri: item.sellerAvatar || 'https://lh3.googleusercontent.com/aida-public/AB6AXuCKRZlSsme-lB6TGmwXEPErD2kQmja88j0FklGzU4Fzgg8BdaGNb5RRHpnYjci5jJ5G1m9dVv19DcQ66h_Xlp_iEVG4qm0veJIgnCGuLM3noDCVvf4UTtHSquHfJTd5aRMbUms3M4Hviya-Asgo4q9QbnZiDFtNDJEYc_bE-g2ZcHyFK9gKyH3UmsUppizhW7fk_Akf4_UqYA3bvEjJmveplDBSDNzMDrruXjxJDYRg6UoM9TgwYSzAXAQW-NmZZ17BXqTEGdSDjLE' }} style={styles.sellerAvatar} />
                    <Text style={styles.sellerName} numberOfLines={1}>{item.sellerName || item.seller || 'Student'}</Text>
                  </View>
                </View>
              </View>
            </Pressable>
          )) : (
            <Text style={{ textAlign: 'center', width: '100%', marginTop: 32, color: C.outline }}>No items found matching your criteria.</Text>
          )}
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Floating Action Button */}
      <Pressable 
        style={styles.fab} 
        onPress={() => navigation.navigate('CreatePost')}
      >
        <Text style={styles.fabIcon}>+</Text>
      </Pressable>
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

  fab: { position: 'absolute', bottom: 100, right: 20, width: 60, height: 60, borderRadius: 30, backgroundColor: C.primaryContainer, justifyContent: 'center', alignItems: 'center', shadowColor: C.primaryContainer, shadowOpacity: 0.4, shadowRadius: 10, shadowOffset: { width: 0, height: 4 }, elevation: 5 },
  fabIcon: { fontSize: 32, color: 'white', fontWeight: '400', marginTop: -4 },
});

export default MarketplaceScreen;
