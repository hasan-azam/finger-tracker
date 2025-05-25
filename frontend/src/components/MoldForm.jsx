import React, { useState } from 'react';
import axios from 'axios';

function MoldForm() {
    const [formData, setFormData] = useState({
        version: '',
        label: '',
        size: '',
        mold_uses: 0
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: name === 'mold_uses' ? parseInt(value, 10) || 0 : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('/molds', formData);
            if (response.status === 201) {
                alert('Mold added successfully!');
                // Reset form
                setFormData({ version: '', label: '', size: '', mold_uses: 0 });
            }
        } catch (error) {
            console.error('Error adding mold:', error);
            alert('Failed to add mold.');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>Version:</label>
                <input
                    type="text"
                    name="version"
                    value={formData.version}
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <label>Label:</label>
                <input
                    type="text"
                    name="label"
                    value={formData.label}
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <label>Size:</label>
                <input
                    type="text"
                    name="size"
                    value={formData.size}
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <label>Times Used:</label>
                <input
                    type="number"
                    name="mold_uses"
                    value={formData.mold_uses}
                    onChange={handleChange}
                    min="0"
                />
            </div>
            <button type="submit">Add Mold</button>
        </form>
    );
}

export default MoldForm;
