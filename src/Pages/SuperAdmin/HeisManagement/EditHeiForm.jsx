import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Dialog from '../../../Components/Dialog';

function EditHeiForm({ isOpen, onClose, onSave, heiData, loading }) {
    const [formData, setFormData] = useState({
        id: '',
        uiid: '',
        name: '',
        type: 'SUC',
    });
    const [formErrors, setFormErrors] = useState({});

    useEffect(() => {
        if (isOpen && heiData) {
            setFormData({
                id: heiData.id || '',
                uiid: heiData.uiid || '',
                name: heiData.name || '',
                type: heiData.type || 'SUC',
            });
        } else if (!isOpen) {
            // Reset form when modal closes
            setFormData({
                id: '',
                uiid: '',
                name: '',
                type: 'SUC',
            });
            setFormErrors({});
        }
    }, [isOpen, heiData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const validateForm = () => {
        let errors = {};
        if (!formData.uiid) errors.uiid = 'UIID is required';
        if (!formData.name) errors.name = 'Name is required';
        if (!formData.type) errors.type = 'Type is required';
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validateForm()) {
            await onSave(formData);
        }
    };

    return (
        <Dialog isOpen={isOpen} onClose={onClose} title="Edit HEI Details">
            <form onSubmit={handleSubmit} className="p-4">
                <div className="space-y-4">
                    <div>
                        <label htmlFor="uiid" className="block text-sm font-medium text-gray-700">UIID</label>
                        <input
                            type="text"
                            id="uiid"
                            name="uiid"
                            value={formData.uiid}
                            onChange={handleChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Enter HEI UIID"
                        />
                        {formErrors.uiid && <p className="mt-1 text-sm text-red-600">{formErrors.uiid}</p>}
                    </div>
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">HEI Name</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Enter HEI Name"
                        />
                        {formErrors.name && <p className="mt-1 text-sm text-red-600">{formErrors.name}</p>}
                    </div>
                    <div>
                        <label htmlFor="type" className="block text-sm font-medium text-gray-700">Type</label>
                        <select
                            id="type"
                            name="type"
                            value={formData.type}
                            onChange={handleChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="SUC">SUC</option>
                            <option value="LUC">LUC</option>
                            <option value="Private">Private</option>
                        </select>
                        {formErrors.type && <p className="mt-1 text-sm text-red-600">{formErrors.type}</p>}
                    </div>
                </div>

                <div className="mt-6 flex justify-end space-x-3">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-1"
                        disabled={loading}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 disabled:opacity-50"
                        disabled={loading}
                    >
                        {loading ? 'Updating...' : 'Update HEI'}
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
    heiData: PropTypes.shape({
        id: PropTypes.string,
        uiid: PropTypes.string,
        name: PropTypes.string,
        type: PropTypes.string
    })
};

export default EditHeiForm;
