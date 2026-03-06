import {
  Body,
  Button,
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
  <Html>
    <Head />
    <Preview>Contrato de servicios: {projectName} | Noctra Studio</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={header}>
          <Text style={logo}>NOCTRA STUDIO</Text>
        </Section>
        <Section style={content}>
          <Heading style={h1}>Hola {clientName},</Heading>
          <Text style={text}>
            La propuesta para <strong>{projectName}</strong> ha sido aceptada y
            hemos preparado el contrato de servicios.
          </Text>
          <Text style={text}>
            Por favor revisa los términos detallados y firma el contrato en el
            siguiente enlace:
          </Text>
          <Button style={button} href={`${baseUrl}/c/${slug}`}>
            Revisar y firmar contrato
          </Button>
          <Hr style={hr} />
          <Text style={note}>
            Una vez firmado, iniciaremos el proyecto según las fechas acordadas.
          </Text>
        </Section>
        <Section style={footer}>
          <Text style={footerText}>
            Manu · Noctra Studio ·{" "}
            <Link href="mailto:hello@noctra.studio" style={link}>
              hello@noctra.studio
            </Link>{" "}
            ·{" "}
            <Link href="https://noctra.studio" style={link}>
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
  backgroundColor: "#ffffff",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
  margin: "0 auto",
  padding: "20px 0 48px",
  width: "580px",
  maxWidth: "100%",
};

const header = {
  backgroundColor: "#0a0a0a",
  padding: "40px",
  textAlign: "center" as const,
};

const logo = {
  color: "#ffffff",
  fontSize: "24px",
  fontWeight: "bold",
  letterSpacing: "4px",
  margin: "0",
};

const content = {
  padding: "40px",
};

const h1 = {
  color: "#0a0a0a",
  fontSize: "24px",
  fontWeight: "bold",
  margin: "30px 0",
};

const text = {
  color: "#444444",
  fontSize: "16px",
  lineHeight: "26px",
  margin: "16px 0",
};

const button = {
  backgroundColor: "#ffffff",
  borderRadius: "8px",
  color: "#0a0a0a",
  fontSize: "16px",
  fontWeight: "bold",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "block",
  width: "100%",
  padding: "20px 0",
  marginTop: "20px",
};

const hr = {
  borderColor: "#eeeeee",
  margin: "30px 0",
};

const note = {
  color: "#888888",
  fontSize: "14px",
  lineHeight: "24px",
};

const footer = {
  padding: "0 40px",
};

const footerText = {
  color: "#888888",
  fontSize: "12px",
  lineHeight: "22px",
  textAlign: "center" as const,
};

const link = {
  color: "#0a0a0a",
  textDecoration: "underline",
};
