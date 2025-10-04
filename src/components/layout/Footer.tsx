import { Link } from 'react-router-dom';
import { Building2, Mail, Phone, MapPin } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="border-t bg-muted/50">
      <div className="container py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Building2 className="h-6 w-6 text-primary" />
              <span className="font-bold text-lg">BankCompare BD</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Compare the best banking products in Bangladesh. Find the perfect savings account, 
              loan, or investment option that suits your financial needs.
            </p>
            <div className="flex space-x-4">
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span>info@bankcomparebd.com</span>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <h4 className="text-sm font-semibold">Products</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link to="/savings" className="hover:text-foreground transition-colors">
                  Savings Accounts
                </Link>
              </li>
              <li>
                <Link to="/loans" className="hover:text-foreground transition-colors">
                  Loans
                </Link>
              </li>
              <li>
                <Link to="/calculators" className="hover:text-foreground transition-colors">
                  Calculators
                </Link>
              </li>
              <li>
                <Link to="/banks" className="hover:text-foreground transition-colors">
                  Banks Directory
                </Link>
              </li>
            </ul>
          </div>
          
          <div className="space-y-4">
            <h4 className="text-sm font-semibold">Resources</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link to="/guides" className="hover:text-foreground transition-colors">
                  Banking Guides
                </Link>
              </li>
              <li>
                <Link to="/blog" className="hover:text-foreground transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-foreground transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-foreground transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
          
          <div className="space-y-4">
            <h4 className="text-sm font-semibold">Legal</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link to="/privacy" className="hover:text-foreground transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-foreground transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/disclaimer" className="hover:text-foreground transition-colors">
                  Disclaimer
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} BankCompare BD. All rights reserved.</p>
          <p className="mt-2">
            Designed to help Bangladeshi consumers make informed financial decisions.
          </p>
        </div>
      </div>
    </footer>
  );
};