import React from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  pdf,
} from "@react-pdf/renderer";
import { saveAs } from "file-saver";
import { BASIC_KEY_LABEL } from "../../constants";

// Add STEPS constant at the top
const STEPS = {
  BASIC_INFO: "basicInfo",
  PCB_SPECS: "pcbSpecs",
  VERIFIER_FIELDS: "verifierFields",
  VERIFY_RESULTS: "verifyResults",
};

const styles = StyleSheet.create({
  page: {
    padding: 20,
    backgroundColor: "#ffffff",
  },
  metadata: {
    fontSize: 8,
    color: "#64748b",
    marginTop: 3,
    marginBottom: 3,
  },
  header: {
    marginBottom: 15,
    borderBottom: "1pt solid #94a3b8",
    paddingBottom: 5,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1e40af",
  },
  subtitle: {
    fontSize: 8,
    color: "#64748b",
    marginTop: 3,
    marginBottom: 3,
  },
  section: {
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "bold",
    backgroundColor: "#f1f5f9",
    padding: 4,
    marginBottom: 5,
  },
  infoGrid: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
  },
  infoItem: {
    width: "50%",
    paddingRight: 10,
    marginBottom: 3,
  },
  infoRow: {
    flexDirection: "row",
    fontSize: 8,
  },
  resultItem: {
    marginBottom: 5,
    padding: 4,
    borderRadius: 2,
  },
  compliantItem: {
    backgroundColor: "#f0fdf4",
  },
  deviatedItem: {
    backgroundColor: "#fef2f2",
  },
  itemName: {
    fontSize: 10,
    fontWeight: "bold",
  },
  itemValue: {
    fontSize: 8,
    color: "#374151",
  },
  pageNumber: {
    position: "absolute",
    bottom: 10,
    right: 20,
    fontSize: 8,
    color: "#94a3b8",
  },
});

const PDFDocumentVerifierInterface = ({
  formData,
  verifyResults,
  specifications,
}) => {
  // Helper function to find specification name and value
  const getSpecificationDetails = (categoryId, value) => {
    const spec = specifications.find(
      (s) => s.category_id.toString() === categoryId.toString()
    );
    if (!spec) return { name: `Specification ${categoryId}`, value: value };

    // If it's a numerical input field
    const isInputField = ["Dielectric Thickness", "B14 Size"].includes(
      spec.category_name
    );

    if (isInputField) {
      return {
        name: spec.category_name,
        value: value.toString(),
      };
    }
    const timestamp = new Date().toLocaleString();

    const user = JSON.parse(localStorage.getItem("user"));

    // If it's a dropdown, find the subcategory name
    const subcategory = spec.subcategories.find(
      (sub) => sub.id.toString() === value.toString()
    );
    return {
      name: spec.category_name,
      value: subcategory ? subcategory.name : value,
    };
  };

  const deviatedResults =
    verifyResults?.verified_query_data.filter((item) => item.is_deviated) || [];
  const compliantResults =
    verifyResults?.verified_query_data.filter((item) => !item.is_deviated) ||
    [];

  const deviatedDesignFields =
    verifyResults?.verify_design_fields_data.filter(
      (item) => item.is_deviated
    ) || [];
  const compliantDesignFields =
    verifyResults?.verify_design_fields_data.filter(
      (item) => !item.is_deviated
    ) || [];
  const timestamp = new Date().toLocaleString();
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>PCB Verification Document</Text>
          <Text style={styles.subtitle}>Generated on {timestamp}</Text>
          <Text style={styles.metadata}>Created by: {user?.full_name}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Basic Information</Text>
          <View style={styles.infoGrid}>
            {Object.entries(formData[STEPS.BASIC_INFO]).map(([key, value]) => (
              <View style={styles.infoRow}>
                <View key={key} style={styles.infoItem}>
                  <Text style={styles.itemName}>
                    {BASIC_KEY_LABEL?.[key]}:{" "}
                  </Text>
                  <Text style={styles.itemValue}>
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
            {Object.entries(formData[STEPS.PCB_SPECS].selectedSpecs).map(
              ([key, value]) => {
                const { name, value: displayValue } = getSpecificationDetails(
                  key,
                  value
                );
                return (
                  <View key={key} style={styles.infoItem}>
                    <Text style={styles.itemName}>{name}: </Text>
                    <Text style={styles.itemValue}>{displayValue}</Text>
                  </View>
                );
              }
            )}
          </View>
        </View>

        {deviatedResults.length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: "#dc2626" }]}>
              Deviated Values
            </Text>
            {deviatedResults.map((item, index) => (
              <View
                key={index}
                style={[styles.resultItem, styles.deviatedItem]}
              >
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemValue}>Value: {item.value}</Text>
              </View>
            ))}
            {deviatedDesignFields.map((item, index) => (
              <View
                key={index}
                style={[styles.resultItem, styles.deviatedItem]}
              >
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemValue}>
                  Selected: {item.selected_deviation_name}
                </Text>
              </View>
            ))}
          </View>
        )}

        {compliantResults.length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: "#16a34a" }]}>
              Compliant Values
            </Text>
            {compliantResults.map((item, index) => (
              <View
                key={index}
                style={[styles.resultItem, styles.compliantItem]}
              >
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemValue}>Value: {item.value}</Text>
              </View>
            ))}
            {compliantDesignFields.map((item, index) => (
              <View
                key={index}
                style={[styles.resultItem, styles.compliantItem]}
              >
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemValue}>
                  Selected: {item.selected_deviation_name}
                </Text>
              </View>
            ))}
          </View>
        )}

        <Text
          style={styles.pageNumber}
          render={({ pageNumber, totalPages }) =>
            `Page ${pageNumber} of ${totalPages}`
          }
          fixed
        />
      </Page>
    </Document>
  );
};

const generatePDF = async (formData, verifyResults, specifications) => {
  console.log("In PDF Document Verifier Interface");
  const blob = await pdf(
    <PDFDocumentVerifierInterface
      formData={formData}
      verifyResults={verifyResults}
      specifications={specifications}
    />
  ).toBlob();
  saveAs(
    blob,
    `PCB_Verification_${formData[STEPS.BASIC_INFO].partNumber}_${
      formData[STEPS.BASIC_INFO].revisionNumber
    }.pdf`
  );
};

export default generatePDF;
