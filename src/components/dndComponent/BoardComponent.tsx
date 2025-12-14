import {useEffect, useMemo, useRef, useState} from "react";
import {createPortal} from "react-dom";
import {BoardColumn, BoardContainer, Column} from "./BoardColumn";
import {
    Announcements,
    DndContext,
    type DragEndEvent,
    type DragOverEvent,
    DragOverlay,
    type DragStartEvent,
    KeyboardSensor,
    MouseSensor,
    TouchSensor,
    UniqueIdentifier,
    useSensor,
    useSensors,
} from "@dnd-kit/core";
import {arrayMove, SortableContext} from "@dnd-kit/sortable";
import {type Task, TaskCard} from "./TaskCard";
import {hasDraggableData} from "./utils";
import {coordinateGetter} from "./multipleContainersKeyboardPreset";
import {AddCategoryDialog} from "./AddCategoryDialog";
import {useCategoryStore} from '@/store/categoryStore';
import {Button} from "@/components/ui/button";
import {Badge} from "@/components/ui/badge";
import {useCategoryGroupQuery} from "@/services/queries/useCategoryGroupQuery";
import {useCategoryGroupMutation} from "@/services/queries/useCategoryGroupMutation";
import {toast} from "@/hooks/use-toast";
import {
    buildAssignmentSnapshot,
    deriveCategoryMappingPayload,
    listUnmappedCategories,
    shouldEnableSaveButton,
    type AssignmentSnapshot,
} from "@/components/dndComponent/categoryBoardUtils";

const defaultCols = [
    {
        id: "originalCat" as const,
        title: "Original Cat",
    },
    {
        id: "minanceCat" as const,
        title: "Minance Cat",
    },
] satisfies Column[];

export type ColumnId = (typeof defaultCols)[number]["id"];

export function BoardComponent() {
    const [columns, setColumns] = useState<Column[]>(defaultCols);
    const [tasks, setTasks] = useState<Task[]>([]);
    const [initialTasks, setInitialTasks] = useState<Task[]>([]);
    const [initialSnapshot, setInitialSnapshot] = useState<AssignmentSnapshot>({});
    const [activeColumn, setActiveColumn] = useState<Column | null>(null);
    const [activeTask, setActiveTask] = useState<Task | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const pickedUpTaskColumn = useRef<ColumnId | null>(null);

    const {selectedCategory, setMinanceCategories, setSelectedCategory} = useCategoryStore();
    const {
        updateCategoryGroupMutation,
        deleteCategoryGroupMutation
    } = useCategoryGroupMutation();
    const {unlinkedCategories, linkedCategories, allMinanceCategories} = useCategoryGroupQuery(selectedCategory);

    const currentSnapshot = useMemo(() => buildAssignmentSnapshot(tasks), [tasks]);
    const unmappedCategories = useMemo(() => listUnmappedCategories(tasks), [tasks]);
    const canSave = Boolean(
        selectedCategory && shouldEnableSaveButton(initialSnapshot, currentSnapshot)
    );
    const canUndo = shouldEnableSaveButton(initialSnapshot, currentSnapshot);

    const sensors = useSensors(
        useSensor(MouseSensor),
        useSensor(TouchSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: coordinateGetter,
        })
    );

    // Load initial data
    useEffect(() => {
        if (allMinanceCategories.data) {
            setMinanceCategories(allMinanceCategories.data);
            // If no category is selected, select the first one
            if (!selectedCategory && allMinanceCategories.data.length > 0) {
                setSelectedCategory(allMinanceCategories.data[0].category);
            }
        }
    }, [allMinanceCategories.data, selectedCategory, setMinanceCategories, setSelectedCategory]);

    useEffect(() => {
        if (!unlinkedCategories.data || !linkedCategories.data) return;

        const unlinkedTasks = unlinkedCategories.data.map((cat) => ({
            id: cat.name,
            content: cat.name,
            columnId: "originalCat" as const,
        }));

        const linkedTasks = linkedCategories.data.map((cat) => ({
            id: cat.name,
            content: cat.name,
            columnId: "minanceCat" as const,
        }));

        const combined = [...unlinkedTasks, ...linkedTasks];
        setTasks(combined);
        setInitialTasks(combined);
        setInitialSnapshot(buildAssignmentSnapshot(combined));
    }, [unlinkedCategories.data, linkedCategories.data]);

    const handleSaveCategory = () => {
        if (!selectedCategory) {
            toast({
                title: "Error",
                description: "Please select a category first",
                variant: "destructive",
            });
            return;
        }

        const payload = deriveCategoryMappingPayload(tasks, selectedCategory);
        if (!payload) {
            toast({
                title: "No assignments",
                description: "Drag categories into the Minance column before saving.",
                variant: "destructive",
            });
            return;
        }

        updateCategoryGroupMutation(payload);
        setInitialTasks(tasks.map((task) => ({ ...task })));
        setInitialSnapshot(buildAssignmentSnapshot(tasks));
        toast({
            title: "Grouping saved",
            description: `${payload.listRawCategories.length} categories linked to ${selectedCategory}.`,
        });
    };


    const handleDeleteCategory = () => {
        if (!selectedCategory) {
            toast({
                title: "Error",
                description: "Please select a category first",
                variant: "destructive",
            });
            return;
        }
        deleteCategoryGroupMutation({
            MCategoryId: allMinanceCategories.data?.find(cat => cat.category === selectedCategory)?.MCategoryId || '',
            category: selectedCategory
        });
    }

    const handleResetAssignments = () => {
        setTasks(initialTasks.map((task) => ({ ...task })));
    };

    const handleQuickAssign = (task: Task) => {
        if (!selectedCategory) {
            toast({
                title: "Select a category",
                description: "Choose a Minance category before assigning raw categories.",
                variant: "destructive",
            });
            return;
        }
        setTasks((prev) =>
            prev.map((existing) =>
                existing.id === task.id ? { ...existing, columnId: "minanceCat" } : existing
            )
        );
    };

    function boardTitle(category: string) {


        const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
            const value = e.target.value;
            if (value === "add-new") {
                setIsDialogOpen(true);
            } else {
                setSelectedCategory(value);
            }
        };

        if (category === "originalCat") {
            return (
                <div className="flex justify-center mb-2 w-full max-w-md">
                    <h1 className="text-white text-xl w-full text-center p-2">Original Category</h1>
                </div>
            );
        } else {
            return (
                <>
                    <div className="flex justify-center mb-2 w-full max-w-md flex-col gap-1">
                        <label htmlFor="minance-category-select" className="sr-only">
                            Minance category
                        </label>
                        <select
                            id="minance-category-select"
                            className="border p-2 rounded bg-card text-gray-500 text-xl w-full text-center"
                            value={selectedCategory}
                            onChange={handleCategoryChange}
                            data-testid="minance-category-select"
                        >
                            <option value="" disabled>Minance Cat</option>
                            {allMinanceCategories.data?.map((cat) => (
                                <option key={cat.MCategoryId} value={cat.category} className="bg-gray-800 text-xl">
                                    {cat.category}
                                </option>
                            ))}
                            <option value="add-new" className="bg-gray-800 text-xl">
                                Add New
                            </option>
                        </select>
                    </div>

                    <AddCategoryDialog
                        open={isDialogOpen}
                        onOpenChange={setIsDialogOpen}
                    />
                </>
            );
        }
    }

    function getDraggingTaskData(taskId: UniqueIdentifier, columnId: ColumnId) {
        const tasksInColumn = tasks.filter((task) => task.columnId === columnId);
        const taskPosition = tasksInColumn.findIndex((task) => task.id === taskId);
        const column = columns.find((col) => col.id === columnId);
        return {
            tasksInColumn,
            taskPosition,
            column,
        };
    }

    const announcements: Announcements = {
        onDragStart({active}) {
            if (!hasDraggableData(active)) return;
            if (active.data.current?.type === "Column") {
                const startColumnIdx = columns.findIndex((col) => col.id === active.id);
                const startColumn = columns[startColumnIdx];
                return `Picked up Column ${startColumn?.title} at position: ${
                    startColumnIdx + 1
                } of ${columns.length}`;
            } else if (active.data.current?.type === "Task") {
                pickedUpTaskColumn.current = active.data.current.task.columnId;
                const {tasksInColumn, taskPosition, column} = getDraggingTaskData(
                    active.id,
                    pickedUpTaskColumn.current
                );
                return `Picked up Task ${
                    active.data.current.task.content
                } at position: ${taskPosition + 1} of ${
                    tasksInColumn.length
                } in column ${column?.title}`;
            }
        },
        onDragOver({active, over}) {
            if (!hasDraggableData(active) || !hasDraggableData(over)) return;

            if (
                active.data.current?.type === "Column" &&
                over.data.current?.type === "Column"
            ) {
                const overColumnIdx = columns.findIndex((col) => col.id === over.id);
                return `Column ${active.data.current.column.title} was moved over ${
                    over.data.current.column.title
                } at position ${overColumnIdx + 1} of ${columns.length}`;
            } else if (
                active.data.current?.type === "Task" &&
                over.data.current?.type === "Task"
            ) {
                const {tasksInColumn, taskPosition, column} = getDraggingTaskData(
                    over.id,
                    over.data.current.task.columnId
                );
                if (over.data.current.task.columnId !== pickedUpTaskColumn.current) {
                    return `Task ${
                        active.data.current.task.content
                    } was moved over column ${column?.title} in position ${
                        taskPosition + 1
                    } of ${tasksInColumn.length}`;
                }
                return `Task was moved over position ${taskPosition + 1} of ${
                    tasksInColumn.length
                } in column ${column?.title}`;
            }
        },
        onDragEnd({active, over}) {
            if (!hasDraggableData(active) || !hasDraggableData(over)) {
                pickedUpTaskColumn.current = null;
                return;
            }
            if (
                active.data.current?.type === "Column" &&
                over.data.current?.type === "Column"
            ) {
                const overColumnPosition = columns.findIndex((col) => col.id === over.id);

                return `Column ${
                    active.data.current.column.title
                } was dropped into position ${overColumnPosition + 1} of ${
                    columns.length
                }`;
            } else if (
                active.data.current?.type === "Task" &&
                over.data.current?.type === "Task"
            ) {
                const {tasksInColumn, taskPosition, column} = getDraggingTaskData(
                    over.id,
                    over.data.current.task.columnId
                );
                if (over.data.current.task.columnId !== pickedUpTaskColumn.current) {
                    return `Task was dropped into column ${column?.title} in position ${
                        taskPosition + 1
                    } of ${tasksInColumn.length}`;
                }
                return `Task was dropped into position ${taskPosition + 1} of ${
                    tasksInColumn.length
                } in column ${column?.title}`;
            }
            pickedUpTaskColumn.current = null;
        },
        onDragCancel({active}) {
            pickedUpTaskColumn.current = null;
            if (!hasDraggableData(active)) return;
            return `Dragging ${active.data.current?.type} cancelled.`;
        },
    };

    return (
        <DndContext
            accessibility={{
                announcements,
            }}
            sensors={sensors}
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
            onDragOver={onDragOver}
        >
            <div data-testid="category-board">
                <BoardContainer>
                <SortableContext items={columns}>
                    {columns.map((col) => (
                        <div key={col.id} className="flex flex-col">
            {boardTitle(col.id.toString())}
                            <BoardColumn
                                column={col}
                                tasks={tasks.filter((task) => task.columnId === col.id)}
                                    onAssignTask={col.id === "originalCat" ? handleQuickAssign : undefined}
                            />
                            {col.id === "minanceCat" ? (
                                <div className="flex gap-2 justify-center mt-4 mb-2">
                                    <Button
                                        onClick={handleSaveCategory}
                                        variant="secondary"
                                        className="w-24"
                                        data-testid="category-save-button"
                                        disabled={!canSave}
                                    >
                                        Save
                                    </Button>
                                    <Button
                                        onClick={handleResetAssignments}
                                        variant="outline"
                                        className="w-24"
                                        disabled={!canUndo}
                                    >
                                        Undo
                                    </Button>
                                    <Button
                                        onClick={handleDeleteCategory}
                                        variant="destructive"
                                        className="w-24"
                                        disabled={!selectedCategory}
                                    >
                                        Delete
                                    </Button>
                                </div>
                            ) : (
                                <div className="mt-4 mb-2 h-[36px]"/>
                            )}
                        </div>
                    ))}
                </SortableContext>
                </BoardContainer>
            </div>

            {unmappedCategories.length > 0 && (
                <div className="mt-4 text-center text-sm text-muted-foreground">
                    Unmapped categories:
                    <div className="mt-2 flex flex-wrap justify-center gap-2">
                        {unmappedCategories.map((category) => (
                            <Badge key={category} variant="outline">
                                {category}
                            </Badge>
                        ))}
                    </div>
                </div>
            )}

            {"document" in window &&
                createPortal(
                    <DragOverlay>
                        {activeColumn && (
                            <BoardColumn
                                isOverlay
                                column={activeColumn}
                                tasks={tasks.filter(
                                    (task) => task.columnId === activeColumn.id
                                )}
                            />
                        )}
                        {activeTask && <TaskCard task={activeTask} isOverlay/>}
                    </DragOverlay>,
                    document.body
                )}
        </DndContext>

    );

    function onDragStart(event: DragStartEvent) {
        if (!hasDraggableData(event.active)) return;
        const data = event.active.data.current;
        if (data?.type === "Column") {
            setActiveColumn(data.column);
            return;
        }

        if (data?.type === "Task") {
            setActiveTask(data.task);
            return;
        }
    }

    async function onDragEnd(event: DragEndEvent) {
        setActiveColumn(null);
        setActiveTask(null);

        const {active, over} = event;
        if (!over) return;

        const activeId = active.id;
        const overId = over.id;

        if (!hasDraggableData(active)) return;

        const activeData = active.data.current;

        if (activeId === overId) return;

        const isActiveAColumn = activeData?.type === "Column";
        if (isActiveAColumn) {
            setColumns((columns) => {
                const activeColumnIndex = columns.findIndex((col) => col.id === activeId);
                const overColumnIndex = columns.findIndex((col) => col.id === overId);
                return arrayMove(columns, activeColumnIndex, overColumnIndex);
            });
        }
    }

    function onDragOver(event: DragOverEvent) {
        const {active, over} = event;
        if (!over) return;

        const activeId = active.id;
        const overId = over.id;

        if (activeId === overId) return;

        if (!hasDraggableData(active) || !hasDraggableData(over)) return;

        const activeData = active.data.current;
        const overData = over.data.current;

        const isActiveATask = activeData?.type === "Task";
        const isOverATask = overData?.type === "Task";

        if (!isActiveATask) return;

        // Im dropping a Task over another Task
        if (isActiveATask && isOverATask) {
            setTasks((tasks) => {
                const activeIndex = tasks.findIndex((t) => t.id === activeId);
                const overIndex = tasks.findIndex((t) => t.id === overId);
                const activeTask = tasks[activeIndex];
                const overTask = tasks[overIndex];
                if (
                    activeTask &&
                    overTask &&
                    activeTask.columnId !== overTask.columnId
                ) {
                    activeTask.columnId = overTask.columnId;
                    return arrayMove(tasks, activeIndex, overIndex - 1);
                }

                return arrayMove(tasks, activeIndex, overIndex);
            });
        }

        const isOverAColumn = overData?.type === "Column";

        // Im dropping a Task over a column
        if (isActiveATask && isOverAColumn) {
            setTasks((tasks) => {
                const activeIndex = tasks.findIndex((t) => t.id === activeId);
                const activeTask = tasks[activeIndex];
                if (activeTask) {
                    activeTask.columnId = overId as ColumnId;
                    return arrayMove(tasks, activeIndex, activeIndex);
                }
                return tasks;
            });
        }
    }
}
