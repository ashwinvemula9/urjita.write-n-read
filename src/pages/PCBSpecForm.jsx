import React, { useState, useMemo } from 'react';
import { ChevronRight, ChevronDown, Check, AlertCircle, FileText, ClipboardCheck } from 'lucide-react';
import {
  Input,
  Select,
  Button,
  Card,
  Checkbox,
} from '../components/common/ReusableComponents';



const PCBSpecForm = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    basicInfo: {
      oppNumber: '',
      opuNumber: '',
      eduNumber: '',
      modelName: '',
      partNumber: '',
      category: ''
    },
    materials: {
      dielectricMaterial: '',
      dielectricThickness: '',
      copperThickness: '',
      numberOfLayers: '',
      secondDielectricThickness: ''
    },
    specifications: {
      b14Finish: '',
      b14Size: '',
      connectorCategory: '',
      feedThruPin: ''
    },
    designRules: {
      acknowledgedRules: [],
      selectedRules: []
    }
  });

  const [expandedRules, setExpandedRules] = useState({});
  // Validation functions for each step
  const validateStep1 = () => {
    const { oppNumber, opuNumber, modelName, partNumber, category } = formData.basicInfo;
    return Boolean(oppNumber && opuNumber && modelName && partNumber && category);
  };

  const validateStep2 = () => {
    const { dielectricMaterial, dielectricThickness, copperThickness, numberOfLayers } = formData.materials;
    return Boolean(dielectricMaterial && dielectricThickness && copperThickness && numberOfLayers);
  };

  const validateStep3 = () => {
    const { b14Finish, b14Size } = formData.specifications;
    return Boolean(b14Finish && b14Size);
  };

  const validateStep4 = () => {
    // Assuming all rules are required
    const requiredRules = ['rule1', 'rule2'];
    return requiredRules.every(ruleId => formData.designRules.acknowledgedRules.includes(ruleId));
  };

  // Memoized validation state for current step
  const isStepValid = useMemo(() => {
    switch (step) {
      case 1:
        return validateStep1();
      case 2:
        return validateStep2();
      case 3:
        return validateStep3();
      case 4:
        return validateStep4();
      default:
        return false;
    }
  }, [step, formData]);

  const categoryOptions =[
    { value: 'B14', label: 'B14 (PCB)' }
  ]

  // Material Options
  const materialOptions = [
    { value: 'alumina_ceramic', label: 'Alumina Ceramic' },
    { value: 'fr4_it180a', label: 'ITEQ: FR4 Grade IT180A' },
    { value: 'ad250c', label: 'Rogers: AD250C' },
    { value: 'ad255c', label: 'Rogers: AD255C' },
    { value: 'ro3003', label: 'Rogers: RO3003' }
  ];

  const thicknessOptions = [
    { value: '0.004', label: '0.004"' },
    { value: '0.0066', label: '0.0066"' },
    { value: '0.0073', label: '0.0073"' },
    { value: '0.01', label: '0.01"' },
    { value: '0.0107', label: '0.0107"' }
  ];

  const layerOptions = [
    { value: '1', label: '1 Layer' },
    { value: '2', label: '2 Layers' },
    { value: '3', label: '3 Layers' },
    { value: '4', label: '4 Layers' },
    { value: '5', label: '5 Layers' }
  ];

  const finishOptions = [
    { value: 'electrolytic_gold', label: 'Electrolytic Gold' },
    { value: 'enepig', label: 'ENEPIG' },
    { value: 'enig', label: 'ENIG' },
    { value: 'iag', label: 'IAG' },
    { value: 'immersion_tin', label: 'Immersion Tin' }
  ];

  const handleFieldChange = (section, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: { ...prev[section], [field]: value }
    }));
  };

  const TimelineItem = ({ rule }) => (
    <div className="border-l-2 border-primary-300 pl-4 py-2">
      <div 
        className="flex items-start cursor-pointer hover:bg-neutral-50 p-2 rounded-lg"
        onClick={() => setExpandedRules(prev => ({ ...prev, [rule.id]: !prev[rule.id] }))}
      >
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-primary-700">{rule.title}</span>
            {rule.required && (
              <AlertCircle size={16} className="text-accent-500" />
            )}
          </div>
          <p className="text-sm text-neutral-600 mt-1">{rule.description}</p>
        </div>
        {expandedRules[rule.id] ? (
          <ChevronDown className="text-neutral-400" size={20} />
        ) : (
          <ChevronRight className="text-neutral-400" size={20} />
        )}
      </div>
      
      {expandedRules[rule.id] && (
        <div className="mt-2 bg-neutral-50 p-4 rounded-lg">
          <div className="grid grid-cols-3 gap-4 mb-3">
            {rule.specifications.map((spec, index) => (
              <div key={index}>
                <span className="text-xs text-neutral-500">{spec.label}</span>
                <p className="text-sm font-medium">{spec.value}</p>
              </div>
            ))}
          </div>
          <Checkbox
            label="I acknowledge this rule"
            checked={formData.designRules.acknowledgedRules.includes(rule.id)}
            onChange={() => {
              handleFieldChange('designRules', 'acknowledgedRules', 
                formData.designRules.acknowledgedRules.includes(rule.id)
                  ? formData.designRules.acknowledgedRules.filter(id => id !== rule.id)
                  : [...formData.designRules.acknowledgedRules, rule.id]
              );
            }}
          />
        </div>
      )}
    </div>
  );

  const renderStepIndicator = () => (
    <div className="flex justify-between items-center mb-8 px-4">
      {[1, 2, 3, 4].map((stepNum) => (
        <div key={stepNum} className="flex items-center flex-1 last:flex-none">
          <div className={`
            w-10 h-10 rounded-full flex items-center justify-center font-medium shadow-sm
            ${step === stepNum 
              ? 'bg-blue-600 text-white ring-4 ring-blue-100' 
              : step > stepNum 
                ? 'bg-emerald-500 text-white' 
                : 'bg-white border-2 border-gray-200 text-gray-400'}
            transition-all duration-200 relative z-10
          `}>
            {step > stepNum ? (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              stepNum
            )}
          </div>
          {stepNum < 4 && (
            <div className="flex-1 relative">
              <div className={`
                absolute top-1/2 -translate-y-1/2 left-0 right-0 h-1
                ${step > stepNum 
                  ? 'bg-emerald-500' 
                  : 'bg-gray-200'}
                transition-colors duration-300
              `} />
            </div>
          )}
        </div>
      ))}
    </div>
  );

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-primary-800">Basic Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="OPP Number"
                value={formData.basicInfo.oppNumber}
                onChange={(value) => handleFieldChange('basicInfo', 'oppNumber', value)}
                required
              />
              <Input
                label="OPU Number"
                value={formData.basicInfo.opuNumber}
                onChange={(value) => handleFieldChange('basicInfo', 'opuNumber', value)}
                required
              />
              <Input
                label="EDU Number"
                value={formData.basicInfo.eduNumber}
                onChange={(value) => handleFieldChange('basicInfo', 'eduNumber', value)}
              />
              <Input
                label="Model Name"
                value={formData.basicInfo.modelName}
                onChange={(value) => handleFieldChange('basicInfo', 'modelName', value)}
                required
              />
              <Input
                label="Part Number"
                value={formData.basicInfo.partNumber}
                onChange={(value) => handleFieldChange('basicInfo', 'partNumber', value)}
                required
              />
              <Select
                label="Category"
                options={categoryOptions}
                value={formData.basicInfo.category}
                onChange={(value) => handleFieldChange('basicInfo', 'category', value)}
                required
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-primary-800">Material Specifications</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Select
                label="Dielectric Material"
                options={materialOptions}
                value={formData.materials.dielectricMaterial}
                onChange={(value) => handleFieldChange('materials', 'dielectricMaterial', value)}
                required
              />
              <Select
                label="Dielectric Thickness"
                options={thicknessOptions}
                value={formData.materials.dielectricThickness}
                onChange={(value) => handleFieldChange('materials', 'dielectricThickness', value)}
                required
              />
              <Select
                label="Number of Layers"
                options={layerOptions}
                value={formData.materials.numberOfLayers}
                onChange={(value) => handleFieldChange('materials', 'numberOfLayers', value)}
                required
              />
              <Select
                label="Copper Thickness"
                options={[
                  { value: '0.5', label: '0.5 oz' },
                  { value: '1', label: '1 oz' },
                  { value: '2', label: '2 oz' }
                ]}
                value={formData.materials.copperThickness}
                onChange={(value) => handleFieldChange('materials', 'copperThickness', value)}
                required
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-primary-800">Design Specifications</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Select
                label="B14 Finish"
                options={finishOptions}
                value={formData.specifications.b14Finish}
                onChange={(value) => handleFieldChange('specifications', 'b14Finish', value)}
                required
              />
              <Select
                label="B14 Size"
                options={[
                  { value: 'small', label: 'Less than or equal to 0.800" x 0.800"' },
                  { value: 'large', label: 'Greater than 0.800"' }
                ]}
                value={formData.specifications.b14Size}
                onChange={(value) => handleFieldChange('specifications', 'b14Size', value)}
                required
              />
              <Select
                label="Connector Category"
                options={[
                  { value: 'sma_male', label: 'SMA Male Thread Size 0.250"' },
                  { value: 'sma_female', label: 'SMA Female Thread Size 0.250"' },
                  { value: 'bnc_male', label: 'BNC Male Thread size 0.375"' }
                ]}
                value={formData.specifications.connectorCategory}
                onChange={(value) => handleFieldChange('specifications', 'connectorCategory', value)}
              />
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-primary-800">Design Rules</h2>
            <div className="bg-neutral-50 p-6 rounded-lg">
              {[
                {
                  id: 'rule1',
                  title: 'Copper Trace Clearance (TOP)',
                  description: 'Minimum clearance requirements for copper traces from PCB edges',
                  required: true,
                  specifications: [
                    { label: 'Minimum', value: '0.01 inch' },
                    { label: 'Nominal', value: '0.015 inch' },
                    { label: 'Maximum', value: '0.02 inch' }
                  ]
                },
                {
                  id: 'rule2',
                  title: 'Solder Mask Requirements',
                  description: 'Specifications for solder mask application and clearance',
                  required: true,
                  specifications: [
                    { label: 'Strip Width', value: '0.005-0.015 inch' },
                    { label: 'Overhang', value: '0.005 inch' }
                  ]
                }
              ].map(rule => (
                <TimelineItem key={rule.id} rule={rule} />
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-neutral-50 py-12 px-4">
      <Card className="max-w-4xl mx-auto">
        <div className="p-8">
          {renderStepIndicator()}
          {renderStepContent()}
          
          <div className="flex justify-between mt-8 pt-6 border-t border-neutral-200">
            <div className="w-20">
              {step > 1 && (
                <Button 
                  variant="secondary"
                  onClick={() => setStep(prev => prev - 1)}
                >
                  Previous
                </Button>
              )}
            </div>
            
            <div className="flex gap-4">
              {step === 4 && (
                <Button
                  variant="secondary"
                  onClick={() => {
                    // Export logic here
                  }}
                >
                  <FileText className="mr-2 h-4 w-4" />
                  Export PDF
                </Button>
              )}
              <Button 
                variant="primary"
                disabled={!isStepValid}
                onClick={() => step < 4 ? setStep(prev => prev + 1) : console.log('Submit', formData)}
              >
                {step === 4 ? (
                  <>
                    <ClipboardCheck className="mr-2 h-4 w-4" />
                    Submit
                  </>
                ) : 'Next'}
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default PCBSpecForm;