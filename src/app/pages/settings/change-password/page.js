"use client"
import { updatePassword } from "@/app/redux/slices/authSlice"
import { useDispatch } from "react-redux"
import { useState } from "react"
import Cookies from "js-cookie"
import * as yup from "yup"
import { useFormik } from "formik"
import toast from "react-hot-toast"
import { getEncryptedLocalData } from "@/app/api/auth"

const passwordSchema = yup.object().shape({
  oldPassword: yup.string().required('Current password is required'),
  newPassword: yup.string()
    .required('New password is required')
    .min(4, 'Password must be at least 4 characters')
    .notOneOf([yup.ref('oldPassword')], 'New password must be different from current password'),
  confirmPassword: yup.string()
    .required('Please confirm your password')
    .oneOf([yup.ref('newPassword')], 'Passwords must match')
})

export default function ChangePassword() {
  const dispatch = useDispatch()
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  const formik = useFormik({
    initialValues: {
      oldPassword: '',
      newPassword: '',
      confirmPassword: ''
    },
    validationSchema: passwordSchema,
    onSubmit: async (values) => {
      try {
        setIsLoading(true)
        setError(null)
       
        const data = {
          userId: getEncryptedLocalData("AuthLogin"),
          oldPassword: values.oldPassword,
          newPass: values.newPassword
        }

        const result = await dispatch(updatePassword(data)).unwrap();
        if (result.statusCode === 200) {
          toast.success(result.message)
        } else if(result.statusCode === 409) {
          toast.error(result.message);
        }

        if (result.error) {
          throw new Error(result.error.message || 'Password update failed')
        }
        formik.resetForm()
      } catch (err) {
        setError(err.message || 'An error occurred while updating password')
      } finally {
        setIsLoading(false)
      }
    }
  })

  return (
    <form className="px-6 mt-3 space-y-4" onSubmit={formik.handleSubmit}>
      <div>
        <label htmlFor="oldPassword" className="block mb-1 text-sm font-medium">
          Current Password
        </label>
        <input
          type="password"
          id="oldPassword"
          name="oldPassword"
          className="w-full border p-2 dark:bg-[#1f2937] rounded-md focus:outline-none"
          placeholder="Current password"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.oldPassword}
        />
        {formik.touched.oldPassword && formik.errors.oldPassword && (
          <p className="mt-1 text-xs text-red-500">{formik.errors.oldPassword}</p>
        )}
      </div>

      <div>
        <label htmlFor="newPassword" className="block mb-1 text-sm font-medium">
          New Password
        </label>
        <input
          type="password"
          id="newPassword"
          name="newPassword"
          className="w-full border p-2 dark:bg-[#1f2937] rounded-md focus:outline-none"
          placeholder="New password"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.newPassword}
        />
        {formik.touched.newPassword && formik.errors.newPassword && (
          <p className="mt-1 text-xs text-red-500">{formik.errors.newPassword}</p>
        )}
      </div>

      <div>
        <label htmlFor="confirmPassword" className="block mb-1 text-sm font-medium">
          Confirm New Password
        </label>
        <input
          type="password"
          id="confirmPassword"
          name="confirmPassword"
          className="w-full border p-2 dark:bg-[#1f2937] rounded-md focus:outline-none"
          placeholder="Confirm new password"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.confirmPassword}
        />
        {formik.touched.confirmPassword && formik.errors.confirmPassword && (
          <p className="mt-1 text-xs text-red-500">{formik.errors.confirmPassword}</p>
        )}
      </div>

      <button
        type="submit"
        className="w-full mt-4 th-btn style2 disabled:opacity-50"
      >
        {isLoading ? 'Updating...' : 'Change Password'}
      </button>
    </form>
  )
}