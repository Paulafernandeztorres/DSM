import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Provider, useDispatch, useSelector } from "react-redux";

import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import AdminTabs from "./screens/AdminTabs";
import UserTabs from "./screens/UserTabs";

import { auth } from "./firebase/config";
import { onAuthStateChanged } from "firebase/auth";
import store from "./redux/store";
import { setUser, clearUser } from "./redux/authSlice";
import Toast from "react-native-toast-message";

const Stack = createNativeStackNavigator();

function AppContent() {
  const dispatch = useDispatch();
  const { user, loading, role } = useSelector((state) => state.auth);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        dispatch(setUser(user.uid));
      } else {
        dispatch(clearUser());
      }
    });

    return unsubscribe;
  }, [dispatch]);

  if (loading) {
    return null; // O algún splash screen, loader, etc.
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {user ? (
          role === "admin" ? (
            <Stack.Screen name="AdminTabs" component={AdminTabs} />
          ) : role === "user" ? (
            <>
              <Stack.Screen name="UserTabs" component={UserTabs} />
            </>
          ) : null
        ) : (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <AppContent />
      <Toast />
    </Provider>
  );
}
