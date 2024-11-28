import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Pencil } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { updateProduct } from '../store/slices/productsSlice'
import { updateInvoice } from '../store/slices/invoicesSlice'

const ProductsTable = () => {
  const dispatch = useDispatch()
  const products = useSelector(state => state.products.products)
  const invoices = useSelector(state => state.invoices.invoices)
  const [editingProduct, setEditingProduct] = useState(null)
  const [open, setOpen] = useState(false)

  const formatNumber = (num) => {
    return Number(num).toFixed(2)
  }

  const handleEdit = (product) => {
    setEditingProduct({ ...product })
    setOpen(true)
  }

  const handleSave = () => {
    dispatch(updateProduct(editingProduct))

    // Update related invoice if needed
    const relatedInvoiceId = editingProduct.id.split('_')[1]
    const relatedInvoice = invoices.find(invoice => 
      invoice.id.includes(relatedInvoiceId)
    )

    if (relatedInvoice && relatedInvoice.productName) {
      dispatch(updateInvoice({
        ...relatedInvoice,
        productName: editingProduct.name
      }))
    }

    setOpen(false)
    setEditingProduct(null)
  }

  const calculatePriceWithTax = (product) => {
    const subtotal = product.quantity * product.unitPrice
    const discountedPrice = subtotal - (product.discount || 0)
    return discountedPrice + product.tax
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead className="text-right">Quantity</TableHead>
            <TableHead className="text-right">Unit Price</TableHead>
            <TableHead className="text-right">Discount</TableHead>
            <TableHead className="text-right">Tax</TableHead>
            <TableHead className="text-right">Price with Tax</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id}>
              <TableCell>{product.name}</TableCell>
              <TableCell className="text-right">{formatNumber(product.quantity)}</TableCell>
              <TableCell className="text-right">{formatNumber(product.unitPrice)}</TableCell>
              <TableCell className="text-right">{formatNumber(product.discount || 0)}</TableCell>
              <TableCell className="text-right">{formatNumber(product.tax)}</TableCell>
              <TableCell className="text-right">{formatNumber(product.priceWithTax)}</TableCell>
              <TableCell className="text-right">
                <Button size="icon" onClick={() => handleEdit(product)}>
                  <Pencil className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
          </DialogHeader>
          
          {editingProduct && (
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Name</label>
                <Input
                  value={editingProduct.name}
                  onChange={(e) => setEditingProduct({
                    ...editingProduct,
                    name: e.target.value
                  })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Quantity</label>
                  <Input
                    type="number"
                    step="0.01"
                    value={editingProduct.quantity}
                    onChange={(e) => {
                      const quantity = Number(e.target.value)
                      const newProduct = {
                        ...editingProduct,
                        quantity,
                        priceWithTax: calculatePriceWithTax({
                          ...editingProduct,
                          quantity
                        })
                      }
                      setEditingProduct(newProduct)
                    }}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Unit Price</label>
                  <Input
                    type="number"
                    step="0.01"
                    value={editingProduct.unitPrice}
                    onChange={(e) => {
                      const unitPrice = Number(e.target.value)
                      const newProduct = {
                        ...editingProduct,
                        unitPrice,
                        priceWithTax: calculatePriceWithTax({
                          ...editingProduct,
                          unitPrice
                        })
                      }
                      setEditingProduct(newProduct)
                    }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Discount</label>
                  <Input
                    type="number"
                    step="0.01"
                    value={editingProduct.discount || 0}
                    onChange={(e) => {
                      const discount = Number(e.target.value)
                      const newProduct = {
                        ...editingProduct,
                        discount,
                        priceWithTax: calculatePriceWithTax({
                          ...editingProduct,
                          discount
                        })
                      }
                      setEditingProduct(newProduct)
                    }}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Tax</label>
                  <Input
                    type="number"
                    step="0.01"
                    value={editingProduct.tax}
                    onChange={(e) => {
                      const tax = Number(e.target.value)
                      const newProduct = {
                        ...editingProduct,
                        tax,
                        priceWithTax: calculatePriceWithTax({
                          ...editingProduct,
                          tax
                        })
                      }
                      setEditingProduct(newProduct)
                    }}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-4">
                <Button variant="outline" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSave}>
                  Save Changes
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}

export default ProductsTable 