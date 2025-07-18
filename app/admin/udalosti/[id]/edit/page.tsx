import { notFound } from "next/navigation"
import { getEventById, getRegistrationsForEvent } from "@/lib/events-actions"
import EventEditForm from "@/components/admin/event-edit-form"

export default async function EditEventPage({ params }: { params: { id: string } }) {
  const event = await getEventById(params.id)

  if (!event) {
    notFound()
  }

  const registrations = await getRegistrationsForEvent(params.id)

  return (
    <div className="space-y-6">
      <EventEditForm event={event} registrations={registrations} />
    </div>
  )
}
