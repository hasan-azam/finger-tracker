// src/components/MoldList.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';

function MoldList() {
    const [molds, setMolds] = useState([]);

    useEffect(() => {
        axios.get('/molds')
            .then(res => setMolds(res.data))
            .catch(err => console.error('Failed to fetch molds:', err));
    }, []);

    return (
        <div>
            <h2>All Molds</h2>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Version</th>
                        <th>Label</th>
                        <th>Size</th>
                        <th>Mold Uses</th>
                    </tr>
                </thead>
                <tbody>
                    {molds.map(mold => (
                        <tr key={mold.id}>
                            <td>{mold.id}</td>
                            <td>{mold.version}</td>
                            <td>{mold.label}</td>
                            <td>{mold.size}</td>
                            <td>{mold.mold_uses}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default MoldList;
