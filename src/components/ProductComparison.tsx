import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { X, GitCompare, ArrowRight, TrendingUp, TrendingDown, Award } from 'lucide-react';
import { SavingsProduct, LoanProduct, getBankById } from '@/data/mockData';
import { formatCurrency, formatPercentage } from '@/utils/calculations';

interface ProductComparisonProps {
  type: 'savings' | 'loans';
  products: (SavingsProduct | LoanProduct)[];
}

export const ProductComparison = ({ type, products }: ProductComparisonProps) => {
  const navigate = useNavigate();
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

  // Find best values for highlighting
  const getBestValues = () => {
    if (type === 'savings') {
      const savingsData = selectedProductsData as SavingsProduct[];
      return {
        bestInterestRate: Math.max(...savingsData.map(p => p.interestRate)),
        lowestMinDeposit: Math.min(...savingsData.map(p => p.minimumDeposit)),
        lowestOpeningFee: Math.min(...savingsData.map(p => p.fees.accountOpening)),
        lowestMaintenanceFee: Math.min(...savingsData.map(p => p.fees.maintenance)),
      };
    } else {
      const loanData = selectedProductsData as LoanProduct[];
      return {
        lowestInterestRate: Math.min(...loanData.map(p => p.interestRate.min)),
        highestMaxAmount: Math.max(...loanData.map(p => p.loanAmount.max)),
        lowestProcessingFee: Math.min(...loanData.map(p => p.processingFee)),
      };
    }
  };

  if (showComparison && selectedProductsData.length > 0) {
    const bestValues = getBestValues();
    
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-bold flex items-center gap-2">
              <GitCompare className="h-6 w-6" />
              Product Comparison
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              Best values are highlighted with <Award className="h-3 w-3 inline text-primary" />
            </p>
          </div>
          <Button variant="outline" onClick={() => setShowComparison(false)}>
            Back to List
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {selectedProductsData.map((product) => {
            const bank = getBankById(product.bankId);
            return (
              <Card 
                key={product.id} 
                className="relative cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => navigate(`/${type}/${product.id}`)}
              >
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-2 z-10"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleProduct(product.id);
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
                <CardHeader>
                  <CardTitle className="text-lg pr-8">{product.productName}</CardTitle>
                  <p className="text-sm text-muted-foreground">{bank?.name}</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  {type === 'savings' ? (
                    <SavingsComparisonDetails 
                      product={product as SavingsProduct} 
                      bestValues={bestValues}
                    />
                  ) : (
                    <LoanComparisonDetails 
                      product={product as LoanProduct}
                      bestValues={bestValues}
                    />
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="flex justify-center gap-4">
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
              className={`relative transition-all cursor-pointer hover:shadow-lg ${
                isSelected ? 'ring-2 ring-primary' : ''
              } ${!canSelect ? 'opacity-50' : ''}`}
              onClick={() => navigate(`/${type}/${product.id}`)}
            >
              <div 
                className="absolute top-4 right-4 z-10"
                onClick={(e) => e.stopPropagation()}
              >
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

const SavingsComparisonDetails = ({ product, bestValues }: { 
  product: SavingsProduct;
  bestValues: any;
}) => {
  const isBestRate = product.interestRate === bestValues.bestInterestRate;
  const isBestMinDeposit = product.minimumDeposit === bestValues.lowestMinDeposit;
  const isBestOpeningFee = product.fees.accountOpening === bestValues.lowestOpeningFee;
  const isBestMaintenanceFee = product.fees.maintenance === bestValues.lowestMaintenanceFee;

  return (
    <div className="space-y-4">
      <div className="text-center p-3 bg-muted/50 rounded-lg">
        <div className="flex items-center justify-center gap-2">
          <div className="text-3xl font-bold text-primary">
            {formatPercentage(product.interestRate)}
          </div>
          {isBestRate && <Award className="h-5 w-5 text-primary" />}
        </div>
        <p className="text-sm text-muted-foreground capitalize">
          {product.compoundingFrequency} compounding
        </p>
      </div>
      
      <Separator />
      
      <div className="space-y-3">
        <div>
          <h4 className="font-medium mb-2 text-sm">Deposit Range</h4>
          <div className="text-sm space-y-1">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Min:</span>
              <div className="flex items-center gap-2">
                <span className={isBestMinDeposit ? 'font-semibold text-primary' : ''}>
                  {formatCurrency(product.minimumDeposit)}
                </span>
                {isBestMinDeposit && <Award className="h-3 w-3 text-primary" />}
              </div>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Max:</span>
              <span>{formatCurrency(product.maximumDeposit)}</span>
            </div>
          </div>
        </div>
        
        <Separator />
        
        <div>
          <h4 className="font-medium mb-2 text-sm">Tenure</h4>
          <p className="text-sm">{product.tenure.min} - {product.tenure.max} months</p>
        </div>
        
        <Separator />
        
        <div>
          <h4 className="font-medium mb-2 text-sm">Fees</h4>
          <div className="text-sm space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Opening:</span>
              <div className="flex items-center gap-2">
                <span className={isBestOpeningFee ? 'font-semibold text-primary' : ''}>
                  {formatCurrency(product.fees.accountOpening)}
                </span>
                {isBestOpeningFee && <Award className="h-3 w-3 text-primary" />}
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Maintenance:</span>
              <div className="flex items-center gap-2">
                <span className={isBestMaintenanceFee ? 'font-semibold text-primary' : ''}>
                  {formatCurrency(product.fees.maintenance)}/mo
                </span>
                {isBestMaintenanceFee && <Award className="h-3 w-3 text-primary" />}
              </div>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Withdrawal:</span>
              <span>{formatCurrency(product.fees.withdrawal)}</span>
            </div>
          </div>
        </div>
        
        <Separator />
        
        <div>
          <h4 className="font-medium mb-2 text-sm">Key Features</h4>
          <div className="flex flex-wrap gap-1">
            {product.features.slice(0, 4).map((feature, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {feature}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const LoanComparisonDetails = ({ product, bestValues }: { 
  product: LoanProduct;
  bestValues: any;
}) => {
  const isBestRate = product.interestRate.min === bestValues.lowestInterestRate;
  const isBestAmount = product.loanAmount.max === bestValues.highestMaxAmount;
  const isBestProcessingFee = product.processingFee === bestValues.lowestProcessingFee;

  return (
    <div className="space-y-4">
      <div className="text-center p-3 bg-muted/50 rounded-lg">
        <div className="flex items-center justify-center gap-2">
          <div className="text-3xl font-bold text-primary">
            {formatPercentage(product.interestRate.min)}-{formatPercentage(product.interestRate.max)}
          </div>
          {isBestRate && <Award className="h-5 w-5 text-primary" />}
        </div>
        <p className="text-sm text-muted-foreground capitalize">
          {product.loanType} loan
        </p>
      </div>
      
      <Separator />
      
      <div className="space-y-3">
        <div>
          <h4 className="font-medium mb-2 text-sm">Loan Amount</h4>
          <div className="text-sm space-y-1">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Min:</span>
              <span>{formatCurrency(product.loanAmount.min)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Max:</span>
              <div className="flex items-center gap-2">
                <span className={isBestAmount ? 'font-semibold text-primary' : ''}>
                  {formatCurrency(product.loanAmount.max)}
                </span>
                {isBestAmount && <Award className="h-3 w-3 text-primary" />}
              </div>
            </div>
          </div>
        </div>
        
        <Separator />
        
        <div>
          <h4 className="font-medium mb-2 text-sm">Tenure</h4>
          <p className="text-sm">{product.tenure.min} - {product.tenure.max} months</p>
        </div>
        
        <Separator />
        
        <div>
          <h4 className="font-medium mb-2 text-sm">Processing</h4>
          <div className="text-sm space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Fee:</span>
              <div className="flex items-center gap-2">
                <span className={isBestProcessingFee ? 'font-semibold text-primary' : ''}>
                  {product.processingFee}%
                </span>
                {isBestProcessingFee && <Award className="h-3 w-3 text-primary" />}
              </div>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Time:</span>
              <span>{product.processingTime}</span>
            </div>
          </div>
        </div>
        
        <Separator />
        
        <div>
          <h4 className="font-medium mb-2 text-sm">Key Features</h4>
          <div className="flex flex-wrap gap-1">
            {product.features.slice(0, 4).map((feature, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {feature}
              </Badge>
            ))}
          </div>
        </div>
        
        <Separator />
        
        <div>
          <h4 className="font-medium mb-2 text-sm">Required Documents</h4>
          <ul className="text-xs text-muted-foreground space-y-1">
            {product.requiredDocuments.slice(0, 3).map((doc, index) => (
              <li key={index}>• {doc}</li>
            ))}
            {product.requiredDocuments.length > 3 && (
              <li className="text-primary">+ {product.requiredDocuments.length - 3} more</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};