// import {v4 as uuidv4} from 'uuid';
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
// import { Input } from "@/components/ui/input.tsx";
// import { Label } from "@/components/ui/label.tsx";
// import { Ttodo } from "@/components/types";
import {useState} from "react";
import {Label} from "@/components/ui/label.tsx";
import {Input} from "@/components/ui/input.tsx";
// import useStore from "@/components/stores/todoStore";
// import {useTodoMutations} from "@/components/hooks/useTodoMutations.tsx";

// type AddTodoRefs = {
//     content: React.RefObject<HTMLInputElement>;
//     category: React.RefObject<HTMLInputElement>;
//     hashTag: React.RefObject<HTMLInputElement>;
// };

// function submit(addTodoRefs: AddTodoRefs, addTodoMutation: (todo: Ttodo) => void, incrementCount: () => void, closeDialog: () => void) {
//     const hashTagArray = (addTodoRefs.hashTag.current?.value ?? '').split(',').map(tag => tag.trim().toLowerCase());
//     const newTodo: Ttodo = {
//         id: uuidv4(),
//         content: addTodoRefs.content.current?.value ?? '',
//         category: addTodoRefs.category.current?.value.toLowerCase() ?? '',
//         hashtags: hashTagArray,
//         isDone: 0,
//         createdAt: new Date(),
//         isDeleted: 0,
//     };
//     incrementCount();
//     addTodoMutation(newTodo);
//     closeDialog();
// }

export default function ImportBatchTxn() {
    // const {incrementCount} = useStore();
    // const contentRef = useRef<HTMLInputElement>(null);
    // const categoryRef = useRef<HTMLInputElement>(null);
    // const hashTagRef = useRef<HTMLInputElement>(null);
    const [open, setOpen] = useState(false);
    // const {addTodoMutation} = useTodoMutations();
    // const closeDialog = () => {
    //     setOpen(false);
    // };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost" size="lg" className="text-lg">Import transactions</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>Import transactions</DialogTitle>
                    <DialogDescription>
                        Import transactions in csv format
                    </DialogDescription>
                </DialogHeader>
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        // submit({
                        //     content: contentRef,
                        //     category: categoryRef,
                        //     hashTag: hashTagRef
                        // }, addTodoMutation, incrementCount, closeDialog);
                    }}
                >
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="bank" className="text-right">
                                Bank
                            </Label>
                            <Input
                                id="bank"
                                className="col-span-3"
                                // ref={contentRef}
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="account" className="text-right">
                                Account
                            </Label>
                            <Input
                                id="account"
                                className="col-span-3"
                                // ref={categoryRef}
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
                                // Handle file upload logic here
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit">Save</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}