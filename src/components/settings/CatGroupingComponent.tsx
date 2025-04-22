import {BoardComponent} from "@/components/dndComponent/BoardComponent.tsx";

function CatGroupingComponent() {
    return (
        <>
            <div className="min-h-screen flex flex-col">
                <main className="mx-4 flex flex-col gap-6">
                    <div className="flex items-center justify-center h-full">
                        <h1 className="scroll-m-20 text-4xl text-gray-500 font-extrabold tracking-tight lg:text-5xl text-center">
                            Cat Grouping
                        </h1>
                    </div>
                    <BoardComponent/>
                </main>
            </div>
        </>
    );
}

export default CatGroupingComponent;