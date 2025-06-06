import React, { useState } from 'react';

const MoldForm = ({ onMoldAdded }) => {
  const [version, setVersion] = useState('');
  const [label, setLabel] = useState('');
  const [size, setSize] = useState('');
  const [moldUses, setMoldUses] = useState('');
  const apiUrl = process.env.REACT_APP_API_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await fetch(`${apiUrl}/molds`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ version, label, size, mold_uses: Number(moldUses) }),
      });

      // Clear form
      setVersion('');
      setLabel('');
      setSize('');
      setMoldUses('');

      if (onMoldAdded) onMoldAdded();
    } catch (error) {
      console.error('Error adding mold:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        value={version}
        onChange={(e) => setVersion(e.target.value)}
        placeholder="Version"
        className="border p-2"
      />
      <input
        type="text"
        value={label}
        onChange={(e) => setLabel(e.target.value)}
        placeholder="Label"
        className="border p-2"
      />
      <input
        type="text"
        value={size}
        onChange={(e) => setSize(e.target.value)}
        placeholder="Size"
        className="border p-2"
      />
      <input
        type="number"
        value={moldUses}
        onChange={(e) => setMoldUses(e.target.value)}
        placeholder="Mold Uses"
        className="border p-2"
        min="0"
      />
      <button type="submit" className="bg-blue-500 text-white px-4 py-2">Add Mold</button>
    </form>
  );
};

export default MoldForm;
