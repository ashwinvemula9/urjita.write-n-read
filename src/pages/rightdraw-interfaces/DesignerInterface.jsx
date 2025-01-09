import React, { useState, useEffect, useCallback } from 'react';
import { ArrowDown, ArrowUp, Target, FileText } from 'lucide-react';
import { Input, Select, Checkbox, Button, Card, FormSection } from '../../components/common/ReusableComponents';
import { pcbAPI, componentsAPI } from '../../services/api/endpoints';

// Step configurations
const STEPS = {
  BASIC_INFO: 'basicInfo',
  PCB_SPECS: 'pcbSpecs',
  DESIGN_RULES: 'designRules'
};

const STEP_ORDER = [STEPS.BASIC_INFO, STEPS.PCB_SPECS, STEPS.DESIGN_RULES];

const REQUIRED_FIELDS = {
  [STEPS.BASIC_INFO]: ['oppNumber', 'opuNumber', 'modelName', 'partNumber'],
  [STEPS.PCB_SPECS]: [],
  [STEPS.DESIGN_RULES]: ['selectedComponent', 'selectedSubCategory']
};

const initialState = {
  [STEPS.BASIC_INFO]: {
    oppNumber: '',
    opuNumber: '',
    eduNumber: '',
    modelName: '',
    partNumber: ''
  },
  [STEPS.PCB_SPECS]: {
    specifications: [],
    selectedSpecs: {}
  },
  [STEPS.DESIGN_RULES]: {
    components: [],
    selectedComponent: '',
    subCategories: [],
    selectedSubCategory: '',
    rules: [],
    acknowledge: false
  }
};

const DesignerInterface = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isDirty, setIsDirty] = useState(false);

  // Load saved form data if exists
  useEffect(() => {
    const savedData = localStorage.getItem('designerFormData');
    if (savedData) {
      try {
        setFormData(JSON.parse(savedData));
      } catch (err) {
        console.error('Error loading saved form data:', err);
      }
    }
  }, []);

  // Save form data when it changes
  useEffect(() => {
    if (isDirty) {
      localStorage.setItem('designerFormData', JSON.stringify(formData));
    }
  }, [formData, isDirty]);

  // Prompt user before leaving if form is dirty
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty]);

  // Fetch initial data
  const fetchInitialData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [specs, components] = await Promise.all([
        pcbAPI.getSpecification(1),
        componentsAPI.getAll()
      ]);
      
      if (!specs || !components) {
        throw new Error('Failed to load initial data');
      }

      setFormData(prev => ({
        ...prev,
        [STEPS.PCB_SPECS]: {
          ...prev[STEPS.PCB_SPECS],
          specifications: specs
        },
        [STEPS.DESIGN_RULES]: {
          ...prev[STEPS.DESIGN_RULES],
          components
        }
      }));
    } catch (err) {
      setError(err.message || 'An error occurred while loading initial data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  // Fetch rules when component and subcategory are selected
  const fetchRules = useCallback(async (componentId) => {
    if (!componentId) return;

    try {
      setLoading(true);
      setError(null);
      
      const response = await pcbAPI.getSectionGroupings(componentId);
      console.log(response)
      if (!response?.[0]?.rules) {
        throw new Error('No rules found for this component');
      }

      setFormData(prev => ({
        ...prev,
        [STEPS.DESIGN_RULES]: {
          ...prev[STEPS.DESIGN_RULES],
          rules: response[0].rules
        }
      }));
    } catch (err) {
      setError(err.message || 'An error occurred while loading rules');
    } finally {
      setLoading(false);
    }
  }, [formData[STEPS.DESIGN_RULES].subCategories]);

  useEffect(() => {
    const { selectedComponent, selectedSubCategory } = formData[STEPS.DESIGN_RULES];
    if (selectedComponent && selectedSubCategory) {
      fetchRules(selectedComponent);
    }
  }, [
    formData[STEPS.DESIGN_RULES].selectedComponent,
    formData[STEPS.DESIGN_RULES].selectedSubCategory,
    fetchRules
  ]);

  // Improved validation functions
  const validators = {
    [STEPS.BASIC_INFO]: (data) => {
      return REQUIRED_FIELDS[STEPS.BASIC_INFO].every(field => 
        data[field]?.trim().length > 0
      );
    },
    [STEPS.PCB_SPECS]: (data) => {
      if (!data.specifications.length) return false;
      return Object.keys(data.selectedSpecs).length === data.specifications.length;
    },
    [STEPS.DESIGN_RULES]: (data) => {
      return REQUIRED_FIELDS[STEPS.DESIGN_RULES].every(field => 
        data[field]?.trim().length > 0
      ) && data.acknowledge && data.rules.length > 0;
    }
  };

  const handleFieldChange = useCallback((step, field, value) => {
    setIsDirty(true);
    setFormData(prev => ({
      ...prev,
      [step]: {
        ...prev[step],
        [field]: value
      }
    }));
  }, []);

  const currentStepKey = STEP_ORDER[currentStep];
  const isCurrentStepValid = validators[currentStepKey]?.(formData[currentStepKey]) ?? false;

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError(null);

      // Validate all steps
      const isValid = STEP_ORDER.every(step => 
        validators[step](formData[step])
      );

      if (!isValid) {
        throw new Error('Please complete all required fields');
      }

      // Add your submit logic here
      await submitForm(formData);
      
      // Reset form on success
      setFormData(initialState);
      setCurrentStep(0);
      setIsDirty(false);
      localStorage.removeItem('designerFormData');
      
    } catch (err) {
      setError(err.message || 'An error occurred while submitting the form');
    } finally {
      setLoading(false);
    }
  };

  const handleExportPDF = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Add your PDF export logic here
      // const pdf = await generatePDF(formData);
      // await downloadPDF(pdf);
      
    } catch (err) {
      setError(err.message || 'An error occurred while exporting PDF');
    } finally {
      setLoading(false);
    }
  };

  // Step content components remain the same as in your original code
  const StepContent = {
    [STEPS.BASIC_INFO]: () => (
      <FormSection title="Basic Information">
        <Input
          label="OPP Number"
          value={formData[STEPS.BASIC_INFO].oppNumber}
          onChange={(value) => handleFieldChange(STEPS.BASIC_INFO, 'oppNumber', value)}
          required
        />
        <Input
          label="OPU Number"
          value={formData[STEPS.BASIC_INFO].opuNumber}
          onChange={(value) => handleFieldChange(STEPS.BASIC_INFO, 'opuNumber', value)}
          required
        />
        <Input
          label="EDU Number"
          value={formData[STEPS.BASIC_INFO].eduNumber}
          onChange={(value) => handleFieldChange(STEPS.BASIC_INFO, 'eduNumber', value)}
        />
        <Input
          label="Model Name"
          value={formData[STEPS.BASIC_INFO].modelName}
          onChange={(value) => handleFieldChange(STEPS.BASIC_INFO, 'modelName', value)}
          required
        />
        <Input
          label="Part Number"
          value={formData[STEPS.BASIC_INFO].partNumber}
          onChange={(value) => handleFieldChange(STEPS.BASIC_INFO, 'partNumber', value)}
          required
        />
      </FormSection>
    ),

    [STEPS.PCB_SPECS]: () => (
      <FormSection title="PCB Specifications">
        {formData[STEPS.PCB_SPECS].specifications.map((spec) => (
          <Select
            key={spec.category_id}
            label={spec.category_name}
            options={spec.subcategories.map(sub => ({
              value: sub.id,
              label: sub.name
            }))}
            value={formData[STEPS.PCB_SPECS].selectedSpecs[spec.category_id] || ''}
            onChange={(value) => handleFieldChange(
              STEPS.PCB_SPECS,
              'selectedSpecs',
              {
                ...formData[STEPS.PCB_SPECS].selectedSpecs,
                [spec.category_id]: value
              }
            )}
            required
          />
        ))}
      </FormSection>
    ),

    [STEPS.DESIGN_RULES]: () => (
      <FormSection title="Design Rules">
        <Select
          label="Component"
          options={formData[STEPS.DESIGN_RULES].components.map(comp => ({
            value: comp.id,
            label: comp.component_name
          }))}
          value={formData[STEPS.DESIGN_RULES].selectedComponent}
          onChange={(value) => handleFieldChange(STEPS.DESIGN_RULES, 'selectedComponent', value)}
          required
        />
        {formData[STEPS.DESIGN_RULES].selectedComponent && (
          <Select
            label="Sub Category"
            options={formData[STEPS.DESIGN_RULES].subCategories}
            value={formData[STEPS.DESIGN_RULES].selectedSubCategory}
            onChange={(value) => handleFieldChange(STEPS.DESIGN_RULES, 'selectedSubCategory', value)}
            required
          />
        )}
        {formData[STEPS.DESIGN_RULES].rules.length > 0 && (
          <div className="col-span-2">
            {formData[STEPS.DESIGN_RULES].rules.map((rule, index) => (
              <div key={index} className="bg-white rounded-lg p-4 border border-gray-200 mb-4">
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <h3 className="font-semibold text-lg text-gray-900">
                      {rule.parameter}
                    </h3>
                    <p className="text-sm text-gray-600">
                      Rule {rule.rule_number}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <div className="flex flex-col items-center px-3 py-2 bg-blue-50 rounded-md">
                      <ArrowUp className="h-4 w-4 text-blue-600" />
                      <span className="text-blue-600 font-medium">{rule.max_value}</span>
                      <span className="text-xs text-gray-500">Max</span>
                    </div>
                    <div className="flex flex-col items-center px-3 py-2 bg-green-50 rounded-md">
                      <Target className="h-4 w-4 text-green-600" />
                      <span className="text-green-600 font-medium">{rule.nominal}</span>
                      <span className="text-xs text-gray-500">Nominal</span>
                    </div>
                    <div className="flex flex-col items-center px-3 py-2 bg-blue-50 rounded-md">
                      <ArrowDown className="h-4 w-4 text-blue-600" />
                      <span className="text-blue-600 font-medium">{rule.min_value}</span>
                      <span className="text-xs text-gray-500">Min</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            <Checkbox
              label="I acknowledge these design rules"
              checked={formData[STEPS.DESIGN_RULES].acknowledge}
              onChange={(checked) => handleFieldChange(STEPS.DESIGN_RULES, 'acknowledge', checked)}
            />
          </div>
        )}
      </FormSection>
    )
  };

  const renderStepIndicator = () => (
    <div className="flex justify-between items-center mb-8 px-4">
      {STEP_ORDER.map((stepKey, index) => (
        <div key={stepKey} className="flex items-center flex-1 last:flex-none">
          <div className={`
            w-10 h-10 rounded-full flex items-center justify-center font-medium shadow-sm
            ${currentStep === index 
              ? 'bg-blue-600 text-white ring-4 ring-blue-100' 
              : currentStep > index 
                ? 'bg-green-400 text-white' 
                : 'bg-white border-2 border-gray-200 text-gray-400'}
            transition-all duration-200 relative z-10
          `}>
            {currentStep > index ? (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              index + 1
            )}
          </div>
          {index < STEP_ORDER.length - 1 && (
            <div className="flex-1 relative">
              <div className={`
                absolute top-1/2 -translate-y-1/2 left-0 right-0 h-1
                ${currentStep > index 
                  ? 'bg-green-400' 
                  : 'bg-gray-200'}
                transition-colors duration-300
              `} />
            </div>
          )}
        </div>
      ))}
    </div>
  );


  return (
    <div className="min-h-screen bg-neutral-900 py-12 px-3">
      <Card className="min-h-[600px] mx-auto bg-white/95 backdrop-blur-md shadow-xl">
        <div className="p-8">
          {renderStepIndicator()}
          
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
            </div>
          ) : error ? (
            <div className="text-red-500 text-center p-4">{error}</div>
          ) : (
            StepContent[currentStepKey]?.()
          )}

          <div className="flex justify-between mt-8 pt-6 border-t border-neutral-200">
            <Button
              variant="secondary"
              onClick={() => setCurrentStep(prev => prev - 1)}
              disabled={currentStep === 0}
            >
              Previous
            </Button>
            
            <div className="flex gap-4">
              {currentStep === STEP_ORDER.length - 1 ? (
                <>
                  {formData[STEPS.DESIGN_RULES].acknowledge && (
                    <Button
                      variant="primary"
                      onClick={handleSubmit}
                      disabled={!isCurrentStepValid}
                    >
                      Submit
                    </Button>
                  )}
                  <Button
                    variant="secondary"
                    onClick={() => {/* Export logic */}}
                  >
                    <FileText className="mr-2 h-4 w-4" />
                    Export PDF
                  </Button>
                </>
              ) : (
                <Button
                  variant="primary"
                  onClick={() => setCurrentStep(prev => prev + 1)}
                  disabled={!isCurrentStepValid}
                >
                  Next
                </Button>
              )}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default DesignerInterface;