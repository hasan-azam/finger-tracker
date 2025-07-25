import React, { useState, useEffect } from 'react';

const BatchForm = ({ onBatchCreated }) => {
  
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
  const [mmds, setMmds] = useState([]);
  const [selectedMmdId, setSelectedMmdId] = useState('');
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

    const fetchMmds = async () => {
      try {
        const response = await fetch(`${apiUrl}/mmds`);
        const data = await response.json();
        setMmds(data);
      } catch (err) {
        console.error('Error fetching MMDs:', err);
      }
  };

    fetchMolds();
    fetchMmds();
  }, [apiUrl]);

  const handleMoldChange = (index, moldId) => {
    const updated = [...selectedMoldIds];
    updated[index] = moldId;
    setSelectedMoldIds(updated);
  };

 const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    // Step 1: Create the batch
    const batchResponse = await fetch(`${apiUrl}/batches`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        batch_number: batchName,
        technician_name: technician,
        mmd_id: Number(selectedMmdId),
        mold_ids: selectedMoldIds,
      }),
    });

    if (!batchResponse.ok) {
      throw new Error('Batch creation failed');
    }

    const batchResult = await batchResponse.json();
    const batchId = batchResult.batch_id; // Assuming backend returns this

    // Step 2: Assemble all fingers
    const fingerTypes = [
      ['largeSensorized', 'Large', 'sensorized'],
      ['largeUnsensorized', 'Large', 'unsensorized'],
      ['smallSensorized', 'Small', 'sensorized'],
      ['smallUnsensorized', 'Small', 'unsensorized'],
      ['thumb', 'Thumb', 'sensorized'],
    ];

    const fingers = [];
    let index = 0;
    for (const [key, size, type] of fingerTypes) {
      const count = quantities[key];
      for (let i = 0; i < count; i++) {
        fingers.push({
          type,
          size,
          mold_id: selectedMoldIds[index],
          batch_id: batchId,
        });
        index++;
      }
    }

    // Step 3: Send fingers
    const fingerResponse = await fetch(`${apiUrl}/fingers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(fingers),
    });

    if (!fingerResponse.ok) {
      throw new Error('Finger creation failed');
    }

    // Reset form
    setSelectedMmdId('');
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
    console.error('Error during batch/finger creation:', err);
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
                {`${mold.label} (${mold.size}, Uses: ${mold.mold_uses})`}
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
      
      <select
        value={selectedMmdId}
        onChange={(e) => setSelectedMmdId(e.target.value)}
        className="border p-2"
        required
      >
        <option value="">-- Select MMD --</option>
        {mmds.map((mmd) => (
          <option key={mmd.id} value={mmd.id}>
            {mmd.name || `MMD ${mmd.serial_number}`}
          </option>
        ))}
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
