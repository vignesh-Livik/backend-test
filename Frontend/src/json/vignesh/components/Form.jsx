import { ImagePlus, MapPinPlus } from "lucide-react";
import LocationMap from "./LocationMap";
import Field from "./Field";
import { useEffect, useState } from "react";
import { API, BACKEND_URL } from "./Utils";
import { toast } from "react-toastify";
import geocodeAddress from "./geocodeAddress";
import axios from "axios";

const Form = ({ data = null, formType, onClose, updateUI, autoId }) => {
  const isView = formType === 'view';
  const [showMap, setShowMap] = useState(false);

  const [imageFile, setImageFile] = useState(null);

  const [previewImg, setPreviewImg] = useState(
    data?.image || 'default-profile.jpg',
  );

  const [formData, setFormData] = useState({
    id: data?.id || '',
    name: data?.name || '',
    username: data?.username || '',
    email: data?.email || '',
    street: data?.address?.street || '',
    suite: data?.address?.suite || '',
    city: data?.address?.city || '',
    zipcode: data?.address?.zipcode || '',
    lat: data?.address?.geo?.lat || '',
    lng: data?.address?.geo?.lng || '',
    phone: data?.phone || '',
    website: data?.website || '',
    cname: data?.company?.name || '',
    catchPhrase: data?.company?.catchPhrase || '',
    bs: data?.company?.bs || '',
    image: '',
    landmark: '',
  });
  useEffect(() => {
    if (
      (formType === 'edit' || formType === 'view') &&
      formData.lat &&
      formData.lng
    ) {
      setShowMap(true);
    }
  }, [formType]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImageFile(file);
    setPreviewImg(URL.createObjectURL(file));
  };

  const handleSearchLocation = async () => {
    try {
      if (!formData.city || !formData.zipcode) {
        toast.error('Please enter City and Zipcode');
        return;
      }

      const address = `${formData.city}, ${formData.zipcode}`;
      const coords = await geocodeAddress(address);

      if (!coords) {
        toast.error('Location not found');
        return;
      }

      setFormData((prev) => ({
        ...prev,
        lat: coords.lat,
        lng: coords.lng,
      }));

      setShowMap(true);
      toast.success('Location found! Adjust pin for exact coordinates store.');
    } catch (err) {
      toast.error('Unable to fetch location');
    }
  };

  const handleForm = async (e) => {
    e.preventDefault();
    try {
      let imageUrl = previewImg;

      if (imageFile) {
        const fd = new FormData();
        fd.append('image', imageFile);

        const res = await axios.post(`${BACKEND_URL}/api/img-upload`, fd);
        imageUrl = res.data.imageName;
      }
      const payLoadData = {
        id: formType === 'edit' ? formData.id : autoId.toString(),
        name: formData.name,
        username: formData.username,
        email: formData.email,
        address: {
          street: formData.street,
          suite: formData.suite,
          city: formData.city,
          zipcode: formData.zipcode,
          geo: {
            lat: formData.lat,
            lng: formData.lng,
          },
        },
        phone: formData.phone,
        website: formData.website,
        company: {
          name: formData.cname,
          catchPhrase: formData.catchPhrase,
          bs: formData.bs,
        },
        image: imageUrl,
      };
      console.log(payLoadData);
      if (formType === 'edit') {
        await API.put(`/users/${payLoadData.id}`, payLoadData);
      } else {
        await API.post('/users', payLoadData);
      }
      updateUI(formType, payLoadData);
    } catch (err) {
      console.error(err);
      const message =
        err.response?.data?.message || err.message || 'Something went wrong';
      toast.error(message);
    } finally {
      onClose();
    }
  };
  return (
    <form
      onSubmit={handleForm}
      className="flex flex-col gap-4">
      <section className="flex flex-col items-center gap-3">
        <div className="relative w-32 h-32">
          <img
            src={
              previewImg.startsWith('blob:')
                ? previewImg
                : `${BACKEND_URL}/upload/${previewImg}`
            }
            alt="profile"
            className="w-32 h-32 rounded-full object-cover border"
          />

          {!isView && (
            <label
              htmlFor="image-upload"
              className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-full cursor-pointer opacity-0 hover:opacity-100 transition">
              <ImagePlus className="text-white w-8 h-8" />
            </label>
          )}

          <input
            id="image-upload"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageChange}
          />
        </div>

        {!isView && (
          <p className="text-sm text-gray-500">Click image to upload</p>
        )}
      </section>

      <section>
        <h3 className="section-title mt-2">Main Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {formType !== 'add' && (
            <Field
              name="id"
              label="User ID"
              value={formData.id}
              readOnly={formType !== 'add'}
              onChange={handleChange}
            />
          )}
          <Field
            name="name"
            label="Name"
            value={formData.name}
            readOnly={isView}
            onChange={handleChange}
          />
          <Field
            name="username"
            label="Username"
            value={formData.username}
            readOnly={isView}
            onChange={handleChange}
          />
          <Field
            name="email"
            label="Email"
            value={formData.email}
            readOnly={isView}
            onChange={handleChange}
          />
        </div>
      </section>

      <section>
        <h3 className="section-title">Address</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field
            name="street"
            label="Street"
            value={formData.street}
            readOnly={isView}
            onChange={handleChange}
          />
          <Field
            name="suite"
            label="Suite"
            value={formData.suite}
            readOnly={isView}
            onChange={handleChange}
          />
          <Field
            name="city"
            label="City"
            value={formData.city}
            readOnly={isView}
            onChange={handleChange}
          />
          <Field
            name="zipcode"
            label="Zipcode"
            value={formData.zipcode}
            readOnly={isView}
            onChange={handleChange}
          />
        </div>
      </section>

      <section>
        <h3 className="section-title">Geo Location</h3>

        {formType === 'add' && !showMap && (
          <button
            type="button"
            onClick={handleSearchLocation}
            className="w-full h-30 flex flex-col gap-4 justify-center items-center mt-4 text-blue-400 border border-dashed border-blue-300 rounded hover:bg-blue-50"
            title="Locate on Map">
            <p>Add Location</p>
            <MapPinPlus size={20} />
          </button>
        )}

        {showMap && formData.lat && formData.lng && (
          <>
            <div className="mt-4">
              <LocationMap
                lat={formData.lat}
                lng={formData.lng}
                onChange={(lat, lng) =>
                  setFormData((prev) => ({
                    ...prev,
                    lat: lat.toString(),
                    lng: lng.toString(),
                  }))
                }
                readOnly={isView}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <Field
                name="lat"
                label="Latitude"
                value={formData.lat}
                readOnly
              />
              <Field
                name="lng"
                label="Longitude"
                value={formData.lng}
                readOnly
              />
            </div>
          </>
        )}
      </section>
      <section>
        <h3 className="section-title">Contact</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field
            name="phone"
            label="Phone"
            value={formData.phone}
            readOnly={isView}
            onChange={handleChange}
          />
          <Field
            name="website"
            label="Website"
            value={formData.website}
            readOnly={isView}
            onChange={handleChange}
          />
        </div>
      </section>

      <section>
        <h3 className="section-title">Company</h3>
        <div className="grid grid-cols-1 gap-4">
          <Field
            name="cname"
            label="Company Name"
            value={formData.cname}
            readOnly={isView}
            onChange={handleChange}
          />
          <Field
            name="catchPhrase"
            label="Catch Phrase"
            value={formData.catchPhrase}
            readOnly={isView}
            onChange={handleChange}
          />
          <Field
            name="bs"
            label="Business Strategy"
            value={formData.bs}
            readOnly={isView}
            onChange={handleChange}
          />
        </div>
      </section>
      <section className="my-7 flex justify-center gap-6">
        <button
          type="button"
          onClick={onClose}
          className="flex-1 px-6 py-2 text-md border rounded-md bg-gray-600 text-white hover:bg-gray-700">
          Cancel
        </button>
        {!isView && (
          <button
            type="submit"
            className="flex-1 px-6 py-2 text-md bg-red-400 text-white rounded-md hover:bg-red-500">
            Submit
          </button>
        )}
      </section>
    </form>
  );
};
export default Form