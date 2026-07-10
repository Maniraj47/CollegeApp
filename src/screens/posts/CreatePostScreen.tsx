import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable, Image, KeyboardAvoidingView, Platform, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
// import firestore from '@react-native-firebase/firestore';
import { useAuth } from '../../hooks/useAuth';

const CreatePostScreen = () => {
  const navigation = useNavigation();
  const { user } = useAuth();
  const [text, setText] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const handlePost = async () => {
    if (!text && !imageUrl) {
      Alert.alert('Empty Post', 'Please add some text or an image URL to post.');
      return;
    }
    setLoading(true);
    try {
      setLoading(false);
      navigation.goBack();
    } catch (error) {
      setLoading(false);
      Alert.alert('Error', 'Failed to create post. Please try again.');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()}>
          <Text style={styles.headerBtn}>Cancel</Text>
        </Pressable>
        <Text style={styles.headerTitle}>New Post</Text>
        <Pressable onPress={handlePost} style={[styles.postBtn, loading && { opacity: 0.5 }]} disabled={loading}>
          <Text style={styles.postBtnText}>{loading ? 'Posting...' : 'Post'}</Text>
        </Pressable>
      </View>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView style={styles.content}>
          <TextInput
            style={styles.textInput}
            placeholder="What's on your mind?"
            placeholderTextColor="#737688"
            multiline
            autoFocus
            value={text}
            onChangeText={setText}
          />
          <TextInput
            style={styles.imageUrlInput}
            placeholder="Image URL (optional)"
            placeholderTextColor="#737688"
            value={imageUrl}
            onChangeText={setImageUrl}
            autoCapitalize="none"
            autoCorrect={false}
          />
          {imageUrl ? (
            <Image source={{ uri: imageUrl }} style={styles.previewImage} resizeMode="cover" />
          ) : null}
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
  postBtn: { backgroundColor: '#0052ff', paddingHorizontal: 16, paddingVertical: 6, borderRadius: 16 },
  postBtnText: { color: 'white', fontWeight: '600' },
  content: { padding: 16 },
  textInput: { fontSize: 18, color: '#191c1e', minHeight: 100, textAlignVertical: 'top' },
  imageUrlInput: { fontSize: 14, color: '#191c1e', backgroundColor: '#eceef0', padding: 12, borderRadius: 8, marginTop: 16, marginBottom: 16 },
  previewImage: { width: '100%', height: 200, borderRadius: 12, marginTop: 16, backgroundColor: '#eceef0' },
});

export default CreatePostScreen;
