import { X } from "lucide-react";
import { Formik } from "formik";
import * as Yup from "yup";
import { Input } from "../../../ui/input";
import AppModal from "../../../ui/modal";
import { useMutation } from "@tanstack/react-query";
import { addCategoryAPI } from "../../../../api/modules/category.api";

// Header
const Header = ({ onClose }) => (
  <div className="flex justify-end bg-transparent px-3 pt-3 rounded-t-md">
    <button type="button" onClick={onClose}>
      <X className="w-5 h-5 text-gray-600 hover:text-gray-800" />
    </button>
  </div>
);

// Validation schema
const CategorySchema = Yup.object().shape({
  name: Yup.string()
    .trim()
    .min(2, "Minimum 2 characters required")
    .max(50, "Maximum 50 characters allowed")
    .required("Category name is required"),
});

export default function AddCategory({ open, onClose, onSave }) {
  const createCatagory = useMutation({
    mutationFn: (data) => addCategoryAPI(data),
  });
  return (
    <AppModal open={open} onClose={onClose} width="max-w-md" Header={Header}>
      <Formik
        initialValues={{ name: "" }}
        validationSchema={CategorySchema}
        onSubmit={(values, { resetForm }) => {
          const payload = { name: values.name.trim() };
          createCatagory.mutate(payload, {
            onSuccess: (res) => {
              if (onSave) onSave(res.data.data);
              resetForm();
              onClose();
            },
          });
        }}
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          handleSubmit,
        }) => (
          <form onSubmit={handleSubmit}>
            <div className="px-8 pb-6 space-y-4">
              <h2 className="text-xl font-semibold text-gray-900">
                Add Category
              </h2>

              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-700">
                  Enter Category Name
                </p>

                <Input
                  name="name"
                  value={values.name}
                  onChange={(e) => {
                    handleChange(e);
                    if (createCatagory.isError) createCatagory.reset();
                  }}
                  onBlur={handleBlur}
                  placeholder="eg: Grocery"
                  className={`w-full h-[36px] `}
                />

                {errors.name && touched.name && (
                  <p className="text-red-500 text-xs">{errors.name}</p>
                )}
              </div>

              {createCatagory.isError && (
                <p className="text-red-600 text-sm mt-2 text-center">
                  {createCatagory.error?.response?.data?.message}
                </p>
              )}

              <button
                type="button"
                onClick={() => {
                  handleSubmit();
                }}
                className="w-full rounded-full bg-blue-900 text-white py-2 text-base font-sans hover:bg-blue-800 transition"
              >
                {createCatagory.isPending
                  ? "Adding Category.."
                  : "Add Category"}
              </button>
            </div>
          </form>
        )}
      </Formik>
    </AppModal>
  );
}
