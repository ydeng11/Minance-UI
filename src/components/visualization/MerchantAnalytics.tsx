import React, { useMemo, useState } from 'react';
import { useTransactionStore } from '@/store/transactionStore';
import { useDateRangeQuery } from '@/services/queries/useDateRangeQuery';
import { useImportStore } from '@/store/importStore';
import { useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DonutChart } from "@/components/analytics/DonutChart";
import { BarChart } from "@/components/analytics/BarChart";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { SearchIcon, XCircleIcon, PlusCircleIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

type MerchantData = {
    merchant: string;
    totalSpent: number;
    transactionCount: number;
    averageAmount: number;
    lastTransaction: string;
    categories: Record<string, number>;
}

export const MerchantAnalytics: React.FC = () => {
    const { data: queryTransactions } = useDateRangeQuery();
    const { transactions } = useTransactionStore();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedMerchant, setSelectedMerchant] = useState<string | null>(null);
    const [excludedMerchants, setExcludedMerchants] = useState<string[]>([]);
    const [exclusionInput, setExclusionInput] = useState('');
    const [showOthersCategory, setShowOthersCategory] = useState(false);

    // Get the query client for manual refetching
    const queryClient = useQueryClient();

    // Get the last import time to trigger refreshes
    const lastImportTime = useImportStore(state => state.lastImportTime);

    // Effect to refetch data when new transactions are imported
    React.useEffect(() => {
        if (lastImportTime > 0) {
            queryClient.invalidateQueries({ queryKey: ['transactions'] });
        }
    }, [lastImportTime, queryClient]);

    // Use query transactions if available, otherwise fall back to store
    const currentTransactions = queryTransactions || transactions;

    // Process merchant analytics data
    const merchantData = useMemo(() => {
        if (!currentTransactions || currentTransactions.length === 0) {
            return [];
        }

        const merchantMap = new Map<string, MerchantData>();

        // Group transactions by merchant/description
        currentTransactions.forEach(transaction => {
            // Use description as merchant name
            const merchant = transaction.description;
            if (!merchant) return;

            // Skip excluded merchants
            if (excludedMerchants.includes(merchant)) return;

            // Skip transactions with no amount
            if (transaction.amount === 0) return;

            // Initialize merchant data if not exists
            if (!merchantMap.has(merchant)) {
                merchantMap.set(merchant, {
                    merchant,
                    totalSpent: 0,
                    transactionCount: 0,
                    averageAmount: 0,
                    lastTransaction: transaction.transactionDate,
                    categories: {}
                });
            }

            const data = merchantMap.get(merchant)!;

            // Increment merchant stats
            data.totalSpent += Math.abs(transaction.amount);
            data.transactionCount += 1;

            // Track spending by category
            const category = transaction.category || 'Uncategorized';
            data.categories[category] = (data.categories[category] || 0) + Math.abs(transaction.amount);

            // Update last transaction date if newer
            if (new Date(transaction.transactionDate) > new Date(data.lastTransaction)) {
                data.lastTransaction = transaction.transactionDate;
            }
        });

        // Calculate average amount and convert to array
        return Array.from(merchantMap.values())
            .map(merchant => ({
                ...merchant,
                averageAmount: merchant.totalSpent / merchant.transactionCount
            }))
            .sort((a, b) => b.totalSpent - a.totalSpent); // Sort by total spent
    }, [currentTransactions, excludedMerchants]);

    // Filter merchants by search term
    const filteredMerchants = useMemo(() => {
        if (!searchTerm.trim()) return merchantData;
        const lowerSearchTerm = searchTerm.toLowerCase().trim();
        return merchantData.filter(m =>
            m.merchant.toLowerCase().includes(lowerSearchTerm)
        );
    }, [merchantData, searchTerm]);

    // Get data for selected merchant
    const selectedMerchantData = useMemo(() => {
        if (!selectedMerchant) return null;
        return merchantData.find(m => m.merchant === selectedMerchant) || null;
    }, [merchantData, selectedMerchant]);

    // Top merchants for pie chart
    const topMerchants = useMemo(() => {
        const top = merchantData.slice(0, 10);
        const othersMerchants = merchantData.slice(10);
        const otherSum = othersMerchants.reduce((sum, m) => sum + m.totalSpent, 0);

        const result = top.map(m => ({
            merchant: m.merchant,
            amount: m.totalSpent
        }));

        if (otherSum > 0) {
            result.push({ merchant: 'Others', amount: otherSum });
        }

        return {
            chartData: result,
            othersMerchants: othersMerchants
        };
    }, [merchantData]);

    // Format currency values
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('us', {
            style: 'currency',
            currency: 'USD',
            maximumFractionDigits: 0,
        }).format(amount);
    };

    // Format date values
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString();
    };

    // Get category chart data for selected merchant
    const categoryChartData = useMemo(() => {
        if (!selectedMerchantData) return [];

        return Object.entries(selectedMerchantData.categories)
            .map(([category, amount]) => ({
                category,
                amount
            }))
            .sort((a, b) => b.amount - a.amount);
    }, [selectedMerchantData]);

    // Handle adding a merchant to exclusion list
    const handleAddExclusion = () => {
        if (!exclusionInput.trim() || excludedMerchants.includes(exclusionInput.trim())) return;
        setExcludedMerchants([...excludedMerchants, exclusionInput.trim()]);
        setExclusionInput('');
    };

    // Handle removing a merchant from exclusion list
    const handleRemoveExclusion = (merchant: string) => {
        setExcludedMerchants(excludedMerchants.filter(m => m !== merchant));
    };

    // Handle excluding the selected merchant
    const handleExcludeSelected = () => {
        if (selectedMerchant && !excludedMerchants.includes(selectedMerchant)) {
            setExcludedMerchants([...excludedMerchants, selectedMerchant]);
            setSelectedMerchant(null);
        }
    };

    // Filter to show only "Others" merchants
    const handleShowOthersCategory = () => {
        setShowOthersCategory(!showOthersCategory);
        if (!showOthersCategory) {
            // If turning on Others view, clear any existing search
            setSearchTerm('');
        }
    };

    // Determine which merchants to display in the table
    const displayedMerchants = useMemo(() => {
        if (showOthersCategory) {
            // When showing Others category, get merchants beyond top 10
            return merchantData.slice(10);
        }

        // Otherwise use the regular filtered merchants
        if (!searchTerm.trim()) return merchantData;
        const lowerSearchTerm = searchTerm.toLowerCase().trim();
        return merchantData.filter(m =>
            m.merchant.toLowerCase().includes(lowerSearchTerm)
        );
    }, [merchantData, searchTerm, showOthersCategory]);

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center gap-4">
                <div className="relative flex-1 max-w-sm">
                    <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                    <Input
                        placeholder="Search merchants..."
                        className="pl-8 text-gray-800"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        disabled={showOthersCategory}
                    />
                </div>

                <div className="flex flex-col sm:flex-row gap-2">
                    <div className="relative flex-1">
                        <Input
                            placeholder="Add merchant to exclude..."
                            className="text-gray-800"
                            value={exclusionInput}
                            onChange={(e) => setExclusionInput(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') handleAddExclusion();
                            }}
                        />
                    </div>
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={handleAddExclusion}
                        className="whitespace-nowrap text-gray-800 border-gray-300"
                    >
                        <PlusCircleIcon className="h-4 w-4 mr-1" />
                        Add Filter
                    </Button>

                    {selectedMerchant && (
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={handleExcludeSelected}
                            className="whitespace-nowrap text-gray-800 border-gray-300"
                        >
                            <XCircleIcon className="h-4 w-4 mr-1" />
                            Exclude Selected
                        </Button>
                    )}
                </div>
            </div>

            {excludedMerchants.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                    <span className="text-sm text-gray-500">Excluded merchants:</span>
                    {excludedMerchants.map(merchant => (
                        <Badge
                            key={merchant}
                            variant="outline"
                            className="flex items-center gap-1"
                        >
                            {merchant}
                            <XCircleIcon
                                className="h-3.5 w-3.5 cursor-pointer text-gray-500 hover:text-red-500"
                                onClick={() => handleRemoveExclusion(merchant)}
                            />
                        </Badge>
                    ))}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Merchant Spending Distribution */}
                <Card className="bg-gray-100 rounded-lg shadow-lg">
                    <CardHeader className="flex flex-col space-y-1">
                        <CardTitle className="text-lg font-medium">Top Merchants by Spending</CardTitle>
                        <div className="flex justify-between items-center">
                            <div className="text-xs text-gray-500">
                                Showing top 10 merchants. "Others" combines all remaining merchants.
                            </div>
                            <Button
                                size="sm"
                                variant={showOthersCategory ? "default" : "outline"}
                                onClick={handleShowOthersCategory}
                                className={`text-xs ${showOthersCategory ? "bg-blue-600" : "text-gray-800 border-gray-300"}`}
                            >
                                {showOthersCategory ? "Show All Merchants" : "Show 'Others' Merchants"}
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <DonutChart
                            data={topMerchants.chartData}
                            category="merchant"
                            value="amount"
                            valueFormatter={formatCurrency}
                            showTooltip={true}
                            showLabel={true}
                            className="h-60 w-full max-w-xs mx-auto"
                        />
                    </CardContent>
                </Card>

                {/* Merchant Details */}
                <Card className="bg-gray-100 rounded-lg shadow-lg">
                    <CardHeader>
                        <CardTitle className="text-lg font-medium">
                            {selectedMerchantData ? `${selectedMerchantData.merchant} Details` : 'Select a Merchant'}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {selectedMerchantData ? (
                            <div className="space-y-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-white p-3 rounded-md">
                                        <div className="text-sm text-gray-500">Total Spent</div>
                                        <div className="text-xl font-bold">{formatCurrency(selectedMerchantData.totalSpent)}</div>
                                    </div>
                                    <div className="bg-white p-3 rounded-md">
                                        <div className="text-sm text-gray-500">Transactions</div>
                                        <div className="text-xl font-bold">{selectedMerchantData.transactionCount}</div>
                                    </div>
                                    <div className="bg-white p-3 rounded-md">
                                        <div className="text-sm text-gray-500">Average</div>
                                        <div className="text-xl font-bold">{formatCurrency(selectedMerchantData.averageAmount)}</div>
                                    </div>
                                    <div className="bg-white p-3 rounded-md">
                                        <div className="text-sm text-gray-500">Last Transaction</div>
                                        <div className="text-xl font-bold">{formatDate(selectedMerchantData.lastTransaction)}</div>
                                    </div>
                                </div>

                                {/* Categories distribution */}
                                <div>
                                    <h3 className="text-sm font-medium mb-2">Category Breakdown</h3>
                                    <div className="bg-white p-3 rounded-md">
                                        <div className="space-y-2">
                                            {categoryChartData.map(cat => (
                                                <div key={cat.category} className="flex justify-between">
                                                    <div>{cat.category}</div>
                                                    <div className="font-medium">{formatCurrency(cat.amount)}</div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-8 text-gray-500">
                                Select a merchant from the table below to view details
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Merchant Table */}
            <Card className="bg-gray-100 rounded-lg shadow-lg">
                <CardHeader>
                    <CardTitle className="text-lg font-medium">
                        {showOthersCategory
                            ? "Merchants in 'Others' Category"
                            : "Merchant Spending Analysis"}
                    </CardTitle>
                    {showOthersCategory && (
                        <p className="text-sm text-gray-500">
                            Showing merchants not in the top 10 (combined as "Others" in the chart)
                        </p>
                    )}
                </CardHeader>
                <CardContent>
                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Merchant</TableHead>
                                    <TableHead className="text-right">Total Spent</TableHead>
                                    <TableHead className="text-right">Transactions</TableHead>
                                    <TableHead className="text-right">Average</TableHead>
                                    <TableHead>Last Transaction</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {displayedMerchants.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center py-4 text-gray-500">
                                            No merchants found
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    displayedMerchants.slice(0, 20).map((merchant) => (
                                        <TableRow
                                            key={merchant.merchant}
                                            className={`cursor-pointer hover:bg-gray-100 ${selectedMerchant === merchant.merchant ? 'bg-gray-100' : ''}`}
                                            onClick={() => setSelectedMerchant(merchant.merchant)}
                                        >
                                            <TableCell className="font-medium truncate max-w-[200px]">
                                                {merchant.merchant}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                {formatCurrency(merchant.totalSpent)}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                {merchant.transactionCount}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                {formatCurrency(merchant.averageAmount)}
                                            </TableCell>
                                            <TableCell>
                                                {formatDate(merchant.lastTransaction)}
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                    {displayedMerchants.length > 20 && (
                        <div className="text-center text-sm text-gray-500 mt-2">
                            Showing top 20 of {displayedMerchants.length} merchants
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};
