import BarChartComponent from "@/components/visualization/BarChartComponent.tsx";
import { MerchantAnalytics } from "@/components/visualization/MerchantAnalytics";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Visualization = () => {
    return (
        <div>
            <Tabs defaultValue="expenses" className="w-full">
                <TabsList className="mb-4">
                    <TabsTrigger value="expenses">Expense Analysis</TabsTrigger>
                    <TabsTrigger value="merchants">Merchant Analytics</TabsTrigger>
                </TabsList>
                <TabsContent value="expenses">
                    <BarChartComponent />
                </TabsContent>
                <TabsContent value="merchants">
                    <MerchantAnalytics />
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default Visualization;
