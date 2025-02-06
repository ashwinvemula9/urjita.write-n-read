import React, { useState, useEffect } from "react";
import { templatesAPI } from "../../services/api/endpoints";
import { SearchBar } from "../common/ReusableComponents";
import { Pagination } from "../common/ReusableComponents";

const getTabStyle = (tabName, activeTab) => {
  const baseStyle = `px-4 py-2 rounded-md text-sm font-medium`;
  const activeStyle = `bg-neutral-700 text-white`;
  const inactiveStyle = `text-neutral-400 hover:text-neutral-300 hover:bg-neutral-700/50`;

  return `${baseStyle} ${
    activeTab === tabName ? activeStyle : inactiveStyle
  } cursor-pointer transition-all duration-200`;
};

const TemplatesDashboard = () => {
  const [templates, setTemplates] = useState({
    design_templates: [],
    verifier_templates: [],
    approver_templates: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState("all");

  const ITEMS_PER_PAGE = 10;

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const response = await templatesAPI.getUserTemplates();
        setTemplates(response);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchTemplates();
  }, []);

  const filterTemplates = (templatesList) => {
    return templatesList.filter((template) =>
      Object.values(template).some((value) =>
        value.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  };

  const getDisplayTemplates = () => {
    switch (activeTab) {
      case "designer":
        return filterTemplates(templates.design_templates);
      case "verifier":
        return filterTemplates(templates.verifier_templates);
      case "approver":
        return filterTemplates(templates.approver_templates);
      default:
        return filterTemplates([
          ...templates.design_templates,
          ...templates.verifier_templates,
          ...templates.approver_templates,
        ]);
    }
  };

  const displayTemplates = getDisplayTemplates();
  const totalPages = Math.ceil(displayTemplates.length / ITEMS_PER_PAGE);
  const paginatedTemplates = displayTemplates.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const totalTemplates =
    templates.design_templates.length +
    templates.verifier_templates.length +
    templates.approver_templates.length;

  if (loading) return <div className="text-white text-center">Loading...</div>;
  if (error) return <div className="text-red-500 text-center">{error}</div>;

  return (
    <div className="flex flex-col h-[calc(100vh-7rem)] max-w-6xl mx-auto">
      {/* Header Section */}
      <div className="bg-neutral-800/50 rounded-t-xl p-6 border-b border-neutral-700">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-white">Templates</h2>
          <div className="w-72">
            <SearchBar
              value={searchTerm}
              onChange={setSearchTerm}
              placeholder="Search templates..."
            />
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-3 bg-neutral-800/80 p-2 rounded-lg">
          <div
            className={getTabStyle("all", activeTab)}
            onClick={() => setActiveTab("all")}
          >
            All ({totalTemplates})
          </div>
          <div
            className={getTabStyle("designer", activeTab)}
            onClick={() => setActiveTab("designer")}
          >
            Designer ({templates.design_templates.length})
          </div>
          <div
            className={getTabStyle("verifier", activeTab)}
            onClick={() => setActiveTab("verifier")}
          >
            Verifier ({templates.verifier_templates.length})
          </div>
          <div
            className={getTabStyle("approver", activeTab)}
            onClick={() => setActiveTab("approver")}
          >
            Approver ({templates.approver_templates.length})
          </div>
        </div>
      </div>

      {/* Table Section - Scrollable */}
      <div className="flex-1 overflow-hidden bg-neutral-800/50">
        <div
          className="overflow-x-auto overflow-y-auto h-full
            [&::-webkit-scrollbar]:w-2
            [&::-webkit-scrollbar]:h-2
            [&::-webkit-scrollbar-thumb]:rounded-full
            [&::-webkit-scrollbar-thumb]:bg-neutral-600
            [&::-webkit-scrollbar-thumb]:hover:bg-neutral-500
            [&::-webkit-scrollbar-track]:bg-neutral-800
            [&::-webkit-scrollbar-track]:rounded-full
            [&::-webkit-scrollbar-corner]:bg-transparent
            scrollbar-thin
            scrollbar-thumb-neutral-600
            hover:scrollbar-thumb-neutral-500
            scrollbar-track-neutral-800"
        >
          <table className="min-w-full divide-y divide-neutral-700">
            <thead className="bg-neutral-800/90 sticky top-0 z-10">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-medium text-neutral-300 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-neutral-300 uppercase tracking-wider">
                  OPP
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-neutral-300 uppercase tracking-wider">
                  OPU
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-neutral-300 uppercase tracking-wider">
                  EDU
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-neutral-300 uppercase tracking-wider">
                  Model
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-neutral-300 uppercase tracking-wider">
                  Part #
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-neutral-300 uppercase tracking-wider">
                  Rev
                </th>
              </tr>
            </thead>
            <tbody className="bg-neutral-800/30 divide-y divide-neutral-700">
              {paginatedTemplates.map((template, index) => (
                <tr
                  key={index}
                  className="hover:bg-neutral-700/50 transition-colors"
                >
                  <td className="px-6 py-3 text-sm text-neutral-300 whitespace-nowrap">
                    {activeTab === "all"
                      ? templates.design_templates.includes(template)
                        ? "Designer"
                        : templates.verifier_templates.includes(template)
                        ? "Verifier"
                        : "Approver"
                      : activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
                  </td>
                  <td className="px-6 py-3 text-sm text-neutral-300 whitespace-nowrap">
                    {template.oppNumber}
                  </td>
                  <td className="px-6 py-3 text-sm text-neutral-300 whitespace-nowrap">
                    {template.opuNumber}
                  </td>
                  <td className="px-6 py-3 text-sm text-neutral-300 whitespace-nowrap">
                    {template.eduNumber}
                  </td>
                  <td className="px-6 py-3 text-sm text-neutral-300 whitespace-nowrap">
                    {template.modelName}
                  </td>
                  <td className="px-6 py-3 text-sm text-neutral-300 whitespace-nowrap">
                    {template.partNumber}
                  </td>
                  <td className="px-6 py-3 text-sm text-neutral-300 whitespace-nowrap">
                    {template.revisionNumber}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer Section with Pagination */}
      <div className="bg-neutral-800/50 rounded-b-xl p-4 border-t border-neutral-700">
        {totalPages > 1 && (
          <div className="flex justify-center">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default TemplatesDashboard;
