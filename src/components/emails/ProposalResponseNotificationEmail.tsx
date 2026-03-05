import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";

interface ProposalResponseNotificationEmailProps {
  projectName: string;
  clientName: string;
  status: "accepted" | "changes_requested" | "rejected";
  total: string;
  comments?: string;
  proposalId: string;
  clientPhone?: string;
  respondedAt: string;
}

const baseUrl =
  process.env.NEXT_PUBLIC_BASE_URL || "https://proposals.noctra.studio";

export const ProposalResponseNotificationEmail = ({
  projectName,
  clientName,
  status,
  total,
  comments,
  proposalId,
  clientPhone,
  respondedAt,
}: ProposalResponseNotificationEmailProps) => {
  const statusConfig = {
    accepted: { label: "✅ ACEPTADA", color: "#22c55e" },
    changes_requested: { label: "📝 CAMBIOS SOLICITADOS", color: "#eab308" },
    rejected: { label: "❌ RECHAZADA", color: "#ef4444" },
  }[status];

  return (
    <Html>
      <Head />
      <Preview>
        {statusConfig.label} — {projectName}
      </Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={content}>
            <Heading style={{ ...h1, color: statusConfig.color }}>
              {statusConfig.label}
            </Heading>
            <Text style={text}>
              El cliente han respondido a la propuesta de{" "}
              <strong>{projectName}</strong>.
            </Text>

            <Section style={statsBox}>
              <Text style={statItem}>
                <strong>Cliente:</strong> {clientName}
              </Text>
              <Text style={statItem}>
                <strong>Proyecto:</strong> {projectName}
              </Text>
              <Text style={statItem}>
                <strong>Total:</strong> {total}
              </Text>
              <Text style={statItem}>
                <strong>Fecha:</strong> {respondedAt}
              </Text>
            </Section>

            {comments && (
              <Section style={commentBox}>
                <Text style={commentTitle}>Comentarios del cliente:</Text>
                <Text style={commentText}>"{comments}"</Text>
              </Section>
            )}

            <Hr style={hr} />

            <Link
              href={`${baseUrl}/proposals/${proposalId}`}
              style={dashboardLink}>
              Ver detalles en el Dashboard
            </Link>

            {status === "rejected" && clientPhone && (
              <Text style={warningNote}>
                ⚠️ Recuerda contactar al cliente vía WhatsApp: {clientPhone}
              </Text>
            )}
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default ProposalResponseNotificationEmail;

const main = {
  backgroundColor: "#f9f9f9",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
  margin: "0 auto",
  padding: "40px 0",
  width: "580px",
  maxWidth: "100%",
};

const content = {
  backgroundColor: "#ffffff",
  padding: "40px",
  borderRadius: "12px",
  border: "1px solid #eeeeee",
};

const h1 = {
  fontSize: "24px",
  fontWeight: "bold",
  margin: "0 0 20px",
  textAlign: "center" as const,
};

const text = {
  color: "#444444",
  fontSize: "16px",
  lineHeight: "24px",
  margin: "16px 0",
  textAlign: "center" as const,
};

const statsBox = {
  backgroundColor: "#f8fafc",
  padding: "24px",
  borderRadius: "8px",
  margin: "24px 0",
};

const statItem = {
  margin: "8px 0",
  fontSize: "14px",
  color: "#334155",
};

const commentBox = {
  borderLeft: "4px solid #e2e8f0",
  padding: "0 20px",
  margin: "24px 0",
};

const commentTitle = {
  fontSize: "12px",
  fontWeight: "bold",
  color: "#64748b",
  textTransform: "uppercase" as const,
  letterSpacing: "1px",
  margin: "0 0 8px",
};

const commentText = {
  fontSize: "15px",
  fontStyle: "italic",
  color: "#334155",
  margin: "0",
};

const hr = {
  borderColor: "#eeeeee",
  margin: "30px 0",
};

const dashboardLink = {
  display: "block",
  textAlign: "center" as const,
  color: "#0a0a0a",
  fontWeight: "bold",
  textDecoration: "underline",
  fontSize: "16px",
};

const warningNote = {
  marginTop: "32px",
  padding: "16px",
  backgroundColor: "#fff1f2",
  color: "#991b1b",
  borderRadius: "8px",
  fontSize: "14px",
  textAlign: "center" as const,
};
