import { Breadcrumbs } from "@/components/Breadcrumbs";

const DisclaimerPage = () => {
  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Disclaimer" },
  ];

  return (
    <div className="container py-8 max-w-4xl">
      <Breadcrumbs items={breadcrumbItems} />
      
      <div className="prose prose-gray dark:prose-invert max-w-none">
        <h1 className="text-3xl font-bold mb-6">Disclaimer</h1>
        <p className="text-muted-foreground mb-8">Last updated: January 25, 2026</p>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">1. General Information</h2>
          <p className="text-muted-foreground mb-4">
            The information provided on BankCompare BD ("the Website") is for general informational purposes only. 
            While we strive to provide accurate and up-to-date information, we make no representations or warranties 
            of any kind, express or implied, about the completeness, accuracy, reliability, suitability, or availability 
            of the information, products, services, or related graphics contained on the Website.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">2. Not Financial Advice</h2>
          <p className="text-muted-foreground mb-4 font-medium">
            IMPORTANT: The content on this Website does not constitute financial, investment, legal, or professional advice.
          </p>
          <ul className="list-disc pl-6 text-muted-foreground mb-4 space-y-2">
            <li>We do not recommend any specific financial product or institution</li>
            <li>Product comparisons are based on publicly available information and may not reflect your individual circumstances</li>
            <li>Interest rates, fees, and terms are subject to change without notice by the financial institutions</li>
            <li>Always verify product details directly with the respective bank or financial institution before making any decisions</li>
            <li>Consider consulting with a qualified financial advisor for personalized advice</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">3. Accuracy of Information</h2>
          <p className="text-muted-foreground mb-4">
            We make reasonable efforts to ensure that the information on our Website is accurate and current. However:
          </p>
          <ul className="list-disc pl-6 text-muted-foreground mb-4 space-y-2">
            <li>Product rates, terms, and conditions may change at any time</li>
            <li>We rely on information provided by financial institutions, which may contain errors</li>
            <li>There may be delays between when information changes and when our Website is updated</li>
            <li>Not all products or features of products may be listed on our Website</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">4. No Endorsement</h2>
          <p className="text-muted-foreground mb-4">
            The listing or mention of any bank, financial institution, or product on BankCompare BD does not constitute 
            an endorsement or recommendation. We are an independent comparison platform and are not affiliated with 
            any of the financial institutions listed on our Website unless otherwise stated.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">5. Third-Party Content</h2>
          <p className="text-muted-foreground mb-4">
            Our Website may contain links to external websites or resources, as well as user-generated content such as reviews. 
            We do not control and are not responsible for:
          </p>
          <ul className="list-disc pl-6 text-muted-foreground mb-4 space-y-2">
            <li>The content, accuracy, or availability of third-party websites</li>
            <li>The products or services offered by third parties</li>
            <li>User reviews and opinions, which represent individual experiences and views</li>
            <li>Any transactions you enter into with third parties</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">6. Limitation of Liability</h2>
          <p className="text-muted-foreground mb-4">
            To the fullest extent permitted by law, BankCompare BD and its owners, employees, and affiliates shall not be 
            liable for any direct, indirect, incidental, consequential, or punitive damages arising from:
          </p>
          <ul className="list-disc pl-6 text-muted-foreground mb-4 space-y-2">
            <li>Your use of or inability to use the Website</li>
            <li>Any decisions made based on information provided on the Website</li>
            <li>Any errors, omissions, or inaccuracies in the information provided</li>
            <li>Any financial losses or damages resulting from your reliance on Website content</li>
            <li>Any unauthorized access to or alteration of your transmissions or data</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">7. User Responsibility</h2>
          <p className="text-muted-foreground mb-4">
            You are responsible for:
          </p>
          <ul className="list-disc pl-6 text-muted-foreground mb-4 space-y-2">
            <li>Independently verifying all information before making financial decisions</li>
            <li>Reading and understanding the terms and conditions of any financial product</li>
            <li>Assessing the suitability of any product for your individual circumstances</li>
            <li>Seeking professional advice when needed</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">8. Regulatory Compliance</h2>
          <p className="text-muted-foreground mb-4">
            BankCompare BD is an information comparison website and is not a licensed financial institution, 
            broker, or advisor. We do not:
          </p>
          <ul className="list-disc pl-6 text-muted-foreground mb-4 space-y-2">
            <li>Accept deposits or provide loans</li>
            <li>Process financial transactions</li>
            <li>Provide regulated financial advice</li>
            <li>Act as an intermediary between you and financial institutions</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">9. Changes to This Disclaimer</h2>
          <p className="text-muted-foreground mb-4">
            We reserve the right to modify this Disclaimer at any time. Changes will be effective immediately upon 
            posting on the Website. Your continued use of the Website after changes constitutes acceptance of the 
            modified Disclaimer.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">10. Contact Us</h2>
          <p className="text-muted-foreground mb-4">
            If you have any questions about this Disclaimer, please contact us at:
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

export default DisclaimerPage;
