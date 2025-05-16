'use client';

import { useState } from 'react';
import { useSplit } from '~~/hooks/useSplit';
import { Address } from '~~/node_modules/viem/_types';

interface SplitRecipient {
  address: string;
  percentAllocation: number;
}

interface SplitRecipientsProps {
  onSplitCreated: (splitAddress: Address) => void;
  postTokenAddress: Address;
}

export function SplitRecipients({ onSplitCreated, postTokenAddress }: SplitRecipientsProps) {
  const [recipients, setRecipients] = useState<SplitRecipient[]>([
    { address: '', percentAllocation: 0 },
  ]);
  const [totalAllocation, setTotalAllocation] = useState(0);

  const { createProtocolSplit, isLoading, error } = useSplit();

  const addRecipient = () => {
    setRecipients([...recipients, { address: '', percentAllocation: 0 }]);
  };

  const removeRecipient = (index: number) => {
    const newRecipients = recipients.filter((_, i) => i !== index);
    setRecipients(newRecipients);
    updateTotalAllocation(newRecipients);
  };

  const updateRecipient = (index: number, field: keyof SplitRecipient, value: string | number) => {
    const newRecipients = [...recipients];
    newRecipients[index] = {
      ...newRecipients[index],
      [field]: value,
    };
    setRecipients(newRecipients);
    updateTotalAllocation(newRecipients);
  };

  const updateTotalAllocation = (recips: SplitRecipient[]) => {
    const total = recips.reduce((sum, r) => sum + r.percentAllocation, 0);
    setTotalAllocation(total);
  };

  const handleCreateSplit = async () => {
    if (totalAllocation !== 100) {
      alert('Total allocation must equal 100%');
      return;
    }

    const splitAddress = await createProtocolSplit(totalAllocation, postTokenAddress);
    if (splitAddress) {
      onSplitCreated(splitAddress);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Split Recipients</h3>
        <button
          onClick={addRecipient}
          className="px-3 py-1 text-sm bg-indigo-100 hover:bg-indigo-200 text-indigo-700 rounded-lg transition-colors"
        >
          Add Recipient
        </button>
      </div>

      <div className="space-y-3">
        {recipients.map((recipient, index) => (
          <div key={index} className="flex items-center space-x-3">
            <input
              type="text"
              placeholder="Recipient Address"
              value={recipient.address}
              onChange={(e) => updateRecipient(index, 'address', e.target.value)}
              className="flex-1 border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <input
              type="number"
              placeholder="Percentage"
              value={recipient.percentAllocation}
              onChange={(e) => updateRecipient(index, 'percentAllocation', Number(e.target.value))}
              className="w-24 border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              onClick={() => removeRecipient(index)}
              className="p-2 text-red-500 hover:text-red-700"
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      <div className="flex justify-between items-center text-sm text-gray-500">
        <span>Total Allocation: {totalAllocation}%</span>
        {totalAllocation !== 100 && (
          <span className="text-red-500">Total must equal 100%</span>
        )}
      </div>

      {error && (
        <div className="text-red-500 text-sm">{error}</div>
      )}

      <button
        onClick={handleCreateSplit}
        disabled={isLoading || totalAllocation !== 100}
        className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-indigo-400 disabled:cursor-not-allowed"
      >
        {isLoading ? 'Creating Split...' : 'Create Split'}
      </button>
    </div>
  );
} 