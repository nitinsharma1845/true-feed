import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
  Hr,
} from "@react-email/components";

interface VerificationEmailProps {
  username: string;
  otp: string;
}

export const VerificationEmail = ({
  username,
  otp,
}: VerificationEmailProps) => (
  <Html>
    <Head />
    <Preview>
      Verify your identity to start receiving anonymous messages.
    </Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>Verify your account</Heading>
        <Text style={text}>Hi {username},</Text>
        <Text style={text}>
          Welcome to our anonymous messaging platform! To ensure your privacy
          and secure your inbox, please use the following verification code:
        </Text>
        <Section style={codeContainer}>
          <Text style={code}>{otp}</Text>
        </Section>
        <Text style={text}>
          This code will expire in 10 minutes. If you didn&apos;t request this,
          you can safely ignore this email.
        </Text>
        <Hr style={hr} />
        <Text style={footer}>
          Our app allows users to receive honest feedback and messages
          completely anonymously. Your identity is always protected.
        </Text>
      </Container>
    </Body>
  </Html>
);

export default VerificationEmail;

// --- Styles ---

const main = {
  backgroundColor: "#ffffff",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
  margin: "0 auto",
  padding: "20px 0 48px",
  width: "580px",
};

const h1 = {
  color: "#333",
  fontSize: "24px",
  fontWeight: "bold",
  paddingTop: "30px",
  textAlign: "center" as const,
};

const text = {
  color: "#333",
  fontSize: "16px",
  lineHeight: "26px",
};

const codeContainer = {
  background: "rgba(0,0,0,.05)",
  borderRadius: "4px",
  margin: "16px auto 14px",
  verticalAlign: "middle",
  width: "280px",
};

const code = {
  color: "#000",
  display: "inline-block",
  fontFamily: "monospace",
  fontSize: "32px",
  fontWeight: "700",
  letterSpacing: "6px",
  lineHeight: "40px",
  paddingBottom: "8px",
  paddingTop: "8px",
  margin: "0 auto",
  width: "100%",
  textAlign: "center" as const,
};

const hr = {
  borderColor: "#cccccc",
  margin: "20px 0",
};

const footer = {
  color: "#8898aa",
  fontSize: "12px",
  lineHeight: "16px",
};
