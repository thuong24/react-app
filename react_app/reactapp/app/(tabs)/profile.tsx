import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { ThemedView } from '@/components/ThemedView';
import { useUser } from '../(auth)/UserContext'; // Cập nhật đường dẫn chính xác
import { Colors } from "@/constants/Colors"; // Import Colors
import { useColorScheme, ColorSchemeName } from 'react-native'; // Để lấy theme hiện tại
import Toast from 'react-native-toast-message';

const UserProfileScreen = () => {
  const router = useRouter();
  const { userInfo, setUserInfo } = useUser(); // Sử dụng UserContext
  const colorScheme: ColorSchemeName = useColorScheme() || 'light'; // Lấy theme hiện tại (light hoặc dark)

  const handleLogin = () => {
    router.push('/login'); // Điều hướng đến trang đăng nhập
  };

  const handleLogout = () => {
    setUserInfo(null); // Xóa thông tin người dùng khi đăng xuất
    Toast.show({
      type: 'success',
      text1: 'Thành công',
      text2: `Bạn đã đăng xuất khỏi tài khoản.`,
      position: 'top',
      visibilityTime: 3000,
    });
    router.push('/login');
  };

  return (
    <ThemedView style={{ flex: 1 }}>
      <View style={[styles.container, { backgroundColor: Colors[colorScheme].background }]}>
        {userInfo ? (
          <>
            {/* Giao diện khi đã đăng nhập */}
            <View style={styles.header}>
              <Ionicons name="person-circle-outline" size={100} color={Colors[colorScheme].tint} />
              <Text style={[styles.title, { color: Colors[colorScheme].tint }]}>Thông tin cá nhân</Text>
            </View>

            {/* Bảng chào mừng người dùng đã đăng nhập */}
            <View style={[styles.welcomeContainer, { backgroundColor: Colors[colorScheme].inputBackground }]}>
              <Text style={[styles.welcomeText, { color: Colors[colorScheme].text }]}>
                {userInfo?.gender === 'male' 
                  ? `Chào mừng chị ${userInfo?.name} đã trở lại!` 
                  : `Chào mừng anh ${userInfo?.name} đã trở lại!`}
              </Text>
            </View>

            {/* Thông tin cá nhân */}
            <View style={[styles.infoContainer, { backgroundColor: Colors[colorScheme].inputBackground }]}>
              <Text style={[styles.label, { color: Colors[colorScheme].text }]}>Họ và tên:</Text>
              <Text style={[styles.info, { color: Colors[colorScheme].text }]}>{userInfo?.name}</Text>
              
              <Text style={[styles.label, { color: Colors[colorScheme].text }]}>Email:</Text>
              <Text style={[styles.info, { color: Colors[colorScheme].text }]}>{userInfo?.email}</Text>
              
              <Text style={[styles.label, { color: Colors[colorScheme].text }]}>Số điện thoại:</Text>
              <Text style={[styles.info, { color: Colors[colorScheme].text }]}>{userInfo?.phone}</Text>

              <Text style={[styles.label, { color: Colors[colorScheme].text }]}>Địa chỉ:</Text>
              <Text style={[styles.info, { color: Colors[colorScheme].text }]}>{userInfo?.address}</Text>
              
            </View>

            <TouchableOpacity
              style={[styles.logoutButton, { backgroundColor: Colors[colorScheme].buttonBackground }]}
              onPress={handleLogout}
            >
              <Text style={styles.logoutText}>Đăng xuất</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            {/* Giao diện khi chưa đăng nhập */}
            <View style={styles.header}>
              <Ionicons name="person-circle-outline" size={100} color={Colors[colorScheme].tint} />
              <Text style={[styles.title, { color: Colors[colorScheme].tint }]}>Chào bạn!</Text>
            </View>

            {/* Bảng thông báo yêu cầu đăng nhập */}
            <View style={[styles.loginPromptContainer, { backgroundColor: Colors[colorScheme].inputBackground }]}>
              <Text style={[styles.loginPromptText, { color: Colors[colorScheme].text }]}>
                Hãy đăng nhập để nhận thông báo mới nhất kèm với những ưu đãi hấp dẫn!
              </Text>
            </View>

            <TouchableOpacity
              style={[styles.loginButton, { backgroundColor: Colors[colorScheme].buttonBackground }]}
              onPress={handleLogin}
            >
              <Text style={styles.loginText}>Đăng nhập</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 10,
  },
  welcomeContainer: {
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  infoContainer: {
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  info: {
    fontSize: 16,
    marginBottom: 15,
  },
  logoutButton: {
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  logoutText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  loginPromptContainer: {
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    alignItems: 'center',
  },
  loginPromptText: {
    fontSize: 18,
    textAlign: 'center',
  },
  loginButton: {
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  loginText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default UserProfileScreen;
