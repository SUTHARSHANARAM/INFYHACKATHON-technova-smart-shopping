import React from 'react';

interface ProductSpecificationsTableProps {
  specifications: Record<string, any>;
}

export const ProductSpecificationsTable: React.FC<ProductSpecificationsTableProps> = ({ specifications }) => {
  const specEntries = Object.entries(specifications || {});

  if (specEntries.length === 0) {
    return (
      <p className="text-sm text-gray-500 italic">No detailed technical specifications listed.</p>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
      <table className="w-full text-left border-collapse text-xs sm:text-sm">
        <tbody>
          {specEntries.map(([key, value], idx) => (
            <tr
              key={key}
              className={idx % 2 === 0 ? 'bg-gray-50/60' : 'bg-white'}
            >
              <td className="py-3 px-4 sm:px-6 font-semibold text-gray-700 w-1/3 border-r border-gray-100">
                {key}
              </td>
              <td className="py-3 px-4 sm:px-6 text-gray-900 font-medium">
                {String(value)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
