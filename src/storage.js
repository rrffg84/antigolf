import AsyncStorage from '@react-native-async-storage/async-storage';

const LINKS_KEY = 'links';

export async function loadLinks() {
  try {
    const json = await AsyncStorage.getItem(LINKS_KEY);
    return json ? JSON.parse(json) : [];
  } catch {
    return [];
  }
}

export async function saveLinks(links) {
  await AsyncStorage.setItem(LINKS_KEY, JSON.stringify(links));
}
