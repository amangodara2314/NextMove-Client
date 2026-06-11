const getResponseData = (response) => response.data.data;

const getErrorMessage = (error) =>
  error?.response?.data?.message || "Something went wrong";

export { getResponseData, getErrorMessage };
