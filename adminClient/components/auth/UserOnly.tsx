import { useRouter } from 'expo-router';
import { ReactNode, useEffect } from 'react';
import { Text } from 'react-native';
import useUser from '../../hooks/userUser';

interface UserOnlyProps {
  children: ReactNode;
}

const UserOnly = ({ children }: UserOnlyProps) => {
  const { user, authChecked } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (authChecked && user === null) {
      router.replace('/login');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, authChecked]);

  if (!authChecked || !user) {
    return <Text>Loading...</Text>;
  }

  return children;
};

export default UserOnly;
