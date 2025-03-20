
import React from 'react';
import { ContactInfo } from '@/types/estimator';

interface ProjectDetailsProps {
  contactInfo: ContactInfo;
  roomsCount: number;
}

export const ProjectDetails: React.FC<ProjectDetailsProps> = ({
  contactInfo,
  roomsCount
}) => {
  return (
    <div className="mb-8">
      <h3 className="text-xl font-semibold mb-4">Project Details</h3>
      <dl className="grid grid-cols-[1fr_2fr] gap-y-3">
        <dt className="font-medium text-gray-600">Project Name:</dt>
        <dd>{contactInfo.projectName || "New Project"}</dd>
        
        <dt className="font-medium text-gray-600">Contact:</dt>
        <dd>{contactInfo.fullName}</dd>
        
        <dt className="font-medium text-gray-600">Address:</dt>
        <dd>{contactInfo.address}</dd>
        
        <dt className="font-medium text-gray-600">Rooms:</dt>
        <dd>{roomsCount}</dd>
      </dl>
    </div>
  );
};
