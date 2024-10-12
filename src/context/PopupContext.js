
import React, { createContext, useState } from 'react';
import SignaturePopup from '../components/SignaturePopup';

export const PopupContext = createContext();

export const PopupProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [transactionDetails, setTransactionDetails] = useState(null);
  const [onConfirmCallback, setOnConfirmCallback] = useState(null);

  const openPopup = (details, onConfirm) => {
    setTransactionDetails(details);
    setOnConfirmCallback(() => onConfirm);
    setIsOpen(true);
  };

  const closePopup = () => {
    setIsOpen(false);
    setTransactionDetails(null);
    setOnConfirmCallback(null);
  };

  const handleConfirm = () => {
    if (onConfirmCallback) {
      onConfirmCallback();
    }
    closePopup();
  };

  return (
    <PopupContext.Provider value={{ openPopup, closePopup }}>
      {children}
      <SignaturePopup
        isOpen={isOpen}
        onClose={closePopup}
        onConfirm={handleConfirm}
        transactionDetails={transactionDetails}
      />
    </PopupContext.Provider>
  );
};
