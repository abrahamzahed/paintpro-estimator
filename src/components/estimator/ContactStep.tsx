
import React from 'react';
import { ContactForm } from './ContactForm';
import { ContactInfo } from '@/types/estimator';

interface ContactStepProps {
  contactInfo: ContactInfo;
  setContactInfo: React.Dispatch<React.SetStateAction<ContactInfo>>;
}

export const ContactStep: React.FC<ContactStepProps> = ({ contactInfo, setContactInfo }) => {
  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Let's Get Started</h2>
        <p className="text-gray-600 mt-1">Please provide your contact information.</p>
      </div>
      
      <ContactForm 
        contactInfo={contactInfo} 
        setContactInfo={setContactInfo} 
      />
    </div>
  );
};
