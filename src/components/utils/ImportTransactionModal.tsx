import React, {useState} from 'react';
import {Dialog, DialogContent, DialogOverlay, DialogTrigger} from '@/components/ui/dialog';
import {Button} from "@/components/ui/button.tsx";


const ImportTransactions: React.FC = () => {
    const [bank, setBank] = useState('');
    const [account, setAccount] = useState('');
    const [file, setFile] = useState<File | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFile(e.target.files[0]);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Handle the file upload logic here
        console.log({bank, account, file});
    };

    return (
        <Dialog>
            <DialogTrigger className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded">Import
                Transactions</DialogTrigger>
            <DialogOverlay className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <DialogContent className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md mx-auto">
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label className="block text-gray-700 mb-2" htmlFor="bank">Bank</label>
                            <input
                                type="text"
                                id="bank"
                                className="w-full px-3 py-2 border rounded"
                                value={bank}
                                onChange={(e) => setBank(e.target.value)}
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 mb-2" htmlFor="account">Account</label>
                            <input
                                type="text"
                                id="account"
                                className="w-full px-3 py-2 border rounded"
                                value={account}
                                onChange={(e) => setAccount(e.target.value)}
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 mb-2" htmlFor="file">CSV File</label>
                            <input
                                type="file"
                                id="file"
                                accept=".csv"
                                className="w-full"
                                onChange={handleFileChange}
                            />
                        </div>
                        <div className="flex justify-end">
                            <Button variant="secondary" className="mr-2">
                                Cancel
                            </Button>
                            <Button type="submit">
                                Submit
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </DialogOverlay>
        </Dialog>
    );
};

export default ImportTransactions;
