import React, { useState, useEffect, useCallback } from 'react';
import MoldForm from '../components/MoldForm';
import MoldList from '../components/MoldList';
import { useNavigate } from 'react-router-dom';

const MoldsPage = () => {
  const [molds, setMolds] = useState([]);
  const apiUrl = process.env.REACT_APP_API_URL;
  const navigate = useNavigate();


  // useCallback to avoid re-creating the function on every render
  const fetchMolds = useCallback(async () => {
    try {
      const response = await fetch(`${apiUrl}/molds`);
      const data = await response.json();
      console.log("Fetched molds:", data);
      setMolds(data);
    } catch (error) {
      console.error('Error fetching molds:', error);
    }
  }, [apiUrl]);

  const handleDelete = async (id) => {
    console.log('Deleting mold with ID:', id);
    try {
      await fetch(`${apiUrl}/molds/${id}`, { method: 'DELETE' });
      fetchMolds();
    } catch (err) {
      console.error('Failed to delete mold:', err);
    }
  };

  const handleEdit = async (id, updatedMold) => {
    console.log('Editing mold with ID:', id, 'Data:', updatedMold);
    try {
      await fetch(`${apiUrl}/molds/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedMold),
      });
      fetchMolds();
    } catch (err) {
      console.error('Failed to update mold:', err);
    }
  };

  useEffect(() => {
    fetchMolds();
  }, [fetchMolds]); // ✅ now safe to include

  return (
    <div className="p-4">
      <button
      className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
      onClick={() => navigate('/')}
    >
      Back to Homepage
    </button>

      <h2 className="text-xl font-bold mb-4">Add a New Mold</h2>
      <MoldForm onMoldAdded={fetchMolds} />
      <MoldList molds={molds} onDelete={handleDelete} onEdit={handleEdit} />
    </div>
  );
};

export default MoldsPage;
