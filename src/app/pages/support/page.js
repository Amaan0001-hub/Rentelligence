"use client";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addTicket, addTicketToList, getAllTicketBYURID } from "@/app/redux/slices/ticketSlice";
import { Formik, Form, Field, ErrorMessage } from "formik";
import toast from "react-hot-toast";
import TicketTable from "./ticket-table/page";
import * as Yup from "yup";
import { getEncryptedLocalData } from "@/app/api/auth";

const Support = () => {
  const dispatch = useDispatch();

  const { loading } = useSelector((state) => state.ticket);
  const [userId, setUserId] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const userId = getEncryptedLocalData("UserId");
    setUserId(userId);
  }, []);

  const validationSchema = Yup.object({
    ticketType: Yup.string().required("Ticket type is required"),
    subject: Yup.string()
      .required("Subject is required")
      .min(5, "Subject must be at least 5 characters")
      .max(100, "Subject must not exceed 100 characters"),
    message: Yup.string()
      .required("Message is required")
      .min(10, "Message must be at least 10 characters")
      .max(1000, "Message must not exceed 1000 characters"),
    image: Yup.mixed()
      .nullable() //
      .test("fileSize", "File size is too large", (value) => {
        if (!value) return true;
        return value.size <= 5 * 1024 * 1024;
      })
      .test("fileType", "Unsupported file type", (value) => {
        if (!value) return true;
        return ["image/jpeg", "image/png", "image/jpg"].includes(value.type);
      }),
  });
  const initialValues = {
    ticketType: "",
    subject: "",
    message: "",
    urid: userId || "",
    image: null,
  };

  const handleSubmit = async (values, { resetForm }) => {
    const data = new FormData();
    data.append("TicketType", values.ticketType);
    data.append("Subject", values.subject);
    data.append("Message", values.message);
    data.append("Seen", 1);
    data.append("URID", values.urid);
    if (values.image) {
      data.append("ImagePath", values.image);
    }

    try {
      const result = await dispatch(addTicket(data)).unwrap();
      if (result.statusCode === 200) {
        toast.success(result.message);
        // Add the new ticket to the list if data exists, otherwise refresh
        if (result.data) {
          dispatch(addTicketToList(result.data));
        } else {
          await dispatch(getAllTicketBYURID(userId));
        }
        setIsSuccess(true);
        setShowForm(false);
        resetForm();
      } else {
        toast.error(result.message);
      }
    } catch (err) {
      console.error("Failed to submit ticket:", err);
    }
  };

  return (
    <>
      {!showForm && (
        <div className="flex items-center justify-center mt-5">
          <button
            className="th-btn style2 "
            style={{ width: "200px" }}
            onClick={() => setShowForm(true)}
          >
            Create Ticket
          </button>
        </div>
      )}
      <div className="min-h-screen px-4 pt-5 pb-12 sm:px-6 lg:px-8">
        {showForm && (
          // <div className="max-w-4xl mx-auto rounded-xl shadow-lg border dark:border-[#ffffff] overflow-hidden p-6">
          <div className="max-w-4xl mx-auto rounded-xl shadow-lg border dark:border-[#ffffff] overflow-hidden p-6 relative">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="absolute top-4 right-4 flex items-center justify-center w-9 h-9 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-700 transition-all duration-200 shadow-sm dark:bg-[#2d3748] dark:hover:bg-[#4a5568] dark:text-gray-200"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ setFieldValue, values }) => (
                <Form className="space-y-6">
                  <h1 className="text-xl font-semibold text-center text-gray-600 dark:text-white">
                    Create Support Ticket
                  </h1>

                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div>
                      <label
                        htmlFor="ticketType"
                        className="block text-sm font-semibold text-gray-600 dark:text-white"
                      >
                        Ticket Type
                      </label>
                      <Field
                        as="select"
                        id="ticketType"
                        name="ticketType"
                        className={`mt-1 block w-full pl-3 pr-10 py-3 dark:text-white text-base dark:bg-[#1f2937] border-gray-300 focus:outline-none focus:ring-black-500 focus:border-black-500 sm:text-sm rounded-md border`}
                      >
                        <option value="">Select Ticket Type</option>
                        <option value="Payment">Payment</option>
                        <option value="Agents">Agents</option>
                        <option value="General">General Inquiry</option>
                      </Field>
                      <ErrorMessage
                        name="ticketType"
                        component="div"
                        className="mt-1 text-sm text-red-500"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="subject"
                        className="block text-sm font-semibold text-gray-600 dark:text-white"
                      >
                        Subject
                      </label>
                      <Field
                        type="text"
                        id="subject"
                        name="subject"
                        className={`mt-1 focus:outline-none dark:bg-[#1f2937] dark:text-white text-base block w-full shadow-sm sm:text-sm border-gray-300 rounded-md border p-2.5`}
                      />
                      <ErrorMessage
                        name="subject"
                        component="div"
                        className="mt-1 text-sm text-red-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div>
                      <label
                        htmlFor="message"
                        className="block text-sm font-semibold text-gray-600 dark:text-white"
                      >
                        Message
                      </label>
                      <Field
                        as="textarea"
                        id="message"
                        name="message"
                        rows={4}
                        className={`mt-1 block focus:outline-none dark:bg-[#1f2937] dark:text-white text-gray-600 w-full shadow-sm sm:text-sm border-gray-300 rounded-md border p-2`}
                      />
                      <ErrorMessage
                        name="message"
                        component="div"
                        className="mt-1 text-sm text-red-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-600 dark:text-white">
                        Attachment
                      </label>
                      <div className="flex flex-col mt-1">
                        <label
                          className={`w-full flex flex-col dark:bg-[#1f2937] dark:text-white text-base items-center px-4 py-6 bg-white text-blue rounded-lg tracking-wide uppercase border cursor-pointer hover:bg-gray-50`}
                        >
                          <svg
                            className="w-8 h-8"
                            fill="currentColor"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                          >
                            <path d="M16.88 9.1A4 4 0 0 1 16 17H5a5 5 0 0 1-1-9.9V7a3 3 0 0 1 4.52-2.59A4.98 4.98 0 0 1 17 8c0 .38-.04.74-.12 1.1zM11 11h3l-4-4-4 4h3v3h2v-3z" />
                          </svg>
                          <span className="mt-2 leading-normal text-gray-600 dark:text-white">
                            {values.image
                              ? values.image.name
                              : "Choose an image file"}
                          </span>
                          <input
                            type="file"
                            name="image"
                            accept="image/jpeg,image/png,image/jpg"
                            className="hidden"
                            onChange={(event) => {
                              setFieldValue(
                                "image",
                                event.currentTarget.files[0]
                              );
                            }}
                          />
                        </label>
                        <ErrorMessage
                          name="image"
                          component="div"
                          className="mt-1 text-sm text-red-500"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between max-w-[200px]">
                    <button
                      type="submit"
                      disabled={loading}
                      className={`px-4 py-2 border w-full th-btn style2 cursor-pointer  focus:outline-none  ${
                        loading ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                    >
                      {loading ? "Submitting..." : "Generate Ticket"}
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        )}

        <TicketTable />
      </div>
    </>
  );
};

export default Support;
