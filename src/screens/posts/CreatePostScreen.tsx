import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable, Image, KeyboardAvoidingView, Platform, ScrollView, Alert, ActivityIndicator, Modal, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { launchImageLibrary } from '../../services/imagePicker';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadString, getDownloadURL } from 'firebase/storage';
import { firestore, storage } from '../../config/firebaseConfig';
import { useAuth } from '../../hooks/useAuth';

const CATEGORIES = ['Textbooks', 'Dorm Essentials', 'Tutoring Services', 'Electronics'];

const CustomSelect = ({ label, value, options, onSelect }: { label: string, value: string, options: string[], onSelect: (v: string) => void }) => {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <>
      <View style={styles.inputGroup}>
        <Text style={styles.label}>{label}</Text>
        <Pressable style={styles.inputSelect} onPress={() => setModalVisible(true)}>
          <View style={{ flex: 1, justifyContent: 'center' }}>
            <Text style={{ color: value ? '#191c1e' : '#9ca3af', fontSize: 16 }}>
              {value || `Select ${label}`}
            </Text>
          </View>
        </Pressable>
      </View>

      <Modal visible={modalVisible} transparent animationType="fade">
        <Pressable style={styles.modalOverlay} onPress={() => setModalVisible(false)}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select {label}</Text>
            {options.map((opt) => (
              <TouchableOpacity
                key={opt}
                style={styles.modalOption}
                onPress={() => {
                  onSelect(opt);
                  setModalVisible(false);
                }}
              >
                <Text style={[styles.modalOptionText, value === opt && { color: '#0052ff', fontWeight: '700' }]} >
                  {opt}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Pressable>
      </Modal>
    </>
  );
};

const CreatePostScreen = () => {
  const navigation = useNavigation();
  const { user, userData } = useAuth();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  
  const [loading, setLoading] = useState(false);

  const pickImage = async () => {
    const result = await launchImageLibrary({
      mediaType: 'photo',
      quality: 0.8,
      includeBase64: true,
    });

    if (result.didCancel || !result.assets || result.assets.length === 0) {
      return;
    }
    setImageUri(result.assets[0].uri || null);
    setImageBase64(result.assets[0].base64 || null);
  };

  const uploadImageAsync = async (base64Str: string) => {
    const filename = `products/${Date.now()}_${user?.uid}.jpg`;
    const storageRef = ref(storage, filename);
    await uploadString(storageRef, base64Str, 'base64');
    return await getDownloadURL(storageRef);
  };

  const handlePost = async () => {
    if (!title || !description || !price || !category || !imageUri) {
      Alert.alert('Missing Fields', 'Please fill out all fields and select an image.');
      return;
    }
    
    setLoading(true);
    try {
      let imageUrl = '';
      if (imageBase64) {
        imageUrl = await uploadImageAsync(imageBase64);
      }
      
      await addDoc(collection(firestore, 'products'), {
        title: title.trim(),
        description: description.trim(),
        price: `₹${price.trim()}`,
        category,
        image: imageUrl,
        sellerId: user?.uid,
        sellerName: userData?.displayName || user?.displayName || 'Student',
        sellerAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCKRZlSsme-lB6TGmwXEPErD2kQmja88j0FklGzU4Fzgg8BdaGNb5RRHpnYjci5jJ5G1m9dVv19DcQ66h_Xlp_iEVG4qm0veJIgnCGuLM3noDCVvf4UTtHSquHfJTd5aRMbUms3M4Hviya-Asgo4q9QbnZiDFtNDJEYc_bE-g2ZcHyFK9gKyH3UmsUppizhW7fk_Akf4_UqYA3bvEjJmveplDBSDNzMDrruXjxJDYRg6UoM9TgwYSzAXAQW-NmZZ17BXqTEGdSDjLE',
        createdAt: serverTimestamp(),
      });
      
      setLoading(false);
      navigation.goBack();
    } catch (error: any) {
      setLoading(false);
      Alert.alert('Error', error.message || 'Failed to create listing. Please try again.');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()}>
          <Text style={styles.headerBtn}>Cancel</Text>
        </Pressable>
        <Text style={styles.headerTitle}>New Listing</Text>
        <Pressable onPress={handlePost} style={[styles.postBtn, loading && { opacity: 0.5 }]} disabled={loading}>
          {loading ? <ActivityIndicator size="small" color="#fff" /> : <Text style={styles.postBtnText}>Post</Text>}
        </Pressable>
      </View>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView style={styles.content}>
          
          <Pressable style={styles.imagePicker} onPress={pickImage}>
            {imageUri ? (
              <Image source={{ uri: imageUri }} style={styles.previewImage} resizeMode="cover" />
            ) : (
              <View style={styles.imagePlaceholder}>
                <Text style={styles.imagePlaceholderIcon}>📷</Text>
                <Text style={styles.imagePlaceholderText}>Add Photo</Text>
              </View>
            )}
          </Pressable>

          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Title</Text>
              <TextInput
                style={styles.input}
                placeholder="What are you selling?"
                placeholderTextColor="#9ca3af"
                value={title}
                onChangeText={setTitle}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Price (₹)</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. 500"
                placeholderTextColor="#9ca3af"
                keyboardType="numeric"
                value={price}
                onChangeText={setPrice}
              />
            </View>

            <CustomSelect
              label="Category"
              value={category}
              options={CATEGORIES}
              onSelect={setCategory}
            />

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Description</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Describe your item, condition, and pickup details..."
                placeholderTextColor="#9ca3af"
                multiline
                numberOfLines={4}
                value={description}
                onChangeText={setDescription}
              />
            </View>
          </View>
          
          <View style={{ height: 40 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f7f9fb' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    height: 52,
    backgroundColor: '#ffffff',
    borderBottomWidth: 0.5,
    borderBottomColor: '#e5e7eb',
  },
  headerBtn: { fontSize: 16, color: '#434656' },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#191c1e' },
  postBtn: { backgroundColor: '#0052ff', paddingHorizontal: 20, paddingVertical: 8, borderRadius: 16 },
  postBtnText: { color: 'white', fontWeight: '700' },
  content: { padding: 16 },
  
  imagePicker: { width: '100%', height: 240, backgroundColor: '#eceef0', borderRadius: 16, overflow: 'hidden', marginBottom: 24 },
  imagePlaceholder: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  imagePlaceholderIcon: { fontSize: 40, marginBottom: 8 },
  imagePlaceholderText: { fontSize: 16, color: '#434656', fontWeight: '600' },
  previewImage: { width: '100%', height: '100%' },

  form: { gap: 16 },
  inputGroup: { gap: 8 },
  label: { fontSize: 14, fontWeight: '600', color: '#434656', marginLeft: 4 },
  input: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#c3c5d9',
    fontSize: 16,
    color: '#191c1e',
    height: 50,
  },
  inputSelect: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#c3c5d9',
    height: 50,
  },
  textArea: {
    height: 100,
    paddingTop: 12,
    textAlignVertical: 'top',
  },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { width: '100%', backgroundColor: 'white', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20, paddingBottom: 40 },
  modalTitle: { fontSize: 20, fontWeight: '700', marginBottom: 16, color: '#191c1e', textAlign: 'center' },
  modalOption: { paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#f1f5f9' },
  modalOptionText: { fontSize: 16, color: '#191c1e', textAlign: 'center' },
});

export default CreatePostScreen;
