import { useState, useEffect } from 'react';
import axios from 'axios';
import config from '../../../../utils/config';
import Dialog from '../../../../Components/Dialog';
import { Plus, Edit, Trash, Save, X, ArrowLeft, Search, Filter, TrendingUp, Building2, MoreHorizontal } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import Popper from '../../../../Components/Popper';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function LucFormerNames() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState('add'); // 'add' or 'edit'
  const [currentRecord, setCurrentRecord] = useState(null);
  const [form, setForm] = useState({ luc_detail_id: '', former_name: '', year_used: '' });
  const [lucOptions, setLucOptions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterYear, setFilterYear] = useState("");
  const query = useQuery();
  const navigate = useNavigate();
  const heiUiid = query.get('hei_uiid');
  const [lucName, setLucName] = useState("");

  useEffect(() => {
    fetchData();
    fetchLucs();
    // eslint-disable-next-line
  }, [heiUiid]);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      let url = `${config.API_URL}/luc-former-names`;
      if (heiUiid) {
        url += `?hei_uiid=${heiUiid}`;
      }
      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      const result = Array.isArray(response.data) ? response.data : response.data.data || [];
      setData(result);
      // Set LUC name if filtered
      if (heiUiid && result.length > 0) {
        setLucName(result[0].luc_detail?.institution_name || result[0].luc_detail?.hei?.name || "");
      } else {
        setLucName("");
      }
    } catch {
      setError('Failed to load former names.');
    } finally {
      setLoading(false);
    }
  };

  const fetchLucs = async () => {
    try {
      const response = await axios.get(`${config.API_URL}/luc-details`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setLucOptions(
        (Array.isArray(response.data) ? response.data : response.data.data || []).map(luc => ({
          value: luc.id,
          label: luc.institution_name || luc.hei?.name || luc.hei_uiid,
        }))
      );
    } catch {
      setError('Failed to load LUC list.');
    }
  };

  const openModal = (type, record = null) => {
    setModalType(type);
    setCurrentRecord(record);
    setForm(
      record
        ? { luc_detail_id: record.luc_detail_id, former_name: record.former_name, year_used: record.year_used }
        : { luc_detail_id: '', former_name: '', year_used: '' }
    );
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentRecord(null);
    setForm({ luc_detail_id: '', former_name: '', year_used: '' });
  };

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    try {
      if (modalType === 'add') {
        await axios.post(`${config.API_URL}/luc-former-names`, form, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
      } else {
        await axios.put(`${config.API_URL}/luc-former-names/${currentRecord.id}`, form, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
      }
      closeModal();
      fetchData();
    } catch {
      setError('Failed to save former name.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this former name?')) return;
    try {
      await axios.delete(`${config.API_URL}/luc-former-names/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      fetchData();
    } catch {
      setError('Failed to delete former name.');
    }
  };

  const handleClearFilter = () => {
    navigate('/super-admin/institutions/luc/former-names');
  };

  // Filtered data for search and year
  const filteredData = data.filter(row => {
    const matchesSearch =
      !searchTerm ||
      row.former_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.luc_detail?.institution_name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesYear = !filterYear || String(row.year_used) === String(filterYear);
    return matchesSearch && matchesYear;
  });

  // Get all years for filter dropdown
  const allYears = Array.from(new Set(data.map(row => row.year_used).filter(Boolean))).sort((a, b) => b - a);

  const handleBack = () => {
    navigate("/super-admin/institutions/luc");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-green-50/30 to-emerald-50/30">
      <div className="p-6 max-w-5xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <button
              onClick={handleBack}
              className="mr-4 p-2 text-gray-600 hover:text-gray-900 hover:bg-white/50 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-500"
              title="Back to LUC List"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                LUC Former Names
              </h1>
              {heiUiid && lucName && (
                <p className="text-gray-600 flex items-center">
                  <Building2 className="w-4 h-4 mr-2" />
                  {lucName}
                </p>
              )}
            </div>
          </div>

          {/* Controls Section */}
          <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-white/20 shadow-sm mb-6">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col xl:flex-row gap-4 justify-between items-start xl:items-center">
                <div className="flex flex-col sm:flex-row gap-3 flex-1 w-full xl:w-auto">
                  <div className="relative flex-1 sm:flex-initial">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Search former names..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 w-full sm:w-60 lg:w-80 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white/50 backdrop-blur-sm transition-all duration-200"
                    />
                  </div>
                  <div className="relative w-full sm:w-auto">
                    <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <select
                      value={filterYear}
                      onChange={(e) => setFilterYear(e.target.value)}
                      className="pl-10 pr-8 py-2 w-full sm:w-auto border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white/50 backdrop-blur-sm appearance-none cursor-pointer transition-all duration-200"
                    >
                      <option value="">All Years</option>
                      {allYears.map((year) => (
                        <option key={year} value={year}>{year}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-2 w-full xl:w-auto">
                  {heiUiid && (
                    <button
                      onClick={handleClearFilter}
                      className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50"
                    >
                      Clear Filter
                    </button>
                  )}
                  <button
                    onClick={() => openModal('add')}
                    className="inline-flex items-center justify-center px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg text-sm font-medium hover:from-green-700 hover:to-green-800 shadow-sm hover:shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Former Name
                  </button>
                </div>
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <TrendingUp className="w-4 h-4 mr-1" />
                Showing {filteredData.length} of {data.length} former names
              </div>
            </div>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="mb-6 p-4 bg-red-50/80 backdrop-blur-sm border border-red-200 text-red-800 rounded-xl shadow-sm">
            <div className="flex items-center">
              <X className="w-5 h-5 mr-2" />
              {error}
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="flex items-center justify-center p-12">
            <div className="bg-white/70 backdrop-blur-sm rounded-xl p-8 shadow-sm">
              <div className="flex flex-col items-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mb-4"></div>
                <span className="text-gray-600 font-medium">
                  Loading former names...
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white/70 backdrop-blur-sm rounded-xl shadow-sm border border-white/20 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full table-fixed">
                <thead className="bg-gradient-to-r from-gray-50/80 to-green-50/50 border-b border-gray-200/50 sticky top-0 z-10">
                  <tr>
                    <th className="w-[300px] px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Former Name
                    </th>
                    <th className="w-[120px] px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Year Used
                    </th>
                    <th className="w-[120px] px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
              </table>
            </div>
            <div
              className="max-h-[400px] overflow-y-auto overflow-x-hidden"
              style={{
                scrollBehavior: "smooth",
                scrollbarWidth: "thin",
                scrollbarColor: "#CBD5E1 #F1F5F9",
              }}
            >
              <table className="min-w-full table-fixed">
                <tbody className="divide-y divide-gray-200/30">
                  {filteredData.map((row, index) => (
                    <tr
                      key={row.id}
                      className={`hover:bg-green-50/30 transition-all duration-200 ${
                        index % 2 === 0 ? "bg-white/30" : "bg-gray-50/30"
                      }`}
                    >
                      <td className="w-[300px] px-4 py-4">
                        <div className="text-xs text-gray-900 break-words">
                          {row.former_name}
                        </div>
                      </td>
                      <td className="w-[120px] px-4 py-4">
                        <div className="text-xs text-gray-900">
                          {row.year_used}
                        </div>
                      </td>
                      <td className="w-[120px] px-4 py-4 text-center">
                        <Popper
                          trigger={
                            <button
                              className="text-gray-600 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 rounded-md p-1"
                              title="More Actions"
                            >
                              <MoreHorizontal className="w-5 h-5" />
                            </button>
                          }
                          placement="bottom-end"
                          className="w-40 bg-white border border-gray-200 rounded-md shadow-lg z-[9999]"
                          offset={[0, 4]}
                        >
                          <button
                            onClick={() => openModal('edit', row)}
                            className="flex items-center w-full px-4 py-2 text-left text-sm text-blue-700 hover:bg-blue-50 focus:outline-none focus:bg-blue-50 transition-colors duration-150 group"
                            role="menuitem"
                          >
                            <Edit className="w-4 h-4 mr-3 text-blue-700 group-hover:text-blue-800" />
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(row.id)}
                            className="flex items-center w-full px-4 py-2 text-left text-sm text-red-700 hover:bg-red-50 focus:outline-none focus:bg-red-50 transition-colors duration-150 group"
                            role="menuitem"
                          >
                            <Trash className="w-4 h-4 mr-3 text-red-700 group-hover:text-red-600" />
                            Delete
                          </button>
                        </Popper>
                      </td>
                    </tr>
                  ))}
                  {filteredData.length === 0 && (
                    <tr>
                      <td colSpan={4} className="text-center py-8 text-gray-400">No former names found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
      {/* Modal for Add/Edit */}
      {isModalOpen && (
        <Dialog
          isOpen={isModalOpen}
          onClose={closeModal}
          title={modalType === 'add' ? 'Add Former Name' : 'Edit Former Name'}
          icon={modalType === 'add' ? Plus : Edit}
          size="md"
        >
          <div className="space-y-4 p-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">LUC Institution</label>
              <select
                value={form.luc_detail_id}
                onChange={e => handleChange('luc_detail_id', e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2"
                disabled={modalType === 'edit'}
              >
                <option value="">Select LUC</option>
                {lucOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Former Name</label>
              <input
                type="text"
                value={form.former_name}
                onChange={e => handleChange('former_name', e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2"
                placeholder="e.g., Old University Name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Year Used</label>
              <input
                type="number"
                value={form.year_used}
                onChange={e => handleChange('year_used', e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2"
                placeholder="e.g., 2001"
                min="1800"
                max={new Date().getFullYear()}
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={closeModal}
                className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50"
              >
                <X className="w-4 h-4 mr-1 inline" /> Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 flex items-center"
              >
                <Save className="w-4 h-4 mr-1" /> {modalType === 'add' ? 'Add' : 'Save'}
              </button>
            </div>
          </div>
        </Dialog>
      )}
    </div>
  );
}

export default LucFormerNames; 