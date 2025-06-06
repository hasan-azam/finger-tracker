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
      //setVersion('');
      setLabel('');
     // setSize('');
      setMoldUses('');

      if (onMoldAdded) onMoldAdded();
    } catch (error) {
      console.error('Error adding mold:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <select
        value={version}
        onChange={(e) => setVersion(e.target.value)}
        className="border p-2 w-full"
        required
      >
        <option value="" disabled>Select Version</option>
        <option value="9.0">9.0</option>
        <option value="9.5">9.5</option>
      </select>



      <select
        value={size}
        onChange={(e) => setSize(e.target.value)}
        className="border p-2 w-full"
        required
      >
        <option value="" disabled>Select Size</option>
        <option value="Small">Small</option>
        <option value="Large">Large</option>
        <option value="Thumb">Thumb</option>
      </select>

      <input
        type="text"
        value={label}
        onChange={(e) => setLabel(e.target.value)}
        placeholder="Label"
        className="border p-2 w-full"
        required
      />

      <input
        type="number"
        value={moldUses}
        onChange={(e) => setMoldUses(e.target.value)}
        placeholder="Mold Uses"
        className="border p-2 w-full"
        min="0"
        required
      />

      <button type="submit" className="bg-blue-500 text-white px-4 py-2 w-full">
        Add Mold
      </button>
    </form>
  );
};

export default MoldForm;
