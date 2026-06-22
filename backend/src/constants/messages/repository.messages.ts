
export const REPOSITORY_MESSAGES = {
  SAVE_ERROR: "Database error while saving document",
  FIND_ALL_ERROR: "Database error while fetching documents",
  FIND_BY_ID_ERROR: "Database error while fetching document",
  CREATE_ERROR: "Database error while creating document",
  UPDATE_ERROR: "Database error while updating document",
  DELETE_ERROR: "Database error while deleting document",
  FIND_ONE_ERROR: "Database error while fetching document",
  RECORD_NOT_FOUND: "Record not found",
  
  UNKNOWN_SAVE_ERROR: "Unknown database error occurred while saving document",
  UNKNOWN_CREATE_ERROR: "Unknown database error occurred while creating document",
  UNKNOWN_FIND_BY_ID_ERROR: "Unknown database error occurred while fetching document by id",
  UNKNOWN_FIND_ALL_ERROR: "Unknown database error occurred while fetching documents",
  UNKNOWN_FIND_ONE_ERROR: "Unknown database error occurred while finding document",
  UNKNOWN_UPDATE_ERROR: "Unknown database error occurred while updating document",
  UNKNOWN_DELETE_ERROR: "Unknown database error occurred while deleting document",
  
  FIND_USER_BY_EMAIL_ERROR: "Database error while finding user by email",
  VERIFY_USER_ERROR: "Database error while verifying user",
  UPDATE_USER_PASSWORD_ERROR: "Database error while updating user password",
  UNKNOWN_ERROR: "Unknown database error occurred",
} as const;