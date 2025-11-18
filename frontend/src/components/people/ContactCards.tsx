import React from 'react';
import ContactCard from './ContactCard';

interface ContactCardData {
  name: string;
  email?: string | null;
  phone?: string | null;
  photo?: string | null;
  gender?: 'man' | 'woman' | null;
}

interface ContactCardsProps {
  cards: ContactCardData[];
}

const ContactCards: React.FC<ContactCardsProps> = ({ cards }) => {
  return (
    <div className="space-y-4">
      {cards.map((card, index) => (
        <ContactCard
          key={index}
          name={card.name}
          email={card.email}
          phone={card.phone}
          photo={card.photo}
          gender={card.gender}
        />
      ))}
    </div>
  );
};

export default ContactCards;
