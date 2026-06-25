import React, { useState, useEffect } from 'react';

export default function App() {
  const [trips, setTrips] = useState(() => {
    const savedTrips = localStorage.getItem('transportTrips');
    return savedTrips ? JSON.parse(savedTrips) : [];
  });

  const [formData, setFormData] = useState({ id: '', date: '', origin: '', destination: '', cost: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    localStorage.setItem('transportTrips', JSON.stringify(trips));
  }, [trips]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    if (!formData.date || !formData.origin || !formData.destination || !formData.cost) {
      setError('Todos los campos son obligatorios.');
      return false;
    }
    if (parseFloat(formData.cost) <= 0) {
      setError('El costo del viaje debe ser mayor a $0.');
      return false;
    }
    setError('');
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (isEditing) {
      setTrips(trips.map(trip => (trip.id === formData.id ? formData : trip)));
      setIsEditing(false);
    } else {
      const newTrip = { ...formData, id: Date.now().toString() };
      setTrips([...trips, newTrip]);
    }
    setFormData({ id: '', date: '', origin: '', destination: '', cost: '' });
  };

  const handleEdit = (trip) => {
    setFormData(trip);
    setIsEditing(true);
    setError('');
  };

  const handleDelete = (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este viaje?')) {
      setTrips(trips.filter(trip => trip.id !== id));
    }
  };

  const totalCost = trips.reduce((acc, trip) => acc + parseFloat(trip.cost), 0);

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <h1 style={{ textAlign: 'center', color: '#333' }}>🚗 Gestión de Gastos de Transporte</h1>
      
      <div style={{ background: '#f4f4f9', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
        <h2>{isEditing ? 'Editar Viaje' : 'Registrar Nuevo Viaje'}</h2>
        {error && <p style={{ color: 'red', fontWeight: 'bold' }}>{error}</p>}
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <input type="date" name="date" value={formData.date} onChange={handleChange} required />
          <input type="text" name="origin" placeholder="Lugar de Origen" value={formData.origin} onChange={handleChange} required />
          <input type="text" name="destination" placeholder="Lugar de Destino" value={formData.destination} onChange={handleChange} required />
          <input type="number" name="cost" placeholder="Costo ($)" value={formData.cost} onChange={handleChange} step="0.01" required />
          
          <button type="submit" style={{ padding: '10px', background: isEditing ? '#f39c12' : '#27ae60', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
            {isEditing ? 'Actualizar Viaje' : 'Guardar Viaje'}
          </button>
          {isEditing && (
             <button type="button" onClick={() => { setIsEditing(false); setFormData({ id: '', date: '', origin: '', destination: '', cost: '' }); }} style={{ padding: '10px', background: '#95a5a6', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
               Cancelar
             </button>
          )}
        </form>
      </div>

      <div style={{ background: '#fff', border: '1px solid #ddd', padding: '20px', borderRadius: '8px' }}>
        <h2>Historial de Viajes</h2>
        <h3 style={{ color: '#e74c3c' }}>Gasto Total: ${totalCost.toFixed(2)}</h3>
        
        {trips.length === 0 ? (
          <p>No hay viajes registrados aún.</p>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {trips.map(trip => (
              <li key={trip.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #eee', padding: '10px 0' }}>
                <div>
                  <strong>{trip.date}</strong> | {trip.origin} ➡️ {trip.destination} <br/>
                  <span style={{ color: '#27ae60', fontWeight: 'bold' }}>${parseFloat(trip.cost).toFixed(2)}</span>
                </div>
                <div>
                  <button onClick={() => handleEdit(trip)} style={{ marginRight: '10px', padding: '5px 10px', cursor: 'pointer' }}>Editar</button>
                  <button onClick={() => handleDelete(trip.id)} style={{ background: '#e74c3c', color: '#fff', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}>Eliminar</button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}