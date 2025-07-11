import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import BatchForm from '../components/BatchForm';
import BatchList from '../components/BatchList';

const BatchesPage = () => {
  const [batches, setBatches] = useState([]);
  const apiUrl = process.env.REACT_APP_API_URL;

  const fetchBatches = async () => {
    try {
      const response = await fetch(`${apiUrl}/batches`);
      const data = await response.json();
      setBatches(data);
    } catch (error) {
      console.error('Failed to fetch batches:', error);
    }
  };

  const handleUpdateBatch = async (id, updatedData) => {
    try {
      const response = await fetch(`${apiUrl}/batches/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData),
      });

      if (!response.ok) {
        throw new Error('Update failed');
      }

      fetchBatches(); // Refresh the list after update
    } catch (err) {
      console.error('Failed to update batch:', err);
    }
  };

  const handleDeleteBatch = async (id) => {
    try {
      const response = await fetch(`${apiUrl}/batches/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Delete failed');
      }

      fetchBatches(); // Refresh the list after deletion
    } catch (err) {
      console.error('Failed to delete batch:', err);
    }
  };

  useEffect(() => {
    fetchBatches();
  }, []);

  return (
    <div className="p-4">
      <Link to="/" className="text-blue-500 underline mb-4 inline-block">← Back to Home</Link>
      <h2 className="text-xl font-bold mb-4">Create a New Batch</h2>
      <BatchForm onBatchCreated={fetchBatches} />
      
      <h2 className="text-xl font-bold mt-6">Existing Batches</h2>
      <BatchList
        batches={batches}
        onUpdateBatch={handleUpdateBatch}
        onDeleteBatch={handleDeleteBatch}
      />
    </div>
  );
};

export default BatchesPage;
