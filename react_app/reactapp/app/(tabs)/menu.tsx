import { ThemedView } from '@/components/ThemedView';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ColorSchemeName, ActivityIndicator } from 'react-native';
import { useColorScheme } from 'react-native';
import { Colors } from "@/constants/Colors"; // Import màu sắc theo theme
import Toast from 'react-native-toast-message';

interface ItemCategory {
  id: number;
  name: string;
}
interface ItemBrand {
  id: number;
  name: string;
  categoryId: number;
}

const CategoryScreen = () => {
  const [selectedCategory, setSelectedCategory] = useState<number>(1);
  const [dataCategory, setDataCategory] = useState<ItemCategory[]>([]);
  const [filteredBrands, setFilteredBrands] = useState<ItemBrand[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false); // Trạng thái tải chung
  const colorScheme: ColorSchemeName = useColorScheme() || 'light'; 

  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoading(true); // Bắt đầu trạng thái tải
      try {
        const response = await axios.get<ItemCategory[]>("http://172.20.10.4:8080/api/categories");
        if (response.data && response.data.length > 0) {
          setDataCategory(response.data);
        } else {
          Toast.show({
            type: 'error',
            text1: 'Có lỗi xảy ra',
            text2: 'Không có dữ liệu Category.',
          });
        }
      } catch (error) {
        Toast.show({
          type: 'error',
          text1: 'Có lỗi xảy ra',
          text2: 'Có lỗi xảy ra khi lấy dữ liệu Category.',
        });
      } finally {
        setIsLoading(false); // Kết thúc trạng thái tải
      }
    };

    fetchCategories();
  }, []);

  // Gọi API để lấy thương hiệu theo danh mục được chọn
  useEffect(() => {
    const fetchBrands = async () => {
      if (dataCategory.length > 0) { // Kiểm tra danh mục đã có dữ liệu
        try {
          const response = await axios.get<ItemBrand[]>(`http://172.20.10.4:8080/api/brands/${selectedCategory}`);
          if (response.data && response.data.length > 0) {
            setFilteredBrands(response.data);
          } else {
            setFilteredBrands([]);
          }
        } catch (error) {
          Toast.show({
            type: 'error',
            text1: 'Có lỗi xảy ra',
            text2: 'Có lỗi xảy ra khi lấy dữ liệu Brand.',
          });
        } 
      }
    };

    fetchBrands();
  }, [selectedCategory, dataCategory]);

  const renderCategoryItem = ({ item }: { item: ItemCategory }) => (
    <TouchableOpacity
      style={[
        styles.categoryItem,
        selectedCategory === item.id && styles.selectedCategory,
      ]}
      onPress={() => setSelectedCategory(item.id)}
    >
      <Text style={styles.categoryText}>{item.name}</Text>
    </TouchableOpacity>
  );

  const renderBrandItem = ({ item }: { item: ItemBrand }) => (
    <View style={styles.brandItem}>
      <Text style={styles.brandText}>{item.name}</Text>
    </View>
  );

  // Kiểm tra trạng thái đang tải
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={styles.loadingText}>Đang tải...</Text>
      </View>
    );
  }

  return (
    <ThemedView style={{ flex: 1 }}>
      <View style={styles.container}>
        {/* Phần danh mục bên trái */}
        <View style={[styles.categoryContainer, { backgroundColor: Colors[colorScheme].background }]}>
          <FlatList
            data={dataCategory}
            renderItem={renderCategoryItem}
            keyExtractor={(item) => item.id.toString()}
          />
        </View>

        {/* Phần danh sách brand bên phải */}
        <View style={[styles.brandContainer, { backgroundColor: Colors[colorScheme].background }]}>
        <Text style={styles.textBrand}>Thương hiệu:</Text>
          <FlatList
            data={filteredBrands}
            renderItem={renderBrandItem}
            keyExtractor={(item) => item.id.toString()}
          />
        </View>
      </View>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
  },
  categoryContainer: {
    flex: 1, // 1/5 của màn hình
    padding: 10,
  },
  brandContainer: {
    flex: 4, // 4/5 của màn hình
    padding: 10,
  },
  categoryItem: {
    padding: 15,
    marginBottom: 10,
    backgroundColor: '#e0e0e0',
    borderRadius: 5,
    marginTop: 20,
  },
  selectedCategory: {
    backgroundColor: '#007bff',
  },
  categoryText: {
    fontSize: 16,
    color: '#333',
  },
  brandItem: {
    padding: 15,
    marginBottom: 10,
    backgroundColor: '#f8f8f8',
    borderRadius: 5,
    marginTop: 30,
  },
  brandText: {
    fontSize: 16,
    color: '#555',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#333',
  },
  textBrand: {
    marginTop: 50,
    fontSize: 26,
    color: '#333',
  }
});

export default CategoryScreen;
