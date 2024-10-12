import React, { useState } from 'react';
import './SignaturePopup.css'; 

function SignaturePopup({ isOpen, onClose, onConfirm, transactionDetails }) {
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirm = async () => {
    setIsLoading(true);
    await onConfirm();
    setIsLoading(false);
  };

  if (!isOpen) return null;

  const { type, tokens, amounts } = transactionDetails || {};

  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <h2>确认交易</h2>
        <div className="transaction-details">
          <p><strong>交易类型:</strong> {type}</p>
          <p><strong>代币路径:</strong> {tokens.join(' → ')}</p>
          <p><strong>金额:</strong> {amounts.join(' → ')}</p>
        </div>
        <div className="popup-actions">
          <button onClick={handleConfirm} className="confirm-button" disabled={isLoading}>
            {isLoading ? '处理中...' : '确认'}
          </button>
          <button onClick={onClose} className="cancel-button" disabled={isLoading}>
            取消
          </button>
        </div>
      </div>
    </div>
  );
}

export default SignaturePopup;
