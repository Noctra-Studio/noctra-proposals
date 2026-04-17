import {
  Body,
  Button,
  Container,
  Font,
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

interface ContractSentEmailProps {
  clientName: string;
  projectName: string;
  slug: string;
}

const baseUrl =
  process.env.NEXT_PUBLIC_BASE_URL || "https://proposals.noctra.studio";

export const ContractSentEmail = ({
  clientName,
  projectName,
  slug,
}: ContractSentEmailProps) => (
  <Html lang="es">
    <Head>
      <Font
        fontFamily="Satoshi"
        fallbackFontFamily="Helvetica"
        webFont={{
          url: "https://api.fontshare.com/v2/css?f[]=satoshi@700,500,400&display=swap",
          format: "woff2",
        }}
        fontWeight={400}
        fontStyle="normal"
      />
    </Head>
    <Preview>Tu contrato para {projectName} está listo para firmar — Noctra Studio</Preview>
    <Body style={main}>
      <Container style={container}>
        {/* Header */}
        <Section style={header}>
          <Text style={logo}>NOCTRA</Text>
        </Section>

        {/* Content */}
        <Section style={content}>
          <Heading style={h1}>Contrato listo, {clientName}.</Heading>
          <Text style={text}>
            Has aceptado la propuesta para{" "}
            <span style={highlight}>{projectName}</span>. El siguiente paso es
            revisar y firmar el contrato de servicios.
          </Text>
          <Text style={text}>
            El contrato incluye todos los alcances, tiempos, condiciones de pago
            y términos legales acordados.
          </Text>

          <Section style={buttonWrapper}>
            <Button style={button} href={`${baseUrl}/c/${slug}`}>
              Revisar y firmar contrato →
            </Button>
          </Section>

          <Hr style={hr} />

          <Text style={note}>
            Una vez firmado digitalmente, iniciaremos el proyecto en las fechas
            establecidas. Si tienes alguna pregunta sobre el contrato, responde
            a este correo.
          </Text>
        </Section>

        {/* Footer */}
        <Section style={footer}>
          <Hr style={footerHr} />
          <Text style={footerText}>
            Manu · Noctra Studio ·{" "}
            <Link href="mailto:hello@noctra.studio" style={footerLink}>
              hello@noctra.studio
            </Link>{" "}
            ·{" "}
            <Link href="https://noctra.studio" style={footerLink}>
              noctra.studio
            </Link>
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
);

export default ContractSentEmail;

const main = {
  backgroundColor: "#0a0a0a",
  fontFamily: "'Satoshi', Helvetica, Arial, sans-serif",
};

const container = {
  margin: "0 auto",
  maxWidth: "560px",
  padding: "48px 24px",
};

const header = {
  marginBottom: "48px",
};

const logo = {
  color: "#ffffff",
  fontSize: "13px",
  fontWeight: "700",
  letterSpacing: "6px",
  margin: "0",
  textTransform: "uppercase" as const,
};

const content = {
  backgroundColor: "#141414",
  borderRadius: "16px",
  border: "1px solid #222222",
  padding: "48px 40px",
};

const h1 = {
  color: "#ffffff",
  fontSize: "22px",
  fontWeight: "600",
  margin: "0 0 24px 0",
  lineHeight: "1.3",
};

const text = {
  color: "#a0a0a0",
  fontSize: "15px",
  lineHeight: "26px",
  margin: "0 0 16px 0",
};

const highlight = {
  color: "#ffffff",
  fontWeight: "600",
};

const buttonWrapper = {
  margin: "32px 0",
};

const button = {
  backgroundColor: "#ffffff",
  borderRadius: "10px",
  color: "#0a0a0a",
  fontSize: "14px",
  fontWeight: "700",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "block",
  padding: "16px 24px",
  letterSpacing: "0.3px",
};

const hr = {
  borderColor: "#222222",
  margin: "32px 0 24px",
};

const note = {
  color: "#666666",
  fontSize: "13px",
  lineHeight: "22px",
  margin: "0",
};

const footer = {
  marginTop: "32px",
};

const footerHr = {
  borderColor: "#1a1a1a",
  margin: "0 0 20px",
};

const footerText = {
  color: "#444444",
  fontSize: "12px",
  lineHeight: "20px",
  textAlign: "center" as const,
  margin: "0",
};

const footerLink = {
  color: "#666666",
  textDecoration: "none",
};
