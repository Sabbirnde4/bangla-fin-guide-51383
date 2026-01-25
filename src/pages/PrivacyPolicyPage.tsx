import { Breadcrumbs } from "@/components/Breadcrumbs";

const PrivacyPolicyPage = () => {
  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Privacy Policy" },
  ];

  return (
    <div className="container py-8 max-w-4xl">
      <Breadcrumbs items={breadcrumbItems} />
      
      <div className="prose prose-gray dark:prose-invert max-w-none">
        <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
        <p className="text-muted-foreground mb-8">Last updated: January 25, 2026</p>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">1. Introduction</h2>
          <p className="text-muted-foreground mb-4">
            Welcome to BankCompare BD. We are committed to protecting your personal information and your right to privacy. 
            This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website 
            and use our services to compare banking products in Bangladesh.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">2. Information We Collect</h2>
          <h3 className="text-lg font-medium mb-3">2.1 Personal Information</h3>
          <p className="text-muted-foreground mb-4">
            We may collect personal information that you voluntarily provide when you:
          </p>
          <ul className="list-disc pl-6 text-muted-foreground mb-4 space-y-2">
            <li>Register for an account</li>
            <li>Subscribe to alerts or newsletters</li>
            <li>Submit reviews or feedback</li>
            <li>Contact us for support</li>
          </ul>
          <p className="text-muted-foreground mb-4">
            This information may include your name, email address, phone number, and financial preferences.
          </p>

          <h3 className="text-lg font-medium mb-3">2.2 Automatically Collected Information</h3>
          <p className="text-muted-foreground mb-4">
            When you access our website, we automatically collect certain information including:
          </p>
          <ul className="list-disc pl-6 text-muted-foreground mb-4 space-y-2">
            <li>Device and browser information</li>
            <li>IP address and location data</li>
            <li>Pages visited and time spent on our site</li>
            <li>Referring website addresses</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">3. How We Use Your Information</h2>
          <p className="text-muted-foreground mb-4">We use the information we collect to:</p>
          <ul className="list-disc pl-6 text-muted-foreground mb-4 space-y-2">
            <li>Provide and maintain our comparison services</li>
            <li>Send you rate alerts and notifications you've subscribed to</li>
            <li>Improve our website and user experience</li>
            <li>Respond to your inquiries and provide customer support</li>
            <li>Analyze usage patterns to enhance our services</li>
            <li>Comply with legal obligations under Bangladesh law</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">4. Information Sharing</h2>
          <p className="text-muted-foreground mb-4">
            We do not sell, trade, or rent your personal information to third parties. We may share your information only in the following circumstances:
          </p>
          <ul className="list-disc pl-6 text-muted-foreground mb-4 space-y-2">
            <li>With your explicit consent</li>
            <li>To comply with legal requirements or respond to lawful requests</li>
            <li>To protect our rights, privacy, safety, or property</li>
            <li>With service providers who assist in our operations (subject to confidentiality agreements)</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">5. Data Security</h2>
          <p className="text-muted-foreground mb-4">
            We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, 
            alteration, disclosure, or destruction. However, no method of transmission over the Internet is 100% secure, and we cannot 
            guarantee absolute security.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">6. Your Rights</h2>
          <p className="text-muted-foreground mb-4">Under applicable laws in Bangladesh, you have the right to:</p>
          <ul className="list-disc pl-6 text-muted-foreground mb-4 space-y-2">
            <li>Access the personal information we hold about you</li>
            <li>Request correction of inaccurate information</li>
            <li>Request deletion of your personal information</li>
            <li>Withdraw consent for data processing</li>
            <li>Object to processing of your personal information</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">7. Cookies</h2>
          <p className="text-muted-foreground mb-4">
            We use cookies and similar tracking technologies to enhance your browsing experience. You can control cookies through your 
            browser settings. Disabling cookies may affect certain features of our website.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">8. Children's Privacy</h2>
          <p className="text-muted-foreground mb-4">
            Our services are not directed to individuals under 18 years of age. We do not knowingly collect personal information from children. 
            If you believe we have collected information from a minor, please contact us immediately.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">9. Changes to This Policy</h2>
          <p className="text-muted-foreground mb-4">
            We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page 
            and updating the "Last updated" date. We encourage you to review this policy periodically.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">10. Contact Us</h2>
          <p className="text-muted-foreground mb-4">
            If you have questions about this Privacy Policy or our data practices, please contact us at:
          </p>
          <div className="bg-muted p-4 rounded-lg">
            <p className="text-foreground font-medium">BankCompare BD</p>
            <p className="text-muted-foreground">Email: privacy@bankcomparebd.com</p>
            <p className="text-muted-foreground">Address: Dhaka, Bangladesh</p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;
