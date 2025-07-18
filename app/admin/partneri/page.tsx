"use client"

import {
  getAllPartners,
  getPartnerCategories,
  createPartner,
  updatePartner,
  deletePartner,
  togglePartnerStatus,
} from "@/lib/partners-actions"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Plus, Edit, Trash2, ExternalLink, Building, Users, Handshake, Globe } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

const categoryIcons = {
  educational: Users,
  municipal: Building,
  corporate: Handshake,
  media: Globe,
}

const categoryLabels = {
  educational: "Vzdělávací instituce",
  municipal: "Města a obce",
  corporate: "Firemní partneři",
  media: "Mediální partneři",
}

export default async function AdminPartnersPage() {
  const [partners, categories] = await Promise.all([getAllPartners(), getPartnerCategories()])

  const stats = {
    total: partners.length,
    active: partners.filter((p) => p.is_active).length,
    byCategory: categories.reduce(
      (acc, cat) => {
        acc[cat.id] = partners.filter((p) => p.category === cat.id).length
        return acc
      },
      {} as Record<string, number>,
    ),
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#111]">Správa partnerů</h1>
          <p className="text-gray-600 mt-2">Spravujte partnery a jejich kategorie</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-[#c13aab] hover:bg-[#c13aab]/90">
              <Plus className="w-4 h-4 mr-2" />
              Přidat partnera
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Přidat nového partnera</DialogTitle>
            </DialogHeader>
            <form action={createPartner} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Název partnera *</Label>
                  <Input id="name" name="name" required />
                </div>
                <div>
                  <Label htmlFor="category">Kategorie *</Label>
                  <Select name="category" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Vyberte kategorii" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="description">Popis</Label>
                <Textarea id="description" name="description" rows={3} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="website">Webová stránka</Label>
                  <Input id="website" name="website" type="url" placeholder="https://" />
                </div>
                <div>
                  <Label htmlFor="logo_url">URL loga</Label>
                  <Input id="logo_url" name="logo_url" type="url" placeholder="https://" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="display_order">Pořadí zobrazení</Label>
                  <Input id="display_order" name="display_order" type="number" defaultValue="0" />
                </div>
                <div className="flex items-center space-x-2 pt-6">
                  <Switch id="is_active" name="is_active" defaultChecked />
                  <Label htmlFor="is_active">Aktivní</Label>
                </div>
              </div>
              <div className="flex justify-end space-x-2 pt-4">
                <Button type="submit" className="bg-[#c13aab] hover:bg-[#c13aab]/90">
                  Vytvořit partnera
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold text-[#c13aab]">{stats.total}</div>
            <p className="text-sm text-gray-600">Celkem partnerů</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold text-[#00acb9]">{stats.active}</div>
            <p className="text-sm text-gray-600">Aktivních</p>
          </CardContent>
        </Card>
        {categories.slice(0, 2).map((category) => (
          <Card key={category.id}>
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-[#111]">{stats.byCategory[category.id] || 0}</div>
              <p className="text-sm text-gray-600">{category.title}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Partners Table */}
      <Card>
        <CardHeader>
          <CardTitle>Seznam partnerů</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Logo</TableHead>
                <TableHead>Název</TableHead>
                <TableHead>Kategorie</TableHead>
                <TableHead>Webová stránka</TableHead>
                <TableHead>Stav</TableHead>
                <TableHead>Akce</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {partners.map((partner) => {
                const CategoryIcon = categoryIcons[partner.category as keyof typeof categoryIcons]
                return (
                  <TableRow key={partner.id}>
                    <TableCell>
                      {partner.logo_url ? (
                        <Image
                          src={partner.logo_url || "/placeholder.svg"}
                          alt={`${partner.name} logo`}
                          width={60}
                          height={30}
                          className="object-contain"
                        />
                      ) : (
                        <div className="w-15 h-8 bg-gray-100 rounded flex items-center justify-center">
                          <Building className="w-4 h-4 text-gray-400" />
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{partner.name}</div>
                        {partner.description && (
                          <div className="text-sm text-gray-500 truncate max-w-xs">{partner.description}</div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="flex items-center gap-1 w-fit">
                        <CategoryIcon className="w-3 h-3" />
                        {categoryLabels[partner.category as keyof typeof categoryLabels]}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {partner.website ? (
                        <Link
                          href={partner.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#c13aab] hover:underline flex items-center gap-1"
                        >
                          <ExternalLink className="w-3 h-3" />
                          Odkaz
                        </Link>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <form action={togglePartnerStatus} className="inline">
                        <input type="hidden" name="id" value={partner.id} />
                        <input type="hidden" name="is_active" value={partner.is_active.toString()} />
                        <Button
                          type="submit"
                          variant="ghost"
                          size="sm"
                          className={partner.is_active ? "text-green-600" : "text-red-600"}
                        >
                          {partner.is_active ? "Aktivní" : "Neaktivní"}
                        </Button>
                      </form>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <Edit className="w-4 h-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>Upravit partnera</DialogTitle>
                            </DialogHeader>
                            <form action={updatePartner} className="space-y-4">
                              <input type="hidden" name="id" value={partner.id} />
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <Label htmlFor={`name-${partner.id}`}>Název partnera *</Label>
                                  <Input id={`name-${partner.id}`} name="name" defaultValue={partner.name} required />
                                </div>
                                <div>
                                  <Label htmlFor={`category-${partner.id}`}>Kategorie *</Label>
                                  <Select name="category" defaultValue={partner.category} required>
                                    <SelectTrigger>
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {categories.map((category) => (
                                        <SelectItem key={category.id} value={category.id}>
                                          {category.title}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>
                              <div>
                                <Label htmlFor={`description-${partner.id}`}>Popis</Label>
                                <Textarea
                                  id={`description-${partner.id}`}
                                  name="description"
                                  defaultValue={partner.description || ""}
                                  rows={3}
                                />
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <Label htmlFor={`website-${partner.id}`}>Webová stránka</Label>
                                  <Input
                                    id={`website-${partner.id}`}
                                    name="website"
                                    type="url"
                                    defaultValue={partner.website || ""}
                                  />
                                </div>
                                <div>
                                  <Label htmlFor={`logo_url-${partner.id}`}>URL loga</Label>
                                  <Input
                                    id={`logo_url-${partner.id}`}
                                    name="logo_url"
                                    type="url"
                                    defaultValue={partner.logo_url || ""}
                                  />
                                </div>
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <Label htmlFor={`display_order-${partner.id}`}>Pořadí zobrazení</Label>
                                  <Input
                                    id={`display_order-${partner.id}`}
                                    name="display_order"
                                    type="number"
                                    defaultValue={partner.display_order}
                                  />
                                </div>
                                <div className="flex items-center space-x-2 pt-6">
                                  <Switch
                                    id={`is_active-${partner.id}`}
                                    name="is_active"
                                    defaultChecked={partner.is_active}
                                  />
                                  <Label htmlFor={`is_active-${partner.id}`}>Aktivní</Label>
                                </div>
                              </div>
                              <div className="flex justify-end space-x-2 pt-4">
                                <Button type="submit" className="bg-[#c13aab] hover:bg-[#c13aab]/90">
                                  Uložit změny
                                </Button>
                              </div>
                            </form>
                          </DialogContent>
                        </Dialog>
                        <form action={deletePartner} className="inline">
                          <input type="hidden" name="id" value={partner.id} />
                          <Button
                            type="submit"
                            variant="ghost"
                            size="sm"
                            className="text-red-600 hover:text-red-700"
                            onClick={(e) => {
                              if (!confirm("Opravdu chcete smazat tohoto partnera?")) {
                                e.preventDefault()
                              }
                            }}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </form>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
