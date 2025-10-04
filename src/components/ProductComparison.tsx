import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { X, GitCompare, ArrowRight } from 'lucide-react';
import { SavingsProduct, LoanProduct, getBankById } from '@/data/mockData';
import { formatCurrency, formatPercentage } from '@/utils/calculations';

interface ProductComparisonProps {
  type: 'savings' | 'loans';
  products: (SavingsProduct | LoanProduct)[];
}

export const ProductComparison = ({ type, products }: ProductComparisonProps) => {
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [showComparison, setShowComparison] = useState(false);

  const toggleProduct = (productId: string) => {
    setSelectedProducts(prev => 
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : prev.length < 3
          ? [...prev, productId]
          : prev
    );
  };

  const clearSelection = () => {
    setSelectedProducts([]);
    setShowComparison(false);
  };

  const compareProducts = () => {
    setShowComparison(true);
  };

  const selectedProductsData = products.filter(p => selectedProducts.includes(p.id));

  if (showComparison && selectedProductsData.length > 0) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-bold">Product Comparison</h3>
          <Button variant="outline" onClick={() => setShowComparison(false)}>
            Back to List
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {selectedProductsData.map((product) => {
            const bank = getBankById(product.bankId);
            return (
              <Card key={product.id} className="relative">
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-2"
                  onClick={() => toggleProduct(product.id)}
                >
                  <X className="h-4 w-4" />
                </Button>
                <CardHeader>
                  <CardTitle className="text-lg">{product.productName}</CardTitle>
                  <p className="text-sm text-muted-foreground">{bank?.name}</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  {type === 'savings' ? (
                    <SavingsComparisonDetails product={product as SavingsProduct} />
                  ) : (
                    <LoanComparisonDetails product={product as LoanProduct} />
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="flex justify-center">
          <Button onClick={clearSelection} variant="outline">
            Clear All & Start Over
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {selectedProducts.length > 0 && (
        <Card className="bg-primary/5">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <span className="font-medium">
                  {selectedProducts.length} product{selectedProducts.length > 1 ? 's' : ''} selected
                </span>
                <Badge variant="secondary">
                  Max 3 products
                </Badge>
              </div>
              <div className="flex space-x-2">
                <Button
                  onClick={compareProducts}
                  disabled={selectedProducts.length < 2}
                  size="sm"
                >
                  <GitCompare className="h-4 w-4 mr-2" />
                  Compare
                </Button>
                <Button variant="outline" size="sm" onClick={clearSelection}>
                  Clear
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => {
          const bank = getBankById(product.bankId);
          const isSelected = selectedProducts.includes(product.id);
          const canSelect = selectedProducts.length < 3 || isSelected;

          return (
            <Card 
              key={product.id} 
              className={`relative transition-all ${
                isSelected ? 'ring-2 ring-primary' : ''
              } ${!canSelect ? 'opacity-50' : ''}`}
            >
              <div className="absolute top-4 right-4">
                <Checkbox
                  checked={isSelected}
                  onCheckedChange={() => canSelect && toggleProduct(product.id)}
                  disabled={!canSelect}
                />
              </div>
              <CardHeader>
                <CardTitle className="text-lg pr-8">{product.productName}</CardTitle>
                <p className="text-sm text-muted-foreground">{bank?.name}</p>
              </CardHeader>
              <CardContent>
                {type === 'savings' ? (
                  <SavingsProductCard product={product as SavingsProduct} />
                ) : (
                  <LoanProductCard product={product as LoanProduct} />
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

const SavingsProductCard = ({ product }: { product: SavingsProduct }) => (
  <div className="space-y-3">
    <div className="flex justify-between items-center">
      <span className="text-2xl font-bold text-primary">
        {formatPercentage(product.interestRate)}
      </span>
      <Badge variant="secondary" className="capitalize">
        {product.compoundingFrequency}
      </Badge>
    </div>
    <div className="space-y-2 text-sm">
      <div className="flex justify-between">
        <span>Min Deposit:</span>
        <span className="font-medium">{formatCurrency(product.minimumDeposit)}</span>
      </div>
      <div className="flex justify-between">
        <span>Max Deposit:</span>
        <span className="font-medium">{formatCurrency(product.maximumDeposit)}</span>
      </div>
      <div className="flex justify-between">
        <span>Tenure:</span>
        <span className="font-medium">{product.tenure.min}-{product.tenure.max} months</span>
      </div>
    </div>
  </div>
);

const LoanProductCard = ({ product }: { product: LoanProduct }) => (
  <div className="space-y-3">
    <div className="flex justify-between items-center">
      <span className="text-2xl font-bold text-primary">
        {formatPercentage(product.interestRate.min)}-{formatPercentage(product.interestRate.max)}
      </span>
      <Badge variant="secondary" className="capitalize">
        {product.loanType}
      </Badge>
    </div>
    <div className="space-y-2 text-sm">
      <div className="flex justify-between">
        <span>Amount:</span>
        <span className="font-medium">
          {formatCurrency(product.loanAmount.min)}-{formatCurrency(product.loanAmount.max)}
        </span>
      </div>
      <div className="flex justify-between">
        <span>Tenure:</span>
        <span className="font-medium">{product.tenure.min}-{product.tenure.max} months</span>
      </div>
      <div className="flex justify-between">
        <span>Processing:</span>
        <span className="font-medium">{product.processingTime}</span>
      </div>
    </div>
  </div>
);

const SavingsComparisonDetails = ({ product }: { product: SavingsProduct }) => (
  <div className="space-y-4">
    <div className="text-center">
      <div className="text-3xl font-bold text-primary">
        {formatPercentage(product.interestRate)}
      </div>
      <p className="text-sm text-muted-foreground capitalize">
        {product.compoundingFrequency} compounding
      </p>
    </div>
    
    <div className="space-y-3">
      <div>
        <h4 className="font-medium mb-2">Deposit Range</h4>
        <p className="text-sm">
          {formatCurrency(product.minimumDeposit)} - {formatCurrency(product.maximumDeposit)}
        </p>
      </div>
      
      <div>
        <h4 className="font-medium mb-2">Tenure</h4>
        <p className="text-sm">{product.tenure.min} - {product.tenure.max} months</p>
      </div>
      
      <div>
        <h4 className="font-medium mb-2">Fees</h4>
        <div className="text-sm space-y-1">
          <div className="flex justify-between">
            <span>Opening:</span>
            <span>{formatCurrency(product.fees.accountOpening)}</span>
          </div>
          <div className="flex justify-between">
            <span>Maintenance:</span>
            <span>{formatCurrency(product.fees.maintenance)}/month</span>
          </div>
          <div className="flex justify-between">
            <span>Withdrawal:</span>
            <span>{formatCurrency(product.fees.withdrawal)}</span>
          </div>
        </div>
      </div>
      
      <div>
        <h4 className="font-medium mb-2">Features</h4>
        <div className="flex flex-wrap gap-1">
          {product.features.slice(0, 3).map((feature, index) => (
            <Badge key={index} variant="outline" className="text-xs">
              {feature}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  </div>
);

const LoanComparisonDetails = ({ product }: { product: LoanProduct }) => (
  <div className="space-y-4">
    <div className="text-center">
      <div className="text-3xl font-bold text-primary">
        {formatPercentage(product.interestRate.min)}-{formatPercentage(product.interestRate.max)}
      </div>
      <p className="text-sm text-muted-foreground capitalize">
        {product.loanType} loan
      </p>
    </div>
    
    <div className="space-y-3">
      <div>
        <h4 className="font-medium mb-2">Loan Amount</h4>
        <p className="text-sm">
          {formatCurrency(product.loanAmount.min)} - {formatCurrency(product.loanAmount.max)}
        </p>
      </div>
      
      <div>
        <h4 className="font-medium mb-2">Tenure</h4>
        <p className="text-sm">{product.tenure.min} - {product.tenure.max} months</p>
      </div>
      
      <div>
        <h4 className="font-medium mb-2">Processing</h4>
        <div className="text-sm space-y-1">
          <div className="flex justify-between">
            <span>Fee:</span>
            <span>{product.processingFee}%</span>
          </div>
          <div className="flex justify-between">
            <span>Time:</span>
            <span>{product.processingTime}</span>
          </div>
        </div>
      </div>
      
      <div>
        <h4 className="font-medium mb-2">Features</h4>
        <div className="flex flex-wrap gap-1">
          {product.features.slice(0, 3).map((feature, index) => (
            <Badge key={index} variant="outline" className="text-xs">
              {feature}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  </div>
);