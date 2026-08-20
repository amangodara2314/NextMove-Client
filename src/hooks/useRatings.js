import { useEffect, useState } from "react";
import { getUserRatings } from "../services/rating/ratingServices";
import { getErrorMessage, getResponseData } from "../utils/responseHelpers";

export default function useRatings() {
  const [ratings, setRatings] = useState([]);
  const [loadingRatings, setLoadingRatings] = useState(false);
  const [ratingsError, setRatingsError] = useState(null);

  const fetchRatings = async () => {
    try {
      setLoadingRatings(true);
      const response = await getUserRatings();
      const data = getResponseData(response);
      setRatings(data.ratings);
    } catch (error) {
      setRatingsError(getErrorMessage(error));
    } finally {
      setLoadingRatings(false);
    }
  };

  useEffect(() => {
    fetchRatings();
  }, []);

  return { ratings, loadingRatings, ratingsError, fetchRatings };
}
