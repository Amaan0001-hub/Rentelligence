
import axios from "axios";
import Cookies from "js-cookie";
import { BASE_URL } from "@/app/constants/constant";
import { decryptData, encryptData } from "../utils/encryption";


export const getEncryptedLocalData = (key) => {
  const encryptedData =localStorage.getItem(key);
  return encryptedData ? decryptData(encryptedData) : null;
};

export const doLogin = (data) => {
  if (data?.data === undefined) return false;
  const userData = data.data;
  const userId = userData?.URID;
  const emailId = userData?.Email;
  const lastName = userData.LName;
 localStorage.setItem("emailId", encryptData(emailId));
 localStorage.setItem("LName", encryptData(lastName));

  if (userId) {
    setUserId(userId);
  }

  return true;
};

export const getEmailId = () => {
  if (typeof window !== "undefined") {
    return getEncryptedLocalData("emailId");
  }
};

export const AuthLogin = () => {
  const authLogin = getEncryptedLocalData("AuthLogin");
  return authLogin;
};

export const doLogout = () => {
 localStorage?.clear();
  Cookies?.remove("token");
};

export const setToken = (token) => {
  if (token && typeof window !== "undefined") {
    Cookies.set("token", token, {
      expires: 7,
      secure: true,
      sameSite: "Strict",
    });
  }
};

export const getToken = () => {
  const token = Cookies.get("token");
  return token ? token : null;
};

export const setUserId = (UserId) => {
  if (UserId && typeof window !== "undefined") {
   localStorage.setItem("UserId", encryptData(UserId));
  }
};

export const setCookie = (name, value, options = {}) => {
  const defaultOptions = {
    expires: 7,
    path: "/",
    ...options,
  };
  if (typeof window !== "undefined") {
    Cookies.set(name, value, defaultOptions);
  }
};

export const getCookie = (name) => {
  return Cookies.get(name);
};

export const removeCookie = (name) => {
  Cookies.remove(name);
};

export const setCookies = (
  categoryId,
  subCategoryId = null,
  subCategoryTypeId = null
) => {
  if (categoryId) {
    setCookie("categoryId", categoryId);
  }

  if (subCategoryId) {
    setCookie("subCategoryId", subCategoryId);
  } else {
    removeCookie("subCategoryId");
  }

  if (subCategoryTypeId) {
    setCookie("subCategoryTypeId", subCategoryTypeId);
  } else {
    removeCookie("subCategoryTypeId");
  }
};

export const setUserDetails = (user) => {
  if (user && typeof window !== "undefined") {
    // Store only userId in cookies
    if (user.Id) {
      Cookies.set("userId", user.Id, {
        expires: 7,
        secure: true,
        sameSite: "Strict",
      });
    }
  
  }
};
export const getUserId = () => {
  if (typeof window !== "undefined") {
    const userId =  getEncryptedLocalData("UserId");
    return userId ? userId : null;
  }
  return null;
};

export const getRequest = async (endpoint) => {
  try {
    const response = await axios.get(`${BASE_URL}${endpoint}`);
    return response.data;
  } catch (error) {
    console.error(" API Call Failed:", error);
    throw error;
  }
};

export const postRequestWithLoginId = async (endpoint, data) => {
  try {
    const response = await axios.post(`${BASE_URL}${endpoint}`);
    return response.data;
  } catch (error) {
    console.error(" API Call Failed:", error);
    throw error;
  }
};

export const getRequestURId = async (endpoint) => {
  try {
    const token = getToken();
    if (!token) {
      throw new Error("No token found");
    }

    const response = await axios.get(
      `${BASE_URL}${endpoint}?URID=${getUserId()}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error(" API Call Failed:", error);
    throw error;
  }
};
export const postRequestURId = async (endpoint) => {
  try {
    const token = getToken();
    if (!token) {
      throw new Error("No token found");
    }

    const response = await axios.post(
      `${BASE_URL}${endpoint}?URID=${getUserId()}`,
      "", // empty body as per your curl command
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "*/*",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("API Call Failed:", error);
    throw error;
  }
};

export const getRequestUserId = async (endpoint) => {
  try {
    const token = getToken();
    if (!token) {
      throw new Error("No token found");
    }

    const response = await axios.get(
      `${BASE_URL}${endpoint}?userId=${getUserId()}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error(" API Call Failed:", error);
    throw error;
  }
};

export const getRequestWithToken = async (endpoint) => {
  try {
    const token = getToken();
    if (!token) {
      throw new Error("No token found");
    }

    const response = await axios.get(`${BASE_URL}${endpoint}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error(" API Call Failed:", error);
    throw error;
  }
};

export const postCreate = async (endpoint, data) => {
  const dataWithCreatedBy = {
    ...data,
    createdBy: getUserId(),
  };

  const response = await axios.post(
    `${BASE_URL}${endpoint}`,
    dataWithCreatedBy
  );

  return response.data;
};

export const postCreateWithUpdatedBy = async (endpoint, data) => {
  const token = getToken();

  if (!token) {
    throw new Error("No token found");
  }

  const dataWithCreatedBy = {
    ...data,
    updatedBy: getUserId(),
  };

  const response = await axios.post(
    `${BASE_URL}${endpoint}`,
    dataWithCreatedBy,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

export const postCreateWithUserId = async (endpoint, data) => {
  const userId = getUserId();
  const dataWithCreatedBy = {
    ...data,
    userId,
    createdBy: getUserId(),
  };

  const response = await axios.post(
    `${BASE_URL}${endpoint}`,
    dataWithCreatedBy
  );
  return response.data;
};

export const postCreateWithUserIdAndToken = async (endpoint, data) => {
  const token = getToken();
  const userId = getUserId();
  const dataWithCreatedBy = {
    ...data,
    userId,
    createdBy: getUserId(),
  };

  const headers = token ? { Authorization: `Bearer ${token}` } : {};

  const response = await axios.post(
    `${BASE_URL}${endpoint}`,
    dataWithCreatedBy,
    {
      headers,
    }
  );
  return response.data;
};

export const postRequest = async (endpoint) => {
  try {
    const response = await axios.post(`${BASE_URL}${endpoint}`);
    return response.data;
  } catch (error) {
    console.error(" API Call Failed:", error);
    throw error;
  }
};

export const postRequestWithData = async (endpoint, data) => {
  try {
    const response = await axios.post(`${BASE_URL}${endpoint}`, data);
    return response.data;
  } catch (error) {
    console.error(" API Call Failed:", error);
    throw error;
  }
};

export const postRequestWithParams = async (endpoint, data) => {
  try {
    const response = await axios.post(
      `${BASE_URL}${endpoint}?age=${data.age}&name=${data.name}&gender=${data.gender}&skintype=${data.skintype}&skinSensitive=${data.skinSensitive}}`
    );
    return response.data;
  } catch (error) {
    console.error(" API Call Failed:", error);
    throw error;
  }
};

export const postRequestWithToken = async (endpoint, data) => {
  try {
    const token = getToken();
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const response = await axios.post(`${BASE_URL}${endpoint}`, data, {
      headers,
    });

    return response.data;
  } catch (error) {
    console.error(" API Call Failed:", error);
    throw error;
  }
};

export const postformRequest = async (endpoint, data) => {
  try {
    const token = getToken();
    const headers = {
      Authorization: token ? `Bearer ${token}` : "",
      "Content-Type": "multipart/form-data",
    };

    const response = await axios.post(`${BASE_URL}${endpoint}`, data, {
      headers,
    });

    return response.data;
  } catch (error) {
    console.error("API Call Failed:", error);
    throw error;
  }
};

// auth/sha256Validator.js

// auth/sha256Validator.js

export function isValidSHA256Format(input) {
  // Must be exactly 64 hex characters
  const sha256Regex = /^[a-f0-9]{64}$/i;
  return sha256Regex.test(input);
}

export const postImageWithParams = async (endpoint, data, imageFile) => {
  const token = getToken();
  if (!token) throw new Error("No token found");

  // 🔹 1. Create FormData (only for image)
  const formData = new FormData();
  if (imageFile) {
    formData.append("profileImage", imageFile); // 🔸 Must match backend key
  }

  // 🔹 2. Prepare query params
  const queryParams = {
    ...data, // like name, email, sellerId, etc.
  };

  // 🔹 3. Make API call
  const response = await axios.post(`${BASE_URL}${endpoint}`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
    params: queryParams, // 👈 text data sent in URL
  });

  return response.data;
};

// 🔹 API helper for adding a ticket reply
export const addTicketReplyApi = async (endpoint,{ ticketId, createdBy, message, status = 1, seen = 1, imageFile }) => {
  try {
    const token = getToken();

    // ✅ Build FormData
    const formData = new FormData();
    if (imageFile) {
      formData.append("ImagePath", imageFile);
    } else {
      formData.append("ImagePath", "");
    }

    // ✅ Build full URL
    const url = `${BASE_URL}${endpoint}?TicketId=${ticketId}&CreatedBy=${createdBy}&Message=${encodeURIComponent(
      message
    )}&Status=${status}&Seen=${seen}`;

    // ✅ Axios POST with token & form data
    const response = await axios.post(url, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });

    return response.data;
  } catch (error) {
    // Throw formatted error for thunk to handle
    throw new Error(error.response?.data?.message || error.message || "Something went wrong");
  }
};


