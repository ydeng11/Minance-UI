import {useMutation, useQueryClient} from "@tanstack/react-query";
import {createMinanceCategory, deleteMinanceCategory, linkCategories} from "@/services/apis/categoryMappingApis.tsx";
import {useCategoryStore} from "@/store/categoryStore.ts";
import {useCategoryGroupQuery} from "@/services/queries/useCategoryGroupQuery.tsx";
import {toast} from "@/hooks/use-toast.ts";


export const useCategoryGroupMutation = () => {
    const queryClient = useQueryClient();
    const {setMinanceCategories} = useCategoryStore();
    const {allMinanceCategories} = useCategoryGroupQuery();

    const {mutate: updateCategoryGroupMutation} = useMutation({
        mutationFn: linkCategories,
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['categoryGroups']});
            queryClient.invalidateQueries({queryKey: ['transactions']});
            toast({
                title: "Success",
                description: "Category created successfully",
            });
        },
        onError: (error) => {
            console.error("Update category group error:", error);
        }
    });

    const {mutate: createCategoryGroupMutation} = useMutation({
        mutationFn: createMinanceCategory,
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['unlinkedCategories']});
            queryClient.invalidateQueries({queryKey: ['allMinanceCategories']});
            queryClient.invalidateQueries({queryKey: ['transactions']});
            if (allMinanceCategories.data) {
                setMinanceCategories(allMinanceCategories.data);
            }
        },
        onError: (error) => {
            console.error("Update category group error:", error);
        }
    });

    const {mutate: deleteCategoryGroupMutation} = useMutation({
        mutationFn: deleteMinanceCategory,
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['linkedCategories']});
            queryClient.invalidateQueries({queryKey: ['allMinanceCategories']});
            queryClient.invalidateQueries({queryKey: ['transactions']});
            if (allMinanceCategories.data) {
                setMinanceCategories(allMinanceCategories.data);
            }
        },
        onError: (error) => {
            console.error("Delete category group error:", error);
        }
    });

    return {
        updateCategoryGroupMutation,
        deleteCategoryGroupMutation,
        createCategoryGroupMutation
    };
}; 