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
//   DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { updateInvoice } from '../store/slices/invoicesSlice'

const InvoicesTable = () => {
  const dispatch = useDispatch()
  const invoices = useSelector(state => state.invoices.invoices)
  const products = useSelector(state => state.products.products)
  const [editingInvoice, setEditingInvoice] = useState(null)
  const [open, setOpen] = useState(false)

  const formatNumber = (num) => {
    return Number(num).toFixed(2)
  }

  const calculateTotalCharges = (charges) => {
    if (!charges) return 0
    const { makingCharges = 0, debitCardCharges = 0, shippingCharges = 0, otherCharges = 0 } = charges
    return formatNumber(
      Number(makingCharges) + 
      Number(debitCardCharges) + 
      Number(shippingCharges) + 
      Number(otherCharges)
    )
  }

  const getProductCount = (invoiceId) => {
    return products.filter(product => product.id.includes(invoiceId.split('_')[1])).length
  }

  const handleEdit = (invoice) => {
    setEditingInvoice({ ...invoice })
    setOpen(true)
  }

  const handleSave = () => {
    dispatch(updateInvoice(editingInvoice))
    setOpen(false)
    setEditingInvoice(null)
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Serial Number</TableHead>
            <TableHead>Customer Name</TableHead>
            <TableHead>Product Types</TableHead>
            <TableHead className="text-right">Quantity</TableHead>
            <TableHead className="text-right">Tax</TableHead>
            <TableHead className="text-right">Additional Charges</TableHead>
            <TableHead className="text-right">Total Amount</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invoices.map((invoice) => (
            <TableRow key={invoice.id}>
              <TableCell>{invoice.serialNumber}</TableCell>
              <TableCell>{invoice.customerName}</TableCell>
              <TableCell>{getProductCount(invoice.id)}</TableCell>
              <TableCell className="text-right">{formatNumber(invoice.quantity)}</TableCell>
              <TableCell className="text-right">{formatNumber(invoice.tax)}</TableCell>
              <TableCell className="text-right">{calculateTotalCharges(invoice.additionalCharges)}</TableCell>
              <TableCell className="text-right">{formatNumber(invoice.totalAmount)}</TableCell>
              <TableCell>{invoice.date}</TableCell>
              <TableCell className="text-right">
                <Button  
                  size="icon"
                  className="hover:bg-primary/10 hover:text-primary"
                  onClick={() => handleEdit(invoice)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Invoice</DialogTitle>
          </DialogHeader>
          
          {editingInvoice && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Serial Number</label>
                  <Input
                    value={editingInvoice.serialNumber}
                    onChange={(e) => setEditingInvoice({
                      ...editingInvoice,
                      serialNumber: e.target.value
                    })}
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Customer Name</label>
                  <Input
                    value={editingInvoice.customerName}
                    onChange={(e) => setEditingInvoice({
                      ...editingInvoice,
                      customerName: e.target.value
                    })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Date</label>
                  <Input
                    type="date"
                    value={editingInvoice.date}
                    onChange={(e) => setEditingInvoice({
                      ...editingInvoice,
                      date: e.target.value
                    })}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Tax Amount</label>
                  <Input
                    type="number"
                    step="0.01"
                    value={editingInvoice.tax}
                    onChange={(e) => setEditingInvoice({
                      ...editingInvoice,
                      tax: Number(e.target.value)
                    })}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-medium">Additional Charges</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Making Charges</label>
                    <Input
                      type="number"
                      step="0.01"
                      value={editingInvoice.additionalCharges?.makingCharges || 0}
                      onChange={(e) => setEditingInvoice({
                        ...editingInvoice,
                        additionalCharges: {
                          ...editingInvoice.additionalCharges,
                          makingCharges: Number(e.target.value)
                        }
                      })}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Debit Card Charges</label>
                    <Input
                      type="number"
                      step="0.01"
                      value={editingInvoice.additionalCharges?.debitCardCharges || 0}
                      onChange={(e) => setEditingInvoice({
                        ...editingInvoice,
                        additionalCharges: {
                          ...editingInvoice.additionalCharges,
                          debitCardCharges: Number(e.target.value)
                        }
                      })}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Shipping Charges</label>
                    <Input
                      type="number"
                      step="0.01"
                      value={editingInvoice.additionalCharges?.shippingCharges || 0}
                      onChange={(e) => setEditingInvoice({
                        ...editingInvoice,
                        additionalCharges: {
                          ...editingInvoice.additionalCharges,
                          shippingCharges: Number(e.target.value)
                        }
                      })}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Other Charges</label>
                    <Input
                      type="number"
                      step="0.01"
                      value={editingInvoice.additionalCharges?.otherCharges || 0}
                      onChange={(e) => setEditingInvoice({
                        ...editingInvoice,
                        additionalCharges: {
                          ...editingInvoice.additionalCharges,
                          otherCharges: Number(e.target.value)
                        }
                      })}
                    />
                  </div>
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

export default InvoicesTable 