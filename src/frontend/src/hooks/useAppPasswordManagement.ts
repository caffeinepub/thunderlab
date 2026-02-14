import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { useActor } from './useActor';
import { useAppPassword } from './useAppPassword';
import { hashAppPassword } from '../security/hashAppPassword';

export function useAppPasswordManagement() {
  const { actor } = useActor();
  const { unlockAccount, savePassword } = useAppPassword();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const [isChanging, setIsChanging] = useState(false);
  const [isLocking, setIsLocking] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  const changePassword = async (currentPassword: string, newPassword: string): Promise<boolean> => {
    if (!actor) return false;
    setIsChanging(true);
    try {
      // Verify current password
      const isValid = await unlockAccount(currentPassword);
      if (!isValid) {
        return false;
      }
      // Save new password
      const success = await savePassword(newPassword);
      if (success) {
        queryClient.invalidateQueries({ queryKey: ['unlockStatus'] });
      }
      return success;
    } catch (error) {
      console.error('Change password error:', error);
      return false;
    } finally {
      setIsChanging(false);
    }
  };

  const lockNow = async (): Promise<void> => {
    if (!actor) return;
    setIsLocking(true);
    try {
      await actor.logout();
      queryClient.invalidateQueries({ queryKey: ['unlockStatus'] });
      navigate({ to: '/unlock' });
    } catch (error) {
      console.error('Lock error:', error);
    } finally {
      setIsLocking(false);
    }
  };

  const resetPassword = async (newPassword: string): Promise<boolean> => {
    if (!actor) return false;
    setIsResetting(true);
    try {
      // User is already authenticated with Internet Identity
      // Just set new password and unlock
      const success = await savePassword(newPassword);
      if (success) {
        await unlockAccount(newPassword);
        queryClient.invalidateQueries({ queryKey: ['unlockStatus'] });
      }
      return success;
    } catch (error) {
      console.error('Reset password error:', error);
      return false;
    } finally {
      setIsResetting(false);
    }
  };

  return {
    changePassword,
    lockNow,
    resetPassword,
    isChanging,
    isLocking,
    isResetting,
  };
}
