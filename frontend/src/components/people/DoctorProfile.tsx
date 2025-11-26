'use client';

import React, { useState } from 'react';
import { Mail, Phone, Clock, Plane } from 'lucide-react';
import Badge from '@/components/ui/Badge';

interface OpeningHours {
  day: string;
  time: string;
}

interface Holiday {
  from: string;
  to: string;
}

interface DoctorProfileProps {
  ambulanceTitle?: string;
  photo?: string;
  name: string;
  department: string;
  positions: string[];
  phone?: string;
  email?: string;
  openingHours?: OpeningHours[];
  holiday?: Holiday;
}

const DoctorProfile: React.FC<DoctorProfileProps> = ({
  ambulanceTitle,
  photo,
  name,
  department,
  positions,
  phone,
  email,
  openingHours = [],
  holiday,
}) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div>
      {ambulanceTitle && (
        <h3 className="text-lg font-semibold text-gray-900 mb-3">
          {ambulanceTitle}
        </h3>
      )}

      <div
        className="relative h-[400px]"
        style={{ perspective: '1000px' }}
      >
        <div
          className={`relative w-full h-full transition-transform duration-700 transform-style-3d ${
            isFlipped ? '[transform:rotateY(180deg)]' : ''
          }`}
          style={{ transformStyle: 'preserve-3d' }}
        >
          {/* Front Side */}
          <div
            className="absolute inset-0 backface-hidden"
            style={{ backfaceVisibility: 'hidden' }}
          >
            <div
              className={`bg-white border rounded-xl p-6 h-full flex flex-col ${
                holiday ? 'border-yellow-300 bg-yellow-50/30' : 'border-gray-200'
              }`}
            >
              {holiday && (
                <div className="flex items-center space-x-2 mb-3 text-yellow-700 bg-yellow-100 px-3 py-2 rounded-lg">
                  <Plane className="w-4 h-4" />
                  <span className="text-sm font-medium">
                    Dovolená {new Date(holiday.from).toLocaleDateString('cs')} -{' '}
                    {new Date(holiday.to).toLocaleDateString('cs')}
                  </span>
                </div>
              )}

              <div className="flex flex-col items-center text-center">
                {/* Photo or Initials */}
                {photo ? (
                  <img
                    src={photo}
                    alt={name}
                    className="w-24 h-24 rounded-full object-cover mb-4"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-primary-600 flex items-center justify-center text-white text-2xl font-bold mb-4">
                    {getInitials(name)}
                  </div>
                )}

                <h4 className="text-xl font-bold text-gray-900 mb-1">{name}</h4>
                <p className="text-primary-600 font-medium mb-3">{department}</p>

                <div className="flex flex-wrap gap-2 justify-center mb-4">
                  {positions.map((position, index) => (
                    <Badge key={index} variant="secondary" size="sm">
                      {position}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="space-y-2 mt-auto">
                {phone && (
                  <a
                    href={`tel:${phone}`}
                    className="flex items-center space-x-2 text-gray-600 hover:text-primary-600 transition-colors text-sm"
                  >
                    <Phone className="w-4 h-4 flex-shrink-0" />
                    <span>{phone}</span>
                  </a>
                )}
                {email && (
                  <a
                    href={`mailto:${email}`}
                    className="flex items-center space-x-2 text-gray-600 hover:text-primary-600 transition-colors text-sm"
                  >
                    <Mail className="w-4 h-4 flex-shrink-0" />
                    <span>{email}</span>
                  </a>
                )}
              </div>

              {openingHours.length > 0 && (
                <button
                  onClick={() => setIsFlipped(true)}
                  className="mt-4 flex items-center justify-center space-x-2 w-full py-2 text-primary-600 hover:text-primary-700 font-medium text-sm transition-colors"
                >
                  <Clock className="w-4 h-4" />
                  <span>Ordinační hodiny</span>
                </button>
              )}
            </div>
          </div>

          {/* Back Side - Opening Hours */}
          <div
            className="absolute inset-0 backface-hidden [transform:rotateY(180deg)]"
            style={{ backfaceVisibility: 'hidden' }}
          >
            <div className="bg-primary-600 text-white rounded-xl p-6 h-full flex flex-col">
              <h4 className="text-xl font-bold mb-4">Ordinační hodiny</h4>
              <div className="space-y-3 flex-1">
                {Object.entries(
                  openingHours.reduce<Record<string, string[]>>((acc, hours) => {
                    if (!acc[hours.day]) {
                      acc[hours.day] = [];
                    }
                    acc[hours.day].push(hours.time);
                    return acc;
                  }, {})
                ).map(([day, times]) => (
                  <div key={day} className="flex justify-between">
                    <span className="font-medium">{day}</span>
                    <div className="text-right">
                      {times.map((time, index) => (
                        <div key={index}>{time}</div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <button
                onClick={() => setIsFlipped(false)}
                className="mt-4 w-full py-2 bg-white text-primary-600 rounded-lg font-medium hover:bg-primary-50 transition-colors"
              >
                Zpět
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorProfile;
