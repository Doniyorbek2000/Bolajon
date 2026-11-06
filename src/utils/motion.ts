import { useEffect, useState } from 'react';
import { AccessibilityInfo } from 'react-native';

/** Tizimdagi "Harakatni kamaytirish" sozlamasi (iOS Reduce Motion / Android Remove animations). */
export function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled()
      .then(setReduced)
      .catch(() => {});
    const sub = AccessibilityInfo.addEventListener('reduceMotionChanged', setReduced);
    return () => sub.remove();
  }, []);
  return reduced;
}
