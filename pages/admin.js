import React, { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage, setFieldValue } from "formik";
import * as Yup from "yup";
import { db, storage } from "../firebase/initFireBase";
import { ref, uploadBytes } from "firebase/storage";
import { updateDoc, doc } from "firebase/firestore";
const validationSchema = Yup.object().shape({
  location: Yup.string().required("Location is required"),
  propertyType: Yup.string().required("property type is required"),
  listDate: Yup.date().required("date is required"),
  listPrice: Yup.number().required("list price is required"),
  sqft: Yup.number().required("sqft is required"),
  lotSize: Yup.number().required("lot size is required"),
  beds: Yup.number().required("beds is required"),
  baths: Yup.number().required("baths is required"),
  built: Yup.number().required("built is required"),
});

const Admin = () => {
  const initialValues = {
    actualPrice: "",
    location: "",
    propertyType: "",
    listDate: "",
    listPrice: "",
    sqft: "",
    lotSize: "",
    beds: "",
    baths: "",
    built: "",
  };
  // Add the useEffect hook

  const [selectedImages, setSelectedImages] = useState({
    image1: null,
    image2: null,
    image3: null,
  });
  const handleImageChange = (fieldName, event) => {
    const file = event.currentTarget.files[0];
    setSelectedImages((prevState) => ({
      ...prevState,
      [fieldName]: file,
    }));
  };

  const handleSubmit = async (values) => {
    const formDataRef = doc(db, "olist", "olisddoc");
    for (const fieldName in selectedImages) {
      const image = selectedImages[fieldName];

      const imageRef = ref(storage, `/images/${fieldName}`);
      //initiates the firebase side uploading
      uploadBytes(imageRef, image).then(() => {
        updateDoc(formDataRef, values);
        alert("image uploaded");
      });
    }
  };

  return (
    <>
      <div className="flex justify-center items-center h-screen">
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          <Form className="w-full max-w-lg flex flex-col items-center">
            <div className="block md:flex w-full space-x-4 mt-4">
              {Object.entries(selectedImages).map(([fieldName, image]) => (
                <div key={fieldName}>
                  <label className="w-64 flex flex-col items-center px-4 py-6 bg-sky-300 text-blue rounded-lg shadow-lg tracking-wide uppercase border border-blue cursor-pointer hover:bg-blue hover:text-white">
                    <img
                      src={image ? URL.createObjectURL(image) : ""}
                      alt={`Image ${fieldName}`}
                      className="w-16 h-16"
                    />
                    <span className="mt-2 text-base leading-normal">
                      Select Image {fieldName.charAt(fieldName.length - 1)}
                    </span>
                    <input
                      type="file"
                      id={fieldName}
                      name={fieldName}
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleImageChange(fieldName, e)}
                    />
                  </label>
                </div>
              ))}
            </div>

            <div className="flex w-full flex-wrap -mx-3 mt-8 mb-6">
              <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                <label
                  className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                  for="grid-first-name"
                >
                  Location
                </label>
                <Field
                  className="appearance-none block w-full bg-gray-200 text-gray-700  rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                  type="text"
                  id="location"
                  name="location"
                />
                <ErrorMessage
                  name="location"
                  component="p"
                  className="text-red-500 text-xs italic"
                />
              </div>
              <div className="w-full md:w-1/2 px-3">
                <label
                  className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                  for="grid-last-name"
                >
                  Property Type
                </label>
                <Field
                  className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                  type="text"
                  id="propertyType"
                  name="propertyType"
                />
                <ErrorMessage
                  name="propertyType"
                  component="p"
                  className="text-red-500 text-xs italic"
                />
              </div>
            </div>

            <div className="flex w-full flex-wrap -mx-3 mb-2">
              <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
                <label
                  className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                  for="grid-city"
                >
                  List Date
                </label>
                <Field
                  className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                  type="date"
                  id="listDate"
                  name="listDate"
                />
                <ErrorMessage
                  name="listDate"
                  component="p"
                  className="text-red-500 text-xs italic"
                />
              </div>
              <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
                <label
                  className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                  for="grid-city"
                >
                  List Price
                </label>
                <Field
                  className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                  type="number"
                  id="listPrice"
                  name="listPrice"
                />
                <ErrorMessage
                  name="listPrice"
                  component="p"
                  className="text-red-500 text-xs italic"
                />
              </div>

              <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
                <label
                  className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                  for="grid-city"
                >
                  Actual Price
                </label>
                <Field
                  className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                  type="number"
                  id="actualPrice"
                  name="actualPrice"
                />
                <ErrorMessage
                  name="actualPrice"
                  component="p"
                  className="text-red-500 text-xs italic"
                />
              </div>
            </div>

            <div className="flex flex-wrap -mx-3 mb-2">
              <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
                <label
                  className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                  for="grid-city"
                >
                  Sqft
                </label>
                <Field
                  className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                  type="number"
                  id="sqft"
                  name="sqft"
                />
                <ErrorMessage
                  name="sqft"
                  component="p"
                  className="text-red-500 text-xs italic"
                />
              </div>
              <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
                <label
                  className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                  for="grid-city"
                >
                  Lot Size
                </label>
                <Field
                  className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                  type="number"
                  id="lotSize"
                  name="lotSize"
                />
                <ErrorMessage
                  name="lotSize"
                  component="p"
                  className="text-red-500 text-xs italic"
                />
              </div>
            </div>

            <div className="flex flex-wrap -mx-3 mb-2">
              <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
                <label
                  className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                  for="grid-city"
                >
                  Beds
                </label>
                <Field
                  className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                  type="number"
                  id="beds"
                  name="beds"
                />
                <ErrorMessage
                  name="beds"
                  component="p"
                  className="text-red-500 text-xs italic"
                />
              </div>
              <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
                <label
                  className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                  for="grid-city"
                >
                  BATHS
                </label>
                <Field
                  className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                  type="number"
                  id="baths"
                  name="baths"
                />
                <ErrorMessage
                  name="baths"
                  component="p"
                  className="text-red-500 text-xs italic"
                />
              </div>
              <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
                <label
                  className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                  for="grid-zip"
                >
                  Built
                </label>
                <Field
                  className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                  type="number"
                  id="built"
                  name="built"
                />
                <ErrorMessage
                  name="built"
                  component="p"
                  className="text-red-500 text-xs italic"
                />
              </div>
            </div>

            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Submit
            </button>
          </Form>
        </Formik>
      </div>
    </>
  );
};

export default Admin;
