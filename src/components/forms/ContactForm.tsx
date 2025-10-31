'use client';

import React, { useState } from 'react';
import Input from '@/components/ui/Input';
import Select from './Select';
import Checkbox from './Checkbox';
import Button from '@/components/ui/Button';

interface ContactFormProps {
  onSubmit?: (data: Record<string, any>) => void;
}

const ContactForm: React.FC<ContactFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    consent: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit(formData);
    } else {
      console.log('Form submitted:', formData);
      alert('Formulář byl odeslán!');
    }
  };

  const subjectOptions = [
    { value: 'objednani', label: 'Objednání na vyšetření' },
    { value: 'dotaz', label: 'Dotaz k službám' },
    { value: 'stiznost', label: 'Stížnost' },
    { value: 'jine', label: 'Jiné' },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Jméno a příjmení"
          name="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
          placeholder="Jan Novák"
        />
        <Input
          label="E-mail"
          name="email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
          placeholder="jan.novak@email.cz"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Telefon"
          name="phone"
          type="tel"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          placeholder="+420 123 456 789"
        />
        <Select
          label="Předmět"
          name="subject"
          options={subjectOptions}
          value={formData.subject}
          onChange={(value) => setFormData({ ...formData, subject: value })}
          required
        />
      </div>

      <div>
        <label
          htmlFor="message"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Zpráva
          <span className="text-red-500 ml-1">*</span>
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          value={formData.message}
          onChange={(e) =>
            setFormData({ ...formData, message: e.target.value })
          }
          required
          placeholder="Napište nám svůj dotaz..."
          className="w-full px-4 py-2.5 text-gray-900 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-primary-500 focus:ring-primary-500 transition-colors resize-none"
        />
      </div>

      <Checkbox
        label="Souhlasím se zpracováním osobních údajů"
        name="consent"
        checked={formData.consent}
        onChange={(checked) => setFormData({ ...formData, consent: checked })}
        helperText="Vaše údaje budou použity pouze pro účely zpracování dotazu."
      />

      <div className="flex gap-4">
        <Button type="submit" size="lg">
          Odeslat zprávu
        </Button>
        <Button
          type="button"
          variant="outline"
          size="lg"
          onClick={() =>
            setFormData({
              name: '',
              email: '',
              phone: '',
              subject: '',
              message: '',
              consent: false,
            })
          }
        >
          Vymazat
        </Button>
      </div>
    </form>
  );
};

export default ContactForm;
