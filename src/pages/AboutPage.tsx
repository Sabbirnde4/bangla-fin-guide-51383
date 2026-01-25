import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Target, Eye, Users, Shield, TrendingUp, Award, Building2, CheckCircle } from "lucide-react";

const AboutPage = () => {
  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "About Us" },
  ];

  const values = [
    {
      icon: Shield,
      title: "Transparency",
      description: "We provide unbiased, accurate information without hidden agendas. Our comparisons are based on publicly available data from financial institutions."
    },
    {
      icon: Users,
      title: "User-First",
      description: "Every feature we build is designed to help you make better financial decisions. Your interests always come first."
    },
    {
      icon: TrendingUp,
      title: "Empowerment",
      description: "We believe financial literacy is key to prosperity. We aim to educate and empower Bangladeshi consumers with the tools they need."
    },
    {
      icon: Award,
      title: "Excellence",
      description: "We strive for accuracy and completeness in our data, continuously updating our platform to serve you better."
    }
  ];

  const features = [
    "Compare savings accounts from 50+ banks and NBFIs",
    "Find the best loan rates for personal, home, and auto loans",
    "Set up personalized rate alerts",
    "Use financial calculators to plan your future",
    "Read authentic user reviews",
    "Access educational content on banking"
  ];

  return (
    <div className="container py-8 max-w-5xl">
      <Breadcrumbs items={breadcrumbItems} />
      
      {/* Hero Section */}
      <div className="text-center mb-16">
        <div className="flex justify-center mb-6">
          <div className="p-4 rounded-full bg-primary/10">
            <Building2 className="h-12 w-12 text-primary" />
          </div>
        </div>
        <h1 className="text-4xl font-bold mb-4">About BankCompare BD</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Helping Bangladeshi consumers make smarter financial decisions through transparent, 
          comprehensive banking product comparisons.
        </p>
      </div>

      {/* Mission & Vision */}
      <div className="grid md:grid-cols-2 gap-8 mb-16">
        <Card>
          <CardContent className="p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-primary/10">
                <Target className="h-6 w-6 text-primary" />
              </div>
              <h2 className="text-2xl font-semibold">Our Mission</h2>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              To democratize access to financial information in Bangladesh by providing a free, 
              comprehensive platform where consumers can compare banking products, understand their options, 
              and make confident financial decisions that improve their lives.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-primary/10">
                <Eye className="h-6 w-6 text-primary" />
              </div>
              <h2 className="text-2xl font-semibold">Our Vision</h2>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              To become Bangladesh's most trusted financial comparison platform, recognized for our 
              commitment to transparency, accuracy, and consumer empowerment. We envision a future 
              where every Bangladeshi has the tools to optimize their financial well-being.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Our Story */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold mb-6 text-center">Our Story</h2>
        <div className="bg-muted/50 rounded-lg p-8">
          <p className="text-muted-foreground leading-relaxed mb-4">
            BankCompare BD was founded with a simple observation: navigating Bangladesh's banking 
            landscape is unnecessarily complex. With over 60 banks, numerous NBFIs, and countless 
            financial products, consumers often struggle to find the best options for their needs.
          </p>
          <p className="text-muted-foreground leading-relaxed mb-4">
            We set out to change that. Our team of financial technology enthusiasts and banking 
            experts built a platform that aggregates product information from across the industry, 
            presenting it in a clear, comparable format.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            Today, BankCompare BD serves thousands of users monthly, helping them find better savings 
            rates, lower loan costs, and smarter banking relationships. We're proud to contribute to 
            financial literacy and inclusion in Bangladesh.
          </p>
        </div>
      </div>

      {/* Our Values */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold mb-8 text-center">Our Values</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {values.map((value) => {
            const Icon = value.icon;
            return (
              <Card key={value.title}>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="p-2 rounded-lg bg-primary/10 shrink-0">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">{value.title}</h3>
                      <p className="text-sm text-muted-foreground">{value.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* What We Offer */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold mb-8 text-center">What We Offer</h2>
        <Card>
          <CardContent className="p-8">
            <div className="grid md:grid-cols-2 gap-4">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-primary shrink-0" />
                  <span className="text-muted-foreground">{feature}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* CTA Section */}
      <div className="text-center bg-primary/5 rounded-lg p-12">
        <h2 className="text-2xl font-bold mb-4">Ready to Find Better Banking Products?</h2>
        <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
          Start comparing savings accounts, loans, and more. It's free, fast, and could save you money.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link to="/savings">
            <Button size="lg">Compare Savings</Button>
          </Link>
          <Link to="/loans">
            <Button size="lg" variant="outline">Compare Loans</Button>
          </Link>
          <Link to="/contact">
            <Button size="lg" variant="ghost">Contact Us</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
