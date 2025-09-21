import { toast } from "sonner";

/**
 * Utility functions for consistent toast notifications
 */

export const showSuccessToast = (title, description, duration = 3000) => {
  toast.success(title, {
    description,
    duration,
  });
};

export const showErrorToast = (title, description, duration = 5000) => {
  toast.error(title, {
    description,
    duration,
  });
};

export const showInfoToast = (title, description, duration = 3000) => {
  toast.info(title, {
    description,
    duration,
  });
};

export const showWarningToast = (title, description, duration = 4000) => {
  toast.warning(title, {
    description,
    duration,
  });
};

// Specific toast messages for common actions
export const toastMessages = {
  create: {
    category: {
      success: {
        title: "Create category",
        description: "Category has been successfully created.",
      },
      error: {
        title: "Failed to create category",
        description: "Please try again.",
      },
    },
    article: {
      success: {
        title: "Create article",
        description: "Article has been successfully created.",
      },
      error: {
        title: "Failed to create article",
        description: "Please try again.",
      },
    },
  },
  update: {
    category: {
      success: {
        title: "Update category",
        description: "Category has been successfully updated.",
      },
      error: {
        title: "Failed to update category",
        description: "Please try again.",
      },
    },
    article: {
      success: {
        title: "Update article",
        description: "Article has been successfully updated.",
      },
      error: {
        title: "Failed to update article",
        description: "Please try again.",
      },
    },
  },
  delete: {
    category: {
      success: {
        title: "Delete category",
        description: "Category has been successfully deleted.",
      },
      error: {
        title: "Failed to delete category",
        description: "Please try again.",
      },
    },
    article: {
      success: {
        title: "Delete article",
        description: "Article has been successfully deleted.",
      },
      error: {
        title: "Failed to delete article",
        description: "Please try again.",
      },
    },
  },
  auth: {
    loginSuccess: {
      title: "Login successful!",
      description: "Welcome back!",
    },
    adminLoginSuccess: {
      title: "Login successful!",
      description: "Welcome to admin panel",
    },
    loginError: {
      title: "Invalid email or password",
      description: "Please try another password or email",
    },
    signupSuccess: {
      title: "Account created successfully!",
      description: "Welcome to our platform!",
    },
  },
};
