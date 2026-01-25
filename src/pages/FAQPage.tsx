import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, HelpCircle, Calculator, Bell, Star, Shield } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const faqs = [
  {
    category: "General",
    icon: HelpCircle,
    questions: [
      {
        question: "What is BankCompare BD?",
        answer: "BankCompare BD is a free online platform that helps you compare banking products from various financial institutions in Bangladesh. We provide comprehensive information on savings accounts, loans, and other financial products to help you make informed decisions."
      },
      {
        question: "Is BankCompare BD free to use?",
        answer: "Yes, BankCompare BD is completely free for users. We provide unbiased comparison services at no cost to help Bangladeshi consumers find the best banking products."
      },
      {
        question: "How accurate is the information on BankCompare BD?",
        answer: "We strive to provide the most accurate and up-to-date information. Our data is sourced directly from financial institutions and updated regularly. However, rates and terms can change, so we always recommend verifying details with the respective bank before making decisions."
      },
      {
        question: "Does BankCompare BD provide financial advice?",
        answer: "No, we do not provide personalized financial advice. Our platform offers comparison tools and general information. For specific financial advice, we recommend consulting with a qualified financial advisor."
      }
    ]
  },
  {
    category: "Comparing Products",
    icon: Calculator,
    questions: [
      {
        question: "How do I compare savings accounts?",
        answer: "Navigate to the Savings page from the menu. You can filter products by bank, interest rate, minimum deposit, and other criteria. Select up to 3 products to compare them side-by-side."
      },
      {
        question: "What factors should I consider when comparing loans?",
        answer: "Key factors include the interest rate (APR), processing fees, prepayment penalties, loan tenure options, and eligibility requirements. Our comparison tool highlights all these factors to help you make an informed choice."
      },
      {
        question: "Can I compare products from different types of institutions?",
        answer: "Yes! We include products from commercial banks, non-bank financial institutions (NBFIs), and microfinance organizations so you can compare across all options available in Bangladesh."
      },
      {
        question: "What does 'compounding frequency' mean?",
        answer: "Compounding frequency refers to how often interest is calculated and added to your principal. Monthly compounding means interest is added 12 times a year, quarterly means 4 times. More frequent compounding generally results in higher returns for savings accounts."
      }
    ]
  },
  {
    category: "Rate Alerts",
    icon: Bell,
    questions: [
      {
        question: "What are rate alerts?",
        answer: "Rate alerts notify you when banking product rates change based on conditions you set. For example, you can set an alert for when a savings account interest rate exceeds 8% or when a loan rate drops below a certain threshold."
      },
      {
        question: "How do I set up a rate alert?",
        answer: "Go to the Alerts page, click 'Create Alert', select the product type and specific product, choose your condition (e.g., 'Rate increases above'), and set your threshold value. You'll receive notifications when your conditions are met."
      },
      {
        question: "Are rate alerts free?",
        answer: "Yes, rate alerts are completely free. You need to create an account to use this feature so we can send you personalized notifications."
      },
      {
        question: "How quickly will I be notified of rate changes?",
        answer: "Our system checks for rate changes daily. You'll typically receive alerts within 24 hours of a qualifying rate change."
      }
    ]
  },
  {
    category: "Reviews & Ratings",
    icon: Star,
    questions: [
      {
        question: "How are bank ratings calculated?",
        answer: "Bank ratings are an aggregate of user reviews submitted by verified users who have experience with the institution. Ratings are based on factors like customer service, digital banking experience, and product offerings."
      },
      {
        question: "Can I submit a review?",
        answer: "Yes! If you have an account with us, you can submit reviews for any banking product or institution you've used. We encourage honest, constructive feedback to help other users."
      },
      {
        question: "Are reviews verified?",
        answer: "All reviews are submitted by registered users. While we cannot verify every customer relationship, we have systems to detect and remove fake or inappropriate reviews."
      }
    ]
  },
  {
    category: "Account & Security",
    icon: Shield,
    questions: [
      {
        question: "Why should I create an account?",
        answer: "An account gives you access to personalized features like rate alerts, favorites, comparison history, and the ability to submit reviews. Your preferences are saved across devices."
      },
      {
        question: "Is my personal information secure?",
        answer: "Yes, we take security seriously. We use industry-standard encryption, never share your data with third parties for marketing, and only collect information necessary to provide our services. See our Privacy Policy for details."
      },
      {
        question: "How do I delete my account?",
        answer: "You can delete your account from your Dashboard settings. This will remove all your personal data, alerts, favorites, and reviews from our system."
      }
    ]
  }
];

const FAQPage = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "FAQ" },
  ];

  const filteredFaqs = faqs.map(category => ({
    ...category,
    questions: category.questions.filter(
      q => q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
           q.answer.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => category.questions.length > 0);

  return (
    <div className="container py-8 max-w-4xl">
      <Breadcrumbs items={breadcrumbItems} />
      
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold mb-4">Frequently Asked Questions</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
          Find answers to common questions about using BankCompare BD and comparing banking products in Bangladesh.
        </p>
        
        <div className="relative max-w-md mx-auto">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search questions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="space-y-8">
        {filteredFaqs.map((category) => {
          const Icon = category.icon;
          return (
            <Card key={category.category}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon className="h-5 w-5 text-primary" />
                  {category.category}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  {category.questions.map((faq, index) => (
                    <AccordionItem key={index} value={`${category.category}-${index}`}>
                      <AccordionTrigger className="text-left">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          );
        })}

        {filteredFaqs.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">No matching questions found.</p>
            <Button variant="outline" onClick={() => setSearchQuery("")}>
              Clear Search
            </Button>
          </div>
        )}
      </div>

      <Card className="mt-12">
        <CardHeader>
          <CardTitle>Still have questions?</CardTitle>
          <CardDescription>
            Can't find what you're looking for? We're here to help.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Link to="/contact">
            <Button>Contact Us</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
};

export default FAQPage;
