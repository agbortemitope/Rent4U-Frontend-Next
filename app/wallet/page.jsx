"use client"

import { useState, useEffect } from "react"
import { useAuth } from "../contexts/AuthContext"
import { useRouter } from "next/navigation"
import { getWallet, createWallet, addTransaction, getUserTransactions } from "../lib/supabase"
import { Card, CardContent, CardHeader, CardTitle } from "../components/Card"
import Button from "../components/Button"
import Input from "../components/Input"
import { CreditCard, Plus, ArrowUpRight, ArrowDownLeft, Wallet as WalletIcon } from "lucide-react"
import { format } from "date-fns"
import toast from "react-hot-toast"

export default function Wallet() {
  const { user, userProfile } = useAuth()
  const router = useRouter()
  const [wallet, setWallet] = useState(null)
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [showFundModal, setShowFundModal] = useState(false)
  const [showWithdrawModal, setShowWithdrawModal] = useState(false)
  const [amount, setAmount] = useState("")
  const [processing, setProcessing] = useState(false)

  useEffect(() => {
    if (user) {
      fetchWalletData()
    }
  }, [user])

  const fetchWalletData = async () => {
    try {
      setLoading(true)
      
      // Get or create wallet
      let { data: walletData, error: walletError } = await getWallet(user.id)
      
      if (walletError && walletError.code === 'PGRST116') {
        // Wallet doesn't exist, create one
        const { data: newWallet, error: createError } = await createWallet(user.id)
        if (createError) throw createError
        walletData = newWallet
      } else if (walletError) {
        throw walletError
      }
      
      setWallet(walletData)

      // Get transactions
      const { data: transactionsData, error: transactionsError } = await getUserTransactions(user.id)
      if (transactionsError) throw transactionsError
      setTransactions(transactionsData || [])

    } catch (error) {
      console.error('Error fetching wallet data:', error)
      toast.error('Failed to load wallet information')
    } finally {
      setLoading(false)
    }
  }

  const handleFundWallet = async (e) => {
    e.preventDefault()
    
    const fundAmount = parseFloat(amount)
    if (!fundAmount || fundAmount <= 0) {
      toast.error('Please enter a valid amount')
      return
    }

    setProcessing(true)

    try {
      // In a real app, you would integrate with a payment gateway here
      // For now, we'll simulate a successful payment
      
      const transaction = {
        user_id: user.id,
        type: 'credit',
        amount: fundAmount,
        description: 'Wallet funding',
        status: 'completed',
        reference: `fund_${Date.now()}`
      }

      const { error } = await addTransaction(transaction)
      if (error) throw error

      toast.success(`₦${fundAmount.toLocaleString()} added to your wallet!`)
      setAmount("")
      setShowFundModal(false)
      fetchWalletData() // Refresh wallet data

    } catch (error) {
      console.error('Error funding wallet:', error)
      toast.error('Failed to fund wallet. Please try again.')
    } finally {
      setProcessing(false)
    }
  }

  const handleWithdraw = async (e) => {
    e.preventDefault()
    
    const withdrawAmount = parseFloat(amount)
    if (!withdrawAmount || withdrawAmount <= 0) {
      toast.error('Please enter a valid amount')
      return
    }

    if (withdrawAmount > wallet.balance) {
      toast.error('Insufficient balance')
      return
    }

    setProcessing(true)

    try {
      const transaction = {
        user_id: user.id,
        type: 'debit',
        amount: withdrawAmount,
        description: 'Wallet withdrawal',
        status: 'completed',
        reference: `withdraw_${Date.now()}`
      }

      const { error } = await addTransaction(transaction)
      if (error) throw error

      toast.success(`₦${withdrawAmount.toLocaleString()} withdrawn from your wallet!`)
      setAmount("")
      setShowWithdrawModal(false)
      fetchWalletData() // Refresh wallet data

    } catch (error) {
      console.error('Error withdrawing from wallet:', error)
      toast.error('Failed to withdraw. Please try again.')
    } finally {
      setProcessing(false)
    }
  }

  const getTransactionIcon = (type) => {
    return type === 'credit' ? (
      <ArrowDownLeft className="w-5 h-5 text-green-500" />
    ) : (
      <ArrowUpRight className="w-5 h-5 text-red-500" />
    )
  }

  const getTransactionColor = (type) => {
    return type === 'credit' ? 'text-green-600' : 'text-red-600'
  }

  if (!user) {
    router.push('/login')
    return null
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#3730E1]"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Wallet</h1>
          <p className="text-gray-600 mt-2">Manage your funds and transactions</p>
        </div>

        {/* Wallet Balance Card */}
        <Card className="mb-8">
          <CardContent className="p-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-[#3730E1] rounded-full flex items-center justify-center">
                  <WalletIcon className="w-8 h-8 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Current Balance</p>
                  <p className="text-4xl font-bold text-[#3730E1]">
                    ₦{wallet?.balance?.toLocaleString() || '0'}
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <Button
                  onClick={() => setShowFundModal(true)}
                  className="flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Funds
                </Button>
                <Button
                  onClick={() => setShowWithdrawModal(true)}
                  variant="secondary"
                  className="flex items-center gap-2"
                >
                  <ArrowUpRight className="w-4 h-4" />
                  Withdraw
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6 text-center">
              <CreditCard className="w-12 h-12 text-[#3730E1] mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Fund Wallet</h3>
              <p className="text-sm text-gray-600 mb-4">Add money to your wallet for bookings</p>
              <Button onClick={() => setShowFundModal(true)} className="w-full">
                Add Funds
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <ArrowUpRight className="w-12 h-12 text-[#3730E1] mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Withdraw</h3>
              <p className="text-sm text-gray-600 mb-4">Transfer money to your bank account</p>
              <Button onClick={() => setShowWithdrawModal(true)} variant="secondary" className="w-full">
                Withdraw
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <WalletIcon className="w-12 h-12 text-[#3730E1] mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Auto-Pay</h3>
              <p className="text-sm text-gray-600 mb-4">Set up automatic payments for rentals</p>
              <Button variant="secondary" className="w-full" disabled>
                Coming Soon
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Transaction History */}
        <Card>
          <CardHeader>
            <CardTitle>Transaction History</CardTitle>
          </CardHeader>
          <CardContent>
            {transactions.length === 0 ? (
              <div className="text-center py-8">
                <WalletIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No transactions yet</p>
                <p className="text-sm text-gray-500">Your transaction history will appear here</p>
              </div>
            ) : (
              <div className="space-y-4">
                {transactions.map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between py-4 border-b border-gray-100 last:border-b-0">
                    <div className="flex items-center gap-4">
                      {getTransactionIcon(transaction.type)}
                      <div>
                        <p className="font-medium text-gray-900">{transaction.description}</p>
                        <p className="text-sm text-gray-600">
                          {format(new Date(transaction.created_at), 'MMM dd, yyyy HH:mm')}
                        </p>
                        <p className="text-xs text-gray-500">Ref: {transaction.reference}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-semibold ${getTransactionColor(transaction.type)}`}>
                        {transaction.type === 'credit' ? '+' : '-'}₦{transaction.amount.toLocaleString()}
                      </p>
                      <p className={`text-sm capitalize ${
                        transaction.status === 'completed' ? 'text-green-600' : 
                        transaction.status === 'pending' ? 'text-yellow-600' : 'text-red-600'
                      }`}>
                        {transaction.status}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Fund Wallet Modal */}
      {showFundModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Add Funds to Wallet</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleFundWallet} className="space-y-4">
                <Input
                  label="Amount (₦)"
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Enter amount to add"
                  min="100"
                  step="100"
                  required
                />
                
                <div className="bg-blue-50 p-4 rounded-md">
                  <p className="text-sm text-blue-800">
                    <strong>Note:</strong> In a production app, this would integrate with a payment gateway like Stripe, Paystack, or Flutterwave.
                  </p>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    type="submit"
                    disabled={processing}
                    className="flex-1"
                  >
                    {processing ? 'Processing...' : 'Add Funds'}
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => {
                      setShowFundModal(false)
                      setAmount("")
                    }}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Withdraw Modal */}
      {showWithdrawModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Withdraw from Wallet</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleWithdraw} className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-md">
                  <p className="text-sm text-gray-600">
                    Available Balance: <span className="font-semibold text-[#3730E1]">₦{wallet?.balance?.toLocaleString()}</span>
                  </p>
                </div>

                <Input
                  label="Amount (₦)"
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Enter amount to withdraw"
                  min="100"
                  max={wallet?.balance || 0}
                  step="100"
                  required
                />

                <div className="bg-yellow-50 p-4 rounded-md">
                  <p className="text-sm text-yellow-800">
                    <strong>Note:</strong> Withdrawals are processed within 1-3 business days. A small processing fee may apply.
                  </p>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    type="submit"
                    disabled={processing || !wallet?.balance || parseFloat(amount) > wallet?.balance}
                    className="flex-1"
                  >
                    {processing ? 'Processing...' : 'Withdraw'}
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => {
                      setShowWithdrawModal(false)
                      setAmount("")
                    }}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}