import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Input,
  Select,
  Checkbox,
  Button,
  Card,
  FormSection
} from '../components/common/ReusableComponents'; // Adjust the import path as needed

const PCBSpecificationForm = () => {
  const { logout } = useAuth();
  const [formData, setFormData] = useState({
    basicInfo: {
      oppNumber: '',
      opuNumber: '',
      eduNumber: '',
      modelName: '',
      partNumber: '',
      component: ''
    },
    pcbSpecs: {
      dielectricMaterial: '',
      dielectricThickness: '',
      b14Finish: '',
      categoryForB14: '',
      copperTraceClearanceTop: '',
      copperTraceClearanceBottom: '',
      solderMaskStripWidth: '',
      solderMaskOverhang: ''
    },
    designOptions: {
      fixedComponents: false,
      aircoil: false,
      xfmr: false,
      ceramicResonator: false,
      couplingPCB: false,
      headerPackage: false,
      copperTAB: false
    }
  });

  const [errors, setErrors] = useState({});
  const [guidelines, setGuidelines] = useState([]);

  const components = [
    { value: 'B14', label: 'B14 (PCB)' }
  ];

  const dielectricMaterials = [
    { value: 'FR4_IT180A', label: 'ITEQ: FR4 Grade IT180A' },
    { value: 'RO4350B', label: 'Rogers: RO4350B' },
    { value: 'OAK601', label: 'Taconic: OAK-601' },
    { value: 'TLP5', label: 'Taconic: TLP-5' },
    { value: 'TLX9', label: 'Taconic: TLX-9' }
  ];

  const b14Categories = [
    { value: 'SMT', label: 'SMT' },
    { value: 'PLUGIN', label: 'Plug-in' },
    { value: 'PLUGIN_WAVE', label: 'Plug-in Wave Soldering' },
    { value: 'CONNECTORIZED', label: 'Connectorized' }
  ];

  const b14Finishes = [
    { value: 'ENIG', label: 'ENIG' },
    { value: 'LF_HASL', label: 'LF-HASL' },
    { value: 'NO_PLATING', label: 'No Plating' },
    { value: 'TIN_HAL', label: 'Tin HAL' }
  ];

  const handleBasicInfoChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      basicInfo: { ...prev.basicInfo, [field]: value }
    }));
  };

  const handlePCBSpecsChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      pcbSpecs: { ...prev.pcbSpecs, [field]: value }
    }));
  };

  const handleDesignOptionChange = (option, checked) => {
    setFormData(prev => ({
      ...prev,
      designOptions: { ...prev.designOptions, [option]: checked }
    }));
  };

  useEffect(() => {
    if (formData.pcbSpecs.categoryForB14 === 'SMT') {
      setGuidelines([
        'Copper trace clearance from PCB edges (TOP): Minimum 0.01 inch',
        'Copper trace clearance from PCB edges (BOTTOM): Minimum 0.01 inch',
        'Solder mask strip width: 0.005-0.015 inch',
        'Solder mask overhang: Minimum 0.005 inch',
        'PCB material restrictions for SMT design',
        'PTFE materials requirements'
      ]);
    } else {
      setGuidelines([]);
    }
  }, [formData.pcbSpecs.categoryForB14]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.basicInfo.oppNumber) {
      newErrors.oppNumber = 'OPP Number is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      console.log('Form submitted:', formData);
      // Handle form submission
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-[#C3B8EE] via-[#E7E3F8] to-[#FFFFFF] py-12">
      <div className="max-w-4xl mx-auto px-6">
        <Card
          title="PCB Specification Form"
          gradient={true}
          className="shadow-xl rounded-lg p-6 bg-white border border-[#4A37CD]"
        >
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information */}
            <FormSection title="Basic Information" className="space-y-6">
              <Input
                label="OPP Number"
                value={formData.basicInfo.oppNumber}
                onChange={(value) => handleBasicInfoChange('oppNumber', value)}
                required
                error={errors.oppNumber}
                className="shadow-md focus:ring-2 focus:ring-[#4A37CD]"
              />
              <Input
                label="OPU Number"
                value={formData.basicInfo.opuNumber}
                onChange={(value) => handleBasicInfoChange('opuNumber', value)}
                required
                className="shadow-md focus:ring-2 focus:ring-[#4A37CD]"
              />
              <Select
                label="Component"
                value={formData.basicInfo.component}
                onChange={(value) => handleBasicInfoChange('component', value)}
                options={components}
                required
                className="shadow-md focus:ring-2 focus:ring-[#4A37CD]"
              />
            </FormSection>

            {formData.basicInfo.component === 'B14' && (
              <>
                {/* PCB Specifications */}
                <FormSection title="PCB Specifications" className="space-y-6">
                  <Select
                    label="Dielectric Material"
                    value={formData.pcbSpecs.dielectricMaterial}
                    onChange={(value) => handlePCBSpecsChange('dielectricMaterial', value)}
                    options={dielectricMaterials}
                    required
                    className="shadow-md focus:ring-2 focus:ring-[#6D3CE2]"
                  />
                  <Select
                    label="B14 Finish"
                    value={formData.pcbSpecs.b14Finish}
                    onChange={(value) => handlePCBSpecsChange('b14Finish', value)}
                    options={b14Finishes}
                    required
                    className="shadow-md focus:ring-2 focus:ring-[#6D3CE2]"
                  />
                  <Select
                    label="Category for B14"
                    value={formData.pcbSpecs.categoryForB14}
                    onChange={(value) => handlePCBSpecsChange('categoryForB14', value)}
                    options={b14Categories}
                    required
                    className="shadow-md focus:ring-2 focus:ring-[#6D3CE2]"
                  />
                </FormSection>

                {/* Design Options */}
                <FormSection title="Design Options" className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {Object.keys(formData.designOptions).map((option) => (
                      <Checkbox
                        key={option}
                        label={option.split(/(?=[A-Z])/).join(' ')}
                        checked={formData.designOptions[option]}
                        onChange={(checked) => handleDesignOptionChange(option, checked)}
                        className="transition-colors hover:bg-[#6D3CE2] focus:ring-2 focus:ring-[#6D3CE2]"
                      />
                    ))}
                  </div>
                </FormSection>

                {/* Guidelines */}
                {guidelines.length > 0 && (
                  <div className="bg-[#C3B8EE] border-l-4 border-[#6D3CE2] rounded-lg p-4 mt-6">
                    <h3 className="text-lg font-semibold text-[#4A37CD] mb-2">Design Guidelines</h3>
                    <ul className="list-disc pl-5 space-y-1">
                      {guidelines.map((guideline, index) => (
                        <li key={index} className="text-[#3B3CCC]">{guideline}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </>
            )}

            {/* Submit Button */}
            <div className="flex justify-end pt-4 border-t border-[#4A37CD]">
              <Button
                type="submit"
                variant="primary"
                size="medium"
                className="bg-[#4A37CD] text-white hover:bg-[#5339CF] transition-all"
              >
                Save Specifications
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default PCBSpecificationForm;
