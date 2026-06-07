const getResponseData = (response) => response.data.data;

const getErrorMessage = (error) =>
  error?.response?.data?.data || "Something went wrong";

export { getResponseData, getErrorMessage };
