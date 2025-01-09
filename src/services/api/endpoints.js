import axios from "axios";

// Configuration
const BASE_URL = "https://pcb-design-5nqf.onrender.com";

// Create axios instance
const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 403) {
      // Handle CORS error
      console.error("CORS error:", error);
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  // Sample Request:
  // {
  //   "email": "test@gmail.com",
  //   "password": "Vas272152!"
  // }
  // Sample Response:
  // Returns JWT token on success
  login: async (credentials) => {
    try {
      const response = await axiosInstance.post("/auth/login/", credentials);
      console.log("in login", response);
      if (response?.data?.access && response?.data?.refresh) {
        localStorage.setItem("accessToken", response.data.access);
        localStorage.setItem("refreshToken", response.data.refresh);
      }
      return response.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Login failed. Please try again.";
      throw new Error(errorMessage);
    }
  },

  // Sample Request:
  // {
  //   "email": "testing2@emaple.com",
  //   "password": "xy1f2345",
  //   "password2": "xy1f2345",
  //   "role": "Approver"
  // }
  register: async (userData) => {
    try {
      const response = await axiosInstance.post("/auth/register/", userData);
      if (response?.access && response?.refresh) {
        localStorage.setItem("accessToken", response.access);
        localStorage.setItem("refreshToken", response.refresh);
      }
      return response.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "Registration failed. Please try again.";
      throw new Error(errorMessage);
    }
  },

  // No request body needed
  // Clears token on success
  logout: async () => {
    try {
      const refreshToken = localStorage.getItem("refreshToken");
      await axiosInstance.post("/auth/logout/", { refresh: refreshToken });
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
    }
  },

  // Sample Request:
  // {
  //   "email": "mahesh@gmail.com"
  // }
  requestPasswordReset: async (email) => {
    try {
      const response = await axiosInstance.post(
        "/right-draw/request-reset-password/",
        { email }
      );
      return response.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "Password reset request failed. Please try again.";
      throw new Error(errorMessage);
    }
  },

  // Sample Request:
  // {
  //   "password": "mahesh@15410",
  //   "token": "cj9wt2-b44c1ba96bbc3293ba17b59c7e2ae9c0",
  //   "uidb64": "MQ"
  // }
  resetPassword: async (resetData) => {
    try {
      const response = await axiosInstance.post(
        "/right-draw/reset-password/",
        resetData
      );
      return response.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "Password reset failed. Please try again.";
      throw new Error(errorMessage);
    }
  },
};

// PCB Specifications API
export const pcbAPI = {
  // Sample Response:
  // [
  //   {
  //     "category_id": 1,
  //     "category_name": "Dielectric Material Thickness",
  //     "subcategories": [
  //       {
  //         "id": 1,
  //         "name": "Alumina Ceramic",
  //         "is_section_groupings_exists": true,
  //         "is_sub_2_categories_exists": false
  //       }
  //     ]
  //   },
  //   ... additional categories
  // ]
  getSpecification: async (id) => {
    try {
      const response = await axiosInstance.get(
        `/right-draw/pcb-specification/${id}/`
      );
      return response.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to fetch PCB specifications.";
      throw new Error(errorMessage);
    }
  },

  // Sample Response:
  // [
  //   {
  //     "id": 1,
  //     "design_doc": "D3-E002",
  //     "design_name": "Common Sections",
  //     "rules": [
  //       {
  //         "id": 2,
  //         "created_at": "2025-01-07T09:16:16.234817Z",
  //         "updated_at": "2025-01-07T09:16:16.234817Z",
  //         "design_doc": "D3-E002",
  //         "rule_number": "4.1.2",
  //         "parameter": "Following PCB material OAK, TLX, TLY, PTFE/Woven Glass/Ceramic NH9350,Ceramic RO3003 are NOT recommended for SMT design",
  //         "min_value": 1,
  //         "max_value": 10,
  //         "nominal": 5,
  //         "comments": "",
  //         "created_by": 1,
  //         "updated_by": 1
  //       }
  //     ]
  //   }
  // ]
  getSectionGroupings: async (id) => {
    try {
      const response = await axiosInstance.get(
        `/right-draw/section-groupings/${id}/`
      );
      return response.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to fetch section groupings.";
      throw new Error(errorMessage);
    }
  },

  getSubCategoriesTwo: async (id) => {
    try {
      const response = await axiosInstance.get(
        `/right-draw/sub-categories-two/${id}/`
      );
      return response.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to fetch sub-categories.";
      throw new Error(errorMessage);
    }
  },
};

// Components API
export const componentsAPI = {
  // Sample Response:
  // [
  //   {
  //     "id": 1,
  //     "created_at": "2025-01-07T09:06:51.520198Z",
  //     "updated_at": "2025-01-07T09:06:51.520198Z",
  //     "component_name": "B14",
  //     "description": null,
  //     "created_by": 1,
  //     "updated_by": 1
  //   },
  //   {
  //     "id": 2,
  //     "created_at": "2025-01-07T10:20:05.692563Z",
  //     "updated_at": "2025-01-07T10:20:05.692563Z",
  //     "component_name": "F35",
  //     "description": null,
  //     "created_by": 1,
  //     "updated_by": 1
  //   }
  // ]
  getAll: async () => {
    try {
      const response = await axiosInstance.get("/masters/components/");
      return response.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to fetch components.";
      throw new Error(errorMessage);
    }
  },

  // Sample Response:
  // {
  //   "id": 2,
  //   "created_at": "2025-01-07T10:20:05.692563Z",
  //   "updated_at": "2025-01-07T10:20:05.692563Z",
  //   "component_name": "F35",
  //   "description": null,
  //   "created_by": 1,
  //   "updated_by": 1
  // }
  getById: async (id) => {
    try {
      const response = await axiosInstance.get(`/masters/components/${id}/`);
      return response.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        `Failed to fetch component with id ${id}.`;
      throw new Error(errorMessage);
    }
  },
};

// CAD Templates API
export const cadAPI = {
  getTemplates: async () => {
    try {
      const response = await axiosInstance.get(
        "/right-draw/cad_design-templates/"
      );
      return response.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to fetch CAD templates.";
      throw new Error(errorMessage);
    }
  },

  // Sample Request:
  // {
  //   "oppNumber": "123",
  //   "opuNumber": "123",
  //   "eduNumber": "123",
  //   "modelName": "cc",
  //   "partNumber": "112",
  //   "component": 1,
  //   "revisionNumber": 123,
  //   "componentSpecifications": {
  //     "1": "1",
  //     "2": "3",
  //     "3": "5"
  //   },
  //   "designOptions": ["1", "2"]
  // }
  createTemplate: async (templateData) => {
    try {
      const response = await axiosInstance.post(
        "/right-draw/cad_design-templates/",
        templateData
      );
      return response.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to create CAD template.";
      throw new Error(errorMessage);
    }
  },
};

// Request Types (TypeScript interfaces)
export const PayloadTypes = {
  Login: {
    email: "",
    password: "",
  },

  Register: {
    email: "",
    password: "",
    password2: "", // confirmation password
    role: "", // "Approver" or other roles
  },

  PasswordReset: {
    email: "",
  },

  ResetPassword: {
    password: "",
    token: "",
    uidb64: "",
  },

  CADTemplate: {
    oppNumber: "",
    opuNumber: "",
    eduNumber: "",
    modelName: "",
    partNumber: "",
    component: null, // component ID
    revisionNumber: null,
    componentSpecifications: {}, // key-value pairs of specifications
    designOptions: [], // array of design option IDs
  },

  PCBSpecification: {
    category_id: null,
    category_name: "",
    subcategories: [
      {
        id: null,
        name: "",
        is_section_groupings_exists: false,
        is_sub_2_categories_exists: false,
      },
    ],
  },

  Component: {
    id: null,
    created_at: "",
    updated_at: "",
    component_name: "",
    description: null,
    created_by: null,
    updated_by: null,
  },

  SectionGrouping: {
    id: null,
    design_doc: "",
    design_name: "",
    rules: [
      {
        id: null,
        created_at: "",
        updated_at: "",
        design_doc: "",
        rule_number: "",
        parameter: "",
        min_value: null,
        max_value: null,
        nominal: null,
        comments: "",
        created_by: null,
        updated_by: null,
      },
    ],
  },
};

// Error Handler
export const ErrorHandler = {
  handle: (error) => {
    if (error.response) {
      // Server responded with error
      return {
        status: error.response.status,
        message: error.response.message || "An error occurred",
        data: error.response,
      };
    } else if (error.request) {
      // Request made but no response
      return {
        status: 503,
        message: "Service unavailable",
        data: null,
      };
    }
    // Something else went wrong
    return {
      status: 500,
      message: error.message || "Unknown error occurred",
      data: null,
    };
  },
};
