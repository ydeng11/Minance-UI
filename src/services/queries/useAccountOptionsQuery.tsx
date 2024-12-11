import { useQuery } from "@tanstack/react-query";
import { fetchSupportedBanks, fetchSupportedAccountTypes } from "@/services/apis/accountApis";

export const useAccountOptionsQuery = () => {
    const supportedBanks = useQuery({
        queryKey: ['supportedBanks'],
        queryFn: fetchSupportedBanks,
    });

    const supportedAccountTypes = useQuery({
        queryKey: ['supportedAccountTypes'],
        queryFn: fetchSupportedAccountTypes,
    });

    return {
        supportedBanks,
        supportedAccountTypes,
        isLoading: supportedBanks.isLoading || supportedAccountTypes.isLoading,
        isError: supportedBanks.isError || supportedAccountTypes.isError,
    };
}; 