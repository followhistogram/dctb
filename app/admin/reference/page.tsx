"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Edit, Trash2, Star, Users, MessageSquare, Eye, Search, Filter } from "lucide-react"
import Image from "next/image"
import { toast } from "@/hooks/use-toast"
import {
  getAllTestimonials,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
  toggleTestimonialStatus,
  type Testimonial,
} from "@/lib/testimonials-actions"
import { MessageSquareQuoteIcon as MessageSquote } from "lucide-react"

export default function TestimonialsAdminPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null)

  useEffect(() => {
    loadTestimonials()
  }, [])

  const loadTestimonials = async () => {
    try {
      const data = await getAllTestimonials()
      setTestimonials(data)
    } catch (error) {
      toast({
        title: "Chyba",
        description: "Nepodařilo se načíst reference.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleCreateTestimonial = async (formData: FormData) => {
    const result = await createTestimonial(formData)
    if (result.success) {
      toast({
        title: "Úspěch",
        description: result.message,
      })
      setIsCreateDialogOpen(false)
      loadTestimonials()
    } else {
      toast({
        title: "Chyba",
        description: result.message,
        variant: "destructive",
      })
    }
  }

  const handleUpdateTestimonial = async (formData: FormData) => {
    if (!editingTestimonial) return

    const result = await updateTestimonial(editingTestimonial.id, formData)
    if (result.success) {
      toast({
        title: "Úspěch",
        description: result.message,
      })
      setEditingTestimonial(null)
      loadTestimonials()
    } else {
      toast({
        title: "Chyba",
        description: result.message,
        variant: "destructive",
      })
    }
  }

  const handleDeleteTestimonial = async (id: string) => {
    if (!confirm("Opravdu chcete smazat tuto referenci?")) return

    const result = await deleteTestimonial(id)
    if (result.success) {
      toast({
        title: "Úspěch",
        description: result.message,
      })
      loadTestimonials()
    } else {
      toast({
        title: "Chyba",
        description: result.message,
        variant: "destructive",
      })
    }
  }

  const handleToggleStatus = async (id: string, isActive: boolean) => {
    const result = await toggleTestimonialStatus(id, isActive)
    if (result.success) {
      toast({
        title: "Úspěch",
        description: result.message,
      })
      loadTestimonials()
    } else {
      toast({
        title: "Chyba",
        description: result.message,
        variant: "destructive",
      })
    }
  }

  const filteredTestimonials = testimonials.filter((testimonial) => {
    const matchesSearch =
      testimonial.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      testimonial.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
      testimonial.text.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && testimonial.is_active) ||
      (statusFilter === "inactive" && !testimonial.is_active)

    return matchesSearch && matchesStatus
  })

  const stats = {
    total: testimonials.length,
    active: testimonials.filter((r) => r.is_active).length,
    inactive: testimonials.filter((r) => !r.is_active).length,
  }

  const TestimonialForm = ({
    testimonial,
    onSubmit,
  }: { testimonial?: Testimonial; onSubmit: (formData: FormData) => void }) => (
    <form action={onSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Jméno *</Label>
          <Input id="name" name="name" defaultValue={testimonial?.name} required placeholder="Jan Novák" />
        </div>
        <div>
          <Label htmlFor="position">Pozice *</Label>
          <Input
            id="position"
            name="position"
            defaultValue={testimonial?.position}
            required
            placeholder="Ředitel, Název organizace"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="text">Text reference *</Label>
        <Textarea
          id="text"
          name="text"
          defaultValue={testimonial?.text}
          required
          rows={4}
          placeholder="Text reference..."
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="photo_url">URL fotografie</Label>
          <Input
            id="photo_url"
            name="photo_url"
            type="url"
            defaultValue={testimonial?.photo_url || ""}
            placeholder="https://example.com/photo.jpg"
          />
        </div>
        <div>
          <Label htmlFor="rating">Hodnocení</Label>
          <Select name="rating" defaultValue={testimonial?.rating?.toString() || "5"}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[1, 2, 3, 4, 5].map((rating) => (
                <SelectItem key={rating} value={rating.toString()}>
                  {rating} {rating === 1 ? "hvězda" : rating < 5 ? "hvězdy" : "hvězd"}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label htmlFor="display_order">Pořadí zobrazení</Label>
        <Input
          id="display_order"
          name="display_order"
          type="number"
          defaultValue={testimonial?.display_order || 0}
          min="0"
        />
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="submit">{testimonial ? "Aktualizovat" : "Vytvořit"}</Button>
      </div>
    </form>
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#c13aab] mx-auto mb-4"></div>
          <p className="text-gray-600">Načítám reference...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Správa referencí</h1>
          <p className="text-gray-600">Spravujte reference a ohlasy klientů</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Přidat referenci
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Přidat novou referenci</DialogTitle>
            </DialogHeader>
            <TestimonialForm onSubmit={handleCreateTestimonial} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <MessageSquote className="w-8 h-8 text-[#c13aab]" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Celkem referencí</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Eye className="w-8 h-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Aktivní</p>
                <p className="text-2xl font-bold text-gray-900">{stats.active}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Users className="w-8 h-8 text-gray-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Neaktivní</p>
                <p className="text-2xl font-bold text-gray-900">{stats.inactive}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Hledat v referencích..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <Select value={statusFilter} onValueChange={(value: any) => setStatusFilter(value)}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Všechny</SelectItem>
                  <SelectItem value="active">Aktivní</SelectItem>
                  <SelectItem value="inactive">Neaktivní</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Testimonials Table */}
      <Card>
        <CardHeader>
          <CardTitle>Reference ({filteredTestimonials.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Jméno</TableHead>
                <TableHead>Pozice</TableHead>
                <TableHead>Text</TableHead>
                <TableHead>Hodnocení</TableHead>
                <TableHead>Stav</TableHead>
                <TableHead>Akce</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTestimonials.map((testimonial) => (
                <TableRow key={testimonial.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      {testimonial.photo_url ? (
                        <Image
                          src={testimonial.photo_url || "/placeholder.svg"}
                          alt={testimonial.name}
                          width={40}
                          height={40}
                          className="rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                          <Users className="w-5 h-5 text-gray-400" />
                        </div>
                      )}
                      <div>
                        <p className="font-medium">{testimonial.name}</p>
                        <p className="text-sm text-gray-500">#{testimonial.display_order}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <p className="text-sm">{testimonial.position}</p>
                  </TableCell>
                  <TableCell>
                    <p className="text-sm line-clamp-2 max-w-xs">{testimonial.text}</p>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={testimonial.is_active}
                        onCheckedChange={(checked) => handleToggleStatus(testimonial.id, checked)}
                      />
                      <Badge variant={testimonial.is_active ? "default" : "secondary"}>
                        {testimonial.is_active ? "Aktivní" : "Neaktivní"}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button size="sm" variant="outline" onClick={() => setEditingTestimonial(testimonial)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleDeleteTestimonial(testimonial.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredTestimonials.length === 0 && (
            <div className="text-center py-8">
              <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">
                {searchTerm || statusFilter !== "all"
                  ? "Žádné reference nevyhovují zadaným filtrům."
                  : "Zatím nejsou žádné reference."}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={!!editingTestimonial} onOpenChange={() => setEditingTestimonial(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Upravit referenci</DialogTitle>
          </DialogHeader>
          {editingTestimonial && (
            <TestimonialForm testimonial={editingTestimonial} onSubmit={handleUpdateTestimonial} />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
