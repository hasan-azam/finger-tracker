import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  TextField,
  Button
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';

const BatchList = ({ batches = [], onUpdateBatch, onDeleteBatch }) => {
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});

  const handleEditClick = (batch) => {
    setEditingId(batch.id);
    setEditData({
      batch_number: batch.batch_number,
      technician_name: batch.technician_name
    });
  };

  const handleCancelClick = () => {
    setEditingId(null);
    setEditData({});
  };

  const handleSaveClick = () => {
    onUpdateBatch(editingId, editData);
    setEditingId(null);
  };

  const handleChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  return (
    <TableContainer component={Paper} sx={{ mt: 4 }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Batch Name</TableCell>
            <TableCell>Technician</TableCell>
            <TableCell>Date Created</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {batches.map((batch) => (
            <TableRow key={batch.id}>
              <TableCell>
                {editingId === batch.id ? (
                  <TextField
                    name="batch_number"
                    value={editData.batch_number}
                    onChange={handleChange}
                    size="small"
                  />
                ) : (
                  batch.batch_number
                )}
              </TableCell>
              <TableCell>
                {editingId === batch.id ? (
                  <TextField
                    name="technician_name"
                    value={editData.technician_name}
                    onChange={handleChange}
                    size="small"
                  />
                ) : (
                  batch.technician_name
                )}
              </TableCell>
              <TableCell>{new Date(batch.date_created).toLocaleDateString()}</TableCell>
              <TableCell>
                {editingId === batch.id ? (
                  <>
                    <IconButton onClick={handleSaveClick} color="primary">
                      <SaveIcon />
                    </IconButton>
                    <IconButton onClick={handleCancelClick} color="secondary">
                      <CancelIcon />
                    </IconButton>
                  </>
                ) : (
                  <>
                    <IconButton onClick={() => handleEditClick(batch)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => onDeleteBatch(batch.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default BatchList;
