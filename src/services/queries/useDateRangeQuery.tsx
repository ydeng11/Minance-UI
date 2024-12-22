import { useQuery } from "@tanstack/react-query";
import { retrieveTransactionsByDateRange } from "@/services/apis/transactionsApi";
import { useDateRangeStore } from "@/store/dateRangeStore";

export const useDateRangeQuery = () => {
    const { startDate, endDate } = useDateRangeStore();

    return useQuery({
        queryKey: ['transactions'],
        queryFn: () => retrieveTransactionsByDateRange(startDate, endDate),
        enabled: !!startDate && !!endDate,
    });
}; 