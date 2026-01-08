'use client';

import React, { useState } from 'react';
import { Mail, Phone, Clock, FileText, Plane, ExternalLink } from 'lucide-react';

interface Doctor {
  name: string;
  function?: string;
  phone?: string;
  email?: string;
  photo?: string;
  holiday?: { from: string; to: string };
}

interface Nurse {
  name: string;
  holiday?: { from: string; to: string };
}

interface Document {
  name: string;
  url: string;
}

interface OpeningHours {
  day: string;
  time: string;
}

interface AmbulanceCardProps {
  name: string;
  phone?: string;
  email?: string;
  doctors: Doctor[];
  nurses: Nurse[];
  nursesPhones: string[];
  nursesEmail?: string;
  description?: string;
  documents: Document[];
  button?: { text: string; url: string };
  openingHours: OpeningHours[];
}

const AmbulanceCard: React.FC<AmbulanceCardProps> = ({
  name,
  phone,
  email,
  doctors,
  nurses,
  nursesPhones,
  nursesEmail,
  description,
  documents,
  button,
  openingHours,
}) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const getSurname = (fullName: string): string => {
    const parts = fullName.trim().split(' ');
    return parts[parts.length - 1];
  };

  const groupedHours = openingHours.reduce<Record<string, string[]>>((acc, hours) => {
    if (!acc[hours.day]) {
      acc[hours.day] = [];
    }
    acc[hours.day].push(hours.time);
    return acc;
  }, {});

  const isOnHoliday = (holiday?: { from: string; to: string }): boolean => {
    if (!holiday) return false;
    const today = new Date();
    const from = new Date(holiday.from);
    const to = new Date(holiday.to);
    return today >= from && today <= to;
  };

  return (
    <div>
      <h3 className="text-lg font-semibold text-primary-600 mb-2">{name}</h3>

      {(phone || email) && (
        <div className="flex flex-wrap gap-4 mb-3 text-sm">
          {phone && (
            <a
              href={`tel:${phone}`}
              className="flex items-center gap-1.5 text-gray-600 hover:text-primary-600 transition-colors"
            >
              <Phone className="w-4 h-4" />
              <span>{phone}</span>
            </a>
          )}
          {email && (
            <a
              href={`mailto:${email}`}
              className="flex items-center gap-1.5 text-gray-600 hover:text-primary-600 transition-colors"
            >
              <Mail className="w-4 h-4" />
              <span>{email}</span>
            </a>
          )}
        </div>
      )}

      <div
        className="relative min-h-[400px]"
        style={{ perspective: '1000px' }}
      >
        <div
          className={`relative w-full h-full transition-transform duration-700 ${
            isFlipped ? '[transform:rotateY(180deg)]' : ''
          }`}
          style={{ transformStyle: 'preserve-3d' }}
        >
          {/* Front Side */}
          <div
            className="absolute inset-0 backface-hidden"
            style={{ backfaceVisibility: 'hidden' }}
          >
            <div className="bg-white border border-gray-200 rounded-xl p-5 h-full flex flex-col">
              {/* Doctors Section */}
              {doctors.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-gray-900 mb-2">Doktoři</h4>
                  <div className="space-y-2">
                    {doctors.map((doctor, index) => (
                      <div key={index} className="text-sm">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-primary-600">{doctor.name}</span>
                          {isOnHoliday(doctor.holiday) && (
                            <span className="inline-flex items-center gap-1 text-xs text-yellow-700 bg-yellow-100 px-1.5 py-0.5 rounded">
                              <Plane className="w-3 h-3" />
                              dovolená
                            </span>
                          )}
                        </div>
                        {doctor.function && (
                          <span className="text-gray-500 text-xs">{doctor.function}</span>
                        )}
                        {(doctor.phone || doctor.email) && (
                          <div className="flex flex-wrap gap-3 mt-1 text-xs text-gray-600">
                            {doctor.phone && (
                              <a href={`tel:${doctor.phone}`} className="hover:text-primary-600 flex items-center gap-1">
                                <Phone className="w-3 h-3" />
                                {doctor.phone}
                              </a>
                            )}
                            {doctor.email && (
                              <a href={`mailto:${doctor.email}`} className="hover:text-primary-600 flex items-center gap-1">
                                <Mail className="w-3 h-3" />
                                {doctor.email}
                              </a>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Nurses Section */}
              {nurses.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-gray-900 mb-2">Sestry</h4>
                  <div className="flex flex-wrap gap-x-2 gap-y-1 text-sm text-gray-700">
                    {nurses.map((nurse, index) => (
                      <span key={index} className="flex items-center gap-1">
                        {getSurname(nurse.name)}
                        {isOnHoliday(nurse.holiday) && (
                          <Plane className="w-3 h-3 text-yellow-600" />
                        )}
                        {index < nurses.length - 1 && <span className="text-gray-400">,</span>}
                      </span>
                    ))}
                  </div>
                  {(nursesPhones.length > 0 || nursesEmail) && (
                    <div className="mt-2 space-y-1 text-xs text-gray-600">
                      {nursesPhones.map((phoneNum, index) => (
                        <a
                          key={index}
                          href={`tel:${phoneNum}`}
                          className="flex items-center gap-1 hover:text-primary-600"
                        >
                          <Phone className="w-3 h-3" />
                          {phoneNum}
                        </a>
                      ))}
                      {nursesEmail && (
                        <a
                          href={`mailto:${nursesEmail}`}
                          className="flex items-center gap-1 hover:text-primary-600"
                        >
                          <Mail className="w-3 h-3" />
                          {nursesEmail}
                        </a>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Description */}
              {description && (
                <div
                  className="text-sm text-gray-600 mb-4 prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: description }}
                />
              )}

              {/* Documents */}
              {documents.length > 0 && (
                <div className="mb-4">
                  <div className="space-y-1.5">
                    {documents.map((doc, index) => (
                      <a
                        key={index}
                        href={doc.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm text-primary-600 hover:text-primary-700 transition-colors"
                      >
                        <FileText className="w-4 h-4 flex-shrink-0" />
                        <span className="underline">{doc.name}</span>
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Spacer */}
              <div className="flex-1" />

              {/* Button */}
              {button && (
                <a
                  href={button.url}
                  className="inline-flex items-center justify-center gap-2 w-full py-2 px-4 bg-primary-600 text-white rounded-lg font-medium text-sm hover:bg-primary-700 transition-colors mb-3"
                >
                  <span>{button.text}</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}

              {/* Opening Hours Button */}
              {openingHours.length > 0 && (
                <button
                  onClick={() => setIsFlipped(true)}
                  className="flex items-center justify-center gap-2 w-full py-2 text-primary-600 hover:text-primary-700 font-medium text-sm transition-colors border border-primary-600 rounded-lg hover:bg-primary-50"
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
            <div className="bg-primary-600 text-white rounded-xl p-5 h-full flex flex-col">
              <h4 className="text-lg font-bold mb-4">Ordinační hodiny</h4>
              <div className="space-y-3 flex-1">
                {Object.entries(groupedHours).map(([day, times]) => (
                  <div key={day} className="flex justify-between text-sm">
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

export default AmbulanceCard;
