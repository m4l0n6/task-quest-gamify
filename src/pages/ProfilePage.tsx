
import React from 'react';
import ProfileCard from '@/components/profile/ProfileCard';

const ProfilePage: React.FC = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Your Profile</h1>
      <ProfileCard />
    </div>
  );
};

export default ProfilePage;
