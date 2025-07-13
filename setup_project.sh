#!/bin/bash

# Create the folder structure and empty files for a professional React Native project

# Root directories
mkdir -p src/{api,assets/{fonts,icons,images},components/{common,ui},config,context,hooks,navigation,screens/{auth,home,profile},utils}

# API files
touch src/api/{apiClient.js,authApi.js,endpoints.js}

# Config files
touch src/config/{colors.js,styles.js,theme.js}

# Context files
touch src/context/AuthContext.js

# Hooks files
touch src/hooks/{useAuth.js,useApi.js}

# Navigation files
touch src/navigation/{AppNavigator.js,AuthNavigator.js,MainNavigator.js}

# Screen files
touch src/screens/auth/{SignInScreen.js,SignUpScreen.js}
touch src/screens/home/HomeScreen.js
touch src/screens/profile/ProfileScreen.js
touch src/screens/SplashScreen.js

# Component files
touch src/components/common/{Button.js,Input.js,Loader.js}

# Utils files
touch src/utils/{helpers.js,validators.js,auth.js}

# Environment config
touch .env

echo "Professional React Native project structure created successfully!"