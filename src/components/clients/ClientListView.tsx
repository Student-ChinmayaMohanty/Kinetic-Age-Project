import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Badge } from '../common/Badge';
import { EmptyState } from '../common/EmptyState';
import { Skeleton } from '../common/Skeleton';
import { 
  Search, ArrowUpDown, UserPlus, 
  Eye, ChevronLeft, ChevronRight, CheckSquare, Square
} from 'lucide-react';

export const ClientListView: React.FC = () => {
  const { 
    clients, 
    setSelectedClient, 
    setIsAddClientOpen, 
    isSkeletonLoading,
    renewSubscription
  } = useApp();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [planFilter, setPlanFilter] = useState<string>('all');
  const [sortField] = useState<'name' | 'joinDate' | 'healthScore'>('name');
  const [sortAsc, setSortAsc] = useState(true);
  const [selectedRowIds, setSelectedRowIds] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Filter clients
  const filteredClients = clients.filter((c) => {
    const matchesSearch = 
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      c.id.toLowerCase().includes(search.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
    const matchesPlan = planFilter === 'all' || c.plan === planFilter;

    return matchesSearch && matchesStatus && matchesPlan;
  }).sort((a, b) => {
    if (sortField === 'name') {
      return sortAsc ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
    } else if (sortField === 'joinDate') {
      return sortAsc ? a.joinDate.localeCompare(b.joinDate) : b.joinDate.localeCompare(a.joinDate);
    } else {
      return sortAsc ? a.healthScore - b.healthScore : b.healthScore - a.healthScore;
    }
  });

  const totalPages = Math.ceil(filteredClients.length / itemsPerPage);
  const paginatedClients = filteredClients.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const toggleSelectAll = () => {
    if (selectedRowIds.length === paginatedClients.length) {
      setSelectedRowIds([]);
    } else {
      setSelectedRowIds(paginatedClients.map(c => c.id));
    }
  };

  const toggleSelectRow = (id: string) => {
    setSelectedRowIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Client Directory ({filteredClients.length})
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Manage member health profiles, active plans, and attendance metrics
          </p>
        </div>

        <button
          onClick={() => setIsAddClientOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-600/20 active:scale-95 transition-all flex items-center justify-center gap-2 self-start md:self-center"
        >
          <UserPlus className="w-4 h-4" /> Onboard New Member
        </button>
      </div>

      {/* Filter & Toolbar */}
      <div className="p-4 rounded-3xl bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name, ID, or email..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-xs font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-xs font-medium focus:outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Pending Renewal">Pending Renewal</option>
            <option value="Expired">Expired</option>
          </select>

          {/* Plan Filter */}
          <select
            value={planFilter}
            onChange={(e) => setPlanFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-xs font-medium focus:outline-none"
          >
            <option value="all">All Plans</option>
            <option value="1 Month">1 Month</option>
            <option value="3 Months">3 Months</option>
            <option value="6 Months">6 Months</option>
          </select>

          {/* Sort Button */}
          <button
            onClick={() => {
              setSortAsc(!sortAsc);
            }}
            className="px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-xs font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1.5"
          >
            <ArrowUpDown className="w-3.5 h-3.5" />
            Sort {sortAsc ? 'Asc' : 'Desc'}
          </button>
        </div>
      </div>

      {/* Table Container */}
      {isSkeletonLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full rounded-2xl" />
          ))}
        </div>
      ) : paginatedClients.length === 0 ? (
        <EmptyState
          title="No clients found"
          description="There are no members matching your active filters. Try adjusting search query or filter options."
          actionLabel="Onboard Client"
          onAction={() => setIsAddClientOpen(true)}
        />
      ) : (
        <div className="bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800 rounded-3xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50/80 dark:bg-gray-800/80 border-b border-gray-200 dark:border-gray-800 text-gray-500 font-bold uppercase tracking-wider">
                <tr>
                  <th className="p-4 w-10">
                    <button onClick={toggleSelectAll}>
                      {selectedRowIds.length === paginatedClients.length && paginatedClients.length > 0 ? (
                        <CheckSquare className="w-4 h-4 text-blue-600" />
                      ) : (
                        <Square className="w-4 h-4 text-gray-400" />
                      )}
                    </button>
                  </th>
                  <th className="p-4">Member Name & Contact</th>
                  <th className="p-4">Subscription Plan</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Assigned Trainer</th>
                  <th className="p-4">Health Index</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {paginatedClients.map((client) => {
                  const isSelected = selectedRowIds.includes(client.id);
                  return (
                    <tr
                      key={client.id}
                      className={`hover:bg-blue-50/30 dark:hover:bg-blue-950/20 transition-colors ${
                        isSelected ? 'bg-blue-50/50 dark:bg-blue-900/20' : ''
                      }`}
                    >
                      <td className="p-4">
                        <button onClick={() => toggleSelectRow(client.id)}>
                          {isSelected ? (
                            <CheckSquare className="w-4 h-4 text-blue-600" />
                          ) : (
                            <Square className="w-4 h-4 text-gray-400" />
                          )}
                        </button>
                      </td>

                      <td className="p-4">
                        <div 
                          className="flex items-center gap-3 cursor-pointer group"
                          onClick={() => setSelectedClient(client)}
                        >
                          <img
                            src={client.avatar}
                            alt={client.name}
                            className="w-9 h-9 rounded-full object-cover shrink-0 border border-gray-200 dark:border-gray-700"
                          />
                          <div>
                            <div className="font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                              {client.name}
                            </div>
                            <div className="text-[11px] text-gray-400">
                              {client.email} • {client.id}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="p-4 font-semibold text-gray-800 dark:text-gray-200">
                        {client.plan}
                      </td>

                      <td className="p-4">
                        <Badge
                          variant={
                            client.status === 'Active' ? 'success' :
                            client.status === 'Pending Renewal' ? 'warning' : 'danger'
                          }
                        >
                          {client.status}
                        </Badge>
                      </td>

                      <td className="p-4 text-gray-700 dark:text-gray-300 font-medium">
                        {client.assignedTrainer}
                      </td>

                      <td className="p-4 font-bold text-gray-900 dark:text-white">
                        <span className="inline-flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full bg-emerald-500" />
                          {client.healthScore} / 100
                        </span>
                      </td>

                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setSelectedClient(client)}
                            className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 hover:text-blue-600"
                            title="View Deep Profile"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {client.status === 'Pending Renewal' && (
                            <button
                              onClick={() => renewSubscription(client.id)}
                              className="p-1.5 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 hover:bg-amber-500/20 text-xs font-semibold"
                              title="Renew Subscription"
                            >
                              Renew
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination Footer */}
          <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between text-xs text-gray-500">
            <span>
              Showing {Math.min(filteredClients.length, (currentPage - 1) * itemsPerPage + 1)} - {Math.min(filteredClients.length, currentPage * itemsPerPage)} of {filteredClients.length} members
            </span>
            <div className="flex items-center gap-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(p => p - 1)}
                className="p-1.5 rounded-lg border border-gray-200 dark:border-gray-800 disabled:opacity-40"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="font-bold text-gray-900 dark:text-white">
                Page {currentPage} of {totalPages || 1}
              </span>
              <button
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage(p => p + 1)}
                className="p-1.5 rounded-lg border border-gray-200 dark:border-gray-800 disabled:opacity-40"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
