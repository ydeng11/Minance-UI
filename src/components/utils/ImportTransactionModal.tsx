import React, {useState} from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import {Button} from "@/components/ui/button";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {Switch} from "@/components/ui/switch";
import {uploadTransactions} from "@/services/apis/transactionsApi";
import {TransactionsUploadForm} from "@/services/apis/types";
import {toast} from "@/hooks/use-toast.ts";

const ImportTransactions: React.FC = () => {
    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        bank: '',
        account: '',
        file: null as File | null,
        useMinanceFormat: false,
    });

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFormData(prev => ({...prev, file: e.target.files![0]}));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.file || !formData.bank || !formData.account) {
            toast({
                title: "Error",
                description: "Please fill in all fields",
                variant: "destructive",
            });
            return;
        }

        setIsLoading(true);

        try {
            const uploadForm: TransactionsUploadForm = {
                bankName: formData.bank,
                accountName: formData.account,
                useMinanceFormat: formData.useMinanceFormat ? 'y' : 'n'
            };

            await uploadTransactions(formData.file, uploadForm);

            setOpen(false);
            setFormData({bank: '', account: '', file: null, useMinanceFormat: false});
            toast({
                title: "Success",
                description: "Transactions imported successfully",
            });
        } catch (error) {
            console.error('Error uploading file:', error);
            toast({
                title: "Error",
                description: error instanceof Error ? error.message : "Failed to import transactions",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button
                    variant="ghost"
                    size="lg"
                    className="h-10 bg-indigo-600 text-white rounded-md px-4 hover:bg-indigo-700"
                >
                    Import Transactions
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>Import transactions</DialogTitle>
                    <DialogDescription>
                        Import transactions in csv format
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="bank" className="text-right">Bank</Label>
                            <Input
                                id="bank"
                                className="col-span-3"
                                value={formData.bank}
                                onChange={(e) => setFormData(prev => ({...prev, bank: e.target.value}))}
                                required
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="account" className="text-right">Account</Label>
                            <Input
                                id="account"
                                className="col-span-3"
                                value={formData.account}
                                onChange={(e) => setFormData(prev => ({...prev, account: e.target.value}))}
                                required
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="csvFile" className="text-right">CSV File</Label>
                            <Input
                                id="csvFile"
                                type="file"
                                accept=".csv"
                                className="col-span-3"
                                onChange={handleFileChange}
                                required
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="useMinanceFormat" className="text-right">
                                Use Minance Format
                            </Label>
                            <div className="flex items-center space-x-2 col-span-3">
                                <Switch
                                    id="useMinanceFormat"
                                    checked={formData.useMinanceFormat}
                                    onCheckedChange={(checked) =>
                                        setFormData(prev => ({...prev, useMinanceFormat: checked}))
                                    }
                                />
                                <Label htmlFor="useMinanceFormat" className="text-sm text-muted-foreground">
                                    {formData.useMinanceFormat ? 'Yes' : 'No'}
                                </Label>
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? "Uploading..." : "Import"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default ImportTransactions;
