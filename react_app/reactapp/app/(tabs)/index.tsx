import React, { useEffect, useRef, useState } from "react";
import { Image, StyleSheet, FlatList, ScrollView, TouchableOpacity, Text, View, Dimensions, TextInput, RefreshControl, ActivityIndicator 
} from "react-native";
import { ThemedView } from "@/components/ThemedView";
import axios from "axios";
import { useRouter } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";
import Toast from 'react-native-toast-message';
import { useUser } from '../(auth)/UserContext';

const { width } = Dimensions.get("window");

interface Product {
  id: number;
  name: string;
  screen: string;
  display: string;
  price: string;
  salePrice?: string;
  discount?: string;
  stock: number;
  totalStock: number;
  categoryId: number;
  imagePaths: any[];
  colors: string[];
  quantity?: number;
}
interface ItemBanner {
  id: number;
  name: string;
  image: string; // Giữ nguyên kiểu string cho hình ảnh banner
}
interface ItemCategory {
  id: number;
  slug: string;
  name: string;
  image: string;
}
const getLuminance = (color: string) => {
  const hex = color.replace("#", "");
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  return 0.299 * r + 0.587 * g + 0.114 * b;
};
const getCheckmarkColor = (color: string) => {
  const luminance = getLuminance(color);
  return luminance > 130 ? "black" : "white"; // Độ sáng > 186 thì dùng dấu tích màu đen, ngược lại dùng màu trắng
};

export default function HomeScreen() {
  const [products, setProducts] = useState<Product[]>([]);
  const [dataBanner, setDataBanner] = useState<ItemBanner[]>([]);
  const [dataCategory, setDataCategory] = useState<ItemCategory[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const clearSearch = () => {
    setSearchQuery('');
  };
  const router = useRouter();
  const scrollViewRef = useRef<ScrollView>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedColors, setSelectedColors] = useState<{
    [key: number]: number;
  }>({});
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [cart, setCart] = useState<Product[]>([]);
  const cartItemCount = cart.length;
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { userInfo, setUserInfo } = useUser();

  useEffect(() => {
    fetchData();
  }, []);
  const fetchData = async () => {
    setIsLoading(true);
    try {
      const productsResponse = await axios.get<Product[]>('http://172.20.10.4:8080/api/products');
      const bannerResponse = await axios.get<ItemBanner[]>('http://172.20.10.4:8080/api/banners');
      const categoryResponse = await axios.get<ItemCategory[]>('http://172.20.10.4:8080/api/categories');

      setProducts(productsResponse.data);
      setDataBanner(bannerResponse.data);
      setDataCategory(categoryResponse.data);
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu:", error);
    }
    finally {
      setIsLoading(false); // Kết thúc trạng thái tải
    }
  };
const fetchCartItems = async () => {
  try {
    const response = await axios.get('http://172.20.10.4:8080/api/cart/');
    const cartItems = response.data;
    setCart(cartItems);
  } catch (error) {
    console.error("Lỗi khi lấy sản phẩm trong giỏ hàng:", error);
  }finally {
  }
};
useEffect(() => {
  fetchCartItems();
}, []);


const handleAddToCart = async (product: Product) => {
  try {
    const selectedColorIndex = selectedColors[product.id] || 0;
    const selectedColor = product.colors[selectedColorIndex];
    const selectedImagePath = product.imagePaths[selectedColorIndex];
    const cartItem = {
      productId: product.id,
      productName: product.name,
      price: product.salePrice || product.price,
      quantity: 1, // Mỗi lần thêm vào giỏ hàng mặc định là 1
      selectedColor: selectedColor,
      selectedImagePath: selectedImagePath,
    };
    const response = await axios.post('http://172.20.10.4:8080/api/cart/add', cartItem);
    fetchCartItems(); // Gọi lại hàm để làm mới giỏ hàng từ API
    Toast.show({
      type: 'success',
      text1: 'Thêm vào giỏ hàng',
      text2: `${product.name} đã được thêm vào giỏ hàng!`,
      position: 'top',
      visibilityTime: 3000,
    });
  } catch (error) {
    console.error("Lỗi khi thêm sản phẩm vào giỏ hàng:", error);
    Toast.show({
      type: 'error',
      text1: 'Có lỗi xảy ra',
      text2: 'Không thể thêm sản phẩm vào giỏ hàng.',
    });
  }
};
const handleAddToCartPay = async (product: Product) => {
  if (!userInfo) {
    // Hiển thị thông báo toast nếu chưa đăng nhập
    Toast.show({
      type: 'error',
      text1: 'Chưa đăng nhập',
      text2: 'Bạn cần đăng nhập để thực hiện mua hàng!',
    });
  } else {
    try {
      const selectedColorIndex = selectedColors[product.id] || 0;
      const selectedColor = product.colors[selectedColorIndex];
      const selectedImagePath = product.imagePaths[selectedColorIndex];
      const cartItem = {
        productId: product.id,
        productName: product.name,
        price: product.salePrice || product.price,
        quantity: 1, // Mỗi lần thêm vào giỏ hàng mặc định là 1
        selectedColor: selectedColor,
        selectedImagePath: selectedImagePath,
      };
      const response = await axios.post('http://172.20.10.4:8080/api/cart/add', cartItem);
      fetchCartItems(); // Gọi lại hàm để làm mới giỏ hàng từ API
      router.push("../(product)/pay");
    } catch (error) {
      console.error("Lỗi khi thêm sản phẩm vào giỏ hàng:", error);
      Toast.show({
        type: 'error',
        text1: 'Có lỗi xảy ra',
        text2: 'Không thể thêm sản phẩm vào giỏ hàng.',
      });
    }
  }
};
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        const nextIndex = (prevIndex + 1) % dataBanner.length;
        scrollViewRef.current?.scrollTo({
          x: nextIndex * width,
          animated: true,
        });
        return nextIndex;
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [dataBanner]);
  
  useEffect(() => {
    if (selectedCategoryId !== null) {
      axios
        .get<Product[]>(`http://172.20.10.4:8080/api/products/category/${selectedCategoryId}`)
        .then((response) => {
          setProducts(response.data);
        })
        .catch((error) => {
          console.error("Có lỗi xảy ra khi lấy sản phẩm theo category:", error);
        });
    }
  }, [selectedCategoryId]);

  const onRefresh = async () => {
    setRefreshing(true); // Hiển thị vòng quay làm mới
    await fetchData();    // Lấy lại dữ liệu mới
    await fetchCartItems();
    setSelectedCategoryId(null);
    setRefreshing(false); // Tắt vòng quay làm mới
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={styles.loadingText}>Đang tải...</Text>
      </View>
    );
  }

  const renderProduct = ({ item }: { item: Product }) => {
    const selectedColorIndex = selectedColors[item.id] || 0;
  
    return (
      <TouchableOpacity
        style={styles.productContainer}
        onPress={() =>
          router.push(`../(product)/product_detail?id=${item.id}`)
        }
      >
        <Image
          source={{ uri: `http://172.20.10.4/images/${item.imagePaths[selectedColorIndex]}` }}
          style={styles.productImage}
        />
        <TouchableOpacity style={styles.installmentButton}>
          <Text style={styles.installmentText}>Trả góp 0%</Text>
        </TouchableOpacity>
  
        <Text style={styles.productName} numberOfLines={2} ellipsizeMode="tail">
          {item.name}
        </Text>
  
        <View style={styles.infoContainer}>
          <View style={styles.infoBox}>
            <Text style={styles.infoText}>{item.screen}</Text>
          </View>
          <View style={styles.infoBox}>
            <Text style={styles.infoText}>{item.display}</Text>
          </View>
        </View>
  
        <View style={styles.colorContainer}>
          {item.colors.map((color, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.colorButton,
                { backgroundColor: color },
                selectedColorIndex === index && styles.selectedColorButton,
              ]}
              onPress={() =>
                setSelectedColors((prev) => ({ ...prev, [item.id]: index }))
              }
            >
              {selectedColorIndex === index && (
                <Text
                  style={[
                    styles.checkmark,
                    { color: getCheckmarkColor(color) },
                  ]}
                >
                  ✓
                </Text>
              )}
            </TouchableOpacity>
          ))}
        </View>
  
        <View style={styles.priceContainer}>
          {item.salePrice && item.salePrice !== '0' ? (
            <>
              <Text style={styles.salePrice}>{parseInt(item.salePrice).toLocaleString('vi-VN')}</Text>
              <View style={styles.originalPriceContainer}>
                <Text style={styles.originalPrice}>{parseInt(item.price).toLocaleString('vi-VN')}</Text>
                {item.discount && (
                  <Text style={styles.discount}>{item.discount}</Text>
                )}
              </View>
            </>
          ) : (
            <Text style={styles.salePrice}>{parseInt(item.price).toLocaleString('vi-VN')}</Text> // Hiển thị giá gốc dưới dạng salePrice nếu salePrice bằng 0 hoặc không có
          )}
        </View>
        <View style={styles.stockContainer}>
          <Text style={styles.stockText}>
            {item.stock}/{item.totalStock}
          </Text>
        </View>
        <View style={styles.buttonContainer}>
  <TouchableOpacity style={styles.addToCartButton} onPress={() => handleAddToCart(item)} >
    <Text style={styles.buyNowText}>Thêm vào giỏ</Text>
  </TouchableOpacity>
  
  <TouchableOpacity style={styles.buyNowButton} onPress={() => handleAddToCartPay(item)}>
    <Text style={styles.buyNowText}>Mua ngay</Text>
  </TouchableOpacity>
</View>
      </TouchableOpacity>
    );
  };  

  return (
    <ThemedView style={{ flex: 1 }}>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
      {/* Thanh tìm kiếm và giỏ hàng */}
      <View style={styles.headerContainer}>
        <View style={styles.searchContainer}>
          <FontAwesome
            name="search"
            size={20}
            color="#000"
            style={styles.searchIcon}
          />
          <TextInput
        style={styles.searchInput}
        placeholder="Tìm kiếm sản phẩm..."
        placeholderTextColor="#000000"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      {/* Nút "dấu X" để xóa ký tự */}
      {searchQuery.length > 0 && ( // Hiển thị nút nếu có ký tự
        <TouchableOpacity onPress={clearSearch} style={styles.clearButton}>
          <Text style={styles.clearButtonText}>X</Text>
        </TouchableOpacity>
      )}
        </View>
        <TouchableOpacity onPress={() => router.push("../(product)/cart")} style={styles.cartButton}>
        <FontAwesome
          name="shopping-cart"
          size={24}
          color="#000"
          style={styles.cartIcon}
        />
        {cartItemCount > 0 && (
          <View style={styles.cartBadge}>
            <Text style={styles.cartBadgeText}>{cartItemCount}</Text>
          </View>
        )}
      </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={styles.bannerContainer}>
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            ref={scrollViewRef}
            style={styles.bannerScrollView}
          >
            {dataBanner.map((banner, index) => (
              <Image
                key={index}
                source={{ uri: `http://172.20.10.4/images/${banner.image}` }}
                style={styles.banner}
                resizeMode="cover"
              />
            ))}
          </ScrollView>
        </View>
        <View style={styles.categoryContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {dataCategory.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.categoryButton,
                selectedCategoryId === category.id && styles.selectedCategoryButton,
              ]}
              onPress={() => setSelectedCategoryId(category.id)}
            >
              <Text
                style={[
                  styles.categoryText,
                  selectedCategoryId === category.id && styles.selectedCategoryText,
                ]}
              >
                {category.name}
              </Text>
              <Image
                source={{ uri: `http://172.20.10.4/images/${category.image}` }}
                style={styles.categoryImage}
                resizeMode="cover"
              />
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

        <FlatList
          data={filteredProducts}
          renderItem={renderProduct}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          contentContainerStyle={styles.productList}
          scrollEnabled={false} //{/* Tắt cuộn riêng cho FlatList */}
        />
      </ScrollView>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  productContainer: {
    marginTop: 10,
    flex: 1,
    margin: 3,
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  installmentButton: {
    position: "absolute",
    right: 5,
    top: 5, // Điều chỉnh khoảng cách nút trả góp lên trên
    backgroundColor: "#e0e0e0",
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 2,
  },
  installmentText: {
    fontSize: 12,
    color: "#333",
  },
  productImage: {
    width: "100%",
    height: width / 2.5,
    resizeMode: "contain",
    marginTop: 20,
    marginBottom: 10,
  },
  productName: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
    height: 40, // Giới hạn chiều cao cho tên sản phẩm
    overflow: "hidden", // Ẩn phần tên vượt quá
  },
  infoContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  infoBox: {
    width: 70, // Cố định chiều rộng
    height: 80, // Cố định chiều cao
    backgroundColor: "#f0f0f0",
    borderRadius: 5,
    padding: 5,
    marginHorizontal: 5,
    alignItems: "center", // Canh giữa theo chiều ngang
    justifyContent: "center", // Canh giữa theo chiều dọc
  },
  infoText: {
    fontSize: 14,
    color: "#666",
    textAlign: "center", // Canh giữa text theo chiều ngang
  },
  colorContainer: {
    marginTop: 5,
    flexDirection: "row",
    marginBottom: 10,
  },
  colorButton: {
    width: 25,
    height: 25,
    borderRadius: 20,
    marginRight: 3,
    borderWidth: 1,
    borderColor: "#ddd",
    alignItems: "center",
    justifyContent: "center", // Để đặt dấu tích ở giữa
  },
  priceContainer: {
    width: 1000, // Cố định chiều rộng
    height: 40, // Cố định chiều cao
    marginBottom: 10,
  },
  salePrice: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#e74c3c",
    marginBottom: 5,
  },
  originalPriceContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  originalPrice: {
    fontSize: 14,
    color: "#000",
    textDecorationLine: "line-through",
    marginRight: 5,
  },
  discount: {
    fontSize: 14,
    color: "#e74c3c",
  },
  stockContainer: {
    alignItems: "center",
    marginBottom: 10,
    borderRadius: 20, // Bo tròn 2 đầu thanh tiến trình
    overflow: "hidden",
    backgroundColor: "#fbc02d",
    paddingHorizontal: 5,
  },
  stockText: {
    fontSize: 14,
  },
  buyNowButton: {
    flex: 1, // Làm cho nút này chiếm không gian còn lại
    padding: 3, // Padding cho nút
    backgroundColor: '#28A745', // Màu nền cho nút "Mua ngay"
    borderRadius: 20, // Bo góc cho nút
    alignItems: 'center', // Căn giữa chữ
  },
  buyNowText: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: 'center'
  },
  productList: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  selectedColorButton: {
    borderWidth: 3, // Đường viền lớn hơn khi màu được chọn
    borderColor: "#000", // Màu viền khi được chọn
  },
  checkmark: {
    fontSize: 12, // Kích thước dấu tích
    fontWeight: "bold",
    alignItems: "center",
  },
  //
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    marginTop: 40,
    marginLeft: 20,
    marginRight: 20,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    flex: 1,
    marginRight: 16,
    paddingHorizontal: 10,
    borderColor: "#e74c3c",
    borderWidth: 1,
    marginBottom: 3,
  },
  searchInput: {
    height: 40,
    flex: 1,
    marginLeft: 8,
  },
  searchIcon: {
    marginLeft: 8,
  },
  cartIcon: {
    marginRight: 0,
  },
  bannerContainer: {
    width: "100%",
    height: 150,
    marginTop: 10,
  },
  bannerScrollView: {
    flex: 1,
  },
  banner: {
    width: width,
    height: "100%",
  },
  category: {
    alignSelf: "center",
    width: 80,
    height: 40,
  },
  categoryImage: {
    marginTop: 15,
    width: "100%",
    height: width / 5.5,
    resizeMode: "contain",
  },
  categoryContainer: {
    marginTop: 15,
    paddingHorizontal: 16,
    paddingBottom: 10,
    height: 150,
  },
  categoryButton: {
    backgroundColor: "#fff",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 20,
    marginRight: 10,
    width: 111,
  },
  categoryText: {
    marginTop: 10,
    fontSize: 16,
    textAlign: "center",
    fontWeight: "500",
  },
  cartButton: {
    position: 'relative',
    padding: 6,
    marginRight: -20,
  },
  cartBadge: {
    position: 'absolute',
    right: 0,
    top: -5,
    backgroundColor: 'red',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  selectedCategoryButton: {
    backgroundColor: '#fff', // Màu nền khi category được chọn
    borderColor: '#550000', // Viền khi category được chọn
    borderWidth: 2, // Viền dày hơn khi được chọn
    height: 135,
    width: 100,
  },
  selectedCategoryText: {
    color: 'red', // Màu chữ khi category được chọn (trắng để dễ nhìn)
    marginTop: 1,
    fontSize: 14,
    textAlign: "center",
    fontWeight: "500",
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between', // Căn chỉnh khoảng cách giữa hai nút
  },
  addToCartButton: {
    flex: 1, // Làm cho nút này chiếm không gian còn lại
    marginRight: 10, // Khoảng cách giữa hai nút
    padding: 3, // Padding cho nút
    backgroundColor: '#007BFF', // Màu nền cho nút "Thêm vào giỏ hàng"
    borderRadius: 20, // Bo góc cho nút
    alignItems: 'center', // Căn giữa chữ
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
  clearButton: {
    padding: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  clearButtonText: {
    fontSize: 20,
    color: '#e83e52', // Màu cho nút "dấu X"
    padding: 5,
  },
});

function setCurrentIndex(arg0: (prevIndex: any) => number) {
  throw new Error("Function not implemented.");
}
