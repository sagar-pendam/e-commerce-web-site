// components/NavigationAwareScroll.jsx
import { useEffect } from 'react';
import { useNavigationType, useLocation } from 'react-router-dom';

export default function NavigationAwareScroll() {
  const navigationType = useNavigationType();
  const { pathname } = useLocation();

  useEffect(() => {
    // Only scroll on PUSH navigation (clicked links)
    if (navigationType === 'PUSH') {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  }, [pathname, navigationType]);

  return null;
}