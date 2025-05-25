import React from 'react';
import MoldForm from '../components/MoldForm'; 
import MoldList from '../components/MoldList';


const MoldsPage = () => {
  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Add a New Mold</h2>
      <MoldForm />
      <MoldList />
    </div>
  );
};

export default MoldsPage;