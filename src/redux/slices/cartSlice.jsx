import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isVisible: false,
  items: localStorage.getItem("cartItems")
    ? JSON.parse(localStorage.getItem("cartItems"))
    : [],
  productsNumber: localStorage.getItem("cartProductsNumber")
    ? parseInt(localStorage.getItem("cartProductsNumber"))
    : 0,
  totalAmount: localStorage.getItem("cartTotalAmount")
    ? parseFloat(localStorage.getItem("cartTotalAmount"))
    : 0,
  totalAuthenticatedAmount: localStorage.getItem("cartTotalAuthenticatedAmount")
    ? parseFloat(localStorage.getItem("cartTotalAuthenticatedAmount"))
    : 0,
};

const cart = createSlice({
  name: "cart",
  initialState: initialState,
  reducers: {
    clearCart(state, action) {
      // Clear local storage
      localStorage.removeItem("cartItems");
      localStorage.removeItem("cartProductsNumber");
      localStorage.removeItem("cartTotalAmount");
      localStorage.removeItem("cartTotalAuthenticatedAmount");
      // Reset state to initial values
      return initialState;
    },
    addToCart(state, action) {
      const { product, qty, token = null } = action.payload;
      const existingItem = state.items.find((item) => item.id === product.id);

      if (existingItem) {
        // Adjust quantity if qty is positive and won't exceed available quantity
        if (qty > 0 && existingItem.qty >= existingItem.quantity + qty) {
          existingItem.quantity += qty;
        } else {
          existingItem.quantity += qty;
        }
      } else {
        // Add new item to state if it doesn't exist
        state.productsNumber += 1;
        state.items.push({ ...product, quantity: qty });
      }

      // Calculate totalAmount
      state.totalAmount = state.items.reduce((acc, item) => {
        if (item.sale) {
          return (
            acc + (item.price - (item.price * item.sale) / 100) * item.quantity
          );
        } else {
          return acc + item.price * item.quantity;
        }
      }, 0);

      // Calculate totalAuthenticatedAmount
      state.totalAuthenticatedAmount = state.items.reduce((acc, item) => {
        if (item.sale) {
          return (
            acc +
            (item.price_for_authenticated -
              (item.price_for_authenticated * item.sale) / 100) *
              item.quantity
          );
        } else {
          return acc + item.price_for_authenticated * item.quantity;
        }
      }, 0);

      if (token) {
        axios.post(
          `${process.env.REACT_APP_API_URL}/orders/cart/`,
          {
            product: product.slug,
            quantity: qty,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }
      localStorage.setItem("cartItems", JSON.stringify(state.items));
      localStorage.setItem(
        "cartTotalAmount",
        JSON.stringify(state.totalAmount)
      );
      localStorage.setItem(
        "cartProductsNumber",
        JSON.stringify(state.productsNumber)
      );
      localStorage.setItem(
        "cartTotalAuthenticatedAmount",
        JSON.stringify(state.totalAuthenticatedAmount)
      );
    },
    updateQuantity(state, action) {
      const { slug, quantity, token } = action.payload;
      const existingItem = state.items.find((item) => item.slug === slug);

      if (existingItem) {
        existingItem.quantity = Math.max(0, quantity); // Ensure quantity is not negative

        if (existingItem.quantity === 0) {
          // Remove item if quantity is zero
          state.items = state.items.filter((item) => item.slug !== slug);
          state.productsNumber -= 1;
        }
      }

      // Recalculate total amount and total authenticated amount
      state.totalAmount = state.items.reduce((acc, item) => {
        if (item.sale) {
          return (
            acc + (item.price - (item.price * item.sale) / 100) * item.quantity
          );
        } else {
          return acc + item.price * item.quantity;
        }
      }, 0);

      // Calculate totalAuthenticatedAmount
      state.totalAuthenticatedAmount = state.items.reduce((acc, item) => {
        if (item.sale) {
          return (
            acc +
            (item.price_for_authenticated -
              (item.price_for_authenticated * item.sale) / 100) *
              item.quantity
          );
        } else {
          return acc + item.price_for_authenticated * item.quantity;
        }
      }, 0);

      // Make API call if token is provided
      if (token) {
        axios.put(
          `${process.env.REACT_APP_API_URL}/orders/cart/`,
          {
            product: slug,
            quantity: quantity,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }

      // Update localStorage
      localStorage.setItem("cartItems", JSON.stringify(state.items));
      localStorage.setItem(
        "cartTotalAmount",
        JSON.stringify(state.totalAmount)
      );
      localStorage.setItem(
        "cartProductsNumber",
        JSON.stringify(state.productsNumber)
      );
      localStorage.setItem(
        "cartTotalAuthenticatedAmount",
        JSON.stringify(state.totalAuthenticatedAmount)
      );
    },

    removeFromCart(state, action) {
      const { product, token } = action.payload;
      const itemIndex = state.items.findIndex((item) => item.id === product.id);
      if (itemIndex > -1) {
        state.items.splice(itemIndex, 1);

        state.totalAmount = state.items.reduce((acc, item) => {
          if (item.sale) {
            return (
              acc +
              (item.price - (item.price * item.sale) / 100) * item.quantity
            );
          } else {
            return acc + item.price * item.quantity;
          }
        }, 0);

        state.totalAuthenticatedAmount = state.items.reduce((acc, item) => {
          if (item.sale) {
            return (
              acc +
              (item.price_for_authenticated -
                (item.price_for_authenticated * item.sale) / 100) *
                item.quantity
            );
          } else {
            return acc + item.price_for_authenticated * item.quantity;
          }
        }, 0);
        state.productsNumber -= 1;
      }
      if (token) {
        axios.delete(
          `${process.env.REACT_APP_API_URL}/orders/cart/?product=${product.slug}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }

      localStorage.setItem("cartItems", JSON.stringify(state.items));
      localStorage.setItem(
        "cartTotalAmount",
        JSON.stringify(state.totalAmount)
      );
      localStorage.setItem(
        "cartProductsNumber",
        JSON.stringify(state.productsNumber)
      );
      localStorage.setItem(
        "cartTotalAuthenticatedAmount",
        JSON.stringify(state.totalAuthenticatedAmount)
      );
    },
    setCartItemQuantity(state, action) {
      const itemIndex = state.items.findIndex(
        (item) => item.id === action.payload.id
      );
      if (itemIndex > -1) {
        state.items[itemIndex].quantity = action.payload.quantity;
      }
    },
    isInCart(state, action) {
      const { productId } = action.payload;
      if (state.items && state.items.length > 0) {
        return state.items.filter((item) => item.id === productId);
      }
      return false;
    },

    openMenu: (state) => {
      state.isVisible = true;
    },
    closeMenu: (state) => {
      state.isVisible = false;
    },
    toggleCart: (state) => {
      state.isVisible = !state.isVisible;
    },
    setActiveItem: (state, action) => {
      state.activeItem = action.payload;
    },
    clearActiveItem: (state) => {
      state.activeItem = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCartItems.pending, (state) => {
        state.items = [];
        state.totalAmount = 0;
        state.totalAuthenticatedAmount = 0;
        state.productsNumber = 0;
      })
      .addCase(fetchCartItems.fulfilled, (state, action) => {
        let items = [];
        if (action.payload && action.payload.length > 0) {
          action.payload.map((item) => {
            let product = item.product;
            product.quantity = item.quantity;
            items.push(product);
            return item;
          });
        }
        state.items = items;
        state.totalAmount = state.items.reduce((acc, item) => {
          if (item.sale) {
            return (
              acc +
              (item.price - (item.price * item.sale) / 100) * item.quantity
            );
          } else {
            return acc + item.price * item.quantity;
          }
        }, 0);

        state.totalAuthenticatedAmount = state.items.reduce((acc, item) => {
          if (item.sale) {
            return (
              acc +
              (item.price_for_authenticated -
                (item.price_for_authenticated * item.sale) / 100) *
                item.quantity
            );
          } else {
            return acc + item.price_for_authenticated * item.quantity;
          }
        }, 0);
        state.productsNumber = state.items.length;
      })
      .addCase(fetchCartItems.rejected, (state, action) => {
        console.error("Error fetching cart items:", action.error);
      });
  },
});

const fetchCartItems = createAsyncThunk(
  "cart/fetchCartItems",
  async ({ token }, thunkAPI) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/orders/cart/`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response.data.message || error.message
      );
    }
  }
);

export const {
  isInCart,
  clearCart,
  closeMenu,
  toggleCart,
  updateQuantity,
  setActiveItem,
  clearActiveItem,
  openMenu,
  addToCart,
  removeFromCart,
  setCartItemQuantity,
} = cart.actions;
export { fetchCartItems };
export default cart.reducer;
