import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
  SafeAreaView,
  Alert,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { loadLinks, saveLinks } from '../storage';

export default function HomeScreen({ navigation }) {
  const [links, setLinks] = useState([]);

  useFocusEffect(
    useCallback(() => {
      loadLinks().then(setLinks);
    }, [])
  );

  function deleteLink(id) {
    Alert.alert('Удалить ссылку?', '', [
      { text: 'Отмена', style: 'cancel' },
      {
        text: 'Удалить',
        style: 'destructive',
        onPress: async () => {
          const updated = links.filter((l) => l.id !== id);
          setLinks(updated);
          await saveLinks(updated);
        },
      },
    ]);
  }

  function renderItem({ item }) {
    const faviconUrl = `https://www.google.com/s2/favicons?domain=${item.url}&sz=64`;
    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate('Browser', { url: item.url, title: item.title })}
        onLongPress={() => deleteLink(item.id)}
        activeOpacity={0.8}
      >
        {item.image ? (
          <Image source={{ uri: item.image }} style={styles.cardImage} resizeMode="cover" />
        ) : (
          <View style={styles.cardImagePlaceholder}>
            <Image source={{ uri: faviconUrl }} style={styles.favicon} />
          </View>
        )}
        <View style={styles.cardInfo}>
          <Text style={styles.cardTitle} numberOfLines={1}>
            {item.title || item.url}
          </Text>
          <Text style={styles.cardUrl} numberOfLines={1}>
            {item.url}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Мои ссылки</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('AddLink')}
        >
          <Text style={styles.addButtonText}>＋</Text>
        </TouchableOpacity>
      </View>

      {links.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyIcon}>🔗</Text>
          <Text style={styles.emptyText}>Нет ссылок</Text>
          <Text style={styles.emptyHint}>Нажмите ＋ чтобы добавить</Text>
        </View>
      ) : (
        <FlatList
          data={links}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          numColumns={2}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#C6C6C8',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1C1C1E',
  },
  addButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#007AFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 20,
    lineHeight: 22,
  },
  list: {
    padding: 8,
  },
  card: {
    flex: 1,
    margin: 8,
    borderRadius: 14,
    backgroundColor: '#fff',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  cardImage: {
    width: '100%',
    height: 110,
    backgroundColor: '#E5E5EA',
  },
  cardImagePlaceholder: {
    width: '100%',
    height: 110,
    backgroundColor: '#E5E5EA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  favicon: {
    width: 48,
    height: 48,
    borderRadius: 8,
  },
  cardInfo: {
    padding: 10,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 2,
  },
  cardUrl: {
    fontSize: 11,
    color: '#8E8E93',
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  emptyIcon: {
    fontSize: 56,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1C1C1E',
  },
  emptyHint: {
    fontSize: 14,
    color: '#8E8E93',
  },
});
