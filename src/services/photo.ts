import { Directory, File, Paths } from 'expo-file-system';
import * as ImagePicker from 'expo-image-picker';
import { Platform } from 'react-native';

/**
 * Bola rasmini tanlash. Rasm faqat qurilmada saqlanadi (ilova papkasiga nusxalanadi)
 * va hech qayerga — reytingga ham — yuborilmaydi.
 */
export async function pickChildPhoto(): Promise<string | null> {
  const res = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], allowsEditing: true, aspect: [1, 1], quality: 0.6 });
  if (res.canceled || !res.assets?.[0]) return null;
  const uri = res.assets[0].uri;
  if (Platform.OS === 'web') return uri;
  try {
    const dir = new Directory(Paths.document, 'avatar');
    if (!dir.exists) dir.create({ intermediates: true });
    const dest = new File(dir, `child-${Date.now()}.jpg`);
    new File(uri).copy(dest);
    return dest.uri;
  } catch {
    return uri;
  }
}
