import React, { useState } from 'react';
import { FacultySidebar } from './FacultySidebar';
import { FacultyTopBar } from './FacultyTopBar';
import { NextBestActions } from './NextBestActions';
import { Step1CourseSetup } from './steps/Step1CourseSetup';
import { Step2Batches } from './steps/Step2Batches';
import { Step3SessionPlan } from './steps/Step3SessionPlan';
import { Step4LabQuestions } from './steps/Step4LabQuestions';
import { Step5TestBanks } from './steps/Step5TestBanks';
import { Step6SessionsLive } from './steps/Step6SessionsLive';
import { Step7Classroom } from './steps/Step7Classroom';
import { Step8Assessments } from './steps/Step8Assessments';
import { Step9Reports } from './steps/Step9Reports';

interface FacultyWorkspaceProps {
  onSignOut: () => void;
}

export const FacultyWorkspace: React.FC<FacultyWorkspaceProps> = ({
  onSignOut,
}) => {
  const [currentStep, setCurrentStep] = useState<number>(1); // Default to Step 1 (Course Setup)

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <Step1CourseSetup />;
      case 2:
        return <Step2Batches />;
      case 3:
        return <Step3SessionPlan onOpenSession={() => setCurrentStep(6)} />;
      case 4:
        return <Step4LabQuestions />;
      case 5:
        return <Step5TestBanks />;
      case 6:
        return <Step6SessionsLive />;
      case 7:
        return <Step7Classroom />;
      case 8:
        return <Step8Assessments />;
      case 9:
        return <Step9Reports />;
      default:
        return <Step6SessionsLive />;
    }
  };

  return (
    <div className="flex min-h-screen bg-paper text-ink">
      {/* 1. Left Dark Rail (Faculty Sidebar) */}
      <FacultySidebar
        currentStep={currentStep}
        onSelectStep={(step) => setCurrentStep(step)}
        onSignOut={onSignOut}
      />

      {/* 2. Middle Column: Header + Active Step Body */}
      <div className="flex-1 flex flex-col min-w-0">
        <FacultyTopBar onSelectStep={(step) => setCurrentStep(step)} />

        <main className="flex-1 p-6 lg:p-8 max-w-6xl w-full mx-auto">
          {renderStep()}
        </main>
      </div>

      {/* 3. Right Column: Next Best Actions & Today's Agenda */}
      <NextBestActions onSelectStep={(step) => setCurrentStep(step)} />
    </div>
  );
};
