import React, { useState, useEffect } from 'react';

const BatchForm = ({ onBatchCreated }) => {
  const [version, setVersion] = useState('1.0');
  const [technician, setTechnician] = useState('');
  const [batchName, setBatchName] = useState('');
  const [quantities, setQuantities] = useState({
    largeSensorized: 0,
    largeUnsensorized: 0,
    smallSensorized: 0,
    smallUnsensorized: 0,
    thumb: 0,
  });

  const [molds, setMolds] = useState([]);
  const [selectedMoldIds, setSelectedMoldIds] = useState([]);
  const apiUrl = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const fetchMolds = async () => {
      try {
        const response = await fetch(`${apiUrl}/molds`);
        const data = await response.json();
        setMolds(data);
      } catch (err) {
        console.error('Error fetching molds:', err);
      }
    };
    fetchMolds();
  }, [apiUrl]);

  const handleMoldChange = (index, moldId) => {
    const updated = [...selectedMoldIds];
    updated[index] = moldId;
    setSelectedMoldIds(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const batchData = {
        version,
        technician,
        batch_name: batchName,
        quantities,
        mold_ids: selectedMoldIds,
      };

      await fetch(`${apiUrl}/batches`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(batchData),
      });

      // Reset
      setVersion('1.0');
      setTechnician('');
      setBatchName('');
      setQuantities({
        largeSensorized: 0,
        largeUnsensorized: 0,
        smallSensorized: 0,
        smallUnsensorized: 0,
        thumb: 0,
      });
      setSelectedMoldIds([]);

      if (onBatchCreated) onBatchCreated();
    } catch (err) {
      console.error('Error creating batch:', err);
    }
  };

  // Helper function to render mold selectors by type/size
  const renderMoldSelectors = (label, count, sizeKey, prefix, offset) => {
  const matchingMolds = molds.filter((mold) => mold.size === sizeKey);
  return Array.from({ length: count }, (_, i) => {
    const index = offset + i;

    return (
      <div key={`${prefix}-${i}`}>
        <label className="block font-semibold">
          {label} #{i + 1}
        </label>
        <select
          value={selectedMoldIds[index] || ''}
          onChange={(e) => handleMoldChange(index, Number(e.target.value))}
          className="border p-2 w-full"
          required
        >
          <option value="">-- Select a {sizeKey} mold --</option>
          {matchingMolds.map((mold) => {
            const isSelectedElsewhere =
              selectedMoldIds.includes(mold.id) && selectedMoldIds[index] !== mold.id;
            return (
              <option
                key={mold.id}
                value={mold.id}
                disabled={isSelectedElsewhere}
              >
                {`${mold.label} (${mold.size}, uses: ${mold.mold_uses})`}
              </option>
            );
          })}
        </select>
      </div>
    );
  });
};


  // Compute total mold selectors with proper offsets
  const selectors = [];
  let offset = 0;
  const types = [
    ['Large Sensorized', quantities.largeSensorized, 'Large', 'LS'],
    ['Large Unsensorized', quantities.largeUnsensorized, 'Large', 'LU'],
    ['Small Sensorized', quantities.smallSensorized, 'Small', 'SS'],
    ['Small Unsensorized', quantities.smallUnsensorized, 'Small', 'SU'],
    ['Thumb', quantities.thumb, 'Thumb', 'T'],
  ];
  types.forEach(([label, count, size, prefix]) => {
    selectors.push(...renderMoldSelectors(label, count, size, prefix, offset));
    offset += count;
  });

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <select value={version} onChange={(e) => setVersion(e.target.value)} className="border p-2">
        <option value="1.0">1.0</option>
        <option value="2.0">2.0</option>
      </select>

      <input
        type="text"
        value={technician}
        onChange={(e) => setTechnician(e.target.value)}
        placeholder="Technician Name"
        className="border p-2"
      />

      <input
        type="text"
        value={batchName}
        onChange={(e) => setBatchName(e.target.value)}
        placeholder="Batch Name"
        className="border p-2"
      />

      {Object.keys(quantities).map((key) => (
        <div key={key}>
          <label className="block capitalize">{key.replace(/([A-Z])/g, ' $1')}</label>
          <input
            type="number"
            min="0"
            value={quantities[key]}
            onChange={(e) =>
              setQuantities({ ...quantities, [key]: Number(e.target.value) })
            }
            className="border p-2 w-full"
          />
        </div>
      ))}

      {selectors}

      <button type="submit" className="bg-blue-500 text-white px-4 py-2">Create Batch</button>
    </form>
  );
};

export default BatchForm;
