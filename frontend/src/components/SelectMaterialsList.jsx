import React from 'react'
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  SortableContext,
  arrayMove,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

const SortableItem = ({ id, name }) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    padding: '8px',
    marginBottom: '6px',
    background: '#f7f7f7',
    borderRadius: '6px',
    cursor: 'grab',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  }

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {name}
    </div>
  )
}

const SelectedMaterialsList = ({ selectedMaterials, setSelectedMaterials }) => {
  const sensors = useSensors(useSensor(PointerSensor))

  const handleDragEnd = (event) => {
    const { active, over } = event
    if (!over || active.id === over.id) return

    const oldIndex = selectedMaterials.findIndex((m) => m.id === active.id)
    const newIndex = selectedMaterials.findIndex((m) => m.id === over.id)

    setSelectedMaterials(arrayMove(selectedMaterials, oldIndex, newIndex))
  }

  return (
    <div className="mt-6">
      <h3 className="font-medium mb-2">Valitut materiaalit</h3>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={selectedMaterials}
          strategy={verticalListSortingStrategy}
        >
          {selectedMaterials.map((m) => (
            <SortableItem key={m.id} id={m.id} name={m.name} />
          ))}
        </SortableContext>
      </DndContext>
    </div>
  )
}

export default SelectedMaterialsList
