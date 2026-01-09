'use client';

import React from 'react';
import Modal from '@/components/interactive/Modal';
import RegistrationForm from './RegistrationForm';
import { useReservationModal } from '@/contexts/ReservationModalContext';
import type { Locale } from '@/i18n/config';

interface RegistrationModalProps {
  locale: Locale;
}

const translations = {
  cs: { title: 'Registrace k Praktickému lékaři' },
  en: { title: 'Registration for General Practitioner' },
} as const;

const RegistrationModal: React.FC<RegistrationModalProps> = ({ locale }) => {
  const { isOpen, closeModal } = useReservationModal();
  const t = translations[locale];

  return (
    <Modal isOpen={isOpen} onClose={closeModal} size="md" title={t.title}>
      <RegistrationForm locale={locale} />
    </Modal>
  );
};

export default RegistrationModal;
