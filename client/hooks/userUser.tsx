import { useContext } from 'react';
import { UserContext } from '../contexts/UserContext';

const useUser = () => {
  const context = useContext(UserContext);

  if (!context) {
    throw new Error('useUser hook must be use within UserProvider');
  }

  return context;
};

export default useUser;
