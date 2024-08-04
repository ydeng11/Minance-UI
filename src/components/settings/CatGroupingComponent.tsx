import {ThemeProvider} from "@/components/dndComponent/theme-provider.tsx";
import {BoardComponent} from "@/components/dndComponent/BoardComponent.tsx";


function CatGroupingComponent() {
    return (
        <>
            <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
                <div className="min-h-screen flex flex-col">
                    <main className="mx-4 flex flex-col gap-6">
                        <div className="flex items-center justify-center h-full">
                            <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl text-center">
                                Cat Grouping
                            </h1>
                        </div>
                        <BoardComponent/>
                    </main>
                </div>
            </ThemeProvider>
        </>
    );
}

export default CatGroupingComponent;