
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ContactInfo } from '@/types/estimator';
import { mockProjects } from '@/lib/mockData';

interface ContactFormProps {
  contactInfo: ContactInfo;
  setContactInfo: React.Dispatch<React.SetStateAction<ContactInfo>>;
}

export const ContactForm: React.FC<ContactFormProps> = ({ contactInfo, setContactInfo }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setContactInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleProjectChange = (value: string) => {
    const isCreateNew = value === 'Create New Project';
    setContactInfo((prev) => ({ 
      ...prev, 
      projectName: isCreateNew ? '' : value 
    }));
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h3 className="text-lg font-medium mb-3">Select Project or Create New</h3>
        <Select 
          onValueChange={handleProjectChange}
          defaultValue={mockProjects[0].name}
        >
          <SelectTrigger className="form-select">
            <SelectValue placeholder="Select a project" />
          </SelectTrigger>
          <SelectContent>
            {mockProjects.map((project) => (
              <SelectItem key={project.id} value={project.name}>
                {project.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="form-input-wrapper">
        <Label htmlFor="fullName" className="form-label">
          Full Name
        </Label>
        <Input
          id="fullName"
          name="fullName"
          className="form-input"
          value={contactInfo.fullName}
          onChange={handleChange}
          placeholder="Enter your full name"
        />
      </div>

      <div className="form-input-wrapper">
        <Label htmlFor="email" className="form-label">
          Email Address
        </Label>
        <Input
          id="email"
          name="email"
          type="email"
          className="form-input"
          value={contactInfo.email}
          onChange={handleChange}
          placeholder="Enter your email address"
        />
      </div>

      <div className="form-input-wrapper">
        <Label htmlFor="phone" className="form-label">
          Phone Number
        </Label>
        <Input
          id="phone"
          name="phone"
          className="form-input"
          value={contactInfo.phone}
          onChange={handleChange}
          placeholder="Enter your phone number"
        />
      </div>

      <div className="form-input-wrapper">
        <Label htmlFor="address" className="form-label">
          Address <span className="text-red-500">*</span>
        </Label>
        <Input
          id="address"
          name="address"
          className="form-input"
          value={contactInfo.address}
          onChange={handleChange}
          placeholder="Enter your full address"
        />
      </div>
    </div>
  );
};
