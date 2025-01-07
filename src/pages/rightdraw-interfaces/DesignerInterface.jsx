import React, { useState, useMemo, useEffect } from 'react';
import { ChevronRight, ChevronDown, Check, AlertCircle, FileText, ClipboardCheck, Component } from 'lucide-react';
import {
  Input,
  Select,
  Button,
  Card,
  Checkbox,
} from '../../components/common/ReusableComponents';
import { ArrowDown, ArrowUp, Target } from 'lucide-react';



const DesignerInterface = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    basicInfo: {
      oppNumber: '',
      opuNumber: '',
      eduNumber: '',
      modelName: '',
      partNumber: '',
     
    },
    materials: {
      // Dielectric related
      dielectricMaterialThickness: "",
      dielectricMaterial: "",
      dielectricThickness: "",
      
      // Copper related
      copperThickness: "",
      
      // Layer related
      numberOfLayers: "",
      secondDielectricThickness: "",
      
      // B14 related
      b14Finish: "",
      b14Size: ""
    },
    specifications: {
      connectorCategory: '',
      connectorSubCategory: '',
      feedThruPin: '',
      feedThruSubCategory: ''
    },
    designRules: {
      
      category: "", 
      subCategory:"",
  optionsChecked: {
    fixedComponents: false,
    aircoil: false,
    xfmr: false,
    ceramicResonator: false,
    couplingPCB: false,
    copperTAB: false,
    headerPackageA01: false
      },
      fetchRules: false,
      acknowledge:false
    }
  });

  const [rules, setRules] = useState([]);
  const [showConnectorSubCategory, setShowConnectorSubCategory] = useState(false);
const [showFeedThruSubCategory, setShowFeedThruSubCategory] = useState(false);
const [subOptions, setSubOptions] = useState([]);
const [feedThruSubOpts, setFeedThruSubOpts] = useState([]);
  // Validation functions for each step
  useEffect(() => {
    formData.designRules.fetchRules && setRules([
    {
      rule: "Component Placement X-Coordinate",
      description: "Ensures accurate placement along the X-axis.",
      min: -0.1, // Example: -0.1mm
      max: 0.1,  // Example: 0.1mm
      nominal: 0,  // Example: 0mm 
    },
    {
      rule: "Component Placement Y-Coordinate",
      description: "Ensures accurate placement along the Y-axis.",
      min: -0.1, // Example: -0.1mm
      max: 0.1,  // Example: 0.1mm
      nominal: 0,  // Example: 0mm 
    },
    {
      rule: "Component Rotation",
      description: "Maintains correct component orientation.",
      min: -1,   // Example: -1 degree
      max: 1,    // Example: 1 degree
      nominal: 0,  // Example: 0 degrees
    },
    {
      rule: "Component Height",
      description: "Prevents component interference.",
      min: 0.8,  // Example: 0.8mm 
      max: 1.2,  // Example: 1.2mm
      nominal: 1,   // Example: 1mm
    },
    {
      rule: "Lead Length (if applicable)",
      description: "Ensures proper solder joint formation.",
      min: 2,    // Example: 2mm
      max: 2.5,  // Example: 2.5mm
      nominal: 2.25, // Example: 2.25mm
    },
    {
      rule: "Lead Straightness (if applicable)",
      description: "Prevents bending and improves solderability.",
      min: 0,    // Example: 0 degrees 
      max: 2,    // Example: 2 degrees
      nominal: 0,  // Example: 0 degrees
    },
    {
      rule: "Component Thickness",
      description: "Ensures compatibility with PCB design.",
      min: 1.4,  // Example: 1.4mm
      max: 1.6,  // Example: 1.6mm
      nominal: 1.5, // Example: 1.5mm
    },
    {
      rule: "Component Width (if applicable)",
      description: "Maintains correct component dimensions.",
      min: 4.9,  // Example: 4.9mm
      max: 5.1,  // Example: 5.1mm
      nominal: 5,   // Example: 5mm
    },
    {
      rule: "Component Length (if applicable)",
      description: "Maintains correct component dimensions.",
      min: 9.8,  // Example: 9.8mm
      max: 10.2, // Example: 10.2mm
      nominal: 10,  // Example: 10mm
    },
    {
      rule: "Component Spacing (if applicable)",
      description: "Prevents component interference and shorts.",
      min: 0.2,  // Example: 0.2mm
      max: 0.3,  // Example: 0.3mm
      nominal: 0.25, // Example: 0.25mm
    }
  ])
},[formData.designRules.fetchRules])
  useEffect(() => {
    if (formData.specifications.connectorCategory) {
      setShowConnectorSubCategory(true);
      setSubOptions(connectorSubCategoryOptions[formData.specifications.connectorCategory] || []);
    } else {
      setShowConnectorSubCategory(false);
    }
  }, [formData.specifications.connectorCategory]);
  
  useEffect(() => {
    if (formData.specifications.feedThruPin) {
      setShowFeedThruSubCategory(true);
      setFeedThruSubOpts(feedThruPinSubOptions[formData.specifications.feedThruPin] || []);
    } else {
      setShowFeedThruSubCategory(false);
    }
  }, [formData.specifications.feedThruPin]);
  const validateStep1 = () => {
    const { oppNumber, opuNumber, modelName, partNumber } = formData.basicInfo;
    return Boolean(oppNumber && opuNumber && modelName && partNumber);
  };

  const validateStep2 = () => {
    const { 
      dielectricMaterialThickness,
      dielectricMaterial, 
      dielectricThickness, 
      copperThickness, 
      numberOfLayers,
      b14Finish,
      b14Size 
    } = formData.materials;
    
    return Boolean(
      dielectricMaterialThickness &&
      dielectricMaterial && 
      dielectricThickness && 
      copperThickness && 
      numberOfLayers &&
      b14Finish &&
      b14Size
    );
  };

  const validateStep3 = () => {
    const { connectorCategory, connectorSubCategory, feedThruPin, feedThruSubCategory } = formData.specifications;
    // Valid if either connector OR feed thru pin combination is filled
    return Boolean(
      (connectorCategory && connectorSubCategory) || 
      (feedThruPin && feedThruSubCategory)
    );
  };

  const validateStep4 = () => {
    return formData.designRules.subCategory !== ""; // Requires both rules to be fetchRules
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
  const dielectricMaterialThicknessOptions = [
    { value: "Alumina Ceramic", label: "Alumina Ceramic" },
    { value: "ITEQ: FR4 Grade IT180A", label: "ITEQ: FR4 Grade IT180A" },
    { value: "Rogers: AD250C", label: "Rogers: AD250C" },
    { value: "Rogers: AD2550", label: "Rogers: AD2550" },
    { value: "Rogers: CLTE-AT", label: "Rogers: CLTE-AT" },
    { value: "Rogers: RO3003", label: "Rogers: RO3003" },
    { value: "Rogers: RO3210", label: "Rogers: RO3210" },
    { value: "Rogers: RO4003C", label: "Rogers: RO4003C" },
    { value: "Rogers: RO4233", label: "Rogers: RO4233" },
    { value: "Rogers: RO4350B", label: "Rogers: RO4350B" },
    { value: "Rogers: RO4450B", label: "Rogers: RO4450B" },
    { value: "Rogers: RO4450F", label: "Rogers: RO4450F" },
    { value: "Rogers: RO4730G3", label: "Rogers: RO4730G3" },
    { value: "Rogers: RO4835", label: "Rogers: RO4835" },
    { value: "Rogers: RO5870", label: "Rogers: RO5870" },
    { value: "Rogers: RT DUROID 5870", label: "Rogers: RT DUROID 5870" },
    { value: "Rogers: RT DUROID 5880", label: "Rogers: RT DUROID 5880" },
    { value: "Rogers: RT DUROID 6002", label: "Rogers: RT DUROID 6002" },
    { value: "Rogers: RT DUROID 6035HTC", label: "Rogers: RT DUROID 6035HTC" },
    { value: "Taconic: OAK-10", label: "Taconic: OAK-10" },
    { value: "Taconic: OAK-202", label: "Taconic: OAK-202" },
    { value: "Taconic: OAK-3", label: "Taconic: OAK-3" },
    { value: "Taconic: OAK-4", label: "Taconic: OAK-4" },
    { value: "Taconic: OAK-601", label: "Taconic: OAK-601" },
    { value: "Taconic: OAK-602", label: "Taconic: OAK-602" },
    { value: "Taconic: OAK-603", label: "Taconic: OAK-603" },
    { value: "Taconic: TLP-5", label: "Taconic: TLP-5" },
    { value: "Taconic: TLX-0", label: "Taconic: TLX-0" },
    { value: "Taconic: TLX-9", label: "Taconic: TLX-9" },
    { value: "Taconic: TLY-5", label: "Taconic: TLY-5" },
    { value: "TMM10i", label: "TMM10i" },
    { value: "Isola: FR4 Grade 370HR", label: "Isola: FR4 Grade 370HR" },
    { value: "Isola: IS680 Dk=2.80", label: "Isola: IS680 Dk=2.80" },
    { value: "Isola: Polymide P95", label: "Isola: Polymide P95" },
    { value: "Isola: Astra MT77", label: "Isola: Astra MT77" },
    { value: "FR4 GradeTU768", label: "FR4 GradeTU768" },
    { value: "FR4 GradeTU872", label: "FR4 GradeTU872" },
    { value: "Panasonic: Megtron-6 R-5575K", label: "Panasonic: Megtron-6 R-5575K" },
    { value: "Panasonic: Megtron-6 R-5670", label: "Panasonic: Megtron-6 R-5670" },
    { value: "Panasonic: Megtron-6 R-5670G", label: "Panasonic: Megtron-6 R-5670G" },
    { value: "Panasonic: Megtron-6 R-5670N", label: "Panasonic: Megtron-6 R-5670N" },
    { value: "Panasonic: Megtron-6 R-5775", label: "Panasonic: Megtron-6 R-5775" },
    { value: "Panasonic: Megtron-6 R-5775G", label: "Panasonic: Megtron-6 R-5775G" },
    { value: "Panasonic: Megtron-6 R-5775K", label: "Panasonic: Megtron-6 R-5775K" },
    { value: "Panasonic: Megtron-6 R-5775N", label: "Panasonic: Megtron-6 R-5775N" },
    { value: "Panasonic: Megtron-7 R-5680N", label: "Panasonic: Megtron-7 R-5680N" },
    { value: "Panasonic: Megtron-7 R-5785GN", label: "Panasonic: Megtron-7 R-5785GN" },
    { value: "Panasonic: Megtron-7 R-5785N", label: "Panasonic: Megtron-7 R-5785N" }
  ];
  const dielectricThicknessOptions = [
    { value: "0.004", label: "0.004\"" },
    { value: "0.0066", label: "0.0066" },
    { value: "0.0073", label: "0.0073" },
    { value: "0.01", label: "0.01" },
    { value: "0.0107", label: "0.0107" },
    { value: "0.015", label: "0.015" },
    { value: "0.02", label: "0.02" },
    { value: "0.024", label: "0.024" },
    { value: "0.028", label: "0.028" },
    { value: "0.03", label: "0.03" },
    { value: "0.039", label: "0.039" },
    { value: "0.059", label: "0.059" },
    { value: "0.06", label: "0.06" }
  ];
  
  const b14FinishOptions = [
    { value: "Electrolytic Gold", label: "Electrolytic Gold" },
    { value: "ENEPIG", label: "ENEPIG" },
    { value: "ENIG", label: "ENIG" },
    { value: "IAG", label: "IAG" },
    { value: "Immersion Tin", label: "Immersion Tin" },
    { value: "ISN", label: "ISN" },
    { value: "Laminate", label: "Laminate" },
    { value: "LF-HASL", label: "LF-HASL" },
    { value: "Macdermid M-Coat", label: "Macdermid M-Coat" },
    { value: "No Plating", label: "No Plating" },
    { value: "OSP", label: "OSP" },
    { value: "Tin HAL", label: "Tin HAL" },
    { value: "Tin/Lead HASL", label: "Tin/Lead HASL" },
    { value: "LPKF", label: "LPKF" }
  ];
  
  const copperThicknessOptions = [
    { value: "0.5", label: "0.5" },
    { value: "1", label: "1" },
    { value: "2", label: "2" },
    { value: "3", label: "3" },
    { value: "4", label: "4" },
    { value: "5", label: "5" },
    { value: "6", label: "6" },
    { value: "7", label: "7" },
    { value: "8", label: "8" }
  ];
  
  const numberOfLayersOptions = [
    { value: "1", label: "1" },
    { value: "2", label: "2" },
    { value: "3", label: "3" },
    { value: "4", label: "4" },
    { value: "5", label: "5" },
    { value: "6", label: "6" },
    { value: "7", label: "7" },
    { value: "8", label: "8" },
    { value: "9", label: "9" },
    { value: "10", label: "10" }
  ];
  
  const secondDielectricThicknessOptions = [
    { value: "0.004", label: "0.004" },
    { value: "0.0066", label: "0.0066" },
    { value: "0.0073", label: "0.0073" },
    { value: "0.01", label: "0.01" },
    { value: "0.0107", label: "0.0107" },
    { value: "0.015", label: "0.015" },
    { value: "0.02", label: "0.02" },
    { value: "0.024", label: "0.024" },
    { value: "0.028", label: "0.028" },
    { value: "0.03", label: "0.03" },
    { value: "0.039", label: "0.039" },
    { value: "0.059", label: "0.059" },
    { value: "0.06", label: "0.06" }
  ];
  
  const b14SizeOptions = [
    { value: "less than or equal to 0.800\" x 0.800\"", label: "less than or equal to 0.800\" x 0.800\"" },
    { value: "greater than 0.800\"", label: "greater than 0.800\"" }
  ];
  const connectorCategoryOptions = [
    { value: "SMA", label: "SMA" },
    { value: "BNC", label: "BNC" },
    { value: "N", label: "N" },
    { value: "TNC", label: "TNC" },
    { value: "SMB", label: "SMB" }
  ];
  
  const feedThruPinOptions = [
    { value: "Feed Thru Pin", label: "Feed Thru Pin" }
  ];
  
  const connectorSubCategoryOptions = {
    "SMA": [
      { value: "SMA Male Thread Size 0.250\"", label: "Male - Thread Size 0.250\"" },
      { value: "SMA Female Thread Size 0.250\"", label: "Female - Thread Size 0.250\"" },
      { value: "SMA Female Thread size 0.375\"", label: "Female - Thread size 0.375\"" }
    ],
    "BNC": [
      { value: "BNC Male Thread size 0.375\"", label: "Male - Thread size 0.375\"" },
      { value: "BNC Female Thread size 0.375\"", label: "Female - Thread size 0.375\"" }
    ],
    "N": [
      { value: "N Male Thread size 0.375\"", label: "Male - Thread size 0.375\"" },
      { value: "N Female Thread size 0.375\"", label: "Female - Thread size 0.375\"" }
    ],
    "TNC": [
      { value: "TNC Male Thread size 0.375\"", label: "Male - Thread size 0.375\"" },
      { value: "TNC Female Thread size 0.375\"", label: "Female - Thread size 0.375\"" }
    ],
    "SMB": [
      { value: "SMB Female Thread size 0.190\"", label: "Female - Thread size 0.190\"" }
    ]
  };
  
  const feedThruPinSubOptions = {
    "Feed Thru Pin": [
      { value: "Feed Thru Pin Thread size 0.165\"", label: "Thread size 0.165\"" },
      { value: "Feed Thru Pin Thread size 0.136\"", label: "Thread size 0.136\"" }
    ]
  };

  //DesignRules options
  const componentSubCtegoryOptions = [
    { value: 'SMT', label: 'SMT' },
    { value: 'Connectorize d in Hollow enclosure like H16 C.S', label: 'Connectorize d in Hollow enclosure like H16 C.S' },
    { value: 'Connectorize d in Solid', label: 'Connectorize d in Solid' },
    { value: 'Connectorize d of MMIC package', label: 'Connectorize d of MMIC package' },
    { value: 'Connectorize d of Unibody with Solid bottom', label: 'Connectorize d of Unibody with Solid bottom' },
    { value: 'Connectorize d of Unibody with hollow for double side assy', label: 'Connectorize d of Unibody with hollow for double side assy' },
    { value: 'Plug-in', label: 'Plug-in' },
    { value: 'Plug-in Wave Soldering', label: 'Plug-in Wave Soldering' }
  ];

  const handleFieldChange = (section, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: { ...prev[section], [field]: value }
    }));
  };

  
  const renderStepIndicator = () => (
    <div className="flex justify-between items-center mb-8 px-4">
      {[1, 2, 3, 4].map((stepNum) => (
        <div key={stepNum} className="flex items-center flex-1 last:flex-none">
          <div className={`
            w-10 h-10 rounded-full flex items-center justify-center font-medium shadow-sm
            ${step === stepNum 
              ? ' bg-accent-500 text-white ring-4 ring-blue-100' 
              : step > stepNum 
                ? 'bg-green-400 text-white' 
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
              
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
      <h2 className="text-2xl font-bold text-primary-800">Material Specifications</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Select
          label="Dielectric Material Thickness"   
          options={dielectricMaterialThicknessOptions}
          value={formData.materials.dielectricMaterialThickness}
          onChange={(value) => handleFieldChange('materials', 'dielectricMaterialThickness', value)}
          required
        />
        <Select
          label="Dielectric Material"   
          options={dielectricMaterialThicknessOptions}
          value={formData.materials.dielectricMaterial}
          onChange={(value) => handleFieldChange('materials', 'dielectricMaterial', value)}
          required
        />
        <Select
          label="Dielectric Thickness"
          options={dielectricThicknessOptions}
          value={formData.materials.dielectricThickness}
          onChange={(value) => handleFieldChange('materials', 'dielectricThickness', value)}
          required
        />
        <Select
          label="B14 Finish"
          options={b14FinishOptions}
          value={formData.materials.b14Finish}
          onChange={(value) => handleFieldChange('materials', 'b14Finish', value)}
          required
        />
        <Select
          label="Copper Thickness"
          options={copperThicknessOptions}
          value={formData.materials.copperThickness}
          onChange={(value) => handleFieldChange('materials', 'copperThickness', value)}
          required
        />
        <Select
          label="Number of Layers"
          options={numberOfLayersOptions}
          value={formData.materials.numberOfLayers}
          onChange={(value) => handleFieldChange('materials', 'numberOfLayers', value)}
          required
        />
        <Select
          label="Second Dielectric Thickness  (If Multi-layered)"
          options={secondDielectricThicknessOptions}
          value={formData.materials.secondDielectricThickness}
          onChange={(value) => handleFieldChange('materials', 'secondDielectricThickness', value)}
          required
        />
        <Select
          label="B14 Size"
          options={b14SizeOptions}
          value={formData.materials.b14Size}
          onChange={(value) => handleFieldChange('materials', 'b14Size', value)}
          required
        />
      </div>
    </div>
        );

        case 3:
          return (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-primary-800">Connector Specifications</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <Select
                    label="Category of Connector"
                    options={connectorCategoryOptions}
                    value={formData.specifications.connectorCategory}
                    onChange={(value) => {
                      handleFieldChange('specifications', 'connectorCategory', value);
                      handleFieldChange('specifications', 'connectorSubCategory', '');
                    }}
                    required
                  />
                  {showConnectorSubCategory && (
                    <Select
                      label="Connector Type"
                      options={subOptions}
                      value={formData.specifications.connectorSubCategory}
                      onChange={(value) => handleFieldChange('specifications', 'connectorSubCategory', value)}
                      required
                    />
                  )}
                </div>
                
                <div className="space-y-4">
                  <Select
                    label="Category of Feed Thru Pin"
                    options={feedThruPinOptions}
                    value={formData.specifications.feedThruPin}
                    onChange={(value) => {
                      handleFieldChange('specifications', 'feedThruPin', value);
                      handleFieldChange('specifications', 'feedThruSubCategory', '');
                    }}
                    required
                  />
                  {showFeedThruSubCategory && (
                    <Select
                      label="Feed Thru Pin Type"
                      options={feedThruSubOpts}
                      value={formData.specifications.feedThruSubCategory}
                      onChange={(value) => handleFieldChange('specifications', 'feedThruSubCategory', value)}
                      required
                    />
                  )}
                </div>
              </div>
            </div>
          );
      case 4:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-primary-800">Design Rules</h2>
            <div className="bg-neutral-50 p-6 rounded-lg">
            <Select
          label="Component"   
          options={[{"value": "B14", "label":"B14 (PCB)"}]}
          value={formData.designRules.category}
          onChange={(value) => handleFieldChange('designRules', 'category', value)}
          required
        />
              {formData.designRules.category && <Select
                label="Type of Component"
                options={componentSubCtegoryOptions}
                value={formData.designRules.subCategory}
                onChange={(value) => handleFieldChange('designRules', 'subCategory', value)}
                required
              />}
              {formData.designRules.subCategory && (<div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-700">Component Options</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Checkbox
                    label="Fixed Components"
                    checked={formData.designRules.optionsChecked.fixedComponents}
                    onChange={(checked) => handleFieldChange('designRules', 'optionsChecked', {
                      ...formData.designRules.optionsChecked,
                      fixedComponents: checked
                    })}
                  />
                  <Checkbox
                    label="Aircoil"
                    checked={formData.designRules.optionsChecked.aircoil}
                    onChange={(checked) => handleFieldChange('designRules', 'optionsChecked', {
                      ...formData.designRules.optionsChecked,
                      aircoil: checked
                    })}
                  />
                  <Checkbox
                    label="XFMR"
                    checked={formData.designRules.optionsChecked.xfmr}
                    onChange={(checked) => handleFieldChange('designRules', 'optionsChecked', {
                      ...formData.designRules.optionsChecked,
                      xfmr: checked
                    })}
                  />
                  <Checkbox
                    label="Ceramic Resonator"
                    checked={formData.designRules.optionsChecked.ceramicResonator}
                    onChange={(checked) => handleFieldChange('designRules', 'optionsChecked', {
                      ...formData.designRules.optionsChecked,
                      ceramicResonator: checked
                    })}
                  />
                  <Checkbox
                    label="Coupling PCB"
                    checked={formData.designRules.optionsChecked.couplingPCB}
                    onChange={(checked) => handleFieldChange('designRules', 'optionsChecked', {
                      ...formData.designRules.optionsChecked,
                      couplingPCB: checked
                    })}
                  />
                  <Checkbox
                    label="Copper TAB"
                    checked={formData.designRules.optionsChecked.copperTAB}
                    onChange={(checked) => handleFieldChange('designRules', 'optionsChecked', {
                      ...formData.designRules.optionsChecked,
                      copperTAB: checked
                    })}
                  />
                  <Checkbox
                    label="Header Package A01"
                    checked={formData.designRules.optionsChecked.headerPackageA01}
                    onChange={(checked) => handleFieldChange('designRules', 'optionsChecked', {
                      ...formData.designRules.optionsChecked,
                      headerPackageA01: checked
                    })}
                  />
                </div></div>)}
                {rules.map((rule, index) => (
              <div 
                key={index}
                className="bg-white rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <h3 className="font-semibold text-lg text-gray-900">
                      {rule.rule}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {rule.description}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <div className="flex flex-col items-center px-3 py-2 bg-blue-50 rounded-md">
                      <ArrowUp className="h-4 w-4 text-blue-600" />
                      <span className="text-blue-600 font-medium">{rule.max}</span>
                      <span className="text-xs text-gray-500">Max</span>
                    </div>
                    <div className="flex flex-col items-center px-3 py-2 bg-green-50 rounded-md">
                      <Target className="h-4 w-4 text-green-600" />
                      <span className="text-green-600 font-medium">{rule.nominal}</span>
                      <span className="text-xs text-gray-500">Nominal</span>
                    </div>
                    <div className="flex flex-col items-center px-3 py-2 bg-blue-50 rounded-md">
                      <ArrowDown className="h-4 w-4 text-blue-600" />
                      <span className="text-blue-600 font-medium">{rule.min}</span>
                      <span className="text-xs text-gray-500">Min</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-neutral-900 py-12 px-3 ">
      <Card  className="min-h-[600px] mx-auto bg-white/95 backdrop-blur-md shadow-xl">
        <div className="p-8 ">
          {renderStepIndicator()}
          {renderStepContent()}
          
          <div className="flex justify-between mt-8 pt-6 border-t border-neutral-200">
            <div className="w-20">
              {step > 1 && (
                <Button 
                  variant="secondary"
                  className="text-neutral-100 bg-primary-600 hover:bg-primary-700 transition-colors"
                  onClick={() => setStep(prev => prev - 1)}
                >
                  Previous
                </Button>
              )}
            </div>
            
            <div className="flex gap-4">
            {step === 4 && formData.designRules.subCategory && (
                
                <Button
                  variant="secondary"
                  className="text-neutral-100 bg-secondary-600 hover:bg-secondary-700 transition-colors"
                  onClick={() => handleFieldChange('designRules', "fetchRules", true)}
                >
                 
                Get Rules
                </Button>
              )}
    
              {step === 4 && formData.designRules.fetchRules && (
                <>
                  <Checkbox
                    label="Acknowledge"
                    checked={formData.designRules.optionsChecked.acknowledge}
                    onChange={(prev) => handleFieldChange('designRules', 'acknowledge', !formData.designRules.acknowledge)}
                  />
                  {formData.designRules.acknowledge && <Button
                  variant="secondary"
                  className="text-neutral-100 bg-secondary-600 hover:bg-secondary-700 transition-colors"
                  onClick={() => {
                    // Export logic here
                  }}
                >
                  <FileText className="mr-2 h-4 w-4" />
                  Export PDF
                </Button>}
                </>
                
              )}
              {step !== 4 && <Button
                variant="primary"
                className="bg-accent-500 hover:bg-accent-600 text-white transition-colors"
                disabled={!isStepValid}
                onClick={() => step < 4 ? setStep(prev => prev + 1) : console.log('Submit', formData)}
              >
                Next
              </Button>}
              {step === 4 && formData.designRules.acknowledge && <Button
                variant="primary"
                className="bg-accent-500 hover:bg-accent-600 text-white transition-colors"
                disabled={!isStepValid}
                onClick={() => step < 4 ? setStep(prev => prev + 1) : console.log('Submit', formData)}
              >
                Submit
              </Button>}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default DesignerInterface