'use server';

import { headers } from 'next/headers';

import auth from '../auth';

const hasRoleAPI = async (role: string): Promise<boolean> => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return (
    session?.user.role?.toLocaleLowerCase().split(',').includes(role.toLocaleLowerCase()) ?? false
  );
};

export default hasRoleAPI;
