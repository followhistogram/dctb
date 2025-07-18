export function exportToCSV(data: any[], filename: string) {
  if (data.length === 0) {
    alert("Žádná data k exportu")
    return
  }

  const headers = Object.keys(data[0])
  const csvContent = [
    headers.join(","),
    ...data.map((row) =>
      headers
        .map((header) => {
          const value = row[header]
          // Escape quotes and wrap in quotes if contains comma or quote
          if (typeof value === "string" && (value.includes(",") || value.includes('"'))) {
            return `"${value.replace(/"/g, '""')}"`
          }
          return value
        })
        .join(","),
    ),
  ].join("\n")

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
  const link = document.createElement("a")

  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute("download", `${filename}.csv`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
}

export function exportRegistrationsToCSV(registrations: any[], eventTitle: string) {
  if (!registrations || registrations.length === 0) {
    alert("Žádné registrace k exportu")
    return
  }

  // Transform data for CSV export with Czech column names
  const csvData = registrations.map((reg) => ({
    Jméno: reg.name || "",
    Email: reg.email || "",
    Telefon: reg.phone || "",
    Věk: reg.age || "",
    "Typ registrace": reg.registration_type || "",
    "Datum registrace": reg.created_at ? new Date(reg.created_at).toLocaleDateString("cs-CZ") : "",
    Poznámky: reg.notes || "",
  }))

  const filename = `registrace-${eventTitle.toLowerCase().replace(/\s+/g, "-")}-${new Date().toISOString().split("T")[0]}`
  exportToCSV(csvData, filename)
}
