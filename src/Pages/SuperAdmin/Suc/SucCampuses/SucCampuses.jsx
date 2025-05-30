/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import {
    Building2,
    MoreHorizontal,
    ArrowLeft,
    X,
    Eye,
    MapPin,
    User,
    Calendar,
    Hash,
    Globe,
    Search,
    Filter,
    Download,
    Plus,
    TrendingUp,
    ExternalLink
} from "lucide-react";
import Popper from "../../../../Components/Popper";
import Dialog from "../../../../Components/Dialog";
import config from "../../../../utils/config";
import axios from "axios";

function SucCampuses() {
  const { SucDetailId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const heiName = location.state?.heiName || "Unknown Institution";

  const [campuses, setCampuses] = useState([]);
  const [filteredCampuses, setFilteredCampuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedCampus, setSelectedCampus] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("ALL");

  // Fetch campuses when component mounts
  useEffect(() => {
    fetchCampuses();
  }, []);

  // Filter campuses based on search and type
  useEffect(() => {
    let filtered = campuses;

    if (searchTerm) {
      filtered = filtered.filter(campus =>
        campus.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        campus.municipality?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        campus.head_name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterType !== "ALL") {
      filtered = filtered.filter(campus => campus.campus_type === filterType);
    }

    setFilteredCampuses(filtered);
  }, [campuses, searchTerm, filterType]);

  const fetchCampuses = async () => {
    if (!SucDetailId) {
      console.error("SucDetailId is undefined. Cannot fetch campuses.");
      setError("Invalid institution ID. Please check the URL or try again.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");
    try {
      const response = await axios.get(`${config.API_URL}/suc-campuses`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          Accept: "application/json",
        },
        params: {
          suc_details_id: SucDetailId,
        },
      });

      const campusData = Array.isArray(response.data) ? response.data : response.data.data || [];
      setCampuses(campusData);
      setFilteredCampuses(campusData);
      console.log("Fetched campuses:", campusData);

      // Set institution name from the first campus

    } catch (err) {
      console.error("Error fetching campuses:", err);
      setError("Failed to load campuses. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (campus) => {
    setSelectedCampus(campus);
    setIsDetailModalOpen(true);
  };

  const handleEdit = (campus) => {
    console.log("Edit campus:", campus);
  };

  const handleDelete = async (campusId) => {
    if (!window.confirm("Are you sure you want to delete this campus?")) return;

    try {
      const response = await fetch(`${config.API_URL}/suc-campus/${campusId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          Accept: "application/json",
        },
      });
      if (!response.ok) {
        throw new Error("Failed to delete campus");
      }
      setCampuses(campuses.filter((campus) => campus.id !== campusId));
    } catch (err) {
      console.error("Error deleting campus:", err);
      setError("Failed to delete campus. Please try again.");
    }
  };

  const handleBack = () => {
    navigate("/super-admin/institutions/suc");
  };

  const closeDetailModal = () => {
    setIsDetailModalOpen(false);
    setSelectedCampus(null);
  };

  useEffect(() => {
    // You can update institutionName if needed after fetching campuses
    console.log("Institution Name:", heiName);
  }, [heiName]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/30">
      <div className="p-6 max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <button
              onClick={handleBack}
              className="mr-4 p-2 text-gray-600 hover:text-gray-900 hover:bg-white/50 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              title="Back to SUC List"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Campus Management
              </h1>
              <p className="text-gray-600 flex items-center">
                <Building2 className="w-4 h-4 mr-2" />
                {heiName}
              </p>
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
                      placeholder="Search campuses..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 w-full sm:w-60 lg:w-80 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/50 backdrop-blur-sm transition-all duration-200"
                    />
                  </div>

                  <div className="relative w-full sm:w-auto">
                    <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <select
                      value={filterType}
                      onChange={(e) => setFilterType(e.target.value)}
                      className="pl-10 pr-8 py-2 w-full sm:w-auto border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/50 backdrop-blur-sm appearance-none cursor-pointer transition-all duration-200"
                    >
                      <option value="ALL">All Types</option>
                      <option value="MAIN">Main Campus</option>
                      <option value="SATELLITE">Satellite Campus</option>
                    </select>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-2 w-full xl:w-auto">
                  <button className="inline-flex items-center justify-center px-4 py-2 bg-white/50 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-white hover:shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </button>
                  <button className="inline-flex items-center justify-center px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg text-sm font-medium hover:from-blue-700 hover:to-blue-800 shadow-sm hover:shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Campus
                  </button>
                </div>
              </div>

              <div className="flex items-center text-sm text-gray-500">
                <TrendingUp className="w-4 h-4 mr-1" />
                Showing {filteredCampuses.length} of {campuses.length} campuses
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
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
                <span className="text-gray-600 font-medium">Loading campuses...</span>
              </div>
            </div>
          </div>
        ) : (
          /* Campus Table with Fixed Height */
          <div className="bg-white/70 backdrop-blur-sm rounded-xl shadow-sm border border-white/20 overflow-hidden">
            {/* Table Header - Fixed */}
            <div className="bg-gradient-to-r from-gray-50/80 to-blue-50/50 border-b border-gray-200/50">
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Campus Information
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Type & Code
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Location
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Leadership
                      </th>
                      <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                </table>
              </div>
            </div>

            {/* Table Body - Scrollable */}
            <div className="max-h-96 overflow-y-auto">
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <tbody className="divide-y divide-gray-200/30">
                    {filteredCampuses.map((campus, index) => (
                      <tr
                        key={campus.id}
                        className={`hover:bg-blue-50/30 transition-all duration-200 ${
                          index % 2 === 0 ? 'bg-white/30' : 'bg-gray-50/30'
                        }`}
                      >
                        <td className="px-4 py-4">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${
                                campus.campus_type === 'MAIN'
                                  ? 'bg-gradient-to-br from-green-100 to-green-200 text-green-700'
                                  : 'bg-gradient-to-br from-blue-100 to-blue-200 text-blue-700'
                              }`}>
                                <Building2 className="w-5 h-5" />
                              </div>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-semibold text-gray-900">
                                {campus.name}
                              </div>
                              <div className="text-xs text-gray-500">
                                Campus ID: {campus.id}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="space-y-2">
                            <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full shadow-sm ${
                              campus.campus_type === 'MAIN'
                                ? 'bg-gradient-to-r from-green-100 to-green-200 text-green-800 border border-green-300'
                                : 'bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 border border-blue-300'
                            }`}>
                              {campus.campus_type}
                            </span>
                            <div className="text-xs text-gray-600 font-mono">
                              {campus.institutional_code || 'No Code'}
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="space-y-1">
                            <div className="text-sm font-medium text-gray-900 flex items-center">
                              <MapPin className="w-3 h-3 mr-1 text-gray-400" />
                              {campus.province_municipality                              }
                            </div>
                            <div className="text-xs text-gray-600">
                              {campus.region}
                            </div>
                            {campus.latitude && campus.longitude && (
                              <div className="text-xs text-green-600 flex items-center">
                                <Globe className="w-3 h-3 mr-1" />
                                Geo-located
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="space-y-1">
                            <div className="text-sm font-medium text-gray-900 flex items-center">
                              <User className="w-3 h-3 mr-1 text-gray-400" />
                              {campus.head_full_name || 'Not assigned'}
                            </div>
                            <div className="text-xs text-gray-600 truncate max-w-32">
                              {campus.position_title || 'No title'}
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-center">
                          <Popper
                            trigger={
                              <button
                                className="text-gray-600 hover:text-gray-900 hover:bg-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 rounded-lg p-2 transition-all duration-200"
                                title="More Actions"
                              >
                                <MoreHorizontal className="w-4 h-4" />
                              </button>
                            }
                            placement="bottom-end"
                            className="w-40 bg-white/90 backdrop-blur-sm border border-gray-200/50 rounded-xl shadow-lg"
                            offset={[0, 4]}
                            usePortal={true}
                          >
                            <div className="py-2">
                              <button
                                onClick={() => handleViewDetails(campus)}
                                className="flex items-center w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-blue-50 focus:outline-none focus:bg-blue-50 transition-colors duration-150 group"
                                role="menuitem"
                              >
                                <Eye className="w-4 h-4 mr-3 text-blue-500 group-hover:text-blue-600" />
                                View Details
                              </button>
                              <button
                                onClick={() => handleEdit(campus)}
                                className="flex items-center w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 focus:outline-none focus:bg-gray-50 transition-colors duration-150"
                                role="menuitem"
                              >
                                Edit Campus
                              </button>
                              <button
                                onClick={() => handleDelete(campus.id)}
                                className="flex items-center w-full px-4 py-2 text-left text-sm text-red-700 hover:bg-red-50 focus:outline-none focus:bg-red-50 transition-colors duration-150"
                                role="menuitem"
                              >
                                Delete Campus
                              </button>
                            </div>
                          </Popper>
                        </td>
                      </tr>
                    ))}
                    {filteredCampuses.length === 0 && (
                      <tr>
                        <td colSpan="5" className="px-6 py-12 text-center">
                          <div className="text-gray-500">
                            <div className="mx-auto h-20 w-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mb-4">
                              <Building2 className="w-10 h-10 text-gray-400" />
                            </div>
                            <p className="text-lg font-semibold text-gray-900 mb-2">
                              {searchTerm || filterType !== "ALL" ? "No matching campuses found" : "No Campuses Found"}
                            </p>
                            <p className="text-sm text-gray-600 mb-4">
                              {searchTerm || filterType !== "ALL"
                                ? "Try adjusting your search terms or filters."
                                : "This institution has no campuses registered yet."}
                            </p>
                            {(!searchTerm && filterType === "ALL") && (
                              <button className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg text-sm font-medium hover:from-blue-700 hover:to-blue-800 shadow-sm hover:shadow-md transition-all duration-200">
                                <Plus className="w-4 h-4 mr-2" />
                                Add First Campus
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Enhanced Campus Detail Modal */}
        {isDetailModalOpen && selectedCampus && (
          <Dialog
            isOpen={isDetailModalOpen}
            onClose={closeDetailModal}
            title={selectedCampus.name}
            subtitle="Campus Details & Information"
            icon={Building2}
            variant="default"
            size="xl"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              {/* Left Column */}
              <div className="space-y-4 sm:space-y-6">
                {/* Basic Information */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 sm:p-5 rounded-xl border border-blue-100">
                  <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center">
                    <Building2 className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-blue-600" />
                    Basic Information
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide">Campus Type</label>
                        <span className={`inline-flex px-2 sm:px-3 py-1 text-xs sm:text-sm font-semibold rounded-full mt-1 ${
                          selectedCampus.campus_type === 'MAIN'
                            ? 'bg-gradient-to-r from-green-100 to-green-200 text-green-800'
                            : 'bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800'
                        }`}>
                          {selectedCampus.campus_type}
                        </span>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide">Institutional Code</label>
                        <p className="text-sm text-gray-900 font-mono bg-white/50 px-2 py-1 rounded mt-1 break-all">
                          {selectedCampus.institutional_code || 'Not specified'}
                        </p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide">Year Started</label>
                        <p className="text-sm text-gray-900 flex items-center mt-1">
                          <Calendar className="w-4 h-4 mr-2 text-gray-400 flex-shrink-0" />
                          <span className="truncate">{selectedCampus.year_first_operation || 'Not specified'}</span>
                        </p>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide">Land Area</label>
                        <p className="text-sm text-gray-900 mt-1 truncate">
                          {selectedCampus.land_area_hectares ? `${selectedCampus.land_area_hectares} hectares` : 'Not specified'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Additional Details */}
                <div className="bg-gradient-to-br from-gray-50 to-slate-50 p-4 sm:p-5 rounded-xl border border-gray-100">
                  <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center">
                    <Hash className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-gray-600" />
                    Additional Details
                  </h4>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide">Distance from Main</label>
                        <p className="text-sm text-gray-900 mt-1 truncate">
                          {selectedCampus.distance_from_main_km ? `${selectedCampus.distance_from_main_km} km` : 'Not specified'}
                        </p>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide">Autonomous Status</label>
                        <p className="text-sm text-gray-900 mt-1 truncate">
                          {selectedCampus.autonomous_status || 'Not specified'}
                        </p>
                      </div>
                    </div>
                    {selectedCampus.former_campus_name && (
                      <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide">Former Name</label>
                        <p className="text-sm text-gray-900 italic mt-1 break-words">
                          {selectedCampus.former_campus_name}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-4 sm:space-y-6">
                {/* Location */}
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 sm:p-5 rounded-xl border border-green-100">
                  <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center">
                    <MapPin className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-green-600" />
                    Location & Geography
                  </h4>
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide">Municipality</label>
                        <p className="text-sm text-gray-900 mt-1 break-words">{selectedCampus.municipality}</p>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide">Province</label>
                        <p className="text-sm text-gray-900 mt-1 break-words">{selectedCampus.province}</p>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide">Region</label>
                      <p className="text-sm text-gray-900 mt-1 break-words">{selectedCampus.region}</p>
                    </div>
                    {selectedCampus.latitude && selectedCampus.longitude && (
                      <div className="bg-white/60 p-3 rounded-lg">
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Coordinates</label>
                        <div className="grid grid-cols-2 gap-3 text-sm text-gray-900 mb-3">
                          <div className="truncate font-mono text-xs">Lat: {selectedCampus.latitude.toFixed(6)}</div>
                          <div className="truncate font-mono text-xs">Lng: {selectedCampus.longitude.toFixed(6)}</div>
                        </div>
                        <a
                          href={`https://maps.google.com/?q=${selectedCampus.latitude},${selectedCampus.longitude}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center text-blue-600 hover:text-blue-800 text-sm font-medium group transition-colors duration-200"
                        >
                          <Globe className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform duration-200 flex-shrink-0" />
                          <span className="truncate">View on Google Maps</span>
                          <ExternalLink className="w-3 h-3 ml-1 flex-shrink-0" />
                        </a>
                      </div>
                    )}
                  </div>
                </div>

                {/* Leadership */}
                <div className="bg-gradient-to-br from-purple-50 to-indigo-50 p-4 sm:p-5 rounded-xl border border-purple-100">
                  <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center">
                    <User className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-purple-600" />
                    Campus Leadership
                  </h4>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide">Campus Head</label>
                      <p className="text-sm font-semibold text-gray-900 mt-1 break-words">
                        {selectedCampus.head_name || 'Not assigned'}
                      </p>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide">Position</label>
                      <p className="text-sm text-gray-900 mt-1 break-words">
                        {selectedCampus.head_title || 'No title specified'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row justify-end gap-3 pt-4 sm:pt-6 border-t border-gray-200">
              <button
                onClick={closeDetailModal}
                className="w-full sm:w-auto px-4 sm:px-6 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
              >
                Close
              </button>
              <button
                onClick={() => handleEdit(selectedCampus)}
                className="w-full sm:w-auto px-4 sm:px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-sm font-medium rounded-lg hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-sm hover:shadow-md transition-all duration-200"
              >
                Edit Campus
              </button>
            </div>
          </Dialog>
        )}
      </div>
    </div>
  );
}

SucCampuses.propTypes = {
  // No props required since data is fetched internally
};

export default SucCampuses;
