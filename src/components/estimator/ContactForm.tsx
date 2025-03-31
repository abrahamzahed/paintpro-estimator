
import React from 'react';
import { ContactInfo } from '@/types/estimator';
import AddressAutocomplete from './address/AddressAutocomplete';
import { FormField } from './form/FormField';
import { useContactForm } from './form/useContactForm';

interface ContactFormProps {
  contactInfo: ContactInfo;
  setContactInfo: React.Dispatch<React.SetStateAction<ContactInfo>>;
}

export const ContactForm: React.FC<ContactFormProps> = ({ contactInfo, setContactInfo }) => {
  const { errors, handleChange, handleAddressChange, handlePhoneChange } = useContactForm(
    contactInfo, 
    setContactInfo
  );

  return (
    <div className="space-y-6 max-w-2xl">
      <FormField
        id="projectName"
        name="projectName"
        label="Project Name"
        value={contactInfo.projectName}
        onChange={handleChange}
        placeholder="Enter your project name"
        error={errors.projectName}
      />

      <div className="form-input-wrapper">
        <AddressAutocomplete
          id="address"
          value={contactInfo.address}
          onChange={handleAddressChange}
          label="Address"
          placeholder="Enter your full address"
          required={true}
          error={errors.address}
        />
      </div>

      <FormField
        id="fullName"
        name="fullName"
        label="Full Name"
        value={contactInfo.fullName}
        onChange={handleChange}
        placeholder="Enter your full name"
        error={errors.fullName}
      />

      <FormField
        id="email"
        name="email"
        label="Email Address"
        type="email"
        value={contactInfo.email}
        onChange={handleChange}
        placeholder="Enter your email address"
        error={errors.email}
      />

      <FormField
        id="phone"
        name="phone"
        label="Phone Number"
        value={contactInfo.phone}
        onChange={handlePhoneChange}
        placeholder="XXX-XXX-XXXX"
        error={errors.phone}
      />
    </div>
  );
};
