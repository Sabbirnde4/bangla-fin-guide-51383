import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import { Upload, FileSpreadsheet, CheckCircle, AlertTriangle, Download } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

type DataType = 'banks' | 'savings_products' | 'loan_products' | 'nbfis' | 'ngos';

interface UploadResult {
  success: number;
  errors: number;
  errorMessages: string[];
}

export default function DataUpload() {
  const { toast } = useToast();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dataType, setDataType] = useState<DataType>('banks');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<UploadResult | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const validTypes = [
        'text/csv',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      ];
      
      if (validTypes.includes(file.type) || file.name.endsWith('.csv') || file.name.endsWith('.xlsx')) {
        setSelectedFile(file);
        setUploadResult(null);
      } else {
        toast({
          title: "Invalid file type",
          description: "Please upload a CSV or Excel file.",
          variant: "destructive",
        });
      }
    }
  };

  const parseFile = async (file: File): Promise<any[]> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          if (file.name.endsWith('.csv')) {
            // Parse CSV
            Papa.parse(e.target?.result as string, {
              header: true,
              skipEmptyLines: true,
              complete: (results) => {
                resolve(results.data);
              },
              error: (error) => {
                reject(error);
              }
            });
          } else {
            // Parse Excel
            const data = new Uint8Array(e.target?.result as ArrayBuffer);
            const workbook = XLSX.read(data, { type: 'array' });
            const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
            const jsonData = XLSX.utils.sheet_to_json(firstSheet);
            resolve(jsonData);
          }
        } catch (error) {
          reject(error);
        }
      };
      
      if (file.name.endsWith('.csv')) {
        reader.readAsText(file);
      } else {
        reader.readAsArrayBuffer(file);
      }
    });
  };

  const mapDataToSchema = (data: any[], type: DataType) => {
    return data.map(row => {
      switch (type) {
        case 'banks':
          return {
            id: row.id || row.ID,
            name: row.name || row.Name,
            logo: row.logo || row.Logo || '/placeholder.svg',
            established: parseInt(row.established || row.Established) || null,
            rating: parseFloat(row.rating || row.Rating) || null,
            total_branches: parseInt(row.total_branches || row['Total Branches']) || null,
            website: row.website || row.Website || null
          };
        
        case 'nbfis':
          return {
            id: row.id || row.ID,
            name: row.name || row.Name,
            logo: row.logo || row.Logo || '/placeholder.svg',
            established: parseInt(row.established || row.Established) || null,
            rating: parseFloat(row.rating || row.Rating) || null,
            total_branches: parseInt(row.total_branches || row['Total Branches']) || null,
            website: row.website || row.Website || null,
            type: row.type || row.Type || 'investment'
          };
        
        case 'ngos':
          return {
            id: row.id || row.ID,
            name: row.name || row.Name,
            logo: row.logo || row.Logo || '/placeholder.svg',
            established: parseInt(row.established || row.Established) || null,
            rating: parseFloat(row.rating || row.Rating) || null,
            total_branches: parseInt(row.total_branches || row['Total Branches']) || null,
            website: row.website || row.Website || null,
            focus: typeof row.focus === 'string' ? row.focus.split(',').map((s: string) => s.trim()) : row.focus || []
          };
        
        case 'savings_products':
          return {
            id: row.id || row.ID,
            bank_id: row.bank_id || row['Bank ID'],
            product_name: row.product_name || row['Product Name'],
            interest_rate: parseFloat(row.interest_rate || row['Interest Rate']) || 0,
            minimum_deposit: parseFloat(row.minimum_deposit || row['Minimum Deposit']) || 0,
            maximum_deposit: parseFloat(row.maximum_deposit || row['Maximum Deposit']) || null,
            tenure_min: parseInt(row.tenure_min || row['Tenure Min']) || null,
            tenure_max: parseInt(row.tenure_max || row['Tenure Max']) || null,
            compounding_frequency: row.compounding_frequency || row['Compounding Frequency'] || 'monthly',
            account_opening_fee: parseFloat(row.account_opening_fee || row['Account Opening Fee']) || 0,
            maintenance_fee: parseFloat(row.maintenance_fee || row['Maintenance Fee']) || 0,
            withdrawal_fee: parseFloat(row.withdrawal_fee || row['Withdrawal Fee']) || 0,
            features: typeof row.features === 'string' ? row.features.split(',').map((s: string) => s.trim()) : row.features || [],
            eligibility: typeof row.eligibility === 'string' ? row.eligibility.split(',').map((s: string) => s.trim()) : row.eligibility || []
          };
        
        case 'loan_products':
          return {
            id: row.id || row.ID,
            bank_id: row.bank_id || row['Bank ID'],
            product_name: row.product_name || row['Product Name'],
            loan_type: row.loan_type || row['Loan Type'] || 'personal',
            interest_rate_min: parseFloat(row.interest_rate_min || row['Interest Rate Min']) || 0,
            interest_rate_max: parseFloat(row.interest_rate_max || row['Interest Rate Max']) || 0,
            loan_amount_min: parseFloat(row.loan_amount_min || row['Loan Amount Min']) || null,
            loan_amount_max: parseFloat(row.loan_amount_max || row['Loan Amount Max']) || null,
            tenure_min: parseInt(row.tenure_min || row['Tenure Min']) || null,
            tenure_max: parseInt(row.tenure_max || row['Tenure Max']) || null,
            processing_fee: parseFloat(row.processing_fee || row['Processing Fee']) || 0,
            processing_time: row.processing_time || row['Processing Time'] || null,
            eligibility: typeof row.eligibility === 'string' ? row.eligibility.split(',').map((s: string) => s.trim()) : row.eligibility || [],
            required_documents: typeof row.required_documents === 'string' ? row.required_documents.split(',').map((s: string) => s.trim()) : row.required_documents || [],
            features: typeof row.features === 'string' ? row.features.split(',').map((s: string) => s.trim()) : row.features || []
          };
        
        default:
          return row;
      }
    });
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast({
        title: "No file selected",
        description: "Please select a file to upload.",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    setUploadResult(null);

    try {
      const parsedData = await parseFile(selectedFile);
      const mappedData = mapDataToSchema(parsedData, dataType);

      let successCount = 0;
      let errorCount = 0;
      const errorMessages: string[] = [];

      // Upload data in batches
      const batchSize = 100;
      for (let i = 0; i < mappedData.length; i += batchSize) {
        const batch = mappedData.slice(i, i + batchSize);
        
        const { error } = await supabase
          .from(dataType)
          .upsert(batch, { onConflict: 'id' });

        if (error) {
          errorCount += batch.length;
          errorMessages.push(`Batch ${i / batchSize + 1}: ${error.message}`);
        } else {
          successCount += batch.length;
        }
      }

      setUploadResult({ success: successCount, errors: errorCount, errorMessages });

      toast({
        title: errorCount === 0 ? "Upload successful!" : "Upload completed with errors",
        description: `Successfully uploaded ${successCount} records${errorCount > 0 ? `, ${errorCount} failed` : ''}.`,
        variant: errorCount === 0 ? "default" : "destructive",
      });

    } catch (error) {
      console.error('Error uploading file:', error);
      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : "An error occurred while uploading the file.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const downloadTemplate = () => {
    let headers: string[] = [];
    let sampleData: any = {};

    switch (dataType) {
      case 'banks':
        headers = ['id', 'name', 'logo', 'established', 'rating', 'total_branches', 'website'];
        sampleData = {
          id: 'sample-bank-1',
          name: 'Sample Bank',
          logo: '/placeholder.svg',
          established: 2020,
          rating: 4.5,
          total_branches: 50,
          website: 'https://example.com'
        };
        break;
      case 'nbfis':
        headers = ['id', 'name', 'logo', 'established', 'rating', 'total_branches', 'website', 'type'];
        sampleData = {
          id: 'sample-nbfi-1',
          name: 'Sample NBFI',
          logo: '/placeholder.svg',
          established: 2020,
          rating: 4.0,
          total_branches: 25,
          website: 'https://example.com',
          type: 'investment'
        };
        break;
      case 'ngos':
        headers = ['id', 'name', 'logo', 'established', 'rating', 'total_branches', 'website', 'focus'];
        sampleData = {
          id: 'sample-ngo-1',
          name: 'Sample NGO',
          logo: '/placeholder.svg',
          established: 2020,
          rating: 4.2,
          total_branches: 15,
          website: 'https://example.com',
          focus: 'microfinance,education'
        };
        break;
      case 'savings_products':
        headers = ['id', 'bank_id', 'product_name', 'interest_rate', 'minimum_deposit', 'maximum_deposit', 'tenure_min', 'tenure_max', 'compounding_frequency', 'account_opening_fee', 'maintenance_fee', 'withdrawal_fee', 'features', 'eligibility'];
        sampleData = {
          id: 'sample-savings-1',
          bank_id: 'sample-bank-1',
          product_name: 'Sample Savings Account',
          interest_rate: 5.5,
          minimum_deposit: 1000,
          maximum_deposit: 1000000,
          tenure_min: 12,
          tenure_max: 60,
          compounding_frequency: 'monthly',
          account_opening_fee: 0,
          maintenance_fee: 100,
          withdrawal_fee: 0,
          features: 'Online banking,Mobile app',
          eligibility: 'Age 18+,Valid ID'
        };
        break;
      case 'loan_products':
        headers = ['id', 'bank_id', 'product_name', 'loan_type', 'interest_rate_min', 'interest_rate_max', 'loan_amount_min', 'loan_amount_max', 'tenure_min', 'tenure_max', 'processing_fee', 'processing_time', 'eligibility', 'required_documents', 'features'];
        sampleData = {
          id: 'sample-loan-1',
          bank_id: 'sample-bank-1',
          product_name: 'Sample Personal Loan',
          loan_type: 'personal',
          interest_rate_min: 8.5,
          interest_rate_max: 12.5,
          loan_amount_min: 50000,
          loan_amount_max: 500000,
          tenure_min: 12,
          tenure_max: 60,
          processing_fee: 2,
          processing_time: '3-5 business days',
          eligibility: 'Age 21-60,Steady income',
          required_documents: 'NID,Salary slip,Bank statement',
          features: 'Quick approval,Flexible tenure'
        };
        break;
    }

    const csv = [headers.join(','), Object.values(sampleData).join(',')].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${dataType}_template.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <FileSpreadsheet className="h-5 w-5 text-primary" />
          <div>
            <CardTitle>CSV/Excel Data Upload</CardTitle>
            <CardDescription>Upload bulk data from CSV or Excel files</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="dataType">Data Type</Label>
          <Select value={dataType} onValueChange={(value) => setDataType(value as DataType)}>
            <SelectTrigger id="dataType">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="banks">Banks</SelectItem>
              <SelectItem value="nbfis">NBFIs</SelectItem>
              <SelectItem value="ngos">NGOs</SelectItem>
              <SelectItem value="savings_products">Savings Products</SelectItem>
              <SelectItem value="loan_products">Loan Products</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="file">Upload File</Label>
          <Input
            id="file"
            type="file"
            accept=".csv,.xlsx,.xls"
            onChange={handleFileChange}
            disabled={isUploading}
          />
          {selectedFile && (
            <p className="text-sm text-muted-foreground">
              Selected: {selectedFile.name} ({(selectedFile.size / 1024).toFixed(2)} KB)
            </p>
          )}
        </div>

        <div className="flex gap-2">
          <Button
            onClick={handleUpload}
            disabled={!selectedFile || isUploading}
            className="flex-1"
          >
            {isUploading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Upload Data
              </>
            )}
          </Button>
          <Button variant="outline" onClick={downloadTemplate}>
            <Download className="mr-2 h-4 w-4" />
            Download Template
          </Button>
        </div>

        {uploadResult && (
          <Alert variant={uploadResult.errors === 0 ? "default" : "destructive"}>
            {uploadResult.errors === 0 ? (
              <CheckCircle className="h-4 w-4" />
            ) : (
              <AlertTriangle className="h-4 w-4" />
            )}
            <AlertDescription>
              <div className="space-y-1">
                <p className="font-semibold">
                  {uploadResult.success} records uploaded successfully
                  {uploadResult.errors > 0 && `, ${uploadResult.errors} failed`}
                </p>
                {uploadResult.errorMessages.length > 0 && (
                  <div className="mt-2 text-xs space-y-1">
                    <p className="font-semibold">Errors:</p>
                    {uploadResult.errorMessages.map((msg, i) => (
                      <p key={i} className="opacity-90">{msg}</p>
                    ))}
                  </div>
                )}
              </div>
            </AlertDescription>
          </Alert>
        )}

        <div className="flex items-start gap-2 p-3 bg-muted/50 rounded-lg">
          <AlertTriangle className="h-4 w-4 text-orange-500 mt-0.5" />
          <div className="text-xs text-muted-foreground space-y-1">
            <p className="font-semibold">Upload Guidelines:</p>
            <ul className="list-disc list-inside space-y-0.5">
              <li>Files will be upserted (insert or update) based on ID</li>
              <li>Array fields (features, eligibility, etc.) should be comma-separated</li>
              <li>Column names are case-insensitive</li>
              <li>Download template for correct format</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
