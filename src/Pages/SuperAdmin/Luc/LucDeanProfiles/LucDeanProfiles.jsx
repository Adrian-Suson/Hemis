import { useState, useEffect } from 'react';
import axios from 'axios';
import config from '../../../../utils/config';
import Dialog from '../../../../Components/Dialog';
import { Plus, Edit, Trash, Save, X, ArrowLeft, Search, Building2, BookOpen, User, MoreHorizontal } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { HEAD_TITLE_MAPPING } from '../../../../utils/LucFormAConstants';
import Popper from '../../../../Components/Popper';


function LucDeanProfiles() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState('add'); // 'add' or 'edit'
  const [currentRecord, setCurrentRecord] = useState(null);
  const [form, setForm] = useState({
    luc_detail_id: '',
    name: '',
    designation: '',
    college_discipline_assignment: '',
    baccalaureate_degree: '',
    masters_degree: '',
    doctorate_degree: '',
  });
  const [lucOptions, setLucOptions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const heiName = location.state?.heiName || "Unknown Institution";
  useEffect(() => {
    fetchData();
    fetchLucs();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${config.API_URL}/luc-dean-profiles`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      const result = Array.isArray(response.data) ? response.data : response.data.data || [];
      setData(result);
      // Set LUC name if filtered

    } catch {
      setError('Failed to load dean profiles.');
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
        ? {
            luc_detail_id: record.luc_detail_id,
            name: record.name,
            designation: record.designation || '',
            college_discipline_assignment: record.college_discipline_assignment || '',
            baccalaureate_degree: record.baccalaureate_degree || '',
            masters_degree: record.masters_degree || '',
            doctorate_degree: record.doctorate_degree || '',
          }
        : {
            luc_detail_id: '',
            name: '',
            designation: '',
            college_discipline_assignment: '',
            baccalaureate_degree: '',
            masters_degree: '',
            doctorate_degree: '',
          }
    );
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentRecord(null);
    setForm({
      luc_detail_id: '',
      name: '',
      designation: '',
      college_discipline_assignment: '',
      baccalaureate_degree: '',
      masters_degree: '',
      doctorate_degree: '',
    });
  };

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    try {
      if (modalType === 'add') {
        await axios.post(`${config.API_URL}/luc-dean-profiles`, form, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
      } else {
        await axios.put(`${config.API_URL}/luc-dean-profiles/${currentRecord.id}`, form, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
      }
      closeModal();
      fetchData();
    } catch {
      setError('Failed to save dean profile.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this dean profile?')) return;
    try {
      await axios.delete(`${config.API_URL}/luc-dean-profiles/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      fetchData();
    } catch {
      setError('Failed to delete dean profile.');
    }
  };


  // Filtered data for search
  const filteredData = data.filter(row => {
    const matchesSearch =
      !searchTerm ||
      row.name?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-green-50/30 to-emerald-50/30">
      <div className="p-6 max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <button
              onClick={() => navigate('/super-admin/institutions/luc')}
              className="mr-4 p-2 text-gray-600 hover:text-gray-900 hover:bg-white/50 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-500"
              title="Back to LUC List"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                LUC Dean Profiles
              </h1>
              {heiName && (
                <p className="text-gray-600 flex items-center">
                  <Building2 className="w-4 h-4 mr-2" />
                  {heiName}
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
                      placeholder="Search dean profiles..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 w-full sm:w-60 lg:w-80 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white/50 backdrop-blur-sm transition-all duration-200"
                    />
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-2 w-full xl:w-auto">

                  <button
                    onClick={() => openModal('add')}
                    className="inline-flex items-center justify-center px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg text-sm font-medium hover:from-green-700 hover:to-green-800 shadow-sm hover:shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Dean Profile
                  </button>
                </div>
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <BookOpen className="w-4 h-4 mr-1" />
                Showing {filteredData.length} of {data.length} dean profiles
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
                  Loading dean profiles...
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
                    <th className="w-[180px] px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="w-[120px] px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Designation
                    </th>
                    <th className="w-[180px] px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Discipline
                    </th>
                    <th className="w-[120px] px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Baccalaureate
                    </th>
                    <th className="w-[120px] px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Masters
                    </th>
                    <th className="w-[120px] px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Doctorate
                    </th>
                    <th className="w-[100px] px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
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
                      <td className="w-[180px] px-4 py-4">
                        <div className="text-xs text-gray-900 break-words flex items-center">
                          <User className="w-4 h-4 mr-1 text-green-700" />
                          {row.name}
                        </div>
                      </td>
                      <td className="w-[120px] px-4 py-4">
                        <div className="text-xs text-gray-900">{HEAD_TITLE_MAPPING[String(row.designation)] || row.designation}</div>
                      </td>
                      <td className="w-[180px] px-4 py-4">
                        <div className="text-xs text-gray-900">{row.college_discipline_assignment}</div>
                      </td>
                      <td className="w-[120px] px-4 py-4">
                        <div className="text-xs text-gray-900">{row.baccalaureate_degree}</div>
                      </td>
                      <td className="w-[120px] px-4 py-4">
                        <div className="text-xs text-gray-900">{row.masters_degree}</div>
                      </td>
                      <td className="w-[120px] px-4 py-4">
                        <div className="text-xs text-gray-900">{row.doctorate_degree}</div>
                      </td>
                      <td className="w-[100px] px-4 py-4 text-center">
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
                          className="bg-white border border-gray-200 rounded shadow-lg min-w-[120px] py-1"
                        >
                          {({ close }) => (
                            <div>
                              <button
                                onClick={() => { openModal('edit', row); close(); }}
                                className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 flex items-center"
                              >
                                <Edit className="w-4 h-4 mr-2 text-blue-600" /> Edit
                              </button>
                              <button
                                onClick={() => { handleDelete(row.id); close(); }}
                                className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 flex items-center"
                              >
                                <Trash className="w-4 h-4 mr-2 text-red-600" /> Delete
                              </button>
                            </div>
                          )}
                        </Popper>
                      </td>
                    </tr>
                  ))}
                  {filteredData.length === 0 && (
                    <tr>
                      <td colSpan={8} className="text-center py-8 text-gray-400">No dean profiles found.</td>
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
          title={modalType === 'add' ? 'Add Dean Profile' : 'Edit Dean Profile'}
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                type="text"
                value={form.name}
                onChange={e => handleChange('name', e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2"
                placeholder="e.g., Dr. Juan Dela Cruz"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Designation</label>
              <select
                value={form.designation}
                onChange={e => handleChange('designation', e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2"
              >
                <option value="">Select designation</option>
                {Object.entries(HEAD_TITLE_MAPPING).map(([key, label]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">College/Discipline Assignment</label>
              <input
                type="text"
                value={form.college_discipline_assignment}
                onChange={e => handleChange('college_discipline_assignment', e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2"
                placeholder="e.g., College of Engineering"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Baccalaureate Degree</label>
                <input
                  type="text"
                  value={form.baccalaureate_degree}
                  onChange={e => handleChange('baccalaureate_degree', e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  placeholder="e.g., BS Civil Engineering"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Masters Degree</label>
                <input
                  type="text"
                  value={form.masters_degree}
                  onChange={e => handleChange('masters_degree', e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  placeholder="e.g., MS Engineering Management"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Doctorate Degree</label>
                <input
                  type="text"
                  value={form.doctorate_degree}
                  onChange={e => handleChange('doctorate_degree', e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  placeholder="e.g., PhD Engineering"
                />
              </div>
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

export default LucDeanProfiles;
