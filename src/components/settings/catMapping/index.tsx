// CatMapping.tsx
import React, {useState} from 'react';
import {DndProvider, useDrag, useDrop} from 'react-dnd';
import {HTML5Backend} from 'react-dnd-html5-backend';

const ItemTypes = {
    CATEGORY: 'category',
};

const DraggableItem: React.FC<{ name: string }> = ({name}) => {
    const [, drag] = useDrag({
        type: ItemTypes.CATEGORY,
        item: {name},
    });

    return (
        <div ref={drag} className="p-2 bg-gray-700 border border-gray-600 mb-2 rounded">
            {name}
        </div>
    );
};

const DroppableArea: React.FC<{ onDrop: (item: { name: string }) => void, children: React.ReactNode }> = ({
                                                                                                              onDrop,
                                                                                                              children
                                                                                                          }) => {
    const [, drop] = useDrop({
        accept: ItemTypes.CATEGORY,
        drop: (item: { name: string }) => onDrop(item),
    });

    return (
        <div ref={drop} className="p-4 bg-gray-800 border border-gray-700 rounded min-h-[200px]">
            {children}
        </div>
    );
};

const CatMapping: React.FC = () => {
    const [rawCategories, setRawCategories] = useState(['Shopping', 'Dinner']);
    const [mappedCategories, setMappedCategories] = useState<string[]>([]);
    const [selectedMinanceCat, setSelectedMinanceCat] = useState<string>('');

    const handleDropToRaw = (item: { name: string }) => {
        if (!rawCategories.includes(item.name)) {
            setRawCategories((prev) => [...prev, item.name]);
            setMappedCategories((prev) => prev.filter((cat) => cat !== item.name));
        }
    };

    const handleDropToMapped = (item: { name: string }) => {
        if (!mappedCategories.includes(item.name)) {
            setMappedCategories((prev) => [...prev, item.name]);
            setRawCategories((prev) => prev.filter((cat) => cat !== item.name));
        }
    };

    return (
        <DndProvider backend={HTML5Backend}>
            <div className="flex justify-between">
                <div className="w-1/3">
                    <h2 className="text-center mb-4 text-lg">Raw Cat</h2>
                    <DroppableArea onDrop={handleDropToRaw}>
                        {rawCategories.map((cat) => (
                            <DraggableItem key={cat} name={cat}/>
                        ))}
                    </DroppableArea>
                </div>
                <div className="w-1/3 flex flex-col items-center">
                    <h2 className="text-center mb-4 text-lg">Minance Cat</h2>
                    <select
                        value={selectedMinanceCat}
                        onChange={(e) => setSelectedMinanceCat(e.target.value)}
                        className="mb-4 p-2 border border-gray-600 bg-gray-700 rounded text-white"
                    >
                        <option value="" disabled>Select a Minance Cat</option>
                        <option value="Category 1">Category 1</option>
                        <option value="Category 2">Category 2</option>
                    </select>
                    <DroppableArea onDrop={handleDropToMapped}>
                        {mappedCategories.map((cat) => (
                            <div key={cat} className="p-2 bg-gray-700 border border-gray-600 mb-2 rounded">
                                {cat}
                            </div>
                        ))}
                    </DroppableArea>
                </div>
            </div>
        </DndProvider>
    );
};

export default CatMapping;
