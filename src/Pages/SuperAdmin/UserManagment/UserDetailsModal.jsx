import {
    User,
    UserCheck,
    UserX,
    Shield,
    Mail,
    Building,
    Calendar,
    CheckCircle,
} from "lucide-react";
import PropTypes from "prop-types";
import Dialog from "../../../Components/Dialog";

const UserDetailsModal = ({ isOpen, onClose, userData }) => {
    if (!isOpen || !userData) return null;

    const getRoleColor = (role) => {
        switch (role?.toLowerCase()) {
            case "super-admin":
                return "bg-gradient-to-r from-red-100 to-red-200 text-red-800 border border-red-300";
            case "hei-admin":
                return "bg-gradient-to-r from-purple-100 to-purple-200 text-purple-800 border border-purple-300";
            case "hei-staff":
                return "bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 border border-blue-300";
            default:
                return "bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 border border-gray-300";
        }
    };

    const getRoleIcon = (role) => {
        switch (role?.toLowerCase()) {
            case "super-admin":
            case "hei-admin":
            case "admin":
                return <Shield className="w-3 h-3" />;
            case "hei-staff":
            case "moderator":
                return <UserCheck className="w-3 h-3" />;
            case "user":
                return <User className="w-3 h-3" />;
            default:
                return <User className="w-3 h-3" />;
        }
    };

    const formatRoleDisplay = (role) => {
        if (!role) return "N/A";

        return role
            .split("-")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ");
    };

    return (
        <Dialog
            isOpen={isOpen}
            onClose={onClose}
            title="User Details"
            subtitle="View comprehensive user information and account status"
            icon={User}
            variant="default"
            size="lg"
        >
            <div className="space-y-4 max-h-[600px] overflow-y-auto p-4">
                {/* Profile Header */}
                <div className="bg-gradient-to-br from-slate-50 via-gray-50 to-blue-100 rounded-xl p-4 border border-slate-200/60 shadow-sm">
                    <div className="flex items-center space-x-4">
                        <div className="relative">
                            <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
                                {userData.profile_image ? (
                                    <img
                                        src={userData.profile_image}
                                        alt={userData.name}
                                        className="w-16 h-16 rounded-full object-cover border-3 border-white shadow-sm"
                                    />
                                ) : (
                                    <User className="w-8 h-8 text-white" />
                                )}
                            </div>
                            {userData.status === "active" && (
                                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                                    <CheckCircle className="w-3 h-3 text-white" />
                                </div>
                            )}
                        </div>
                        <div className="flex-1">
                            <h4 className="text-xl font-semibold text-gray-900 mb-1">
                                {userData.name || "N/A"}
                            </h4>
                            <div className="flex items-center text-gray-600 mb-2">
                                <Mail className="w-4 h-4 mr-2" />
                                <span className="text-sm">
                                    {userData.email || "N/A"}
                                </span>
                            </div>
                            <div className="flex items-center space-x-3">
                                <span
                                    className={`inline-flex items-center px-2.5 py-1 text-xs font-semibold rounded-full ${getRoleColor(
                                        userData.role
                                    )}`}
                                >
                                    {getRoleIcon(userData.role)}
                                    <span className="ml-1">
                                        {formatRoleDisplay(userData.role)}
                                    </span>
                                </span>
                                <span
                                    className={`inline-flex items-center px-2.5 py-1 text-xs font-semibold rounded-full ${
                                        userData.status === "active"
                                            ? "bg-gradient-to-r from-green-100 to-green-200 text-green-800 border border-green-300"
                                            : "bg-gradient-to-r from-red-100 to-red-200 text-red-800 border border-red-300"
                                    }`}
                                >
                                    {userData.status === "active" ? (
                                        <UserCheck className="w-3 h-3" />
                                    ) : (
                                        <UserX className="w-3 h-3" />
                                    )}
                                    <span className="ml-1 capitalize">
                                        {userData.status || "N/A"}
                                    </span>
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Account Information */}
                <div className="bg-gradient-to-br from-purple-50 via-violet-50 to-indigo-100 rounded-xl p-4 border border-purple-200/60 shadow-sm">
                    <div className="flex items-center space-x-3 mb-3">
                        <div className="p-2 bg-purple-500 rounded-lg shadow-sm">
                            <Shield className="w-5 h-5 text-white" />
                        </div>
                        <h3 className="text-base font-semibold text-gray-900">
                            Account Information
                        </h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                User Role
                            </label>
                            <div className="p-3 bg-white/60 backdrop-blur-sm rounded-lg border border-purple-200/40">
                                <p className="text-sm font-medium text-gray-900">
                                    {formatRoleDisplay(userData.role)}
                                </p>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Account Status
                            </label>
                            <div className="p-3 bg-white/60 backdrop-blur-sm rounded-lg border border-purple-200/40">
                                <p className="text-sm font-medium text-gray-900 capitalize">
                                    {userData.status || "N/A"}
                                </p>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Email Verification
                            </label>
                            <div className="p-3 bg-white/60 backdrop-blur-sm rounded-lg border border-purple-200/40">
                                <span
                                    className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${
                                        userData.email_verified_at
                                            ? "bg-gradient-to-r from-green-100 to-green-200 text-green-800"
                                            : "bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-800"
                                    }`}
                                >
                                    {userData.email_verified_at ? (
                                        <CheckCircle className="w-3 h-3 mr-1" />
                                    ) : (
                                        <UserX className="w-3 h-3 mr-1" />
                                    )}
                                    {userData.email_verified_at
                                        ? "Verified"
                                        : "Pending"}
                                </span>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                User ID
                            </label>
                            <div className="p-3 bg-white/60 backdrop-blur-sm rounded-lg border border-purple-200/40">
                                <p className="text-sm font-mono text-gray-700">
                                    {userData.id || "N/A"}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Institution Information */}
                <div className="bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-100 rounded-xl p-4 border border-amber-200/60 shadow-sm">
                    <div className="flex items-center space-x-3 mb-3">
                        <div className="p-2 bg-amber-500 rounded-lg shadow-sm">
                            <Building className="w-5 h-5 text-white" />
                        </div>
                        <h3 className="text-base font-semibold text-gray-900">
                            Institution Details
                        </h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Institution Name
                            </label>
                            <div className="p-3 bg-white/60 backdrop-blur-sm rounded-lg border border-amber-200/40">
                                <p className="text-sm font-medium text-gray-900">
                                    {userData.hei?.name ||
                                        "No institution assigned"}
                                </p>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Institution ID
                            </label>
                            <div className="p-3 bg-white/60 backdrop-blur-sm rounded-lg border border-amber-200/40">
                                <p className="text-sm font-mono text-gray-700">
                                    {userData.hei_uiid || "N/A"}
                                </p>
                            </div>
                        </div>

                        {userData.hei?.type && (
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Institution Type
                                </label>
                                <div className="p-3 bg-white/60 backdrop-blur-sm rounded-lg border border-amber-200/40">
                                    <p className="text-sm font-medium text-gray-900">
                                        {userData.hei.type}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Timeline Information */}
                <div className="bg-gradient-to-br from-emerald-50 via-green-50 to-teal-100 rounded-xl p-4 border border-emerald-200/60 shadow-sm">
                    <div className="flex items-center space-x-3 mb-3">
                        <div className="p-2 bg-emerald-500 rounded-lg shadow-sm">
                            <Calendar className="w-5 h-5 text-white" />
                        </div>
                        <h3 className="text-base font-semibold text-gray-900">
                            Timeline Information
                        </h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Account Created
                            </label>
                            <div className="p-3 bg-white/60 backdrop-blur-sm rounded-lg border border-emerald-200/40">
                                <p className="text-sm font-medium text-gray-900">
                                    {userData.created_at
                                        ? new Date(
                                              userData.created_at
                                          ).toLocaleDateString("en-US", {
                                              year: "numeric",
                                              month: "long",
                                              day: "numeric",
                                          })
                                        : "N/A"}
                                </p>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Last Updated
                            </label>
                            <div className="p-3 bg-white/60 backdrop-blur-sm rounded-lg border border-emerald-200/40">
                                <p className="text-sm font-medium text-gray-900">
                                    {userData.updated_at
                                        ? new Date(
                                              userData.updated_at
                                          ).toLocaleDateString("en-US", {
                                              year: "numeric",
                                              month: "long",
                                              day: "numeric",
                                          })
                                        : "N/A"}
                                </p>
                            </div>
                        </div>

                        {userData.email_verified_at && (
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Email Verified On
                                </label>
                                <div className="p-3 bg-white/60 backdrop-blur-sm rounded-lg border border-emerald-200/40">
                                    <p className="text-sm font-medium text-gray-900">
                                        {new Date(
                                            userData.email_verified_at
                                        ).toLocaleDateString("en-US", {
                                            year: "numeric",
                                            month: "long",
                                            day: "numeric",
                                            hour: "2-digit",
                                            minute: "2-digit",
                                        })}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Close Button */}
                <div className="flex justify-end pt-4 border-t border-gray-200">
                    <button
                        onClick={onClose}
                        className="px-6 py-2.5 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-lg hover:from-gray-700 hover:to-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 shadow-sm hover:shadow-md transition-all duration-200 font-medium"
                    >
                        Close
                    </button>
                </div>
            </div>
        </Dialog>
    );
};

UserDetailsModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    userData: PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        name: PropTypes.string,
        email: PropTypes.string,
        role: PropTypes.string,
        status: PropTypes.oneOf(["active", "inactive"]),
        profile_image: PropTypes.string,
        created_at: PropTypes.string,
        updated_at: PropTypes.string,
        email_verified_at: PropTypes.string,
        hei_uiid: PropTypes.string,
        hei: PropTypes.shape({
            name: PropTypes.string,
            type: PropTypes.string,
        }),
    }),
};

export default UserDetailsModal;
