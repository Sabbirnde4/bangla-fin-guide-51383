import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Building2, PiggyBank, CreditCard, Briefcase, Star, TrendingUp, Loader2 } from "lucide-react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

// Local interfaces for type safety
interface Bank {
  id: string;
  name: string;
  rating: number | null;
  total_branches: number | null;
  established: number | null;
}

interface Nbfi {
  id: string;
  name: string;
  rating: number | null;
  total_branches: number | null;
  type: string | null;
}

interface Ngo {
  id: string;
  name: string;
  rating: number | null;
  focus: string[] | null;
}

interface SavingsProductWithBank {
  id: string;
  product_name: string;
  interest_rate: number;
  minimum_deposit: number | null;
  banks: { name: string } | null;
}

interface LoanProductWithBank {
  id: string;
  product_name: string;
  interest_rate_min: number | null;
  interest_rate_max: number | null;
  loan_type: string | null;
  banks: { name: string } | null;
}

export function SearchCommand() {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const { data: banks, isLoading: banksLoading } = useQuery({
    queryKey: ["banks"],
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from("banks")
        .select("*")
        .order("rating", { ascending: false });
      if (error) throw error;
      return (data || []) as Bank[];
    },
  });

  const { data: savingsProducts, isLoading: savingsLoading } = useQuery({
    queryKey: ["savings_products"],
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from("savings_products")
        .select("*, banks(name)")
        .order("interest_rate", { ascending: false });
      if (error) throw error;
      return (data || []) as SavingsProductWithBank[];
    },
  });

  const { data: loanProducts, isLoading: loansLoading } = useQuery({
    queryKey: ["loan_products"],
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from("loan_products")
        .select("*, banks(name)")
        .order("interest_rate_min", { ascending: true });
      if (error) throw error;
      return (data || []) as LoanProductWithBank[];
    },
  });

  const { data: nbfis, isLoading: nbfisLoading } = useQuery({
    queryKey: ["nbfis"],
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from("nbfis")
        .select("*")
        .order("rating", { ascending: false });
      if (error) throw error;
      return (data || []) as Nbfi[];
    },
  });

  const { data: ngos, isLoading: ngosLoading } = useQuery({
    queryKey: ["ngos"],
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from("ngos")
        .select("*")
        .order("rating", { ascending: false });
      if (error) throw error;
      return (data || []) as Ngo[];
    },
  });

  const isLoading = banksLoading || savingsLoading || loansLoading || nbfisLoading || ngosLoading;

  // Filter results based on search query
  const filteredBanks = banks?.filter((bank) =>
    bank.name.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  const filteredNbfis = nbfis?.filter((nbfi) =>
    nbfi.name.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  const filteredNgos = ngos?.filter((ngo) =>
    ngo.name.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  const filteredSavings = savingsProducts?.filter((product) =>
    product.product_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.banks?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  const filteredLoans = loanProducts?.filter((product) =>
    product.product_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.banks?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.loan_type?.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  const handleSelect = (callback: () => void) => {
    setOpen(false);
    setSearchQuery("");
    callback();
  };

  return (
    <>
      <Button
        variant="outline"
        className="relative h-9 w-9 p-0 xl:h-10 xl:w-60 xl:justify-start xl:px-3 xl:py-2"
        onClick={() => setOpen(true)}
      >
        <Search className="h-4 w-4 xl:mr-2" />
        <span className="hidden xl:inline-flex">Search...</span>
        <kbd className="pointer-events-none absolute right-1.5 top-2 hidden h-6 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 xl:flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput 
          placeholder="Search banks, products, institutions..." 
          value={searchQuery}
          onValueChange={setSearchQuery}
        />
        <CommandList>
          {isLoading ? (
            <div className="flex items-center justify-center py-6">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <>
              <CommandEmpty>
                <div className="flex flex-col items-center justify-center py-6 text-center">
                  <Search className="h-10 w-10 text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">No results found</p>
                  <p className="text-xs text-muted-foreground mt-1">Try searching for banks, products, or institutions</p>
                </div>
              </CommandEmpty>
              
              {filteredBanks.length > 0 && (
            <CommandGroup heading={`Banks (${filteredBanks.length})`}>
              {filteredBanks.slice(0, 8).map((bank) => (
                <CommandItem
                  key={bank.id}
                  value={bank.name}
                  onSelect={() => handleSelect(() => navigate(`/banks/${bank.id}`))}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4" />
                    <div className="flex flex-col">
                      <span className="font-medium">{bank.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {bank.total_branches} branches • Est. {bank.established}
                      </span>
                    </div>
                  </div>
                  {bank.rating && (
                    <Badge variant="secondary" className="ml-2">
                      <Star className="h-3 w-3 mr-1" />
                      {bank.rating}
                    </Badge>
                  )}
                </CommandItem>
              ))}
            </CommandGroup>
          )}

          {filteredNbfis.length > 0 && (
            <CommandGroup heading={`NBFIs (${filteredNbfis.length})`}>
              {filteredNbfis.slice(0, 5).map((nbfi) => (
                <CommandItem
                  key={nbfi.id}
                  value={nbfi.name}
                  onSelect={() => handleSelect(() => navigate(`/banks`))}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <Briefcase className="h-4 w-4" />
                    <div className="flex flex-col">
                      <span className="font-medium">{nbfi.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {nbfi.type} • {nbfi.total_branches} branches
                      </span>
                    </div>
                  </div>
                  {nbfi.rating && (
                    <Badge variant="secondary" className="ml-2">
                      <Star className="h-3 w-3 mr-1" />
                      {nbfi.rating}
                    </Badge>
                  )}
                </CommandItem>
              ))}
            </CommandGroup>
          )}

          {filteredNgos.length > 0 && (
            <CommandGroup heading={`NGOs (${filteredNgos.length})`}>
              {filteredNgos.slice(0, 5).map((ngo) => (
                <CommandItem
                  key={ngo.id}
                  value={ngo.name}
                  onSelect={() => handleSelect(() => navigate(`/banks`))}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <Briefcase className="h-4 w-4" />
                    <div className="flex flex-col">
                      <span className="font-medium">{ngo.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {ngo.focus?.slice(0, 2).join(", ")}
                      </span>
                    </div>
                  </div>
                  {ngo.rating && (
                    <Badge variant="secondary" className="ml-2">
                      <Star className="h-3 w-3 mr-1" />
                      {ngo.rating}
                    </Badge>
                  )}
                </CommandItem>
              ))}
            </CommandGroup>
          )}

          {filteredSavings.length > 0 && (
            <CommandGroup heading={`Savings Products (${filteredSavings.length})`}>
              {filteredSavings.slice(0, 8).map((product) => (
                <CommandItem
                  key={product.id}
                  value={`${product.product_name} ${product.banks?.name || ''}`}
                  onSelect={() => handleSelect(() => navigate(`/savings/${product.id}`))}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <PiggyBank className="h-4 w-4" />
                    <div className="flex flex-col">
                      <span className="font-medium">{product.product_name}</span>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        {product.banks && <span>{product.banks.name}</span>}
                        {product.minimum_deposit && (
                          <span>Min: ৳{product.minimum_deposit.toLocaleString()}</span>
                        )}
                      </div>
                    </div>
                  </div>
                  {product.interest_rate && (
                    <Badge variant="secondary" className="ml-2">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      {product.interest_rate}%
                    </Badge>
                  )}
                </CommandItem>
              ))}
            </CommandGroup>
          )}

          {filteredLoans.length > 0 && (
            <CommandGroup heading={`Loan Products (${filteredLoans.length})`}>
              {filteredLoans.slice(0, 8).map((product) => (
                <CommandItem
                  key={product.id}
                  value={`${product.product_name} ${product.banks?.name || ''} ${product.loan_type || ''}`}
                  onSelect={() => handleSelect(() => navigate(`/loans/${product.id}`))}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4" />
                    <div className="flex flex-col">
                      <span className="font-medium">{product.product_name}</span>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        {product.banks && <span>{product.banks.name}</span>}
                        {product.loan_type && (
                          <Badge variant="outline" className="text-xs">
                            {product.loan_type}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  {product.interest_rate_min && (
                    <Badge variant="secondary" className="ml-2">
                      {product.interest_rate_min}%
                      {product.interest_rate_max && ` - ${product.interest_rate_max}%`}
                    </Badge>
                  )}
                </CommandItem>
              ))}
            </CommandGroup>
          )}
            </>
          )}
        </CommandList>
      </CommandDialog>
    </>
  );
}
