export class OrderBy {
  static product(sortBy: string | null) {
    switch (sortBy) {
      case "new":
        return { createdAt: "desc" }
      case "old":
        return { createdAt: "asc" }
      case "a-z":
        return { title: "asc" }
      case "z-a":
        return { title: "desc" }
      case "price-high":
        return { price: "desc" }
      case "price-low":
        return { price: "asc" }
      case "stock-high":
        return { stock: "desc" }
      case "stock-low":
        return { stock: "asc" }
      default:
        return { createdAt: "desc" }
    }
  }

  static salesRecord(sortBy: string | null) {
    switch (sortBy) {
      case "price-low":
        return { price: "asc" }
      case "price-high":
        return { price: "desc" }
      case "quantity-low":
        return { quantity: "asc" }
      case "quantity-high":
        return { quantity: "desc" }
      case "date-desc":
        return { createdAt: "desc" }
      case "date-asc":
        return { createdAt: "asc" }
      default:
        return { createdAt: "desc" }
    }
  }
}
