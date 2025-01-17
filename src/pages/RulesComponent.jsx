import React, { useState } from 'react';
import { Search, AlertCircle, FileText } from 'lucide-react';

const RulesComponent = ({ rules }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredRules = rules.filter(rule => 
    rule.parameter.toLowerCase().includes(searchTerm.toLowerCase()) ||
    rule.rule_number.includes(searchTerm) ||
    rule.design_doc.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get unique design documents count
  const uniqueDesignDocs = [...new Set(rules.map(rule => rule.design_doc))];

  return (
    <div className="min-h-screen relative bg-gray-50">
      {/* Sticky Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-3xl mx-auto px-6 py-4">
          <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
            {/* Stats */}
            <div className="flex items-center gap-6 text-sm">
              <div className="flex items-center gap-2 text-gray-600">
                <FileText className="w-4 h-4" />
                <span>Total Rules: <span className="font-medium text-gray-900">{rules.length}</span></span>
              </div>
              <div className="h-4 w-px bg-gray-300" />
              <div className="text-gray-600">
                Documents: <span className="font-medium text-gray-900">{uniqueDesignDocs.length}</span>
              </div>
              {searchTerm && (
                <>
                  <div className="h-4 w-px bg-gray-300" />
                  <div className="text-gray-600">
                    Filtered: <span className="font-medium text-gray-900">{filteredRules.length}</span>
                  </div>
                </>
              )}
            </div>

            {/* Search */}
            <div className="relative w-full md:w-auto min-w-[300px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by rule number, document, or description..."
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Rules List */}
      <div className="max-w-3xl mx-auto px-6 py-6 space-y-4">
        {filteredRules.map((rule) => (
          <div 
            key={rule.id} 
            className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:border-blue-300 transition-colors"
          >
            {/* Header */}
            <div className="border-b border-gray-100 bg-gray-50 px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="bg-blue-100 text-blue-700 px-2.5 py-1 rounded text-sm font-medium">
                  {rule.design_doc}
                </span>
                <span className="text-gray-600 font-medium">
                  Rule {rule.rule_number}
                </span>
              </div>
            </div>

            {/* Content */}
            <div className="p-4">
              {/* Parameter */}
              <div className="mb-4">
                <p className="text-gray-900 font-medium leading-relaxed">
                  {rule.parameter}
                </p>
              </div>

              {/* Values */}
              <div className="flex flex-wrap gap-3 mb-4">
                {rule.min_value && rule.min_value !== "N/A" && (
                  <div className="px-3 py-2 rounded-lg bg-red-50 border border-red-100">
                    <span className="text-gray-500 text-sm mr-2">Min:</span>
                    <span className="text-red-700 font-medium">{rule.min_value}</span>
                  </div>
                )}
                {rule.nominal && rule.nominal !== "N/A" && (
                  <div className="px-3 py-2 rounded-lg bg-gray-50 border border-gray-200">
                    <span className="text-gray-500 text-sm mr-2">Nominal:</span>
                    <span className="text-gray-700 font-medium">{rule.nominal}</span>
                  </div>
                )}
                {rule.max_value && rule.max_value !== "N/A" && (
                  <div className="px-3 py-2 rounded-lg bg-green-50 border border-green-100">
                    <span className="text-gray-500 text-sm mr-2">Max:</span>
                    <span className="text-green-700 font-medium">{rule.max_value}</span>
                  </div>
                )}
              </div>

              {/* Comments */}
              {rule.comments && rule.comments !== "N/A" && (
                <div className="flex gap-2 bg-yellow-50 rounded-lg p-3">
                  <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-gray-600 whitespace-pre-line">
                    {rule.comments}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RulesComponent;