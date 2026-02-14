import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { hashAppPassword } from '../security/hashAppPassword';

export function useAppPassword() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  const [isUnlocking, setIsUnlocking] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const unlockAccount = async (password: string): Promise<boolean> => {
    if (!actor) return false;
    setIsUnlocking(true);
    try {
      const passwordHash = await hashAppPassword(password);
      const result = await actor.unlockAccount(passwordHash);
      if (result) {
        queryClient.invalidateQueries({ queryKey: ['unlockStatus'] });
      }
      return result;
    } catch (error) {
      console.error('Unlock error:', error);
      return false;
    } finally {
      setIsUnlocking(false);
    }
  };

  const savePassword = async (password: string): Promise<boolean> => {
    if (!actor) return false;
    setIsSaving(true);
    try {
      const passwordHash = await hashAppPassword(password);
      await actor.saveAppPassword(passwordHash);
      queryClient.invalidateQueries({ queryKey: ['unlockStatus'] });
      return true;
    } catch (error) {
      console.error('Save password error:', error);
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  return {
    unlockAccount,
    savePassword,
    isUnlocking,
    isSaving,
  };
}
