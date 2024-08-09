import React, { useState } from 'react';
import './css/credit-card-form.css';
import axios from 'axios';
const backend_url = 'http://localhost:4000';

function CreditCardForm({ card, actionType, onSave, onClose, banks }) {
  const [name, setName] = useState(card?.name || '');
  const [enabled, setEnabled] = useState(card?.enabled || false);
  const [selectedBankId, setSelectedBankId] = useState(card?.bank|| '');
  console.log(card);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = { name, enabled, bank: selectedBankId };
  
    try {
      if (actionType === 'update') {
        await axios.patch(backend_url + `/api/credit-cards/${card.id}`, data);
      } else if (actionType === 'delete') {
        console.log(card);
        await axios.delete(backend_url + `/api/credit-cards/${card.id}`);
      } else {
        await axios.post(backend_url + '/api/credit-cards', data);
      }
      onSave();
    } catch (error) {
      console.error('Error saving data', error);
    }
  
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="form-container">
      {actionType === 'delete' ?  <><label className="form-label1"><h3>Deleting {card.name} card</h3></label><label className="form-label1"><h3>Are you sure?</h3></label>
        <div className="form-row">
        <div className="form-item">
          <button type="button" className="form-button cancel-button" onClick={onClose}>No</button>
        </div>
        <div className="form-item">
          <button type="submit" className="form-button submit-button" >Yes</button>
        </div>
      </div>
      </> : <>
      <div className="form-header">
        <h1>{actionType === 'update' ? 'Edit Credit Card' :  'Add Credit Card'}</h1>
      </div>
      <div className="form-row">
        <div className="form-item">
        <label className="form-label">Credit Card Name</label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Enter credit card name"
            className="form-input"
          />
        </div>
        <div className="form-item">
        <label className="form-label">Bank Name</label>
          <select
            value={selectedBankId}
            onChange={e => setSelectedBankId(e.target.value)}
            className="form-select"
          >
            <option value=''>Select a bank</option>
            {banks.map((bank, index) => (
              <option key={index} value={bank}>{bank}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="form-row">
        <div className="form-item">
          <label className="toggle-label">Enabled</label>
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={enabled}
              onChange={e => setEnabled(e.target.checked)}
            />
            <span className="slider"></span>
          </label>
        </div>
        <div className="form-item">
          <label className="form-label">Created At</label>
          <p className="form-text">{card && card.created_at ? new Date(card.created_at).toLocaleString() : '---'}</p>
        </div>
      </div>
      <div className="form-row">
        <div className="form-item">
          <button type="button" className="form-button cancel-button" onClick={onClose}>Cancel</button>
        </div>
        <div className="form-item">
          <button type="submit" className="form-button submit-button">Submit</button>
        </div>
      </div>
</>
}
    </form>
  );
}

export default CreditCardForm;
