import React from "react";
import { describe, expect, it, beforeEach, afterEach, vi } from "vitest";
import { act, cleanup, render } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { useMerchantAnalytics } from "../useMerchantAnalytics";
import * as dateRangeQuery from "@/services/queries/useDateRangeQuery";
import * as transactionStore from "@/store/transactionStore";
import * as importStore from "@/store/importStore";

vi.mock("@/services/queries/useDateRangeQuery");
vi.mock("@/store/transactionStore");
vi.mock("@/store/importStore");

const buildTransactions = () => {
    return Array.from({ length: 12 }).map((_, index) => ({
        transactionId: index + 1,
        transactionDate: `2025-01-${String(index + 1).padStart(2, "0")}`,
        description: `Merchant ${index + 1}`,
        amount: -(index + 1) * 10,
        category: index % 2 === 0 ? "Dining" : "Travel",
        accountName: "Test Account",
        bankName: "Test Bank",
    }));
};

const duplicateTransactions = [
    {
        transactionId: 100,
        transactionDate: "2025-02-01",
        description: "Merchant 1",
        amount: -200,
        category: "Dining",
        accountName: "Test Account",
        bankName: "Test Bank",
    },
    {
        transactionId: 101,
        transactionDate: "2025-02-05",
        description: "Merchant 1",
        amount: -50,
        category: "Dining",
        accountName: "Test Account",
        bankName: "Test Bank",
    },
];

describe("useMerchantAnalytics", () => {
    let transactions = [...buildTransactions(), ...duplicateTransactions];
    let dateRangeSpy: ReturnType<typeof vi.spyOn>;
    let storeSpy: ReturnType<typeof vi.spyOn>;

    beforeEach(() => {
        transactions = [...buildTransactions(), ...duplicateTransactions];
        dateRangeSpy = vi.spyOn(dateRangeQuery, "useDateRangeQuery").mockReturnValue({
            data: transactions,
        } as any);

        storeSpy = vi.spyOn(transactionStore, "useTransactionStore").mockReturnValue({
            transactions,
            setTransactions: vi.fn(),
        });

        vi.spyOn(importStore, "useImportStore").mockReturnValue({
            lastImportTime: 0,
            triggerRefresh: vi.fn(),
        });
    });

    afterEach(() => {
        cleanup();
        vi.clearAllMocks();
    });

    const renderHook = () => {
        const queryClient = new QueryClient();
        const result: { current: ReturnType<typeof useMerchantAnalytics> | null } = {
            current: null,
        };

        const TestComponent = () => {
            result.current = useMerchantAnalytics();
            return null;
        };

        render(
            <QueryClientProvider client={queryClient}>
                <TestComponent />
            </QueryClientProvider>
        );

        if (!result.current) {
            throw new Error("Hook result is not initialized");
        }

        return result;
    };

    it("aggregates merchants by total spent and transaction count", () => {
        const hook = renderHook();
        const topMerchant = hook.current!.merchantData[0];

        expect(topMerchant.merchant).toBe("Merchant 12");
        expect(topMerchant.totalSpent).toBe(120);
        expect(topMerchant.transactionCount).toBe(1);

        const duplicateMerchant = hook.current!.merchantData.find(
            (merchant) => merchant.merchant === "Merchant 1"
        );
        expect(duplicateMerchant?.totalSpent).toBe(260);
        expect(duplicateMerchant?.transactionCount).toBe(3);
    });

    it("filters displayed merchants by search term", () => {
        const hook = renderHook();

        act(() => {
            hook.current!.setSearchTerm("merchant 5");
        });

        expect(hook.current!.displayedMerchants).toHaveLength(1);
        expect(hook.current!.displayedMerchants[0].merchant).toBe("Merchant 5");
    });

    it("excludes merchants via the exclusion list", () => {
        const hook = renderHook();

        act(() => {
            hook.current!.setExcludedMerchants(["Merchant 3"]);
        });

        expect(
            hook.current!.displayedMerchants.find(
                (merchant) => merchant.merchant === "Merchant 3"
            )
        ).toBeUndefined();
    });

    it("toggles the others category to only show merchants beyond the top 10", () => {
        const hook = renderHook();

        act(() => {
            hook.current!.handleShowOthersCategory();
        });

        expect(hook.current!.showOthersCategory).toBe(true);
        expect(hook.current!.displayedMerchants).toHaveLength(4);
        expect(hook.current!.displayedMerchants[0].merchant).toBe("Merchant 11");
    });

    it("returns detail data when a merchant is selected", () => {
        const hook = renderHook();

        act(() => {
            hook.current!.setSelectedMerchant("Merchant 2");
        });

        expect(hook.current!.selectedMerchantData?.merchant).toBe("Merchant 2");
        expect(hook.current!.selectedMerchantData?.totalSpent).toBe(20);
    });

    it("exposes the list of merchants that fall under the Others grouping", () => {
        const hook = renderHook();
        expect(hook.current!.othersMerchants).toHaveLength(4);
        expect(hook.current!.othersMerchants?.[0].merchant).toBe("Merchant 11");
    });

    it("resets search, selection, exclusions, and view state via resetFilters", () => {
        const hook = renderHook();

        act(() => {
            hook.current!.setSearchTerm("merchant");
            hook.current!.setExcludedMerchants(["Merchant 1"]);
            hook.current!.setSelectedMerchant("Merchant 2");
            hook.current!.handleShowOthersCategory();
            hook.current!.resetFilters();
        });

        expect(hook.current!.searchTerm).toBe("");
        expect(hook.current!.excludedMerchants).toHaveLength(0);
        expect(hook.current!.selectedMerchant).toBeNull();
        expect(hook.current!.showOthersCategory).toBe(false);
    });

    it("reports lack of transactions when the dataset is empty", () => {
        transactions = [];
        dateRangeSpy.mockReturnValue({ data: [] } as any);
        storeSpy.mockReturnValue({
            transactions,
            setTransactions: vi.fn(),
        } as any);

        const hook = renderHook();
        expect(hook.current!.hasTransactions).toBe(false);
        expect(hook.current!.emptyStateMessage).toContain("No transactions");
    });
});
