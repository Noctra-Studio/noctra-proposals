import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";
import { Proposal } from "@/types";
import { format } from "date-fns";
import { es } from "date-fns/locale";

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: "Helvetica",
    fontSize: 10,
    color: "#0A0A0A",
    backgroundColor: "#FFFFFF",
  },
  // Header / Portada
  header: {
    backgroundColor: "#0A0A0A",
    margin: -40,
    marginBottom: 40,
    padding: 60,
    paddingBottom: 40,
  },
  headerLabel: {
    color: "#E8FF47",
    fontSize: 9,
    fontWeight: "bold",
    letterSpacing: 2,
    marginBottom: 10,
  },
  headerTitle: {
    color: "#FFFFFF",
    fontSize: 28,
    fontWeight: "bold",
    letterSpacing: 4,
  },
  // Content
  section: {
    marginBottom: 20,
  },
  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 30,
  },
  metaBlock: {
    width: "45%",
  },
  label: {
    fontSize: 8,
    color: "#888888",
    textTransform: "uppercase",
    marginBottom: 4,
    fontWeight: "bold",
  },
  value: {
    fontSize: 11,
    color: "#0A0A0A",
  },
  projectName: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 40,
    marginTop: 20,
  },
  // Table
  tableHeader: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#E8FF47",
    paddingBottom: 8,
    marginBottom: 12,
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F5F5F5",
  },
  colName: { width: "70%" },
  colPrice: { width: "30%", textAlign: "right" },
  serviceTitle: { fontSize: 11, fontWeight: "bold", marginBottom: 4 },
  serviceDesc: { color: "#666666", lineHeight: 1.4 },
  // Summary
  summary: {
    marginTop: 40,
    alignItems: "flex-end",
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginBottom: 6,
    width: "200pt",
  },
  summaryLabel: { width: "120pt", textAlign: "right", color: "#888888" },
  summaryValue: { width: "80pt", textAlign: "right", fontWeight: "bold" },
  totalRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 2,
    borderTopColor: "#0A0A0A",
    width: "200pt",
  },
  // Footer
  footer: {
    position: "absolute",
    bottom: 30,
    left: 40,
    right: 40,
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: "#EEEEEE",
    paddingTop: 10,
    fontSize: 8,
    color: "#888888",
  },
  text: {
    fontSize: 10,
    lineHeight: 1.6,
    color: "#444444",
  },
});

const formatter = new Intl.NumberFormat("es-MX", {
  style: "currency",
  currency: "MXN",
});

export const ProposalPDF = ({ proposal }: { proposal: Proposal }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Portada */}
      <View style={styles.header}>
        <Text style={styles.headerLabel}>NOCTRA STUDIO</Text>
        <Text style={styles.headerTitle}>PROPUESTA</Text>
        <Text style={styles.headerTitle}>COMERCIAL</Text>
      </View>

      <View style={styles.metaRow}>
        <View style={styles.metaBlock}>
          <Text style={styles.label}>Nº Propuesta</Text>
          <Text style={styles.value}>{proposal.slug}</Text>
        </View>
        <View style={styles.metaBlock}>
          <Text style={styles.label}>Fecha</Text>
          <Text style={styles.value}>
            {proposal.created_at
              ? format(new Date(proposal.created_at), "dd/MM/yyyy")
              : "-"}
          </Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Preparada para:</Text>
        <Text style={{ ...styles.value, fontSize: 14, fontWeight: "bold" }}>
          {proposal.client_name}
        </Text>
        {proposal.client_company && (
          <Text style={styles.value}>{proposal.client_company}</Text>
        )}
      </View>

      <Text style={styles.projectName}>{proposal.project_name}</Text>

      <View style={styles.section}>
        <Text style={styles.label}>Válida hasta:</Text>
        <Text style={styles.value}>
          {proposal.valid_until
            ? format(new Date(proposal.valid_until), "dd 'de' MMMM, yyyy", {
                locale: es,
              })
            : "-"}
        </Text>
      </View>

      <View style={styles.footer}>
        <Text>hello@noctra.studio | noctra.studio</Text>
        <Text
          render={({ pageNumber, totalPages }) =>
            `${pageNumber} / ${totalPages}`
          }
        />
      </View>
    </Page>

    {/* Detalle de Servicios */}
    <Page size="A4" style={styles.page}>
      <Text style={{ ...styles.label, marginBottom: 20 }}>
        Detalle de Servicios
      </Text>

      <View style={styles.tableHeader}>
        <Text style={styles.colName}>Servicio</Text>
        <Text style={styles.colPrice}>Inversión</Text>
      </View>

      {proposal.services.map((service, i) => (
        <View key={i} style={styles.tableRow} wrap={false}>
          <View style={styles.colName}>
            <Text style={styles.serviceTitle}>{service.name}</Text>
            <Text style={styles.serviceDesc}>{service.description}</Text>
          </View>
          <View style={styles.colPrice}>
            <Text style={{ fontWeight: "bold" }}>
              {formatter.format(service.total)}
            </Text>
          </View>
        </View>
      ))}

      {/* Resumen Financiero */}
      <View style={styles.summary} wrap={false}>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Subtotal</Text>
          <Text style={styles.summaryValue}>
            {formatter.format(proposal.subtotal)}
          </Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>
            IVA ({proposal.iva_percentage}%)
          </Text>
          <Text style={styles.summaryValue}>
            {formatter.format(proposal.iva_amount)}
          </Text>
        </View>
        <View style={styles.totalRow}>
          <Text
            style={{
              ...styles.summaryLabel,
              color: "#0A0A0A",
              fontWeight: "bold",
            }}>
            TOTAL
          </Text>
          <Text style={{ ...styles.summaryValue, fontSize: 14 }}>
            {formatter.format(proposal.total)}
          </Text>
        </View>
      </View>

      <View style={{ ...styles.section, marginTop: 40 }}>
        <Text style={styles.label}>Condiciones de pago</Text>
        <Text style={styles.value}>
          {proposal.payment_terms || "50% anticipo, 50% fin de proyecto."}
        </Text>
      </View>

      <View style={styles.footer}>
        <Text>hello@noctra.studio | noctra.studio</Text>
        <Text
          render={({ pageNumber, totalPages }) =>
            `${pageNumber} / ${totalPages}`
          }
        />
      </View>
    </Page>
  </Document>
);

export const ContractPDF = ({ proposal }: { proposal: Proposal }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.headerLabel}>NOCTRA STUDIO</Text>
        <Text style={styles.headerTitle}>CONTRATO DE</Text>
        <Text style={styles.headerTitle}>SERVICIOS</Text>
      </View>
      <Text style={styles.projectName}>Contrato: {proposal.project_name}</Text>
      <Text style={styles.text}>
        [Template de contrato en desarrollo para Prompt 8]
      </Text>
      <View style={styles.footer}>
        <Text>hello@noctra.studio | noctra.studio</Text>
        <Text
          render={({ pageNumber, totalPages }) =>
            `${pageNumber} / ${totalPages}`
          }
        />
      </View>
    </Page>
  </Document>
);
