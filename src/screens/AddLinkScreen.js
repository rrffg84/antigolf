import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  Image,
} from 'react-native';
import { loadLinks, saveLinks } from '../storage';

export default function AddLinkScreen({ navigation }) {
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [image, setImage] = useState('');

  async function handleSave() {
    const trimmedUrl = url.trim();
    if (!trimmedUrl) {
      Alert.alert('Ошибка', 'Введите URL');
      return;
    }

    const finalUrl = trimmedUrl.startsWith('http') ? trimmedUrl : `https://${trimmedUrl}`;

    const newLink = {
      id: Date.now().toString(),
      url: finalUrl,
      title: title.trim() || finalUrl,
      image: image.trim() || null,
    };

    const existing = await loadLinks();
    await saveLinks([...existing, newLink]);
    navigation.goBack();
  }

  const previewFavicon = url.trim()
    ? `https://www.google.com/s2/favicons?domain=${url.trim()}&sz=64`
    : null;

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Text style={styles.cancel}>Отмена</Text>
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Новая ссылка</Text>
            <TouchableOpacity onPress={handleSave}>
              <Text style={styles.save}>Готово</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.card}>
            <View style={styles.row}>
              <Text style={styles.label}>URL</Text>
              <TextInput
                style={styles.input}
                placeholder="https://example.com"
                placeholderTextColor="#C7C7CC"
                value={url}
                onChangeText={setUrl}
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="url"
              />
            </View>
            <View style={styles.divider} />
            <View style={styles.row}>
              <Text style={styles.label}>Название</Text>
              <TextInput
                style={styles.input}
                placeholder="Необязательно"
                placeholderTextColor="#C7C7CC"
                value={title}
                onChangeText={setTitle}
              />
            </View>
            <View style={styles.divider} />
            <View style={styles.row}>
              <Text style={styles.label}>Картинка</Text>
              <TextInput
                style={styles.input}
                placeholder="URL картинки (необязательно)"
                placeholderTextColor="#C7C7CC"
                value={image}
                onChangeText={setImage}
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="url"
              />
            </View>
          </View>

          {(url.trim() || image.trim()) && (
            <View style={styles.preview}>
              <Text style={styles.previewLabel}>Предпросмотр</Text>
              <View style={styles.previewCard}>
                {image.trim() ? (
                  <Image
                    source={{ uri: image.trim() }}
                    style={styles.previewImage}
                    resizeMode="cover"
                  />
                ) : previewFavicon ? (
                  <View style={styles.previewPlaceholder}>
                    <Image source={{ uri: previewFavicon }} style={styles.previewFavicon} />
                  </View>
                ) : null}
                <View style={styles.previewInfo}>
                  <Text style={styles.previewTitle} numberOfLines={1}>
                    {title.trim() || url.trim() || 'Название'}
                  </Text>
                  <Text style={styles.previewUrl} numberOfLines={1}>
                    {url.trim()}
                  </Text>
                </View>
              </View>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  scroll: {
    padding: 16,
    gap: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#1C1C1E',
  },
  cancel: {
    fontSize: 16,
    color: '#8E8E93',
  },
  save: {
    fontSize: 16,
    fontWeight: '600',
    color: '#007AFF',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  label: {
    width: 80,
    fontSize: 15,
    color: '#1C1C1E',
    fontWeight: '500',
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: '#1C1C1E',
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#C6C6C8',
    marginLeft: 16,
  },
  preview: {
    gap: 8,
  },
  previewLabel: {
    fontSize: 13,
    color: '#8E8E93',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    paddingLeft: 4,
  },
  previewCard: {
    backgroundColor: '#fff',
    borderRadius: 14,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  previewImage: {
    width: '100%',
    height: 140,
    backgroundColor: '#E5E5EA',
  },
  previewPlaceholder: {
    width: '100%',
    height: 140,
    backgroundColor: '#E5E5EA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  previewFavicon: {
    width: 56,
    height: 56,
    borderRadius: 10,
  },
  previewInfo: {
    padding: 12,
  },
  previewTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 2,
  },
  previewUrl: {
    fontSize: 12,
    color: '#8E8E93',
  },
});
