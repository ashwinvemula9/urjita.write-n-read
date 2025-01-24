import React from 'react';
import { Page, Text, View, Document, StyleSheet, pdf } from '@react-pdf/renderer';
import { saveAs } from 'file-saver';

const styles = StyleSheet.create({
  page: {
    padding: 20,
    backgroundColor: '#ffffff',
  },
  header: {
    marginBottom: 15,
    borderBottom: '1pt solid #94a3b8',
    paddingBottom: 5,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1e40af',
  },
  subtitle: {
    fontSize: 8,
    color: '#64748b',
  },
  section: {
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    backgroundColor: '#f1f5f9',
    padding: 4,
    marginBottom: 5,
  },
  infoGrid: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  infoItem: {
    width: '50%',
    paddingRight: 10,
    marginBottom: 3,
  },
  infoRow: {
    flexDirection: 'row',
    fontSize: 8,
  },
  label: {
    width: '40%',
    color: '#64748b',
  },
  value: {
    width: '60%',
    color: '#0f172a',
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    padding: 4,
  },
  optionChip: {
    backgroundColor: '#f1f5f9',
    padding: '2 4',
    borderRadius: 2,
  },
  acknowledgment: {
    backgroundColor: '#f0fdf4',
    padding: 5,
    marginTop: 5,
    marginBottom: 10,
    borderRadius: 2,
  },
  rulesContainer: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  ruleBox: {
    width: '49%',
    border: '0.5pt solid #e2e8f0',
    marginBottom: 4,
    marginRight: '2%',
  },
  ruleBoxLast: {
    width: '49%',
    border: '0.5pt solid #e2e8f0',
    marginBottom: 4,
    marginRight: 0,
  },
  ruleHeader: {
    backgroundColor: '#f8fafc',
    padding: 4,
    borderBottom: '0.5pt solid #e2e8f0',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  ruleContent: {
    padding: 4,
  },
  ruleTitle: {
    fontSize: 8,
    color: '#1e40af',
    fontWeight: 'bold',
  },
  ruleDoc: {
    fontSize: 7,
    color: '#64748b',
  },
  parameter: {
    fontSize: 8,
    color: '#0f172a',
    marginBottom: 2,
  },
  values: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 2,
  },
  valueItem: {
    fontSize: 7,
    color: '#374151',
  },
  comments: {
    fontSize: 6,
    color: '#64748b',
    fontStyle: 'italic',
  },
  pageNumber: {
    position: 'absolute',
    bottom: 10,
    right: 20,
    fontSize: 8,
    color: '#94a3b8',
  },
  contentWrapper: {
    flex: 1,
  },
  rulesWrapper: {
    flex: 1,
  }
});

const RuleComponent = ({ rule, isLast }) => (
  <View style={isLast ? styles.ruleBoxLast : styles.ruleBox}>
    <View style={styles.ruleHeader}>
      <Text style={styles.ruleDoc}>{rule.design_doc}</Text>
      <Text style={styles.ruleTitle}>Rule {rule.rule_number}</Text>
    </View>
    <View style={styles.ruleContent}>
      <Text style={styles.parameter}>{rule.parameter}</Text>
      <View style={styles.values}>
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
);

const PDFDocumentDesignerInterface = ({ formData, specifications, rules, designOptions }) => {
  const selectedOptions = designOptions.filter(option => 
    formData.designRules.selectedCheckboxes[option.design_option_id]
  );

  // Helper function to find specification name by ID
  const findSpecificationName = (categoryId, specId) => {
    const category = specifications.find(spec => spec.category_id === parseInt(categoryId));
    if (!category) return 'N/A';
    
    const subcategory = category.subcategories.find(sub => sub.id === parseInt(specId));
    return subcategory ? subcategory.name : 'N/A';
  };

  return (
    <Document>
      <Page size="A4" style={styles.page} wrap>
        <View style={styles.contentWrapper}>
          <View style={styles.header}>
            <Text style={styles.title}>PCB Design Specification Document</Text>
            <Text style={styles.subtitle}>Generated on {new Date().toLocaleDateString()}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Basic Information</Text>
            <View style={styles.infoGrid}>
              {Object.entries(formData.basicInfo).map(([key, value]) => (
                <View key={key} style={styles.infoItem}>
                  <View style={styles.infoRow}>
                    <Text style={styles.label}>{key}:</Text>
                    <Text style={styles.value}>
                      {key.toLowerCase() === "component" ? "B14(PCB)" : value}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>PCB Specifications</Text>
            <View style={styles.infoGrid}>
              {specifications.map(spec => (
                <View key={spec.category_id} style={styles.infoItem}>
                  <View style={styles.infoRow}>
                    <Text style={styles.label}>{spec.category_name}:</Text>
                    <Text style={styles.value}>
                      {findSpecificationName(
                        spec.category_id,
                        formData.pcbSpecs.selectedSpecs[spec.category_id]
                      )}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Selected Design Options</Text>
            <View style={styles.optionsContainer}>
              {selectedOptions.map(option => (
                <View key={option.design_option_id} style={styles.optionChip}>
                  <Text style={{ fontSize: 7 }}>{option.desing_option_name}</Text>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.acknowledgment}>
            <Text style={{ fontSize: 8, color: '#166534' }}>
              ✓ All design rules have been reviewed and acknowledged
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Design Rules</Text>
            <View style={styles.rulesContainer}>
              {rules.map((rule, index) => (
                <RuleComponent 
                  key={rule.id} 
                  rule={rule} 
                  isLast={(index + 1) % 2 === 0}
                />
              ))}
            </View>
          </View>
        </View>
        
        <Text 
          style={styles.pageNumber} 
          render={({ pageNumber, totalPages }) => (
            `Page ${pageNumber} of ${totalPages}`
          )} 
        />
      </Page>
    </Document>
  );
};

const generatePDF = async (formData, specifications, rules, designOptions) => {
  const blob = await pdf(
    <PDFDocumentDesignerInterface 
      formData={formData} 
      specifications={specifications} 
      rules={rules}
      designOptions={designOptions}
    />
  ).toBlob();
  saveAs(blob, `PCB_Specification_${formData.basicInfo.partNumber}_${formData.basicInfo.revisionNumber}.pdf`);
};

export default generatePDF;