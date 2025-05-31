import React, { useState } from 'react';

const MoldList = ({ molds = [], onDelete, onEdit }) => {
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({ version: '', label: '', size: '', mold_uses: 0 });

  const startEdit = (mold) => {
    setEditingId(mold.id);
    setEditData({
      version: mold.version,
      label: mold.label,
      size: mold.size,
      mold_uses: mold.mold_uses,
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditData({ version: '', label: '', size: '', mold_uses: 0 });
  };

  const handleSave = () => {
    onEdit(editingId, editData);
    cancelEdit();
  };

  return (
    <table className="min-w-full table-auto mt-4 border">
      <thead>
        <tr>
          <th className="border px-4 py-2">ID</th>
          <th className="border px-4 py-2">Version</th>
          <th className="border px-4 py-2">Label</th>
          <th className="border px-4 py-2">Size</th>
          <th className="border px-4 py-2">Mold Uses</th>
          <th className="border px-4 py-2">Actions</th>
        </tr>
      </thead>
      <tbody>
        {molds.map((mold) => (
          <tr key={mold.id}>
            <td className="border px-4 py-2">{mold.id}</td>
            {editingId === mold.id ? (
              <>
                <td className="border px-4 py-2">
                  <input
                    type="text"
                    value={editData.version}
                    onChange={(e) => setEditData({ ...editData, version: e.target.value })}
                    className="border p-1 w-full"
                  />
                </td>
                <td className="border px-4 py-2">
                  <input
                    type="text"
                    value={editData.label}
                    onChange={(e) => setEditData({ ...editData, label: e.target.value })}
                    className="border p-1 w-full"
                  />
                </td>
                <td className="border px-4 py-2">
                  <input
                    type="text"
                    value={editData.size}
                    onChange={(e) => setEditData({ ...editData, size: e.target.value })}
                    className="border p-1 w-full"
                  />
                </td>
                <td className="border px-4 py-2">
                  <input
                    type="number"
                    min="0"
                    value={editData.mold_uses}
                    onChange={(e) => setEditData({ ...editData, mold_uses: Number(e.target.value) })}
                    className="border p-1 w-full"
                  />
                </td>
                <td className="border px-4 py-2">
                  <button
                    className="bg-green-500 text-white px-2 py-1 mr-2"
                    onClick={handleSave}
                  >
                    Save
                  </button>
                  <button
                    className="bg-gray-400 text-white px-2 py-1"
                    onClick={cancelEdit}
                  >
                    Cancel
                  </button>
                </td>
              </>
            ) : (
              <>
                <td className="border px-4 py-2">{mold.version}</td>
                <td className="border px-4 py-2">{mold.label}</td>
                <td className="border px-4 py-2">{mold.size}</td>
                <td className="border px-4 py-2">{mold.mold_uses}</td>
                <td className="border px-4 py-2">
                  <button
                    className="bg-yellow-500 text-white px-2 py-1 mr-2"
                    onClick={() => startEdit(mold)}
                  >
                    Edit
                  </button>
                  <button
                    className="bg-red-500 text-white px-2 py-1"
                    onClick={() => onDelete(mold.id)}
                  >
                    Delete
                  </button>
                </td>
              </>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default MoldList;
