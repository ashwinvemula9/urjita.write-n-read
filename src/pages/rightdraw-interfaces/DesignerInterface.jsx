import React, { useState, useEffect, useCallback } from 'react';
import { ArrowDown, ArrowUp, Target, FileText, } from 'lucide-react';
import { Input, Select, Checkbox, Button, Card, FormSection } from '../../components/common/ReusableComponents';
import { pcbAPI, componentsAPI, rulesAPI } from '../../services/api/endpoints';
import { toast } from 'react-toastify';

// Step configurations
const STEPS = {
  BASIC_INFO: 'basicInfo',
  PCB_SPECS: 'pcbSpecs',
  DESIGN_RULES: 'designRules'
};

const STEP_ORDER = [STEPS.BASIC_INFO, STEPS.PCB_SPECS, STEPS.DESIGN_RULES];

const REQUIRED_FIELDS = {
  [STEPS.BASIC_INFO]: ['oppNumber', 'opuNumber', 'modelName', 'partNumber',"component"],
  [STEPS.PCB_SPECS]: [],
  [STEPS.DESIGN_RULES]: ['selectedSubCategory']
};

const initialState = {
  [STEPS.BASIC_INFO]: {
    oppNumber: '',
    opuNumber: '',
    eduNumber: '',
    modelName: '',
    partNumber: '',
    component: '',
  },
  [STEPS.PCB_SPECS]: {
    specifications: [],
    selectedSpecs: {},
  },
  [STEPS.DESIGN_RULES]: {
    selectedCheckboxes: {},
    rules: [],
    acknowledge: false,
 
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
  async function fetchRules() {
    try {
      const resp = await rulesAPI.getRules()
      console.log({resp})
      setFormData((prev) => {
        return {
          ...prev,
          [STEPS.DESIGN_RULES]: {
            ...prev[STEPS.DESIGN_RULES],
            rules:resp
            
          }
        }

      })
  
    } catch {
      toast.error("Something Went wrong, Please try again later")
    }
  }

  useEffect(() => {
    if (currentStep === 2) {
      fetchRules()
      
    }
  },[currentStep])

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

      setFormData(prev => {
       const tempSpecs = specs
        tempSpecs[4]={
          "category_id": 5,
          "category_name": "B14 Size",
          "subcategories": [
            
              {
                  "id": 17,
                  "name": "SMT",
                  "is_design_options_exists": true,
                  "is_sub_2_categories_exists": false
              },
              {
                  "id": 18,
                  "name": "Plug-in",
                  "is_design_options_exists": false,
                  "is_sub_2_categories_exists": false
              },
              {
                  "id": 19,
                  "name": "Connectorized in Solid Bottom case",
                  "is_design_options_exists": false,
                  "is_sub_2_categories_exists": false
              }
          
          ]
        }
        return {
          ...prev,
          [STEPS.BASIC_INFO]: {
            ...prev[STEPS.BASIC_INFO],
            components,

          },
       

          [STEPS.PCB_SPECS]: {

            ...prev[STEPS.PCB_SPECS],
            specifications: tempSpecs
          },
        }
      });
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
  // const fetchRules = useCallback(async (componentId) => {
  //   if (!componentId) return;

  //   try {
  //     setLoading(true);
  //     setError(null);
      
  //     const response = await pcbAPI.getSectionGroupings(componentId);
  //     console.log(response)
  //     if (!response?.[0]?.rules) {
  //       throw new Error('No rules found for this component');
  //     }

  //     setFormData(prev => ({
  //       ...prev,
  //       [STEPS.DESIGN_RULES]: {
  //         ...prev[STEPS.DESIGN_RULES],
  //         rules: response[0].rules
  //       }
  //     }));
  //   } catch (err) {
  //     setError(err.message || 'An error occurred while loading rules');
  //   } finally {
  //     setLoading(false);
  //   }
  // }, [formData[STEPS.DESIGN_RULES].subCategories]);

  // useEffect(() => {
  //   const { selectedComponent, selectedSubCategory } = formData[STEPS.DESIGN_RULES];
  //   if (selectedComponent && selectedSubCategory) {
  //     fetchRules(selectedComponent);
  //   }
  // }, [
  //   formData[STEPS.DESIGN_RULES].selectedComponent,
  //   formData[STEPS.DESIGN_RULES].selectedSubCategory,
  //   fetchRules
  // ]);

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
  console.log(formData)

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
        <Select
          label="Component"
          options={[{
            value: 'b14',
            label: "B14"
          }]}
          value={formData[STEPS.BASIC_INFO].component}
          onChange={(value) => handleFieldChange(STEPS.BASIC_INFO, 'component', value)}
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
      <div className="w-full max-w-7xl mx-auto p-6 bg-white rounded-xl shadow-sm">
      <h2 className="text-2xl font-bold text-gray-900 mb-8">Select Options for design rules to be followed</h2>
      
      <div className="grid gap-8">
        {/* Left sidebar with checkboxes */}
        <div className="col-span-3 border-r border-gray-200 pr-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Select Design Options:</h3>
      <div className="space-y-4">
        {formData[STEPS.DESIGN_RULES].rules.map((option) => (
          <label
            key={option.design_option_id}
            className="flex items-center gap-3 cursor-pointer group transition-colors duration-200 p-3 rounded-lg hover:bg-gray-50"
          >
            <input
              type="checkbox"
              className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 
                        cursor-pointer transition-colors duration-200
                        checked:bg-blue-600 checked:border-transparent
                        hover:border-blue-600"
              checked={formData[STEPS.DESIGN_RULES].selectedCheckboxes[option.design_option_id] || false}
              onChange={(e) => {
                handleFieldChange(
                  STEPS.DESIGN_RULES,
                  'selectedCheckboxes',
                  {
                    ...formData[STEPS.DESIGN_RULES].selectedCheckboxes,
                    [option.design_option_id]: e.target.checked
                  }
                );
              }}
            />
            <div className="text-sm font-medium pl-3 text-gray-700 group-hover:text-gray-900 transition-colors duration-200">
              {option.desing_option_name}
            </div>
          </label>
        ))}
      </div>
    </div>

        {/* Main content area */}
        <div className="col-span-9">
          <div className="space-y-8">
            {Object.entries(formData[STEPS.DESIGN_RULES].selectedCheckboxes)
              .filter(([_, isSelected]) => isSelected)
              .map(([optionId]) => {
                const option = formData[STEPS.DESIGN_RULES].rules.find(
                  rule => rule.design_option_id.toString() === optionId
                );
                
                if (!option) return null;

                return (
                  <div key={optionId} className="bg-gray-50 rounded-xl p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-6 pb-3 border-b border-gray-200">
                      {option.desing_option_name}
                    </h3>
                    
                    {option.sections_applied.map((section) => (
                      <div key={section.id} className="mb-8 last:mb-0">
                        <h4 className="text-lg font-semibold text-gray-800 mb-4">
                          {section.section_name}
                        </h4>
                        
                        <div className="grid grid-cols-1 gap-4">
                          {section.rules.map((rule) => (
                            <div 
                              key={rule.id} 
                              className="bg-white rounded-lg p-4 border border-gray-200 hover:border-gray-300 transition-colors"
                            >
                              <div className="flex justify-between items-center">
                                <div className="space-y-2">
                                  <div className="flex items-center space-x-3">
                                    <h5 className="font-semibold text-gray-900">
                                      {rule.parameter}
                                    </h5>
                                    <span className="text-xs px-2 py-1 bg-gray-100 rounded-full text-gray-600">
                                      Rule {rule.rule_number}
                                    </span>
                                  </div>
                                  {rule.comments && (
                                    <p className="text-sm text-gray-600">
                                      {rule.comments}
                                    </p>
                                  )}
                                </div>
                                
                                {rule.min_value !== "N/A" && (
                                  <div className="flex items-center space-x-4">
                                    <div className="flex flex-col items-center">
                                      <div className="bg-blue-50 p-2 rounded-lg">
                                        <ArrowUp className="h-5 w-5 text-blue-600" />
                                      </div>
                                      <span className="text-sm font-medium text-blue-600 mt-1">
                                        {rule.max_value}
                                      </span>
                                      <span className="text-xs text-gray-500">Max</span>
                                    </div>
                                    
                                    <div className="flex flex-col items-center">
                                      <div className="bg-green-50 p-2 rounded-lg">
                                        <Target className="h-5 w-5 text-green-600" />
                                      </div>
                                      <span className="text-sm font-medium text-green-600 mt-1">
                                        {rule.nominal}
                                      </span>
                                      <span className="text-xs text-gray-500">Nominal</span>
                                    </div>
                                    
                                    <div className="flex flex-col items-center">
                                      <div className="bg-blue-50 p-2 rounded-lg">
                                        <ArrowDown className="h-5 w-5 text-blue-600" />
                                      </div>
                                      <span className="text-sm font-medium text-blue-600 mt-1">
                                        {rule.min_value}
                                      </span>
                                      <span className="text-xs text-gray-500">Min</span>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })}
          </div>

          {/* Acknowledgment checkbox */}
          {Object.values(formData[STEPS.DESIGN_RULES].selectedCheckboxes).some(Boolean) && (
            <div className="mt-8 pt-6 border-t border-gray-200">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  checked={formData[STEPS.DESIGN_RULES].acknowledge}
                  onChange={(e) => handleFieldChange(STEPS.DESIGN_RULES, 'acknowledge', e.target.checked)}
                />
                <span className="text-sm font-medium text-gray-700">
                  I acknowledge these design rules
                </span>
              </label>
            </div>
          )}
        </div>
      </div>
    </div>
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