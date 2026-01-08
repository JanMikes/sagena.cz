'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface ReservationModalContextType {
  isOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
}

const ReservationModalContext = createContext<ReservationModalContextType>({
  isOpen: false,
  openModal: () => {},
  closeModal: () => {},
});

export function ReservationModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  return (
    <ReservationModalContext.Provider value={{ isOpen, openModal, closeModal }}>
      {children}
    </ReservationModalContext.Provider>
  );
}

export function useReservationModal() {
  return useContext(ReservationModalContext);
}
