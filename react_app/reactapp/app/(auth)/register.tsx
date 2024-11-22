import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, ImageBackground, TouchableOpacity, ScrollView, useColorScheme, ColorSchemeName, KeyboardAvoidingView, Platform  } from "react-native";
import { useRouter } from "expo-router"; // sử dụng useRouter
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Toast from 'react-native-toast-message'; // Import thư viện Toast
import axios from "axios";
import { ThemedView } from "@/components/ThemedView"; // Import ThemedView
import { Colors } from "@/constants/Colors"; // Import Colors

const RegisterScreen = () => {
  const router = useRouter();
  const colorScheme: ColorSchemeName = useColorScheme() || 'light'; 
  
  const [name, setName] = useState("");
  const [gender, setGender] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@gmail.com+$/;
    return emailRegex.test(email);
  };

  const isValidPhone = (phone: string) => {
    const phoneRegex = /^\d{10}$/;
    return phoneRegex.test(phone);
  };

  const isValidGender = (gender: string) => {
    return gender.toLowerCase() === 'nam' || gender.toLowerCase() === 'nữ';
  };  

  const handleEmailBlur = () => {
    if (!isValidEmail(email)) {
      Toast.show({
        type: 'error',
        text1: 'Email không hợp lệ!',
        text2: 'Định dạng example@gmail.com',
        position: 'top',
        visibilityTime: 3000,
      });
    }
  };

  const handlePhoneBlur = () => {
    if (!isValidPhone(phone)) {
      Toast.show({
        type: 'error',
        text1: 'Lỗi',
        text2: 'Số điện thoại phải có 10 chữ số!',
        position: 'top',
        visibilityTime: 3000,
      });
    }
  };

  const handleGenderBlur = () => {
    if (!isValidGender(gender)) {
      Toast.show({
        type: 'error',
        text1: 'Lỗi',
        text2: 'Giới tính chỉ được nhập Nam hoặc Nữ!',
        position: 'top',
        visibilityTime: 3000,
      });
    }
  };

  const handleAddressBlur = () => {
    if (address.trim() === '') {
      Toast.show({
        type: 'error',
        text1: 'Lỗi',
        text2: 'Vui lòng nhập địa chỉ!',
        position: 'top',
        visibilityTime: 3000,
      });
    }
  };

  const handleNameBlur = () => {
    if (name.trim() === '') {
      Toast.show({
        type: 'error',
        text1: 'Lỗi',
        text2: 'Vui lòng nhập họ tên!',
        position: 'top',
        visibilityTime: 3000,
      });
    }
  };

  const handleRegister = () => {
    if (!isValidEmail(email) || !isValidPhone(phone)) {
      return;  // Ngăn chặn login nếu dữ liệu không hợp lệ
    }
    if (!isValidEmail(email) || !isValidPhone(phone) || !isValidGender(gender) || address.trim() === '' || name.trim() === '') {
      Toast.show({
        type: 'error',
        text1: 'Lỗi',
        text2: 'Vui lòng điền đầy đủ thông tin!',
        position: 'top',
        visibilityTime: 3000,
      });
    } else {
      const fakeOtp = Math.floor(100000 + Math.random() * 900000).toString();
      setGeneratedOtp(fakeOtp);
      setOtpSent(true);
  
      Toast.show({
        type: 'info',
        text1: 'Thông báo',
        text2: `Mã OTP của bạn là: ${fakeOtp}`,
        position: 'top',
        visibilityTime: 7000,
      });
    }
    if (gender.toLowerCase() !== 'nam' && gender.toLowerCase() !== 'nữ') {
      Toast.show({
        type: 'error',
        text1: 'Lỗi',
        text2: 'Giới tính chỉ được nhập Nam hoặc Nữ!',
        position: 'top',
        visibilityTime: 3000,
      });
      return;
    }
  };
  
  const handleVerifyOtp = () => {
    if (otp === generatedOtp) {
      const userData = {
        name,
        gender,
        phone,
        address,
        email,
      };
  
      axios.post('http://172.20.10.4:8080/api/users/register', userData)
        .then(response => {
          console.log(response.data);
          Toast.show({
            type: 'success',
            text1: 'Thành công',
            text2: `Tài khoản ${email} đã được đăng ký thành công!`,
            position: 'top',
            visibilityTime: 3000,
          });
          router.push('/login');
        })
        .catch(error => {
          Toast.show({
            type: 'error',
            text1: 'Lỗi',
            text2: 'Đã xảy ra lỗi trong quá trình đăng ký!',
            position: 'top',
            visibilityTime: 3000,
          });
        });
    } else {
      Toast.show({
        type: 'error',
        text1: 'Lỗi',
        text2: 'Mã OTP không chính xác!',
        position: 'top',
        visibilityTime: 3000,
      });
    }
  };

  return (
    <KeyboardAvoidingView
  behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
  style={{ flex: 1 }}
>
      <ThemedView style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.logoContainer}>
            <MaterialCommunityIcons name="account-plus" size={100} color={Colors[colorScheme].text} />
          </View>

          <Text style={[styles.title, { color: Colors[colorScheme].text }]}>Đăng ký</Text>

          <TextInput
            style={[styles.input, { backgroundColor: Colors[colorScheme].inputBackground, color: Colors[colorScheme].text }]}
            placeholder="Họ và tên"
            placeholderTextColor={Colors[colorScheme].placeholder}
            value={name}
            onChangeText={setName}
            onBlur={handleNameBlur}
          />
          <TextInput
            style={[styles.input, { backgroundColor: Colors[colorScheme].inputBackground, color: Colors[colorScheme].text }]}
            placeholder="Giới tính (Nam/Nữ)"
            placeholderTextColor={Colors[colorScheme].placeholder}
            value={gender}
            onChangeText={setGender}
            onBlur={handleGenderBlur}
          />
          <TextInput
            style={[styles.input, { backgroundColor: Colors[colorScheme].inputBackground, color: Colors[colorScheme].text }]}
            placeholder="Số điện thoại"
            placeholderTextColor={Colors[colorScheme].placeholder}
            value={phone}
            onChangeText={setPhone}
            onBlur={handlePhoneBlur}
            keyboardType="phone-pad"
          />
          <TextInput
            style={[styles.input, { backgroundColor: Colors[colorScheme].inputBackground, color: Colors[colorScheme].text }]}
            placeholder="Địa chỉ"
            placeholderTextColor={Colors[colorScheme].placeholder}
            value={address}
            onChangeText={setAddress}
            onBlur={handleAddressBlur}
          />
          <TextInput
            style={[styles.input, { backgroundColor: Colors[colorScheme].inputBackground, color: Colors[colorScheme].text }]}
            placeholder="Email"
            placeholderTextColor={Colors[colorScheme].placeholder}
            value={email}
            onChangeText={setEmail}
            onBlur={handleEmailBlur}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          {otpSent && (
            <>
              <TextInput
                style={[styles.input, { backgroundColor: Colors[colorScheme].inputBackground, color: Colors[colorScheme].text }]}
                placeholder="Nhập mã OTP"
                placeholderTextColor={Colors[colorScheme].placeholder}
                value={otp}
                onChangeText={setOtp}
                keyboardType="numeric"
              />
              <TouchableOpacity style={[styles.registerButton, { backgroundColor: Colors[colorScheme].buttonBackground }]} onPress={handleVerifyOtp}>
                <Text style={styles.registerButtonText}>Xác thực OTP</Text>
              </TouchableOpacity>
            </>
          )}

          {!otpSent && (
            <TouchableOpacity style={[styles.registerButton, { backgroundColor: Colors[colorScheme].buttonBackground }]} onPress={handleRegister}>
              <Text style={styles.registerButtonText}>Đăng ký</Text>
            </TouchableOpacity>
          )}

          <Text style={[styles.link, { color: Colors[colorScheme].text }]}>
            Bạn đã có tài khoản? <Text style={{ color: Colors[colorScheme].link }} onPress={() => router.push("/login")}>
              Đăng nhập
            </Text>
          </Text>
        </ScrollView>
      </ThemedView>
      </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: "center",
  },
  scrollContainer: {
    marginTop: 50,
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 15,
    borderRadius: 5,
  },
  registerButton: {
    paddingVertical: 10, // Kích thước dọc
    paddingHorizontal: 20, // Kích thước ngang
    borderRadius: 20, // Bo tròn đầu nút
    alignItems: "center",
    marginBottom: 15,
  },
  registerButtonText: {
    color: "#fff", // Màu chữ
    fontWeight: "bold",
    fontSize: 16, // Kích thước chữ
  },
  link: {
    marginTop: 10,
    textAlign: "center",
  },
});

export default RegisterScreen;
