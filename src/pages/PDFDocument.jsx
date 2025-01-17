import React from 'react';
import { Page, Text, View, Document, StyleSheet, pdf } from '@react-pdf/renderer';
import { saveAs } from 'file-saver';

// Create styles
const styles = StyleSheet.create({
  page: {
    padding: 30,
    backgroundColor: '#ffffff',
  },
  border: {
    border: '2pt solid #334155',
    margin: 10,
    padding: 20,
    height: '95%',
  },
  header: {
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
    paddingBottom: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e40af',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 10,
    color: '#64748b',
    marginBottom: 4,
  },
  section: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#334155',
    marginBottom: 6,
    backgroundColor: '#f1f5f9',
    padding: 6,
  },
  infoGrid: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  infoColumn: {
    width: '50%',
    paddingRight: 10,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 3,
    padding: 2,
  },
  label: {
    width: '40%',
    fontSize: 9,
    color: '#64748b',
  },
  value: {
    width: '60%',
    fontSize: 9,
    color: '#0f172a',
  },
  selectedOptions: {
    marginTop: 4,
    padding: 6,
    backgroundColor: '#f8fafc',
  },
  optionChip: {
    backgroundColor: '#e2e8f0',
    padding: '3 6',
    marginRight: 4,
    marginBottom: 4,
    borderRadius: 3,
    fontSize: 8,
    display: 'inline-block',
  },
  acknowledgment: {
    marginTop: 8,
    padding: 6,
    backgroundColor: '#f0fdf4',
    borderRadius: 4,
    flexDirection: 'row',
    alignItems: 'center',
  },
  rulesGrid: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  ruleContainer: {
    width: '48%',
    borderWidth: 0.5,
    borderColor: '#e2e8f0',
    marginBottom: 6,
  },
  ruleHeader: {
    backgroundColor: '#f8fafc',
    padding: 4,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  ruleContent: {
    padding: 4,
  },
  ruleNumber: {
    fontSize: 8,
    color: '#1e40af',
    fontWeight: 'bold',
  },
  ruleDoc: {
    fontSize: 8,
    color: '#64748b',
  },
  parameter: {
    fontSize: 8,
    color: '#0f172a',
    marginBottom: 4,
  },
  valuesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 3,
  },
  valueItem: {
    fontSize: 8,
    color: '#374151',
  },
  comments: {
    fontSize: 7,
    color: '#64748b',
    fontStyle: 'italic',
    backgroundColor: '#fefce8',
    padding: 3,
    marginTop: 2,
  },
  pageNumber: {
    position: 'absolute',
    bottom: 20,
    right: 30,
    fontSize: 8,
    color: '#94a3b8',
  },
});

const PDFDocument = ({ formData, specifications, rules,designOptions }) => {
  
  const selectedOptions = designOptions.filter((option, index) => 
    formData.designRules.selectedCheckboxes[option.design_option_id]
  );
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.border}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>PCB Design Specification Document</Text>
            <Text style={styles.subtitle}>Generated on {new Date().toLocaleDateString()}</Text>
          </View>

          {/* Basic Information */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Basic Information</Text>
            <View style={styles.infoGrid}>
              <View style={styles.infoColumn}>
                <View style={styles.row}>
                  <Text style={styles.label}>OPP Number:</Text>
                  <Text style={styles.value}>{formData.basicInfo.oppNumber}</Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.label}>OPU Number:</Text>
                  <Text style={styles.value}>{formData.basicInfo.opuNumber}</Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.label}>EDU Number:</Text>
                  <Text style={styles.value}>{formData.basicInfo.eduNumber}</Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.label}>Component:</Text>
                  <Text style={styles.value}>{formData.basicInfo.component}</Text>
                </View>
              </View>
              <View style={styles.infoColumn}>
                <View style={styles.row}>
                  <Text style={styles.label}>Model Name:</Text>
                  <Text style={styles.value}>{formData.basicInfo.modelName}</Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.label}>Part Number:</Text>
                  <Text style={styles.value}>{formData.basicInfo.partNumber}</Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.label}>Revision Number:</Text>
                  <Text style={styles.value}>{formData.basicInfo.revisionNumber}</Text>
                </View>
                
              </View>
            </View>
          </View>

          {/* PCB Specifications */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>PCB Specifications</Text>
            <View style={styles.infoGrid}>
              {specifications.map((spec) => (
                <View style={styles.infoColumn} key={spec.category_id}>
                  <View style={styles.row}>
                    <Text style={styles.label}>{spec.category_name}:</Text>
                    <Text style={styles.value}>
                      {formData.pcbSpecs.selectedSpecs[spec.category_id]}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </View>

          {/* Selected Design Options */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Selected Design Options</Text>
            <View style={styles.selectedOptions}>
              {selectedOptions.map((option) => (
                <View key={option.design_option_id} style={styles.optionChip}>
                  <Text style={{ fontSize: 8 }}>{option.desing_option_name}</Text>
                </View>
              ))}
            </View>
            
          </View>

          {/* Design Rules */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Design Rules</Text>
            <View style={styles.rulesGrid}>
              {rules.map((rule) => (
                <View style={styles.ruleContainer} key={rule.id}>
                  <View style={styles.ruleHeader}>
                    <Text style={styles.ruleDoc}>{rule.design_doc}</Text>
                    <Text style={styles.ruleNumber}>Rule {rule.rule_number}</Text>
                  </View>
                  <View style={styles.ruleContent}>
                    <Text style={styles.parameter}>{rule.parameter}</Text>
                    <View style={styles.valuesRow}>
                      {rule.min_value !== "N/A" && (
                        <Text style={styles.valueItem}>Min: {rule.min_value}</Text>
                      )}
                      {rule.nominal !== "N/A" && (
                        <Text style={styles.valueItem}>Nom: {rule.nominal}</Text>
                      )}
                      {rule.max_value !== "N/A" && (
                        <Text style={styles.valueItem}>Max: {rule.max_value}</Text>
                      )}
                    </View>
                    {rule.comments && rule.comments !== "N/A" && (
                      <Text style={styles.comments}>{rule.comments}</Text>
                    )}
                  </View>
                </View>
              ))}
            </View>
          </View>
          <View style={styles.acknowledgment}>
              <Text style={{ fontSize: 8, color: '#166534' }}>
                ✓ Design rules have been acknowledged
              </Text>
            </View>

          {/* Page Number */}
          <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => (
            `Page ${pageNumber} of ${totalPages}`
          )} />
        </View>
      </Page>
      
    </Document>
  );
};

// Export function
const generatePDF = async (formData, specifications, rules, designOptions) => {
  const blob = await pdf(
    <PDFDocument 
      formData={formData} 
      specifications={specifications} 
      rules={rules}
      designOptions={designOptions}
    />
  ).toBlob();
  saveAs(blob, `PCB_Specification_${formData.basicInfo.partNumber}_${formData.basicInfo.revisionNumber}.pdf`);
};

export default generatePDF;