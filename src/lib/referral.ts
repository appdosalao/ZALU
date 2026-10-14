import { storage } from '@/lib/localStorage';

export const REFERRAL_CODE_STORAGE_KEY = 'zalu-referral-code';
const REFERRAL_CODE_PATTERN = /^[A-Z0-9]{6,8}$/;

export const normalizeReferralCode = (value: string | null | undefined) => {
  const normalized = value?.trim().toUpperCase() ?? '';
  return REFERRAL_CODE_PATTERN.test(normalized) ? normalized : '';
};

export const getStoredReferralCode = () =>
  normalizeReferralCode(storage.getString(REFERRAL_CODE_STORAGE_KEY));

export const storeReferralCode = (code: string) => {
  if (code) storage.setString(REFERRAL_CODE_STORAGE_KEY, code);
  else storage.removeItem(REFERRAL_CODE_STORAGE_KEY);
};
