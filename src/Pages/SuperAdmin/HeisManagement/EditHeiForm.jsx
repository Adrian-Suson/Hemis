import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Dialog from '../../../Components/Dialog';

function EditHeiForm({ isOpen, onClose, onSave, hei, loading, clusters }) {
    const [formData, setFormData] = useState({
        uiid: "",
        name: "",
        type: "SUC",
        cluster_id: "",
    });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (hei) {
            setFormData({
                uiid: hei.uiid || "",
                name: hei.name || "",
                type: hei.type || "SUC",
                cluster_id: hei.cluster_id || "",
            });
        }
    }, [hei]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors((prev) => ({
                ...prev,
                [name]: "",
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.uiid.trim()) {
            newErrors.uiid = "UIID is required";
        }
        if (!formData.name.trim()) {
            newErrors.name = "Name is required";
        }
        if (!formData.cluster_id) {
            newErrors.cluster_id = "Cluster is required";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validateForm()) {
            await onSave(formData);
        }
    };

    return (
        <Dialog isOpen={isOpen} onClose={onClose} title="Edit HEI">
            <form onSubmit={handleSubmit} className="p-4">
                <div className="space-y-4">
                    <div>
                        <label
                            htmlFor="uiid"
                            className="block text-sm font-medium text-gray-700"
                        >
                            UIID
                        </label>
                        <input
                            type="text"
                            id="uiid"
                            name="uiid"
                            value={formData.uiid}
                            onChange={handleChange}
                            className={`mt-1 block w-full rounded-md border ${
                                errors.uiid
                                    ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                                    : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                            } shadow-sm p-2`}
                        />
                        {errors.uiid && (
                            <p className="mt-1 text-sm text-red-600">{errors.uiid}</p>
                        )}
                    </div>

                    <div>
                        <label
                            htmlFor="name"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Institution Name
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className={`mt-1 block w-full rounded-md border ${
                                errors.name
                                    ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                                    : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                            } shadow-sm p-2`}
                        />
                        {errors.name && (
                            <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                        )}
                    </div>

                    <div>
                        <label
                            htmlFor="type"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Type
                        </label>
                        <select
                            id="type"
                            name="type"
                            value={formData.type}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2 focus:border-blue-500 focus:ring-blue-500"
                        >
                            <option value="SUC">SUC</option>
                            <option value="LUC">LUC</option>
                            <option value="Private">Private</option>
                        </select>
                    </div>

                    <div>
                        <label
                            htmlFor="cluster_id"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Cluster
                        </label>
                        <select
                            id="cluster_id"
                            name="cluster_id"
                            value={formData.cluster_id}
                            onChange={handleChange}
                            className={`mt-1 block w-full rounded-md border ${
                                errors.cluster_id
                                    ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                                    : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                            } shadow-sm p-2`}
                        >
                            <option value="">Select a cluster</option>
                            {clusters.map((cluster) => (
                                <option key={cluster.id} value={cluster.id}>
                                    {cluster.name}
                                </option>
                            ))}
                        </select>
                        {errors.cluster_id && (
                            <p className="mt-1 text-sm text-red-600">{errors.cluster_id}</p>
                        )}
                    </div>
                </div>

                <div className="mt-6 flex justify-end space-x-3">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? "Saving..." : "Save Changes"}
                    </button>
                </div>
            </form>
        </Dialog>
    );
}

EditHeiForm.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired,
    loading: PropTypes.bool.isRequired,
    hei: PropTypes.shape({
        uiid: PropTypes.string,
        name: PropTypes.string,
        type: PropTypes.string,
        cluster_id: PropTypes.string
    }),
    clusters: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired
    }))
};

export default EditHeiForm;
