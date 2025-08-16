'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from '../../../../src/routes/hooks';
import { PATH_AFTER_LOGIN } from '../../../../src/config-global'; // Update this with the correct path to your config file
import SplashScreen from '../splashScreen'; // Adjust the import path as needed

export default function ServicesPage() {
  const [showSplash, setShowSplash] = useState(true); // State to manage splash screen visibility
  const router = useRouter();

  useEffect(() => {
    // Display splash screen for 2 seconds
    const timer = setTimeout(() => {
      setShowSplash(false); // Hide splash screen after timeout
      router.push(PATH_AFTER_LOGIN); // Navigate to login path
    }, 4000); // Adjust the duration as needed

    return () => clearTimeout(timer); // Cleanup the timer on component unmount
  }, [router]);

  // Render the splash screen while `showSplash` is true, else render null to trigger redirection
  return showSplash ? <SplashScreen /> : null;
}
