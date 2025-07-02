"use client";

import Students from "@/components/attendance-management/students";
import StepNavigation from "@/components/form-generator/step-navigation";
import { useState } from "react";
import { useGetStudents } from "../_hooks/student_hooks";
import { useParams } from "next/navigation";
import Statistics from "@/components/attendance-management/statistics";
import CheckIn from "@/components/attendance-management/check-in";

export default function AttendanceManagementPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const steps = ["students", "check-in", "review"];
  const { formId } = useParams();
  console.log(formId);
  const { data } = useGetStudents(formId as string);

  if (!data) {
    return (
      <div className="flex justify-center text-center">DATA NOT FOUND</div>
    );
  }

  console.log(data);

  return (
    <div className=" mx-auto p-4 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <StepNavigation
          steps={steps}
          currentStep={currentStep}
          onStepChange={(step) => setCurrentStep(step)}
        />
      </div>

      {currentStep === 0 && data && <Students data={data} />}
      {currentStep === 1 && <CheckIn data={data} />}
      {currentStep === 2 && <Statistics />}
    </div>
  );
}
