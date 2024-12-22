import React from 'react';
import {RadioGroup, RadioGroupItem} from "@/components/ui/radio-group.tsx";
import {Label} from "@/components/ui/label.tsx";
import {MultiSelect} from "@/components/ui/multi-select";

interface CategoryFilterProps {
    chartType: string;
    setChartType: (value: string) => void;
    categories: string[];
    selectedCategories: string[];
    setSelectedCategories: (categories: string[]) => void;
    hasSetInitialState: boolean;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
    chartType,
    setChartType,
    categories,
    selectedCategories,
    setSelectedCategories,
    hasSetInitialState
}) => {
    const categoryOptions = categories.map(category => ({
        label: category,
        value: category,
    }));

    return (
        <div className="flex items-center justify-between mb-4">
            <RadioGroup
                value={chartType}
                className="flex space-x-4"
                onValueChange={setChartType}
            >
                <div className="flex items-center space-x-2">
                    <RadioGroupItem value="percent" id="percent"/>
                    <Label htmlFor="percent" className="text-gray-900 font-medium">Use Percentage</Label>
                </div>
                <div className="flex items-center space-x-2">
                    <RadioGroupItem value="stacked" id="stacked"/>
                    <Label htmlFor="stacked" className="text-gray-900 font-medium">Use Stack</Label>
                </div>
            </RadioGroup>

            {hasSetInitialState && (
                <MultiSelect
                    options={categoryOptions}
                    onValueChange={setSelectedCategories}
                    defaultValue={selectedCategories}
                    placeholder="Select categories"
                    variant="inverted"
                    animation={2}
                    maxCount={5}
                />
            )}
        </div>
    );
};
