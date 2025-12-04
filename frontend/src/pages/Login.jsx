import { Formik, Form, Field, ErrorMessage } from "formik";
import { loginSchema } from "../validations/auth.validation";
import { useLogin } from "../hooks/useLogin";
import { Eye, EyeClosed } from "lucide-react";
import { useState } from "react";
import { INPUT_STYLE } from "../styles/constents";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const loginMutation = useLogin();

  return (
    <div className="min-h-screen flex items-center justify-center bg-lightblue p-3">
      <h1 className="absolute -top-2 left-30 font-bold text-blue-900 text-4xl">
        THIJAR
      </h1>

      <Formik
        initialValues={{ emailOrPhone: "", password: "" }}
        validationSchema={loginSchema}
        onSubmit={(values) => {
          loginMutation.mutate(values);
        }}
      >
        {({ errors, touched, handleChange }) => (
          <Form className="rounded-2xl p-8 w-md bg-white shadow-xl" noValidate>
            <h1 className="text-black font-black text-3xl mb-1 text-center">
              Welcome Back
            </h1>
            <h6 className="text-blue-500 mb-6 text-center">Log in your POS</h6>

            {/* Email or Phone */}
            <label className="block text-black font-semibold mb-1">
              Email or Phone Number
            </label>
            <Field
              name="emailOrPhone"
              type="text"
              placeholder="Enter your Email or Mobile Number"
              className={`${INPUT_STYLE} ${
                errors.emailOrPhone && touched.emailOrPhone
                  ? "border-red-500"
                  : "border-gray-300"
              }`}
              onChange={(e) => {
                handleChange(e);
                loginMutation.reset();
              }}
            />
            <ErrorMessage
              name="emailOrPhone"
              component="p"
              className="text-red-600 text-sm mb-2"
            />

            {/* Password */}
            <label className="block text-black font-semibold mb-1">
              Password
            </label>
            <div className="relative">
              <Field
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                className={`${INPUT_STYLE}   ${
                  errors.password && touched.password
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
                onChange={(e) => {
                  handleChange(e);
                  loginMutation.reset();
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-black hover:text-blue-900"
                tabIndex={-1}
              >
                {showPassword ? <Eye className="w-5 h-5" /> : <EyeClosed className="w-5 h-5" />}
              </button>
            </div>
            <ErrorMessage
              name="password"
              component="p"
              className="text-red-600 text-sm mb-2"
            />
            {loginMutation.isError && (
              <p className="text-red-600 text-sm mt-2 text-center">
                {loginMutation.error?.response?.data?.message ||
                  "Login failed. Try again."}
              </p>
            )}
            <button
              type="submit"
              className="mt-6 w-full bg-blue-900 text-white font-semibold text-md rounded-md py-3 hover:bg-blue-800 transition-colors duration-500"
              disabled={loginMutation.isPending}
            >
              {loginMutation.isPending ? "Signing in..." : "Sign in"}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
}
