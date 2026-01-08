'use client';

import React from 'react';
import Modal from '@/components/interactive/Modal';
import RegistrationForm from './RegistrationForm';
import { useReservationModal } from '@/contexts/ReservationModalContext';
import type { Locale } from '@/i18n/config';

interface RegistrationModalProps {
  locale: Locale;
}

const RegistrationModal: React.FC<RegistrationModalProps> = ({ locale }) => {
  const { isOpen, closeModal } = useReservationModal();

  return (
    <Modal isOpen={isOpen} onClose={closeModal} size="md">
      <RegistrationForm locale={locale} />
    </Modal>
  );
};

export default RegistrationModal;
