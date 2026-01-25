import { Breadcrumbs } from "@/components/Breadcrumbs";

const TermsOfServicePage = () => {
  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Terms of Service" },
  ];

  return (
    <div className="container py-8 max-w-4xl">
      <Breadcrumbs items={breadcrumbItems} />
      
      <div className="prose prose-gray dark:prose-invert max-w-none">
        <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
        <p className="text-muted-foreground mb-8">Last updated: January 25, 2026</p>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">1. Acceptance of Terms</h2>
          <p className="text-muted-foreground mb-4">
            By accessing and using BankCompare BD ("the Service"), you agree to be bound by these Terms of Service. 
            If you do not agree to these terms, please do not use our Service. These terms apply to all visitors, 
            users, and others who access the Service.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">2. Description of Service</h2>
          <p className="text-muted-foreground mb-4">
            BankCompare BD is a financial product comparison platform that allows users to compare savings accounts, 
            loans, and other banking products available in Bangladesh. Our Service includes:
          </p>
          <ul className="list-disc pl-6 text-muted-foreground mb-4 space-y-2">
            <li>Comparison of banking products from various financial institutions</li>
            <li>Rate alerts and notifications</li>
            <li>Financial calculators and tools</li>
            <li>User reviews and ratings</li>
            <li>Educational content about banking products</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">3. User Accounts</h2>
          <p className="text-muted-foreground mb-4">
            To access certain features of our Service, you may be required to create an account. You agree to:
          </p>
          <ul className="list-disc pl-6 text-muted-foreground mb-4 space-y-2">
            <li>Provide accurate, current, and complete information during registration</li>
            <li>Maintain and promptly update your account information</li>
            <li>Maintain the security of your password and account</li>
            <li>Accept responsibility for all activities that occur under your account</li>
            <li>Notify us immediately of any unauthorized use of your account</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">4. Disclaimer of Financial Advice</h2>
          <p className="text-muted-foreground mb-4 font-medium">
            IMPORTANT: The information provided on BankCompare BD is for general informational purposes only and should 
            not be construed as professional financial advice.
          </p>
          <ul className="list-disc pl-6 text-muted-foreground mb-4 space-y-2">
            <li>We do not provide personalized financial, investment, or legal advice</li>
            <li>Product information is sourced from financial institutions and may change without notice</li>
            <li>You should verify all information directly with the respective financial institution before making decisions</li>
            <li>We recommend consulting with qualified financial professionals for specific advice</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">5. Accuracy of Information</h2>
          <p className="text-muted-foreground mb-4">
            While we strive to provide accurate and up-to-date information, we make no representations or warranties 
            about the accuracy, reliability, completeness, or timeliness of any information on our Service. Product rates, 
            terms, and conditions are subject to change by financial institutions at any time.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">6. User Conduct</h2>
          <p className="text-muted-foreground mb-4">When using our Service, you agree not to:</p>
          <ul className="list-disc pl-6 text-muted-foreground mb-4 space-y-2">
            <li>Violate any applicable laws or regulations of Bangladesh</li>
            <li>Submit false, misleading, or fraudulent reviews or information</li>
            <li>Impersonate any person or entity</li>
            <li>Interfere with or disrupt the Service or servers</li>
            <li>Attempt to gain unauthorized access to any part of the Service</li>
            <li>Use the Service for any unlawful or unauthorized purpose</li>
            <li>Harass, abuse, or harm other users</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">7. User Reviews and Content</h2>
          <p className="text-muted-foreground mb-4">
            By submitting reviews, comments, or other content to our Service, you:
          </p>
          <ul className="list-disc pl-6 text-muted-foreground mb-4 space-y-2">
            <li>Grant us a non-exclusive, royalty-free license to use, modify, and display your content</li>
            <li>Represent that your content is accurate and based on genuine experience</li>
            <li>Agree that we may remove content that violates these terms or is otherwise objectionable</li>
            <li>Acknowledge that reviews reflect individual opinions and not our views</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">8. Intellectual Property</h2>
          <p className="text-muted-foreground mb-4">
            The Service and its original content, features, and functionality are owned by BankCompare BD and are protected 
            by international copyright, trademark, and other intellectual property laws. You may not copy, modify, distribute, 
            or create derivative works without our prior written consent.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">9. Third-Party Links</h2>
          <p className="text-muted-foreground mb-4">
            Our Service may contain links to third-party websites or services, including those of financial institutions. 
            We are not responsible for the content, privacy policies, or practices of any third-party sites. 
            Your interactions with third parties are solely between you and them.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">10. Limitation of Liability</h2>
          <p className="text-muted-foreground mb-4">
            To the maximum extent permitted by law, BankCompare BD shall not be liable for any indirect, incidental, 
            special, consequential, or punitive damages, including but not limited to loss of profits, data, or other 
            intangible losses, resulting from your use of the Service or any decisions made based on information 
            provided through the Service.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">11. Indemnification</h2>
          <p className="text-muted-foreground mb-4">
            You agree to indemnify and hold harmless BankCompare BD and its officers, directors, employees, and agents 
            from any claims, damages, losses, liabilities, and expenses arising out of your use of the Service or 
            violation of these Terms.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">12. Modifications to Terms</h2>
          <p className="text-muted-foreground mb-4">
            We reserve the right to modify these Terms at any time. We will provide notice of significant changes by 
            posting the updated Terms on this page with a new "Last updated" date. Your continued use of the Service 
            after changes constitutes acceptance of the modified Terms.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">13. Governing Law</h2>
          <p className="text-muted-foreground mb-4">
            These Terms shall be governed by and construed in accordance with the laws of the People's Republic of Bangladesh, 
            without regard to its conflict of law provisions. Any disputes arising from these Terms shall be resolved 
            in the courts of Bangladesh.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">14. Contact Information</h2>
          <p className="text-muted-foreground mb-4">
            For questions about these Terms of Service, please contact us at:
          </p>
          <div className="bg-muted p-4 rounded-lg">
            <p className="text-foreground font-medium">BankCompare BD</p>
            <p className="text-muted-foreground">Email: legal@bankcomparebd.com</p>
            <p className="text-muted-foreground">Address: Dhaka, Bangladesh</p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default TermsOfServicePage;
