import type {UniqueIdentifier} from "@dnd-kit/core";
import {useSortable} from "@dnd-kit/sortable";
import {CSS} from "@dnd-kit/utilities";
import {Card, CardHeader} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {cva} from "class-variance-authority";
import {GripVertical} from "lucide-react";
import {Badge} from "@/components/ui/badge.tsx";
import {ColumnId} from "@/components/dndComponent/BoardComponent.tsx";

export interface Task {
    id: UniqueIdentifier;
    columnId: ColumnId;
    content: string;
}

interface TaskCardProps {
    task: Task;
    isOverlay?: boolean;
    onAssign?: (task: Task) => void;
}

export type TaskType = "Task";

export interface TaskDragData {
    type: TaskType;
    task: Task;
}

const slugify = (value: UniqueIdentifier) =>
    String(value).toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");

export function TaskCard({task, isOverlay, onAssign}: TaskCardProps) {
    const {
        setNodeRef,
        attributes,
        listeners,
        transform,
        transition,
        isDragging,
    } = useSortable({
        id: task.id,
        data: {
            type: "Task",
            task,
        } satisfies TaskDragData,
        attributes: {
            roleDescription: "Task",
        },
    });

    const style = {
        transition,
        transform: CSS.Translate.toString(transform),
    };

    const variants = cva("", {
        variants: {
            dragging: {
                over: "ring-2 opacity-30",
                overlay: "ring-2 ring-primary",
            },
        },
    });

    const slug = slugify(task.id);
    const testId =
        task.columnId === "originalCat" ? `raw-category-${slug}` : `linked-category-${slug}`;

    return (
        <Card
            ref={setNodeRef}
            style={style}
            data-testid={testId}
            data-category-name={task.content}
            className={variants({
                dragging: isOverlay ? "overlay" : isDragging ? "over" : undefined,
            })}
        >
            <CardHeader className="px-3 py-3 flex flex-row items-center border-b-2 border-secondary relative">
                <Button
                    variant={"ghost"}
                    {...attributes}
                    {...listeners}
                    className="p-1 text-secondary-foreground/50 -ml-2 h-auto cursor-grab"
                >
                    <span className="sr-only">Move category</span>
                    <GripVertical/>
                </Button>
                <Badge variant={"outline"} className="ml-2 font-semibold">
                    {task.id}
                </Badge>
                {onAssign && (
                    <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        className="ml-auto text-xs"
                        data-testid={`move-category-${slug}`}
                        onClick={() => onAssign(task)}
                    >
                        Move
                    </Button>
                )}
            </CardHeader>

        </Card>
    );
}
