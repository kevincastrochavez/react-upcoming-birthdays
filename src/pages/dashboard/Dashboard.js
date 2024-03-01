import React from 'react';

import { useUserUid } from '../../components/BirthdayProvider';

function Dashboard() {
  const { userUid } = useUserUid();
  console.log(userUid);

  return <div>Dashboard</div>;
}

export default Dashboard;
