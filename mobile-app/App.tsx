/**
 * gadizone Mobile App - Main Entry Point
 */

import React from 'react';
import { StatusBar } from 'expo-status-bar';
import RootNavigator from './src/navigation';
import { FavouritesProvider } from './src/context/FavouritesContext';

export default function App() {
  return (
    <FavouritesProvider>
      <StatusBar style="dark" />
      <RootNavigator />
    </FavouritesProvider>
  );
}
