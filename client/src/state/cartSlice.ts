import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CartItem } from "./api";

interface CartState {
  items: CartItem[];
  totalAmount: number;
  itemCount: number;
  isLoading: boolean;
  error: string | null;
}

const initialState: CartState = {
  items: [],
  totalAmount: 0,
  itemCount: 0,
  isLoading: false,
  error: null,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setCartItems: (state, action: PayloadAction<CartItem[]>) => {
      state.items = action.payload;
      state.itemCount = action.payload.length;
      state.totalAmount = action.payload.reduce(
        (sum, item) => sum + (item.product.price * item.quantity),
        0
      );
    },
    addItem: (state, action: PayloadAction<CartItem>) => {
      const existingItem = state.items.find(
        (item) => item.productId === action.payload.productId
      );
      
      if (existingItem) {
        existingItem.quantity += action.payload.quantity;
      } else {
        state.items.push(action.payload);
      }
      
      state.itemCount = state.items.length;
      state.totalAmount = state.items.reduce(
        (sum, item) => sum + (item.product.price * item.quantity),
        0
      );
    },
    updateItemQuantity: (state, action: PayloadAction<{ productId: string; quantity: number }>) => {
      const { productId, quantity } = action.payload;
      const item = state.items.find((item) => item.productId === productId);
      
      if (item) {
        if (quantity <= 0) {
          state.items = state.items.filter((item) => item.productId !== productId);
        } else {
          item.quantity = quantity;
        }
        
        state.itemCount = state.items.length;
        state.totalAmount = state.items.reduce(
          (sum, item) => sum + (item.product.price * item.quantity),
          0
        );
      }
    },
    removeItem: (state, action: PayloadAction<string>) => {
      const productId = action.payload;
      state.items = state.items.filter((item) => item.productId !== productId);
      state.itemCount = state.items.length;
      state.totalAmount = state.items.reduce(
        (sum, item) => sum + (item.product.price * item.quantity),
        0
      );
    },
    clearCart: (state) => {
      state.items = [];
      state.itemCount = 0;
      state.totalAmount = 0;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const {
  setCartItems,
  addItem,
  updateItemQuantity,
  removeItem,
  clearCart,
  setLoading,
  setError,
} = cartSlice.actions;

export default cartSlice.reducer;
