import React, { useState, useEffect } from 'react';

interface Transaction {
    _id: string;
    referenceId: string;
    type: 'deposit' | 'withdraw' | 'transfer';
    amount: number;
    recipientEmail?: string | null;
    status: string;
}

const PaymentDashboard: React.FC = () => {
    const [amount, setAmount] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [history, setHistory] = useState<Transaction[]>([]);
    const [balance, setBalance] = useState<number>(5000); // Initial Mock Balance
    const [message, setMessage] = useState<string>('');

    // Helper function to extract auth configurations dynamically
    const getAuthHeaders = () => {
        const token = localStorage.getItem('business_nexus_token') || localStorage.getItem('token');
        return {
            'Content-Type': 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        };
    };

    // Backend se Transaction History load karne ka function (Dynamic URL Routing)
    const fetchHistory = async () => {
        try {
            const res = await fetch('/api/payments/history', {
                method: 'GET',
                headers: getAuthHeaders()
            });
            
            // Auto logout check bypass logic if session fails
            if (res.status === 401 || res.status === 403) {
                 console.warn("Session unverified for payment vault data stream mapping");
                 return;
            }

            const data = await res.json();
            if (data.success) {
                setHistory(data.history);
            }
        } catch (error) {
            console.error("Error loading transaction history:", error);
        }
    };

    useEffect(() => {
        fetchHistory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Deposit handler
    const handleDeposit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!amount || parseFloat(amount) <= 0) return alert("Please enter a valid amount.");

        try {
            const res = await fetch('/api/payments/deposit', {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify({ amount })
            });
            const data = await res.json();
            if (data.success) {
                setBalance(prev => prev + parseFloat(amount));
                setMessage(`🎉 Success: $${amount} has been successfully deposited!`);
                setAmount('');
                fetchHistory(); // Table refresh
            }
        } catch (error) {
            console.error("Deposit catch error:", error);
            setMessage("❌ Deposit processing failed!");
        }
    };

    // Transfer handler
    const handleTransfer = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!amount || !email) return alert("Please fill in all required fields.");
        if (parseFloat(amount) > balance) return alert("Insufficient wallet balance for this transaction!");

        try {
            const res = await fetch('/api/payments/transfer', {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify({ recipientEmail: email, amount })
            });
            const data = await res.json();
            if (data.success) {
                setBalance(prev => prev - parseFloat(amount));
                setMessage(`🚀 Success: $${amount} successfully transferred to ${email}!`);
                setAmount('');
                setEmail('');
                fetchHistory();
            }
        } catch (error) {
            console.error("Transfer catch error:", error);
            setMessage("❌ Transaction transfer failed!");
        }
    };

    return (
        <div className="p-6 bg-gray-950 min-h-screen text-white rounded-xl">
            <h1 className="text-3xl font-bold border-b border-gray-800 pb-3 mb-6 text-indigo-400">
                💳 Nexus Wallet & Payment Simulation
            </h1>

            {/* Top Balance Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 rounded-xl shadow-lg">
                    <p className="text-sm uppercase tracking-wider text-indigo-200">Current Balance</p>
                    <h2 className="text-4xl font-extrabold mt-1">${balance.toFixed(2)}</h2>
                </div>
                {message && (
                    <div className="bg-gray-900 border-l-4 border-emerald-500 p-6 rounded-xl flex items-center">
                        <p className="text-lg font-medium text-emerald-400">{message}</p>
                    </div>
                )}
            </div>

            {/* Inputs Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                {/* Deposit Form */}
                <div className="bg-gray-900 p-6 rounded-xl border border-gray-800">
                    <h3 className="text-xl font-semibold mb-4 text-indigo-300">Quick Deposit (Stripe Simulation)</h3>
                    <form onSubmit={handleDeposit} className="space-y-4">
                        <div>
                            <label className="block text-sm text-gray-400 mb-1">Amount ($)</label>
                            <input 
                                type="number" 
                                value={amount} 
                                onChange={(e) => setAmount(e.target.value)}
                                className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                                placeholder="e.g. 100"
                            />
                        </div>
                        <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2 rounded font-semibold transition">
                            Deposit Funds
                        </button>
                    </form>
                </div>

                {/* Transfer Form */}
                <div className="bg-gray-900 p-6 rounded-xl border border-gray-800">
                    <h3 className="text-xl font-semibold mb-4 text-purple-300">Wallet Transfer</h3>
                    <form onSubmit={handleTransfer} className="space-y-4">
                        <div>
                            <label className="block text-sm text-gray-400 mb-1">Recipient Email</label>
                            <input 
                                type="email" 
                                value={email} 
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white focus:outline-none focus:border-purple-500"
                                placeholder="entrepreneur@nexus.com"
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-400 mb-1">Amount ($)</label>
                            <input 
                                type="number" 
                                value={amount} 
                                onChange={(e) => setAmount(e.target.value)}
                                className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white focus:outline-none focus:border-purple-500"
                                placeholder="e.g. 50"
                            />
                        </div>
                        <button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded font-semibold transition">
                            Transfer Money
                        </button>
                    </form>
                </div>
            </div>

            {/* History Grid Table */}
            <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
                <h3 className="text-xl font-semibold p-5 border-b border-gray-800 text-gray-300">Transaction History</h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-800 text-gray-400 text-sm uppercase">
                                <th className="p-4">Reference ID</th>
                                <th className="p-4">Type</th>
                                <th className="p-4">Amount</th>
                                <th className="p-4">Detail</th>
                                <th className="p-4">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-800">
                            {history.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="p-4 text-center text-gray-500">No transactions recorded yet.</td>
                                </tr>
                            ) : (
                                history.map((tx) => (
                                    <tr key={tx._id} className="hover:bg-gray-850 transition">
                                        <td className="p-4 font-mono text-sm text-indigo-300">{tx.referenceId}</td>
                                        <td className="p-4 capitalize">
                                            <span className={`px-2 py-1 rounded text-xs font-semibold ${tx.type === 'deposit' ? 'bg-emerald-950 text-emerald-400' : 'bg-purple-950 text-purple-400'}`}>
                                                {tx.type}
                                            </span>
                                        </td>
                                        <td className="p-4 font-bold">${tx.amount}</td>
                                        <td className="p-4 text-sm text-gray-400">{tx.recipientEmail ? `To: ${tx.recipientEmail}` : 'Self Account'}</td>
                                        <td className="p-4">
                                            <span className="bg-emerald-950 text-emerald-400 border border-emerald-900 px-2.5 py-0.5 rounded-full text-xs font-medium">
                                                {tx.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default PaymentDashboard;