import React from 'react';
import { Mail, Phone } from 'lucide-react';

interface ContactCardProps {
  name: string;
  email?: string | null;
  phone?: string | null;
  photo?: string | null;
  gender?: string | null;
  funkce?: string | null;
}

const ContactCard: React.FC<ContactCardProps> = ({ name, email, phone, photo, funkce }) => {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="flex items-center space-x-4 p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
      {/* Photo or Initials */}
      {photo ? (
        <img
          src={photo}
          alt={name}
          className="w-14 h-14 rounded-full object-cover flex-shrink-0"
        />
      ) : (
        <div className="w-14 h-14 rounded-full bg-primary-600 flex items-center justify-center text-white text-lg font-bold flex-shrink-0">
          {getInitials(name)}
        </div>
      )}

      {/* Info */}
      <div className="flex-1 min-w-0">
        <h4 className="font-semibold text-gray-900 truncate">{name}</h4>
        {funkce && (
          <p className="text-sm text-gray-500 truncate">{funkce}</p>
        )}
        <div className="space-y-1 mt-1">
          {email && (
            <a
              href={`mailto:${email}`}
              className="flex items-center space-x-2 text-sm text-gray-600 hover:text-primary-600 transition-colors truncate"
            >
              <Mail className="w-3.5 h-3.5 flex-shrink-0" />
              <span className="truncate">{email}</span>
            </a>
          )}
          {phone && (
            <a
              href={`tel:${phone}`}
              className="flex items-center space-x-2 text-sm text-gray-600 hover:text-primary-600 transition-colors"
            >
              <Phone className="w-3.5 h-3.5 flex-shrink-0" />
              <span>{phone}</span>
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContactCard;
