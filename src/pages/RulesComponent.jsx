import React, { useState } from "react";
import { Search, AlertCircle, FileText, Filter } from "lucide-react";

const RulesComponent = ({ rules, selectedCheckboxes }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeDoc, setActiveDoc] = useState(null);

  // Get unique design documents
  const uniqueDesignDocs = [...new Set(rules.map((rule) => rule.design_doc))];

  // Filter rules based on search and active document
  const filteredRules = rules.filter((rule) => {
    const matchesSearch =
      rule.parameter.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rule.rule_number.includes(searchTerm) ||
      rule.design_doc.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesSearch && (!activeDoc || rule.design_doc === activeDoc);
  });

  return (
    <div className="h-full flex flex-col bg-neutral-50">
      {/* Sticky Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-neutral-200 shadow-sm">
        <div className="p-4 space-y-4">
          {/* Stats and Search Row */}
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Stats */}
            <div className="flex items-center gap-6 text-sm">
              <div className="flex items-center gap-2 text-neutral-600">
                <FileText className="w-4 h-4" />
                <span>
                  Total Rules:{" "}
                  <span className="font-medium text-neutral-900">
                    {rules.length}
                  </span>
                </span>
              </div>
              <div className="h-4 w-px bg-neutral-300" />
              <div className="text-neutral-600">
                Documents:{" "}
                <span className="font-medium text-neutral-900">
                  {uniqueDesignDocs.length}
                </span>
              </div>
              {searchTerm && (
                <>
                  <div className="h-4 w-px bg-neutral-300" />
                  <div className="text-neutral-600">
                    Filtered:{" "}
                    <span className="font-medium text-neutral-900">
                      {filteredRules.length}
                    </span>
                  </div>
                </>
              )}
            </div>

            {/* Search */}
            <div className="relative w-full md:w-auto min-w-[300px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search rules..."
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-neutral-200 focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Document Filters */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActiveDoc(null)}
              className={`px-3 py-1.5 text-sm rounded-full transition-colors
                ${
                  !activeDoc
                    ? "bg-primary-100 text-primary-700 font-medium"
                    : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                }`}
            >
              All Documents
            </button>
            {uniqueDesignDocs.map((doc) => (
              <button
                key={doc}
                onClick={() => setActiveDoc(doc === activeDoc ? null : doc)}
                className={`px-3 py-1.5 text-sm rounded-full transition-colors
                  ${
                    doc === activeDoc
                      ? "bg-primary-100 text-primary-700 font-medium"
                      : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                  }`}
              >
                {doc}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Rules List */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredRules.map((rule) => (
            <div
              key={rule.id}
              className="bg-white rounded-lg border border-neutral-200 overflow-hidden hover:border-primary-300 transition-colors"
            >
              {/* Rule Header */}
              <div className="border-b border-neutral-100 bg-neutral-50 px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="bg-primary-100 text-primary-700 px-2.5 py-1 rounded text-sm font-medium">
                    {rule.design_doc}
                  </span>
                  <span className="text-neutral-600 font-medium">
                    Rule {rule.rule_number}
                  </span>
                </div>
              </div>

              {/* Rule Content */}
              <div className="p-4 space-y-4">
                {/* Parameter */}
                <p className="text-neutral-900 font-medium leading-relaxed">
                  {rule.parameter}
                </p>

                {/* Values */}
                <div className="flex flex-wrap gap-3">
                  {rule.min_value && rule.min_value !== "N/A" && (
                    <div className="px-3 py-2 rounded-lg bg-red-50 border border-red-100">
                      <span className="text-neutral-500 text-sm mr-2">
                        Min:
                      </span>
                      <span className="text-red-700 font-medium">
                        {rule.min_value}
                      </span>
                    </div>
                  )}
                  {rule.nominal && rule.nominal !== "N/A" && (
                    <div className="px-3 py-2 rounded-lg bg-neutral-50 border border-neutral-200">
                      <span className="text-neutral-500 text-sm mr-2">
                        Nominal:
                      </span>
                      <span className="text-neutral-700 font-medium">
                        {rule.nominal}
                      </span>
                    </div>
                  )}
                  {rule.max_value && rule.max_value !== "N/A" && (
                    <div className="px-3 py-2 rounded-lg bg-green-50 border border-green-100">
                      <span className="text-neutral-500 text-sm mr-2">
                        Max:
                      </span>
                      <span className="text-green-700 font-medium">
                        {rule.max_value}
                      </span>
                    </div>
                  )}
                </div>

                {/* Comments */}
                {rule.comments && rule.comments !== "N/A" && (
                  <div className="flex gap-2 bg-amber-50 rounded-lg p-3">
                    <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-neutral-600 whitespace-pre-line">
                      {rule.comments}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RulesComponent;
