import {Button} from "@/components/ui/button.tsx";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog.tsx";
import React, {useState} from "react";
import {Label} from "@/components/ui/label.tsx";
import {Input} from "@/components/ui/input.tsx";
import {toast} from "@/hooks/use-toast.ts";

export default function ImportBatchTxn() {
    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState({
        bank: "",
        account: "",
        file: null as File | null,
    });
    const [isLoading, setIsLoading] = useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFormData((prev) => ({...prev, file: e.target.files![0]}));
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
            const formPayload = new FormData();
            formPayload.append("file", formData.file);
            formPayload.append("bank", formData.bank);
            formPayload.append("account", formData.account);

            const response = await fetch("/api/transactions/import", {
                method: "POST",
                body: formPayload,
            });

            if (!response.ok) {
                throw new Error("Upload failed");
            }

            // Success handling
            setOpen(false); // Close dialog
            setFormData({bank: "", account: "", file: null}); // Reset form
            toast({
                title: "Success",
                description: "Transactions imported successfully",
                duration: 3000,
            });
        } catch (error) {
            console.error("Error uploading file:", error);
            toast({
                title: "Error",
                description: "Failed to import transactions. Please try again.",
                variant: "destructive",
                duration: 3000,
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancel = () => {
        setOpen(false); // Close the dialog
        setFormData({bank: "", account: "", file: null}); // Reset the form
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost" size="lg" className="text-lg">
                    Import transactions
                </Button>
            </DialogTrigger>
            <DialogContent
                className="sm:max-w-[600px]"
                aria-label="Import transactions dialog"
            >
                <DialogHeader>
                    <DialogTitle>Import transactions</DialogTitle>
                    <DialogDescription>
                        Import transactions in csv format
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="bank" className="text-right">
                                Bank
                            </Label>
                            <Input
                                id="bank"
                                className="col-span-3"
                                value={formData.bank}
                                onChange={(e) =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        bank: e.target.value,
                                    }))
                                }
                                required
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="account" className="text-right">
                                Account
                            </Label>
                            <Input
                                id="account"
                                className="col-span-3"
                                value={formData.account}
                                onChange={(e) =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        account: e.target.value,
                                    }))
                                }
                                required
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="csvFile" className="text-right">
                                Upload CSV File
                            </Label>
                            <Input
                                id="csvFile"
                                type="file"
                                accept=".csv"
                                className="col-span-3"
                                onChange={handleFileChange}
                                required
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" type="button" onClick={handleCancel}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? "Uploading..." : "Save"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
