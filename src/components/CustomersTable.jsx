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
import { updateCustomer } from '../store/slices/customersSlice'
import { updateInvoice } from '../store/slices/invoicesSlice'

const CustomersTable = () => {
  const dispatch = useDispatch()
  const customers = useSelector(state => state.customers.customers)
  const invoices = useSelector(state => state.invoices.invoices)
  const [editingCustomer, setEditingCustomer] = useState(null)
  const [open, setOpen] = useState(false)

  const formatNumber = (num) => {
    return Number(num).toFixed(2)
  }

  const handleEdit = (customer) => {
    setEditingCustomer({ ...customer })
    setOpen(true)
  }

  const handleSave = () => {
    dispatch(updateCustomer(editingCustomer))

    const relatedInvoiceId = editingCustomer.id.split('_')[1]
    const relatedInvoice = invoices.find(invoice => 
      invoice.id.includes(relatedInvoiceId)
    )

    if (relatedInvoice) {
      dispatch(updateInvoice({
        ...relatedInvoice,
        customerName: editingCustomer.name
      }))
    }

    setOpen(false)
    setEditingCustomer(null)
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Customer Name</TableHead>
            <TableHead>Phone Number</TableHead>
            <TableHead className="text-right">Total Purchase Amount</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {customers.map((customer) => (
            <TableRow key={customer.id}>
              <TableCell className="font-medium">{customer.name}</TableCell>
              <TableCell>{customer.phoneNumber}</TableCell>
              <TableCell className="text-right">
                {formatNumber(customer.totalPurchaseAmount)}
              </TableCell>
              <TableCell className="text-right">
                <Button size="icon" onClick={() => handleEdit(customer)}>
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
            <DialogTitle>Edit Customer</DialogTitle>
          </DialogHeader>
          
          {editingCustomer && (
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Customer Name</label>
                <Input
                  value={editingCustomer.name}
                  onChange={(e) => setEditingCustomer({
                    ...editingCustomer,
                    name: e.target.value
                  })}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Phone Number</label>
                <Input
                  value={editingCustomer.phoneNumber}
                  onChange={(e) => setEditingCustomer({
                    ...editingCustomer,
                    phoneNumber: e.target.value
                  })}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Total Purchase Amount</label>
                <Input
                  type="number"
                  step="0.01"
                  value={editingCustomer.totalPurchaseAmount}
                  onChange={(e) => setEditingCustomer({
                    ...editingCustomer,
                    totalPurchaseAmount: Number(e.target.value)
                  })}
                />
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

export default CustomersTable 