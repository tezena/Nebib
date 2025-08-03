"use client";

import { Button } from "@/components/ui/button";
import { 
  Settings, 
  Eye, 
  Upload,
  Check,
  ChevronRight,
  Sparkles
} from "lucide-react";
import { cn } from "@/lib/utils";

interface StepNavigationProps {
  steps: string[];
  currentStep: number;
  onStepChange: (step: number) => void;
  canProceed?: boolean;
  onNext?: () => void;
  onPrevious?: () => void;
}

export default function StepNavigation({
  steps,
  currentStep,
  onStepChange,
  canProceed = true,
  onNext,
  onPrevious,
}: StepNavigationProps) {
  const getStepIcon = (step: string, index: number) => {
    switch (step.toLowerCase()) {
      case 'generate':
        return <Sparkles className="w-4 h-4" />;
      case 'review':
        return <Eye className="w-4 h-4" />;
      case 'publish':
        return <Upload className="w-4 h-4" />;
      default:
        return <span className="w-4 h-4 text-xs font-bold">{index + 1}</span>;
    }
  };

  const getStepLabel = (step: string) => {
    switch (step.toLowerCase()) {
      case 'generate':
        return 'Generate';
      case 'review':
        return 'Review';
      case 'publish':
        return 'Publish';
      default:
        return step;
    }
  };

  const getStepDescription = (step: string) => {
    switch (step.toLowerCase()) {
      case 'generate':
        return 'Create your form with smart assistance';
      case 'review':
        return 'Preview and customize your form';
      case 'publish':
        return 'Deploy and share your form';
      default:
        return '';
    }
  };

  const isStepCompleted = (index: number) => currentStep > index;
  const isStepAccessible = (index: number) => currentStep >= index - 1;

  return (
    <div className="w-full">
      {/* Progress Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-4 md:gap-0">
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">Form Generator</h2>
            <p className="text-gray-600 dark:text-gray-400 mt-1 text-sm md:text-base">Create professional forms in minutes</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-xs md:text-sm font-medium text-gray-700 dark:text-gray-300">Step {currentStep + 1} of {steps.length}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">{Math.round(((currentStep + 1) / steps.length) * 100)}% Complete</div>
            </div>
            <div className="w-10 h-10 md:w-16 md:h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-base md:text-lg">{Math.round(((currentStep + 1) / steps.length) * 100)}%</span>
            </div>
          </div>
        </div>
        {/* Progress Bar */}
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 md:h-3 mb-6">
          <div 
            className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 md:h-3 rounded-full transition-all duration-700 ease-out shadow-lg"
            style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Step Navigation */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {steps.map((step, index) => {
          const isCompleted = isStepCompleted(index);
          const isCurrent = currentStep === index;
          const isAccessible = isStepAccessible(index);
          
          return (
            <button
              key={index}
              onClick={() => isAccessible && onStepChange(index)}
              disabled={!isAccessible}
              className={cn(
                "relative p-4 rounded-lg border-2 transition-all duration-200 text-left",
                isCurrent 
                  ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-md" 
                  : isCompleted 
                    ? "border-green-500 bg-green-50 dark:bg-green-900/20" 
                    : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800",
                isAccessible 
                  ? "cursor-pointer hover:shadow-md" 
                  : "cursor-not-allowed opacity-50"
              )}
            >
              <div className="flex items-center gap-3">
                <div className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center",
                  isCurrent 
                    ? "bg-blue-500 text-white" 
                    : isCompleted 
                      ? "bg-green-500 text-white" 
                      : "bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
                )}>
                  {isCompleted ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    getStepIcon(step, index)
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className={cn(
                    "font-medium text-sm",
                    isCurrent 
                      ? "text-blue-700 dark:text-blue-300" 
                      : isCompleted 
                        ? "text-green-700 dark:text-green-300" 
                        : "text-gray-700 dark:text-gray-300"
                  )}>
                    {getStepLabel(step)}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {getStepDescription(step)}
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between items-center">
        <Button
          variant="outline"
          onClick={onPrevious}
          disabled={currentStep === 0}
          className="border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
        >
          Previous
        </Button>
        
        <Button
          onClick={onNext}
          disabled={!canProceed}
          className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
        >
          {currentStep === steps.length - 1 ? 'Finish' : 'Next'}
          <ChevronRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}
